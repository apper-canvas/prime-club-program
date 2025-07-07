import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Error = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
<div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <div className="flex items-center justify-center gap-3">
          <Button onClick={onRetry} variant="default">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
          
          <Button onClick={() => window.location.reload()} variant="ghost">
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Refresh Page
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>If the problem persists, please check your internet connection.</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Error