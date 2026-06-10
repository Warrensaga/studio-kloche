import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

// Public Modules
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import Services from "./components/home/Services";
import About from "./components/home/About";
import Portfolio from "./components/home/Portfolio";
import PortfolioProjects from "./components/home/PortfolioProjects";
import Process from "./components/home/Process";
import Testimonials from "./components/home/Testimonials";
import WhatsAppCTA from "./components/home/WhatsAppCTA";
import ContactForm from "./components/home/ContactForm";
import Footer from "./components/layout/Footer";
import WhatsAppFloat from "./components/layout/WhatsAppFloat";

// Admin Modules
import Sidebar from "./components/admin/Sidebar";
import DashboardStats from "./components/admin/DashboardStats";
import ClientsTable from "./components/admin/ClientsTable";
import ClientForm from "./components/admin/ClientForm";
import AppointmentCalendar from "./components/admin/AppointmentCalendar";
import AppointmentModal from "./components/admin/AppointmentModal";
import EnquiriesTable from "./components/admin/EnquiriesTable";
import { DashboardWidget } from "./components/admin/DashboardWidget";
import { TodoSidebar } from "./components/admin/TodoSidebar";

// Icons
import {
  Users, MessageSquare, Calendar, Briefcase, Plus, Search,
  RefreshCw, ArrowLeft, Save, Globe, Eye, User, Phone, Mail, MapPin, Send, Loader
} from "lucide-react";
import { format } from "date-fns";

// Desktop custom cursor listener hook
function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className="custom-cursor-ring"
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
}

// 1. PUBLIC VIEW HOMEPAGE
function PublicHome() {
  return (
    <div id="public-main-root" className="bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Portfolio />
      <PortfolioProjects />
      <Process />
      <Testimonials />
      <WhatsAppCTA />
      <ContactForm />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

// 2. ADMIN HOOD
function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F0E8]/25 pl-64 flex flex-col font-sans">
      <Sidebar />
      <header className="bg-white h-16 border-b border-[#E2DDD5]/70 px-8 flex items-center justify-between shadow-xs sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">Connected to Local SQLite SQLite database</p>
        </div>
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-1 text-xs uppercase tracking-widest text-gold font-semibold hover:text-charcoal transition-colors pb-0.5 border-b border-gold/40 hover:border-charcoal"
        >
          <Globe className="w-3.5 h-3.5" /> View Public Site
        </a>
      </header>
      <main className="p-8 flex-1">{children}</main>
    </div>
  );
}

// A. ADMIN DASHBOARD OVERVIEW PAGE
function AdminDashboard() {
  const [stats, setStats] = useState({ clients: 0, enquiries: 0, appointments: 0, activeProject: 0 });
  const [recentEnqs, setRecentEnqs] = useState<any[]>([]);
  const [recentAppts, setRecentAppts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch Clients, Enquiries, Appointments
      const clientsRes = await fetch("/api/clients");
      const enqsRes = await fetch("/api/enquiries");
      const apptsRes = await fetch("/api/appointments");

      if (clientsRes.ok && enqsRes.ok && apptsRes.ok) {
        const clients = await clientsRes.json();
        const enqs = await enqsRes.json();
        const appts = await apptsRes.json();

        // Calculate counts
        const unreadCount = enqs.filter((e: any) => e.status === "new").length;
        const activeProjList = clients.filter((c: any) => c.status === "active").length;
        
        // Count of appointments this month
        const thisMonthStr = format(new Date(), "yyyy-MM");
        const monthAppts = appts.filter((a: any) => {
          if (!a.start) return false;
          return a.start.startsWith(thisMonthStr);
        }).length;

        setStats({
          clients: clients.length,
          enquiries: unreadCount,
          appointments: monthAppts,
          activeProject: activeProjList,
        });

        // Set tables lists
        setRecentEnqs(enqs.slice(0, 5));
        setRecentAppts(appts.slice(0, 3));
      }
    } catch (err) {
      console.error(err);
      toast.error("Database connection dropped.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 text-left">
        {/* Row 1 Header */}
        <div className="flex justify-between items-center bg-white p-6 border border-[#E2DDD5] shadow-xs">
          <div>
            <h1 className="font-serif text-3xl font-light text-charcoal">Studio Overview Dashboard</h1>
            <p className="text-xs text-muted font-light mt-1">Real-time Kloche Interiors client relationship CRM metrics & schedule queues.</p>
          </div>
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsTodoOpen(true)}
              className="flex items-center space-x-2 py-2 px-4 border border-[#1C1C1A] text-charcoal hover:bg-[#1C1C1A] hover:text-[#FAF8F4] text-xs font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer"
            >
              <span>📋 Reminders & To-Dos</span>
            </button>
            <button
              onClick={fetchDashboardData}
              className="p-2 border border-[#E2DDD5] hover:border-gold-light hover:text-gold text-charcoal bg-[#FAF8F4] transition-colors cursor-pointer"
              title="Refresh Core Data"
            >
              <RefreshCw className="w-4.5 h-4.5 text-[#6B6560]" />
            </button>
          </div>
        </div>

        {/* Dynamic metrics widgets */}
        <DashboardStats
          totalClients={stats.clients}
          newEnquiries={stats.enquiries}
          appointments={stats.appointments}
          activeProjects={stats.activeProject}
        />

        {/* Recharts Graphical Visualizations */}
        <DashboardWidget />

        {loading ? (
          <div className="py-20 flex justify-center items-center"><Loader className="w-8 h-8 animate-spin text-gold" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Recent Enquiries panel */}
            <div className="lg:col-span-7 bg-white border border-[#E2DDD5] shadow-xs p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-charcoal">Recent Submission Leads</h3>
                  <p className="text-xs text-muted font-light">Last 5 enquiries via contact form</p>
                </div>
                <Link to="/admin/enquiries" className="text-xs text-gold hover:text-charcoal font-semibold uppercase tracking-wider">
                  View All Enquiries
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#6B6560]">
                  <thead>
                    <tr className="bg-[#FAF8F4] border-b border-[#E2DDD5] uppercase tracking-widest font-semibold text-muted text-[10px]">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5]/40 text-xs">
                    {recentEnqs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted font-light">No enquiries found</td>
                      </tr>
                    ) : (
                      recentEnqs.map((enq) => (
                        <tr key={enq.id} className="hover:bg-zinc-50/50">
                          <td className="py-3.5 px-4 font-medium text-charcoal font-serif text-sm">{enq.name}</td>
                          <td className="py-3.5 px-4 text-gold font-medium">{enq.service}</td>
                          <td className="py-3.5 px-4 font-light">{format(new Date(enq.createdAt), "MM-dd-yyyy")}</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`px-2 py-0.5 font-semibold text-[9px] uppercase tracking-wider ${
                              enq.status === "new" ? "bg-amber-100 text-amber-800" :
                              enq.status === "read" ? "bg-zinc-100 text-zinc-650" : "bg-emerald-100 text-emerald-800"
                            }`}>
                              {enq.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming appointments panel */}
            <div className="lg:col-span-5 bg-white border border-[#E2DDD5] shadow-xs p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-charcoal">Upcoming Calendar Slots</h3>
                  <p className="text-xs text-muted font-light">Next 3 scheduled walkthrough consultations</p>
                </div>
                <Link to="/admin/appointments" className="text-xs text-gold hover:text-charcoal font-semibold uppercase tracking-wider">
                  Open Calendar
                </Link>
              </div>

              <div className="space-y-4">
                {recentAppts.length === 0 ? (
                  <p className="text-xs text-muted p-4 text-center font-light border border-dashed border-[#E2DDD5]">No upcoming bookings. Add some on the appointments calendar view.</p>
                ) : (
                  recentAppts.map((appt) => {
                    const startLocal = appt.start ? new Date(appt.start) : null;
                    return (
                      <div key={appt.id} className="p-4 bg-[#FAF8F4] border-l-3 border-gold flex items-start justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-semibold text-charcoal">{appt.extendedProps?.clientName ?? appt.title}</h4>
                          <p className="font-sans text-[11px] text-gold font-medium uppercase mt-0.5">{appt.extendedProps?.service}</p>
                          <p className="font-sans text-[10px] text-muted font-light mt-1 flex items-center">
                            Date: {startLocal ? format(startLocal, "LLL d, yyyy 'at' hh:mm a") : appt.start}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 text-[9px] font-semibold text-white uppercase tracking-wider`} style={{ backgroundColor: appt.backgroundColor }}>
                          {appt.extendedProps?.status || "confirmed"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Slide-out collapsing Reminders panel Drawer */}
      <TodoSidebar isOpen={isTodoOpen} onClose={() => setIsTodoOpen(false)} />
    </AdminLayout>
  );
}

// B. ADMIN CLIENTS LIST PAGE
function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setLoading(true);
      let url = "/api/clients";
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (filterStatus !== "all") params.append("status", filterStatus);
      
      const queryStr = params.toString();
      if (queryStr) url += `?${queryStr}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClients();
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Client file deleted successfully");
        fetchClients();
      } else {
        toast.error("Failed to clean client attributes");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmission = async (formData: any) => {
    try {
      let url = "/api/clients";
      let method = "POST";
      
      if (editingClient) {
        url += `/${editingClient.id}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(editingClient ? "Client updated!" : "New Client Registered!");
        setFormOpen(false);
        setEditingClient(null);
        fetchClients();
      } else {
        toast.error("Validation rejected by backend schema.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Database communication failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 text-left font-sans">
        
        {/* Table Toolbar Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 border border-[#E2DDD5] shadow-xs gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light text-charcoal">Customer CRM Directory</h1>
            <p className="text-xs text-muted font-light mt-1">Edit core walkthrough statuses, customer accounts, and milestone histories.</p>
          </div>
          <button
            onClick={() => {
              setEditingClient(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-1.5 py-3 px-5 bg-charcoal text-warm-white hover:bg-gold transition-colors text-xs font-semibold uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 text-gold" /> Add New Client
          </button>
        </div>

        {/* Search tool block */}
        <div className="bg-white p-4 border border-[#E2DDD5] flex flex-col md:flex-row justify-between items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex w-full md:max-w-md relative">
            <input
              type="text"
              placeholder="Search by client name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#FAF8F4] border border-[#E2DDD5] w-full pl-4 pr-10 py-2.5 text-xs focus:ring-0 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="absolute right-3 top-3 text-muted hover:text-gold">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Sizing dropdown filtering indicators */}
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-semibold text-[#6B6560] tracking-wider">Status:</span>
            {["all", "lead", "active", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest border transition-colors ${
                  filterStatus === st
                    ? "bg-charcoal text-white border-charcoal"
                    : "bg-white text-muted border-[#E2DDD5] hover:bg-cream"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center"><Loader className="w-8 h-8 animate-spin text-gold" /></div>
        ) : (
          <ClientsTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewProfile={(id) => navigate(`/admin/clients/${id}`)}
          />
        )}

        <ClientForm
          isOpen={formOpen}
          onClose={() => {
            setFormOpen(false);
            setEditingClient(null);
          }}
          onSubmit={handleFormSubmission}
          initialData={editingClient}
        />
      </div>
    </AdminLayout>
  );
}

// C. SINGLE CLIENT PROFILE PAGE [id]
function AdminClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Note edit state
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/clients/${id}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
        setNoteText(data.notes || "");
      } else {
        toast.error("Profile file not found");
        navigate("/admin/clients");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network synchronization failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  // Persistent notes autosave on blur as requested!
  const handleNoteBlur = async () => {
    if (!client) return;
    setIsSavingNote(true);
    try {
      const res = await fetch(`/api/clients/${client.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: noteText }),
      });
      if (res.ok) {
        toast.success("Notes saved automatically");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNote(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 flex justify-center items-center"><Loader className="w-8 h-8 animate-spin text-gold" /></div>
      </AdminLayout>
    );
  }

  if (!client) return null;

  return (
    <AdminLayout>
      <div className="space-y-8 text-left font-sans">
        
        {/* Breadcrumb row */}
        <div className="flex justify-between items-center bg-white p-6 border border-[#E2DDD5] shadow-xs">
          <button
            onClick={() => navigate("/admin/clients")}
            className="flex items-center gap-1 text-xs uppercase tracking-widest text-[#6B6560] hover:text-gold font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to CRM list
          </button>
          
          <div className="text-right">
            <span className={`px-3 py-1 font-semibold text-[10px] uppercase tracking-wider bg-cream text-gold border border-gold/20`}>
              {client.status} Flag
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column Profile info card */}
          <div className="lg:col-span-4 bg-white border border-[#E2DDD5] shadow-xs p-6 divide-y divide-[#E2DDD5]/50 space-y-6">
            <div className="text-center pb-6">
              <div className="w-16 h-16 bg-cream text-gold border border-gold/15 rounded-none flex items-center justify-center font-serif text-3xl font-semibold mx-auto mb-4">
                {client.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-serif text-2xl font-light text-charcoal">{client.name}</h2>
              <p className="text-[10px] text-muted tracking-widest uppercase mt-0.5">Studio Client Folder</p>
            </div>

            <div className="py-6 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6B6560] font-light">Phone Contact:</span>
                <a href={`tel:${client.phone}`} className="font-medium text-charcoal hover:text-gold flex items-center"><Phone className="w-3 h-3 text-gold mr-1" /> {client.phone}</a>
              </div>
              {client.email && (
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6560] font-light">Email Address:</span>
                  <a href={`mailto:${client.email}`} className="font-medium text-muted hover:text-gold truncate max-w-[130px]">{client.email}</a>
                </div>
              )}
              {client.address && (
                <div className="flex items-center justify-between">
                  <span className="text-[#6B6560] font-light">Physical Address:</span>
                  <span className="font-medium text-charcoal text-right leading-none max-w-[150px]">{client.address}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[#6B6560] font-light">Client Registered:</span>
                <span className="font-medium text-charcoal">{format(new Date(client.createdAt), "MMMM dd, yyyy")}</span>
              </div>
            </div>

            {/* Persistent notes edit box */}
            <div className="pt-6 relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-charcoal">Autosaving Client Notes</label>
                {isSavingNote && <Loader className="w-3 h-3 animate-spin text-gold" />}
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onBlur={handleNoteBlur}
                rows={6}
                placeholder="Autosaves on focus blur. Maintain client space preferences, custom color samples, blueprint requirements or estimated budgets here."
                className="w-full bg-[#FAF8F4] border border-[#E2DDD5] p-3 text-xs focus:ring-0 focus:outline-none focus:border-gold resize-none leading-relaxed text-[#1C1C1A]"
              />
              <div className="text-[9px] text-[#6B6560] text-center italic mt-1 pb-4">✏️ Click outside of notes boxes to record input.</div>
            </div>

            {/* Project Metrics editing subcard */}
            <div className="pt-6 space-y-4">
              <h4 className="text-[10px] uppercase font-bold tracking-widest text-charcoal">Studio Operational Metrics</h4>
              <div className="space-y-4 text-xs text-left">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-semibold text-[#6B6560] block">Consultancy Hours Committed</label>
                  <input
                    type="number"
                    value={client.consultancyHours || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setClient({ ...client, consultancyHours: val });
                    }}
                    onBlur={async () => {
                      try {
                        await fetch(`/api/clients/${client.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ consultancyHours: client.consultancyHours }),
                        });
                        toast.success("Consultancy hours synchronized");
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full bg-[#FAF8F4] border border-[#E2DDD5] px-3 py-2 text-xs focus:ring-0 focus:outline-none focus:border-gold text-[#1C1C1A]"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase font-semibold text-[#6B6560]">Project Completion Rate</label>
                    <span className="text-gold font-bold">{client.completionRate || 0}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={client.completionRate || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setClient({ ...client, completionRate: val });
                      }}
                      onMouseUp={async () => {
                        try {
                          await fetch(`/api/clients/${client.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ completionRate: client.completionRate }),
                          });
                          toast.success("Progress metrics updated");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      onTouchEnd={async () => {
                        try {
                          await fetch(`/api/clients/${client.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ completionRate: client.completionRate }),
                          });
                          toast.success("Progress metrics updated");
                        } catch (err) {
                          console.error(err);
                        }
                      }}
                      className="w-full h-1.5 bg-[#E2DDD5] rounded-none appearance-none cursor-pointer accent-gold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column details list */}
          <div className="lg:col-span-8 flex flex-col space-y-8">
            
            {/* Linked enquiries list */}
            <div className="bg-white border border-[#E2DDD5] shadow-xs p-6 text-left">
              <h3 className="font-serif text-lg font-medium text-charcoal mb-4">Linked Enquiries Leads</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FAF8F4] border-b border-[#E2DDD5] text-muted text-[10px] uppercase tracking-widest font-semibold text-left">
                      <th className="py-2.5 px-3">Service</th>
                      <th className="py-2.5 px-3">Enquiry Brief Text / Requirements</th>
                      <th className="py-2.5 px-3">Created Date</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5]/40 text-[#6B6560]">
                    {client.enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-muted font-light">No historical form submissions recorded.</td>
                      </tr>
                    ) : (
                      client.enquiries.map((enq: any) => (
                        <tr key={enq.id} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-3 font-semibold text-gold">{enq.service}</td>
                          <td className="py-3 px-3 italic font-light tracking-wide max-w-sm font-serif">{enq.message}</td>
                          <td className="py-3 px-3 font-light">{format(new Date(enq.createdAt), "LLL dd, yyyy")}</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold border bg-zinc-50 border-gold/15 text-gold">
                              {enq.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Booked consultations calendar history */}
            <div className="bg-white border border-[#E2DDD5] shadow-xs p-6 text-left">
              <h3 className="font-serif text-lg font-medium text-charcoal mb-4">Booked Studio Walkthroughs</h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FAF8F4] border-b border-[#E2DDD5] text-muted text-[10px] uppercase tracking-widest font-semibold text-left">
                      <th className="py-2.5 px-3">Subject / Title</th>
                      <th className="py-2.5 px-3">Scope Service</th>
                      <th className="py-2.5 px-3">Date & Time</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2DDD5]/40 text-[#6B6560]">
                    {client.appointments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted font-light">No consultation appointments linked to this metadata file.</td>
                      </tr>
                    ) : (
                      client.appointments.map((appt: any) => (
                        <tr key={appt.id} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-3 font-medium text-charcoal">{appt.title}</td>
                          <td className="py-3 px-3 text-gold font-light uppercase tracking-wider text-[10px]">{appt.service}</td>
                          <td className="py-3 px-3 font-light">{format(new Date(appt.date), "LLL dd, yyyy 'at' hh:mm a")}</td>
                          <td className="py-3 px-3 font-light">{appt.duration} Mins</td>
                          <td className="py-3 px-3 text-right">
                            <span className="px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800">
                              {appt.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chronological Status History Timeline */}
            <div className="bg-white border border-[#E2DDD5] shadow-xs p-6 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-charcoal">Status Lifecycle History</h3>
                  <p className="text-[10px] text-muted font-light mt-0.5">Chronological record of operational milestones and lifecycle modifications.</p>
                </div>
                
                {/* Real-time status toggle selector */}
                <div className="flex items-center space-x-2 bg-[#FAF8F4] px-3 py-1.5 border border-[#E2DDD5]">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B6560]">Current Status:</span>
                  <select
                    value={client.status || "lead"}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      try {
                        const res = await fetch(`/api/clients/${client.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: newStatus }),
                        });
                        if (res.ok) {
                          toast.success(`Client migrated to ${newStatus.toUpperCase()}`, {
                            icon: "✨",
                            style: { background: "#1C1C1A", color: "#FAF8F4", border: "1px solid #FAB012" }
                          });
                          // Reload client detail info
                          fetchClientDetails();
                        } else {
                          toast.error("Status migration rejected");
                        }
                      } catch (err) {
                        console.error(err);
                        toast.error("Failed to migrate status");
                      }
                    }}
                    className="bg-transparent text-xs font-semibold focus:outline-none text-gold uppercase tracking-wider cursor-pointer"
                  >
                    <option value="lead">Lead</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Grid timeline lines */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-[#E2DDD5]">
                {!client.statusHistory || client.statusHistory.length === 0 ? (
                  <div className="text-xs text-[#6B6560] font-light italic pl-2">No historical alterations registered. Stage initialized as: <span className="text-gold uppercase font-bold text-[10px] font-sans tracking-wide">{client.status || "lead"}</span>.</div>
                ) : (
                  [...client.statusHistory]
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((history: any, idx: number) => (
                      <div key={history.id || idx} className="relative group">
                        {/* Bullet circle indicator */}
                        <div className="absolute -left-[23px] top-1 w-3 h-3 bg-white border-2 border-gold rounded-full group-hover:bg-gold transition-colors"></div>
                        
                        <div className="text-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="font-semibold text-charcoal">
                              Status migration: <span className="text-rose-800 line-through font-light mr-1 uppercase text-[10px]">{history.oldStatus}</span> → <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-150 px-2 py-0.5 font-sans text-[10px] ml-1 uppercase rounded-sm">{history.newStatus}</span>
                            </span>
                            <span className="text-[10px] text-muted font-mono">{format(new Date(history.createdAt), "LLL dd, yyyy 'at' hh:mm a")}</span>
                          </div>
                          <div className="text-[10px] text-[#6B6560] mt-1 font-light">Authorized by: <strong className="font-semibold text-charcoal">{history.changedBy || "Back Office Admin"}</strong></div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

// D. ADMIN APPOINTMENTS FULL-CALENDAR PAGE
function AdminAppointments() {
  const [events, setEvents] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [clickedDate, setClickedDate] = useState<string>("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const apptRes = await fetch("/api/appointments");
      const clientRes = await fetch("/api/clients");
      
      if (apptRes.ok && clientRes.ok) {
        setEvents(await apptRes.json());
        setClients(await clientRes.json());
      }
    } catch (err) {
      console.error(err);
      toast.error("Dropped calendar database link");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDateClick = (dateStr: string) => {
    setSelectedEvent(null);
    setClickedDate(dateStr);
    setModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    // Transform event properties back to match the form fields
    const props = event.extendedProps;
    setSelectedEvent({
      id: event.id,
      title: props.appointmentTitle || event.title,
      clientName: props.clientName || "",
      phone: props.phone || "",
      service: props.service || "",
      date: props.date || "",
      duration: props.duration || 60,
      status: props.status || "confirmed",
      notes: props.notes || "",
      clientId: props.clientId || "",
    });
    setClickedDate("");
    setModalOpen(true);
  };

  const handleFormSubmission = async (formData: any) => {
    try {
      let url = "/api/appointments";
      let method = "POST";

      if (selectedEvent) {
        url += `/${selectedEvent.id}`;
        method = "PATCH";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(selectedEvent ? "Appointment updated!" : "Booked consultation slot!");
        setModalOpen(false);
        fetchAppointments();
      } else {
        toast.error("Rejected by schema validators");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Appointment cleared");
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 text-left font-sans">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 border border-[#E2DDD5] shadow-xs gap-4">
          <div>
            <h1 className="font-serif text-3xl font-light text-charcoal">Studio Schedule Calendar</h1>
            <p className="text-xs text-muted font-light mt-1">Check scheduled on-site renovations, walkthrough briefings, or short let styling consults.</p>
          </div>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setClickedDate("");
              setModalOpen(true);
            }}
            className="flex items-center gap-1.5 py-3 px-5 bg-charcoal text-warm-white hover:bg-gold transition-colors text-xs font-semibold uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 text-gold" /> Arrange New Slot
          </button>
        </div>

        {/* Viewport calendar box */}
        {loading ? (
          <div className="py-20 flex justify-center items-center"><Loader className="w-8 h-8 animate-spin text-gold" /></div>
        ) : (
          <AppointmentCalendar
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}

        <AppointmentModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleFormSubmission}
          onDelete={selectedEvent ? handleDelete : undefined}
          clientsList={clients}
          initialData={
            selectedEvent
              ? selectedEvent
              : clickedDate
              ? { date: clickedDate }
              : null
          }
        />
      </div>
    </AdminLayout>
  );
}

// E. ADMIN ENQUIRIES TABLE PAGE
function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      let url = "/api/enquiries";
      if (filterStatus !== "all") {
        url += `?status=${filterStatus}`;
      }

      const res = await fetch(url);
      if (res.ok) {
        setEnquiries(await res.json());
      }
    } catch (err) {
      console.error(err);
      toast.error("Lead server offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [filterStatus]);

  // Patch status from read to replied
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Leads status updated to ${status}`);
        fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Convert an Enquiry into a full Client Profile!
  const handleConvertToClient = async (enquiry: any) => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Seed client data from enquiry fields
        body: JSON.stringify({
          name: enquiry.name,
          phone: enquiry.phone,
          email: enquiry.email || null,
          status: "lead", // Created as a lead first
          address: "",
          notes: `Created automatically by converting website enquiry regarding "${enquiry.service}". Submission details: "${enquiry.message}"`,
        }),
      });

      if (res.ok) {
        const client = await res.json();
        
        // Link enquiry metadata to client
        await fetch(`/api/enquiries/${enquiry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }), // Mark read
        });

        toast.success(`Converted ${enquiry.name} to CRM Client Profile!`);
        fetchEnquiries();
      } else {
        toast.error("CRM database rejected client conversion schema.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Convert endpoint failed");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8 text-left font-sans">
        
        {/* Table Title Bar */}
        <div className="flex justify-between items-center bg-white p-6 border border-[#E2DDD5] shadow-xs">
          <div>
            <h1 className="font-serif text-3xl font-light text-charcoal">Studio Enquiry Leads</h1>
            <p className="text-xs text-muted font-light mt-1">Review guest messages, expand design briefs, convert entries to CRM client accounts, or message directly via WhatsApp links.</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center"><Loader className="w-8 h-8 animate-spin text-gold" /></div>
        ) : (
          <EnquiriesTable
            enquiries={enquiries}
            onStatusChange={handleStatusChange}
            onConvertToClient={handleConvertToClient}
            onRefresh={fetchEnquiries}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
      </div>
    </AdminLayout>
  );
}


// 3. ADMIN ACCESS CONTROL (SECURE DATABASE-BACKED SIGN IN & SIGN UP)
function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState(true);
  const navigate = useNavigate();

  // Forgot password & Remember me states
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCodeInput, setResetCodeInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [receivedResetCode, setReceivedResetCode] = useState("");

  const checkAdmins = async () => {
    try {
      const res = await fetch("/api/auth/admins-count");
      if (res.ok) {
        const data = await res.json();
        const countExists = data.count > 0;
        setHasAdmins(countExists);
        if (!countExists) {
          setIsSignUp(true); // Default to registration so they can initialize
        }
      }
    } catch (err) {
      console.error("Failed to check admins counter:", err);
    }
  };

  useEffect(() => {
    const authStatusSession = sessionStorage.getItem("kloche_admin_authenticated");
    const authStatusLocal = localStorage.getItem("kloche_admin_authenticated");
    if (authStatusSession === "true" || authStatusLocal === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      checkAdmins();
    }

    // Recover login username if they checked Remember Me
    const rememberedLogin = localStorage.getItem("kloche_remember_me_login");
    if (rememberedLogin) {
      setLogin(rememberedLogin);
      setRememberMe(true);
    }
  }, []);

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReceivedResetCode(data.code || "");
        setResetStep(2);
        toast.success("Verification pin generated! Provided below for development ease.", {
          icon: "✉️",
          style: { background: "#1C1C1A", color: "#FAF8F4", border: "1px solid #FAB012" }
        });
      } else {
        toast.error(data.error || "Reset dispatch failed", {
          style: { background: "#4A0E17", color: "#FAF8F4" }
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Endpoint timeout");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          code: resetCodeInput,
          newPassword: newPasswordInput
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Security coordinates synchronized! Try signing in.", {
          icon: "🗝️",
          style: { background: "#1C1C1A", color: "#FAF8F4", border: "1px solid #FAB012" }
        });
        setShowForgot(false);
        setResetStep(1);
        setLogin(forgotEmail);
        setPassword("");
        setResetCodeInput("");
        setNewPasswordInput("");
      } else {
        toast.error(data.error || "Submission rejected", {
          style: { background: "#4A0E17", color: "#FAF8F4" }
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Database connection failure");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Register new Admin
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          sessionStorage.setItem("kloche_admin_authenticated", "true");
          sessionStorage.setItem("kloche_admin_user", JSON.stringify(data.user));
          
          if (rememberMe) {
            localStorage.setItem("kloche_admin_authenticated", "true");
            localStorage.setItem("kloche_admin_user", JSON.stringify(data.user));
            localStorage.setItem("kloche_remember_me_login", username);
          } else {
            localStorage.removeItem("kloche_admin_authenticated");
            localStorage.removeItem("kloche_admin_user");
            localStorage.removeItem("kloche_remember_me_login");
          }

          setIsAuthenticated(true);
          toast.success(`Welcome, Admin ${data.user.username}! Account created.`, {
            icon: "🔑",
            style: {
              background: "#1C1C1A",
              color: "#FAF8F4",
              border: "1px solid #FAB012"
            }
          });
        } else {
          toast.error(data.error || "Failed to register new administrator account.", {
            style: { background: "#4A0E17", color: "#FAF8F4" }
          });
        }
      } else {
        // Sign In
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, password }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          sessionStorage.setItem("kloche_admin_authenticated", "true");
          sessionStorage.setItem("kloche_admin_user", JSON.stringify(data.user));
          
          if (rememberMe) {
            localStorage.setItem("kloche_admin_authenticated", "true");
            localStorage.setItem("kloche_admin_user", JSON.stringify(data.user));
            localStorage.setItem("kloche_remember_me_login", login);
          } else {
            localStorage.removeItem("kloche_admin_authenticated");
            localStorage.removeItem("kloche_admin_user");
            localStorage.removeItem("kloche_remember_me_login");
          }

          setIsAuthenticated(true);
          toast.success(`Welcome back, ${data.user.username}`, {
            icon: "🗝️",
            style: {
              background: "#1C1C1A",
              color: "#FAF8F4",
              border: "1px solid #FAB012"
            }
          });
        } else {
          toast.error(data.error || "Invalid credentials. Please try again.", {
            style: { background: "#4A0E17", color: "#FAF8F4" }
          });
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Database connection failure. Please make sure the backend is fully rebooted.", {
        style: { background: "#4A0E17", color: "#FAF8F4" }
      });
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-kloche-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-between font-sans text-[#1C1C1A] selection:bg-kloche-gold/25 relative overflow-hidden">
        {/* Editorial Ornamental lines */}
        <div className="absolute top-1/2 left-0 w-8 h-[1px] bg-kloche-gold/40"></div>
        <div className="absolute top-1/4 right-0 w-8 h-[1px] bg-kloche-gold/40"></div>
        <div className="absolute top-16 left-12 text-[10px] uppercase tracking-[0.4em] text-kloche-green font-bold hidden md:block">
          Est. 2021
        </div>

        {/* Minimalist Top Bar */}
        <div className="w-full px-12 py-10 flex justify-between items-center z-20">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-kloche-gold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Site</span>
          </button>
          
          <div className="text-xl font-serif tracking-tight font-bold">
            KLOCHE <span className="text-kloche-green italic font-bold">Interiors</span>
          </div>
        </div>

        {/* Auth Box Center */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 z-10">
          {showForgot ? (
            <div className="w-full max-w-md bg-[#F5F0E8] border border-[#1C1C1A]/10 p-10 md:p-12 space-y-8 shadow-xs">
              {/* Header Title */}
              <div className="space-y-3 text-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-kloche-green font-bold block">
                  Security Authorization
                </span>
                <h2 className="text-3xl font-serif tracking-tight text-[#1C1C1A]">
                  Reset <span className="italic font-light">Credential</span>
                </h2>
                <p className="text-xs text-[#6B6560] font-light max-w-xs mx-auto leading-relaxed">
                  {resetStep === 1 
                    ? "Enter your master administrator email address to request a secure 6-digit verification code."
                    : "Passphrase synchronization phase. Enter your dispatched validation pin and key in your new back-office password."
                  }
                </p>
              </div>

              {resetStep === 1 ? (
                <form onSubmit={handleForgotPasswordRequest} className="space-y-5">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                      Master Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. administrator@kloche.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C1C1A] hover:bg-black text-[#FAF8F4] py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin text-kloche-gold" />
                        <span>Requesting Token...</span>
                      </>
                    ) : (
                      <span>Dispatch Reset Code</span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                  {receivedResetCode && (
                    <div className="bg-kloche-green/5 border border-kloche-green/20 p-3.5 text-left text-xs text-kloche-green leading-relaxed">
                      <p className="font-bold uppercase tracking-wider text-[9px] mb-1">Authorization Code Dispatched</p>
                      Reset Code: <strong className="text-charcoal font-bold tracking-widest text-sm bg-white border px-2 py-0.5 border-kloche-green/10 ml-1 font-mono">{receivedResetCode}</strong>
                    </div>
                  )}

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                      Verification Code (6-Digits)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 123456"
                      value={resetCodeInput}
                      onChange={(e) => setResetCodeInput(e.target.value)}
                      className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A] font-mono tracking-widest text-center"
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                      New Passphrase
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C1C1A] hover:bg-black text-[#FAF8F4] py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin text-kloche-gold" />
                        <span>Upgrading Passphrase...</span>
                      </>
                    ) : (
                      <span>Synchronize Credentials</span>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setResetStep(1);
                    setReceivedResetCode("");
                  }}
                  className="font-sans text-xs text-gold hover:text-charcoal transition-colors tracking-wide font-medium underline underline-offset-4 cursor-pointer"
                >
                  Return to Workspace Log In
                </button>
              </div>

              <div className="border-t border-[#1C1C1A]/10 pt-6 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#6B6560] block font-light">
                  Property of Studio Kloche & Co.
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md bg-[#F5F0E8] border border-[#1C1C1A]/10 p-10 md:p-12 space-y-8 shadow-xs">
              
              {/* Header Title */}
              <div className="space-y-3 text-center">
                <span className="text-[10px] uppercase tracking-[0.4em] text-kloche-green font-bold block">
                  {isSignUp ? "Account Registration" : "Security Lock"}
                </span>
                <h2 className="text-3xl font-serif tracking-tight text-[#1C1C1A]">
                  Studio <span className="italic font-light">{isSignUp ? "Sign Up" : "Workspace"}</span>
                </h2>
                
                {!hasAdmins && isSignUp && (
                  <div className="bg-kloche-green/5 border border-kloche-green/20 p-3.5 text-left text-xs text-kloche-green leading-relaxed mb-4">
                    <p className="font-bold uppercase tracking-wider text-[9px] mb-1">Initialization Mode</p>
                    No administrators detected in database schema. Please register the first master administrator account below.
                  </div>
                )}

                <p className="text-xs text-[#6B6560] font-light max-w-xs mx-auto leading-relaxed">
                  {isSignUp 
                    ? "Create your secure administrator login to gain full operational control over spatial enquiries, client CRM folders and appointment calendar."
                    : "Enter your back-office credentials to manage project walkthrough details, client relationship CRM portfolios & scheduling slots."
                  }
                </p>
              </div>

              {/* Entry Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {isSignUp ? (
                  <>
                    {/* Signup Username */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                        Username
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. nairobi_designer"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A]"
                      />
                    </div>

                    {/* Signup Email */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="designer@kloche.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A]"
                      />
                    </div>
                  </>
                ) : (
                  /* Signin Account details */
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                      Username or Email
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter email or username"
                      value={login}
                      onChange={(e) => setLogin(e.target.value)}
                      className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A]"
                      autoFocus
                    />
                  </div>
                )}

                {/* Password field - Shared across flows */}
                <div className="space-y-1.5 text-left text-[#1C1C1A]">
                  <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#E2DDD5] px-4 py-2.5 text-sm focus:outline-none focus:border-kloche-green transition-colors text-[#1C1C1A]"
                  />
                </div>

                {/* Remember Me and Forgot Password Action Bar */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 text-[#6B6560] cursor-pointer selection:bg-transparent">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded-none border-[#E2DDD5] text-gold focus:ring-0 focus:ring-offset-0 focus:outline-none accent-gold h-4 w-4 bg-white"
                    />
                    <span className="font-light">Remember Me</span>
                  </label>
                  
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(true);
                        setForgotEmail("");
                      }}
                      className="text-gold hover:text-charcoal transition-colors underline underline-offset-4 font-normal"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>

                {/* Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1C1C1A] hover:bg-black text-[#FAF8F4] py-3 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer mt-6"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-kloche-gold" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isSignUp ? "Register Admin Account" : "Access Studio Workspace"}</span>
                  )}
                </button>
              </form>

              {/* Alternating Signin/Signup Toggle option */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    // Clear error state and raw inputs for neat switching
                    setUsername("");
                    setEmail("");
                    setPassword("");
                    setLogin("");
                  }}
                  className="font-sans text-xs text-gold hover:text-charcoal transition-colors tracking-wide font-medium underline underline-offset-4 cursor-pointer"
                >
                  {isSignUp 
                    ? "Already have an admin account? Sign In" 
                    : "New administrator in the studio? Sign Up"
                  }
                </button>
              </div>

              <div className="border-t border-[#1C1C1A]/10 pt-6 text-center">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#6B6560] block font-light">
                  Property of Studio Kloche & Co.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Area */}
        <div className="w-full px-12 py-8 flex flex-col md:flex-row justify-between items-center bg-[#1C1C1A] text-white/50 text-[9px] uppercase tracking-[0.3em] gap-4">
          <div>
            Nairobi Studio Back Office
          </div>
          <div className="text-right">
            Karuna Rd, Nairobi, Kenya
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


// MAIN ENTRY WRAPPER
export default function App() {
  return (
    <Router>
      <CustomCursor />
      <Toaster position="bottom-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        
        {/* Admin CRM routes (Guarded) */}
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/clients" element={<AdminGuard><AdminClients /></AdminGuard>} />
        <Route path="/admin/clients/:id" element={<AdminGuard><AdminClientDetail /></AdminGuard>} />
        <Route path="/admin/appointments" element={<AdminGuard><AdminAppointments /></AdminGuard>} />
        <Route path="/admin/enquiries" element={<AdminGuard><AdminEnquiries /></AdminGuard>} />
      </Routes>
    </Router>
  );
}
