import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Courses from "@/components/Courses";
import StudentStories from "@/components/StudentStories";
import LevelUpSection from "@/components/LevelUpSection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <Courses />
      <StudentStories />
      <LevelUpSection />
    </>
  );
}
