interface Env {
  GEMINI_API_KEY?: string;
}

interface AssistantRequest {
  experimentTitle?: string;
  parameters?: Record<string, unknown>;
  measurements?: Record<string, unknown>;
  prompt?: string;
  type?: string;
}

const SYSTEM_INSTRUCTION = `You are "SciNiraula AI — Laboratory Assistant", an expert scientific laboratory mentor integrated into SciNiraula Virtual STEM Laboratory.
Your role is to help students understand what is happening in their experiment based strictly on their supplied parameters and measurements.
Tone: Encouraging, rigorous, scientific, Socratic, SI-unit focused.
Never make up values not provided. If a user asks "what if", refer to the physical formulas and encourage them to adjust the simulation controls to test their hypothesis.
Keep answers concise, pedagogical, and well-structured with Markdown formulas where helpful.`;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}): Promise<Response> {
  let data: AssistantRequest;

  try {
    data = (await request.json()) as AssistantRequest;
  } catch {
    return jsonResponse({ error: "Invalid JSON request body." }, 400);
  }

  const { experimentTitle, parameters, measurements, prompt, type } = data;

  if (!prompt && type !== "quiz" && type !== "interpret") {
    return jsonResponse({ error: "Missing query prompt" }, 400);
  }

  const key = env.GEMINI_API_KEY;

  if (!key) {
    return jsonResponse({
      configured: false,
      source: "offline",
      message:
        "AI Assistant API key is not configured. Providing offline scientific guidance.",
    });
  }

  const userPromptText = `[Experiment Context]
Experiment: ${experimentTitle || "STEM Laboratory"}
Current Parameters: ${JSON.stringify(parameters || {})}
Current Measurements: ${JSON.stringify(measurements || {})}
Request Type: ${type || "general"}
Student Query: ${prompt || "Interpret my current experimental results."}`;

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [{ parts: [{ text: userPromptText }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
      },
    );

    if (!geminiResponse.ok) {
      return jsonResponse({
        configured: true,
        error: true,
        source: "offline",
        message: `Gemini API returned status ${geminiResponse.status}. Offline fallback is active.`,
      });
    }

    const geminiData = (await geminiResponse.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const reply =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No explanation generated.";

    return jsonResponse({
      configured: true,
      source: "gemini",
      reply,
    });
  } catch {
    return jsonResponse({
      configured: true,
      error: true,
      source: "offline",
      message: "The AI service could not be reached. Offline fallback is active.",
    });
  }
}

export async function onRequest({
  request,
}: {
  request: Request;
}): Promise<Response | void> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }
}
