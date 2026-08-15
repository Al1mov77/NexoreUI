export type TimePeriod = "today" | "7d" | "30d" | "all";

export function buildDashboardKeyboard(currentPeriod: TimePeriod = "today") {
  return {
    inline_keyboard: [
      [
        { text: "📊 Total Traffic", callback_data: `nav_traffic_${currentPeriod}` },
        { text: "⏱ Total Time", callback_data: `nav_time_${currentPeriod}` },
      ],
      [
        { text: "🔥 Top Sessions", callback_data: `nav_sessions_${currentPeriod}` },
        { text: "📄 Top Pages", callback_data: `nav_pages_${currentPeriod}` },
      ],
      [
        { text: "🧩 Components", callback_data: `nav_components_${currentPeriod}` },
        { text: "📋 Copy Code", callback_data: `nav_copy_${currentPeriod}` },
      ],
      [
        { text: "🤖 AI Activity", callback_data: `nav_ai_${currentPeriod}` },
        { text: "🎬 YouTube", callback_data: `nav_youtube_${currentPeriod}` },
      ],
      [
        { text: "🤖 Bot Traffic", callback_data: `nav_bots_${currentPeriod}` },
        { text: "🌍 Countries", callback_data: `nav_countries_${currentPeriod}` },
      ],
      [
        { text: "🏙 Cities", callback_data: `nav_cities_${currentPeriod}` },
        { text: "🔴 Live Now", callback_data: `nav_live_${currentPeriod}` },
      ],
      [
        {
          text: currentPeriod === "today" ? "Period: Today 🔘" : "Today",
          callback_data: "period_today",
        },
        {
          text: currentPeriod === "7d" ? "Period: 7D 🔘" : "7 Days",
          callback_data: "period_7d",
        },
        {
          text: currentPeriod === "30d" ? "Period: 30D 🔘" : "30 Days",
          callback_data: "period_30d",
        },
        {
          text: currentPeriod === "all" ? "Period: All 🔘" : "All Time",
          callback_data: "period_all",
        },
      ],
      [{ text: "🏠 Main Menu", callback_data: `nav_menu_${currentPeriod}` }],
    ],
  };
}
