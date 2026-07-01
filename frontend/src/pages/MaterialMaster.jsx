import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { Search, Plus, Filter, Edit, AlertTriangle, X } from 'lucide-react';

const MaterialMaster = () => {
  const { materials, addMaterial, editMaterial, activeRole } = useSimulatedDB();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form inputs
  const [name, setName] = useState('');
  const [type, setType] = useState('ROH');
  const [uom, setUom] = useState('PC');
  const [loc, setLoc] = useState('SL01');
  const [valClass, setValClass] = useState('3000');
  const [reorder, setReorder] = useState(10);
  const [safety, setSafety] = useState(5);
  const [leadTime, setLeadTime] = useState(5);
  const [stock, setStock] = useState(0);

  const canEdit = activeRole === 'Admin' || activeRole === 'Warehouse Manager' || activeRole === 'Procurement Manager';

  // Handle Create or Update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      materialName: name,
      materialType: type,
      unitOfMeasure: uom,
      storageLocation: loc,
      valuationClass: valClass,
      reorderPoint: parseInt(reorder),
      safetyStock: parseInt(safety),
      leadTime: parseInt(leadTime),
    };

    if (editingItem) {
      editMaterial({
        materialId: editingItem.materialId,
        currentStock: parseInt(stock),
        ...payload,
      });
    } else {
      addMaterial(payload);
    }

    closeModal();
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setName(item.materialName);
    setType(item.materialType);
    setUom(item.unitOfMeasure);
    setLoc(item.storageLocation);
    setValClass(item.valuationClass);
    setReorder(item.reorderPoint);
    setSafety(item.safetyStock);
    setLeadTime(item.leadTime);
    setStock(item.currentStock);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setName('');
    setType('ROH');
    setUom('PC');
    setLoc('SL01');
    setValClass('3000');
    setReorder(10);
    setSafety(5);
    setLeadTime(5);
    setStock(0);
    setModalOpen(false);
  };

  // Filter items
  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.materialName.toLowerCase().includes(search.toLowerCase()) || m.materialId.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || m.materialType === typeFilter;
    const matchLoc = locFilter === 'All' || m.storageLocation === locFilter;
    return matchSearch && matchType && matchLoc;
  });

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search material code or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-250 dark:border-slate-750 bg-transparent rounded-lg text-xs text-slate-800 dark:text-white outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <div className="flex items-center gap-1.5 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-lg bg-transparent text-xs text-slate-600 dark:text-slate-300">
            <Filter size={13} />
            <span>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent outline-none font-bold"
            >
              <option value="All" className="dark:bg-slate-800">All Types</option>
              <option value="ROH" className="dark:bg-slate-800">ROH (Raw)</option>
              <option value="HALB" className="dark:bg-slate-800">HALB (Semi-finished)</option>
              <option value="FERT" className="dark:bg-slate-800">FERT (Finished)</option>
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-1.5 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-lg bg-transparent text-xs text-slate-600 dark:text-slate-300">
            <Filter size={13} />
            <span>Location:</span>
            <select
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="bg-transparent outline-none font-bold"
            >
              <option value="All" className="dark:bg-slate-800">All Locations</option>
              <option value="SL01" className="dark:bg-slate-800">SL01 - Raw Storage</option>
              <option value="SL02" className="dark:bg-slate-800">SL02 - Assembly</option>
              <option value="SL03" className="dark:bg-slate-800">SL03 - Finished Goods</option>
            </select>
          </div>

          {/* Create Button */}
          {canEdit && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold shadow-lg shadow-primary/20 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Create Material</span>
            </button>
          )}
        </div>
      </div>

      {/* Material Grid Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold">
                <th className="px-6 py-4">Material Code</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Material Type</th>
                <th className="px-6 py-4">UoM</th>
                <th className="px-6 py-4">Storage Location</th>
                <th className="px-6 py-4">Val. Class</th>
                <th className="px-6 py-4">Stock Levels</th>
                <th className="px-6 py-4">Stock Status</th>
                {canEdit && <th className="px-6 py-4 text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 9 : 8} className="text-center py-12 text-slate-400 dark:text-slate-500 font-semibold">
                    No Material Master logs found.
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((m) => {
                  const isLowStock = m.currentStock <= m.reorderPoint;
                  return (
                    <tr key={m.materialId} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 text-slate-700 dark:text-slate-355 font-medium transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">{m.materialId}</td>
                      <td className="px-6 py-4 max-w-[200px] truncate">{m.materialName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.materialType === 'ROH' ? 'bg-blue-500/10 text-primary border border-primary/20' :
                          m.materialType === 'HALB' ? 'bg-orange-500/10 text-warning border border-warning/20' :
                          'bg-emerald-500/10 text-success border border-success/20'
                        }`}>
                          {m.materialType} ({
                            m.materialType === 'ROH' ? 'Raw Material' :
                            m.materialType === 'HALB' ? 'Semi-finished' : 'Finished Goods'
                          })
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-500">{m.unitOfMeasure}</td>
                      <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">{m.storageLocation}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">{m.valuationClass}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white">{m.currentStock} {m.unitOfMeasure}</span>
                          <span className="text-[10px] text-slate-400">Min: {m.reorderPoint}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isLowStock ? (
                          <span className="flex items-center gap-1.5 text-danger font-bold">
                            <AlertTriangle size={14} />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="text-success font-bold">
                            Healthy
                          </span>
                        )}
                      </td>
                      {canEdit && (
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openEditModal(m)}
                            className="p-1 text-slate-400 hover:text-primary rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Popup */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full z-10 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-850/50">
              <h3 className="font-bold text-slate-800 dark:text-white">
                {editingItem ? `Edit Material: ${editingItem.materialId}` : 'Create New Material Master Log'}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Material Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Raw Stainless Steel Rods"
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Material Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                  >
                    <option value="ROH">ROH - Raw Materials</option>
                    <option value="HALB">HALB - Semi-finished</option>
                    <option value="FERT">FERT - Finished Goods</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Unit of Measure</label>
                  <select
                    value={uom}
                    onChange={(e) => setUom(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                  >
                    <option value="PC">PC - Pieces</option>
                    <option value="KG">KG - Kilograms</option>
                    <option value="L">L - Litres</option>
                    <option value="M">M - Meters</option>
                    <option value="BOX">BOX - Box Units</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Storage Location</label>
                  <select
                    value={loc}
                    onChange={(e) => setLoc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                  >
                    <option value="SL01">SL01 - Raw Storage</option>
                    <option value="SL02">SL02 - Assembly</option>
                    <option value="SL03">SL03 - Finished Goods</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Valuation Class</label>
                  <select
                    value={valClass}
                    onChange={(e) => setValClass(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 dark:text-white"
                  >
                    <option value="3000">3000 - Raw Materials</option>
                    <option value="7900">7900 - Semi-finished Valuation</option>
                    <option value="7920">7920 - Finished Product Valuation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Reorder Point</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={reorder}
                    onChange={(e) => setReorder(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Safety Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={safety}
                    onChange={(e) => setSafety(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white"
                  />
                </div>

                {editingItem && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Stock Level</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg text-xs outline-none focus:border-primary text-slate-800 dark:text-white font-bold"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold"
                >
                  {editingItem ? 'Save Changes' : 'Create Material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialMaster;
