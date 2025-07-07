import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const CategoryCard = ({ category, isActive, taskCount }) => {
  return (
<NavLink
to={`/category/${category.Id}`}
className={`block p-4 rounded-lg border transition-colors ${
        isActive 
          ? 'bg-blue-600 border-blue-600 text-white' 
          : 'border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: category.color }}
          >
            <ApperIcon name={category.icon} size={16} />
          </div>
          <div>
<h3 className={`font-medium ${
              isActive ? 'text-white' : 'text-gray-900'
            }`}>
              {category.name}
            </h3>
          </div>
        </div>
        
        <Badge variant="default" size="sm">
          {taskCount}
        </Badge>
      </div>
    </NavLink>
  )
}

export default CategoryCard