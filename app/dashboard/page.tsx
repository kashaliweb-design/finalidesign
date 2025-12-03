"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for user data
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUser(userData);
          setLoading(false);
          return;
        }

        // If no localStorage data, try to verify with backend
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/auth");
          return;
        }

        const data = await response.json();
        const user = data.user || data.data;
        setUser(user);
        
        // Store user data in localStorage for future use
        if (user) {
          localStorage.setItem("userData", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Setup auto-refresh token every 30 minutes
    const refreshInterval = setInterval(async () => {
      try {
        await fetch("/api/auth/refresh-token", {
          method: "POST",
          credentials: "include",
        });
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(refreshInterval);
  }, [router]);

  const fetchUserData = async () => {
    try {
      console.log("Fetching user data...");
      console.log("Current cookies:", document.cookie);
      
      const response = await fetch("/api/auth/user", {
        method: "GET",
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("User data from backend:", data);
        
        // Update user state with fresh data
        const userData = data.data || data.user || data;
        setUser(userData);
        
        // Update localStorage
        if (userData) {
          localStorage.setItem("userData", JSON.stringify(userData));
        }
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch user data:", response.status, errorData);
        alert(`Error: ${errorData.message || 'Failed to fetch user data'}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert(`Error: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      // Clear localStorage
      localStorage.removeItem("userData");
      localStorage.clear();
      
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear localStorage even if API fails
      localStorage.removeItem("userData");
      localStorage.clear();
      router.push("/auth");
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
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>51Skills</h1>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/profile" className={styles.navLink}>Profile</Link>
            <button onClick={fetchUserData} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              Refresh Data
            </button>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Welcome Section */}
          <section className={styles.welcomeSection}>
            <h2>Welcome back, {user?.firstName || user?.userName || "Student"}! 👋</h2>
            <p>Continue your learning journey</p>
          </section>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div className={styles.statInfo}>
                <h3>Enrolled Courses</h3>
                <p className={styles.statNumber}>5</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statInfo}>
                <h3>Completed</h3>
                <p className={styles.statNumber}>2</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>⏱️</div>
              <div className={styles.statInfo}>
                <h3>In Progress</h3>
                <p className={styles.statNumber}>3</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>🏆</div>
              <div className={styles.statInfo}>
                <h3>Certificates</h3>
                <p className={styles.statNumber}>2</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              <Link href="/courses" className={styles.actionCard}>
                <span className={styles.actionIcon}>🔍</span>
                <h4>Browse Courses</h4>
                <p>Explore new courses</p>
              </Link>

              <Link href="/profile" className={styles.actionCard}>
                <span className={styles.actionIcon}>👤</span>
                <h4>My Profile</h4>
                <p>View and edit profile</p>
              </Link>

              <Link href="/auth/change-password" className={styles.actionCard}>
                <span className={styles.actionIcon}>🔒</span>
                <h4>Change Password</h4>
                <p>Update your password</p>
              </Link>

              <Link href="/certificates" className={styles.actionCard}>
                <span className={styles.actionIcon}>📜</span>
                <h4>Certificates</h4>
                <p>View your achievements</p>
              </Link>
            </div>
          </section>

          {/* Recent Activity */}
          <section className={styles.recentActivity}>
            <h3>Recent Activity</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>📚</div>
                <div className={styles.activityContent}>
                  <h4>Completed: Web Development Basics</h4>
                  <p>2 days ago</p>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>🎯</div>
                <div className={styles.activityContent}>
                  <h4>Started: Advanced JavaScript</h4>
                  <p>5 days ago</p>
                </div>
              </div>

              <div className={styles.activityItem}>
                <div className={styles.activityIcon}>🏆</div>
                <div className={styles.activityContent}>
                  <h4>Earned Certificate: React Fundamentals</h4>
                  <p>1 week ago</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
