import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Audio Decoding Helpers (Required for Gemini Raw PCM Output) ---

// Decodes base64 string to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Converts Raw PCM Int16 data to AudioBuffer
async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      // Convert Int16 to Float32 (-1.0 to 1.0)
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Main Service Functions ---

const TTS_MODEL = "gemini-2.5-flash-preview-tts";
// 'Kore' is a standard supported voice.
const TTS_VOICE = 'Kore'; 

export const generateVietnameseSpeech = async (text: string, audioContext: AudioContext): Promise<AudioBuffer | null> => {
  try {
    // Simplified prompt to ensure reliable audio generation
    const prompt = `Phát âm Tiếng Việt: "${text}"`;

    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: TTS_VOICE } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const audioBytes = decodeBase64(base64Audio);
    return await pcmToAudioBuffer(audioBytes, audioContext, 24000, 1);

  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

export const generateExplanation = async () => {
  return null;
};
