import React, { useState } from "react";
import { 
  Heart, 
  BrainCircuit, 
  Users, 
  FileText, 
  Mail, 
  ChevronRight,
  ExternalLink,
  Edit2,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Settings
} from "lucide-react";
import { initialCourses } from "./data";
import { Course, CourseModule } from "./types";

export default function App() {
  // Load courses from localStorage if user previously customized them, otherwise use pristine default Singapore Red Cross courses
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
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Helper to persist courses state and write to all common localStorage keys
  const saveCourses = (updatedCourses: Course[]) => {
    setCourses(updatedCourses);
    const keys = ["redcross_pfa_courses", "pfa_courses", "pfa-selector-courses", "courses"];
    keys.forEach(key => {
      try {
        localStorage.setItem(key, JSON.stringify(updatedCourses));
      } catch (e) {
        console.error("Failed to save to localStorage key: " + key, e);
      }
    });
  };

  // Reset to original default courses
  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all courses and modules back to the default Singapore Red Cross content? Any custom edits will be overwritten.")) {
      saveCourses(initialCourses);
      setSelectedCourseId("pfa-plus");
      setIsEditing(false);
    }
  };

  // Handler to update fields of the active course
  const handleUpdateCourseField = (field: keyof Course, value: any) => {
    const updated = courses.map(c => {
      if (c.id === activeCourse.id) {
        return { ...c, [field]: value };
      }
      return c;
    });
    saveCourses(updated);
  };

  // Handler to update a specific module of the active course
  const handleUpdateModuleField = (moduleId: string, field: keyof CourseModule, value: any) => {
    const updated = courses.map(c => {
      if (c.id === activeCourse.id) {
        const updatedModules = c.modules.map(m => {
          if (m.id === moduleId) {
            return { ...m, [field]: value };
          }
          return m;
        });
        return { ...c, modules: updatedModules };
      }
      return c;
    });
    saveCourses(updated);
  };

  // Handler to delete a module
  const handleDeleteModule = (moduleId: string) => {
    const updated = courses.map(c => {
      if (c.id === activeCourse.id) {
        const updatedModules = c.modules.filter(m => m.id !== moduleId);
        // Re-calculate numerical sequence indices
        const reindexedModules = updatedModules.map((m, idx) => ({
          ...m,
          num: idx + 1
        }));
        return { ...c, modules: reindexedModules };
      }
      return c;
    });
    saveCourses(updated);
  };

  // Handler to add a new module
  const handleAddModule = () => {
    const nextNum = activeCourse.modules.length + 1;
    const newMod: CourseModule = {
      id: `mod-${Date.now()}`,
      num: nextNum,
      title: `New Module ${nextNum}`,
      description: "Enter module description here."
    };
    const updated = courses.map(c => {
      if (c.id === activeCourse.id) {
        return { ...c, modules: [...c.modules, newMod] };
      }
      return c;
    });
    saveCourses(updated);
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
      
      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        
        {/* Title area */}
        <div className="mb-8 text-left">
          <h2 id="page-title" className="text-3xl font-bold tracking-tight text-slate-900 font-display sm:text-4xl">
            Explore Our Psychological First Aid Courses
          </h2>
          <p id="page-subtitle" className="mt-2 text-base text-slate-500">
            Choose a course to learn more about how it fits your needs.
          </p>
        </div>

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
            
            {/* Visual Circle & Base Info (takes 8 cols) */}
            {isEditing ? (
              <div className="md:col-span-8 flex flex-col justify-between space-y-4 text-left">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shadow-inner">
                      {getCourseIcon(activeCourse.id, "w-8 h-8")}
                    </div>
                    <div className="flex-grow">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e60000] mb-1 font-display">
                        Course Tab Title
                      </label>
                      <input
                        type="text"
                        value={activeCourse.title}
                        onChange={(e) => handleUpdateCourseField("title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] font-semibold text-slate-950"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-display">
                      Short Description
                    </label>
                    <textarea
                      value={activeCourse.shortDescription}
                      onChange={(e) => handleUpdateCourseField("shortDescription", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e60000] mb-1 font-display">
                      Who it's for
                    </label>
                    <textarea
                      value={activeCourse.whoItIsFor}
                      onChange={(e) => handleUpdateCourseField("whoItIsFor", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#e60000] text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-8 flex flex-col justify-between text-left">
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
            )}

            {/* Right Action side: "Enquire Button" linked to email (takes 4 cols) */}
            <div className="md:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between text-left">
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e60000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer animate-none"
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
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 font-display text-left">
              What You'll Learn in This Course
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {activeCourse.modules.map((mod, index) => {
                return (
                  <div
                    id={`module-card-${mod.id}`}
                    key={mod.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-xs transition-all duration-200 relative text-left"
                  >
                    {isEditing ? (
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Module Number badge */}
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e60000] font-bold text-sm flex items-center justify-center flex-shrink-0 font-mono shadow-inner border border-red-100">
                          {String(mod.num || index + 1).padStart(2, '0')}
                        </div>
                        
                        <div className="flex-grow space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#e60000] mb-1 font-display">
                              Module Title
                            </label>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => handleUpdateModuleField(mod.id, "title", e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-red-200 focus:border-[#e60000]"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 font-display">
                              Module Description
                            </label>
                            <textarea
                              value={mod.description}
                              onChange={(e) => handleUpdateModuleField(mod.id, "description", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-200 focus:border-[#e60000]"
                            />
                          </div>
                        </div>

                        {/* Delete module button */}
                        <button
                          onClick={() => handleDeleteModule(mod.id)}
                          className="absolute top-4 right-4 p-2 bg-red-50 hover:bg-red-100 text-[#e60000] rounded-xl transition-all border border-red-100 cursor-pointer shadow-xs"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Module Number badge */}
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e60000] font-bold text-sm flex items-center justify-center flex-shrink-0 font-mono shadow-inner border border-red-100">
                          {String(mod.num || index + 1).padStart(2, '0')}
                        </div>
                        
                        {/* Title & Description */}
                        <div className="flex-grow text-left">
                          <h5 className="font-bold text-slate-900 text-sm sm:text-base leading-snug font-display">
                            {mod.title}
                          </h5>
                          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                            {mod.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add New Module Button */}
              {isEditing && (
                <button
                  onClick={handleAddModule}
                  className="flex items-center justify-center gap-2 p-5 border-2 border-dashed border-slate-300 hover:border-[#e60000] rounded-xl text-slate-500 hover:text-[#e60000] transition-all bg-white/50 hover:bg-red-50/20 cursor-pointer text-xs font-bold uppercase tracking-widest"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Module</span>
                </button>
              )}
            </div>

            {activeCourse.id !== "pfa-customised" && (
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 p-4 rounded-xl border border-slate-200/40">
                <div className="text-left">
                  <h5 className="font-semibold text-slate-800 text-xs sm:text-sm font-display uppercase tracking-wider text-[#e60000]">
                    Looking for more information?
                  </h5>
                </div>
                <a
                  id="btn-course-outline"
                  href={activeCourse.courseOutlineUrl || "https://redcross.sg/images/srca/New%20CPRHS%20Brochures/SRC%20PFA%20Brochure.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-lg border border-slate-300 hover:border-slate-400 shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>View Course Brochure</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Discrete floating admin / customization controls in bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {isEditing && (
          <>
            <button
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-600 hover:text-red-600 text-[11px] font-bold border border-slate-200 shadow-sm transition-all cursor-pointer"
              title="Reset content to original defaults"
            >
              <RefreshCw className="w-3 h-3 animate-none" />
              <span>Reset Defaults</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
          </>
        )}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer shadow-xs ${
            isEditing
              ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-500 text-white font-bold text-[11px] uppercase tracking-wide"
              : "bg-white/80 hover:bg-white border-slate-200 text-slate-500 hover:text-slate-800 font-semibold text-[11px] backdrop-blur-xs"
          }`}
          title="Toggle editing mode"
        >
          {isEditing ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Done Editing</span>
            </>
          ) : (
            <>
              <Settings className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Edit Modules</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
