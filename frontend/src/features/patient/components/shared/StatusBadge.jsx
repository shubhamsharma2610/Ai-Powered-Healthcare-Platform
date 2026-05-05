const statusConfig = {
  upcoming:  { bg: "hsl(182,100%,92%)", color: "hsl(182,100%,25%)", label: "Upcoming" },
  completed: { bg: "#dcfce7",           color: "#166534",            label: "Completed" },
  cancelled: { bg: "#fee2e2",           color: "#991b1b",            label: "Cancelled" },
  paid:      { bg: "#dcfce7",           color: "#166534",            label: "Paid" },
  pending:   { bg: "#fef9c3",           color: "#854d0e",            label: "Pending" },
  refunded:  { bg: "#ede9fe",           color: "#5b21b6",            label: "Refunded" },
};

export default function StatusBadge({ status }) {
  const s = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}