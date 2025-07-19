"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const EventsList = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, upcoming, past

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date)
    const now = new Date()

    if (filter === "upcoming") return eventDate >= now
    if (filter === "past") return eventDate < now
    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">All Events</h1>
          <p className="text-xl text-gray-600">Discover amazing events by DESOC</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                filter === "all" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                filter === "upcoming" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                filter === "past" ? "bg-purple-600 text-white" : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No events found for the selected filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const seatsLeft = event.maxParticipants - event.currentParticipants
              const isUpcoming = new Date(event.date) >= new Date()
              const isRegistrationOpen =
                event.isActive && new Date() <= new Date(event.registrationDeadline) && seatsLeft > 0

              return (
                <div
                  key={event._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    {/* Event Status Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isUpcoming ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Past Event"}
                      </span>
                      {event.isGroupEvent && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Group Event
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <p>
                        <strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>🕐 Time:</strong> {event.time}
                      </p>
                      <p>
                        <strong>📍 Venue:</strong> {event.venue}
                      </p>
                      <p>
                        <strong>🎫 Seats:</strong>
                        <span className={`ml-1 font-semibold ${seatsLeft <= 10 ? "text-red-600" : "text-green-600"}`}>
                          {seatsLeft} left
                        </span>
                      </p>
                      {event.isGroupEvent && (
                        <p>
                          <strong>👥 Team Size:</strong> {event.minTeamSize}-{event.maxTeamSize} members
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        to={`/events/${event._id}`}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors duration-200"
                      >
                        View Details
                      </Link>
                      {isUpcoming && (
                        <Link
                          to="/register"
                          className={`flex-1 py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors duration-200 ${
                            isRegistrationOpen
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-gray-400 text-white cursor-not-allowed"
                          }`}
                        >
                          {isRegistrationOpen ? "Register Now" : "Registration Closed"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventsList
