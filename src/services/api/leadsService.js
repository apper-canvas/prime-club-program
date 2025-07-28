// Initialize ApperClient for lead operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to clean website URLs
const cleanWebsiteUrl = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

// Utility function to format dates for API (Date fields need YYYY-MM-DD format)
const formatDateForAPI = (date) => {
  if (!date) return null;
  if (typeof date === 'string' && date.includes('T')) {
    // If it's an ISO string, extract just the date part
    return date.split('T')[0];
  }
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  // If it's already in YYYY-MM-DD format, return as is
  return date;
};
export const getLeads = async () => {
  await delay(400);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "team_size_c" } },
        { field: { Name: "arr_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "linkedin_url_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "funding_type_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "follow_up_date_c" } },
        { field: { Name: "added_by_c" } },
        { field: { Name: "added_by_name_c" } },
        { field: { Name: "created_at_c" } }
      ],
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return { leads: [], deduplicationResult: null };
    }
    
    const transformedLeads = response.data.map(lead => ({
      Id: lead.Id,
      name: lead.Name || '',
      websiteUrl: lead.website_url_c || '',
      teamSize: lead.team_size_c || "1-3",
      arr: lead.arr_c || 0,
      category: lead.category_c || "Other",
      linkedinUrl: lead.linkedin_url_c || "",
      status: lead.status_c || "Keep an Eye",
      fundingType: lead.funding_type_c || "Bootstrapped",
      edition: lead.edition_c || "Select Edition",
      followUpDate: lead.follow_up_date_c || null,
      addedBy: lead.added_by_c || 0,
      addedByName: lead.added_by_name_c || 'Unknown',
      createdAt: lead.created_at_c || lead.CreatedOn
    }));
    
    return {
      leads: transformedLeads,
      deduplicationResult: null
    };
  } catch (error) {
    console.error("Error fetching leads:", error?.response?.data?.message || error.message);
    return { leads: [], deduplicationResult: null };
  }
};

export const getLeadById = async (id) => {
  await delay(200);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "team_size_c" } },
        { field: { Name: "arr_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "linkedin_url_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "funding_type_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "follow_up_date_c" } },
        { field: { Name: "added_by_c" } },
        { field: { Name: "added_by_name_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById("lead_c", id, params);
    
    if (!response.success) {
      throw new Error("Lead not found");
    }
    
    const lead = response.data;
    return {
      Id: lead.Id,
      name: lead.Name || '',
      websiteUrl: lead.website_url_c || '',
      teamSize: lead.team_size_c || "1-3",
      arr: lead.arr_c || 0,
      category: lead.category_c || "Other",
      linkedinUrl: lead.linkedin_url_c || "",
      status: lead.status_c || "Keep an Eye",
      fundingType: lead.funding_type_c || "Bootstrapped",
      edition: lead.edition_c || "Select Edition",
      followUpDate: lead.follow_up_date_c || null,
      addedBy: lead.added_by_c || 0,
      addedByName: lead.added_by_name_c || 'Unknown',
      createdAt: lead.created_at_c || lead.CreatedOn
    };
  } catch (error) {
    console.error("Error fetching lead:", error?.response?.data?.message || error.message);
    throw new Error("Lead not found");
  }
};

export const createLead = async (leadData) => {
  await delay(300);
  
  // Validate required fields
  if (!leadData.websiteUrl || !leadData.websiteUrl.trim()) {
    throw new Error("Website URL is required");
  }
  
  try {
    const apperClient = getApperClient();
    
    // Check for duplicate website URL
    const existingResponse = await apperClient.fetchRecords("lead_c", {
      fields: [{ field: { Name: "website_url_c" } }],
      where: [{ FieldName: "website_url_c", Operator: "EqualTo", Values: [leadData.websiteUrl] }]
    });
    
    if (existingResponse.success && existingResponse.data.length > 0) {
      throw new Error(`A lead with website URL "${leadData.websiteUrl}" already exists`);
    }
    
const params = {
      records: [{
        Name: leadData.websiteUrl || '',
        website_url_c: leadData.websiteUrl || '',
        team_size_c: leadData.teamSize || "1-3",
        arr_c: leadData.arr || 0,
        category_c: leadData.category || "Other",
        linkedin_url_c: leadData.linkedinUrl || "",
        status_c: leadData.status || "Keep an Eye",
        funding_type_c: leadData.fundingType || "Bootstrapped",
        edition_c: leadData.edition || "Select Edition",
        follow_up_date_c: formatDateForAPI(leadData.followUpDate),
        added_by_name_c: "Current User",
        created_at_c: new Date().toISOString() // DateTime field can use full ISO format
      }]
    };
    
    const response = await apperClient.createRecord("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to create lead");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to create lead");
    }
    
    const newLead = successfulRecords[0].data;
    return {
      Id: newLead.Id,
      name: newLead.Name,
      websiteUrl: newLead.website_url_c,
      teamSize: newLead.team_size_c,
      arr: newLead.arr_c,
      category: newLead.category_c,
      linkedinUrl: newLead.linkedin_url_c,
      status: newLead.status_c,
      fundingType: newLead.funding_type_c,
      edition: newLead.edition_c,
      followUpDate: newLead.follow_up_date_c,
      addedByName: newLead.added_by_name_c,
      createdAt: newLead.created_at_c
    };
  } catch (error) {
    console.error("Error creating lead:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateLead = async (id, updates) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
const recordData = {};
    if (updates.name !== undefined) recordData.Name = updates.name;
    if (updates.websiteUrl !== undefined) recordData.website_url_c = updates.websiteUrl;
    if (updates.teamSize !== undefined) recordData.team_size_c = updates.teamSize;
    if (updates.arr !== undefined) recordData.arr_c = updates.arr;
    if (updates.category !== undefined) recordData.category_c = updates.category;
    if (updates.linkedinUrl !== undefined) recordData.linkedin_url_c = updates.linkedinUrl;
    if (updates.status !== undefined) recordData.status_c = updates.status;
    if (updates.fundingType !== undefined) recordData.funding_type_c = updates.fundingType;
    if (updates.edition !== undefined) recordData.edition_c = updates.edition;
    if (updates.followUpDate !== undefined) recordData.follow_up_date_c = formatDateForAPI(updates.followUpDate);
    const params = {
      records: [{
        Id: id,
        ...recordData
      }]
    };
    
    const response = await apperClient.updateRecord("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to update lead");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to update lead");
    }
    
    const updatedLead = successfulRecords[0].data;
    return {
      Id: updatedLead.Id,
      name: updatedLead.Name,
      websiteUrl: updatedLead.website_url_c,
      teamSize: updatedLead.team_size_c,
      arr: updatedLead.arr_c,
      category: updatedLead.category_c,
      linkedinUrl: updatedLead.linkedin_url_c,
      status: updatedLead.status_c,
      fundingType: updatedLead.funding_type_c,
      edition: updatedLead.edition_c,
      followUpDate: updatedLead.follow_up_date_c,
      addedByName: updatedLead.added_by_name_c,
      createdAt: updatedLead.created_at_c
    };
  } catch (error) {
    console.error("Error updating lead:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteLead = async (id) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to delete lead");
    }
    
    const successfulDeletions = response.results.filter(result => result.success);
    if (successfulDeletions.length === 0) {
      throw new Error("Failed to delete lead");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error?.response?.data?.message || error.message);
    throw new Error("Lead not found");
  }
};

