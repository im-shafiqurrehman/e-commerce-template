"use client"
import { useState } from "react"
import { FaFacebook, FaInstagram, FaTiktok, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa"
import Link from "next/link"
import { Mail, MessageCircle, Send } from "lucide-react"
import { Fade } from "react-awesome-reveal"

export default function ContactSection() {
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        submitted: true,
        error: true,
        message: "Please fill in all required fields.",
      })
      return
    }

    setFormStatus({
      submitted: true,
      error: false,
      message: "Thank you for your message! We'll get back to you soon.",
    })

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })

    setTimeout(() => {
      setFormStatus({
        submitted: false,
        error: false,
        message: "",
      })
    }, 5000)
  }

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61574609856374",
      label: "Facebook",
      icon: FaFacebook,
    },
    {
      href: "https://www.instagram.com/halfattire/",
      label: "Instagram",
      icon: FaInstagram,
    },
    {
      href: "https://www.tiktok.com/@halfattire?lang=en",
      label: "TikTok",
      icon: FaTiktok,
    },
  ]

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      content: (
        <p>
          Half Attire <br />
          49A ferozpark phase 1, <br />
          town, Lahore, Pakistan
        </p>
      ),
    },
    {
      icon: FaPhoneAlt,
      title: "Call Us",
      content: (
        <a href="tel:03155185557" className="hover:text-[#3321c8] hover:underline">
          03155185557
        </a>
      ),
    },
    {
      icon: FaWhatsapp,
      title: "Whatsapp Us",
      content: (
        <a
          href="https://wa.me/03155185557"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#3321c8] hover:underline"
        >
          03155185557
        </a>
      ),
    },
    {
      icon: Mail,
      title: "Email Us",
      content: (
        <a href="mailto:Halfattire.pk@gmail.com" className="hover:text-[#3321c8] hover:underline">
          Halfattire.pk@gmail.com
        </a>
      ),
    },
    {
      icon: MessageCircle,
      title: "Business Hours",
      content: "Monday to Saturday: 10am - 6pm",
    },
  ]

  return (
    <section className="py-6 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <Fade triggerOnce direction="up" duration={800}>
            <div className="space-y-4">
              <Link href="/">
                <div className="flex items-center mb-6">
                  <div className="bg-[#3321c8]/10 p-3 rounded-full mr-3">
                    <span className="text-[#3321c8] font-bold text-2xl">HA</span>
                  </div>
                  <span className="text-[#3321c8] font-bold text-xl">Half Attire</span>
                </div>
              </Link>

              <p className="text-gray-600 text-sm leading-relaxed">
                Half Attire is a premium clothing brand offering high-quality fashion products. We are committed to
                providing stylish and comfortable clothing options with free shipping nationwide.
              </p>

              <div className="flex space-x-4">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <div
                    key={label}
                    className="relative"
                    onMouseEnter={() => setActiveTooltip(label)}
                    onMouseLeave={() => setActiveTooltip(null)}
                  >
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex items-center justify-center w-10 h-10 bg-[#3321c8] hover:bg-[#2a1ba3] rounded-full text-white shadow-md transition-colors duration-300"
                    >
                      <Icon className="text-lg" />
                    </a>
                    {activeTooltip === label && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded pointer-events-none whitespace-nowrap">
                        {label}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Fade triggerOnce direction="up" delay={200}>
                <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-[#3321c8] mb-4">Send Us a Message</h3>

                  {formStatus.submitted && (
                    <div
                      className={`p-3 mb-4 rounded-md ${formStatus.error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                    >
                      {formStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3321c8] text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3321c8] text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3321c8] text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3321c8] text-sm"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center px-4 py-2 bg-[#3321c8] text-white font-medium text-sm rounded-md shadow-md hover:bg-[#2a1ba3] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3321c8]"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </button>
                  </form>
                </div>
              </Fade>
            </div>
          </Fade>

          <Fade triggerOnce direction="up" duration={800} delay={100}>
            <div className="space-y-6 md:pl-8">
              <h2 className="text-xl font-semibold text-[#3321c8] mb-4">Contact Information</h2>
              <div className="space-y-5 text-gray-700">
                <Fade triggerOnce cascade damping={0.2}>
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex items-center justify-center w-10 h-10 flex-shrink-0 bg-[#3321c8]/10 rounded-full">
                        <item.icon className="text-base" />
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="block">{item.title}:</span>
                        <div className="mt-1">
                          {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </Fade>

                <div className="hidden md:block mt-8">
                  <h3 className="text-base font-semibold text-[#3321c8] mb-3">Follow Us</h3>
                  <Fade triggerOnce cascade damping={0.2}>
                    <div className="space-y-3">
                      {socialLinks.map(({ href, label, icon: Icon }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-600 hover:text-[#3321c8] transition-colors"
                        >
                          <Icon className="text-lg" />
                          <span className="text-sm">{label}</span>
                        </a>
                      ))}
                    </div>
                  </Fade>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  )
}
  