import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isPast } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { taskService } from '@/services/api/taskService'

const TaskItem = ({ task, onUpdate, onDelete, categories }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description)
  const [isLoading, setIsLoading] = useState(false)

  const category = categories.find(c => c.Id === task.categoryId)
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && !task.completed
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate))

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const updated = await taskService.update(task.Id, { completed: !task.completed })
      onUpdate(updated)
      
      if (!task.completed) {
        toast.success('Task completed! 🎉')
      } else {
        toast.info('Task marked as incomplete')
      }
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editTitle.trim()) {
      toast.error('Task title cannot be empty')
      return
    }

    setIsLoading(true)
    try {
      const updated = await taskService.update(task.Id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      })
      onUpdate(updated)
      setIsEditing(false)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true)
      try {
        await taskService.delete(task.Id)
        onDelete(task.Id)
        toast.success('Task deleted successfully')
      } catch (error) {
        toast.error('Failed to delete task')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'high'
      case 'Medium': return 'medium'
      case 'Low': return 'low'
      default: return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`bg-surface rounded-xl p-4 shadow-card hover:shadow-hover transition-all duration-200 hover-lift ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleComplete}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
                className="font-medium"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Task description"
                rows={2}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-transparent resize-none"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-medium text-gray-900 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}>
                  {task.title}
                </h3>
                <Badge variant={getPriorityVariant(task.priority)} size="sm">
                  {task.priority}
                </Badge>
              </div>
              
              {task.description && (
                <p className={`text-sm text-gray-600 mb-2 ${
                  task.completed ? 'line-through' : ''
                }`}>
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {category && (
                    <div className="flex items-center gap-1">
                      <ApperIcon name={category.icon} size={16} />
                      <span>{category.name}</span>
                    </div>
                  )}
                  
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 ${
                      isOverdue ? 'text-error' : isDueToday ? 'text-accent' : 'text-gray-500'
                    }`}>
                      <ApperIcon name="Calendar" size={16} />
                      <span>
                        {isToday(new Date(task.dueDate)) ? 'Today' : format(new Date(task.dueDate), 'MMM d')}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem