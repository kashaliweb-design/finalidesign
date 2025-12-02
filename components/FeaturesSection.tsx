"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./FeaturesSection.module.css";
import { BookOpen, Users, Award } from "lucide-react";

export default function FeaturesSection() {
  const [courses, setCourses] = useState(0);
  const [instructors, setInstructors] = useState(0);
  const [students, setStudents] = useState(0);
  const [satisfaction, setSatisfaction] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter(setCourses, 10000, 2000);
          animateCounter(setInstructors, 500, 2000);
          animateCounter(setStudents, 2000000, 2500);
          animateCounter(setSatisfaction, 98, 2000);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounter = (setter: (val: number) => void, target: number, duration: number) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, 16);
  };

  const formatNumber = (num: number, suffix: string) => {
    if (suffix === 'k+') return `${(num / 1000).toFixed(0)}k+`;
    if (suffix === 'M+') return `${(num / 1000000).toFixed(1)}M+`;
    if (suffix === '%') return `${num}%`;
    return `${num}${suffix}`;
  };
  return (
    <section className={styles.wrapper}>

      <div className={styles.header} data-aos="fade-up">
        <span className={styles.tagline}>Why students love us</span>
        <h2 className={styles.title}>Features </h2>
        <span> </span>
        <h2 className={styles.title1}>that set us apart</h2>
        <p className={styles.subtitle}>
          Discover why 51skills is the preferred platform for ambitious learners 
          looking to advance their careers.
        </p>
      </div>

      <div className={styles.timeline}></div>

      <div className={`${styles.card} ${styles.cardLeft}`} data-aos="fade-right" data-aos-delay="100">
        <div className={styles.cardInner}>
          <div className={styles.iconBoxYellow}><BookOpen size={34} /></div>
          <div className={styles.textArea}>
            <h3 className={styles.cardTitle}>Extensive Course Library</h3>
            <p className={styles.cardDesc}>
              Access thousands of courses across various disciplines taught by industry experts.
            </p>
            <ul className={styles.cardList}>
              <li><span className={styles.check}></span>10,000+ courses</li>
              <li><span className={styles.check}></span>Updated monthly</li>
              <li><span className={styles.check}></span>Downloadable resources</li>
            </ul>
            <button className={styles.learnMore}>Learn more →</button>
          </div>
        </div>
      </div>

      <div className={`${styles.card1} ${styles.cardRight}`} data-aos="fade-left" data-aos-delay="200">
        <div className={styles.cardInner}>
          <div className={styles.iconBoxGray}><Users size={34} /></div>
          <div className={styles.textArea}>
            <h3 className={styles.cardTitle}>Expert Instructors</h3>
            <p className={styles.cardDesc}>
              Learn from industry professionals and thought leaders.
            </p>
            <ul className={styles.cardList}>
              <li><span className={styles.check1}></span>Verified experts</li>
              <li><span className={styles.check1}></span>Live sessions</li>
              <li><span className={styles.check1}></span>Direct mentorship</li>
            </ul>
            <button className={styles.learnMore1}>Learn more →</button>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.cardLeft}`} data-aos="fade-right" data-aos-delay="300">
        <div className={styles.cardInner}>
          <div className={styles.iconBoxYellow}><Award size={34} /></div>
          <div className={styles.textArea}>
            <h3 className={styles.cardTitle}>Recognized Certifications</h3>
            <p className={styles.cardDesc}>
              Earn certificates valued by employers.
            </p>
            <ul className={styles.cardList}>
              <li><span className={styles.check}></span>Industry recognized</li>
              <li><span className={styles.check}></span>Digital badges</li>
              <li><span className={styles.check}></span>LinkedIn integration</li>
            </ul>
            <button className={styles.learnMore}>Learn more →</button>
          </div>
        </div>
      </div>

      <div className={`${styles.card1} ${styles.cardRight}`} data-aos="fade-left" data-aos-delay="200">
        <div className={styles.cardInner}>
          <div className={styles.iconBoxGray}><Users size={34} /></div>
          <div className={styles.textArea}>
            <h3 className={styles.cardTitle}>Interactive Learning</h3>
            <p className={styles.cardDesc}>
              Engage with hands-on projects and real-world applications.
            </p>
            <ul className={styles.cardList}>
              <li><span className={styles.check1}></span>Project-based learning</li>
              <li><span className={styles.check1}></span>AI-assisted feedback</li>
              <li><span className={styles.check1}></span>Peer reviews</li>
            </ul>
            <button className={styles.learnMore1}>Learn more →</button>
          </div>
        </div>
      </div>

      <div className={styles.statsWrapper} ref={statsRef} data-aos="fade-up">
        <h2 className={styles.statsTitle}>
          Why Thousands Choose <span className={styles.brand}>51skills</span>
        </h2>

        <div className={styles.statsGrid}>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><BookOpen size={28} /></div>
            <h3 className={styles.statsNumber}>{formatNumber(courses, 'k+')}</h3>
            <p className={styles.statsLabel}>Courses</p>
          </div>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><Users size={28} /></div>
            <h3 className={styles.statsNumber}>{formatNumber(instructors, '+')}</h3>
            <p className={styles.statsLabel}>Instructors</p>
          </div>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><Users size={28} /></div>
            <h3 className={styles.statsNumber}>{formatNumber(students, 'M+')}</h3>
            <p className={styles.statsLabel}>Students</p>
          </div>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><Award size={28} /></div>
            <h3 className={styles.statsNumber}>{formatNumber(satisfaction, '%')}</h3>
            <p className={styles.statsLabel}>Satisfaction</p>
          </div>

        </div>

        <button className={styles.statsBtn}>
          Start your learning journey →
        </button>
      </div>
    </section>
  );
}
