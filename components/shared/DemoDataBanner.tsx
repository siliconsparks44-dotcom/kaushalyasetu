'use client';

import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';

export default function DemoDataBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-800 flex items-center justify-between no-print">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <span className="flex items-center gap-1 font-semibold uppercase tracking-wider text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-900">
          <AlertTriangle className="w-3.5 h-3.5" />
          Demo Mode Active
        </span>
        <span className="hidden sm:inline">
          Labour Market data, employer postings, and district trends are benchmark simulations designed to evaluate Problem Statement 26134.
        </span>
        <span className="sm:hidden">Demo dataset active for evaluation.</span>
      </div>
    </div>
  );
}
