import { BaseAIAdapter } from './aiAdapter.js';
import { LocalHeuristicAdapter } from './localHeuristicAdapter.js';
import { validateStoryboardData, validateSceneData } from '../../schemas/storyboardSchema.js';

export class GeminiAdapter extends BaseAIAdapter {
  constructor(apiKey, model = 'gemini-1.5-flash') {
    super();
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
    this.model = model;
    this.fallbackAdapter = new LocalHeuristicAdapter();
  }

  detectLanguage(text, explicitLang) {
    if (explicitLang === 'bn' || explicitLang === 'en') return explicitLang;
    const hasBengali = /[\u0980-\u09FF]/.test(text || '');
    return hasBengali ? 'bn' : 'en';
  }

  async generateScript({ topic, tone = 'energetic', targetAudience = 'creators', durationInSeconds = 30, language }) {
    const lang = this.detectLanguage(topic, language);

    if (!this.apiKey) {
      console.log('[GeminiAdapter] No API key configured. Using local heuristic engine.');
      return this.fallbackAdapter.generateScript({ topic, tone, targetAudience, durationInSeconds, language: lang });
    }

    try {
      const languageInstruction = lang === 'bn'
        ? 'Generate all script text, hook, and narrative beats in natural, high-impact Bengali (বাংলা).'
        : 'Generate all script text in crisp, punchy, high-retention English.';

      const prompt = `You are a world-class motion graphics director and viral scriptwriter.
Topic: "${topic}".
Tone: ${tone}.
Target Audience: ${targetAudience}.
Duration: ${durationInSeconds} seconds.
Language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
${languageInstruction}

Return STRICT JSON with the following structure:
{
  "title": "Short punchy title",
  "topic": "${topic}",
  "language": "${lang}",
  "tone": "${tone}",
  "targetAudience": "${targetAudience}",
  "durationInSeconds": ${durationInSeconds},
  "hook": "Attention-grabbing opening hook sentence",
  "rawScript": "Full video script broken down with timestamps and visual notes",
  "keyPoints": ["Narrative Beat 1", "Narrative Beat 2", "Narrative Beat 3", "Narrative Beat 4"]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!contentText) throw new Error('No content received from Gemini');

      const parsed = JSON.parse(contentText);
      return {
        ...parsed,
        language: lang,
        durationInSeconds: Number(durationInSeconds)
      };
    } catch (err) {
      console.warn('[GeminiAdapter] Script generation failed, falling back:', err.message);
      return this.fallbackAdapter.generateScript({ topic, tone, targetAudience, durationInSeconds, language: lang });
    }
  }

  async generateStoryboard({ script, topic, durationInSeconds = 30, language, style }) {
    const lang = this.detectLanguage((topic || '') + ' ' + (script || ''), language);

    if (!this.apiKey) {
      return this.fallbackAdapter.generateStoryboard({ script, topic, durationInSeconds, language: lang, style });
    }

    try {
      const languageInstruction = lang === 'bn'
        ? 'Generate all headings, subheadings, badges, voiceoverText, and emphasizedKeywords in natural, expressive Bengali (বাংলা).'
        : 'Generate all headings, subheadings, badges, voiceoverText, and emphasizedKeywords in punchy, modern English.';

      const prompt = `You are an expert Remotion & Motion Graphics art director.
Create a structured scene-by-scene storyboard JSON for topic "${topic}".
Duration: ${durationInSeconds} seconds.
Script: "${script}".
Language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.
${languageInstruction}

IMPORTANT RULES:
1. Never use a fixed number of scenes. Dynamically decide the scene count based on the topic and duration (typically 3 to 8 scenes).
2. Each scene must have a tailored duration, and the start times must be continuous starting at 0.0, summing up exactly to ${durationInSeconds} seconds.
3. Every scene MUST include:
   - "id": unique string (e.g. "scene-1", "scene-2")
   - "order": integer index (0, 1, 2...)
   - "startTime": float seconds from start
   - "durationInSeconds": float/integer duration of this scene
   - "voiceoverText": spoken narration line
   - "onScreenText": {"heading": "...", "subheading": "...", "badge": "..."}
   - "heading": same as onScreenText.heading
   - "subheading": same as onScreenText.subheading
   - "badge": same as onScreenText.badge
   - "emphasizedKeywords": ["Keyword1", "Keyword2"]
   - "visualDescription": description of colors, 3D elements, layout and camera
   - "animationInstructions": exact kinetic choreography instructions
   - "transitionType": "zoom" | "wipe" | "slide" | "fade" | "glitch"
   - "backgroundStyle": "matrix-grid" | "cyber-haze" | "gradient-drift" | "particle-field" | "dark-minimal" | "hud-grid" | "deep-navy"
   - "soundEffectSuggestions": ["whoosh", "bass-hit", "digital-beeps"]
   - "archetype": "KINETIC_TITLE" | "METRIC_COUNTER" | "FEATURE_CARDS" | "TECH_HUD" | "ISOMETRIC_BADGE" | "CALL_TO_ACTION"
   - "layout": "center" | "split-left" | "split-right" | "minimal" | "hud-frame"
   - "motionPreset": "energetic" | "smooth" | "cyber" | "minimal" | "dramatic"
   - "colorPalette": {"bg": "#0B0F19", "textPrimary": "#FFFFFF", "textSecondary": "#94A3B8", "accent": "#3B82F6", "glow": "rgba(59, 130, 246, 0.5)"}
   - "metrics": array of {"label": "...", "value": "...", "targetNumber": 99, "suffix": "%", "prefix": ""}
   - "features": array of {"title": "...", "description": "...", "icon": "zap"|"monitor"|"volume-2"|"type"}

Return strictly valid JSON with format:
{
  "topic": "${topic}",
  "language": "${lang}",
  "totalDurationInSeconds": ${durationInSeconds},
  "sceneCount": number,
  "scenes": [...]
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(contentText);

      // Validate data with Zod
      const validated = validateStoryboardData(parsed);
      return validated;
    } catch (err) {
      console.warn('[GeminiAdapter] Storyboard request failed, falling back:', err.message);
      return this.fallbackAdapter.generateStoryboard({ script, topic, durationInSeconds, language: lang, style });
    }
  }

  async regenerateScene(params) {
    if (!this.apiKey) {
      return this.fallbackAdapter.regenerateScene(params);
    }

    try {
      const { currentScene, instruction } = params;
      const isBengali = /[\u0980-\u09FF]/.test((currentScene.heading || '') + ' ' + (currentScene.voiceoverText || '') + ' ' + (instruction || ''));
      const lang = isBengali ? 'bn' : 'en';

      const prompt = `You are a motion graphics director. Regenerate and improve the following scene according to the instruction: "${instruction || 'Make it more dynamic and cinematic'}".
Current Scene Data: ${JSON.stringify(currentScene)}
Language: ${lang === 'bn' ? 'Bengali (বাংলা)' : 'English'}.

Respond strictly with valid JSON for the updated scene following the exact schema:
{
  "id": "${currentScene.id}",
  "order": ${currentScene.order || 0},
  "startTime": ${currentScene.startTime || 0},
  "durationInSeconds": ${currentScene.durationInSeconds || 5},
  "voiceoverText": "Updated narration",
  "onScreenText": {"heading": "...", "subheading": "...", "badge": "..."},
  "heading": "...",
  "subheading": "...",
  "badge": "...",
  "emphasizedKeywords": ["Keyword1", "Keyword2"],
  "visualDescription": "...",
  "animationInstructions": "...",
  "transitionType": "zoom",
  "backgroundStyle": "matrix-grid",
  "soundEffectSuggestions": ["whoosh", "impact"],
  "archetype": "KINETIC_TITLE" | "METRIC_COUNTER" | "FEATURE_CARDS" | "TECH_HUD" | "ISOMETRIC_BADGE" | "CALL_TO_ACTION",
  "layout": "center",
  "motionPreset": "energetic",
  "colorPalette": {"bg": "#0B0F19", "textPrimary": "#FFFFFF", "textSecondary": "#94A3B8", "accent": "#3B82F6", "glow": "rgba(59, 130, 246, 0.5)"},
  "metrics": [],
  "features": []
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      });

      if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
      const data = await response.json();
      const contentText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(contentText);
      const validated = validateSceneData({
        ...currentScene,
        ...parsed,
        voiceoverScript: parsed.voiceoverText || currentScene.voiceoverScript
      });
      return validated;
    } catch (err) {
      console.warn('[GeminiAdapter] Scene regeneration failed, falling back:', err.message);
      return this.fallbackAdapter.regenerateScene(params);
    }
  }
}
