"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"

const EventDetails = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const res = await fetch(`https://desoc-main.onrender.com/events/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEvent(data)
      } else {
        console.error("Event not found")
      }
    } catch (error) {
      console.error("Error fetching event:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading event details...</div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <Link to="/" className="text-purple-600 hover:text-purple-800">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  const seatsLeft = event.maxParticipants - event.currentParticipants
  const isRegistrationOpen = event.isActive && new Date() <= new Date(event.registrationDeadline) && seatsLeft > 0

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl opacity-90">{event.eventType}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Event Info Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-800">Date</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <p className="font-semibold text-gray-800">Time</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-800">Venue</p>
                    <p className="text-gray-600">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <p className="font-semibold text-gray-800">Registration Deadline</p>
                    <p className="text-gray-600">{new Date(event.registrationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🎫</span>
                  <div>
                    <p className="font-semibold text-gray-800">Seats Available</p>
                    <p className={`text-lg font-bold ${seatsLeft <= 10 ? "text-red-600" : "text-green-600"}`}>
                      {seatsLeft} / {event.maxParticipants}
                    </p>
                  </div>
                </div>

                {event.isGroupEvent && (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-semibold text-gray-800">Team Size</p>
                      <p className="text-gray-600">
                        {event.minTeamSize} - {event.maxTeamSize} members
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold text-gray-800">Current Registrations</p>
                    <p className="text-gray-600">{event.currentParticipants} participants</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <p className="font-semibold text-gray-800">Event Type</p>
                    <p className="text-gray-600">{event.isGroupEvent ? "Group Event" : "Individual Event"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {event.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prizes */}
            {event.prizes && event.prizes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Prizes & Recognition</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {event.prizes.map((prize, index) => (
                    <li key={index}>{prize}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Registration Status */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Registration Status</h3>
              {isRegistrationOpen ? (
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">Registration Open</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-700 font-medium">
                    {seatsLeft <= 0
                      ? "Event Full"
                      : new Date() > new Date(event.registrationDeadline)
                        ? "Registration Closed"
                        : "Registration Closed"}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg text-center font-semibold transition-colors duration-200"
              >
                Back to Home
              </Link>

              {isRegistrationOpen ? (
                <Link
                  to="/register"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg text-center font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  Register Now
                </Link>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg text-center font-semibold cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
