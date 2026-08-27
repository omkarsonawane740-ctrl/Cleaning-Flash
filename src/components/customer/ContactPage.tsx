import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { WebsiteSettings } from '../../types';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, MessageCircle } from 'lucide-react';

interface ContactPageProps {
  settings: WebsiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const { submitContactMessage } = useData();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceInterested, setServiceInterested] = useState('Full House Deep Cleaning');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    await submitContactMessage({
      name,
      email,
      phone,
      serviceInterested,
      message
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const openWhatsApp = () => {
    const rawNum = settings.business.whatsappNumber.replace(/[^0-9]/g, '');
    const text = encodeURIComponent('Hi Cleaning Flash team! I would like to inquire about booking a cleaning service.');
    window.open(`https://wa.me/${rawNum}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>We are Here to Help 24/7</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Contact Cleaning Flash
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Have questions about specialized services, custom corporate packages, or an existing booking? Reach out directly.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left 5 Cols: Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Direct Contact Details</h2>

              <div className="space-y-4 text-xs text-slate-600">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Call Support</p>
                    <a href={`tel:${settings.business.phone}`} className="text-blue-600 font-semibold hover:underline">
                      {settings.business.phone}
                    </a>
                    <p className="text-[11px] text-slate-400 mt-0.5">Direct lines available Mon–Sun</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">WhatsApp Instant Chat</p>
                    <button
                      onClick={openWhatsApp}
                      className="text-emerald-600 font-bold hover:underline flex items-center space-x-1 mt-0.5 cursor-pointer"
                    >
                      <span>Chat on {settings.business.whatsappNumber}</span>
                    </button>
                    <p className="text-[11px] text-slate-400 mt-0.5">Average reply time under 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Email Inquiries</p>
                    <a href={`mailto:${settings.business.email}`} className="text-slate-700 hover:text-blue-600 font-medium">
                      {settings.business.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Headquarters & Logistics Hub</p>
                    <p className="text-slate-600 mt-0.5">{settings.business.address}</p>
                    <p className="text-slate-600">{settings.business.city}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Service Operating Hours</p>
                    <p className="text-slate-600 mt-0.5">{settings.business.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick WhatsApp Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-lg space-y-3">
              <h3 className="font-bold text-base">Prefer WhatsApp?</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Send photos of your home or office space for instant quotation and team allocation.
              </p>
              <button
                onClick={openWhatsApp}
                className="w-full py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition cursor-pointer"
              >
                Open WhatsApp Chat Now
              </button>
            </div>
          </div>

          {/* Right 7 Cols: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Send an Inquiry / Callback Request</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details below and our service manager will get in touch shortly.
                </p>
              </div>

              {submitted && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you! Your message has been received. We will call you within 15 minutes.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Omkar Sonawane"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Service Interested In</label>
                    <select
                      value={serviceInterested}
                      onChange={(e) => setServiceInterested(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Full House Deep Cleaning">Full House Deep Cleaning</option>
                      <option value="Kitchen Deep Cleaning">Kitchen Deep Cleaning</option>
                      <option value="Bathroom Sanitization">Bathroom Sanitization</option>
                      <option value="Sofa & Carpet Cleaning">Sofa & Carpet Cleaning</option>
                      <option value="Commercial Office Cleaning">Commercial Office Cleaning</option>
                      <option value="Post-Construction Cleaning">Post-Construction Cleaning</option>
                      <option value="Custom Requirement">Custom Requirement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message / Requirements *</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about the property size, specific stains, or preferred schedule..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
