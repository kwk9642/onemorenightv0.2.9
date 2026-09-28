# One More Night — itch Description

Paste the block for your language into the itch.io project Description.
The in-game Dev log is this file. Future public updates: add an entry at the top of src/game/devlog.ts, rebuild, paste again. Do not write a second changelog on itch.

## 中文

再活一晚（One More Night）是免費文字僵屍據點。肯塔基鄉下起家，美國中西部是真的地圖。一晚一命。不收費。

開發日誌寫在遊戲標題的「開發日誌」裡，和這頁同一份。以後每次更新都從這裡報告，不另開一篇消失的 itch 文。

v0.2.8 · 2026-09-28
v0.2.8　路程、屋子、路上的人
公開更新

位置要情報滿了才入圖
開局只看得見屋子和近處幾個鎮。下一個鎮有自己的情報，到 100% 才在地圖上出現，並寫著離你幾英里。大約 190 英里以外，現在加不到情報。委任回來隨機加一截。搜索撿到海報，一個近處地名直接補滿。搬進清空的據點，每個夠近、還沒入圖的鄰鎮加 25%。電台不把遠處的城畫出來。完整版五十個州都有鎮。網頁版只開二十個州，從肯塔基走到芝加哥，再加上南邊和東邊的鄰州。阿拉斯加、夏威夷和西岸在安卓版和 Steam 版。

屋子每晚都在耗
蓋好的設施每晚增加耗損。有人做對應的工作，加得少。沒人管，加得多。到滿就停機，那一台不再產水、煮飯或收訊。修好要 1 建材、1 零件，再花一格行動。零件在店、倉、車站、鎮中心搜索時有機會撿到。日子分三段。正常大約第 15 晚進入稀薄，第 31 晚進入這個季節。休閒更晚，滅絕更早。這個季節裡集水器凍住，當晚不產水，沒人管的機器也耗得更快。

每一局二十四股活人
開局那一州有兩股，鄰州各一股，其餘在別的州。沒走到那一州就碰不上。第一次見面是中立。讓路可以變友好，搶或動手就變敵對。友好之後可以請他們說下一個鎮、用東西交換、派一個人去幫他們守一夜，或請他們三天內幫你守屋。敵對而且已經把你家問到 100，才找得到屋子，牆低就可能拆停掉的機器。你把屋子搬走，他們這份進度清掉，不再知道新位子。他們自己搬走，你也不再知道他們去了哪。兩股之間會自己談妥或決裂。你沒見過、鎮也還沒入圖，日誌不寫，事情仍會發生。

草藥怎麼認，雜誌做什麼
採藥才帶草，採集只帶食物。株數看農耕、搜刮、醫療裡最高的那個：三級以內一株，四到七是兩株，八到十是三株。醫療或農耕到 3，採的人認得。不然是未識的草，回到家裡，有醫療 3 以上的人就鑑定。用藥看家裡最高醫療。到 5，病況下面寫方子：敷還是泡、哪幾株。開放傷口和惡化要敷車前、蓍或黃金印章。家裡醫療 8 以上才會清掉惡化，6 到 7 多半只壓一晚。熱病泡紫錐花或接骨木，這兩味第 8 晚才有。僵屍創沒有草可對。雜誌任何地點、任何職業都能撿到，只加情緒。閱讀讓人不會因為情緒過低而出不了門。同一本讀三次就散了。

一百張臉，進度可以存成檔案
選人有一百張。勢力和路上遇見的人從這裡面抽，避開家裡已經在用的臉。自己上傳的照片不佔這一百張。瀏覽器裡的進度跟網址綁在一起，換一次上傳就可能讀不到。主畫面和屋子裡可以另存到本機，檔名帶著天數。新版本用「從本機讀取」把檔選回去。天數、人、屋子、倉庫和已經找到的鎮都在。檔裡沒有的新鎮和勢力會補上，不會清成第一天。

手機
畫面維持直向。點文字框時，系統不會把整頁放大。底部按鈕讓出手機的圓角和手勢列。安卓可以裝 APK，裝好之後進度留在這個 App 裡，更新同一個 App 不會因為換網址而消失。iPhone 要在 Mac 上用 Xcode 封成安裝包，才能送 App Store。這台打包機器沒有 Mac，所以 iOS 工程在一起，安裝包要你在自己的 Mac 上編。

—

v0.2.7 · 2026-09-27
v0.2.7　醫生會寫方子
公開更新

玩家實際碰到的
有人把醫療、搜刮、農耕都點到 10，派出去採藥，回來還是一株。沒有醫療的人帶回來的是未識的草。醫療 10 拿去敷惡化，日誌連續三天只寫「壓住一晚，清不掉」，不寫用了哪一株，也不寫病人到底缺什麼。所以分不出是草用錯，還是數字不夠。這一版改的就是這三件事。僵屍創仍然無藥。

