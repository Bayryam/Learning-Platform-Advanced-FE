// src/pages/News.jsx
import { useQuery } from '@tanstack/react-query'
import { newsService } from '../api/services'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function News() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: newsService.getAllNews,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading news...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading news: {error.message}</div>
      </div>
    )
  }

  const newsList = data?.data || []
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Latest News</h1>
        {isAdmin && (
          <button
            onClick={() => navigate('/news/create')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create News
          </button>
        )}
      </div>

      {newsList.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No news available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsList.map(news => (
            <div key={news.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{news.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(news.publishedDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">{news.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default News