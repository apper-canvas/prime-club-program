// Initialize ApperClient for deal operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDeals = async (year = null) => {
  await delay(500);
  
  try {
    const apperClient = getApperClient();
    
    const whereConditions = [];
    if (year) {
      whereConditions.push({
        FieldName: "created_at_c",
        Operator: "ExactMatch",
        SubOperator: "Year",
        Values: [year.toString()]
      });
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "lead_name_c" } },
        { field: { Name: "lead_id_c" } },
        { field: { Name: "value_c" } },
        { field: { Name: "stage_c" } },
        { field: { Name: "assigned_rep_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "start_month_c" } },
        { field: { Name: "end_month_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: whereConditions.length > 0 ? whereConditions : undefined,
      orderBy: [{ fieldName: "created_at_c", sorttype: "DESC" }]
    };
    
    const response = await apperClient.fetchRecords("deal_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data.map(deal => ({
      Id: deal.Id,
      name: deal.Name || '',
      leadName: deal.lead_name_c || '',
      leadId: deal.lead_id_c || '',
      value: deal.value_c || 0,
      stage: deal.stage_c || '',
      assignedRep: deal.assigned_rep_c || '',
      edition: deal.edition_c || '',
      startMonth: deal.start_month_c || 1,
      endMonth: deal.end_month_c || 12,
      createdAt: deal.created_at_c || deal.CreatedOn
    }));
  } catch (error) {
    console.error("Error fetching deals:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getDealById = async (id) => {
  await delay(200);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "lead_name_c" } },
        { field: { Name: "lead_id_c" } },
        { field: { Name: "value_c" } },
        { field: { Name: "stage_c" } },
        { field: { Name: "assigned_rep_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "start_month_c" } },
        { field: { Name: "end_month_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById("deal_c", id, params);
    
    if (!response.success) {
      throw new Error("Deal not found");
    }
    
    const deal = response.data;
    return {
      Id: deal.Id,
      name: deal.Name || '',
      leadName: deal.lead_name_c || '',
      leadId: deal.lead_id_c || '',
      value: deal.value_c || 0,
      stage: deal.stage_c || '',
      assignedRep: deal.assigned_rep_c || '',
      edition: deal.edition_c || '',
      startMonth: deal.start_month_c || 1,
      endMonth: deal.end_month_c || 12,
      createdAt: deal.created_at_c || deal.CreatedOn
    };
  } catch (error) {
    console.error("Error fetching deal:", error?.response?.data?.message || error.message);
    throw new Error("Deal not found");
  }
};

export const createDeal = async (dealData) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Name: dealData.name || '',
        lead_name_c: dealData.leadName || '',
        lead_id_c: dealData.leadId || '',
        value_c: dealData.value || 0,
        stage_c: dealData.stage || '',
        assigned_rep_c: dealData.assignedRep || '',
        edition_c: dealData.edition || '',
        start_month_c: dealData.startMonth || 1,
        end_month_c: dealData.endMonth || 12,
        created_at_c: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord("deal_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to create deal");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to create deal");
    }
    
    const newDeal = successfulRecords[0].data;
    return {
      Id: newDeal.Id,
      name: newDeal.Name,
      leadName: newDeal.lead_name_c,
      leadId: newDeal.lead_id_c,
      value: newDeal.value_c,
      stage: newDeal.stage_c,
      assignedRep: newDeal.assigned_rep_c,
      edition: newDeal.edition_c,
      startMonth: newDeal.start_month_c,
      endMonth: newDeal.end_month_c,
      createdAt: newDeal.created_at_c
    };
  } catch (error) {
    console.error("Error creating deal:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateDeal = async (id, updates) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const recordData = {};
    if (updates.name !== undefined) recordData.Name = updates.name;
    if (updates.leadName !== undefined) recordData.lead_name_c = updates.leadName;
    if (updates.leadId !== undefined) recordData.lead_id_c = updates.leadId;
    if (updates.value !== undefined) recordData.value_c = updates.value;
    if (updates.stage !== undefined) recordData.stage_c = updates.stage;
    if (updates.assignedRep !== undefined) recordData.assigned_rep_c = updates.assignedRep;
    if (updates.edition !== undefined) recordData.edition_c = updates.edition;
    if (updates.startMonth !== undefined) recordData.start_month_c = updates.startMonth;
    if (updates.endMonth !== undefined) recordData.end_month_c = updates.endMonth;
    
    const params = {
      records: [{
        Id: id,
        ...recordData
      }]
    };
    
    const response = await apperClient.updateRecord("deal_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to update deal");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to update deal");
    }
    
    const updatedDeal = successfulRecords[0].data;
    return {
      Id: updatedDeal.Id,
      name: updatedDeal.Name,
      leadName: updatedDeal.lead_name_c,
      leadId: updatedDeal.lead_id_c,
      value: updatedDeal.value_c,
      stage: updatedDeal.stage_c,
      assignedRep: updatedDeal.assigned_rep_c,
      edition: updatedDeal.edition_c,
      startMonth: updatedDeal.start_month_c,
      endMonth: updatedDeal.end_month_c,
      createdAt: updatedDeal.created_at_c
    };
  } catch (error) {
    console.error("Error updating deal:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteDeal = async (id) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("deal_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to delete deal");
    }
    
    const successfulDeletions = response.results.filter(result => result.success);
    if (successfulDeletions.length === 0) {
      throw new Error("Failed to delete deal");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting deal:", error?.response?.data?.message || error.message);
    throw new Error("Deal not found");
  }
};