帶回來幾株，誰認得
株數看這個人的農耕、搜刮、醫療裡最高的那個。0 到 3 是一株，4 到 7 是兩株，8 到 10 是三株。三株是抽三次，不是同一株複製。搜刮只增加株數，不負責認藥。醫療或農耕達到 3，採的人當場認得。兩邊都不到 3，先標未識。回到庇護所時，只要家裡有醫療達到 3 的人在（留在家，或跟著這趟回來），立刻把未識的草對上名字，日誌寫是誰鑑定的。醫生還在另一趟路上，這把草先保持未識，等他回來或當晚結帳再鑑定。沒人鑑定就拿去泡，仍然會吐。

用藥看家裡的醫生，日誌要寫明白
舊版用藥只看被敷的那個人。病人自己醫療 6，家裡醫生 10，日誌仍按 6 寫清不掉。現在看家裡最高醫療，人要在家，不看出門的人。草藥那一欄會寫現在是誰的幾級。按鈕上寫人名，敷誰、泡誰分得開。對的敷藥是車前、蓍、黃金印章。家裡醫療 8 到 10，開放傷口和已經惡化的都會清掉。6 到 7 大約一半清掉，否則只壓一晚，日誌寫還沒到 8。5 以下連壓都壓不住。熱病和異變熱要泡紫錐花或接骨木，紫錐花和接骨木第 8 晚才出現。惡水泡薄荷，肺熱泡松針。用錯會寫草名、病名、以及該敷還是該泡。敷和泡不能換。

方子寫在病況下面
家裡最高醫療不到 5，病況底下只寫還寫不出方。到了 5，每一條病都寫三件事：誰的什麼病、敷還是泡、哪幾株。家裡已經有的，那一株旁邊標「方子」。沒有的，寫派人採藥，不要派採集。開放傷口和惡化是敷車前、蓍或黃金印章。熱病和異變熱是泡紫錐花或接骨木。惡水是泡薄荷。肺熱是泡松針。醒著和認錯沒有草，休息，情緒用雜誌，不要亂泡。僵屍創單獨寫：醫生寫不出方，任何草都沒用。惡化會再加一句：醫療到 8，敷對會清掉；不到 8，多半只壓一晚。

—

v0.2.4 · 2026-09-27
v0.2.4　先把情緒翻回來
公開更新

情緒死鎖
滅絕加上已經晚了，情緒太低就出不了門，休息補不回。這一版加閱讀。雜誌任何地點、任何職業都能撿到，不設稀有。只加情緒。已經晚了開局給兩本，工作預設閱讀。讀過的人過夜後情緒不會掉回鎖死線以下。

草藥怎麼來
據點寫明：採藥不是採集。前七晚五味。農耕決定好不好認，醫療決定藥濃不濃。畦要等溫室。道具旁都寫取得途徑。

沒動的
工場、藍圖、傳奇、相片仍關。六格、鄰居免油、油桶、裝備不加技能等級，都不改。

—

v0.2.3 · 2026-09-24
v0.2.3　藥這時候才有用
公開更新

這一版要解決什麼
變異讓傷不再是睡一晚就好。草藥學這時候搬上來。前七晚只五味。三個用法：敷、泡、不吃。醫生認，農夫種。醫療越高，藥越像樣。咬傷仍然無藥。

病
病要有來源。開放傷口兩晚不敷會惡化。惡水來自生水。異變熱只在第 15 晚後、被異變或皮厚的近身打傷。認錯的草泡了，一晚不能出門。每人最多兩種。

已經晚了
情境模式的第 1 關。職業自訂。第 8 晚醒來，牆低、糧少、帶傷帶熱。不是僵屍感染。芝加哥仍是終點。通關會註明。

—

v0.2.2 · 2026-09-24
v0.2.2　日子會變壞
公開更新

這一版改了什麼
還沒清的鎮會慢慢變擠，鄰居不長，清過的點不會每晚長滿。第 5 晚起可能碰上先到的，第 8 晚皮厚的，第 10 晚會叫的，第 15 晚才有異變。滅絕更早，休閒更晚。夜襲傷害隨日子略升。地圖上有感染高低，不是精確數字。

四種之外的普通
普通的還是基準。先到的讓包抄更難、近身失手更痛。皮厚的近戰少殺一隻，槍不受影響。會叫的打完會再引來一兩隻，不超過上限。異變稀、晚、更危險。同一場一種。不新開即時戰鬥。

油桶與裝備
油桶二級、正常：2 食物換 1 油。一級仍是 3。滅絕二級是 3，而且榨一晚歇一晚。日誌寫油桶等級和吃了幾份。裝備不再加技能等級，也不提早開包抄。手套多修一點牆和裝備，潛行裝讓搜索 quieter，醫療裝多回一點血，戰鬥裝只加近戰骰。門檻仍看練出來的等級。

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

