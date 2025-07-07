import { motion } from 'framer-motion'

const Loading = () => {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-20 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>

      {/* Quick Add Bar Skeleton */}
      <div className="h-16 w-full bg-gray-200 rounded-xl animate-pulse"></div>

      {/* Filters Skeleton */}
      <div className="h-16 w-full bg-gray-200 rounded-lg animate-pulse"></div>

      {/* Task Items Skeleton */}
      <div className="space-y-3">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl p-4 shadow-card"
          >
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse flex-shrink-0 mt-0.5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Floating animation for visual interest */}
      <motion.div
        className="fixed top-20 right-10 w-2 h-2 bg-primary rounded-full opacity-20"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

export default Loading