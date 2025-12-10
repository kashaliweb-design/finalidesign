"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function AuthPage() {
  const router = useRouter();
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
  const [showVerification, setShowVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [refreshingData, setRefreshingData] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");

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
          credentials: "include", // Important: This allows cookies to be sent and received
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

        // Store user data for onboarding
        const userData = data.data || data.user || data.userData || data;
        if (userData && (userData.firstName || userData.email)) {
          localStorage.setItem("userData", JSON.stringify(userData));
        }
        
        setSuccess("Account created successfully! Please check your email for verification code.");
        setVerificationEmail(formData.email);
        // Show verification form after successful signup
        setTimeout(() => {
          setShowVerification(true);
          setSuccess("");
        }, 2000);
      } else {
        // Login API call with credentials to receive cookies
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important: This allows cookies to be sent and received
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();
        console.log("Login response data:", data); // Debug log

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // Store user data in localStorage (tokens are in httpOnly cookies)
        // Backend returns data in data.data field
        const userData = data.data || data.user || data.userData || data;
        if (userData && (userData.firstName || userData.email)) {
          localStorage.setItem("userData", JSON.stringify(userData));
          console.log("User data stored:", userData); // Debug log
        }

        setSuccess("Login successful! Redirecting to dashboard...");
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
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

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          otp: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed");
      }

      setSuccess("Email verified successfully! Redirecting to onboarding...");
      
      // Redirect to onboarding after successful verification
      setTimeout(() => {
        router.push("/onboarding");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setError("");
    setSuccess("");
    setResendingOtp(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setSuccess("OTP resent successfully! Please check your email.");
      
      // Set cooldown timer (60 seconds)
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendingOtp(false);
    }
  };

  const handleRefreshData = async () => {
    setRefreshMessage("");
    setRefreshingData(true);

    try {
      const response = await fetch("https://srv746619.hstgr.cloud/api/v1/auth/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to refresh data");
      }

      setRefreshMessage("Data refreshed successfully!");
      console.log("Refreshed user data:", data);
      
      setTimeout(() => setRefreshMessage(""), 3000);
    } catch (err: any) {
      setRefreshMessage(err.message || "Failed to refresh data. Please try again.");
    } finally {
      setRefreshingData(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      <div className={styles.authContent}>
        {/* Left Info Box */}
        <div className={styles.infoBox}>
          <div className={styles.svgContainer}>
            <Image
              src={isLogin ? "/undraw_secure-login_m11a (1).svg" : "/undraw_authentication_1evl (1).svg"}
              alt={isLogin ? "Secure Login" : "Authentication"}
              width={400}
              height={300}
              className={styles.loginSvg}
              priority
            />
          </div>
          <h2>{isLogin ? "Welcome Back!" : "Join 51Skills Today"}</h2>
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
              <h2>
                {showVerification 
                  ? "Verify Your Email" 
                  : (isLogin ? "Welcome Back!" : "Create Account")}
              </h2>
              <p>
                {showVerification
                  ? `Enter the verification code sent to ${verificationEmail}`
                  : (isLogin
                    ? "Enter your credentials to access your account"
                    : "Sign up to start your learning journey")}
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

            {refreshMessage && (
              <div className={refreshMessage.includes("successfully") ? styles.successMessage : styles.errorMessage}>
                {refreshMessage}
              </div>
            )}

            {showVerification ? (
              <form onSubmit={handleVerifyEmail} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="otp">
                    Verification Code <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                  />
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                  {loading ? "Verifying..." : "Verify Email"}
                </button>

                <div className={styles.toggleAuth}>
                  <p>
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className={styles.toggleButton}
                      disabled={resendingOtp || resendCooldown > 0}
                    >
                      {resendingOtp 
                        ? "Sending..." 
                        : resendCooldown > 0 
                        ? `Resend in ${resendCooldown}s` 
                        : "Resend OTP"}
                    </button>
                  </p>
                </div>
                
                <div className={styles.toggleAuth} style={{ marginTop: "0.5rem" }}>
                  <p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowVerification(false);
                        setIsLogin(false);
                        setResendCooldown(0);
                      }}
                      className={styles.toggleButton}
                    >
                      Back to Signup
                    </button>
                  </p>
                </div>
              </form>
            ) : (
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

              {isLogin && (
                <button 
                  type="button" 
                  onClick={handleRefreshData} 
                  className={styles.refreshButton}
                  disabled={refreshingData}
                  style={{
                    marginTop: "0.75rem",
                    width: "100%",
                    padding: "0.875rem",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: refreshingData ? "not-allowed" : "pointer",
                    opacity: refreshingData ? 0.6 : 1,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!refreshingData) {
                      e.currentTarget.style.backgroundColor = "#059669";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#10b981";
                  }}
                >
                  {refreshingData ? "Refreshing..." : "Refresh Data"}
                </button>
              )}
              
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
