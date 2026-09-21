/** Last-merge player copy: what each room, job, piece of kit actually does. */
export const whyZh: Record<string, string> = {
  "fac.beds.blurb":
    "床位就是能養活幾個人。每升一級，據點多留一人。想救人、聽電台收容，先看寢室。佔領新據點時，容量跟那棟房子走，舊的升級不會帶走。",
  "fac.beds.effect": "每級容量 +1。沒床就收不了人。",
  "fac.kitchen.blurb":
    "廚房讓晚飯少耗一點：每級大約少吃 0.4 人份。派人做「炊事」才會額外做出食物、並提振情緒。只升級不派工，只是比較省糧，不會憑空多出飯。",
  "fac.kitchen.effect": "每級晚飯 −0.4 人份。炊事才額外產糧。",
  "fac.water.blurb":
    "集水器接雨水。有等級就產水（約等級×0.6，最少 1），每級還少喝約 0.4 人份。沒有它，水只能出門搜。不用派人看守，升級就會滴。",
  "fac.water.effect": "產水約等級×0.6。每級少喝 0.4。",
  "fac.workshop.blurb":
    "工坊是修裝備的唯一地方。必須派人做「打造」，並花 1 建材：圍牆 +6，並修理倉庫裡最爛的一件。2 級同一晚修兩件。穿在身上的只修六成。沒有工坊，打造這份工無效。建造技能越高，修得越多。",
  "fac.workshop.effect": "派人「打造」才修裝備。耗 1 建材。2 級修兩件。",
  "fac.infirmary.blurb":
    "醫務室讓「看護」有效。派人看護，所有傷者過夜回一大截血（約 10+醫療技能）。有藥時才有機會清掉感染。升級還要額外藥品。沒醫務室，看護無效。",
  "fac.infirmary.effect": "看護治療全隊傷者。有藥才清感染。",
  "fac.garden.blurb":
    "菜園不會自己長。必須派人「耕作」。產量約為菜園等級×(0.45+農耕技能/14)。沒人耕，就是空地。食物超過 10 會腐壞，種出來要吃掉或煮掉。",
  "fac.garden.effect": "要「耕作」才產糧。產量看等級與農耕。",
  "fac.radio.blurb":
    "電台一開，地圖就亮：1 級看得到同州地點，2 級看全圖（不用派人）。派人「監聽」另有約 35% 發現新地、12% 聽到人——要有空床才收得下。升級要燃油。洞穴佔領沒有電台。",
  "fac.radio.effect": "1 級同州、2 級全圖。監聽才找人。",
  "fac.watch.blurb":
    "哨塔讓你先看到夜裡來的東西。每級把夜襲機率減約 4%，與「警戒」疊加。牆高才是根本，塔是保險。不用派人看守，升級就生效。",
  "fac.watch.effect": "每級夜襲 −4%。與警戒疊加。",

  "job.rest.blurb":
    "不出工。過夜回血約 12、疲勞降約 35、情緒 +6。心情太差的人只能休息——出不了門，也做不了別的工。",
  "job.cook.blurb":
    "需要廚房。過夜額外產 1 食物（善廚再 +1），情緒 +8。廚房等級另外減少晚飯消耗。沒廚房，這份工無效。",
  "job.farm.blurb":
    "需要菜園。過夜產糧隨菜園等級與農耕技能。沒人耕作，菜園空轉。這是穩定糧食的正路。",
  "job.guard.blurb":
    "守夜。每人把夜襲機率減約 5.5%。牆低、天數越高越容易被襲。不耗建材。可與哨塔疊加。",
  "job.repair.blurb":
    "補圍牆。過夜牆 +8，再加上建造技能（巧手／懂車再 +3）。不耗建材。牆高，夜襲少。現補則花 2 建材、1 格行動。",
  "job.tend.blurb":
    "需要醫務室。所有傷者過夜回血（約 10+醫療技能）。有藥時有機會清掉感染。沒醫務室這份工無效。",
  "job.radio.blurb":
    "需要無線電。約 35% 發現新地點、12% 聽到倖存者（要有空床才收得下）。電台本身 1 級已能看同州、2 級看全圖，監聽是額外找人、找新點。",
  "job.craft.blurb":
    "需要工坊。這是修裝備的唯一辦法。耗 1 建材：圍牆 +6，修倉庫最爛一件（修量 6+建造技能，巧手再 +3）。工坊 2 級修兩件。穿身上的只修六成。沒工坊或沒建材，這份工無效。",

  "gear.stat.atk": "近戰 {n}（打怪）",
  "gear.stat.gun": "槍（耗彈、吵）",
  "gear.stat.arm": "護甲 {n}（減傷）",
  "gear.stat.bite": "防咬 {n}（抗感染）",
  "gear.stat.cmb": "戰鬥 {n}",
  "gear.stat.sth": "潛行 {n}",
  "gear.stat.scv": "搜刮 {n}（多搜）",
  "gear.stat.med": "醫療 {n}",
  "gear.stat.bld": "建造 {n}",
  "gear.stat.frm": "農耕 {n}",
  "gear.stat.ck": "烹飪 {n}",
  "gear.stat.bag": "負重 {n}（多搜）",
  "gear.stat.fat": "疲勞 {n}（過夜更累）",
  "gear.stat.noise": "噪音 {n}（引僵屍）",
  "gear.legend":
    "武器管近戰與能不能開槍。頭、身、手、腿、腳的護甲減傷害，防咬減感染。背包加搜刮量。數字愈大愈明顯。噪音會把僵屍叫來，疲勞過夜更累。壞了要升級工坊，派人做「打造」才修。",
  "gear.hint":
    "護甲減傷害，防咬減感染，背包加搜刮量。噪音引僵屍，疲勞過夜更累。要修裝備：升級工坊，派人做「打造」，花 1 建材。完好度 40 以上丟掉可拆 1 建材。",
  "gear.discardHint": "丟掉。完好度 40 以上拆成 1 建材。壞掉的直接扔。",

  "roster.hint":
    "留守的人經營這棟房子。選工作，過夜才生效。點部位穿脫裝備。護甲減傷、防咬抗感染、背包多搜、噪音引怪。要修裝備：先升級工坊，再派「打造」。",
  "roster.skills":
    "技能在對應工作與出征中慢慢漲，上限 10。戰鬥打怪；潛行讓搜刮更靜、包抄更好；搜刮決定帶回多少；醫療看護；建造修牆與打造修裝備；農耕種菜；烹飪煮飯。",
  "build.hint":
    "升級房間要建材，有時還要藥或油。價錢＝基礎×（目前等級+1）。工坊要派人「打造」才修裝備。菜園要派人「耕作」才產糧。廚房減晚飯，集水器產水。不夠的資源，得出門搜。",
  "build.repairWallHint": "現補：建材 2、行動 1。牆高，夜襲少。也可派人「修繕」過夜慢慢補，不耗建材。",
  "hub.resHint":
    "食物、水每晚每人約耗 1。廚房、集水器可減耗。食物超過 10 會腐。建材用來升級、補牆、打造修裝備。藥清感染。彈開槍才耗。油走遠路、升級電台。",
  "hub.wallNote":
    "圍牆 {n}。牆低，過夜容易被襲。派人「修繕」過夜補牆（不耗材），或花 2 建材現補。警戒與哨塔降低夜襲機率。",
  "meter.hp": "生命",
  "meter.hunger": "飢餓",
  "meter.thirst": "口渴",
  "meter.morale": "情緒",

  "res.food.blurb": "每晚每人約吃 1。廚房每級少吃約 0.4。超過 10 腐壞。菜園加耕作才穩。",
  "res.water.blurb": "每晚每人約喝 1。集水器產水，每級少喝約 0.4。沒集水器得出門搜。",
  "res.materials.blurb": "升級房間、現補圍牆（2）、打造修裝備（1）都用它。五金行、廢鐵場最多。",
  "res.medicine.blurb": "清感染、升級醫務室。醫院與列克星敦較多。沒藥，咬傷會爛下去。",
  "res.ammo.blurb": "開槍才耗。沒彈就近戰或包抄。警員與退伍軍人起手較多。",
  "res.fuel.blurb": "遠征大城市、升級無線電。河邊與鋼廠有油。",

  "skill.combat.blurb": "打怪傷害。出征打架會漲。消防員、警員較高。",
  "skill.stealth.blurb": "搜刮更靜，包抄要合計 6 才按得了。盜賊先天高。",
  "skill.scavenge.blurb": "決定搜回多少。背包也加。盜賊、技工有一點。",
  "skill.medical.blurb": "看護治療量。醫生先天 6。沒這項，醫務室也救得慢。",
  "skill.build.blurb": "修繕補牆、打造修裝備的量。技工先天 4。工坊聽他的。",
  "skill.farm.blurb": "耕作產量。農夫先天 4。沒人懂種，菜園空轉。",
  "skill.cook.blurb": "炊事。廚師先天 4，還自帶善廚。熱食留住人。",

  "occ.firefighter.blurb": "斧、體能。適合當先鋒清點。起手 0 點，生命較高。",
  "occ.firefighter.desc":
    "先天戰鬥 1、生命 110。沒有免費特質。要更強，得自己拿缺點換點數。起手有一點建材與藥，夠把門釘上。把戰鬥與建造點上去，他就能打也能修。",
  "occ.doctor.blurb": "醫療 6。留家看護能救感染。戰鬥弱，別當先鋒。",
  "occ.doctor.desc":
    "先天醫療 6、戰鬥 1、生命 90。醫院沒了，手還在。留在醫務室做看護，有藥才能清感染。起手藥多。戰鬥與潛行要另外點。",
  "occ.officer.blurb": "戰鬥 4，會開槍。起手 −4 點，特質要精打細算。",
  "occ.officer.desc":
    "先天戰鬥 4、潛行 1。開槍耗彈藥。起手點數是負的，選缺點才夠用。不會種田。適合出征清點，留家就派警戒。",
  "occ.chef.blurb": "烹飪 4，自帶善廚。廚房加炊事能留住人。起手 −2。",
  "occ.chef.desc":
    "先天烹飪 4、建造 1、戰鬥 1。免費善廚：煮飯多一點食物。起手糧食多。升級廚房、派他炊事，過夜產糧並回情緒。戰鬥要另外學。",
  "occ.mechanic.blurb": "建造 4。修牆、打造、工坊是他的班表。起手 −4。",
  "occ.mechanic.desc":
    "先天建造 4、搜刮 1。免費懂車：修繕與打造多修一截。起手建材與油多。先升級工坊，派他打造，就能修裝備。戰鬥要另外點。",
  "occ.farmer.blurb": "農耕 4。菜園是他的家。起手 0 點，生命較高。",
  "occ.farmer.desc":
    "先天農耕 4、生命 105。沒有免費特質。升級菜園、派他耕作，糧食才穩。起手食物與水夠撐開頭。戰鬥弱，別押他清點。",
  "occ.veteran.blurb": "戰鬥 2，幾乎不恐慌。起手 −8，最貴的職業。",
  "occ.veteran.desc":
    "先天戰鬥 2、生命 105。免費脫敏：殺再多也不容易崩潰。自由點很少，缺點必須補滿。讓他帶隊打架、開槍。種田煮飯不是他的班。",
  "occ.burglar.blurb": "潛行 3。適合安靜搜刮、包抄。起手 −6。",
  "occ.burglar.desc":
    "先天潛行 3、搜刮 1、生命 90。免費竊賊手：開門較靜。派他潛行搜索，東西較少但少引僵屍。包抄要潛行合計 6。別當肉盾。",

  "sh.farmhouse.desc":
    "肯塔基鄉下兩層農舍。後院已有菜園與集水器，牆中等、僵屍少。適合學種田、慢慢囤糧。離補給遠，建材與藥得出門找。容量 4。鄰居更少。",
  "sh.hardware.desc":
    "西點主街五金行。工坊現成、建材多，第一晚就能派人打造修裝備、釘圍牆。容量 3，牆偏低，櫥窗夜裡會響——盡早修繕或警戒。",
  "sh.highrise.desc":
    "路易斯維爾六樓公寓。容量 5，已有電台與集水，能早看同州地圖。牆低、週遭已被搜空一半，食物要出更遠。下樓就是街區，夜襲要盯。",
  "create.occHint":
    "職業只給先天技能、生命、一筆點數，有的還附贈特質。消防員能打，醫生能救，技工能修，農夫能種。其餘靠性格與技能——點不夠就拿缺點換。",
  "create.skillHint":
    "剩餘點數加在技能上。出任務、煮飯、修牆、耕作都會繼續漲，上限 10。戰鬥打怪；潛行讓搜刮更靜、包抄要 6；搜刮決定帶回多少；醫療看護；建造修牆與打造修裝備；農耕種菜；烹飪煮飯。",
  "create.shelterHint":
    "第一夜要有一扇能鎖的門。農舍能種、五金能修、公寓人多但牆矮。選錯只是死得比較早——之後清光據點可以佔領搬家。",

  "ch.searchQuietHint": "極安靜。收穫約只有徹底翻找的四成。地點搜空就沒了。潛行高、不想引怪時用。",
  "ch.searchLoudHint": "東西多，噪音也大，容易把附近僵屍叫來。搜刮技能與背包加量。空屋翻也是空。",
  "ch.fightHint": "清光才能佔領搬家。打架本身不再召更多僵屍。剩一兩隻、沒大敗，可以掃乾淨。護甲減傷，防咬減感染。",
  "ch.meleeHint": "不耗彈，較安靜，容易受傷。近戰看武器與戰鬥技能。護甲、防咬在這時最有用。",
  "ch.gunHint": "耗彈、很吵、有效。沒彈或沒人帶槍會按不了。彈藥 {n}。",
  "ch.flankHint": "潛行合計要 6 才按得了。繞後較安全，不耗彈。",
  "map.hint":
    "真實美國地圖。縮放拖到肯塔基與中西部。點地點出任務。電台 1 級看同州、2 級看全圖。清光僵屍才能佔領搬家。終點是芝加哥。",

  "bible.play.house": "房間與工作",
  "bible.play.house.body":
    "升級只是蓋好空殼。工坊要派人「打造」才修裝備（耗 1 建材；2 級修兩件）。菜園要「耕作」才產糧。廚房減晚飯，「炊事」才額外出糧。集水器產水。「看護」要醫務室與藥才清感染。電台 1 級看同州、2 級全圖；「監聽」才找人。哨塔與警戒減夜襲。寢室每級多留一人。",
  "bible.play.gear.body":
    "武器管近戰與槍。護甲減傷害，防咬減感染，背包加搜刮。噪音引僵屍，疲勞過夜更累。壞了：升級工坊，派人打造，花 1 建材修倉庫最爛一件。完好度 40 以上丟掉可拆建材。",
  "bible.play.night.body":
    "過夜才結算工作、吃飯喝水、產糧產水、夜襲。廚房與集水器每級約減 0.4 人份。食物超過 10 腐壞。牆低、天數高，夜襲機率高。睡一覺行動恢復 6 格。",
  "bible.rule.build.body":
    "費用＝基礎×（目前+1）。醫務室要藥，無線電要油。不夠的會寫在按鈕上。工坊要打造才修裝備。菜園要耕作才產糧。",

  "trait.strong.blurb": "挨打少一點。近戰比較扛得住。",
  "trait.quiet.blurb": "走路更靜。搜刮、打架比較不引僵屍。",
  "trait.leader.blurb": "過夜給隊友一點情緒。帶隊較穩。",
  "trait.firstaid.blurb": "會包紮，也會判斷誰先死。",
  "trait.handy.blurb": "修繕與打造多修一截。工坊是他的家。",
  "trait.brave.blurb": "戰鬥傷害略高。往前衝，不太會蹲。",
  "trait.lucky.blurb": "搜刮較多，被咬感染也略低。",
  "trait.fastlearner.blurb": "技能漲得比較快。上限仍是 10。",
  "trait.coward.blurb": "看到僵屍手會抖。戰鬥傷害較差。",
  "trait.weak.blurb": "挨打多一點。一場感冒就能躺平。",
  "trait.insomnia.blurb": "休息減的疲勞較少。夜裡總在聽門外。",
  "trait.selfish.blurb": "跟人的關係漲得慢。口袋裡的東西不一定拿出來分。",
  "trait.clumsy.blurb": "搜刮與打架更吵。釘子會彎。",
  "trait.slowlearner.blurb": "技能漲得慢。同樣的傷要犯第二次。",
  "trait.smoker.blurb": "沒煙的時候，過夜更餓、情緒會掉。",
  "trait.pacifist.blurb": "戰鬥傷害較差。殺太多，情緒掉得更兇。",
  "trait.depressed.blurb": "過夜情緒較容易掉。要人陪、要熱食。",
  "trait.agoraphobic.blurb": "一出門情緒就掉。遠征對他是刑罰。",
};

