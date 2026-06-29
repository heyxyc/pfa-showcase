import React, { useState, useEffect } from "react";
import { 
  Heart, 
  BrainCircuit, 
  Users, 
  FileText, 
  CheckCircle2, 
  Mail, 
  ChevronRight,
  ExternalLink,
  Edit2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Copy,
  Check,
  Settings,
  X
} from "lucide-react";
import { initialCourses } from "./data";
import { Course, CourseModule } from "./types";

export default function App() {
  // Load courses from localStorage using multiple potential keys to guarantee we recover any past edits
  const [courses, setCourses] = useState<Course[]>(() => {
    const keys = ["redcross_pfa_courses", "pfa_courses", "pfa-selector-courses", "courses"];
    for (const key of keys) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.error("Error reading saved courses", e);
        }
      }
    }
    return initialCourses;
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>("pfa-plus");
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // State for the editor form
  const [editTitle, setEditTitle] = useState("");
  const [editShortDesc, setEditShortDesc] = useState("");
  const [editWhoItIsFor, setEditWhoItIsFor] = useState("");
  const [editBullets, setEditBullets] = useState<string[]>([]);
  const [editEmail, setEditEmail] = useState("");
  const [editOutlineUrl, setEditOutlineUrl] = useState("");
  const [editModules, setEditModules] = useState<CourseModule[]>([]);

  // Update editor form when active course changes
  useEffect(() => {
    if (activeCourse) {
      setEditTitle(activeCourse.title);
      setEditShortDesc(activeCourse.shortDescription);
      setEditWhoItIsFor(activeCourse.whoItIsFor);
      setEditBullets([...activeCourse.learnBullets]);
      setEditEmail(activeCourse.enquiryEmail);
      setEditOutlineUrl(activeCourse.courseOutlineUrl || "");
      setEditModules(activeCourse.modules.map(m => ({ ...m, objectives: m.objectives ? [...m.objectives] : [] })));
    }
  }, [selectedCourseId, courses]);

  // Save changes to localStorage
  const handleSaveCourse = () => {
    const updatedCourses = courses.map(c => {
      if (c.id === selectedCourseId) {
        return {
          ...c,
          title: editTitle,
          shortDescription: editShortDesc,
          whoItIsFor: editWhoItIsFor,
          learnBullets: editBullets,
          enquiryEmail: editEmail,
          courseOutlineUrl: editOutlineUrl,
          modules: editModules
        };
      }
      return c;
    });

    setCourses(updatedCourses);
    localStorage.setItem("redcross_pfa_courses", JSON.stringify(updatedCourses));
    localStorage.setItem("pfa_courses", JSON.stringify(updatedCourses)); // Save to multiple keys for redundancy
    alert("Changes saved to your browser's local storage successfully!");
  };

  // Reset to original default courses
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all courses to the original Singapore Red Cross defaults? This will clear your custom edits.")) {
      setCourses(initialCourses);
      localStorage.removeItem("redcross_pfa_courses");
      localStorage.removeItem("pfa_courses");
      localStorage.removeItem("pfa-selector-courses");
      localStorage.removeItem("courses");
      alert("Reset complete!");
    }
  };

  // Helper to copy custom JSON to clipboard so the user can send it to the AI assistant
  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(courses, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      
      {/* Top Floating Action Bar for customization and recovery */}
      <div className="bg-slate-900 text-white py-2 px-4 shadow-md flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span><strong>Customiser Mode:</strong> Restore and secure your custom content edits</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsEditorOpen(!isEditorOpen)}
            className="bg-[#e60000] hover:bg-[#cc0000] text-white px-3 py-1 rounded font-semibold flex items-center gap-1 cursor-pointer transition-all"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isEditorOpen ? "Close Customiser" : "Open Customiser Panel"}</span>
          </button>
          <button 
            onClick={handleResetToDefaults}
            className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded font-semibold flex items-center gap-1 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset defaults</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Title area */}
        <div className="mb-8">
          <h2 id="page-title" className="text-3xl font-bold tracking-tight text-slate-900 font-display sm:text-4xl">
            Explore Our Psychological First Aid Courses
          </h2>
          <p id="page-subtitle" className="mt-2 text-base text-slate-500">
            Choose a course to learn more about how it fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left/Center Stage: Course details */}
          <div className={`transition-all duration-300 ${isEditorOpen ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"}`}>
            
            {/* Course horizontal tabs selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {courses.map((course) => {
                const isActive = course.id === selectedCourseId;
                return (
                  <button
                    id={`tab-course-${course.id}`}
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
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
                
                {/* Visual Circle & Base Info (takes 6 cols) */}
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
                  </ul>
                </div>

                {/* Right Action side: "Enquire Button" linked to email (takes 3 cols) */}
                <div className="md:col-span-3 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between text-left">
                  <div className="space-y-3 flex-grow flex flex-col justify-start">
                    <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center border border-red-100 text-[#e60000] mb-1">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h5 className="font-semibold text-slate-800 text-sm font-display">
                      Connect with us to find out more
                    </h5>
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

          </div>

          {/* Right Stage: Fully functional Customizer Form */}
          {isEditorOpen && (
            <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                    <Edit2 className="w-5 h-5 text-[#e60000]" />
                    <span>Course Editor</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Editing "{activeCourse.title}"</p>
                </div>
                <button 
                  onClick={() => setIsEditorOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form fields */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                  <input 
                    type="text" 
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                  <textarea 
                    value={editShortDesc}
                    onChange={(e) => setEditShortDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Who It is For</label>
                  <textarea 
                    value={editWhoItIsFor}
                    onChange={(e) => setEditWhoItIsFor(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] text-sm"
                  />
                </div>

                {/* Learn Bullets */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">What You Will Learn (Bullets)</label>
                  <div className="space-y-2">
                    {editBullets.map((bullet, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input 
                          type="text" 
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...editBullets];
                            newBullets[idx] = e.target.value;
                            setEditBullets(newBullets);
                          }}
                          className="flex-grow px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none text-xs"
                        />
                        <button 
                          onClick={() => setEditBullets(editBullets.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setEditBullets([...editBullets, ""])}
                      className="inline-flex items-center gap-1 text-[#e60000] hover:text-[#cc0000] font-semibold mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bullet</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enquiry Contact Email</label>
                  <input 
                    type="email" 
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] text-sm"
                  />
                </div>

                {/* Save button for this course */}
                <button 
                  onClick={handleSaveCourse}
                  className="w-full bg-[#e60000] hover:bg-[#cc0000] text-white py-2 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Apply Changes to Browser</span>
                </button>
              </div>

              {/* JSON export block to send to AI */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Bake Edits Into Deployed App</h4>
                <p className="text-xs text-slate-500 leading-normal">
                  Since your browser's local storage is not uploaded to GitHub, any edits made here won't show on your deployed GitHub Page automatically.
                </p>
                <p className="text-xs text-slate-600 bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                  <strong>How to bake:</strong> Click copy below to grab your customized content JSON. Paste it into the AI assistant chat, and I will permanently hardcode your edits directly into the project files!
                </p>
                <button
                  onClick={handleCopyJSON}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "JSON Copied!" : "Copy Customized JSON"}</span>
                </button>
              </div>
            </div>
          )}

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
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
