// src/pages/FAQ.jsx
import { useQuery } from '@tanstack/react-query'
import { faqService } from '../api/services'
import { useState } from 'react'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['faq'],
    queryFn: faqService.getAllFAQs,
  })

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading FAQ...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-red-600">Error loading FAQ: {error.message}</div>
      </div>
    )
  }

  const faqs = data?.data || []

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

      {faqs.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">No FAQs available yet.</p>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white rounded-lg shadow">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <span className="text-2xl">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="p-4 border-t">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FAQ