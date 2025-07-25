// Initialize ApperClient for sales rep operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getSalesReps = async () => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "leads_contacted_c" } },
        { field: { Name: "meetings_booked_c" } },
        { field: { Name: "deals_closed_c" } },
        { field: { Name: "total_revenue_c" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("sales_rep_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data.map(rep => ({
      Id: rep.Id,
      name: rep.Name || '',
      leadsContacted: rep.leads_contacted_c || 0,
      meetingsBooked: rep.meetings_booked_c || 0,
      dealsClosed: rep.deals_closed_c || 0,
      totalRevenue: rep.total_revenue_c || 0
    }));
  } catch (error) {
    console.error("Error fetching sales reps:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getSalesRepById = async (id) => {
  await delay(200);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "leads_contacted_c" } },
        { field: { Name: "meetings_booked_c" } },
        { field: { Name: "deals_closed_c" } },
        { field: { Name: "total_revenue_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById("sales_rep_c", id, params);
    
    if (!response.success) {
      throw new Error("Sales rep not found");
    }
    
    const rep = response.data;
    return {
      Id: rep.Id,
      name: rep.Name || '',
      leadsContacted: rep.leads_contacted_c || 0,
      meetingsBooked: rep.meetings_booked_c || 0,
      dealsClosed: rep.deals_closed_c || 0,
      totalRevenue: rep.total_revenue_c || 0
    };
  } catch (error) {
    console.error("Error fetching sales rep:", error?.response?.data?.message || error.message);
    throw new Error("Sales rep not found");
  }
};

export const createSalesRep = async (repData) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Name: repData.name || '',
        leads_contacted_c: repData.leadsContacted || 0,
        meetings_booked_c: repData.meetingsBooked || 0,
        deals_closed_c: repData.dealsClosed || 0,
        total_revenue_c: repData.totalRevenue || 0
      }]
    };
    
    const response = await apperClient.createRecord("sales_rep_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to create sales rep");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to create sales rep");
    }
    
    const newRep = successfulRecords[0].data;
    return {
      Id: newRep.Id,
      name: newRep.Name,
      leadsContacted: newRep.leads_contacted_c,
      meetingsBooked: newRep.meetings_booked_c,
      dealsClosed: newRep.deals_closed_c,
      totalRevenue: newRep.total_revenue_c
    };
  } catch (error) {
    console.error("Error creating sales rep:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateSalesRep = async (id, updates) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const recordData = {};
    if (updates.name !== undefined) recordData.Name = updates.name;
    if (updates.leadsContacted !== undefined) recordData.leads_contacted_c = updates.leadsContacted;
    if (updates.meetingsBooked !== undefined) recordData.meetings_booked_c = updates.meetingsBooked;
    if (updates.dealsClosed !== undefined) recordData.deals_closed_c = updates.dealsClosed;
    if (updates.totalRevenue !== undefined) recordData.total_revenue_c = updates.totalRevenue;
    
    const params = {
      records: [{
        Id: id,
        ...recordData
      }]
    };
    
    const response = await apperClient.updateRecord("sales_rep_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to update sales rep");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to update sales rep");
    }
    
    const updatedRep = successfulRecords[0].data;
    return {
      Id: updatedRep.Id,
      name: updatedRep.Name,
      leadsContacted: updatedRep.leads_contacted_c,
      meetingsBooked: updatedRep.meetings_booked_c,
      dealsClosed: updatedRep.deals_closed_c,
      totalRevenue: updatedRep.total_revenue_c
    };
  } catch (error) {
    console.error("Error updating sales rep:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteSalesRep = async (id) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("sales_rep_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to delete sales rep");
    }
    
    const successfulDeletions = response.results.filter(result => result.success);
    if (successfulDeletions.length === 0) {
      throw new Error("Failed to delete sales rep");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting sales rep:", error?.response?.data?.message || error.message);
    throw new Error("Sales rep not found");
  }
};