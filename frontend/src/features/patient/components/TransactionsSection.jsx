import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../../redux/slices/transactionSlice";

export default function TransactionsSection() {
  const dispatch = useDispatch();
  const { transactions, summary, loading, error } = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch(status) {
      case 'success': return { bg: '#dcfce7', color: '#166534', label: 'Success' };
      case 'refunded': return { bg: '#ede9fe', color: '#5b21b6', label: 'Refunded' };
      case 'created': return { bg: '#fef9c3', color: '#854d0e', label: 'Pending' };
      case 'failed': return { bg: '#fee2e2', color: '#dc2626', label: 'Failed' };
      default: return { bg: '#f1f5f9', color: '#64748b', label: status };
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary"></div>
      </div>
    );
  }

  const summaryCards = [
    { label: "Total Paid", value: `₹${summary.totalPaid}`, bg: "#dcfce7", color: "#166534" },
    { label: "Pending", value: `₹${summary.pending}`, bg: "#fef9c3", color: "#854d0e" },
    { label: "Refunded", value: `₹${summary.refunded}`, bg: "#ede9fe", color: "#5b21b6" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Transactions</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {summaryCards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border p-4 text-center shadow-sm">
            <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="bg-red-50 rounded-2xl p-8 text-center">
          <p className="text-red-600 text-sm">{error}</p>
          <button onClick={() => dispatch(fetchTransactions())} className="mt-3 text-primary text-sm">Try Again</button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-2xl border p-8 text-center">
          <p className="text-gray-500">No transactions found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase px-5 py-3 border-b bg-gray-50">
            <span>Doctor</span><span>Date</span><span>Amount</span><span>Status</span>
          </div>
          {transactions.map((tx, i) => {
            const style = getStatusStyle(tx.status);
            const doctorName = tx.doctor === 'Doctor' ? 'Dr. N/A' : `${tx.doctor}`;
            return (
              <div key={tx.id} className={`grid grid-cols-4 items-center px-5 py-4 text-sm hover:bg-gray-50 ${i !== transactions.length - 1 ? "border-b" : ""}`}>
                <div><div className="font-medium text-gray-800">{doctorName}</div><div className="text-xs text-gray-400">{tx.specialty}</div></div>
                <div className="text-gray-500 text-xs">{tx.date}</div>
                <div className="font-semibold text-gray-800">₹{tx.amount}</div>
                <div><span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: style.bg, color: style.color }}>{style.label}</span></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}