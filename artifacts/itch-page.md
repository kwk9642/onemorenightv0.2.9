# One More Night — itch Description

Paste the block for your language into the itch.io project Description.
The in-game Dev log is this file. Future public updates: add an entry at the top of src/game/devlog.ts, rebuild, paste again. Do not write a second changelog on itch.

## 中文

再活一晚（One More Night）是免費文字僵屍據點。肯塔基鄉下起家，美國中西部是真的地圖。一晚一命。不收費。

開發日誌寫在遊戲標題的「開發日誌」裡，和這頁同一份。以後每次更新都從這裡報告，不另開一篇消失的 itch 文。

v0.2.2 · 2026-09-24
v0.2.2　日子會變壞
公開更新

這一版要解決什麼
v0.2.1 把水和油的帳對上以後，地圖上的僵屍仍是死的。第三週走回一個沒去過的鎮，數量和第一晚一樣。夜襲也只看牆。人會覺得世界停了。這一版讓還沒處理的地方，隨日子變差。清過的針腳不會每晚長滿——否則佔領沒有意義，芝加哥會變成刷場。

世界怎麼變壞
已發現、未佔領、還有僵屍、又不是現居地鄰居的點，正常從第 10 晚起，每晚有機會多一隻，有上限。休閒從第 16 晚、滅絕從第 6 晚。鄰居不長，圈內走路免油仍然成立。清到零的點，正常與休閒不再長；只有滅絕在第 20 晚以後，才可能長回一隻。佔領的家不長。地圖上用「感染低／中／高／危」表示壓力，不寫精確數字。夜襲仍打牆，傷害從第 8 晚略升，第 16 晚再升一檔。滅絕再重一口。

四種詞，外加普通的
戰鬥還是近戰、槍、包抄。這一版加的是今晚這一場身上的一個詞，不是新操作、不是即時戰鬥。同一場最多一種。
普通的——基準。第一週幾乎只會遇到這個。
先到的——第 5 晚起（滅絕更早，休閒更晚）。包抄要更高的潛行才開得了。近身失手，傷更重。
皮厚的——第 8 晚起。近戰少殺一隻，最少仍是一隻。槍不受影響。
會叫的——第 10 晚起。打完，這個點可能再多一兩隻，不超過集結上限。
異變——第 15 晚以前不會出現。稀、晚、更痛。用來改變你對遠城的判斷，不是用來隨機秒殺。
芝加哥終局可以強制帶一個詞，讓最後一場有記憶。沒見過的詞，資料庫不展開。

油桶與裝備
正常難度，油桶二級是 2 食物換 1 油；一級仍是 3。滅絕二級是 3，而且榨一晚、歇一晚。先吃飯、先腐爛，剩下的才進桶。日誌會寫油桶幾級、吃了幾份。鄰居走路仍然免油。芝加哥、蓋瑞仍收全價。
裝備不再把技能等級加上去。包抄、認藥、一晚兩件，只看人練出來的等級。手套讓修牆和修裝多一點。潛行的衣服讓搜索少出一點聲，不提早開包抄。醫療裝多回一點血。戰鬥裝只加近戰的骰。手套是省力，不是畢業。

沒有動
草藥、工場、傳奇套仍關著。六格、有限物資、用過才升級、委派、芝加哥勝負，都不改。

—

v0.2.1 · 2026-09-23
v0.2.1　帳對得上
公開修正

這一版為什麼存在
v0.2 把日子收緊以後，有人回來說：油出不去、集水器三級了水還是每天少、搬了家隔壁還要燒油、開局只有一種死法。這一版改這四件事。草藥、工場、傳奇套不動。

水
每人每晚喝 1。集水器一級產 1、供 1 人；二級產 2；三級產 3。三人、三級，當天打平。第四人起每天欠 1。口渴特質算 2 份。第 16 天多喝的那一罐，只在沒有集水器時才加。今晚接的水，明早才算數。按鈕不再寫「約 0.6」。日誌寫喝了幾、接了幾。

油
現居地的鄰居走路去，不燒油。出了這個圈子，才照地圖上的數字。搬了家，新家的隔壁免費，舊圈子恢復原價。芝加哥和蓋瑞仍要油。家裡可以造油桶。晚上派人「榨油」：一級 3 食物換 1 油，二級 2 食物換 1 油。先吃飯、先腐爛，剩下的才進桶。每晚最多 1 桶。沒人值，桶是空的。

