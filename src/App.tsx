/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { initAuth, googleSignIn, getAccessToken, logout } from './auth';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Users, Calendar, Mail, FileText, 
  FileBadge, Lock, Unlock, ArrowRight, Dna, 
  Beaker, GraduationCap, Globe, CheckCircle2, 
  Briefcase, FileSymlink, Presentation, Database, 
  Camera, Sparkles, Tag, ChevronRight, Download, 
  ExternalLink, Search, ShieldCheck, Microscope,
  Lightbulb, Award, HeartHandshake, Eye, Link as LinkIcon
} from 'lucide-react';

type MainTab = 'prototype' | 'strategy';
type PublicSection = 'about' | 'committee' | 'events' | 'photos' | 'sponsors' | 'links';
type MemberSection = 'vault' | 'discounts' | 'careers' | 'alumni' | 'committee_docs';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>('prototype');
  const [activePublicNav, setActivePublicNav] = useState<PublicSection>('about');
  const [activeMemberNav, setActiveMemberNav] = useState<MemberSection>('vault');
  const [portalMode, setPortalMode] = useState<'public' | 'members'>('public');
  const [isMemberAuthenticated, setIsMemberAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('student@student.le.ac.uk');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; caption: string; tag: string; date: string } | null>(null);

  const [driveToken, setDriveToken] = useState<string | null>(null);
  const [driveUser, setDriveUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);

  useEffect(() => {
    initAuth(
      (user, token) => {
        setDriveUser(user);
        setDriveToken(token);
      },
      () => {
        setDriveUser(null);
        setDriveToken(null);
      }
    );
  }, []);

  const handleDriveLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setDriveToken(result.accessToken);
        setDriveUser(result.user);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (activeMemberNav === 'committee_docs' && driveToken) {
      fetchDriveDocs();
    }
  }, [activeMemberNav, driveToken]);

  const fetchDriveDocs = async () => {
    setIsLoadingDrive(true);
    try {
      const q = encodeURIComponent(`name contains 'What is BioSoc' or mimeType = 'application/vnd.google-apps.document'`);
      const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,webViewLink,iconLink,createdTime)&orderBy=modifiedTime desc`, {
        headers: { Authorization: `Bearer ${driveToken}` },
      });
      const data = await res.json();
      if (data.files) {
        setDriveFiles(data.files);
      }
    } catch (err) {
      console.error('Failed to fetch Drive docs:', err);
    } finally {
      setIsLoadingDrive(false);
    }
  };

  // Quick helper to unlock
  const handleSSOLogin = () => {
    setIsMemberAuthenticated(true);
    setPortalMode('members');
  };

  return (
    <div className="min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Main Laboratory Ledger Window */}
      <div className="w-full max-w-[1240px] bg-white border-[3px] border-[#1e1e1e] shadow-brutal-lg flex flex-col relative overflow-hidden my-auto rounded-none">
        
        {/* Header Bar */}
        <header className="bg-[#4ade80] border-b-[3px] border-[#1e1e1e] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1e1e1e] text-white flex items-center justify-center border-2 border-[#1e1e1e] shadow-brutal-sm font-bold text-sm">
              <Dna size={18} className="text-[#4ade80]" />
            </div>
            <div>
              <span className="font-gaegu text-2xl sm:text-3xl font-bold tracking-wide text-[#1e1e1e] leading-none block">
                Leicester BioSoc
              </span>
            </div>
            <span className="label-tag hidden md:inline-flex bg-[#1e1e1e] text-[#4ade80]">
              <Microscope size={12} /> LAB_LEDGER.V24
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="font-mono-code text-[11px] font-bold text-[#1e1e1e] hidden lg:block tracking-tight bg-white/70 px-2.5 py-1 border-2 border-[#1e1e1e]">
              A24-INSTANCE.LEDGER // UoL_BIOSCIENCES
            </div>

            {/* View Switcher Tabs */}
            <div className="flex bg-[#1e1e1e] p-1 border-2 border-[#1e1e1e]">
              <button
                id="btn-nav-prototype"
                onClick={() => setMainTab('prototype')}
                className={`px-3 py-1 text-xs font-mono-code font-bold transition-all ${
                  mainTab === 'prototype'
                    ? 'bg-[#4ade80] text-[#1e1e1e]'
                    : 'text-white hover:text-[#4ade80]'
                }`}
              >
                PROTOTYPE
              </button>
              <button
                id="btn-nav-strategy"
                onClick={() => setMainTab('strategy')}
                className={`px-3 py-1 text-xs font-mono-code font-bold transition-all ${
                  mainTab === 'strategy'
                    ? 'bg-[#60a5fa] text-[#1e1e1e]'
                    : 'text-white hover:text-[#60a5fa]'
                }`}
              >
                STRATEGY_DOC
              </button>
            </div>
          </div>
        </header>

        {/* Inner App Container */}
        {mainTab === 'prototype' && (
          <div className="grid grid-cols-1 md:grid-cols-[270px_1fr] min-h-[660px] relative">
            
            {/* Sidebar */}
            <aside className="border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#1e1e1e] p-5 bg-[#f8fafc] flex flex-col justify-between gap-6 z-20">
              <div className="space-y-6">
                
                {/* Public Resources Group */}
                <div className="nav-group">
                  <div className="label-tag mb-3">
                    <Globe size={11} /> PUBLIC_RESOURCES
                  </div>
                  <nav className="space-y-2">
                    {[
                      { id: 'links', label: 'Quick Links (Bio)', icon: LinkIcon },
                      { id: 'about', label: 'About Society', icon: Building2 },
                      { id: 'committee', label: 'Committee', icon: Users },
                      { id: 'events', label: 'Events Schedule', icon: Calendar },
                      { id: 'photos', label: 'Event Photos & Gallery', icon: Camera },
                      { id: 'sponsors', label: 'Sponsors & Partners', icon: Award },
                    ].map((item) => {
                      const isActive = portalMode === 'public' && activePublicNav === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          id={`btn-public-${item.id}`}
                          onClick={() => {
                            setPortalMode('public');
                            setActivePublicNav(item.id as PublicSection);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold text-left transition-all border-2 border-[#1e1e1e] ${
                            isActive
                              ? 'bg-[#60a5fa] text-[#1e1e1e] shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                              : 'bg-white text-[#1e1e1e] hover:bg-slate-100 hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon size={16} />
                            {item.label}
                          </span>
                          {isActive && <ChevronRight size={14} />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Secure Member Resources Group */}
                <div className="nav-group pt-2 border-t-2 border-dashed border-slate-300">
                  <div className="label-tag bg-[#1e1e1e] text-[#f472b6] mb-3 flex items-center justify-between w-full">
                    <span className="flex items-center gap-1">
                      <Lock size={11} /> SECURE_PORTAL
                    </span>
                    {isMemberAuthenticated ? (
                      <span className="text-[9px] text-[#4ade80] font-mono-code font-bold">UNLOCKED</span>
                    ) : (
                      <span className="text-[9px] text-amber-300 font-mono-code font-bold">PAYWALL</span>
                    )}
                  </div>

                  <nav className="space-y-2">
                    {[
                      { id: 'vault', label: 'Academic Vault', icon: FileText },
                      { id: 'discounts', label: 'Partner Discounts', icon: Tag },
                      { id: 'careers', label: 'Careers & Roles', icon: Briefcase },
                      { id: 'alumni', label: 'Alumni Network', icon: Users },
                      { id: 'committee_docs', label: 'Meeting Notes & Docs', icon: FileBadge },
                    ].map((item) => {
                      const isActive = portalMode === 'members' && activeMemberNav === item.id;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          id={`btn-member-${item.id}`}
                          onClick={() => {
                            setPortalMode('members');
                            setActiveMemberNav(item.id as MemberSection);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold text-left transition-all border-2 border-[#1e1e1e] ${
                            isActive
                              ? 'bg-[#fde047] text-[#1e1e1e] shadow-brutal-sm -translate-x-0.5 -translate-y-0.5'
                              : 'bg-white text-[#1e1e1e] hover:bg-slate-100 hover:shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon size={16} />
                            {item.label}
                          </span>
                          {!isMemberAuthenticated ? (
                            <Lock size={12} className="text-slate-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#4ade80] border border-[#1e1e1e]"></span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Status Box in Sidebar */}
              <div className="bg-white border-2 border-[#1e1e1e] p-3 shadow-brutal-sm text-xs font-mono-code space-y-2">
                <div className="text-[10px] text-slate-500 font-bold uppercase">SESSION STATE:</div>
                <div className="flex items-center gap-2 font-bold">
                  <span className={`w-2.5 h-2.5 rounded-full border border-[#1e1e1e] ${isMemberAuthenticated ? 'bg-[#4ade80]' : 'bg-rose-500'}`} />
                  <span>{isMemberAuthenticated ? 'VERIFIED_MEMBER' : 'GUEST_ACCESS'}</span>
                </div>
                {isMemberAuthenticated ? (
                  <button
                    id="btn-lock-session"
                    onClick={() => setIsMemberAuthenticated(false)}
                    className="w-full text-center py-1 bg-slate-100 border border-[#1e1e1e] hover:bg-rose-100 text-[11px] font-bold mt-1 text-rose-700"
                  >
                    [LOCK_SESSION]
                  </button>
                ) : (
                  <button
                    id="btn-quick-verify"
                    onClick={handleSSOLogin}
                    className="w-full text-center py-1 bg-[#4ade80] border border-[#1e1e1e] hover:bg-[#86efac] text-[11px] font-bold mt-1 text-[#1e1e1e]"
                  >
                    [DEMO_SSO_LOGIN]
                  </button>
                )}
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="p-4 sm:p-8 lg:p-10 flex flex-col justify-start relative overflow-y-auto bg-white min-h-[580px]">
              
              {/* Organelle Sketched Shapes Background (as in design HTML) */}
              <svg className="sketch absolute top-6 right-6 pointer-events-none opacity-30 sm:opacity-50" width="130" height="130" viewBox="0 0 120 120">
                <path d="M10,60 C10,10 110,10 110,60 C110,110 10,110 10,60 M30,60 C30,30 90,30 90,60 C90,90 30,90 30,60" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="5 3"/>
                <circle cx="60" cy="60" r="8" fill="#4ade80" stroke="#1e1e1e" strokeWidth="1.5" />
              </svg>
              <svg className="sketch absolute bottom-8 left-8 pointer-events-none opacity-30 sm:opacity-40" width="90" height="90" viewBox="0 0 80 80">
                <path d="M10,40 Q40,10 70,40 T10,40" fill="none" stroke="#4ade80" strokeWidth="3"/>
                <circle cx="40" cy="40" r="6" fill="#60a5fa" stroke="#1e1e1e" strokeWidth="1.5" />
              </svg>

              {/* Public Section Views */}
              {portalMode === 'public' && (
                <div className="relative z-10 space-y-6">
                  {/* Link in Bio / Quick Links */}
                  {activePublicNav === 'links' && (
                    <div className="space-y-6">
                      <div className="label-tag bg-[#1e1e1e] text-[#fde047]">
                        <LinkIcon size={12} /> LINKTREE // BIO_LINKS
                      </div>
                      
                      <div className="text-center max-w-xl mx-auto pt-4 space-y-4">
                        <div className="w-20 h-20 bg-[#1e1e1e] text-[#4ade80] flex items-center justify-center border-[3px] border-[#1e1e1e] shadow-brutal mx-auto rounded-full">
                          <Dna size={40} />
                        </div>
                        <h2 className="font-gaegu text-4xl sm:text-5xl font-bold text-[#1e1e1e] leading-none mb-1">
                          Leicester BioSoc
                        </h2>
                        <p className="text-slate-600 font-medium">
                          Official Links for the University of Leicester Biosciences Society.
                        </p>
                      </div>

                      <div className="max-w-md mx-auto space-y-4 pt-4">
                        <a 
                          href="https://www.leicesterunion.com/sportsandsocs/societies/biosoc" 
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-[#fde047] border-[3px] border-[#1e1e1e] shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 hover:-translate-x-1 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#1e1e1e] text-white">
                              <Building2 size={20} />
                            </div>
                            <span className="font-gaegu text-2xl font-bold text-[#1e1e1e]">Official SU Page</span>
                          </div>
                          <ExternalLink size={20} className="text-[#1e1e1e]" />
                        </a>

                        <a 
                          href="https://www.instagram.com/biosoc.leics" 
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-[#f472b6] border-[3px] border-[#1e1e1e] shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 hover:-translate-x-1 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#1e1e1e] text-white">
                              <Camera size={20} />
                            </div>
                            <span className="font-gaegu text-2xl font-bold text-[#1e1e1e]">Follow us on Instagram</span>
                          </div>
                          <ExternalLink size={20} className="text-[#1e1e1e]" />
                        </a>

                        <a 
                          href="https://le.ac.uk/biological-sciences" 
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-[#60a5fa] border-[3px] border-[#1e1e1e] shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 hover:-translate-x-1 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#1e1e1e] text-white">
                              <GraduationCap size={20} />
                            </div>
                            <span className="font-gaegu text-2xl font-bold text-[#1e1e1e]">UoL Biosciences Website</span>
                          </div>
                          <ExternalLink size={20} className="text-[#1e1e1e]" />
                        </a>

                        <button 
                          onClick={() => {
                            setPortalMode('members');
                            setActiveMemberNav('vault');
                          }}
                          className="w-full flex items-center justify-between p-4 bg-[#4ade80] border-[3px] border-[#1e1e1e] shadow-brutal-sm hover:shadow-brutal hover:-translate-y-1 hover:-translate-x-1 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#1e1e1e] text-white">
                              <Lock size={20} />
                            </div>
                            <span className="font-gaegu text-2xl font-bold text-[#1e1e1e]">Member Portal Login</span>
                          </div>
                          <ArrowRight size={20} className="text-[#1e1e1e]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* About Society */}
                  {activePublicNav === 'about' && (
                    <div className="space-y-6">
                      <div className="label-tag bg-[#60a5fa] text-[#1e1e1e]">
                        <Building2 size={12} /> SOCIETY_DOSSIER // PUBLIC
                      </div>
                      
                      <div>
                        <h2 className="font-gaegu text-4xl sm:text-6xl font-bold text-[#1e1e1e] leading-none mb-1">
                          University of Leicester BioSoc
                        </h2>
                        <div className="marker-underline-blue"></div>
                        <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-3xl mt-3 font-medium">
                          BioSoc is Leicester’s student-led society for undergraduate and postgraduate students in Biological and Biomedical Sciences. We build community beyond individual courses through academic, social, career, inclusion, and leadership opportunities. BioSoc helps students connect across year groups, engage with staff and researchers, and discover opportunities in academia, industry, and beyond.
                        </p>
                      </div>

                      {/* Fast Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="border-2 border-[#1e1e1e] p-4 bg-[#f8fafc] shadow-brutal-sm">
                          <div className="label-tag bg-[#1e1e1e] text-white mb-2 text-[10px]">MEMBERSHIP</div>
                          <p className="font-gaegu text-3xl text-[#1e1e1e] font-bold">£5.00 / Year</p>
                          <p className="text-xs text-slate-600 font-mono-code mt-1">Direct SU verification</p>
                        </div>
                        <div className="border-2 border-[#1e1e1e] p-4 bg-[#f8fafc] shadow-brutal-sm">
                          <div className="label-tag bg-[#4ade80] text-[#1e1e1e] mb-2 text-[10px]">COMMUNITY</div>
                          <p className="font-gaegu text-3xl text-[#1e1e1e] font-bold">650+ Students</p>
                          <p className="text-xs text-slate-600 font-mono-code mt-1">BSc, MSc, PhD cohorts</p>
                        </div>
                        <div className="border-2 border-[#1e1e1e] p-4 bg-[#f8fafc] shadow-brutal-sm">
                          <div className="label-tag bg-[#fde047] text-[#1e1e1e] mb-2 text-[10px]">ACADEMIC VAULT</div>
                          <p className="font-gaegu text-3xl text-[#1e1e1e] font-bold">45+ Guides</p>
                          <p className="text-xs text-slate-600 font-mono-code mt-1">Locked for members</p>
                        </div>
                      </div>

                      {/* Core Pillars */}
                      <div className="border-[3px] border-[#1e1e1e] p-6 bg-[#ffffff] shadow-brutal space-y-4">
                        <h3 className="font-bold text-lg text-[#1e1e1e] flex items-center gap-2">
                          <Dna size={18} className="text-[#4ade80]" /> Branches of BioSoc
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex gap-3 items-start p-3 bg-slate-50 border-[2px] border-[#1e1e1e] shadow-brutal-sm">
                            <span className="font-mono-code font-bold text-sm bg-[#1e1e1e] text-white px-2 py-0.5">01</span>
                            <div>
                              <strong className="block text-slate-900 mb-0.5">Academic</strong>
                              <p className="text-slate-600 text-xs leading-relaxed">Providing high-quality academic support, study resources, and peer-assisted learning.</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start p-3 bg-slate-50 border-[2px] border-[#1e1e1e] shadow-brutal-sm">
                            <span className="font-mono-code font-bold text-sm bg-[#4ade80] text-[#1e1e1e] px-2 py-0.5">02</span>
                            <div>
                              <strong className="block text-slate-900 mb-0.5">Careers</strong>
                              <p className="text-slate-600 text-xs leading-relaxed">Connecting students with industry professionals, placements, and career development opportunities.</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start p-3 bg-slate-50 border-[2px] border-[#1e1e1e] shadow-brutal-sm">
                            <span className="font-mono-code font-bold text-sm bg-[#60a5fa] text-[#1e1e1e] px-2 py-0.5">03</span>
                            <div>
                              <strong className="block text-slate-900 mb-0.5">Inclusion</strong>
                              <p className="text-slate-600 text-xs leading-relaxed">Fostering a welcoming, diverse, and accessible community for all life science students.</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start p-3 bg-slate-50 border-[2px] border-[#1e1e1e] shadow-brutal-sm">
                            <span className="font-mono-code font-bold text-sm bg-[#fde047] text-[#1e1e1e] px-2 py-0.5">04</span>
                            <div>
                              <strong className="block text-slate-900 mb-0.5">Socials</strong>
                              <p className="text-slate-600 text-xs leading-relaxed">Hosting engaging events, from the annual BioBall to relaxed pub quizzes and cafe meetups.</p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start p-3 bg-slate-50 border-[2px] border-[#1e1e1e] shadow-brutal-sm">
                            <span className="font-mono-code font-bold text-sm bg-[#f472b6] text-[#1e1e1e] px-2 py-0.5">05</span>
                            <div>
                              <strong className="block text-slate-900 mb-0.5">Leadership</strong>
                              <p className="text-slate-600 text-xs leading-relaxed">Empowering students to take on committee roles and develop core professional skills.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Call to action */}
                      <div className="flex flex-wrap gap-3 items-center pt-2">
                        <button
                          id="btn-access-portal-cta"
                          onClick={() => {
                            setPortalMode('members');
                            setActiveMemberNav('vault');
                          }}
                          className="btn-brutal-dark px-6 py-3 font-mono-code font-bold text-sm flex items-center gap-2"
                        >
                          <Lock size={15} className="text-[#4ade80]" />
                          ACCESS_MEMBERS_PORTAL
                        </button>
                        <button
                          onClick={() => setActivePublicNav('photos')}
                          className="btn-brutal px-6 py-3 font-mono-code font-bold text-sm flex items-center gap-2"
                        >
                          <Camera size={15} />
                          VIEW_EVENT_PHOTOS
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Committee View */}
                  {activePublicNav === 'committee' && (
                    <div className="space-y-6">
                      <div className="label-tag bg-[#4ade80] text-[#1e1e1e]">
                        <Users size={12} /> COMMITTEE_DIRECTORY // 2025-2026
                      </div>
                      <div>
                        <h2 className="font-gaegu text-4xl sm:text-5xl font-bold text-[#1e1e1e] leading-none mb-1">
                          Meet the BioSoc Committee
                        </h2>
                        <div className="marker-underline"></div>
                        <p className="text-slate-600 text-sm font-medium">
                          Elected student leadership representing Biosciences across the Adrian Building & George Davies Centre.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { role: 'President', name: 'Zainab Ahmed', degree: 'BSc Biological Sciences (Yr 3)', focus: 'Strategic Vision & Faculty Liaison', tag: 'PRES' },
                          { role: 'Vice President', name: 'Liam O’Connor', degree: 'BSc Medical Genetics (Yr 2)', focus: 'Events & Guest Seminars', tag: 'VP' },
                          { role: 'Treasurer', name: 'Maya Patel', degree: 'BSc Biochemistry (Yr 3)', focus: 'Budgeting & SU Grant Allocation', tag: 'FIN' },
                          { role: 'Academic Secretary', name: 'Dr. Ethan Vance (PGT Rep)', degree: 'MSc Molecular Pathology', focus: 'Vault Curation & Study Circles', tag: 'ACAD' },
                          { role: 'Social & Wellbeing Sec', name: 'Chloe Davies', degree: 'BSc Biomedical Sciences (Yr 2)', focus: 'BioBall & Lab Crawls', tag: 'SOC' },
                          { role: 'Careers & Industry Lead', name: 'Tariq Al-Mansoor', degree: 'PhD Cancer Studies', focus: 'Alumni Network & Placements', tag: 'CAR' },
                        ].map((c, i) => (
                          <div key={i} className="border-[2.5px] border-[#1e1e1e] p-4 bg-white shadow-brutal-sm flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="label-tag text-[9px] bg-[#1e1e1e] text-[#4ade80]">{c.tag}</span>
                                <span className="text-[11px] font-mono-code font-bold text-slate-500">{c.role}</span>
                              </div>
                              <h4 className="font-bold text-base text-slate-900">{c.name}</h4>
                              <p className="text-xs text-[#60a5fa] font-semibold mt-0.5">{c.degree}</p>
                              <p className="text-xs text-slate-600 mt-2 font-medium bg-slate-50 p-2 border border-slate-200">
                                {c.focus}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono-code text-slate-500">
                              <span>CONTACT</span>
                              <span className="text-slate-800 font-bold">@leicester.ac.uk</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Schedule */}
                  {activePublicNav === 'events' && (
                    <div className="space-y-6">
                      <div className="label-tag bg-[#fde047] text-[#1e1e1e]">
                        <Calendar size={12} /> TIMETABLE // TERM_CALENDAR
                      </div>
                      <div>
                        <h2 className="font-gaegu text-4xl sm:text-5xl font-bold text-[#1e1e1e] leading-none mb-1">
                          Upcoming Events & Socials
                        </h2>
                        <div className="marker-underline-yellow"></div>
                      </div>

                      <div className="space-y-3">
                        {[
                          { date: 'OCT 24', title: 'AstraZeneca R&D Placement Q&A', time: '17:30 - 19:00', loc: 'George Davies Centre LT1', badge: 'CAREERS', badgeColor: 'bg-[#60a5fa]' },
                          { date: 'NOV 08', title: 'The Annual BioSoc Pub Quiz & Pizza', time: '19:00 - 22:00', loc: 'Students’ Union Square', badge: 'SOCIAL', badgeColor: 'bg-[#4ade80]' },
                          { date: 'NOV 19', title: 'BS1030 Lab Report Masterclass', time: '14:00 - 16:00', loc: 'Adrian Building Bennett Rm', badge: 'ACADEMIC', badgeColor: 'bg-[#fde047]' },
                          { date: 'DEC 04', title: 'Winter BioBall 2026: Black Tie Gala', time: '19:00 - LATE', loc: 'Leicester Grand Hotel', badge: 'TICKETED', badgeColor: 'bg-[#f472b6]' },
                        ].map((evt, i) => (
                          <div key={i} className="border-[2.5px] border-[#1e1e1e] p-4 bg-white shadow-brutal-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-4">
                              <div className="bg-[#1e1e1e] text-[#4ade80] font-mono-code font-bold text-center px-3 py-2 border border-[#1e1e1e] min-w-[75px]">
                                {evt.date}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.5 border border-[#1e1e1e] ${evt.badgeColor} text-[#1e1e1e]`}>
                                    {evt.badge}
                                  </span>
                                  <span className="text-xs font-mono-code text-slate-500">{evt.time}</span>
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">{evt.title}</h4>
                                <p className="text-xs text-slate-600 font-medium">{evt.loc}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setPortalMode('members');
                                setActiveMemberNav('vault');
                              }}
                              className="btn-brutal text-xs font-mono-code font-bold px-3 py-2 self-start sm:self-auto shrink-0"
                            >
                              MEMBER_RSVP 🔒
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Event Photos & Gallery */}
                  {activePublicNav === 'photos' && (
                    <div className="space-y-6">
                      <div className="label-tag bg-[#f472b6] text-[#1e1e1e]">
                        <Camera size={12} /> PHOTO_LOG // SOCIETY_HIGHLIGHTS
                      </div>
                      <div>
                        <h2 className="font-gaegu text-4xl sm:text-5xl font-bold text-[#1e1e1e] leading-none mb-1">
                          Event Photos & Society Moments
                        </h2>
                        <div className="marker-underline"></div>
                        <p className="text-slate-600 text-sm font-medium">
                          Snapshots from our lab socials, career panels, field explorations, and annual gala nights.
                        </p>
                      </div>

                      {/* Photo Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            title: 'Annual Biosciences Gala 2025',
                            caption: 'Students and faculty celebrating at the Winter BioBall at Grand Hotel.',
                            date: 'Dec 2025',
                            tag: 'GALA_NIGHT',
                            color: 'bg-emerald-100',
                            accent: '#4ade80'
                          },
                          {
                            title: 'Adrian Lab Practical Group',
                            caption: 'Second year biomedical students running PCR amplification assays.',
                            date: 'Nov 2025',
                            tag: 'LAB_WORK',
                            color: 'bg-blue-100',
                            accent: '#60a5fa'
                          },
                          {
                            title: 'GSK Guest Keynote Seminar',
                            caption: 'Packed lecture theatre in George Davies Centre for pharmaceutical career talk.',
                            date: 'Oct 2025',
                            tag: 'CAREERS',
                            color: 'bg-amber-100',
                            accent: '#fde047'
                          },
                          {
                            title: 'Bradgate Park Ecology Field Trip',
                            caption: 'Sampling freshwater macroinvertebrates and biodiversity charting.',
                            date: 'Oct 2025',
                            tag: 'FIELD_WORK',
                            color: 'bg-lime-100',
                            accent: '#86efac'
                          },
                          {
                            title: 'Freshers Welcome Pizza Night',
                            caption: 'Over 140 new Biosciences undergrads connecting in the SU Square.',
                            date: 'Sep 2025',
                            tag: 'SOCIAL',
                            color: 'bg-pink-100',
                            accent: '#f472b6'
                          },
                          {
                            title: 'Research Poster Symposium',
                            caption: 'PGT and 3rd-year students presenting dissertation findings to examiners.',
                            date: 'May 2025',
                            tag: 'ACADEMIC',
                            color: 'bg-purple-100',
                            accent: '#c084fc'
                          }
                        ].map((photo, i) => (
                          <div
                            key={i}
                            onClick={() => setSelectedPhoto({ url: '', caption: photo.caption, tag: photo.tag, date: photo.date })}
                            className="border-[2.5px] border-[#1e1e1e] p-3 bg-white shadow-brutal-sm hover:shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
                          >
                            <div className={`h-40 ${photo.color} border-2 border-[#1e1e1e] relative flex items-center justify-center overflow-hidden p-4`}>
                              <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
                              <div className="text-center z-10">
                                <div className="w-10 h-10 mx-auto rounded-full bg-white border-2 border-[#1e1e1e] flex items-center justify-center mb-2 shadow-brutal-sm group-hover:scale-110 transition-transform">
                                  <Camera size={18} className="text-[#1e1e1e]" />
                                </div>
                                <span className="font-mono-code font-bold text-[10px] bg-[#1e1e1e] text-white px-2 py-0.5 uppercase tracking-wider">
                                  {photo.tag}
                                </span>
                              </div>
                              <span className="absolute bottom-2 right-2 font-mono-code text-[10px] font-bold text-slate-700 bg-white/80 px-1 border border-[#1e1e1e]">
                                {photo.date}
                              </span>
                            </div>

                            <div className="mt-3">
                              <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                                {photo.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                {photo.caption}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono-code font-bold text-slate-500">
                              <span>TAP_TO_ENLARGE</span>
                              <Eye size={12} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lightbox / Modal when clicking photo */}
                      {selectedPhoto && (
                        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                          <div className="bg-white border-[3px] border-[#1e1e1e] shadow-brutal-lg max-w-lg w-full p-6 space-y-4 relative">
                            <div className="flex justify-between items-center border-b-2 border-[#1e1e1e] pb-3">
                              <span className="label-tag bg-[#4ade80] text-[#1e1e1e]">{selectedPhoto.tag}</span>
                              <button
                                onClick={() => setSelectedPhoto(null)}
                                className="font-mono-code text-sm font-bold bg-[#1e1e1e] text-white px-2 py-0.5 hover:bg-rose-600"
                              >
                                [ESC_CLOSE]
                              </button>
                            </div>
                            <div className="h-56 bg-slate-100 border-2 border-[#1e1e1e] flex flex-col items-center justify-center text-center p-4">
                              <Camera size={36} className="text-slate-400 mb-2" />
                              <span className="font-mono-code text-xs text-slate-500 font-bold">UOL_BIOSOC_ARCHIVE_{selectedPhoto.date}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-800">{selectedPhoto.caption}</p>
                            <div className="text-xs font-mono-code text-slate-500">
                              Submit your event photos to the Media Officer at <span className="font-bold">biosoc@le.ac.uk</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sponsors & Partners */}
                  {activePublicNav === 'sponsors' && (
                    <div className="space-y-6">
                      <div className="label-tag bg-[#60a5fa] text-[#1e1e1e]">
                        <Award size={12} /> PARTNERSHIPS // INDUSTRY_AFFILIATES
                      </div>
                      <div>
                        <h2 className="font-gaegu text-4xl sm:text-5xl font-bold text-[#1e1e1e] leading-none mb-1">
                          Our Sponsors & Partners
                        </h2>
                        <div className="marker-underline-blue"></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { name: 'University of Leicester School of Biological Sciences', tier: 'ACADEMIC PATRON', perk: 'Departmental grant funding, lab access & faculty keynote lectures' },
                          { name: 'AstraZeneca Campus Outreach', tier: 'INDUSTRY PARTNER', perk: 'Direct fast-track insight days & industrial placement mentoring' },
                          { name: 'Leicester Students’ Union (SU)', tier: 'AFFILIATION', perk: 'Official society charter, room booking & union council representation' },
                          { name: 'Biochemical Society UK', tier: 'PROFESSIONAL BODY', perk: 'Student membership subsidies and conference travel bursaries' },
                        ].map((s, i) => (
                          <div key={i} className="border-[2.5px] border-[#1e1e1e] p-5 bg-white shadow-brutal-sm space-y-2">
                            <span className="label-tag text-[9px] bg-[#1e1e1e] text-[#4ade80]">{s.tier}</span>
                            <h4 className="font-bold text-base text-slate-900">{s.name}</h4>
                            <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-2.5 border border-slate-200">
                              {s.perk}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Members Portal Section Views */}
              {portalMode === 'members' && (
                <div className="relative z-10 w-full h-full flex flex-col">
                  
                  {/* Locked State Paywall / SSO Screen */}
                  {!isMemberAuthenticated ? (
                    <div className="my-auto py-8 max-w-lg mx-auto w-full">
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="auth-container border-[3px] border-[#1e1e1e] bg-white p-6 sm:p-8 shadow-brutal space-y-4"
                      >
                        <div className="label-tag bg-[#1e1e1e] text-white">
                          <Lock size={12} /> PROTOCOL: SSO_AUTH // MEMBERS_ONLY
                        </div>

                        <div>
                          <h2 className="font-gaegu text-4xl sm:text-5xl font-bold text-[#60a5fa] leading-none mb-1">
                            Authentication Required
                          </h2>
                          <div className="marker-underline"></div>
                        </div>

                        <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                          Access to member resources (Academic Vault, Partner Discounts, and Placement Board) requires verification via University SSO. Please authenticate with your institutional credentials: <strong className="text-slate-900 font-mono-code">@student.le.ac.uk</strong>.
                        </p>

                        <div className="bg-slate-50 border-2 border-[#1e1e1e] p-3 space-y-2 font-mono-code text-xs">
                          <div className="flex justify-between items-center text-slate-500">
                            <span>INSTITUTION:</span>
                            <span className="font-bold text-slate-900">UoL_SHIBBOLETH</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-500">
                            <span>STUDENT_ID:</span>
                            <span className="font-bold text-slate-900">{userEmail}</span>
                          </div>
                        </div>

                        {/* Brutalist SSO Button */}
                        <button
                          id="btn-initialize-login"
                          onClick={handleSSOLogin}
                          className="sso-btn w-full bg-[#1e1e1e] text-white border-2 border-[#1e1e1e] p-4 font-mono-code text-sm sm:text-base font-bold cursor-pointer shadow-brutal-accent hover:bg-black hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                          &gt; INITIALIZE_LOGIN
                        </button>

                        <div className="pt-4 border-t-2 border-dashed border-slate-200 text-center space-y-2">
                          <p className="text-xs font-mono-code text-slate-500">Not purchased your BioSoc membership yet?</p>
                          <a
                            href="https://www.leicesterunion.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block w-full py-2 bg-[#fde047] border-2 border-[#1e1e1e] font-mono-code font-bold text-xs text-[#1e1e1e] shadow-brutal-sm hover:bg-[#fef08a]"
                          >
                            PURCHASE MEMBERSHIP ON LEICESTER SU (£5/YR)
                          </a>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    /* UNLOCKED Members Portal Views */
                    <div className="space-y-6">
                      
                      {/* Unlocked Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1e1e1e] pb-4">
                        <div>
                          <div className="label-tag bg-[#4ade80] text-[#1e1e1e] mb-1">
                            <ShieldCheck size={12} /> AUTHENTICATED_SESSION // {userEmail}
                          </div>
                          <h2 className="font-gaegu text-3xl sm:text-4xl font-bold text-slate-900 leading-none">
                            {activeMemberNav === 'vault' && 'Academic Vault & Module Guides'}
                            {activeMemberNav === 'discounts' && 'Exclusive Member Partner Discounts'}
                            {activeMemberNav === 'careers' && 'Biosciences Placements & Careers Hub'}
                            {activeMemberNav === 'alumni' && 'Verified Alumni Mentorship Network'}
                            {activeMemberNav === 'committee_docs' && 'Committee Governance & Minutes'}
                          </h2>
                        </div>

                        {/* Search in portal */}
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search resources..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-8 pr-3 py-1.5 text-xs font-mono-code border-2 border-[#1e1e1e] bg-white focus:outline-none focus:bg-slate-50 w-44 sm:w-56"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Sub-view 1: Academic Vault */}
                      {activeMemberNav === 'vault' && (
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            Curated revision packs, lab report formatting standards, and statistical analysis cheat sheets vetted by 3rd-year reps and academic staff.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { title: 'BS1030 Lab Report Structure & Statistics Template', module: 'BS1030', level: 'Year 1 Core', type: 'PDF + DOCX', downloads: '342' },
                              { title: 'BS2002 Molecular Cell Biology Revision Synthesis', module: 'BS2002', level: 'Year 2', type: 'Study Pack', downloads: '289' },
                              { title: 'R-Studio Biostatistics Script for Ecology & Genetics', module: 'GEN_STAT', level: 'All Years', type: 'R Script', downloads: '415' },
                              { title: 'Dissertation Literature Review Guide (Adrian Faculty)', module: 'BS3001', level: 'Year 3', type: 'Handout', downloads: '198' },
                              { title: 'Medical Genetics Cytogenetics Exam Breakdown', module: 'MD2014', level: 'Year 2 MedGen', type: 'Q&A Bank', downloads: '164' },
                              { title: 'Microscopy Image Analysis using ImageJ / Fiji', module: 'LAB_TECH', level: 'Practical', type: 'Video Walkthrough', downloads: '310' },
                            ]
                            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.module.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((doc, i) => (
                              <div key={i} className="border-[2.5px] border-[#1e1e1e] p-4 bg-white shadow-brutal-sm flex flex-col justify-between hover:shadow-brutal transition-all">
                                <div>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="label-tag text-[9px] bg-[#60a5fa] text-[#1e1e1e]">{doc.module}</span>
                                    <span className="text-[10px] font-mono-code font-bold text-slate-500">{doc.level}</span>
                                  </div>
                                  <h4 className="font-bold text-sm text-slate-900 mb-1">{doc.title}</h4>
                                  <div className="flex items-center gap-3 text-xs font-mono-code text-slate-500 mt-2">
                                    <span>TYPE: {doc.type}</span>
                                    <span>•</span>
                                    <span>{doc.downloads} downloads</span>
                                  </div>
                                </div>
                                <button className="mt-3 w-full py-1.5 bg-[#4ade80] border-2 border-[#1e1e1e] font-mono-code font-bold text-xs hover:bg-[#86efac] flex items-center justify-center gap-1.5">
                                  <Download size={13} /> DOWNLOAD_ASSET
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-view 2: Partner Discounts */}
                      {activeMemberNav === 'discounts' && (
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            Show your verified BioSoc membership card or utilize the single-use discount tokens below for textbooks, lab coats, and local student food spots.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { partner: 'Oxford University Press Life Sciences', offer: '25% Off Biosciences Textbooks', code: 'BIOSOC-OUP-25', tag: 'ACADEMIC' },
                              { partner: 'Medisave UK Lab Equipment', offer: '15% Off Lab Coats & Dissection Kits', code: 'LEICESTER-LAB15', tag: 'EQUIPMENT' },
                              { partner: 'Grays Coffee Yard (Leicester)', offer: '20% Off Coffee & Lunch with Student ID', code: 'SHOW_DIGITAL_CARD', tag: 'FOOD_DRINK' },
                              { partner: 'Biochemical Society Membership', offer: 'Free 1-Year Affiliate Student Pass', code: 'UOL-BIOSOC-FREE', tag: 'AFFILIATION' },
                            ].map((disc, i) => (
                              <div key={i} className="border-[2.5px] border-[#1e1e1e] p-4 bg-[#f8fafc] shadow-brutal-sm flex flex-col justify-between">
                                <div>
                                  <span className="label-tag text-[9px] bg-[#fde047] text-[#1e1e1e] mb-2">{disc.tag}</span>
                                  <h4 className="font-bold text-sm text-slate-900">{disc.partner}</h4>
                                  <p className="text-xs font-semibold text-emerald-700 mt-1">{disc.offer}</p>
                                </div>
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                  <div className="text-[10px] font-mono-code text-slate-500 mb-1">DISCOUNT CODE:</div>
                                  <div className="font-mono-code text-xs font-bold bg-white border-2 border-dashed border-[#1e1e1e] p-2 text-center select-all">
                                    {disc.code}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-view 3: Careers & Roles */}
                      {activeMemberNav === 'careers' && (
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            Curated internships, summer studentships, and graduate laboratory roles reserved for Leicester bioscience cohorts.
                          </p>

                          <div className="space-y-3">
                            {[
                              { role: 'Summer Undergraduate Research Intern (SURI)', company: 'Wellcome Trust Sanger Institute', loc: 'Hinxton / Remote', deadline: '30 Nov 2026', stipend: '£420/week' },
                              { role: 'Industrial Year Placement: Drug Metabolism & Pharmacokinetics', company: 'AstraZeneca Macclesfield', loc: 'Cheshire, UK', deadline: '15 Dec 2026', stipend: '£23,500 pa' },
                              { role: 'Clinical Trial Laboratory Associate', company: 'University Hospitals of Leicester NHS Trust', loc: 'Leicester Royal Infirmary', deadline: '05 Jan 2027', stipend: 'NHS Band 4' },
                            ].map((job, i) => (
                              <div key={i} className="border-[2.5px] border-[#1e1e1e] p-4 bg-white shadow-brutal-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                                <div>
                                  <span className="label-tag text-[9px] bg-[#60a5fa] text-[#1e1e1e] mb-1">PLACEMENTS</span>
                                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{job.role}</h4>
                                  <p className="text-xs font-semibold text-slate-700">{job.company} • {job.loc}</p>
                                  <p className="text-xs font-mono-code text-emerald-700 font-bold mt-1">Stipend: {job.stipend} | Closes: {job.deadline}</p>
                                </div>
                                <button className="btn-brutal text-xs font-mono-code font-bold px-3 py-2 shrink-0">
                                  APPLY_VIA_PORTAL
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-view 4: Alumni Network */}
                      {activeMemberNav === 'alumni' && (
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            Connect 1-on-1 with verified Leicester Biological Sciences alumni for career mentorship, CV reviews, and postgraduate guidance.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { name: 'Dr. Sarah Jenkins', grad: 'BSc 2019, PhD 2023', role: 'Senior Bioinformatician at Illumina', area: 'Genomics & Python' },
                              { name: 'Marcus Sterling', grad: 'BSc Biomedical 2021', role: 'Clinical Scientist at NHS England', area: 'Immunology & Diagnostics' },
                              { name: 'Aaliyah Khan', grad: 'BSc Biological Sci 2022', role: 'Medical Science Liaison at Novartis', area: 'Pharma & Regulatory' },
                              { name: 'David Thorne', grad: 'BSc Medical Genetics 2020', role: 'Science Policy Advisor at Wellcome Trust', area: 'Bioethics & Policy' },
                            ].map((alum, i) => (
                              <div key={i} className="border-[2.5px] border-[#1e1e1e] p-4 bg-white shadow-brutal-sm flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-bold text-sm text-slate-900">{alum.name}</h4>
                                    <span className="text-[10px] font-mono-code text-slate-500">{alum.grad}</span>
                                  </div>
                                  <p className="text-xs font-semibold text-blue-600">{alum.role}</p>
                                  <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 border border-slate-200">
                                    Focus: <strong>{alum.area}</strong>
                                  </p>
                                </div>
                                <button className="mt-3 w-full py-1.5 bg-[#fde047] border-2 border-[#1e1e1e] font-mono-code font-bold text-xs hover:bg-[#fef08a]">
                                  REQUEST_MENTOR_CHAT
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sub-view 5: Committee Documents (Google Drive Integration) */}
                      {activeMemberNav === 'committee_docs' && (
                        <div className="space-y-4">
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">
                            Full transparency records for society members: AGM minutes, constitution, financial budget disclosures, and handover guidelines. Connected directly to our Google Drive.
                          </p>

                          {!driveToken ? (
                            <div className="border-[3px] border-[#1e1e1e] p-6 bg-slate-50 text-center space-y-4">
                              <h3 className="font-gaegu text-2xl font-bold">Connect Google Drive</h3>
                              <p className="text-sm text-slate-600">Please sign in with Google to access the society's internal documents from Google Drive.</p>
                              <button 
                                onClick={handleDriveLogin} 
                                disabled={isLoggingIn}
                                className="gsi-material-button mx-auto"
                              >
                                <div className="gsi-material-button-state"></div>
                                <div className="gsi-material-button-content-wrapper">
                                  <div className="gsi-material-button-icon">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block'}}>
                                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                      <path fill="none" d="M0 0h48v48H0z"></path>
                                    </svg>
                                  </div>
                                  <span className="gsi-material-button-contents">{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                                  <span style={{display: 'none'}}>Sign in with Google</span>
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center bg-[#fef08a] border-2 border-[#1e1e1e] p-2 text-xs font-mono-code font-bold">
                                <span>Connected as: {driveUser?.email}</span>
                                <button onClick={logout} className="underline hover:text-slate-600">Disconnect</button>
                              </div>

                              {isLoadingDrive ? (
                                <div className="text-center p-6 text-sm font-mono-code text-slate-500 border-2 border-dashed border-slate-300">
                                  FETCHING_DOCS_FROM_DRIVE...
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {driveFiles.length === 0 ? (
                                    <div className="text-center p-6 text-sm font-mono-code text-slate-500 border-2 border-dashed border-slate-300">
                                      NO_DOCUMENTS_FOUND
                                    </div>
                                  ) : (
                                    driveFiles.map((file) => (
                                      <div key={file.id} className="border-2 border-[#1e1e1e] p-3 bg-white flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                          {file.iconLink && <img src={file.iconLink} alt="" className="w-5 h-5" />}
                                          <div>
                                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">{file.name}</h4>
                                            <span className="text-[10px] font-mono-code text-slate-500">
                                              Modified: {new Date(file.createdTime).toLocaleDateString()}
                                            </span>
                                          </div>
                                        </div>
                                        <a 
                                          href={file.webViewLink} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="btn-brutal text-xs font-mono-code px-2.5 py-1 font-bold inline-block"
                                        >
                                          OPEN_IN_DRIVE <ExternalLink size={10} className="inline ml-1 mb-0.5"/>
                                        </a>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

            </main>
          </div>
        )}
        
        {mainTab === 'strategy' && (
          /* Strategy Document Tab - Consultant Report */
          <div className="p-6 sm:p-10 space-y-10 bg-white min-h-[660px] overflow-y-auto">
            <header className="max-w-3xl space-y-2">
              <div className="label-tag bg-[#60a5fa] text-[#1e1e1e]">
                STRATEGY_BRIEF // UOL_BIOSOC_CONSULTANCY
              </div>
              <h1 className="font-gaegu text-4xl sm:text-6xl font-bold text-[#1e1e1e] leading-tight">
                BioSoc Strategy & Architectural Blueprint
              </h1>
              <div className="marker-underline-blue"></div>
              <p className="text-slate-700 text-base font-medium leading-relaxed">
                Strategic recommendations and operational design formulated to transform the University of Leicester Biosciences Society into one of the top academic societies in the UK.
              </p>
            </header>

            {/* 5 Strategy Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8">
              
              {/* 1. Vision */}
              <section className="md:col-span-12 border-[3px] border-[#1e1e1e] p-6 sm:p-8 bg-[#f8fafc] shadow-brutal space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#4ade80] border-2 border-[#1e1e1e] text-[#1e1e1e] shadow-brutal-sm">
                    <Presentation size={22} />
                  </div>
                  <h2 className="font-gaegu text-3xl sm:text-4xl font-bold text-[#1e1e1e]">1. Strategic Vision</h2>
                </div>
                <div className="marker-underline"></div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  To establish the University of Leicester BioSoc website as the indispensable day-to-day operating system for life science students. Rather than remaining an unvisited informational brochure, the website functions as a utility hub providing immediate academic survival tools (lab report frameworks, module study banks) and career launches (placements, alumni mentorship).
                </p>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                  By gating tangible academic advantages behind a frictionless £5 membership login, the platform mechanically drives high-volume society uptake during Freshers and sustains engagement across all three terms.
                </p>
              </section>

              {/* 2. Site Map */}
              <section className="md:col-span-6 border-[3px] border-[#1e1e1e] p-6 bg-white shadow-brutal space-y-4">
                <div className="flex items-center gap-2">
                  <FileSymlink className="text-[#60a5fa]" size={22} />
                  <h2 className="font-gaegu text-3xl font-bold text-[#1e1e1e]">2. Site Map Architecture</h2>
                </div>
                <div className="space-y-4 text-xs font-mono-code">
                  <div className="p-3 bg-blue-50 border-2 border-[#1e1e1e]">
                    <strong className="block text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                      <Globe size={14} className="text-blue-600" /> PUBLIC SECTION (Open Web)
                    </strong>
                    <ul className="space-y-1.5 text-slate-700 pl-3 border-l-2 border-blue-300">
                      <li>• /about - Society Dossier & Mission</li>
                      <li>• /committee - Elected Officer Directory</li>
                      <li>• /events - Term Calendar & Ticket Links</li>
                      <li>• /gallery - Event Photos & Social Highlights</li>
                      <li>• /sponsors - Industry Partners & Faculty Links</li>
                      <li>• /careers-teaser - Overview of Alumni Pathways</li>
                      <li>• /join - Leicester SU Purchase Gateway</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-emerald-50 border-2 border-[#1e1e1e]">
                    <strong className="block text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                      <Lock size={14} className="text-emerald-600" /> MEMBERS PORTAL (SSO Locked)
                    </strong>
                    <ul className="space-y-1.5 text-slate-700 pl-3 border-l-2 border-emerald-300">
                      <li>• /portal/vault - Exam Packs & Lab Report Templates</li>
                      <li>• /portal/discounts - Partner Promo Codes (Textbooks, Kits)</li>
                      <li>• /portal/placements - Curated Summer Studentships</li>
                      <li>• /portal/alumni - Mentorship Matching Directory</li>
                      <li>• /portal/governance - AGMs, Minutes & Handover Docs</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. Key Features */}
              <section className="md:col-span-6 border-[3px] border-[#1e1e1e] p-6 bg-white shadow-brutal space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-[#4ade80]" size={22} />
                  <h2 className="font-gaegu text-3xl font-bold text-[#1e1e1e]">3. Key Value Drivers</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border-2 border-[#1e1e1e]">
                    <span className="label-tag bg-[#1e1e1e] text-white text-[9px] mb-1">AUTHENTICATION</span>
                    <h4 className="font-bold text-sm text-slate-900">Institutional SSO Verification</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Direct integration with Leicester SU or University SSO via university email handles (<code className="font-bold">@student.le.ac.uk</code>) ensures immediate access without separate manual password creation.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border-2 border-[#1e1e1e]">
                    <span className="label-tag bg-[#4ade80] text-[#1e1e1e] text-[9px] mb-1">CONTINUITY</span>
                    <h4 className="font-bold text-sm text-slate-900">Zero-Friction Handover Protocol</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Standardized template repositories and automated governance logs prevent the common student society failure mode of losing institutional memory during annual committee transitions.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border-2 border-[#1e1e1e]">
                    <span className="label-tag bg-[#fde047] text-[#1e1e1e] text-[9px] mb-1">CONVERSION</span>
                    <h4 className="font-bold text-sm text-slate-900">Teaser-to-Paywall UX</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Publicly showcasing module report previews (e.g. BS1030) with blurred content creates high-intent motivation for first-year students to purchase membership during week 1.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Membership Benefits */}
              <section className="md:col-span-6 border-[3px] border-[#1e1e1e] p-6 bg-white shadow-brutal space-y-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-[#fde047]" size={22} />
                  <h2 className="font-gaegu text-3xl font-bold text-[#1e1e1e]">4. Membership Proposition (£5/yr)</h2>
                </div>
                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  {[
                    { title: 'Academic Survival Vault', desc: 'Instant access to lab write-up models, R statistical code, and revision summaries.' },
                    { title: 'Exclusive Partner Reductions', desc: 'Discounts on Oxford University Press textbooks, dissection kits, and social tickets.' },
                    { title: 'Mentorship Access', desc: 'Direct message channels to Leicester alumni in pharma, NHS, and academic research.' },
                    { title: 'Priority Lab & Tour Booking', desc: 'Reserved first-round ticketing for industrial visits to AstraZeneca & Sanger.' },
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-2.5 p-2.5 bg-slate-50 border border-[#1e1e1e]">
                      <CheckCircle2 size={16} className="text-[#4ade80] shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-slate-900">{benefit.title}</strong>
                        <span className="text-slate-600 text-[11px]">{benefit.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Future Expansion */}
              <section className="md:col-span-6 border-[3px] border-[#1e1e1e] p-6 bg-white shadow-brutal space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="text-[#f472b6]" size={22} />
                  <h2 className="font-gaegu text-3xl font-bold text-[#1e1e1e]">5. Future Expansion Ideas</h2>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-pink-50 border border-[#1e1e1e]">
                    <strong className="block text-slate-900 text-sm mb-1">1. Automated Mentor Pairing Algorithm</strong>
                    <p className="text-slate-600 text-[11px]">
                      Match 1st-year students with 3rd-year/PGT mentors based on career tracks (Clinical Genetics, Bioinformatics, Ecology).
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-[#1e1e1e]">
                    <strong className="block text-slate-900 text-sm mb-1">2. Digital QR Event Check-in Pass</strong>
                    <p className="text-slate-600 text-[11px]">
                      Integrate Apple/Google Wallet membership cards with live dynamic QR codes for one-tap entry at BioBall and guest lectures.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-[#1e1e1e]">
                    <strong className="block text-slate-900 text-sm mb-1">3. Undergraduate Research Journal Portal</strong>
                    <p className="text-slate-600 text-[11px]">
                      Publish an annual open-access BioSoc Leicester student research journal giving undergraduates peer-reviewed publication credentials.
                    </p>
                  </div>
                </div>
              </section>

            </div>

            <div className="pt-6 border-t-2 border-[#1e1e1e] flex justify-between items-center">
              <button
                onClick={() => setMainTab('prototype')}
                className="btn-brutal px-6 py-3 font-mono-code font-bold text-xs sm:text-sm flex items-center gap-2"
              >
                &lt; BACK_TO_INTERACTIVE_PROTOTYPE
              </button>
              <span className="text-xs font-mono-code text-slate-500 font-bold hidden sm:inline-block">
                STATUS: APPROVED_STRATEGY_DRAFT
              </span>
            </div>
          </div>
        )}

        {/* Footer Bar (Laboratory Ledger Theme) */}
        <footer className="border-t-[3px] border-[#1e1e1e] bg-[#eeeeee] px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono-code text-[10px] sm:text-[11px] font-bold text-[#1e1e1e] z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] border border-[#1e1e1e]"></span>
            <span>BIO_SOC_LEICESTER v2.4.0</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="https://le.ac.uk/biological-sciences" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 underline underline-offset-2 flex items-center gap-1">
              UoL School of Biological Sciences <ExternalLink size={10} />
            </a>
          </div>
          <div className="text-[#1e1e1e]">
            STAY_CURIOUS.SH ✨
          </div>
        </footer>

      </div>
    </div>
  );
}
