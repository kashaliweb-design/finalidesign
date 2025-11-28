"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./auth.module.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.authContainer}>
      
      <div className={styles.authContent}>
        {/* Left Info Box */}
        <div className={styles.infoBox}>
          <h2>Enhance Your Skills with Our Courses</h2>
          <p>We offer a wide range of professional courses to help you advance in your career:</p>
          <ul className={styles.coursesList}>
            <li>Web Development</li>
            <li>Mobile App Development</li>
            <li>Data Science & Analytics</li>
            <li>UI/UX Design</li>
            <li>Digital Marketing</li>
          </ul>
          <div className={styles.infoStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>50+</span>
              <span className={styles.statLabel}>Expert Courses</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>10K+</span>
              <span className={styles.statLabel}>Active Students</span>
            </div>
          </div>
        </div>
        
        {/* Form Section - Right Side */}
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            <div className={styles.logo}>
              <h1>51Skills</h1>
            </div>

            <div className={styles.formHeader}>
              <h2>{isLogin ? "Welcome Back!" : "Create Account"}</h2>
              <p>
                {isLogin
                  ? "Enter your credentials to access your account"
                  : "Sign up to start your learning journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {!isLogin && (
                <div className={styles.inputGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="impactlectuex@gmail.com"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  required
                />
              </div>
              
              {!isLogin && (
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••"
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && (
                <div className={styles.forgotPassword}>
                  <Link href="/auth/forgot-password">Forgot Password?</Link>
                </div>
              )}

              <button type="submit" className={styles.submitButton}>
                {isLogin ? "Sign In" : "Sign Up"}
              </button>
              
              <div className={styles.toggleAuth}>
                <p>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className={styles.toggleButton}
                  >
                    {isLogin ? "Sign Up" : "Sign In"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
