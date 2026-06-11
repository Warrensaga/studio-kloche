import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, MessageSquare, ArrowLeft, Paintbrush, X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const links = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Client CRM",
      href: "/admin/clients",
      icon: Users,
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
    },
    {
      name: "Enquiries",
      href: "/admin/enquiries",
      icon: MessageSquare,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-35 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        id="admin-sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-[#1C1C1A] text-warm-white border-r border-gold/15 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Banner */}
          <div className="p-8 border-b border-gold/10 flex items-center justify-between">
            <Link to="/admin" className="font-serif text-xl font-bold tracking-wider text-warm-white">
              KLOCHE <span className="text-gold font-light italic">CRM</span>
            </Link>
            <div className="flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-gold" />
              {onClose && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-1 text-warm-white/75 hover:text-gold transition-colors focus:outline-none cursor-pointer"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

        {/* Navigation list */}
        <nav className="p-6 space-y-2">
          <p className="font-sans text-[10px] tracking-[0.2em] text-[#FAF8F4]/30 uppercase mb-4 pl-3 font-semibold">Studio Administration</p>
          {links.map((link) => {
            const Icon = link.icon;
            // Exact path match or starting prefix (for sub-routes like [id] client view)
            const isActive =
              link.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-3.5 py-3.5 px-4 rounded-none text-sm transition-all duration-300 relative font-sans tracking-wide ${
                  isActive
                    ? "bg-cream/10 text-gold border-l-2 border-gold font-medium pl-5"
                    : "text-[#FAF8F4]/65 hover:text-warm-white hover:bg-cream/5 border-l-2 border-transparent"
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-gold" : "text-muted"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Return anchor */}
      <div className="p-6 border-t border-gold/10 space-y-3">
        <Link
          to="/"
          className="flex items-center justify-center space-x-2.5 py-2.5 px-3 border border-[#E2DDD5]/20 hover:border-gold hover:text-gold text-[10px] uppercase tracking-widest font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Website</span>
        </Link>
        <button
          onClick={() => {
            sessionStorage.removeItem("kloche_admin_authenticated");
            sessionStorage.removeItem("kloche_admin_user");
            localStorage.removeItem("kloche_admin_authenticated");
            localStorage.removeItem("kloche_admin_user");
            window.location.href = "/admin";
          }}
          className="w-full flex items-center justify-center space-x-2.5 py-2.5 px-3 border border-red-500/15 text-red-400/80 hover:text-red-400 hover:bg-red-500/15 text-[10px] uppercase tracking-widest font-medium transition-all cursor-pointer"
        >
          <span>Sign Out Account</span>
        </button>
      </div>
    </aside>
    </>
  );
}
