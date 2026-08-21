// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import LiveIncidentMap from "../components/map/LiveIncidentMap.jsx";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Dynamic Navigation */}
      <Navbar />

      {/* Hero Header Section */}
      <section className="bg-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00b4d8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              National Disaster Response Hub
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
              Real-time Emergency Response & Incident Tracking
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Connecting affected communities, emergency responders, and relief centers across Bangladesh with verified live field data.
            </p>
          </div>
        </div>
      </section>

      {/* Main Interactive Map & Action Section */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 -mt-8 relative z-20 space-y-8 pb-12 flex-1">
        
        {/* Map Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Live Incident Map</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                  Active Monitoring
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Explore real-time verified incidents, active relief operations, and shelter locations
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/shelters"
                className="w-full sm:w-auto text-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Find Nearby Shelters
              </Link>
            </div>
          </div>

          {/* Live Incident Map */}
          <div className="p-2 sm:p-4 bg-slate-100">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-white min-h-[480px]">
              <LiveIncidentMap isCoordinator={false} />
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: Immediate Assistance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xl">
                ⚠️
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition">
                Report an Emergency
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Stranded or need urgent medical/food support? Submit a geo-tagged SOS alert directly to field coordination teams.
              </p>
            </div>
            <Link
              to="/report"
              className="mt-6 inline-flex items-center text-xs font-extrabold text-amber-600 uppercase tracking-wider hover:gap-2 transition-all"
            >
              Submit Report &rarr;
            </Link>
          </div>

          {/* Card 2: Shelter & Supplies */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-cyan-400 transition group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xl">
                🏠
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition">
                Emergency Shelters
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Locate open shelters, current capacity status, available medical supplies, and flood safety havens in your district.
              </p>
            </div>
            <Link
              to="/shelters"
              className="mt-6 inline-flex items-center text-xs font-extrabold text-cyan-600 uppercase tracking-wider hover:gap-2 transition-all"
            >
              Browse Shelters &rarr;
            </Link>
          </div>

          {/* Card 3: Volunteer Operations */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl">
                🤝
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Join Response Missions
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Register as a volunteer or responder to accept field assignments, coordinate logistics, and distribute relief goods.
              </p>
            </div>
            <Link
              to="/register"
              className="mt-6 inline-flex items-center text-xs font-extrabold text-indigo-600 uppercase tracking-wider hover:gap-2 transition-all"
            >
              Register as Volunteer &rarr;
            </Link>
          </div>

        </div>

        {/* Toll-Free Emergency Hotline Bar */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase">National Helplines</span>
            <h4 className="text-lg font-bold text-white mt-0.5">Need Direct Emergency Voice Support?</h4>
            <p className="text-slate-400 text-xs">Reach government emergency and flood response services 24/7</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <a href="tel:999" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition">
              <span>📞</span> National Emergency: <strong>999</strong>
            </a>
            <a href="tel:1090" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition">
              <span>🌊</span> Disaster Warning: <strong>1090</strong>
            </a>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-white text-sm">Disaster Response & Relief Coordination Network</p>
            <p className="text-slate-500 mt-1">Official emergency response situational portal for Bangladesh.</p>
          </div>
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} DRRCS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}