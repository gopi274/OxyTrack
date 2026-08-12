import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_HOSPITALS,
  INITIAL_WARDS,
  INITIAL_SENSORS,
  INITIAL_CYLINDERS,
  INITIAL_ANOMALIES,
  REPLENISHMENT_REQUESTS,
  REDISTRIBUTION_PROPOSALS
} from '../data/mockData';

const OxyTrackContext = createContext();

export const DEMO_USERS = [
  {
    email: 'admin@trivandrumgh.in',
    name: 'Dr. K. R. Nair',
    title: 'Chief Medical Officer',
    role: 'HOSPITAL_ADMIN',
    hospitalId: 'GH-TVM-01',
    district: 'Thiruvananthapuram',
    badge: '🏢 Hospital Administrator'
  },
  {
    email: 'staff@trivandrumgh.in',
    name: 'Nurse Anitha V.',
    title: 'On-Duty ICU Nurse',
    role: 'HOSPITAL_STAFF',
    hospitalId: 'GH-TVM-01',
    district: 'Thiruvananthapuram',
    badge: '👩‍⚕️ Nurse (On-Duty Ward)'
  },
  {
    email: 'dmo@thiruvananthapuram.gov.in',
    name: 'Dr. Suresh Kumar',
    title: 'District Medical Officer (DMO)',
    role: 'DISTRICT_OFFICER',
    hospitalId: 'GH-TVM-01',
    district: 'Thiruvananthapuram',
    badge: '🩺 District Medical Officer'
  },
  {
    email: 'healthsec@kerala.gov.in',
    name: 'Dr. Rajeev P. (IAS)',
    title: 'State Health Secretary',
    role: 'STATE_HEALTH',
    hospitalId: 'GH-TVM-01',
    district: 'ALL',
    badge: '🏛️ State Health Department'
  },
  {
    email: 'sysadmin@oxytrack.gov.in',
    name: 'Alex Rivera',
    title: 'Principal IoT System Admin',
    role: 'SYSTEM_ADMIN',
    hospitalId: 'GH-TVM-01',
    district: 'ALL',
    badge: '⚙️ System Administrator'
  }
];

