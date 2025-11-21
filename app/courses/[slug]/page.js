import CourseDetail from "@/components/CourseDetail";
import { courses, getCourseBySlug } from "@/data/courses";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;
  const course = getCourseBySlug(slug);
  if (!course) {
    return {
      title: "Course not found | 51skills",
    };
  }

  return {
    title: `${course.title} | 51skills`,
    description: course.subtitle,
  };
}

export default async function CoursePage({ params }) {
  const resolvedParams = await params;
  const slug = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug[0]
    : resolvedParams?.slug;
  const course = slug ? getCourseBySlug(slug) : undefined;

  if (!course) {
    notFound();
  }

  return <CourseDetail course={course} />;
}

