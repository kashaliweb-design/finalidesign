"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  
  // Step 1: Referral Source
  const [selectedSource, setSelectedSource] = useState("");
  
  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);

  const referralSources = [
    { id: "youtube", name: "YouTube", icon: "📺" },
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "twitter", name: "Twitter", icon: "🐦" },
    { id: "linkedin", name: "LinkedIn", icon: "💼" },
    { id: "friend", name: "Friend/Family", icon: "👥" },
    { id: "search", name: "Search Engine", icon: "🔍" },
    { id: "advertisement", name: "Advertisement", icon: "📢" },
    { id: "other", name: "Other", icon: "📌" },
  ];

  const skillsInterests = [
    { id: "web_dev", name: "Web Development", icon: "💻" },
    { id: "mobile_dev", name: "Mobile Development", icon: "📱" },
    { id: "data_science", name: "Data Science", icon: "📊" },
    { id: "machine_learning", name: "Machine Learning", icon: "🤖" },
    { id: "ui_ux", name: "UI/UX Design", icon: "🎨" },
    { id: "digital_marketing", name: "Digital Marketing", icon: "📈" },
    { id: "java", name: "Java Programming", icon: "☕" },
    { id: "python", name: "Python Programming", icon: "🐍" },
    { id: "javascript", name: "JavaScript", icon: "⚡" },
    { id: "cloud", name: "Cloud Computing", icon: "☁️" },
    { id: "cybersecurity", name: "Cybersecurity", icon: "🔒" },
    { id: "blockchain", name: "Blockchain", icon: "⛓️" },
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Get user data from localStorage or API
      const userData = localStorage.getItem("userData");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.firstName || user.userName || "User");
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to get user data:", error);
      router.push("/auth");
    }
  };

  const handleInterestToggle = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((id) => id !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Step 1: Save referral source
      if (!selectedSource) {
        alert("Please select how you found us");
        return;
      }
      
      try {
        await fetch("/api/user/create-user-referral-source", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ source: selectedSource }),
        });
      } catch (error) {
        console.error("Failed to save referral source:", error);
      }
      
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Step 2: Save interests
      if (selectedInterests.length === 0) {
        alert("Please select at least one interest");
        return;
      }
      
      setSubmitting(true);
      try {
        // Save each interest
        for (const interest of selectedInterests) {
          await fetch("/api/user/create-user-interest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ 
              name: skillsInterests.find(s => s.id === interest)?.name || interest 
            }),
          });
        }
        
        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to save interests:", error);
        alert("Failed to save interests. Redirecting to dashboard...");
        router.push("/dashboard");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
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
          <button onClick={handleSkip} className={styles.skipBtn}>
            Skip
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {/* Progress Bar */}
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((currentStep + 1) / 2) * 100}%` }}
              ></div>
            </div>
            <p className={styles.progressText}>
              Step {currentStep + 1} of 2
            </p>
          </div>

          {/* Step 1: Referral Source */}
          {currentStep === 0 && (
            <div className={styles.stepContainer}>
              <div className={styles.stepHeader}>
                <h1>👋 Welcome to 51Skills, {userName}!</h1>
                <p>How did you hear about us?</p>
              </div>

              <div className={styles.optionsGrid}>
                {referralSources.map((source) => (
                  <div
                    key={source.id}
                    className={`${styles.optionCard} ${
                      selectedSource === source.id ? styles.selected : ""
                    }`}
                    onClick={() => setSelectedSource(source.id)}
                  >
                    <div className={styles.optionIcon}>{source.icon}</div>
                    <div className={styles.optionName}>{source.name}</div>
                  </div>
                ))}
              </div>

              <div className={styles.stepActions}>
                <button
                  onClick={handleNext}
                  disabled={!selectedSource}
                  className={styles.primaryBtn}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {currentStep === 1 && (
            <div className={styles.stepContainer}>
              <div className={styles.stepHeader}>
                <h1>🎯 What skills interest you?</h1>
                <p>Select all that apply (you can change this later)</p>
              </div>

              <div className={styles.optionsGrid}>
                {skillsInterests.map((skill) => (
                  <div
                    key={skill.id}
                    className={`${styles.optionCard} ${
                      selectedInterests.includes(skill.id) ? styles.selected : ""
                    }`}
                    onClick={() => handleInterestToggle(skill.id)}
                  >
                    <div className={styles.optionIcon}>{skill.icon}</div>
                    <div className={styles.optionName}>{skill.name}</div>
                    {selectedInterests.includes(skill.id) && (
                      <div className={styles.checkmark}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.stepActions}>
                <button
                  onClick={() => setCurrentStep(0)}
                  className={styles.secondaryBtn}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedInterests.length === 0 || submitting}
                  className={styles.primaryBtn}
                >
                  {submitting ? "Saving..." : "Complete & Go to Dashboard"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
