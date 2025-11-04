"use client"

import { useState, FormEvent, ChangeEvent } from 'react'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FAQAccordion from '../../components/FAQAccordion';
import { CartProvider } from '../../context/CartContext';
import Image from 'next/image';

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters long'
        if (value.trim().length > 100) return 'Name must be less than 100 characters'
        return ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address'
        return ''
      case 'subject':
        if (!value.trim()) return 'Subject is required'
        if (value.trim().length < 3) return 'Subject must be at least 3 characters long'
        if (value.trim().length > 200) return 'Subject must be less than 200 characters'
        return ''
      case 'message':
        if (!value.trim()) return 'Message is required'
        if (value.trim().length < 10) return 'Message must be at least 10 characters long'
        if (value.trim().length > 5000) return 'Message must be less than 5000 characters'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }

    // Clear submit status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: '' })
    }
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name as keyof FormErrors]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitStatus({ type: 'error', message: 'Please fix the errors in the form.' })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Success - reset form and show success message
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      setSubmitStatus({
        type: 'success',
        message: data.message || 'Thank you for contacting us! We will get back to you soon.'
      })
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message. Please try again later.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CartProvider>
      <Header variant="inner" />

      <div className="tsf-breadcrumb relative py-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="tsf-breadcrumb-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-white text-align-center text-4xl font-bold tsf-font-sora">Contact Us</h1>
          </div>
        </div>
      </div>

      <div className="tsf-contact relative py-20">
        <div className="w-full max-w-full mx-auto px-10 2xl:max-w-screen-2xl">
          <div className="grid grid-cols-3">
            <div className="tsf-contact-detail rounded-tl-md rounded-bl-md tsf-bg-secondary p-10">
              <span className="uppercase text-white pb-5 inline-block">contact us</span>
              <h2 className="text-4xl text-white text-align-center font-extrabold tsf-font-sora">Let&apos;s build Together</h2>
              <div className="detail-list pt-8">
                <div className="detail-list-item pb-5">
                  <div className="flex items-center">
                    <div className="detail-img p-5 bg-white rounded-full"><Image src="/design/src/assets/img/location.svg" alt="location" width={24} height={24} /></div>
                    <div className="detail-text pl-5"><p className="text-white line-height-10">Tokha-6, Kathmandu, Greenland,<br /> Triyog Marg</p></div>
                  </div>
                </div>
                <div className="detail-list-item pb-5">
                  <div className="flex items-center">
                    <div className="detail-img p-5 bg-white rounded-full"><Image src="/design/src/assets/img/call.svg" alt="call" width={24} height={24} /></div>
                    <div className="detail-text pl-5"><p className="text-white line-height-10">+977 14988879, 4963659</p></div>
                  </div>
                </div>
                <div className="detail-list-item">
                  <div className="flex items-center">
                    <div className="detail-img p-5 bg-white rounded-full"><Image src="/design/src/assets/img/email.svg" alt="email" width={24} height={24} /></div>
                    <div className="detail-text pl-5"><p className="text-white line-height-10">3starmeat@gmail.com</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tsf-contact-form col-span-2 rounded-tr-md rounded-br-md w-full tsf-bg-gray p-10 z-10">
              {submitStatus.type && (
                <div className={`p-4 rounded-lg ${submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                  <p className="font-medium">{submitStatus.message}</p>
                </div>
              )}
              <form className="pt-8" onSubmit={handleSubmit} noValidate>
                <div className="mb-6">
                  <input
                    className={`bg-white rounded-full w-full py-4 px-6 ${errors.name ? 'border-2 border-red-500' : ''}`}
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 px-6">{errors.name}</p>}
                </div>
                <div className="mb-6">
                  <input
                    className={`bg-white rounded-full w-full py-4 px-6 ${errors.email ? 'border-2 border-red-500' : ''}`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1 px-6">{errors.email}</p>}
                </div>
                <div className="mb-6">
                  <input
                    className={`bg-white rounded-full w-full py-4 px-6 ${errors.subject ? 'border-2 border-red-500' : ''}`}
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.subject && <p className="text-red-500 text-sm mt-1 px-6">{errors.subject}</p>}
                </div>
                <div className="mb-6">
                  <textarea
                    className={`bg-white rounded-lg w-full py-4 px-6 ${errors.message ? 'border-2 border-red-500' : ''}`}
                    rows={10}
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1 px-6">{errors.message}</p>}
                </div>
                <button
                  className="tsf-button cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
          <div className="contact-map pt-20">
            <iframe className="rounded-md" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4560.946311392599!2d85.3271149!3d27.7464399!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19660f4fdcab%3A0xab7cb8e2621a0e16!2s3%20Star%20Meat%20Products!5e1!3m2!1sen!2snp!4v1758604799250!5m2!1sen!2snp" width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>

      <FAQAccordion />

      <Footer />
    </CartProvider>
  );
}
