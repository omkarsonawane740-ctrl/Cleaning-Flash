import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { HelpCircle, ChevronDown, Search, Sparkles } from 'lucide-react';

interface FAQSectionProps {
  onOpenBookingModal: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenBookingModal }) => {
  const { faqs } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Got Questions? We have Answers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Everything you need to know about our chemicals, safety guidelines, crew verification, rescheduling, and guarantee.
          </p>

          {/* Search Box */}
          <div className="max-w-md mx-auto pt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-7" />
            <input
              type="text"
              placeholder="Search questions (e.g. chemicals, cancellation, pets)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Questions
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 divide-y divide-slate-100">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-start justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-lg bg-slate-50 text-slate-400 group-hover:text-blue-600 transition shrink-0 mt-0.5">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 text-xs text-slate-600 leading-relaxed pl-3 border-l-2 border-blue-600 animate-in fade-in duration-150">
                      <p>{faq.answer}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500 font-semibold">
                        Category: {faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No questions found matching "{searchQuery}". Please check your search term or contact us directly.
            </div>
          )}
        </div>

        {/* Bottom Help CTA */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-bold text-sm text-slate-900">Still have questions?</h4>
            <p className="text-xs text-slate-600 mt-0.5">Our customer care desk is active 7 days a week.</p>
          </div>
          <button
            onClick={() => onOpenBookingModal()}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:bg-blue-700 transition cursor-pointer"
          >
            Book a Service Now
          </button>
        </div>
      </div>
    </div>
  );
};
