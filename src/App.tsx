import React, { useState } from "react";
import { 
  Heart, 
  BrainCircuit, 
  Users, 
  FileText, 
  CheckCircle2, 
  Mail, 
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { initialCourses } from "./data";
import { Course } from "./types";

export default function App() {
  // Load courses from localStorage if available, otherwise use initial defaults
  const [courses] = useState<Course[]>(() => {
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

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

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
        <div className="mb-8">
          <h2 id="page-title" className="text-3xl font-bold tracking-tight text-slate-900 font-display sm:text-4xl">
            Explore Our Psychological First Aid Courses
          </h2>
          <p id="page-subtitle" className="mt-2 text-base text-slate-500">
            Choose a course to learn more about how it fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 items-start">
          
          {/* Course horizontal tabs selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
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
