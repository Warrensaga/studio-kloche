import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Renovations", href: "#portfolio-projects" },
    { name: "Process", href: "#process" },
    { name: "Reviews", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FAF8F4]/95 backdrop-blur-md py-4 border-b border-gold/20 text-charcoal shadow-md"
          : "bg-[#FAF8F4] py-5 border-b border-gold/10 text-charcoal"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          id="nav-logo"
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-serif text-2xl md:text-3xl font-semibold tracking-wider transition-colors duration-300 text-charcoal hover:text-gold"
        >
          KLOCHE <span className="text-gold font-light italic">Interiors</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center space-x-8 font-sans text-sm tracking-widest uppercase">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative py-1 transition-colors duration-300 text-charcoal/90 hover:text-gold"
              >
                {link.name}
              </a>
            ))}
          </div>

          <a
            id="nav-cta-desktop"
            href="https://wa.me/254717634003?text=Hi%20Kloche%20Interiors%20-%20I%20would%20like%20to%20get%20a%20luxury%20design%20consultation%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gold text-warm-white px-5 py-2.5 hover:bg-charcoal hover:text-warm-white transition-all duration-300 tracking-widest text-xs uppercase font-medium"
          >
            Get a Quote <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Hamburger Toggle */}
        <button
          id="nav-hamburger"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-1 focus:outline-none transition-colors duration-300 text-charcoal hover:text-gold"
          aria-label="Toggle Navigation Screen"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-screen bg-[#FAF8F4] text-charcoal z-40 flex flex-col justify-center px-8 md:px-16"
          >
            <div className="absolute top-6 right-6">
              <button
                id="nav-close-mobile"
                onClick={() => setIsOpen(false)}
                className="text-charcoal p-2 hover:text-gold"
                aria-label="Close Screen"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col space-y-6 font-serif text-3xl md:text-4xl text-left select-none">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="hover:text-gold transition-colors duration-300 py-1 border-b border-[#E2DDD5]/40 text-charcoal"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
                className="pt-4 flex flex-col gap-6"
              >
                <a
                  href="https://wa.me/254717634003?text=Hi%20Kloche%20Interiors%20-%20I%20would%20like%20to%20get%20a%20luxury%20design%20consultation%20quote."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-fit text-center bg-gold text-warm-white font-sans px-8 py-3.5 hover:bg-charcoal hover:text-warm-white transition-colors duration-300 text-sm tracking-widest uppercase flex items-center gap-2"
                >
                  Get a Quote <ArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>
            
            <div className="absolute bottom-12 left-8 md:left-16 text-charcoal/60 font-sans text-xs tracking-widest gap-2 flex flex-col uppercase">
              <p>Karuna Rd, Nairobi, Kenya</p>
              <p>0717 634003 / klocheinteriors@gmail.com</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
