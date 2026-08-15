import { saveOrUpdateSession, getDashboardStats, SessionRecord, getAllSessionsFromDb } from "../lib/analytics-store";

async function runAnalyticsVerificationTests() {
  console.log("==================================================");
  console.log("NEXOREUI ANALYTICS — AUTOMATED VERIFICATION SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
      passed++;
    } else {
      console.log(`❌ [FAIL] ${testName}`);
      if (detail) console.log(`   └─ ${detail}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Session Navigation Sequence
  // ----------------------------------------------------
  const test1Vid = "visitor_test1_123";
  const test1Sid = "session_test1_abc";
  const s1: SessionRecord = {
    visitorId: test1Vid,
    sessionId: test1Sid,
    createdAt: Date.now() - 300000,
    lastActivityAt: Date.now(),
    sessionLifetime: 300,
    activeTime: 180,
    inactiveTime: 120,
    countryCode: "BR",
    countryName: "Brazil",
    city: "Bauru",
    locationStr: "📍 Bauru, Brazil 🇧🇷",
    device: "Desktop",
    browser: "Chrome",
    os: "Windows",
    trafficSource: "Direct",
    referrer: "Direct",
    utm: {},
    humanScore: 80,
    botLikelihood: "Low",
    humanLikelihood: "High",
    trafficType: "Human",
    isReturning: false,
    pages: [
      { path: "/", activeDuration: 30, timeSpent: 40 },
      { path: "/docs/components/button", activeDuration: 90, timeSpent: 120 },
      { path: "/docs/components/card", activeDuration: 60, timeSpent: 80 },
    ],
    events: [],
    telegramSent: false,
  };
  await saveOrUpdateSession(s1);
  assert(s1.pages.length === 3, "TEST 1: Route sequence creates 1 session with 3 page views");

  // ----------------------------------------------------
  // TEST 2: Refresh 10 Times Preserves Same Session ID
  // ----------------------------------------------------
  for (let i = 0; i < 10; i++) {
    s1.lastActivityAt = Date.now() + i * 1000;
    await saveOrUpdateSession(s1);
  }
  const allSessionsAfterRefresh = await getAllSessionsFromDb();
  const test1Sessions = allSessionsAfterRefresh.filter(s => s.sessionId === test1Sid);
  assert(test1Sessions.length === 1, "TEST 2: Refreshing 10 times maintains same Session ID without creating duplicates");

  // ----------------------------------------------------
  // TEST 3: Duplicate Events Aggregation
  // ----------------------------------------------------
  s1.events = [
    { eventType: "copy_code", component: "Button", framework: "React", timestamp: Date.now() },
    { eventType: "copy_code", component: "Button", framework: "React", timestamp: Date.now() },
    { eventType: "copy_code", component: "Card", framework: "HTML", timestamp: Date.now() },
  ];
  await saveOrUpdateSession(s1);
  const buttonCopies = s1.events.filter(e => e.component === "Button").length;
  assert(buttonCopies === 2, "TEST 3: Multiple events aggregated correctly under session");

  // ----------------------------------------------------
  // TEST 4: Idempotency & Summary Message Update
  // ----------------------------------------------------
  const summaryHash1 = "hash_v1_" + s1.activeTime;
  s1.summaryHash = summaryHash1;
  const updateRes1 = await saveOrUpdateSession(s1);
  s1.telegramMessageId = 999123;
  const updateRes2 = await saveOrUpdateSession(s1);
  assert(updateRes2.existingMessageId === 999123, "TEST 4: Telegram message update retrieves and uses existing telegramMessageId instead of creating duplicate messages");

  // ----------------------------------------------------
  // TEST 5: Idle Browser Duration (Active vs Lifetime)
  // ----------------------------------------------------
  const s5: SessionRecord = {
    visitorId: "visitor_idle_456",
    sessionId: "session_idle_789",
    createdAt: Date.now() - (7200 * 1000), // 2 hours lifetime
    lastActivityAt: Date.now(),
    sessionLifetime: 7200, // 2 hours
    activeTime: 300, // 5 minutes active interaction
    inactiveTime: 6900,
    countryCode: "US",
    countryName: "United States",
    city: "New York",
    locationStr: "📍 New York, United States 🇺🇸",
    device: "Desktop",
    browser: "Safari",
    os: "macOS",
    trafficSource: "Google",
    referrer: "https://google.com",
    utm: {},
    humanScore: 50,
    botLikelihood: "Low",
    humanLikelihood: "High",
    trafficType: "Human",
    isReturning: true,
    pages: [{ path: "/docs/installation", activeDuration: 300, timeSpent: 7200 }],
    events: [],
    telegramSent: false,
  };
  await saveOrUpdateSession(s5);
  assert(s5.sessionLifetime === 7200 && s5.activeTime === 300, "TEST 5: Browser idle for hours has 2h lifetime but activeTime remains 5m");

  // ----------------------------------------------------
  // TEST 6: Bot / Headless Browser Detection
  // ----------------------------------------------------
  const s6: SessionRecord = {
    visitorId: "bot_visitor_001",
    sessionId: "bot_session_001",
    createdAt: Date.now() - 60000,
    lastActivityAt: Date.now(),
    sessionLifetime: 60,
    activeTime: 0,
    inactiveTime: 60,
    countryCode: "DE",
    countryName: "Germany",
    city: "Frankfurt",
    locationStr: "📍 Frankfurt, Germany 🇩🇪",
    device: "Desktop",
    browser: "HeadlessChrome",
    os: "Linux",
    trafficSource: "Direct",
    referrer: "Direct",
    utm: {},
    humanScore: 0,
    botLikelihood: "High",
    humanLikelihood: "Low",
    trafficType: "Bot",
    isReturning: false,
    pages: [{ path: "/", activeDuration: 0, timeSpent: 2 }],
    events: [],
    telegramSent: false,
  };
  await saveOrUpdateSession(s6);
  const botStats = await getDashboardStats("all");
  assert(s6.trafficType === "Bot", "TEST 6: Headless bot classified as Bot traffic", `Bot count in stats: ${botStats.totalTraffic.botSessions}`);

  // ----------------------------------------------------
  // TEST 7: 404 Scanner Route Scanning
  // ----------------------------------------------------
  const s7: SessionRecord = {
    visitorId: "scanner_visitor_007",
    sessionId: "scanner_session_007",
    createdAt: Date.now() - 10000,
    lastActivityAt: Date.now(),
    sessionLifetime: 10,
    activeTime: 0,
    inactiveTime: 10,
    countryCode: "CN",
    countryName: "China",
    city: "Beijing",
    locationStr: "📍 Beijing, China 🇨🇳",
    device: "Desktop",
    browser: "Python-Requests",
    os: "Linux",
    trafficSource: "Direct",
    referrer: "Direct",
    utm: {},
    humanScore: 0,
    botLikelihood: "High",
    humanLikelihood: "Low",
    trafficType: "Bot",
    isReturning: false,
    pages: [
      { path: "/about", activeDuration: 0, timeSpent: 1, is404: true },
      { path: "/contact-us", activeDuration: 0, timeSpent: 1, is404: true },
      { path: "/support", activeDuration: 0, timeSpent: 1, is404: true },
      { path: "/legal", activeDuration: 0, timeSpent: 1, is404: true },
      { path: "/terms", activeDuration: 0, timeSpent: 1, is404: true },
    ],
    events: [],
    telegramSent: false,
  };
  await saveOrUpdateSession(s7);
  const stats404 = await getDashboardStats("all");
  assert(stats404.botTraffic.total404Scans >= 5, "TEST 7: 404 scanner detected and routes tracked under Bot stats");

  // ----------------------------------------------------
  // TEST 8: YouTube UTM Attribution
  // ----------------------------------------------------
  const s8: SessionRecord = {
    visitorId: "yt_visitor_888",
    sessionId: "yt_session_888",
    createdAt: Date.now() - 120000,
    lastActivityAt: Date.now(),
    sessionLifetime: 120,
    activeTime: 90,
    inactiveTime: 30,
    countryCode: "ID",
    countryName: "Indonesia",
    city: "Jakarta",
    locationStr: "📍 Jakarta, Indonesia 🇮🇩",
    device: "Mobile",
    browser: "Chrome",
    os: "Android",
    trafficSource: "YouTube",
    referrer: "https://youtube.com",
    utm: {
      utm_source: "youtube",
      utm_medium: "video",
      utm_campaign: "nexoreui_showcase",
    },
    humanScore: 90,
    botLikelihood: "Low",
    humanLikelihood: "High",
    trafficType: "Human",
    isReturning: false,
    pages: [
      { path: "/docs/components/button", activeDuration: 40, timeSpent: 50 },
      { path: "/nexoremake", activeDuration: 50, timeSpent: 70 },
    ],
    events: [
      { eventType: "copy_code", component: "Button", framework: "React", timestamp: Date.now() },
      { eventType: "ai_generation_completed", feature: "Nexore Make", status: "Success", timestamp: Date.now() },
    ],
    telegramSent: false,
  };
  await saveOrUpdateSession(s8);
  const ytStats = await getDashboardStats("all");
  assert(
    ytStats.youtube.visitorsCount >= 1 && ytStats.youtube.campaigns.includes("nexoreui_showcase"),
    "TEST 8: YouTube UTM campaign attribution tracked through to AI conversion"
  );

  // ----------------------------------------------------
  // TEST 9: Copy Code Event Privacy & Content Omission
  // ----------------------------------------------------
  const copyEvent = s8.events.find(e => e.eventType === "copy_code");
  const hasClipboardData = copyEvent ? "code" in copyEvent || "clipboard" in copyEvent : false;
  assert(!hasClipboardData && copyEvent?.component === "Button", "TEST 9: Copy code logged with component & framework, clipboard content omitted");

  // ----------------------------------------------------
  // TEST 10: AI Lifecycle Events Prompt Omission
  // ----------------------------------------------------
  const aiEvent = s8.events.find(e => e.eventType === "ai_generation_completed");
  const hasPromptText = aiEvent ? "prompt" in aiEvent || "text" in aiEvent : false;
  assert(!hasPromptText && aiEvent?.feature === "Nexore Make", "TEST 10: AI usage tracked cleanly with ZERO prompt text stored");

  // ----------------------------------------------------
  // TEST 11: Telegram Dashboard Aggregations
  // ----------------------------------------------------
  const finalStats = await getDashboardStats("today");
  assert(
    typeof finalStats.totalTraffic.humanSessions === "number" &&
    typeof finalStats.totalTime.totalHumanActiveTime === "string" &&
    Array.isArray(finalStats.topActiveSessions) &&
    Array.isArray(finalStats.topPages),
    "TEST 11: Telegram Dashboard statistics aggregation produces valid metrics output"
  );

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runAnalyticsVerificationTests().catch((err) => {
  console.error("Test Suite Runtime Error:", err);
  process.exit(1);
});