模式
新遊戲四張卡。舊存檔當正常。中途不能改。休閒：規則相同，飯和油寬一點，仍會死人。正常：就是這一版的底。滅絕：同樣的路，更少的東西，更貴的遠門。鄰居仍然不收油。沙盒：自己定同伴、倉庫和難度。通關會註明沙盒。開局之後不加資源。

沒有動
勝負仍是芝加哥。六格、有限物資、用過才升級、委派，都不改。草藥學留到後面。

—

v0.2 · 2026-09-22
v0.2　玩家打完三十晚之後
公開更新

這一版為什麼存在
v0.1 是免費原型，讓人整局任玩。有人打到第三、四十晚回來問：後面要做什麼？為什麼牆在那、醫務室按不了、地圖寫已清理但其實還有兩隻、裝備數字看不懂、東西丟不掉、搜得太輕鬆。這一版把那些問題一併收進文字遊戲裡，沒有另開戰場。

白天：六格行動
一天只有六格。移動、搜索、戰鬥、下一間各 1。建造 2，補牆 1。撤離不睡覺、不耗格。地點的物資是有限的，搜光就沒有。悄悄搜索幾乎不出聲，但大約只有徹底翻的四成。大聲會引僵屍。地圖不再謊稱已清理——還有幾隻就寫幾隻。芝加哥是遠的終點，蓋瑞是南面的鋼門。

人：用過才會長
技能 0 到 10。只有實際用過才加經驗：打架長戰鬥、翻袋長搜刮、耕田長農耕。每級寫明加什麼。出身決定學得快慢。人多才能委派——留下一個守家，最多兩個去外圍採藥、拆板、覓食。熟什麼就優先搜什麼。可能空手、帶傷、迷路，或撞上溫室、地窖、活人、一張地圖。這不是出征。

家：夜會來人
牆低、天數越高，過夜越容易被襲。警戒和哨塔減一點。食物超過十會腐。用不到的裝備可以丟掉，爛到還能拆的會變成建材。房間、工作、裝備的說明寫在按鈕旁邊和資料庫裡——這是文字遊戲，字就是規則。資料庫在遊戲裡打開，不是下載一份文件。

怎麼算贏，什麼沒有動
清掉芝加哥的僵屍並佔領，這一局才結束。全軍覆沒就輸。存檔仍在這台裝置，標題有「繼續」。這一版仍然是文字。像素戰鬥、天氣、派系都還關著，不放在標題上、也不塞進這一包。

—

v0.1 · 2026-09-13
v0.1　初代系統
免費原型

這是什麼
再活一晚是文字僵屍據點。肯塔基鄉下起家，美國中西部是真的地圖。職業、缺點、一棟破房子。目標寫在標題裡：再撐一晚。永久死亡。不收費、無試用鎖。錢不能換命。

一天怎麼過
白天出門：選地點、組最多三人、搜索或打架、帶東西回來。遠的城要油。晚上吃飯喝水，派人煮飯、耕田、修牆、看護、守夜、聽電台。沒人做的工就空轉。睡了才過一日。

人
八個職業決定起手技能和一把武器。特質有好有壞，點數要自己算。情緒太低，出不了門也做不了工。關係會變——陌生人、相識、朋友、情人。其中一個死了，另一個會垮。

房子
寢室是床位。廚房讓晚飯少耗一點。集水器產水。菜園要人耕。工坊派人打造才修裝備。醫務室讓看護有效。電台照亮地圖、偶爾聽到人。哨塔減夜襲。牆是夜裡的門。佔領新據點，容量和設施跟那棟走，舊的升級不會帶走。

出門
地圖上選一個看得到的地方。安靜翻、徹底翻、或打。槍要子彈。側擊看潛行。帶回來的東西進倉庫，可以穿上。清光一區才能搬家。床不夠，佔領只是換地方餓死。

死與存檔
最後一個倒下去，這一局結束。存檔寫在這台裝置上。清資料就沒了。標題的繼續會讀它。新的倖存會蓋掉舊的。

