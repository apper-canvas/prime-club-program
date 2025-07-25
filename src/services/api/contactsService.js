// Initialize ApperClient for contact operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getContacts = async () => {
  await delay(400);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email_c" } },
        { field: { Name: "company_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "assigned_rep_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("app_contact_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data.map(contact => ({
      Id: contact.Id,
      name: contact.Name || '',
      email: contact.email_c || '',
      company: contact.company_c || '',
      status: contact.status_c || 'New',
      assignedRep: contact.assigned_rep_c || '',
      tags: [], // Tags would need special handling
      notes: contact.notes_c || '',
      createdAt: contact.created_at_c || contact.CreatedOn
    }));
  } catch (error) {
    console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getContactById = async (id) => {
  await delay(200);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email_c" } },
        { field: { Name: "company_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "assigned_rep_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById("app_contact_c", id, params);
    
    if (!response.success) {
      throw new Error("Contact not found");
    }
    
    const contact = response.data;
    return {
      Id: contact.Id,
      name: contact.Name || '',
      email: contact.email_c || '',
      company: contact.company_c || '',
      status: contact.status_c || 'New',
      assignedRep: contact.assigned_rep_c || '',
      tags: [], // Tags would need special handling
      notes: contact.notes_c || '',
      createdAt: contact.created_at_c || contact.CreatedOn
    };
  } catch (error) {
    console.error("Error fetching contact:", error?.response?.data?.message || error.message);
    throw new Error("Contact not found");
  }
};

export const createContact = async (contactData) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Name: contactData.name || '',
        email_c: contactData.email || '',
        company_c: contactData.company || '',
        status_c: contactData.status || 'New',
        assigned_rep_c: contactData.assignedRep || '',
        notes_c: contactData.notes || '',
        created_at_c: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord("app_contact_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to create contact");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to create contact");
    }
    
    const newContact = successfulRecords[0].data;
    return {
      Id: newContact.Id,
      name: newContact.Name,
      email: newContact.email_c,
      company: newContact.company_c,
      status: newContact.status_c,
      assignedRep: newContact.assigned_rep_c,
      tags: [],
      notes: newContact.notes_c,
      createdAt: newContact.created_at_c
    };
  } catch (error) {
    console.error("Error creating contact:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateContact = async (id, updates) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const recordData = {};
    if (updates.name !== undefined) recordData.Name = updates.name;
    if (updates.email !== undefined) recordData.email_c = updates.email;
    if (updates.company !== undefined) recordData.company_c = updates.company;
    if (updates.status !== undefined) recordData.status_c = updates.status;
    if (updates.assignedRep !== undefined) recordData.assigned_rep_c = updates.assignedRep;
    if (updates.notes !== undefined) recordData.notes_c = updates.notes;
    
    const params = {
      records: [{
        Id: id,
        ...recordData
      }]
    };
    
    const response = await apperClient.updateRecord("app_contact_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to update contact");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to update contact");
    }
    
    const updatedContact = successfulRecords[0].data;
    return {
      Id: updatedContact.Id,
      name: updatedContact.Name,
      email: updatedContact.email_c,
      company: updatedContact.company_c,
      status: updatedContact.status_c,
      assignedRep: updatedContact.assigned_rep_c,
      tags: [],
      notes: updatedContact.notes_c,
      createdAt: updatedContact.created_at_c
    };
  } catch (error) {
    console.error("Error updating contact:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteContact = async (id) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("app_contact_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to delete contact");
    }
    
    const successfulDeletions = response.results.filter(result => result.success);
    if (successfulDeletions.length === 0) {
      throw new Error("Failed to delete contact");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error?.response?.data?.message || error.message);
    throw new Error("Contact not found");
  }
};