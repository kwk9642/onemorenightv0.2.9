# One More Night v0.1 → v0.5 全盤系統改造規格（給 Grok）

## 0. 任務目標

這份規格是根據 One More Night v0.1 實際遊戲 JavaScript / data 進行設計，不是根據 itch.io 頁面。

**目標不是增加更多內容。**

目標是把現有：

- Trait
- Occupation
- Skill
- Equipment
- Survivor
- Relationship
- Morale
- Food / Water
- Facility
- Mission
- Combat
- Map
- Location
- Loot

真正連成一個互相影響的 systemic survival game。

核心原則：

> **不要再增加大量孤立系統。**
>
> **讓現有系統互相產生後果。**

玩家每一局應該持續遇到：

1. 有限時間
2. 資源不足
3. 不完整資訊
4. Opportunity Cost
5. 不確定性
6. 人際衝突
7. 永久後果
8. 不同 Build 導致不同玩法

---

# 1. V0.1 現況中的核心問題

## P0 — Critical

### P0.1 沒有真正的時間成本

目前 Mission / Search / Combat 不會真正消耗一天。

Day 主要在 Sleep 時增加。

因此玩家可以：

```text
Mission
→ Search
→ Fight
→ Search
→ Next
→ Extract
→ 再 Mission
→ 再 Mission
→ Sleep
```

造成：

> 玩家不是在決定「今天做什麼」，而是在「今天把所有事情做完」。

這會破壞 survival game 最重要的 opportunity cost。

---

### P0.2 Location Loot 可以無限農

目前 location 有：

```text
zombies
loot
cleared
```

但是 `cleared` 主要只代表殭屍被清掉。

Loot 是重新從 location loot table 生成。

因此：

```text
清掉地點
↓
離開
↓
回來
↓
重新取得 loot
```

導致 location 成為永久資源農場。

必須改成 persistent finite loot。

---

### P0.3 系統大量互相隔離

目前大致是：

```text
Trait → modifier

Relationship → mission bonus

Facility → passive modifier

Job → resource production

Morale → permission gate

Equipment → combat/scavenge number
```

這些系統很多，但彼此沒有形成足夠多的交叉反應。

目標：

```text
Trait
 ↓
NPC behavior
 ↓
Relationship
 ↓
Morale
 ↓
Job performance
 ↓
Resource
 ↓
Mission decision
 ↓
Permanent consequence
```

---

### P0.4 Relationship 太容易正向成長

Mission 後 Bond 增加。

Friend / Lover 主要提供 combat / stealth / scavenge bonus。

結果玩家很容易：

> 同一隊人一直出門 → 關係越來越好 → 永久使用同一隊。

Relationship 不是社會系統，而是另一種 stat buff。

必須加入：

- dislike
- resentment
- conflict
- requests
- refusal
- betrayal
- loyalty
- grief
- jealousy

---

### P0.5 很多 Trait 只是 modifier

現有大量 Trait 最終只是：

```text
+1 combat
+1 stealth
+1 scavenge
+10 HP
-4 morale
```

這不是錯，但不足以形成 PZ 式的 emergent behavior。

Trait 必須開始產生：

> **行為。**

---

# 2. 新核心 Loop

把：

```text
Manage
→ Mission
→ Farm
→ Sleep
```

改成：

```text
Morning
↓
查看資源 / 人員 / 威脅
↓
Assign Jobs
↓
獲得 6 AP
↓
有限行動
↓
承擔風險
↓
帶著結果回家
↓
Night Simulation
↓
永久狀態變化
↓
Next Day
```

核心問題：

> **「我今天只能做幾件事情，我犧牲什麼？」**

---

# 3. Daily Action Point System

新增：

```js
dayAP: 6
maxAP: 6
```

Sleep 後：

```js
dayAP = maxAP
```

Return from mission：

> 不重置 AP。

## AP Cost

| Action | AP |
|---|---:|
| Travel | 1 |
| Quiet Search | 1 |
| Loud Search | 1 |
| Fight | 1 |
| Next Zone | 1 |
| Major Encounter Decision | 1 |
| Extract | 0 |
| Assign Jobs | 0 |
| Equip | 0 |
| Unequip | 0 |
| Build Facility | 2 |
| Repair Wall | 1 |
| Craft / Repair Gear | 1 |
| Radio | 1 |
| Rest | 1 |

