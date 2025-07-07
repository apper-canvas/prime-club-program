import { useState } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { taskService } from '@/services/api/taskService'

const QuickAddBar = ({ onTaskAdded, categories }) => {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
        categoryId: categories[0]?.Id || 1,
        priority: 'Medium',
        dueDate: null
      })
      
      onTaskAdded(newTask)
      setTitle('')
      toast.success('Task added successfully! 🎉')
    } catch (error) {
      toast.error('Failed to add task')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-surface rounded-xl p-4 shadow-card border border-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task... (Press Enter to save)"
            className="border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-base placeholder:text-gray-400"
            disabled={isLoading}
          />
        </div>
        
        <Button
          type="submit"
          size="sm"
          disabled={!title.trim() || isLoading}
          className="flex-shrink-0"
        >
          <ApperIcon name="Plus" size={16} />
        </Button>
      </form>
    </div>
  )
}

export default QuickAddBar