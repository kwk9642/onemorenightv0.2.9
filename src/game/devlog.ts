/**
 * In-game + itch.devlog. Add a new entry at the TOP of DEVLOG for each
 * public release — same text is what players read here and what we paste
 * onto the itch page. Do not fork a second changelog.
 */
import type { Locale } from "./i18n";

export interface DevLogEntry {
  id: string;
  version: string;
  date: string;
  title: Record<Locale, string>;
  kicker: Record<Locale, string>;
  sections: { heading: Record<Locale, string>; body: Record<Locale, string> }[];
}

const L = (zh: string, en: string, ja: string, ko: string): Record<Locale, string> => ({
  zh,
  en,
  ja,
  ko,
});

export const DEVLOG: DevLogEntry[] = [
  {
    id: "0.2.3",
    version: "0.2.3",
    date: "2026-09-24",
    title: L("v0.2.3　藥這時候才有用", "v0.2.3  Medicine is late on purpose", "v0.2.3　薬が必要になるのは今", "v0.2.3　약이 필요해지는 때"),
    kicker: L("公開更新", "Public update", "公開更新", "공개 업데이트"),
    sections: [
      {
        heading: L("這一版要解決什麼", "Why this build", "この版", "이 판"),
        body: L(
          "變異讓傷不再是睡一晚就好。草藥學這時候搬上來。前七晚只五味。三個用法：敷、泡、不吃。醫生認，農夫種。醫療越高，藥越像樣。咬傷仍然無藥。",
          "Mutants made a night of sleep not enough. Herbalism comes up now. Five plants for seven nights. Poultice, brew, or leave it. The doctor names. The farmer grows. Higher medical is a better dose. The bite still has no herb.",
          "異変のあと、一晩では足りない。薬草を上げる。最初の七晩は五味。貼る、煎じる、食べない。医者が見分け、農夫が育てる。噛み傷は無効。",
          "변이 뒤로는 하룻밤으로 부족하다. 약초를 올린다. 첫 이레는 다섯 맛. 붙이다, 달이다, 두지 않다. 의사가 알아보고 농부가 기른다. 물림은 무효.",
        ),
      },
      {
        heading: L("病", "Sickness", "病", "병"),
        body: L(
          "病要有來源。開放傷口兩晚不敷會惡化。惡水來自生水。異變熱只在第 15 晚後、被異變或皮厚的近身打傷。認錯的草泡了，一晚不能出門。每人最多兩種。",
          "Sickness needs a cause. An open wound turns after two nights. Flux comes from raw water. Mutant heat only after night 15, and only if a mutant or a brute cut you. Brew an unnamed plant and you stay in. Two ailments at most.",
          "病には原因。開放創を二晩放置で悪化。異変熱は 15 日目以降、異変か厚い一匹の近接だけ。名のない草を煎じると一晩出られない。",
          "병에는 원인이 있다. 열린 상처는 이틀이면 악화. 변이열은 15일 이후, 변이나 두꺼운 것의 근접만. 이름 없는 풀을 달이면 하룻밤 못 나간다.",
        ),
      },
      {
        heading: L("已經晚了", "Already late", "もう遅い", "이미 늦었다"),
        body: L(
          "難度旁邊多一張情境，不是第五種難度。職業自訂。第 8 晚醒來，牆低、糧少、帶傷帶熱。不是僵屍感染。芝加哥仍是終點。通關會註明。",
          "A card beside the modes, not a fifth difficulty. Your job is yours. Night 8, low wall, little food, wound and fever. Not the bite. Chicago is still the end. A win is marked.",
          "難易度の横の一枚。第五ではない。8日目、低い壁、少ない糧、傷と熱。噛み傷ではない。勝ちはシカゴ。",
          "난이도 옆의 카드. 다섯 번째가 아니다. 8일, 낮은 벽, 적은 양식, 상처와 열. 물림이 아니다. 승리는 시카고.",
        ),
      },
    ],
  },
  {
    id: "0.2.2",
    version: "0.2.2",
    date: "2026-09-24",
    title: L("v0.2.2　日子會變壞", "v0.2.2  The days get worse", "v0.2.2　日は悪くなる", "v0.2.2　날이 나빠진다"),
    kicker: L("公開更新", "Public update", "公開更新", "공개 업데이트"),
    sections: [
      {
        heading: L("這一版改了什麼", "What changed", "何が変わったか", "무엇이 바뀌었나"),
        body: L(
          "還沒清的鎮會慢慢變擠，鄰居不長，清過的點不會每晚長滿。第 5 晚起可能碰上先到的，第 8 晚皮厚的，第 10 晚會叫的，第 15 晚才有異變。滅絕更早，休閒更晚。夜襲傷害隨日子略升。地圖上有感染高低，不是精確數字。",
          "Pins you have not cleared get slowly thicker. Neighbors do not. Cleared pins do not refill every night. From day 5 a fast one may arrive first, day 8 a thick one, day 10 a screamer, day 15 a mutant. Extinct earlier, casual later. Night raids hit a little harder later. The map shows infection as a word, not a precise number.",
          "掃いていない町は少しずつ増える。隣は増えない。掃いた場所が毎晩満員には戻らない。5 日目から速い一匹、8 日目から厚い一匹、10 日目から叫ぶ一匹、15 日目から異変。絶滅は早く、気楽は遅い。夜襲の傷は日とともに少し増える。地図の感染は言葉。",
          "안 치운 동네는 천천히 붐빈다. 이웃은 안 늘고, 치운 곳은 매일 안 찬다. 5일부터 빠른 것, 8일부터 두꺼운 것, 10일부터 우는 것, 15일부터 변이. 멸종은 더 일찍, 캐주얼은 더 늦게. 야습 피해는 날이 갈수록 조금 세다. 지도의 감염은 말이다.",
        ),
      },
      {
        heading: L("四種之外的普通", "Four words, plus the ordinary", "四つと、普通", "넷과 보통"),
        body: L(
          "普通的還是基準。先到的讓包抄更難、近身失手更痛。皮厚的近戰少殺一隻，槍不受影響。會叫的打完會再引來一兩隻，不超過上限。異變稀、晚、更危險。同一場一種。不新開即時戰鬥。",
          "Walkers stay the baseline. Runners make flank harder and a missed swing hurt more. Brutes cost one melee kill; guns ignore that. Screamers pull one or two more after the fight, under the cap. Mutants are rare, late, and worse. One kind a fight. No new real-time combat.",
          "普通は基準。速い一匹は迂回を難しくし、近接の失敗を痛くする。厚い一匹は近接の数を一つ減らす。銃は同じ。叫ぶ一匹は戦闘後に一、二匹呼ぶ。上限を超えない。異変は稀で遅く、危ない。一戦一種。即時戦闘は作らない。",
          "보통이 기준이다. 빠른 것은 우회를 어렵게 하고 근접 실패를 더 아프게 한다. 두꺼운 것은 근접 킬을 하나 줄인다. 총은 같다. 우는 것은 전투 뒤 한두 마리를 부른다. 상한을 넘지 않는다. 변이는 드물고 늦고 더 위험하다. 한 판에 하나. 실시간 전투는 없다.",
        ),
      },
      {
        heading: L("油桶與裝備", "The still and the kit", "桶と装備", "통과 장비"),
        body: L(
          "油桶二級、正常：2 食物換 1 油。一級仍是 3。滅絕二級是 3，而且榨一晚歇一晚。日誌寫油桶等級和吃了幾份。裝備不再加技能等級，也不提早開包抄。手套多修一點牆和裝備，潛行裝讓搜索 quieter，醫療裝多回一點血，戰鬥裝只加近戰骰。門檻仍看練出來的等級。",
          "Still level 2 on Normal: 2 food for 1 fuel. Level 1 is still 3. Extinct level 2 is 3, and the still rests every other night. The log names the still level and the food. Gear no longer adds skill ranks and does not unlock flank. Gloves patch a little more wall and kit. Quiet clothes cut search noise. Medical kit heals a little more. Combat kit only adds to the melee roll. Gates still use the rank you trained.",
          "桶二級、通常は食料 2 で燃料 1。一級は 3。絶滅の二級は 3 で、一晩搾って一晩休む。日誌に等級と食料。装備は技能等級を足さない。迂回も早開けしない。手袋は壁と装備を少し多く直し、隠密の服は捜索の音を減らし、医療は回復を少し増やし、戦闘は近接の骰だけ。門は鍛えた等級。",
          "통 2급, 보통: 식량 2에 연료 1. 1급은 그대로 3. 멸종 2급은 3이고, 하루 짜고 하루 쉰다. 일지에 등급과 식량. 장비는 기술 등급을 더하지 않고 우회를 일찍 열지 않는다. 장갑은 벽과 장비를 조금 더 고치고, 은밀 옷은 수색 소리를 줄이고, 의료는 회복을 조금 늘리고, 전투는 근접 굴림만. 문턱은 익힌 등급.",
        ),
      },
    ],
  },
  {
    id: "0.2.1",
    version: "0.2.1",
    date: "2026-09-23",
    title: L("v0.2.1　帳對得上", "v0.2.1  The books balance", "v0.2.1　帳が合う", "v0.2.1　장부가 맞다"),
    kicker: L("公開修正", "Public fix", "公開修正", "공개 수정"),
    sections: [
      {
        heading: L("這一版為什麼存在", "Why this build", "なぜこの版か", "왜 이 판인가"),
        body: L(
          "v0.2 把日子收緊以後，有人回來說：油出不去、集水器三級了水還是每天少、搬了家隔壁還要燒油、開局只有一種死法。這一版改這四件事。草藥、工場、傳奇套不動。",
          "After v0.2 tightened the day, people came back: no fuel to leave, the cistern at three and the water still falling, a move that still charged the next pin, one way to die at the title. This build is those four. Herbs, the shop line, legend sets stay off.",
          "v0.2 が日を締めたあと、戻ってきた声：燃料がなくて出られない、貯水が三なのに水が減る、引っ越しても隣で燃料、題の死に方は一つ。この版はその四つ。薬草、工房、伝説は動かさない。",
          "v0.2가 하루를 조인 뒤 돌아온 말: 연료가 없어 못 나간다, 집수 3인데 물이 준다, 이사해도 옆집에 연료, 타이틀의 죽는 법이 하나. 이 판은 그 넷이다. 약초, 공방, 전설은 안 건드린다.",
        ),
      },
      {
        heading: L("水", "Water", "水", "물"),
        body: L(
          "每人每晚喝 1。集水器一級產 1、供 1 人；二級產 2；三級產 3。三人、三級，當天打平。第四人起每天欠 1。口渴特質算 2 份。第 16 天多喝的那一罐，只在沒有集水器時才加。今晚接的水，明早才算數。按鈕不再寫「約 0.6」。日誌寫喝了幾、接了幾。",
          "One drink each night. Cistern 1 yields 1 and covers 1. Level 2 yields 2. Level 3 yields 3. Three people, level 3, the day nets zero. A fourth person owes 1. High thirst counts as two. The extra drink on day 16 only hits if there is no cistern. Tonight’s rain is tomorrow’s can. The button no longer says “about 0.6”. The log says how many drunk, how many caught.",
          "一人一晩 1。貯水 1 は 1 人分。2 は 2。3 は 3。三人と三級でその日は差し引きゼロ。四人目から每晚 1 不足。渇きの特性は 2 人分。16 日目の余分は貯水がないときだけ。今夜受けた水は翌朝。ボタンに「約 0.6」は書かない。日誌に飲んだ数と受けた数。",
          "한 사람 하룻밤 1. 집수 1은 1명분. 2는 2. 3은 3. 세 사람과 3급이면 그날 수지 제로. 네 번째부터 매일 1이 모자라다. 갈증 특성은 두 명분. 16일 추가 음수는 집수가 없을 때만. 오늘 받은 물은 내일 아침. 버튼에 「약 0.6」은 안 쓴다. 일지에 마신 수, 받은 수.",
        ),
      },
      {
        heading: L("油", "Fuel", "燃料", "연료"),
        body: L(
          "現居地的鄰居走路去，不燒油。出了這個圈子，才照地圖上的數字。搬了家，新家的隔壁免費，舊圈子恢復原價。芝加哥和蓋瑞仍要油。家裡可以造油桶。晚上派人「榨油」：一級 3 食物換 1 油，二級 2 食物換 1 油。先吃飯、先腐爛，剩下的才進桶。每晚最多 1 桶。沒人值，桶是空的。",
          "Neighbors of the house you occupy cost 0. Leave that ring and the map number stands. Move house and the new ring is free; the old one charges again. Chicago and Gary still want fuel. You can build a still. At night someone Presses oil: 3 food for 1 fuel at level 1, 2 food at level 2. Eat first, rot first, then the still. One can a night. Nobody on the job, the drum is empty.",
          "今の家の隣は歩いて行く。輪を出たら地図の数字。引っ越せば新しい隣は無料、古い輪はまた有料。シカゴとゲイリーは今も燃料。家に蒸留桶を建てられる。夜に誰かが搾油。一級は食料 3 で燃料 1、二級は 2。先に食い、先に腐り、残りが桶へ。一晩に一缶。人が就かなければ空。",
          "지금 집의 이웃은 걸어간다. 그 圈을 벗어나면 지도의 숫자. 이사하면 새 이웃은 공짜, 옛 圈은 다시 받는다. 시카고와 게리는 여전히 연료. 집에 증류통을 지을 수 있다. 밤에 누가 「착유」. 1급은 식량 3에 연료 1, 2급은 2. 먼저 먹고, 먼저 썩고, 나머지가 통으로. 하룻밤에 한 통. 사람이 안 붙으면 빈 통.",
        ),
      },
      {
        heading: L("模式", "Modes", "モード", "모드"),
        body: L(
          "新遊戲四張卡。舊存檔當正常。中途不能改。休閒：規則相同，飯和油寬一點，仍會死人。正常：就是這一版的底。滅絕：同樣的路，更少的東西，更貴的遠門。鄰居仍然不收油。沙盒：自己定同伴、倉庫和難度。通關會註明沙盒。開局之後不加資源。",
          "Four cards on a new game. Old saves are Normal. You cannot change mid-run. Casual: same rules, more food and fuel. You can still die. Normal: this build. Extinct: the same road, less in the bag, dearer far pins. Neighbors still cost 0. Sandbox: you set the extra hands, the stash, the knobs. A win is marked Sandbox. No gifts after the first day.",
          "新しく始めるとき四枚。古い記録は通常。途中では変えられない。気楽：規則は同じ。飯と燃料は少し広い。死ぬ。通常：この版。絶滅：同じ道、袋は細く、遠いピンは高い。隣は今も 0。砂場：手と倉庫とつまみを自分で。クリアは砂場と記す。初日のあとに物資は足さない。",
          "새 게임에서 카드 네 장. 옛 저장은 보통. 도중에 못 바꾼다. 캐주얼: 규칙은 같다. 밥과 기름이 조금 넓다. 죽는다. 보통: 이 판. 멸종: 같은 길, 가방은 적고, 먼 핀은 비싸다. 이웃은 여전히 0. 샌드박스: 손과 창고와 난이도를 네가 정한다. 클리어는 샌드박스로 적힌다. 첫날 이후 물자는 안 보탠다.",
        ),
      },
      {
        heading: L("沒有動", "Left alone", "動かさない", "안 건드린 것"),
        body: L(
          "勝負仍是芝加哥。六格、有限物資、用過才升級、委派，都不改。草藥學留到後面。",
          "Chicago is still the win. Six actions, finite stock, XP from use, dispatch — unchanged. Herbalism waits.",
          "勝ちはシカゴ。行動六、備蓄は有限、使った手だけが伸び、派遣。薬草はあと。",
          "승리는 시카고. 행동 여섯, 재고는 유한, 쓴 손만 는다, 파견. 약초는 나중.",
        ),
      },
    ],
  },
  {
    id: "0.2",
    version: "0.2",
    date: "2026-09-22",
    title: L("v0.2　玩家打完三十晚之後", "v0.2  After thirty nights", "v0.2　三十晩のあと", "v0.2　30밤 이후"),
    kicker: L("公開更新", "Public update", "公開更新", "공개 업데이트"),
    sections: [
      {
        heading: L("這一版為什麼存在", "Why this build", "なぜこの版か", "이 버전이 나온 이유"),
        body: L(
          "v0.1 是免費原型，讓人整局任玩。有人打到第三、四十晚回來問：後面要做什麼？為什麼牆在那、醫務室按不了、地圖寫已清理但其實還有兩隻、裝備數字看不懂、東西丟不掉、搜得太輕鬆。這一版把那些問題一併收進文字遊戲裡，沒有另開戰場。",
          "v0.1 was a free prototype. People lived thirty, forty nights and came back: what now? Why is the wall there, why won't the infirmary take materials, why does the map say cleared with two left, what do gear numbers do, why can't I throw kit away, why is quiet search so fat. This build folds those answers into the text game. No second combat mode.",
          "v0.1 は無料の原型。三十、四十晩生きて戻ってきた声：この先は何だ。壁は何のため、医務室はなぜ押せない、地図は掃いたのに二匹、装備の数字は何か、捨てられない、隠密が太りすぎ。この版はそれを文字のまま直す。別の戦場は開かない。",
          "v0.1은 무료 원형이었다. 삼십, 사십 밤을 살고 돌아온 말: 이제 뭘 하나. 벽은 왜 있나, 의무실은 왜 안 올라가, 지도는 청소인데 두 마리, 장비 숫자는 뭔가, 버릴 수가 없다, 은밀이 너무 많다. 이 판은 그걸 텍스트 그대로 고친다. 다른 전장은 안 연다.",
        ),
      },
      {
        heading: L("白天：六格行動", "Day: six actions", "昼：行動六", "낮: 행동 6칸"),
        body: L(
          "一天只有六格。移動、搜索、戰鬥、下一間各 1。建造 2，補牆 1。撤離不睡覺、不耗格。地點的物資是有限的，搜光就沒有。悄悄搜索幾乎不出聲，但大約只有徹底翻的四成。大聲會引僵屍。地圖不再謊稱已清理——還有幾隻就寫幾隻。芝加哥是遠的終點，蓋瑞是南面的鋼門。",
          "Six actions a day. Travel, search, fight, next room cost 1. Build 2, patch the wall 1. Extract does not sleep and costs nothing. Sites have finite stock; empty is empty. Quiet search is almost silent and about 40% of a loud rummage. Noise draws them. The map does not lie about cleared — leftover zombies stay on the pin. Chicago is the far end. Gary is the steel door south.",
          "一日は六。移動・捜索・戦闘・次の部屋は 1。建設 2、壁 1。撤退は眠らず、消費しない。場所の備蓄は有限。静かなら音はほぼ出ないが、徹底の四割ほど。騒げば呼ぶ。地図は「掃いた」と嘘をつかない。シカゴが遠い終わり。ゲイリーが南の鋼の門。",
          "하루 여섯 칸. 이동·수색·전투·다음 방은 1. 건설 2, 벽 1. 철수는 자지 않고 칸을 안 쓴다. 장소 재고는 유한하다. 은밀은 거의 조용하고, 철저의 약 40%. 시끄러우면 부른다. 지도는 청소했다고 거짓말하지 않는다. 시카고가 먼 끝. 게리가 남쪽 강철 문.",
        ),
      },
      {
        heading: L("人：用過才會長", "People: use is how you grow", "人：使った手が伸びる", "사람: 써야 는다"),
        body: L(
          "技能 0 到 10。只有實際用過才加經驗：打架長戰鬥、翻袋長搜刮、耕田長農耕。每級寫明加什麼。出身決定學得快慢。人多才能委派——留下一個守家，最多兩個去外圍採藥、拆板、覓食。熟什麼就優先搜什麼。可能空手、帶傷、迷路，或撞上溫室、地窖、活人、一張地圖。這不是出征。",
          "Skills run 0–10. XP only from doing the thing: fights raise combat, rummaging raises scavenge, the garden raises farming. Each rank says what it adds. Starting level locks how fast you learn. Spare hands can be sent out — leave one home, two at most, around the house for herbs, boards, a creek. They search what they know. They can come back empty, cut, a day late, or with a greenhouse, a cellar, a stranger, a map. That is not a raid.",
          "技能は 0 から 10。使った手だけが伸びる。殴れば戦闘、漁れば捜索、耕せば農耕。各級に何が増えるか書いてある。生まれで伸び方が決まる。人が余れば派遣できる。一人は家に残し、多くて二人。薬草、板、小川。得意なものを先に取る。空手、傷、一日遅れ、温室、地下室、他人、地図がありうる。出撃ではない。",
          "기술 0에서 10. 실제로 쓴 손만 는다. 싸움은 전투, 뒤지는 수색, 밭은 농사. 각 급이 무엇을 더하는지 적혀 있다. 출발이 배우는 속도를 잠근다. 손이 남으면 파견할 수 있다. 하나는 집, 최대 둘. 약초, 판자, 개울. 익숙한 것을 먼저 찾는다. 빈손, 상처, 하루 늦음, 온실, 지하실, 사람, 지도. 출격이 아니다.",
        ),
      },
      {
        heading: L("家：夜會來人", "House: night comes in", "家：夜は入ってくる", "집: 밤이 들어온다"),
        body: L(
          "牆低、天數越高，過夜越容易被襲。警戒和哨塔減一點。食物超過十會腐。用不到的裝備可以丟掉，爛到還能拆的會變成建材。房間、工作、裝備的說明寫在按鈕旁邊和資料庫裡——這是文字遊戲，字就是規則。資料庫在遊戲裡打開，不是下載一份文件。",
          "Low walls and later days draw raids. Guard duty and the tower shave the odds. Food over ten rots. Kit you do not need can be thrown; salvage above a threshold becomes lumber. Rooms, jobs, and gear say what they do next to the button and in the handbook. This is a text game. The words are the rules. The handbook opens in the game. It is not a file you download.",
          "壁が低く日が経つと夜襲。警戒と塔が少し減らす。食料が十を超えると腐る。要らない装備は捨てられる。まだ使える壊れは材になる。部屋も仕事も装備も、ボタンの横と資料に何のためか書いてある。これは文字のゲーム。字が規則。資料はゲームの中で開く。ダウンロードではない。",
          "벽이 낮고 날이 갈수록 야습. 경계와 탑이 조금 줄인다. 식량 10이 넘으면 썩는다. 안 쓰는 장비는 버릴 수 있다. 어느 정도 남은 내구는 자재가 된다. 방, 일, 장비는 버튼 옆과 자료실에 용도가 있다. 텍스트 게임이다. 글자가 규칙이다. 자료실은 게임 안에서 연다. 다운로드가 아니다.",
        ),
      },
      {
        heading: L("怎麼算贏，什麼沒有動", "How you win, what we left", "勝ちと、動かさなかったもの", "이기는 법, 안 건드린 것"),
        body: L(
          "清掉芝加哥的僵屍並佔領，這一局才結束。全軍覆沒就輸。存檔仍在這台裝置，標題有「繼續」。這一版仍然是文字。像素戰鬥、天氣、派系都還關著，不放在標題上、也不塞進這一包。",
          "Clear Chicago and occupy it. That is the win. Everyone dead is the loss. The save still lives on this device. Title has Continue. This is still text. Pixel fights, weather, factions stay unplugged — not on the title, not in this zip.",
          "シカゴを掃いて占領すれば勝ち。全滅は負け。記録はこの端末。タイトルに「続きから」。これはまだ文字。画素の戦闘、天候、派閥は入れない。タイトルにもこの ZIP にも出さない。",
          "시카고를 쓸고 점령하면 이긴다. 전원이 죽으면 진다. 저장은 이 기기. 타이틀에 「이어하기」. 아직 텍스트다. 픽셀 전투, 날씨, 세력은 빼 둔다. 타이틀에도 이 압축에도 안 넣는다.",
        ),
      },
    ],
  },
  {
    id: "0.1",
    version: "0.1",
    date: "2026-09-13",
    title: L("v0.1　初代系統", "v0.1  The first system", "v0.1　最初の仕組み", "v0.1　첫 시스템"),
    kicker: L("免費原型", "Free prototype", "無料プロトタイプ", "무료 원형"),
    sections: [
      {
        heading: L("這是什麼", "What it is", "何か", "무엇인가"),
        body: L(
          "再活一晚是文字僵屍據點。肯塔基鄉下起家，美國中西部是真的地圖。職業、缺點、一棟破房子。目標寫在標題裡：再撐一晚。永久死亡。不收費、無試用鎖。錢不能換命。",
          "One More Night is a text zombie house. You start in rural Kentucky. The Midwest is a real map. Occupation, flaws, a wreck of a house. The title is the brief: last one more night. Permadeath. No paywall, no trial lock. Money cannot buy a pulse.",
          "『もう一晩』は文字のゾンビ拠点。ケンタッキーの田舎から。中西部は本物の地図。職業、欠点、壊れた家。題が任務：もう一晩。永久死。料金も試用制限もない。金で脈は買えない。",
          "『하루만 더』는 텍스트 좀비 거점이다. 켄터키 시골에서 시작한다. 중서는 실제 지도. 직업, 단점, 허물어진 집. 제목이 임무다: 하룻밤만 더. 영구 사망. 요금도 체험 제한도 없다. 돈으로 맥박은 못 산다.",
        ),
      },
      {
        heading: L("一天怎麼過", "A day", "一日", "하루"),
        body: L(
          "白天出門：選地點、組最多三人、搜索或打架、帶東西回來。遠的城要油。晚上吃飯喝水，派人煮飯、耕田、修牆、看護、守夜、聽電台。沒人做的工就空轉。睡了才過一日。",
          "Day: pick a pin, take up to three, search or fight, come home with a bag. Far cities cost fuel. Night: eat, drink, cook, farm, mend, tend, watch, listen to the radio. A job with nobody in it does nothing. Sleep is what turns the day.",
          "昼は出る。場所を選び、多くて三人、漁るか殴るか、袋を持って帰る。遠い街は燃料。夜は食い、飲み、炊き、耕し、直し、看り、見張り、無線。誰も就かない仕事は空転。眠ると日が変わる。",
          "낮에 나간다. 장소를 고르고 최대 셋, 뒤지거나 싸우고 가방을 들고 돌아온다. 먼 도시는 연료. 밤에는 먹고 마시고 요리하고 갈고 고치고 간호하고 지키고 무전을 듣는다. 빈 일은 헛돈다. 잠이 날을 넘긴다.",
        ),
      },
      {
        heading: L("人", "People", "人", "사람"),
        body: L(
          "八個職業決定起手技能和一把武器。特質有好有壞，點數要自己算。情緒太低，出不了門也做不了工。關係會變——陌生人、相識、朋友、情人。其中一個死了，另一個會垮。",
          "Eight occupations lock starting skills and a weapon. Traits help and hurt; you spend the points. Mood too low and they will not leave the house or work. Bonds move: stranger, known, friend, lover. One dies, the other drops.",
          "職業は八。初期技能と武器が決まる。特性は功も罪も。点は自分で。気分が底なら出られないし働けない。関係は動く。他人、顔見知り、友、恋人。片方が死ぬと、もう片方は折れる。",
          "직업 여덟. 시작 기술과 무기가 잠긴다. 특성은 득과 실. 점수는 네가 센다. 기분이 바닥이면 문 밖도 일도 없다. 관계는 움직인다. 남, 아는 사이, 친구, 연인. 하나가 죽으면 다른 하나가 꺾인다.",
        ),
      },
      {
        heading: L("房子", "The house", "家", "집"),
        body: L(
          "寢室是床位。廚房讓晚飯少耗一點。集水器產水。菜園要人耕。工坊派人打造才修裝備。醫務室讓看護有效。電台照亮地圖、偶爾聽到人。哨塔減夜襲。牆是夜裡的門。佔領新據點，容量和設施跟那棟走，舊的升級不會帶走。",
          "Beds are capacity. The kitchen trims supper. The cistern makes water. The garden needs a farmer. The shop only mends kit if someone crafts. The infirmary makes tending real. Radio lights the map and sometimes a voice. The tower cuts raids. The wall is the door at night. Occupy a new pin and capacity and rooms follow that building. Old upgrades do not travel.",
          "寝室が定員。台所は夕食を少し減らす。雨水が水を出す。畑は人が耕す。工房は「作る」を就けた夜だけ装備を直す。医務室で看護が効く。無線は地図を灯し、たまに声。塔が夜襲を削る。壁が夜の扉。新しい拠点を占領すると定員と部屋はそこの建物に従う。古い改修は持っていけない。",
          "침실이 정원. 부엌은 저녁을 조금 줄인다. 집수기가 물을 만든다. 밭은 사람이 간다. 공방은 「제작」을 넣은 밤에만 장비를 고친다. 의무실이 있어야 간호가 된다. 무전은 지도를 밝히고 가끔 목소리를. 탑이 야습을 깎는다. 벽이 밤의 문. 새 거점을 점령하면 정원과 방은 그 건물을 따른다. 옛 업그레이드는 안 가져간다.",
        ),
      },
      {
        heading: L("出門", "Going out", "外出", "외출"),
        body: L(
          "地圖上選一個看得到的地方。安靜翻、徹底翻、或打。槍要子彈。側擊看潛行。帶回來的東西進倉庫，可以穿上。清光一區才能搬家。床不夠，佔領只是換地方餓死。",
          "Pick a pin you can see. Search quiet, search loud, or fight. Guns want ammo. Flank wants stealth. What you bring goes to the stash and can be worn. You only move house when the site is empty of them. Not enough beds and occupying is starving in a new room.",
          "見える場所を選ぶ。静かに漁るか、徹底するか、殴るか。銃は弾。側面は隠密。持ち帰ったものは倉庫、着られる。掃いてから引っ越せる。ベッドが足りなければ、占領は別の部屋で餓死するだけ。",
          "보이는 핀을 고른다. 조용히 뒤지거나, 철저히 하거나, 싸운다. 총은 탄약. 측면은 은신. 가져온 것은 창고, 입을 수 있다. 쓸어야 이사한다. 침대가 모자라면 점령은 다른 방에서 굶는 일이다.",
        ),
      },
      {
        heading: L("死與存檔", "Death and the save", "死と記録", "죽음과 저장"),
        body: L(
          "最後一個倒下去，這一局結束。存檔寫在這台裝置上。清資料就沒了。標題的繼續會讀它。新的倖存會蓋掉舊的。",
          "When the last one falls, the run ends. The save is on this device. Clear the data and it is gone. Continue on the title reads it. A new survivor overwrites the old one.",
          "最後の一人が倒れたら終わり。記録はこの端末。消したら無い。タイトルの続きからがそれを読む。新しい生存は古いのを上書きする。",
          "마지막 한 사람이 쓰러지면 끝. 저장은 이 기기. 지우면 없다. 타이틀의 이어하기가 읽는다. 새 생존은 옛것을 덮는다.",
        ),
      },
    ],
  },
];

