"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./profile.module.css";
import { User, BookOpen, Settings, LogOut, Bell, Lock, HelpCircle } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const menuItems = [
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
    { id: 'my-courses', icon: <BookOpen size={20} />, label: 'My Courses' },
    { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
    { id: 'security', icon: <Lock size={20} />, label: 'Security' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help & Support' },
    { id: 'logout', icon: <LogOut size={20} />, label: 'Logout' },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
        });

        if (!response.ok) {
          router.push("/auth");
          return;
        }

        const data = await response.json();
        setUser({
          ...data.user,
          name: data.user?.firstName + ' ' + (data.user?.lastName || ''),
          email: data.user?.email || "user@example.com",
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          courses: 12,
          completed: 8,
          inProgress: 3,
        });
      } catch (error) {
        router.push("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }


  return (
    <div className={styles.profileContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{user.courses}</span>
              <span className={styles.statLabel}>Courses</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{user.completed}</span>
              <span className={styles.statLabel}>Completed</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{user.inProgress}</span>
              <span className={styles.statLabel}>In Progress</span>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {menuItems.map((item) => (
              <li 
                key={item.id}
                className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                onClick={() => item.id === 'logout' ? handleLogout() : setActiveTab(item.id)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <h2>My Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.cardHeader}>
            <h3>Personal Information</h3>
            <button className={styles.editButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
              </svg>
              Edit Profile
            </button>
          </div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Full Name</label>
              <p>{user.name}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Username</label>
              <p>@{user.userName || 'username'}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Member Since</label>
              <p>{user.joinDate}</p>
            </div>
          </div>
        </div>

        <div className={styles.statsCards}>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon} style={{ backgroundColor: '#e3f2fd' }}>
              <BookOpen size={24} color="#1976d2" />
            </div>
            <div>
              <h4>Enrolled Courses</h4>
              <p>{user.courses} Courses</p>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon} style={{ backgroundColor: '#e8f5e9' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <h4>Completed</h4>
              <p>{user.completed} Courses</p>
            </div>
          </div>
          <div className={styles.statsCard}>
            <div className={styles.statsIcon} style={{ backgroundColor: '#fff3e0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef6c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <h4>In Progress</h4>
              <p>{user.inProgress} Courses</p>
            </div>
          </div>
        </div>

        <div className={styles.settingsGrid}>
          <Link href="/select-role" className={styles.settingCard}>
            <div className={styles.settingIcon} style={{ backgroundColor: '#e3f2fd' }}>
              <User size={20} color="#1976d2" />
            </div>
            <div className={styles.settingInfo}>
              <h4>Change Role</h4>
              <p>Switch between Student, Instructor, or Admin</p>
            </div>
          </Link>

          <Link href="/courses" className={styles.settingCard}>
            <div className={styles.settingIcon} style={{ backgroundColor: '#e8f5e9' }}>
              <BookOpen size={20} color="#2e7d32" />
            </div>
            <div className={styles.settingInfo}>
              <h4>My Courses</h4>
              <p>View enrolled courses</p>
            </div>
          </Link>

          <Link href="/profile/referral" className={styles.settingCard}>
            <div className={styles.settingIcon} style={{ backgroundColor: '#fff3e0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef6c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div className={styles.settingInfo}>
              <h4>Referral Source</h4>
              <p>Tell us how you found us</p>
            </div>
          </Link>

          <Link href="/profile/bug-report" className={styles.settingCard}>
            <div className={styles.settingIcon} style={{ backgroundColor: '#ffebee' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className={styles.settingInfo}>
              <h4>Report a Bug</h4>
              <p>Help us improve the platform</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
