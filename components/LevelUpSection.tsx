"use client";
import { useState } from "react";
import Image from "next/image";
import styles from "./LevelUpSection.module.css";

interface Review {
  text: string;
  name: string;
  role: string;
  img: string;
}

export default function LevelUpSection() {
  const reviews: Review[] = [
    {
      text: "51skills completely transformed my career path...",
      name: "Sarah Johnson",
      role: "Web Developer",
      img: "/assets/sarah.jpg",
    },
    {
      text: "The hands-on projects boosted my confidence and skills!",
      name: "Michael Chen",
      role: "Backend Engineer",
      img: "/assets/micheal.jpg",
    },
    {
      text: "Thanks to 51skills, I landed my dream job in tech!",
      name: "Emily Rodriguez",
      role: "UI/UX Designer",
      img: "/assets/emily.jpg",
    },
  ];

  const [active, setActive] = useState<number>(0);

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>
        Ready to Level Up?
      </h2>

      <p className={styles.subtitle}>
        Join thousands of learners and unlock your potential with our expert-led
        courses, hands-on projects, and a vibrant community.
      </p>

      <div className={styles.buttons}>
        <button className={styles.btnFilled}>Get Started</button>
        <button className={styles.btnOutline}>Browse Courses</button>
      </div>

      <div className={styles.reviewCard}>
        <Image
          src="/assets/quote.png"
          width={45}
          height={45}
          alt="quote"
          className={styles.quoteIcon}
        />

        <p className={styles.reviewText}>{reviews[active].text}</p>

        <div className={styles.profileRow}>
          {reviews.map((item, index) => (
            <Image
              key={index}
              src={item.img}
              width={50}
              height={50}
              alt={item.name}
              className={`${styles.profileImg} ${
                active === index ? styles.activeImg : ""
              }`}
              onClick={() => setActive(index)}
            />
          ))}
        </div>

        <p className={styles.userName}>{reviews[active].name}</p>
        <p className={styles.userRole}>{reviews[active].role}</p>
      </div>

      <div className={styles.features}>
        <div className={styles.featureItem}>
          ⭐ 30-day money-back guarantee
        </div>

        <div className={styles.featureItem}>
          📘 Industry-recognized certificates
        </div>

        <div className={styles.featureItem}>
          🤝 Dedicated mentorship
        </div>
      </div>
    </div>
  );
}