v0.2.8 · 2026-09-28
v0.2.8  Roads, the house, and people on them
Public update

A place appears when the intel is full
At the start you see the house and a few towns close by. The next town has its own intel. It appears at 100%, with the miles from you. Past about 190 miles you cannot add intel yet. A dispatch adds a random slice. A poster found while searching fills one nearby name. Moving into a cleared site adds 25% to each nearby town still off the map. The radio does not draw distant cities. The full version has towns in all fifty states. The web version opens twenty, from Kentucky to Chicago and the states south and east of that. Alaska, Hawaii, and the west coast are on Android and Steam.

The house wears every night
A built facility gains wear every night. The matching job adds less. No one on that job adds more. At full wear it halts, and that machine no longer makes water, cooks, or receives. Fixing it takes 1 material, 1 part, and one action. Parts can turn up when you search a shop, a warehouse, a station, or a town center. The days have three stretches. On Normal, about night 15 is the thin stretch and about night 31 is the season. Casual is later. Extinct is earlier. In that season the collector freezes, that night makes no water, and untended machines wear faster.

Twenty-four groups each run
Two groups start in your state, one in each neighboring state, and the rest farther away. You do not meet them until you reach that state. The first meeting is neutral. Yielding the road can make them friendly. Taking or fighting makes them hostile. After that you can ask them to name the next town, trade, send one person to help them hold for a night, or ask them to help hold your house for three days. A hostile group finds the house only after the questioning reaches 100. A low wall can mean a halted machine. If you move, that progress is wiped and they do not know the new house. If they move, you do not know where they went. Two groups can make terms or split on their own. If you have not met them and the town is not on the map, the log stays quiet. It still happens.

How herbs are named, and what a magazine does
Herbs come from the Herbs task. Forage is food. The count uses the highest of Farm, Scavenge, and Medical: one stem through 3, two from 4 to 7, three from 8 to 10. Medical or Farm at 3, and the picker names them. Otherwise they come home unnamed, and someone at the house with Medical 3 or higher names them. A dose uses the best Medical at home. At 5 the sickness line writes poultice or brew, and which plants. An open wound and a wound gone bad want plantain, yarrow, or goldenseal as a poultice. Medical 8 or higher at home clears the bad wound. At 6 or 7 it usually only holds a night. Fever wants coneflower or elder, brewed, and those two appear on night 8. The bite has no herb. A magazine can be found at any place by any occupation, and it only raises mood. Reading keeps a person from being locked indoors by mood. The same copy falls apart on the third read.

A hundred faces, and a file you can keep
The face picker has one hundred pictures. Groups and people met on the road draw from them, and skip a face already in the house. A picture you upload is not one of the hundred. Progress kept only in the browser is tied to the address, and a new upload can make it unreadable. The title screen and the house can save a file named with the day. On the new version, Load a file brings it back. The day, the people, the house, the stores, and towns already found stay. Towns and groups the file did not have are filled in. The run is not reset to day one.

Phones
The screen stays portrait. Tapping a text field does not zoom the whole page. The bottom buttons leave room for the phone's corners and the gesture bar. Android installs from an APK. Once it is installed, progress stays inside that app, and updating the same app does not lose it because an address changed. An iPhone build has to be archived in Xcode on a Mac before it can go to the App Store. This machine has no Mac, so the iOS project is included and the installable package has to be built on your Mac.

—

v0.2.7 · 2026-09-27
v0.2.7  The doctor writes it down
Public update

What players ran into
People put Medical, Scavenge, and Farm at 10, sent them for herbs, and still got one stem. Anyone without Medical came home with an unnamed plant. Medical 10 on a wound gone bad produced the same line for three days: held one night, not a cure. The log never named the plant, and never said what the patient needed. You could not tell a wrong herb from a low number. This build is those three things. The bite still has no herb.

How many, and who can name them
The count uses the highest of that person's Farm, Scavenge, and Medical. 0–3 is one stem, 4–7 is two, 8–10 is three. Three means three draws, not one plant copied. Scavenge adds stems and does not name anything. Medical or Farm at 3, and the picker names them on the spot. Under 3 on both, they come home unnamed. When the party is back, anyone at the house with Medical 3 or higher — the one who stayed, or the one who just walked in — names the unnamed plants. The log says who. If the doctor is still out on another trip, the plants stay unnamed until they return, or until that night's tally. Brew an unnamed plant and you are still sick from it.

