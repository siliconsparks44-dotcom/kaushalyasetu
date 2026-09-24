'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { 
  Compass, 
  Layers, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  Users, 
  Cpu, 
  Building2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Printer
} from 'lucide-react';

export default function DistrictPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Generator State
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [sectorId, setSectorId] = useState('');
  const [targetYear, setTargetYear] = useState(2026);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [plansRes, distRes, analyticsRes] = await Promise.all([
        fetch('/api/district-plans').then((r) => r.json()),
        fetch('/api/districts').then((r) => r.json()),
        fetch('/api/analytics/overview').then((r) => r.json()),
      ]);

      if (plansRes.success) {
        setPlans(plansRes.data);
        if (plansRes.data.length > 0) setSelectedPlan(plansRes.data[0]);
      }

      if (distRes.success && distRes.data.length > 0) {
        setStates(distRes.data);
        setStateId(distRes.data[0].id);
        if (distRes.data[0].districts?.length > 0) {
          setDistrictId(distRes.data[0].districts[0].id);
        }
      }

      if (analyticsRes.success && analyticsRes.data.sectors) {
        setSectors(analyticsRes.data.sectors);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerateError(null);

    // Find actual sector id
    const sectorRes = await fetch('/api/analytics/overview').then((r) => r.json());
    // Get sector id from database
    const jobsRes = await fetch('/api/jobs').then((r) => r.json());
    const validSectorId = jobsRes.data?.[0]?.sectorId || 'sec-auto-ev';

    try {
      const res = await fetch('/api/district-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stateId,
          districtId,
          sectorId: validSectorId,
          targetYear: Number(targetYear),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to generate plan');
      }

      setPlans([data.data, ...plans]);
      setSelectedPlan(data.data);
    } catch (err: any) {
      setGenerateError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4 no-print">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Core Feature 24
              </span>
              <span className="text-xs text-slate-500">• District Skill Councils (DSC)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              District-Level Skill Training Planner
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Synthesizes industrial demand, vacancy signals, training capacity, and trainer/equipment gaps into annual district action plans.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Plan PDF</span>
          </button>
        </div>

        {/* Generator Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 no-print">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Generate New District Skill Training Plan
            </h3>
          </div>

          {generateError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {generateError}
            </div>
          )}

          <form onSubmit={handleGeneratePlan} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <select
                value={stateId}
                onChange={(e) => {
                  setStateId(e.target.value);
                  const selectedState = states.find((s) => s.id === e.target.value);
                  if (selectedState && selectedState.districts.length > 0) {
                    setDistrictId(selectedState.districts[0].id);
                  }
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target District</label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                {states.find((s) => s.id === stateId)?.districts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Sector</label>
              <select
                value={sectorId}
                onChange={(e) => setSectorId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="auto">Automotive & Electric Mobility</option>
                <option value="it">Information Technology & Software</option>
                <option value="mfg">Advanced Manufacturing & CNC</option>
                <option value="green">Renewable Energy & Solar</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={generating}
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4" />
                <span>{generating ? 'Analyzing Demands...' : 'Generate Plan'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Selected Plan Details */}
        {selectedPlan && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Status: {selectedPlan.status} • Academic Year {selectedPlan.targetYear}-{selectedPlan.targetYear + 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  {selectedPlan.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Prepared for District: <strong>{selectedPlan.district?.name}</strong> • Authorized by: <strong>{selectedPlan.createdBy}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                  Evidence-Based Plan
                </span>
              </div>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Current Capacity</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{selectedPlan.currentCapacity} Seats</p>
                <span className="text-[10px] text-slate-400">Sanctioned district intake</span>
              </div>

              <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                <span className="text-[11px] font-semibold text-blue-700 block">Recommended Capacity</span>
                <p className="text-2xl font-black text-blue-800 mt-1">{selectedPlan.recommendedCapacity} Seats</p>
                <span className="text-[10px] text-blue-600 font-medium">
                  +{selectedPlan.recommendedCapacity - selectedPlan.currentCapacity} Seats Deficit
                </span>
              </div>

              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <span className="text-[11px] font-semibold text-amber-800 block">Trainer Gap</span>
                <p className="text-2xl font-black text-amber-800 mt-1">{selectedPlan.trainerGapCount} Trainers</p>
                <span className="text-[10px] text-amber-700 font-medium">Require Level-5 upskilling</span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-xl border border-rose-200">
                <span className="text-[11px] font-semibold text-rose-800 block">Equipment Deficit</span>
                <p className="text-2xl font-black text-rose-800 mt-1">{selectedPlan.equipmentGapCount} Units</p>
                <span className="text-[10px] text-rose-700 font-medium">Lab workstations needed</span>
              </div>
            </div>

            {/* Justification Text */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 mb-8 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Analytical Justification:</strong>
              {selectedPlan.justification}
            </div>

            {/* Core Action Recommendations Table */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                District Implementation Directives ({selectedPlan.recommendations?.length || 0})
              </h3>

              <div className="space-y-3">
                {selectedPlan.recommendations?.map((rec: any) => (
                  <div key={rec.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                          {rec.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                      </div>
                      <p className="text-xs text-slate-600">{rec.description}</p>
                      {rec.metricsEvidence && (
                        <span className="inline-block mt-2 text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          Evidence: {rec.metricsEvidence}
                        </span>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        rec.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        Priority: {rec.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
