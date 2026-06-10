import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader, BarChart3, Clock, TrendingUp } from "lucide-react";

interface ClientData {
  id: string;
  name: string;
  consultancyHours: number;
  completionRate: number;
  status: string;
}

export function DashboardWidget() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        if (res.ok) {
          const data = await res.json();
          setClients(data);
        }
      } catch (err) {
        console.error("DashboardWidget fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-[#E2DDD5] p-20 flex justify-center items-center">
        <Loader className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  // Filter out any trailing empty test clients
  const activeClients = clients.filter(c => c.name).slice(0, 10);

  // Compute stats
  const totalHours = activeClients.reduce((sum, c) => sum + (c.consultancyHours || 0), 0);
  const averageCompletion = activeClients.length 
    ? Math.round(activeClients.reduce((sum, c) => sum + (c.completionRate || 0), 0) / activeClients.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Consultancy Hours Committed Area Chart */}
        <div className="bg-white border border-[#E2DDD5] shadow-xs p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4.5 h-4.5 text-gold" />
                <h3 className="font-serif text-lg font-medium text-charcoal">Consultancy Hours Tracker</h3>
              </div>
              <p className="text-[10px] text-muted font-light mt-0.5">Aggregated back-office hours logged for spatial design, blueprints and design consultations.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">Total Hours</span>
              <span className="text-xl font-bold text-charcoal">{totalHours} hrs</span>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            {activeClients.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted font-light italic">No clients registered inside CRM framework.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeClients}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F6051" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#0F6051" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDD5" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B6560" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9 }}
                  />
                  <YAxis 
                    stroke="#6B6560" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1C1C1A", color: "#FAF8F4", border: "none" }}
                    labelStyle={{ fontWeight: "bold", color: "#0F6051" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="consultancyHours" 
                    name="Consultancy Hours"
                    stroke="#0F6051" 
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Project Completion Rates bar chart */}
        <div className="bg-white border border-[#E2DDD5] shadow-xs p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4.5 h-4.5 text-gold" />
                <h3 className="font-serif text-lg font-medium text-charcoal">Project Completion Progress</h3>
              </div>
              <p className="text-[10px] text-muted font-light mt-0.5">Completion percentage status across active, lead and completed spatial ventures.</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-muted font-medium block">Avg Progress</span>
              <span className="text-xl font-bold text-gold">{averageCompletion}%</span>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            {activeClients.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted font-light italic">No clients registered inside CRM framework.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeClients}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2DDD5" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6B6560" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9 }}
                  />
                  <YAxis 
                    stroke="#6B6560" 
                    domain={[0, 100]} 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 9 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1C1C1A", color: "#FAF8F4", border: "none" }}
                    labelStyle={{ fontWeight: "bold", color: "#0F6051" }}
                  />
                  <Bar 
                    dataKey="completionRate" 
                    name="Completion Rate (%)"
                    fill="#1C1C1A" 
                    radius={[2, 2, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
export default DashboardWidget;
