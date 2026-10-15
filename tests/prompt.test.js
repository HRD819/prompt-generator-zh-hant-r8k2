import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLocalPrompt, makeGeminiRequest, extractGeminiText } from '../src/prompt.js';

test('本機範本保留原始想法並提供可執行的輸出要求', () => {
  const output = buildLocalPrompt('  寫一篇真誠的生日祝福  ');
  assert.match(output, /任務：寫一篇真誠的生日祝福/);
  assert.match(output, /輸出要求/);
  assert.match(output, /範例提示/);
  assert.throws(() => buildLocalPrompt('   '));
});
test('Gemini 請求不含金鑰，並能安全讀取文字', () => {
  const body = makeGeminiRequest('整理研討會摘要');
  assert.match(body.contents[0].parts[0].text, /整理研討會摘要/);
  assert.doesNotMatch(JSON.stringify(body), /api.key/i);
  assert.equal(extractGeminiText({ candidates: [{ content: { parts: [{ text: '第一段' }, { text: '第二段' }] } }] }), '第一段\n第二段');
  assert.equal(extractGeminiText({ candidates: [] }), '');
});
