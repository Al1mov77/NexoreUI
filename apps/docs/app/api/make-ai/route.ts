import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, image, elements, selectedId, canvasSettings } = await req.json();

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

## RESPONSE FORMAT
Return ONLY valid JSON (no markdown, no backticks):
{
  "elements": [ ...updated elements array... ],
  "message": "Short friendly explanation of what you did (in the same language as the user's prompt)"
}

## EXAMPLES
- "Make it red" → change selectedElement's styles.backgroundColor to "#ef4444" and styles.color to "#ffffff"
- "Add a blue button" → append a new button element, keep all existing elements unchanged
- "Create a login form" → add Card, Title (Login), Email Label, Email Input, Password Label, Password Input, Checkbox (Show Password), SIGN IN Button, Links (Forgot Username / Don't have an account?) perfectly aligned according to layout rules.`;

    const geminiKeys = Array.from(new Set([
      process.env.GEMINI_API_KEY_1,
      process.env.GEMINI_API_KEY_2,
      process.env.GEMINI_API_KEY,
    ].filter(Boolean))) as string[];

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
      text: `Current elements JSON:\n${JSON.stringify(elements, null, 0)}\nSelected Element ID: ${selectedId || 'None'}\nCanvas: ${canvasSettings.width}x${canvasSettings.height}\n\nUser prompt: ${prompt}`
    });

    let lastError: Error | null = null;
    for (let i = 0; i < geminiKeys.length; i++) {
      const currentKey = geminiKeys[i];
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts }],
              systemInstruction: { parts: [{ text: systemPrompt }] },
              generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 8192,
              },
            }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini API key #${i + 1} failed (${response.status}):`, errText);
          lastError = new Error(`Key #${i + 1} failed: ${response.status} ${errText}`);
          continue;
        }

        const data = await response.json();
        resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (resultText) break;
      } catch (err: any) {
        console.warn(`Gemini API key #${i + 1} network error:`, err?.message || err);
        lastError = err instanceof Error ? err : new Error(String(err));
      }
    }

    if (!resultText && lastError) {
      throw lastError;
    }

    // Clean up resultText
    resultText = resultText.trim();
    if (resultText.startsWith("```")) {
      resultText = resultText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "");
    }
    
    try {
      const parsed = JSON.parse(resultText);
      
      // Validate: elements must be an array
      if (!parsed.elements || !Array.isArray(parsed.elements)) {
        return NextResponse.json({ 
          elements: elements, // Return original elements unchanged
          message: "AI response was invalid. Your canvas is unchanged." 
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
       console.error("Failed to parse JSON from AI:", resultText.substring(0, 200));
       return NextResponse.json({ 
         elements: elements, // Return original elements unchanged 
         message: "AI returned an invalid response. Your canvas is unchanged. Please try a different prompt." 
       });
    }

  } catch (err: any) {
    console.error("Make AI error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
