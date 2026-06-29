import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  BrainCircuit, 
  Users, 
  FileText, 
  CheckCircle2, 
  Mail, 
  Edit3, 
  Eye, 
  RotateCcw, 
  Download, 
  Github, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronRight, 
  Settings2,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { initialCourses } from "./data";
import { Course, CourseModule } from "./types";

export default function App() {
  // Load courses from localStorage if available, otherwise use initial defaults
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("redcross_pfa_courses");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error reading saved courses", e);
      }
    }
    return initialCourses;
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>("pfa-plus");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Track open state for module detail accordions
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Auto-save courses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("redcross_pfa_courses", JSON.stringify(courses));
  }, [courses]);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all course contents to original Singapore Red Cross defaults?")) {
      setCourses(initialCourses);
      localStorage.removeItem("redcross_pfa_courses");
    }
  };

  const handleUpdateCourseField = (field: keyof Course, value: any) => {
    setCourses(prev => prev.map(c => c.id === selectedCourseId ? { ...c, [field]: value } : c));
  };

  const handleUpdateModuleField = (moduleId: string, field: keyof CourseModule, value: any) => {
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.map(m => m.id === moduleId ? { ...m, [field]: value } : m)
        };
      }
      return c;
    }));
  };

  const handleAddModule = () => {
    const nextNum = activeCourse.modules.length + 1;
    const newModule: CourseModule = {
      id: `m-custom-${Date.now()}`,
      num: nextNum,
      title: `Module ${nextNum}: New Session`,
      description: "Enter a brief summary of what will be learned in this module.",
      objectives: ["First learning objective of this custom session."]
    };
    handleUpdateCourseField("modules", [...activeCourse.modules, newModule]);
  };

  const handleRemoveModule = (moduleId: string) => {
    const filtered = activeCourse.modules.filter(m => m.id !== moduleId);
    const reindexed = filtered.map((m, idx) => ({ ...m, num: idx + 1 }));
    handleUpdateCourseField("modules", reindexed);
  };

  const handleAddModuleObjective = (moduleId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              const currentObjs = m.objectives || [];
              return { ...m, objectives: [...currentObjs, "New learning objective detail"] };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const handleUpdateModuleObjective = (moduleId: string, objIndex: number, val: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              const currentObjs = [...(m.objectives || [])];
              currentObjs[objIndex] = val;
              return { ...m, objectives: currentObjs };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const handleRemoveModuleObjective = (moduleId: string, objIndex: number) => {
    setCourses(prev => prev.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          modules: c.modules.map(m => {
            if (m.id === moduleId) {
              const currentObjs = [...(m.objectives || [])];
              currentObjs.splice(objIndex, 1);
              return { ...m, objectives: currentObjs };
            }
            return m;
          })
        };
      }
      return c;
    }));
  };

  const handleAddLearnBullet = () => {
    handleUpdateCourseField("learnBullets", [...activeCourse.learnBullets, "New key takeaway"]);
  };

  const handleRemoveLearnBullet = (index: number) => {
    const updated = [...activeCourse.learnBullets];
    updated.splice(index, 1);
    handleUpdateCourseField("learnBullets", updated);
  };

  const handleUpdateLearnBullet = (index: number, val: string) => {
    const updated = [...activeCourse.learnBullets];
    updated[index] = val;
    handleUpdateCourseField("learnBullets", updated);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "pfa_courses_content.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Helper to dynamically render corresponding icon for each course
  const getCourseIcon = (courseId: string, className: string = "w-6 h-6") => {
    switch (courseId) {
      case "pfa-plus":
        return <Heart className={`${className} text-[#e60000]`} />;
      case "pfa-advanced":
        return <BrainCircuit className={`${className} text-[#e60000]`} />;
      case "pfa-groups":
        return <Users className={`${className} text-[#e60000]`} />;
      case "pfa-customised":
        return <FileText className={`${className} text-[#e60000]`} />;
      default:
        return <Heart className={`${className} text-[#e60000]`} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col justify-between">
      
      {/* Red Cross Header branding bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Elegant Red Cross Brand Icon */}
            <div className="bg-[#e60000] p-2 rounded-lg flex items-center justify-center shadow-md shadow-red-200 animate-pulse">
              <span className="text-white font-bold text-xl leading-none font-display">+</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-wide text-[#e60000] uppercase font-display">Singapore Red Cross Academy</h1>
              <p className="text-xs text-slate-500 font-mono">Psychological First Aid Department</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="btn-toggle-editor"
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isEditorOpen 
                  ? "bg-amber-100 text-amber-800 border border-amber-200" 
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
              }`}
            >
              {isEditorOpen ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Only</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Customize Content</span>
                </>
              )}
            </button>

            <button
              id="btn-deploy-guide"
              onClick={() => setIsDeployGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-slate-900 text-white hover:bg-slate-800 transition-all border border-slate-950 shadow-sm"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Host on GitHub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Title area matching screenshot */}
        <div className="mb-8">
          <h2 id="page-title" className="text-3xl font-bold tracking-tight text-slate-900 font-display sm:text-4xl">
            Explore Our Psychological First Aid Courses
          </h2>
          <p id="page-subtitle" className="mt-2 text-base text-slate-500">
            Choose a course to learn more about how it fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT/CENTER STAGE: Course Showcase (Takes 8 cols normally, or 7 if customizer is open) */}
          <div className={`transition-all duration-300 ${isEditorOpen ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"}`}>
            
            {/* Course horizontal tabs selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {courses.map((course) => {
                const isActive = course.id === selectedCourseId;
                return (
                  <button
                    id={`tab-course-${course.id}`}
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setExpandedModuleId(null);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-white border-[#e60000] ring-3 ring-red-100 shadow-md"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                    }`}
                  >
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      isActive ? "bg-red-50" : "bg-slate-50"
                    }`}>
                      {getCourseIcon(course.id, "w-6 h-6")}
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold leading-snug tracking-tight ${
                        isActive ? "text-[#e60000]" : "text-slate-800"
                      }`}>
                        {course.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active course detailed showcase box */}
            <div id="course-details-box" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
              
              {/* Top part: details grid */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch border-b border-slate-100">
                
                {/* Visual Circle & Base Info (takes 5 cols) */}
                <div className="md:col-span-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      {/* Round logo circle */}
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shadow-inner">
                        {getCourseIcon(activeCourse.id, "w-8 h-8")}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-slate-900 font-display">
                          {activeCourse.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {activeCourse.shortDescription}
                    </p>

                    <div>
                      <h5 className="text-xs font-bold text-[#e60000] uppercase tracking-wider mb-2 font-display">
                        Who it's for
                      </h5>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {activeCourse.whoItIsFor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bullets: "You will learn to" (takes 3 cols) */}
                <div className="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 flex flex-col">
                  <h5 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 font-display">
                    You will learn to:
                  </h5>
                  <ul className="space-y-3.5 flex-grow">
                    {activeCourse.learnBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 text-sm leading-snug">
                          {bullet}
                        </span>
                      </li>
                    ))}
                    {activeCourse.learnBullets.length === 0 && (
                      <li className="text-xs text-slate-400 italic">No custom points added. Click customize to add some!</li>
                    )}
                  </ul>
                </div>

                {/* Right Action side: "Enquire Button" linked to email (takes 3 cols) */}
                <div className="md:col-span-3 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between text-left">
                  <div className="space-y-3 flex-grow flex flex-col justify-start">
                    <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center border border-red-100 text-[#e60000] mb-1">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h5 className="font-semibold text-slate-800 text-sm font-display">
                      Have Questions?
                    </h5>
                    <p className="text-xs text-slate-500 leading-normal">
                      Connect with our Academy consultants regarding schedule, pricing, or bespoke corporate booking packages.
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <a
                      id="btn-enquiry"
                      href={`mailto:${activeCourse.enquiryEmail}?subject=Enquiry%20regarding%20${encodeURIComponent(activeCourse.title)}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e60000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <span>Enquire Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                    <p className="text-[11px] text-slate-400 mt-2 font-mono text-left">
                      {activeCourse.enquiryEmail}
                    </p>
                  </div>
                </div>

              </div>

              {/* Bottom part: "What You'll Learn in This Course" */}
              <div className="bg-slate-50/50 p-6 sm:p-8">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 font-display">
                  What You'll Learn in This Course
                </h4>

                <div className="grid grid-cols-1 gap-4">
                  {activeCourse.modules.map((mod, index) => {
                    return (
                      <div
                        id={`module-card-${mod.id}`}
                        key={mod.id}
                        className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-xs transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* Module Number badge */}
                          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e60000] font-bold text-sm flex items-center justify-center flex-shrink-0 font-mono shadow-inner border border-red-100">
                            {String(mod.num || index + 1).padStart(2, '0')}
                          </div>
                          
                          {/* Title & Description */}
                          <div className="flex-grow">
                            <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-display">
                              {mod.title}
                            </h5>
                            <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                              {mod.description}
                            </p>

                            {/* Learning Objectives List - Multi objectives support */}
                            {mod.objectives && mod.objectives.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-slate-100">
                                <span className="text-[10px] font-bold tracking-widest text-[#e60000] uppercase font-display block mb-2">
                                  Learning Objectives
                                </span>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                                  {mod.objectives.map((obj, oIdx) => (
                                    <li key={oIdx} className="flex items-start gap-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                                      <span>{obj}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeCourse.id !== "pfa-customised" && (
                  <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 p-4 rounded-xl border border-slate-200/40">
                    <div className="text-left">
                      <h5 className="font-semibold text-slate-800 text-xs sm:text-sm font-display uppercase tracking-wider text-[#e60000]">
                        Looking for the Syllabus?
                      </h5>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Read full curriculum outline, schedules, assessment structures, and physical academy locations.
                      </p>
                    </div>
                    <a
                      id="btn-course-outline"
                      href={activeCourse.courseOutlineUrl || "https://academy.redcross.sg"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-300 hover:border-slate-400 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>Read Course Outline</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Quick explanation banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-blue-800 uppercase tracking-wide">Client-Side Customisation Included</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  This showcase loads automatically with the four official Singapore Red Cross Psychological First Aid classes. Tap <strong>"Customize Content"</strong> at the top right to replace course writeups, objectives, module steps, or change the emails before exporting!
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Real-Time Content Editor Panel (Active only when toggled) */}
          <AnimatePresence>
            {isEditorOpen && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="col-span-1 lg:col-span-5 xl:col-span-4 bg-white border border-amber-200 rounded-2xl shadow-lg p-6 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">
                      Course Customiser
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditorOpen(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>

                <div className="text-[11px] bg-amber-50 text-amber-800 p-3 rounded-lg mb-4 leading-normal flex items-start gap-1.5 border border-amber-100">
                  <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    Select a course tab on the left to modify its specific fields here. Edits persist instantly in local storage.
                  </span>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  
                  {/* Course Title field */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Course Title</label>
                    <input
                      type="text"
                      value={activeCourse.title}
                      onChange={(e) => handleUpdateCourseField("title", e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-amber-500 font-medium"
                    />
                  </div>

                  {/* Course Description */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Course Description</label>
                    <textarea
                      rows={3}
                      value={activeCourse.shortDescription}
                      onChange={(e) => handleUpdateCourseField("shortDescription", e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  {/* Who it's for */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Who it's for</label>
                    <textarea
                      rows={2}
                      value={activeCourse.whoItIsFor}
                      onChange={(e) => handleUpdateCourseField("whoItIsFor", e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  {/* Enquiry email */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Enquiry Email Address</label>
                    <input
                      type="email"
                      value={activeCourse.enquiryEmail}
                      onChange={(e) => handleUpdateCourseField("enquiryEmail", e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-amber-500 font-mono"
                    />
                  </div>

                  {/* Course Outline URL */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Course Outline URL Link</label>
                    <input
                      type="url"
                      value={activeCourse.courseOutlineUrl || ""}
                      onChange={(e) => handleUpdateCourseField("courseOutlineUrl", e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-amber-500 font-mono"
                      placeholder="https://academy.redcross.sg"
                    />
                  </div>

                  {/* Bullets List "You will learn to" */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Key takeaways ("You will learn to:")</label>
                      <button
                        onClick={handleAddLearnBullet}
                        className="text-[10px] text-amber-700 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-2">
                      {activeCourse.learnBullets.map((bullet, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => handleUpdateLearnBullet(idx, e.target.value)}
                            className="flex-grow text-xs border border-slate-300 rounded-lg p-2 focus:outline-hidden focus:border-amber-500"
                          />
                          <button
                            onClick={() => handleRemoveLearnBullet(idx)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete takeaway"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Modules Customizer */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Modules (What you will learn)</label>
                      <button
                        onClick={handleAddModule}
                        className="text-[10px] text-amber-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Add Module
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {activeCourse.modules.map((mod, index) => (
                        <div key={mod.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 relative">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-grow">
                              <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm font-mono font-bold">
                                #{mod.num || index + 1}
                              </span>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => handleUpdateModuleField(mod.id, "title", e.target.value)}
                                className="flex-grow text-xs border border-slate-300 rounded-md p-1.5 bg-white focus:outline-hidden focus:border-amber-500 font-bold"
                                placeholder="Module Title"
                              />
                            </div>
                            <button
                              onClick={() => handleRemoveModule(mod.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete Module"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Description</label>
                            <textarea
                              rows={2}
                              value={mod.description}
                              onChange={(e) => handleUpdateModuleField(mod.id, "description", e.target.value)}
                              className="w-full text-xs border border-slate-300 rounded-md p-1.5 bg-white focus:outline-hidden focus:border-amber-500 leading-normal"
                              placeholder="Brief description..."
                            />
                          </div>

                          {/* Objectives editor inside each module */}
                          <div className="bg-white rounded-lg p-2.5 border border-slate-200/60 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">Learning Objectives:</span>
                              <button
                                onClick={() => handleAddModuleObjective(mod.id)}
                                className="text-[9px] text-amber-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <Plus className="w-2.5 h-2.5" /> Add Objective
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {(!mod.objectives || mod.objectives.length === 0) && (
                                <p className="text-[10px] text-slate-400 italic">No objectives added yet.</p>
                              )}
                              {mod.objectives && mod.objectives.map((obj, objIdx) => (
                                <div key={objIdx} className="flex gap-1.5 items-center">
                                  <input
                                    type="text"
                                    value={obj}
                                    onChange={(e) => handleUpdateModuleObjective(mod.id, objIdx, e.target.value)}
                                    className="flex-grow text-[11px] border border-slate-200 rounded-md p-1 focus:outline-hidden focus:border-amber-500 bg-slate-50/30"
                                    placeholder="Objective detail..."
                                  />
                                  <button
                                    onClick={() => handleRemoveModuleObjective(mod.id, objIdx)}
                                    className="p-1 text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Delete objective"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Editor bottom CTA actions */}
                <div className="pt-4 mt-4 border-t border-slate-200 space-y-2">
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Custom Content JSON</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset default SRC courses</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-3">
            <span className="text-[#e60000] font-bold text-lg">+</span>
            <span className="font-semibold text-slate-300 tracking-wider font-display uppercase">Singapore Red Cross Society</span>
          </div>
          <p className="max-w-md mx-auto text-slate-500 leading-relaxed">
            Singapore Red Cross Academy is registered under the Charities Act and is dedicated to training community members in life-saving first aid.
          </p>
          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
            <div>
              &copy; {new Date().getFullYear()} Singapore Red Cross. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="mailto:academy@redcross.sg" className="hover:text-slate-300 transition-colors">
                academy@redcross.sg
              </a>
              <span>&bull;</span>
              <button onClick={() => setIsDeployGuideOpen(true)} className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1">
                <Github className="w-3 h-3" /> GitHub Deployment Guide
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* POPUP / DIALOG DIALOG: STEP-BY-STEP GITHUB PAGES DEPLOYMENT GUIDE */}
      <AnimatePresence>
        {isDeployGuideOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200"
            >
              {/* Header */}
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="font-bold text-base font-display">
                      How to Neatly Host This Showcase on GitHub Pages
                    </h3>
                    <p className="text-xs text-slate-400">
                      Simple step-by-step instructions for Clara Lee (clara.lee@redcross.sg)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeployGuideOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Grid content */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[75vh] space-y-6">
                
                {/* Intro */}
                <div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    This PFA course selector has been fully optimized to build into static assets that can be hosted on GitHub Pages absolutely free. Below are the two easiest ways to deploy. Select the setup that best fits your workflow:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* OPTION 1: FULL AUTOMATIC GITHUB WORKFLOW (Highly Recommended) */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold uppercase px-2 py-0.5 rounded-md">Option A</span>
                        <h4 className="font-bold text-xs text-slate-800">Vite React GitHub Action (Best Practice)</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                        Pushes this complete React codebase directly to a GitHub repository. GitHub compiles and deploys it automatically every time you push edits!
                      </p>

                      <ol className="text-[11px] text-slate-600 space-y-3 list-decimal pl-4">
                        <li>
                          Create a public GitHub repository named <code>pfa-showcase</code>.
                        </li>
                        <li>
                          Add a base path inside your <code>vite.config.ts</code>:
                          <div className="bg-slate-800 text-slate-300 p-2 rounded-md font-mono mt-1 text-[10px] relative">
                            base: "/pfa-showcase/",
                            <button 
                              onClick={() => handleCopyToClipboard('base: "/pfa-showcase/",', "base")} 
                              className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                            >
                              {copiedText === "base" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </li>
                        <li>
                          Create a file at <code>.github/workflows/deploy.yml</code> and paste the workflow configuration.
                        </li>
                        <li>
                          Run these git terminal commands in your local machine's workspace:
                          <div className="bg-slate-800 text-slate-300 p-2 rounded-md font-mono mt-1 text-[9px] leading-tight overflow-x-auto relative">
                            git init<br/>
                            git add .<br/>
                            git commit -m "initial commit"<br/>
                            git branch -M main<br/>
                            git remote add origin https://github.com/yourusername/pfa-showcase.git<br/>
                            git push -u origin main
                          </div>
                        </li>
                      </ol>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleCopyToClipboard(getWorkflowCode(), "workflow")}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                      >
                        {copiedText === "workflow" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span>Copied Action Code!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy GitHub Action Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* OPTION 2: NO-BUILD SINGLE-FILE index.html (Super simple drag and drop!) */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold uppercase px-2 py-0.5 rounded-md">Option B</span>
                        <h4 className="font-bold text-xs text-slate-800">Single File index.html (Drag &amp; Drop)</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                        We have bundled your custom courses content directly into a single, self-contained, lightweight <code>index.html</code> file. No servers, node modules, or compile setups required!
                      </p>

                      <ol className="text-[11px] text-slate-600 space-y-3 list-decimal pl-4">
                        <li>
                          Copy the bundled index.html content using the button below.
                        </li>
                        <li>
                          Create a repository on GitHub (e.g., <code>pfa-selector</code>).
                        </li>
                        <li>
                          Add a single file named <code>index.html</code> inside GitHub's interface and paste the copied contents.
                        </li>
                        <li>
                          Go to <strong>Settings</strong> &gt; <strong>Pages</strong>, select the <strong>main branch</strong>, and tap <strong>Save</strong>!
                        </li>
                        <li>
                          Your page goes live in seconds at: <code>https://username.github.io/pfa-selector/</code>!
                        </li>
                      </ol>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleCopyToClipboard(getSelfContainedHTML(courses), "single_html")}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-md cursor-pointer"
                      >
                        {copiedText === "single_html" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Copied Single HTML!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Single index.html Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Workflow Code display block for clarity */}
                <div className="pt-4 border-t border-slate-200">
                  <h5 className="text-xs font-bold text-slate-800 uppercase mb-2">GitHub Action Config Preview (.github/workflows/deploy.yml)</h5>
                  <pre className="bg-slate-900 text-slate-300 text-[10px] p-4 rounded-xl overflow-x-auto font-mono leading-relaxed">
                    {getWorkflowCode()}
                  </pre>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
                <span>Made specifically for Singapore Red Cross - Academy</span>
                <a href="https://academy.redcross.sg" target="_blank" rel="noreferrer" className="text-[#e60000] hover:underline font-semibold flex items-center gap-1">
                  academy.redcross.sg <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Function to generate the pre-configured github action deploy code
function getWorkflowCode(): string {
  return `# Simple workflow for deploying static content to GitHub Pages
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;
}

// Generates a fully self-contained index.html file with CDN Tailwind, React 18, Lucide Icons, and fully dynamic selection
// This is incredibly useful for users who want to host it on GitHub with 0 complex configuration.
function getSelfContainedHTML(currentCourses: Course[]): string {
  const coursesJSON = JSON.stringify(currentCourses, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore Our Psychological First Aid Courses</title>
    
    <!-- Load Tailwind v3 CSS via Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Load Lucide Icons CDN -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <style>
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
        }
        .font-display {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
    </style>
</head>
<body class="min-h-screen flex flex-col justify-between text-slate-800">

    <!-- Red Cross Branding Header -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="bg-[#e60000] px-2.5 py-1 rounded-lg flex items-center justify-center shadow-md shadow-red-100">
                    <span class="text-white font-bold text-lg leading-none font-display">+</span>
                </div>
                <div>
                    <h1 class="text-xs sm:text-sm font-semibold tracking-wide text-[#e60000] uppercase font-display">Singapore Red Cross Academy</h1>
                    <p class="text-[10px] text-slate-500">Psychological First Aid Department</p>
                </div>
            </div>
            <a href="mailto:academy@redcross.sg" class="text-xs text-[#e60000] hover:underline font-semibold font-display">academy@redcross.sg</a>
        </div>
    </header>

    <!-- App Container -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        <div class="mb-8">
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 font-display sm:text-4xl">Explore Our Psychological First Aid Courses</h2>
            <p class="mt-2 text-base text-slate-500">Choose a course to learn more about how it fits your needs.</p>
        </div>

        <div id="course-app">
            <!-- Loading indicator, will be replaced by JavaScript -->
            <div class="p-12 text-center text-slate-500 text-sm">Loading psychological first aid modules...</div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 py-10 text-xs">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div class="flex justify-center items-center gap-3">
                <span class="text-[#e60000] font-bold text-lg">+</span>
                <span class="font-semibold text-slate-300 tracking-wider font-display uppercase">Singapore Red Cross Society</span>
            </div>
            <p class="max-w-md mx-auto text-slate-500 leading-relaxed">
                Singapore Red Cross Academy is registered under the Charities Act and is dedicated to training community members in life-saving first aid.
            </p>
            <div class="border-t border-slate-800/80 pt-6 text-slate-500">
                &copy; \${new Date().getFullYear()} Singapore Red Cross. All rights reserved.
            </div>
        </div>
    </footer>

    <!-- Interactive script rendering courses natively without compilation -->
    <script>
        const courses = ${coursesJSON};

        let selectedCourseId = "pfa-plus";
        let expandedModuleId = null;

        function getCourseIconMarkup(courseId, size = "20") {
            // map icons
            if (courseId === "pfa-plus") return \`<i data-lucide="heart" class="text-[#e60000]" style="width: \${size}px; height: \${size}px;"></i>\`;
            if (courseId === "pfa-advanced") return \`<i data-lucide="brain-circuit" class="text-[#e60000]" style="width: \${size}px; height: \${size}px;"></i>\`;
            if (courseId === "pfa-groups") return \`<i data-lucide="users" class="text-[#e60000]" style="width: \${size}px; height: \${size}px;"></i>\`;
            if (courseId === "pfa-customised") return \`<i data-lucide="file-text" class="text-[#e60000]" style="width: \${size}px; height: \${size}px;"></i>\`;
            return \`<i data-lucide="heart" class="text-[#e60000]" style="width: \${size}px; height: \${size}px;"></i>\`;
        }

        function selectCourse(courseId) {
            selectedCourseId = courseId;
            expandedModuleId = null;
            renderApp();
        }

        function toggleModule(moduleId) {
            expandedModuleId = expandedModuleId === moduleId ? null : moduleId;
            renderApp();
        }

        function renderApp() {
            const container = document.getElementById("course-app");
            const active = courses.find(c => c.id === selectedCourseId) || courses[0];

            // Render Tab Selectors
            const tabsHTML = courses.map(course => {
                const isActive = course.id === selectedCourseId;
                return \`
                    <button onclick="selectCourse('\${course.id}')" class="flex items-center gap-4 p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer \${
                        isActive 
                            ? 'bg-white border-[#e60000] ring-4 ring-red-50 shadow-md' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }">
                        <div class="p-3 rounded-xl flex-shrink-0 \${isActive ? 'bg-red-50' : 'bg-slate-50'}">
                            \${getCourseIconMarkup(course.id, 24)}
                        </div>
                        <div>
                            <h3 class="text-sm font-semibold leading-snug tracking-tight \${isActive ? 'text-[#e60000]' : 'text-slate-800'}">
                                \${course.title}
                            </h3>
                        </div>
                    </button>
                \`;
            }).join("");

            // Render learning takeaways
            const takeawaysHTML = active.learnBullets.map(bullet => \`
                <li class="flex items-start gap-2.5">
                    <i data-lucide="check-circle-2" class="text-emerald-500 mt-0.5 flex-shrink-0" style="width: 20px; height: 20px;"></i>
                    <span class="text-slate-600 text-sm leading-snug">\${bullet}</span>
                </li>
            \`).join("");

            // Render Modules Cards
            const modulesHTML = active.modules.map((mod, index) => {
                const objectivesHTML = (mod.objectives && mod.objectives.length > 0) ? \`
                    <div class="mt-4 pt-3 border-t border-slate-100">
                        <span class="text-[10px] font-bold tracking-widest text-[#e60000] uppercase font-display block mb-2">
                            Learning Objectives
                        </span>
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                            \${mod.objectives.map(obj => \\\`
                                <li class="flex items-start gap-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></span>
                                    <span>\\\${obj}</span>
                                </li>
                            \\\`).join("")}
                        </ul>
                    </div>
                \` : "";

                return \`
                    <div class="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-xs transition-all duration-200">
                        <div class="flex flex-col md:flex-row md:items-start gap-4">
                            <!-- Module Number badge -->
                            <div class="w-10 h-10 rounded-xl bg-red-50 text-[#e60000] font-bold text-sm flex items-center justify-center flex-shrink-0 font-mono shadow-inner border border-red-100">
                                \\\${String(mod.num || index + 1).padStart(2, '0')}
                            </div>
                            
                            <!-- Title & Description -->
                            <div class="flex-grow">
                                <h5 class="font-bold text-slate-900 text-sm sm:text-base leading-snug font-display">
                                    \\\${mod.title}
                                </h5>
                                <p class="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                                    \\\${mod.description}
                                </p>
                                \\\${objectivesHTML}
                            </div>
                        </div>
                    </div>
                \`;
            }).join("");

            // Combine together
            container.innerHTML = \`
                <!-- Tabs -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    \${tabsHTML}
                </div>

                <!-- Showcase Detail Panel -->
                <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
                    
                    <div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch border-b border-slate-100">
                        
                        <!-- Col 1 -->
                        <div class="md:col-span-6 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center gap-4 mb-4">
                                    <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shadow-inner">
                                        \${getCourseIconMarkup(active.id, 32)}
                                    </div>
                                    <div>
                                        <h4 class="text-xl font-bold text-slate-900 font-display">
                                            \${active.title}
                                        </h4>
                                    </div>
                                </div>

                                <p class="text-slate-600 text-sm leading-relaxed mb-6">
                                    \${active.shortDescription}
                                </p>

                                <div>
                                    <h5 class="text-xs font-bold text-[#e60000] uppercase tracking-wider mb-2 font-display">
                                        Who it's for
                                    </h5>
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        \${active.whoItIsFor}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Col 2 -->
                        <div class="md:col-span-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 flex flex-col">
                            <h5 class="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 font-display">
                                You will learn to:
                            </h5>
                            <ul class="space-y-3.5 flex-grow">
                                \${takeawaysHTML}
                            </ul>
                        </div>

                        <!-- Col 3 -->
                        <div class="md:col-span-3 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between text-left">
                            <div class="space-y-3 flex-grow flex flex-col justify-start">
                                <div class="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center border border-red-100 text-[#e60000] mb-1">
                                    <i data-lucide="mail" style="width: 20px; height: 20px;"></i>
                                </div>
                                <h5 class="font-semibold text-slate-800 text-sm font-display">
                                    Have Questions?
                                </h5>
                                <p class="text-xs text-slate-500 leading-normal">
                                    Connect with our Academy consultants regarding schedule, pricing, or bespoke corporate booking packages.
                                </p>
                            </div>

                            <div class="mt-4 pt-4 border-t border-slate-200/60">
                                <a href="mailto:\${active.enquiryEmail}?subject=Enquiry%20regarding%20\${encodeURIComponent(active.title)}" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e60000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <span>Enquire Now</span>
                                    <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
                                </a>
                                <p class="text-[11px] text-slate-400 mt-2 font-mono text-left">
                                    \${active.enquiryEmail}
                                </p>
                            </div>
                        </div>

                    </div>

                    <!-- Bottom -->
                    <div class="bg-slate-50/50 p-6 sm:p-8">
                        <h4 class="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 font-display">
                            What You'll Learn in This Course
                        </h4>

                        <div class="grid grid-cols-1 gap-4">
                            \${modulesHTML}
                        </div>

                        \${active.id !== 'pfa-customised' ? \`
                        <div class="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 p-4 rounded-xl border border-slate-200/40">
                            <div class="text-left">
                                <h5 class="font-semibold text-slate-800 text-xs sm:text-sm font-display uppercase tracking-wider text-[#e60000]">
                                    Looking for the Syllabus?
                                </h5>
                                <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Read full curriculum outline, schedules, assessment structures, and physical academy locations.
                                </p>
                            </div>
                            <a
                                href="\\\${active.courseOutlineUrl || 'https://academy.redcross.sg'}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-300 hover:border-slate-400 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                            >
                                <span>Read Course Outline</span>
                                <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                            </a>
                        </div>
                        \` : ''}
                    </div>

                </div>
            \`;

            // Re-render lucide icons
            lucide.createIcons();
        }

        // Run on load
        window.onload = function() {
            renderApp();
        };
    </script>
</body>
</html>`;
}
