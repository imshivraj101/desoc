"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    branch: "",
    eventId: "",
    isGroupRegistration: false,
    teamName: "",
    teamMembers: [],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch("https://desoc-main.onrender.com/events")
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, eventId: data[0]._id }))
          setSelectedEvent(data[0])
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target

    if (id === "eventId") {
      const event = events.find((e) => e._id === value)
      setSelectedEvent(event)
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        isGroupRegistration: false,
        teamMembers: [],
      }))
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [id]: checked,
        teamMembers: checked ? [{ name: "", email: "", phone: "", college: "", year: "", branch: "" }] : [],
      }))
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers]
    updatedMembers[index][field] = value
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }))
  }

  const addTeamMember = () => {
    if (selectedEvent && formData.teamMembers.length < selectedEvent.maxTeamSize - 1) {
      setFormData((prev) => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: "", email: "", phone: "", college: "", year: "", branch: "" }],
      }))
    }
  }

  const removeTeamMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch("https://desoc-main.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        alert("✅ Registration successful! Check your email for confirmation.")
        setFormData({
          name: "",
          email: "",
          phone: "",
          college: "",
          year: "",
          branch: "",
          eventId: events[0]?._id || "",
          isGroupRegistration: false,
          teamName: "",
          teamMembers: [],
        })
        fetchEvents() // Refresh events to update seat count
      } else {
        alert(`❌ ${data.message}`)
      }
    } catch (err) {
      console.error("Error:", err)
      alert("⚠️ Server error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    navigate("/")
  }

  const isRegistrationClosed =
    selectedEvent &&
    (!selectedEvent.isActive ||
      new Date() > new Date(selectedEvent.registrationDeadline) ||
      selectedEvent.currentParticipants >= selectedEvent.maxParticipants)

  const seatsLeft = selectedEvent ? selectedEvent.maxParticipants - selectedEvent.currentParticipants : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Event Registration</h1>
            <p className="text-xl text-gray-300">Join us for an amazing experience at DESOC events!</p>
          </div>
          {localStorage.getItem("adminToken") && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="md:flex">
            {/* Left side - Form */}
            <div className="md:w-2/3 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Register Now</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Selection */}
                <div>
                  <label htmlFor="eventId" className="block text-sm font-medium text-gray-700 mb-2">
                    Select Event *
                  </label>
                  <select
                    id="eventId"
                    value={formData.eventId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select an event</option>
                    {events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title} - {new Date(event.date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Info */}
                {selectedEvent && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">{selectedEvent.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <p>
                        <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong> {selectedEvent.time}
                      </p>
                      <p>
                        <strong>Venue:</strong> {selectedEvent.venue}
                      </p>
                      <p>
                        <strong>Seats Left:</strong>
                        <span className={`ml-1 font-semibold ${seatsLeft <= 10 ? "text-red-600" : "text-green-600"}`}>
                          {seatsLeft}
                        </span>
                      </p>
                    </div>
                    {selectedEvent.isGroupEvent && (
                      <p className="text-sm text-blue-600 mt-2">
                        <strong>Group Event:</strong> Team size: {selectedEvent.minTeamSize}-{selectedEvent.maxTeamSize}{" "}
                        members
                      </p>
                    )}
                    {isRegistrationClosed && (
                      <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                        Registration is closed for this event
                      </div>
                    )}
                  </div>
                )}

                {/* Group Registration Toggle */}
                {selectedEvent?.isGroupEvent && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isGroupRegistration"
                      checked={formData.isGroupRegistration}
                      onChange={handleChange}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isGroupRegistration" className="ml-2 block text-sm text-gray-900">
                      Register as a team
                    </label>
                  </div>
                )}

                {/* Team Name */}
                {formData.isGroupRegistration && (
                  <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      placeholder="Enter your team name"
                      value={formData.teamName}
                      onChange={handleChange}
                      required={formData.isGroupRegistration}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}

                {/* Personal Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.isGroupRegistration ? "Team Leader Name *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      placeholder="+91 9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
                      College/Institution *
                    </label>
                    <input
                      type="text"
                      id="college"
                      placeholder="Your college name"
                      value={formData.college}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study *
                    </label>
                    <select
                      id="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-2">
                      Branch/Department *
                    </label>
                    <select
                      id="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Team Members */}
                {formData.isGroupRegistration && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-800">Team Members</h3>
                      {selectedEvent && formData.teamMembers.length < selectedEvent.maxTeamSize - 1 && (
                        <button
                          type="button"
                          onClick={addTeamMember}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Add Member
                        </button>
                      )}
                    </div>

                    {formData.teamMembers.map((member, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-gray-700">Member {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeTeamMember(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                            required={formData.isGroupRegistration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={member.email}
                            onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                            required={formData.isGroupRegistration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <input
                            type="tel"
                            placeholder="Phone"
                            value={member.phone}
                            onChange={(e) => handleTeamMemberChange(index, "phone", e.target.value)}
                            required={formData.isGroupRegistration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="College"
                            value={member.college}
                            onChange={(e) => handleTeamMemberChange(index, "college", e.target.value)}
                            required={formData.isGroupRegistration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <select
                            value={member.year}
                            onChange={(e) => handleTeamMemberChange(index, "year", e.target.value)}
                            required={formData.isGroupRegistration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select Year</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                            <option value="Graduate">Graduate</option>
                            <option value="Other">Other</option>
                          </select>
                          <select
                            value={member.branch}
                            onChange={(e) => handleTeamMemberChange(index, "branch", e.target.value)}
                            required={formData.isGroupRegistration}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select Branch</option>
                            <option value="Computer Engineering">Computer Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                            <option value="Civil Engineering">Civil Engineering</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isRegistrationClosed}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Registering..." : isRegistrationClosed ? "Registration Closed" : "Register Now"}
                </button>
              </form>
            </div>

            {/* Right side - Info */}
            <div className="md:w-1/3 bg-gradient-to-br from-purple-600 to-indigo-700 p-8 md:p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Join DESOC Events?</h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Learn & Grow</h4>
                    <p className="text-sm opacity-90">
                      Enhance your technical and design skills through hands-on workshops
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Network</h4>
                    <p className="text-sm opacity-90">Connect with like-minded peers and industry professionals</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Certificates</h4>
                    <p className="text-sm opacity-90">Get recognized for your participation and achievements</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Innovation</h4>
                    <p className="text-sm opacity-90">Be part of cutting-edge projects and competitions</p>
                  </div>
                </div>
              </div>

              {selectedEvent && (
                <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
                  <h4 className="font-semibold mb-2">Event Details</h4>
                  <p className="text-sm opacity-90 mb-1">📅 {new Date(selectedEvent.date).toLocaleDateString()}</p>
                  <p className="text-sm opacity-90 mb-1">🕐 {selectedEvent.time}</p>
                  <p className="text-sm opacity-90 mb-1">📍 {selectedEvent.venue}</p>
                  <p className="text-sm opacity-90">🎫 {seatsLeft} seats remaining</p>
                </div>
              )}

              <div className="mt-8 p-4 bg-white bg-opacity-10 rounded-lg">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-sm opacity-90 mb-2">Contact us for any queries:</p>
                <p className="text-sm">📧 desoc.kkw@gmail.com</p>
                <p className="text-sm">📱 Follow @desoc_kkw</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
