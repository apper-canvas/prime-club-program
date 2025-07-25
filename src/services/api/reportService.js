// Initialize ApperClient for report operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Get website URL activity with filtering options
export const getWebsiteUrlActivity = async (filters = {}) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const whereConditions = [];
    
    // Filter by date range
    if (filters.startDate || filters.endDate) {
      if (filters.startDate) {
        whereConditions.push({
          FieldName: "created_at_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.startDate]
        });
      }
      if (filters.endDate) {
        whereConditions.push({
          FieldName: "created_at_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.endDate]
        });
      }
    }
    
    // Filter by specific date
    if (filters.date) {
      whereConditions.push({
        FieldName: "created_at_c",
        Operator: "ExactMatch",
        SubOperator: "Day",
        Values: [new Date(filters.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })]
      });
    }
    
    // Filter by user/sales rep
    if (filters.addedBy) {
      whereConditions.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [parseInt(filters.addedBy)]
      });
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchConditions = [
        { FieldName: "website_url_c", Operator: "Contains", Values: [filters.searchTerm] },
        { FieldName: "category_c", Operator: "Contains", Values: [filters.searchTerm] }
      ];
      
      whereConditions.push({
        operator: "OR",
        subGroups: searchConditions.map(condition => ({
          conditions: [condition],
          operator: "OR"
        }))
      });
    }
    
    const params = {
      fields: [
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "team_size_c" } },
        { field: { Name: "arr_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "funding_type_c" } },
        { field: { Name: "added_by_c" } },
        { field: { Name: "added_by_name_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: whereConditions.length > 0 ? whereConditions : undefined,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return { data: [], summary: { totalUrls: 0, totalArr: 0, byStatus: {}, byCategory: {} } };
    }
    
    const transformedData = response.data.map(lead => ({
      Id: lead.Id,
      websiteUrl: cleanWebsiteUrl(lead.website_url_c || ''),
      category: lead.category_c || '',
      teamSize: lead.team_size_c || '',
      arr: lead.arr_c || 0,
      status: lead.status_c || '',
      fundingType: lead.funding_type_c || '',
      addedBy: lead.added_by_c || 0,
      addedByName: lead.added_by_name_c || 'Unknown',
      createdAt: lead.created_at_c || lead.CreatedOn
    }));
    
    return {
      data: transformedData,
      summary: {
        totalUrls: transformedData.length,
        totalArr: transformedData.reduce((sum, lead) => sum + (lead.arr || 0), 0),
        byStatus: getStatusSummary(transformedData),
        byCategory: getCategorySummary(transformedData)
      }
    };
  } catch (error) {
    console.error("Error fetching website URL activity:", error?.response?.data?.message || error.message);
    return { data: [], summary: { totalUrls: 0, totalArr: 0, byStatus: {}, byCategory: {} } };
  }
};

// Get activity for a specific date
export const getActivityByDate = async (date) => {
  return await getWebsiteUrlActivity({ date });
};

// Get activity for a specific user
export const getActivityByUser = async (userId) => {
  return await getWebsiteUrlActivity({ addedBy: userId });
};

// Get quick date filters (today, yesterday, this week, etc.)
export const getQuickDateFilters = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    today: today.toISOString().split('T')[0],
    yesterday: yesterday.toISOString().split('T')[0],
    thisWeekStart: thisWeekStart.toISOString().split('T')[0],
    thisWeekEnd: today.toISOString().split('T')[0],
    lastWeekStart: lastWeekStart.toISOString().split('T')[0],
    lastWeekEnd: lastWeekEnd.toISOString().split('T')[0],
    thisMonthStart: thisMonthStart.toISOString().split('T')[0],
    thisMonthEnd: today.toISOString().split('T')[0]
  };
};

// Get all sales reps for filtering
export const getSalesRepsForFilter = async () => {
  await delay(200);
  
  try {
    const { getSalesReps } = await import('./salesRepService');
    return await getSalesReps();
  } catch (error) {
    console.error("Error fetching sales reps for filter:", error?.response?.data?.message || error.message);
    return [];
  }
};

// Helper functions
const getStatusSummary = (data) => {
  const summary = {};
  data.forEach(lead => {
    const status = lead.status || 'Unknown';
    summary[status] = (summary[status] || 0) + 1;
  });
  return summary;
};

const getCategorySummary = (data) => {
  const summary = {};
  data.forEach(lead => {
    const category = lead.category || 'Unknown';
    summary[category] = (summary[category] || 0) + 1;
  });
  return summary;
};

// Clean website URL helper function
const cleanWebsiteUrl = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

// Get daily website URLs for a specific sales rep
export const getDailyWebsiteUrls = async (salesRepId, date) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const whereConditions = [];
    
    // Filter by sales rep
    if (salesRepId) {
      whereConditions.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [parseInt(salesRepId)]
      });
    }
    
    // Filter by specific date
    if (date) {
      whereConditions.push({
        FieldName: "created_at_c",
        Operator: "ExactMatch",
        SubOperator: "Day",
        Values: [new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })]
      });
    }
    
    const params = {
      fields: [
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: whereConditions,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data.map(lead => ({
      Id: lead.Id,
      websiteUrl: cleanWebsiteUrl(lead.website_url_c || ''),
      category: lead.category_c || '',
      status: lead.status_c || '',
      createdAt: lead.created_at_c || lead.CreatedOn
    }));
  } catch (error) {
    console.error("Error fetching daily website URLs:", error?.response?.data?.message || error.message);
    return [];
  }
};

// Re-export sales reps for easy access
export { getSalesReps } from './salesRepService';

// Export lead data for external use (CSV, etc.)
export const exportWebsiteUrlData = async (filters = {}) => {
  const result = await getWebsiteUrlActivity(filters);
  
  return result.data.map(lead => ({
    'Website URL': cleanWebsiteUrl(lead.websiteUrl),
    'Category': lead.category,
    'Team Size': lead.teamSize,
    'ARR': `$${(lead.arr / 1000000).toFixed(1)}M`,
    'Status': lead.status,
    'Funding Type': lead.fundingType,
    'Added By': lead.addedByName,
    'Date Added': new Date(lead.createdAt).toLocaleDateString()
  }));
};