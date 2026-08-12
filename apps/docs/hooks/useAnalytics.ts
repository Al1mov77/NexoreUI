"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface PageView {
  path: string;
  timeSpent: number;
}

export interface AnalyticsEvent {
  eventType: string; // 'copy_code', 'ai_opened', 'ai_prompt_submitted', 'ai_generation_completed', 'ai_generation_failed'
  component?: string;
  feature?: string;
  status?: string;
  page?: string;
  timestamp: number;
}

interface SessionData {
  duration: number;
  pages: PageView[];
  humanScore: number;
  isReturning: boolean;
  botIndicators: {
    webdriver: boolean;
  };
  events: AnalyticsEvent[];
}

// Helper to track events globally
export function trackEvent(payload: Omit<AnalyticsEvent, 'timestamp' | 'page'>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('nx-analytics-event', { detail: payload }));
  }
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function useAnalytics() {
  const pathname = usePathname();
  const sessionDataRef = useRef<SessionData>({
    duration: 0,
    pages: [],
    humanScore: 0,
    isReturning: false,
    botIndicators: {
      webdriver: false,
    },
    events: [],
  });
  
  const sessionIdRef = useRef<string | null>(null);
  const currentPathTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());
  const lastSentTimeRef = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Returning visitor check
      let returning = localStorage.getItem("nx_returning_visitor");
      if (!returning) {
        localStorage.setItem("nx_returning_visitor", "true");
      } else {
        sessionDataRef.current.isReturning = true;
      }

      // 2. Stable Session ID with 30-min timeout
      const now = Date.now();
      let sid = localStorage.getItem("nx_session_id");
      const lastActive = localStorage.getItem("nx_session_last_active");
      
      if (!sid || !lastActive || (now - parseInt(lastActive, 10) > SESSION_TIMEOUT_MS)) {
        sid = uuidv4();
        localStorage.setItem("nx_session_id", sid);
      }
      localStorage.setItem("nx_session_last_active", now.toString());
      sessionIdRef.current = sid;

      // Update last active on user interaction
      const updateLastActive = () => {
        localStorage.setItem("nx_session_last_active", Date.now().toString());
      };

      // 3. Bot indicators
      if (navigator.webdriver) {
        sessionDataRef.current.botIndicators.webdriver = true;
      }

      // 4. Track human behavior
      const trackHumanInteraction = () => {
        sessionDataRef.current.humanScore = Math.min(100, sessionDataRef.current.humanScore + 10);
        updateLastActive();
      };
      
      window.addEventListener("mousemove", trackHumanInteraction, { once: true });
      window.addEventListener("scroll", trackHumanInteraction, { once: true });
      window.addEventListener("click", trackHumanInteraction, { once: true });
      window.addEventListener("keydown", trackHumanInteraction, { once: true });

      // 5. Custom Event Listener (Copy Code, AI, etc.)
      const handleCustomEvent = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail) {
          sessionDataRef.current.events.push({
            ...customEvent.detail,
            timestamp: Date.now(),
            page: window.location.pathname
          });
          updateLastActive();
        }
      };
      window.addEventListener('nx-analytics-event', handleCustomEvent);

      // 6. Before unload, send beacon
      const sendSessionData = () => {
        const currentNow = Date.now();
        if (currentNow - lastSentTimeRef.current < 500) {
          return; // Prevent duplicate firing
        }
        lastSentTimeRef.current = currentNow;

        // Record final path time
        const timeSpent = Math.floor((currentNow - currentPathTimeRef.current) / 1000);
        if (sessionDataRef.current.pages.length > 0) {
          const lastPage = sessionDataRef.current.pages[sessionDataRef.current.pages.length - 1];
          if (lastPage.path === pathname) {
            lastPage.timeSpent += timeSpent;
          }
        }

        sessionDataRef.current.duration = Math.floor((currentNow - sessionStartTimeRef.current) / 1000);

        const payload = JSON.stringify({
          requestId: uuidv4(), // Idempotency key
          sessionId: sessionIdRef.current,
          sessionData: sessionDataRef.current
        });

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

      return () => {
        window.removeEventListener('nx-analytics-event', handleCustomEvent);
      };
    }
  }, []);

  // Track path changes
  useEffect(() => {
    if (!pathname) return;

    const now = Date.now();
    // Update time spent on previous path
    if (sessionDataRef.current.pages.length > 0) {
      const lastPage = sessionDataRef.current.pages[sessionDataRef.current.pages.length - 1];
      if (lastPage.path === pathname) {
        return; // Don't duplicate entry for same path
      }
      const timeSpent = Math.floor((now - currentPathTimeRef.current) / 1000);
      lastPage.timeSpent += timeSpent;
    }

    // Add new path
    sessionDataRef.current.pages.push({ path: pathname, timeSpent: 0 });
    currentPathTimeRef.current = now;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("nx_session_last_active", now.toString());
    }
  }, [pathname]);

  return null;
}
