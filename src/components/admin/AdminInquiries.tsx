import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Mail, Phone, Clock, CheckCircle2, MessageSquare, Trash2, ArrowRight } from 'lucide-react';

export const AdminInquiries: React.FC = () => {
  const { contactMessages, updateContactMessageStatus } = useData();
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');

  const filtered = contactMessages.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Customer Inquiries & Callbacks</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inquiries, custom commercial cleaning requests, and callback messages submitted via the Contact page.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        {(['all', 'new', 'contacted', 'resolved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-4 text-xs font-bold border-b-2 capitalize transition cursor-pointer ${
              filter === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab} ({contactMessages.filter((m) => tab === 'all' || m.status === tab).length})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((msg) => (
            <div
              key={msg.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    msg.status === 'new' ? 'bg-amber-100 text-amber-800 animate-pulse' : msg.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {msg.status}
                  </span>
                  <span className="text-xs font-semibold text-blue-600">Interested in: {msg.serviceInterested || 'General Service'}</span>
                  <span className="text-[11px] text-slate-400">• {new Date(msg.createdAt).toLocaleString()}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{msg.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-1">
                    <a href={`tel:${msg.phone}`} className="flex items-center space-x-1 text-blue-600 font-semibold hover:underline">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{msg.phone}</span>
                    </a>
                    {msg.email && (
                      <a href={`mailto:${msg.email}`} className="flex items-center space-x-1 text-slate-600 hover:text-blue-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{msg.email}</span>
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed">
                  "{msg.message}"
                </p>
              </div>

              {/* Status updater buttons */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                <div className="text-xs text-slate-500 font-semibold mb-1">Set Status:</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateContactMessageStatus(msg.id, 'contacted')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      msg.status === 'contacted' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => updateContactMessageStatus(msg.id, 'resolved')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      msg.status === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-3xl border border-slate-200">
            No inquiry messages found under this filter.
          </div>
        )}
      </div>
    </div>
  );
};
