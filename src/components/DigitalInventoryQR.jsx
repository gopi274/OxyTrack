import React, { useState, useEffect, useRef } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import {
  Boxes,
  Camera,
  CheckCircle2,
  Database,
  Filter,
  Layers,
  Plus,
  QrCode,
  RotateCcw,
  Scan,
  Search,
  ShieldCheck,
  Video,
  VideoOff,
  X
} from 'lucide-react';

export const DigitalInventoryQR = () => {
  const { currentRole, cylinders, addCylinder, currentHospital } = useOxyTrack();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // QR Scanner Simulator Modal & Camera Stream
  const [showScanner, setShowScanner] = useState(false);
  const [scannedCylinder, setScannedCylinder] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);

  // Enlarged QR Badge Modal State
  const [qrModalCylinder, setQrModalCylinder] = useState(null);

  // Add Cylinder Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCylId, setNewCylId] = useState(`OXY-${Math.floor(10300 + Math.random() * 9000)}`);
  const [newType, setNewType] = useState('D-Type Cylinder (47 Liters / 7.0 m³)');
  const [newCapacity, setNewCapacity] = useState(7000);
  const [newPressure, setNewPressure] = useState(145);
  const [newStatus, setNewStatus] = useState('FILLED');
  const [newPurity, setNewPurity] = useState('99.5% (Medical Grade IP)');
  const [newVendor, setNewVendor] = useState('Inox Air Products');
  const [newLocation, setNewLocation] = useState(`${currentHospital.name} - Central Gas Storage`);

  const canAddCylinder = currentRole === 'HOSPITAL_ADMIN' || currentRole === 'SYSTEM_ADMIN';

  // Manage Camera Stream
  useEffect(() => {
    let stream = null;

    if (showScanner && cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraError('');
        })
        .catch(err => {
          console.warn('Camera access denied or unavailable:', err);
          setCameraError('Camera access unavailable. Using virtual barcode scanner.');
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showScanner, cameraActive]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleCloseScanner = () => {
    stopCamera();
    setShowScanner(false);
  };

  const filteredCylinders = cylinders.filter(c => {
    const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
    const matchesQuery = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase()) || c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleScanSample = (cylinderId) => {
    const found = cylinders.find(c => c.id === cylinderId) || cylinders[0];
    setScannedCylinder(found);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addCylinder({
      id: newCylId,
      type: newType,
      capacityLiters: Number(newCapacity),
      currentPressureBar: Number(newPressure),
      status: newStatus,
      location: newLocation,
      purity: newPurity,
      vendor: newVendor,
      lastInspection: '11 Aug 2026 (Passed Hydro-test)'
    });
    setShowAddModal(false);
    setNewCylId(`OXY-${Math.floor(10300 + Math.random() * 9000)}`);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-sky-200/80 shadow-md shadow-sky-100/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-blue-600" />
            📋 Digital Medical Cylinder Stock Registry & Barcode Verification
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Certified cylinder tracking, hydrostatic test history, gas purity parameters, and barcode inspection
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canAddCylinder && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-[1.01] transition-all"
            >
              <Plus className="w-4 h-4" />
              Register New Cylinder
            </button>
          )}

          <button
            onClick={() => {
              setShowScanner(true);
              setCameraActive(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 hover:scale-[1.01] transition-all"
          >
            <Camera className="w-4 h-4" />
            Scan Cylinder QR / Barcode
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-sky-200/80 shadow-md shadow-sky-100/40 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-sky-50/70 px-4 py-2 rounded-full border border-sky-200">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <input
              type="text"
              placeholder="Search Cylinder Tag (e.g. OXY-10293)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-900 outline-none w-48 sm:w-64 placeholder-slate-400 font-extrabold text-xs"
            />
          </div>

          <div className="flex items-center gap-2 bg-sky-50/70 px-4 py-2 rounded-full border border-sky-200">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-800 font-extrabold outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-white text-slate-800">All Inventory Statuses</option>
              <option value="FILLED" className="bg-white text-slate-800">🟢 Filled (Available)</option>
              <option value="IN_USE" className="bg-white text-slate-800">🔵 In Use (Manifold Connected)</option>
              <option value="EMPTY" className="bg-white text-slate-800">🔴 Empty (Awaiting Refill)</option>
              <option value="MAINTENANCE" className="bg-white text-slate-800">🟡 Under Maintenance</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 font-mono text-[11px] font-bold">
          Hospital Stock: <strong className="text-blue-900 font-extrabold">{filteredCylinders.length} Verified Cylinders</strong>
        </span>
      </div>

      {/* Cylinder Cards Grid with Scannable QR Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCylinders.map(cyl => {
          const isFilled = cyl.status === 'FILLED';
          const isInUse = cyl.status === 'IN_USE';
          const isEmpty = cyl.status === 'EMPTY';
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${cyl.id}`;

          return (
            <div
              key={cyl.id}
              className="prohealth-panel rounded-3xl p-5 border border-sky-200/80 bg-white shadow-md shadow-sky-100/40 prohealth-card-hover space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 font-mono flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  {cyl.id}
                </span>

                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                  isEmpty || cyl.status === 'CRITICAL' ? 'tag-critical' :
                  isFilled ? 'tag-normal' :
                  isInUse ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'tag-warning'
                }`}>
                  {cyl.status}
                </span>
              </div>

              {/* Cylinder Info + Scannable QR Code Thumbnail */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="text-xs space-y-1 flex-1">
                  <span className="block font-extrabold text-slate-900 text-sm leading-tight">{cyl.type}</span>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{cyl.location}</p>
                  {cyl.vendor && (
                    <p className="text-[10px] text-slate-400 font-mono font-bold">Supplier: {cyl.vendor}</p>
                  )}
                </div>

                {/* Original Authentic QR Code for Cylinder */}
                <button
                  type="button"
                  onClick={() => setQrModalCylinder(cyl)}
                  className="p-1 rounded-xl bg-sky-50 border border-sky-200 hover:border-blue-500 transition-all shrink-0 group relative"
                  title="Click to view printable QR Code"
                >
                  <img
                    src={qrUrl}
                    alt={`QR Code ${cyl.id}`}
                    className="w-14 h-14 object-contain rounded-lg"
                  />
                  <span className="text-[8px] block font-mono text-center font-bold text-blue-700 mt-0.5">
                    QR Tag
                  </span>
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-200 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Filling Pressure:</span>
                  <span className={`font-mono font-extrabold ${cyl.currentPressureBar > 50 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {cyl.currentPressureBar} bar
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-medium">Hydro Inspection:</span>
                  <span className="text-slate-800 font-extrabold text-[10px]">{cyl.lastInspection}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setScannedCylinder(cyl);
                  setShowScanner(true);
                  setCameraActive(true);
                }}
                className="w-full py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-blue-700 text-xs font-extrabold border border-sky-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Scan Cylinder Inspection Badge
              </button>
            </div>
          );
        })}
      </div>

      {/* Printable Enlarged QR Code Modal */}
      {qrModalCylinder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="prohealth-panel w-full max-w-sm rounded-3xl p-6 border border-sky-200 bg-white shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between pb-2 border-b border-sky-100">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-600" />
                Authentic Cylinder QR Code Tag
              </h3>
              <button
                onClick={() => setQrModalCylinder(null)}
                className="p-1.5 rounded-full hover:bg-sky-50 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-blue-300 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${qrModalCylinder.id}`}
                alt={`QR Tag ${qrModalCylinder.id}`}
                className="w-48 h-48 object-contain mx-auto"
              />
              <span className="block font-mono font-extrabold text-slate-900 text-sm mt-2">
                {qrModalCylinder.id}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block">
                {qrModalCylinder.type}
              </span>
            </div>

            <button
              onClick={() => {
                setScannedCylinder(qrModalCylinder);
                setQrModalCylinder(null);
                setShowScanner(true);
              }}
              className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20"
            >
              Simulate Scan on This Cylinder
            </button>
          </div>
        </div>
      )}

      {/* Add New Cylinder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="prohealth-panel w-full max-w-lg rounded-3xl p-6 border border-sky-200 bg-white shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Register Oxygen Cylinder Details
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full hover:bg-sky-50 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Cylinder ID Tag</label>
                  <input
                    type="text"
                    value={newCylId}
                    onChange={e => setNewCylId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-xs outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Cylinder Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:border-blue-600"
                  >
                    <option value="D-Type Cylinder (47 Liters / 7.0 m³)">D-Type Cylinder (47 Liters / 7.0 m³)</option>
                    <option value="B-Type Portable Cylinder (10 Liters)">B-Type Portable Cylinder (10 Liters)</option>
                    <option value="Liquid Cryogenic Cylinder (Dura-Cyl 170L)">Liquid Cryogenic Cylinder (Dura-Cyl 170L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Capacity (Liters)</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={e => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-xs outline-none focus:border-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Current Pressure (bar)</label>
                  <input
                    type="number"
                    value={newPressure}
                    onChange={e => setNewPressure(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold text-xs outline-none focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:border-blue-600"
                  >
                    <option value="FILLED">🟢 Filled (Available)</option>
                    <option value="IN_USE">🔵 In Use (Connected)</option>
                    <option value="EMPTY">🔴 Empty (Needs Refill)</option>
                    <option value="MAINTENANCE">🟡 Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Gas Supplier</label>
                  <input
                    type="text"
                    value={newVendor}
                    onChange={e => setNewVendor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-extrabold mb-1">Assigned Storage Depot</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-extrabold shadow-md shadow-emerald-500/20"
                >
                  Register to Inventory
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* QR Scanner & Camera Viewfinder Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="prohealth-panel w-full max-w-md rounded-3xl p-6 border border-sky-200 bg-white shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                Live Camera Barcode Inspection
              </h3>
              <button
                onClick={handleCloseScanner}
                className="p-1.5 rounded-full hover:bg-sky-50 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder Frame with Live Device Camera Stream */}
            <div className="p-2 rounded-2xl bg-slate-900 border border-sky-300 text-center space-y-2 relative overflow-hidden min-h-[220px] flex flex-col justify-center items-center">
              {cameraActive ? (
                <div className="relative w-full h-52 rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Laser Scan Reticle Overlay */}
                  <div className="absolute inset-0 border-2 border-blue-400/70 rounded-xl pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-44 border-2 border-dashed border-emerald-400 rounded-2xl animate-pulse flex items-center justify-center relative">
                      <div className="w-full h-0.5 bg-rose-500 shadow-md shadow-rose-500/80 animate-bounce" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  <QrCode className="w-16 h-16 text-sky-400 mx-auto opacity-90" />
                  <p className="text-xs text-sky-200 font-medium">
                    {cameraError || 'Align physical cylinder QR tag or barcode within camera viewfinder.'}
                  </p>
                </div>
              )}

              {/* Camera Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  if (cameraActive) stopCamera();
                  else setCameraActive(true);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                  cameraActive ? 'bg-rose-500 text-white border-rose-400' : 'bg-blue-600 text-white border-blue-500'
                }`}
              >
                {cameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                {cameraActive ? 'Stop Device Camera' : '📷 Turn On Device Camera'}
              </button>
            </div>

            <div>
              <span className="text-[11px] font-extrabold text-slate-400 block mb-1.5 uppercase">
                Simulate Scan on Registered Badges:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {['OXY-10293', 'OXY-10294', 'OXY-10295', 'OXY-10296', 'OXY-10297'].map(id => (
                  <button
                    key={id}
                    onClick={() => handleScanSample(id)}
                    className="px-3 py-1 rounded-full bg-white hover:bg-sky-50 text-blue-700 border border-sky-200 text-xs font-mono font-extrabold transition-all shadow-2xs"
                  >
                    Scan {id}
                  </button>
                ))}
              </div>
            </div>

            {scannedCylinder && (
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-blue-300 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-sm text-slate-900 font-mono">
                    Cylinder Tag: {scannedCylinder.id}
                  </span>
                  <span className={`px-3 py-0.5 rounded-full font-extrabold text-[10px] ${
                    scannedCylinder.status === 'EMPTY' || scannedCylinder.status === 'CRITICAL' ? 'tag-critical' :
                    scannedCylinder.status === 'IN_USE' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                    scannedCylinder.status === 'MAINTENANCE' ? 'tag-warning' : 'tag-normal'
                  }`}>
                    Status: {scannedCylinder.status}
                  </span>
                </div>
                <div className="text-slate-700 space-y-1 font-medium">
                  <p>Type: <strong className="text-slate-900">{scannedCylinder.type}</strong></p>
                  <p>Storage: <strong className="text-slate-900">{scannedCylinder.location}</strong></p>
                  <p>Pressure: <strong className={scannedCylinder.status === 'EMPTY' ? 'text-rose-600 font-extrabold' : 'text-blue-700 font-extrabold'}>{scannedCylinder.currentPressureBar} bar</strong></p>
                  <p>Gas Purity: <strong className={scannedCylinder.status === 'EMPTY' ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-extrabold'}>{scannedCylinder.purity}</strong></p>
                  <p>Supplier: <strong className="text-slate-900">{scannedCylinder.vendor || 'Inox Air Products'}</strong></p>
                  <p>Hydro Test Date: <strong className="text-slate-900">{scannedCylinder.lastInspection}</strong></p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
