// src/pages/GroupDetail.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupService } from '../api/services'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function GroupDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [articleContent, setArticleContent] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupService.getGroupById(id),
  })

  const leaveMutation = useMutation({
    mutationFn: () => groupService.leaveGroup(id),
    onSuccess: () => {
      navigate('/groups')
    },
  })

  const joinMutation = useMutation({
    mutationFn: () => groupService.joinGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['group', id])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => groupService.deleteGroup(id),
    onSuccess: () => {
      navigate('/groups')
    },
    onError: (error) => {
      alert('Failed to delete group: ' + (error.response?.data?.message || error.message))
    },
  })

  const createArticleMutation = useMutation({
    mutationFn: (content) => groupService.createArticle(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['group', id])
      setArticleContent('')
    },
    onError: (error) => {
      alert('Failed to create article: ' + (error.response?.data?.message || error.message))
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading group...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading group: {error.message}</div>
      </div>
    )
  }

  const group = data?.group || data
  const articles = (data?.articles || group?.articles || [])
    .sort((a, b) => {
      // Sort by creation date, newest first
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)
      return dateB - dateA
    })

  // Check if current user is a member of the group
  const isMember = group?.members?.some(member => member.username === user?.username) || false

  const isAdmin = user?.roles?.some(role => {
    if (typeof role === 'string') {
      return role === 'ADMIN' || role === 'ROLE_ADMIN'
    }
    return role?.authority === 'ADMIN' || role?.authority === 'ROLE_ADMIN'
  }) || false


  const handleSubmitArticle = (e) => {
    e.preventDefault()
    if (articleContent.trim()) {
      createArticleMutation.mutate(articleContent)
    }
  }

  const handleDeleteGroup = () => {
    if (globalThis.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteMutation.mutate()
    }
  }

  return (
    <div className="container mx-auto p-8">
      {/* Group Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg mb-8 overflow-hidden border-2 border-blue-100">
        {group.image?.image && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={`data:image/png;base64,${group.image.image}`}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-8 bg-white bg-opacity-80 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">{group.name}</h1>
          <p className="text-gray-700 text-lg mb-4">{group.description}</p>
          <p className="text-gray-600 mb-6 font-medium">
            👥 Number of Members: {group.members?.length || 0}
          </p>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => navigate('/groups')}
              className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium"
            >
              ← Back to all groups
            </button>

            {!isMember && (
              <button
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg font-medium"
              >
                {joinMutation.isPending ? 'Joining...' : '✓ Join Group'}
              </button>
            )}

            {isMember && (
              <button
                onClick={() => leaveMutation.mutate()}
                disabled={leaveMutation.isPending}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg font-medium"
              >
                {leaveMutation.isPending ? 'Leaving...' : '✗ Leave Group'}
              </button>
            )}

            {isAdmin && (
              <button
                onClick={handleDeleteGroup}
                disabled={deleteMutation.isPending}
                className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg ml-auto font-medium"
                title="Administrator: Delete Group"
              >
                {deleteMutation.isPending ? 'Deleting...' : '🗑️ Delete Group'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Show message if not a member */}
      {!isMember && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-8 mb-8 text-center shadow-lg">
          <h2 className="text-blue-900 text-2xl font-bold mb-2">
            🔒 Join this group to participate
          </h2>
          <p className="text-blue-700 text-lg">
            You must be a member to view and create articles in this group.
          </p>
        </div>
      )}

      {/* Create Article Form - Only visible to members */}
      {isMember && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 mb-8 border-2 border-purple-100">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">✍️ Write something...</h2>
          <form onSubmit={handleSubmitArticle}>
            <textarea
              className="w-full border-2 border-purple-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
              rows="4"
              placeholder="Share your thoughts..."
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={createArticleMutation.isPending}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-all shadow-md hover:shadow-lg font-medium"
            >
              {createArticleMutation.isPending ? 'Posting...' : '📝 Post Article'}
            </button>
          </form>
        </div>
      )}

      {/* Articles Section - Greyed out if not a member */}
      <div className={`bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg shadow-lg p-6 border-2 border-gray-200 ${isMember ? '' : 'opacity-40 pointer-events-none select-none'}`}>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">📰 Articles</h2>
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No articles yet. Be the first to post!</p>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {article.author?.profilePictureBase64 && (
                    <img
                      src={article.author.profilePictureBase64}
                      alt={article.author.firstName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-blue-200"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-lg text-gray-900">
                        {article.author?.firstName} {article.author?.lastName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        • {article.author?.roles?.join(', ')}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{article.content}</p>
                    {article.createdAt && (
                      <p className="text-gray-400 text-sm mt-2">
                        🕒 {new Date(article.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupDetail




