"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Premium scroll-based reveal animations.
 * Fixed: Excluded Hero images from parallax to maintain centering.
 * Fixed: Refined section reveal to avoid conflicts with Framer Motion.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Reveal for elements NOT already handled by Framer Motion's FadeInWhenVisible
    const revealElements = document.querySelectorAll("h1, h2, h3, .p-8.rounded-3xl");
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        }
      );
    });

    // 2. Parallax for Content Images (Excluding Hero to keep orbit centered)
    const parallaxImages = document.querySelectorAll("#projects img, #about img");
    parallaxImages.forEach((img) => {
      gsap.fromTo(
        img,
        { y: 20 },
        {
          y: -20,
          scrollTrigger: {
            trigger: img,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    });

    // 3. Subtle Hero Parallax
    const heroVisual = document.querySelector("section.relative .relative.w-full.max-w-\\[450px\\]");
    if (heroVisual) {
      gsap.to(heroVisual, {
        y: -40,
        scrollTrigger: {
          trigger: "section",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // 4. Staggered reveal for grid items
    const grids = document.querySelectorAll(".grid > div");
    if (grids.length > 0) {
      ScrollTrigger.batch(grids, {
        start: "top 95%",
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 1,
              ease: "power3.out",
              overwrite: true,
            }
          );
        },
        once: true,
      });
    }

    // 5. Smart Navbar (Hide on Scroll Down, Show on Scroll Up)
    // Fix: Ensures mobile menu doesn't break alignment by checking header height
    const nav = document.querySelector("header");
    if (nav) {
      ScrollTrigger.create({
        start: "top top",
        onUpdate: (self) => {
          const currentScroll = self.scroll();
          const isScrollingDown = self.direction === 1;
          const isMobileMenuOpen = nav.offsetHeight > 100; // Expanded menu is much taller

          if (isScrollingDown && currentScroll > 200 && !isMobileMenuOpen) {
            gsap.to(nav, { 
              yPercent: -100, 
              duration: 0.4, 
              ease: "power2.inOut",
              overwrite: true 
            });
          } else {
            gsap.to(nav, { 
              yPercent: 0, 
              duration: 0.4, 
              ease: "power2.out",
              overwrite: true,
              onComplete: () => {
                // Clear transforms when at top to avoid sticky layout shifts
                if (currentScroll < 10) gsap.set(nav, { clearProps: "yPercent" });
              }
            });
          }
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
