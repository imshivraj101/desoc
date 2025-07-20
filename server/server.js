const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection with proper error handling
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/desoc")

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully")
})

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected")
})

// Schemas
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
})

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  currentParticipants: { type: Number, default: 0 },
  isGroupEvent: { type: Boolean, default: false },
  maxTeamSize: { type: Number, default: 1 },
  minTeamSize: { type: Number, default: 1 },
  registrationDeadline: { type: Date, required: true },
  eventType: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, default: "" },
  requirements: [String],
  prizes: [String],
})

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  college: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  eventName: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  // Group event fields
  isGroupRegistration: { type: Boolean, default: false },
  teamName: { type: String },
  teamMembers: [
    {
      name: String,
      email: String,
      phone: String,
      college: String,
      year: String,
      branch: String,
    },
  ],
  teamSize: { type: Number, default: 1 },
})

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["new", "read", "replied"], default: "new" },
})

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "admin" },
})

const Announcement = mongoose.model("Announcement", announcementSchema)
const Event = mongoose.model("Event", eventSchema)
const Registration = mongoose.model("Registration", registrationSchema)
const Contact = mongoose.model("Contact", contactSchema)
const Admin = mongoose.model("Admin", adminSchema)

// Nodemailer setup with better error handling
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Auth middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")
    const admin = await Admin.findById(decoded.id)
    if (!admin) {
      return res.status(401).json({ message: "Invalid token. Admin not found." })
    }

    req.admin = decoded
    next()
  } catch (error) {
    console.error("Auth error:", error)
    res.status(401).json({ message: "Invalid token." })
  }
}

// Email sending helper
const sendEmail = async (to, subject, html) => {
  if (!transporter) {
    throw new Error("Email service not configured")
  }

  return await transporter.sendMail({
    from: `"DESOC Events" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}

// Routes

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    port: PORT,
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString(),
  })
})

// Contact form - Fixed to save and send emails
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body

  try {
    // Save contact to database
    const contact = new Contact({ name, email, message })
    await contact.save()

    // Send email to admin if transporter is configured
    if (transporter && process.env.SMTP_USER) {
      try {
        await sendEmail(
          process.env.TO_EMAIL || "desoc.kkw@gmail.com",
          `New Contact Form Submission from ${name}`,
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6a1b9a; border-bottom: 2px solid #6a1b9a; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong style="color: #333;">Name:</strong> ${name}</p>
                <p><strong style="color: #333;">Email:</strong> ${email}</p>
                <p><strong style="color: #333;">Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6a1b9a;">
                  ${message.replace(/\n/g, "<br>")}
                </div>
                <p style="margin-top: 20px; color: #666;">
                  <strong>Submitted on:</strong> ${new Date().toLocaleString()}
                </p>
              </div>
              <p style="color: #666; font-size: 12px;">
                This message was sent from the DESOC website contact form.
              </p>
            </div>
          `,
        )
        console.log(`📧 Contact form email sent from ${email}`)
      } catch (emailError) {
        console.error("Contact email sending failed:", emailError.message)
      }
    }

    res.status(200).json({ success: true, message: "Message sent successfully! We'll get back to you soon." })
  } catch (error) {
    console.error("Contact form error:", error)
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." })
  }
})

// Admin login
app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body

    console.log("Login attempt for username:", username)

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" })
    }

    const admin = await Admin.findOne({ username })
    if (!admin) {
      console.log("Admin not found:", username)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      console.log("Password mismatch for:", username)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "24h",
    })

    console.log("Login successful for:", username)
    res.json({ token, admin: { id: admin._id, username: admin.username, email: admin.email } })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Verify admin token
app.get("/admin/verify", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password")
    res.json({ valid: true, admin })
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid token" })
  }
})

