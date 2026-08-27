import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Service, ServiceCategory, ServicePackage, ServiceAddon } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  DollarSign,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

export const AdminServices: React.FC = () => {
  const {
    services,
    categories,
    addons,
    addService,
    updateService,
    deleteService,
    toggleServiceStatus,
    addPackageToService,
    updateServicePackage,
    deleteServicePackage,
    addAddon,
    updateAddon,
    deleteAddon
  } = useData();

  const [activeTab, setActiveTab] = useState<'services' | 'addons'>('services');

  // Service Edit / Create Modal state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState('');
  const [serviceSlug, setServiceSlug] = useState('');
  const [serviceCategoryId, setServiceCategoryId] = useState(categories[0]?.id || 'cat-residential');
  const [serviceShortDesc, setServiceShortDesc] = useState('');
  const [serviceFullDesc, setServiceFullDesc] = useState('');
  const [serviceDuration, setServiceDuration] = useState('3-4 Hours');
  const [serviceStartingPrice, setServiceStartingPrice] = useState(1999);
  const [serviceImage, setServiceImage] = useState('');

  // Package Edit / Create inside a service
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [targetServiceForPackage, setTargetServiceForPackage] = useState<Service | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [packageName, setPackageName] = useState('');
  const [packagePrice, setPackagePrice] = useState(1999);
  const [packageOriginalPrice, setPackageOriginalPrice] = useState(2499);
  const [packageDuration, setPackageDuration] = useState('3-4 Hours');
  const [packageDesc, setPackageDesc] = useState('');
  const [packageIsPopular, setPackageIsPopular] = useState(false);

  // Addon Modal State
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [addonName, setAddonName] = useState('');
  const [addonPrice, setAddonPrice] = useState(399);
  const [addonCategory, setAddonCategory] = useState('Home');
  const [addonDesc, setAddonDesc] = useState('');

  // Open Service Modal
  const handleOpenServiceModal = (srv?: Service) => {
    if (srv) {
      setEditingServiceId(srv.id);
      setServiceName(srv.name);
      setServiceSlug(srv.slug);
      setServiceCategoryId(srv.categoryId);
      setServiceShortDesc(srv.shortDescription);
      setServiceFullDesc(srv.description || '');
      setServiceDuration(srv.duration);
      setServiceStartingPrice(srv.startingPrice);
      setServiceImage(srv.image);
    } else {
      setEditingServiceId(null);
      setServiceName('');
      setServiceSlug('');
      setServiceCategoryId(categories[0]?.id || 'cat-residential');
      setServiceShortDesc('');
      setServiceFullDesc('');
      setServiceDuration('3-4 Hours');
      setServiceStartingPrice(1999);
      setServiceImage('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80');
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find((c) => c.id === serviceCategoryId);
    const slug = serviceSlug || serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (editingServiceId) {
      await updateService(editingServiceId, {
        name: serviceName,
        slug,
        categoryId: serviceCategoryId,
        categoryName: cat?.name || 'Residential',
        shortDescription: serviceShortDesc,
        description: serviceFullDesc,
        duration: serviceDuration,
        startingPrice: Number(serviceStartingPrice),
        image: serviceImage
      });
    } else {
      await addService({
        name: serviceName,
        slug,
        categoryId: serviceCategoryId,
        categoryName: cat?.name || 'Residential',
        shortDescription: serviceShortDesc,
        description: serviceFullDesc,
        duration: serviceDuration,
        startingPrice: Number(serviceStartingPrice),
        image: serviceImage,
        isActive: true,
        rating: 4.9,
        reviewsCount: 12,
        includedItems: ['Floor scrub & polish', 'Degreasing of surfaces', 'Sanitization'],
        excludedItems: ['Outer wall painting', 'Civil repairs'],
        packages: [
          {
            id: `pkg-${Date.now()}`,
            serviceId: 'temp',
            name: 'Standard Package',
            price: Number(serviceStartingPrice),
            duration: serviceDuration,
            description: 'Comprehensive cleaning service with sanitization.',
            includedServices: ['Deep sanitization', 'Vacuuming', 'Disinfection'],
            isActive: true
          }
        ]
      });
    }
    setIsServiceModalOpen(false);
  };

  // Open Package Modal
  const handleOpenPackageModal = (srv: Service, pkg?: ServicePackage) => {
    setTargetServiceForPackage(srv);
    if (pkg) {
      setEditingPackageId(pkg.id);
      setPackageName(pkg.name);
      setPackagePrice(pkg.price);
      setPackageOriginalPrice(pkg.originalPrice || Math.round(pkg.price * 1.25));
      setPackageDuration(pkg.duration || '3-4 Hours');
      setPackageDesc(pkg.description || '');
      setPackageIsPopular(pkg.isPopular || false);
    } else {
      setEditingPackageId(null);
      setPackageName('');
      setPackagePrice(srv.startingPrice);
      setPackageOriginalPrice(Math.round(srv.startingPrice * 1.25));
      setPackageDuration('3-4 Hours');
      setPackageDesc('');
      setPackageIsPopular(false);
    }
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetServiceForPackage) return;

    if (editingPackageId) {
      await updateServicePackage(targetServiceForPackage.id, editingPackageId, {
        name: packageName,
        price: Number(packagePrice),
        originalPrice: Number(packageOriginalPrice),
        duration: packageDuration,
        description: packageDesc,
        isPopular: packageIsPopular
      });
    } else {
      await addPackageToService(targetServiceForPackage.id, {
        name: packageName,
        price: Number(packagePrice),
        originalPrice: Number(packageOriginalPrice),
        duration: packageDuration,
        description: packageDesc,
        isPopular: packageIsPopular,
        includedServices: ['Deep sanitization', 'Mechanized scrubbing', 'Eco chemicals'],
        isActive: true
      });
    }
    setIsPackageModalOpen(false);
  };

  // Addon Handlers
  const handleOpenAddonModal = (add?: ServiceAddon) => {
    if (add) {
      setEditingAddonId(add.id);
      setAddonName(add.name);
      setAddonPrice(add.price);
      setAddonCategory(add.category || 'Home');
      setAddonDesc(add.description || '');
    } else {
      setEditingAddonId(null);
      setAddonName('');
      setAddonPrice(399);
      setAddonCategory('Home');
      setAddonDesc('');
    }
    setIsAddonModalOpen(true);
  };

  const handleSaveAddon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddonId) {
      await updateAddon(editingAddonId, {
        name: addonName,
        price: Number(addonPrice),
        category: addonCategory,
        description: addonDesc
      });
    } else {
      await addAddon({
        name: addonName,
        price: Number(addonPrice),
        category: addonCategory,
        description: addonDesc,
        isActive: true
      });
    }
    setIsAddonModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Services & Pricing Architecture</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage cleaning catalog, modify package pricing (1 BHK, 2 BHK, Villa), and configure add-on services.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'services' ? (
            <button
              onClick={() => handleOpenServiceModal()}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Service</span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenAddonModal()}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Add-on</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'services'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cleaning Services & Packages ({services.length})
        </button>
        <button
          onClick={() => setActiveTab('addons')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'addons'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Extra Add-on Services ({addons.length})
        </button>
      </div>

      {/* SUBTAB 1: SERVICES & PACKAGES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition"
            >
              {/* Service Parent Row */}
              <div className="p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-700">
                        {srv.categoryName}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${srv.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                        {srv.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">{srv.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{srv.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right pr-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Starts At</span>
                    <p className="text-lg font-black text-blue-600">₹{srv.startingPrice.toLocaleString()}</p>
                  </div>

                  <button
                    onClick={() => handleOpenServiceModal(srv)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    title="Edit Service"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>

                  <button
                    onClick={() => toggleServiceStatus(srv.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      srv.isActive ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {srv.isActive ? 'Disable' : 'Enable'}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete service "${srv.name}"?`)) deleteService(srv.id);
                    }}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 text-xs transition cursor-pointer"
                    title="Delete Service"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Service Packages Table */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Tier Packages ({srv.packages?.length || 0})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Customers select these sizes on the website (e.g. 1 BHK, 2 BHK, 3 BHK).
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenPackageModal(srv)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Package Tier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {srv.packages?.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3 relative"
                    >
                      {pkg.isPopular && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800">
                          Popular
                        </span>
                      )}

                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{pkg.name}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">⏱️ {pkg.duration || 'Flexible'}</p>
                        {pkg.description && (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{pkg.description}</p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-slate-900">₹{pkg.price.toLocaleString()}</span>
                          {pkg.originalPrice && (
                            <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{pkg.originalPrice}</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleOpenPackageModal(srv, pkg)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                            title="Edit Price & Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove package "${pkg.name}"?`)) {
                                deleteServicePackage(srv.id, pkg.id);
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: ADDONS */}
      {activeTab === 'addons' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Configured Add-on Services</h3>
              <p className="text-xs text-slate-500">
                Shown to customers during checkout step 1 to increase average order value.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addons.map((add) => (
              <div
                key={add.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                    {add.category || 'Home'}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 mt-1.5">{add.name}</h4>
                  {add.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{add.description}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-base font-extrabold text-blue-600">+ ₹{add.price.toLocaleString()}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenAddonModal(add)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete add-on "${add.name}"?`)) deleteAddon(add.id);
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingServiceId ? 'Edit Service Details' : 'Create New Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Balcony Pressure Wash & Grill Polish"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={serviceCategoryId}
                    onChange={(e) => setServiceCategoryId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price (₹) *</label>
                  <input
                    type="number"
                    value={serviceStartingPrice}
                    onChange={(e) => setServiceStartingPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration Tag</label>
                <input
                  type="text"
                  placeholder="e.g. 2-3 Hours"
                  value={serviceDuration}
                  onChange={(e) => setServiceDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={serviceImage}
                  onChange={(e) => setServiceImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={serviceShortDesc}
                  onChange={(e) => setServiceShortDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Package Tier Modal */}
      {isPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingPackageId ? 'Edit Package Tier' : `Add Package to ${targetServiceForPackage?.name}`}
            </h3>

            <form onSubmit={handleSavePackage} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  placeholder="e.g. 2 BHK Deep Clean, Villa 4 BHK"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={packagePrice}
                    onChange={(e) => setPackagePrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Original / Strikethrough Price</label>
                  <input
                    type="number"
                    value={packageOriginalPrice}
                    onChange={(e) => setPackageOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 4-5 Hours"
                  value={packageDuration}
                  onChange={(e) => setPackageDuration(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Package Inclusions Summary</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Complete scrubbing of 2 bedrooms, hall, kitchen, 2 bathrooms & balcony."
                  value={packageDesc}
                  onChange={(e) => setPackageDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pkg-popular-check"
                  checked={packageIsPopular}
                  onChange={(e) => setPackageIsPopular(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <label htmlFor="pkg-popular-check" className="text-xs text-slate-700 font-semibold">
                  Mark as "Most Popular Choice" badge
                </label>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Addon Modal */}
      {isAddonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {editingAddonId ? 'Edit Add-on Service' : 'Add New Add-on Service'}
            </h3>

            <form onSubmit={handleSaveAddon} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Add-on Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Microwave Oven Deep Degrease"
                  value={addonName}
                  onChange={(e) => setAddonName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={addonPrice}
                    onChange={(e) => setAddonPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={addonCategory}
                    onChange={(e) => setAddonCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={addonDesc}
                  onChange={(e) => setAddonDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddonModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  Save Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
