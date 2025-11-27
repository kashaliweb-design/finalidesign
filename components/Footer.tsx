"use client";
import { BookOpen } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>

        <div className={styles.left}>
          <div className={styles.brand}>
            <BookOpen size={28} strokeWidth={2} className={styles.bookIcon} />
            <h2>51skills</h2>
          </div>

          <p className={styles.desc}>
            Empowering learners worldwide with cutting-edge online education and skills that matter in today's digital economy.
          </p>

          <div className={styles.newsletterBox}>
            <div className={styles.nlInput}>
              <input type="email" placeholder="Your email" />
              <button className={styles.nlBtn}>
                <IoSend size={20} />
              </button>
            </div>
          </div>

          <div className={styles.social}>
            <FaFacebookF className={styles.icon} />
            <FaTwitter className={styles.icon} />
            <FaInstagram className={styles.icon} />
            <FaLinkedinIn className={styles.icon} />
          </div>
        </div>

        <div className={styles.columns}>
          <div className={styles.col}>
            <h3>Explore</h3>
            <a href="#">All Courses</a>
            <a href="#">Skills Paths</a>
            <a href="#">Certifications</a>
            <a href="#">Become an Instructor</a>
            <a href="#">Free Resources</a>
          </div>

          <div className={styles.col}>
            <h3>Company</h3>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Partners</a>
            <a href="#">Blog</a>
            <a href="#">Contact Us</a>
          </div>

          <div className={styles.col}>
            <h3>Support</h3>
            <a href="#">Help Center</a>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Settings</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomLinks}>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
