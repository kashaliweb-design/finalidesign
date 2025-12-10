"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
  });

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
        setFormData({
          firstName: data.user?.firstName || "",
          lastName: data.user?.lastName || "",
          userName: data.user?.userName || "",
          email: data.user?.email || "",
        });
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/user/update-user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message || "Failed to update profile");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
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
    <div className={styles.profileContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>51Skills</h1>
          <nav className={styles.nav}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/courses" className={styles.navLink}>Courses</Link>
            <Link href="/profile" className={styles.navLink}>Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatar}>
                {formData.firstName?.charAt(0) || formData.userName?.charAt(0) || "U"}
              </div>
              <div className={styles.profileInfo}>
                <h2>{formData.firstName} {formData.lastName}</h2>
                <p>@{formData.userName}</p>
              </div>
            </div>

            <div className={styles.profileBody}>
              <div className={styles.sectionHeader}>
                <h3>Personal Information</h3>
                {!editing ? (
                  <button onClick={() => setEditing(true)} className={styles.editBtn}>
                    Edit Profile
                  </button>
                ) : (
                  <div className={styles.editActions}>
                    <button onClick={handleSave} className={styles.saveBtn}>
                      Save
                    </button>
                    <button onClick={() => setEditing(false)} className={styles.cancelBtn}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{formData.firstName}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{formData.lastName}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Username</label>
                  {editing ? (
                    <input
                      type="text"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  ) : (
                    <p className={styles.value}>{formData.userName}</p>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <p className={styles.value}>{formData.email}</p>
                  <span className={styles.note}>Email cannot be changed</span>
                </div>
              </div>

              <div className={styles.quickLinks}>
                <h3>Account Settings</h3>
                <div className={styles.linksList}>
                  <Link href="/auth/change-password" className={styles.settingLink}>
                    <span className={styles.linkIcon}>🔒</span>
                    <div>
                      <h4>Change Password</h4>
                      <p>Update your account password</p>
                    </div>
                  </Link>

                  <Link href="/profile/interests" className={styles.settingLink}>
                    <span className={styles.linkIcon}>⭐</span>
                    <div>
                      <h4>My Interests</h4>
                      <p>Manage your learning interests</p>
                    </div>
                  </Link>

                  <Link href="/select-role" className={styles.settingLink}>
                    <span className={styles.linkIcon}>👤</span>
                    <div>
                      <h4>Change Role</h4>
                      <p>Switch between Student, Instructor, or Admin</p>
                    </div>
                  </Link>

                  <Link href="/courses" className={styles.settingLink}>
                    <span className={styles.linkIcon}>🎓</span>
                    <div>
                      <h4>My Courses</h4>
                      <p>View enrolled courses</p>
                    </div>
                  </Link>

                  <Link href="/profile/referral" className={styles.settingLink}>
                    <span className={styles.linkIcon}>📢</span>
                    <div>
                      <h4>Referral Source</h4>
                      <p>Tell us how you found us</p>
                    </div>
                  </Link>

                  <Link href="/profile/bug-report" className={styles.settingLink}>
                    <span className={styles.linkIcon}>🐛</span>
                    <div>
                      <h4>Report a Bug</h4>
                      <p>Help us improve the platform</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