—

## English

One More Night is a free text zombie house. Rural Kentucky. A real Midwest map. One night. One life. No paywall.

The same devlog lives under Dev log on the title screen. Future updates are posted there, not in a second itch essay that goes stale.

v0.2.2 · 2026-09-24
v0.2.2  The days get worse
Public update

Why this build
v0.2.1 fixed the books. The pins on the map did not. A town you had never visited still held the same count in week three as it had on night one. Raids only asked about the wall. The world felt paused. This build lets untreated ground get worse with the calendar. Cleared pins do not refill every night. If they did, occupying would mean nothing and Chicago would be a farm.

How the world sours
A discovered, unoccupied pin that still has zombies, and is not a neighbour of the house you live in, may gain one a night after day 10 on Normal — under a cap. Casual starts on day 16. Extinct on day 6. Neighbours never grow. Walking the ring still costs no fuel. A pin at zero stays at zero on Casual and Normal. Only Extinct, after day 20, may put one back. The occupied house does not grow. The map writes infection as low / mid / high / critical, not a number. Night raids still hit the wall. Damage steps up on day 8, again on day 16. Extinct hits harder.

Four words, and the ordinary
Combat is still melee, gun, flank. A fight may carry one word. That is not a new control and not real-time combat.
Ordinary — the baseline. Almost all you meet in the first week.
Runner — from day 5 (earlier on Extinct, later on Casual). Flank wants more stealth. A missed swing hurts more.
Brute — from day 8. Melee kills one fewer, never below one. Guns ignore it.
Screamer — from day 10. After the fight the pin may gain one or two, under the cap.
Mutant — not before day 15. Rare, late, worse. It should change how you look at a far city, not roll a sudden death.
The last fight in Chicago can force a word so the ending has a face. Words you have not met stay closed in the handbook.

The still and the kit
On Normal, still 2 is 2 food for 1 fuel. Level 1 is still 3. Extinct still 2 is 3, and the drum rests every other night. Eat first, rot first, then the still. The log names the level and the food. Neighbours still walk free. Chicago and Gary still charge full fare.
Gear no longer adds skill ranks. Flank, identification, two pieces in a night — those gates use the rank you trained. Gloves patch a little more wall and kit. Quiet clothes cut search noise and do not unlock flank. Medical kit heals a little more. Combat kit only adds to the melee roll. Gloves save labour. They do not graduate you.

Left alone
Herbs, the shop line, legend sets stay off. Six actions, finite stock, XP from use, dispatch, Chicago as the win — unchanged.

—

v0.2.1 · 2026-09-23
v0.2.1  The books balance
Public fix

Why this build
After v0.2 tightened the day, people came back: no fuel to leave, the cistern at three and the water still falling, a move that still charged the next pin, one way to die at the title. This build is those four. Herbs, the shop line, legend sets stay off.

Water
One drink each night. Cistern 1 yields 1 and covers 1. Level 2 yields 2. Level 3 yields 3. Three people, level 3, the day nets zero. A fourth person owes 1. High thirst counts as two. The extra drink on day 16 only hits if there is no cistern. Tonight’s rain is tomorrow’s can. The button no longer says “about 0.6”. The log says how many drunk, how many caught.

Fuel
Neighbors of the house you occupy cost 0. Leave that ring and the map number stands. Move house and the new ring is free; the old one charges again. Chicago and Gary still want fuel. You can build a still. At night someone Presses oil: 3 food for 1 fuel at level 1, 2 food at level 2. Eat first, rot first, then the still. One can a night. Nobody on the job, the drum is empty.

Modes
Four cards on a new game. Old saves are Normal. You cannot change mid-run. Casual: same rules, more food and fuel. You can still die. Normal: this build. Extinct: the same road, less in the bag, dearer far pins. Neighbors still cost 0. Sandbox: you set the extra hands, the stash, the knobs. A win is marked Sandbox. No gifts after the first day.

Left alone
Chicago is still the win. Six actions, finite stock, XP from use, dispatch — unchanged. Herbalism waits.

—

v0.2 · 2026-09-22
v0.2  After thirty nights
Public update

