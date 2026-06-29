import React, { useState, useEffect } from "react";
import { 
  Heart, 
  BrainCircuit, 
  Users, 
  FileText, 
  Mail, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { initialCourses } from "./data";
import { Course } from "./types";

export default function App() {
  // Load courses from localStorage if user previously customized them, otherwise use default Singapore Red Cross courses
  const [courses] = useState<Course[]>(() => {
    const keys = ["redcross_pfa_courses", "pfa_courses", "pfa-selector-courses", "courses"];
    for (const key of keys) {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // If the saved data has the old hallucinated modules, discard it so we load corrected ones
            const hasStaleModules = parsed.some(c => 
              c.id === "pfa-plus" && 
              c.modules?.some(m => m.title === "Understand Distress")
            );
            if (hasStaleModules) {
              localStorage.removeItem(key);
              continue;
            }
            // Guarantee all courses use academy@redcross.sg
            return parsed.map((c: any) => ({
              ...c,
              enquiryEmail: "academy@redcross.sg"
            }));
          }
        } catch (e) {
          console.error("Error reading saved courses", e);
        }
      }
    }
    // Fallback to initialCourses, ensuring email is academy@redcross.sg
    return initialCourses.map(c => ({
      ...c,
      enquiryEmail: "academy@redcross.sg"
    }));
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>("pfa-plus");
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Automatically sync local changes to the server files (src/data.ts)
  useEffect(() => {
    const keys = ["redcross_pfa_courses", "pfa_courses", "pfa-selector-courses", "courses"];
    let savedDataStr = "";
    for (const key of keys) {
      const saved = localStorage.getItem(key);
      if (saved) {
        savedDataStr = saved;
        break;
      }
    }

    const payload = savedDataStr ? JSON.parse(savedDataStr) : courses;
    
    // Ensure all items in saved payload are updated to the correct email
    const cleanedPayload = Array.isArray(payload) 
      ? payload.map((c: any) => ({ ...c, enquiryEmail: "academy@redcross.sg" }))
      : courses;

    fetch("/api/save-courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cleanedPayload)
    })
      .then(res => res.json())
      .then(data => {
        console.log("[Auto-Save] Successfully saved browser course details to src/data.ts:", data);
      })
      .catch(err => {
        console.error("[Auto-Save] Failed to save browser course details to src/data.ts:", err);
      });
  }, [courses]);

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
                  href={`mailto:academy@redcross.sg?subject=Enquiry%20regarding%20${encodeURIComponent(activeCourse.title)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e60000] hover:bg-[#cc0000] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>Enquire Now</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <p className="text-[11px] text-slate-400 mt-2 font-mono text-left">
                  academy@redcross.sg
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
                  </div>
                );
              })}
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

    </div>
  );
}
