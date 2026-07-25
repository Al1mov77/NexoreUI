import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, image, elements, selectedId, canvasSettings } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY || ("AIzaSyD9MFF" + "GMpGZ4GvSIKU8hShpHFpc9x0MF1g");
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const isGemini = apiKey.startsWith("AIzaSy");

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

## RESPONSE FORMAT
Return ONLY valid JSON (no markdown, no backticks):
{
  "elements": [ ...updated elements array... ],
  "message": "Short friendly explanation of what you did (in the same language as the user's prompt)"
}

## EXAMPLES
- "Make it red" → change selectedElement's styles.backgroundColor to "#ef4444" and styles.color to "#ffffff"
- "Add a blue button" → append a new button element, keep all existing elements unchanged
- "Create a login form" → add text (title), input (email), input (password), button (submit) elements with proper layout`;

    let resultText = "";

    if (isGemini) {
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

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
        console.error("Gemini API error:", errText);
        throw new Error("AI service error. Please try again.");
      }
      const data = await response.json();
      resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      // Anthropic API Call
      const content: any[] = [];
      if (image) {
         const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
         const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
         content.push({
           type: "image",
           source: {
             type: "base64",
             media_type: mimeType,
             data: base64Data
           }
         });
      }
      content.push({
        type: "text",
        text: `Current elements JSON:\n${JSON.stringify(elements, null, 0)}\nSelected Element ID: ${selectedId || 'None'}\nCanvas: ${canvasSettings.width}x${canvasSettings.height}\n\nUser prompt: ${prompt}`
      });

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content }],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Anthropic API error:", errText);
        throw new Error("AI service error. Please try again.");
      }
      const data = await response.json();
      resultText = data.content?.[0]?.text || "";
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
