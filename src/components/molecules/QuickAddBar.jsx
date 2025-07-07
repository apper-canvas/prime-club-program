import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { taskService } from '@/services/api/taskService'

const QuickAddBar = ({ onTaskAdded, categories }) => {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [categoryId, setCategoryId] = useState(categories[0]?.Id || 1)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    setIsLoading(true)
    try {
      const newTask = await taskService.create({
        title: title.trim(),
        description: '',
        categoryId: parseInt(categoryId),
        priority,
        dueDate: dueDate || null
      })
      
      onTaskAdded(newTask)
      setTitle('')
      setDueDate('')
      setPriority('Medium')
      setCategoryId(categories[0]?.Id || 1)
      setIsExpanded(false)
      toast.success('Task added successfully! 🎉')
    } catch (error) {
      toast.error('Failed to add task')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

return (
    <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-xl p-4 shadow-lg border-4 border-white">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title Row */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task... (Press Enter to save)"
              className="border-0 bg-white/90 focus:ring-0 focus:ring-offset-0 text-base placeholder:text-gray-500 rounded-lg"
              disabled={isLoading}
            />
          </div>
          
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={toggleExpanded}
            className="flex-shrink-0 bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <ApperIcon name={isExpanded ? "ChevronUp" : "Settings"} size={16} />
          </Button>
          
          <Button
            type="submit"
            size="sm"
            disabled={!title.trim() || isLoading}
            className="flex-shrink-0 bg-white text-purple-600 hover:bg-gray-100"
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        {/* Expanded Fields */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-white/30">
            {/* Due Date */}
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-0 bg-white/90 focus:ring-0 focus:ring-offset-0 text-sm rounded-lg"
                disabled={isLoading}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border-0 bg-white/90 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isLoading}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-white mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border-0 bg-white/90 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <option key={category.Id} value={category.Id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default QuickAddBar