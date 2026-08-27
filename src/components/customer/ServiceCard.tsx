import React from 'react';
import { Service } from '../../types';
import { Star, Clock, Check, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onOpenBookingModal?: (serviceId?: string) => void;
  onViewDetails?: (slugOrId: string) => void;
  onSelect?: (service: Service) => void;
  onBookNow?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onOpenBookingModal,
  onViewDetails,
  onSelect,
  onBookNow
}) => {
  const handleDetailsClick = () => {
    if (onSelect) {
      onSelect(service);
    } else if (onViewDetails) {
      onViewDetails(service.slug || service.id);
    }
  };

  const handleBookClick = () => {
    if (onBookNow) {
      onBookNow(service);
    } else if (onOpenBookingModal) {
      onOpenBookingModal(service.id);
    }
  };

  return (
    <div
      id={`service-card-${service.id}`}
      className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between"
    >
      {/* Thumbnail & Badges */}
      <div>
        <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />

          {/* Category Chip */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
              {service.categoryName}
            </span>
          </div>

          {/* Rating Pill */}
          <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white backdrop-blur-xs text-[11px] font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{service.rating}</span>
            <span className="text-slate-400 font-normal">({service.totalReviews})</span>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-white text-xs font-medium drop-shadow-sm">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{service.duration}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          <h3
            onClick={handleDetailsClick}
            className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer line-clamp-1"
          >
            {service.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {service.shortDescription}
          </p>

          {/* Feature highlights */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {service.features.slice(0, 2).map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-600">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Actions Footer */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starts At</span>
          <p className="text-lg font-black text-slate-900 leading-tight">
            ₹{service.startingPrice.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleDetailsClick}
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition cursor-pointer"
          >
            Details
          </button>

          <button
            onClick={handleBookClick}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-200 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

