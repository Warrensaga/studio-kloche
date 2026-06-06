import { useState } from "react";
import { format } from "date-fns";
import { Phone, Mail, CheckCircle2, ChevronDown, ChevronUp, UserPlus, Send, RefreshCw, Star, Download } from "lucide-react";

interface EnquiriesTableProps {
  enquiries: any[];
  onStatusChange: (id: string, status: string) => Promise<void>;
  onConvertToClient: (enquiry: any) => Promise<void>;
  onRefresh: () => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export default function EnquiriesTable({
  enquiries,
  onStatusChange,
  onConvertToClient,
  onRefresh,
  filterStatus,
  setFilterStatus,
}: EnquiriesTableProps) {
  const [expandedEnquiryId, setExpandedEnquiryId] = useState<string | null>(null);

  const toggleRowExpand = (id: string) => {
    if (expandedEnquiryId === id) {
      setExpandedEnquiryId(null);
    } else {
      setExpandedEnquiryId(id);
    }
  };

  const exportToCSV = () => {
    const headers = ["Lead Name", "Phone", "Email", "Service Requested", "Brief Message", "Status", "Received Date"];
    const rows = enquiries.map(e => [
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email || ''}"`,
      `"${e.service}"`,
      `"${e.message.replace(/"/g, '""')}"`,
      `"${e.status.toUpperCase()}"`,
      `"${format(new Date(e.createdAt), "yyyy-MM-dd HH:mm")}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Kloche_Leads_Enquiries_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied":
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-none bg-emerald-100 text-emerald-800 border border-emerald-200">
            Replied
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-none bg-zinc-100 text-zinc-650 border border-zinc-200">
            Read
          </span>
        );
      case "new":
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider rounded-none bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            New Lead
          </span>
        );
    }
  };

  return (
    <div className="font-sans space-y-6">
      {/* Filtering Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#F5F0E8]/50 p-4 border border-[#E2DDD5]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#6B6560] font-semibold mr-2">Filter By Status:</span>
          {["all", "new", "read", "replied"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all duration-200 rounded-none ${
                filterStatus === st
                  ? "bg-charcoal text-warm-white"
                  : "bg-white border border-[#E2DDD5] text-charcoal hover:bg-cream"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto self-end sm:self-auto justify-end">
          <button
            onClick={exportToCSV}
            disabled={enquiries.length === 0}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-charcoal text-white hover:bg-gold text-xs uppercase tracking-widest font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-white border border-[#E2DDD5] text-xs uppercase tracking-widest text-charcoal font-semibold hover:bg-cream transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold" /> Refresh Leads
          </button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="overflow-x-auto border border-[#E2DDD5] bg-[#FAF8F4] shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F0E8] border-b border-[#E2DDD5] text-xs uppercase tracking-widest text-[#6B6560] font-semibold">
              <th className="py-4.5 px-6 w-1/4">Sender Details</th>
              <th className="py-4.5 px-6">Required Design Service</th>
              <th className="py-4.5 px-6">Message Preview</th>
              <th className="py-4.5 px-6">Created</th>
              <th className="py-4.5 px-6">Status</th>
              <th className="py-4.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DDD5]/65 text-sm">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted font-light">
                  No enquiries recorded matching the selection.
                </td>
              </tr>
            ) : (
              enquiries.map((enq) => {
                const isExpanded = expandedEnquiryId === enq.id;
                const isNew = enq.status === "new";

                return (
                  <tr
                    key={enq.id}
                    className={`transition-colors duration-200 cursor-pointer ${
                      isNew ? "border-l-4 border-gold bg-cream/10" : "border-l-4 border-transparent hover:bg-cream/10"
                    }`}
                    onClick={() => toggleRowExpand(enq.id)}
                  >
                    {/* Name column */}
                    <td className="py-4.5 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2.5">
                        <div className="relative">
                          <div className="w-8.5 h-8.5 bg-cream rounded-none flex items-center justify-center font-serif font-bold text-[#1C1C1A]">
                            {enq.name.charAt(0).toUpperCase()}
                          </div>
                          {isNew && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full border border-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-serif text-base font-semibold text-charcoal">{enq.name}</p>
                          <div className="flex flex-col text-xs text-muted font-light mt-0.5">
                            <span className="flex items-center text-[11px] gap-1"><Phone className="w-3 h-3 text-gold" /> {enq.phone}</span>
                            {enq.email && <span className="flex items-center text-[10px] text-muted/80 gap-1"><Mail className="w-3 h-3" /> {enq.email}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Service requested */}
                    <td className="py-4.5 px-6 font-medium text-gold">
                      {enq.service}
                    </td>

                    {/* Message sample truncation */}
                    <td className="py-4.5 px-6 text-xs text-[#6B6560] max-w-[220px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="truncate block font-light">
                          {enq.message}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                        )}
                      </div>
                      
                      {/* Expanded Block */}
                      {isExpanded && (
                        <div
                          className="mt-3 p-4 bg-zinc-50 border border-gold/10 text-[#1C1C1A] text-sm leading-relaxed rounded-none pointer-events-auto block break-words select-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h5 className="font-serif text-xs uppercase tracking-wider text-gold font-bold mb-1.5">Full Message Brief:</h5>
                          <p className="font-light whitespace-pre-wrap">{enq.message}</p>
                        </div>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="py-4.5 px-6 text-xs text-[#6B6560] font-light">
                      {format(new Date(enq.createdAt), "MMM dd, yyyy HH:mm")}
                    </td>

                    {/* Badge */}
                    <td className="py-4.5 px-6">
                      {getStatusBadge(enq.status)}
                    </td>

                    {/* Action Panel Buttons */}
                    <td className="py-4.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-2">
                        {/* Mark of status */}
                        {enq.status !== "read" && enq.status !== "replied" && (
                          <button
                            title="Mark as Read"
                            onClick={() => onStatusChange(enq.id, "read")}
                            className="bg-white hover:bg-gold hover:text-white border border-[#E2DDD5] text-charcoal py-1.5 px-2.5 text-xs font-semibold uppercase tracking-wider"
                          >
                            Mark Read
                          </button>
                        )}
                        {enq.status !== "replied" && (
                          <button
                            title="Mark as Replied"
                            onClick={() => onStatusChange(enq.id, "replied")}
                            className="bg-white hover:bg-emerald-600 hover:text-white border border-[#E2DDD5] text-charcoal py-1.5 px-2.5 text-xs font-semibold uppercase tracking-wider"
                          >
                            Mark Replied
                          </button>
                        )}

                        {/* CRM Convert Button */}
                        {!enq.clientId && (
                          <button
                            title="Convert to Client Database"
                            onClick={() => onConvertToClient(enq)}
                            className="p-1.5 border border-gold text-gold hover:bg-gold hover:text-white transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}

                        {/* WhatsApp Direct */}
                        <a
                          title="Reply on WhatsApp"
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                            enq.name
                          )}%2C%20thank%20you%20for%20contacting%20Kloche%20Interiors%20regarding%20${encodeURIComponent(
                            enq.service
                          )}.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 border border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </a>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
