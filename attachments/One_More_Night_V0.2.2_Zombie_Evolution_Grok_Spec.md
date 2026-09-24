# One More Night

# V0.2.1 — The World Gets Worse

## Zombie Population / Evolution / Location Infection

### Grok Implementation Specification — Low Budget Edition

> 本文件給 Grok 執行。共3個方向更新( 1. 僵屍系統和種類, 2. 僵屍集結夜襲改良 3. 修BUG)
>
> \\\*\\\*核心原則：V0.2.1 不做即時戰鬥，不做 3D，不做大型新系統。\\\*\\\*
>
> 本版本唯一的大方向：
>
> \\\*\\\*讓玩家感覺世界會隨著生存日數變得越來越危險，而且殭屍不是永遠同一種。\\\*\\\*
>
> 所有新功能都必須建立在目前 V0.2.1 已有的 Day / Location / Threat / Alert / Combat / Loot / Weapon Condition 系統上。
>
> \\\*\\\*不要重寫現有系統。優先 reuse。\\\*\\\*

\---

# 1\. V0.2.2 的目標

目前遊戲已經有：

* Day / 生存天數
* Location
* Zombie
* Threat
* Noise
* Alert
* Combat
* Weapon Condition
* Loot
* AP
* Survivor
* Skill
* Trait
* Dispatch

現在需要增加一個「世界逐漸惡化」的層次。

玩家應該逐漸感受到：

```text
Day 1
↓
普通殭屍
↓
Day 5
↓
殭屍數量增加
↓
Day 10
↓
開始出現特殊型
↓
Day 15+
↓
開始出現異變型
↓
Day 20+
↓
高感染區變成高危區域
```

\---

\---

# 2. 核心設計

V0.2.1 新增三個概念：

```text
1. Zombie Population
2. Zombie Evolution
3. Location Infection
```

三者與現有系統連接：

```text
Day
 ↓
Zombie Population
 ↓
Location Infection
 ↓
Zombie Composition
 ↓
Threat / Alert
 ↓
Combat
```

\---

# 4\. Zombie Population

建立一個世界層級的：

```js
zombiePressure
```

代表隨著時間增加的整體殭屍壓力。

第一版不需要非常複雜。

例如：

```text
Day 1–3
Pressure = 1

Day 4–7
Pressure = 2

Day 8–14
Pressure = 3

Day 15–21
Pressure = 4

Day 22+
Pressure = 5
```

實際數值可以根據現有平衡調整。

\---

# 5\. Zombie 數量不要簡單地每天 +1

不要：

```text
Day 1 = 5
Day 2 = 6
Day 3 = 7
...
```

應該使用：

```text
Base Zombie Population
+
Zombie Pressure
+
Location Infection
+
Threat Modifier
```

概念：

```js
zombieCount =
    basePopulation
    + pressureModifier
    + infectionModifier
    + threatModifier
```

實際公式可根據目前 code 最小修改。

\---

# 6\. 不要讓所有地點每天自動刷新

這一點非常重要。

如果玩家清掉：

```text
House
Zombie = 0
```

不能每天直接變：

```text
Zombie = 10
```

否則「清場」沒有意義。

應該讓殭屍重新出現受到：

* Day
* Location Infection
* Threat
* Noise
* 周邊區域壓力

影響。

\---

# 7\. Location Infection

每個重要 Location 可以有：

```js
infectionLevel
```

例如：

```text
Farm
Infection = 15

Suburb
Infection = 35

Downtown
Infection = 70
```

第一版可以只使用簡單數值：

```text
0–24   Low
25–49  Moderate
50–74  High
75–100 Critical
```

UI 可以顯示：

```text
Infection: HIGH
```

而不是一定顯示精確數字。

\---

# 8\. Infection 如何增加

每天可以根據世界時間增加。

例如：

```text
Base Daily Growth
+
Nearby Threat
+
Previous Noise
```

但第一版不要做複雜的地圖傳染模擬。

最簡單：

```text
infectionLevel += dailyGrowth
```

即可。

之後再擴充。

\---

# 9\. Location Infection 的用途

感染度應該影響：

### 1\. Zombie 數量

感染度越高：

```text
Zombie Count ↑
```

