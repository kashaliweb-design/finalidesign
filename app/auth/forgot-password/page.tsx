"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setSuccess(data.message || "Password reset email sent successfully!");
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      <div className={styles.authContent}>
        {/* Left Info Box */}
        <div className={styles.infoBox}>
          <div className={styles.svgContainer}>
            <Image
              src="/undraw_forgot-password_nttj (1).svg"
              alt="Forgot Password"
              width={400}
              height={300}
              className={styles.loginSvg}
              priority
            />
          </div>
          <h2>Reset Your Password</h2>
          <p>Follow these simple steps to reset your password:</p>
          <ul className={styles.coursesList}>
            <li>Enter your email address</li>
            <li>Check your inbox for a reset link</li>
            <li>Click the link to set a new password</li>
            <li>Log in with your new password</li>
          </ul>
          <p className={styles.securityNote}>
            For security reasons, the reset link will expire after 24 hours.
          </p>
        </div>
        
        {/* Form Section - Right Side */}
        <div className={styles.formSection}>
          <div className={styles.formWrapper}>
            <div className={styles.logo}>
              <h1>51Skills</h1>
            </div>

            {!isSubmitted ? (
              <>
                <div className={styles.formHeader}>
                  <h2>Forgot Password?</h2>
                  <p>
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </div>

                {error && (
                  <div className={styles.errorMessage}>
                    {error}
                  </div>
                )}
                
                {success && !isSubmitted && (
                  <div className={styles.successMessage}>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                  
                  <div className={styles.toggleAuth}>
                    <p>
                      Remember your password?{" "}
                      <Link href="/auth" className={styles.toggleButton}>
                        Back to Login
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h2>Email Sent!</h2>
                <p>
                  We've sent a verification code to <strong>{email}</strong>. 
                  Please check your inbox and use the code to reset your password.
                </p>
                <p className={styles.checkSpam}>
                  If you don't see the email, please check your spam folder.
                </p>
                <Link href={`/auth/reset-password?email=${encodeURIComponent(email)}`} className={styles.backToLoginBtn}>
                  Reset Password Now
                </Link>
                <div style={{ marginTop: "1rem" }}>
                  <Link href="/auth" className={styles.toggleButton}>
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
