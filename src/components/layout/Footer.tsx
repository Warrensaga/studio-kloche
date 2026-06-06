import { Link } from "react-router-dom";
import { Instagram, Linkedin, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Interior Design", href: "#services" },
    { name: "Full Renovation", href: "#services" },
    { name: "Short Let Styling", href: "#services" },
    { name: "Office Design", href: "#services" },
    { name: "Space Planning", href: "#services" },
    { name: "Furniture & Decor", href: "#services" },
  ];

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Studio", href: "#about" },
    { name: "Our Work", href: "#portfolio" },
    { name: "Process Model", href: "#process" },
    { name: "Client Reviews", href: "#testimonials" },
    { name: "Contact Desk", href: "#contact" },
  ];

  // Custom icon for TikTok since Lucide doesn't have a direct modern TikTok icon
  const TikTokIcon = () => (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.94-1.69-.22-.19-.44-.38-.63-.59v6.33c.02 1.37-.28 2.79-.96 3.98-1.25 2.23-3.8 3.65-6.38 3.49-2.58-.16-4.9-1.84-5.74-4.29-.91-2.63-.16-5.71 1.83-7.58 1.68-1.58 4.14-2.12 6.34-1.43v4.14c-1.35-.49-2.92-.15-3.92.83-.93.92-1.12 2.45-.48 3.59.61 1.09 1.91 1.74 3.14 1.52 1.25-.22 2.21-1.34 2.22-2.61V.02z" />
    </svg>
  );

  return (
    <footer id="main-footer" className="bg-[#1C1C1A] text-warm-white pt-20 pb-10 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        {/* Brand Columns */}
        <div className="flex flex-col space-y-6">
          <Link
            id="footer-logo"
            to="/"
            className="font-serif text-3xl font-semibold tracking-wider hover:text-gold transition-colors"
          >
            KLOCHE <span className="text-gold font-light italic">Interiors</span>
          </Link>
          <p className="font-sans font-light text-sm text-[#F5F0E8]/70 leading-relaxed max-w-sm">
            Spaces that inspire, lives well lived. Premium interior architecture and master renovation services in Nairobi, Kenya. We craft bespoke luxury experiences.
          </p>

          {/* Bordered Squares for social icons as requested */}
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="https://www.instagram.com/klocheinteriors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Page"
              className="w-10 h-10 border border-gold/30 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300 bg-transparent text-[#F5F0E8]/80 text-sm"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@klocheinteriors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Profile"
              className="w-10 h-10 border border-gold/30 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300 bg-transparent text-[#F5F0E8]/80 text-sm"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://www.linkedin.com/company/klocheinteriors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-10 h-10 border border-gold/30 hover:border-gold hover:text-gold flex items-center justify-center transition-all duration-300 bg-transparent text-[#F5F0E8]/80 text-sm"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Services Columns */}
        <div>
          <h4 className="font-serif text-lg font-medium text-gold tracking-wide mb-6">Our Services</h4>
          <ul className="space-y-3 font-sans text-sm font-light text-[#F5F0E8]/70">
            {services.map((svc) => (
              <li key={svc.name}>
                <a
                  href={svc.href}
                  className="hover:text-gold transition-colors duration-200 flex items-center group"
                >
                  <span className="w-0 group-hover:w-1.5 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  {svc.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Studio Quicklinks */}
        <div>
          <h4 className="font-serif text-lg font-medium text-gold tracking-wide mb-6">Quick Links</h4>
          <ul className="space-y-3 font-sans text-sm font-light text-[#F5F0E8]/70">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="hover:text-gold transition-colors duration-200 flex items-center group"
                >
                  <span className="w-0 group-hover:w-1.5 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-200"></span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-lg font-medium text-gold tracking-wide mb-6">Contact Studio</h4>
          
          <div className="flex items-start space-x-3 text-sm font-light text-[#F5F0E8]/70">
            <MapPin className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
            <span>Karuna Rd, Nairobi, Kenya</span>
          </div>

          <div className="flex items-center space-x-3 text-sm font-light text-[#F5F0E8]/70">
            <Phone className="w-4 h-4 text-gold flex-shrink-0" />
            <a href="tel:+254717634003" className="hover:text-gold transition-colors">
              0717 634003
            </a>
          </div>

          <div className="flex items-center space-x-3 text-sm font-light text-[#F5F0E8]/70">
            <Mail className="w-4 h-4 text-gold flex-shrink-0" />
            <a href="mailto:klocheinteriors@gmail.com" className="hover:text-gold transition-colors">
              klocheinteriors@gmail.com
            </a>
          </div>

          <div className="flex items-start space-x-3 text-sm font-light text-[#F5F0E8]/70 pt-2">
            <Clock className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium text-[#FAF8F4]/90">Mon – Sat: 8:00 AM – 5:00 PM</p>
              <p className="text-xs text-[#F5F0E8]/50">Sundays: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Baseline Copyright status */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between text-xs text-[#F5F0E8]/40 font-sans tracking-widest uppercase">
        <p className="mb-4 md:mb-0">
          <Link to="/admin" className="hover:text-gold/60 transition-all cursor-default mr-1" title="Back office portal">©</Link>{currentYear} Kloche Interiors. All Rights Reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#about" className="hover:text-gold transition-colors">Terms of Use</a>
          <a href="#about" className="hover:text-gold transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