Why this build
v0.1 was a free prototype. People lived thirty, forty nights and came back: what now? Why is the wall there, why won't the infirmary take materials, why does the map say cleared with two left, what do gear numbers do, why can't I throw kit away, why is quiet search so fat. This build folds those answers into the text game. No second combat mode.

Day: six actions
Six actions a day. Travel, search, fight, next room cost 1. Build 2, patch the wall 1. Extract does not sleep and costs nothing. Sites have finite stock; empty is empty. Quiet search is almost silent and about 40% of a loud rummage. Noise draws them. The map does not lie about cleared — leftover zombies stay on the pin. Chicago is the far end. Gary is the steel door south.

People: use is how you grow
Skills run 0–10. XP only from doing the thing: fights raise combat, rummaging raises scavenge, the garden raises farming. Each rank says what it adds. Starting level locks how fast you learn. Spare hands can be sent out — leave one home, two at most, around the house for herbs, boards, a creek. They search what they know. They can come back empty, cut, a day late, or with a greenhouse, a cellar, a stranger, a map. That is not a raid.

House: night comes in
Low walls and later days draw raids. Guard duty and the tower shave the odds. Food over ten rots. Kit you do not need can be thrown; salvage above a threshold becomes lumber. Rooms, jobs, and gear say what they do next to the button and in the handbook. This is a text game. The words are the rules. The handbook opens in the game. It is not a file you download.

How you win, what we left
Clear Chicago and occupy it. That is the win. Everyone dead is the loss. The save still lives on this device. Title has Continue. This is still text. Pixel fights, weather, factions stay unplugged — not on the title, not in this zip.

—

v0.1 · 2026-09-13
v0.1  The first system
Free prototype

What it is
One More Night is a text zombie house. You start in rural Kentucky. The Midwest is a real map. Occupation, flaws, a wreck of a house. The title is the brief: last one more night. Permadeath. No paywall, no trial lock. Money cannot buy a pulse.

A day
Day: pick a pin, take up to three, search or fight, come home with a bag. Far cities cost fuel. Night: eat, drink, cook, farm, mend, tend, watch, listen to the radio. A job with nobody in it does nothing. Sleep is what turns the day.

People
Eight occupations lock starting skills and a weapon. Traits help and hurt; you spend the points. Mood too low and they will not leave the house or work. Bonds move: stranger, known, friend, lover. One dies, the other drops.

The house
Beds are capacity. The kitchen trims supper. The cistern makes water. The garden needs a farmer. The shop only mends kit if someone crafts. The infirmary makes tending real. Radio lights the map and sometimes a voice. The tower cuts raids. The wall is the door at night. Occupy a new pin and capacity and rooms follow that building. Old upgrades do not travel.

Going out
Pick a pin you can see. Search quiet, search loud, or fight. Guns want ammo. Flank wants stealth. What you bring goes to the stash and can be worn. You only move house when the site is empty of them. Not enough beds and occupying is starving in a new room.

Death and the save
When the last one falls, the run ends. The save is on this device. Clear the data and it is gone. Continue on the title reads it. A new survivor overwrites the old one.

—

## 日本語

『もう一晩』は無料の文字ゾンビ拠点。ケンタッキーの田舎。本物の中西部地図。一晩、一条の命。料金なし。

同じ開発日誌がタイトルの「開発日誌」にある。以後の更新もそこに書く。itch に消える別文は作らない。

v0.2.2 · 2026-09-24
v0.2.2　日は悪くなる
公開更新

この版が直すこと
v0.2.1 で水と燃料の帳は合った。地図の数字は止まっていた。三週目に未踏の町へ戻っても、最初の晩と同じ数。夜襲は壁しか見ない。世界が止まったように感じる。この版は、手をつけていない場所を日とともに悪くする。掃いたピンが毎晩満員に戻れば、占領に意味がなく、シカゴは牧場になる。

世界はどう悪くなるか
発見済み、未占領、まだゾンビがいて、今の家の隣ではない地点は、通常なら 10 日目から毎晩一匹増えることがある。上限あり。気楽は 16 日目から、絶滅は 6 日目から。隣は増えない。輪の中を歩く燃料は今もゼロ。ゼロにした地点は、気楽と通常では戻らない。絶滅だけ、20 日目以降に一匹戻ることがある。占領した家は増えない。地図の感染は「低／中／高／危」で、数字ではない。夜襲は今も壁を打つ。傷は 8 日目、16 日目で一段ずつ上がる。絶滅はさらに重い。