AP = 0：

- Mission 中只能 Extract
- Shelter 中只能 Sleep
- 不可再做 productive action

## UI

Shelter：

```text
DAY 7
ACTIONS 4 / 6
```

Mission：

```text
AP 3 / 6
NOISE 18
THREAT: ELEVATED
```

---

# 4. Mission Rework

Mission 必須消耗時間。

例如：

```text
Travel       1 AP
Search       1 AP
Search       1 AP
Fight        1 AP
Next Zone    1 AP
Extract      0 AP
```

玩家因此必須選：

> 多搜一間？還是撤退？

而不是：

> 反正可以一直搜。

---

# 5. Noise / Threat

新增：

```js
location.threat
location.noiseToday
location.alertLevel
```

Noise：

| Noise | State |
|---:|---|
| 0–9 | Quiet |
| 10–19 | Elevated |
| 20–34 | Danger |
| 35–49 | Horde Risk |
| 50+ | Severe |

Quiet Search：

```text
loot × 0.75
noise +1
```

Loud Search：

```text
loot × 1.25
noise +5
alert +1
```

Noise 不應立即無限刷怪。

而是逐步提高：

- encounter chance
- ambush chance
- detection
- escape difficulty
- hostile survivor chance

---

# 6. Location Loot 必須有限

每個 Location 新增：

```js
lootRemaining: {
    food,
    water,
    materials,
    medicine,
    ammo,
    fuel
}
```

Game Start 時從原本 loot range 生成。

例如：

```text
Riverside Mart

Food: 18 / 24
Water: 11 / 14
Medicine: 2 / 5
```

Search 時永久扣除。

離開再回來：

> 不重新生成。

Location 清空後：

```text
cleared = true
```

不代表完全沒有危險。

可以保留：

```text
5–10% daily wandering threat
```

但不能恢復原本完整 zombie population。

---

# 7. Location Clearing 的真正價值

清空地點後：

- future risk ↓
- travel risk ↓
- survivor encounter 改變
- occupation unlocked
- location 成為 strategic asset

但是：

> Cleared ≠ infinite safe loot.

---

# 8. Information System

玩家不能永遠看到完整資訊。

新增：

```js
intel
```

Intel 來源：

- Radio
- Survivor
- Previous visits
- Stealth
- Keen Hearing
- Scout event

Intel 可以揭露：

```text
approximate zombies
likely loot
survivor presence
threat
possible trap
```

不要永遠顯示精確值。

例如：

### 無 Intel

> Something is moving inside.

### 部分 Intel

> At least 8 infected.

### 高 Intel

> Around 10 infected. Gunfire heard near the rear entrance.

目標：

> 玩家必須在不完整資訊下決策。

---

# 9. Survivor System

保留目前：

```text
occupation
positive trait
negative trait
skills
weapon
mood
stance
morale
bond
```

增加：

```js
stress
loyalty
needs
recentEvents[]
conflicts[]
favoritePeople[]
dislikedPeople[]
personalGoal
lastContribution
```

不要把全部 hidden information 顯示給玩家。

---

# 10. Trait Rework

**不要刪掉現有 Traits。**

也不要只是再加 stat。

至少讓以下 Traits 產生行為：

| Trait | 新行為 |
|---|---|
| smoker | 需要 cigarettes；缺煙會 stress；可能要求/偷煙 |
| selfish | 可能私藏 loot；被發現會降低關係 |
| depressed | 工作效率下降；可能拒絕高風險行動 |
| pacifist | 殺人產生強烈 stress；可能反對暴力 |
| coward | 高危任務可能拒絕或效率下降 |
| brave | 高威脅時 combat / morale 增強 |
| leader | 提高群體 morale，但可能產生權力衝突 |
| paranoid | 懷疑他人、產生 conflict |
| burglar-type | 有機率藏起部分 loot |
| hemophobic | 見血產生 stress |
| agoraphobic | 出門造成額外 stress |
| insomnia | fatigue recovery 差 |
| sleepyhead | 需要更多休息 |
| slowhealer | 傷口恢復慢 |
| proneillness | infection severity 高 |
| heartyappetite | food consumption 高 |
| lighteater | food consumption 低 |
| lucky | loot outcome slightly better |
| unlucky | loot outcome slightly worse |
| organized | carry / loss efficiency |
| clumsy | search/craft noise ↑ |
| quiet | noise ↓ |
| conspicuous | detection ↑ |
| inconspicuous | detection ↓ |
| adrenaline | wounded combat bonus |
| fastlearner | XP +25% |
| slowlearner | XP -25% |
| gardener | farm output ↑ |
| firstaid | medical ↑ |
| handy | build ↑ |
| vehicleknow | craft / repair ↑ |

