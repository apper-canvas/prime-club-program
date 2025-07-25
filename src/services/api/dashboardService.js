// Dashboard Service - Centralized data management for dashboard components
// Initialize ApperClient for dashboard operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};
// Standardized API delay for consistent UX
const API_DELAY = 300;

// Helper function to simulate API calls with consistent delay
const simulateAPICall = (delay = API_DELAY) => 
  new Promise(resolve => setTimeout(resolve, delay));

// Helper function to safely access external services
const safeServiceCall = async (serviceCall, fallback = null) => {
  try {
    return await serviceCall();
  } catch (error) {
    console.warn('Service call failed, using fallback:', error.message);
    return fallback;
  }
};

// Helper function to get current date with consistent timezone handling
const getCurrentDate = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Helper function to calculate date ranges
const getDateRange = (period) => {
  const today = getCurrentDate();
  
  switch (period) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'yesterday':
      return {
        start: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        end: today
      };
    case 'week':
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      return {
        start: weekStart,
        end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)
      };
    case 'month':
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 1)
      };
    default:
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
  }
};

// Helper function to validate and sanitize user input
const validateUserId = (userId) => {
  if (typeof userId === 'string') {
    const parsed = parseInt(userId, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return typeof userId === 'number' ? userId : null;
};

// Core dashboard metrics from static data
export const getDashboardMetrics = async () => {
  await simulateAPICall();
  
  try {
    const apperClient = getApperClient();
    
    // Get total leads contacted
    const leadsResponse = await apperClient.fetchRecords("lead_c", {
      fields: [{ field: { Name: "Id" } }]
    });
    
    // Get total meetings from deals
    const meetingsResponse = await apperClient.fetchRecords("deal_c", {
      fields: [{ field: { Name: "Id" } }],
      where: [{ FieldName: "stage_c", Operator: "Contains", Values: ["Meeting"] }]
    });
    
    // Get closed deals
    const closedDealsResponse = await apperClient.fetchRecords("deal_c", {
      fields: [{ field: { Name: "Id" } }],
      where: [{ FieldName: "stage_c", Operator: "EqualTo", Values: ["Closed"] }]
    });
    
    const totalLeads = leadsResponse.success ? leadsResponse.data.length : 0;
    const totalMeetings = meetingsResponse.success ? meetingsResponse.data.length : 0;
    const totalDeals = closedDealsResponse.success ? closedDealsResponse.data.length : 0;
    const conversionRate = totalLeads > 0 ? ((totalDeals / totalLeads) * 100).toFixed(1) : 0;
    
    return [
      {
        id: 1,
        title: "Total Leads Contacted",
        value: totalLeads.toString(),
        icon: "Users",
        trend: "up",
        trendValue: "12%",
        color: "primary"
      },
      {
        id: 2,
        title: "Meetings Booked",
        value: totalMeetings.toString(),
        icon: "Calendar",
        trend: "up",
        trendValue: "8%",
        color: "success"
      },
      {
        id: 3,
        title: "Deals Closed",
        value: totalDeals.toString(),
        icon: "TrendingUp",
        trend: "up",
        trendValue: "15%",
        color: "warning"
      },
      {
        id: 4,
        title: "Conversion Rate",
        value: `${conversionRate}%`,
        icon: "Target",
        trend: "up",
        trendValue: "2%",
        color: "info"
      }
    ];
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error?.response?.data?.message || error.message);
    // Return fallback metrics
    return [
      { id: 1, title: "Total Leads Contacted", value: "0", icon: "Users", trend: "neutral", trendValue: "0%", color: "primary" },
      { id: 2, title: "Meetings Booked", value: "0", icon: "Calendar", trend: "neutral", trendValue: "0%", color: "success" },
      { id: 3, title: "Deals Closed", value: "0", icon: "TrendingUp", trend: "neutral", trendValue: "0%", color: "warning" },
      { id: 4, title: "Conversion Rate", value: "0%", icon: "Target", trend: "neutral", trendValue: "0%", color: "info" }
    ];
  }
};

// Recent activity from leads and deals
export const getRecentActivity = async () => {
  await simulateAPICall();
  
  try {
    const apperClient = getApperClient();
    
    // Get recent leads
    const leadsResponse = await apperClient.fetchRecords("lead_c", {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "created_at_c" } }
      ],
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }],
      pagingInfo: { limit: 5, offset: 0 }
    });
    
    // Get recent deals
    const dealsResponse = await apperClient.fetchRecords("deal_c", {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "value_c" } },
        { field: { Name: "stage_c" } },
        { field: { Name: "created_at_c" } }
      ],
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }],
      pagingInfo: { limit: 5, offset: 0 }
    });
    
    const activities = [];
    
    if (leadsResponse.success) {
      leadsResponse.data.forEach(lead => {
        activities.push({
          id: `lead-${lead.Id}`,
          title: `New lead: ${lead.website_url_c || lead.Name}`,
          type: "contact",
          time: lead.created_at_c ? new Date(lead.created_at_c).toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: true 
          }) : 'Unknown time'
        });
      });
    }
    
    if (dealsResponse.success) {
      dealsResponse.data.forEach(deal => {
        activities.push({
          id: `deal-${deal.Id}`,
          title: `Deal ${deal.stage_c}: ${deal.Name} - $${deal.value_c || 0}`,
          type: deal.stage_c === 'Closed' ? "deal" : "meeting",
          time: deal.created_at_c ? new Date(deal.created_at_c).toLocaleTimeString('en-US', { 
            hour: '2-digit', minute: '2-digit', hour12: true 
          }) : 'Unknown time'
        });
      });
    }
    
    return activities
      .sort((a, b) => {
        // Sort by time, newest first
        const timeA = new Date(a.time).getTime();
        const timeB = new Date(b.time).getTime();
        return timeB - timeA;
      })
      .slice(0, 10);
      
  } catch (error) {
    console.error("Error fetching recent activity:", error?.response?.data?.message || error.message);
    return [
      { id: 1, title: "No recent activity", type: "general", time: "N/A" }
    ];
  }
};

