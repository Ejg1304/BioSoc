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
  Lightbulb, Award, HeartHandshake, Eye, Link as LinkIcon,
  Star, HelpCircle, ChevronDown, Gift
} from 'lucide-react';

type MainTab = 'prototype' | 'strategy';
type PublicSection = 'about' | 'committee' | 'photos' | 'sponsors' | 'links' | 'perks' | 'faq';
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
                      { id: 'links', label: 'Quick Link BioSoc', icon: LinkIcon },
                      { id: 'about', label: 'About Society', icon: Building2 },
                      { id: 'committee', label: 'Committee', icon: Users },
                      { id: 'photos', label: 'Event Photos & Gallery', icon: Camera },
                      { id: 'sponsors', label: 'Sponsors & Partners', icon: Award },
                      { id: 'perks', label: 'Membership Perks', icon: Gift },
                      { id: 'faq', label: 'FAQ', icon: HelpCircle },
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
                      <Lock size={11} /> MEMBERS_PORTAL
                    </span>
                    {isMemberAuthenticated ? (
                      <span className="text-[9px] text-[#4ade80] font-mono-code font-bold">UNLOCKED</span>
                    ) : (
                      <span className="text-[9px] text-fuchsia-300 font-mono-code font-bold bg-[#1e1e1e] border border-fuchsia-300 px-1 rounded-sm">MEMBERS_ONLY</span>
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
                        <LinkIcon size={12} /> BIOLINKS
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

                  {/* Under Construction Sections */}
                  {['committee', 'photos', 'sponsors', 'perks', 'faq'].includes(activePublicNav) && (
                    <div className="space-y-6 text-center py-16">
                      <div className="inline-block p-6 border-[3px] border-[#1e1e1e] shadow-brutal bg-[#fde047] rotate-[-2deg]">
                        <h2 className="font-gaegu text-4xl sm:text-6xl font-bold text-[#1e1e1e]">
                          COMING SOON
                        </h2>
                      </div>
                      <p className="text-slate-700 font-medium font-mono-code mt-6 max-w-md mx-auto leading-relaxed border-2 border-dashed border-slate-300 p-4">
                        This section is currently under construction for the new academic year. Check back closer to Freshers Week!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Members Portal Section Views */}
              {portalMode === 'members' && (
                <div className="relative z-10 w-full h-full flex flex-col">
                  
                  {/* Bootleg Mode - Portal Under Construction */}
                  <div className="my-auto py-8 max-w-lg mx-auto w-full text-center space-y-6">
                    <div className="inline-block p-6 border-[3px] border-[#1e1e1e] shadow-brutal bg-[#4ade80] rotate-[2deg]">
                      <h2 className="font-gaegu text-4xl sm:text-6xl font-bold text-[#1e1e1e]">
                        PORTAL OFFLINE
                      </h2>
                    </div>
                    <p className="text-slate-700 font-medium font-mono-code mt-6 leading-relaxed border-2 border-dashed border-slate-300 p-4 bg-white">
                      The Member Portal is currently being upgraded for the 2025/2026 academic year. Access to the Vault and Placements board will unlock in September!
                    </p>
                  </div>
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
                    <h4 className="font-bold text-sm text-slate-900">Membership Conversion UX</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Publicly showcasing module report previews (e.g. BS1030) with blurred content creates high-intent motivation for first-year students to purchase SU membership during week 1.
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
