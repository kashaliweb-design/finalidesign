"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./bug-report.module.css";

export default function BugReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "medium",
    category: "general",
    steps: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const response = await fetch("/api/user/create-user-bug-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to submit bug report");
        return;
      }

      setSuccess(true);
      setFormData({
        title: "",
        description: "",
        severity: "medium",
        category: "general",
        steps: "",
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      alert("Failed to submit bug report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>51Skills</h1>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/profile" className={styles.navLink}>Profile</Link>
            <Link href="/profile/bug-report" className={styles.navLink}>Report Bug</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1>🐛 Report a Bug</h1>
            <p>Help us improve by reporting any issues you encounter</p>
          </div>

          {success && (
            <div className={styles.successMessage}>
              ✅ Bug report submitted successfully! Redirecting to dashboard...
            </div>
          )}

          <div className={styles.card}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Bug Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief description of the issue"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="severity">Severity</label>
                  <select
                    id="severity"
                    name="severity"
                    value={formData.severity}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="general">General</option>
                    <option value="ui">UI/UX</option>
                    <option value="performance">Performance</option>
                    <option value="security">Security</option>
                    <option value="api">API</option>
                    <option value="authentication">Authentication</option>
                    <option value="courses">Courses</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed description of the bug..."
                  className={styles.textarea}
                  rows={5}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="steps">Steps to Reproduce</label>
                <textarea
                  id="steps"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              <div className={styles.infoBox}>
                <strong>💡 Tip:</strong> Include as much detail as possible to help us fix the issue faster.
                Screenshots and error messages are especially helpful!
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitBtn}
              >
                {submitting ? "Submitting..." : "Submit Bug Report"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
