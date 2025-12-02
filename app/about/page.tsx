"use client";

import Link from "next/link";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>51Skills</h1>
          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Home</Link>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
            <Link href="/auth" className={styles.authBtn}>Login</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>About 51Skills</h1>
          <p>Empowering learners worldwide with quality education</p>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Mission Section */}
          <section className={styles.section}>
            <h2>Our Mission</h2>
            <p className={styles.largeText}>
              At 51Skills, we believe that education should be accessible to everyone, everywhere. 
              Our mission is to provide high-quality, affordable courses that help individuals 
              develop the skills they need to succeed in today's rapidly changing world.
            </p>
          </section>

          {/* Values Section */}
          <section className={styles.section}>
            <h2>Our Values</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🎯</div>
                <h3>Excellence</h3>
                <p>We strive for excellence in everything we do, from course content to student support.</p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🤝</div>
                <h3>Accessibility</h3>
                <p>Quality education should be available to everyone, regardless of background or location.</p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>💡</div>
                <h3>Innovation</h3>
                <p>We continuously innovate our teaching methods to provide the best learning experience.</p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>🌟</div>
                <h3>Community</h3>
                <p>We foster a supportive community where learners can grow together.</p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <h3>10,000+</h3>
                <p>Active Students</p>
              </div>

              <div className={styles.statItem}>
                <h3>50+</h3>
                <p>Expert Courses</p>
              </div>

              <div className={styles.statItem}>
                <h3>95%</h3>
                <p>Satisfaction Rate</p>
              </div>

              <div className={styles.statItem}>
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className={styles.section}>
            <h2>Our Team</h2>
            <p className={styles.largeText}>
              Our team consists of experienced educators, industry professionals, and passionate 
              individuals dedicated to helping you achieve your learning goals.
            </p>
            <div className={styles.teamGrid}>
              <div className={styles.teamCard}>
                <div className={styles.teamAvatar}>👨‍💼</div>
                <h3>Expert Instructors</h3>
                <p>Industry professionals with years of real-world experience</p>
              </div>

              <div className={styles.teamCard}>
                <div className={styles.teamAvatar}>👩‍💻</div>
                <h3>Support Team</h3>
                <p>Dedicated support staff available to help you succeed</p>
              </div>

              <div className={styles.teamCard}>
                <div className={styles.teamAvatar}>👨‍🎓</div>
                <h3>Content Creators</h3>
                <p>Skilled professionals creating engaging course materials</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students already learning on 51Skills</p>
            <div className={styles.ctaButtons}>
              <Link href="/auth" className={styles.primaryBtn}>
                Get Started
              </Link>
              <Link href="/courses" className={styles.secondaryBtn}>
                Browse Courses
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2024 51Skills. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
