"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface PageView {
  path: string;
  timeSpent: number;
}

interface SessionData {
  duration: number;
  pages: PageView[];
  humanScore: number;
  isReturning: boolean;
}

export function useAnalytics() {
  const pathname = usePathname();
  const sessionDataRef = useRef<SessionData>({
    duration: 0,
    pages: [],
    humanScore: 0,
    isReturning: false,
  });
  
  const sessionIdRef = useRef<string | null>(null);
  const currentPathTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initialize session
    if (typeof window !== "undefined") {
      let returning = localStorage.getItem("nx_returning_visitor");
      if (!returning) {
        localStorage.setItem("nx_returning_visitor", "true");
      } else {
        sessionDataRef.current.isReturning = true;
      }

      let sid = sessionStorage.getItem("nx_session_id");
      if (!sid) {
        const newSid = uuidv4();
        sessionStorage.setItem("nx_session_id", newSid);
        sid = newSid;
      }
      sessionIdRef.current = sid as string;

      // Track human behavior
      const trackHumanInteraction = () => {
        sessionDataRef.current.humanScore = Math.min(100, sessionDataRef.current.humanScore + 10);
      };
      
      window.addEventListener("mousemove", trackHumanInteraction, { once: true });
      window.addEventListener("scroll", trackHumanInteraction, { once: true });
      window.addEventListener("click", trackHumanInteraction, { once: true });
      window.addEventListener("keydown", trackHumanInteraction, { once: true });

      // Before unload, send beacon
      const sendSessionData = () => {
        // Record final path time
        const timeSpent = Math.floor((Date.now() - currentPathTimeRef.current) / 1000);
        if (sessionDataRef.current.pages.length > 0) {
          const lastPage = sessionDataRef.current.pages[sessionDataRef.current.pages.length - 1];
          if (lastPage.path === pathname) {
            lastPage.timeSpent += timeSpent;
          }
        }

        sessionDataRef.current.duration = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000);

        const payload = JSON.stringify({
          sessionId: sessionIdRef.current,
          sessionData: sessionDataRef.current
        });

        // Use sendBeacon for reliable delivery on exit
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/analytics", payload);
        } else {
          fetch("/api/analytics", {
            method: "POST",
            body: payload,
            keepalive: true
          }).catch(() => {});
        }
      };

      window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
          sendSessionData();
        }
      });
      
      window.addEventListener("pagehide", sendSessionData);
    }
  }, []);

  // Track path changes
  useEffect(() => {
    if (!pathname) return;

    const now = Date.now();
    // Update time spent on previous path
    if (sessionDataRef.current.pages.length > 0) {
      const lastPage = sessionDataRef.current.pages[sessionDataRef.current.pages.length - 1];
      const timeSpent = Math.floor((now - currentPathTimeRef.current) / 1000);
      lastPage.timeSpent += timeSpent;
    }

    // Add new path
    sessionDataRef.current.pages.push({ path: pathname, timeSpent: 0 });
    currentPathTimeRef.current = now;
  }, [pathname]);

  return null;
}
