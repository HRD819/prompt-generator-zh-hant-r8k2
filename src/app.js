import { buildLocalPrompt, makeGeminiRequest, extractGeminiText } from './prompt.js';

const $ = id => document.getElementById(id);
const model = 'gemini-3.8-flash';
const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
let busy = false;

function message(text, type = '') {
  $('message').textContent = text;
  $('message').className = `message ${type}`;
}
function setBusy(value) {
  busy = value;
  $('generate-button').disabled = value;
  $('prompt-input').disabled = value;
  $('api-key').disabled = value;
  $('spinner').hidden = !value;
  $('generate-text').textContent = value ? '生成中…' : '生成 Prompt';
}
function showOutput(text) {
  $('output').textContent = text;
  $('copy-button').hidden = !text;
  $('output-title').focus();
}
async function requestGemini(idea, key) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(makeGeminiRequest(idea)),
      signal: controller.signal,
      cache: 'no-store'
    });
    if (!response.ok) {
      if (response.status === 429) throw new Error('已達 API 使用額度，請稍後再試。');
      if (response.status === 503) throw new Error('Gemini 服務暫時忙碌，請稍後再試。');
      if ([400, 401, 403].includes(response.status)) throw new Error('請檢查 API 金鑰或模型使用權限。');
      throw new Error(`生成失敗（HTTP ${response.status}），請稍後再試。`);
    }
    const result = await response.json();
    const text = extractGeminiText(result);
    if (!text) throw new Error('Gemini 沒有回傳文字，請換個想法再試。');
    return text;
  } finally { clearTimeout(timer); }
}

$('generate-button').addEventListener('click', async () => {
  if (busy) return;
  const idea = $('prompt-input').value.trim();
  if (!idea) { message('請先輸入你的想法。', 'error'); $('prompt-input').focus(); return; }
  const key = $('api-key').value.trim();
  message('');
  setBusy(true);
  try {
    if (!key) {
      showOutput(buildLocalPrompt(idea));
      message('本機範本已生成。若想使用 Gemini 改寫，可展開進階選項並填入自己的金鑰。', 'success');
    } else {
      showOutput(await requestGemini(idea, key));
      message('Gemini Prompt 已生成。', 'success');
    }
  } catch (error) {
    const text = error?.name === 'AbortError' ? '連線逾時，請稍後再試。' : error.message;
    message(text, 'error');
  } finally { setBusy(false); }
});
$('clear-button').addEventListener('click', () => {
  if (busy) return;
  $('prompt-input').value = '';
  $('api-key').value = '';
  $('output').textContent = '生成後會顯示在這裡。';
  $('copy-button').hidden = true;
  message('');
  $('prompt-input').focus();
});
$('copy-button').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('output').textContent); message('已複製 Prompt。', 'success'); }
  catch { message('複製失敗，請手動選取內容。', 'error'); }
});
$('prompt-input').addEventListener('keydown', event => {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault(); $('generate-button').click();
  }
});