The dose uses the doctor at home, and the log has to say so
The old dose looked only at the person you clicked. A patient at Medical 6 and a doctor at 10 still logged the 6, so it never cleared. A dose now uses the best Medical of someone at the house, not someone still on the road. The herb row names who, and what rank. The buttons name the person, so poultice and brew are not anonymous. The right poultice is plantain, yarrow, or goldenseal. At 8–10 an open wound and a wound gone bad both clear. At 6–7 about half of the bad wounds clear; the rest hold one night, and the log says you are not at 8 yet. Under 5 it does not even hold. Fever and mutant heat want coneflower or elder, brewed, and those two plants only show from night 8. Flux wants mint. The chest wants pine. A miss names the plant, the sickness, and whether it should have been a poultice or a brew. The two do not swap.

The script sits under the sickness
If the best Medical at home is under 5, the sickness line only says they cannot write a script yet. At 5, every illness gets three facts: whose sickness, poultice or brew, and which plants. A plant you already have is marked script. One you do not have says to dispatch Herbs, not Forage. An open wound and a wound gone bad want a poultice of plantain, yarrow, or goldenseal. Fever and mutant heat want coneflower or elder, brewed. Flux wants mint. The chest wants pine. Wakeful and a wrong-plant stomach have no herb: rest, and a magazine for mood. Do not brew at random. The bite is its own line. No script. No herb touches it. A wound gone bad adds one more sentence: at 8 the right poultice clears it; under 8 it usually only holds a night.

—

v0.2.4 · 2026-09-27
v0.2.4  Read before you walk
Public update

The mood lock
Extinct plus Already late locked you indoors, and rest did not pay the mood back. Reading is a night job. Magazines drop on any search for any occupation. No rare tier. Mood only. Already late starts with two, job set to Read. A reader does not wake below the lock.

How herbs arrive
The house now says: Herbs is not Forage. Five plants for seven nights. Farm names, Medical doses. Beds wait on the greenhouse. Items say how they are found.

Left alone
Workshop, blueprints, legend sets, portraits stay off. Six actions, neighbour fuel, the still, and gear ranks stay as they were.

—

v0.2.3 · 2026-09-24
v0.2.3  Medicine is late on purpose
Public update

Why this build
Mutants made a night of sleep not enough. Herbalism comes up now. Five plants for seven nights. Poultice, brew, or leave it. The doctor names. The farmer grows. Higher medical is a better dose. The bite still has no herb.

Sickness
Sickness needs a cause. An open wound turns after two nights. Flux comes from raw water. Mutant heat only after night 15, and only if a mutant or a brute cut you. Brew an unnamed plant and you stay in. Two ailments at most.

Already late
Chapter 1 of Scenarios. Your job is yours. Night 8, low wall, little food, wound and fever. Not the bite. Chicago is still the end. A win is marked.

—

v0.2.2 · 2026-09-24
v0.2.2  The days get worse
Public update

What changed
Pins you have not cleared get slowly thicker. Neighbors do not. Cleared pins do not refill every night. From day 5 a fast one may arrive first, day 8 a thick one, day 10 a screamer, day 15 a mutant. Extinct earlier, casual later. Night raids hit a little harder later. The map shows infection as a word, not a precise number.

Four words, plus the ordinary
Walkers stay the baseline. Runners make flank harder and a missed swing hurt more. Brutes cost one melee kill; guns ignore that. Screamers pull one or two more after the fight, under the cap. Mutants are rare, late, and worse. One kind a fight. No new real-time combat.

The still and the kit
Still level 2 on Normal: 2 food for 1 fuel. Level 1 is still 3. Extinct level 2 is 3, and the still rests every other night. The log names the still level and the food. Gear no longer adds skill ranks and does not unlock flank. Gloves patch a little more wall and kit. Quiet clothes cut search noise. Medical kit heals a little more. Combat kit only adds to the melee roll. Gates still use the rank you trained.

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

v0.2.8 · 2026-09-28
v0.2.8　道、家、道の人
公開更新

位置は情報が満杯になってから
最初に見えるのは家と近い町だけ。次の町は自分の情報を持ち、100% で地図に入り、何マイルかを書く。およそ 190 マイルより先は、今は情報を足せない。派遣の帰りはランダムに一区切り。搜索でポスターを拾うと、近い地名の一つが満杯になる。掃いた地点へ移ると、十分近くてまだ入っていない隣町がそれぞれ 25%。無線は遠い都市を描かない。完全版は五十州に町がある。ウェブは二十州で、ケンタッキーからシカゴ、その南と東。アラスカ、ハワイ、西海岸は Android 版と Steam 版。

家は毎夜減る
建てた施設は毎夜減る。対応する仕事があれば少ない。誰もいなければ多い。満タンで停止し、水も飯も受信もしない。直すには建材 1、部品 1、行動 1。部品は店、倉、駅、町の中心の搜索で出ることがある。日は三つ。通常はおよそ 15 日目から薄い時期、31 日目からこの季節。気楽は遅く、絶滅は早い。その季節は集水器が凍り、その夜は水が出ず、放っておいた機械も減りが速い。