### 2\. 特殊 Zombie 出現率

感染度越高：

```text
Variant Chance ↑
```

### 3\. Threat

感染度高的地方：

```text
Base Threat ↑
```

### 4\. Loot Risk

暫時不要直接降低 Loot。

只增加：

> 玩家取得 Loot 的風險。

\---

# 10\. Zombie Types

第一版只做 4 種。

不要做 10–20 種。

\---

## 10.1 Walker

基本殭屍。

```js
{
    id: "walker",
    hp: 100,
    damage: normal,
    speed: slow,
    threatValue: 1,
    minDay: 1
}
```

用途：

> 基準敵人。

\---

# 11\. Runner

快速型。

```js
{
    id: "runner",
    hp: 70,
    damage: medium,
    speed: high,
    threatValue: 2,
    minDay: 4
}
```

目的：

> 讓玩家不能永遠依靠撤退。

Runner 不需要即時移動。

目前只需要在 Combat / Encounter Resolver 中產生不同結果。

\---

# 12\. Brute

厚皮型。

```js
{
    id: "brute",
    hp: 180,
    damage: high,
    speed: verySlow,
    threatValue: 3,
    minDay: 8
}
```

重點：

> Brute 的價值不是單純「血很多」。

它應該消耗：

* Weapon Condition
* AP
* Survivor HP
* Healing resources

讓玩家思考：

> 「這場戰鬥值得打嗎？」

\---

# 13\. Screamer

特殊功能型。

```js
{
    id: "screamer",
    hp: 80,
    damage: low,
    speed: medium,
    threatValue: 3,
    minDay: 10
}
```

核心能力：

```text
Screamer Event
↓
Noise +
Alert +
Threat +
Possible Zombie Reinforcement
```

例如：

```text
Noise +8
Alert +2
Threat +2
```

實際數值依現有平衡調整。

Screamer 不需要即時尖叫動畫。

文字描述即可：

> The Screamer lets out a horrifying cry.

\---

# 14\. Mutant

異變型。

**Day 15 以前不要出現。**

例如：

```js
{
    id: "mutant",
    hp: 220,
    damage: high,
    speed: medium,
    threatValue: 5,
    minDay: 15,
    mutation: true
}
```

第一版不要做太多特殊能力。

先確認：

```text
Mutant
=
rare
+
dangerous
+
late game
```

而不是普通 Zombie 的換皮。

\---

# 15\. Mutant Spawn Chance

不要固定：

```text
Day 15 = 10%
```

可以使用：

```text
Base Mutation Chance
+
Day Modifier
+
Infection Modifier
+
Threat Modifier
```

例如概念：

```text
Day 15:
5%

Day 20:
10%

Day 30:
20%
```

以上只是起始建議。

實際平衡由遊戲測試決定。

\---

# 16\. Zombie Composition

每次產生 Zombie Encounter 時，不要全部隨機。

使用：

```text
Day
+
Location Infection
+
Threat
```

決定 composition。

例如：

### Day 1

```text
90% Walker
10% Walker
```

實際上等同於幾乎全普通。

\---

### Day 5

```text
80% Walker
20% Runner
```

\---

### Day 10

```text
65% Walker
20% Runner
10% Brute
5% Screamer
```

\---

### Day 15+

開始允許：

```text
Walker
Runner
Brute
Screamer
Mutant
```

注意：

> 不要照表硬編死。

最好建立 data-driven spawn weight。

\---

# 17\. Data-Driven Zombie System

非常重要。

不要把：

```text
if day > 10
```

散落在很多 Combat function。

建立集中資料：

```js
ZombieType {
    id,
    hp,
    damage,
    speed,
    threatValue,
    minDay,
    spawnWeight,
    mutation,
    specialAbility
}
```

再由一個 resolver 決定：

```js
getAvailableZombieTypes(day, infectionLevel)
```

和：

```js
rollZombieComposition(location, day, threat)
```

\---

# 18\. 不要把 Speed 當成即時移動

目前沒有 Real-Time Combat。

因此：

```text
speed
```

只代表：

* Encounter difficulty
* Retreat difficulty
* Sneak difficulty
* Combat outcome modifier

