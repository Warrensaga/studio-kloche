import { motion } from "motion/react";
import { Star, MessageSquare } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      id: 1,
      quote: "Working with Kloche Interiors was such a smooth and enjoyable process. They have a unique eye for design and really bring spaces to life.",
      author: "Givence Awuor",
      role: "Residential Client",
      stars: 5,
    },
    {
      id: 2,
      quote: "Great experience with attention to detail and personalization. Went above and beyond.",
      author: "Ogare Ted",
      role: "Commercial Partner",
      stars: 5,
    },
    {
      id: 3,
      quote: "Unparalleled expertise in renovation and interior decoration. Remarkable company.",
      author: "Amanda Kimani",
      role: "Airbnb Host / Short Let Styling",
      stars: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#FAF8F4] relative border-t border-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Title with Google summary metrics */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold mb-3 block">
              Direct Feedback
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              Client Testimonials <span className="font-serif italic text-gold font-normal">and Praises</span>
            </h2>
          </div>

          {/* Google aggregate score box */}
          <div className="flex items-center space-x-1 border border-gold/20 bg-cream/20 py-3.5 px-6 self-start lg:self-auto shadow-sm">
            <div className="flex text-gold mr-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold stroke-none" />
              ))}
            </div>
            <div className="text-left">
              <p className="font-serif text-lg font-bold text-charcoal leading-none">4.8 Stars</p>
              <p className="font-sans text-[10px] tracking-wider text-muted uppercase">10 Google Reviews</p>
            </div>
          </div>
        </div>

        {/* 3 Review Cards */}
        <div id="testimonials-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-[#F5F0E8]/40 border border-[#E2DDD5]/70 p-8 flex flex-col justify-between relative group hover:bg-[#1C1C1A] transition-all duration-500"
            >
              {/* Massive italic typographic quotes */}
              <div className="font-serif text-gold/15 text-7xl italic select-none absolute top-4 left-6 group-hover:text-gold/5 transition-colors duration-500">
                “
              </div>

              <div className="relative z-10 mt-4 mb-8">
                {/* Visual Stars */}
                <div className="flex text-gold mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />
                  ))}
                </div>

                <p className="font-serif text-lg italic text-charcoal/90 leading-relaxed font-light group-hover:text-warm-white transition-colors duration-500">
                  "{rev.quote}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="border-t border-[#E2DDD5]/60 group-hover:border-warm-white/10 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-sans text-sm font-semibold text-charcoal group-hover:text-[#B8965A] transition-colors duration-500">
                    {rev.author}
                  </h4>
                  <p className="font-sans text-xs text-muted group-hover:text-warm-white/50 transition-colors duration-500">
                    {rev.role}
                  </p>
                </div>
                <MessageSquare className="w-4 h-4 text-gold/40 group-hover:text-[#B8965A] transition-colors duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
