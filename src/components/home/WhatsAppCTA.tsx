import { motion } from "motion/react";

export default function WhatsAppCTA() {
  return (
    <section id="whatsapp-cta" className="py-20 bg-charcoal text-[#FAF8F4] relative overflow-hidden">
      {/* Decorative borders */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      {/* Decorative ambient background spots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gold/5 blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-gold font-semibold block">
            Direct Line
          </span>
          
          <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-warm-white">
            Ready to <span className="italic text-gold">transform</span> your space?
          </h2>
          
          <p className="font-sans font-light text-sm md:text-base text-[#F5F0E8]/70 max-w-xl mx-auto leading-relaxed">
            Chat with the Kloche Interiors design studio instantly. We are online and ready to discuss layouts, material styling, budget structures, or walkthrough dates.
          </p>

          <div className="pt-4">
            <a
              id="cta-section-whatsapp-anchor"
              href="https://wa.me/254717634003?text=Hello%20Kloche%20Interiors%2C%20I%20am%20interested%20in%20arranging%20a%20luxury%20consultation%20with%20your%20design%20desk."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebd59] text-white px-10 py-5 transition-all duration-300 transform hover:scale-105 font-sans tracking-[0.15em] text-xs uppercase font-medium focus:outline-none shadow-xl animate-[pulseGold_2.5s_infinite]"
            >
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.015 14.07 1.01 11.455 1.01c-5.44 0-9.866 4.372-9.87 9.802 0 1.714.47 3.387 1.357 4.847L1.874 20.14l4.773-1.233zm11.383-7.234c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.78-1.672-2.08-.175-.3-.018-.463.13-.612.134-.133.3-.349.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.625-.925-2.225-.244-.589-.491-.51-.676-.51-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 375-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.111 4.522.714.309 1.272.493 1.707.632.719.228 1.375.196 1.892.118.577-.089 1.772-.724 2.022-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" />
              </svg>
              Chat on WhatsApp Now
            </a>
          </div>

          <div className="pt-6 font-sans text-xs text-[#F5F0E8]/40 tracking-[0.1em]">
            STUDIO AT KARUNA RD, NAIROBI · AVAILABLE MON-SAT
          </div>
        </motion.div>
      </div>
    </section>
  );
}
