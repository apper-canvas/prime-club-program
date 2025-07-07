import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = 'No tasks yet', 
  description = 'Create your first task to get started with TaskFlow.',
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-6"
    >
<div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <ApperIcon name="CheckSquare" size={48} className="text-white" />
      </div>
      
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
        {title}
      </h2>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {showAction && (
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Your First Task
          </Button>
          
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go to All Tasks
          </Button>
        </div>
      )}
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-lg mx-auto">
        <div className="text-center">
<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
<ApperIcon name="Zap" size={24} className="text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900">Quick Add</h3>
          <p className="text-sm text-gray-600">Add tasks instantly with Enter</p>
        </div>
        
        <div className="text-center">
<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
<ApperIcon name="Tag" size={24} className="text-yellow-600" />
          </div>
          <h3 className="font-medium text-gray-900">Organize</h3>
          <p className="text-sm text-gray-600">Sort by categories and priority</p>
        </div>
        
        <div className="text-center">
<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
<ApperIcon name="TrendingUp" size={24} className="text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900">Track Progress</h3>
          <p className="text-sm text-gray-600">Monitor your productivity</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty