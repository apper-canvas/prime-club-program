import { useState, useEffect } from 'react'
import { useParams, useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import TaskItem from '@/components/molecules/TaskItem'
import QuickAddBar from '@/components/molecules/QuickAddBar'
import SearchBar from '@/components/molecules/SearchBar'
import ProgressIndicator from '@/components/molecules/ProgressIndicator'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { categoryService } from '@/services/api/categoryService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'

const TaskList = () => {
  const { categoryId } = useParams()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('q')
  
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        searchQuery ? taskService.search(searchQuery) :
        categoryId ? taskService.getByCategory(categoryId) :
        taskService.getAll()
      ])
      
      setCategories(categoriesData)
      setTasks(tasksData)
    } catch (err) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [categoryId, searchQuery])

  const handleTaskAdded = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskDeleted = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  const handleSearch = (query) => {
    // Search functionality is handled by URL params and useEffect
  }

  const filteredTasks = tasks.filter(task => {
    if (task.archived) return false
    
    switch (filter) {
      case 'completed':
        return task.completed
      case 'pending':
case 'pending':
        return !task.completed
      case 'overdue':
        return !task.completed && task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0)
      default:
    }
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
case 'priority': {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const completedCount = tasks.filter(t => t.completed && !t.archived).length
  const totalCount = tasks.filter(t => !t.archived).length

  const getPageTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`
    if (categoryId) {
      const category = categories.find(c => c.Id === parseInt(categoryId))
      return category ? `${category.name} Tasks` : 'Category Tasks'
    }
    return 'All Tasks'
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          {getPageTitle()}
        </h1>
        <ProgressIndicator completed={completedCount} total={totalCount} />
      </div>

      {/* Categories Menu */}
<div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
<span className="text-sm font-medium text-gray-700">Categories</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <NavLink
            to="/"
            className={({ isActive }) =>
`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive && !categoryId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`
            }
          >
            All Tasks
          </NavLink>
          {categories.map((category) => (
            <NavLink
              key={category.Id}
              to={`/category/${category.Id}`}
              className={({ isActive }) =>
`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive && parseInt(categoryId) === category.Id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`
              }
            >
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Quick Add Bar */}
      {!searchQuery && (
        <QuickAddBar onTaskAdded={handleTaskAdded} categories={categories} />
      )}
{/* Filters and Sort */}
<div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center gap-2">
<span className="text-sm font-medium text-gray-700 mr-2">Filter:</span>
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'ghost'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={filter === 'pending' ? 'default' : 'ghost'}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'default' : 'ghost'}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
          <Button
            size="sm"
            variant={filter === 'overdue' ? 'error' : 'ghost'}
            onClick={() => setFilter('overdue')}
          >
            Overdue
          </Button>
        </div>

<div className="flex items-center gap-2">
<span className="text-sm font-medium text-gray-700 mr-2">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="created">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

{/* Task List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <Empty
            title={searchQuery ? 'No tasks found' : 'No tasks yet'}
            description={searchQuery ? 
              'Try adjusting your search terms or create a new task.' :
              'Create your first task to get started with TaskFlow.'
            }
          />
        ) : (
          <AnimatePresence>
            {sortedTasks.map((task) => (
              <div key={task.Id} className="group">
                <TaskItem
                  task={task}
                  onUpdate={handleTaskUpdated}
                  onDelete={handleTaskDeleted}
                  categories={categories}
                />
              </div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Task Count */}
      <div className="text-center text-sm text-gray-500 pt-4">
        {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'} shown
      </div>
    </div>
  )
}

export default TaskList