一局に二十四の群れ
開始の州に二つ、隣州に一つ、残りは遠い州。その州に着くまで会わない。最初は中立。道を譲れば友好になり得る。奪うか手を出せば敵対。友好のあと、次の町を聞き、物を換え、一人を一夜送り、三日家を守らせることができる。敵対が家を 100 まで聞いて、初めて家を見つけられる。壁が低ければ止まった機械を壊し得る。家を移せばその進捗は消え、新しい場所は知られない。相手が移れば、行き先は分からない。二つの群れは自分たちで話したり決裂したりする。会っておらず町も地図になければ、日誌は黙る。出来事は起きる。

薬草の見分けと、雑誌の仕事
採薬だけが草を持ち帰る。採集は食料。本数は農耕・蒐集・医療のいちばん高い方。3 までは一本、4 から 7 は二本、8 から 10 は三本。医療か農耕が 3 なら、採った者が名を付ける。そうでなければ未識別で、家に医療 3 以上がいれば鑑定する。薬は家の最高医療で見る。5 で、病の下に貼るか煎じるか、どの草かを書く。開いた傷と悪化は車前、蓍、ゴールドシールを貼る。家の医療が 8 以上で悪化は消える。6 から 7 はたいてい一晩。熱は紫錐花か接骨木を煎じ、この二種は 8 日目から。噛み傷に草はない。雑誌はどの地点でもどの職業でも拾え、情緒だけ足す。読書は、情緒が低くて出られない状態を避ける。同じ一冊は三度で散る。

百の顔と、残せるファイル
顔は百枚。群れと道で会う人はここから引き、家ですでに使っている顔は避ける。自分で上げた写真はこの百枚に入らない。ブラウザだけの進捗は住所に縛られ、アップロードを替えると読めなくなることがある。題名と家でファイルに保存できる。名前に日数が入る。新しい版で「ファイルから読む」。日数、人、家、倉庫、すでに見つけた町は残る。ファイルに無い新しい町と群れは埋める。一日目には戻さない。

電話
画面は縦のまま。文字欄を押してもページ全体は拡大しない。下のボタンは角とジェスチャーバーを空ける。Android は APK で入る。入ったあとの進捗はそのアプリの中に残り、同じアプリを更新しても住所が変わったせいで消えない。iPhone は Mac の Xcode で包んでから App Store に出せる。この機械に Mac はない。iOS の工程は同梱し、インストール包は自分の Mac で作る。

—

v0.2.7 · 2026-09-27
v0.2.7　医者が処方を書く
公開更新

プレイヤーが踏んだこと
医療も蒐集も農耕も 10 にして採薬に出したのに、戻るのは一本。医療がない者は未識別の草。医療 10 で悪化を貼っても、三日とも「一晩押さえた。消えない」。どの草か、患者に何が要るか、書かない。草が違うのか数字が足りないのか分からない。この版はその三つ。噛み傷は今も薬がない。

何本持ち帰るか、誰が名を付けるか
本数はその人の農耕・蒐集・医療のいちばん高い方。0 から 3 は一本、4 から 7 は二本、8 から 10 は三本。三本は三回引くので、同じ草の複製ではない。蒐集は本数だけで、名は付けない。医療か農耕が 3 なら、採ったその場で分かる。両方 3 未満なら、いったん未識別。庇護所に戻ったとき、家に医療 3 以上の者がいれば（残っていた者でも、この旅から戻った者でも）すぐに名を付ける。日誌に誰が鑑定したか書く。医者が別の旅の途中なら、戻るかその夜の締めまで未識別のまま。鑑定前に煎じれば、今も吐く。

薬は家の医者で見る。日誌は明記する
旧版は貼られた本人の医療だけを見た。患者が 6 で家の医者が 10 でも、日誌は 6 として消えないと書いた。今は家にいる者の最高医療を見る。まだ旅の途中の者は数えない。薬草の欄に、今だれの何級かを書く。ボタンに人名があるので、だれに貼り、だれに飲ませるか分かる。正しい貼り薬は車前、蓍、ゴールドシール。家の医療が 8 から 10 なら、開いた傷も悪化も消える。6 から 7 は悪化のおよそ半分が消え、残りは一晩。日誌に、まだ 8 ではないと書く。5 未満は押さえられない。熱と異変熱は紫錐花か接骨木を煎じる。この二種は 8 日目から。悪水は薄荷、肺は松。間違いには草の名、病の名、貼るべきか煎じるべきかを書く。貼ると煎じるは替わらない。

