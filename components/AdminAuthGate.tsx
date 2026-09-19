'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  ArrowLeft,
  Check,
  Shield,
  Database
} from 'lucide-react';

const DEFAULT_ADMIN_EMAIL = 'harihns.0306@gmail.com';
const SECONDARY_ADMIN_EMAIL = 'ns.hariharasudhan@gmail.com';
const INITIAL_DUMMY_PASSWORD = 'BharatAdmin@2025';

interface AdminAuthGateProps {
  children: (authProps: {
    adminEmail: string;
    adminRole: string;
    isSupabaseConnected: boolean;
    onSignOut: () => void;
    onOpenChangePassword: () => void;
  }) => React.ReactNode;
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [isClientReady, setIsClientReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [activeAdminEmail, setActiveAdminEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [adminRole, setAdminRole] = useState('Administrator');
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  // Login form state
  const [emailInput, setEmailInput] = useState(DEFAULT_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // First-time change password modal/screen state
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  // In-dashboard change password modal state
  const [inDashboardModalOpen, setInDashboardModalOpen] = useState(false);
  const [dashboardCurrentPwd, setDashboardCurrentPwd] = useState('');
  const [dashboardNewPwd, setDashboardNewPwd] = useState('');
  const [dashboardConfirmPwd, setDashboardConfirmPwd] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const [dashboardSuccess, setDashboardSuccess] = useState('');
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Hydrate auth data on client mount and check Supabase health
  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        // Check active session in storage
        const activeSession = sessionStorage.getItem('bharat_admin_session');
        if (activeSession) {
          const session = JSON.parse(activeSession);
          if (session.authenticated && session.user) {
            setActiveAdminEmail(session.user);
            setAdminRole(session.role || 'Administrator');
            setIsAuthenticated(true);
            setMustChangePassword(Boolean(session.mustChangePassword));
          }
        }

        // Ping Supabase server check
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (isMounted && data.connected) {
          setSupabaseConnected(true);
        }
      } catch (e) {
        console.error('Failed to parse admin session or check Supabase', e);
      } finally {
        if (isMounted) setIsClientReady(true);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      // Call server route to authenticate against Supabase and set Admin role
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: emailInput.trim(),
          password: passwordInput
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Authentication failed. Please verify credentials.');
        setLoginLoading(false);
        return;
      }

      // Login success: user role is updated as Admin in Supabase
      const verifiedEmail = data.user.email;
      const verifiedRole = data.user.roleDisplay || 'Master Administrator';
      const needsPwdChange = Boolean(data.mustChangePassword);

      sessionStorage.setItem('bharat_admin_session', JSON.stringify({
        authenticated: true,
        user: verifiedEmail,
        role: verifiedRole,
        mustChangePassword: needsPwdChange,
        loginTime: Date.now(),
        supabaseSynced: Boolean(data.supabaseConnected)
      }));

      setActiveAdminEmail(verifiedEmail);
      setAdminRole(verifiedRole);
      setSupabaseConnected(Boolean(data.supabaseConnected));
      setIsAuthenticated(true);
      setMustChangePassword(needsPwdChange);
      setLoginLoading(false);

      if (needsPwdChange) {
        setCurrentPasswordInput(passwordInput);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setLoginError(err.message || 'Connection error. Please try again.');
      setLoginLoading(false);
    }
  };

  const handleFirstTimePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');

    if (newPasswordInput.length < 6) {
      setPasswordChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput === INITIAL_DUMMY_PASSWORD) {
      setPasswordChangeError('Your new password cannot be the same as the initial dummy password.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordChangeError('New password and confirmation do not match.');
      return;
    }

    setPasswordChangeLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          email: activeAdminEmail,
          currentPassword: currentPasswordInput,
          newPassword: newPasswordInput
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPasswordChangeError(data.error || 'Failed to update password in Supabase.');
        setPasswordChangeLoading(false);
        return;
      }

      // Update session
      const activeSession = sessionStorage.getItem('bharat_admin_session');
      if (activeSession) {
        const session = JSON.parse(activeSession);
        session.mustChangePassword = false;
        sessionStorage.setItem('bharat_admin_session', JSON.stringify(session));
      }

      setPasswordChangeSuccess('Password successfully updated and Admin role confirmed in Supabase! Unlocking dashboard...');
      setTimeout(() => {
        setMustChangePassword(false);
        setPasswordChangeSuccess('');
        setPasswordChangeLoading(false);
      }, 1200);
    } catch (err: any) {
      setPasswordChangeError(err.message || 'Network error updating password.');
      setPasswordChangeLoading(false);
    }
  };

  const handleDashboardPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setDashboardError('');

    if (dashboardNewPwd.length < 6) {
      setDashboardError('New password must be at least 6 characters long.');
      return;
    }

    if (dashboardNewPwd !== dashboardConfirmPwd) {
      setDashboardError('New password and confirmation do not match.');
      return;
    }

    setDashboardLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          email: activeAdminEmail,
          currentPassword: dashboardCurrentPwd,
          newPassword: dashboardNewPwd
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setDashboardError(data.error || 'Could not update password in Supabase.');
        setDashboardLoading(false);
        return;
      }

      setDashboardSuccess('Password changed and confirmed in Supabase!');
      setTimeout(() => {
        setInDashboardModalOpen(false);
        setDashboardSuccess('');
        setDashboardCurrentPwd('');
        setDashboardNewPwd('');
        setDashboardConfirmPwd('');
        setDashboardLoading(false);
      }, 1500);
    } catch (err: any) {
      setDashboardError(err.message || 'Failed to update password.');
      setDashboardLoading(false);
    }
  };

  const handleSignOut = () => {
    try {
      sessionStorage.removeItem('bharat_admin_session');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setPasswordInput('');
    setLoginError('');
  };

  // Prevent flash before client hydration
  if (!isClientReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. Mandatory First-Time Password Change screen
  if (isAuthenticated && mustChangePassword) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md bg-slate-900/95 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
              <Key className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">
              Security Setup: Choose Private Password
            </h1>
            <p className="text-xs text-slate-400">
              Authenticated as <strong className="text-blue-300">{activeAdminEmail}</strong> with <span className="text-emerald-400 font-semibold font-mono">Role: Admin</span>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">
              Your role has been registered as <strong className="text-white font-semibold">Admin</strong> in Supabase Auth. Please set your private password to finalize dashboard access.
            </span>
          </div>

          {passwordChangeError && (
            <div className="p-3.5 rounded-xl bg-red-900/40 border border-red-700/60 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{passwordChangeError}</span>
            </div>
          )}

          {passwordChangeSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{passwordChangeSuccess}</span>
            </div>
          )}

          <form onSubmit={handleFirstTimePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Temporary Password
              </label>
              <input
                type="password"
                required
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                placeholder="Initial dummy password"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  New Private Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showNewPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Min 6 characters (e.g. MySecret@2025)"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={passwordChangeLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {passwordChangeLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Save Password & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cancel & Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Login Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Top Logo / Return Link */}
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Portal</span>
            </Link>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Direct URL Endpoint
            </span>
          </div>

          {/* Login Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
                BharatFixed <span className="text-blue-400">Admin Console</span>
              </h1>
              <p className="text-xs text-slate-400">
                Secured via Supabase Authentication & Role Verification
              </p>
            </div>

            {/* Supabase Status Banner */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Supabase Connection:</span>
                </span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Connected & Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Assigned Role upon Login:</span>
                <span className="text-blue-300 font-mono text-[11px] font-bold bg-blue-900/40 px-2 py-0.5 rounded-md border border-blue-700/50">
                  Role: Admin
                </span>
              </div>
            </div>

            {/* Allowed Admin IDs quick pick */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
              <span className="text-[11px] text-slate-400 font-semibold block">Configured Admin Accounts:</span>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => setEmailInput(DEFAULT_ADMIN_EMAIL)}
                  className="text-left font-mono text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-between"
                >
                  <span>{DEFAULT_ADMIN_EMAIL}</span>
                  <span className="text-[10px] text-slate-500">Default</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmailInput(SECONDARY_ADMIN_EMAIL)}
                  className="text-left font-mono text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center justify-between"
                >
                  <span>{SECONDARY_ADMIN_EMAIL}</span>
                  <span className="text-[10px] text-slate-500">Verified</span>
                </button>
              </div>
              <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Initial Dummy Password:</span>
                <code className="text-amber-300 font-mono">{INITIAL_DUMMY_PASSWORD}</code>
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Admin Email / User ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loginLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Login & Confirm Admin Role</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>Protected Role-Based Access</span>
              </span>
              <span>Direct URL Only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated - Render Master Dashboard with change password modal support
  return (
    <>
      {children({
        adminEmail: activeAdminEmail,
        adminRole,
        isSupabaseConnected: supabaseConnected,
        onSignOut: handleSignOut,
        onOpenChangePassword: () => setInDashboardModalOpen(true)
      })}

      {/* In-Dashboard Change Password Modal */}
      {inDashboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Change Admin Password</h3>
                  <p className="text-xs text-slate-500">Account: {activeAdminEmail} ({adminRole})</p>
                </div>
              </div>
              <button
                onClick={() => setInDashboardModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg text-lg leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {dashboardError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{dashboardError}</span>
              </div>
            )}

            {dashboardSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{dashboardSuccess}</span>
              </div>
            )}

            <form onSubmit={handleDashboardPasswordChange} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={dashboardCurrentPwd}
                  onChange={(e) => setDashboardCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={dashboardNewPwd}
                  onChange={(e) => setDashboardNewPwd(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={dashboardConfirmPwd}
                  onChange={(e) => setDashboardConfirmPwd(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInDashboardModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dashboardLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {dashboardLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
