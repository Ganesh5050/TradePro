import { motion } from 'framer-motion';
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-white" style={{ paddingTop: '120px' }}>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-gray-500 mb-4">© Let's Connect</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            Let's Trade and <br />Begin the Trade
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Section - Stats & Testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div 
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'rgb(236, 237, 241)',
                  borderRadius: '20px',
                  boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                }}
              >
                <div className="text-4xl font-bold mb-2 text-black">100+</div>
                <div className="text-sm text-gray-600">Happy clients</div>
              </div>
              <div 
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'rgb(236, 237, 241)',
                  borderRadius: '20px',
                  boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                }}
              >
                <div className="text-4xl font-bold mb-2 text-black">$250m</div>
                <div className="text-sm text-gray-600">revenue added</div>
              </div>
              <div 
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: 'rgb(236, 237, 241)',
                  borderRadius: '20px',
                  boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
                }}
              >
                <div className="text-4xl font-bold mb-2 text-black">4.8</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>

            {/* Testimonial */}
            <div 
              className="rounded-2xl p-8 mb-8"
              style={{
                backgroundColor: 'rgb(236, 237, 241)',
                borderRadius: '20px',
                boxShadow: '-3px -3px 6px 0px rgb(250, 251, 255), 3px 3px 6px 0px rgba(0, 125, 252, 0.15)',
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex-shrink-0"></div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-black">GP</h3>
                  <p className="text-gray-600 text-sm">Ryan Toys</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-2 text-sm text-black">5.0</span>
              </div>

              <p className="text-gray-700 leading-relaxed">
                Using this analytics tool has been a game-changer for our team. The 
                seamless interface and actionable insights make every decision smarter.
              </p>
            </div>

            {/* Get Started Button */}
            <button 
              className="w-full text-white font-semibold py-4 px-8 rounded-full hover:opacity-90 transition-all"
              style={{
                backgroundColor: 'black',
                boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
              }}
            >
              Get Started
            </button>
          </motion.div>

          {/* Right Section - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">NAME</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'rgb(236, 237, 241)',
                      borderRadius: '12px',
                      boxShadow: 'inset -2px -2px 4px 0px rgb(250, 251, 255), inset 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2 font-medium">EMAIL</label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-all"
                    style={{
                      backgroundColor: 'rgb(236, 237, 241)',
                      borderRadius: '12px',
                      boxShadow: 'inset -2px -2px 4px 0px rgb(250, 251, 255), inset 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
                    }}
                    required
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm text-gray-600 mb-2 font-medium">MESSAGE</label>
                <textarea
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-3 text-black placeholder-gray-500 focus:outline-none transition-all resize-none"
                  style={{
                    backgroundColor: 'rgb(236, 237, 241)',
                    borderRadius: '12px',
                    boxShadow: 'inset -2px -2px 4px 0px rgb(250, 251, 255), inset 2px 2px 4px 0px rgba(0, 125, 252, 0.15)',
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full text-white font-semibold py-4 px-8 rounded-full hover:opacity-90 transition-all"
                style={{
                  backgroundColor: 'black',
                  boxShadow: 'rgba(61, 61, 61, 0.72) 0px 0.602187px 1.08394px -1.25px, rgba(61, 61, 61, 0.64) 0px 2.28853px 4.11936px -2.5px, rgba(61, 61, 61, 0.25) 0px 10px 18px -3.75px, rgba(0, 0, 0, 0.35) 0px 0.706592px 0.706592px -0.583333px, rgba(0, 0, 0, 0.34) 0px 1.80656px 1.80656px -1.16667px, rgba(0, 0, 0, 0.33) 0px 3.62176px 3.62176px -1.75px, rgba(0, 0, 0, 0.3) 0px 6.8656px 6.8656px -2.33333px, rgba(0, 0, 0, 0.26) 0px 13.6468px 13.6468px -2.91667px, rgba(0, 0, 0, 0.15) 0px 30px 30px -3.5px'
                }}
              >
                Send Message
              </button>

              <p className="text-center text-sm text-gray-600">
                (We will reach out to you within 48hrs)
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