export const whyEn: Record<string, string> = {
  "fac.beds.blurb":
    "Beds are how many people this house can keep. Each level holds one more. Rescue and radio pickups need a spare bed. When you occupy a new site, capacity follows that building — upgrades here do not move with you.",
  "fac.beds.effect": "+1 capacity per level. No bed, no extra soul.",
  "fac.kitchen.blurb":
    "A kitchen trims supper: about 0.4 fewer mouths per level. Assign Cook to actually make extra food and lift mood. Upgrade alone only stretches stores — it does not cook.",
  "fac.kitchen.effect": "−0.4 supper per level. Cook to gain food.",
  "fac.water.blurb":
    "Rain off the roof. Any level yields water (about level × 0.6, at least 1) and cuts drinking by ~0.4 per level. No cistern, you loot water. No one has to staff it.",
  "fac.water.effect": "Water ≈ level × 0.6. −0.4 drink per level.",
  "fac.workshop.blurb":
    "This is the only way to mend kit. Assign Craft and spend 1 material: wall +6, and the worst stash piece is repaired. Level 2 mends two pieces the same night. Worn gear gets 60%. No shop, Craft does nothing. Higher Build skill mends more.",
  "fac.workshop.effect": "Craft mends kit. Costs 1 material. Lv2 mends two.",
  "fac.infirmary.blurb":
    "Tend only works here. Overnight, every wounded person heals (~10 + Medical). Infection clears only if you have medicine. Upgrades also cost meds. No infirmary, Tend does nothing.",
  "fac.infirmary.effect": "Tend heals the house. Meds clear bites.",
  "fac.garden.blurb":
    "Plots do not grow themselves. Assign Farm. Yield is about garden level × (0.45 + Farm skill / 14). Empty shift, empty dirt. Food over 10 rots — eat it or cook it.",
  "fac.garden.effect": "Farm or it yields nothing. Level and Farm skill.",
  "fac.radio.blurb":
    "The set lights the map: level 1 shows same-state sites, level 2 the whole map (no one has to sit it). Assign Radio for ~35% a new pin, ~12% a voice — you need a spare bed to take them in. Upgrades cost fuel. Caves have no radio.",
  "fac.radio.effect": "Lv1 same state, lv2 all. Radio job finds people.",
  "fac.watch.blurb":
    "See them before they hit the boards. Each level cuts night-raid chance by ~4%, stacking with Guard. High walls are the real defense; the tower is insurance. Upgrade, it works — no one has to climb it.",
  "fac.watch.effect": "−4% raid per level. Stacks with Guard.",

  "job.rest.blurb":
    "No work. Overnight: about +12 HP, −35 fatigue, +6 mood. Crushed people can only Rest — they cannot leave, and they cannot hold another job.",
  "job.cook.blurb":
    "Needs a kitchen. Overnight +1 food (Keen Cook +1 more) and +8 mood. Kitchen level also trims supper. No kitchen, this job does nothing.",
  "job.farm.blurb":
    "Needs a garden. Overnight food scales with garden level and Farm skill. No farmer, the plot idles. This is how you stop living on cans.",
  "job.guard.blurb":
    "Night watch. Each guard cuts raid chance by ~5.5%. Low walls and later days make raids likelier. Costs no materials. Stacks with the tower.",
  "job.repair.blurb":
    "Mend the wall. Overnight +8, plus Build skill (Handy / vehicle knowledge +3). Costs no materials. High walls, fewer raids. Instant patch: 2 materials, 1 action.",
  "job.tend.blurb":
    "Needs an infirmary. Every wounded person heals overnight (~10 + Medical). Medicine gives a chance to clear infection. No infirmary, nothing happens.",
  "job.radio.blurb":
    "Needs a radio. ~35% a new site, ~12% a survivor (spare bed required). The set itself already shows same-state pins at lv1 and the whole map at lv2. This job is the extra find.",
  "job.craft.blurb":
    "Needs a workshop. The only way to mend kit. Spends 1 material: wall +6, repairs the worst stash piece (6 + Build, Handy +3). Shop lv2 mends two. Worn pieces get 60%. No shop or no lumber, this job does nothing.",

  "gear.stat.atk": "Melee {n} (hits)",
  "gear.stat.gun": "Gun (ammo, loud)",
  "gear.stat.arm": "Armor {n} (less damage)",
  "gear.stat.bite": "Bite {n} (less infection)",
  "gear.stat.cmb": "Combat {n}",
  "gear.stat.sth": "Stealth {n}",
  "gear.stat.scv": "Scavenge {n} (more loot)",
  "gear.stat.med": "Medical {n}",
  "gear.stat.bld": "Build {n}",
  "gear.stat.frm": "Farm {n}",
  "gear.stat.ck": "Cook {n}",
  "gear.stat.bag": "Carry {n} (more loot)",
  "gear.stat.fat": "Fatigue {n} (harder night)",
  "gear.stat.noise": "Noise {n} (draws zeds)",
  "gear.legend":
    "Weapon is melee and whether you can fire. Head, body, hands, legs, feet: armor cuts damage, bite resist cuts infection. The pack raises loot. Bigger numbers matter more. Noise draws them. Fatigue hurts the next night. Broken kit: upgrade the shop, assign Craft.",
  "gear.hint":
    "Armor cuts damage. Bite resist cuts infection. Pack size is loot. Noise draws zombies. Fatigue hits overnight. To mend: upgrade the workshop, assign Craft, spend 1 material. Condition 40+ salvages 1 material if thrown.",
  "gear.discardHint": "Throw away. Condition 40+ becomes 1 material. Junk is junk.",

  "roster.hint":
    "People at home run the house. Jobs resolve overnight. Tap slots to wear kit. Armor cuts hits, bite resist cuts infection, packs raise loot, noise draws them. To mend kit: upgrade the workshop, then assign Craft.",
  "roster.skills":
    "Skills rise on matching work and runs, cap 10. Combat hits. Stealth keeps searches quiet and unlocks flank at 6. Scavenge is how much you bring back. Medical tends. Build mends walls and kit. Farm grows food. Cook feeds the house.",
  "build.hint":
    "Rooms cost materials — sometimes meds or fuel. Price = base × (current level + 1). The workshop only mends kit if someone Crafts. The garden only feeds you if someone Farms. Kitchen trims supper. The cistern makes water. Short a resource, go loot it.",
  "build.repairWallHint": "Now: 2 materials, 1 action. High walls, fewer raids. Or assign Repair overnight — free of materials.",
  "hub.resHint":
    "Food and water: about 1 each per person per night. Kitchen and cistern trim that. Food over 10 rots. Materials upgrade rooms, patch walls, and Craft-mend kit. Meds clear bites. Ammo is for guns. Fuel is long trips and the radio.",
  "hub.wallNote":
    "Wall {n}. Low walls get raided. Assign Repair overnight (no materials), or spend 2 materials now. Guard and the tower cut the odds.",
  "meter.hp": "HP",
  "meter.hunger": "Hunger",
  "meter.thirst": "Thirst",
  "meter.morale": "Mood",

  "res.food.blurb": "About 1 per person per night. Kitchen −0.4 per level. Over 10 rots. Garden plus Farm is the stable way.",
  "res.water.blurb": "About 1 per person per night. Cistern yields and −0.4 drink per level. No cistern, loot it.",
  "res.materials.blurb": "Upgrades, instant wall patch (2), Craft-mend (1). Hardware stores and scrapyards hold the most.",
  "res.medicine.blurb": "Clears infection. Infirmary upgrades cost it. Hospitals and Lexington have more. No meds, a bite festers.",
  "res.ammo.blurb": "Guns spend it. Empty mag, melee or flank. Cops and veterans start with more.",
  "res.fuel.blurb": "Long trips and radio upgrades. River towns and steel cities have it.",

  "skill.combat.blurb": "Damage in fights. Rises when you fight. Firefighters and cops start higher.",
  "skill.stealth.blurb": "Quieter searches. Flank needs a total of 6. Burglars start high.",
  "skill.scavenge.blurb": "How much you bring back. Packs add more. Burglars and mechanics have a little.",
  "skill.medical.blurb": "Tend heals more. Doctors start at 6. Without it the infirmary is slow.",
  "skill.build.blurb": "Repair and Craft amounts. Mechanics start at 4. The shop listens to them.",
  "skill.farm.blurb": "Garden yield. Farmers start at 4. No farmer, the plot idles.",
  "skill.cook.blurb": "Cooking. Chefs start at 4 and come with Keen Cook. Hot food keeps people.",

  "occ.firefighter.blurb": "Axe, stamina. Front of the stack. 0 points. High HP.",
  "occ.firefighter.desc":
    "Combat 1, HP 110. No free trait. Spend negatives if you want more. Starts with some lumber and meds — enough to board a door. Put points in Combat and Build and they can fight and fix.",
  "occ.doctor.blurb": "Medical 6. Tend at home, save bites. Weak in a fight — do not lead.",
  "occ.doctor.desc":
    "Medical 6, Combat 1, HP 90. The hospital is gone; the hands are not. Leave them in the infirmary. Medicine is how infection actually clears. Starts with a lot of meds. Combat and stealth you buy.",
  "occ.officer.blurb": "Combat 4, can shoot. Starts at −4 — traits have to add up.",
  "occ.officer.desc":
    "Combat 4, Stealth 1. Guns spend ammo. The pool is negative; take flaws to spend. No farming. Clear sites, or Guard at home.",
  "occ.chef.blurb": "Cook 4, free Keen Cook. Kitchen plus Cook keeps a house. Starts −2.",
  "occ.chef.desc":
    "Cook 4, Build 1, Combat 1. Free Keen Cook: extra food when they cook. Starts with a lot of food. Upgrade the kitchen, assign Cook — overnight food and mood. Combat is extra.",
  "occ.mechanic.blurb": "Build 4. Walls, Craft, the shop. Starts −4.",
  "occ.mechanic.desc":
    "Build 4, Scavenge 1. Free vehicle knowledge: Repair and Craft mend more. Starts with lumber and fuel. Upgrade the shop, assign Craft, and kit gets fixed. Combat you buy.",
  "occ.farmer.blurb": "Farm 4. The garden is home. 0 points. High HP.",
  "occ.farmer.desc":
    "Farm 4, HP 105. No free trait. Upgrade the garden, assign Farm, or you live on cans. Starts with food and water. Weak in a fight — do not send them to clear.",
  "occ.veteran.blurb": "Combat 2, barely panics. Starts −8. The expensive job.",
  "occ.veteran.desc":
    "Combat 2, HP 105. Free Desensitized: killing does not break them. Few free points; flaws must cover it. They lead fights and guns. Dirt and pots are not their shift.",
  "occ.burglar.blurb": "Stealth 3. Quiet loot, flank. Starts −6.",
  "occ.burglar.desc":
    "Stealth 3, Scavenge 1, HP 90. Free burglar hands: quieter doors. Quiet search brings less and draws less. Flank needs stealth 6. Not a meat shield.",

  "sh.farmhouse.desc":
    "Two stories in Kentucky dirt. Garden and cistern already in. Mid walls, few zeds. Learn to farm and stock slowly. Loot is far — lumber and meds are a trip. Capacity 4. Fewer neighbors.",
  "sh.hardware.desc":
    "West Point main street. Shop already there, lumber in the back. Night one you can Craft and board windows. Capacity 3, walls low, glass rattles after dark — Repair or Guard early.",
  "sh.highrise.desc":
    "Louisville sixth floor. Capacity 5, radio and cistern already in — same-state pins light early. Walls low, the block is half eaten, food is farther. Downstairs is the street. Watch the raids.",
  "create.occHint":
    "A job gives innate skills, HP, a point pool, sometimes a free trait. Firefighters hit. Doctors save. Mechanics fix. Farmers grow. The rest is traits and the skill menu — take flaws if you are short.",
  "create.skillHint":
    "Spend leftover points. Runs, cooking, walls, and dirt keep raising skills — cap 10. Combat hits. Stealth quiets searches and unlocks flank at 6. Scavenge is loot. Medical tends. Build mends walls and kit. Farm grows food. Cook feeds the house.",
  "create.shelterHint":
    "Night one needs a door that locks. The farm grows. The hardware shop mends. The walk-up holds more people and a worse wall. A bad pick just dies sooner — clear a site later and move in.",

  "ch.searchQuietHint": "Very quiet. About 40% of a loud search. Empty rooms stay empty. Use it when stealth is high and you do not want a crowd.",
  "ch.searchLoudHint": "More loot, more noise, nearby zeds come. Scavenge and packs raise the take. Empty is still empty.",
  "ch.fightHint": "Clear them to occupy. Fighting itself does not spawn more. Last one or two, if you did not fold, you can finish. Armor cuts hits. Bite resist cuts infection.",
  "ch.meleeHint": "No ammo, quieter, you get hit. Weapon and Combat decide it. Armor and bite resist matter here.",
  "ch.gunHint": "Spends ammo, loud, works. No ammo or no gun, the button dies. Ammo {n}.",
  "ch.flankHint": "Needs stealth 6 on the squad. Safer, no ammo.",
  "map.hint":
    "Real US map. Pinch to Kentucky and the Midwest. Tap a pin to run. Radio lv1 same state, lv2 everywhere. Clear the zeds to occupy and move. The end is Chicago.",

  "bible.play.house": "Rooms and work",
  "bible.play.house.body":
    "Upgrades are empty shells until someone works them. Craft in a workshop mends kit (1 material; lv2 mends two). Farm a garden or it yields nothing. Kitchen trims supper; Cook makes extra food. Cistern makes water. Tend needs an infirmary and meds to clear bites. Radio lv1 same state, lv2 all; the Radio job finds people. Tower and Guard cut raids. Each bed level holds one more.",
  "bible.play.gear.body":
    "Weapons are melee and guns. Armor cuts damage. Bite resist cuts infection. Packs raise loot. Noise draws them. Fatigue hits overnight. Broken kit: upgrade the shop, assign Craft, spend 1 material on the worst stash piece. Condition 40+ salvages material if thrown.",
  "bible.play.night.body":
    "Night resolves jobs, meals, water, yields, and raids. Kitchen and cistern cut about 0.4 mouths per level. Food over 10 rots. Low walls and later days raise raid chance. Sleep restores 6 actions.",
  "bible.rule.build.body":
    "Cost = base × (current + 1). Infirmary wants meds, radio wants fuel. The button tells you what is short. Craft mends kit. Farm yields food.",

  "trait.strong.blurb": "Takes less from hits. Lasts longer in a shove.",
  "trait.quiet.blurb": "Walks quieter. Searches and fights draw less.",
  "trait.leader.blurb": "Overnight, everyone else's mood ticks up.",
  "trait.firstaid.blurb": "Can wrap a wound. Knows who dies first.",
  "trait.handy.blurb": "Repair and Craft mend more. The shop is home.",
  "trait.brave.blurb": "Hits a little harder. Goes forward. Does not crouch much.",
  "trait.lucky.blurb": "More loot. A bite is a little less likely to take.",
  "trait.fastlearner.blurb": "Skills rise faster. Cap is still 10.",
  "trait.coward.blurb": "Hands shake. Combat hits worse.",
  "trait.weak.blurb": "Takes more from hits. A cold can put them down.",
  "trait.insomnia.blurb": "Rest clears less fatigue. Always listening at the door.",
  "trait.selfish.blurb": "Bonds rise slower. What is in the pocket may stay there.",
  "trait.clumsy.blurb": "Searches and fights are louder. Nails bend.",
  "trait.slowlearner.blurb": "Skills rise slower. Same wound twice.",
  "trait.smoker.blurb": "No smoke: hungrier overnight, mood drops.",
  "trait.pacifist.blurb": "Hits worse. Too much killing drops mood harder.",
  "trait.depressed.blurb": "Mood drops overnight. Needs company and hot food.",
  "trait.agoraphobic.blurb": "Leaving the house costs mood. A long run is a sentence.",
};

