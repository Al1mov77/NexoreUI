"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export interface PageView {
  path: string;
  enteredAt: number;
  leftAt?: number;
  activeDuration: number;
  timeSpent: number;
  is404?: boolean;
}

export interface AnalyticsEvent {
  eventType: string; // 'copy_code', 'ai_opened', 'ai_prompt_submitted', 'ai_generation_started', 'ai_generation_completed', 'ai_generation_failed'
  component?: string;
  framework?: string;
  feature?: string;
  status?: string;
  page?: string;
  timestamp: number;
}

export interface SessionData {
  visitorId: string;
  sessionId: string;
  isReturning: boolean;
  createdAt: number;
  lastActivityAt: number;
  sessionLifetime: number;
  activeTime: number;
  inactiveTime: number;
  humanScore: number;
  botIndicators: {
    webdriver: boolean;
    headlessUA: boolean;
    zeroInteraction: boolean;
  };
  initialReferrer?: string;
  utm: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
  };
  pages: PageView[];
  events: AnalyticsEvent[];
}

// Global helper to track events safely without sensitive payload
export function trackEvent(payload: Omit<AnalyticsEvent, 'timestamp' | 'page'>) {
  if (typeof window !== 'undefined') {
    // Sanitize payload to guarantee no private user data or code strings are dispatched
    const sanitizedPayload: Partial<AnalyticsEvent> = {
      eventType: payload.eventType,
      component: payload.component ? String(payload.component).slice(0, 100) : undefined,
      framework: payload.framework ? String(payload.framework).slice(0, 50) : undefined,
      feature: payload.feature ? String(payload.feature).slice(0, 100) : undefined,
      status: payload.status ? String(payload.status).slice(0, 50) : undefined,
    };
    window.dispatchEvent(new CustomEvent('nx-analytics-event', { detail: sanitizedPayload }));
  }
}

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes inactivity pauses active tracking
const SESSION_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes total inactivity starts a new session
const MAX_SESSION_LIFETIME_MS = 6 * 60 * 60 * 1000; // 6 hours max session duration

