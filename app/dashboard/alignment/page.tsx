'use client';

import { Suspense } from "react";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Check, 
  X, 
  Clock, 
  Info,
  RefreshCw,
  Award
} from 'lucide-react';

function CourseAlignmentContent() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get('courseId');

  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [alignmentData, setAlignmentData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAlignment, setLoadingAlignment] = useState(false);
  const [generatingRecs, setGeneratingRecs] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/courses')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setCourses(data.data);
          const targetId = initialCourseId || data.data[0].id;
          setSelectedCourseId(targetId);
          loadAlignmentAndRecs(targetId);
        }
      });
  }, [initialCourseId]);

  const loadAlignmentAndRecs = async (courseId: string) => {
    setLoadingAlignment(true);
    try {
      const [alignRes, recRes] = await Promise.all([
        fetch(`/api/courses/${courseId}/alignment`).then((r) => r.json()),
        fetch(`/api/curriculum/recommendations?courseId=${courseId}`).then((r) => r.json()),
      ]);

      if (alignRes.success) setAlignmentData(alignRes.data);
      if (recRes.success) setRecommendations(recRes.data);
    } finally {
      setLoadingAlignment(false);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!selectedCourseId) return;
    setGeneratingRecs(true);
    setActionSuccess(null);
    try {
      const res = await fetch(`/api/courses/${selectedCourseId}/recommendations`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess('New AI curriculum recommendations generated and awaiting human review.');
        loadAlignmentAndRecs(selectedCourseId);
      }
    } finally {
      setGeneratingRecs(false);
    }
  };

  const handleReviewDecision = async (recId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/curriculum/recommendations/${recId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          reviewNotes: status === 'APPROVED' ? 'Approved by Academic Review Committee' : 'Rejected after faculty evaluation',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccess(`Recommendation ${status.toLowerCase()} successfully.`);
        loadAlignmentAndRecs(selectedCourseId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                Core Feature 18 & 19
              </span>
              <span className="text-xs text-slate-500">• Human-in-the-Loop Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Course-to-Industry Alignment & AI Recommendation Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Mathematically compares course competencies against active job postings, identifies skill gaps, and recommends governed curriculum updates.
            </p>
          </div>

          {/* Course Selector Dropdown */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-600">Select Course:</label>
            <select
              value={selectedCourseId}
              onChange={(e) => {
                setSelectedCourseId(e.target.value);
                loadAlignmentAndRecs(e.target.value);
              }}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white shadow-sm font-semibold focus:ring-2 focus:ring-blue-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-600">✕</button>
          </div>
        )}

        {/* Alignment Score & Granular Competencies */}
        {alignmentData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Alignment Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Course Alignment Score
                </span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className={`text-5xl font-black ${
                    alignmentData.alignmentPercentage >= 75
                      ? 'text-emerald-600'
                      : alignmentData.alignmentPercentage >= 50
                      ? 'text-amber-600'
                      : 'text-rose-600'
                  }`}>
                    {alignmentData.alignmentPercentage}%
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Coverage of Top Market Demands</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 mt-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      alignmentData.alignmentPercentage >= 75
                        ? 'bg-emerald-500'
                        : alignmentData.alignmentPercentage >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${alignmentData.alignmentPercentage}%` }}
                  ></div>
                </div>

                <div className="mt-6 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Evaluated Industry Skills:</span>
                    <span className="font-bold text-slate-800">{alignmentData.totalIndustrySkillsEvaluated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Covered Competencies:</span>
                    <span className="font-bold text-emerald-600">{alignmentData.coveredSkillsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Missing Competencies:</span>
                    <span className="font-bold text-rose-600">{alignmentData.missingSkillsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sector Vacancies:</span>
                    <span className="font-bold text-blue-600">{alignmentData.activeVacanciesInSector}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={handleGenerateRecommendations}
                  disabled={generatingRecs}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Sparkles className="w-4 h-4" />
                  {generatingRecs ? 'Running AI Demand Analysis...' : 'Re-Run AI Recommendations'}
                </button>
              </div>
            </div>

            {/* Covered Competencies Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Covered in Curriculum ({alignmentData.coveredSkills.length})
                </h3>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {alignmentData.coveredSkills.map((sk: any) => (
                  <div key={sk.id} className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{sk.name}</span>
                      <span className="text-[10px] text-slate-500">Demanded in {sk.count} active vacancies</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Covered
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Industry Skills Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Missing Industry Demands ({alignmentData.missingSkills.length})
                </h3>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {alignmentData.missingSkills.map((sk: any) => (
                  <div key={sk.id} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{sk.name}</span>
                      <span className="text-[10px] text-rose-600 font-medium">Demanded in {sk.count} active jobs</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                      Gap Flagged
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations with Human-in-the-Loop Approval (Section 19 & 49) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  AI Curriculum Revision Recommendations
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Each recommendation displays supporting vacancy data, confidence, and requires human sign-off before adoption.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Human Approval Enforced</span>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No recommendations generated yet for this course. Click &quot;Re-Run AI Recommendations&quot; above.
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec) => {
                let support = null;
                try {
                  if (rec.supportingData) support = JSON.parse(rec.supportingData);
                } catch (e) {}

                return (
                  <div
                    key={rec.id}
                    className={`p-4 rounded-xl border transition ${
                      rec.status === 'APPROVED'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : rec.status === 'REJECTED'
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            rec.actionType === 'ADD'
                              ? 'bg-blue-100 text-blue-800'
                              : rec.actionType === 'INCREASE_PRACTICAL'
                              ? 'bg-purple-100 text-purple-800'
                              : rec.actionType === 'UPDATE'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            ACTION: {rec.actionType}
                          </span>

                          <span className="text-xs font-bold text-slate-900">
                            {rec.skill?.name || rec.affectedModule}
                          </span>

                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            Confidence: {Math.round(rec.confidence * 100)}%
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                          {rec.reason}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                          <span>Target Module: <strong className="text-slate-700">{rec.affectedModule}</strong></span>
                          <span>Source: <strong className="text-slate-700">{rec.source}</strong></span>
                          {rec.reviewedBy && (
                            <span>Reviewed by: <strong className="text-slate-800">{rec.reviewedBy}</strong></span>
                          )}
                        </div>
                      </div>

                      {/* Human Action Controls */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {rec.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => handleReviewDecision(rec.id, 'APPROVED')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Update Curriculum</span>
                            </button>

                            <button
                              onClick={() => handleReviewDecision(rec.id, 'REJECTED')}
                              className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : rec.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            <Check className="w-3.5 h-3.5" />
                            Approved & Applied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                            Rejected by Faculty
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


export default function CourseAlignmentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-slate-500">Loading alignment hub...</div>}>
      <CourseAlignmentContent />
    </Suspense>
  );
}
