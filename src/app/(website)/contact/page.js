"use client";
import { useState } from "react";

const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Client-side validation functions
  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name contains invalid characters";
    return null;
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    if (email.length > 100) return "Email must be less than 100 characters";
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      return "Phone number must be at least 11 digits";
    }
    if (!/^[\d\s\-\+\(\)\.]+$/.test(phone)) {
      return "Phone number contains invalid characters";
    }
    return null;
  };

  const validateMessage = (message) => {
    if (!message.trim()) return "Message is required";
    if (message.length < 10) return "Message must be at least 10 characters";
    if (message.length > 1000) return "Message must be less than 1000 characters";
    // Check for potential malicious patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    for (let pattern of maliciousPatterns) {
      if (pattern.test(message)) {
        return "Message contains invalid content";
      }
    }
    return null;
  };

  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    // Client-side validation
    const validationErrors = {};

    const nameError = validateName(name);
    if (nameError) validationErrors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) validationErrors.email = emailError;

    const phoneError = validatePhone(phone);
    if (phoneError) validationErrors.phone = phoneError;

    const messageError = validateMessage(message);
    if (messageError) validationErrors.message = messageError;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Sanitize data before sending
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      phone: sanitizeInput(phone),
      message: sanitizeInput(message),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent // For security logging
    };

    try {
      const response = await fetch("/api/contactmessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add CSRF token if implemented
          // "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(sanitizedData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormSubmitted(true);
        form.reset();
        setErrors({});
      } else {
        // Handle server-side validation errors
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrors({ general: result.message || "Failed to submit message. Please try again." });
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ general: "Network error. Please check your connection and try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="text-gray-800 dark:text-gray-100">
      {/* Hero Section */}
      <section className="text-center pt-20 pb-6 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-4xl font-bold text-[#2A4F5C] dark:text-sky-300">CONTACT</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Home &gt; Contact</p>
      </section>

      {/* Contact Info and Form */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-[#2A4F5C] dark:text-sky-300">
            GET IN TOUCH
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Please enter the details of your request. A member of our support
            staff will respond as soon as possible.
          </p>

          {errors.general && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength="50"
                  className={`input-style ${errors.name ? 'border-red-500 dark:border-red-400' : ''}`}
                  placeholder="Your Name"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-500 dark:text-red-300 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength="100"
                  className={`input-style ${errors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                  placeholder="Your Email"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 dark:text-red-300 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                required
                maxLength="20"
                className={`input-style ${errors.phone ? 'border-red-500 dark:border-red-400' : ''}`}
                placeholder="Phone Number"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-red-500 dark:text-red-300 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <textarea
                name="message"
                required
                rows="5"
                maxLength="1000"
                className={`input-style resize-none ${errors.message ? 'border-red-500 dark:border-red-400' : ''}`}
                placeholder="Your Message"
                disabled={isSubmitting}
              ></textarea>
              {errors.message && (
                <p className="text-red-500 dark:text-red-300 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              aria-label="Submit Message"
              disabled={isSubmitting}
              className={`py-2 px-6 rounded-lg transition-all text-white ${isSubmitting
                ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-[#2A4F5C] dark:bg-sky-700 hover:bg-[#1f3c45] dark:hover:bg-sky-800'
                }`}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT NOW'}
            </button>

            {formSubmitted && (
              <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded">
                Your message has been submitted successfully! We'll get back to you soon.
              </div>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold dark:text-gray-200">Address:</h3>
            <p className="dark:text-gray-300">
              China A12 - International City China Cluster - Dubai - United Arab Emirates
            </p>
          </div>
          <p className="dark:text-gray-300">
            <strong className="dark:text-gray-200">Email:</strong> vapemarina25@gmail.com
          </p>
          <p className="dark:text-gray-300">
            <strong className="dark:text-gray-200">Call Us:</strong> +971567404217
          </p>
          <p className="dark:text-gray-300">
            <strong className="dark:text-gray-200">Opening Time:</strong> Every day from{" "}
            <strong className="dark:text-gray-200">10am to 11pm</strong>
          </p>

          {/* Social Links */}
          <div className="flex space-x-4 pt-4">
              <a href="https://www.facebook.com/people/Vape-Marina/61578896596480/" target="_blank" aria-label="Facebook" className="text-gray-700 dark:text-gray-200 hover:text-[#2A4F5C] dark:hover:text-sky-400 text-xl">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" target="_blank" aria-label="Instagram" className="text-gray-700 dark:text-gray-200 hover:text-[#2A4F5C] dark:hover:text-sky-400 text-xl">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" target="_blank" aria-label="Pinterest" className="text-gray-700 dark:text-gray-200 hover:text-[#2A4F5C] dark:hover:text-sky-400 text-xl">
              <i className="bi bi-pinterest"></i>
            </a>
            <a href="#" target="_blank" aria-label="Twitter" className="text-gray-700 dark:text-gray-200 hover:text-[#2A4F5C] dark:hover:text-sky-400 text-xl">
              <i className="bi bi-twitter"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57775.00220284739!2d55.373132613616974!3d25.171583480159356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6147f8dc2bdd%3A0x74a85252bdf063a6!2sChina%20A12%20-%20Dubai%20International%20City%20-%20China%20Cluster%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2sbd!4v1753277030659!5m2!1sen!2sbd"
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          aria-label="Google Map"
          loading="lazy"
        ></iframe>
      </div>

      {/* Tailwind Custom Input Style */}
      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          background-color: #fff;
          color: #18181b;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .input-style:focus {
          outline: none;
          border-color: #2a4f5c;
        }
        .input-style:disabled {
          background-color: #f5f5f5;
          color: #888;
          cursor: not-allowed;
        }
        .input-style::placeholder {
          color: #888;
          opacity: 1;
        }
        @media (prefers-color-scheme: dark) {
          .input-style {
            background-color: #18181b;
            color: #f3f4f6;
            border-color: #444;
          }
          .input-style:focus {
            border-color: #38bdf8;
          }
          .input-style:disabled {
            background-color: #27272a;
            color: #888;
          }
          .input-style::placeholder {
            color: #a3a3a3;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;