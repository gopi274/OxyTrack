import React, { useState, useEffect } from 'react';
import { useOxyTrack } from '../context/OxyTrackContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Building2,
  Clock,
  Compass,
  Droplets,
  Filter,
  MapPin,
  Phone,
  Radio,
  Search,
  ShieldAlert,
  User
} from 'lucide-react';

function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

const createCustomMarkerIcon = (status) => {
  const color = status === 'CRITICAL' ? '#dc2626' : status === 'WARNING' ? '#d97706' : '#16a34a';
  const pulseClass = status === 'CRITICAL' ? 'animate-pulse' : '';

  const svgHtml = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
      <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background-color: ${color}; opacity: 0.25;" class="${pulseClass}"></div>
      <div style="position: relative; width: 30px; height: 30px; border-radius: 50%; background-color: #ffffff; border: 3px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(37,99,235,0.25);">
        <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color};"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
};

export const DistrictStateMap = ({ onOpenReplenishmentModal }) => {
  const { hospitals, setSelectedHospitalId } = useOxyTrack();
  const [selectedMapHospital, setSelectedMapHospital] = useState(hospitals[0] || {});
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [mapStyle, setMapStyle] = useState('LIGHT');

  const districts = [
    'ALL',
    'Thiruvananthapuram',
    'Kollam',
    'Pathanamthitta',
    'Alappuzha',
    'Kottayam',
    'Idukki',
    'Ernakulam',
    'Thrissur',
    'Palakkad',
    'Malappuram',
    'Kozhikode',
    'Wayanad',
    'Kannur',
    'Kasaragod'
  ];

  const filteredHospitals = hospitals.filter(h => {
    const matchesDistrict = districtFilter === 'ALL' || h.district === districtFilter;
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const normalCount = filteredHospitals.filter(h => h.status === 'NORMAL').length;
  const warningCount = filteredHospitals.filter(h => h.status === 'WARNING').length;
  const criticalCount = filteredHospitals.filter(h => h.status === 'CRITICAL').length;
  const totalCount = filteredHospitals.length;

  const gridLabel = districtFilter === 'ALL'
    ? `GPS Telemetry Grid: 30 Hospitals Across Kerala`
    : `GPS Telemetry Grid: ${totalCount} Hospitals in ${districtFilter}`;

  const activeCenter = selectedMapHospital && selectedMapHospital.latitude
    ? [selectedMapHospital.latitude, selectedMapHospital.longitude]
    : [9.9816, 76.2999];

  const getTileUrl = () => {
    switch (mapStyle) {
      case 'SATELLITE':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'STREETS':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      default: // LIGHT Mode Maps (CartoDB Positron Light)
        return 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }
  };

  return (
    <div className="space-y-6">

      {/* Light ProHealth Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-md shadow-blue-100/50 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            🗺️ District & State Hospital Oxygen Map ({totalCount} Hospitals)
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Real-time geospatial GPS tracking across {districtFilter === 'ALL' ? '30 government hospitals in all 14 districts of Kerala' : `${totalCount} government hospitals in ${districtFilter}`}.
          </p>
        </div>

        {/* Filters & Map Tile Style Toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-blue-50/70 p-1 rounded-full border border-blue-100">
            <button
              onClick={() => setMapStyle('LIGHT')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${
                mapStyle === 'LIGHT' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Light Map
            </button>
            <button
              onClick={() => setMapStyle('STREETS')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${
                mapStyle === 'STREETS' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Street View
            </button>
            <button
              onClick={() => setMapStyle('SATELLITE')}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${
                mapStyle === 'SATELLITE' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              Satellite
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-blue-50/70 px-4 py-1.5 rounded-full border border-blue-100">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            <input
              type="text"
              placeholder="Search hospital..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-900 font-bold outline-none w-36 placeholder-slate-400 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-blue-50/70 px-4 py-1.5 rounded-full border border-blue-100">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-xs"
            >
              {districts.map(d => (
                <option key={d} value={d} className="bg-white text-slate-800">
                  {d === 'ALL' ? 'All 14 Districts' : d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Light GPS Map + Hospital Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Real Interactive Leaflet GPS Map Container (8 cols) */}
        <div className="lg:col-span-8 prohealth-panel rounded-3xl p-4 border border-blue-100 bg-white shadow-xl shadow-blue-100/50 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          
          {/* Map Top Status Pill Header */}
          <div className="flex flex-wrap items-center justify-between bg-blue-50/90 p-3 rounded-2xl border border-blue-100 text-xs mb-3 z-10 relative gap-2">
            <span className="font-extrabold text-slate-800 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              {gridLabel}
            </span>
            <div className="flex items-center gap-3 font-bold text-[11px]">
              <span className="text-emerald-700">🟢 {normalCount} Normal</span>
              <span className="text-amber-700">🟡 {warningCount} Warning</span>
              <span className="text-rose-700">🔴 {criticalCount} Critical</span>
            </div>
          </div>

          {/* Leaflet React Map Canvas */}
          <div className="w-full h-[460px] rounded-2xl overflow-hidden z-0 relative">
            <MapContainer
              center={activeCenter}
              zoom={selectedMapHospital.district === 'Thiruvananthapuram' ? 10 : 8}
              style={{ width: '100%', height: '100%' }}
              zoomControl={true}
            >
              <TileLayer
                url={getTileUrl()}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              <MapRecenter center={activeCenter} zoom={selectedMapHospital.district === 'Thiruvananthapuram' ? 10 : 8} />

              {filteredHospitals.map(h => (
                <Marker
                  key={h.id}
                  position={[h.latitude, h.longitude]}
                  icon={createCustomMarkerIcon(h.status)}
                  eventHandlers={{
                    click: () => {
                      setSelectedMapHospital(h);
                      setSelectedHospitalId(h.id);
                    }
                  }}
                >
                  <Popup className="prohealth-leaflet-popup">
                    <div className="p-1 text-slate-900 font-sans space-y-1">
                      <div className="flex items-center justify-between gap-2 border-b pb-1">
                        <strong className="text-xs font-bold text-slate-900">{h.name}</strong>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                          h.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          h.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {h.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-600 font-medium">District: {h.district}</p>
                      <p className="text-[10px] font-extrabold text-blue-700">Stock: {h.availableOxygen.toLocaleString()} L ({h.estimatedHours}h)</p>
                      <button
                        onClick={() => {
                          setSelectedMapHospital(h);
                          setSelectedHospitalId(h.id);
                        }}
                        className="w-full mt-1 py-1 rounded-md bg-blue-600 text-white font-bold text-[10px]"
                      >
                        Inspect Telemetry Sheet
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

            </MapContainer>
          </div>

          <div className="text-[10px] text-slate-400 font-medium mt-2 text-center">
            💡 Click any of the {totalCount} hospital markers on the map to inspect live tank level, depletion countdown & emergency actions.
          </div>

        </div>

        {/* Selected Hospital Live Telemetry Inspection Sheet (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="prohealth-panel rounded-3xl p-5 border border-blue-100 bg-white shadow-xl shadow-blue-100/50 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Hospital Telemetry Sheet
              </span>
              <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold ${
                selectedMapHospital.status === 'CRITICAL' ? 'tag-critical' :
                selectedMapHospital.status === 'WARNING' ? 'tag-warning' : 'tag-normal'
              }`}>
                {selectedMapHospital.status}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                {selectedMapHospital.name}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                District: <strong className="text-slate-800 font-bold">{selectedMapHospital.district}</strong>
              </p>
            </div>

            {/* Live Key Gauges */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex justify-between items-center">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" /> Available Stock:
                </span>
                <span className="font-mono font-extrabold text-slate-900 text-sm">
                  {selectedMapHospital.availableOxygen ? selectedMapHospital.availableOxygen.toLocaleString() : 0} L
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex justify-between items-center">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Stock Remaining:
                </span>
                <span className={`font-mono font-extrabold text-sm ${
                  selectedMapHospital.estimatedHours < 8 ? 'text-rose-600 font-black' : 'text-emerald-700'
                }`}>
                  {selectedMapHospital.estimatedHours} Hours
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex justify-between items-center">
                <span className="text-slate-600 font-medium">Consumption Rate:</span>
                <span className="font-mono font-extrabold text-purple-700">
                  {selectedMapHospital.consumptionRate} L/hr
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex justify-between items-center">
                <span className="text-slate-600 font-medium">ICU Bed Occupancy:</span>
                <span className="font-mono font-extrabold text-slate-900">
                  {selectedMapHospital.icuOccupancy}%
                </span>
              </div>
            </div>

            {/* Contact Nodal Officer */}
            <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-blue-100 space-y-1.5 text-xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Hospital Contact & Supplier:
              </span>
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <User className="w-3.5 h-3.5 text-blue-600" />
                {selectedMapHospital.contactPerson || 'Dr. Officer (CMO)'}
              </p>
              <p className="font-mono text-[11px] text-slate-600 font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {selectedMapHospital.phone || '+91 471 230 2400'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium pt-1">
                Supplier: <strong className="text-slate-800 font-bold">{selectedMapHospital.lmoSupplier || 'Inox Air Products'}</strong>
              </p>
            </div>

            <button
              onClick={onOpenReplenishmentModal}
              className="w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              <ShieldAlert className="w-4 h-4" />
              Dispatch Emergency Order to Hospital
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
