import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      const raw = await req.text();
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }
    const prompt = body.prompt || "";
    const image = body.image || null;
    const elements = Array.isArray(body.elements) ? body.elements : [];
    const selectedId = body.selectedId || null;
    const canvasSettings = body.canvasSettings || { width: 1200, height: 800 };
    const canvasWidth = canvasSettings?.width || 1200;
    const canvasHeight = canvasSettings?.height || 800;

    const systemPrompt = `You are the AI design assistant for Nexore Make — a visual UI component builder.

## YOUR ROLE
You receive the current canvas state as a JSON array of elements and a user prompt.
Your job is to modify the elements array based on the user's request.

## CRITICAL RULES
1. **NEVER duplicate elements** unless the user explicitly asks "duplicate", "copy", or "add another".
2. If a \`selectedId\` is provided AND the user's prompt is about modifying/changing something, apply changes ONLY to the selected element.
3. If user asks to "add" or "create" something new, add new elements. Do NOT remove existing ones.
4. When modifying an element, keep ALL its existing properties and only change the ones relevant to the request.
5. Always maintain valid position coordinates (x: 50-800, y: 50-500).
6. Generate unique IDs for new elements using format: "el_" + random 6 chars.

## ELEMENT SCHEMA
Each element has these properties:
{
  id: string,           // Unique ID
  type: 'button' | 'card' | 'input' | 'text' | 'badge' | 'avatar' | 'icon' | 'divider' | 'image' | 'container' | 'flex' | 'grid' | 'switch' | 'checkbox' | 'progress',
  name: string,         // Display name
  position: { x: number, y: number },
  size: { width: number, height: number },
  zIndex: number,
  content?: string,     // Text content / label
  placeholder?: string, // Input placeholder
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'solid' | 'destructive' | 'secondary',
  sizeVariant?: 'default' | 'sm' | 'lg' | 'icon',
  checked?: boolean,
  disabled?: boolean,
  value?: string | number,
  src?: string,         // Image/avatar URL
  animationPreset?: 'none' | 'pulse' | 'bounce' | 'fade-in' | 'slide-in' | 'glow' | 'spin',
  styles: {
    backgroundColor?: string,
    color?: string,
    borderRadius?: string,
    borderWidth?: string,
    borderColor?: string,
    borderStyle?: string,
    fontSize?: string,
    fontWeight?: string,
    opacity?: number,       // 0-1
    boxShadow?: string,
    backdropBlur?: string,
    paddingTop?: string,
    paddingRight?: string,
    paddingBottom?: string,
    paddingLeft?: string,
    textAlign?: 'left' | 'center' | 'right',
    letterSpacing?: string,
    lineHeight?: string,
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize',
    rotate?: string,        // e.g. "45" (degrees)
    scaleX?: string,
    scaleY?: string,
    mixBlendMode?: string,
  }
}

## FORM & CARD LAYOUT ALIGNMENT RULES (VERY IMPORTANT)
When creating a form or card layout (e.g. Login, Signup, Contact form, or UI template):
1. CONTAINER / CARD:
   - Card position: centered on canvas, e.g. position: { x: 380, y: 100 }, size: { width: 440, height: 540 }.
   - Styles: backgroundColor: "#ffffff", borderRadius: "16px", borderWidth: "1px", borderColor: "#e4e4e7", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)".
2. INNER ELEMENTS (CHILD ALIGNMENT):
   - All inner elements MUST align perfectly relative to the Card!
   - Outer card padding is 30px, so ALL input fields, labels, and primary buttons share the EXACT SAME X-coordinate: x = card.x + 30 (e.g. 410).
   - ALL input fields and primary buttons share the EXACT SAME width: width = card.width - 60 (e.g. 380px).
   - Title: position: { x: card.x, y: card.y + 35 }, size: { width: card.width, height: 40 }, styles: { textAlign: 'center', fontSize: '24px', fontWeight: '700', color: '#09090b' }.
   - Email Label: position: { x: card.x + 30, y: card.y + 90 }, size: { width: 120, height: 20 }, styles: { fontSize: '13px', fontWeight: '600', color: '#3f3f46' }.
   - Email Input: position: { x: card.x + 30, y: card.y + 115 }, size: { width: card.width - 60, height: 44 }, styles: { borderRadius: '8px', borderWidth: '1px', borderColor: '#d4d4d8', fontSize: '14px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '14px', backgroundColor: '#fafafa', color: '#09090b' }.
   - Password Label: position: { x: card.x + 30, y: card.y + 175 }, size: { width: 120, height: 20 }, styles: { fontSize: '13px', fontWeight: '600', color: '#3f3f46' }.
   - Password Input: position: { x: card.x + 30, y: card.y + 200 }, size: { width: card.width - 60, height: 44 }, styles: { borderRadius: '8px', borderWidth: '1px', borderColor: '#d4d4d8', fontSize: '14px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '14px', backgroundColor: '#fafafa', color: '#09090b' }.
   - Checkbox / Options: position: { x: card.x + 30, y: card.y + 260 }, size: { width: 180, height: 24 }.
   - Primary Submit Button: position: { x: card.x + 30, y: card.y + 305 }, size: { width: card.width - 60, height: 46 }, styles: { backgroundColor: '#008080', color: '#ffffff', borderRadius: '8px', fontWeight: '600', fontSize: '15px' }.
   - Links / Footer: position: { x: card.x, y: card.y + 375 }, size: { width: card.width, height: 30 }, styles: { textAlign: 'center', color: '#0284c7', fontSize: '13px' }.

## SPECIAL EFFECTS & THEMES (AURORA BORDER, GLOW, NEON)
When the user asks for "aurora", "aurora border", "aurora card", "glow", or "neon" on a card or element:
- MUST modify the selected element's styles:
  - styles.borderWidth: "2px"
  - styles.borderStyle: "solid"
  - styles.borderColor: "#a855f7"
  - styles.boxShadow: "0 0 35px -2px rgba(168, 85, 247, 0.65), 0 0 15px 2px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(168, 85, 247, 0.25)"
  - styles.borderRadius: "20px"
  - animationPreset: "glow"
- If the user mentions a specific color (e.g. "cyan aurora", "red glow"), adapt borderColor and boxShadow RGBA accordingly.

## RESPONSE FORMAT
Return ONLY valid JSON (no markdown, no backticks):
{
  "elements": [ ...updated elements array... ],
  "message": "Short friendly explanation of what you did (in the same language as the user's prompt)"
}

## EXAMPLES
- "Make it red" → change selectedElement's styles.backgroundColor to "#ef4444" and styles.color to "#ffffff"
- "aurora border fx" / "aurora card" → on the card/element, set styles.borderColor to "#a855f7", styles.borderWidth to "2px", styles.borderStyle to "solid", styles.boxShadow to "0 0 35px rgba(168, 85, 247, 0.6), 0 0 15px rgba(6, 182, 212, 0.5)", animationPreset to "glow", styles.borderRadius to "20px"
- "Add a button" → create a new button element centered on canvas
- "Add a blue button" → append a new button element, keep all existing elements unchanged
- "Create a login form" → add Card, Title (Login), Email Label, Email Input, Password Label, Password Input, Checkbox (Show Password), SIGN IN Button, Links (Forgot Username / Don't have an account?) perfectly aligned according to layout rules.`;

    const geminiKeys = Array.from(new Set([
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY_3,
      process.env.GEMINI_API_KEY_4,
      process.env.GEMINI_API_KEY_5,
      process.env.GEMINI_API_KEY_6,
      process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    ].filter(Boolean))) as string[];

    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

    let resultText = "";

    const parts: any[] = [];
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    parts.push({
      text: `Current elements JSON:\n${JSON.stringify(elements, null, 0)}\nSelected Element ID: ${selectedId || 'None'}\nCanvas: ${canvasWidth}x${canvasHeight}\n\nUser prompt: ${prompt}`
    });

    let lastError: Error | null = null;

    outerLoop:
    for (const model of models) {
      for (let i = 0; i < geminiKeys.length; i++) {
        const currentKey = geminiKeys[i];
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(7000),
              body: JSON.stringify({
                contents: [{ role: "user", parts }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                  responseMimeType: "application/json",
                  maxOutputTokens: 8192,
                  thinkingConfig: {
                    thinkingBudget: 0,
                  },
                },
              }),
            }
          );

          if (!response.ok) {
            const errText = await response.text();
            console.warn(`Gemini API (${model}, key #${i + 1}) failed (${response.status}):`, errText);
            lastError = new Error(`Key #${i + 1} failed: ${response.status} ${errText}`);
            continue;
          }

          const data = await response.json();
          const candidate = data.candidates?.[0];
          const partsList = candidate?.content?.parts || [];
          
          for (const p of partsList) {
            if (p.text && !p.thought) {
              resultText = p.text;
              break;
            }
          }
          if (!resultText && partsList.length > 0) {
            resultText = partsList[partsList.length - 1].text || "";
          }

          if (resultText) break outerLoop;
        } catch (err: any) {
          console.warn(`Gemini API (${model}, key #${i + 1}) network error:`, err?.message || err);
          lastError = err instanceof Error ? err : new Error(String(err));
        }
      }
    }

    if (!resultText && lastError) {
      throw lastError;
    }

    // Clean up resultText and extract valid JSON
    let cleaned = (resultText || "").trim();
    if (cleaned.includes("```")) {
      const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match) {
        cleaned = match[1].trim();
      } else {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
      }
    }

    try {
      let parsed: any;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
        } else {
          throw new Error("No JSON object found");
        }
      }

      // Validate: elements must be an array
      if (!parsed.elements || !Array.isArray(parsed.elements)) {
        return NextResponse.json({
          elements: elements, // Return original elements unchanged
          message: parsed.message || "Canvas updated."
        });
      }

      // Validate each element has required fields
      parsed.elements = parsed.elements.map((el: any) => ({
        ...el,
        id: el.id || 'el_' + Math.random().toString(36).substring(2, 8),
        position: el.position || { x: 200, y: 200 },
        size: el.size || { width: 120, height: 40 },
        zIndex: el.zIndex || 1,
        styles: el.styles || {},
      }));

      return NextResponse.json(parsed);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", cleaned.substring(0, 200));
      return NextResponse.json({
        elements: elements, // Return original elements unchanged 
        message: "AI returned an answer. Your canvas was safely preserved. Try a slightly different prompt."
      });
    }

  } catch (err: any) {
    console.error("Make AI error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong with AI generation" }, { status: 500 });
  }
}
