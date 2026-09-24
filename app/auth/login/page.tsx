'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import DemoDataBanner from '@/components/shared/DemoDataBanner';
import { Compass, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Password@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = customEmail || email;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || 'Login failed');
      }

      const role = data.data.user.role;
      if (role === 'ADMIN') router.push('/dashboard/admin');
      else if (role === 'EMPLOYER') router.push('/dashboard/employer');
      else if (role === 'INSTITUTE') router.push('/dashboard/institute');
      else if (role === 'TRAINER') router.push('/dashboard/trainer');
      else if (role === 'STUDENT') router.push('/dashboard/student');
      else router.push('/dashboard/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillAndSubmit = (selectedEmail: string) => {
    setEmail(selectedEmail);
    handleLogin(undefined, selectedEmail);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <DemoDataBanner />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Compass className="w-7 h-7" />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign in to LMI-CAP
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Role-Based Access for Policy, Industry, Academia & Students
            </p>
          </div>

          {/* Quick Demo Persona One-Click Buttons */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                1-Click Demo Accounts
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => fillAndSubmit('admin@lmi.gov.in')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-700">1. Admin / Government</span>
                  <span className="text-[11px] text-slate-500 block">Dr. Ramesh Verma (State Skill Officer)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => fillAndSubmit('employer@techcorp.com')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-700">2. Industry / Employer</span>
                  <span className="text-[11px] text-slate-500 block">Pooja Sharma (Apex Technologies)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => fillAndSubmit('institute@puneiti.edu.in')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-700">3. Training Institute</span>
                  <span className="text-[11px] text-slate-500 block">Prof. Rajesh Kulkarni (Govt Polytechnic)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => fillAndSubmit('trainer@skills.edu.in')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-700">4. Vocational Trainer</span>
                  <span className="text-[11px] text-slate-500 block">Anand Deshmukh (Lead Instructor)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
              </button>

              <button
                type="button"
                onClick={() => fillAndSubmit('student@learner.org')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-700">5. Student / Trainee</span>
                  <span className="text-[11px] text-slate-500 block">Kavita Patil (Diploma Graduate)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
              </button>
            </div>
          </div>

          {/* Standard Form */}
          <form className="mt-8 space-y-4" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In with Credentials'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Need a new organization account? </span>
              <Link href="/auth/register" className="text-xs font-semibold text-blue-600 hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
