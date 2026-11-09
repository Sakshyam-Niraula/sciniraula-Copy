import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function aiAssistantPlugin(apiKey?: string): Plugin {
  return {
    name: 'sciniraula-ai-assistant',
    configureServer(server) {
      server.middlewares.use('/api/assistant', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');

          try {
            const data = JSON.parse(body || '{}');
            const { experimentTitle, parameters, measurements, prompt, type } = data;

            if (!prompt && type !== 'quiz' && type !== 'interpret') {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing query prompt' }));
              return;
            }

            const key = apiKey || process.env.GEMINI_API_KEY;
            if (!key) {
              res.statusCode = 200;
              res.end(JSON.stringify({
                configured: false,
                source: 'offline',
                message: 'AI Assistant API key is not configured in .env (GEMINI_API_KEY). Providing offline scientific guidance.',
              }));
              return;
            }

            // Call Gemini REST API
            const systemInstruction = `You are "SciNiraula AI — Laboratory Assistant", an expert scientific laboratory mentor integrated into SciNiraula Virtual STEM Laboratory.
Your role is to help students understand what is happening in their experiment based strictly on their supplied parameters and measurements.
Tone: Encouraging, rigorous, scientific, Socratic, SI-unit focused.
Never make up values not provided. If a user asks "what if", refer to the physical formulas and encourage them to adjust the simulation controls to test their hypothesis.
Keep answers concise, pedagogical, and well-structured with Markdown formulas where helpful.`;

            const userPromptText = `[Experiment Context]
Experiment: ${experimentTitle || 'STEM Laboratory'}
Current Parameters: ${JSON.stringify(parameters || {})}
Current Measurements: ${JSON.stringify(measurements || {})}
Request Type: ${type || 'general'}
Student Query: ${prompt || 'Interpret my current experimental results.'}`;

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
            const geminiResponse = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemInstruction }]
                },
                contents: [
                  {
                    parts: [{ text: userPromptText }]
                  }
                ],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 800
                }
              })
            });

            if (!geminiResponse.ok) {
              const errText = await geminiResponse.text();
              res.statusCode = 200;
              res.end(JSON.stringify({
                configured: true,
                error: true,
                source: 'offline',
                message: `Gemini API returned status ${geminiResponse.status}. Fallback activated: ${errText.slice(0, 100)}`,
              }));
              return;
            }

            const geminiData = await geminiResponse.json() as any;
            const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated.';

            res.statusCode = 200;
            res.end(JSON.stringify({
              configured: true,
              source: 'gemini',
              reply,
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  return {
    plugins: [
      react(),
      tailwindcss(),
      aiAssistantPlugin(apiKey)
    ],
    server: {
      port: 5173,
    }
  };
});
