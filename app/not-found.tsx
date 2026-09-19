import Link from 'next/link';
import { Landmark, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
          <Landmark className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">404 Error</span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            The fixed income guide, scheme page, or tool you are looking for may have been moved or does not exist.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/#directory-section"
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-slate-200"
          >
            <Search className="w-4 h-4" />
            <span>Browse FDs</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
