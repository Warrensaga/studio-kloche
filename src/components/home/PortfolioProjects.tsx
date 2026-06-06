import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowUpRight, 
  Calendar, 
  MapPin, 
  X, 
  Clock, 
  Layers, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Maximize2 
} from "lucide-react";

interface ProjectZone {
  name: string;
  description: string;
}

interface ProjectDetail {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  overview: string;
  duration: string;
  location: string;
  size: string;
  concept: string;
  scope: string[];
  zones: ProjectZone[];
}

export default function PortfolioProjects() {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);

  const projects: ProjectDetail[] = [
    {
      id: 1,
      title: "The Karuna Creative Studio",
      subtitle: "Modernist Workspace Transformation",
      image: "/src/assets/images/renovation_modern_studio_1780735451321.png",
      overview: "Renovation of an old warehouse into a bright, sleek, and highly functional workspace for a boutique design agency. Focused on improving natural airflow, spatial circulation, and incorporating custom oak carpentry.",
      duration: "10 Weeks",
      location: "Karuna Road, Nairobi",
      size: "1,200 sq ft",
      concept: "Warm Minimalist Workplace",
      scope: [
        "Floorplan Optimization & Demolition",
        "Bespoke Oak Joinery & Suspended Desks",
        "High-CRI Warm Track Lighting Installation",
        "Built-in Planters & Organic Foliage Integration",
        "Acoustic Plaster Treatment for sound dampening"
      ],
      zones: [
        {
          name: "The Desk Hub",
          description: "Designed with focus in mind, boasting fully integrated wireless bays, raw steel trim, and ergonomic task lights."
        },
        {
          name: "The Library Corner",
          description: "A quiet niche using sound-absorbing felt curtains and custom shelving to store material swatches and catalogs."
        }
      ]
    },
    {
      id: 2,
      title: "The Attic Loft Sanctuary",
      subtitle: "Cozy Editorial Workspace & Library",
      image: "/src/assets/images/renovation_minimalist_loft_1780735468055.png",
      overview: "A dramatic attic conversion for a creative director. We preserved the heritage timber beams while introducing modern floating library shelving, lush linen upholstery, and a warm tone-on-tone color palette.",
      duration: "14 Weeks",
      location: "Lavington, Nairobi",
      size: "950 sq ft",
      concept: "Monolithic Heritage Elegance",
      scope: [
        "Conservation of Heritage Timber Rafters",
        "Lime-wash Textured Wall Finish",
        "Dimmable Ambient Cove Lighting Integration",
        "Flush-Mount Floor Power Outlets",
        "Bespoke Low-Slung Linen Lounge Furniture Sourcing"
      ],
      zones: [
        {
          name: "The Skylight Desk",
          description: "Sun-drenched solid walnut workspace situated perfectly underneath dual double-glazed skylight views."
        },
        {
          name: "The Meditative Lounge",
          description: "A soft, linen-wrapped sanctuary centered around low bookshelves designed for quiet reflection."
        }
      ]
    },
    {
      id: 3,
      title: "The Atelier Focus Lounge",
      subtitle: "Tactile Creative & Ideation Hub",
      image: "/src/assets/images/renovation_creative_lounge_1780735485473.png",
      overview: "Renovation of a dark interior room into a vibrant hub of physical moodboards, warm meeting lounges, and materials exploration libraries. We focused strongly on tactile textures, brass finishes, and cozy boucle materials.",
      duration: "8 Weeks",
      location: "Gigiri, Nairobi",
      size: "800 sq ft",
      concept: "Tactile Industrial Chic",
      scope: [
        "Micro-cement Floor Overlay Installation",
        "Continuous Floor-to-Ceiling Fine Grain Cork Walls",
        "Custom Polished Brass Framing & Accents",
        "Moodboard Task Spotlights",
        "High-performance Sound Diffusion Panels"
      ],
      zones: [
        {
          name: "The Inspiration Wall",
          description: "Over 12 feet of seamless, self-healing cork paneling displaying active sketches, blueprint layers, and swatches."
        },
        {
          name: "The Boucle Lounge",
          description: "Centered around a gorgeous organic-shaped cream sofa providing a luxurious, relaxing group ideation cell."
        }
      ]
    },
    {
      id: 4,
      title: "The Executive Consultation Suite",
      subtitle: "Bespoke Professional Showroom",
      image: "/src/assets/images/renovation_luxury_atelier_1780735503101.png",
      overview: "An upscale luxury consultation lounge and private executive suite featuring heavy fluted walnut paneling, massive brass-lined arches, pristine herringbone flooring, and custom architectural glass partitions.",
      duration: "16 Weeks",
      location: "Westlands, Nairobi",
      size: "1,500 sq ft",
      concept: "Quiet Luxury & High-End Editorial",
      scope: [
        "American Walnut Herringbone Timber Floor Installation",
        "Custom Fluted Solid Walnut Wall Cladding",
        "Solid Brass Arch Transition Frame Detailing",
        "Double-Glazed Fluted Glass Soundproof Partitioning",
        "Concealed Smart Mini-Bar & AV Equipment Cabling"
      ],
      zones: [
        {
          name: "The consultation Arch",
          description: "An elegant meeting bay framed with hand-polished copper-brass profiles, cozy velvet armchairs, and direct bar access."
        },
        {
          name: "The Specimen Showcase",
          description: "Multi-tier structural bronze shelving highlighting rare marble plates, leather samples, and catalog collections."
        }
      ]
    }
  ];

  return (
    <section id="portfolio-projects" className="py-24 bg-[#FAF8F4] relative border-t border-[#E2DDD5]/60 overflow-hidden">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cream/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold font-semibold">
                Studio Renovations
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal tracking-tight">
              Portfolio <span className="font-serif italic text-gold font-normal">Projects</span>
            </h2>
          </div>
          <p className="font-sans font-light text-sm text-muted max-w-md leading-relaxed">
            Take a deep dive into our architectural transformations. Click on any renovation model below to view technical outlines, planning phases, and layout updates.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white border border-[#E2DDD5] group cursor-pointer overflow-hidden transition-all duration-300 hover:border-gold hover:shadow-lg flex flex-col h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-cream/10">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-5 py-3 bg-[#FAF8F4] text-charcoal text-[11px] font-sans uppercase font-medium tracking-[0.2em] shadow-lg flex items-center gap-1.5 transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                    Explore Renovations <Maximize2 className="w-3.5 h-3.5 text-gold" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 bg-charcoal text-warm-white text-[9px] font-sans tracking-widest uppercase px-3 py-1.5 font-medium border border-gold/20">
                  {project.concept}
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-gold/80">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="font-sans text-[10px] tracking-widest uppercase font-semibold">
                      {project.location}
                    </span>
                  </div>
                  
                  <h3 className="font-serif text-2xl font-light text-charcoal group-hover:text-gold transition-colors duration-300 mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="font-sans text-xs text-muted font-light mb-4 line-clamp-2">
                    {project.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E2DDD5]/60 flex items-center justify-between text-muted text-[10px] font-sans tracking-widest uppercase">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span>{project.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-gold" />
                    <span>{project.size}</span>
                  </div>
                  <div className="text-gold font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    View Details <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded Project Details Overlay Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-[#1C1C1A]/70 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-4xl bg-[#FAF8F4] border border-[#E2DDD5] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] max-h-[800px] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-charcoal text-warm-white hover:bg-gold transition-colors duration-300 rounded-none border border-gold/15 focus:outline-none"
                aria-label="Close detailed view"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Column 1: Image & Metrics (Fixed on Left in Large Screens) */}
              <div className="w-full md:w-[45%] relative bg-charcoal flex flex-col min-h-[250px] md:min-h-0">
                <div className="flex-1 relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent md:hidden block h-1/2 bottom-0 absolute" />
                </div>
                
                {/* Fast Specs Column */}
                <div className="bg-[#1C1C1A] border-t border-gold/15 p-6 md:p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[9px] font-sans tracking-widest text-[#FAF8F4]/40 uppercase block mb-1">Duration</span>
                      <div className="flex items-center gap-1.5 text-gold text-xs uppercase font-medium">
                        <Clock className="w-4 h-4" />
                        {selectedProject.duration}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans tracking-widest text-[#FAF8F4]/40 uppercase block mb-1">Footprint</span>
                      <div className="flex items-center gap-1.5 text-gold text-xs uppercase font-medium">
                        <Layers className="w-4 h-4" />
                        {selectedProject.size}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gold/10">
                    <span className="text-[9px] font-sans tracking-widest text-[#FAF8F4]/40 uppercase block mb-1">Design Style Concept</span>
                    <div className="flex items-center gap-1.5 text-warm-white text-xs uppercase font-semibold">
                      <Compass className="w-4 h-4 text-gold" />
                      {selectedProject.concept}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gold/10 flex items-center gap-2 text-[#FAF8F4]/60 text-xs font-light">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    <span>{selectedProject.location}</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Detailed Text & Accordions (Scrollable) */}
              <div className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
                <div>
                  <span className="text-gold font-semibold text-[10px] tracking-[0.25em] font-sans uppercase block mb-1.5">
                    Studio Renovation Details
                  </span>
                  
                  <h3 className="font-serif text-3xl font-light text-charcoal mb-4 leading-tight">
                    {selectedProject.title}
                  </h3>
                  
                  <p className="font-sans text-sm text-charcoal/80 font-light leading-relaxed mb-6">
                    {selectedProject.overview}
                  </p>

                  {/* Scope of Work */}
                  <div className="mb-6">
                    <h4 className="font-serif text-lg font-medium text-charcoal mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Scope of Work
                    </h4>
                    <ul className="space-y-2">
                      {selectedProject.scope.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 font-sans text-xs text-charcoal/70 font-light leading-snug">
                          <ChevronRight className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Curated Zones */}
                  <div>
                    <h4 className="font-serif text-lg font-medium text-charcoal mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Renovated Zones
                    </h4>
                    <div className="space-y-4">
                      {selectedProject.zones.map((zone, idx) => (
                        <div key={idx} className="bg-white border border-[#E2DDD5] p-4">
                          <h5 className="font-serif text-sm font-semibold text-charcoal mb-1 flex items-center justify-between">
                            {zone.name}
                            <span className="font-sans text-[8px] tracking-widest text-gold text-xs uppercase font-medium">Bespoke Zone</span>
                          </h5>
                          <p className="font-sans text-xs text-charcoal/60 font-light leading-relaxed">
                            {zone.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Consult Call CTA */}
                <div className="pt-8 mt-8 border-t border-[#E2DDD5] flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <p className="font-sans text-[10px] text-muted tracking-wide text-center sm:text-left">
                    Inspired by this aesthetic renovation model? Consult on yours today.
                  </p>
                  <a
                    href="https://wa.me/254717634003?text=Hi%20Kloche%20Interiors%20-%20I%20saw%20your%20Portfolio%20Projects%20renovations%20and%20would%20love%20a%20similar%20consultation."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center px-5 py-2.5 bg-gold hover:bg-charcoal text-warm-white font-sans text-[10px] tracking-widest uppercase font-medium transition-all duration-300"
                  >
                    Discuss Renovation
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
