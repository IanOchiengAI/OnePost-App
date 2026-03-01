import { GoogleGenAI } from "@google/genai";
import { supabase } from './supabaseClient';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Fetches the current user's brand voice prompt from Supabase.
 */
const getUserBrandVoice = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('brand_voice_prompt')
    .eq('id', session.user.id)
    .single();

  if (error || !data) return null;
  return data.brand_voice_prompt;
};

/**
 * Generates a social media caption based on an image.
 * @param imageBase64 The base64 string of the image (including data:image/... prefix)
 * @param tone The desired tone of the caption
 */
export const generateCaptionFromImage = async (
  imageBase64: string,
  tone: 'Friendly' | 'Professional' | 'Sales' = 'Friendly',
  platform?: 'Instagram' | 'Facebook' | 'TikTok'
): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return "API Key missing. Please set up your environment.";
  }

  try {
    const brandVoice = await getUserBrandVoice();

    // Extract the raw base64 data and mime type
    const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image data format");
    }
    const mimeType = match[1];
    const data = match[2];

    let platformInstruction = "";
    if (platform === 'Instagram') {
      platformInstruction = "- Style: Highly visual and engaging, use more emojis.";
    } else if (platform === 'Facebook') {
      platformInstruction = "- Style: Focus on community engagement and clear communication.";
    } else if (platform === 'TikTok') {
      platformInstruction = "- Style: Punchy and trend-aware. Mention 'Reels' or 'TikTok style' trends where relevant.";
    }

    const prompt = `${brandVoice ? `System Persona: ${brandVoice}\n\n` : ""}You are a social media manager. Write an engaging caption for this image.
    Tone: ${tone}.
    ${platform ? `Platform: ${platform}.` : ""}
    Requirements:
    ${platformInstruction}
    - Exactly 3 relevant hashtags at the end.
    - Under 280 characters total.
    - No conversational filler or introductory text. Just the caption and hashtags.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating caption:", error);
    throw new Error("Failed to generate caption. Please try again.");
  }
};

/**
 * Suggests the optimal day and time to post based on content analysis.
 */
export const suggestOptimalPostingTime = async (
  caption: string,
  imageBase64?: string,
  platform?: 'Instagram' | 'Facebook' | 'TikTok'
): Promise<{ day: string; time: string; reason: string }> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing.");
  }

  try {
    const parts: any[] = [];

    if (imageBase64) {
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const prompt = `Analyze this social media post content (caption and image if provided) and suggest the absolute BEST single day and time to post for maximum engagement.
    
    Caption: "${caption}"
    ${platform ? `Platform: ${platform}` : "Platform: All major socials"}
    
    Consider:
    - Target audience behavior.
    - Content type (e.g., educational, promotional, lifestyle).
    - Platform-specific peak activity times.
    
    Return your response as a valid JSON object with exactly these fields:
    {
      "day": "Day of the week",
      "time": "HH:MM AM/PM",
      "reason": "A 1-sentence data-backed explanation"
    }`;

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: { parts }
    });

    const text = response.text || "{}";
    // Basic cleanup in case Gemini wraps JSON in markdown blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error suggesting optimal time:", error);
    return {
      day: "Wednesday",
      time: "10:00 AM",
      reason: "Default recommendation (Peak general engagement timing)."
    };
  }
};

/**
 * Generates AI-driven strategy tips based on performance data.
 */
export const getStrategyTips = async (): Promise<string> => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  try {
    const { data: snapshots, error } = await supabase
      .from('analytics_snapshots')
      .select('reach, engagement, likes, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !snapshots || snapshots.length === 0) {
      return "No analytics data available yet. Keep posting to see strategy tips!";
    }

    const summary = snapshots.map(s =>
      `Date: ${new Date(s.created_at).toLocaleDateString()}, Reach: ${s.reach}, Engagement: ${s.engagement}, Likes: ${s.likes}`
    ).join("\n");

    const prompt = `You are an expert social media strategist. Analyze this performance data and provide 3 actionable tips to improve reach and engagement.
    
    Recent Performance Data:
    ${summary}
    
    Instructions:
    - Be specific and data-driven.
    - Keep tips concise and encouraging.
    - Return a bulleted list of 3 tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    return response.text || "Continue posting high-quality content to gather more insights!";
  } catch (error) {
    console.error("Error generating strategy tips:", error);
    return "Analyzing your trends... check back soon for personalized tips!";
  }
};