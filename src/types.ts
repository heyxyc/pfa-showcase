export interface CourseModule {
  id: string;
  num: number;
  title: string;
  description: string;
  objectives?: string[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  whoItIsFor: string;
  learnBullets: string[];
  modules: CourseModule[];
  enquiryEmail: string;
  courseOutlineUrl?: string;
}
