# Prompt 生成器

由原 Google Sites HTML 整理的獨立靜態網站。無金鑰時於瀏覽器本機產生結構化 Prompt；使用者自填 Gemini API 金鑰時，可把想法送往 Google Gemini 生成更個人化的範本。

正式網址：https://hrd819.github.io/prompt-generator-zh-hant-r8k2/

## 搜尋引擎與存取範圍

頁面原始 HTML 的 `<head>` 含 `robots` 與 `googlebot` 的 `noindex, nofollow, noarchive`，且沒有建立 sitemap。這是要求支援該規則的搜尋引擎不要收錄；網站與 GitHub 原始碼仍公開，不提供登入保護或絕對隱私保證。沒有放置阻擋爬取的 `robots.txt`，因為 Google 需要讀到 `noindex` 才能遵守它；此 GitHub Pages 專案沒有整個網域根目錄的控制權。

## 金鑰與資料

原始附件含前端硬編碼的 Google AI API 金鑰，**未納入此儲存庫及網站產物**。請原金鑰持有人到 Google AI Studio／Cloud Console 撤銷或輪替舊金鑰。網站不預設金鑰，也不寫入 localStorage、sessionStorage 或 Cookie。使用者按下生成且自行填入金鑰時，瀏覽器才把金鑰放在 `x-goog-api-key` 請求標頭，把想法送到 Google。此金鑰對該使用者自己的瀏覽器與網路工具可見；多人共用金鑰需要另外架設後端代理。

本機範本模式不發送資料到 Google。頁面不載入第三方腳本、字型或分析服務。

## 維護

- `src/`：網頁與功能原始碼。
- `tests/`：本機 Prompt 與 Gemini 回應處理檢查。
- `npm run ci`：測試與建置；部署檔案在 `dist/`，不要手改產物。
- 推送 main 後自動執行檢查。發布時手動執行 GitHub Actions 的 **Check and publish prompt generator**。

Gemini 使用 Google 官方記載的 `generateContent` API 與模型名稱。API 權限、模型供應與用量仍取決於使用者自己的 Google 帳戶；未以真實金鑰執行對外請求。
