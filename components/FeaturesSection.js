"use client";

import styles from "./FeaturesSection.module.css";
import { BookOpen, Users, Award } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className={styles.wrapper}>

      {/* TITLE SECTION */}
      <div className={styles.header}>
        <span className={styles.tagline}>Why students love us</span>
        <h2 className={styles.title}>Features </h2>
        <span> </span>
        <h2 className={styles.title1}>that set us apart</h2>
        <p className={styles.subtitle}>
          Discover why 51skills is the preferred platform for ambitious learners 
          looking to advance their careers.
        </p>
      </div>

      {/* TIMELINE */}
      <div className={styles.timeline}></div>

      {/* --- Your existing 4 cards stay unchanged --- */}

      {/* CARD 1 */}
      <div className={`${styles.card} ${styles.cardLeft}`}>
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

      {/* CARD 2 */}
      <div className={`${styles.card1} ${styles.cardRight}`}>
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

      {/* CARD 3 */}
      <div className={`${styles.card} ${styles.cardLeft}`}>
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

      {/* CARD 4 */}
      <div className={`${styles.card1} ${styles.cardRight}`}>
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

      {/* ⭐ NEW STATS BOX SECTION ⭐ */}
      <div className={styles.statsWrapper}>
        <h2 className={styles.statsTitle}>
          Why Thousands Choose <span className={styles.brand}>51skills</span>
        </h2>

        <div className={styles.statsGrid}>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><BookOpen size={28} /></div>
            <h3 className={styles.statsNumber}>10k+</h3>
            <p className={styles.statsLabel}>Courses</p>
          </div>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><Users size={28} /></div>
            <h3 className={styles.statsNumber}>500+</h3>
            <p className={styles.statsLabel}>Instructors</p>
          </div>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><Users size={28} /></div>
            <h3 className={styles.statsNumber}>2M+</h3>
            <p className={styles.statsLabel}>Students</p>
          </div>

          <div className={styles.statsItem}>
            <div className={styles.statsIcon}><Award size={28} /></div>
            <h3 className={styles.statsNumber}>98%</h3>
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