核心：

> Trait 必須能被玩家「看到發生」。

---

# 11. Smoker 範例

不要只是：

```text
morale -4
```

改成：

```text
Smoker
↓
每天需要 cigarettes
↓
沒有 cigarettes
↓
stress ↑
↓
morale ↓
↓
可能要求隊友
↓
拒絕 → bond ↓
↓
嚴重時偷煙
↓
被抓 → conflict
```

---

# 12. Selfish 範例

```text
Selfish
↓
找到 consumable
↓
小機率私藏
↓
group loot 少
↓
其他 survivor 發現
↓
bond ↓
↓
可能要求驅逐
```

---

# 13. Depressed 範例

```text
Depressed
↓
低 work efficiency
↓
高 stress
↓
可能拒絕 dangerous task
↓
Friend / Lover 陪伴
↓
stress ↓
```

---

# 14. Relationship Rework

保留：

```text
25 = Known
50 = Friend
75 = Lover
```

增加：

```text
-25 = Dislike
-50 = Hostile
```

Bond 可以上下變化。

## Bond Changes

| Event | Bond |
|---|---:|
| Shared successful mission | +2~5 |
| Saved from death | +10 |
| Shared scarce resource | +4 |
| Refused request | -4 |
| Theft discovered | -12 |
| Blamed for ally death | -10 |
| Forced into dangerous mission | -8 |
| Protected from attack | +8 |
| Ignored personal crisis | -6 |

---

# 15. Relationship 不再只是 Combat Bonus

Friend / Lover 應影響：

- mission willingness
- morale
- grief
- personal requests
- conflict
- emergency help
- refusal
- loyalty

例如：

```text
Lover A
↓
Lover B is injured
↓
Player sends B on dangerous mission
↓
A objects
↓
Player can:
    listen
    ignore
    send someone else
```

這才是 Relationship。

---

# 16. Social Event System

每日：

```text
10–20%
```

機率出現 meaningful social event。

受以下因素影響：

```text
group size
stress
morale
relationships
traits
resource scarcity
recent deaths
```

事件例：

### Cigarettes

Smoker：

> I need a cigarette.

選：

```text
Give
Refuse
Search for cigarettes
```

### Food

Selfish survivor：

> “I saved this for myself.”

玩家：

```text
Let it go
Confiscate it
Punish them
```

### Lover

> “Don't send him there.”

玩家：

```text
Agree
Refuse
Send someone else
```

每個選擇都改變：

- resource
- morale
- bond
- loyalty
- future behavior

---

# 17. Morale Rework

保留 threshold，但不要只用作 permission gate。

| Morale | State | Effect |
|---:|---|---|
| 0–15 | Broken | crisis / refusal |
| 16–29 | Despair | work efficiency -25%, mission risk +20% |
| 30–45 | Anxious | normal, higher stress event |
| 46–65 | Steady | baseline |
| 66–81 | Stable | small work bonus |
| 82–100 | High | can support others |

Morale 必須產生行為。

---

# 18. Food / Water

不要把 shortage 直接做成：

```text
一天沒吃 = 快死
```

改成：

### Day 1 shortage

```text
morale -14
```

### Day 2 consecutive shortage

```text
HP loss
work efficiency ↓
```

### Day 3+

```text
serious injury/death risk
```

增加 emergency choices：

```text
ration
hunt
trade
steal
abandon survivor
```

---

# 19. Jobs

保留：

```text
rest
cook
farm
guard
repair
tend
radio
craft
```

不要增加 30 種工作。

強化現有工作。

## Rest

```text
HP +12
fatigue -35
morale +6
```

## Cook

```text
food efficiency ↑
morale +8
cook XP
```

## Farm

```text
food output
farm XP
```

## Guard

```text
raid chance ↓
```

但：

> Guard 的人不能同時 Farm / Cook / Repair。

## Repair

