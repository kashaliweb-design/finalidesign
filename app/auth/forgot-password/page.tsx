"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../auth.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to send a reset email
    // For now, we'll just show the success message
    setIsSubmitted(true);
  };

  return (
    <div className={styles.authContainer}>
      
      <div className={styles.authContent}>
        {/* Left Info Box */}
        <div className={styles.infoBox}>
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

                  <button type="submit" className={styles.submitButton}>
                    Send Reset Link
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
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className={styles.checkSpam}>
                  If you don't see the email, please check your spam folder.
                </p>
                <Link href="/auth" className={styles.backToLoginBtn}>
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
