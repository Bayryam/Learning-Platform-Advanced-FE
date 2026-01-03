// src/pages/AssignmentSubmit.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { assignmentService } from '../api/services'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'

function AssignmentSubmit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { showToast } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentService.getAssignmentById(id),
  })

  const uploadMutation = useMutation({
    mutationFn: (formData) => assignmentService.uploadSolution(formData),
    onSuccess: () => {
      showToast('Solution uploaded successfully!', 'success')
      setSelectedFile(null)
      queryClient.invalidateQueries(['assignment', id])
      queryClient.invalidateQueries(['assignments'])
      setTimeout(() => navigate('/assignments'), 2000)
    },
    onError: (err) => {
      showToast(err.response?.data?.error || 'Failed to upload solution', 'error')
    },
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!selectedFile) {
      setError('Please select a file to upload')
      return
    }

    const formData = new FormData()
    formData.append('assignmentId', id)
    formData.append('solutionFile', selectedFile)

    uploadMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading assignment...</div>
      </div>
    )
  }

  const assignment = data?.data?.assignment
  const courseName = data?.data?.courseName
  const userSolutionUploaded = data?.data?.userSolutionUploaded

  if (userSolutionUploaded) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
              <p className="text-lg font-semibold">✓ Solution Already Submitted</p>
              <p className="mt-2">You have already uploaded a solution for this assignment.</p>
            </div>
            <button
              onClick={() => navigate('/assignments')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Assignments
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Submit Assignment</h1>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
          <p className="text-gray-600 mb-2">{assignment.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Course: {courseName}</span>
            <span>Due: {new Date(assignment.dueDate).toLocaleString()}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block font-semibold mb-2">Upload Your Solution</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              accept=".pdf,.doc,.docx,.zip,.txt,.java,.py,.cpp,.c,.js,.html,.css"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Accepted formats: PDF, DOC, DOCX, ZIP, TXT, code files
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={uploadMutation.isPending || !selectedFile}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Submit Solution'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/assignments')}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentSubmit