'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import Link from 'next/link';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Briefcase, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Compass, 
  Award,
  MapPin,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtAnalysis, setDistrictAnalysis] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/overview')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData.data);
          if (resData.data.districts && resData.data.districts.length > 0) {
            loadDistrictAnalysis(resData.data.districts[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const loadDistrictAnalysis = (distId: string) => {
    setSelectedDistrict(distId);
    fetch(`/api/districts/${distId}/analysis`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setDistrictAnalysis(resData.data);
        }
      });
  };

  const kpis = data?.kpis;

  const skillTrendDemo = [
    { skill: 'Python', demand: 92, supply: 64 },
    { skill: 'EV Diagnostics', demand: 88, supply: 35 },
    { skill: 'CNC Programming', demand: 78, supply: 55 },
    { skill: 'BMS Systems', demand: 84, supply: 30 },
    { skill: 'SQL', demand: 80, supply: 72 },
    { skill: 'CAD/CAM', demand: 74, supply: 60 },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Admin Policy Hub
              </span>
              <span className="text-xs text-slate-500">• Problem Statement 26134</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Labour Market Intelligence & Planning Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Evidence-based monitoring across training capacity, industrial vacancy signals, and curriculum health.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard/district-plans"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Compass className="w-4 h-4" />
              <span>Generate District Plan</span>
            </Link>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <FileText className="w-4 h-4" />
              <span>Export Reports</span>
            </Link>
          </div>
        </div>

        {/* 11 KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Employers</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.totalEmployers || 0}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Verified partners</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Training Institutes</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.totalInstitutes || 0}</p>
            <span className="text-[10px] text-blue-600 font-medium">Polytechnics & ITIs</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Active Courses</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.totalCourses || 0}</p>
            <span className="text-[10px] text-slate-500 font-medium">Under curriculum watch</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Active Students</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.activeStudents || 0}</p>
            <span className="text-[10px] text-slate-500 font-medium">Enrolled trainees</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Jobs Analyzed</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.jobsAnalyzed || 0}</p>
            <span className="text-[10px] text-emerald-600 font-medium">Active postings</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Skills Tracked</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.skillsTracked || 0}</p>
            <span className="text-[10px] text-blue-600 font-medium">Normalized taxonomy</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Placement Rate</span>
            <p className="text-xl font-bold text-emerald-600 mt-1">{kpis?.overallPlacementRate || 76}%</p>
            <span className="text-[10px] text-emerald-600 font-medium">State average</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Skill Shortages</span>
            <p className="text-xl font-bold text-rose-600 mt-1">{kpis?.skillShortagesCount || 0}</p>
            <span className="text-[10px] text-rose-600 font-medium">High deficit roles</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Courses Under Review</span>
            <p className="text-xl font-bold text-amber-600 mt-1">{kpis?.coursesRequiringReview || 0}</p>
            <span className="text-[10px] text-amber-600 font-medium">Curriculum updates</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Districts Analyzed</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{kpis?.districtsAnalyzed || 0}</p>
            <span className="text-[10px] text-slate-500 font-medium">Zonal coverage</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Oversupply Flagged</span>
            <p className="text-xl font-bold text-rose-600 mt-1">{kpis?.oversupplyCoursesCount || 0}</p>
            <span className="text-[10px] text-rose-600 font-medium">Excess intake</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-semibold text-slate-500 block">Average Salary</span>
            <p className="text-xl font-bold text-slate-900 mt-1">₹{(kpis?.averagePlacedSalary || 380000).toLocaleString()}</p>
            <span className="text-[10px] text-slate-500 font-medium">Annual placement CTC</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart 1: Skill Demand vs Supply */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Skill Demand vs Training Supply</h3>
                <p className="text-xs text-slate-500">Benchmark comparison of market job demand index vs polytechnic supply index</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                Index 0-100
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillTrendDemo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="demand" name="Market Demand" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="supply" name="Training Capacity" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Sector Growth Distribution */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">High-Growth Industrial Sectors</h3>
                <p className="text-xs text-slate-500">Projected annual sector expansion and active vacancy contribution</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold">
                ASDC / NASSCOM
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.sectors || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={140} />
                  <Tooltip />
                  <Bar dataKey="growthRate" name="Annual Growth %" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* District-Level Demand & Oversupply Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* District Selector & Map-Ready Cards */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Districts Under Analysis</h3>
            <p className="text-xs text-slate-500 mb-4">Select a district to view micro-level vacancy signals and capacity gap</p>

            <div className="space-y-2">
              {data?.districts?.map((dist: any) => (
                <button
                  key={dist.id}
                  onClick={() => loadDistrictAnalysis(dist.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                    selectedDistrict === dist.id
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{dist.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">{dist.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{dist.industrialBase}</p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-600">
                    <span><strong>{dist.jobPostings}</strong> Active Jobs</span>
                    <span><strong>{dist.coursesCount}</strong> Courses</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Drill-Down District Analysis */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            {districtAnalysis ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      District Focus: {districtAnalysis.district.name} ({districtAnalysis.district.state})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Industrial Cluster: {districtAnalysis.district.industrialBase}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/district-plans`}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Full Plan →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500">Active Vacancies</span>
                    <p className="text-lg font-bold text-slate-900">{districtAnalysis.metrics.totalVacancies}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500">Training Capacity</span>
                    <p className="text-lg font-bold text-slate-900">{districtAnalysis.metrics.totalTrainingCapacity} seats</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500">Trainers Available</span>
                    <p className="text-lg font-bold text-slate-900">{districtAnalysis.metrics.trainersCount}</p>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500">Operational Equipment</span>
                    <p className="text-lg font-bold text-slate-900">{districtAnalysis.metrics.operationalEquipmentCount} units</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Top Demanded Roles
                    </h4>
                    <div className="space-y-1.5">
                      {districtAnalysis.highDemandRoles?.slice(0, 4).map((r: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="font-medium text-slate-800">{r.role}</span>
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {r.openings} Openings
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Top Demanded Skills
                    </h4>
                    <div className="space-y-1.5">
                      {districtAnalysis.highDemandSkills?.slice(0, 4).map((s: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-50 border border-slate-100">
                          <span className="font-medium text-slate-800">{s.name}</span>
                          <span className="text-[10px] text-slate-500">{s.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-slate-400">
                Loading district analysis...
              </div>
            )}
          </div>
        </div>

        {/* Oversupply & Obsolescence Evidence Table (Per Section 20 & 21) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Course Oversupply & Obsolescence Watchlist
              </h3>
              <p className="text-xs text-slate-500">
                Data-driven indicators highlighting courses with low placement or intake vastly outpacing local vacancies.
              </p>
            </div>
            <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-semibold border border-amber-200">
              Human Review Required
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3">Sector</th>
                  <th className="py-2.5 px-3">Enrolled Intake</th>
                  <th className="py-2.5 px-3">Annual Vacancies</th>
                  <th className="py-2.5 px-3">Placement Rate</th>
                  <th className="py-2.5 px-3">Status Flag</th>
                  <th className="py-2.5 px-3">Action Recommended</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.capacities?.map((cap: any) => (
                  <tr key={cap.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{cap.district}</td>
                    <td className="py-2.5 px-3 text-slate-700">{cap.sector}</td>
                    <td className="py-2.5 px-3 font-mono">{cap.currentCapacity} seats</td>
                    <td className="py-2.5 px-3 font-mono">{cap.vacancies} vacancies</td>
                    <td className="py-2.5 px-3 font-bold">
                      <span className={cap.placementRate < 50 ? 'text-rose-600' : 'text-emerald-600'}>
                        {cap.placementRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {cap.oversupplyFlag ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                          Potential Oversupply
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Demand Aligned
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {cap.reviewRecommended ? (
                        <span className="text-amber-700 font-medium">Review Recommended • Consider Restructuring</span>
                      ) : (
                        <span className="text-slate-500">Maintain Sanctioned Capacity</span>
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