export const whyJa: Record<string, string> = {
  "fac.beds.blurb":
    "ベッドは何人養えるか。1級ごとに定員+1。救うにも無線で拾うにも空きが要る。拠点を移すと定員は向こうの建物に従う。ここの強化は持っていけない。",
  "fac.beds.effect": "1級で定員+1。ベッドがなければ増やせない。",
  "fac.kitchen.blurb":
    "台所は夕飯を減らす。1級あたり約0.4人分。「炊事」を割り当てると追加の食料と士気。強化だけなら節約になるだけで、飯は増えない。",
  "fac.kitchen.effect": "1級で夕飯−0.4人分。炊事で追加の食料。",
  "fac.water.blurb":
    "屋根の雨。レベルがあれば水が出る（約レベル×0.6、最低1）。1級ごとに飲水量も約0.4減。なければ水は漁り。誰も座らなくていい。",
  "fac.water.effect": "水は約レベル×0.6。1級で渇き−0.4。",
  "fac.workshop.blurb":
    "装備を直す唯一の場所。「工作」を割り当て、資材1：防壁+6、倉庫で一番ひどい一件を直す。2級なら同じ夜に二件。装備中は6割。工房がなければ工作は無効。工作技能が高いほど直る。",
  "fac.workshop.effect": "「工作」で装備修理。資材1。2級は二件。",
  "fac.infirmary.blurb":
    "「看護」は医務室がないと動かない。負傷者全員が夜に大きく回復（約10+医療）。感染は薬があって初めて消える。強化にも薬。医務室がなければ看護は無効。",
  "fac.infirmary.effect": "看護は家中の傷を見る。薬で感染を消す。",
  "fac.garden.blurb":
    "畑は一人では伸びない。「耕作」が要る。収穫は菜園レベル×(0.45+農耕/14)ほど。人がいなければ空き地。食料が10を超えると腐る。食うか調理するか。",
  "fac.garden.effect": "「耕作」がないと実らない。レベルと農耕。",
  "fac.radio.blurb":
    "無線は地図を灯す。1級で同州、2級で全域（座らなくていい）。「傍受」は約35%で新地点、12%で人——空きベッドが要る。強化は燃料。洞窟の占領には無線がない。",
  "fac.radio.effect": "1級は同州、2級は全域。傍受で人を拾う。",
  "fac.watch.blurb":
    "夜の前に見る。1級ごとに夜襲率約−4%。警戒と重なる。防壁が高いのが本筋、塔は保険。強化すれば効く。登らなくていい。",
  "fac.watch.effect": "1級で夜襲−4%。警戒と重なる。",

  "job.rest.blurb":
    "働かない。夜で体力約+12、疲労約−35、士気+6。落ちた者は休息しかできない。外出も他の仕事も不可。",
  "job.cook.blurb":
    "台所が要る。夜に食料+1（料理上手ならさらに+1）、士気+8。台所レベルは夕飯も減らす。台所がなければ無効。",
  "job.farm.blurb":
    "菜園が要る。夜の収穫はレベルと農耕。耕す人がいなければ空転。缶に頼らない正道。",
  "job.guard.blurb":
    "夜番。一人で夜襲率約−5.5%。壁が低く日が進むほど襲われやすい。資材は使わない。塔と重なる。",
  "job.repair.blurb":
    "防壁を直す。夜で+8、工作技能（器用／車の知識で+3）。資材は使わない。壁が高いと夜襲が減る。今すぐ直すなら資材2、行動1。",
  "job.tend.blurb":
    "医務室が要る。負傷者全員が夜に回復（約10+医療）。薬があれば感染を消せる。医務室がなければ無効。",
  "job.radio.blurb":
    "無線が要る。約35%で新地点、12%で生存者（空きベッド必須）。機械自体は1級で同州、2級で全域。傍受は追加の発見。",
  "job.craft.blurb":
    "工房が要る。装備を直す唯一の手段。資材1：防壁+6、倉庫の最悪を直す（量は6+工作、器用なら+3）。2級は二件。装備中は6割。工房も資材もなければ無効。",

  "gear.stat.atk": "近接 {n}（攻撃）",
  "gear.stat.gun": "銃（弾、うるさい）",
  "gear.stat.arm": "装甲 {n}（被弾減）",
  "gear.stat.bite": "耐咬 {n}（感染減）",
  "gear.stat.cmb": "戦闘 {n}",
  "gear.stat.sth": "隠密 {n}",
  "gear.stat.scv": "漁り {n}（持ち帰り増）",
  "gear.stat.med": "医療 {n}",
  "gear.stat.bld": "工作 {n}",
  "gear.stat.frm": "農耕 {n}",
  "gear.stat.ck": "料理 {n}",
  "gear.stat.bag": "荷重 {n}（持ち帰り増）",
  "gear.stat.fat": "疲労 {n}（翌朝に響く）",
  "gear.stat.noise": "騒音 {n}（ゾンビを呼ぶ）",
  "gear.legend":
    "武器は近接と発砲可否。頭・体・手・脚・足の装甲は被弾減、耐咬は感染減。バッグは持ち帰り。数字が大きいほど効く。騒音は敵を呼び、疲労は夜通し残る。壊れたら工房を上げ、「工作」を割り当てる。",
  "gear.hint":
    "装甲は被弾減。耐咬は感染減。バッグは持ち帰り。騒音はゾンビを呼ぶ。疲労は夜通し響く。直すには工房を上げ、「工作」に資材1。耐久40以上を捨てると資材1になる。",
  "gear.discardHint": "捨てる。耐久40以上は資材1。ゴミはゴミ。",

  "roster.hint":
    "残った者が家を回す。仕事は夜に解決。部位を押して装備。装甲は被弾減、耐咬は感染減、バッグは持ち帰り、騒音は敵を呼ぶ。装備を直すなら工房を上げて「工作」。",
  "roster.skills":
    "技能は仕事と出撃で伸び、上限10。戦闘は打撃。隠密は静かな漁りと、合計6で側面。漁りは持ち帰り。医療は看護。工作は壁と装備。農耕は畑。料理は飯。",
  "build.hint":
    "部屋は資材。薬や燃料が要ることもある。費用＝基礎×（現在+1）。工房は「工作」を置いて初めて装備が直る。菜園は「耕作」がないと実らない。台所は夕飯減、貯水は水。足りないものは漁りに出る。",
  "build.repairWallHint": "今すぐ：資材2、行動1。壁が高いと夜襲が減る。「修繕」なら夜に少しずつ、資材なし。",
  "hub.resHint":
    "食料と水は一人一夜おおよそ1。台所と貯水で減る。食料が10超で腐る。資材は強化、壁、工作修理。薬は感染。弾は銃。燃料は遠征と無線。",
  "hub.wallNote":
    "防壁 {n}。低いと夜襲。「修繕」は夜に直す（資材なし）。今すぐなら資材2。警戒と塔が確率を下げる。",
  "meter.hp": "体力",
  "meter.hunger": "空腹",
  "meter.thirst": "渇き",
  "meter.morale": "士気",

  "res.food.blurb": "一人一夜おおよそ1。台所1級で約−0.4。10超で腐る。菜園と耕作が正道。",
  "res.water.blurb": "一人一夜おおよそ1。貯水は出して、1級で約−0.4。なければ漁る。",
  "res.materials.blurb": "部屋の強化、今すぐの壁（2）、工作修理（1）。金物屋と廃鉄が多い。",
  "res.medicine.blurb": "感染を消す。医務室の強化にも要る。病院とレキシントン。薬がなければ傷は腐る。",
  "res.ammo.blurb": "発砲で減る。弾がなければ近接か側面。警官と退役が多い。",
  "res.fuel.blurb": "遠征と無線の強化。川沿いと鋼の街。",

  "skill.combat.blurb": "打撃。出撃の喧嘩で伸びる。消防士と警官が高め。",
  "skill.stealth.blurb": "漁りが静か。側面は合計6。泥棒が先天で高い。",
  "skill.scavenge.blurb": "持ち帰り量。バッグも加算。泥棒と整備士が少し。",
  "skill.medical.blurb": "看護の回復。医師は先天6。低いと医務室も遅い。",
  "skill.build.blurb": "修繕と工作の量。整備士は先天4。工房は彼の場所。",
  "skill.farm.blurb": "耕作の収穫。農夫は先天4。人がいなければ空き地。",
  "skill.cook.blurb": "炊事。料理人は先天4、料理上手つき。熱い飯が人を残す。",

  "occ.firefighter.blurb": "斧と体力。先鋒向き。初期0点。体力が高い。",
  "occ.firefighter.desc":
    "戦闘1、体力110。無料特性なし。強くするなら欠点で点を買う。初期に資材と薬が少し。戦闘と工作を振れば殴れて直せる。",
  "occ.doctor.blurb": "医療6。家で看護して感染を止める。戦闘は弱い。先鋒にするな。",
  "occ.doctor.desc":
    "医療6、戦闘1、体力90。病院は消えたが手は残っている。医務室に置け。薬があって初めて感染が消える。初期の薬が多い。戦闘と隠密は自分で振る。",
  "occ.officer.blurb": "戦闘4、銃が撃てる。初期−4。特性は計算しろ。",
  "occ.officer.desc":
    "戦闘4、隠密1。発砲は弾。点数はマイナス、欠点を取らないと振れない。農業はゼロ。出撃で掃くか、家で警戒。",
  "occ.chef.blurb": "料理4、料理上手つき。台所と炊事で家が残る。初期−2。",
  "occ.chef.desc":
    "料理4、工作1、戦闘1。無料の料理上手：炊事で食料がもう1。初期の食料が多い。台所を上げて炊事。戦闘は別。",
  "occ.mechanic.blurb": "工作4。壁、工作、工房。初期−4。",
  "occ.mechanic.desc":
    "工作4、漁り1。無料の車の知識：修繕と工作が伸びる。初期に資材と燃料。工房を上げて工作を置けば装備が直る。戦闘は自分で振る。",
  "occ.farmer.blurb": "農耕4。菜園が家。初期0点。体力が高い。",
  "occ.farmer.desc":
    "農耕4、体力105。無料特性なし。菜園を上げて耕作。缶暮らしから抜ける。初期の食料と水で頭を繋ぐ。戦闘は弱い。掃討に出すな。",
  "occ.veteran.blurb": "戦闘2、ほとんど動じない。初期−8。一番高い職業。",
  "occ.veteran.desc":
    "戦闘2、体力105。無料の脱感作：殺しても折れにくい。自由点は少ない。欠点で埋める。喧嘩と銃。畑と鍋は他人の番。",
  "occ.burglar.blurb": "隠密3。静かな漁り、側面。初期−6。",
  "occ.burglar.desc":
    "隠密3、漁り1、体力90。無料の泥棒の手：扉が静か。隠密捜索は少ないが呼ばない。側面は隠密6。肉盾にするな。",

  "sh.farmhouse.desc":
    "ケンタッキーの二階建て。菜園と貯水が最初からある。壁は中、ゾンビは少ない。農を覚えて備蓄。補給は遠い。定員4。隣人はさらに少ない。",
  "sh.hardware.desc":
    "ウェストポイントの本通り。工房つき、資材が多い。初夜から工作と板張り。定員3、壁は低く、夜にガラスが鳴る。早く修繕か警戒。",
  "sh.highrise.desc":
    "ルイビル6階。定員5、無線と貯水つき。同州の地図が早い。壁は低く、街区は半分空。食料は遠く。下は通り。夜襲を見ろ。",
  "create.occHint":
    "職業は先天技能、体力、点数、時には無料特性。消防士は殴る。医師は救う。整備士は直す。農夫は育てる。足りなければ欠点で買え。",
  "create.skillHint":
    "残りを技能に振る。出撃、料理、壁、畑で伸びる。上限10。戦闘は打撃。隠密は静かな漁りと、6で側面。漁りは持ち帰り。医療は看護。工作は壁と装備。農耕は畑。料理は飯。",
  "create.shelterHint":
    "最初の夜は鍵のかかる扉。農家は育て、金物は直し、アパートは人数が多く壁が低い。失敗は早く死ぬだけ——あとで掃いて引っ越せる。",

  "ch.searchQuietHint": "とても静か。徹底の約4割。空なら空。隠密が高く、呼びたくないときに。",
  "ch.searchLoudHint": "物は多い。騒音も大きい。近くのゾンビが来る。漁りとバッグで増える。空は空。",
  "ch.fightHint": "全滅させて占領。喧嘩自体は増やさない。残り一、二匹、大敗していなければ掃ける。装甲は被弾減、耐咬は感染減。",
  "ch.meleeHint": "弾を使わない。静かめ、傷つきやすい。武器と戦闘。装甲と耐咬がここで効く。",
  "ch.gunHint": "弾を使い、うるさい、効く。弾も銃もなければ押せない。弾薬 {n}。",
  "ch.flankHint": "隠密合計6が要る。安全め、弾を使わない。",
  "map.hint":
    "実在のアメリカ地図。ケンタッキーと中西部へピンチ。地点をタップして出撃。無線1級は同州、2級は全域。ゾンビを掃いて占領。終わりはシカゴ。",

  "bible.play.house": "部屋と仕事",
  "bible.play.house.body":
    "強化は殻。「工作」が工房で装備を直す（資材1、2級は二件）。菜園は「耕作」がないと実らない。台所は夕飯減、「炊事」が追加の食料。貯水は水。「看護」は医務室と薬。無線1級は同州、2級は全域。「傍受」が人を拾う。塔と警戒が夜襲を減らす。寝室は1級で一人。",
  "bible.play.gear.body":
    "武器は近接と銃。装甲は被弾減。耐咬は感染減。バッグは持ち帰り。騒音は敵を呼ぶ。疲労は夜通し。壊れたら工房を上げ、工作に資材1。耐久40以上を捨てると資材。",
  "bible.play.night.body":
    "夜に仕事、食事、水、収穫、夜襲が決まる。台所と貯水は1級で約0.4人分減。食料10超で腐る。壁が低く日が進むと夜襲。眠れば行動6。",
  "bible.rule.build.body":
    "費用＝基礎×（現在+1）。医務室は薬、無線は燃料。足りないものはボタンに出る。工作が装備を直す。耕作が食料。",

  "trait.strong.blurb": "被弾が少し減る。押し合いに強い。",
  "trait.quiet.blurb": "足音が小さい。漁りも喧嘩も呼ばない。",
  "trait.leader.blurb": "夜、他の者の士気が少し上がる。",
  "trait.firstaid.blurb": "包帯を巻ける。誰が先に死ぬかもわかる。",
  "trait.handy.blurb": "修繕と工作が伸びる。工房が家。",
  "trait.brave.blurb": "打撃が少し高い。前に出る。あまり屈まない。",
  "trait.lucky.blurb": "漁りが多い。咬まれても感染しにくい。",
  "trait.fastlearner.blurb": "技能の伸びが速い。上限は10のまま。",
  "trait.coward.blurb": "手が震える。戦闘が弱い。",
  "trait.weak.blurb": "被弾が増える。風邪で倒れうる。",
  "trait.insomnia.blurb": "休息の疲労減が少ない。夜も扉を聞いている。",
  "trait.selfish.blurb": "絆が伸びにくい。ポケットのものは出さないかも。",
  "trait.clumsy.blurb": "漁りも喧嘩もうるさい。釘が曲がる。",
  "trait.slowlearner.blurb": "技能の伸びが遅い。同じ傷を二度。",
  "trait.smoker.blurb": "煙がないと夜に飢え、士気が落ちる。",
  "trait.pacifist.blurb": "打撃が弱い。殺しすぎると士気が大きく落ちる。",
  "trait.depressed.blurb": "夜に士気が落ちやすい。人と熱い飯が要る。",
  "trait.agoraphobic.blurb": "外出しただけで士気が落ちる。遠征は刑。",
};

