# 再活一晚 One More Night — 遊戲資料庫

版本 **v0.1**。這份 repo 是設計藍圖，方便在 GitHub 直接看、回玩家、之後改數。

**現在不是後台。** 改這裡不會立刻改 itch 上正在玩的遊戲。遊戲現在把數字寫死在程式裡。日後要「後台操控」，會讓遊戲去讀這個 JSON（或另外做管理頁），那才是即時改數。

## 現版本規模

| 項目 | 數量 |
|---|---|
| 起始庇護所 | 3 |
| 地圖地點 | 17 |
| 職業 | 8 |
| 特質 | 56 |
| 設施 | 8 |
| 工作 | 8 |
| 武器（含徒手） | 24 |
| 裝備總件 | 77 |
| 資源 | 6 |

## 檔案

- [data/bible.json](data/bible.json) — 完整機器可讀
- [data/weapons.md](data/weapons.md) — 武器與攻擊力
- [data/shelters.md](data/shelters.md) — 起始庇護所
- [data/locations.md](data/locations.md) — 地圖 17 點
- [data/occupations.md](data/occupations.md)
- [data/traits.md](data/traits.md)
- [data/facilities.md](data/facilities.md)
- [data/jobs.md](data/jobs.md)
- [data/rules.md](data/rules.md) — 戰鬥／夜襲公式

## 怎麼看

GitHub 開 markdown 就是表格。JSON 用瀏覽器或 [github.dev](https://github.dev) 搜 id。

改數請改 **id + 欄位**（例如 `katana` 的 `melee`），開 Issue 或直接改 JSON 再開 PR。

## 之後的後台（還沒做）

1. 遊戲啟動時 `fetch` 這份 `bible.json`（GitHub raw 或自己的網址）
2. 武器攻擊、設施花費、夜襲機率改 JSON 就生效，不必重出 itch zip
3. 再上面做一個簡單管理頁（登入後改表、存回 GitHub 或資料庫）

v0.1 出征包仍然是靜態的，不受這份 repo 即時控制。