処方は病の下に書く
家の最高医療が 5 未満なら、病の下には、まだ処方を書けない、とだけ出す。5 に届くと、一つの病に三つ書く。だれの何の病か、貼るか煎じるか、どの草か。家にある草には「処方」と付ける。ないときは、採薬を派れ、採集ではない、と書く。開いた傷と悪化は車前、蓍、ゴールドシールを貼る。熱と異変熱は紫錐花か接骨木を煎じる。悪水は薄荷。肺は松。眠れなさと思い違いは草がない。休む。情緒は雑誌。適当に煎じない。噛み傷は別の一行。処方はない。どの草も無効。悪化にはもう一文。医療 8 なら正しい貼り薬で消える。8 未満はたいてい一晩。

—

v0.2.4 · 2026-09-27
v0.2.4　先に頁を捲る
公開更新

情緒の行き止まり
絶滅と「もう遅い」で外に出られず、休息では戻らなかった。読書を足す。雑誌はどこでも誰でも。希少なし。情緒だけ。開局二冊。

薬草の入り方
採薬は採集ではない。七晩は五味。農耕は見分け、医療は濃さ。畝は温室待ち。

動かさない
工房、藍図、伝説、写真は閉じたまま。

—

v0.2.3 · 2026-09-24
v0.2.3　薬が必要になるのは今
公開更新

この版
異変のあと、一晩では足りない。薬草を上げる。最初の七晩は五味。貼る、煎じる、食べない。医者が見分け、農夫が育てる。噛み傷は無効。

病
病には原因。開放創を二晩放置で悪化。異変熱は 15 日目以降、異変か厚い一匹の近接だけ。名のない草を煎じると一晩出られない。

もう遅い
状況モードの第1関。職業は自分で。8日目、低い壁、少ない糧、傷と熱。噛み傷ではない。勝ちはシカゴ。

—

v0.2.2 · 2026-09-24
v0.2.2　日は悪くなる
公開更新

何が変わったか
掃いていない町は少しずつ増える。隣は増えない。掃いた場所が毎晩満員には戻らない。5 日目から速い一匹、8 日目から厚い一匹、10 日目から叫ぶ一匹、15 日目から異変。絶滅は早く、気楽は遅い。夜襲の傷は日とともに少し増える。地図の感染は言葉。

四つと、普通
普通は基準。速い一匹は迂回を難しくし、近接の失敗を痛くする。厚い一匹は近接の数を一つ減らす。銃は同じ。叫ぶ一匹は戦闘後に一、二匹呼ぶ。上限を超えない。異変は稀で遅く、危ない。一戦一種。即時戦闘は作らない。

桶と装備
桶二級、通常は食料 2 で燃料 1。一級は 3。絶滅の二級は 3 で、一晩搾って一晩休む。日誌に等級と食料。装備は技能等級を足さない。迂回も早開けしない。手袋は壁と装備を少し多く直し、隠密の服は捜索の音を減らし、医療は回復を少し増やし、戦闘は近接の骰だけ。門は鍛えた等級。

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

v0.2.8 · 2026-09-28
v0.2.8　길, 집, 길 위의 사람
공개 업데이트

위치는 정보가 차야 들어온다
처음에는 집과 가까운 마을만 보인다. 다음 마을은 자기 정보가 있고, 100%가 되면 지도에 들어오며 몇 마일인지 적힌다. 약 190마일을 넘으면 지금은 정보를 더하지 못한다. 파견이 돌아오면 무작위로 한 토막. 수색에서 포스터를 주우면 가까운 지명 하나가 찬다. 치운 거점으로 이사하면, 충분히 가깝고 아직 안 들어온 이웃이 각각 25%. 무전기는 먼 도시를 그리지 않는다. 완전판은 쉰 개 주에 마을이 있다. 웹은 스무 개 주, 켄터키에서 시카고와 그 남쪽, 동쪽이다. 알래스카, 하와이, 서해안은 안드로이드와 Steam이다.

집은 매일 밤 닳는다
지은 시설은 매일 밤 닳는다. 맞는 일을 하면 적게 더하고, 아무도 없으면 많이 더한다. 가득 차면 멈추고, 그 기계는 물도 밥도 수신도 안 한다. 고치려면 자재 1, 부품 1, 행동 한 칸. 부품은 가게, 창고, 역, 마을 한가운데를 수색할 때 나올 수 있다. 날은 세 구간이다. 보통은 대략 15일째에 옅은 구간, 31일째에 이 계절. 캐주얼은 더 늦고 절멸은 더 이르다. 그 계절에는 집수기가 얼고, 그날 밤은 물이 안 나오며, 돌보지 않은 기계도 더 빨리 닳는다.

