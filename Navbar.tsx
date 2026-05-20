import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Upload, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            LandSafe<span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        {!user && (
          <div className="hidden lg:flex items-center gap-8">
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</button>
            <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</button>
            <button onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Pricing</button>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 text-sm font-medium transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link to="/upload" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 text-sm font-medium transition-colors">
                <Upload className="w-4 h-4" />
                Verify Document
              </Link>
              {(user.role === 'admin' || user.email === 'omkarsathe3103@gmail.com') && (
                <Link to="/admin" className="text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 text-sm font-medium transition-colors">
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} title="Logout" className="text-slate-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
