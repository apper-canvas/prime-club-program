// Initialize ApperClient for analytics operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Helper function to get date ranges
const getDateRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return {
        start: yesterday,
        end: today
      };
    case 'week':
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start: weekStart,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'month':
      const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return {
        start: monthStart,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    default:
      return {
        start: new Date(0),
        end: new Date()
      };
  }
};


export const getLeadsAnalytics = async (period = 'all', userId = 'all') => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    // Build where conditions based on period and user filters
    const whereConditions = [];
    
    // Add user filter if specified
    if (userId !== 'all') {
      whereConditions.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [parseInt(userId)]
      });
    }
    
    // Add date filter based on period
    if (period !== 'all') {
      const dateFilter = getDateFilterForPeriod(period);
      if (dateFilter) {
        whereConditions.push(dateFilter);
      }
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "added_by_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: whereConditions,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return { leads: [], totalCount: 0 };
    }
    
    // Transform data to match expected format
    const transformedLeads = response.data.map(lead => ({
      Id: lead.Id,
      websiteUrl: lead.website_url_c || '',
      category: lead.category_c || '',
      status: lead.status_c || '',
      addedBy: lead.added_by_c || 0,
      addedByName: lead.added_by_c?.Name || 'Unknown',
      createdAt: lead.created_at_c || lead.CreatedOn
    }));
    
    return {
      leads: transformedLeads,
      totalCount: transformedLeads.length
    };
  } catch (error) {
    console.error("Error fetching leads analytics:", error?.response?.data?.message || error.message);
    return { leads: [], totalCount: 0 };
  }
};

export const getDailyLeadsChart = async (userId = 'all', days = 30) => {
  await delay(400);
  
  try {
    const apperClient = getApperClient();
    const now = new Date();
    const chartData = [];
    
    // Generate data for the last X days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const whereConditions = [
        {
          FieldName: "created_at_c",
          Operator: "ExactMatch",
          SubOperator: "Day",
          Values: [date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })]
        }
      ];
      
      if (userId !== 'all') {
        whereConditions.push({
          FieldName: "added_by_c",
          Operator: "EqualTo",
          Values: [parseInt(userId)]
        });
      }
      
      const params = {
        fields: [{ field: { Name: "Id" } }],
        where: whereConditions
      };
      
      const response = await apperClient.fetchRecords("lead_c", params);
      const count = response.success ? response.data.length : 0;
      
      chartData.push({
        date: dateStr,
        count: count,
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return {
      chartData,
      categories: chartData.map(item => item.formattedDate),
      series: [
        {
          name: 'New Leads',
          data: chartData.map(item => item.count)
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching daily leads chart:", error?.response?.data?.message || error.message);
    // Return fallback data
    const chartData = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      chartData.push({
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 10),
        formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return {
      chartData,
      categories: chartData.map(item => item.formattedDate),
      series: [{ name: 'New Leads', data: chartData.map(item => item.count) }]
    };
  }
};

export const getLeadsMetrics = async (userId = 'all') => {
  await delay(250);
  
  try {
    const periods = ['today', 'yesterday', 'week', 'month'];
    const metrics = {};
    
    for (const period of periods) {
      const analytics = await getLeadsAnalytics(period, userId);
      metrics[period] = {
        count: analytics.totalCount,
        label: period.charAt(0).toUpperCase() + period.slice(1)
      };
    }
    
    // Calculate trend
    const todayCount = metrics.today.count;
    const yesterdayCount = metrics.yesterday.count;
    const todayTrend = yesterdayCount === 0 ? 100 : 
      Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);
    
    metrics.today.trend = todayTrend;
    
    // Get distribution data
    const allAnalytics = await getLeadsAnalytics('all', userId);
    const statusDistribution = {};
    const categoryDistribution = {};
    
    allAnalytics.leads.forEach(lead => {
      statusDistribution[lead.status] = (statusDistribution[lead.status] || 0) + 1;
      categoryDistribution[lead.category] = (categoryDistribution[lead.category] || 0) + 1;
    });
    
    return {
      metrics,
      statusDistribution,
      categoryDistribution,
      totalLeads: allAnalytics.totalCount
    };
  } catch (error) {
    console.error("Error fetching leads metrics:", error?.response?.data?.message || error.message);
    return {
      metrics: {
        today: { count: 0, trend: 0, label: 'Today' },
        yesterday: { count: 0, label: 'Yesterday' },
        week: { count: 0, label: 'This Week' },
        month: { count: 0, label: 'This Month' }
      },
      statusDistribution: {},
      categoryDistribution: {},
      totalLeads: 0
    };
  }
};

export const getUserPerformance = async () => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    // Fetch sales reps
    const repsParams = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "leads_contacted_c" } },
        { field: { Name: "meetings_booked_c" } },
        { field: { Name: "deals_closed_c" } },
        { field: { Name: "total_revenue_c" } }
      ]
    };
    
    const repsResponse = await apperClient.fetchRecords("sales_rep_c", repsParams);
    
    if (!repsResponse.success) {
      console.error(repsResponse.message);
      return [];
    }
    
    const userStats = [];
    
    for (const rep of repsResponse.data) {
      // Get lead counts for this rep
      const todayAnalytics = await getLeadsAnalytics('today', rep.Id.toString());
      const weekAnalytics = await getLeadsAnalytics('week', rep.Id.toString());
      const monthAnalytics = await getLeadsAnalytics('month', rep.Id.toString());
      const allAnalytics = await getLeadsAnalytics('all', rep.Id.toString());
      
      userStats.push({
        Id: rep.Id,
        name: rep.Name || 'Unknown',
        totalLeads: allAnalytics.totalCount,
        todayLeads: todayAnalytics.totalCount,
        weekLeads: weekAnalytics.totalCount,
        monthLeads: monthAnalytics.totalCount,
        conversionRate: rep.meetings_booked_c > 0 ? 
          Math.round((rep.deals_closed_c / rep.meetings_booked_c) * 100) : 0
      });
    }
    
    return userStats.sort((a, b) => b.totalLeads - a.totalLeads);
  } catch (error) {
    console.error("Error fetching user performance:", error?.response?.data?.message || error.message);
    return [];
  }
};

// Helper function to get date filter for different periods
const getDateFilterForPeriod = (period) => {
  switch (period) {
    case 'today':
      return {
        FieldName: "created_at_c",
        Operator: "RelativeMatch",
        Values: ["Today"]
      };
    case 'yesterday':
      return {
        FieldName: "created_at_c",
        Operator: "RelativeMatch",
        Values: ["Yesterday"]
      };
    case 'week':
      return {
        FieldName: "created_at_c",
        Operator: "RelativeMatch",
        Values: ["this week"]
      };
    case 'month':
      return {
        FieldName: "created_at_c",
        Operator: "RelativeMatch",
        Values: ["this month"]
      };
    default:
      return null;
  }
};