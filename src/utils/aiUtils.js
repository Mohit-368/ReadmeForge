
const AI_KEY_STORAGE = 'readmeforge-gemini-key';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export function getStoredKey() {
  try {
    return localStorage.getItem(AI_KEY_STORAGE) || '';
  } catch (e) {
    return '';
  }
}

export function storeKey(k) {
  try {
    localStorage.setItem(AI_KEY_STORAGE, k.trim());
  } catch (e) { }
}

export function clearKey() {
  try {
    localStorage.removeItem(AI_KEY_STORAGE);
  } catch (e) { }
}

export function buildPrompt(scope, formData, currentMd) {
  const base = "You are an expert technical writer helping improve a GitHub README.\n" +
    "Respond ONLY with a valid JSON array. No markdown fences, no explanation.\n\n";

  const ctx = `Project: ${formData.projName || 'Unnamed'}\n` +
    `Tagline: ${formData.tagline || ''}\n` +
    `Tech: ${formData.customTech || 'not specified'}\n` +
    `License: ${formData.license}\n\n`;

  let instruction = "";
  let sectionCtx = "";

  if (scope === 'full') {
    instruction = "Analyze the full README below and return an array of improvement suggestions.\n" +
      "Each item must have: { \"section\": string, \"icon\": emoji, \"type\": \"improved\"|\"added\"|\"enhanced\", " +
      "\"before\": string (current text, empty if new), \"after\": string (your improved version), " +
      "\"reason\": string (1 sentence why) }.\n" +
      "Focus on: description clarity, feature completeness, installation steps, formatting.\n" +
      "Return 3-6 suggestions max.\n\n";
    sectionCtx = "Current README markdown:\n" + (currentMd || "(empty)").slice(0, 3000);
  } else {
    const sectionMap = {
      description: { label: "Description", field: formData.description, hint: "Make it compelling, clear, problem-focused (2-4 sentences)." },
      features: { label: "Features", field: formData.features, hint: "Add grouped bullet points with ### Category headers and emoji." },
      installation: { label: "Installation", field: formData.installCmds, hint: "Add step-by-step commands, prerequisites, and env setup tips." },
      title: { label: "Title/Tagline", field: formData.tagline, hint: "Craft a punchy one-liner tagline that explains the project value." }
    };
    let s = sectionMap[scope];
    if (!s) s = { label: scope, field: "", hint: "Improve this section." };
    instruction = "Improve only the \"" + s.label + "\" section of the README.\n" +
      "Return a JSON array with exactly 1-3 suggestions.\n" +
      "Each item: { \"section\": \"" + s.label + "\", \"icon\": emoji, \"type\": \"improved\"|\"enhanced\", " +
      "\"before\": string, \"after\": string, \"reason\": string }.\n" +
      "Hint: " + s.hint + "\n\n";
    sectionCtx = "Current " + s.label + " content:\n" + (s.field || "(empty)") + "\n\n" +
      "Project context: " + ctx;
  }

  return base + instruction + ctx + sectionCtx;
}

export async function callGemini(prompt, apiKey) {
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
  });

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body
  });

  if (res.status === 429) throw new Error('RATE_LIMIT');
  if (res.status === 400) throw new Error('INVALID_KEY');
  if (!res.ok) throw new Error(`HTTP_${res.status}`);

  const data = await res.json();
  let text = "";
  try {
    text = data.candidates[0].content.parts[0].text;
  } catch (e) {
    throw new Error('PARSE_EMPTY');
  }

  const parsed = parseAIResponse(text);
  if (!parsed || !parsed.length) throw new Error('PARSE_EMPTY');
  return parsed;
}

function parseAIResponse(text) {
  // Strip markdown fences if model ignored instruction
  const cleaned = text.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
  // Find JSON array
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) return null;
  try {
    const arr = JSON.parse(cleaned.slice(start, end + 1));
    if (!Array.isArray(arr)) return null;
    // Validate and sanitise each item
    return arr.filter(item => item && typeof item === 'object' && item.after).map((item, i) => ({
      id: "suggestion_" + i,
      section: String(item.section || "General"),
      icon: String(item.icon || "✨"),
      type: String(item.type || "improved"),
      before: String(item.before || ""),
      after: String(item.after || ""),
      reason: String(item.reason || ""),
      status: "pending",   // pending | accepted | rejected
      edited: null         // user-edited version
    }));
  } catch (e) {
    return null;
  }
}
