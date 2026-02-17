import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a social media caption based on an image.
 * @param imageBase64 The base64 string of the image (including data:image/... prefix)
 * @param tone The desired tone of the caption
 */
export const generateCaptionFromImage = async (
  imageBase64: string,
  tone: 'friendly' | 'professional' | 'sales-focused' = 'friendly'
): Promise<string> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return "API Key missing. Please set up your environment.";
  }

  try {
    // Extract the raw base64 data and mime type
    const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid image data format");
    }
    const mimeType = match[1];
    const data = match[2];

    const prompt = `You are a social media manager for a small business. 
    Write a short, engaging caption for Instagram and Facebook based on this image.
    Tone: ${tone}.
    Include 3 relevant hashtags at the end.
    Keep it under 280 characters if possible.
    Do not include introductory text like "Here is a caption:". just the caption.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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