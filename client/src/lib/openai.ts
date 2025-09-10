// Client-side OpenAI integration (for future use if needed)
export const chatWithAI = async (message: string, history: any[] = []) => {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
};

export const analyzeImageWithAI = async (base64Image: string): Promise<string> => {
  try {
    const response = await fetch('/api/ai/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error('Image analysis error:', error);
    throw error;
  }
};
