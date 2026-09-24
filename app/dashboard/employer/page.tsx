'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { 
  Briefcase, 
  Plus, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building2, 
  Send, 
  Users,
  Search,
  ExternalLink
} from 'lucide-react';

export default function EmployerPortalPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  // Post Job Form State
  const [showPostModal, setShowPostModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('Pune');
  const [description, setDescription] = useState('');
  const [openings, setOpenings] = useState(5);
  const [salaryMin, setSalaryMin] = useState(350000);
  const [salaryMax, setSalaryMax] = useState(500000);
  const [extractedSkills, setExtractedSkills] = useState<any[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [submittingJob, setSubmittingJob] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  // Survey Form State
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [difficultRoles, setDifficultRoles] = useState('EV Diagnostics Technician, Senior CNC Programmer');
  const [emergingTech, setEmergingTech] = useState('CAN Bus Telematics, Lithium Battery Cell Balancing');
  const [productivityFeedback, setProductivityFeedback] = useState('Graduates need more hours on practical oscilloscopes.');
  const [submittingSurvey, setSubmittingSurvey] = useState(false);
  const [surveySuccess, setSurveySuccess] = useState(false);

  // CSV Import State
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importingCsv, setImportingCsv] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, distRes] = await Promise.all([
        fetch('/api/jobs').then((r) => r.json()),
        fetch('/api/districts').then((r) => r.json()),
      ]);

      if (jobsRes.success) setJobs(jobsRes.data);
      if (distRes.success && distRes.data.length > 0) {
        setDistricts(distRes.data[0].districts || []);
      }
    } finally {
      setLoading(false);
    }
  };

  // AI Skill Extraction triggered on description change or manual button
  const handleAIExtract = async () => {
    if (!description || description.length < 5) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/jobs/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: description }),
      });
      const data = await res.json();
      if (data.success && data.data.skills) {
        setExtractedSkills(data.data.skills);
        if (!jobTitle && data.data.role) {
          setJobTitle(data.data.role);
        }
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingJob(true);
    setPostError(null);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          location,
          description,
          openings: Number(openings),
          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),
          skills: extractedSkills.map((s) => ({
            name: s.name,
            proficiency: s.proficiency || 'intermediate',
            importance: s.importance || 'required',
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to post job');
      }

      setShowPostModal(false);
      setJobTitle('');
      setDescription('');
      setExtractedSkills([]);
      loadData();
    } catch (err: any) {
      setPostError(err.message);
    } finally {
      setSubmittingJob(false);
    }
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSurvey(true);
    try {
      const res = await fetch('/api/employer-surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficultToHireRoles: difficultRoles,
          emergingTechNeeds: emergingTech,
          productivityFeedback,
          surveyYear: 2026,
          quarter: 3,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSurveySuccess(true);
        setTimeout(() => {
          setShowSurveyModal(false);
          setSurveySuccess(false);
        }, 1500);
      }
    } finally {
      setSubmittingSurvey(false);
    }
  };

  const handleCsvImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportingCsv(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/jobs/import-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvContent }),
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(data.data);
        loadData();
      } else {
        setImportResult({ error: data.error?.message || 'Import failed' });
      }
    } finally {
      setImportingCsv(false);
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
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Industry Portal
              </span>
              <span className="text-xs text-slate-500">• Apex Technologies Ltd</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Employer Hiring & Skill Demand Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Publish job requisitions with automatic AI skill extraction, import bulk data, and guide curriculum alignment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post Job with AI Extraction</span>
            </button>

            <button
              onClick={() => setShowCsvModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Upload className="w-4 h-4" />
              <span>Import Job CSV</span>
            </button>

            <button
              onClick={() => setShowSurveyModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
            >
              <FileText className="w-4 h-4" />
              <span>Submit Skill Survey</span>
            </button>
          </div>
        </div>

        {/* Live Active Postings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Job Postings</h3>
              <p className="text-xs text-slate-500">Demanded competencies mapped to the national skill taxonomy</p>
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
              {jobs.length} Active Positions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Job Title</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Extracted Competencies</th>
                  <th className="py-3 px-4">Openings</th>
                  <th className="py-3 px-4">Salary Range</th>
                  <th className="py-3 px-4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{job.title}</td>
                    <td className="py-3 px-4 text-slate-600">{job.employer?.companyName || 'Apex Tech'}</td>
                    <td className="py-3 px-4 text-slate-600">{job.location}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {job.jobSkills?.map((js: any) => (
                          <span
                            key={js.id}
                            className="bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          >
                            {js.skill.name} ({js.proficiency})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">{job.openings}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">
                      ₹{job.salaryMin?.toLocaleString()} - ₹{job.salaryMax?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                        {job.source}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Post Job Modal with AI Extraction Preview */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Post Job Requisition</h3>
                    <p className="text-xs text-slate-500">AI automatically parses roles, skills, and proficiency levels</p>
                  </div>
                </div>
                <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                {postError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                    {postError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Job Description (Paste raw job description here)
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Seeking an EV technician skilled in Battery Management Systems, Python telemetry, and high-voltage CAN bus diagnostics..."
                    className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400">Type or paste description to extract skills</span>
                    <button
                      type="button"
                      onClick={handleAIExtract}
                      disabled={isExtracting}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {isExtracting ? 'Analyzing with AI...' : 'Extract Skills with AI'}
                    </button>
                  </div>
                </div>

                {/* AI Extracted Skills Display */}
                {extractedSkills.length > 0 && (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-2">
                      AI Extracted Competencies ({extractedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {extractedSkills.map((s, idx) => (
                        <span key={idx} className="bg-white text-blue-700 border border-blue-200 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({s.proficiency})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title / Role</label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. EV Powertrain Diagnostics Engineer"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location / District</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Openings</label>
                    <input
                      type="number"
                      min={1}
                      value={openings}
                      onChange={(e) => setOpenings(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Min Salary (₹)</label>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Max Salary (₹)</label>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingJob}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    {submittingJob ? 'Publishing...' : 'Publish Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CSV Ingestion Modal */}
        {showCsvModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Ingest Jobs via CSV</h3>
                <button onClick={() => setShowCsvModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCsvImport} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paste CSV Data (Columns: job_title, location, description, skills, salary_min, salary_max)
                  </label>
                  <textarea
                    rows={6}
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                    placeholder={`job_title,location,description,skills,salary_min,salary_max
Solar PV Assistant,Pune,Maintain rooftop solar plants,Solar PV Installation,260000,380000
Cobot Automation Technician,Pune,Program industrial cobots on shop floor,PLC Programming,320000,450000`}
                    className="w-full p-3 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                {importResult && (
                  <div className={`p-3 rounded-lg text-xs ${importResult.error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {importResult.error ? importResult.error : importResult.message}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCsvModal(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={importingCsv || !csvContent}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                  >
                    {importingCsv ? 'Ingesting...' : 'Ingest & Process CSV'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Employer Survey Modal */}
        {showSurveyModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Quarterly Employer Skill Survey</h3>
                <button onClick={() => setShowSurveyModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {surveySuccess ? (
                <div className="p-6 text-center text-emerald-600">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-bold text-sm">Survey Submitted Successfully!</p>
                  <p className="text-xs text-slate-500 mt-1">Your feedback is now integrated into curriculum analytics.</p>
                </div>
              ) : (
                <form onSubmit={handleSurveySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Difficult-to-Hire Roles
                    </label>
                    <input
                      type="text"
                      required
                      value={difficultRoles}
                      onChange={(e) => setDifficultRoles(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Future Emerging Technology Needs (Next 12-24 Months)
                    </label>
                    <input
                      type="text"
                      required
                      value={emergingTech}
                      onChange={(e) => setEmergingTech(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Productivity Feedback & Training Needs
                    </label>
                    <textarea
                      rows={3}
                      value={productivityFeedback}
                      onChange={(e) => setProductivityFeedback(e.target.value)}
                      className="w-full p-3 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSurveyModal(false)}
                      className="px-4 py-2 border border-slate-300 rounded-lg text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingSurvey}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                    >
                      {submittingSurvey ? 'Submitting...' : 'Submit Survey'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
