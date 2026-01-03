"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./onboarding.module.css";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  
  // Step 1: Referral Source (Multi-select)
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  
  // Step 2: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [submitting, setSubmitting] = useState(false);

  const referralSources = [
    { id: "YOUTUBE", name: "YouTube", icon: "📺" },
    { id: "FACEBOOK", name: "Facebook", icon: "📘" },
    { id: "INSTAGRAM", name: "Instagram", icon: "📷" },
    { id: "GOOGLE", name: "Google", icon: "🔍" },
    { id: "LINKEDIN", name: "LinkedIn", icon: "💼" },
    { id: "FRIEND", name: "Friend/Family", icon: "👥" },
    { id: "WHATSAPP", name: "WhatsApp", icon: "💬" },
    { id: "TECH_EVENT", name: "Tech Event", icon: "📢" },
    { id: "OTHER", name: "Other", icon: "📌" },
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
      // Check onboarding status from API
      const response = await fetch("/api/user/get-user", {
        method: "GET",
      });

      if (!response.ok) {
        router.push("/auth");
        return;
      }

      const data = await response.json();
      const user = data.user;
      
      // Check if user has completed onboarding (has referral sources or interests)
      const hasReferralSources = user?.referralSources && user.referralSources.length > 0;
      const hasInterests = user?.interests && user.interests.length > 0;
      
      if (hasReferralSources && hasInterests) {
        // User has already completed onboarding, redirect to dashboard
        localStorage.setItem("onboardingCompleted", "true");
        router.push("/dashboard");
        return;
      }

      setUserName(user.firstName || user.userName || "User");
      setLoading(false);
    } catch (error) {
      console.error("Failed to get user data:", error);
      router.push("/auth");
    }
  };

  const handleSourceToggle = (sourceId: string) => {
    if (selectedSources.includes(sourceId)) {
      setSelectedSources(selectedSources.filter((id) => id !== sourceId));
    } else {
      setSelectedSources([...selectedSources, sourceId]);
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
    console.log("handleNext called, currentStep:", currentStep);
    
    if (currentStep === 0) {
      // Step 1: Save referral sources (multi-select)
      if (selectedSources.length === 0) {
        alert("Please select at least one option for how you found us");
        return;
      }
      
      try {
        const authToken = localStorage.getItem("authToken");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
        }
        
        console.log("Saving referral sources with token:", authToken ? "Present" : "Missing");
        
        const response = await fetch("/api/user/create-user-referral-source", {
          method: "POST",
          headers,
          body: JSON.stringify({ source: selectedSources }),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          console.error("Failed to save referral sources:", result);
          alert(`Failed to save referral sources: ${result.message || 'Unknown error'}`);
          return;
        }
        
        console.log("Referral sources saved successfully:", result);
      } catch (error) {
        console.error("Failed to save referral sources:", error);
        alert("Failed to save referral sources. Please try again.");
        return;
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
        console.log("Saving interests:", selectedInterests);
        
        // Save each interest
        const authToken = localStorage.getItem("authToken");
        
        if (!authToken) {
          console.error("No auth token found in localStorage");
          alert("Authentication error. Please login again.");
          router.push("/auth");
          return;
        }
        
        const headers: HeadersInit = { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        };
        
        let failedInterests = [];
        
        for (const interest of selectedInterests) {
          const interestName = skillsInterests.find(s => s.id === interest)?.name || interest;
          console.log("Saving interest:", interestName);
          
          const response = await fetch("/api/user/create-user-interest", {
            method: "POST",
            headers,
            body: JSON.stringify({ name: interestName }),
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            console.error("Failed to save interest:", interestName, result);
            failedInterests.push(interestName);
          } else {
            console.log("Interest saved successfully:", interestName, result);
          }
        }
        
        if (failedInterests.length > 0) {
          console.warn("Some interests failed to save:", failedInterests);
          alert(`Warning: Failed to save some interests: ${failedInterests.join(", ")}`);
        }
        
        console.log("All interests processed, marking onboarding complete");
        
        // Mark onboarding as completed
        localStorage.setItem("onboardingCompleted", "true");
        
        console.log("Redirecting to dashboard...");
        
        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to save interests:", error);
        alert("An error occurred while saving your interests. Please try again.");
        setSubmitting(false);
      }
    }
  };

  const handleSkip = () => {
    // Smart skip: Step 0 (Referral) -> Step 1 (Interest), Step 1 (Interest) -> Dashboard
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      localStorage.setItem("onboardingCompleted", "true");
      router.push("/dashboard");
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
                      selectedSources.includes(source.id) ? styles.selected : ""
                    }`}
                    onClick={() => handleSourceToggle(source.id)}
                  >
                    <div className={styles.optionIcon}>{source.icon}</div>
                    <div className={styles.optionName}>{source.name}</div>
                    {selectedSources.includes(source.id) && (
                      <div className={styles.checkmark}>✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.stepActions}>
                <button
                  onClick={handleNext}
                  disabled={selectedSources.length === 0}
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
