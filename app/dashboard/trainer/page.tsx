'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { 
  UserCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Award, 
  Cpu, 
  Wrench, 
  BookOpen, 
  ChevronRight 
} from 'lucide-react';

export default function TrainerPortalPage() {
  const [trainerGaps, setTrainerGaps] = useState<any[]>([]);
  const [equipmentGaps, setEquipmentGaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/trainers/gaps').then((r) => r.json()),
      fetch('/api/equipment/gaps').then((r) => r.json()),
    ]).then(([trainersRes, equipRes]) => {
      if (trainersRes.success) setTrainerGaps(trainersRes.data.trainerGaps || []);
      if (equipRes.success) setEquipmentGaps(equipRes.data || []);
      setLoading(false);
    });
  }, []);

  const currentTrainer = trainerGaps[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                Section 22 & 23
              </span>
              <span className="text-xs text-slate-500">• Trainer Upskilling & Lab Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Trainer Capacity & Equipment Planning
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Identifies instructor skill deficits against high-demand industry competencies and tracks workshop equipment adequacy.
            </p>
          </div>
        </div>

        {/* Top: Current Trainer Profile & Gap Analysis */}
        {currentTrainer && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Trainer Profile */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lead Instructor Profile
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{currentTrainer.fullName}</h3>
                <p className="text-xs text-slate-500 mb-4">{currentTrainer.qualification} • {currentTrainer.experienceYears} Years Exp</p>

                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-2">Verified Instruction Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTrainer.currentSkills.map((sk: string, i: number) => (
                      <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{sk}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-mono">
                  Affiliated: {currentTrainer.organization}
                </span>
              </div>
            </div>

            {/* Identified Skill Gaps & Recommended Upskilling */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    High-Demand Industry Skill Deficits ({currentTrainer.skillGaps.length})
                  </h3>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded">
                  Upskilling Required
                </span>
              </div>

              <div className="space-y-3">
                {currentTrainer.recommendedActions?.map((rec: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rec.skill}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-medium">
                          {rec.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Recommended Workshop: <strong>{rec.recommendedWorkshop}</strong>
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {rec.duration} • Certified by {rec.provider}
                      </span>
                    </div>

                    <div className="flex-shrink-0">
                      <button
                        onClick={() => alert(`Nomination submitted for ${rec.recommendedWorkshop}`)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                      >
                        Nominate for Training
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 23: Equipment Planning & Workstation Deficit */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Course Equipment Planning & Lab Deficit Tracker
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluates physical workshop workstations against prescribed regulatory standards (1 station per 4 students).
              </p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
              Standard: 1 Station : 4 Trainees
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4">Enrolled Capacity</th>
                  <th className="py-3 px-4">Required Stations</th>
                  <th className="py-3 px-4">Operational Units</th>
                  <th className="py-3 px-4">Workstation Deficit</th>
                  <th className="py-3 px-4">Adequacy Rate</th>
                  <th className="py-3 px-4">Procurement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {equipmentGaps.map((eq: any) => (
                  <tr key={eq.courseId} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {eq.courseTitle}
                      <span className="block text-[10px] text-slate-400 font-mono">{eq.courseCode}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-mono">{eq.enrolledCapacity} seats</td>
                    <td className="py-3 px-4 text-slate-700 font-mono">{eq.requiredUnits} units</td>
                    <td className="py-3 px-4 text-slate-700 font-mono font-bold">{eq.operationalUnits} units</td>
                    <td className="py-3 px-4 font-bold">
                      {eq.equipmentGap > 0 ? (
                        <span className="text-rose-600">-{eq.equipmentGap} units missing</span>
                      ) : (
                        <span className="text-emerald-600">0 (Fully Equipped)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${eq.adequacyRatePercent >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${eq.adequacyRatePercent}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-800">{eq.adequacyRatePercent}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {eq.status === 'CRITICAL_DEFICIT' ? (
                        <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Urgent Procurement Flagged
                        </span>
                      ) : eq.status === 'MODERATE_DEFICIT' ? (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Expansion In Progress
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Lab Standard Met
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