export const getDailyLeadsReport = async () => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    // Get today's leads
    const params = {
      fields: [
        { field: { Name: "added_by_c" } },
        { field: { Name: "added_by_name_c" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: [
        { FieldName: "created_at_c", Operator: "RelativeMatch", Values: ["Today"] }
      ]
    };
    
    const response = await apperClient.fetchRecords("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    // Get all sales reps for complete report
    const { getSalesReps } = await import('./salesRepService');
    const salesReps = await getSalesReps();
    
    // Initialize report data
    const reportData = {};
    salesReps.forEach(rep => {
      reportData[rep.name || rep.Name] = {
        salesRep: rep.name || rep.Name,
        salesRepId: rep.Id,
        leads: [],
        leadCount: 0,
        lowPerformance: false
      };
    });
    
    // Add today's leads to respective sales reps
    response.data.forEach(lead => {
      const repName = lead.added_by_name_c || 'Unknown';
      if (reportData[repName]) {
        reportData[repName].leads.push({
          Id: lead.Id,
          websiteUrl: lead.website_url_c,
          createdAt: lead.created_at_c
        });
      }
    });
    
    // Calculate counts and performance
    Object.values(reportData).forEach(repData => {
      repData.leadCount = repData.leads.length;
      repData.lowPerformance = repData.leadCount < 5;
    });
    
    return Object.values(reportData).sort((a, b) => b.leadCount - a.leadCount);
  } catch (error) {
    console.error("Error fetching daily leads report:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getPendingFollowUps = async () => {
  await delay(300);
  
try {
    const apperClient = getApperClient();
    
    // Get current date and 7 days from now
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);
    
    const params = {
      fields: [
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "follow_up_date_c" } }
      ],
      where: [
        { FieldName: "follow_up_date_c", Operator: "GreaterThanOrEqualTo", Values: [formatDateForAPI(now)] },
        { FieldName: "follow_up_date_c", Operator: "LessThanOrEqualTo", Values: [formatDateForAPI(sevenDaysFromNow)] }
      ],
      orderBy: [{ fieldName: "follow_up_date_c", sorttype: "ASC" }]
    };
    
    const response = await apperClient.fetchRecords("lead_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data.map(lead => ({
      Id: lead.Id,
      websiteUrl: lead.website_url_c || '',
      category: lead.category_c || '',
      followUpDate: lead.follow_up_date_c
    }));
  } catch (error) {
    console.error("Error fetching pending follow-ups:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getFreshLeadsOnly = async (leadsArray) => {
  await delay(100);
  
  // For database implementation, this would require complex date-based filtering
  // For now, return all provided leads as they are assumed to be fresh
  return leadsArray;
};