import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const searchQuery = searchParams.get('q')
    if (searchQuery) {
      setQuery(searchQuery)
    } else {
      setQuery('')
    }
  }, [location.search])

  const handleSearch = (e) => {
    e.preventDefault()
    
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      onSearch(query.trim())
    } else {
      navigate('/')
      onSearch('')
    }
  }

  const handleClear = () => {
    setQuery('')
    navigate('/')
    onSearch('')
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <ApperIcon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 pr-10"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
            >
              <ApperIcon name="X" size={14} />
            </Button>
          )}
        </div>
        
        <Button type="submit" size="sm" variant="outline">
          <ApperIcon name="Search" size={14} />
        </Button>
      </form>
    </div>
  )
}

export default SearchBar