```text
wall +8 + build
```

## Tend

```text
HP recovery
infection treatment
medical XP
```

## Radio

```text
intel
location discovery
survivor discovery
```

## Craft

```text
consume materials
repair gear
limited crafting
build XP
```

---

# 20. Facilities

保留：

```text
beds
kitchen
water
workshop
infirmary
garden
radio
watch
```

但不要只做 passive modifier。

## Beds

```text
overcrowding → morale/stress penalty
```

## Kitchen

增加：

```text
ration
emergency food
special food
bad cook can waste food
Chef can unlock special choices
```

## Water

增加：

```text
storage cap
contamination / drought event
```

## Workshop

增加：

```text
wall repair
gear repair
limited crafting
```

## Infirmary

增加：

```text
triage
infection treatment
serious injury treatment
```

## Garden

增加：

```text
harvest cycle
seed consumption
gardener specialization
```

## Radio

增加：

```text
intel
survivor broadcast
location discovery
rare events
```

## Watch

增加：

```text
night warning
raid severity reduction
incoming threat detection
```

---

# 21. Equipment

不要再讓 Craft 自動替所有角色裝上更好的裝備。

玩家應該自己決定：

```text
repair weapon
repair armor
keep damaged rare gear
salvage
```

Condition：

| Condition | Effect |
|---:|---|
| 100–70 | normal |
| 69–40 | minor penalty |
| 39–15 | significant penalty |
| 14–1 | unreliable |
| 0 | unusable |

---

# 22. Equipment Build

現有武器全部保留。

分成四個 archetype：

### Quiet Melee

低 noise  
低資源消耗  
較低 damage

### Heavy Melee

高 damage  
高 fatigue  
高 noise

### Firearm

高 kill rate  
消耗 ammo  
高 noise

### Stealth

低 detection  
低 armor

### Armor

高 survival  
高 fatigue/noise

玩家應該選：

> 「我要安全？」

還是：

> 「我要安靜？」

還是：

> 「我要快速殺掉敵人？」

---

# 23. Combat

保留：

```text
melee
gun
flank
back
```

## Melee

```text
低 resource
中 noise
高 injury risk
```

## Gun

```text
ammo cost
high kill
high noise
```

## Flank

```text
requires stealth
low noise
failure can be severe
```

## Back

不能成為免費退出。

Repeated Back：

```text
AP cost
threat increase
```

---

# 24. Combat Information

不要永遠顯示精確成功率。

玩家看到：

```text
Favorable
Uncertain
Dangerous
```

而不是：

```text
73.4%
```

Debug mode 可以顯示真實公式。

---

# 25. Infection

保留目前：

```text
HP
armor
bite
infection
```

但建立：

```text
wound
↓
infection risk
↓
medical demand
↓
work loss
↓
resource competition
```

不要讓純 RNG 突然殺掉角色。

玩家應該能理解：

> 為什麼這個人死了。

---

# 26. Skills

保留：

```text
combat
stealth
scavenge
medical
build
farm
cook
```

Cap = 10。

但在：

```text
3
6
9
```

加入 qualitative unlock。

## Combat

3：

> injury risk reduction

6：

> advanced combat option

9：

> veteran combat action

## Stealth

3：

> noise reduction

6：

> flank

9：

> reconnaissance / escape information

## Scavenge

3：

> extra search chance

6：

> identify likely loot

9：

> hidden cache detection

## Medical

3：

> stabilize injury

6：

> reliable infection treatment

9：

> emergency major treatment

## Build

3：

> better repair

6：

> stronger barricade

9：

> advanced defense

## Farm

3：

> better yield

6：

> seed preservation

9：

> emergency harvest

## Cook

3：

> ration efficiency

6：

> morale food

9：

> preservation / special food

---

# 27. XP

目前 XP 是 exponential。

改為：

```text
0→1 = 30
1→2 = 45
2→3 = 65
3→4 = 90
4→5 = 120
5→6 = 155
6→7 = 200
7→8 = 255
8→9 = 320
9→10 = 400
```

Fast Learner：

```text
+25%
```

Slow Learner：

```text
-25%
```

不要讓一個安全行為快速刷到 10。

---

# 28. Specialization

角色不能最後變成：

```text
combat 10
stealth 10
medical 10
build 10
farm 10
cook 10
```