不要因此建立：

* movement AI
* pathfinding
* frame update

\---

# 19\. Zombie Type 對現有 Combat 的影響

必須 reuse 現有 Combat Resolver。

例如：

```text
Fight Walker
```

和：

```text
Fight Brute
```

只是使用不同：

```text
HP
Damage
Threat
Special
```

不要建立：

```text
CombatSystemV2
```

\---

# 20\. Screamer 的特殊後果

Screamer 是 V0.2.1 最重要的特殊型。

如果玩家殺死 Screamer：

可以：

```text
Noise +3
```

如果 Screamer 成功行動：

```text
Noise +8
Alert +2
Threat +2
```

然後可能：

```text
Additional Zombie Encounter
```

這會讓：

```text
Zombie Type
↓
Noise
↓
Threat
↓
Alert
```

真正形成系統鏈。

\---

# 21\. Mutant 的第一版特殊能力

第一版可以不做特殊技能。

只做：

```text
High HP
High Damage
High Threat
Rare Spawn
Late Game
```

這樣先測試：

> 玩家看到 Mutant 是否會改變決策？

如果有效，再在 V0.2.2 增加：

* Acid
* Armor
* Regeneration
* Explosive Death
* Spitter
* Crawler

不要現在全部做。

\---

# 22\. 地點與 Zombie Type

V0.2.1 可以先加入簡單偏好。

例如：

```text
Residential
→ Walker
→ Runner

Industrial
→ Brute

Hospital
→ Screamer

High Infection
→ Mutant
```

但第一版不要做複雜生態模擬。

只需要：

```js
locationZombieBias
```

例如：

```js
{
    residential: {
        runner: 1.2
    },
    industrial: {
        brute: 1.5
    },
    hospital: {
        screamer: 1.5
    }
}
```

\---

# 23\. 清場系統

如果目前 Location 有：

```text
cleared
```

必須保留。

清場條件：

```text
Zombie Population <= threshold
```

或者使用目前遊戲已有的 cleared 判定。

清場後：

```text
Threat ↓
Risk ↓
```

但不要永遠永久安全。

後期可能因：

```text
Day
+
Infection
+
Nearby Pressure
```

重新出現少量 Zombie。

\---

# 24\. 「世界變壞」應該是漸進的

玩家不應該 Day 15 一睡醒：

> 全世界全部變異。

應該是：

```text
Day 1
普通

Day 5
開始看到 Runner

Day 8
開始看到 Brute

Day 10
偶爾看到 Screamer

Day 15
第一次遇到 Mutant

Day 20+
Mutant 開始比較常見
```

這會形成 progression。

\---

# 25\. 玩家資訊

不要隱藏所有東西。

玩家應該知道世界正在惡化。

例如 Shelter：

```text
WORLD STATUS

Day: 16

Zombie Pressure: HIGH

Known Infected Areas:
Downtown — CRITICAL
Hospital — HIGH
Suburb — MODERATE
Farm — LOW

Mutation:
DETECTED
```

這會讓玩家產生：

> 「我還有多少時間？」

的感覺。

\---

# 26\. 不要製造無法預測的隨機死亡

即使有 Mutant，也必須給玩家一些訊息。

例如：

```text
Warning:
Unusual movement reported in this area.

Threat:
VERY HIGH

Mutation:
Possible
```

玩家知道：

> 這裡危險。

而不是：

> 隨機抽到 Mutant → 直接死。

\---

# 27\. V0.2.1 的執行階段

因為 Grok 額度有限，嚴格分 Phase。

\---

## PHASE 1 — Zombie Data Structure

只做：

* ZombieType
* Walker
* Runner
* Brute
* Screamer
* Mutant
* minDay
* spawnWeight
* specialAbility

**不要改 UI。**

完成後測試。

\---

## PHASE 2 — Day Based Spawn

加入：

```text
Day
↓
Available Zombie Types
↓
Spawn Weight
```

完成後測試：

```text
Day 1
Day 5
Day 10
Day 15
Day 20
```

確認 composition 不合理時停止調整。

\---

## PHASE 3 — Location Infection

加入：

```text
infectionLevel
```

只影響：

* Zombie count
* Variant chance
* Threat

