// Initialize ApperClient for task operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    await delay(200)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("task_c", parseInt(id), params);
      
      if (!response.success) {
        throw new Error('Task not found');
      }
      
      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      };
    } catch (error) {
      console.error("Error fetching task:", error?.response?.data?.message || error.message);
      throw new Error('Task not found');
    }
  },

  async create(taskData) {
    await delay(400)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: taskData.title || '',
          title_c: taskData.title || '',
          description_c: taskData.description || '',
          category_id_c: taskData.categoryId || 1,
          priority_c: taskData.priority || 'Medium',
          due_date_c: taskData.dueDate || null,
          completed_c: false,
          archived_c: false,
          created_at_c: new Date().toISOString(),
          completed_at_c: null
        }]
      };
      
      const response = await apperClient.createRecord("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create task");
      }
      
      const successfulRecords = response.results.filter(result => result.success);
      if (successfulRecords.length === 0) {
        throw new Error("Failed to create task");
      }
      
      const newTask = successfulRecords[0].data;
      return {
        Id: newTask.Id,
        title: newTask.title_c,
        description: newTask.description_c,
        categoryId: newTask.category_id_c,
        priority: newTask.priority_c,
        dueDate: newTask.due_date_c ? newTask.due_date_c.split('T')[0] : null,
        completed: newTask.completed_c,
        archived: newTask.archived_c,
        createdAt: newTask.created_at_c,
        completedAt: newTask.completed_at_c
      };
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updates) {
    await delay(300)
    
    try {
      const apperClient = getApperClient();
      
      const recordData = {};
      if (updates.title !== undefined) {
        recordData.Name = updates.title;
        recordData.title_c = updates.title;
      }
      if (updates.description !== undefined) recordData.description_c = updates.description;
      if (updates.categoryId !== undefined) recordData.category_id_c = updates.categoryId;
      if (updates.priority !== undefined) recordData.priority_c = updates.priority;
      if (updates.dueDate !== undefined) recordData.due_date_c = updates.dueDate;
      if (updates.completed !== undefined) {
        recordData.completed_c = updates.completed;
        if (updates.completed) {
          recordData.completed_at_c = new Date().toISOString();
        } else {
          recordData.completed_at_c = null;
        }
      }
      if (updates.archived !== undefined) recordData.archived_c = updates.archived;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...recordData
        }]
      };
      
      const response = await apperClient.updateRecord("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to update task");
      }
      
      const successfulRecords = response.results.filter(result => result.success);
      if (successfulRecords.length === 0) {
        throw new Error("Failed to update task");
      }
      
      const updatedTask = successfulRecords[0].data;
      return {
        Id: updatedTask.Id,
        title: updatedTask.title_c,
        description: updatedTask.description_c,
        categoryId: updatedTask.category_id_c,
        priority: updatedTask.priority_c,
        dueDate: updatedTask.due_date_c ? updatedTask.due_date_c.split('T')[0] : null,
        completed: updatedTask.completed_c,
        archived: updatedTask.archived_c,
        createdAt: updatedTask.created_at_c,
        completedAt: updatedTask.completed_at_c
      };
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error.message);
      throw new Error('Task not found');
    }
  },

  async delete(id) {
    await delay(250)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to delete task");
      }
      
      const successfulDeletions = response.results.filter(result => result.success);
      if (successfulDeletions.length === 0) {
        throw new Error("Failed to delete task");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error.message);
      throw new Error('Task not found');
    }
  },

  async getByCategory(categoryId) {
    await delay(300)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        where: [
          { FieldName: "category_id_c", Operator: "EqualTo", Values: [parseInt(categoryId)] }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async search(query) {
    await delay(200)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        whereGroups: [{
          operator: "OR",
          subGroups: [
            {
              conditions: [
                { fieldName: "title_c", operator: "Contains", values: [query] }
              ],
              operator: "OR"
            },
            {
              conditions: [
                { fieldName: "description_c", operator: "Contains", values: [query] }
              ],
              operator: "OR"
            }
          ]
        }]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error searching tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getCompleted() {
    await delay(250)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        where: [
          { FieldName: "completed_c", Operator: "EqualTo", Values: [true] },
          { FieldName: "archived_c", Operator: "EqualTo", Values: [false] }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching completed tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getPending() {
    await delay(250)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        where: [
          { FieldName: "completed_c", Operator: "EqualTo", Values: [false] },
          { FieldName: "archived_c", Operator: "EqualTo", Values: [false] }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching pending tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getOverdue() {
    await delay(250)
    
    try {
      const apperClient = getApperClient();
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        where: [
          { FieldName: "completed_c", Operator: "EqualTo", Values: [false] },
          { FieldName: "archived_c", Operator: "EqualTo", Values: [false] },
          { FieldName: "due_date_c", Operator: "LessThan", Values: [today] }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching overdue tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getDueToday() {
    await delay(250)
    
    try {
      const apperClient = getApperClient();
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "category_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "completed_c" } },
          { field: { Name: "archived_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "completed_at_c" } }
        ],
        where: [
          { FieldName: "completed_c", Operator: "EqualTo", Values: [false] },
          { FieldName: "archived_c", Operator: "EqualTo", Values: [false] },
          { FieldName: "due_date_c", Operator: "EqualTo", Values: [today] }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        categoryId: task.category_id_c || 1,
        priority: task.priority_c || 'Medium',
        dueDate: task.due_date_c ? task.due_date_c.split('T')[0] : null,
        completed: task.completed_c || false,
        archived: task.archived_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        completedAt: task.completed_at_c || null
      }));
    } catch (error) {
      console.error("Error fetching tasks due today:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async bulkDelete(ids) {
    await delay(500)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: ids.map(id => parseInt(id))
      };
      
      const response = await apperClient.deleteRecord("task_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to delete tasks");
      }
      
      const successfulDeletions = response.results.filter(result => result.success);
      
      return successfulDeletions.map(result => ({ success: true, Id: result.Id }));
    } catch (error) {
      console.error("Error bulk deleting tasks:", error?.response?.data?.message || error.message);
      return [];
    }
  }
}