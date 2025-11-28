"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./auth.module.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password length
    if (!isLogin && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate passwords match for signup
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (!isLogin) {
        // Signup API call via Next.js API route (to bypass CORS)
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        setSuccess("Account created successfully! Please sign in.");
        // Switch to login form after successful signup
        setTimeout(() => {
          setIsLogin(true);
          setFormData({
            firstName: "",
            lastName: "",
            userName: "",
            email: formData.email,
            password: "",
            confirmPassword: "",
          });
          setSuccess("");
        }, 2000);
      } else {
        // Login API call
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Store token if provided
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        setSuccess("Login successful! Redirecting...");
        // Redirect to dashboard or home page
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
            
            {success && (
              <div className={styles.successMessage}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              {!isLogin && (
                <>
                  <div className={styles.inputGroup}>
                    <label htmlFor="firstName">
                      First Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label htmlFor="lastName">
                      Last Name <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label htmlFor="userName">
                      Username <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required={!isLogin}
                    />
                  </div>
                </>
              )}
              
              <div className={styles.inputGroup}>
                <label htmlFor="email">
                  Email Address <span className={styles.required}>*</span>
                </label>
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
                <label htmlFor="password">
                  Password <span className={styles.required}>*</span>
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">
                    Confirm Password <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••••"
                      minLength={6}
                      required={!isLogin}
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                          <line x1="1" y1="1" x2="23" y2="23"></line>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className={styles.forgotPassword}>
                  <Link href="/auth/forgot-password">Forgot Password?</Link>
                </div>
              )}

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
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
