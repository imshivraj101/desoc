import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-card">
        <div className="contact-left">
          <h2>Contact Us</h2>
          <form className="contact-form">
            <label htmlFor="name">Name</label> 
            <input type="text" id="name" placeholder="Your Name" required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="you@example.com" required />

            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="Your message..." required></textarea>

            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className="contact-right">
          <h3>Info </h3>
          <p><strong>📍 Location:</strong> K K WAGH INSTITUE OF ENGINEERING EDUCATION & RESEARCH NASHIK </p>
         <p><strong>📧 Email:</strong> desoc@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
