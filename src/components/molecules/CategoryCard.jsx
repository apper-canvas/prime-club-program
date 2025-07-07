import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const CategoryCard = ({ category, isActive, taskCount }) => {
  return (
    <NavLink
      to={`/category/${category.Id}`}
      className={`block p-3 rounded-lg border-l-4 transition-all duration-200 hover:bg-gray-50 hover-scale ${
        isActive 
          ? 'bg-primary/5 border-l-primary shadow-sm' 
          : 'border-l-gray-200 hover:border-l-gray-300'
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
              isActive ? 'text-primary' : 'text-gray-900'
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