// Today's meetings from deals
export const getTodaysMeetings = async () => {
  await simulateAPICall();
  
  try {
    const apperClient = getApperClient();
    
    const response = await apperClient.fetchRecords("deal_c", {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "lead_name_c" } },
        { field: { Name: "stage_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: [
        { FieldName: "stage_c", Operator: "Contains", Values: ["Meeting"] },
        { FieldName: "created_at_c", Operator: "RelativeMatch", Values: ["Today"] }
      ]
    });
    
    if (!response.success) {
      return [];
    }
    
    return response.data.map(deal => ({
      id: deal.Id,
      title: `${deal.stage_c} - ${deal.lead_name_c || deal.Name}`,
      time: new Date(deal.created_at_c).toLocaleTimeString('en-US', { 
        hour: '2-digit', minute: '2-digit', hour12: true 
      }),
      duration: "30 min",
      type: deal.stage_c.toLowerCase().includes('booked') ? 'demo' : 'followup',
      client: deal.lead_name_c || deal.Name
    }));
    
  } catch (error) {
    console.error("Error fetching today's meetings:", error?.response?.data?.message || error.message);
    return [];
  }
};

// Pending follow-ups from leads service
export const getPendingFollowUps = async () => {
  await simulateAPICall();
  
  const fallback = [];
  return safeServiceCall(async () => {
    const { getPendingFollowUps } = await import("@/services/api/leadsService");
    const followUps = await getPendingFollowUps();
    
    if (!Array.isArray(followUps)) {
      return fallback;
    }
    
    return followUps.map(followUp => ({
      ...followUp,
      Id: followUp.Id || Math.random(),
      websiteUrl: followUp.website_url_c || followUp.websiteUrl || 'Unknown URL',
      category: followUp.category_c || followUp.category || 'General',
      followUpDate: followUp.follow_up_date_c || followUp.followUpDate || new Date().toISOString()
    }));
  }, fallback);
};

