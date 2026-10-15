export function buildLocalPrompt(idea) {
  const topic = idea.trim();
  if (!topic) throw new Error('請先輸入你的想法。');
  return `用途：將以下想法轉化為具體、可執行的成果。\n\n角色：你是一位熟悉此主題、能清楚表達的助理。\n\n任務：${topic}\n\n請先確認對象、使用情境與預期成果；資訊不足時，先提出最多 3 個關鍵問題。若資訊已足夠，直接完成任務。\n\n輸出要求：\n1. 緊扣我的想法，不自行添加未提供的事實。\n2. 使用清楚的繁體中文，依主題選擇合適的語氣與格式。\n3. 內容具體、條理分明，可直接使用；必要時列出可調整的選項。\n\n範例提示：請依上述要求，針對「${topic}」產出一份初稿，並說明哪些細節還需要我補充。`;
}

export function makeGeminiRequest(idea) {
  return {
    contents: [{ role: 'user', parts: [{ text: `請根據以下想法，寫一個可直接使用的繁體中文 Prompt 範本。請包含用途、角色、任務、限制、輸出格式，以及一個具體範例提示。內容簡潔實用，不要憑空補造事實。\n\n想法：${idea.trim()}` }] }],
    generationConfig: { temperature: 0.6 }
  };
}

export function extractGeminiText(result) {
  return result?.candidates?.[0]?.content?.parts?.map(part => part.text ?? '').filter(Boolean).join('\n').trim() ?? '';
}