export function locText(rec: Record<Locale, string>, loc: Locale) {
  return rec[loc] ?? rec.zh;
}

export function itchPageText(loc: Locale): string {
  const lines: string[] = [];
  if (loc === "zh") {
    lines.push(
      "再活一晚（One More Night）是免費文字僵屍據點。肯塔基鄉下起家，美國中西部是真的地圖。一晚一命。不收費。",
      "",
      "開發日誌寫在遊戲標題的「開發日誌」裡，和這頁同一份。以後每次更新都從這裡報告，不另開一篇消失的 itch 文。",
      "",
    );
  } else if (loc === "en") {
    lines.push(
      "One More Night is a free text zombie house. Rural Kentucky. A real Midwest map. One night. One life. No paywall.",
      "",
      "The same devlog lives under Dev log on the title screen. Future updates are posted there, not in a second itch essay that goes stale.",
      "",
    );
  } else if (loc === "ja") {
    lines.push(
      "『もう一晩』は無料の文字ゾンビ拠点。ケンタッキーの田舎。本物の中西部地図。一晩、一条の命。料金なし。",
      "",
      "同じ開発日誌がタイトルの「開発日誌」にある。以後の更新もそこに書く。itch に消える別文は作らない。",
      "",
    );
  } else {
    lines.push(
      "『하루만 더』는 무료 텍스트 좀비 거점이다. 켄터키 시골. 실제 중서 지도. 하룻밤, 목숨 하나. 요금 없음.",
      "",
      "같은 개발 일지가 타이틀의 「개발 일지」에 있다. 이후 업데이트도 거기에 쓴다. itch에 사라지는 다른 글을 만들지 않는다.",
      "",
    );
  }
  for (const entry of DEVLOG) {
    lines.push(`v${entry.version} · ${entry.date}`);
    lines.push(locText(entry.title, loc));
    lines.push(locText(entry.kicker, loc));
    lines.push("");
    for (const s of entry.sections) {
      lines.push(locText(s.heading, loc));
      lines.push(locText(s.body, loc));
      lines.push("");
    }
    lines.push("—");
    lines.push("");
  }
  return lines.join("\n").replace(/\n—\n\n$/, "\n").trim() + "\n";
}
