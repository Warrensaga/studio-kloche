import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, Check, Trash2, Plus, Bookmark, ListTodo, AlertCircle, Loader } from "lucide-react";
import { toast } from "react-hot-toast";

interface Todo {
  id: string;
  content: string;
  completed: boolean;
  clientId: string | null;
  client: { id: string; name: string } | null;
  createdAt: string;
}

interface ClientRecord {
  id: string;
  name: string;
}

interface TodoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TodoSidebar({ isOpen, onClose }: TodoSidebarProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form input fields
  const [newContent, setNewContent] = useState("");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Filtering
  const [viewFilter, setViewFilter] = useState<"all" | "active" | "completed">("active");

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      }
    } catch (err) {
      console.error("Todo fetch failure:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.filter((c: any) => c.name));
      }
    } catch (err) {
      console.error("Clients lookup error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.all([fetchTodos(), fetchClients()]);
    }
  }, [isOpen]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newContent,
          clientId: selectedClientId || null,
        }),
      });

      if (res.ok) {
        toast.success("Internal note pinned successfully", {
          icon: "📌",
          style: { background: "#1C1C1A", color: "#FAF8F4", border: "1px solid #B8965A" }
        });
        setNewContent("");
        setSelectedClientId("");
        fetchTodos();
      } else {
        toast.error("Failed to pin internal reminder");
      }
    } catch (err) {
      console.error(err);
      toast.error("Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleTodo = async (id: string, currentlyCompleted: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !currentlyCompleted }),
      });

      if (res.ok) {
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Reminder cleared");
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter logic
  const filteredTodos = todos.filter((todo) => {
    if (viewFilter === "active") return !todo.completed;
    if (viewFilter === "completed") return todo.completed;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Shadow overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ translateX: "100%" }}
            animate={{ translateX: 0 }}
            exit={{ translateX: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-[#FAF8F4] border-l border-[#E2DDD5] shadow-2xl z-50 flex flex-col font-sans text-charcoal"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#E2DDD5] bg-white flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <ListTodo className="w-5 h-5 text-gold" />
                <div>
                  <h2 className="font-serif text-lg font-semibold text-charcoal">Internal Reminders</h2>
                  <p className="text-[10px] text-muted font-light">Pin internal-only design notes linked to CRM clients</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-zinc-100/50 rounded-full transition-colors text-muted hover:text-charcoal cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Quick entry form */}
            <div className="p-6 border-b border-[#E2DDD5] bg-white/50">
              <form onSubmit={handleAddTodo} className="space-y-3.5 text-left">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-charcoal">New Reminder Note</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule KARA blueprint check..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-white border border-[#E2DDD5] px-3.5 py-2 text-xs focus:ring-0 focus:outline-none focus:border-gold text-[#1C1C1A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-8 space-y-1">
                    <label className="text-[9px] uppercase tracking-widest font-bold text-charcoal">Link Specific Client</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-white border border-[#E2DDD5] px-3 py-2 text-xs focus:ring-0 focus:outline-none focus:border-gold text-[#1C1C1A]"
                    >
                      <option value="">-- General Studio Note --</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#1C1C1A] hover:bg-black text-[#FAF8F4] py-2 text-xs uppercase tracking-wider font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>PIN NOTE</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Filters Navigation */}
            <div className="px-6 py-3 border-b border-[#E2DDD5] flex justify-between items-center bg-white text-xs">
              <div className="flex space-x-2.5">
                {(["active", "completed", "all"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setViewFilter(filter)}
                    className={`pb-1 uppercase tracking-wider text-[9px] font-bold border-b-2 transition-all cursor-pointer ${
                      viewFilter === filter
                        ? "border-gold text-gold"
                        : "border-transparent text-muted hover:text-charcoal"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <span className="text-[9px] opacity-65 font-mono">{filteredTodos.length} entries</span>
            </div>

            {/* Scrollable list of pinned notes */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="h-44 flex justify-center items-center">
                  <Loader className="w-5 h-5 animate-spin text-gold" />
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="py-12 text-center text-muted font-light space-y-2 border border-dashed border-[#E2DDD5] p-6 bg-white">
                  <AlertCircle className="w-6 h-6 text-gold/60 mx-auto" />
                  <p className="text-xs">No administrative reminders in this queue.</p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`p-4 bg-white border border-[#E2DDD5] shadow-xs flex items-start justify-between space-x-3 transition-opacity duration-300 ${
                      todo.completed ? "opacity-60" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3 text-left">
                      {/* Custom Checkbox button */}
                      <button
                        onClick={() => handleToggleTodo(todo.id, todo.completed)}
                        className={`mt-0.5 border h-4.5 w-4.5 flex items-center justify-center transition-colors cursor-pointer ${
                          todo.completed
                            ? "bg-gold border-gold text-white"
                            : "bg-white border-[#E2DDD5] hover:border-gold"
                        }`}
                      >
                        {todo.completed && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <div className="space-y-1">
                        <p className={`text-xs text-charcoal leading-relaxed ${todo.completed ? "line-through text-muted" : "font-medium"}`}>
                          {todo.content}
                        </p>
                        
                        {/* Linked Client badge indicator */}
                        {todo.client ? (
                          <div className="flex items-center space-x-1 text-[9px] text-[#B8965A] font-semibold tracking-wide uppercase">
                            <Bookmark className="w-3 h-3" />
                            <span>Linked client: {todo.client.name}</span>
                          </div>
                        ) : (
                          <div className="text-[9px] text-muted font-mono">General Back Office Note</div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-1 hover:bg-red-50 text-muted hover:text-red-600 transition-all cursor-pointer rounded"
                      title="Delete Pin"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
export default TodoSidebar;
