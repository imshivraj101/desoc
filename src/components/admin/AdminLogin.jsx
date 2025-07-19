"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem("adminToken")
    if (token) {
      // Verify token is still valid
      fetch("http://localhost:5000/admin/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            navigate("/admin/dashboard")
          } else {
            localStorage.removeItem("adminToken")
            localStorage.removeItem("adminData")
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken")
          localStorage.removeItem("adminData")
        })
    }
  }, [navigate])

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("adminToken", data.token)
        localStorage.setItem("adminData", JSON.stringify(data.admin))
        navigate("/admin/dashboard")
      } else {
        alert(data.message || "Login failed")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Server error. Please make sure the backend server is running on port 5000.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-gray-300">Access the DESOC admin dashboard</p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-gray-500">Default credentials: admin / admin123</p>
            <p className="text-xs text-red-500">
              Note: Create admin account first by running:
              <br />
              <code className="bg-gray-100 px-1 rounded">curl -X POST http://localhost:5000/admin/create-default</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
