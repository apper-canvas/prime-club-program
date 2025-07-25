// Initialize ApperClient for category operations
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const categoryService = {
  async getAll() {
    await delay(200)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "task_count_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B4FE9',
        icon: category.icon_c || 'Folder',
        taskCount: category.task_count_c || 0
      }));
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error.message);
      return [];
    }
  },

  async getById(id) {
    await delay(150)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "color_c" } },
          { field: { Name: "icon_c" } },
          { field: { Name: "task_count_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("category_c", parseInt(id), params);
      
      if (!response.success) {
        throw new Error('Category not found');
      }
      
      const category = response.data;
      return {
        Id: category.Id,
        name: category.Name || '',
        color: category.color_c || '#5B4FE9',
        icon: category.icon_c || 'Folder',
        taskCount: category.task_count_c || 0
      };
    } catch (error) {
      console.error("Error fetching category:", error?.response?.data?.message || error.message);
      throw new Error('Category not found');
    }
  },

  async create(categoryData) {
    await delay(300)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: categoryData.name || '',
          color_c: categoryData.color || '#5B4FE9',
          icon_c: categoryData.icon || 'Folder',
          task_count_c: 0
        }]
      };
      
      const response = await apperClient.createRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to create category");
      }
      
      const successfulRecords = response.results.filter(result => result.success);
      if (successfulRecords.length === 0) {
        throw new Error("Failed to create category");
      }
      
      const newCategory = successfulRecords[0].data;
      return {
        Id: newCategory.Id,
        name: newCategory.Name,
        color: newCategory.color_c,
        icon: newCategory.icon_c,
        taskCount: newCategory.task_count_c
      };
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, updates) {
    await delay(250)
    
    try {
      const apperClient = getApperClient();
      
      const recordData = {};
      if (updates.name !== undefined) recordData.Name = updates.name;
      if (updates.color !== undefined) recordData.color_c = updates.color;
      if (updates.icon !== undefined) recordData.icon_c = updates.icon;
      if (updates.taskCount !== undefined) recordData.task_count_c = updates.taskCount;
      
      const params = {
        records: [{
          Id: parseInt(id),
          ...recordData
        }]
      };
      
      const response = await apperClient.updateRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to update category");
      }
      
      const successfulRecords = response.results.filter(result => result.success);
      if (successfulRecords.length === 0) {
        throw new Error("Failed to update category");
      }
      
      const updatedCategory = successfulRecords[0].data;
      return {
        Id: updatedCategory.Id,
        name: updatedCategory.Name,
        color: updatedCategory.color_c,
        icon: updatedCategory.icon_c,
        taskCount: updatedCategory.task_count_c
      };
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error.message);
      throw new Error('Category not found');
    }
  },

  async delete(id) {
    await delay(200)
    
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to delete category");
      }
      
      const successfulDeletions = response.results.filter(result => result.success);
      if (successfulDeletions.length === 0) {
        throw new Error("Failed to delete category");
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error.message);
      throw new Error('Category not found');
    }
  },

  async updateTaskCount(categoryId, count) {
    await delay(100)
    
    try {
      return await this.update(categoryId, { taskCount: count });
    } catch (error) {
      console.error("Error updating task count:", error?.response?.data?.message || error.message);
      return null;
    }
  }
}