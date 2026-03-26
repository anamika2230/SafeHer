import axios from "axios";

const API_KEY = "AIzaSyC7DXw1EavryirWXv-LDZG2NlKs9qshggs";

export const sendChatMessage = async (message) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `You are SafeHer AI — calm, empathetic, human-like. Keep responses short and supportive.\nUser: ${message}`
              }
            ]
          }
        ]
      }
    );

    console.log("GEMINI RESPONSE:", res.data);

    return res.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  } catch (error) {
    console.log("GEMINI ERROR:", error.response?.data || error.message);
    return "API not working ⚠️";
  }
};