한 판에 스물네 패
시작한 주에 둘, 이웃 주에 하나, 나머지는 먼 주. 그 주에 닿기 전에는 만나지 않는다. 첫 만남은 중립. 길을 양보하면 우호가 될 수 있다. 빼앗거나 손을 대면 적대. 우호가 된 뒤, 다음 마을을 묻고, 물건을 바꾸고, 한 사람을 하룻밤 보내고, 사흘 동안 집을 지키게 할 수 있다. 적대는 집을 100까지 캐물어야 찾을 수 있다. 벽이 낮으면 멈춘 기계를 뜯을 수 있다. 집을 옮기면 그 진행은 지워지고 새 자리는 모른다. 그들이 이사하면 어디로 갔는지 모른다. 두 패는 스스로 이야기하거나 틀어진다. 만난 적 없고 마을도 지도에 없으면 일지는 잠잠하다. 일은 그래도 일어난다.

약초를 아는 법, 잡지가 하는 일
채약만 풀을 가져온다. 채집은 식량. 포기 수는 농사, 수색, 의료 가운데 가장 높은 것. 3까지는 한 포기, 4에서 7은 두 포기, 8에서 10은 세 포기. 의료나 농사가 3이면 캔 사람이 이름을 붙인다. 아니면 이름 없는 풀이고, 집에 의료 3 이상이 있으면 감별한다. 약은 집의 가장 높은 의료로 본다. 5가 되면 병 아래에 붙일지 달일지, 어느 풀인지를 적는다. 열린 상처와 악화는 질경이, 서양톱풀, 골든씰을 붙인다. 집의 의료가 8 이상이면 악화가 걷힌다. 6에서 7은 대개 하룻밤. 열은 콘플라워나 엘더를 달이고, 그 둘은 8일부터 나온다. 물림에는 풀이 없다. 잡지는 어느 장소, 어느 직업이든 주울 수 있고, 기분만 올린다. 읽기는 기분 때문에 못 나가는 상태를 피하게 한다. 같은 한 권은 세 번이면 흩어진다.

백 개의 얼굴, 남길 수 있는 파일
얼굴은 백 장이다. 무리와 길에서 만나는 사람은 여기서 뽑고, 집에서 이미 쓰는 얼굴은 피한다. 직접 올린 사진은 이 백 장에 들어가지 않는다. 브라우저에만 둔 진행은 주소에 묶여, 업로드를 바꾸면 못 읽을 수 있다. 첫 화면과 집에서 파일로 남길 수 있다. 이름에 날짜가 들어간다. 새 판에서 「파일에서 읽기」로 되돌린다. 날짜, 사람, 집, 창고, 이미 찾은 마을은 그대로다. 파일에 없던 새 마을과 무리는 채운다. 첫날로 되돌리지 않는다.

전화기
화면은 세로로 둔다. 글칸을 눌러도 페이지 전체가 확대되지 않는다. 아래 단추는 모서리와 제스처 막대를 비운다. 안드로이드는 APK로 설치한다. 설치한 뒤의 진행은 그 앱 안에 남고, 같은 앱을 업데이트해도 주소가 바뀌어 사라지지 않는다. 아이폰은 Mac의 Xcode로 묶어야 App Store에 올릴 수 있다. 이 기계에는 Mac이 없다. iOS 공정은 같이 두고, 설치 파일은 자신의 Mac에서 만든다.

—

v0.2.7 · 2026-09-27
v0.2.7　의사가 처방을 적는다
공개 업데이트

플레이어가 밟은 것
의료, 수색, 농사를 전부 10으로 두고 채약을 보내도 한 포기였다. 의료가 없는 사람은 이름 없는 풀을 가져왔다. 의료 10으로 악화를 붙여도 사흘 내내 「하룻밤 눌렀다. 없애지 못한다」. 어느 풀인지, 환자에게 무엇이 필요한지 안 적었다. 풀이 틀린 건지 숫자가 모자란 건지 알 수 없었다. 이 판은 그 세 가지다. 물림은 여전히 약이 없다.

몇 포기, 누가 이름을 붙이나
포기 수는 그 사람의 농사, 수색, 의료 가운데 가장 높은 것. 0에서 3은 한 포기, 4에서 7은 두 포기, 8에서 10은 세 포기. 세 포기는 세 번 뽑는 것이지 같은 풀의 복제가 아니다. 수색은 포기 수만 늘리고 이름은 안 붙인다. 의료나 농사가 3이면 캔 자리에서 알아본다. 둘 다 3 미만이면 일단 이름 없음. 피난처로 돌아오면, 집에 의료 3 이상인 사람이 있으면（남아 있던 사람이든, 이 길에서 막 돌아온 사람이든）바로 이름을 붙인다. 일지에 누가 감별했는지 적는다. 의사가 다른 길에 아직 있으면, 돌아오거나 그날 밤 정산까지 이름 없는 채로 둔다. 감별 전에 달이면 여전히 토한다.

