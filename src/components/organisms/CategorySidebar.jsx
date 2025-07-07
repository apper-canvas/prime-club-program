import { useState, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import CategoryCard from '@/components/molecules/CategoryCard'
import { categoryService } from '@/services/api/categoryService'
import { taskService } from '@/services/api/taskService'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const CategorySidebar = () => {
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [taskCounts, setTaskCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [categoriesData, tasksData] = await Promise.all([
        categoryService.getAll(),
        taskService.getAll()
      ])
      
      setCategories(categoriesData)
      
      // Calculate task counts per category
      const counts = {}
      categoriesData.forEach(category => {
        counts[category.Id] = tasksData.filter(
          task => task.categoryId === category.Id && !task.archived
        ).length
      })
      setTaskCounts(counts)
      
    } catch (err) {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="w-64 bg-surface border-r border-gray-200 p-4 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg font-display font-semibold text-gray-900 mb-4">
          Categories
        </h2>
        
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 hover-scale ${
              isActive && !categoryId
                ? 'bg-primary/5 text-primary shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`
          }
        >
          <ApperIcon name="Home" size={20} />
          <span className="font-medium">All Tasks</span>
        </NavLink>
      </div>

      <div className="space-y-2 flex-1">
        {categories.map((category) => (
          <CategoryCard
            key={category.Id}
            category={category}
            isActive={parseInt(categoryId) === category.Id}
            taskCount={taskCounts[category.Id] || 0}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <NavLink
          to="/search"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 hover-scale ${
              isActive
                ? 'bg-primary/5 text-primary shadow-sm'
                : 'text-gray-700 hover:text-gray-900'
            }`
          }
        >
          <ApperIcon name="Search" size={20} />
          <span className="font-medium">Search</span>
        </NavLink>
      </div>
    </div>
  )
}

export default CategorySidebar