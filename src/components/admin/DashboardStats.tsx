import { Users, MessageSquare, Calendar, Briefcase, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface StatsProps {
  totalClients: number;
  newEnquiries: number;
  appointments: number;
  activeProjects: number;
}

export default function DashboardStats({
  totalClients,
  newEnquiries,
  appointments,
  activeProjects,
}: StatsProps) {
  const statCards = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: Users,
      desc: "All lifetime CRM client files",
      color: "border-l-4 border-gold",
    },
    {
      title: "New Enquiries",
      value: newEnquiries,
      icon: MessageSquare,
      desc: "Weekly unread project briefs",
      color: "border-l-4 border-kloche-gold",
    },
    {
      title: "Appointments Scheduled",
      value: appointments,
      icon: Calendar,
      desc: "This month's booked scopes",
      color: "border-l-4 border-kloche-green",
    },
    {
      title: "Active Renovations",
      value: activeProjects,
      icon: Briefcase,
      desc: "Ongoing structural design tasks",
      color: "border-l-4 border-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
      {statCards.map((card) => {
        const IconComponent = card.icon;
        
        return (
          <motion.div
            key={card.title}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 12px 24px -10px rgba(15, 96, 81, 0.15), 0 4px 12px -5px rgba(15, 96, 81, 0.15)",
              borderColor: "#0F6051"
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`bg-[#FAF8F4] border border-[#E2DDD5] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between cursor-pointer ${card.color}`}
          >
            {/* Top Row: Label & Icon */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-1.5">{card.title}</p>
                <h3 className="font-serif text-3xl font-light text-charcoal tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className="p-3 bg-cream/30 text-gold flex items-center justify-center">
                <IconComponent className="w-5 h-5 stroke-[1.5]" />
              </div>
            </div>

            {/* Bottom Row Indicator info */}
            <div className="pt-4 mt-4 border-t border-[#E2DDD5]/40 flex items-center justify-between text-xs text-muted/80">
              <span className="font-light">{card.desc}</span>
              <span className="flex items-center text-[10px] uppercase font-semibold text-gold tracking-wider">
                <TrendingUp className="w-3 h-3 mr-1" /> Live
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

