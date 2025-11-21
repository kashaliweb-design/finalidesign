"use client";

import Image from "next/image";
import styles from "./Hero.module.css";
import { useEffect } from "react";

const IMAGES = [1, 2, 3, 4, 5, 6];

export default function Hero() {

  // AUTO-ADD animation delay to each letter
  useEffect(() => {
    const letters = document.querySelectorAll(`.${styles.subtitle} span`);

    letters.forEach((el, i) => {
      el.style.animationDelay = `${i * 0.03}s`; // adjust speed (0.03 = perfect)
    });
  }, []);

  return (
    <section className={styles.heroSection}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <h1 className={styles.title}>
          Unlock Your <span>Potential</span> with <br /> 51skills
        </h1>

        {/* LETTER-BY-LETTER ANIMATED SUBTITLE */}
        <p className={styles.subtitle}>

          <span>D</span><span>i</span><span>s</span><span>c</span><span>o</span><span>v</span><span>e</span><span>r</span><span> </span>
          <span>a</span><span> </span>
          <span>w</span><span>o</span><span>r</span><span>l</span><span>d</span><span> </span>
          <span>o</span><span>f</span><span> </span>
          <span>k</span><span>n</span><span>o</span><span>w</span><span>l</span><span>e</span><span>d</span><span>g</span><span>e</span><span> </span>
          <span>w</span><span>i</span><span>t</span><span>h</span><span> </span>
          <span>o</span><span>u</span><span>r</span><span> </span>
          <span>c</span><span>u</span><span>t</span><span>t</span><span>i</span><span>n</span><span>g</span><span>-</span><span>e</span><span>d</span><span>g</span><span>e</span><span> </span>
          <span>l</span><span>e</span><span>a</span><span>r</span><span>n</span><span>i</span><span>n</span><span>g</span><span> </span>
          <span>p</span><span>l</span><span>a</span><span>t</span><span>f</span><span>o</span><span>r</span><span>m</span><span>.</span>
         
          <span> S</span><span>t</span><span>a</span><span>r</span><span>t</span><span> </span>
          <span>y</span><span>o</span><span>u</span><span>r</span><span> </span>
          <span>j</span><span>o</span><span>u</span><span>r</span><span>n</span><span>e</span><span>y</span><span> </span>
          <span>t</span><span>o</span><span> </span>
          <span>s</span><span>u</span><span>c</span><span>c</span><span>e</span><span>s</span><span>s</span><span> </span>
          <span>t</span><span>o</span><span>d</span><span>a</span><span>y</span><span>!</span>
        </p>

        <div className={styles.buttons}>
          <button className={styles.getStarted}>Get Started ➜</button>
          <button className={styles.browse}>Browse Courses ➜</button>
        </div>
      </div>

      {/* RIGHT SIDE – SCROLLING IMAGE COLUMNS */}
      <div className={styles.right}>

        <div className={styles.fadeLeft}></div>
        <div className={styles.fadeRight}></div>
        <div className={styles.fadeTop}></div>
        <div className={styles.fadeBottom}></div>

        <div className={styles.columnsWrapper}>
          {[1, 2, 3, 4].map((colIndex) => (
            <div className={`${styles.col} ${styles[`col${colIndex}`]}`} key={colIndex}>
              <div className={styles.colInner}>
                {IMAGES.map((num) => (
                  <div className={styles.card} key={`a-${colIndex}-${num}`}>
                    <Image src={`/assets/${num}.jpeg`} alt="" fill />
                  </div>
                ))}
                {IMAGES.map((num) => (
                  <div className={styles.card} key={`b-${colIndex}-${num}`}>
                    <Image src={`/assets/${num}.jpeg`} alt="" fill />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
