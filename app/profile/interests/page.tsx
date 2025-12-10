"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./interests.module.css";

interface Interest {
  id: string;
  name: string;
  category?: string;
}

export default function InterestsPage() {
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [newInterest, setNewInterest] = useState("");
  const [category, setCategory] = useState("");
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
      setInterests(data.user?.interests || []);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;

    setAdding(true);
    try {
      const response = await fetch("/api/user/create-user-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: newInterest,
          category: category || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to add interest");
        return;
      }

      const data = await response.json();
      setInterests([...interests, data.interest]);
      setNewInterest("");
      setCategory("");
      alert("Interest added successfully!");
    } catch (error) {
      alert("Failed to add interest. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteInterest = async (interestId: string) => {
    if (!confirm("Are you sure you want to remove this interest?")) return;

    try {
      const response = await fetch("/api/user/delete-user-interest", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ interestId }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to delete interest");
        return;
      }

      setInterests(interests.filter((i) => i.id !== interestId));
      alert("Interest removed successfully!");
    } catch (error) {
      alert("Failed to delete interest. Please try again.");
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
            <Link href="/profile/interests" className={styles.navLink}>Interests</Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h1>My Interests</h1>
            <p>Manage your learning interests and preferences</p>
          </div>

          <div className={styles.card}>
            <h2>Add New Interest</h2>
            <form onSubmit={handleAddInterest} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="interest">Interest Name</label>
                <input
                  type="text"
                  id="interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="e.g., Web Development, Data Science"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category (Optional)</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Technology, Business"
                  className={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={adding}
                className={styles.submitBtn}
              >
                {adding ? "Adding..." : "Add Interest"}
              </button>
            </form>
          </div>

          <div className={styles.card}>
            <h2>Your Interests ({interests.length})</h2>
            {interests.length === 0 ? (
              <p className={styles.emptyState}>
                No interests added yet. Add your first interest above!
              </p>
            ) : (
              <div className={styles.interestsList}>
                {interests.map((interest) => (
                  <div key={interest.id} className={styles.interestItem}>
                    <div className={styles.interestInfo}>
                      <h3>{interest.name}</h3>
                      {interest.category && (
                        <span className={styles.category}>{interest.category}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteInterest(interest.id)}
                      className={styles.deleteBtn}
                      title="Remove interest"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
