export type TimePeriod = "today" | "7d" | "30d" | "all";

export interface ReplyKeyboardMarkup {
  keyboard: Array<Array<{ text: string }>>;
  resize_keyboard: boolean;
  is_persistent?: boolean;
}

export function buildChatReplyKeyboard(currentPeriod: TimePeriod = "all"): ReplyKeyboardMarkup {
  return {
    keyboard: [
      [{ text: "📊 Total Traffic" }, { text: "⏱ Total Time" }],
      [{ text: "🔥 Top Sessions" }, { text: "📄 Top Pages" }],
      [{ text: "🧩 Components" }, { text: "📋 Copy Code" }],
      [{ text: "🤖 AI Activity" }, { text: "🎬 YouTube" }],
      [{ text: "🌍 Countries" }, { text: "🏙 Cities" }],
      [{ text: "🤖 Bot Traffic" }, { text: "🔴 Live Now" }],
      [
        { text: currentPeriod === "all" ? "⏳ All Time ✅" : "⏳ All Time" },
        { text: currentPeriod === "today" ? "📅 Today ✅" : "📅 Today" },
        { text: currentPeriod === "7d" ? "🗓 7 Days ✅" : "🗓 7 Days" },
        { text: currentPeriod === "30d" ? "🗓 30 Days ✅" : "🗓 30 Days" },
      ],
      [{ text: "🏠 Main Menu" }],
    ],
    resize_keyboard: true,
    is_persistent: true,
  };
}

export function buildDashboardKeyboard(currentPeriod: TimePeriod = "all", currentAction: string = "menu") {
  return {
    inline_keyboard: [
      [
        { text: currentAction === "traffic" ? "📊 Total Traffic 🔘" : "📊 Total Traffic", callback_data: `nav_traffic_${currentPeriod}` },
        { text: currentAction === "time" ? "⏱ Total Time 🔘" : "⏱ Total Time", callback_data: `nav_time_${currentPeriod}` },
      ],
      [
        { text: currentAction === "sessions" ? "🔥 Top Sessions 🔘" : "🔥 Top Sessions", callback_data: `nav_sessions_${currentPeriod}` },
        { text: currentAction === "pages" ? "📄 Top Pages 🔘" : "📄 Top Pages", callback_data: `nav_pages_${currentPeriod}` },
      ],
      [
        { text: currentAction === "components" ? "🧩 Components 🔘" : "🧩 Components", callback_data: `nav_components_${currentPeriod}` },
        { text: currentAction === "copy" ? "📋 Copy Code 🔘" : "📋 Copy Code", callback_data: `nav_copy_${currentPeriod}` },
      ],
      [
        { text: currentAction === "ai" ? "🤖 AI Activity 🔘" : "🤖 AI Activity", callback_data: `nav_ai_${currentPeriod}` },
        { text: currentAction === "youtube" ? "🎬 YouTube 🔘" : "🎬 YouTube", callback_data: `nav_youtube_${currentPeriod}` },
      ],
      [
        { text: currentAction === "bots" ? "🤖 Bot Traffic 🔘" : "🤖 Bot Traffic", callback_data: `nav_bots_${currentPeriod}` },
        { text: currentAction === "countries" ? "🌍 Countries 🔘" : "🌍 Countries", callback_data: `nav_countries_${currentPeriod}` },
      ],
      [
        { text: currentAction === "cities" ? "🏙 Cities 🔘" : "🏙 Cities", callback_data: `nav_cities_${currentPeriod}` },
        { text: currentAction === "live" ? "🔴 Live Now 🔘" : "🔴 Live Now", callback_data: `nav_live_${currentPeriod}` },
      ],
      [
        {
          text: currentPeriod === "all" ? "All Time (С начала) ✅" : "All Time",
          callback_data: `nav_${currentAction}_all`,
        },
        {
          text: currentPeriod === "today" ? "Today ✅" : "Today",
          callback_data: `nav_${currentAction}_today`,
        },
        {
          text: currentPeriod === "7d" ? "7 Days ✅" : "7 Days",
          callback_data: `nav_${currentAction}_7d`,
        },
        {
          text: currentPeriod === "30d" ? "30 Days ✅" : "30 Days",
          callback_data: `nav_${currentAction}_30d`,
        },
      ],
      [{ text: "🏠 Main Menu", callback_data: `nav_menu_${currentPeriod}` }],
    ],
  };
}

