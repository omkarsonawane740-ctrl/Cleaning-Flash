import React from 'react';
import { useData } from '../../context/DataContext';
import { TrendingUp, DollarSign, Download, Calendar, PieChart, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { bookings, services } = useData();

  // Financial Stats
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'completed');
  const paidBookings = bookings.filter((b) => b.paymentStatus === 'paid');

  const totalGrossRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.bookingStatus === 'completed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const onlinePaymentsRevenue = bookings
    .filter((b) => (b.paymentStatus === 'paid' || b.bookingStatus === 'completed') && (b.paymentMethod === 'online' || b.paymentMethod === 'upi'))
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const cashPaymentsRevenue = bookings
    .filter((b) => (b.paymentStatus === 'paid' || b.bookingStatus === 'completed') && b.paymentMethod === 'cash')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalTaxCollected = bookings
    .filter((b) => b.paymentStatus === 'paid' || b.bookingStatus === 'completed')
    .reduce((sum, b) => sum + b.taxAmount, 0);

  const totalDiscountsGiven = bookings
    .reduce((sum, b) => sum + (b.discountAmount || 0), 0);

  // Service Breakdown
  const serviceWise = services.map((s) => {
    const matched = bookings.filter((b) => b.serviceId === s.id || b.serviceName === s.name);
    const rev = matched
      .filter((b) => b.paymentStatus === 'paid' || b.bookingStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    return {
      name: s.name,
      bookingsCount: matched.length,
      revenue: rev
    };
  }).sort((a, b) => b.revenue - a.revenue);

  const exportFinancialsCSV = () => {
    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Gross Revenue', `INR ${totalGrossRevenue}`],
      ['Online / UPI Collections', `INR ${onlinePaymentsRevenue}`],
      ['Cash on Service Collections', `INR ${cashPaymentsRevenue}`],
      ['GST Tax Collected', `INR ${totalTaxCollected}`],
      ['Promotional Discounts Subsidized', `INR ${totalDiscountsGiven}`],
      ['Total Bookings Count', totalBookings],
      ['Completed Cleanings', completedBookings.length],
      ['Paid Orders', paidBookings.length]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CleaningFlash_Financial_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Financial Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time revenue metrics, payment channel distribution, service demand breakdown, and GST tax ledger.
          </p>
        </div>

        <button
          onClick={exportFinancialsCSV}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Financial CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Gross Invoiced</span>
          <p className="text-3xl font-black text-slate-900">₹{totalGrossRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-emerald-600 font-semibold">{completedBookings.length} completed cleanings</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Online & UPI Gateway</span>
          <p className="text-3xl font-black text-blue-600">₹{onlinePaymentsRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">
            {totalGrossRevenue > 0 ? `${Math.round((onlinePaymentsRevenue / totalGrossRevenue) * 100)}% of total revenue` : '0%'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">Cash on Delivery</span>
          <p className="text-3xl font-black text-indigo-600">₹{cashPaymentsRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">
            {totalGrossRevenue > 0 ? `${Math.round((cashPaymentsRevenue / totalGrossRevenue) * 100)}% of total revenue` : '0%'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400">GST (18%) Collected</span>
          <p className="text-3xl font-black text-slate-700">₹{Math.round(totalTaxCollected).toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Tax compliance ledger</p>
        </div>
      </div>

      {/* Service Popularity Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">Service Performance & Revenue Contribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ranked by total booked sales revenue</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">Service Category & Title</th>
                <th className="py-3.5 px-6 text-center">Orders Count</th>
                <th className="py-3.5 px-6 text-right">Revenue Generated</th>
                <th className="py-3.5 px-6 text-right">Revenue Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {serviceWise.map((item, idx) => {
                const share = totalGrossRevenue > 0 ? Math.round((item.revenue / totalGrossRevenue) * 100) : 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center font-semibold text-slate-700">
                      {item.bookingsCount} bookings
                    </td>
                    <td className="py-4 px-6 text-right font-black text-slate-900 text-sm">
                      ₹{item.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div className="bg-blue-600 h-full rounded-full" style={{ width: `${share}%` }} />
                        </div>
                        <span className="font-bold text-xs text-slate-700">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