四つの言葉と、普通
戦闘は近接、銃、迂回のまま。今戦に言葉が一つ乗ることがある。新しい操作ではない。即時戦闘でもない。
普通——基準。最初の週はほとんどこれ。
先に来た——5 日目から（絶滅は早く、気楽は遅い）。迂回はより高い隠密が要る。近接の失敗は痛い。
厚い——8 日目から。近接の数を一つ減らす。最低は一。銃は変わらない。
叫ぶ——10 日目から。戦いのあと、その地点に一、二匹増えることがある。上限は超えない。
異変——15 日目より前には出ない。稀で、遅く、痛い。遠い街の見方を変えるためのもの。突然死のためのものではない。
シカゴの最後は言葉を一つ強制できる。見たことのない言葉は資料に開かない。

桶と装備
通常の桶二級は食料 2 で燃料 1。一級は 3。絶滅の二級は 3 で、一晩搾って一晩休む。先に食い、先に腐り、残りが桶へ。日誌に等級と食料。隣は歩いて行く。シカゴとゲイリーは今も全額。
装備は技能等級を足さない。迂回、識別、一晩二件——門は鍛えた等級。手袋は壁と装備を少し多く直す。隠密の服は捜索の音を減らし、迂回を早開けしない。医療は回復を少し増やす。戦闘は近接の骰だけ。手袋は手間を省く。卒業ではない。

動かさない
薬草、工房、伝説は閉じたまま。行動六、備蓄は有限、使った手、派遣、勝ちはシカゴ。変えない。

—

v0.2.1 · 2026-09-23
v0.2.1　帳が合う
公開修正

なぜこの版か
v0.2 が日を締めたあと、戻ってきた声：燃料がなくて出られない、貯水が三なのに水が減る、引っ越しても隣で燃料、題の死に方は一つ。この版はその四つ。薬草、工房、伝説は動かさない。

水
一人一晩 1。貯水 1 は 1 人分。2 は 2。3 は 3。三人と三級でその日は差し引きゼロ。四人目から每晚 1 不足。渇きの特性は 2 人分。16 日目の余分は貯水がないときだけ。今夜受けた水は翌朝。ボタンに「約 0.6」は書かない。日誌に飲んだ数と受けた数。

燃料
今の家の隣は歩いて行く。輪を出たら地図の数字。引っ越せば新しい隣は無料、古い輪はまた有料。シカゴとゲイリーは今も燃料。家に蒸留桶を建てられる。夜に誰かが搾油。一級は食料 3 で燃料 1、二級は 2。先に食い、先に腐り、残りが桶へ。一晩に一缶。人が就かなければ空。

モード
新しく始めるとき四枚。古い記録は通常。途中では変えられない。気楽：規則は同じ。飯と燃料は少し広い。死ぬ。通常：この版。絶滅：同じ道、袋は細く、遠いピンは高い。隣は今も 0。砂場：手と倉庫とつまみを自分で。クリアは砂場と記す。初日のあとに物資は足さない。

動かさない
勝ちはシカゴ。行動六、備蓄は有限、使った手だけが伸び、派遣。薬草はあと。

—

v0.2 · 2026-09-22
v0.2　三十晩のあと
公開更新

なぜこの版か
v0.1 は無料の原型。三十、四十晩生きて戻ってきた声：この先は何だ。壁は何のため、医務室はなぜ押せない、地図は掃いたのに二匹、装備の数字は何か、捨てられない、隠密が太りすぎ。この版はそれを文字のまま直す。別の戦場は開かない。

昼：行動六
一日は六。移動・捜索・戦闘・次の部屋は 1。建設 2、壁 1。撤退は眠らず、消費しない。場所の備蓄は有限。静かなら音はほぼ出ないが、徹底の四割ほど。騒げば呼ぶ。地図は「掃いた」と嘘をつかない。シカゴが遠い終わり。ゲイリーが南の鋼の門。

