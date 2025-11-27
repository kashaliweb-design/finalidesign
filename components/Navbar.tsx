"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css";
import { Search, Globe, BookOpen, ShoppingCart, Bell, User, Sun, Menu } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";
type DropdownItem = "explore" | "teach" | "theme" | "language" | "learning" | "cart" | "notifications" | "profile" | null;

export default function Navbar() {
  const router = useRouter();
  const [cartCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [activeDropdown, setActiveDropdown] = useState<DropdownItem>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
    if (mode === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document.body?.setAttribute("data-theme", "light");
    } else if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.body?.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body?.removeAttribute("data-theme");
    }
  };

  const handleMouseEnter = (item: DropdownItem) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setActiveDropdown(item);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 1000);
    setHoverTimeout(timeout);
  };

  const handleClick = (item: DropdownItem) => {
    if (activeDropdown === item) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(item);
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.left}>
            <button className={styles.hamburger} onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>

            <button
              type="button"
              className={styles.logo}
              onClick={() => router.push("/")}
            >
              51Skills
            </button>

            <div className={styles.menu}>
              <div
                className={`${styles.menuItem} ${activeDropdown === 'explore' ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter('explore')}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick('explore')}
              >
                Explore ▾
                {activeDropdown === 'explore' && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropCol}>
                      <h4>Development</h4>
                      <p>Web Development</p>
                      <p>Mobile Development</p>
                      <p>Game Development</p>
                    </div>
                    <div className={styles.dropCol}>
                      <h4>Business</h4>
                      <p>Entrepreneurship</p>
                      <p>Finance</p>
                      <p>Management</p>
                    </div>
                    <div className={styles.dropCol}>
                      <h4>IT & Software</h4>
                      <p>Certifications</p>
                      <p>Network & Security</p>
                      <p>Hardware</p>
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`${styles.menuItem} ${activeDropdown === 'teach' ? styles.active : ''}`}
                onMouseEnter={() => handleMouseEnter('teach')}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick('teach')}
              >
                Teach ▾
                {activeDropdown === 'teach' && (
                  <div className={styles.dropdownSmall}>
                    <p>Instructor Dashboard</p>
                    <p>Create New Course</p>
                    <p>Analytics</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.searchWrapper}>
            <div className={styles.searchBox}>
              <Search className={styles.searchIcon} />
              <input className={styles.searchInput} placeholder="Search for courses" />
            </div>
          </div>

          <div className={styles.right}>
            <div
              className={styles.iconBtn1}
              onClick={() => handleClick('theme')}
            >
              <Sun className={styles.iconSvg} />
              {activeDropdown === 'theme' && (
                <div className={styles.themeDropdown}>
                  <h4>Choose Theme</h4>
                  <p onClick={() => handleThemeChange("light")}>Light</p>
                  <p onClick={() => handleThemeChange("dark")}>Dark</p>
                  <p onClick={() => handleThemeChange("system")}>System</p>
                </div>
              )}
            </div>

            <div
              className={`${styles.iconBtn} ${activeDropdown === 'language' ? styles.active : ''}`}
              onMouseEnter={() => handleMouseEnter('language')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('language')}
            >
              <Globe className={styles.iconSvg} />
              {activeDropdown === 'language' && (
                <div className={styles.languageDropdown}>
                  <h4>Language & Region</h4>
                  <div className={styles.langOption}>
                    <p>English</p>
                    <p>Español</p>
                    <p>Français</p>
                    <p>Deutsch</p>
                  </div>
                  <p>Choose your preferred language and region settings</p>
                </div>
              )}
            </div>

            <div
              className={`${styles.iconBtn} ${activeDropdown === 'learning' ? styles.active : ''}`}
              onMouseEnter={() => handleMouseEnter('learning')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('learning')}
            >
              <BookOpen className={styles.iconSvg} />
              {activeDropdown === 'learning' && (
                <div className={styles.learningDropdown}>
                  <h4>My Learning</h4>
                  <div className={styles.langOption}>
                    <p>My Courses</p>
                    <p>Certificates</p>
                    <p>Saved Courses</p>
                  </div>
                  <p>Track your progress and continue learning</p>
                </div>
              )}
            </div>

            <div
              className={`${styles.iconBtn} ${activeDropdown === 'cart' ? styles.active : ''}`}
              onMouseEnter={() => handleMouseEnter('cart')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('cart')}
            >
              <ShoppingCart className={styles.iconSvg} />
              {activeDropdown === 'cart' && (
                <div className={styles.cartDropdown}>
                  <h4>Shopping Cart</h4>
                  <div className={styles.cartOption}>
                    <p>Checkout</p>
                    <p>Wishlist</p>
                  </div>
                  <p>Your cart is empty <span>Browse Courses</span></p>
                </div>
              )}
            </div>

            <div
              className={`${styles.iconBtn} ${activeDropdown === 'notifications' ? styles.active : ''}`}
              onMouseEnter={() => handleMouseEnter('notifications')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('notifications')}
            >
              <Bell className={styles.iconSvg} />
              {activeDropdown === 'notifications' && (
                <div className={styles.notificationsDropdown}>
                  <h4>Notifications</h4>
                  <div className={styles.notificationsOption}>
                    <p>Messages</p>
                    <p>Reminders</p>
                  </div>
                  <p>Stay updated with course announcements and messages</p>
                </div>
              )}
            </div>

            <div
              className={`${styles.iconBtn} ${activeDropdown === 'profile' ? styles.active : ''}`}
              onMouseEnter={() => handleMouseEnter('profile')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('profile')}
            >
              <User className={styles.iconSvg} />
              {activeDropdown === 'profile' && (
                <div className={styles.profileDropdown}>
                  <h4>Profile</h4>
                  <div className={styles.profileOption}>
                    <p>My Learning</p>
                    <p>Teach</p>
                    <p>Role: Student <span>(Switch to Instructor)</span></p>
                    <p>Logout</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
