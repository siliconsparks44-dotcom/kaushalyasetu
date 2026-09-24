import React from 'react';
import Link from 'next/link';
import { Compass, ShieldCheck, Database, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>KaushalyaSetu Platform</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Labour Market Intelligence & Curriculum Alignment Platform addressing National Problem Statement 26134.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Evidence-based, Human-in-the-Loop Governance</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Core Modules</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/dashboard/admin" className="hover:text-white">Admin Policy Hub</Link></li>
              <li><Link href="/dashboard/employer" className="hover:text-white">Industry Job Ingestion</Link></li>
              <li><Link href="/dashboard/alignment" className="hover:text-white">Course-to-Industry Alignment</Link></li>
              <li><Link href="/dashboard/district-plans" className="hover:text-white">District Training Planner</Link></li>
              <li><Link href="/dashboard/student" className="hover:text-white">Career Pathway Navigator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Intelligence Sources</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Job-Posting Demand Signals</li>
              <li>Employer Quarterly Surveys</li>
              <li>Bilateral Industry Consultations</li>
              <li>Sector Growth & Tech Trends</li>
              <li>Placement Outcomes & Satisfaction</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">System Specifications</h4>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Platform ID:</span>
                <span className="font-mono text-slate-200">PS-26134</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Provider:</span>
                <span className="font-mono text-blue-400">Local NLP / Gemini</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Storage:</span>
                <span className="font-mono text-emerald-400">Prisma Relational DB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Human Approval:</span>
                <span className="font-mono text-amber-400">Enforced</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© 2026 KaushalyaSetu - Labour Market Intelligence & Curriculum Alignment Platform. All rights reserved.</p>
          <p>Designed for Ministry of Skill Development & District Skill Councils.</p>
        </div>
      </div>
    </footer>
  );
}
