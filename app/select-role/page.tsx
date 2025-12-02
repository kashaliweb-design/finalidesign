"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./select-role.module.css";

export default function SelectRolePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.push("/auth");
          return;
        }

        const data = await response.json();
        setUser(data.user);
        setSelectedRole(data.user?.currentRole || "");
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleRoleUpdate = async (role: string) => {
    setError("");
    setSuccess("");
    setUpdating(true);

    try {
      const response = await fetch("/api/auth/update-current-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setSuccess("Role updated successfully!");
      setSelectedRole(role);
      
      // Update user data
      setUser({ ...user, currentRole: role });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to update role. Please try again.");
    } finally {
      setUpdating(false);
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
    <div className={styles.roleContainer}>
      <div className={styles.roleCard}>
        <div className={styles.header}>
          <h1>Select Your Role</h1>
          <p>Choose how you want to use 51Skills</p>
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

        <div className={styles.rolesGrid}>
          {/* Student Role */}
          <div 
            className={`${styles.roleOption} ${selectedRole === 'student' ? styles.selected : ''}`}
            onClick={() => !updating && handleRoleUpdate('student')}
          >
            <div className={styles.roleIcon}>🎓</div>
            <h3>Student</h3>
            <p>Learn new skills and take courses</p>
            <ul className={styles.features}>
              <li>Access to all courses</li>
              <li>Track your progress</li>
              <li>Earn certificates</li>
              <li>Join community</li>
            </ul>
            {selectedRole === 'student' && (
              <div className={styles.selectedBadge}>✓ Current Role</div>
            )}
          </div>

          {/* Instructor Role */}
          <div 
            className={`${styles.roleOption} ${selectedRole === 'instructor' ? styles.selected : ''}`}
            onClick={() => !updating && handleRoleUpdate('instructor')}
          >
            <div className={styles.roleIcon}>👨‍🏫</div>
            <h3>Instructor</h3>
            <p>Create and teach courses</p>
            <ul className={styles.features}>
              <li>Create courses</li>
              <li>Manage students</li>
              <li>Track analytics</li>
              <li>Earn revenue</li>
            </ul>
            {selectedRole === 'instructor' && (
              <div className={styles.selectedBadge}>✓ Current Role</div>
            )}
          </div>

          {/* Admin Role (if applicable) */}
          <div 
            className={`${styles.roleOption} ${selectedRole === 'admin' ? styles.selected : ''}`}
            onClick={() => !updating && handleRoleUpdate('admin')}
          >
            <div className={styles.roleIcon}>👨‍💼</div>
            <h3>Admin</h3>
            <p>Manage the platform</p>
            <ul className={styles.features}>
              <li>Manage users</li>
              <li>Approve courses</li>
              <li>View analytics</li>
              <li>Platform settings</li>
            </ul>
            {selectedRole === 'admin' && (
              <div className={styles.selectedBadge}>✓ Current Role</div>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <p>You can change your role anytime from your profile settings</p>
          <button 
            onClick={() => router.push("/dashboard")}
            className={styles.skipButton}
            disabled={updating}
          >
            {updating ? "Updating..." : "Continue to Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
