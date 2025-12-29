// src/components/AnnouncementBanner.jsx
import { useQuery } from '@tanstack/react-query'
import { announcementService } from '../api/services'
import { useState, useEffect } from 'react'

function AnnouncementBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const { data } = useQuery({
    queryKey: ['announcements'],
    queryFn: announcementService.getAllActiveAnnouncements,
    refetchInterval: 60000, // Refetch every minute
  })

  const announcements = data?.data || []

  useEffect(() => {
    if (announcements.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
      }, 5000) // Change announcement every 5 seconds

      return () => clearInterval(timer)
    }
  }, [announcements.length])

  if (!isVisible || announcements.length === 0) {
    return null
  }

  const currentAnnouncement = announcements[currentIndex]

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 relative">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-bold mr-2">📢</span>
          <p className="font-semibold">{currentAnnouncement}</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-700 hover:text-yellow-900"
        >
          ✕
        </button>
      </div>
      {announcements.length > 1 && (
        <div className="flex gap-1 justify-center mt-2">
          {announcements.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentIndex ? 'bg-yellow-600' : 'bg-yellow-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AnnouncementBanner