import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import TasksPage from '@/components/pages/TasksPage'
import Layout from '@/components/organisms/Layout'

function App() {
  return (
    <div className="min-h-screen bg-gradient-memphis">
      <Layout>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/category/:categoryId" element={<TasksPage />} />
          <Route path="/search" element={<TasksPage />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App