import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ALL_ELEMENT_TYPES, ElementType, NexoreMakeElement } from '../../nexoremake/types';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 15;
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequests.get(ip);
  if (!record || now > record.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  record.count += 1;
  return true;
}

const VALID_TYPE_SET = new Set<string>(ALL_ELEMENT_TYPES);

const elementSchema = z
  .object({
    id: z.string().optional(),
    type: z.string(),
    name: z.string().optional(),
    position: z
      .object({
        x: z.number(),
        y: z.number(),
      })
      .optional(),
    size: z
      .object({
        width: z.union([z.number(), z.string()]),
        height: z.union([z.number(), z.string()]),
      })
      .optional(),
    zIndex: z.number().optional(),
    content: z.string().optional(),
    secondaryContent: z.string().optional(),
    label: z.string().optional(),
    placeholder: z.string().optional(),
    iconName: z.string().optional(),
    author: z.string().optional(),
    role: z.string().optional(),
    items: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    checked: z.boolean().optional(),
    disabled: z.boolean().optional(),
    value: z.union([z.string(), z.number()]).optional(),
    ratingValue: z.number().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    href: z.string().optional(),
    styles: z.record(z.string(), z.union([z.string(), z.number(), z.undefined()])).optional(),
  })
  .passthrough();

const aiResponseSchema = z.object({
  elements: z.array(elementSchema),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid origin header' }, { status: 403 });
      }
    }

    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    let body: Record<string, unknown> = {};
    try {
      const raw = await req.text();
      if (raw.length > 2_500_000) {
        return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
      }
      body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt exceeds maximum length of 2000 characters' },
        { status: 400 }
      );
    }

    const image = typeof body.image === 'string' ? body.image : null;
    if (image && image.length > 1_800_000) {
      return NextResponse.json(
        { error: 'Attached image exceeds maximum size limit (1.5 MB)' },
        { status: 413 }
      );
    }

    const elements = Array.isArray(body.elements)
      ? (body.elements as NexoreMakeElement[]).slice(0, 150)
      : [];
    const selectedId = typeof body.selectedId === 'string' ? body.selectedId : null;
    const rawSettings =
      body.canvasSettings && typeof body.canvasSettings === 'object'
        ? (body.canvasSettings as { width?: number; height?: number })
        : {};
    const canvasWidth = typeof rawSettings.width === 'number' ? rawSettings.width : 1200;
    const canvasHeight = typeof rawSettings.height === 'number' ? rawSettings.height : 800;

    const supportedTypesList = ALL_ELEMENT_TYPES.map((t) => `'${t}'`).join(' | ');

    const systemPrompt = `You are the AI design assistant for Nexore Make, a visual UI component builder.

## YOUR ROLE
You receive the current canvas state as a JSON array of elements and a user prompt.
Your job is to modify or add elements based on the user's request following a calm, architectural, monochrome shadcn/ui design system.

## CRITICAL RULES
1. NEVER duplicate elements unless the user explicitly asks to duplicate or copy.
2. If a selectedId is provided AND the user's prompt is about modifying the selected element, apply changes ONLY to that element.
3. If the user asks to add or create something new, append new elements without deleting existing ones unless asked.
4. Use clean zinc/monochrome colors (#09090b, #18181b, #27272a, #3f3f46, #a1a1aa, #fafafa). Avoid neon purple gradients or emojis.
5. Maintain valid position coordinates within the canvas (${canvasWidth}x${canvasHeight}).
6. Generate unique IDs for new elements using format: "el_" + 6 alphanumeric chars.

## ELEMENT SCHEMA
Each element has these properties:
{
  id: string,
  type: ${supportedTypesList},
  name: string,
  position: { x: number, y: number },
  size: { width: number, height: number },
  zIndex: number,
  content?: string,
  secondaryContent?: string,
  label?: string,
  placeholder?: string,
  iconName?: string,
  author?: string,
  role?: string,
  items?: string[],
  checked?: boolean,
  disabled?: boolean,
  value?: string | number,
  ratingValue?: number,
  src?: string,
  styles: {
    backgroundColor?: string,
    color?: string,
    borderRadius?: string,
    borderWidth?: string,
    borderColor?: string,
    borderStyle?: string,
    fontSize?: string,
    fontWeight?: string,
    opacity?: number,
    boxShadow?: string,
    paddingTop?: string,
    paddingRight?: string,
    paddingBottom?: string,
    paddingLeft?: string,
    textAlign?: 'left' | 'center' | 'right',
    letterSpacing?: string,
    lineHeight?: string,
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  }
}

## RESPONSE FORMAT
Return ONLY valid JSON (no markdown fences):
{
  "elements": [ ...updated elements array... ],
  "message": "Short explanation of the changes made"
}`;

    const geminiKeys = Array.from(
      new Set(
        [
          process.env.GEMINI_API_KEY,
          process.env.GEMINI_API_KEY_1,
          process.env.GEMINI_API_KEY_2,
          process.env.GEMINI_API_KEY_3,
          process.env.GEMINI_API_KEY_4,
          process.env.GEMINI_API_KEY_5,
          process.env.GEMINI_API_KEY_6,
        ].filter((k): k is string => Boolean(k))
      )
    );

    if (geminiKeys.length === 0) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured on the server.' },
        { status: 503 }
      );
    }

    const configuredModels = process.env.GEMINI_MODELS
      ? process.env.GEMINI_MODELS.split(',').map((m) => m.trim()).filter(Boolean)
      : ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

    const parts: Array<
      | { text: string }
      | { inlineData: { data: string; mimeType: string } }
    > = [];

    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }

    parts.push({
      text: `Current elements JSON:\n${JSON.stringify(elements)}\nSelected Element ID: ${
        selectedId || 'None'
      }\nCanvas: ${canvasWidth}x${canvasHeight}\n\nUser prompt: ${prompt}`,
    });

    let resultText = '';
    let lastError: Error | null = null;

    outerLoop: for (const model of configuredModels) {
      for (let i = 0; i < geminiKeys.length; i++) {
        const currentKey = geminiKeys[i];
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${currentKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: AbortSignal.timeout(25000),
              body: JSON.stringify({
                contents: [{ role: 'user', parts }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                  responseMimeType: 'application/json',
                  maxOutputTokens: 8192,
                  temperature: 0.2,
                },
              }),
            }
          );

          if (!response.ok) {
            const errText = await response.text();
            lastError = new Error(`Model ${model} (key #${i + 1}) returned ${response.status}`);
            // If model is not found (404), do not waste other API keys on the same model
            if (response.status === 404) {
              break;
            }
            continue;
          }

          const data = (await response.json()) as {
            candidates?: Array<{
              content?: { parts?: Array<{ text?: string; thought?: boolean }> };
            }>;
          };
          const partsList = data.candidates?.[0]?.content?.parts || [];

          for (const p of partsList) {
            if (p.text && !p.thought) {
              resultText = p.text;
              break;
            }
          }
          if (!resultText && partsList.length > 0) {
            resultText = partsList[partsList.length - 1].text || '';
          }

          if (resultText) break outerLoop;
        } catch (err: unknown) {
          lastError = err instanceof Error ? err : new Error(String(err));
        }
      }
    }

    if (!resultText && lastError) {
      throw lastError;
    }

    let cleaned = (resultText || '').trim();
    if (cleaned.includes('```')) {
      const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (match) {
        cleaned = match[1].trim();
      } else {
        cleaned = cleaned
          .replace(/^```[a-zA-Z]*\n?/, '')
          .replace(/\n?```$/, '')
          .trim();
      }
    }

    let rawParsed: unknown;
    try {
      rawParsed = JSON.parse(cleaned);
    } catch {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        rawParsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
      } else {
        return NextResponse.json({
          elements,
          message: 'Could not parse AI response. Canvas left unchanged.',
        });
      }
    }

    const validation = aiResponseSchema.safeParse(rawParsed);
    if (!validation.success) {
      return NextResponse.json({
        elements,
        message: 'AI returned an invalid schema. Canvas left unchanged.',
      });
    }

    const validatedElements: NexoreMakeElement[] = validation.data.elements.map((el, idx) => {
      const safeType: ElementType = VALID_TYPE_SET.has(el.type)
        ? (el.type as ElementType)
        : 'card';
      return {
        ...(el as unknown as NexoreMakeElement),
        id: el.id || `el_${Math.random().toString(36).substring(2, 8)}_${idx}`,
        type: safeType,
        name: el.name || safeType,
        position: {
          x: Math.round(el.position?.x ?? 200),
          y: Math.round(el.position?.y ?? 200),
        },
        size: {
          width: el.size?.width ?? 160,
          height: el.size?.height ?? 44,
        },
        zIndex: el.zIndex ?? idx + 1,
        styles: (el.styles as NexoreMakeElement['styles']) || {},
      };
    });

    return NextResponse.json({
      elements: validatedElements,
      message: validation.data.message || 'Canvas updated.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
