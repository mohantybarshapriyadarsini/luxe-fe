const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function sendMessageToGemini(userPrompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is missing. Set VITE_GEMINI_API_KEY in your .env file.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        parts: [
          {
            text: userPrompt,
          },
        ],
      },
    ],
    safetySettings: [
        {
          category: 'HARM_CATEGORY_UNSPECIFIED',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DEROGATORY_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_VIOLENCE',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUAL_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_MEDICAL_CONTENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
    };

  try {
    const fetchWithFallback = async () => {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };

      try {
        return await fetch(endpoint, options);
      } catch (err) {
        if (err instanceof TypeError) {
          const proxyEndpoint = `https://corsproxy.io/?${encodeURIComponent(endpoint)}`;
          return await fetch(proxyEndpoint, options);
        }
        throw err;
      }
    };

    const response = await fetchWithFallback();

    if (!response.ok) {
      let errorMsg = `API Error ${response.status}`;
      try {
        const errData = await response.json();
        errorMsg = errData?.error?.message || errData?.message || response.statusText || errorMsg;
      } catch (e) {
        // ignore JSON parse error
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Check for blocked content
    if (data?.promptFeedback?.blockReason) {
      throw new Error(`Response blocked: ${data.promptFeedback.blockReason}`);
    }

    // Extract text from response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text || text.trim() === '') {
      throw new Error('No text generated from API');
    }

    return text.trim();
  } catch (err) {
    console.error('[Chatbot API Error]', err?.message || err);
    throw new Error(err?.message || 'Failed to get response from AI');
  }
}
