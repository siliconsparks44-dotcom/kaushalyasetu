'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  BarChart3, 
  Building2, 
  GraduationCap, 
  Compass, 
  Layers 
} from 'lucide-react';

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<string>('labour-market');
  const [data, setData] = useState<any>(null);
  const [skillsDemand, setSkillsDemand] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/overview').then((r) => r.json()),
      fetch('/api/skills/demand').then((r) => r.json()),
    ]).then(([overviewRes, demandRes]) => {
      if (overviewRes.success) setData(overviewRes.data);
      if (demandRes.success) setSkillsDemand(demandRes.data || []);
      setLoading(false);
    });
  }, []);

  const handleExportCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [keys.join(','), ...rows.map((r) => keys.map((k) => `"${r[k] || ''}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                Section 40
              </span>
              <span className="text-xs text-slate-500">• Official Policy & Governance Documentation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Labour Market Intelligence & Institutional Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Export validated statistical reports for District Skill Committees, AICTE, and State Vocational Boards.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official PDF</span>
            </button>
          </div>
        </div>

        {/* Report Tabs (No Print) */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3 no-print">
          {[
            { id: 'labour-market', name: '1. Labour Market Overview' },
            { id: 'skill-demand', name: '2. Skill Demand Index' },
            { id: 'district-skill', name: '3. District Training Capacities' },
            { id: 'course-alignment', name: '4. Curriculum Alignment' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeReport === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Report Content Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 block">
                GOVERNMENT OF MAHARASHTRA • DIRECTORATE OF VOCATIONAL EDUCATION & TRAINING
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                Labour Market Intelligence & Curriculum Audit Report (2026-27)
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Document Ref: KAUSHALYA-SETU/26134/REP-042 • Generated: {new Date().toLocaleDateString('en-GB')}
              </span>
            </div>

            <div className="text-right sm:block hidden">
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-1 rounded">
                DEMO BENCHMARK DATASET
              </span>
            </div>
          </div>

          {/* Tab 1: Labour Market Overview */}
          {activeReport === 'labour-market' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Executive Labour Market Statistics
                </h3>
                <button
                  onClick={() => handleExportCSV('Labour_Market_Overview', [data?.kpis || {}])}
                  className="no-print inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Active Industry Jobs</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">{data?.kpis?.jobsAnalyzed || 0}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Overall Placement Rate</span>
                  <p className="text-xl font-bold text-emerald-600 mt-1">{data?.kpis?.overallPlacementRate || 76}%</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Courses Requiring Review</span>
                  <p className="text-xl font-bold text-rose-600 mt-1">{data?.kpis?.coursesRequiringReview || 0}</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] text-slate-500 block">Average Placement Salary</span>
                  <p className="text-xl font-bold text-blue-600 mt-1">₹{(data?.kpis?.averagePlacedSalary || 380000).toLocaleString()}</p>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Key Sector Growth Profiles
              </h4>
              <table className="w-full text-left text-xs mb-6">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Sector Name</th>
                    <th className="py-2.5 px-3">Annual Projected Growth</th>
                    <th className="py-2.5 px-3">Active Job Vacancies</th>
                    <th className="py-2.5 px-3">Courses Aligned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.sectors?.map((s: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{s.growthRate}%</td>
                      <td className="py-2.5 px-3 font-mono">{s.activeJobs}</td>
                      <td className="py-2.5 px-3 font-mono">{s.courses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Skill Demand Index */}
          {activeReport === 'skill-demand' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Industrial Skill Demand & Shortage Audit
                </h3>
                <button
                  onClick={() => handleExportCSV('Skill_Demand_Index', skillsDemand)}
                  className="no-print inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              <table className="w-full text-left text-xs mb-6">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Skill Competency</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Active Openings</th>
                    <th className="py-2.5 px-3">Demand Score (0-100)</th>
                    <th className="py-2.5 px-3">Market Status</th>
                    <th className="py-2.5 px-3">Annual Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {skillsDemand.map((sk: any) => (
                    <tr key={sk.skillId}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{sk.skillName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{sk.category}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{sk.totalOpenings}</td>
                      <td className="py-2.5 px-3 font-mono">{sk.demandScore}</td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sk.marketStatus === 'SEVERE_SHORTAGE'
                            ? 'bg-rose-100 text-rose-800'
                            : sk.marketStatus === 'MODERATE_SHORTAGE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sk.marketStatus.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-emerald-700 font-semibold">+{sk.growthRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: District Training Capacities */}
          {activeReport === 'district-skill' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  District Training Capacity vs Vacancy Balance Sheet
                </h3>
                <button
                  onClick={() => handleExportCSV('District_Capacities', data?.capacities || [])}
                  className="no-print inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              </div>

              <table className="w-full text-left text-xs mb-6">
                <thead className="bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">District</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Capacity Intake</th>
                    <th className="py-2.5 px-3">Annual Vacancies</th>
                    <th className="py-2.5 px-3">Placement Rate</th>
                    <th className="py-2.5 px-3">Governance Directives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data?.capacities?.map((cap: any) => (
                    <tr key={cap.id}>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{cap.district}</td>
                      <td className="py-2.5 px-3 text-slate-700">{cap.sector}</td>
                      <td className="py-2.5 px-3 font-mono">{cap.currentCapacity} seats</td>
                      <td className="py-2.5 px-3 font-mono">{cap.vacancies} vacancies</td>
                      <td className="py-2.5 px-3 font-bold">{cap.placementRate}%</td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {cap.oversupplyFlag ? (
                          <span className="text-rose-700 font-semibold">Oversupply Flagged • Restructure Batch</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold">Demand Aligned • Sanction Expanded Capacity</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Official Sign-off Box */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">Verified by Academic & Technical Directorate:</p>
              <div className="mt-6 border-b border-slate-300 w-48"></div>
              <p className="mt-1 text-[11px] text-slate-500">Dr. Ramesh Verma (Director of Vocational Education)</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-800">Authorized District Skill Council Seal:</p>
              <div className="mt-6 border-b border-slate-300 w-48 ml-auto"></div>
              <p className="mt-1 text-[11px] text-slate-500">State Skill Development Mission (SSDM)</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
