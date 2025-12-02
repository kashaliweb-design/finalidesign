"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Animation happens only once
      easing: "ease-in-out", // Easing function
      offset: 100, // Offset from the original trigger point
      delay: 0, // Delay in milliseconds
    });

    // Refresh AOS on route changes
    AOS.refresh();
  }, []);

  return <>{children}</>;
}
