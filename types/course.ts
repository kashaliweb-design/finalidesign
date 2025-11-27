export interface CourseLesson {
  title: string;
  duration: string;
  preview?: boolean;
}

export interface CourseSection {
  title: string;
  summary: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: number;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  rating: number;
  ratingsCount: number;
  students: number;
  language: string;
  subtitles: string;
  instructor: string;
  badges: string[];
  length: string;
  sections: number;
  lessons: number;
  level: string;
  heroImage: string;
  thumbnail: string;
  price: number;
  oldPrice?: number;
  whatYoullLearn: string[];
  includes: string[];
  requirements: string[];
  curriculum: CourseSection[];
}
