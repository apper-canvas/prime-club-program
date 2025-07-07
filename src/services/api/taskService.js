import tasksData from '@/services/mockData/tasks.json'

let tasks = [...tasksData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error('Task not found')
    }
    return { ...task }
  },

  async create(taskData) {
    await delay(400)
    const newTask = {
      Id: Math.max(...tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(300)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updates,
      completedAt: updates.completed && !tasks[index].completed ? new Date().toISOString() : 
                   !updates.completed && tasks[index].completed ? null : 
                   tasks[index].completedAt
    }
    
    tasks[index] = updatedTask
    return { ...updatedTask }
  },

  async delete(id) {
    await delay(250)
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    const deletedTask = tasks.splice(index, 1)[0]
    return { ...deletedTask }
  },

  async getByCategory(categoryId) {
    await delay(300)
    return tasks.filter(t => t.categoryId === parseInt(categoryId))
  },

  async search(query) {
    await delay(200)
    const searchTerm = query.toLowerCase()
    return tasks.filter(t => 
      t.title.toLowerCase().includes(searchTerm) ||
      t.description.toLowerCase().includes(searchTerm)
    )
  },

  async getCompleted() {
    await delay(250)
    return tasks.filter(t => t.completed && !t.archived)
  },

  async getPending() {
    await delay(250)
    return tasks.filter(t => !t.completed && !t.archived)
  },

  async getOverdue() {
    await delay(250)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return tasks.filter(t => {
      if (t.completed || t.archived || !t.dueDate) return false
      const dueDate = new Date(t.dueDate)
      return dueDate < today
    })
  },

  async getDueToday() {
    await delay(250)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return tasks.filter(t => {
      if (t.completed || t.archived || !t.dueDate) return false
      const dueDate = new Date(t.dueDate)
      return dueDate >= today && dueDate < tomorrow
    })
  },

  async bulkDelete(ids) {
    await delay(500)
    const deletedTasks = []
    
    ids.forEach(id => {
      const index = tasks.findIndex(t => t.Id === parseInt(id))
      if (index !== -1) {
        deletedTasks.push(tasks.splice(index, 1)[0])
      }
    })
    
    return deletedTasks
  }
}