人：使った手が伸びる
技能は 0 から 10。使った手だけが伸びる。殴れば戦闘、漁れば捜索、耕せば農耕。各級に何が増えるか書いてある。生まれで伸び方が決まる。人が余れば派遣できる。一人は家に残し、多くて二人。薬草、板、小川。得意なものを先に取る。空手、傷、一日遅れ、温室、地下室、他人、地図がありうる。出撃ではない。

家：夜は入ってくる
壁が低く日が経つと夜襲。警戒と塔が少し減らす。食料が十を超えると腐る。要らない装備は捨てられる。まだ使える壊れは材になる。部屋も仕事も装備も、ボタンの横と資料に何のためか書いてある。これは文字のゲーム。字が規則。資料はゲームの中で開く。ダウンロードではない。

勝ちと、動かさなかったもの
シカゴを掃いて占領すれば勝ち。全滅は負け。記録はこの端末。タイトルに「続きから」。これはまだ文字。画素の戦闘、天候、派閥は入れない。タイトルにもこの ZIP にも出さない。

—

v0.1 · 2026-09-13
v0.1　最初の仕組み
無料プロトタイプ

何か
『もう一晩』は文字のゾンビ拠点。ケンタッキーの田舎から。中西部は本物の地図。職業、欠点、壊れた家。題が任務：もう一晩。永久死。料金も試用制限もない。金で脈は買えない。

一日
昼は出る。場所を選び、多くて三人、漁るか殴るか、袋を持って帰る。遠い街は燃料。夜は食い、飲み、炊き、耕し、直し、看り、見張り、無線。誰も就かない仕事は空転。眠ると日が変わる。

人
職業は八。初期技能と武器が決まる。特性は功も罪も。点は自分で。気分が底なら出られないし働けない。関係は動く。他人、顔見知り、友、恋人。片方が死ぬと、もう片方は折れる。

家
寝室が定員。台所は夕食を少し減らす。雨水が水を出す。畑は人が耕す。工房は「作る」を就けた夜だけ装備を直す。医務室で看護が効く。無線は地図を灯し、たまに声。塔が夜襲を削る。壁が夜の扉。新しい拠点を占領すると定員と部屋はそこの建物に従う。古い改修は持っていけない。

外出
見える場所を選ぶ。静かに漁るか、徹底するか、殴るか。銃は弾。側面は隠密。持ち帰ったものは倉庫、着られる。掃いてから引っ越せる。ベッドが足りなければ、占領は別の部屋で餓死するだけ。

死と記録
最後の一人が倒れたら終わり。記録はこの端末。消したら無い。タイトルの続きからがそれを読む。新しい生存は古いのを上書きする。

—

## 한국어

『하루만 더』는 무료 텍스트 좀비 거점이다. 켄터키 시골. 실제 중서 지도. 하룻밤, 목숨 하나. 요금 없음.

같은 개발 일지가 타이틀의 「개발 일지」에 있다. 이후 업데이트도 거기에 쓴다. itch에 사라지는 다른 글을 만들지 않는다.

v0.2.2 · 2026-09-24
v0.2.2　날이 나빠진다
공개 업데이트

이 판이 고치는 것
v0.2.1이 물과 연료의 장부를 맞춘 뒤에도, 지도의 숫자는 멈춰 있었다. 3주차에 안 가본 마을로 돌아가도 첫날과 같았다. 야습은 벽만 봤다. 세계가 멈춘 느낌이었다. 이 판은 손대지 않은 땅을 날이 갈수록 나쁘게 만든다. 치운 핀이 매일 다시 차면 점령은 의미가 없고, 시카고는 농장이 된다.

세계가 나빠지는 법
발견했고, 점령하지 않았고, 좀비가 남아 있고, 지금 집의 이웃이 아닌 지점은 보통 10일부터 하룻밤에 한 마리가 늘 수 있다. 상한이 있다. 캐주얼은 16일, 멸종은 6일. 이웃은 안 는다. 圈 안을 걷는 연료는 여전히 0. 0으로 만든 지점은 캐주얼과 보통에서 안 돌아온다. 멸종만 20일 이후 한 마리가 돌아올 수 있다. 점령한 집은 안 는다. 지도의 감염은 「낮음／중간／높음／위험」이지 숫자가 아니다. 야습은 여전히 벽을 친다. 피해는 8일, 16일에 한 단계씩 오른다. 멸종은 더 세다.

