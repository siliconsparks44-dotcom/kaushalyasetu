'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Compass, 
  BarChart3, 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  LogOut, 
  UserCheck, 
  Bell, 
  FileText, 
  Cpu,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setCurrentUser(data.data.user);
          setUnreadCount(data.data.unreadNotificationsCount || 0);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/auth/login');
  };

  const switchRole = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'Password@123' }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.data.user);
        setDropdownOpen(false);
        // Redirect to relevant dashboard
        const role = data.data.user.role;
        if (role === 'ADMIN') router.push('/dashboard/admin');
        else if (role === 'EMPLOYER') router.push('/dashboard/employer');
        else if (role === 'INSTITUTE') router.push('/dashboard/institute');
        else if (role === 'TRAINER') router.push('/dashboard/trainer');
        else if (role === 'STUDENT') router.push('/dashboard/student');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg block leading-tight">
                LMI-CAP
              </span>
              <span className="text-[11px] text-slate-500 block leading-tight">
                Labour Market Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 text-sm font-medium text-slate-600">
            <Link 
              href="/dashboard/admin" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/admin' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              Admin
            </Link>
            <Link 
              href="/dashboard/employer" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/employer' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              Industry
            </Link>
            <Link 
              href="/dashboard/institute" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/institute' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              Academia
            </Link>
            <Link 
              href="/dashboard/alignment" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/alignment' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              Curriculum AI
            </Link>
            <Link 
              href="/dashboard/district-plans" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/district-plans' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              District Planner
            </Link>
            <Link 
              href="/dashboard/student" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/student' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              Career Paths
            </Link>
            <Link 
              href="/dashboard/reports" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-slate-50 ${pathname === '/dashboard/reports' ? 'text-blue-600 bg-blue-50/60 font-semibold' : ''}`}
            >
              Reports
            </Link>
          </nav>

          {/* Right Action Menu & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-semibold">{currentUser.fullName?.split(' ')[0]}</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {currentUser.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <div className="px-2 py-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                        Switch Demo Persona
                      </p>
                      <button
                        onClick={() => switchRole('admin@lmi.gov.in')}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                      >
                        <span>Government Admin</span>
                        <span className="text-[10px] text-slate-400">Dr. Verma</span>
                      </button>
                      <button
                        onClick={() => switchRole('employer@techcorp.com')}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                      >
                        <span>Industry Employer</span>
                        <span className="text-[10px] text-slate-400">Apex Tech</span>
                      </button>
                      <button
                        onClick={() => switchRole('institute@puneiti.edu.in')}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                      >
                        <span>Training Institute</span>
                        <span className="text-[10px] text-slate-400">GP Pune</span>
                      </button>
                      <button
                        onClick={() => switchRole('trainer@skills.edu.in')}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                      >
                        <span>Vocational Trainer</span>
                        <span className="text-[10px] text-slate-400">Anand D.</span>
                      </button>
                      <button
                        onClick={() => switchRole('student@learner.org')}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg flex items-center justify-between"
                      >
                        <span>Student / Trainee</span>
                        <span className="text-[10px] text-slate-400">Kavita P.</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 mt-1 px-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/login"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition"
                >
                  Demo Access
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