약은 집의 의사로 본다. 일지는 분명히
옛 판은 약을 바른 그 사람의 의료만 보았다. 환자가 6이고 집의 의사가 10이어도 일지는 6으로 적어 없애지 못했다. 지금은 집에 있는 사람 가운데 가장 높은 의료를 본다. 아직 길에 있는 사람은 세지 않는다. 약초 칸에 지금 누구의 몇 급인지 적는다. 단추에 이름이 있어, 누구에게 붙이고 누구에게 달이는지 갈린다. 맞는 붙이기는 질경이, 서양톱풀, 골든씰. 집의 의료가 8에서 10이면 열린 상처와 악화 모두 걷힌다. 6에서 7은 악화의 약 절반이 걷히고, 나머지는 하룻밤. 일지에 아직 8이 아니라고 적는다. 5 미만은 누르지도 못한다. 열과 변이열은 콘플라워나 엘더를 달인다. 그 둘은 8일부터 나온다. 악수는 박하, 폐는 솔잎. 틀리면 풀 이름, 병 이름, 붙여야 하는지 달여야 하는지를 적는다. 둘은 바꾸지 못한다.

처방은 병 아래에
집의 최고 의료가 5 미만이면, 병 아래에는 아직 처방을 못 쓴다고만 나온다. 5가 되면 병마다 세 가지를 적는다. 누구의 무슨 병인지, 붙일지 달일지, 어느 풀인지. 집에 있는 풀에는 「처방」을 붙인다. 없으면 채약을 보내라, 채집이 아니라고 적는다. 열린 상처와 악화는 질경이, 서양톱풀, 골든씰을 붙인다. 열과 변이열은 콘플라워나 엘더를 달인다. 악수는 박하. 폐는 솔잎. 깨어 있음과 잘못 삼킨 것은 풀이 없다. 쉰다. 기분은 잡지. 함부로 달이지 마라. 물림은 따로 한 줄. 처방이 없다. 어떤 풀도 안 듣는다. 악화에는 한 문장을 더한다. 의료 8이면 맞는 붙이기로 걷힌다. 8 미만은 대개 하룻밤.

—

v0.2.4 · 2026-09-27
v0.2.4　먼저 페이지를 넘긴다
공개 업데이트

기분 막힘
절멸과 이미 늦었다는 밖으로 못 나가고 휴식으로 안 돌아왔다. 읽기를 넣는다. 잡지는 어디서나 누구든. 희귀 없음. 기분만. 시작 두 권.

약초가 오는 길
채약은 채집이 아니다. 이레는 다섯 맛. 농사는 이름, 의료는 농도. 이랑은 온실.

그대로
공방, 청사진, 전설, 사진은 그대로.

—

v0.2.3 · 2026-09-24
v0.2.3　약이 필요해지는 때
공개 업데이트

이 판
변이 뒤로는 하룻밤으로 부족하다. 약초를 올린다. 첫 이레는 다섯 맛. 붙이다, 달이다, 두지 않다. 의사가 알아보고 농부가 기른다. 물림은 무효.

병
병에는 원인이 있다. 열린 상처는 이틀이면 악화. 변이열은 15일 이후, 변이나 두꺼운 것의 근접만. 이름 없는 풀을 달이면 하룻밤 못 나간다.

이미 늦었다
상황 모드 1장. 직업은 직접. 8일, 낮은 벽, 적은 양식, 상처와 열. 물림이 아니다. 승리는 시카고.

—

v0.2.2 · 2026-09-24
v0.2.2　날이 나빠진다
공개 업데이트

무엇이 바뀌었나
안 치운 동네는 천천히 붐빈다. 이웃은 안 늘고, 치운 곳은 매일 안 찬다. 5일부터 빠른 것, 8일부터 두꺼운 것, 10일부터 우는 것, 15일부터 변이. 멸종은 더 일찍, 캐주얼은 더 늦게. 야습 피해는 날이 갈수록 조금 세다. 지도의 감염은 말이다.

넷과 보통
보통이 기준이다. 빠른 것은 우회를 어렵게 하고 근접 실패를 더 아프게 한다. 두꺼운 것은 근접 킬을 하나 줄인다. 총은 같다. 우는 것은 전투 뒤 한두 마리를 부른다. 상한을 넘지 않는다. 변이는 드물고 늦고 더 위험하다. 한 판에 하나. 실시간 전투는 없다.

통과 장비
통 2급, 보통: 식량 2에 연료 1. 1급은 그대로 3. 멸종 2급은 3이고, 하루 짜고 하루 쉰다. 일지에 등급과 식량. 장비는 기술 등급을 더하지 않고 우회를 일찍 열지 않는다. 장갑은 벽과 장비를 조금 더 고치고, 은밀 옷은 수색 소리를 줄이고, 의료는 회복을 조금 늘리고, 전투는 근접 굴림만. 문턱은 익힌 등급.

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