export const whyKo: Record<string, string> = {
  "fac.beds.blurb":
    "침대가 몇 명을 살릴 수 있는지다. 1레벨마다 수용 +1. 구하고 무전으로 들이려면 빈자리가 필요하다. 거점을 옮기면 수용은 그 건물 것을 따른다. 여기 강화는 가져가지 못한다.",
  "fac.beds.effect": "레벨마다 수용 +1. 침대 없으면 못 들인다.",
  "fac.kitchen.blurb":
    "부엌은 저녁을 줄인다. 레벨당 약 0.4명분. 「취사」를 맡기면 식량이 더 나오고 사기가 오른다. 강화만 하면 아낄 뿐, 밥이 생기진 않는다.",
  "fac.kitchen.effect": "레벨당 저녁 −0.4명분. 취사해야 식량이 는다.",
  "fac.water.blurb":
    "지붕의 비. 레벨이 있으면 물이 나온다(약 레벨×0.6, 최소 1). 레벨마다 마시는 양도 약 0.4 줄어든다. 없으면 물을 찾으러 나가야 한다. 지킬 사람은 필요 없다.",
  "fac.water.effect": "물 ≈ 레벨×0.6. 레벨당 갈증 −0.4.",
  "fac.workshop.blurb":
    "장비를 고치는 유일한 곳. 「제작」을 맡기고 자재 1: 방벽 +6, 창고에서 제일 낡은 한 점을 고친다. 2레벨이면 같은 밤에 두 점. 입은 것은 60%. 공방 없으면 제작은 무효. 건설 스킬이 높을수록 더 고친다.",
  "fac.workshop.effect": "「제작」해야 장비가 고쳐진다. 자재 1. 2레벨은 두 점.",
  "fac.infirmary.blurb":
    "「간호」는 의무실이 있어야 한다. 모든 부상자가 밤에 크게 회복(약 10+의료). 감염은 약이 있어야 지워질 수 있다. 강화에도 약. 의무실 없으면 간호는 무효.",
  "fac.infirmary.effect": "간호가 집 안 상처를 본다. 약으로 감염을 지운다.",
  "fac.garden.blurb":
    "밭은 혼자 안 자란다. 「농사」가 필요하다. 수확은 텃밭 레벨×(0.45+농사/14)쯤. 사람이 없으면 공터. 식량 10 초과는 썩는다. 먹거나 삶거나.",
  "fac.garden.effect": "「농사」해야 난다. 레벨과 농사 스킬.",
  "fac.radio.blurb":
    "무전기는 지도를 켠다. 1레벨 같은 주, 2레벨 전체(앉지 않아도 된다). 「청취」는 약 35% 새 지점, 12% 사람——빈 침대가 있어야 들인다. 강화는 연료. 동굴 점령에는 무전이 없다.",
  "fac.radio.effect": "1레벨 같은 주, 2레벨 전체. 청취가 사람을 찾는다.",
  "fac.watch.blurb":
    "밤에 오기 전에 본다. 레벨마다 야습 확률 약 −4%. 경계와 겹친다. 높은 벽이 본전, 탑은 보험. 올리면 바로 된다. 올라갈 사람은 필요 없다.",
  "fac.watch.effect": "레벨당 야습 −4%. 경계와 겹친다.",

  "job.rest.blurb":
    "일하지 않는다. 밤에 체력 약 +12, 피로 약 −35, 사기 +6. 무너진 사람은 휴식만 가능하다. 나가지도, 다른 일도 못 한다.",
  "job.cook.blurb":
    "부엌이 필요하다. 밤에 식량 +1(요리 특기면 +1 더), 사기 +8. 부엌 레벨은 저녁도 줄인다. 부엌 없으면 무효.",
  "job.farm.blurb":
    "텃밭이 필요하다. 밤 수확은 레벨과 농사 스킬. 경작자가 없으면 공회전. 캔에 살지 않는 정석.",
  "job.guard.blurb":
    "밤샘. 한 명당 야습 확률 약 −5.5%. 벽이 낮고 날이 갈수록 잘 습격한다. 자재는 안 쓴다. 탑과 겹친다.",
  "job.repair.blurb":
    "방벽을 고친다. 밤에 +8, 건설 스킬(손재주/차 지식이면 +3). 자재는 안 쓴다. 벽이 높으면 야습이 준다. 지금 고치면 자재 2, 행동 1.",
  "job.tend.blurb":
    "의무실이 필요하다. 모든 부상자가 밤에 회복(약 10+의료). 약이 있으면 감염을 지울 수 있다. 의무실 없으면 무효.",
  "job.radio.blurb":
    "무전기가 필요하다. 약 35% 새 지점, 12% 생존자(빈 침대 필수). 기계 자체는 1레벨 같은 주, 2레벨 전체. 청취는 추가 발견.",
  "job.craft.blurb":
    "공방이 필요하다. 장비를 고치는 유일한 방법. 자재 1: 방벽 +6, 창고에서 제일 낡은 것을 고친다(양 6+건설, 손재주면 +3). 2레벨은 두 점. 입은 것은 60%. 공방이나 자재가 없으면 무효.",

  "gear.stat.atk": "근접 {n} (타격)",
  "gear.stat.gun": "총 (탄, 시끄러움)",
  "gear.stat.arm": "장갑 {n} (피해 감소)",
  "gear.stat.bite": "물림 {n} (감염 감소)",
  "gear.stat.cmb": "전투 {n}",
  "gear.stat.sth": "은신 {n}",
  "gear.stat.scv": "수색 {n} (수거 증가)",
  "gear.stat.med": "의료 {n}",
  "gear.stat.bld": "건설 {n}",
  "gear.stat.frm": "농사 {n}",
  "gear.stat.ck": "요리 {n}",
  "gear.stat.bag": "휴대 {n} (수거 증가)",
  "gear.stat.fat": "피로 {n} (밤에 더 힘듦)",
  "gear.stat.noise": "소음 {n} (좀비를 부름)",
  "gear.legend":
    "무기는 근접과 발사 여부. 머리·몸·손·다리·발의 장갑은 피해 감소, 물림 저항은 감염 감소. 배낭은 수거량. 숫자가 클수록 세다. 소음은 좀비를 부르고, 피로는 밤에 남는다. 고장 나면 공방을 올리고 「제작」을 맡겨라.",
  "gear.hint":
    "장갑은 피해 감소. 물림 저항은 감염 감소. 배낭은 수거. 소음은 좀비를 부른다. 피로는 밤에 남는다. 고치려면 공방을 올리고 「제작」에 자재 1. 내구 40 이상을 버리면 자재 1.",
  "gear.discardHint": "버린다. 내구 40 이상은 자재 1. 쓰레기는 쓰레기.",

  "roster.hint":
    "남은 사람이 집을 돌린다. 일은 밤에 처리. 부위를 눌러 장비를 입는다. 장갑은 피해 감소, 물림은 감염 감소, 배낭은 수거, 소음은 적을 부른다. 장비를 고치려면 공방을 올리고 「제작」.",
  "roster.skills":
    "스킬은 일과 출격에서 오르고 상한 10. 전투는 타격. 은신은 조용한 수색과, 합 6이면 측면. 수색은 가져오는 양. 의료는 간호. 건설은 벽과 장비. 농사는 밭. 요리는 밥.",
  "build.hint":
    "방은 자재. 약이나 연료가 필요할 때도 있다. 비용=기본×(현재+1). 공방은 「제작」을 둬야 장비가 고쳐진다. 텃밭은 「농사」가 없으면 안 난다. 부엌은 저녁 감소, 집수기는 물. 모자라면 나가서 찾아라.",
  "build.repairWallHint": "지금: 자재 2, 행동 1. 벽이 높으면 야습이 준다. 「수리」는 밤에 조금씩, 자재 없음.",
  "hub.resHint":
    "식량과 물은 한 사람 하룻밤에 대략 1. 부엌과 집수기가 줄인다. 식량 10 초과는 썩는다. 자재는 강화, 벽, 제작 수리. 약은 감염. 탄은 총. 연료는 원정과 무전.",
  "hub.wallNote":
    "방벽 {n}. 낮으면 야습. 「수리」는 밤에 고친다(자재 없음). 지금이면 자재 2. 경계와 탑이 확률을 낮춘다.",
  "meter.hp": "체력",
  "meter.hunger": "허기",
  "meter.thirst": "갈증",
  "meter.morale": "사기",

  "res.food.blurb": "한 사람 하룻밤 대략 1. 부엌 레벨당 약 −0.4. 10 초과는 썩는다. 텃밭과 농사가 정석.",
  "res.water.blurb": "한 사람 하룻밤 대략 1. 집수기가 나오고 레벨당 약 −0.4. 없으면 찾아라.",
  "res.materials.blurb": "방 강화, 지금 벽(2), 제작 수리(1). 철물점과 고철장이 많다.",
  "res.medicine.blurb": "감염을 지운다. 의무실 강화에도 든다. 병원과 렉싱턴. 약 없으면 상처가 썩는다.",
  "res.ammo.blurb": "총을 쏴야 준다. 탄 없으면 근접이나 측면. 경찰과 퇴역이 많다.",
  "res.fuel.blurb": "원정과 무전 강화. 강변과 철강 도시.",

  "skill.combat.blurb": "타격. 출격 싸움에서 오른다. 소방과 경찰이 높다.",
  "skill.stealth.blurb": "수색이 조용하다. 측면은 합 6. 도둑이 선천적으로 높다.",
  "skill.scavenge.blurb": "가져오는 양. 배낭도 더한다. 도둑과 정비공이 조금.",
  "skill.medical.blurb": "간호 회복량. 의사는 선천 6. 낮으면 의무실도 느리다.",
  "skill.build.blurb": "수리와 제작의 양. 정비공은 선천 4. 공방은 그 자리다.",
  "skill.farm.blurb": "농사 수확. 농부는 선천 4. 사람 없으면 공터.",
  "skill.cook.blurb": "취사. 요리사는 선천 4, 요리 특기 포함. 따뜻한 밥이 사람을 남긴다.",

  "occ.firefighter.blurb": "도끼, 체력. 선봉. 시작 0점. 체력이 높다.",
  "occ.firefighter.desc":
    "전투 1, 체력 110. 무료 특성 없음. 더 세게 하려면 단점으로 점을 산다. 시작에 자재와 약이 조금. 전투와 건설을 찍으면 때리고 고친다.",
  "occ.doctor.blurb": "의료 6. 집에서 간호해 감염을 막는다. 싸움은 약하다. 선봉 시키지 마라.",
  "occ.doctor.desc":
    "의료 6, 전투 1, 체력 90. 병원은 없어도 손은 남았다. 의무실에 남겨라. 약이 있어야 감염이 지워진다. 시작 약이 많다. 전투와 은신은 따로 찍는다.",
  "occ.officer.blurb": "전투 4, 총을 쏜다. 시작 −4. 특성을 계산하라.",
  "occ.officer.desc":
    "전투 4, 은신 1. 총은 탄. 점수는 마이너스, 단점을 받아야 찍는다. 농사는 없다. 출격해 쓸거나 집에서 경계.",
  "occ.chef.blurb": "요리 4, 요리 특기. 부엌과 취사가 집을 남긴다. 시작 −2.",
  "occ.chef.desc":
    "요리 4, 건설 1, 전투 1. 무료 요리 특기: 취사 때 식량 +1. 시작 식량이 많다. 부엌을 올리고 취사. 전투는 따로.",
  "occ.mechanic.blurb": "건설 4. 벽, 제작, 공방. 시작 −4.",
  "occ.mechanic.desc":
    "건설 4, 수색 1. 무료 차 지식: 수리와 제작이 더 된다. 시작에 자재와 연료. 공방을 올리고 제작을 맡기면 장비가 고쳐진다. 전투는 따로.",
  "occ.farmer.blurb": "농사 4. 텃밭이 집. 시작 0점. 체력이 높다.",
  "occ.farmer.desc":
    "농사 4, 체력 105. 무료 특성 없음. 텃밭을 올리고 농사. 캔 생활에서 빠져나온다. 시작 식량과 물로 버틴다. 싸움은 약하다. 소탕에 보내지 마라.",
  "occ.veteran.blurb": "전투 2, 거의 무너지지 않는다. 시작 −8. 가장 비싼 직업.",
  "occ.veteran.desc":
    "전투 2, 체력 105. 무료 둔감: 죽여도 잘 안 무너진다. 자유 점이 적다. 단점으로 메워라. 싸움과 총. 밭과 냄비는 남의 교대.",
  "occ.burglar.blurb": "은신 3. 조용한 수색, 측면. 시작 −6.",
  "occ.burglar.desc":
    "은신 3, 수색 1, 체력 90. 무료 도둑 손: 문이 조용하다. 은밀 수색은 적게 가져오고 적게 부른다. 측면은 은신 6. 방패로 쓰지 마라.",

  "sh.farmhouse.desc":
    "켄터키 이층 농가. 텃밭과 집수기가 처음부터 있다. 벽은 중간, 좀비는 적다. 농사를 배우고 비축. 보급은 멀다. 수용 4. 이웃은 더 적다.",
  "sh.hardware.desc":
    "웨스트포인트 본거리. 공방이 있고 자재가 많다. 첫날 밤부터 제작과 널빤지. 수용 3, 벽이 낮고 밤에 유리가 운다. 빨리 수리나 경계.",
  "sh.highrise.desc":
    "루이빌 6층. 수용 5, 무전과 집수기. 같은 주 지도가 일찍 켜진다. 벽이 낮고 거리는 반이 비었다. 식량은 더 멀다. 아래는 거리. 야습을 봐라.",
  "create.occHint":
    "직업은 선천 스킬, 체력, 점수, 가끔 무료 특성. 소방은 때리고, 의사는 살리고, 정비는 고치고, 농부는 기른다. 모자라면 단점으로 사라.",
  "create.skillHint":
    "남은 점을 스킬에. 출격, 요리, 벽, 밭에서 오른다. 상한 10. 전투는 타격. 은신은 조용한 수색과, 6이면 측면. 수색은 수거. 의료는 간호. 건설은 벽과 장비. 농사는 밭. 요리는 밥.",
  "create.shelterHint":
    "첫날 밤은 잠기는 문. 농가는 기르고, 철물은 고치고, 아파트는 사람이 많고 벽이 낮다. 잘못 고르면 더 빨리 죽을 뿐——나중에 쓸고 이사할 수 있다.",

  "ch.searchQuietHint": "아주 조용하다. 철저의 약 40%. 빈 방은 빈 방. 은신이 높고 부르고 싶지 않을 때.",
  "ch.searchLoudHint": "물건은 많다. 소음도 크다. 근처 좀비가 온다. 수색과 배낭이 양을 늘린다. 빈 것은 빈 것.",
  "ch.fightHint": "쓸어야 점령. 싸움 자체가 더 부르지 않는다. 한두 마리, 크게 지지 않았으면 끝낼 수 있다. 장갑은 피해 감소, 물림은 감염 감소.",
  "ch.meleeHint": "탄 없음, 더 조용, 다치기 쉽다. 무기와 전투. 장갑과 물림 저항이 여기서 산다.",
  "ch.gunHint": "탄을 쓰고, 시끄럽고, 먹힌다. 탄이나 총이 없으면 안 눌린다. 탄약 {n}.",
  "ch.flankHint": "은신 합 6이 필요하다. 더 안전, 탄 없음.",
  "map.hint":
    "실제 미국 지도. 켄터키와 중서로 핀치. 지점을 눌러 출격. 무전 1레벨 같은 주, 2레벨 전체. 좀비를 쓸어야 점령. 끝은 시카고.",

  "bible.play.house": "방과 일",
  "bible.play.house.body":
    "강화는 껍데기. 공방에서 「제작」해야 장비가 고쳐진다(자재 1, 2레벨 두 점). 텃밭은 「농사」가 없으면 안 난다. 부엌은 저녁 감소, 「취사」가 식량을 더 만든다. 집수기는 물. 「간호」는 의무실과 약. 무전 1레벨 같은 주, 2레벨 전체. 「청취」가 사람을 찾는다. 탑과 경계가 야습을 줄인다. 침실 레벨마다 한 명.",
  "bible.play.gear.body":
    "무기는 근접과 총. 장갑은 피해 감소. 물림 저항은 감염 감소. 배낭은 수거. 소음은 좀비를 부른다. 피로는 밤에 남는다. 고장: 공방을 올리고 제작에 자재 1. 내구 40 이상을 버리면 자재.",
  "bible.play.night.body":
    "밤에 일, 밥, 물, 수확, 야습이 정해진다. 부엌과 집수기는 레벨당 약 0.4명분 감소. 식량 10 초과는 썩는다. 벽이 낮고 날이 갈수록 야습. 자면 행동 6.",
  "bible.rule.build.body":
    "비용=기본×(현재+1). 의무실은 약, 무전은 연료. 모자란 것은 버튼에 나온다. 제작이 장비를 고친다. 농사가 식량을 낸다.",

  "trait.strong.blurb": "맞는 양이 조금 준다. 밀치기에 더 버틴다.",
  "trait.quiet.blurb": "발소리가 작다. 수색과 싸움이 덜 부른다.",
  "trait.leader.blurb": "밤에 다른 사람 사기가 조금 오른다.",
  "trait.firstaid.blurb": "붕대를 감을 줄 안다. 누가 먼저 죽을지도 안다.",
  "trait.handy.blurb": "수리와 제작이 더 된다. 공방이 집.",
  "trait.brave.blurb": "타격이 조금 세다. 앞으로 간다. 잘 안 숙인다.",
  "trait.lucky.blurb": "수색이 많다. 물려도 감염이 조금 낮다.",
  "trait.fastlearner.blurb": "스킬이 빨리 오른다. 상한은 여전히 10.",
  "trait.coward.blurb": "손이 떤다. 전투가 약하다.",
  "trait.weak.blurb": "더 맞는다. 감기로도 쓰러질 수 있다.",
  "trait.insomnia.blurb": "휴식이 피로를 덜 지운다. 밤에도 문을 듣는다.",
  "trait.selfish.blurb": "유대가 느리게 오른다. 주머니 것은 안 나눌 수 있다.",
  "trait.clumsy.blurb": "수색과 싸움이 더 시끄럽다. 못이 휜다.",
  "trait.slowlearner.blurb": "스킬이 느리게 오른다. 같은 상처를 두 번.",
  "trait.smoker.blurb": "담배 없으면 밤에 더 배고프고 사기가 떨어진다.",
  "trait.pacifist.blurb": "타격이 약하다. 너무 죽이면 사기가 더 떨어진다.",
  "trait.depressed.blurb": "밤에 사기가 잘 떨어진다. 사람과 따뜻한 밥이 필요하다.",
  "trait.agoraphobic.blurb": "집 밖으로 나가면 사기가 떨어진다. 원정은 형벌.",
};