export const OxyTrackProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(DEMO_USERS[0]);
  const [currentRole, setCurrentRole] = useState(DEMO_USERS[0].role);
  const [selectedHospitalId, setSelectedHospitalId] = useState('GH-TVM-01');
  const [isEvaluatorMode, setIsEvaluatorMode] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);

  // Core Data States
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [wards, setWards] = useState(INITIAL_WARDS);
  const [sensors, setSensors] = useState(INITIAL_SENSORS);
  const [cylinders, setCylinders] = useState(INITIAL_CYLINDERS);
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);
  const [replenishments, setReplenishments] = useState(REPLENISHMENT_REQUESTS);
  const [redistributions, setRedistributions] = useState(REDISTRIBUTION_PROPOSALS);

  // Global Alerts Queue
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: "ALT-01",
      title: "⚠️ ICU PRESSURE DROP DETECTED",
      message: "Super Specialty ICU supply line pressure registered 4.1 bar (normal threshold 4.2-4.5 bar).",
      timestamp: "18:42 Today",
      type: "WARNING",
      hospitalId: "GH-TVM-01"
    },
    {
      id: "ALT-02",
      title: "🔴 CRITICAL STOCK WARNING",
      message: "Government General Hospital Trivandrum LMO tank level is at 21.6% (7.7 hours depletion time remaining).",
      timestamp: "18:30 Today",
      type: "DANGER",
      hospitalId: "GH-TVM-01"
    }
  ]);

  // Handle Role Switch
  const switchUserRole = (newRole) => {
    setCurrentRole(newRole);
    const presetUser = DEMO_USERS.find(u => u.role === newRole);
    if (presetUser) {
      setCurrentUser(presetUser);
    }
  };

  const login = (email, password, role) => {
    const user = DEMO_USERS.find(u => u.email === email) || {
      email,
      name: email.split('@')[0],
      title: 'Healthcare Officer',
      role: role || 'HOSPITAL_ADMIN',
      hospitalId: 'GH-TVM-01',
      district: 'Thiruvananthapuram',
      badge: '🔑 Authenticated Session'
    };
    setCurrentUser(user);
    setCurrentRole(user.role);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Scoped Hospitals List
  const scopedHospitals = React.useMemo(() => {
    if (currentRole === 'HOSPITAL_STAFF' || currentRole === 'HOSPITAL_ADMIN') {
      return hospitals.filter(h => h.id === (currentUser?.hospitalId || 'GH-TVM-01'));
    }
    if (currentRole === 'DISTRICT_OFFICER') {
      return hospitals.filter(h => h.district === (currentUser?.district || 'Thiruvananthapuram'));
    }
    return hospitals;
  }, [hospitals, currentRole, currentUser]);

  const effectiveHospitalId = (currentRole === 'HOSPITAL_STAFF' || currentRole === 'HOSPITAL_ADMIN')
    ? (currentUser?.hospitalId || 'GH-TVM-01')
    : selectedHospitalId;

  const currentHospital = hospitals.find(h => h.id === effectiveHospitalId) || scopedHospitals[0] || hospitals[0];

  // Scoped Replenishments List
  const scopedReplenishments = React.useMemo(() => {
    if (currentRole === 'HOSPITAL_STAFF' || currentRole === 'HOSPITAL_ADMIN') {
      return replenishments.filter(r => r.hospitalId === effectiveHospitalId);
    }
    if (currentRole === 'DISTRICT_OFFICER') {
      return replenishments.filter(r => r.district === currentUser?.district);
    }
    return replenishments;
  }, [replenishments, currentRole, effectiveHospitalId, currentUser]);

  // Scoped Cylinders List
  const scopedCylinders = React.useMemo(() => {
    if (currentRole === 'HOSPITAL_STAFF' || currentRole === 'HOSPITAL_ADMIN') {
      return cylinders.filter(c => c.location.toLowerCase().includes(currentHospital.name.toLowerCase()) || c.location.toLowerCase().includes('trivandrum'));
    }
    return cylinders;
  }, [cylinders, currentRole, currentHospital]);

  // Dynamic Telemetry Engine Tick
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setHospitals(prev => prev.map(h => {
        if (h.id === effectiveHospitalId) {
          const consumptionPerTick = (h.consumptionRate / 3600) * 2;
          const newAvail = Math.max(100, Math.round((h.availableOxygen - consumptionPerTick) * 10) / 10);
          const newHours = Math.round((newAvail / h.consumptionRate) * 10) / 10;
          
          let newStatus = h.status;
          if (newHours < 8) newStatus = "CRITICAL";
          else if (newHours < 16) newStatus = "WARNING";
          else newStatus = "NORMAL";

          return {
            ...h,
            availableOxygen: newAvail,
            estimatedHours: newHours,
            status: newStatus
          };
        }
        return h;
      }));

      setSensors(prev => prev.map(s => {
        if (s.id === 'SNS-LMO-01') {
          const newVol = Math.max(100, s.volumeLiters - 1);
          const newPerc = Math.round((newVol / s.maxCapacity) * 1000) / 10;
          return {
            ...s,
            volumeLiters: newVol,
            levelPercent: newPerc,
            lastPing: "Just now"
          };
        }
        return { ...s, lastPing: "Just now" };
      }));

    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, effectiveHospitalId]);

  // Cylinder Management Action: Update Particular Cylinder Pressure / Oxygen Level
  const updateCylinderPressure = (cylinderId, newPressureBar, newStatus) => {
    setCylinders(prev => prev.map(c => {
      if (c.id === cylinderId) {
        let status = newStatus || c.status;
        const p = Number(newPressureBar);
        if (p === 0) status = 'EMPTY';
        else if (p < 40) status = 'MAINTENANCE';
        else if (p < 90) status = 'IN_USE';
        else status = 'FILLED';

        return {
          ...c,
          currentPressureBar: p,
          status
        };
      }
      return c;
    }));

    setActiveAlerts(prev => [{
      id: `ALT-${Date.now()}`,
      title: "📍 CYLINDER OXYGEN LEVEL UPDATED",
      message: `Nurse updated Cylinder ${cylinderId} pressure to ${newPressureBar} bar.`,
      timestamp: "Just now",
      type: "SUCCESS",
      hospitalId: currentHospital.id
    }, ...prev]);
  };

  // Cylinder Management Action: Add New Oxygen Cylinder
  const addCylinder = (newCylinderData) => {
    const createdCylinder = {
      id: newCylinderData.id || `OXY-${Math.floor(10299 + Math.random() * 9000)}`,
      type: newCylinderData.type || 'D-Type Cylinder (47 Liters / 7.0 m³)',
      capacityLiters: Number(newCylinderData.capacityLiters) || 7000,
      currentPressureBar: Number(newCylinderData.currentPressureBar) || 145,
      status: newCylinderData.status || 'FILLED',
      location: newCylinderData.location || `${currentHospital.name} - Central Storage`,
      lastInspection: newCylinderData.lastInspection || 'Today',
      qrCode: `OXY-${Math.floor(10000 + Math.random() * 90000)}`,
      purity: newCylinderData.purity || '99.5%',
      vendor: newCylinderData.vendor || 'Inox Air Products'
    };

    setCylinders(prev => [createdCylinder, ...prev]);

    setActiveAlerts(prev => [{
      id: `ALT-${Date.now()}`,
      title: "📦 NEW OXYGEN CYLINDER REGISTERED",
      message: `Cylinder ${createdCylinder.id} registered to ${createdCylinder.location}.`,
      timestamp: "Just now",
      type: "SUCCESS",
      hospitalId: currentHospital.id
    }, ...prev]);
  };

  // Demo Action Triggers
  const triggerSimulatedSpike = () => {
    setWards(prev => prev.map(w => w.id === 'WARD-ICU' ? {
      ...w,
      consumptionRate: 620,
      status: "CRITICAL",
      pipelinePressure: 3.8
    } : w));

    setHospitals(prev => prev.map(h => h.id === effectiveHospitalId ? {
      ...h,
      consumptionRate: 680,
      estimatedHours: 4.8,
      status: "CRITICAL"
    } : h));

    setActiveAlerts(prev => [{
      id: `ALT-${Date.now()}`,
      title: "⚡ DEMO ICU USAGE SPIKE (+42%) TRIGGERED",
      message: "High-flow oxygen demand spiked in ICU Block B to 620 L/hr.",
      timestamp: "Just now",
      type: "DANGER",
      hospitalId: currentHospital.id
    }, ...prev]);
  };

  const triggerPressureDrop = () => {
    setSensors(prev => prev.map(s => s.id === 'SNS-PIPE-ICU' ? {
      ...s,
      pressureBar: 3.4,
      status: "CRITICAL"
    } : s));

    setActiveAlerts(prev => [{
      id: `ALT-${Date.now()}`,
      title: "⚠️ DEMO PIPELINE PRESSURE DROP TRIGGERED",
      message: "Riser Shaft B manifold line dropped to 3.4 bar.",
      timestamp: "Just now",
      type: "WARNING",
      hospitalId: currentHospital.id
    }, ...prev]);
  };

  const resetTelemetryToNormal = () => {
    setHospitals(INITIAL_HOSPITALS);
    setWards(INITIAL_WARDS);
    setSensors(INITIAL_SENSORS);
    setCylinders(INITIAL_CYLINDERS);
    setActiveAlerts([]);
  };

  const updateWardFlow = (wardId, newRate) => {
    setWards(prev => prev.map(w => w.id === wardId ? {
      ...w,
      consumptionRate: newRate,
      status: newRate > 300 ? "CRITICAL" : newRate > 200 ? "WARNING" : "NORMAL"
    } : w));
  };

  const submitReplenishmentRequest = (newReq) => {
    const createdReq = {
      id: `REQ-2026-${Math.floor(900 + Math.random() * 90)}`,
      hospitalId: currentHospital.id,
      hospitalName: currentHospital.name,
      district: currentHospital.district,
      requiredVolumeLiters: newReq.volume || 4500,
      cylinderBreakdown: newReq.breakdown || "1 LMO Tanker (3,000L) + 15 D-Type Cylinders",
      priority: newReq.priority || "EMERGENCY_RED",
      predictedDepletion: `${currentHospital.estimatedHours} hrs remaining`,
      reason: newReq.reason || "PREDICTED_SHORTAGE",
      submittedAt: "Just now",
      status: "PENDING_DMO_APPROVAL"
    };

    setReplenishments(prev => [createdReq, ...prev]);

    setActiveAlerts(prev => [{
      id: `ALT-${Date.now()}`,
      title: "🔄 REPLENISHMENT REQUISITION CREATED",
      message: `Requisition ${createdReq.id} submitted for ${createdReq.requiredVolumeLiters}L to District Medical Officer.`,
      timestamp: "Just now",
      type: "INFO",
      hospitalId: currentHospital.id
    }, ...prev]);
  };

  const approveReplenishmentRequest = (reqId) => {
    setReplenishments(prev => prev.map(r => r.id === reqId ? {
      ...r,
      status: "APPROVED_DISPATCHED"
    } : r));

    setActiveAlerts(prev => [{
      id: `ALT-${Date.now()}`,
      title: "✅ REPLENISHMENT DISPATCH AUTHORIZED",
      message: `District Medical Officer approved Requisition ${reqId}. Tanker unit dispatched.`,
      timestamp: "Just now",
      type: "SUCCESS",
      hospitalId: currentHospital.id
    }, ...prev]);
  };

  const approveRedistribution = (proposalId) => {
    setRedistributions(prev => prev.map(p => p.id === proposalId ? {
      ...p,
      status: "APPROVED_IN_TRANSIT"
    } : p));

    setHospitals(prev => prev.map(h => {
      if (h.id === 'GH-TVM-01') {
        return {
          ...h,
          availableOxygen: h.availableOxygen + 2500,
          estimatedHours: Math.round(((h.availableOxygen + 2500) / h.consumptionRate) * 10) / 10,
          status: "WARNING"
        };
      }
      if (h.id === 'MC-EKM-05') {
        return {
          ...h,
          availableOxygen: h.availableOxygen - 2500,
          estimatedHours: Math.round(((h.availableOxygen - 2500) / h.consumptionRate) * 10) / 10
        };
      }
      return h;
    }));
  };

  const dismissAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  return (
    <OxyTrackContext.Provider
      value={{
        currentUser,
        currentRole,
        setCurrentRole: switchUserRole,
        selectedHospitalId,
        setSelectedHospitalId,
        isEvaluatorMode,
        setIsEvaluatorMode,
        isSimulating,
        setIsSimulating,
        hospitals: scopedHospitals,
        allHospitals: hospitals,
        currentHospital,
        wards,
        sensors,
        cylinders: scopedCylinders,
        anomalies,
        replenishments: scopedReplenishments,
        redistributions,
        activeAlerts,
        login,
        logout,
        addCylinder,
        updateCylinderPressure,
        triggerSimulatedSpike,
        triggerPressureDrop,
        resetTelemetryToNormal,
        updateWardFlow,
        submitReplenishmentRequest,
        approveReplenishmentRequest,
        approveRedistribution,
        dismissAlert
      }}
    >
      {children}
    </OxyTrackContext.Provider>
  );
};

export const useOxyTrack = () => {
  const context = useContext(OxyTrackContext);
  if (!context) {
    throw new Error('useOxyTrack must be used within an OxyTrackProvider');
  }
  return context;
};