// Create default admin
app.post("/admin/create-default", async (req, res) => {
  try {
    const username = process.env.ADMIN_USERNAME ;
    const password = process.env.ADMIN_PASSWORD ;
    const email = process.env.ADMIN_EMAIL ;

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: "Default admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      password: hashedPassword,
      email,
    });

    await admin.save();
    console.log("✅ Default admin created successfully");
    res.json({ message: "Default admin created successfully" });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Events CRUD
app.get("/events", async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/events/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/admin/events", authenticateAdmin, async (req, res) => {
  try {
    const event = new Event(req.body)
    await event.save()
    res.status(201).json(event)
  } catch (error) {
    console.error("Event creation error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/admin/events", authenticateAdmin, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/admin/events/:id", authenticateAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/admin/events/:id", authenticateAdmin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id)
    res.json({ message: "Event deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Announcements
app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true }).sort({ priority: -1, date: -1 }).limit(5)
    res.json(announcements)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/admin/announcements", authenticateAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 })
    res.json(announcements)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/admin/announcements", authenticateAdmin, async (req, res) => {
  try {
    const announcement = new Announcement(req.body)
    await announcement.save()
    res.status(201).json(announcement)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/admin/announcements/:id", authenticateAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(announcement)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.delete("/admin/announcements/:id", authenticateAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id)
    res.json({ message: "Announcement deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Event Registration with duplicate prevention and group support
app.post("/register", async (req, res) => {
  try {
    const { eventId, email, phone, name, isGroupRegistration, teamMembers } = req.body

    // Check if event exists and has capacity
    const event = await Event.findById(eventId)
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" })
    }

    if (!event.isActive) {
      return res.status(400).json({ success: false, message: "Event registration is closed" })
    }

    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({ success: false, message: "Registration deadline has passed" })
    }

    // Check for duplicate registration
    const existingRegistration = await Registration.findOne({
      eventId,
      $or: [{ email }, { phone }, { name: name.toLowerCase() }],
    })

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "You have already registered for this event with this email, phone, or name",
      })
    }

    // Check capacity
    const teamSize = isGroupRegistration ? teamMembers.length + 1 : 1
    if (event.currentParticipants + teamSize > event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Not enough seats available. Only ${event.maxParticipants - event.currentParticipants} seats left.`,
      })
    }

    // Validate group registration
    if (isGroupRegistration) {
      if (!event.isGroupEvent) {
        return res.status(400).json({ success: false, message: "This event doesn't support group registration" })
      }

      if (teamSize < event.minTeamSize || teamSize > event.maxTeamSize) {
        return res.status(400).json({
          success: false,
          message: `Team size must be between ${event.minTeamSize} and ${event.maxTeamSize} members`,
        })
      }
    }

    // Create registration
    const registrationData = {
      ...req.body,
      eventName: event.title,
      teamSize,
    }

    const registration = new Registration(registrationData)
    await registration.save()

    // Update event participant count
    event.currentParticipants += teamSize
    await event.save()

    // Send confirmation email
    if (transporter && process.env.SMTP_USER) {
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6a1b9a; text-align: center;">Registration Confirmed!</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333;">Hello ${registration.name},</h3>
              <p>Thank you for registering for <strong>${event.title}</strong>!</p>
              <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                <h4 style="color: #6a1b9a; margin-top: 0;">Registration Details:</h4>
                <p><strong>Event:</strong> ${event.title}</p>
                <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Venue:</strong> ${event.venue}</p>
                <p><strong>Registration Status:</strong> Pending Confirmation</p>
                ${isGroupRegistration ? `<p><strong>Team Size:</strong> ${teamSize} members</p>` : ""}
              </div>
              <p style="margin-top: 20px;">We'll send you more details about the event soon. Stay tuned!</p>
            </div>
            <p style="text-align: center; color: #666; font-size: 12px;">
              Best regards,<br>Team DESOC
            </p>
          </div>
        `

        await sendEmail(registration.email, `Registration Confirmation - ${event.title}`, emailHtml)
        console.log(`📧 Registration confirmation email sent to ${registration.email}`)
      } catch (emailError) {
        console.error("Registration email sending failed:", emailError.message)
      }
    }

    res.status(201).json({ success: true, message: "Registration successful!" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ success: false, message: "Registration failed. Please try again." })
  }
})

app.get("/admin/registrations", authenticateAdmin, async (req, res) => {
  try {
    const registrations = await Registration.find().populate("eventId").sort({ registrationDate: -1 })
    res.json(registrations)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/admin/registrations/:id", authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
      "eventId",
    )

    // Send confirmation email when status changes to confirmed
    if (status === "confirmed" && transporter && process.env.SMTP_USER) {
      try {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745; text-align: center;">🎉 Registration Confirmed!</h2>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333;">Hello ${registration.name},</h3>
              <p>Great news! Your registration for <strong>${registration.eventName}</strong> has been confirmed!</p>
              <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                <h4 style="color: #28a745; margin-top: 0;">Event Details:</h4>
                <p><strong>Event:</strong> ${registration.eventName}</p>
                <p><strong>Date:</strong> ${new Date(registration.eventId.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${registration.eventId.time}</p>
                <p><strong>Venue:</strong> ${registration.eventId.venue}</p>
                <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMED ✅</span></p>
              </div>
              <p style="margin-top: 20px;">Please arrive 15 minutes before the event starts. We're excited to see you there!</p>
            </div>
            <p style="text-align: center; color: #666; font-size: 12px;">
              Best regards,<br>Team DESOC
            </p>
          </div>
        `

        await sendEmail(registration.email, `✅ Registration Confirmed - ${registration.eventName}`, emailHtml)
        console.log(`📧 Confirmation email sent to ${registration.email}`)
      } catch (emailError) {
        console.error("Confirmation email sending failed:", emailError.message)
      }
    }

    res.json(registration)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Send custom email to participant
app.post("/admin/send-email", authenticateAdmin, async (req, res) => {
  try {
    const { to, subject, message } = req.body

    if (!transporter) {
      return res.status(500).json({ message: "Email service not configured" })
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6a1b9a; border-bottom: 2px solid #6a1b9a; padding-bottom: 10px;">
          Message from DESOC Admin
        </h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #6a1b9a;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <p style="color: #666; font-size: 12px;">
          This message was sent by DESOC Admin Team.
        </p>
      </div>
    `

    await sendEmail(to, subject, emailHtml)
    res.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Custom email sending failed:", error)
    res.status(500).json({ message: "Failed to send email" })
  }
})

// Contact messages for admin
app.get("/admin/contacts", authenticateAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 })
    res.json(contacts)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.put("/admin/contacts/:id", authenticateAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    res.json(contact)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

// Dashboard stats
app.get("/admin/stats", authenticateAdmin, async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments()
    const pendingRegistrations = await Registration.countDocuments({ status: "pending" })
    const confirmedRegistrations = await Registration.countDocuments({ status: "confirmed" })
    const totalAnnouncements = await Announcement.countDocuments()
    const activeAnnouncements = await Announcement.countDocuments({ isActive: true })
    const totalEvents = await Event.countDocuments()
    const activeEvents = await Event.countDocuments({ isActive: true })
    const totalContacts = await Contact.countDocuments()
    const unreadContacts = await Contact.countDocuments({ status: "new" })

    res.json({
      totalRegistrations,
      pendingRegistrations,
      confirmedRegistrations,
      totalAnnouncements,
      activeAnnouncements,
      totalEvents,
      activeEvents,
      totalContacts,
      unreadContacts,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`)
})
