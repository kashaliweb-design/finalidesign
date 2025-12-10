"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./referral.module.css";

interface ReferralSource {
  id: string;
  source: string;
  details?: string;
  createdAt?: string;
}

export default function ReferralPage() {
  const router = useRouter();
  const [referralSources, setReferralSources] = useState<ReferralSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSource, setNewSource] = useState("");
  const [details, setDetails] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/get-user", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/auth");
        return;
      }

      const data = await response.json();
      setReferralSources(data.user?.referralSources || []);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim()) return;

    setAdding(true);
    try {
      const response = await fetch("/api/user/create-user-referral-source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          source: newSource,
          details: details || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to add referral source");
        return;
      }

      const data = await response.json();
      setReferralSources([...referralSources, data.referralSource]);
      setNewSource("");
      setDetails("");
      alert("Referral source added successfully!");
    } catch (error) {
      alert("Failed to add referral source. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!confirm("Are you sure you want to remove this referral source?")) return;

    try {
      const response = await fetch("/api/user/delete-user-referral-source", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sourceId }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete referral source");
        return;
      }

      setReferralSources(referralSources.filter((s) => s.id !== sourceId));
      alert("Referral source removed successfully!");
    } catch (error) {
      alert("Failed to delete referral source. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>51Skills</h1>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/profile" className={styles.navLink}>Profile</Link>
            <Link href="/profile/referral" className={styles.navLink}>Referral</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1>📢 Referral Sources</h1>
            <p>Track how you heard about us and share with others</p>
          </div>

          <div className={styles.card}>
            <h2>Add Referral Source</h2>
            <form onSubmit={handleAddSource} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="source">How did you hear about us? *</label>
                <select
                  id="source"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select a source</option>
                  <option value="friend">Friend or Family</option>
                  <option value="social_media">Social Media</option>
                  <option value="search_engine">Search Engine (Google, Bing)</option>
                  <option value="advertisement">Advertisement</option>
                  <option value="blog">Blog or Article</option>
                  <option value="youtube">YouTube</option>
                  <option value="podcast">Podcast</option>
                  <option value="email">Email Newsletter</option>
                  <option value="event">Event or Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="details">Additional Details (Optional)</label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us more about how you found us..."
                  className={styles.textarea}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className={styles.submitBtn}
              >
                {adding ? "Adding..." : "Add Source"}
              </button>
            </form>
          </div>

          <div className={styles.card}>
            <h2>Your Referral Sources ({referralSources.length})</h2>
            {referralSources.length === 0 ? (
              <p className={styles.emptyState}>
                No referral sources added yet. Let us know how you found us!
              </p>
            ) : (
              <div className={styles.sourcesList}>
                {referralSources.map((source) => (
                  <div key={source.id} className={styles.sourceItem}>
                    <div className={styles.sourceInfo}>
                      <div className={styles.sourceIcon}>📍</div>
                      <div>
                        <h3>{source.source.replace(/_/g, " ").toUpperCase()}</h3>
                        {source.details && (
                          <p className={styles.sourceDetails}>{source.details}</p>
                        )}
                        {source.createdAt && (
                          <span className={styles.sourceDate}>
                            Added: {new Date(source.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSource(source.id)}
                      className={styles.deleteBtn}
                      title="Remove source"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.infoCard}>
            <h3>💡 Why we ask</h3>
            <p>
              Understanding how you found us helps us improve our outreach and connect
              with more learners like you. Your feedback is valuable!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