네 단어, 그리고 보통
전투는 근접, 총, 우회 그대로다. 한 판에 단어가 하나 붙을 수 있다. 새 조작이 아니고 실시간 전투도 아니다.
보통 — 기준. 첫 주에는 거의 이것뿐이다.
먼저 온 것 — 5일부터(멸종은 더 일찍, 캐주얼은 더 늦게). 우회는 더 높은 은밀이 필요하다. 근접 실패가 더 아프다.
두꺼운 것 — 8일부터. 근접 킬이 하나 준다. 최소는 하나. 총은 같다.
우는 것 — 10일부터. 싸움이 끝나면 그 지점에 한두 마리가 늘 수 있다. 상한을 넘지 않는다.
변이 — 15일 전에는 안 나온다. 드물고, 늦고, 아프다. 먼 도시를 보는 눈을 바꾸기 위한 것이다. 갑자기 죽이기 위한 것이 아니다.
시카고 마지막은 단어를 하나 강제할 수 있다. 아직 안 본 단어는 자료에 안 열린다.

통과 장비
보통에서 통 2급은 식량 2에 연료 1. 1급은 3. 멸종 2급은 3이고, 하루 짜고 하루 쉰다. 먼저 먹고, 먼저 썩고, 나머지가 통으로. 일지에 등급과 식량이 적힌다. 이웃은 걸어간다. 시카고와 게리는 전액.
장비는 기술 등급을 더하지 않는다. 우회, 식별, 하룻밤 두 건 — 문턱은 익힌 등급. 장갑은 벽과 장비를 조금 더 고친다. 은밀한 옷은 수색 소리를 줄이고 우회를 일찍 열지 않는다. 의료는 회복을 조금 늘린다. 전투는 근접 굴림만. 장갑은 힘을 덜어 준다. 졸업이 아니다.

안 건드린 것
약초, 공방, 전설은 닫혀 있다. 행동 여섯, 유한한 물자, 쓴 손, 파견, 승리는 시카고. 그대로다.

—

v0.2.1 · 2026-09-23
v0.2.1　장부가 맞다
공개 수정

왜 이 판인가
v0.2가 하루를 조인 뒤 돌아온 말: 연료가 없어 못 나간다, 집수 3인데 물이 준다, 이사해도 옆집에 연료, 타이틀의 죽는 법이 하나. 이 판은 그 넷이다. 약초, 공방, 전설은 안 건드린다.

물
한 사람 하룻밤 1. 집수 1은 1명분. 2는 2. 3은 3. 세 사람과 3급이면 그날 수지 제로. 네 번째부터 매일 1이 모자라다. 갈증 특성은 두 명분. 16일 추가 음수는 집수가 없을 때만. 오늘 받은 물은 내일 아침. 버튼에 「약 0.6」은 안 쓴다. 일지에 마신 수, 받은 수.

연료
지금 집의 이웃은 걸어간다. 그 圈을 벗어나면 지도의 숫자. 이사하면 새 이웃은 공짜, 옛 圈은 다시 받는다. 시카고와 게리는 여전히 연료. 집에 증류통을 지을 수 있다. 밤에 누가 「착유」. 1급은 식량 3에 연료 1, 2급은 2. 먼저 먹고, 먼저 썩고, 나머지가 통으로. 하룻밤에 한 통. 사람이 안 붙으면 빈 통.

모드
새 게임에서 카드 네 장. 옛 저장은 보통. 도중에 못 바꾼다. 캐주얼: 규칙은 같다. 밥과 기름이 조금 넓다. 죽는다. 보통: 이 판. 멸종: 같은 길, 가방은 적고, 먼 핀은 비싸다. 이웃은 여전히 0. 샌드박스: 손과 창고와 난이도를 네가 정한다. 클리어는 샌드박스로 적힌다. 첫날 이후 물자는 안 보탠다.

안 건드린 것
승리는 시카고. 행동 여섯, 재고는 유한, 쓴 손만 는다, 파견. 약초는 나중.

—

v0.2 · 2026-09-22
v0.2　30밤 이후
공개 업데이트

