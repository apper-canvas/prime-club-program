import { motion } from 'framer-motion'

const ProgressIndicator = ({ completed, total }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return (
    <div className="bg-surface rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900">Today's Progress</h3>
        <span className="text-sm text-gray-500">
          {completed} of {total} tasks
        </span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-center mt-2">
          <motion.span
            className="text-2xl font-bold text-primary progress-ring"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator