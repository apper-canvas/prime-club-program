import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const CategoryCard = ({ category, isActive, taskCount }) => {
  return (
    <NavLink
to={`/category/${category.Id}`}
      className={`block p-4 rounded-xl border-4 transition-all duration-200 hover:bg-gradient-accent hover-scale transform hover:rotate-1 ${
        isActive 
          ? 'bg-gradient-primary border-memphis-yellow shadow-memphis' 
          : 'border-memphis-blue hover:border-memphis-pink bg-gradient-surface'
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