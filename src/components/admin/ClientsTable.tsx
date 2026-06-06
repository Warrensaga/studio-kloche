import { useState } from "react";
import { User, Phone, Mail, Edit, Trash2, ArrowUpRight, FolderOpen, CalendarClock } from "lucide-react";
import { format } from "date-fns";

interface ClientsTableProps {
  clients: any[];
  onEdit: (client: any) => void;
  onDelete: (id: string) => Promise<void>;
  onViewProfile: (id: string) => void;
}

export default function ClientsTable({
  clients,
  onEdit,
  onDelete,
  onViewProfile,
}: ClientsTableProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-none bg-blue-100 text-blue-800 border border-blue-200/50">
            Active Project
          </span>
        );
      case "completed":
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-none bg-emerald-100 text-emerald-800 border border-emerald-200/50">
            Completed
          </span>
        );
      case "lead":
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-none bg-amber-100 text-amber-800 border border-amber-200/50">
            Lead File
          </span>
        );
    }
  };

  return (
    <div className="font-sans relative">
      {/* Table grid */}
      <div className="overflow-x-auto border border-[#E2DDD5] bg-[#FAF8F4] shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F0E8] border-b border-[#E2DDD5] text-xs uppercase tracking-widest text-[#6B6560] font-semibold">
              <th className="py-4.5 px-6">Client Profile</th>
              <th className="py-4.5 px-6">Contact Channels</th>
              <th className="py-4.5 px-6">Project Status</th>
              <th className="py-4.5 px-6">Milestones</th>
              <th className="py-4.5 px-6">Registered</th>
              <th className="py-4.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2DDD5]/65 text-sm">
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted font-light">
                  No registered clients found in the CRM repository. Use "Add New Client" to seed.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-cream/15 transition-colors duration-250 group"
                >
                  {/* Name column */}
                  <td className="py-4.5 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 bg-cream rounded-none flex items-center justify-center text-gold font-serif font-bold text-sm border border-gold/15">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <button
                          onClick={() => onViewProfile(client.id)}
                          className="font-serif text-base font-medium text-charcoal hover:text-gold text-left flex items-center gap-1 group/btn"
                        >
                          {client.name}
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                        <p className="text-[10px] text-muted tracking-wider uppercase font-light">
                          REF: #{client.id.substring(client.id.length - 6).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact channels */}
                  <td className="py-4.5 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-charcoal font-light">
                        <Phone className="w-3.5 h-3.5 text-gold mr-1.5 flex-shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                      {client.email && (
                        <div className="flex items-center text-xs text-muted font-light">
                          <Mail className="w-3.5 h-3.5 text-muted mr-1.5 flex-shrink-0" />
                          <span className="truncate max-w-[170px]">{client.email}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Badging */}
                  <td className="py-4.5 px-6">
                    {getStatusBadge(client.status)}
                  </td>

                  {/* Activity and brief history counts */}
                  <td className="py-4.5 px-6 text-xs text-[#6B6560]">
                    <div className="flex flex-col space-y-1">
                      <span className="flex items-center gap-1 font-light">
                        <FolderOpen className="w-3.5 h-3.5 text-[#B8965A]/80" />
                        Enquiries: <strong className="text-charcoal font-medium">{client._count?.enquiries ?? 0}</strong>
                      </span>
                      <span className="flex items-center gap-1 font-light">
                        <CalendarClock className="w-3.5 h-3.5 text-[#B8965A]/80" />
                        Appts: <strong className="text-charcoal font-medium">{client._count?.appointments ?? 0}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Registered date */}
                  <td className="py-4.5 px-6 text-xs text-[#6B6560] font-light">
                    {format(new Date(client.createdAt), "MMMM dd, yyyy")}
                  </td>

                  {/* Interaction buttons */}
                  <td className="py-4.5 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2.5">
                      <button
                        title="View Profile Details"
                        onClick={() => onViewProfile(client.id)}
                        className="p-1.5 border border-[#E2DDD5] text-[#1C1C1A] hover:bg-charcoal hover:text-white transition-colors"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Client Attributes"
                        onClick={() => onEdit(client)}
                        className="p-1.5 border border-[#E2DDD5] text-[#1C1C1A] hover:bg-charcoal hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        title="Delete Client File"
                        onClick={() => setDeleteTargetId(client.id)}
                        className="p-1.5 border border-[#E2DDD5] text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Custom Confirmation Alert Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-sans">
          <div
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-xs"
            onClick={() => setDeleteTargetId(null)}
          />
          <div className="relative bg-[#FAF8F4] border border-gold/15 max-w-sm w-full mx-6 p-6 shadow-2xl z-10 text-left">
            <h4 className="font-serif text-lg font-medium text-charcoal mb-2">Delete Client Record?</h4>
            <p className="text-xs text-muted leading-relaxed font-light mb-6">
              WARNING: This operation is irreversible. Deleting this client will sever their associated database linkages across any historical enquiries and schedules.
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="py-2 px-4 border border-[#E2DDD5] hover:bg-zinc-100 text-xs font-semibold text-muted uppercase tracking-widest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="py-2 px-4 bg-red-600 text-white hover:bg-red-700 text-xs font-semibold uppercase tracking-widest transition-colors"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