不要增加其他用途。

\---

## PHASE 4 — Zombie Type Consequences

加入：

* Runner modifier
* Brute modifier
* Screamer event
* Mutant high-risk encounter

全部 reuse 現有 Combat。

\---

## PHASE 5 — UI

最後才做：

```text
Zombie Pressure
Infection
Mutation
```

不要先花時間做 UI。

\---

# 28\. Acceptance Tests

## TEST A — Day Progression

```text
Day 1
```

PASS：

幾乎只有 Walker。

\---

```text
Day 5
```

PASS：

開始可能遇到 Runner。

\---

```text
Day 10
```

PASS：

開始可能遇到 Brute / Screamer。

\---

```text
Day 15+
```

PASS：

Mutant 可以出現。

\---

# 29\. TEST B — Infection

```text
Location A
Infection = Low

Location B
Infection = High
```

PASS：

B 的 Zombie 壓力較高。

\---

# 30\. TEST C — Cleared Location

```text
Kill / clear zombies
↓
Location cleared
↓
leave
↓
return
```

PASS：

不會立即恢復成完整 Zombie Population。

\---

# 31\. TEST D — Screamer

```text
Encounter Screamer
↓
Screamer triggers
```

PASS：

至少造成：

```text
Noise
Alert
Threat
```

之一或多項。

\---

# 32\. TEST E — Mutant

```text
Day < 15
```

PASS：

Mutant 不出現。

```text
Day >= 15
```

PASS：

Mutant 有低機率出現。

\---

# 33\. TEST F — Existing Combat

所有 Zombie Type：

```text
Fight
```

PASS：

仍使用現有 Combat Resolver。

不得建立第二套 Combat。

\---

# 34\. TEST G — Save / Load

保存：

* Day
* Infection
* Zombie Population
* Location cleared
* Threat
* Alert

重新 Load：

PASS：

所有狀態一致。

\---

# 35\. 額度控制規則

Grok 每次執行只做一個 Phase。

不要：

```text
Phase 1 + Phase 2 + Phase 3 + UI
```

一次完成。

應該：

```text
Phase 1
↓
Test
↓
Stop

Phase 2
↓
Test
↓
Stop
```

如果修改超過預期檔案數：

> 停止並回報。

如果需要重寫核心 Combat：

> 停止並回報。

\---

# 36\. 不要過度平衡

V0.2.1 的第一目標不是：

> Perfect Balance

而是：

> \\\*\\\*確認「世界隨時間惡化」是否真的讓遊戲更有壓力。\\\*\\\*

先觀察：

* 玩家是否害怕晚期地點
* 玩家是否開始提前準備
* 玩家是否保存好武器
* 玩家是否避開高感染區
* 玩家是否因 Mutant 改變路線
* 玩家是否覺得 Day 1 和 Day 20 是不同世界

\---

# 37\. 之後可以做的異變型

**不要現在做。**

V0.2.2+ 可以考慮：

```text
Spitter
Crawler
Acid
Armored
Regenerator
Exploder
Howler
Tank
```

但每一種都必須回答：

> 「這個 Zombie Type 是否會改變玩家決策？」

如果答案只是：

> HP 更高

就不要做。

\---

# 38\. 最終設計原則

不要追求：

```text
More Zombies
More HP
More Damage
```

應該追求：

```text
Different Zombies
↓
Different Decisions
```

例如：

```text
Walker
→ 可以正常處理

Runner
→ 不容易撤退

Brute
→ 消耗武器

Screamer
→ 製造更多威脅

Mutant
→ 改變玩家對地點的判斷
```

\---

# 39\. V0.2.1 成功標準

V0.2.1 成功，不是因為增加了五種 Zombie。

而是玩家開始感覺：

> \\\*\\\*「時間越久，世界真的越危險。」\\\*\\\*

以及：

> \\\*\\\*「我不能只用同一種方法處理所有殭屍。」\\\*\\\*

最後：

> \\\*\\\*「我需要提前規劃，因為異變正在發生。」\\\*\\\*

如果這三種感覺出現：

**V0.2.1 成功。**

\---

# 40\. 給 Grok 的最終執行指令

請：

