import { motion } from "motion/react";
import { Star, ShieldCheck, Grid, Calendar } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 bg-[#F5F0E8]/40 relative overflow-hidden">
      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-32 h-px bg-gold/20" />
      <div className="absolute bottom-0 right-0 w-48 h-px bg-gold/20" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Overlapping Image Collage */}
        <div className="lg:col-span-6 relative h-[450px] md:h-[550px] max-w-lg mx-auto lg:mx-0 w-full">
          
          {/* Main big block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 left-0 w-[75%] h-[80%] bg-cream/10 border border-gold/15 shadow-xl relative overflow-hidden group"
          >
            <img 
              src="/src/assets/images/about_main_craft_1780735888676.png" 
              alt="Sophisticated interior space crafted by Kloche Interiors" 
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] transition-transform duration-700 group-hover:scale-105" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[#1C1C1A]/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
            <div className="absolute top-6 left-6 font-serif text-sm tracking-widest text-[#FAF8F4]/90 uppercase z-10">The Craft</div>
          </motion.div>

          {/* Overlapping secondary block */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute bottom-0 right-0 w-[60%] h-[60%] bg-[#1C1C1A] border-t-2 border-l-2 border-gold shadow-2xl overflow-hidden flex flex-col justify-between p-6 group"
          >
            <div className="flex justify-between items-start">
              <span className="font-serif text-xs italic text-goldLight tracking-widest">Nairobi, KE</span>
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />
                ))}
              </div>
            </div>
            
            <div>
              <p className="font-serif text-3xl font-light text-warm-white leading-none mb-1">Modernism</p>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40">Perfect scale & volume</p>
            </div>
          </motion.div>

          {/* Gold Google Rating Badge Overlay */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
            className="absolute -right-3 top-20 bg-gradient-to-br from-charcoal to-[#242422] text-[#FAF8F4] py-3.5 px-4 rounded-none shadow-xl border border-gold/40 flex flex-col items-center justify-center text-center space-y-1 z-20"
          >
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-gold text-gold stroke-none" />
              <span className="font-serif text-lg font-bold text-goldLight">4.8★</span>
            </div>
            <p className="font-sans text-[9px] tracking-[0.15em] uppercase text-[#F5F0E8]/60 font-medium">Google Rating</p>
          </motion.div>
        </div>

        {/* Right Column: Story Copy & Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 flex flex-col justify-center space-y-8"
        >
          <div>
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-3 block">
              Our Vision
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight leading-tight">
              Sophisticated Spaces <span className="font-serif italic text-gold font-normal">Bespoke Mastery</span>
            </h2>
          </div>

          <div className="space-y-4 font-sans font-light text-sm text-muted leading-relaxed">
            <p>
              At Kloche Interiors, we believe space is the canvas of your life. Led by a team of dedicated interior architects and renovation professionals on Karuna Rd, Nairobi, we mold concrete, wood, and light into harmonious sanctuaries.
            </p>
            <p>
              Whether remodeling full properties or styling commercial setups, we prioritize structural optimization and materials sourcing. Every detail is curated to reflect functional intelligence and understated luxury.
            </p>
          </div>

          {/* Pull Quote Review */}
          <div className="border-l-2 border-gold pl-6 py-2 my-4 bg-cream/30">
            <p className="font-serif italic text-base text-charcoal/90 leading-relaxed mb-3">
              "Working with Kloche Interiors was such a smooth and enjoyable process. They have a unique eye for design and really bring spaces to life."
            </p>
            <p className="font-sans text-xs uppercase tracking-widest text-[#B8965A] font-semibold">
              — Givence Awuor <span className="font-light text-muted">· Nairobi Client</span>
            </p>
          </div>

          <a
            id="about-cta-book"
            href="#contact"
            className="w-fit px-8 py-4 border border-charcoal text-charcoal bg-transparent hover:bg-[#1C1C1A] hover:text-warm-white transition-all duration-300 tracking-widest text-xs uppercase font-medium flex items-center gap-2"
          >
            Book a Consultation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
