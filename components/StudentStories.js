"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./StudentStories.module.css";

export default function StudentStories() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Developer",
      company: "TechVision Inc.",
      text: "51skills has been a game-changer for my career...",
      courses: "3 courses completed",
      img: "/assets/sarah.jpg",
      rating: "/assets/stars.png",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Data Scientist",
      text: "I’ve taken several courses on 51skills and each one has significantly improved my skills.",
      img: "/assets/micheal.jpg",
      rating: "/assets/stars.png",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "UX Designer",
      text: "The UX/UI design course on 51skills helped me land my dream job.",
      img: "/assets/emily.jpg",
      rating: "/assets/stars.png",
    },
    {
      id: 4,
      name: "David Park",
      role: "Full Stack Developer",
      text: "As someone switching careers, 51skills provided everything I needed.",
      img: "/assets/david.jpg",
      rating: "/assets/stars.png",
    },
    {
      id: 5,
      name: "Priya Sharma",
      role: "Product Manager",
      text: "The product management certification was exactly what I needed.",
      img: "/assets/priva.jpg",
      rating: "/assets/stars.png",
    },
  ];

  const [active, setActive] = useState(reviews[0]);

  return (
    <section className={styles.wrapper}>
      <h2 className={styles.title}>
        <span>Student </span>
        <span className={styles.highlight}>Success Stories</span>
      </h2>
      <p className={styles.subtitle}>
        Hear from our community of learners who have transformed their careers
        through our platform.
      </p>

      <div className={styles.content}>
        {/* LEFT SIDE MAIN CARD */}
        <div className={styles.leftCard}>
          <div className={styles.quoteWrap}>
            <Image src="/assets/quote.png" width={30} height={30} alt="quote" />
          </div>

          <p className={styles.reviewText}>“{active.text}”</p>

          <div className={styles.userRow}>
            
            <Image
              src={active.img}
              width={55}
              height={55}
              alt={active.name}
              className={styles.userImg}
            />

            <div>
                
              <h4 className={styles.userName}>{active.name}</h4>
              <p className={styles.userRole}>{active.role} at {active.company}</p>

              <div className={styles.starRow}>
                
                <Image src="/assets/stars.png" width={90} height={20} alt="rating" />
                <span className={styles.courseText}>{active.courses}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE LIST */}
        <div className={styles.rightList}>
            <div className={styles.more}>More Student Stories</div>
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`${styles.reviewItem} ${
                active.id === review.id ? styles.activeReview : ""
              }`}
              onClick={() => setActive(review)}
            >
              <Image
                src={review.img}
                width={40}
                height={40}
                alt={review.name}
                className={styles.listImg}
              />

              <div className={styles.itemInfo}>
                <h4 className={styles.itemName}>{review.name}</h4>
                <p className={styles.itemRole}>{review.role}</p>
                <p className={styles.itemText}>{review.text}</p>
              </div>

              <Image
                src="/assets/stars.png"
                width={80}
                height={18}
                alt="stars"
                className={styles.starSmall}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.another}>
        <Image
      src="/assets/quote.png"
      width={60}
      height={60}
      alt="sarah"
      className={styles.sarahImg1}
    />
  <p>
    "51skills transformed my career journey with expert-led courses that gave me
    practical skills I use every day."
  </p>

  <div className={styles.profileRow}>
    <Image
      src="/assets/sarah.jpg"
      width={60}
      height={60}
      alt="sarah"
      className={styles.sarahImg}
    />

    <div className={styles.profileText}>
      <span className={styles.profileName}>Sarah Johnson</span>
      <span className={styles.profileRole}>Software Developer at TechVision Inc.</span>
    </div>
  </div>
</div>

    </section>
  );
}
