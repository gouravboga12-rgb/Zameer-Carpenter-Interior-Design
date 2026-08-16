import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { X, Phone, MessageSquare, MapPin, Calculator, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';

export default function MobileDrawer({ isOpen, onClose, navLinks }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-luxury-walnut/80 backdrop-blur-md"
          />

          {/* Drawer Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-luxury-walnut text-[#FDFBF7] shadow-2xl flex flex-col justify-between border-l border-luxury-gold/30 p-6 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt={COMPANY_INFO.name}
                    className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/10 text-[#FDFBF7] hover:bg-luxury-gold hover:text-luxury-walnut transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col space-y-1.5">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActive
                            ? 'bg-luxury-gold/20 text-luxury-gold font-semibold border-l-4 border-luxury-gold pl-3 shadow-inner'
                            : 'text-gray-300 hover:text-[#FDFBF7] hover:bg-white/5'
                        }`
                      }
                    >
                      <span className="font-heading tracking-wide text-lg">{link.name}</span>
                      <ArrowRight className="w-4 h-4 opacity-60" />
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <NavLink
                to="/contact"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-luxury-gold text-luxury-walnut font-bold text-xs uppercase tracking-wider hover:bg-yellow-500 transition-all shadow-gold-glow"
              >
                <Calculator className="w-4 h-4" />
                <span>Get Instant Quote</span>
              </NavLink>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${COMPANY_INFO.phoneRaw}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors border border-white/10"
                >
                  <Phone className="w-4 h-4 text-luxury-gold" />
                  <span>Call Now</span>
                </a>
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-sm font-medium transition-colors text-white"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-400 pt-3">
                <MapPin className="w-3.5 h-3.5 text-luxury-gold shrink-0 mt-0.5" />
                <span>Tolichowki, Shaikpet, Hyderabad, Telangana</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