1. 先閱讀目前 V0.2.1 code。
2. 找到現有 Zombie / Combat / Location / Day / Threat / Alert 系統。
3. 不要重寫。
4. 先完成 PHASE 1。
5. 測試通過後再做 PHASE 2。
6. 每次只執行一個 Phase。
7. 優先 data-driven。
8. 優先 reuse。
9. 不要新增無關內容。
10. 如果遇到架構問題，先回報，不要自行擴張 Scope。

每次完成後回報：

```text
PHASE:
Changed:
Files:
Implemented:
Tests:
Passed:
Known Issues:
Next Phase:
```

\---

# END

## 一句話版本

> \\\*\\\*V0.2.1 不做即時戰鬥；讓世界隨 Day 變壞，殭屍數量增加、種類進化、地點感染度提高，Day 15+ 開始出現稀有異變型，並且全部接入目前已有的 Threat / Alert / Combat / Location 系統。\\\*\\\*



第二修正: 

# One More Night — 日子、集結、變異種

&#x20;
油桶、裝備加值的修法另寫；這份只回答：日子越久僵屍越多、並出現變異。  
日期：2026-09-24

\---

## 0\. 先定一句

清過的針腳不要再長滿。長的是**還沒清的地方**，以及夜裡上門的那一波。否則三十晚之後地圖全是謊，芝加哥變成刷場。

現有已有 `nightPressure`（天數拉夜襲）和地點上的僵屍數。這一包只加兩件事：

1. 未清地點會緩慢集結（有上限）
2. 第 N 晚起，夜襲與大戰有機率抽到一種變異修飾

不新開像素戰鬥，不新開十二種怪。

\---

## 1\. 集結（白天地圖上的數）

每晚，對每個**已發現、未佔領、還有僵屍**的地點：

```
若 當地僵屍 < 該點原始上限 × 1.5
且 該點不是現居地的鄰居
則 小機率 +1
```

|模式|開始集結|每晚抽中|上限|
|-|-|-|-|
|休閒|第 16 晚|8%|原表 ×1.2|
|正常|第 10 晚|12%|原表 ×1.5|
|滅絕|第 6 晚|18%|原表 ×2.0|

鄰居不長。圈內走路免油的意義還在；長的是你還沒去的鎮。  
已清（0）的點：正常／休閒不再長。滅絕第 20 晚起，已清非鄰居有 5% 長回 1——「清過也會回來」，只在滅絕。

佔領的家：不長。夜襲走另一條。

日誌不要每晚報十二個鎮。只在玩家下次打開地圖時，針腳數字已經變了。第一次看到某點比記憶中多，寫一句「比上回聽到的吵」。

\---

## 2\. 夜襲仍走牆，不走路況表

夜襲人數可以隨日子加一口，不要變成野外遭遇。

現有公式已含 `nightPressure`。只改傷害骰上限：

|日|夜襲傷害骰|備註|
|-|-|-|
|1–7|現有 14–32|不動|
|8–15|16–36||
|16+|18–40|滅絕再 +4|

牆低仍是主因。變異種（下節）是修飾，不是多打一場。

\---

## 3\. 變異種：四個修飾，不是種族圖鑑

文字戰已有近戰／槍／包抄。變異是**今晚或多一隻身上的詞**，改同一場的骰，不改操作。

開出時間：

|模式|第一次可能出現|戰場抽中|夜襲抽中|
|-|-|-|-|
|休閒|第 20 晚|8%|4%|
|正常|第 12 晚|12%|6%|
|滅絕|第 8 晚|18%|10%|

同一場最多一詞。芝加哥終局可以強制一詞，讓最後一場有記憶。

四詞：

|id|中文|玩家看見|規則|
|-|-|-|-|
|`sprinter`|撲上來的|「這一隻先到了。」|包抄門檻提高（潛行要更高才開）；近戰失敗傷害 +一檔|
|`thick`|皮厚的|「棍打在肉上不像打在人上。」|近戰擊殺 −1（最少 1）；槍不受影響|
|`screamer`|會叫的|「它叫完，巷子裡又有腳步。」|這場結束後該點 +1～2 隻（不超過集結上限）|
|`night`|夜裡才密|「燈一滅，它們比較齊。」|只出現在夜襲；牆減免少一檔；白天地圖數不因此加|