保留自由發展，但加入 soft specialization：

```text
前 2 個主要技能 → normal XP

第三 / 第四個技能 → slower XP
```

目標：

> “這個人是我的醫生。”

而不是：

> “這個人什麼都會。”

---

# 29. Occupations

保留目前 8 個：

```text
Firefighter
Doctor
Police Officer
Chef
Mechanic
Farmer
Veteran
Burglar
```

身份：

| Occupation | Core |
|---|---|
| Firefighter | combat / physical survival |
| Doctor | medical |
| Police | ammo / combat |
| Chef | food / morale |
| Mechanic | materials / fuel / repair |
| Farmer | long-term food |
| Veteran | elite combat / fear resistance |
| Burglar | stealth / scavenging |

不要讓 Traits 完全抹平 Occupation 差異。

---

# 30. Character Creation

保留 Positive / Negative point pool。

但 Trait card 必須顯示：

```text
Cost
Direct Effect
Behavioral Effect
Exclusions
```

例如：

```text
SMOKER +3

Direct:
No cigarette → morale loss

Behavior:
May request / steal cigarettes

Social:
Can create conflict
```

這讓玩家是在建立一個角色，而不是解數學題。

---

# 31. Starting Shelters

保留：

```text
Muldraugh Farmhouse
West Point Hardware
Louisville Walk-up
```

但必須確保三者不是單純「一個比較強」。

## Farmhouse

```text
低 danger
food potential 高
capacity 低
距離高價值 loot 遠
```

## Hardware

```text
materials 高
workshop
medium danger
food 弱
```

## Highrise

```text
capacity 高
water / radio
周邊 danger 高
early defense 弱
```

三者應該是 playstyle choice。

---

# 32. Moving / Occupying

保留目前 Occupy 系統與 Chicago win condition。

但 Move 必須消耗：

```text
fuel
1–2 AP
temporary morale stress
```

不能免費搬家。

---

# 33. Map

保留目前地圖。

Early：

```text
Muldraugh
West Point
Rosewood
Riverside
```

Mid：

```text
Louisville
March Ridge
```

Late：

```text
Fort Knox
Cincinnati
Indianapolis
Nashville
Memphis
St Louis
```

End：

```text
Chicago
```

不要只靠「殭屍數更多」區分地區。

讓每個地區有資源身份。

例如：

Fort Knox：

```text
ammo
military gear
extreme danger
```

Hospital：

```text
medicine
infection risk
high density
```

Mall：

```text
food
clothing
large zombie population
```

Indianapolis：

```text
fuel
```

---

# 34. Survivor Recruitment

保留：

```text
invite
trade
leave
threaten
help
fight
```

但每個選項都應有長期後果。

核心問題：

> “這個人值得我養嗎？”

而不是：

> “我還有沒有一張床？”

---

# 35. Personal Goals

每個 Survivor 生成一個 personal goal。

例如：

```text
Find medicine for sister.
Protect another survivor.
Find radio station.
Get revenge.
Reach safe city.
Never leave Kentucky.
```

完成 / 失敗會改變：

```text
morale
loyalty
bond
behavior
```

這是建立 emergent story 的主要來源。

---

# 36. Event Engine

不要一次寫 500 個事件。

先做：

```text
20–30 reusable event templates
```

Event input：

```text
traits
morale
food
water
injury
relationship
location
threat
noise
```

Event categories：

```text
interpersonal
resource crisis
medical
survivor
exploration
defense
moral choice
```

每個事件至少修改 2 個系統。

## BAD

```text
Lose 3 food.
```

## GOOD

```text
Smoker asks for cigarettes.

Give:
    cigarettes -1
    morale +4

Refuse:
    morale -6
    bond -5

Search:
    costs AP
    may discover cigarettes
```

---

# 37. Choice Quality Test

每個 Choice 必須通過：

1. 有 upside？
2. 有 downside？
3. 玩家能理解風險？
4. 沒有永遠正確答案？
5. 會改變 future state？

如果答案大多是 NO：

> 刪掉或簡化。

---

# 38. 防止 Dominant Strategy

加入 developer telemetry：

```text
average food/day
average water/day
AP spent/day
mission success rate
death cause
most used action
most selected trait
most selected occupation
most used weapon
average mission loot
location revisit count
average bond
average morale
```

自動 flag：

```text
Trait > 70% selection
Occupation > 40%
Action > 60%
Same location revisited > 5 times
```

這些只給 developer。

---

# 39. Simulation Mode

增加 developer-only：

```text
100 runs
1000 runs
```

Randomize：

```text
occupation
traits
shelter
allocation
```

統計：

```text
average survival day
median survival day
win rate
death cause
resource depletion day
facility level
survivor count
mission count
```

用 simulation balance，而不是憑感覺。

---

# 40. Balance Target

正常玩家體驗：

### Day 1–2

學習。

### Day 3–5

第一次真正 resource pressure。

### Day 5–10

第一次重大 Survivor / Relationship 問題。

### Day 8–15

第一次重要 location decision。

### Day 15–25

Shelter 開始形成 identity。

### Late Game

即使資源充足：

> 仍然有 strategic decisions。

不能：

```text
resources high
morale high
skills high
walls high
equipment high

=
完全安全
```

---

# 41. Death Spiral

允許錯誤累積。

但不要：

```text
一次 RNG
→ 永久無法翻盤
```

玩家應該可以：

```text
ration
trade
abandon project
reduce survivor count
sell/salvage gear
raid low-risk location
```

來挽救局勢。

---

# 42. Late Game

不要只是：

```text
Zombie HP × 2
Zombie count × 3
```

Late game 應增加：

```text
social conflict
migration
radio signals
high-value locations
scarcity
permanent choices
```

不要現在就做：

```text
multiplayer
PvP
factions
```

先把單機 systemic loop 做好。

---

# 43. SAVE MIGRATION

從舊版本升級時：

```js
version = 5
```

新增：

```js
dayAP = 6
maxAP = 6

location.threat = 0
location.noiseToday = 0
location.alertLevel = 0

survivor.stress = 0
survivor.loyalty = 50
survivor.personalGoal = generated
```

舊 save：

- safe migration
- 或明確提示 invalid save

絕對不能 silent corruption。

---

# 44. UI

不要重做整個 UI。

只增加必要資訊。

Shelter：

```text
DAY 7
ACTIONS 4/6

FOOD 12
WATER 9
MATERIALS 7
MED 2
AMMO 5
FUEL 3
```

Mission：

```text
AP 3/6
NOISE 18
THREAT: ELEVATED
EST. ZOMBIES: 8–12
```

Survivor：

```text
morale
fatigue
job
injury
important traits
relationship
```

不要顯示所有 hidden probability。

---

# 45. Log

不要：

```text
Morale -8.
```

改：

```text
Mara refused to work after the argument with Cole.
Morale -8.
```

玩家必須知道：

> 為什麼事情發生。

---

# 46. 明確刪除 / 改變

## REMOVE

1. Infinite location loot
2. Unlimited same-day mission farming
3. Auto equipment replacement
4. Mostly-positive automatic relationship growth
5. Traits that only exist as numbers
6. Facilities that only provide passive numbers

## KEEP

1. Existing art
2. Existing locations
3. Existing occupations
4. Existing traits
5. Existing equipment
6. Existing map
7. Existing shelter UI
8. Existing mission UI
9. Existing languages
10. Chicago win condition
11. Cosmetic Ash Market

---

# 47. 現階段不要新增

禁止先做：

```text
multiplayer
PvP
factions
100+ new locations
100+ new traits
vehicle simulation
complex weather
100+ crafting recipes
full economy
procedural story generator
```

原因：

> 現有內容已經足夠。

目前要解決的是：

> **interaction density，不是 content quantity。**

---

# 48. IMPLEMENTATION ORDER

## Phase 1 — Core Loop

先做：

1. AP
2. AP UI
3. Mission AP cost
4. Build AP cost
5. Repair AP cost
6. Persistent location loot
7. Persistent noise/threat
8. Save v5

不要先改 Trait。

### Acceptance

玩家不能一天無限做事情。

Location 不能無限 farming。

---

## Phase 2 — System Interaction

做：

1. Trait behavior hooks
2. Morale behavior
3. Negative relationships
4. Survivor stress
5. Personal goals
6. Social events

### Acceptance

至少一個 Trait 能：

```text
Trait
→ Event
→ Relationship
→ Morale
→ Resource
```

---

## Phase 3 — Decision Quality

做：

1. Partial information
2. Threat estimate
3. Combat tradeoffs
4. Equipment condition decisions
5. Skill specialization

### Acceptance

Mission 中不存在單一顯然正解。

---

## Phase 4 — Balance

做：

1. telemetry
2. simulation
3. occupation balance
4. trait balance
5. resource balance
6. progression balance

---

# 49. REQUIRED TESTS

## Test A — Farming

1. Start Muldraugh.
2. Repeatedly search same location.
3. Verify AP blocks unlimited action.
4. Verify loot permanently decreases.

Expected:

```text
No infinite farming.
```

---

## Test B — Quiet vs Loud

Run 100 searches。

比較：

```text
loot
noise
threat
zombie contact
```

Expected：

```text
Loud = significantly more reward
AND
Loud = significantly more danger
```

---

## Test C — Smoker

Create smoker.

Survive several days without cigarettes.

Expected：

```text
stress
morale loss
social request/conflict
```

---

## Test D — Selfish

Recruit selfish survivor。

Give scarce loot。

Expected：

```text
possible withholding
possible theft
relationship consequences
```

---

## Test E — Lover Death

Create Lover。

Kill partner。

Expected：

```text
grief
morale loss
behavior change
```

---

## Test F — Doctor

Compare Medical 2 vs Medical 8。

Expected：

```text
meaningfully different treatment reliability
```

not merely:

```text
+X HP
```

---

## Test G — Stealth

Compare Stealth 2 vs Stealth 8。

Expected：

```text
different available decisions
```

not merely：

```text
higher success percentage
```

---

## Test H — Late Game

Simulate 30+ days。

Expected：

```text
strong shelter
≠
no decisions
```

---

# 50. FINAL SUCCESS CRITERIA

改版成功必須同時滿足：

1. 玩家每天必須選擇如何使用有限時間。
2. Location resource 是有限的。
3. Noise 會創造 escalating risk。
4. Traits 會產生可觀察行為。
5. Relationship 可以上升，也可以下降。
6. NPC 可以帶來問題，而不只是 bonus。
7. Facility 解鎖 decision，而不只是 passive modifier。
8. Skill 可以解鎖 qualitative options。
9. Equipment 形成不同 risk/reward build。
10. 玩家不能靠單一路線 farming。
11. 玩家不能永遠使用同一 squad 解決所有問題。
12. 錯誤可以 recovery，但 recovery 必須付出代價。
13. Late game 仍有 uncertainty / opportunity cost。
14. 玩家能理解重大失敗的原因。
15. 不同 character build 真的導致不同玩法。

---

# 51. 最重要的設計原則

**不要把這份規格理解成「增加更多 mechanics」。**

實際目標是：

> **減少孤立 mechanics，增加 interaction density。**

好的新 mechanic 至少應該連接 3 個既有系統。

例如：

```text
SMOKER
 ↓
Cigarettes
 ↓
Scavenge
 ↓
Morale
 ↓
Relationship
 ↓
Conflict
```

這是一個有價值的 Trait。

反之：

```text
New Trait
→ combat +1
```

如果沒有改變玩家決策，就不要加。

---

# 52. GROK 執行規則

不要重寫整個專案。

Incremental refactor。

每改一個 subsystem：

1. 找出現有 state/data/functions。
2. 保留 localization keys。
3. 保留現有 UI。
4. 保留現有 art paths。
5. 加 save migration。
6. 實作一個 phase。
7. 執行測試。
8. 確認沒有 unrelated regression。

每個 Phase 完成後輸出：

```text
FILES CHANGED
FUNCTIONS CHANGED
DATA SCHEMA CHANGED
FORMULAS CHANGED
BALANCE VALUES
SAVE MIGRATION
TESTS
KNOWN ISSUES
```

不要一次把所有東西重寫。

---

# 最終設計目標

One More Night 不應該變成：

> 「有很多 Trait 的殭屍文字遊戲。」

而應該變成：

> **「一個由有限時間、有限資源、個性化倖存者、不完整資訊和永久後果共同產生故事的生存系統。」**

玩家每一天都應該遇到：

```text
我想做 A
但是只能做 B

我不知道 A 會不會成功

如果我選 A
某個人可能會不高興

如果我不選 A
明天可能更糟

所以我要冒這個險。
```

這才是 One More Night 的核心可玩性。
