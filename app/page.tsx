'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { 
  Compass, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  BookOpen, 
  Layers, 
  Cpu, 
  Building2, 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  FileCheck,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/overview')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data.kpis);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-slate-900 to-slate-950 text-white pt-20 pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Problem Statement 26134 • National Skill Alignment Framework</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-5xl mx-auto leading-tight sm:leading-tight">
            Transform Labour Market Intelligence into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Industry-Aligned Training</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Use real-time industry demand, skills intelligence, employer feedback and placement outcomes to continuously improve courses, training capacity and career pathways.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard/admin"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              <span>Quick Demo Login</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">All Roles</span>
            </Link>

            <Link
              href="/dashboard/alignment"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/60 text-slate-300 font-semibold text-sm transition"
            >
              <span>Curriculum AI Review</span>
            </Link>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl text-left">
              <span className="text-xs text-slate-400 font-medium">Placement Rate</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{stats?.overallPlacementRate || 76}%</p>
              <span className="text-[11px] text-slate-500">Live outcome tracking</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl text-left">
              <span className="text-xs text-slate-400 font-medium">Courses Evaluated</span>
              <p className="text-2xl font-bold text-blue-400 mt-1">{stats?.totalCourses || 12}</p>
              <span className="text-[11px] text-slate-500">Skill alignment scores</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl text-left">
              <span className="text-xs text-slate-400 font-medium">Districts Tracked</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{stats?.districtsAnalyzed || 5}</p>
              <span className="text-[11px] text-slate-500">Capacity & vacancy mapping</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/60 p-4 rounded-xl text-left">
              <span className="text-xs text-slate-400 font-medium">Curriculum Gaps Flagged</span>
              <p className="text-2xl font-bold text-rose-400 mt-1">{stats?.coursesRequiringReview || 2}</p>
              <span className="text-[11px] text-slate-500">Requiring human review</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Statement 26134 Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">The Critical Challenge</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Traditional Vocational Curricula Fall Behind
            </h3>
            <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              National Problem Statement 26134 highlights the structural mismatch between static educational programs and rapidly transforming industrial requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Curriculum Lag</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Course syllabi rely on historical occupation codes, lagging years behind emerging technologies like EV diagnostics, AI automation, and green energy.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Employer Disconnect</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Industries report severe shortages of job-ready candidates while graduates undergo redundant training or face low placement rates in oversupplied courses.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Capacity & Equipment Gaps</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                District skill plans lack granular evidence to allocate workshop equipment, trainer development programs, and seat intake aligned to local industrial clusters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Continuous Feedback Loop (Solution Architecture) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">Continuous Feedback Loop</h2>
            <h3 className="text-3xl font-extrabold tracking-tight">
              An Evidence-Based Closed-Loop Intelligence System
            </h3>
            <p className="mt-4 text-slate-300 text-sm sm:text-base">
              Connecting Government, Employers, Academia, Trainers, and Students through transparent data-driven alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl relative">
              <span className="text-3xl font-black text-blue-500/40">01</span>
              <h4 className="text-base font-bold text-white mt-2 mb-1">Labour Ingestion</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Real-time job postings, employer quarterly surveys, and industry consultations ingest active skill signals.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl relative">
              <span className="text-3xl font-black text-blue-500/40">02</span>
              <h4 className="text-base font-bold text-white mt-2 mb-1">AI Taxonomy Engine</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deterministic NLP normalizes synonyms, extracts competencies, and maps skill demand scores.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl relative">
              <span className="text-3xl font-black text-blue-500/40">03</span>
              <h4 className="text-base font-bold text-white mt-2 mb-1">Curriculum Alignment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Mathematical comparison flags missing skills and recommends practical hour adjustments under human review.
              </p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 p-6 rounded-xl relative">
              <span className="text-3xl font-black text-blue-500/40">04</span>
              <h4 className="text-base font-bold text-white mt-2 mb-1">District Training Plans</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translates cluster demand into seat capacities, trainer certifications, and equipment procurement plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Comprehensive Features</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Engineered for Every Stakeholder
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Course-to-Industry Alignment</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Evaluates existing curriculum against active job postings. Calculates granular coverage percentage and displays underlying evidence for missing vs covered skills.
                </p>
              </div>
              <Link href="/dashboard/alignment" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                View Alignment Engine <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">AI Curriculum Recommendations</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  AI analyzes employer demand to propose actions (ADD, UPDATE, INCREASE_PRACTICAL). Strictly enforces human approval before curriculum updates take effect.
                </p>
              </div>
              <Link href="/dashboard/alignment" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Review Recommendations <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">District Training Planner</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generates district-specific annual training plans comparing active vacancies with polytechnic capacity, highlighting trainer deficits and equipment requirements.
                </p>
              </div>
              <Link href="/dashboard/district-plans" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                Explore District Planner <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Oversupply & Obsolescence Flags</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Detects courses with low placement rates and excessive capacity relative to demand. Transparently flags &quot;Review Recommended&quot; with audit data.
                </p>
              </div>
              <Link href="/dashboard/admin" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700">
                Admin Capacity Audits <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Student Career Pathways</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students parse their resume to discover structured progression paths (e.g. Electrician → EV Diagnostics), missing skill milestones, and courses.
                </p>
              </div>
              <Link href="/dashboard/student" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700">
                Student Portal <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                  <FileCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">Multi-Format Policy Reports</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Export official Labour Market Reports, District Skill Gaps, and Curriculum Recommendations ready for committee review and executive sign-off.
                </p>
              </div>
              <Link href="/dashboard/reports" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700">
                Export Reports <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Demo Persona Quick Access CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to test the Labour Market Intelligence Platform?
          </h3>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto text-sm">
            Access pre-configured demo dashboards for all five stakeholders with zero setup required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-lg bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-md transition"
            >
              Government Admin Portal
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-500 transition"
            >
              Industry Employer Portal
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-500 transition"
            >
              Training Institute Portal
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-500 transition"
            >
              Trainer Portal
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-500 transition"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
