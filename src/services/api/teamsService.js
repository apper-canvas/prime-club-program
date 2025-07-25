// Initialize ApperClient for team operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getTeamMembers = async () => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email_c" } },
        { field: { Name: "role_c" } },
        { field: { Name: "permissions_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "last_login_c" } }
      ]
    };
    
    const response = await apperClient.fetchRecords("team_c", params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    return response.data.map(member => ({
      Id: member.Id,
      name: member.Name || '',
      email: member.email_c || '',
      role: member.role_c || 'viewer',
      permissions: member.permissions_c ? JSON.parse(member.permissions_c) : {
        dashboard: true,
        leads: false,
        hotlist: false,
        pipeline: false,
        calendar: false,
        analytics: false,
        leaderboard: false,
        contacts: false
      },
      status: member.status_c || 'pending',
      createdAt: member.created_at_c || member.CreatedOn,
      updatedAt: member.updated_at_c || member.ModifiedOn,
      lastLogin: member.last_login_c || null
    }));
  } catch (error) {
    console.error("Error fetching team members:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getTeamMemberById = async (id) => {
  await delay(200);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email_c" } },
        { field: { Name: "role_c" } },
        { field: { Name: "permissions_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "last_login_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById("team_c", id, params);
    
    if (!response.success) {
      throw new Error("Team member not found");
    }
    
    const member = response.data;
    return {
      Id: member.Id,
      name: member.Name || '',
      email: member.email_c || '',
      role: member.role_c || 'viewer',
      permissions: member.permissions_c ? JSON.parse(member.permissions_c) : {},
      status: member.status_c || 'pending',
      createdAt: member.created_at_c || member.CreatedOn,
      updatedAt: member.updated_at_c || member.ModifiedOn,
      lastLogin: member.last_login_c || null
    };
  } catch (error) {
    console.error("Error fetching team member:", error?.response?.data?.message || error.message);
    throw new Error("Team member not found");
  }
};

export const inviteTeamMember = async (memberData) => {
  await delay(300);
  
  // Validate required fields
  if (!memberData.name || !memberData.name.trim()) {
    throw new Error("Member name is required");
  }
  
  if (!memberData.email || !memberData.email.trim()) {
    throw new Error("Member email is required");
  }
  
  try {
    const apperClient = getApperClient();
    
    // Check if email already exists
    const existingResponse = await apperClient.fetchRecords("team_c", {
      fields: [{ field: { Name: "email_c" } }],
      where: [{ FieldName: "email_c", Operator: "EqualTo", Values: [memberData.email.toLowerCase()] }]
    });
    
    if (existingResponse.success && existingResponse.data.length > 0) {
      throw new Error("A team member with this email already exists");
    }
    
    const params = {
      records: [{
        Name: memberData.name.trim(),
        email_c: memberData.email.trim().toLowerCase(),
        role_c: memberData.role || "viewer",
        permissions_c: JSON.stringify(memberData.permissions || {
          dashboard: true,
          leads: false,
          hotlist: false,
          pipeline: false,
          calendar: false,
          analytics: false,
          leaderboard: false,
          contacts: false
        }),
        status_c: "pending",
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      }]
    };
    
    const response = await apperClient.createRecord("team_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to invite team member");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to invite team member");
    }
    
    const newMember = successfulRecords[0].data;
    return {
      Id: newMember.Id,
      name: newMember.Name,
      email: newMember.email_c,
      role: newMember.role_c,
      permissions: JSON.parse(newMember.permissions_c || '{}'),
      status: newMember.status_c,
      createdAt: newMember.created_at_c,
      updatedAt: newMember.updated_at_c,
      lastLogin: null
    };
  } catch (error) {
    console.error("Error inviting team member:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateTeamMember = async (id, updates) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    // If email is being updated, check for duplicates
    if (updates.email) {
      const existingResponse = await apperClient.fetchRecords("team_c", {
        fields: [{ field: { Name: "Id" } }],
        where: [
          { FieldName: "email_c", Operator: "EqualTo", Values: [updates.email.toLowerCase()] },
          { FieldName: "Id", Operator: "NotEqualTo", Values: [id] }
        ]
      });
      
      if (existingResponse.success && existingResponse.data.length > 0) {
        throw new Error("A team member with this email already exists");
      }
    }
    
    const recordData = {};
    if (updates.name) recordData.Name = updates.name;
    if (updates.email) recordData.email_c = updates.email.toLowerCase();
    if (updates.role) recordData.role_c = updates.role;
    if (updates.permissions) recordData.permissions_c = JSON.stringify(updates.permissions);
    if (updates.status) recordData.status_c = updates.status;
    recordData.updated_at_c = new Date().toISOString();
    
    const params = {
      records: [{
        Id: id,
        ...recordData
      }]
    };
    
    const response = await apperClient.updateRecord("team_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to update team member");
    }
    
    const successfulRecords = response.results.filter(result => result.success);
    if (successfulRecords.length === 0) {
      throw new Error("Failed to update team member");
    }
    
    const updatedMember = successfulRecords[0].data;
    return {
      Id: updatedMember.Id,
      name: updatedMember.Name,
      email: updatedMember.email_c,
      role: updatedMember.role_c,
      permissions: JSON.parse(updatedMember.permissions_c || '{}'),
      status: updatedMember.status_c,
      createdAt: updatedMember.created_at_c,
      updatedAt: updatedMember.updated_at_c,
      lastLogin: updatedMember.last_login_c
    };
  } catch (error) {
    console.error("Error updating team member:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const removeTeamMember = async (id) => {
  await delay(300);
  
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [id]
    };
    
    const response = await apperClient.deleteRecord("team_c", params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error("Failed to remove team member");
    }
    
    const successfulDeletions = response.results.filter(result => result.success);
    if (successfulDeletions.length === 0) {
      throw new Error("Failed to remove team member");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error removing team member:", error?.response?.data?.message || error.message);
    throw new Error("Team member not found");
  }
};

export const getTeamMemberPerformance = async (id) => {
  await delay(250);
  
  try {
    // Get team member to verify existence
    await getTeamMemberById(id);
    
    // Mock performance data for now - could be enhanced with actual metrics from other tables
    const mockPerformance = {
      totalLeads: Math.floor(Math.random() * 50) + 20,
      totalDeals: Math.floor(Math.random() * 10) + 5,
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      totalMeetings: Math.floor(Math.random() * 20) + 10,
      conversionRate: Math.floor(Math.random() * 15) + 5,
      avgDealSize: 0
    };
    
    mockPerformance.avgDealSize = mockPerformance.totalDeals > 0 ? 
      Math.round(mockPerformance.totalRevenue / mockPerformance.totalDeals) : 0;
    
    return mockPerformance;
  } catch (error) {
    console.error("Error fetching team member performance:", error?.response?.data?.message || error.message);
    throw new Error("Team member not found");
  }
};

export const activateTeamMember = async (id) => {
  await delay(200);
  
  try {
    const updatedMember = await updateTeamMember(id, { 
      status: "active",
      last_login_c: new Date().toISOString()
    });
    
    return updatedMember;
  } catch (error) {
    console.error("Error activating team member:", error?.response?.data?.message || error.message);
    throw new Error("Team member not found");
  }
};

export const deactivateTeamMember = async (id) => {
  await delay(200);
  
  try {
    const updatedMember = await updateTeamMember(id, { 
      status: "inactive"
    });
    
    return updatedMember;
  } catch (error) {
    console.error("Error deactivating team member:", error?.response?.data?.message || error.message);
    throw new Error("Team member not found");
  }
};