import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      id="whatsapp-floating-bubble"
      className="fixed bottom-6 right-6 z-50 flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            id="whatsapp-bubble-tooltip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="mr-3 bg-[#1C1C1A] text-[#FAF8F4] text-xs uppercase tracking-widest font-sans py-2 px-3 border border-gold/20 shadow-lg pointer-events-none whitespace-nowrap"
          >
            Chat with us
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href="https://wa.me/254717634003?text=Hello%20Kloche%20Interiors%2C%20I%27d%20love%20to%20discuss%20an%20interior%20design%20or%20renovation%20project."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#1ebd59] flex items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 animate-[pulseGold_2s_infinite] focus:outline-none"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.015 14.07 1.01 11.455 1.01c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L1.874 20.14l4.773-1.233zm11.383-7.234c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.78-1.672-2.08-.175-.3-.018-.463.13-.612.134-.133.3-.349.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.625-.925-2.225-.244-.589-.491-.51-.676-.51-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.111 4.522.714.309 1.272.493 1.707.632.719.228 1.375.196 1.892.118.577-.089 1.772-.724 2.022-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
        </svg>
      </a>
    </div>
  );
}
