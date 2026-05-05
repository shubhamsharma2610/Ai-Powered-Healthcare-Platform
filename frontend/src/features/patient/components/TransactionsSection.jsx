import StatusBadge from "./shared/StatusBadge";
import { transactions } from "./shared/data";

const summary = [
  { label: "Total Paid", value: "₹1,550", color: "#166534", bg: "#dcfce7" },
  { label: "Pending",    value: "₹2,000", color: "#854d0e", bg: "#fef9c3" },
  { label: "Refunded",   value: "₹950",   color: "#5b21b6", bg: "#ede9fe" },
];

export default function TransactionsSection() {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Outfit',sans-serif" }}>
        Transactions
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {summary.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
            <div
              className="text-lg font-bold"
              style={{ color: s.color, fontFamily: "'Outfit',sans-serif" }}
            >
              {s.value}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3 border-b border-gray-50 bg-[#f8fafc]">
          <span>Doctor</span>
          <span>Date</span>
          <span>Amount</span>
          <span>Status</span>
        </div>

        {/* Table Rows */}
        {transactions.map((t, i) => (
          <div
            key={t.id}
            className={`grid grid-cols-4 items-center px-5 py-4 text-sm transition-colors duration-150 hover:bg-[#f8fafc] ${
              i !== transactions.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <div>
              <div className="font-medium text-gray-800">{t.doctor}</div>
              <div className="text-xs text-gray-400">{t.specialty}</div>
            </div>
            <div className="text-gray-500 text-xs">{t.date}</div>
            <div className="font-semibold text-gray-800">₹{t.amount}</div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
