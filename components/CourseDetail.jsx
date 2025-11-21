"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./CourseDetail.module.css";

export default function CourseDetail({ course }) {
  if (!course) return null;

  const chips = [
    ...(course.badges || []),
    `${course.length}`,
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/#courses">Courses</Link>
          <span>/</span>
          <span className={styles.current}>{course.title}</span>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.badges}>
              {chips.map((chip) => (
                <span className={styles.badge} key={chip}>
                  {chip}
                </span>
              ))}
            </div>
            <h1>{course.title}</h1>
            <p>{course.subtitle}</p>

            <div className={styles.statsRow}>
              <div>⭐ {course.rating} ({course.ratingsCount.toLocaleString()} ratings)</div>
              <div>👥 {course.students.toLocaleString()} students</div>
              <div>🌐 {course.language}</div>
              <div>💬 {course.subtitles}</div>
            </div>

            <div className={styles.creatorRow}>
              Created by <span>{course.instructor}</span>
            </div>
          </div>

          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              <Image
                src={course.heroImage}
                alt={course.title}
                width={640}
                height={360}
                className={styles.previewImg}
                priority
              />
              <button className={styles.previewBtn}>▶ Watch Preview</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.leftColumn}>
          <div className={styles.tabs}>
            {["Overview", "Curriculum", "Instructor", "Reviews"].map((tab, i) => (
              <button key={tab} className={`${styles.tab} ${i === 0 ? styles.activeTab : ""}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📘</span>
              <div>
                <h3>What you'll learn</h3>
              </div>
            </div>
            <div className={styles.learnGrid}>
              {course.whatYoullLearn.map((item) => (
                <p key={item}>
                  <span>✔</span>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>🗂️</span>
              <div>
                <h3>Course content</h3>
                <p>
                  {course.sections} sections • {course.lessons} lessons • {course.length} total length
                </p>
              </div>
            </div>

            <div className={styles.chipRow}>
              <span>{course.sections} sections</span>
              <span>{course.lessons} lessons</span>
              <span>{course.length}</span>
            </div>

            <div className={styles.curriculum}>
              {course.curriculum.length ? (
                course.curriculum.map((section) => (
                  <div className={styles.section} key={section.title}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <h4>{section.title}</h4>
                        <p>{section.summary}</p>
                      </div>
                      <button>Expand ▾</button>
                    </div>

                    <ul>
                      {section.lessons.map((lesson) => (
                        <li key={lesson.title}>
                          <div>
                            <span>▶</span>
                            {lesson.title}
                            {lesson.preview && <span className={styles.previewChip}>Preview</span>}
                          </div>
                          <span>{lesson.duration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className={styles.placeholder}>Curriculum details coming soon.</p>
              )}

              <button className={styles.fullCurriculum}>View full curriculum →</button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardIcon}>📋</span>
              <div>
                <h3>Requirements</h3>
              </div>
            </div>
            <ul className={styles.requirements}>
              {course.requirements.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <div className={styles.sideImage}>
              <Image
                src={course.heroImage}
                alt={course.title}
                width={400}
                height={300}
                className={styles.sideImg}
              />
            </div>
            <div className={styles.priceRow}>
              <span className={styles.price}>${course.price.toFixed(2)}</span>
              {course.oldPrice && (
                <span className={styles.oldPrice}>${course.oldPrice.toFixed(2)}</span>
              )}
            </div>

            <button className={styles.primaryBtn}>Enroll Now</button>
            <button className={styles.secondaryBtn}>Try for Free</button>

            <div className={styles.guarantee}>30-Day Money-Back Guarantee</div>

            <div className={styles.includes}>
              <h4>This course includes:</h4>
              <ul>
                {course.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className={styles.shareRow}>
              <button>🤍 Wishlist</button>
              <button>🔗 Share</button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

