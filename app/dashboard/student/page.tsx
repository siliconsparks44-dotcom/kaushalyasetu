'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  Award, 
  Compass, 
  Layers, 
  Check, 
  ChevronRight,
  BookOpen
} from 'lucide-react';

export default function StudentPortalPage() {
  const [profile, setProfile] = useState<any>(null);
  const [pathwaysData, setPathwaysData] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Resume Parsing State
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<any>(null);

  // Assessment Quiz State
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<any>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profRes, pathRes, assessRes] = await Promise.all([
        fetch('/api/student/profile').then((r) => r.json()),
        fetch('/api/student/career-pathways').then((r) => r.json()),
        fetch('/api/student/assessments').then((r) => r.json()),
      ]);

      if (profRes.success) setProfile(profRes.data);
      if (pathRes.success) setPathwaysData(pathRes.data);
      if (assessRes.success) setAssessments(assessRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleParseResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || resumeText.length < 20) return;
    setIsParsing(true);
    setParseResult(null);

    try {
      const res = await fetch('/api/student/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (data.success) {
        setParseResult(data.data);
        loadData();
      }
    } finally {
      setIsParsing(false);
    }
  };

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmittingQuiz(true);
    try {
      const res = await fetch('/api/student/assessments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: activeQuiz.id,
          answers: selectedAnswers,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuizResult(data.data);
        loadData();
      }
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const studentSkills: string[] = profile?.extractedSkills
    ? JSON.parse(profile.extractedSkills)
    : ['Python', 'SQL', 'CAD/CAM Design'];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                Candidate Career Hub
              </span>
              <span className="text-xs text-slate-500">• Section 25 & 26</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Student Skills, Resume Intelligence & Pathways
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Profile: <strong>{profile?.fullName || 'Kavita Patil'}</strong> ({profile?.educationLevel || 'Diploma Trainee'})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{studentSkills.length} Verified Competencies</span>
            </span>
          </div>
        </div>

        {/* Top Grid: Profile Skills & AI Resume Ingestion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Skills Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Your Competency Portfolio</h3>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Skills extracted from your credentials and validated assessments.
              </p>

              <div className="flex flex-wrap gap-2">
                {studentSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400">
                Take skill assessments below to verify additional industry competencies.
              </p>
            </div>
          </div>

          {/* AI Resume Parser (Section 25) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Resume Parser & Skill Extractor</h3>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">
                Automatic Profile Update
              </span>
            </div>

            <form onSubmit={handleParseResume} className="space-y-3">
              <textarea
                rows={3}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content, project summaries, or technical certifications here (e.g. Diploma in Electrical Engineering, experienced in Python telemetry, Multimeter testing, and basic CAD/CAM design)..."
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  NLP engine maps your credentials into canonical industry competencies
                </span>
                <button
                  type="submit"
                  disabled={isParsing || resumeText.length < 20}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isParsing ? 'Analyzing Resume...' : 'Parse Resume with AI'}</span>
                </button>
              </div>
            </form>

            {parseResult && (
              <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Resume Successfully Analyzed: Found {parseResult.skills.length} Competencies</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {parseResult.skills.map((s: any, idx: number) => (
                    <span key={idx} className="bg-white border border-indigo-200 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                      {s.name} ({s.proficiency})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Career Pathway Progression Engine (Section 26) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Industry Career Pathways & Skill Milestone Tracker
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target high-growth career progressions based on your current skill profile and local industry demand.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {pathwaysData?.pathways?.map((pathway: any) => (
              <div key={pathway.pathwayId} className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {pathway.sector}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{pathway.title}</h4>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    {pathway.growthRate}
                  </span>
                </div>

                {/* Pathway Stages Visualizer */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {pathway.stages.map((stage: any, sIdx: number) => (
                    <div
                      key={sIdx}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            Stage {stage.stage} • {stage.duration}
                          </span>
                          <span className={`text-xs font-bold ${
                            stage.readinessPercent >= 75 ? 'text-emerald-600' : 'text-amber-600'
                          }`}>
                            {stage.readinessPercent}% Ready
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-900 mb-3">{stage.role}</h5>

                        {/* Owned Skills in Stage */}
                        <div className="mb-2">
                          <span className="text-[10px] font-semibold text-emerald-700 block mb-1">Acquired:</span>
                          <div className="flex flex-wrap gap-1">
                            {stage.ownedSkills.length > 0 ? (
                              stage.ownedSkills.map((sk: string, i: number) => (
                                <span key={i} className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-medium">
                                  ✓ {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">None yet</span>
                            )}
                          </div>
                        </div>

                        {/* Missing Skills in Stage */}
                        <div>
                          <span className="text-[10px] font-semibold text-rose-600 block mb-1">To Acquire:</span>
                          <div className="flex flex-wrap gap-1">
                            {stage.missingSkills.length > 0 ? (
                              stage.missingSkills.map((sk: string, i: number) => (
                                <span key={i} className="text-[9px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-medium">
                                  + {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-emerald-600 font-medium">All acquired!</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {stage.missingSkills.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-1">
                            <span>Recommended Course Available</span>
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Assessments Module */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Available Skill Assessments</h3>
              <p className="text-xs text-slate-500">Take verified competency quizzes to validate your technical proficiency.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assessments.map((quiz) => (
              <div key={quiz.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {quiz.skill?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {quiz.durationMinutes} Mins • Pass {quiz.passingScore}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{quiz.title}</h4>
                  <p className="text-xs text-slate-600 mb-3">{quiz.description}</p>
                </div>

                <button
                  onClick={() => {
                    setActiveQuiz(quiz);
                    setQuizResult(null);
                    setSelectedAnswers({});
                  }}
                  className="mt-2 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
                >
                  Start Assessment Quiz ({quiz.questions?.length} Questions)
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Quiz Modal */}
          {activeQuiz && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-bold text-slate-900">{activeQuiz.title}</h3>
                  <button onClick={() => setActiveQuiz(null)} className="text-slate-400 hover:text-slate-600">✕</button>
                </div>

                {quizResult ? (
                  <div className="p-6 text-center">
                    {quizResult.passed ? (
                      <div className="text-emerald-600">
                        <CheckCircle2 className="w-14 h-14 mx-auto mb-2 text-emerald-500" />
                        <h4 className="text-lg font-bold">Assessment Passed!</h4>
                        <p className="text-sm font-semibold mt-1">Score: {quizResult.score}%</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Skill <strong>{quizResult.skillEarned}</strong> has been added to your verified portfolio!
                        </p>
                      </div>
                    ) : (
                      <div className="text-rose-600">
                        <AlertCircle className="w-14 h-14 mx-auto mb-2 text-rose-500" />
                        <h4 className="text-lg font-bold">Passing Score Not Met</h4>
                        <p className="text-sm font-semibold mt-1">Score: {quizResult.score}% (Required: {quizResult.passingScore}%)</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Review recommended courses to strengthen your competency and re-attempt.
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveQuiz(null)}
                      className="mt-6 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold"
                    >
                      Close Assessment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeQuiz.questions?.map((q: any, qIdx: number) => {
                      const options: string[] = JSON.parse(q.optionsJson || '[]');

                      return (
                        <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <p className="text-xs font-bold text-slate-900 mb-3">
                            {qIdx + 1}. {q.questionText}
                          </p>

                          <div className="space-y-2">
                            {options.map((opt, optIdx) => (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleQuizAnswer(q.id, optIdx)}
                                className={`w-full text-left p-2.5 rounded-lg border text-xs transition ${
                                  selectedAnswers[q.id] === optIdx
                                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold shadow-sm'
                                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setActiveQuiz(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submittingQuiz}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                      >
                        {submittingQuiz ? 'Evaluating...' : 'Submit Answers'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
