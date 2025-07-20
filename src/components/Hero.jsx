"use client"

import { useState, useEffect } from "react"
import desocCover from "../assets/desoc_cover.png"
import desoc from "../assets/desoc.png"
import name from "../assets/name.png"
import { Link } from "react-router-dom"

import Events from "./Events"
import Committee from "./Committee"

const Hero = () => {
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchAnnouncements()
    fetchEvents()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch("https://desoc-main.onrender.com/announcements")
      if (res.ok) {
        const data = await res.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error("Error fetching announcements:", error)
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://desoc-main.onrender.com/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(data.slice(0, 3)) // Show only first 3 events
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date())

  return (
    <div className="relative w-full overflow-x-hidden">
      <div
        className="fixed top-0 left-0 w-full h-screen bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${desocCover})`,
        }}
      />

      <div className="bg-white text-black w-[90vw] mx-auto min-h-screen rounded-t-[10px] pt-24 mt-24 relative z-10">
        {/* Announcements Banner */}
        {announcements.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white py-3 px-6 mx-6 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📢</span>
                <span className="font-semibold">Latest Announcements:</span>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {announcements.slice(0, 2).map((announcement) => (
                <div key={announcement._id} className="text-sm opacity-90">
                  <span className="font-medium">{announcement.title}:</span> {announcement.content}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between px-6 lg:px-24 gap-12 lg:gap-24">
          <div className="flex-1">
            <img src={name || "/placeholder.svg"} alt="DESOC Name" className="w-full max-w-[500px] mx-auto lg:mx-0" />
          </div>
          <div className="flex-1">
            <img
              src={desoc || "/placeholder.svg"}
              alt="DESOC Logo"
              className="w-full max-w-[500px] mx-auto lg:mx-0 pt-0 lg:pt-12"
            />
          </div>
        </div>

        <div className="px-6">
          <h3 className="pt-12 text-xl lg:text-3xl text-center leading-relaxed">
            "Inspiring a future where technology and design harmoniously advance society through innovation and
            creativity."
          </h3>
        </div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="px-6 mt-12" id="events">
            <div className="flex justify-center">
              <h2 className="bg-red-600 text-white text-xl lg:text-[2.2rem] px-5 py-2.5 rounded-lg w-fit text-center">
                Upcoming Events
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <div className="p-6">
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
                        <span
                          className={`ml-1 font-semibold ${
                            (event.maxParticipants - event.currentParticipants) <= 10
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {event.maxParticipants - event.currentParticipants} left
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
                      <Link
                        to="/register"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors duration-200"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {events.length > 3 && (
              <div className="text-center mt-8">
                <Link
                  to="/events"
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  View All Events
                </Link>
              </div>
            )}
          </div>
        )}

        <Events />
        <Committee />
      </div>
    </div>
  )
}

export default Hero
