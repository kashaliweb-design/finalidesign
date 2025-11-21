import Link from "next/link";
import styles from "./Courses.module.css";
import { courses } from "@/data/courses";

export default function Courses() {
  return (
    <div className={styles.wrapper} id="courses">
      <h2 className={styles.sectionTitle}>
        <span className={styles.titleAll}>All</span>
        <span className={styles.titleCourses}> Courses</span>
      </h2>

      <div className={styles.grid}>
        {courses.map((course) => (
          <Link href={`/courses/${course.slug}`} className={styles.card} key={course.id}>
            {course.badges && course.badges.length > 0 && (
              <div className={styles.badge}>{course.badges[0]}</div>
            )}
            
            <div className={styles.cardHeader}>
              <img src={course.thumbnail} alt={course.title} className={styles.cardImg} />
              <div className={styles.hoverOverlay}>
                <div className={styles.playIcon}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.courseTitle}>{course.title}</h3>

              <div className={styles.rating}>
                <span className={styles.stars}>★★★★</span>
                <span className={styles.ratingText}>
                  {course.rating} ({course.ratingsCount.toLocaleString()})
                </span>
              </div>

              <div className={styles.priceRow}>
                <span className={styles.price}>${course.price.toFixed(2)}</span>
                <span className={styles.instructor}>{course.instructor}</span>
              </div>

              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {course.length}
                </span>
                <span className={styles.metaItem}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  {course.lessons} modules
                </span>
                <span className={styles.metaItem}>
                  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="8" r="7"/>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
                  </svg>
                  {course.level}
                </span>
              </div>

              <button className={styles.learnMore}>
                Learn More
                <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
