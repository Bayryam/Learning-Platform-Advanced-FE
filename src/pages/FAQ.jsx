import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { faqService } from '../api/services'
import { use, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const { showToast } = useToast()

  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isAdmin = user?.roles?.includes('ROLE_ADMIN')

  const { data, isLoading, error } = useQuery({
    queryKey: ['faq'],
    queryFn: faqService.getAllFAQs,
  })

  const createMutation = useMutation({
    mutationFn: faqService.createFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries(['faq'])
      setQuestion('')
      setAnswer('')
      setShowCreateForm(false)
      showToast('FAQ created successfully!', 'success')
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to create FAQ', 'error')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: faqService.deleteFAQ,
    onSuccess: () => {
      queryClient.invalidateQueries(['faq'])
      showToast('FAQ deleted successfully!', 'success')
    },
    onError: (error) => {
      showToast(error.response?.data?.message || 'Failed to delete FAQ', 'error')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate({ question, answer })
  }

  const handleDelete = (id) => {
    if (globalThis.confirm('Are you sure you want to delete this FAQ?')) {
      deleteMutation.mutate(id)
    }
  }

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-gray-600 text-lg">Loading FAQ...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Error loading FAQ: {error.message}
          </div>
        </div>
      </div>
    )
  }

  const faqs = data?.data || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg">Find answers to common questions</p>
        </div>

        {isAdmin && (
          <div className="mb-8">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              {showCreateForm ? '✕ Cancel' : '+ Add New FAQ'}
            </button>

            {showCreateForm && (
              <div className="mt-6 bg-white rounded-xl shadow-lg p-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New FAQ</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      required
                      placeholder="Enter the question..."
                    />
                  </div>

                  <div>
                    <label htmlFor="answer" className="block text-sm font-semibold text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      id="answer"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                      required
                      placeholder="Enter the answer..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create FAQ'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {faqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-indigo-100">
            <div className="text-6xl mb-4">❓</div>
            <p className="text-gray-500 text-xl">No FAQs available yet.</p>
            {isAdmin && (
              <p className="text-gray-400 mt-2">Click the button above to add your first FAQ!</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-indigo-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="text-3xl group-hover:scale-110 transition-transform">
                      {openIndex === index ? '❓' : '💭'}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(faq.id)
                        }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        title="Delete FAQ"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <span className="text-3xl text-indigo-600 transition-transform group-hover:scale-110">
                      {openIndex === index ? '−' : '+'}
                    </span>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                    <div className="pt-6 flex items-start gap-4">
                      <span className="text-2xl">💡</span>
                      <p className="text-gray-700 leading-relaxed flex-1">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FAQ