// Lead performance chart data
export const getLeadPerformanceChart = async () => {
  await simulateAPICall();
  
  const fallback = {
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    series: [{ name: 'Leads', data: [12, 19, 15, 27, 22, 31, 28] }]
  };
  
  return safeServiceCall(async () => {
    const { getDailyLeadsChart } = await import("@/services/api/analyticsService");
    const chartData = await getDailyLeadsChart('all', 14);
    
    if (!chartData || !chartData.categories || !chartData.series) {
      return fallback;
    }
    
    return {
      categories: chartData.categories,
      series: chartData.series.map(series => ({
        name: series.name || 'Leads',
        data: Array.isArray(series.data) ? series.data : []
      }))
    };
  }, fallback);
};

// Sales funnel analysis
export const getSalesFunnelAnalysis = async () => {
  await simulateAPICall();
  
  const fallback = {
    categories: ['Leads', 'Connected', 'Meetings', 'Closed'],
    series: [{ name: 'Conversion Rate', data: [100, 25, 12, 8] }]
  };
  
  return safeServiceCall(async () => {
    const { getLeadsAnalytics } = await import("@/services/api/analyticsService");
    const analyticsData = await getLeadsAnalytics('all', 'all');
    
    if (!analyticsData?.leads || !Array.isArray(analyticsData.leads)) {
      return fallback;
    }
    
    const totalLeads = analyticsData.leads.length;
    if (totalLeads === 0) {
      return fallback;
    }
    
    const statusCounts = analyticsData.leads.reduce((acc, lead) => {
      const status = lead.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    const funnelStages = [
      { name: 'Leads', count: totalLeads },
      { name: 'Connected', count: statusCounts['Connected'] || 0 },
      { name: 'Meetings', count: statusCounts['Meeting Booked'] || 0 },
      { name: 'Closed', count: statusCounts['Meeting Done'] || 0 }
    ];
    
    return {
      categories: funnelStages.map(stage => stage.name),
      series: [{
        name: 'Conversion Rate',
        data: funnelStages.map(stage => 
          Math.round((stage.count / totalLeads) * 100)
        )
      }]
    };
  }, fallback);
};

// Team performance rankings
export const getTeamPerformanceRankings = async () => {
  await simulateAPICall();
  
  const fallback = [
    { Id: 1, name: 'Demo User 1', totalLeads: 25, weekLeads: 5, todayLeads: 2 },
    { Id: 2, name: 'Demo User 2', totalLeads: 18, weekLeads: 3, todayLeads: 1 }
  ];
  
  return safeServiceCall(async () => {
    const { getUserPerformance } = await import("@/services/api/analyticsService");
    const performanceData = await getUserPerformance();
    
    if (!Array.isArray(performanceData)) {
      return fallback;
    }
    
    return performanceData
      .map(rep => ({
        Id: rep.Id || Math.random(),
        name: rep.name || 'Unknown Rep',
        totalLeads: rep.totalLeads || 0,
        weekLeads: rep.weekLeads || 0,
        todayLeads: rep.todayLeads || 0
      }))
      .sort((a, b) => b.totalLeads - a.totalLeads);
  }, fallback);
};

// Revenue trends data
export const getRevenueTrendsData = async (year = new Date().getFullYear()) => {
  await simulateAPICall();
  
  const fallback = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [{ name: 'Monthly Revenue', data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 58000, 63000, 69000, 74000, 81000] }]
  };
  
  return safeServiceCall(async () => {
    const apperClient = getApperClient();
    
    // Get deals data for revenue calculation
    const response = await apperClient.fetchRecords("deal_c", {
      fields: [
        { field: { Name: "value_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: [
        { FieldName: "created_at_c", Operator: "ExactMatch", SubOperator: "Year", Values: [year.toString()] }
      ]
    });
    
    if (!response.success) {
      return fallback;
    }
    
    // Group deals by month and calculate monthly revenue
    const monthlyData = response.data.reduce((acc, deal) => {
      if (!deal.created_at_c) return acc;
      
      const month = new Date(deal.created_at_c).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { count: 0, revenue: 0 };
      }
      acc[month].count += 1;
      acc[month].revenue += deal.value_c || 0;
      return acc;
    }, {});
    
    // Generate all months for the selected year
    const allMonths = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, '0');
      return `${year}-${month}`;
    });
    
    // Create revenue data for each month
    const trendData = allMonths.map(month => {
      return monthlyData[month] ? monthlyData[month].revenue : 0;
    });
    
    return {
      categories: allMonths.map(month => {
        const date = new Date(month);
        return date.toLocaleDateString('en-US', { month: 'short' });
      }),
      series: [{ name: 'Monthly Revenue', data: trendData }]
    };
  }, fallback);
};

// Detailed recent activity
export const getDetailedRecentActivity = async () => {
  await simulateAPICall();
  
  const fallback = [
    { id: 1, title: "No recent activity", type: "general", time: "N/A" }
  ];
  
  return safeServiceCall(async () => {
    const apperClient = getApperClient();
    
    // Get recent leads
    const leadsResponse = await apperClient.fetchRecords("lead_c", {
      fields: [
        { field: { Name: "website_url_c" } },
        { field: { Name: "created_at_c" } }
      ],
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }],
      pagingInfo: { limit: 10, offset: 0 }
    });
    
    if (!leadsResponse.success || !leadsResponse.data) {
      return fallback;
    }
    
    const detailedActivity = leadsResponse.data.map(lead => ({
      id: lead.Id || Math.random(),
      title: `New lead added: ${(lead.website_url_c || 'Unknown URL').replace(/^https?:\/\//, '').replace(/\/$/, '')}`,
      type: "contact",
      time: lead.created_at_c ? new Date(lead.created_at_c).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : 'Unknown time',
      date: lead.created_at_c ? new Date(lead.created_at_c).toLocaleDateString() : new Date().toLocaleDateString()
    }));
    
    return detailedActivity
      .sort((a, b) => {
        const dateA = new Date(a.date || Date.now());
        const dateB = new Date(b.date || Date.now());
        return dateB - dateA;
      })
      .slice(0, 15);
  }, fallback);
};

// User leads report with period filtering
export const getUserLeadsReport = async (userId, period = 'today') => {
  await simulateAPICall();
  
  const validUserId = validateUserId(userId);
  if (!validUserId) {
    console.warn('Invalid user ID provided:', userId);
    return [];
  }
  
  const fallback = [];
  
  return safeServiceCall(async () => {
    const { getLeads } = await import("@/services/api/leadsService");
    const leadsData = await getLeads();
    
    if (!leadsData?.leads || !Array.isArray(leadsData.leads)) {
      return fallback;
    }
    
    const allLeads = leadsData.leads;
    
    // Filter leads by user
    const userLeads = allLeads.filter(lead => 
      lead.added_by_c === validUserId || lead.addedBy === validUserId
    );
    
    // Get date range for filtering
    const { start: startDate, end: endDate } = getDateRange(period);
    
    // Filter leads by date range
    const filteredLeads = userLeads.filter(lead => {
      const createdAt = lead.created_at_c || lead.createdAt;
      if (!createdAt) return false;
      
      const leadDate = new Date(createdAt);
      return leadDate >= startDate && leadDate < endDate;
    });
    
    // Sort by creation date (most recent first) and ensure data integrity
    return filteredLeads
      .map(lead => ({
        ...lead,
        Id: lead.Id || Math.random(),
        websiteUrl: lead.website_url_c || lead.websiteUrl || 'Unknown URL',
        category: lead.category_c || lead.category || 'General',
        createdAt: lead.created_at_c || lead.createdAt || new Date().toISOString()
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, fallback);
};