import { NextResponse } from "next/server"

// Rate limiting — максимум 20 запросов в час с одного IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (userLimit && now < userLimit.resetTime) {
    return NextResponse.json({
      count: userLimit.count,
      resetTime: userLimit.resetTime,
    })
  }

  return NextResponse.json({
    count: 0,
    resetTime: now + 60 * 60 * 1000,
  })
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()
  const hourMs = 60 * 60 * 1000

  const userLimit = rateLimitMap.get(ip)

  if (userLimit) {
    if (now < userLimit.resetTime) {
      if (userLimit.count >= 20) {
        return NextResponse.json(
          { error: "Лимит 20 запросов в час. Попробуйте позже." },
          { status: 429 }
        )
      }
      userLimit.count++
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + hourMs })
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + hourMs })
  }

  // Ограничь длину запроса
  const { code, message } = await req.json()
  if (!message || typeof message !== "string") {
    return NextResponse.json(
      { error: "Неверный формат запроса." },
      { status: 400 }
    )
  }

  if (message.length > 200) {
    return NextResponse.json(
      { error: "Запрос слишком длинный. Максимум 200 символов." },
      { status: 400 }
    )
  }

  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY || ""
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is not configured on the server." },
      { status: 500 }
    )
  }

  let result = ""
  const isGemini = apiKey.startsWith("AIzaSy")

  if (isGemini) {
    // Gemini API call
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Код:\n${code}\n\nЗапрос: ${message}`,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: `Ты помощник для UI компонентов библиотеки NexoreUI.

ВАЖНЫЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО изменённым кодом без каких-либо объяснений и без markdown форматирования (НЕ используй тройные кавычки \`\`\`tsx). Если исходный код не обернут в функцию/компонент, возвращай ТОЛЬКО raw JSX разметку. НЕ оборачивай ее в функцию, если ее не было в исходном коде.
2. Меняй только то, что просит пользователь. Сохраняй структуру, обработчики (onClick и др.) и все импорты.
3. НЕ придумывай несуществующие пропсы стилизации (такие как bg, color, bg-color, shadow и т.д.) для компонентов (например, для NeonButton, ThreeDButton, RippleButton).
4. Любые изменения цвета, фона, границ, теней или свечения делай через стандартные Tailwind CSS классы внутри пропса className.
   Примеры стилизации через className:
   - Сделать NeonButton красным (текст red-500, граница red-500, красное свечение):
     <NeonButton className="border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">Neon Glow</NeonButton>
   - Сделать NeonButton синим (текст blue-500, граница blue-500, синее свечение):
     <NeonButton className="border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">Neon Glow</NeonButton>
   - Сделать NeonButton зеленым (текст emerald-500, граница emerald-500, зеленое свечение):
     <NeonButton className="border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">Neon Glow</NeonButton>
   - Сделать ThreeDButton красным (фон, ховер и 3D-тень под цвет фона):
     <ThreeDButton className="bg-red-500 hover:bg-red-600 text-white shadow-[0_5px_0_#991b1b] hover:shadow-[0_2px_0_#991b1b]">Press Me</ThreeDButton>
   - Сделать стандартный Button красным:
     <Button className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20">Button</Button>`,
                },
              ],
            },
            generationConfig: {
              maxOutputTokens: 8192,
              temperature: 0.1,
            },
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Gemini API error status:", response.status, errorText)
        return NextResponse.json(
          { error: `Ошибка API: ${response.statusText}` },
          { status: 502 }
        )
      }

      const data = await response.json()
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
      
      // Очистка от markdown блоков если модель проигнорировала инструкцию
      text = text.trim()
      if (text.startsWith("```")) {
        text = text.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "")
      }
      result = text.trim()
    } catch (e: any) {
      console.error("Gemini API call failed:", e)
      return NextResponse.json(
        { error: `Не удалось связаться с AI: ${e.message}` },
        { status: 500 }
      )
    }
  } else {
    // Anthropic API call
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 4000,
          system: `Ты помощник для UI компонентов библиотеки NexoreUI.

ВАЖНЫЕ ПРАВИЛА:
1. Отвечай ТОЛЬКО изменённым кодом без каких-либо объяснений и без markdown форматирования (НЕ используй тройные кавычки \`\`\`tsx). Если исходный код не обернут в функцию/компонент, возвращай ТОЛЬКО raw JSX разметку. НЕ оборачивай ее в функцию, если ее не было в исходном коде.
2. Меняй только то, что просит пользователь. Сохраняй структуру, обработчики (onClick и др.) и все импорты.
3. НЕ придумывай несуществующие пропсы стилизации (такие как bg, color, bg-color, shadow и т.д.) для компонентов (например, для NeonButton, ThreeDButton, RippleButton).
4. Любые изменения цвета, фона, границ, теней или свечения делай через стандартные Tailwind CSS классы внутри пропса className.
   Примеры стилизации через className:
   - Сделать NeonButton красным (текст red-500, граница red-500, красное свечение):
     <NeonButton className="border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">Neon Glow</NeonButton>
   - Сделать NeonButton синим (текст blue-500, граница blue-500, синее свечение):
     <NeonButton className="border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]">Neon Glow</NeonButton>
   - Сделать NeonButton зеленым (текст emerald-500, граница emerald-500, зеленое свечение):
     <NeonButton className="border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">Neon Glow</NeonButton>
   - Сделать ThreeDButton красным (фон, ховер и 3D-тень под цвет фона):
     <ThreeDButton className="bg-red-500 hover:bg-red-600 text-white shadow-[0_5px_0_#991b1b] hover:shadow-[0_2px_0_#991b1b]">Press Me</ThreeDButton>
   - Сделать стандартный Button красным:
     <Button className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20">Button</Button>`,
          messages: [
            {
              role: "user",
              content: `Код:\n${code}\n\nЗапрос: ${message}`,
            },
          ],
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Anthropic API error status:", response.status, errorText)
        return NextResponse.json(
          { error: `Ошибка API: ${response.statusText}` },
          { status: 502 }
        )
      }

      const data = await response.json()
      let text = data.content?.[0]?.text || ""
      
      // Очистка от markdown блоков
      text = text.trim()
      if (text.startsWith("```")) {
        text = text.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "")
      }
      result = text.trim()
    } catch (e: any) {
      console.error("Anthropic API call failed:", e)
      return NextResponse.json(
        { error: `Не удалось связаться с AI: ${e.message}` },
        { status: 500 }
      )
    }
  }

  const updatedLimit = rateLimitMap.get(ip) || { count: 1, resetTime: now + hourMs }
  return NextResponse.json({
    result,
    count: updatedLimit.count,
    resetTime: updatedLimit.resetTime,
  })
}
