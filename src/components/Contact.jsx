"use client"

import { useState } from "react"
import "./Contact.css"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("https://desoc-main.onrender.com/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        alert("✅ Message sent successfully!")
        setFormData({ name: "", email: "", message: "" })
      } else {
        alert("❌ Failed to send message.")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("⚠️ Server error. Please try again.")
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-card">
        <div className="contact-left">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-right">
          <h3>Info </h3>
          <p>
            <strong>📍 Location:</strong> K K Wagh Institute of Engineering Education & Research, Nashik
          </p>
          <p>
            <strong>📧 Email:</strong> desoc.kkw@gmail.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact
