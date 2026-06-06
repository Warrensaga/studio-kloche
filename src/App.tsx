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
    <div id="public-main-root" className="bg-[#FAF8F4] overflow-x-hidden">
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
          <button
            onClick={fetchDashboardData}
            className="p-2 border border-[#E2DDD5] hover:border-gold-light hover:text-gold text-charcoal bg-[#FAF8F4] transition-colors"
            title="Refresh Core Data"
          >
            <RefreshCw className="w-4.5 h-4.5 text-[#6B6560]" />
          </button>
        </div>

        {/* Dynamic metrics widgets */}
        <DashboardStats
          totalClients={stats.clients}
          newEnquiries={stats.enquiries}
          appointments={stats.appointments}
          activeProjects={stats.activeProject}
        />

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
              <div className="text-[9px] text-[#6B6560] text-center italic mt-1 pb-2">✏️ Click outside of notes boxes to record input.</div>
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


// 3. ADMIN ACCESS CONTROL (PASSPHRASE/PIN GATE)
function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = sessionStorage.getItem("kloche_admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const cleanInput = passcode.trim();
      // Allow two memorized secure passcodes
      if (cleanInput === "kloche-admin" || cleanInput === "nairobi2026") {
        sessionStorage.setItem("kloche_admin_authenticated", "true");
        setIsAuthenticated(true);
        toast.success("Welcome, Studio Administrator", {
          icon: "🗝️",
          style: {
            background: "#1C1C1A",
            color: "#FAF8F4",
            border: "1px solid #B8965A"
          }
        });
      } else {
        setAttempts(prev => prev + 1);
        toast.error(attempts >= 2 ? "Access Denied. Passcode is incorrect." : "Invalid back-office passcode. Re-try.", {
          style: {
            background: "#4A0E17",
            color: "#FAF8F4"
          }
        });
      }
      setLoading(false);
    }, 600);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#B8965A]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-between font-sans text-[#1C1C1A] selection:bg-[#B8965A]/25 relative overflow-hidden">
        {/* Editorial Ornamental lines */}
        <div className="absolute top-1/2 left-0 w-8 h-[1px] bg-[#B8965A]/40"></div>
        <div className="absolute top-1/4 right-0 w-8 h-[1px] bg-[#B8965A]/40"></div>
        <div className="absolute top-16 left-12 text-[10px] uppercase tracking-[0.4em] text-[#B8965A] font-semibold hidden md:block">
          Est. 2021
        </div>

        {/* Minimalist Top Bar */}
        <div className="w-full px-12 py-10 flex justify-between items-center z-20">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group text-xs uppercase tracking-widest text-[#1C1C1A] hover:text-[#B8965A] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Site</span>
          </button>
          
          <div className="text-xl font-serif tracking-tight font-bold">
            KLOCHE <span className="text-[#B8965A] italic">Interiors</span>
          </div>
        </div>

        {/* Auth Box Center */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 z-10">
          <div className="w-full max-w-md bg-[#F5F0E8] border border-[#1C1C1A]/10 p-10 md:p-12 space-y-8 shadow-xs">
            {/* Header Title */}
            <div className="space-y-3 text-center">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#B8965A] font-medium block">
                Security Lock
              </span>
              <h2 className="text-3xl font-serif tracking-tight text-[#1C1C1A]">
                Studio <span className="italic font-light">Workspace</span>
              </h2>
              <p className="text-xs text-[#6B6560] font-light max-w-xs mx-auto leading-relaxed">
                Enter your authorized studio passcode to grant operational credentials for client records, enquiries and calendar.
              </p>
            </div>

            {/* Entry Form */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-[#1C1C1A] font-bold block">
                  Passcode
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white border border-[#E2DDD5] px-4 py-3 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-[#B8965A] transition-colors text-[#1C1C1A] placeholder:text-gray-300"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1C1C1A] hover:bg-black text-[#FAF8F4] py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin text-[#B8965A]" />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <span>Verify Credentials</span>
                )}
              </button>
            </form>

            <div className="border-t border-[#1C1C1A]/10 pt-6 text-center">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#6B6560] block font-light">
                Property of Studio Kloche & Co.
              </span>
            </div>
          </div>
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
