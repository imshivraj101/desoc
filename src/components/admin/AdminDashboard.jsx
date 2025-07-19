"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({})
  const [announcements, setAnnouncements] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [contacts, setContacts] = useState([])
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "medium",
    isActive: true,
  })
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: 50,
    isGroupEvent: false,
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationDeadline: "",
    eventType: "",
    requirements: [],
    prizes: [],
  })
  const [emailModal, setEmailModal] = useState({ show: false, to: "", subject: "", message: "" })
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem("adminToken")
  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}")

  useEffect(() => {
    if (!token) {
      navigate("/admin")
      return
    }
    verifyToken()
  }, [token, navigate])

  const verifyToken = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        setIsAuthenticated(true)
        fetchData()
      } else {
        localStorage.removeItem("adminToken")
        localStorage.removeItem("adminData")
        navigate("/admin")
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      localStorage.removeItem("adminToken")
      localStorage.removeItem("adminData")
      navigate("/admin")
    }
  }

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const [statsRes, announcementsRes, registrationsRes, eventsRes, contactsRes] = await Promise.all([
        fetch("http://localhost:5000/admin/stats", { headers }),
        fetch("http://localhost:5000/admin/announcements", { headers }),
        fetch("http://localhost:5000/admin/registrations", { headers }),
        fetch("http://localhost:5000/admin/events", { headers }),
        fetch("http://localhost:5000/admin/contacts", { headers }),
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (announcementsRes.ok) setAnnouncements(await announcementsRes.json())
      if (registrationsRes.ok) setRegistrations(await registrationsRes.json())
      if (eventsRes.ok) setEvents(await eventsRes.json())
      if (contactsRes.ok) setContacts(await contactsRes.json())
    } catch (error) {
      console.error("Error fetching data:", error)
      alert("Error connecting to server. Please make sure the backend is running on port 5000.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminData")
    navigate("/admin")
  }

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5000/admin/announcements", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnnouncement),
      })

      if (res.ok) {
        setNewAnnouncement({ title: "", content: "", priority: "medium", isActive: true })
        fetchData()
        alert("Announcement created successfully!")
      } else {
        const errorData = await res.json()
        alert(errorData.message || "Failed to create announcement")
      }
    } catch (error) {
      console.error("Error creating announcement:", error)
      alert("Error connecting to server. Please check if backend is running.")
    }
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()
    try {
      const eventData = {
        ...newEvent,
        requirements: newEvent.requirements.filter(req => req.trim() !== ""),
        prizes: newEvent.prizes.filter(prize => prize.trim() !== ""),
      }

      const res = await fetch("http://localhost:5000/admin/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (res.ok) {
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
          venue: "",
          maxParticipants: 50,
          isGroupEvent: false,
          maxTeamSize: 4,
          minTeamSize: 2,
          registrationDeadline: "",
          eventType: "",
          requirements: [],
          prizes: [],
        })
        fetchData()
        alert("Event created successfully!")
      } else {
        const errorData = await res.json()
        alert(errorData.message || "Failed to create event")
      }
    } catch (error) {
      console.error("Error creating event:", error)
      alert("Error connecting to server.")
    }
  }

  const updateRegistrationStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/registrations/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        fetchData()
        if (status === 'confirmed') {
          alert("Registration confirmed! Confirmation email sent to participant.")
        }
      }
    } catch (error) {
      console.error("Error updating registration:", error)
    }
  }

  const deleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        const res = await fetch(`http://localhost:5000/admin/announcements/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          fetchData()
        }
      } catch (error) {
        console.error("Error deleting announcement:", error)
      }
    }
  }

  const deleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`http://localhost:5000/admin/events/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          fetchData()
        }
      } catch (error) {
        console.error("Error deleting event:", error)
      }
    }
  }

  const sendCustomEmail = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/send-email", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailModal.to,
          subject: emailModal.subject,
          message: emailModal.message,
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert("Email sent successfully!")
        setEmailModal({ show: false, to: "", subject: "", message: "" })
      } else {
        alert("Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Error sending email")
    }
  }

  const addRequirement = () => {
    setNewEvent(prev => ({ ...prev, requirements: [...prev.requirements, ""] }))
  }

  const updateRequirement = (index, value) => {
    const updated = [...newEvent.requirements]
    updated[index] = value
    setNewEvent(prev => ({ ...prev, requirements: updated }))
  }

  const removeRequirement = (index) => {
    setNewEvent(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }))
  }

  const addPrize = () => {
    setNewEvent(prev => ({ ...prev, prizes: [...prev.prizes, ""] }))
  }

  const updatePrize = (index, value) => {
    const updated = [...newEvent.prizes]
    updated[index] = value
    setNewEvent(prev => ({ ...prev, prizes: updated }))
  }

  const removePrize = (index) => {
    setNewEvent(prev => ({ ...prev, prizes: prev.prizes.filter((_, i) => i !== index) }))
  }

  // Show loading while verifying authentication
  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">{!isAuthenticated ? "Verifying authentication..." : "Loading dashboard..."}</div>
      </div>
    )
  }

  // Email Modal handler (missing function)
  const handleEmailSend = async () => {
    await sendCustomEmail();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DESOC Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {adminData.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview" },
              { id: "events", name: "Events" },
              { id: "registrations", name: "Registrations" },
              { id: "announcements", name: "Announcements" },
              { id: "contacts", name: "Contact Messages" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Registrations</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalRegistrations || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">⏳</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Registrations</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.pendingRegistrations || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">✅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Confirmed Registrations</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.confirmedRegistrations || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🎉</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Events</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.activeEvents || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📢</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Announcements</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.activeAnnouncements || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📧</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalContacts || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🔔</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Unread Messages</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.unreadContacts || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📅</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalEvents || 0}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            {/* Create Event Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Event</h3>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Title *</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Event Type *</label>
                    <input
                      type="text"
                      value={newEvent.eventType}
                      onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      placeholder="e.g., Workshop, Competition, Seminar"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    rows={3}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date *</label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time *</label>
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registration Deadline *</label>
                    <input
                      type="date"
                      value={newEvent.registrationDeadline}
                      onChange={(e) => setNewEvent({ ...newEvent, registrationDeadline: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Venue *</label>
                    <input
                      type="text"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Max Participants *</label>
                    <input
                      type="number"
                      value={newEvent.maxParticipants}
                      onChange={(e) => setNewEvent({ ...newEvent, maxParticipants: Number.parseInt(e.target.value) })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newEvent.isGroupEvent}
                      onChange={(e) => setNewEvent({ ...newEvent, isGroupEvent: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Group Event</label>
                  </div>

                  {newEvent.isGroupEvent && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Min Team Size</label>
                        <input
                          type="number"
                          value={newEvent.minTeamSize}
                          onChange={(e) => setNewEvent({ ...newEvent, minTeamSize: Number.parseInt(e.target.value) })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Max Team Size</label>
                        <input
                          type="number"
                          value={newEvent.maxTeamSize}
                          onChange={(e) => setNewEvent({ ...newEvent, maxTeamSize: Number.parseInt(e.target.value) })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                          min="1"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Requirements */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Requirements</label>
                    <button
                      type="button"
                      onClick={addRequirement}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Requirement
                    </button>
                  </div>
                  {newEvent.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                        placeholder="Enter requirement"
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Prizes */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Prizes</label>
                    <button
                      type="button"
                      onClick={addPrize}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Add Prize
                    </button>
                  </div>
                  {newEvent.prizes.map((prize, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={prize}
                        onChange={(e) => updatePrize(index, e.target.value)}
                        className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                        placeholder="Enter prize"
                      />
                      <button
                        type="button"
                        onClick={() => removePrize(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Event
                </button>
              </form>
            </div>

            {/* Events List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Events</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Event
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {events.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No events created yet
                        </td>
                      </tr>
                    ) : (
                      events.map((event) => (
                        <tr key={event._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">{event.eventType}</div>
                              {event.isGroupEvent && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Group Event
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.currentParticipants} / {event.maxParticipants}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {event.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => deleteEvent(event._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Registrations Tab */}
        {activeTab === "registrations" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Event Registrations</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No registrations yet
                      </td>
                    </tr>
                  ) : (
                    registrations.map((registration) => (
                      <tr key={registration._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                            <div 
                              className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                              onClick={() => setEmailModal({ 
                                show: true, 
                                to: registration.email, 
                                subject: `Regarding your registration for ${registration.eventName}`,
                                message: "" 
                              })}
                            >
                              {registration.email}
                            </div>
                            <div className="text-sm text-gray-500">{registration.phone}</div>
                            {registration.isGroupRegistration && (
                              <div className="text-xs text-purple-600">
                                Team: {registration.teamName} ({registration.teamSize} members)
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.eventName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.college}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              registration.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : registration.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {registration.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(registration.registrationDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={registration.status}
                            onChange={(e) => updateRegistrationStatus(registration._id, e.target.value)}
                            className="text-sm border-gray-300 rounded-md px-2 py-1 border"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === "announcements" && (
          <div className="space-y-6">
            {/* Create Announcement Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Announcement</h3>
              <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    rows={3}
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.isActive}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, isActive: e.target.checked })}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Create Announcement
                </button>
              </form>
            </div>

            {/* Announcements List */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">All Announcements</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {announcements.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No announcements yet</div>
                ) : (
                  announcements.map((announcement) => (
                    <div key={announcement._id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{announcement.content}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                announcement.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : announcement.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {announcement.priority}
                            </span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                announcement.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {announcement.isActive ? "Active" : "Inactive"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAnnouncement(announcement._id)}
                          className="ml-4 text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Messages Tab */}
        {activeTab === "contacts" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Contact Messages</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No contact messages yet</div>
              ) : (
                contacts.map((contact) => (
                  <div key={contact._id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{contact.name}</h4>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              contact.status === "new"
                                ? "bg-red-100 text-red-800"
                                : contact.status === "read"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </div>
                        <p 
                          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer mb-2"
                          onClick={() => setEmailModal({ 
                            show: true, 
                            to: contact.email, 
                            subject: `Re: Your message to DESOC`,
                            message: `Hi ${contact.name},\n\nThank you for contacting DESOC. ` 
                          })}
                        >
                          {contact.email}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">{contact.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(contact.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-4 space-x-2">
                        <select
                          value={contact.status}
                          onChange={(e) => {
                            fetch(`http://localhost:5000/admin/contacts/${contact._id}`, {
                              method: "PUT",
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({ status: e.target.value }),
                            }).then(() => fetchData())
                          }}
                          className="text-sm border-gray-300 rounded-md px-2 py-1 border"
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {emailModal.show && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Send Email</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">To:</label>
                  <input
                    type="email"
                    value={emailModal.to}
                    onChange={(e) => setEmailModal({ ...emailModal, to: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject:</label>
                  <input
                    type="text"
                    value={emailModal.subject}
                    onChange={(e) => setEmailModal({ ...emailModal, subject: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message:</label>
                  <textarea
                    rows={4}
                    value={emailModal.message}
                    onChange={(e) => setEmailModal({ ...emailModal, message: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-3 py-2 border"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEmailModal({ show: false, to: "", subject: "", message: "" })}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEmailSend}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                  >
                    Send Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Loading Spinner */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500"></div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard;