# One More Night — v0.2.3

正式更新原文。遊戲內開發日誌、itch 說明、實作底稿共用這一份。  
日期：2026-09-24  
前置：v0.2.2 已有日子變壞、四種詞、油桶與裝備改寫。草藥在 v0.2.2 沒進包。這一版才搬上來。

---

## 一句話

變異讓晚間的傷不再是「睡一晚就好」。草藥學這時候才有位置。醫生認、農夫種、技能高藥才像樣。另開一張情境：醒來時已經病了，職業自訂，家已經爛了。咬傷仍然無藥。

---

## 中文（可直接貼 itch／開發日誌）

v0.2.3 · 2026-09-24  
v0.2.3　藥這時候才有用  
公開更新

這一版要解決什麼  
v0.2.2 讓沒清的鎮變擠，晚上開始帶詞。傷還是只有西藥一格、睡一晚。皮厚的、會叫的、異變打完，人帶著口子回家，醫生和農夫仍然沒有分工。這一版把草藥學搬上來。不是圖鑑，是「敷還是喝、認錯會吐、種得慢、練得高才像樣」。

病  
病要有來源。沒有傷口就不要熱，沒有生水就不要惡水。每人最多兩種（不含飢渴、不含僵屍感染）。  
開放傷口——打架、夜襲、委派帶傷。不敷不包，兩晚變成傷口惡化。  
傷口惡化——高熱，不能遠門。草藥只能減速，不能根治。三晚有機會死。  
熱病——惡化或咳拖出來的。當晚少一格行動。  
惡水——生水、腐食、髒手晚飯。水加倍。  
肺熱——密閉樓、疲勞、會叫的那場之後。潛行變差。  
醒著——夜襲後、隊裡死人。休息減半。  
認錯——對未識的草按了泡。一晚不能出門。  
異變熱——第 15 晚後，被異變或皮厚的近身打傷才可能上身。比普通熱病多拖一晚。草藥能壓，清不掉咬傷。  
僵屍創——現有那條。按鈕旁邊寫死：草藥無效。

藥  
前七晚只在路邊見到五味：車前草、西洋蓍、野薄荷、蒲公英、松針。只教敷還是喝。第 8 晚才有紫錐花、接骨木、毛蕊花。黃金印章和西洋參是故事，不可種，芝加哥近 0。  
用藥三個按鈕：敷、泡、不吃。醫務室 2 才把泡升級成煎，仍是同一個按鈕。  
醫療或農耕夠高，鮮品當場點名。不夠，認一晚。認錯少，後果清楚。紅豆杉長得像松針，第 8 晚以後才在林地出現。

誰在這條線上  
醫生：開局醫療高、農耕低。認得出、配得出、看護有效。不能一個人把畦種滿。  
農夫：開局農耕高、醫療低。委派採藥熟什麼拿什麼。菜園可畦已識別的車前、薄荷、蒲公英。黃金印章、西洋參不可畦。第一顆種子來自委派奇遇「溫室」，不是開局作業。  
廚子：薄荷茶、煮沸擋惡水。  
同一人開局不能醫療 4 又農耕 5。

技能越高，藥越像樣  
不另開「草藥技能」。醫療決定效力，農耕決定鮮品和畦。  
醫療 0–2：茶能喝，膏是葉子直接敷，效力 0.6。  
醫療 3–4：茶和敷到位，效力 1.0。  
醫療 5–7：煎劑，惡化多拖一晚，效力 1.2。  
醫療 8–10：清藥膏（黃金印章＋車前，醫務室 3），效力 1.4。仍清不掉咬傷。  
農耕 5：當場點名。農耕高，鮮品多一晚才乾。  
裝備的醫療加值只加看護回血，不讓識別視同醫療 4。

情境：已經晚了  
新遊戲在四張難度旁邊多一張情境，不是第五種難度。規則用你選的難度（預設正常），開局狀態強制很差。  
職業全自訂，點數照舊。家已經破：牆低、食物少、集水器未建或一級、油不夠出遠門。主角帶著開放傷口和熱病醒來，體力不滿，情緒低。世界日數從第 8 晚起算——皮厚的已經可能出現，集結已經開始。沒有額外物資。  
活下去的方法是先把人穩住，再出門。醫生在這張卡上終於不是可選。農夫能種，但第一週畦還是空的。芝加哥仍是終點。通關會註明「已經晚了」。  
這張卡不給咬傷開局。染的是病，不是僵屍創。否則醫生沒有位置。

沒有動  
工場、藍圖、傳奇套、相片仍關。六格、鄰居免油、油桶、裝備不加技能等級，都不改。清過的針腳仍然不會每晚長滿。

---

## English

v0.2.3 · 2026-09-24  
v0.2.3  Medicine is late on purpose  
Public update

Why this build  
v0.2.2 made uncleared towns thicker and put a word on the fight. Hurt still meant one tin of pills and a night of sleep. After a brute, a screamer, a mutant, you come home cut and the doctor and the farmer are still the same person. This build brings herbalism up. Not a bestiary. Poultice or tea. Misidentify and you vomit. Gardens are slow. High skill is what makes the dose look like medicine.

Sickness  
Sickness needs a cause. No wound, no fever. No raw water, no flux. Two ailments at most, not counting thirst, not counting the bite.  
Open wound — fights, raids, a dispatch that comes back cut. Left two nights, it turns.  
Wound gone bad — fever, no far pins. Herbs only slow it. Three nights and you can die.  
Fever — from the turn or a cough left alone. One fewer action that day.  
Flux — raw water, rot, dirty supper. Water doubles.  
Chest — closed buildings, fatigue, after a screamer. Stealth suffers.  
Wakeful — after a raid, after a death in the house. Rest does half.  
Wrong plant — you brewed what you had not named. One night you do not leave.  
Mutant heat — only after day 15, and only if a mutant or a brute cut you in melee. Lasts one night longer than ordinary fever. Herbs press it. They do not touch the bite.  
The bite — the line you already have. The button says herbs do nothing.

The plants  
The first seven nights only five: plantain, yarrow, mint, dandelion, pine. Poultice or tea. Coneflower and elderberry wait for night 8. Goldenseal and ginseng are story. You cannot bed them. Chicago yields near none.  
Three buttons: poultice, brew, leave it. Infirmary 2 turns brew into a decoction. Same button.  
Medical 4 or farm 5 names a fresh plant on the spot. Lower, one night to name it. Misidentify rarely, and the cost is readable. Yew looks like pine. After night 8, in woods.

Who this is for  
Doctor: high medical, low farm. Names, prepares, tends. Cannot fill the beds alone.  
Farmer: high farm, low medical. Dispatch picks what they know. Beds take named plantain, mint, dandelion. Not goldenseal, not ginseng. The first seed is the greenhouse encounter, not a tutorial.  
Cook: mint tea, a boil that stops flux.  
No start with medical 4 and farm 5 on the same body.

Skill is the dose  
No ninth skill. Medical is potency. Farm is fresh stock and beds.  
0–2: tea and a raw leaf, 0.6.  
3–4: the dose lands, 1.0.  
5–7: decoction, the turn waits a night, 1.2.  
8–10: a salve of goldenseal and plantain at infirmary 3, 1.4. Still not the bite.  
Farm 5 names on sight. High farm keeps fresh a night longer.  
Gear that says medical only adds to the tend. It does not count as medical 4 for naming.

Scenario: Already late  
A fifth card beside the four modes. Not a fifth difficulty. It uses the mode you pick (Normal if you do not pick). The opening is forced bad.  
Occupation is yours. The house is already broken: low wall, little food, cistern missing or at one, not enough fuel for a far pin. You wake with an open wound and a fever, short on blood, short on mood. The calendar starts on night 8. Brutes are possible. Rally has begun. No extra stock.  
You stabilize the body before you walk. The doctor is no longer optional on this card. The farmer can plant; the beds are empty the first week. Chicago is still the end. A win is marked Already late.  
This card does not start with the bite. The sickness is sickness. Otherwise the doctor has no seat.

Left alone  
Workshop, blueprints, legend sets, portraits stay off. Six actions, neighbour fuel at zero, the still, gear that does not add ranks — unchanged. Cleared pins still do not refill every night.

---

## 日本語

v0.2.3 · 2026-09-24  
v0.2.3　薬が必要になるのは今  
公開更新

この版  
v0.2.2 で未掃の町は増え、戦いに言葉が乗った。傷はまだ西薬一缶と一晩。厚い一匹、叫ぶ一匹、異変のあと、口を開けて帰っても医者と農夫は同一人。この版で薬草を上げる。図鑑ではない。貼るか飲むか。間違えると吐く。畝は遅い。技能が高いほど薬に見える。

病  
病には原因が要る。傷がなければ熱はない。生水がなければ悪水はない。一人二種まで。渇きと噛み傷は別。  
開放創——戦闘、夜襲、派遣の傷。二晩放置で悪化。  
悪化——高熱、遠出不可。薬草は遅らせるだけ。三晩で死にうる。  
熱——悪化か咳の放置。その日の行動が一つ減る。  
悪水——生水、腐敗、汚い夕食。水が倍。  
肺——密閉、疲労、叫声のあと。隠密が落ちる。  
眠れない——夜襲のあと、家の死。休息が半分。  
誤認——名を付けていない草を煎じた。一晩出られない。  
異変熱——15 日目以降。異変か厚い一匹の近接だけ。普通の熱より一晩長い。薬草は押さえられる。噛み傷には無効。  
噛み傷——既存。ボタンに「薬草は無効」と書く。

草  
最初の七晩は五味だけ。車前、蓍、薄荷、蒲公英、松針。貼るか飲むか。紫錐花と接骨木は 8 日目。黄金印と西洋参は物語。畝にできない。シカゴはほぼ出ない。  
ボタンは三つ。貼る、煎じる、食べない。医務室 2 で煎じは煎剤になる。同じボタン。  
医療 4 か農耕 5 で鮮品に名が付く。足りなければ一晩。誤認は稀で、結果は読める。

誰か  
医者は医療が高く農耕が低い。農夫は逆。同一人の開局で医療 4 かつ農耕 5 にはしない。最初の種は温室の奇遇。

技能が用量  
医療が効力。農耕が鮮品と畝。0–2 は 0.6、3–4 は 1.0、5–7 は 1.2、8–10 は 1.4。噛み傷は最後まで無効。

状況：もう遅い  
難易度の横に一枚。第五の難易度ではない。選んだ難易度を使う。家は壊れている。傷と熱で起きる。暦は 8 日目から。噛み傷では始めない。勝ちは「もう遅い」と記す。勝ちはシカゴ。

動かさない  
工房、藍図、伝説、写真は閉じたまま。行動六、隣の燃料ゼロ、桶、装備は等級を足さない。掃いたピンは毎晩満員に戻らない。

---

## 한국어

v0.2.3 · 2026-09-24  
v0.2.3　약이 필요해지는 때  
공개 업데이트

이 판  
v0.2.2가 안 치운 마을을 붐비게 하고 싸움에 단어를 붙였다. 상처는 여전히 양약 한 칸과 하룻밤. 두꺼운 것, 우는 것, 변이 뒤에 입을 열고 돌아와도 의사와 농부는 한 사람이다. 이 판에서 약초를 올린다. 도감이 아니다. 붙일지 마실지. 잘못 보면 토한다. 이랑은 느리다. 기술이 높아야 약처럼 보인다.

병  
병에는 원인이 있다. 상처 없이 열 없고, 생수 없이 악수 없다. 한 사람 두 가지까지. 갈증과 물림은 별개.  
열린 상처——전투, 야습, 파견. 이틀 방치하면 악화.  
악화——고열, 먼 곳 금지. 약초는 늦출 뿐. 사흘이면 죽을 수 있다.  
열——악화나 기침. 그날 행동 하나 감소.  
악수——생수, 썩은 것, 더러운 저녁. 물 두 배.  
폐——밀폐, 피로, 울음 뒤. 은밀이 떨어진다.  
잠 못 잠——야습 뒤, 집안의 죽음. 휴식이 반.  
오인——이름 없는 풀을 달였다. 하룻밤 못 나간다.  
변이열——15일 이후. 변이나 두꺼운 것의 근접만. 보통 열보다 하루 길다. 약초는 누른다. 물림에는 무효.  
물림——기존. 버튼에 약초 무효.

풀  
첫 이레는 다섯 맛. 질경이, 톱풀, 박하, 민들레, 솔잎. 8일부터 자주색 콘플라워. 황금인과 인삼은 이야기다. 심지 못한다.  
버튼 셋: 붙이다, 달이다, 먹지 않다. 의무실 2에서 달이기가 전제가 된다. 같은 버튼.  
의료 4 또는 농사 5면 즉석에서 이름을 붙인다.

누구  
의사는 의료 높고 농사 낮음. 농부는 반대. 한 사람 개국에 의료 4와 농사 5를 같이 주지 않는다. 첫 씨앗은 온실 기연.

기술이 용량  
의료가 효력. 농사가 신선함과 이랑. 0–2는 0.6, 3–4는 1.0, 5–7은 1.2, 8–10은 1.4. 물림은 끝까지 무효.

상황: 이미 늦었다  
난이도 옆에 카드 한 장. 다섯 번째 난이도가 아니다. 고른 난이도를 쓴다. 집은 이미 망가졌다. 상처와 열로 일어난다. 달력은 8일부터. 물림으로 시작하지 않는다. 클리어는 「이미 늦었다」로 적힌다. 승리는 시카고.

안 건드린 것  
공방, 청사진, 전설, 사진. 행동 여섯, 이웃 연료 0, 통, 장비가 등급을 더하지 않음. 치운 핀은 매일 안 찬다.

---

## 實作備註（不進玩家文）

新欄位  
- `Survivor.ailments: { id, sinceDay }[]` 最多 2  
- `resources.herbs: { id, fresh, qty }[]`；未識用 `unknown` + 隱藏真 id  
- `GameState.scenario?: "late" | null`  
- 西藥 `medicine` 一格保留  

情境 `late`  
- 難度仍是 casual / normal / extinct / sandbox  
- `day` 開局 = 8  
- 牆 18–28，食物 3–5，水 2，油 0–1，集水器 0 或 1  
- 主角 `wound` + `fever`，hp 約 55%，morale 低  
- 不給 `infected`  
- 通關標記 scenario  

效力  
`potency = 0.6 | 1.0 | 1.2 | 1.4` 只乘「病程少一晚／惡化骰」。不乘回血成第二套治療。看護回血仍走醫療公式 + 裝備 acts。  

異變熱  
只在 `foe === mutant | brute` 且本場近戰扣血後擲。休閒低、滅絕高。不是每場。  

不要做  
草藥清咬傷、開局就畦、十六味第一晚全掉、第九技能「草藥學」、情境開局已感染僵屍。
`
