import { BookOpen, Code2, FileText, MousePointer2, PenLine, Presentation, X } from "lucide-react";

const activityOptions = [
  { value: "reading", label: "Reading", icon: BookOpen },
  { value: "coding", label: "Coding", icon: Code2 },
  { value: "writing", label: "Writing", icon: PenLine },
  { value: "designing", label: "Designing", icon: MousePointer2 },
  { value: "lecture", label: "Lecture", icon: Presentation },
  { value: "reporting", label: "Report", icon: FileText },
];

export default function ActivityPrompt({ 
  open, 
  onSelect, 
  onDismiss, 
  onConfirmActive, 
  onConfirmBreak, 
  onTaskChange 
}) {
  if (!open) return null;

  const handleSelect = (selectedTask) => {
    if (typeof onSelect === "function") onSelect(selectedTask);
    if (typeof onTaskChange === "function") onTaskChange(selectedTask);
    if (typeof onConfirmActive === "function") onConfirmActive(selectedTask);
  };

  const handleClose = () => {
    if (typeof onDismiss === "function") onDismiss();
    if (typeof onConfirmBreak === "function") onConfirmBreak();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lg)] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Activity Check</p>
            <h2 className="mt-2 text-2xl font-black text-[var(--foreground)]">
              What are you working on?
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Interaction looks low, so this helps classify reading, lecture, writing,
              design or coding time correctly.
            </p>
          </div>

          <button
            aria-label="Dismiss activity check"
            className="btn-secondary !h-10 !min-h-10 !w-10 !p-0"
            type="button"
            onClick={handleClose}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {activityOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              className="activity-option"
              type="button"
              onClick={() => handleSelect(value)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