不做：噴吐、爆炸、控制、會開門的智商怪。那是另一款遊戲。

資料庫四行，見過才展開。沒見過的詞不寫在標題上嚇人。

\---

## 4\. 和油的關係

集結讓遠門變貴的是**時間**，不是油價。油桶仍給，遠門仍收全價。日子越久，你還沒去的鎮更擠，不是油突然不夠。

滅絕若再「榨一晚歇一晚」，神速通關會被兩頭夾：桶慢、遠處更密。不要再用減鄰居免油來罰。

\---

## 5\. 不該加的

* 全圖每日刷新
* 變異圖鑑十二種
* 變異掉專屬器官當材料（那是工場線）
* 讓已佔領的客廳長僵屍
* 用變異取代牆和警戒的意義

\---

## 6\. 實作順序

1. 未清非鄰居的每晚 +0/1（有上限）
2. 夜襲傷害隨日檔
3. 四詞修飾掛進現有 `fight` / 夜襲
4. 資料庫「見過的詞」
5. 滅絕：已清回流 5%、桶隔夜

測的標準：第 7 晚地圖看起來還像 v0.2.1；第 16 晚沒去過的鎮明顯更吵；芝加哥仍是終點，不是刷變異的場。



BUG 修正:



這兩條裡，一條是真 bug，一條是裝備不該加「等級」。

榨油。 二級應該是 2 食物換 1 油。還在吃 3，不是設計，是等級沒讀進匯率，或按鈕仍寫一級的數。滅絕二級才該是 3。先對過夜日誌：若寫「食物 3」，就是程式還用 3，不是玩家看錯。

裝備加技能。 玩家測的對：手套寫建造 +2，修牆還是 8／修裝 6，包抄也不因潛行裝提早開。多半是修牆、打造、包抄讀的是人身上的技能等級，沒走裝備加值。就算接上去，也不該用裝備去跨門檻——戰鬥／建造每級差太大，手套一戴就等於練了兩級，滅絕會更軟。

比較妥當的改法：裝備不再加技能等級。改成這件衣服做的那一件事。

現在寫的改成建造 +2修牆多 +2，或打造多修一件耐久潛行 +1大聲搜索噪音少一點；不提早開包抄醫療 +1看護多回一點血；不讓識別視同醫療 4戰鬥 +1近戰骰 +1；不升戰鬥等級



包抄、當場認藥、一晚兩件，只看練出來的等級。手套是省力，不是畢業。

滅絕過快。 不是裝備，是鄰居免油 + 每晚一桶。圈內走路不花錢，桶把剩飯變成路費，遠門只剩芝加哥那一格。滅絕建議加一條就夠：油桶隔夜才能再榨（稿子裡有、遊戲若沒生效要補上），或滅絕二級仍吃 3、每晚最多半桶。鄰居免油不要撤——那是搬家的意義。撤的是「每天穩產一桶還能走遍本州」。

下一包若是修這兩條，就是：榨油讀等級、裝備改寫成具體事、滅絕油桶降速。這次對話沒有遊戲原始碼，改不了正在跑的那包。

現在的問題不是有沒有油，是油和走路疊在一起。鄰居免油以後，桶產的油全部拿去開遠門；遠門一開，地圖自己打開，滅絕也會被走穿。不給桶，人就卡在農舍圈裡——那是 v0.2 被罵的那句。

油要的是過路費，不是產量。

該留的：



鄰居走路免油。搬家才有意義。

家裡能做油。否則遠城永遠是牆上的字。

搜刮仍能撿到油。桶不是唯一來源。



該收的：



每晚最多一桶已經對。滅絕改成榨一晚、歇一晚。正常維持每晚一桶，但二級必須真的吃 2 份，別再偷吃 3。

桶吃的是晚飯之後還剩的飯。先餵飽再榨。飯緊的家不該又能出遠門。

芝加哥、蓋瑞仍收全價。圈內免費、圈外貴。不要因為有桶就減遠門。

休閒可以鬆；滅絕不要再加掉落油。



最後正式修改結果需要在0.2.2日誌裡清楚說明