이 버전이 나온 이유
v0.1은 무료 원형이었다. 삼십, 사십 밤을 살고 돌아온 말: 이제 뭘 하나. 벽은 왜 있나, 의무실은 왜 안 올라가, 지도는 청소인데 두 마리, 장비 숫자는 뭔가, 버릴 수가 없다, 은밀이 너무 많다. 이 판은 그걸 텍스트 그대로 고친다. 다른 전장은 안 연다.

낮: 행동 6칸
하루 여섯 칸. 이동·수색·전투·다음 방은 1. 건설 2, 벽 1. 철수는 자지 않고 칸을 안 쓴다. 장소 재고는 유한하다. 은밀은 거의 조용하고, 철저의 약 40%. 시끄러우면 부른다. 지도는 청소했다고 거짓말하지 않는다. 시카고가 먼 끝. 게리가 남쪽 강철 문.

사람: 써야 는다
기술 0에서 10. 실제로 쓴 손만 는다. 싸움은 전투, 뒤지는 수색, 밭은 농사. 각 급이 무엇을 더하는지 적혀 있다. 출발이 배우는 속도를 잠근다. 손이 남으면 파견할 수 있다. 하나는 집, 최대 둘. 약초, 판자, 개울. 익숙한 것을 먼저 찾는다. 빈손, 상처, 하루 늦음, 온실, 지하실, 사람, 지도. 출격이 아니다.

집: 밤이 들어온다
벽이 낮고 날이 갈수록 야습. 경계와 탑이 조금 줄인다. 식량 10이 넘으면 썩는다. 안 쓰는 장비는 버릴 수 있다. 어느 정도 남은 내구는 자재가 된다. 방, 일, 장비는 버튼 옆과 자료실에 용도가 있다. 텍스트 게임이다. 글자가 규칙이다. 자료실은 게임 안에서 연다. 다운로드가 아니다.

이기는 법, 안 건드린 것
시카고를 쓸고 점령하면 이긴다. 전원이 죽으면 진다. 저장은 이 기기. 타이틀에 「이어하기」. 아직 텍스트다. 픽셀 전투, 날씨, 세력은 빼 둔다. 타이틀에도 이 압축에도 안 넣는다.

—

v0.1 · 2026-09-13
v0.1　첫 시스템
무료 원형

무엇인가
『하루만 더』는 텍스트 좀비 거점이다. 켄터키 시골에서 시작한다. 중서는 실제 지도. 직업, 단점, 허물어진 집. 제목이 임무다: 하룻밤만 더. 영구 사망. 요금도 체험 제한도 없다. 돈으로 맥박은 못 산다.

하루
낮에 나간다. 장소를 고르고 최대 셋, 뒤지거나 싸우고 가방을 들고 돌아온다. 먼 도시는 연료. 밤에는 먹고 마시고 요리하고 갈고 고치고 간호하고 지키고 무전을 듣는다. 빈 일은 헛돈다. 잠이 날을 넘긴다.

사람
직업 여덟. 시작 기술과 무기가 잠긴다. 특성은 득과 실. 점수는 네가 센다. 기분이 바닥이면 문 밖도 일도 없다. 관계는 움직인다. 남, 아는 사이, 친구, 연인. 하나가 죽으면 다른 하나가 꺾인다.

집
침실이 정원. 부엌은 저녁을 조금 줄인다. 집수기가 물을 만든다. 밭은 사람이 간다. 공방은 「제작」을 넣은 밤에만 장비를 고친다. 의무실이 있어야 간호가 된다. 무전은 지도를 밝히고 가끔 목소리를. 탑이 야습을 깎는다. 벽이 밤의 문. 새 거점을 점령하면 정원과 방은 그 건물을 따른다. 옛 업그레이드는 안 가져간다.

외출
보이는 핀을 고른다. 조용히 뒤지거나, 철저히 하거나, 싸운다. 총은 탄약. 측면은 은신. 가져온 것은 창고, 입을 수 있다. 쓸어야 이사한다. 침대가 모자라면 점령은 다른 방에서 굶는 일이다.

죽음과 저장
마지막 한 사람이 쓰러지면 끝. 저장은 이 기기. 지우면 없다. 타이틀의 이어하기가 읽는다. 새 생존은 옛것을 덮는다.

—
