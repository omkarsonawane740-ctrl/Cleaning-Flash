import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Star, CheckCircle2, XCircle, Trash2, MessageSquare } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, deleteReview } = useData();
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'approved') return r.isApproved;
    if (filter === 'pending') return !r.isApproved;
    return true;
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customer Ratings & Reviews</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate, approve, or remove customer feedback submitted on services.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-1 text-amber-400">
            <Star className="w-5 h-5 fill-amber-400" />
            <span className="font-black text-slate-900 text-lg">{avgRating}</span>
          </div>
          <span className="text-xs text-slate-400">({reviews.length} total reviews)</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            filter === 'all'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            filter === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pending Approval ({reviews.filter((r) => !r.isApproved).length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            filter === 'approved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Approved & Published ({reviews.filter((r) => r.isApproved).length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rev.customerName}</h4>
                  <p className="text-[11px] text-blue-600 font-semibold">{rev.serviceName}</p>
                </div>
                <div className="flex items-center space-x-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-xs text-slate-900">{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 italic leading-relaxed">
                "{rev.comment}"
              </p>

              <p className="text-[10px] text-slate-400 mt-2">Submitted on {rev.date}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${rev.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {rev.isApproved ? 'Approved & Visible' : 'Pending Approval'}
              </span>

              <div className="flex items-center space-x-2">
                {!rev.isApproved && (
                  <button
                    onClick={() => approveReview(rev.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Delete review from "${rev.customerName}"?`)) deleteReview(rev.id);
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