export function useAnalytics() {
  const pathname = usePathname();
  
  const visitorIdRef = useRef<string>("");
  const sessionIdRef = useRef<string>("");
  const sessionCreatedAtRef = useRef<number>(Date.now());
  const lastActiveTimestampRef = useRef<number>(Date.now());
  const activeTimeAccumulatorRef = useRef<number>(0);
  const isTabVisibleRef = useRef<boolean>(true);
  const lastSentTimeRef = useRef<number>(0);

  const sessionDataRef = useRef<SessionData>({
    visitorId: "",
    sessionId: "",
    isReturning: false,
    createdAt: Date.now(),
    lastActivityAt: Date.now(),
    sessionLifetime: 0,
    activeTime: 0,
    inactiveTime: 0,
    humanScore: 0,
    botIndicators: {
      webdriver: false,
      headlessUA: false,
      zeroInteraction: true,
    },
    initialReferrer: "",
    utm: {},
    pages: [],
    events: [],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Visitor Persistence
    let vid = localStorage.getItem("nx_visitor_id");
    let isReturning = true;
    if (!vid) {
      vid = uuidv4();
      localStorage.setItem("nx_visitor_id", vid);
      isReturning = false;
    }
    visitorIdRef.current = vid;
    sessionDataRef.current.visitorId = vid;
    sessionDataRef.current.isReturning = isReturning;

    // 2. Session ID & Lifetime Persistence
    const now = Date.now();
    let sid = localStorage.getItem("nx_session_id");
    let sessionCreatedStr = localStorage.getItem("nx_session_created_at");
    let lastActiveStr = localStorage.getItem("nx_session_last_active");

    let sessionCreated = sessionCreatedStr ? parseInt(sessionCreatedStr, 10) : now;
    let lastActive = lastActiveStr ? parseInt(lastActiveStr, 10) : now;

    // Check if session is missing, inactive for 30m, or exceeded 6h max lifetime
    if (!sid || (now - lastActive > SESSION_EXPIRY_MS) || (now - sessionCreated > MAX_SESSION_LIFETIME_MS)) {
      sid = uuidv4();
      sessionCreated = now;
      localStorage.setItem("nx_session_id", sid);
      localStorage.setItem("nx_session_created_at", sessionCreated.toString());
      localStorage.setItem("nx_session_active_time", "0");
      localStorage.removeItem("nx_initial_referrer");
    }

    sessionIdRef.current = sid;
    sessionCreatedAtRef.current = sessionCreated;
    lastActiveTimestampRef.current = now;
    localStorage.setItem("nx_session_last_active", now.toString());

    // Capture External Referrer (e.g. YouTube, Google, GitHub, etc.)
    let initialRef = localStorage.getItem("nx_initial_referrer");
    if (!initialRef && document.referrer) {
      const refUrl = document.referrer;
      if (!refUrl.includes(window.location.hostname)) {
        initialRef = refUrl;
        localStorage.setItem("nx_initial_referrer", initialRef);
      }
    }
    sessionDataRef.current.initialReferrer = initialRef || document.referrer || "";

    // Restore active time if resuming same session
    const savedActiveTime = localStorage.getItem("nx_session_active_time");
    if (savedActiveTime) {
      activeTimeAccumulatorRef.current = parseInt(savedActiveTime, 10) || 0;
    }

    sessionDataRef.current.sessionId = sid;
    sessionDataRef.current.createdAt = sessionCreated;

    // 3. Bot Indicators
    if (navigator.webdriver) {
      sessionDataRef.current.botIndicators.webdriver = true;
    }
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("headless") || ua.includes("phantomjs") || ua.includes("selenium") || ua.includes("puppeteer")) {
      sessionDataRef.current.botIndicators.headlessUA = true;
    }

    // 4. UTM Parameter Extraction & Persistence
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmObj: SessionData["utm"] = {};
      ["utm_source", "utm_medium", "utm_campaign", "utm_content"].forEach((param) => {
        const val = urlParams.get(param);
        if (val) utmObj[param as keyof SessionData["utm"]] = val;
      });

      // Auto-detect YouTube if referrer matches youtube
      const docRefLower = (sessionDataRef.current.initialReferrer || "").toLowerCase();
      if (!utmObj.utm_source && (docRefLower.includes("youtube.com") || docRefLower.includes("youtu.be"))) {
        utmObj.utm_source = "youtube";
      }

      const savedUtm = localStorage.getItem(`nx_utm_${sid}`);
      if (Object.keys(utmObj).length > 0) {
        localStorage.setItem(`nx_utm_${sid}`, JSON.stringify(utmObj));
        sessionDataRef.current.utm = utmObj;
      } else if (savedUtm) {
        sessionDataRef.current.utm = JSON.parse(savedUtm);
      }
    } catch (e) {
      // ignore param parsing error
    }

    // 5. Throttled Activity & Active Time Engine
    let activityThrottleTimer: NodeJS.Timeout | null = null;
    const registerUserActivity = () => {
      const currentNow = Date.now();
      lastActiveTimestampRef.current = currentNow;
      sessionDataRef.current.botIndicators.zeroInteraction = false;

      if (!activityThrottleTimer) {
        activityThrottleTimer = setTimeout(() => {
          activityThrottleTimer = null;
        }, 1000); // 1-second throttle for DOM events

        sessionDataRef.current.humanScore = Math.min(100, sessionDataRef.current.humanScore + 5);
        localStorage.setItem("nx_session_last_active", currentNow.toString());
      }
    };

    const interactionEvents = ["mousemove", "click", "scroll", "keydown", "touchstart"];
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, registerUserActivity, { passive: true });
    });

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
      if (isTabVisibleRef.current) {
        registerUserActivity();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", registerUserActivity);

    // Active Time Ticker (Runs every 1s)
    const activeTickerInterval = setInterval(() => {
      const currentNow = Date.now();
      const timeSinceLastActivity = currentNow - lastActiveTimestampRef.current;

      if (isTabVisibleRef.current && timeSinceLastActivity <= INACTIVITY_TIMEOUT_MS) {
        activeTimeAccumulatorRef.current += 1;
        localStorage.setItem("nx_session_active_time", activeTimeAccumulatorRef.current.toString());

        if (sessionDataRef.current.pages.length > 0) {
          const currentPage = sessionDataRef.current.pages[sessionDataRef.current.pages.length - 1];
          currentPage.activeDuration += 1;
          currentPage.timeSpent += 1;
        }
      }
    }, 1000);

    // 6. Custom Event Listener (Copy Code, AI Lifecycle)
    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.eventType) {
        registerUserActivity();
        sessionDataRef.current.events.push({
          eventType: customEvent.detail.eventType,
          component: customEvent.detail.component,
          framework: customEvent.detail.framework,
          feature: customEvent.detail.feature,
          status: customEvent.detail.status,
          timestamp: Date.now(),
          page: window.location.pathname,
        });
      }
    };
    window.addEventListener("nx-analytics-event", handleCustomEvent);

    // 7. Session Beacon Dispatcher
    const sendSessionData = () => {
      const currentNow = Date.now();
      if (currentNow - lastSentTimeRef.current < 2000) {
        return; // Prevent duplicate rapid dispatches
      }
      lastSentTimeRef.current = currentNow;

      const totalLifetime = Math.floor((currentNow - sessionCreatedAtRef.current) / 1000);
      const totalActive = activeTimeAccumulatorRef.current;

      sessionDataRef.current.lastActivityAt = lastActiveTimestampRef.current;
      sessionDataRef.current.sessionLifetime = Math.max(0, totalLifetime);
      sessionDataRef.current.activeTime = Math.max(0, totalActive);
      sessionDataRef.current.inactiveTime = Math.max(0, totalLifetime - totalActive);

      const payload = JSON.stringify({
        requestId: uuidv4(),
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
        sessionData: sessionDataRef.current,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", payload);
      } else {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    };

    window.addEventListener("pagehide", sendSessionData);
    const periodicBeacon = setInterval(sendSessionData, 60000); // Periodic report every 60s

    return () => {
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, registerUserActivity);
      });
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", registerUserActivity);
      window.removeEventListener("nx-analytics-event", handleCustomEvent);
      window.removeEventListener("pagehide", sendSessionData);
      clearInterval(activeTickerInterval);
      clearInterval(periodicBeacon);
    };
  }, []);

  // 8. Track Route / Path Navigation Changes
  useEffect(() => {
    if (!pathname) return;

    const now = Date.now();
    const currentPages = sessionDataRef.current.pages;

    if (currentPages.length > 0) {
      const lastPage = currentPages[currentPages.length - 1];
      if (lastPage.path === pathname) return; // Ignore duplicate calls for current page
      lastPage.leftAt = now;
    }

    currentPages.push({
      path: pathname,
      enteredAt: now,
      activeDuration: 0,
      timeSpent: 0,
    });
  }, [pathname]);

  return null;
}
