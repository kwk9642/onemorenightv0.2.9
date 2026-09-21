import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as BookOpen, S as Cigarette, T as Apple, _ as House, b as CookingPot, c as Sparkles, d as ScrollText, f as Package, g as KeyRound, h as Leaf, i as Users, l as Shield, m as Map$1, n as VolumeX, o as Stethoscope, p as Medal, r as Volume2, s as Sprout, t as Wrench, u as ShieldCheck, v as Hammer, w as Ban, x as Compass, y as Flame } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-D8B6lfhN.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C-NeMstj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Public-file URL that works on `/` and itch.io `./` base. */
function asset(path) {
	if (!path) return path;
	if (/^https?:/i.test(path)) return path;
	return `/${path.replace(/^\//, "")}`;
}
var ctx = null;
var muted = false;
var master = null;
var sfxBus = null;
var TRACKS = {
	title: "/game/music/title.mp3",
	hub: "/game/music/hub.mp3",
	mission: "/game/music/mission.mp3",
	occupy: "/game/music/occupy.mp3",
	end: "/game/music/end.mp3",
	combat: "/game/music/combat.mp3"
};
var VOL = {
	title: .62,
	hub: .52,
	mission: .58,
	occupy: .55,
	end: .5,
	combat: .64
};
var wanted = "title";
var bgmMood = "off";
var loading = null;
var current = null;
var fadeRaf = 0;
var tensionTarget = 0;
var tension = 0;
var mixRaf = 0;
var combat = null;
function clampVol(n) {
	if (!Number.isFinite(n)) return 0;
	return Math.min(1, Math.max(0, n));
}
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const C = window.AudioContext || window.webkitAudioContext;
		if (!C) return null;
		ctx = new C({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfxBus = ctx.createGain();
		master.gain.value = 1;
		sfxBus.gain.value = .9;
		sfxBus.connect(master);
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function killFade() {
	if (fadeRaf) cancelAnimationFrame(fadeRaf);
	fadeRaf = 0;
}
var pool = {};
function elFor(mood) {
	if (typeof document === "undefined") return null;
	if (pool[mood]) return pool[mood];
	const el = document.createElement("audio");
	el.src = asset(TRACKS[mood]);
	el.loop = true;
	el.preload = "auto";
	el.setAttribute("data-bgm", mood);
	el.setAttribute("playsinline", "");
	el.style.display = "none";
	document.body.appendChild(el);
	pool[mood] = el;
	return el;
}
function fadeSwap(next, toVol, ms = 900) {
	killFade();
	const from = current && current !== next ? current : null;
	current = next;
	const t0 = performance.now();
	const startFrom = from ? from.volume : 0;
	const tick = (now) => {
		const k = Math.min(1, (now - t0) / ms);
		if (from) from.volume = clampVol(startFrom * (1 - k));
		if (next) {
			const duck = bgmMood === "mission" ? 1 - tension * .42 : 1;
			next.volume = clampVol(toVol * k * duck);
		}
		if (k < 1) {
			fadeRaf = requestAnimationFrame(tick);
			return;
		}
		if (from && from !== next) {
			from.pause();
			from.currentTime = 0;
		}
	};
	fadeRaf = requestAnimationFrame(tick);
}
function playMood(mood) {
	if (typeof window === "undefined") return;
	const el = elFor(mood);
	if (!el) return;
	if (bgmMood === mood && !el.paused) return;
	if (loading === mood) return;
	loading = mood;
	el.volume = 0;
	const p = el.play();
	if (!p) {
		loading = null;
		return;
	}
	p.then(() => {
		loading = null;
		bgmMood = mood;
		fadeSwap(el, muted ? 0 : VOL[mood]);
		mixCombat();
	}).catch(() => {
		loading = null;
	});
}
function stopBgm() {
	bgmMood = "off";
	fadeSwap(null, 0, 400);
	if (combat) {
		combat.pause();
		combat.volume = 0;
	}
}
function mixCombat() {
	if (mixRaf) return;
	const step = () => {
		mixRaf = 0;
		tension += (tensionTarget - tension) * .08;
		if (muted || bgmMood !== "mission") {
			if (combat) combat.volume = 0;
			if (current && bgmMood !== "off") current.volume = clampVol(VOL[bgmMood]);
			if (Math.abs(tensionTarget - tension) > .01) mixRaf = requestAnimationFrame(step);
			return;
		}
		if (current) current.volume = clampVol(VOL.mission * (1 - tension * .42));
		if (tension > .08) {
			if (!combat) combat = elFor("combat");
			if (combat && combat.paused) combat.play().catch(() => {});
			if (combat) combat.volume = clampVol(VOL.combat * tension);
		} else if (combat) combat.volume = clampVol(combat.volume * .9);
		if (Math.abs(tensionTarget - tension) > .008 || combat && combat.volume > .01) mixRaf = requestAnimationFrame(step);
	};
	mixRaf = requestAnimationFrame(step);
}
function unlockAudio() {
	ac();
	if (wanted !== "off" && wanted !== bgmMood) playMood(wanted);
}
function setMuted(v) {
	muted = v;
	if (v) {
		if (current) current.volume = 0;
		if (combat) combat.volume = 0;
		if (master) master.gain.value = 0;
	} else {
		if (master) master.gain.value = 1;
		if (wanted !== "off") playMood(wanted);
	}
}
function setBgm(mood) {
	wanted = mood;
	if (muted || mood === "off") {
		stopBgm();
		return;
	}
	playMood(mood);
}
function beep(freq, dur = .08, type = "square", gain = .04) {
	if (muted) return;
	const c = ac();
	if (!c || !sfxBus) return;
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, c.currentTime);
	g.gain.setValueAtTime(gain, c.currentTime);
	g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + dur);
	o.connect(g);
	g.connect(sfxBus);
	o.start();
	o.stop(c.currentTime + dur);
}
function click() {
	beep(220, .05, "square", .03);
}
function ok() {
	beep(330, .07, "triangle", .04);
	setTimeout(() => beep(440, .08, "triangle", .03), 60);
}
function warn() {
	beep(140, .12, "sawtooth", .04);
}
/** Last-merge player copy: what each room, job, piece of kit actually does. */
var whyZh = {
	"fac.beds.blurb": "床位就是能養活幾個人。每升一級，據點多留一人。想救人、聽電台收容，先看寢室。佔領新據點時，容量跟那棟房子走，舊的升級不會帶走。",
	"fac.beds.effect": "每級容量 +1。沒床就收不了人。",
	"fac.kitchen.blurb": "廚房讓晚飯少耗一點：每級大約少吃 0.4 人份。派人做「炊事」才會額外做出食物、並提振情緒。只升級不派工，只是比較省糧，不會憑空多出飯。",
	"fac.kitchen.effect": "每級晚飯 −0.4 人份。炊事才額外產糧。",
	"fac.water.blurb": "集水器接雨水。有等級就產水（約等級×0.6，最少 1），每級還少喝約 0.4 人份。沒有它，水只能出門搜。不用派人看守，升級就會滴。",
	"fac.water.effect": "產水約等級×0.6。每級少喝 0.4。",
	"fac.workshop.blurb": "工坊是修裝備的唯一地方。必須派人做「打造」，並花 1 建材：圍牆 +6，並修理倉庫裡最爛的一件。2 級同一晚修兩件。穿在身上的只修六成。沒有工坊，打造這份工無效。建造技能越高，修得越多。",
	"fac.workshop.effect": "派人「打造」才修裝備。耗 1 建材。2 級修兩件。",
	"fac.infirmary.blurb": "醫務室讓「看護」有效。派人看護，所有傷者過夜回一大截血（約 10+醫療技能）。有藥時才有機會清掉感染。升級還要額外藥品。沒醫務室，看護無效。",
	"fac.infirmary.effect": "看護治療全隊傷者。有藥才清感染。",
	"fac.garden.blurb": "菜園不會自己長。必須派人「耕作」。產量約為菜園等級×(0.45+農耕技能/14)。沒人耕，就是空地。食物超過 10 會腐壞，種出來要吃掉或煮掉。",
	"fac.garden.effect": "要「耕作」才產糧。產量看等級與農耕。",
	"fac.radio.blurb": "電台一開，地圖就亮：1 級看得到同州地點，2 級看全圖（不用派人）。派人「監聽」另有約 35% 發現新地、12% 聽到人——要有空床才收得下。升級要燃油。洞穴佔領沒有電台。",
	"fac.radio.effect": "1 級同州、2 級全圖。監聽才找人。",
	"fac.watch.blurb": "哨塔讓你先看到夜裡來的東西。每級把夜襲機率減約 4%，與「警戒」疊加。牆高才是根本，塔是保險。不用派人看守，升級就生效。",
	"fac.watch.effect": "每級夜襲 −4%。與警戒疊加。",
	"job.rest.blurb": "不出工。過夜回血約 12、疲勞降約 35、情緒 +6。心情太差的人只能休息——出不了門，也做不了別的工。",
	"job.cook.blurb": "需要廚房。過夜額外產 1 食物（善廚再 +1），情緒 +8。廚房等級另外減少晚飯消耗。沒廚房，這份工無效。",
	"job.farm.blurb": "需要菜園。過夜產糧隨菜園等級與農耕技能。沒人耕作，菜園空轉。這是穩定糧食的正路。",
	"job.guard.blurb": "守夜。每人把夜襲機率減約 5.5%。牆低、天數越高越容易被襲。不耗建材。可與哨塔疊加。",
	"job.repair.blurb": "補圍牆。過夜牆 +8，再加上建造技能（巧手／懂車再 +3）。不耗建材。牆高，夜襲少。現補則花 2 建材、1 格行動。",
	"job.tend.blurb": "需要醫務室。所有傷者過夜回血（約 10+醫療技能）。有藥時有機會清掉感染。沒醫務室這份工無效。",
	"job.radio.blurb": "需要無線電。約 35% 發現新地點、12% 聽到倖存者（要有空床才收得下）。電台本身 1 級已能看同州、2 級看全圖，監聽是額外找人、找新點。",
	"job.craft.blurb": "需要工坊。這是修裝備的唯一辦法。耗 1 建材：圍牆 +6，修倉庫最爛一件（修量 6+建造技能，巧手再 +3）。工坊 2 級修兩件。穿身上的只修六成。沒工坊或沒建材，這份工無效。",
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
	"gear.legend": "武器管近戰與能不能開槍。頭、身、手、腿、腳的護甲減傷害，防咬減感染。背包加搜刮量。數字愈大愈明顯。噪音會把僵屍叫來，疲勞過夜更累。壞了要升級工坊，派人做「打造」才修。",
	"gear.hint": "護甲減傷害，防咬減感染，背包加搜刮量。噪音引僵屍，疲勞過夜更累。要修裝備：升級工坊，派人做「打造」，花 1 建材。完好度 40 以上丟掉可拆 1 建材。",
	"gear.discardHint": "丟掉。完好度 40 以上拆成 1 建材。壞掉的直接扔。",
	"roster.hint": "留守的人經營這棟房子。選工作，過夜才生效。點部位穿脫裝備。護甲減傷、防咬抗感染、背包多搜、噪音引怪。要修裝備：先升級工坊，再派「打造」。",
	"roster.skills": "技能在對應工作與出征中慢慢漲，上限 10。戰鬥打怪；潛行讓搜刮更靜、包抄更好；搜刮決定帶回多少；醫療看護；建造修牆與打造修裝備；農耕種菜；烹飪煮飯。",
	"build.hint": "升級房間要建材，有時還要藥或油。價錢＝基礎×（目前等級+1）。工坊要派人「打造」才修裝備。菜園要派人「耕作」才產糧。廚房減晚飯，集水器產水。不夠的資源，得出門搜。",
	"build.repairWallHint": "現補：建材 2、行動 1。牆高，夜襲少。也可派人「修繕」過夜慢慢補，不耗建材。",
	"hub.resHint": "食物、水每晚每人約耗 1。廚房、集水器可減耗。食物超過 10 會腐。建材用來升級、補牆、打造修裝備。藥清感染。彈開槍才耗。油走遠路、升級電台。",
	"hub.wallNote": "圍牆 {n}。牆低，過夜容易被襲。派人「修繕」過夜補牆（不耗材），或花 2 建材現補。警戒與哨塔降低夜襲機率。",
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
	"occ.firefighter.desc": "先天戰鬥 1、生命 110。沒有免費特質。要更強，得自己拿缺點換點數。起手有一點建材與藥，夠把門釘上。把戰鬥與建造點上去，他就能打也能修。",
	"occ.doctor.blurb": "醫療 6。留家看護能救感染。戰鬥弱，別當先鋒。",
	"occ.doctor.desc": "先天醫療 6、戰鬥 1、生命 90。醫院沒了，手還在。留在醫務室做看護，有藥才能清感染。起手藥多。戰鬥與潛行要另外點。",
	"occ.officer.blurb": "戰鬥 4，會開槍。起手 −4 點，特質要精打細算。",
	"occ.officer.desc": "先天戰鬥 4、潛行 1。開槍耗彈藥。起手點數是負的，選缺點才夠用。不會種田。適合出征清點，留家就派警戒。",
	"occ.chef.blurb": "烹飪 4，自帶善廚。廚房加炊事能留住人。起手 −2。",
	"occ.chef.desc": "先天烹飪 4、建造 1、戰鬥 1。免費善廚：煮飯多一點食物。起手糧食多。升級廚房、派他炊事，過夜產糧並回情緒。戰鬥要另外學。",
	"occ.mechanic.blurb": "建造 4。修牆、打造、工坊是他的班表。起手 −4。",
	"occ.mechanic.desc": "先天建造 4、搜刮 1。免費懂車：修繕與打造多修一截。起手建材與油多。先升級工坊，派他打造，就能修裝備。戰鬥要另外點。",
	"occ.farmer.blurb": "農耕 4。菜園是他的家。起手 0 點，生命較高。",
	"occ.farmer.desc": "先天農耕 4、生命 105。沒有免費特質。升級菜園、派他耕作，糧食才穩。起手食物與水夠撐開頭。戰鬥弱，別押他清點。",
	"occ.veteran.blurb": "戰鬥 2，幾乎不恐慌。起手 −8，最貴的職業。",
	"occ.veteran.desc": "先天戰鬥 2、生命 105。免費脫敏：殺再多也不容易崩潰。自由點很少，缺點必須補滿。讓他帶隊打架、開槍。種田煮飯不是他的班。",
	"occ.burglar.blurb": "潛行 3。適合安靜搜刮、包抄。起手 −6。",
	"occ.burglar.desc": "先天潛行 3、搜刮 1、生命 90。免費竊賊手：開門較靜。派他潛行搜索，東西較少但少引僵屍。包抄要潛行合計 6。別當肉盾。",
	"sh.farmhouse.desc": "肯塔基鄉下兩層農舍。後院已有菜園與集水器，牆中等、僵屍少。適合學種田、慢慢囤糧。離補給遠，建材與藥得出門找。容量 4。鄰居更少。",
	"sh.hardware.desc": "西點主街五金行。工坊現成、建材多，第一晚就能派人打造修裝備、釘圍牆。容量 3，牆偏低，櫥窗夜裡會響——盡早修繕或警戒。",
	"sh.highrise.desc": "路易斯維爾六樓公寓。容量 5，已有電台與集水，能早看同州地圖。牆低、週遭已被搜空一半，食物要出更遠。下樓就是街區，夜襲要盯。",
	"create.occHint": "職業只給先天技能、生命、一筆點數，有的還附贈特質。消防員能打，醫生能救，技工能修，農夫能種。其餘靠性格與技能——點不夠就拿缺點換。",
	"create.skillHint": "剩餘點數加在技能上。出任務、煮飯、修牆、耕作都會繼續漲，上限 10。戰鬥打怪；潛行讓搜刮更靜、包抄要 6；搜刮決定帶回多少；醫療看護；建造修牆與打造修裝備；農耕種菜；烹飪煮飯。",
	"create.shelterHint": "第一夜要有一扇能鎖的門。農舍能種、五金能修、公寓人多但牆矮。選錯只是死得比較早——之後清光據點可以佔領搬家。",
	"ch.searchQuietHint": "極安靜。收穫約只有徹底翻找的四成。地點搜空就沒了。潛行高、不想引怪時用。",
	"ch.searchLoudHint": "東西多，噪音也大，容易把附近僵屍叫來。搜刮技能與背包加量。空屋翻也是空。",
	"ch.fightHint": "清光才能佔領搬家。打架本身不再召更多僵屍。剩一兩隻、沒大敗，可以掃乾淨。護甲減傷，防咬減感染。",
	"ch.meleeHint": "不耗彈，較安靜，容易受傷。近戰看武器與戰鬥技能。護甲、防咬在這時最有用。",
	"ch.gunHint": "耗彈、很吵、有效。沒彈或沒人帶槍會按不了。彈藥 {n}。",
	"ch.flankHint": "潛行合計要 6 才按得了。繞後較安全，不耗彈。",
	"map.hint": "真實美國地圖。縮放拖到肯塔基與中西部。點地點出任務。電台 1 級看同州、2 級看全圖。清光僵屍才能佔領搬家。終點是芝加哥。",
	"bible.play.house": "房間與工作",
	"bible.play.house.body": "升級只是蓋好空殼。工坊要派人「打造」才修裝備（耗 1 建材；2 級修兩件）。菜園要「耕作」才產糧。廚房減晚飯，「炊事」才額外出糧。集水器產水。「看護」要醫務室與藥才清感染。電台 1 級看同州、2 級全圖；「監聽」才找人。哨塔與警戒減夜襲。寢室每級多留一人。",
	"bible.play.gear.body": "武器管近戰與槍。護甲減傷害，防咬減感染，背包加搜刮。噪音引僵屍，疲勞過夜更累。壞了：升級工坊，派人打造，花 1 建材修倉庫最爛一件。完好度 40 以上丟掉可拆建材。",
	"bible.play.night.body": "過夜才結算工作、吃飯喝水、產糧產水、夜襲。廚房與集水器每級約減 0.4 人份。食物超過 10 腐壞。牆低、天數高，夜襲機率高。睡一覺行動恢復 6 格。",
	"bible.rule.build.body": "費用＝基礎×（目前+1）。醫務室要藥，無線電要油。不夠的會寫在按鈕上。工坊要打造才修裝備。菜園要耕作才產糧。",
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
	"trait.agoraphobic.blurb": "一出門情緒就掉。遠征對他是刑罰。"
};
var whyEn = {
	"fac.beds.blurb": "Beds are how many people this house can keep. Each level holds one more. Rescue and radio pickups need a spare bed. When you occupy a new site, capacity follows that building — upgrades here do not move with you.",
	"fac.beds.effect": "+1 capacity per level. No bed, no extra soul.",
	"fac.kitchen.blurb": "A kitchen trims supper: about 0.4 fewer mouths per level. Assign Cook to actually make extra food and lift mood. Upgrade alone only stretches stores — it does not cook.",
	"fac.kitchen.effect": "−0.4 supper per level. Cook to gain food.",
	"fac.water.blurb": "Rain off the roof. Any level yields water (about level × 0.6, at least 1) and cuts drinking by ~0.4 per level. No cistern, you loot water. No one has to staff it.",
	"fac.water.effect": "Water ≈ level × 0.6. −0.4 drink per level.",
	"fac.workshop.blurb": "This is the only way to mend kit. Assign Craft and spend 1 material: wall +6, and the worst stash piece is repaired. Level 2 mends two pieces the same night. Worn gear gets 60%. No shop, Craft does nothing. Higher Build skill mends more.",
	"fac.workshop.effect": "Craft mends kit. Costs 1 material. Lv2 mends two.",
	"fac.infirmary.blurb": "Tend only works here. Overnight, every wounded person heals (~10 + Medical). Infection clears only if you have medicine. Upgrades also cost meds. No infirmary, Tend does nothing.",
	"fac.infirmary.effect": "Tend heals the house. Meds clear bites.",
	"fac.garden.blurb": "Plots do not grow themselves. Assign Farm. Yield is about garden level × (0.45 + Farm skill / 14). Empty shift, empty dirt. Food over 10 rots — eat it or cook it.",
	"fac.garden.effect": "Farm or it yields nothing. Level and Farm skill.",
	"fac.radio.blurb": "The set lights the map: level 1 shows same-state sites, level 2 the whole map (no one has to sit it). Assign Radio for ~35% a new pin, ~12% a voice — you need a spare bed to take them in. Upgrades cost fuel. Caves have no radio.",
	"fac.radio.effect": "Lv1 same state, lv2 all. Radio job finds people.",
	"fac.watch.blurb": "See them before they hit the boards. Each level cuts night-raid chance by ~4%, stacking with Guard. High walls are the real defense; the tower is insurance. Upgrade, it works — no one has to climb it.",
	"fac.watch.effect": "−4% raid per level. Stacks with Guard.",
	"job.rest.blurb": "No work. Overnight: about +12 HP, −35 fatigue, +6 mood. Crushed people can only Rest — they cannot leave, and they cannot hold another job.",
	"job.cook.blurb": "Needs a kitchen. Overnight +1 food (Keen Cook +1 more) and +8 mood. Kitchen level also trims supper. No kitchen, this job does nothing.",
	"job.farm.blurb": "Needs a garden. Overnight food scales with garden level and Farm skill. No farmer, the plot idles. This is how you stop living on cans.",
	"job.guard.blurb": "Night watch. Each guard cuts raid chance by ~5.5%. Low walls and later days make raids likelier. Costs no materials. Stacks with the tower.",
	"job.repair.blurb": "Mend the wall. Overnight +8, plus Build skill (Handy / vehicle knowledge +3). Costs no materials. High walls, fewer raids. Instant patch: 2 materials, 1 action.",
	"job.tend.blurb": "Needs an infirmary. Every wounded person heals overnight (~10 + Medical). Medicine gives a chance to clear infection. No infirmary, nothing happens.",
	"job.radio.blurb": "Needs a radio. ~35% a new site, ~12% a survivor (spare bed required). The set itself already shows same-state pins at lv1 and the whole map at lv2. This job is the extra find.",
	"job.craft.blurb": "Needs a workshop. The only way to mend kit. Spends 1 material: wall +6, repairs the worst stash piece (6 + Build, Handy +3). Shop lv2 mends two. Worn pieces get 60%. No shop or no lumber, this job does nothing.",
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
	"gear.legend": "Weapon is melee and whether you can fire. Head, body, hands, legs, feet: armor cuts damage, bite resist cuts infection. The pack raises loot. Bigger numbers matter more. Noise draws them. Fatigue hurts the next night. Broken kit: upgrade the shop, assign Craft.",
	"gear.hint": "Armor cuts damage. Bite resist cuts infection. Pack size is loot. Noise draws zombies. Fatigue hits overnight. To mend: upgrade the workshop, assign Craft, spend 1 material. Condition 40+ salvages 1 material if thrown.",
	"gear.discardHint": "Throw away. Condition 40+ becomes 1 material. Junk is junk.",
	"roster.hint": "People at home run the house. Jobs resolve overnight. Tap slots to wear kit. Armor cuts hits, bite resist cuts infection, packs raise loot, noise draws them. To mend kit: upgrade the workshop, then assign Craft.",
	"roster.skills": "Skills rise on matching work and runs, cap 10. Combat hits. Stealth keeps searches quiet and unlocks flank at 6. Scavenge is how much you bring back. Medical tends. Build mends walls and kit. Farm grows food. Cook feeds the house.",
	"build.hint": "Rooms cost materials — sometimes meds or fuel. Price = base × (current level + 1). The workshop only mends kit if someone Crafts. The garden only feeds you if someone Farms. Kitchen trims supper. The cistern makes water. Short a resource, go loot it.",
	"build.repairWallHint": "Now: 2 materials, 1 action. High walls, fewer raids. Or assign Repair overnight — free of materials.",
	"hub.resHint": "Food and water: about 1 each per person per night. Kitchen and cistern trim that. Food over 10 rots. Materials upgrade rooms, patch walls, and Craft-mend kit. Meds clear bites. Ammo is for guns. Fuel is long trips and the radio.",
	"hub.wallNote": "Wall {n}. Low walls get raided. Assign Repair overnight (no materials), or spend 2 materials now. Guard and the tower cut the odds.",
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
	"occ.firefighter.desc": "Combat 1, HP 110. No free trait. Spend negatives if you want more. Starts with some lumber and meds — enough to board a door. Put points in Combat and Build and they can fight and fix.",
	"occ.doctor.blurb": "Medical 6. Tend at home, save bites. Weak in a fight — do not lead.",
	"occ.doctor.desc": "Medical 6, Combat 1, HP 90. The hospital is gone; the hands are not. Leave them in the infirmary. Medicine is how infection actually clears. Starts with a lot of meds. Combat and stealth you buy.",
	"occ.officer.blurb": "Combat 4, can shoot. Starts at −4 — traits have to add up.",
	"occ.officer.desc": "Combat 4, Stealth 1. Guns spend ammo. The pool is negative; take flaws to spend. No farming. Clear sites, or Guard at home.",
	"occ.chef.blurb": "Cook 4, free Keen Cook. Kitchen plus Cook keeps a house. Starts −2.",
	"occ.chef.desc": "Cook 4, Build 1, Combat 1. Free Keen Cook: extra food when they cook. Starts with a lot of food. Upgrade the kitchen, assign Cook — overnight food and mood. Combat is extra.",
	"occ.mechanic.blurb": "Build 4. Walls, Craft, the shop. Starts −4.",
	"occ.mechanic.desc": "Build 4, Scavenge 1. Free vehicle knowledge: Repair and Craft mend more. Starts with lumber and fuel. Upgrade the shop, assign Craft, and kit gets fixed. Combat you buy.",
	"occ.farmer.blurb": "Farm 4. The garden is home. 0 points. High HP.",
	"occ.farmer.desc": "Farm 4, HP 105. No free trait. Upgrade the garden, assign Farm, or you live on cans. Starts with food and water. Weak in a fight — do not send them to clear.",
	"occ.veteran.blurb": "Combat 2, barely panics. Starts −8. The expensive job.",
	"occ.veteran.desc": "Combat 2, HP 105. Free Desensitized: killing does not break them. Few free points; flaws must cover it. They lead fights and guns. Dirt and pots are not their shift.",
	"occ.burglar.blurb": "Stealth 3. Quiet loot, flank. Starts −6.",
	"occ.burglar.desc": "Stealth 3, Scavenge 1, HP 90. Free burglar hands: quieter doors. Quiet search brings less and draws less. Flank needs stealth 6. Not a meat shield.",
	"sh.farmhouse.desc": "Two stories in Kentucky dirt. Garden and cistern already in. Mid walls, few zeds. Learn to farm and stock slowly. Loot is far — lumber and meds are a trip. Capacity 4. Fewer neighbors.",
	"sh.hardware.desc": "West Point main street. Shop already there, lumber in the back. Night one you can Craft and board windows. Capacity 3, walls low, glass rattles after dark — Repair or Guard early.",
	"sh.highrise.desc": "Louisville sixth floor. Capacity 5, radio and cistern already in — same-state pins light early. Walls low, the block is half eaten, food is farther. Downstairs is the street. Watch the raids.",
	"create.occHint": "A job gives innate skills, HP, a point pool, sometimes a free trait. Firefighters hit. Doctors save. Mechanics fix. Farmers grow. The rest is traits and the skill menu — take flaws if you are short.",
	"create.skillHint": "Spend leftover points. Runs, cooking, walls, and dirt keep raising skills — cap 10. Combat hits. Stealth quiets searches and unlocks flank at 6. Scavenge is loot. Medical tends. Build mends walls and kit. Farm grows food. Cook feeds the house.",
	"create.shelterHint": "Night one needs a door that locks. The farm grows. The hardware shop mends. The walk-up holds more people and a worse wall. A bad pick just dies sooner — clear a site later and move in.",
	"ch.searchQuietHint": "Very quiet. About 40% of a loud search. Empty rooms stay empty. Use it when stealth is high and you do not want a crowd.",
	"ch.searchLoudHint": "More loot, more noise, nearby zeds come. Scavenge and packs raise the take. Empty is still empty.",
	"ch.fightHint": "Clear them to occupy. Fighting itself does not spawn more. Last one or two, if you did not fold, you can finish. Armor cuts hits. Bite resist cuts infection.",
	"ch.meleeHint": "No ammo, quieter, you get hit. Weapon and Combat decide it. Armor and bite resist matter here.",
	"ch.gunHint": "Spends ammo, loud, works. No ammo or no gun, the button dies. Ammo {n}.",
	"ch.flankHint": "Needs stealth 6 on the squad. Safer, no ammo.",
	"map.hint": "Real US map. Pinch to Kentucky and the Midwest. Tap a pin to run. Radio lv1 same state, lv2 everywhere. Clear the zeds to occupy and move. The end is Chicago.",
	"bible.play.house": "Rooms and work",
	"bible.play.house.body": "Upgrades are empty shells until someone works them. Craft in a workshop mends kit (1 material; lv2 mends two). Farm a garden or it yields nothing. Kitchen trims supper; Cook makes extra food. Cistern makes water. Tend needs an infirmary and meds to clear bites. Radio lv1 same state, lv2 all; the Radio job finds people. Tower and Guard cut raids. Each bed level holds one more.",
	"bible.play.gear.body": "Weapons are melee and guns. Armor cuts damage. Bite resist cuts infection. Packs raise loot. Noise draws them. Fatigue hits overnight. Broken kit: upgrade the shop, assign Craft, spend 1 material on the worst stash piece. Condition 40+ salvages material if thrown.",
	"bible.play.night.body": "Night resolves jobs, meals, water, yields, and raids. Kitchen and cistern cut about 0.4 mouths per level. Food over 10 rots. Low walls and later days raise raid chance. Sleep restores 6 actions.",
	"bible.rule.build.body": "Cost = base × (current + 1). Infirmary wants meds, radio wants fuel. The button tells you what is short. Craft mends kit. Farm yields food.",
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
	"trait.agoraphobic.blurb": "Leaving the house costs mood. A long run is a sentence."
};
var whyJa = {
	"fac.beds.blurb": "ベッドは何人養えるか。1級ごとに定員+1。救うにも無線で拾うにも空きが要る。拠点を移すと定員は向こうの建物に従う。ここの強化は持っていけない。",
	"fac.beds.effect": "1級で定員+1。ベッドがなければ増やせない。",
	"fac.kitchen.blurb": "台所は夕飯を減らす。1級あたり約0.4人分。「炊事」を割り当てると追加の食料と士気。強化だけなら節約になるだけで、飯は増えない。",
	"fac.kitchen.effect": "1級で夕飯−0.4人分。炊事で追加の食料。",
	"fac.water.blurb": "屋根の雨。レベルがあれば水が出る（約レベル×0.6、最低1）。1級ごとに飲水量も約0.4減。なければ水は漁り。誰も座らなくていい。",
	"fac.water.effect": "水は約レベル×0.6。1級で渇き−0.4。",
	"fac.workshop.blurb": "装備を直す唯一の場所。「工作」を割り当て、資材1：防壁+6、倉庫で一番ひどい一件を直す。2級なら同じ夜に二件。装備中は6割。工房がなければ工作は無効。工作技能が高いほど直る。",
	"fac.workshop.effect": "「工作」で装備修理。資材1。2級は二件。",
	"fac.infirmary.blurb": "「看護」は医務室がないと動かない。負傷者全員が夜に大きく回復（約10+医療）。感染は薬があって初めて消える。強化にも薬。医務室がなければ看護は無効。",
	"fac.infirmary.effect": "看護は家中の傷を見る。薬で感染を消す。",
	"fac.garden.blurb": "畑は一人では伸びない。「耕作」が要る。収穫は菜園レベル×(0.45+農耕/14)ほど。人がいなければ空き地。食料が10を超えると腐る。食うか調理するか。",
	"fac.garden.effect": "「耕作」がないと実らない。レベルと農耕。",
	"fac.radio.blurb": "無線は地図を灯す。1級で同州、2級で全域（座らなくていい）。「傍受」は約35%で新地点、12%で人——空きベッドが要る。強化は燃料。洞窟の占領には無線がない。",
	"fac.radio.effect": "1級は同州、2級は全域。傍受で人を拾う。",
	"fac.watch.blurb": "夜の前に見る。1級ごとに夜襲率約−4%。警戒と重なる。防壁が高いのが本筋、塔は保険。強化すれば効く。登らなくていい。",
	"fac.watch.effect": "1級で夜襲−4%。警戒と重なる。",
	"job.rest.blurb": "働かない。夜で体力約+12、疲労約−35、士気+6。落ちた者は休息しかできない。外出も他の仕事も不可。",
	"job.cook.blurb": "台所が要る。夜に食料+1（料理上手ならさらに+1）、士気+8。台所レベルは夕飯も減らす。台所がなければ無効。",
	"job.farm.blurb": "菜園が要る。夜の収穫はレベルと農耕。耕す人がいなければ空転。缶に頼らない正道。",
	"job.guard.blurb": "夜番。一人で夜襲率約−5.5%。壁が低く日が進むほど襲われやすい。資材は使わない。塔と重なる。",
	"job.repair.blurb": "防壁を直す。夜で+8、工作技能（器用／車の知識で+3）。資材は使わない。壁が高いと夜襲が減る。今すぐ直すなら資材2、行動1。",
	"job.tend.blurb": "医務室が要る。負傷者全員が夜に回復（約10+医療）。薬があれば感染を消せる。医務室がなければ無効。",
	"job.radio.blurb": "無線が要る。約35%で新地点、12%で生存者（空きベッド必須）。機械自体は1級で同州、2級で全域。傍受は追加の発見。",
	"job.craft.blurb": "工房が要る。装備を直す唯一の手段。資材1：防壁+6、倉庫の最悪を直す（量は6+工作、器用なら+3）。2級は二件。装備中は6割。工房も資材もなければ無効。",
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
	"gear.legend": "武器は近接と発砲可否。頭・体・手・脚・足の装甲は被弾減、耐咬は感染減。バッグは持ち帰り。数字が大きいほど効く。騒音は敵を呼び、疲労は夜通し残る。壊れたら工房を上げ、「工作」を割り当てる。",
	"gear.hint": "装甲は被弾減。耐咬は感染減。バッグは持ち帰り。騒音はゾンビを呼ぶ。疲労は夜通し響く。直すには工房を上げ、「工作」に資材1。耐久40以上を捨てると資材1になる。",
	"gear.discardHint": "捨てる。耐久40以上は資材1。ゴミはゴミ。",
	"roster.hint": "残った者が家を回す。仕事は夜に解決。部位を押して装備。装甲は被弾減、耐咬は感染減、バッグは持ち帰り、騒音は敵を呼ぶ。装備を直すなら工房を上げて「工作」。",
	"roster.skills": "技能は仕事と出撃で伸び、上限10。戦闘は打撃。隠密は静かな漁りと、合計6で側面。漁りは持ち帰り。医療は看護。工作は壁と装備。農耕は畑。料理は飯。",
	"build.hint": "部屋は資材。薬や燃料が要ることもある。費用＝基礎×（現在+1）。工房は「工作」を置いて初めて装備が直る。菜園は「耕作」がないと実らない。台所は夕飯減、貯水は水。足りないものは漁りに出る。",
	"build.repairWallHint": "今すぐ：資材2、行動1。壁が高いと夜襲が減る。「修繕」なら夜に少しずつ、資材なし。",
	"hub.resHint": "食料と水は一人一夜おおよそ1。台所と貯水で減る。食料が10超で腐る。資材は強化、壁、工作修理。薬は感染。弾は銃。燃料は遠征と無線。",
	"hub.wallNote": "防壁 {n}。低いと夜襲。「修繕」は夜に直す（資材なし）。今すぐなら資材2。警戒と塔が確率を下げる。",
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
	"occ.firefighter.desc": "戦闘1、体力110。無料特性なし。強くするなら欠点で点を買う。初期に資材と薬が少し。戦闘と工作を振れば殴れて直せる。",
	"occ.doctor.blurb": "医療6。家で看護して感染を止める。戦闘は弱い。先鋒にするな。",
	"occ.doctor.desc": "医療6、戦闘1、体力90。病院は消えたが手は残っている。医務室に置け。薬があって初めて感染が消える。初期の薬が多い。戦闘と隠密は自分で振る。",
	"occ.officer.blurb": "戦闘4、銃が撃てる。初期−4。特性は計算しろ。",
	"occ.officer.desc": "戦闘4、隠密1。発砲は弾。点数はマイナス、欠点を取らないと振れない。農業はゼロ。出撃で掃くか、家で警戒。",
	"occ.chef.blurb": "料理4、料理上手つき。台所と炊事で家が残る。初期−2。",
	"occ.chef.desc": "料理4、工作1、戦闘1。無料の料理上手：炊事で食料がもう1。初期の食料が多い。台所を上げて炊事。戦闘は別。",
	"occ.mechanic.blurb": "工作4。壁、工作、工房。初期−4。",
	"occ.mechanic.desc": "工作4、漁り1。無料の車の知識：修繕と工作が伸びる。初期に資材と燃料。工房を上げて工作を置けば装備が直る。戦闘は自分で振る。",
	"occ.farmer.blurb": "農耕4。菜園が家。初期0点。体力が高い。",
	"occ.farmer.desc": "農耕4、体力105。無料特性なし。菜園を上げて耕作。缶暮らしから抜ける。初期の食料と水で頭を繋ぐ。戦闘は弱い。掃討に出すな。",
	"occ.veteran.blurb": "戦闘2、ほとんど動じない。初期−8。一番高い職業。",
	"occ.veteran.desc": "戦闘2、体力105。無料の脱感作：殺しても折れにくい。自由点は少ない。欠点で埋める。喧嘩と銃。畑と鍋は他人の番。",
	"occ.burglar.blurb": "隠密3。静かな漁り、側面。初期−6。",
	"occ.burglar.desc": "隠密3、漁り1、体力90。無料の泥棒の手：扉が静か。隠密捜索は少ないが呼ばない。側面は隠密6。肉盾にするな。",
	"sh.farmhouse.desc": "ケンタッキーの二階建て。菜園と貯水が最初からある。壁は中、ゾンビは少ない。農を覚えて備蓄。補給は遠い。定員4。隣人はさらに少ない。",
	"sh.hardware.desc": "ウェストポイントの本通り。工房つき、資材が多い。初夜から工作と板張り。定員3、壁は低く、夜にガラスが鳴る。早く修繕か警戒。",
	"sh.highrise.desc": "ルイビル6階。定員5、無線と貯水つき。同州の地図が早い。壁は低く、街区は半分空。食料は遠く。下は通り。夜襲を見ろ。",
	"create.occHint": "職業は先天技能、体力、点数、時には無料特性。消防士は殴る。医師は救う。整備士は直す。農夫は育てる。足りなければ欠点で買え。",
	"create.skillHint": "残りを技能に振る。出撃、料理、壁、畑で伸びる。上限10。戦闘は打撃。隠密は静かな漁りと、6で側面。漁りは持ち帰り。医療は看護。工作は壁と装備。農耕は畑。料理は飯。",
	"create.shelterHint": "最初の夜は鍵のかかる扉。農家は育て、金物は直し、アパートは人数が多く壁が低い。失敗は早く死ぬだけ——あとで掃いて引っ越せる。",
	"ch.searchQuietHint": "とても静か。徹底の約4割。空なら空。隠密が高く、呼びたくないときに。",
	"ch.searchLoudHint": "物は多い。騒音も大きい。近くのゾンビが来る。漁りとバッグで増える。空は空。",
	"ch.fightHint": "全滅させて占領。喧嘩自体は増やさない。残り一、二匹、大敗していなければ掃ける。装甲は被弾減、耐咬は感染減。",
	"ch.meleeHint": "弾を使わない。静かめ、傷つきやすい。武器と戦闘。装甲と耐咬がここで効く。",
	"ch.gunHint": "弾を使い、うるさい、効く。弾も銃もなければ押せない。弾薬 {n}。",
	"ch.flankHint": "隠密合計6が要る。安全め、弾を使わない。",
	"map.hint": "実在のアメリカ地図。ケンタッキーと中西部へピンチ。地点をタップして出撃。無線1級は同州、2級は全域。ゾンビを掃いて占領。終わりはシカゴ。",
	"bible.play.house": "部屋と仕事",
	"bible.play.house.body": "強化は殻。「工作」が工房で装備を直す（資材1、2級は二件）。菜園は「耕作」がないと実らない。台所は夕飯減、「炊事」が追加の食料。貯水は水。「看護」は医務室と薬。無線1級は同州、2級は全域。「傍受」が人を拾う。塔と警戒が夜襲を減らす。寝室は1級で一人。",
	"bible.play.gear.body": "武器は近接と銃。装甲は被弾減。耐咬は感染減。バッグは持ち帰り。騒音は敵を呼ぶ。疲労は夜通し。壊れたら工房を上げ、工作に資材1。耐久40以上を捨てると資材。",
	"bible.play.night.body": "夜に仕事、食事、水、収穫、夜襲が決まる。台所と貯水は1級で約0.4人分減。食料10超で腐る。壁が低く日が進むと夜襲。眠れば行動6。",
	"bible.rule.build.body": "費用＝基礎×（現在+1）。医務室は薬、無線は燃料。足りないものはボタンに出る。工作が装備を直す。耕作が食料。",
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
	"trait.agoraphobic.blurb": "外出しただけで士気が落ちる。遠征は刑。"
};
var whyKo = {
	"fac.beds.blurb": "침대가 몇 명을 살릴 수 있는지다. 1레벨마다 수용 +1. 구하고 무전으로 들이려면 빈자리가 필요하다. 거점을 옮기면 수용은 그 건물 것을 따른다. 여기 강화는 가져가지 못한다.",
	"fac.beds.effect": "레벨마다 수용 +1. 침대 없으면 못 들인다.",
	"fac.kitchen.blurb": "부엌은 저녁을 줄인다. 레벨당 약 0.4명분. 「취사」를 맡기면 식량이 더 나오고 사기가 오른다. 강화만 하면 아낄 뿐, 밥이 생기진 않는다.",
	"fac.kitchen.effect": "레벨당 저녁 −0.4명분. 취사해야 식량이 는다.",
	"fac.water.blurb": "지붕의 비. 레벨이 있으면 물이 나온다(약 레벨×0.6, 최소 1). 레벨마다 마시는 양도 약 0.4 줄어든다. 없으면 물을 찾으러 나가야 한다. 지킬 사람은 필요 없다.",
	"fac.water.effect": "물 ≈ 레벨×0.6. 레벨당 갈증 −0.4.",
	"fac.workshop.blurb": "장비를 고치는 유일한 곳. 「제작」을 맡기고 자재 1: 방벽 +6, 창고에서 제일 낡은 한 점을 고친다. 2레벨이면 같은 밤에 두 점. 입은 것은 60%. 공방 없으면 제작은 무효. 건설 스킬이 높을수록 더 고친다.",
	"fac.workshop.effect": "「제작」해야 장비가 고쳐진다. 자재 1. 2레벨은 두 점.",
	"fac.infirmary.blurb": "「간호」는 의무실이 있어야 한다. 모든 부상자가 밤에 크게 회복(약 10+의료). 감염은 약이 있어야 지워질 수 있다. 강화에도 약. 의무실 없으면 간호는 무효.",
	"fac.infirmary.effect": "간호가 집 안 상처를 본다. 약으로 감염을 지운다.",
	"fac.garden.blurb": "밭은 혼자 안 자란다. 「농사」가 필요하다. 수확은 텃밭 레벨×(0.45+농사/14)쯤. 사람이 없으면 공터. 식량 10 초과는 썩는다. 먹거나 삶거나.",
	"fac.garden.effect": "「농사」해야 난다. 레벨과 농사 스킬.",
	"fac.radio.blurb": "무전기는 지도를 켠다. 1레벨 같은 주, 2레벨 전체(앉지 않아도 된다). 「청취」는 약 35% 새 지점, 12% 사람——빈 침대가 있어야 들인다. 강화는 연료. 동굴 점령에는 무전이 없다.",
	"fac.radio.effect": "1레벨 같은 주, 2레벨 전체. 청취가 사람을 찾는다.",
	"fac.watch.blurb": "밤에 오기 전에 본다. 레벨마다 야습 확률 약 −4%. 경계와 겹친다. 높은 벽이 본전, 탑은 보험. 올리면 바로 된다. 올라갈 사람은 필요 없다.",
	"fac.watch.effect": "레벨당 야습 −4%. 경계와 겹친다.",
	"job.rest.blurb": "일하지 않는다. 밤에 체력 약 +12, 피로 약 −35, 사기 +6. 무너진 사람은 휴식만 가능하다. 나가지도, 다른 일도 못 한다.",
	"job.cook.blurb": "부엌이 필요하다. 밤에 식량 +1(요리 특기면 +1 더), 사기 +8. 부엌 레벨은 저녁도 줄인다. 부엌 없으면 무효.",
	"job.farm.blurb": "텃밭이 필요하다. 밤 수확은 레벨과 농사 스킬. 경작자가 없으면 공회전. 캔에 살지 않는 정석.",
	"job.guard.blurb": "밤샘. 한 명당 야습 확률 약 −5.5%. 벽이 낮고 날이 갈수록 잘 습격한다. 자재는 안 쓴다. 탑과 겹친다.",
	"job.repair.blurb": "방벽을 고친다. 밤에 +8, 건설 스킬(손재주/차 지식이면 +3). 자재는 안 쓴다. 벽이 높으면 야습이 준다. 지금 고치면 자재 2, 행동 1.",
	"job.tend.blurb": "의무실이 필요하다. 모든 부상자가 밤에 회복(약 10+의료). 약이 있으면 감염을 지울 수 있다. 의무실 없으면 무효.",
	"job.radio.blurb": "무전기가 필요하다. 약 35% 새 지점, 12% 생존자(빈 침대 필수). 기계 자체는 1레벨 같은 주, 2레벨 전체. 청취는 추가 발견.",
	"job.craft.blurb": "공방이 필요하다. 장비를 고치는 유일한 방법. 자재 1: 방벽 +6, 창고에서 제일 낡은 것을 고친다(양 6+건설, 손재주면 +3). 2레벨은 두 점. 입은 것은 60%. 공방이나 자재가 없으면 무효.",
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
	"gear.legend": "무기는 근접과 발사 여부. 머리·몸·손·다리·발의 장갑은 피해 감소, 물림 저항은 감염 감소. 배낭은 수거량. 숫자가 클수록 세다. 소음은 좀비를 부르고, 피로는 밤에 남는다. 고장 나면 공방을 올리고 「제작」을 맡겨라.",
	"gear.hint": "장갑은 피해 감소. 물림 저항은 감염 감소. 배낭은 수거. 소음은 좀비를 부른다. 피로는 밤에 남는다. 고치려면 공방을 올리고 「제작」에 자재 1. 내구 40 이상을 버리면 자재 1.",
	"gear.discardHint": "버린다. 내구 40 이상은 자재 1. 쓰레기는 쓰레기.",
	"roster.hint": "남은 사람이 집을 돌린다. 일은 밤에 처리. 부위를 눌러 장비를 입는다. 장갑은 피해 감소, 물림은 감염 감소, 배낭은 수거, 소음은 적을 부른다. 장비를 고치려면 공방을 올리고 「제작」.",
	"roster.skills": "스킬은 일과 출격에서 오르고 상한 10. 전투는 타격. 은신은 조용한 수색과, 합 6이면 측면. 수색은 가져오는 양. 의료는 간호. 건설은 벽과 장비. 농사는 밭. 요리는 밥.",
	"build.hint": "방은 자재. 약이나 연료가 필요할 때도 있다. 비용=기본×(현재+1). 공방은 「제작」을 둬야 장비가 고쳐진다. 텃밭은 「농사」가 없으면 안 난다. 부엌은 저녁 감소, 집수기는 물. 모자라면 나가서 찾아라.",
	"build.repairWallHint": "지금: 자재 2, 행동 1. 벽이 높으면 야습이 준다. 「수리」는 밤에 조금씩, 자재 없음.",
	"hub.resHint": "식량과 물은 한 사람 하룻밤에 대략 1. 부엌과 집수기가 줄인다. 식량 10 초과는 썩는다. 자재는 강화, 벽, 제작 수리. 약은 감염. 탄은 총. 연료는 원정과 무전.",
	"hub.wallNote": "방벽 {n}. 낮으면 야습. 「수리」는 밤에 고친다(자재 없음). 지금이면 자재 2. 경계와 탑이 확률을 낮춘다.",
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
	"occ.firefighter.desc": "전투 1, 체력 110. 무료 특성 없음. 더 세게 하려면 단점으로 점을 산다. 시작에 자재와 약이 조금. 전투와 건설을 찍으면 때리고 고친다.",
	"occ.doctor.blurb": "의료 6. 집에서 간호해 감염을 막는다. 싸움은 약하다. 선봉 시키지 마라.",
	"occ.doctor.desc": "의료 6, 전투 1, 체력 90. 병원은 없어도 손은 남았다. 의무실에 남겨라. 약이 있어야 감염이 지워진다. 시작 약이 많다. 전투와 은신은 따로 찍는다.",
	"occ.officer.blurb": "전투 4, 총을 쏜다. 시작 −4. 특성을 계산하라.",
	"occ.officer.desc": "전투 4, 은신 1. 총은 탄. 점수는 마이너스, 단점을 받아야 찍는다. 농사는 없다. 출격해 쓸거나 집에서 경계.",
	"occ.chef.blurb": "요리 4, 요리 특기. 부엌과 취사가 집을 남긴다. 시작 −2.",
	"occ.chef.desc": "요리 4, 건설 1, 전투 1. 무료 요리 특기: 취사 때 식량 +1. 시작 식량이 많다. 부엌을 올리고 취사. 전투는 따로.",
	"occ.mechanic.blurb": "건설 4. 벽, 제작, 공방. 시작 −4.",
	"occ.mechanic.desc": "건설 4, 수색 1. 무료 차 지식: 수리와 제작이 더 된다. 시작에 자재와 연료. 공방을 올리고 제작을 맡기면 장비가 고쳐진다. 전투는 따로.",
	"occ.farmer.blurb": "농사 4. 텃밭이 집. 시작 0점. 체력이 높다.",
	"occ.farmer.desc": "농사 4, 체력 105. 무료 특성 없음. 텃밭을 올리고 농사. 캔 생활에서 빠져나온다. 시작 식량과 물로 버틴다. 싸움은 약하다. 소탕에 보내지 마라.",
	"occ.veteran.blurb": "전투 2, 거의 무너지지 않는다. 시작 −8. 가장 비싼 직업.",
	"occ.veteran.desc": "전투 2, 체력 105. 무료 둔감: 죽여도 잘 안 무너진다. 자유 점이 적다. 단점으로 메워라. 싸움과 총. 밭과 냄비는 남의 교대.",
	"occ.burglar.blurb": "은신 3. 조용한 수색, 측면. 시작 −6.",
	"occ.burglar.desc": "은신 3, 수색 1, 체력 90. 무료 도둑 손: 문이 조용하다. 은밀 수색은 적게 가져오고 적게 부른다. 측면은 은신 6. 방패로 쓰지 마라.",
	"sh.farmhouse.desc": "켄터키 이층 농가. 텃밭과 집수기가 처음부터 있다. 벽은 중간, 좀비는 적다. 농사를 배우고 비축. 보급은 멀다. 수용 4. 이웃은 더 적다.",
	"sh.hardware.desc": "웨스트포인트 본거리. 공방이 있고 자재가 많다. 첫날 밤부터 제작과 널빤지. 수용 3, 벽이 낮고 밤에 유리가 운다. 빨리 수리나 경계.",
	"sh.highrise.desc": "루이빌 6층. 수용 5, 무전과 집수기. 같은 주 지도가 일찍 켜진다. 벽이 낮고 거리는 반이 비었다. 식량은 더 멀다. 아래는 거리. 야습을 봐라.",
	"create.occHint": "직업은 선천 스킬, 체력, 점수, 가끔 무료 특성. 소방은 때리고, 의사는 살리고, 정비는 고치고, 농부는 기른다. 모자라면 단점으로 사라.",
	"create.skillHint": "남은 점을 스킬에. 출격, 요리, 벽, 밭에서 오른다. 상한 10. 전투는 타격. 은신은 조용한 수색과, 6이면 측면. 수색은 수거. 의료는 간호. 건설은 벽과 장비. 농사는 밭. 요리는 밥.",
	"create.shelterHint": "첫날 밤은 잠기는 문. 농가는 기르고, 철물은 고치고, 아파트는 사람이 많고 벽이 낮다. 잘못 고르면 더 빨리 죽을 뿐——나중에 쓸고 이사할 수 있다.",
	"ch.searchQuietHint": "아주 조용하다. 철저의 약 40%. 빈 방은 빈 방. 은신이 높고 부르고 싶지 않을 때.",
	"ch.searchLoudHint": "물건은 많다. 소음도 크다. 근처 좀비가 온다. 수색과 배낭이 양을 늘린다. 빈 것은 빈 것.",
	"ch.fightHint": "쓸어야 점령. 싸움 자체가 더 부르지 않는다. 한두 마리, 크게 지지 않았으면 끝낼 수 있다. 장갑은 피해 감소, 물림은 감염 감소.",
	"ch.meleeHint": "탄 없음, 더 조용, 다치기 쉽다. 무기와 전투. 장갑과 물림 저항이 여기서 산다.",
	"ch.gunHint": "탄을 쓰고, 시끄럽고, 먹힌다. 탄이나 총이 없으면 안 눌린다. 탄약 {n}.",
	"ch.flankHint": "은신 합 6이 필요하다. 더 안전, 탄 없음.",
	"map.hint": "실제 미국 지도. 켄터키와 중서로 핀치. 지점을 눌러 출격. 무전 1레벨 같은 주, 2레벨 전체. 좀비를 쓸어야 점령. 끝은 시카고.",
	"bible.play.house": "방과 일",
	"bible.play.house.body": "강화는 껍데기. 공방에서 「제작」해야 장비가 고쳐진다(자재 1, 2레벨 두 점). 텃밭은 「농사」가 없으면 안 난다. 부엌은 저녁 감소, 「취사」가 식량을 더 만든다. 집수기는 물. 「간호」는 의무실과 약. 무전 1레벨 같은 주, 2레벨 전체. 「청취」가 사람을 찾는다. 탑과 경계가 야습을 줄인다. 침실 레벨마다 한 명.",
	"bible.play.gear.body": "무기는 근접과 총. 장갑은 피해 감소. 물림 저항은 감염 감소. 배낭은 수거. 소음은 좀비를 부른다. 피로는 밤에 남는다. 고장: 공방을 올리고 제작에 자재 1. 내구 40 이상을 버리면 자재.",
	"bible.play.night.body": "밤에 일, 밥, 물, 수확, 야습이 정해진다. 부엌과 집수기는 레벨당 약 0.4명분 감소. 식량 10 초과는 썩는다. 벽이 낮고 날이 갈수록 야습. 자면 행동 6.",
	"bible.rule.build.body": "비용=기본×(현재+1). 의무실은 약, 무전은 연료. 모자란 것은 버튼에 나온다. 제작이 장비를 고친다. 농사가 식량을 낸다.",
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
	"trait.agoraphobic.blurb": "집 밖으로 나가면 사기가 떨어진다. 원정은 형벌."
};
/** Per-level skill copy. Merged last in i18n so it wins over older blurbs. */
var RANK_ZH = [
	"生手",
	"生疏",
	"入門",
	"上手",
	"熟練",
	"老練",
	"精通",
	"專家",
	"高手",
	"宗師",
	"傳奇"
];
var RANK_EN = [
	"Unskilled",
	"Novice",
	"Beginner",
	"Intermediate",
	"Skilled",
	"Proficient",
	"Advanced",
	"Expert",
	"Master",
	"Ace",
	"Legendary"
];
var RANK_JA = [
	"未熟",
	"初心",
	"入門",
	"中級",
	"熟練",
	"上級",
	"精通",
	"専門家",
	"達人",
	"師範",
	"伝説"
];
var RANK_KO = [
	"미숙",
	"초보",
	"입문",
	"중급",
	"숙련",
	"능숙",
	"정통",
	"전문가",
	"고수",
	"달인",
	"전설"
];
var combatZh = [
	"揮得亂。還沒長出肌肉記憶。",
	"會收手，不亂劈。",
	"知道往頭打。",
	"節奏對了。揮砍較穩。",
	"不浪費力氣。",
	"能清場。固定多砍一隻。",
	"走位與力道連在一起。",
	"一擊定生死。",
	"近乎本能。再多砍一隻。",
	"戰場聽他的。",
	"砍什麼都死。傳奇級清點。"
];
var stealthZh = [
	"腳步響。安靜搜也會發出聲。",
	"會放輕。噪音開始下降。",
	"走軟處、貼牆。",
	"能繞過視線。",
	"安靜搜刮開始多帶回東西。",
	"包抄門檻降到 5。影子。",
	"包抄解鎖加殺。幾乎無聲。",
	"安靜搜再加量。鬼影。",
	"連門把都不響。",
	"包抄再多殺一隻。空氣。",
	"走過像沒人來過。"
];
var scavengeZh = [
	"只看到顯眼的。搜刮量基準。",
	"會翻抽屜。",
	"知道藏處。",
	"分類裝袋，較少漏。",
	"不漏縫。裝備較常出現。",
	"老搜刮。帶回明顯變多。",
	"拆得乾淨。",
	"連暗格也翻。多一次裝備檢定。",
	"專業搬運。",
	"幾乎搬空。",
	"連螺絲都不留。"
];
var medicalZh = [
	"只會包紗布。治療量基準。",
	"會清傷口。",
	"止血對了。",
	"能拆線、判斷先救誰。",
	"傷口較不化膿。看護自己也回一點血。",
	"半個護士。感染較容易清。",
	"能抗感染。治療量明顯。",
	"野戰醫。",
	"幾乎不留疤。看護過夜多回血。",
	"能救重傷。",
	"死人能拉回一口氣。"
];
var buildZh = [
	"釘子會彎。修牆基準。",
	"會對齊。",
	"板子不翹。",
	"能打支架。",
	"牆比較硬。",
	"木匠。修繕與打造都聽他的。",
	"能補強。",
	"結構懂了。修牆額外加一截。",
	"堡壘。打造一次修兩件。",
	"幾乎不塌。",
	"要塞。圍牆像另一棟房子。"
];
var farmZh = [
	"種子會爛。沒人懂種，菜園空轉。",
	"會澆水。",
	"會間苗。",
	"知道季節。",
	"土養得住。過夜額外多一成。",
	"農人。產量明顯。",
	"輪作。",
	"高產。",
	"幾乎不歇。再多一成。",
	"能養活一窩。",
	"土地聽他的。"
];
var cookZh = [
	"能熱一熱。士氣基準。",
	"不燒焦。",
	"會調味。熱食多一點士氣。",
	"能省料。",
	"熱食像樣。額外多出一份。",
	"廚師。廚房開始像家。",
	"能把過期的救回一點。士氣再升。",
	"一鍋養活。",
	"食堂。再多一份。",
	"香氣留住人。",
	"末日大餐。全屋情緒明顯回升。"
];
var combatEn = [
	"Wild swings. No muscle memory yet.",
	"You stop missing the handle.",
	"You aim for the head.",
	"The rhythm is there. Cleaner cuts.",
	"No wasted motion.",
	"You can clear a room. One extra kill.",
	"Footwork and force finally meet.",
	"One hit ends it.",
	"Almost reflex. Another extra kill.",
	"The fight listens to you.",
	"Whatever you hit, dies. Legendary clears."
];
var stealthEn = [
	"Heavy feet. Quiet searches still make noise.",
	"You start setting them down softly.",
	"Soft ground, walls.",
	"You can slip a sightline.",
	"Quiet searches start bringing more back.",
	"Flank drops to 5. A shadow.",
	"Flank adds a kill. Almost silent.",
	"Quiet searches pay extra. A ghost.",
	"Even the handle stays quiet.",
	"Flank adds another. Air.",
	"You pass like nobody came."
];
var scavengeEn = [
	"You only see what's obvious.",
	"You check the drawers.",
	"You know the hiding spots.",
	"You bag by type. Less left behind.",
	"No seams. Kit shows up more.",
	"Old hands. Hauls get bigger.",
	"You strip a room clean.",
	"You find the false backs. Extra kit roll.",
	"Professional carry.",
	"Almost empty when you leave.",
	"You even take the screws."
];
var medicalEn = [
	"Gauze and hope. Baseline heal.",
	"You clean the wound.",
	"You can stop the bleed.",
	"You pick who to save first.",
	"Less rot. Tending also mends you a little.",
	"Half a nurse. Infection clears easier.",
	"You fight the bite. Heals jump.",
	"Field medic.",
	"Almost no scar. Bigger overnight mend.",
	"You can pull back the badly hurt.",
	"You drag a body back from the edge."
];
var buildEn = [
	"Nails bend. Baseline patch.",
	"You line the boards.",
	"Planks stay flat.",
	"You can raise a brace.",
	"The wall holds harder.",
	"Carpenter. Repair and Craft listen.",
	"You can reinforce.",
	"You understand the frame. Extra wall.",
	"A fort. Craft mends two pieces.",
	"It barely falls.",
	"A keep. The wall is another house."
];
var farmEn = [
	"Seeds rot. No farmer, the plot idles.",
	"You water.",
	"You thin the rows.",
	"You know the season.",
	"The dirt holds. Extra overnight yield.",
	"A farmer. Yield shows.",
	"You rotate crops.",
	"High yield.",
	"The plot barely rests. Another extra.",
	"You can feed a house.",
	"The land listens."
];
var cookEn = [
	"You can warm a can. Baseline mood.",
	"You stop burning it.",
	"Seasoning. Hot food lifts mood more.",
	"You stretch the rations.",
	"A real hot meal. Extra portion.",
	"A cook. The kitchen feels like home.",
	"You salvage the almost-spoiled. Mood climbs.",
	"One pot feeds them.",
	"A canteen. Another portion.",
	"The smell keeps people.",
	"A last-feast. The house's mood jumps."
];
var combatJa = [
	"振りが荒い。まだ体が覚えていない。",
	"柄を外さなくなる。",
	"頭を狙える。",
	"リズムが来る。切れが安定。",
	"無駄な力を使わない。",
	"部屋を掃ける。追加で一体。",
	"歩法と力がつながる。",
	"一撃で終わる。",
	"ほぼ反射。もう一体。",
	"戦場が彼の言うことを聞く。",
	"当たったものは死ぬ。伝説の掃討。"
];
var stealthJa = [
	"足音が重い。静かに漁っても鳴る。",
	"置き方が静かになる。",
	"柔らかい地面、壁沿い。",
	"視線を外せる。",
	"静かな捜索の収穫が増え始める。",
	"迂回の条件が5に下がる。影。",
	"迂回が追加キル。ほぼ無音。",
	"静かな捜索がさらに増える。幽霊。",
	"取っ手さえ鳴らない。",
	"迂回がもう一体。空気。",
	"通った跡が残らない。"
];
var scavengeJa = [
	"目立つものしか見えない。",
	"引き出しを開ける。",
	"隠し場所を知っている。",
	"分けて袋に入れる。漏れが減る。",
	"隙間なし。装備が出やすい。",
	"古い手。持ち帰りが増える。",
	"部屋を剥がす。",
	"裏板まで見る。装備判定がもう一度。",
	"運びのプロ。",
	"出ていくとき、ほぼ空。",
	"ネジまで持っていく。"
];
var medicalJa = [
	"ガーゼと祈り。治療の基準。",
	"傷を洗う。",
	"血を止められる。",
	"誰を先に救うか分かる。",
	"化膿しにくい。看護で自分も少し戻る。",
	"半人前の看護。感染が落ちやすい。",
	"咬傷と戦える。治療量が跳ねる。",
	"野戦医。",
	"ほとんど跡が残らない。夜の回復が増える。",
	"重傷を引き戻せる。",
	"縁から体を引き上げる。"
];
var buildJa = [
	"釘が曲がる。壁の基準。",
	"板を揃える。",
	"反らない。",
	"筋交いを組める。",
	"壁が硬くなる。",
	"大工。修繕も工作も彼を聞く。",
	"補強できる。",
	"構造が分かる。壁がさらに増える。",
	"砦。工作で二点直す。",
	"ほとんど倒れない。",
	"要塞。壁がもう一棟。"
];
var farmJa = [
	"種が腐る。耕す人がいないと空地。",
	"水をやる。",
	"間引きできる。",
	"季節が分かる。",
	"土が持つ。夜の収穫が一つ増える。",
	"百姓。収穫が目に見える。",
	"輪作。",
	"高収穫。",
	"畑が休まない。もう一つ。",
	"一家を養える。",
	"土地が彼の言うことを聞く。"
];
var cookJa = [
	"温められる。士気の基準。",
	"焦がさなくなる。",
	"味付け。熱い食事で士気が少し上がる。",
	"配給を伸ばせる。",
	"ちゃんとした熱い食事。もう一品。",
	"料理人。台所が家になる。",
	"傷みかけも救える。士気がさらに。",
	"鍋一つで足りる。",
	"食堂。もう一品。",
	"匂いが人を留める。",
	"最後の宴。家の士気が跳ねる。"
];
var combatKo = [
	"휘두름이 거칠다. 아직 몸이 기억하지 못한다.",
	"손잡이를 놓치지 않는다.",
	"머리를 노린다.",
	"리듬이 온다. 베는 손이 안정된다.",
	"힘을 낭비하지 않는다.",
	"방을 쓸 수 있다. 추가 1킬.",
	"발과 힘이 만난다.",
	"한 방에 끝난다.",
	"거의 반사. 다시 추가 1킬.",
	"싸움이 그의 말을 듣는다.",
	"맞는 것은 죽는다. 전설의 소탕."
];
var stealthKo = [
	"발소리가 크다. 조용히 뒤져도 난다.",
	"내려놓는 손이 가벼워진다.",
	"부드러운 땅, 벽을 탄다.",
	"시선을 빠져나간다.",
	"조용한 수색이 더 가져오기 시작한다.",
	"우회 조건이 5로 내려간다. 그림자.",
	"우회가 추가 킬. 거의 무음.",
	"조용한 수색이 더 는다. 유령.",
	"손잡이도 안 운다.",
	"우회가 한 마리 더. 공기.",
	"지나간 자국이 없다."
];
var scavengeKo = [
	"눈에 띄는 것만 본다.",
	"서랍을 연다.",
	"숨긴 곳을 안다.",
	"종류별로 담는다. 덜 빠뜨린다.",
	"틈이 없다. 장비가 더 나온다.",
	"오래된 손. 가져오는 양이 는다.",
	"방을 벗겨낸다.",
	"숨은 칸까지. 장비 판정 한 번 더.",
	"운반의 프로.",
	"나갈 때 거의 비어 있다.",
	"나사까지 가져간다."
];
var medicalKo = [
	"거즈와 바람. 치료 기준.",
	"상처를 씻는다.",
	"피를 멈출 수 있다.",
	"누구를 먼저 살릴지 안다.",
	"잘 썩지 않는다. 간호하면 자신도 조금 회복.",
	"반쪽 간호사. 감염이 잘 떨어진다.",
	"물린 상처와 싸운다. 치료량이 뛴다.",
	"야전 의무.",
	"흉터가 거의 없다. 밤 회복이 는다.",
	"중상을 끌어올릴 수 있다.",
	"가장자리에서 몸을 끌어올린다."
];
var buildKo = [
	"못이 휜다. 벽 기준.",
	"판을 맞춘다.",
	"판이 안 휜다.",
	"버팀목을 세울 수 있다.",
	"벽이 더 단단하다.",
	"목수. 수선과 제작이 그를 듣는다.",
	"보강할 수 있다.",
	"구조를 안다. 벽이 더 는다.",
	"요새. 제작이 두 점을 고친다.",
	"거의 안 무너진다.",
	"성채. 벽이 또 다른 집."
];
var farmKo = [
	"씨앗이 썩는다. 농부가 없으면 빈 땅.",
	"물을 준다.",
	"솎아낸다.",
	"계절을 안다.",
	"흙이 버틴다. 밤 수확이 하나 더.",
	"농부. 수확이 보인다.",
	"돌려짓기.",
	"다수확.",
	"밭이 쉬지 않는다. 하나 더.",
	"한 집을 먹일 수 있다.",
	"땅이 그의 말을 듣는다."
];
var cookKo = [
	"데울 줄 안다. 사기 기준.",
	"태우지 않는다.",
	"간을 한다. 따뜻한 밥이 사기를 조금 올린다.",
	"배급을 늘린다.",
	"제대로 된 온식. 한 그릇 더.",
	"요리사. 부엌이 집이 된다.",
	"상하기 직전도 살린다. 사기가 더.",
	"냄비 하나로 먹인다.",
	"식당. 한 그릇 더.",
	"냄새가 사람을 붙든다.",
	"마지막 잔치. 집의 사기가 뛴다."
];
function ranks(arr) {
	const o = {};
	arr.forEach((name, i) => {
		o[`skill.rank.${i}`] = name;
	});
	return o;
}
function levels(skill, arr) {
	const o = {};
	arr.forEach((line, i) => {
		o[`skill.${skill}.lv.${i}`] = line;
	});
	return o;
}
var skillZh = {
	...ranks(RANK_ZH),
	...levels("combat", combatZh),
	...levels("stealth", stealthZh),
	...levels("scavenge", scavengeZh),
	...levels("medical", medicalZh),
	...levels("build", buildZh),
	...levels("farm", farmZh),
	...levels("cook", cookZh),
	"ui.dot": " · ",
	"skill.bit.atk": "傷害 +{n}",
	"skill.bit.wound": "受傷 −{n}%",
	"skill.bit.kill": "多砍 {n} 隻",
	"skill.bit.combat0": "還沒長出肌肉記憶",
	"skill.bit.noise": "噪音 −{n}%",
	"skill.bit.flank": "包抄要潛行 {n}",
	"skill.bit.flankKill": "包抄多殺 {n}",
	"skill.bit.quietLoot": "安靜搜刮較多",
	"skill.bit.loot": "搜刮量 {n}%",
	"skill.bit.gear": "裝備機率 +{n}%",
	"skill.bit.extraGear": "多一次裝備檢定",
	"skill.bit.heal": "看護治療 {n}",
	"skill.bit.cure": "清感染 {n}%",
	"skill.bit.tendHp": "看護自己 +{n} 血",
	"skill.bit.wall": "修牆 +{n}",
	"skill.bit.mend": "打造修裝 {n}",
	"skill.bit.doubleMend": "一次修兩件",
	"skill.bit.farm": "耕作產量 {n}%",
	"skill.bit.crop": "額外糧食 +{n}",
	"skill.bit.cookFood": "炊事產糧 {n}",
	"skill.bit.cookMorale": "熱食士氣 +{n}",
	"skill.how.combat": "出征打架、揮刀砍僵屍",
	"skill.how.stealth": "安靜搜刮、包抄",
	"skill.how.scavenge": "徹底翻找、現場搜刮",
	"skill.how.medical": "過夜看護",
	"skill.how.build": "修繕、打造、現補圍牆",
	"skill.how.farm": "過夜耕作",
	"skill.how.cook": "過夜炊事",
	"skill.lv": "{n} {rank}",
	"skill.next": "下一級 {n} {rank}：{boost}",
	"skill.now": "{rank}。{boost}",
	"skill.xp": "{have}/{need}",
	"skill.maxed": "已達上限 10",
	"skill.xpGain": "{skill}熟練度 +{n}。距下一級還差 {left}",
	"skill.leveled": "{skill}升到 {n}（{rank}）。{boost}",
	"skill.xpNeed": "距下一級還差 {n}",
	"skill.learn": "先天 {n} · 成長 ×{mul}",
	"skill.learn.slow": "先天 0：成長只有 25%。沒碰過的手，要磨很久。",
	"skill.learn.ok": "先天 1：正常速度。用過就記住。",
	"skill.learn.fast": "先天 2 以上：成長 133%–166%。職業的手比較快熟。",
	"skill.open": "展開技能說明",
	"skill.close": "收合",
	"log.skillLevel": "{name}的{skill}升到 {n}（{rank}）。{boost}",
	"log.skillUp": "{name}的手藝又熟了一點。",
	"notices.skill": "{name} · {skill} {n} {rank}",
	"notices.dismiss": "知道了",
	"notices.title": "手藝長了",
	"roster.skills": "技能用過才漲，上限 10。點開每一項看這一級加什麼、下一級還差多少。先天 0 的技能只有 25% 成長——像肯塔基那些從沒拿過斧的人。",
	"create.skillHint": "剩餘點數加在技能上，上限 10。每一級都有具體加成。出任務、煮飯、修牆、耕作會繼續漲。先天 0 的技能成長只有四分之一——職業給的級數，決定你學得多快。",
	"create.nextXp": " · 下一級 {n} xp",
	"bible.tab.skills": "技能",
	"bible.play.skills": "技能 0–10",
	"bible.play.skills.body": "用過才漲，像肯塔基那場瘟疫：砍得多，戰鬥才熟。每一級都有說明。上限 10。先天 0 只有 25% 成長，先天 1 是 100%，先天 2 是 133%，3 以上 166%。聰穎／愚鈍再乘。點開人員卡看下一級。",
	"skill.combat.blurb": "打怪傷害、減傷、多砍。出征打架會漲。消防員、警員較高。",
	"skill.stealth.blurb": "搜刮更靜。包抄預設要 6，5 級降到 5。盜賊先天高。",
	"skill.scavenge.blurb": "搜回多少、裝備機率。徹底翻找與現場搜刮會漲。",
	"skill.medical.blurb": "看護治療量與清感染。醫生先天 6。過夜看護才漲。",
	"skill.build.blurb": "修牆與打造修裝。技工先天 4。修繕、打造、現補會漲。",
	"skill.farm.blurb": "菜園產量。農夫先天 4。過夜耕作才漲。沒人懂種，菜園空轉。",
	"skill.cook.blurb": "產糧與士氣。廚師先天 4。過夜炊事才漲。熱食留住人。",
	"ch.flankHint": "潛行要達到門檻（預設 6，潛行 5 降到 5）。繞後較安全，不耗彈。"
};
var skillEn = {
	...ranks(RANK_EN),
	...levels("combat", combatEn),
	...levels("stealth", stealthEn),
	...levels("scavenge", scavengeEn),
	...levels("medical", medicalEn),
	...levels("build", buildEn),
	...levels("farm", farmEn),
	...levels("cook", cookEn),
	"ui.dot": " · ",
	"skill.bit.atk": "Damage +{n}",
	"skill.bit.wound": "Hits taken −{n}%",
	"skill.bit.kill": "+{n} kills",
	"skill.bit.combat0": "No muscle memory yet",
	"skill.bit.noise": "Noise −{n}%",
	"skill.bit.flank": "Flank needs Stealth {n}",
	"skill.bit.flankKill": "Flank +{n} kills",
	"skill.bit.quietLoot": "Quiet searches pay more",
	"skill.bit.loot": "Loot {n}%",
	"skill.bit.gear": "Kit chance +{n}%",
	"skill.bit.extraGear": "Extra kit roll",
	"skill.bit.heal": "Tend heals {n}",
	"skill.bit.cure": "Clear bite {n}%",
	"skill.bit.tendHp": "Tender +{n} HP",
	"skill.bit.wall": "Wall +{n}",
	"skill.bit.mend": "Craft mend {n}",
	"skill.bit.doubleMend": "Mends two pieces",
	"skill.bit.farm": "Yield {n}%",
	"skill.bit.crop": "Extra food +{n}",
	"skill.bit.cookFood": "Cook food {n}",
	"skill.bit.cookMorale": "Hot meal mood +{n}",
	"skill.how.combat": "Fighting on runs, swinging at zeds",
	"skill.how.stealth": "Quiet searches, flanking",
	"skill.how.scavenge": "Loud searches, looting on site",
	"skill.how.medical": "Overnight Tend",
	"skill.how.build": "Repair, Craft, patching the wall",
	"skill.how.farm": "Overnight Farm",
	"skill.how.cook": "Overnight Cook",
	"skill.lv": "{n} {rank}",
	"skill.next": "Next {n} {rank}: {boost}",
	"skill.now": "{rank}. {boost}",
	"skill.xp": "{have}/{need}",
	"skill.maxed": "Capped at 10",
	"skill.xpGain": "{skill} +{n} XP. {left} to next",
	"skill.leveled": "{skill} rose to {n} ({rank}). {boost}",
	"skill.xpNeed": "{n} XP to next",
	"skill.learn": "Started {n} · XP ×{mul}",
	"skill.learn.slow": "Start 0: 25% XP. Hands that never held the tool grind slowly.",
	"skill.learn.ok": "Start 1: normal XP. Use it, keep it.",
	"skill.learn.fast": "Start 2+: 133–166% XP. A job's hands learn faster.",
	"skill.open": "Show skill detail",
	"skill.close": "Hide",
	"log.skillLevel": "{name}'s {skill} rose to {n} ({rank}). {boost}",
	"log.skillUp": "{name}'s hands got a little better.",
	"notices.skill": "{name} · {skill} {n} {rank}",
	"notices.dismiss": "Got it",
	"notices.title": "Hands got better",
	"roster.skills": "Skills rise when you use them, cap 10. Tap a row for this level's bonuses and the next. A skill that started at 0 only earns 25% XP — like someone in Kentucky who never held an axe.",
	"create.skillHint": "Spend leftover points. Cap 10. Each level has a listed bonus. Fighting, cooking, repairs, and farming keep raising them. A skill at 0 learns at a quarter speed — the levels your job gave you decide how fast you grow.",
	"create.nextXp": " · next {n} xp",
	"bible.tab.skills": "Skills",
	"bible.play.skills": "Skills 0–10",
	"bible.play.skills.body": "They rise when used, Kentucky-plague style: swing more, Combat rises. Every level lists a bonus. Cap 10. Start 0 = 25% XP, start 1 = 100%, start 2 = 133%, 3+ = 166%. Fast/Slow Learner multiply that. Open a roster card for the next level.",
	"skill.combat.blurb": "Damage, less hurt, extra kills. Rises when you fight. Firefighters and cops start higher.",
	"skill.stealth.blurb": "Quieter searches. Flank needs 6, or 5 at Stealth 5. Burglars start high.",
	"skill.scavenge.blurb": "How much you bring back, kit chance. Loud searches and on-site loot raise it.",
	"skill.medical.blurb": "Tend heals and clears bites. Doctors start at 6. Rises on overnight Tend.",
	"skill.build.blurb": "Walls and Craft-mending. Mechanics start at 4. Repair, Craft, and patches raise it.",
	"skill.farm.blurb": "Garden yield. Farmers start at 4. Rises on overnight Farm. No farmer, the plot idles.",
	"skill.cook.blurb": "Food and mood. Chefs start at 4. Rises on overnight Cook. Hot food keeps people.",
	"ch.flankHint": "Stealth must meet the gate (6, or 5 at Stealth 5). Safer, no ammo."
};
var skillJa = {
	...ranks(RANK_JA),
	...levels("combat", combatJa),
	...levels("stealth", stealthJa),
	...levels("scavenge", scavengeJa),
	...levels("medical", medicalJa),
	...levels("build", buildJa),
	...levels("farm", farmJa),
	...levels("cook", cookJa),
	"ui.dot": " · ",
	"skill.bit.atk": "ダメージ +{n}",
	"skill.bit.wound": "被弾 −{n}%",
	"skill.bit.kill": "追加 {n} 体",
	"skill.bit.combat0": "まだ体が覚えていない",
	"skill.bit.noise": "騒音 −{n}%",
	"skill.bit.flank": "迂回は隠密 {n}",
	"skill.bit.flankKill": "迂回 +{n} 体",
	"skill.bit.quietLoot": "静かな捜索が増える",
	"skill.bit.loot": "漁り {n}%",
	"skill.bit.gear": "装備率 +{n}%",
	"skill.bit.extraGear": "装備判定がもう一度",
	"skill.bit.heal": "看護 {n}",
	"skill.bit.cure": "感染解除 {n}%",
	"skill.bit.tendHp": "看護者 +{n} HP",
	"skill.bit.wall": "壁 +{n}",
	"skill.bit.mend": "工作修復 {n}",
	"skill.bit.doubleMend": "一度に二点",
	"skill.bit.farm": "収穫 {n}%",
	"skill.bit.crop": "追加食料 +{n}",
	"skill.bit.cookFood": "料理産出 {n}",
	"skill.bit.cookMorale": "温かい食事 士気 +{n}",
	"skill.how.combat": "任務で戦う、ゾンビを斬る",
	"skill.how.stealth": "静かな捜索、迂回",
	"skill.how.scavenge": "徹底捜索、現場の漁り",
	"skill.how.medical": "夜の看護",
	"skill.how.build": "修繕、工作、壁の応急",
	"skill.how.farm": "夜の耕作",
	"skill.how.cook": "夜の料理",
	"skill.lv": "{n} {rank}",
	"skill.next": "次 {n} {rank}：{boost}",
	"skill.now": "{rank}。{boost}",
	"skill.xp": "{have}/{need}",
	"skill.maxed": "上限 10",
	"skill.xpGain": "{skill}熟練 +{n}。次まで {left}",
	"skill.leveled": "{skill}が {n}（{rank}）に上がった。{boost}",
	"skill.xpNeed": "次まで {n}",
	"skill.learn": "初期 {n} · 成長 ×{mul}",
	"skill.learn.slow": "初期 0：成長 25%。触ったことのない手は遅い。",
	"skill.learn.ok": "初期 1：通常。使えば残る。",
	"skill.learn.fast": "初期 2以上：133–166%。職の手は早い。",
	"skill.open": "技能の説明",
	"skill.close": "閉じる",
	"log.skillLevel": "{name}の{skill}が {n}（{rank}）に上がった。{boost}",
	"log.skillUp": "{name}の手が少し上手くなった。",
	"notices.skill": "{name} · {skill} {n} {rank}",
	"notices.dismiss": "了解",
	"notices.title": "手が上がった",
	"roster.skills": "技能は使って伸びる。上限 10。行を開くと今のボーナスと次が見える。初期 0 は成長 25%——斧を持ったことのない手。",
	"create.skillHint": "残りを振る。上限 10。各レベルに効果がある。任務・料理・修繕・耕作で伸びる。初期 0 は四分の一。職がくれたレベルが学習速度を決める。",
	"create.nextXp": " · 次 {n} xp",
	"bible.tab.skills": "技能",
	"bible.play.skills": "技能 0–10",
	"bible.play.skills.body": "使って伸びる。斬れば戦闘が熟す。各レベルに説明。上限 10。初期 0 は 25%、1 は 100%、2 は 133%、3以上は 166%。聡穎／愚鈍がさらに掛かる。人員カードで次を見る。",
	"skill.combat.blurb": "ダメージ、被弾減、追加キル。戦うと伸びる。",
	"skill.stealth.blurb": "捜索が静か。迂回は 6、隠密 5 で 5。",
	"skill.scavenge.blurb": "持ち帰りと装備率。徹底捜索と現場で伸びる。",
	"skill.medical.blurb": "看護量と感染解除。医師は初期 6。夜の看護で伸びる。",
	"skill.build.blurb": "壁と工作修復。整備士は初期 4。",
	"skill.farm.blurb": "畑の収穫。農夫は初期 4。夜の耕作で伸びる。",
	"skill.cook.blurb": "食料と士気。料理人は初期 4。夜の料理で伸びる。",
	"ch.flankHint": "隠密が条件（既定 6、隠密 5 で 5）。弾を使わず安全。"
};
var skillKo = {
	...ranks(RANK_KO),
	...levels("combat", combatKo),
	...levels("stealth", stealthKo),
	...levels("scavenge", scavengeKo),
	...levels("medical", medicalKo),
	...levels("build", buildKo),
	...levels("farm", farmKo),
	...levels("cook", cookKo),
	"ui.dot": " · ",
	"skill.bit.atk": "피해 +{n}",
	"skill.bit.wound": "피격 −{n}%",
	"skill.bit.kill": "추가 {n}킬",
	"skill.bit.combat0": "아직 몸이 기억하지 못함",
	"skill.bit.noise": "소음 −{n}%",
	"skill.bit.flank": "우회는 은밀 {n}",
	"skill.bit.flankKill": "우회 +{n}킬",
	"skill.bit.quietLoot": "조용한 수색이 더 줌",
	"skill.bit.loot": "수색량 {n}%",
	"skill.bit.gear": "장비 확률 +{n}%",
	"skill.bit.extraGear": "장비 판정 한 번 더",
	"skill.bit.heal": "간호 치료 {n}",
	"skill.bit.cure": "감염 제거 {n}%",
	"skill.bit.tendHp": "간호자 +{n} HP",
	"skill.bit.wall": "벽 +{n}",
	"skill.bit.mend": "제작 수리 {n}",
	"skill.bit.doubleMend": "한 번에 두 점",
	"skill.bit.farm": "수확 {n}%",
	"skill.bit.crop": "추가 식량 +{n}",
	"skill.bit.cookFood": "요리 산출 {n}",
	"skill.bit.cookMorale": "온식 사기 +{n}",
	"skill.how.combat": "임무에서 싸움, 좀비를 벤다",
	"skill.how.stealth": "조용한 수색, 우회",
	"skill.how.scavenge": "철저한 수색, 현장 루팅",
	"skill.how.medical": "밤 간호",
	"skill.how.build": "수선, 제작, 벽 응급",
	"skill.how.farm": "밤 농사",
	"skill.how.cook": "밤 요리",
	"skill.lv": "{n} {rank}",
	"skill.next": "다음 {n} {rank}: {boost}",
	"skill.now": "{rank}. {boost}",
	"skill.xp": "{have}/{need}",
	"skill.maxed": "상한 10",
	"skill.xpGain": "{skill}숙련 +{n}. 다음까지 {left}",
	"skill.leveled": "{skill}이(가) {n}({rank})으로 올랐다. {boost}",
	"skill.xpNeed": "다음까지 {n}",
	"skill.learn": "선천 {n} · 성장 ×{mul}",
	"skill.learn.slow": "선천 0: 성장 25%. 안 잡아본 손은 느리다.",
	"skill.learn.ok": "선천 1: 보통. 쓰면 남는다.",
	"skill.learn.fast": "선천 2+: 133–166%. 직업의 손이 빠르다.",
	"skill.open": "기술 설명",
	"skill.close": "접기",
	"log.skillLevel": "{name}의 {skill}이(가) {n}({rank})으로 올랐다. {boost}",
	"log.skillUp": "{name}의 손이 조금 늘었다.",
	"notices.skill": "{name} · {skill} {n} {rank}",
	"notices.dismiss": "알겠다",
	"notices.title": "손이 늘었다",
	"roster.skills": "기술은 써야 는다. 상한 10. 줄을 열면 이번 레벨 보너스와 다음이 보인다. 선천 0 은 성장 25% — 도끼를 안 잡아본 손.",
	"create.skillHint": "남은 점수를 투자. 상한 10. 매 레벨에 효과가 있다. 임무·요리·수리·농사가 계속 키운다. 선천 0 은 1/4 속도. 직업이 준 레벨이 성장 속도를 정한다.",
	"create.nextXp": " · 다음 {n} xp",
	"bible.tab.skills": "기술",
	"bible.play.skills": "기술 0–10",
	"bible.play.skills.body": "써야 는다. 베면 전투가 는다. 매 레벨에 설명이 있다. 상한 10. 선천 0=25%, 1=100%, 2=133%, 3+=166%. 총명/둔함이 곱해진다. 인원 카드에서 다음을 본다.",
	"skill.combat.blurb": "피해, 피격 감소, 추가 킬. 싸우면 는다.",
	"skill.stealth.blurb": "수색이 조용. 우회는 6, 은밀 5면 5.",
	"skill.scavenge.blurb": "가져오는 양과 장비 확률. 철저 수색과 현장에서 는다.",
	"skill.medical.blurb": "간호량과 감염 제거. 의사는 선천 6. 밤 간호로 는다.",
	"skill.build.blurb": "벽과 제작 수리. 정비공은 선천 4.",
	"skill.farm.blurb": "텃밭 수확. 농부는 선천 4. 밤 농사로 는다.",
	"skill.cook.blurb": "식량과 사기. 요리사는 선천 4. 밤 요리로 는다.",
	"ch.flankHint": "은밀이 조건을 넘어야 한다(기본 6, 은밀 5면 5). 탄 없이 안전."
};
/** Player-facing copy for overnight dispatch. Last-merged into i18n. */
var dispatchZh = {
	"dispatch.title": "委派外出",
	"dispatch.kicker": "據點外圍",
	"dispatch.body": "人多才能派人。留下至少一個守家。他們不走遠、不耗油，帶乾糧在據點外圍採藥、拆板、摸溪。熟什麼就優先搜什麼。今晚過夜才回來——可能提著袋，也可能帶傷，偶爾會撞上奇遇。",
	"dispatch.close": "取消",
	"dispatch.send": "派出",
	"dispatch.needPeople": "一個人只能守家。再收一個，才能派人外出。",
	"dispatch.needStay": "至少留一個人看家。夜襲不會等人。",
	"dispatch.needAp": "今天沒有行動了。過夜之後才能再派。",
	"dispatch.busy": "已經有人在外面。等他們回來再派。",
	"dispatch.none": "選一個走得動的人。",
	"dispatch.max": "一次最多兩人。再多就是出征，不是外圍。",
	"dispatch.pack": "帶走食物 {food} · 水 {water} · 行動 1",
	"dispatch.packShort": "乾糧不夠。他們會空著肚子走，風險較高。",
	"dispatch.away": "外出中",
	"dispatch.out": "{names} 在外圍（{task}）。過夜才回。",
	"dispatch.backTonight": "今晚回來",
	"dispatch.stillOut": "還沒回來",
	"dispatch.open": "委派外出",
	"dispatch.openHint": "派人採藥、搜物資。按專長走。",
	"dispatch.solo": "只有你一個。先活過今晚，再談派人。",
	"dispatch.pickTask": "他們去找什麼",
	"dispatch.pickWho": "派誰去（最多兩人，至少留一個）",
	"dispatch.confirm": "派出 {n} 人",
	"dispatch.woods": "據點外圍的林子",
	"dispatch.nothing": "兩手空空",
	"dispatch.noMap": "一張看不懂的紙",
	"dispatch.death": "外出沒有回來",
	"dispatch.task.herbs": "採草藥",
	"dispatch.task.herbs.blurb": "沿溝、廢園、獸醫診所的架子。醫療與農耕高的人會優先翻繃帶、藥草、過期抗生素。其他人只能幫忙提袋。",
	"dispatch.task.supplies": "搜物資",
	"dispatch.task.supplies.blurb": "拆棚、翻車廂、撬沒鎖的棚屋。搜刮與建造高的人知道哪塊板還能用，釘子在哪一罐。偶爾摸到子彈或一點油。",
	"dispatch.task.forage": "覓食",
	"dispatch.task.forage.blurb": "溪邊、果樹、沒人收的田。農耕、烹飪、戶外的人不會把蘑菇認成毒藥。主要帶回食物與水。",
	"dispatch.task.auto": "按專長",
	"dispatch.task.auto.blurb": "不指定。農夫走田、醫生找藥、小偷拆門。每人搜自己最熟的，袋裡會比較雜，也比較像他們本人。",
	"dispatch.focus.herbs": "會優先找藥",
	"dispatch.focus.supplies": "會優先拆建材",
	"dispatch.focus.forage": "會優先覓食",
	"dispatch.hint.fit": "{name} · {skill} {n} · {focus}",
	"dispatch.hint.poor": "不是這行，走了也是提袋。",
	"dispatch.log.send": "{names} 帶了食物 {food}、水 {water}，往{loc}走，專找{task}。過夜才回。",
	"dispatch.log.hungry": "{names} 乾糧不夠，空著肚子走。手會抖。",
	"dispatch.log.back": "{names} 回來了。",
	"dispatch.log.wait": "{names} 還沒到家。今晚再等。",
	"dispatch.log.delay": "{names} 在{loc}迷了路，今晚不回。明天才到。",
	"dispatch.log.empty": "{names} 從{loc}空手回來。地方被翻過，或他們不敢再往前。",
	"dispatch.log.success": "{names} 從{loc}回來，袋裡有 {loot}。",
	"dispatch.log.lucky": "{names} 在{loc}撞上好運：{loot}。有人低聲說這不該這麼容易。",
	"dispatch.log.cache": "{names} 在{loc}找到一箱藏貨：{loot}。",
	"dispatch.log.note": "{names} 在{loc}撿到一張還能讀的地圖，標了{found}。另外帶回 {loot}。",
	"dispatch.log.warning": "{names} 在{loc}看見新的腳印，指向{found}。他們沒敢久留。帶回 {loot}。",
	"dispatch.log.person": "{names} 從{loc}帶回一個人：{who}。袋裡還有 {loot}。床位剛好。",
	"dispatch.log.personFull": "{names} 在{loc}遇見活人，但家裡沒床，只能留下名字。帶回 {loot}。",
	"dispatch.log.scratch": "{names} 在{loc}被東西刮到。帶回 {loot}。先看傷口。",
	"dispatch.log.bitten": "{name} 外出時被咬了。傷口發青。",
	"dispatch.log.ambush": "{names} 在{loc}遇上遊蕩的。打輸了。只搶回 {loot}。",
	"dispatch.log.ambushWin": "{names} 在{loc}被堵住，但打穿了。帶回 {loot}。",
	"dispatch.log.ambushFlee": "{names} 在{loc}聽見聲音就跑。袋扔了。人還在。",
	"dispatch.log.torn": "{names} 的袋子在{loc}刮破了。只剩 {loot}。",
	"dispatch.log.greenhouse": "{names} 撞上一座還活著的溫室。摘了 {loot}。",
	"dispatch.log.cellar": "{names} 在{loc}撬開地窖。底下有 {loot}。",
	"dispatch.log.deer": "{names} 在林子裡碰到一頭還能吃的鹿。帶回 {loot}。",
	"dispatch.log.clinic": "{names} 翻過{loc}附近一間關上的診療室。找到 {loot}。",
	"dispatch.log.truck": "{names} 在{loc}一輛拋錨的卡車裡虹吸到油，還摸了 {loot}。",
	"dispatch.log.hurt": "{name} 帶傷回來（−{n}）。",
	"dispatch.log.dead": "{name} 外出沒有回來。袋在路上。",
	"dispatch.log.gear": "{name} 另外摸到 {item}。",
	"bible.play.dispatch": "委派",
	"bible.play.dispatch.body": "人多才能派人。留一個守家。耗 1 行動、每人 1 食物 1 水，不耗油。他們走據點外圍，不過夜不回。熟練什麼就優先搜什麼：醫療／農耕找藥，搜刮／建造拆板，農耕／戶外覓食。選「按專長」則每人走自己的路。可能空手、帶傷、迷路晚一天，或撞上溫室、地窖、活人、地圖。這不是出征——出征清點地圖上的據點。委派是讓多餘的手去養家。",
	"bible.rule.dispatch": "委派",
	"bible.rule.dispatch.body": "2 人起。最多派 2，至少留 1。行動 1。乾糧不夠仍可走，風險高。過夜才結算。外出的人不做家中工作、不守夜。牆低時把人派光，夜襲會打在留守的那一個。"
};
var dispatchEn = {
	"dispatch.title": "Send out",
	"dispatch.kicker": "Around the house",
	"dispatch.body": "You need more than one person. Leave someone home. They do not go far, they do not burn fuel. They walk the tree line for herbs, boards, a creek. They search what they already know. They come back when you sleep — with a bag, a wound, or something they did not mean to find.",
	"dispatch.close": "Cancel",
	"dispatch.send": "Send",
	"dispatch.needPeople": "One person keeps the house. Recruit someone before you send anyone out.",
	"dispatch.needStay": "Leave one person home. Night does not wait.",
	"dispatch.needAp": "No actions left today. Sleep first.",
	"dispatch.busy": "Someone is already out. Wait for them.",
	"dispatch.none": "Pick someone who can still walk.",
	"dispatch.max": "Two people at most. More than that is a raid.",
	"dispatch.pack": "Take food {food} · water {water} · 1 action",
	"dispatch.packShort": "Not enough rations. They go hungry. Worse odds.",
	"dispatch.away": "Out",
	"dispatch.out": "{names} are out ({task}). Back after you sleep.",
	"dispatch.backTonight": "Back tonight",
	"dispatch.stillOut": "Not back yet",
	"dispatch.open": "Send out",
	"dispatch.openHint": "Send people for herbs and scrap. They work what they know.",
	"dispatch.solo": "Just you. Live the night before you send anyone.",
	"dispatch.pickTask": "What they look for",
	"dispatch.pickWho": "Who goes (two max, one stays)",
	"dispatch.confirm": "Send {n}",
	"dispatch.woods": "the woods by the house",
	"dispatch.nothing": "nothing",
	"dispatch.noMap": "a scrap of paper",
	"dispatch.death": "did not come back",
	"dispatch.task.herbs": "Herbs",
	"dispatch.task.herbs.blurb": "Ditches, dead gardens, a vet shelf. Medical and farming hands go for bandages, weeds, old antibiotics. Everyone else carries.",
	"dispatch.task.supplies": "Scrap",
	"dispatch.task.supplies.blurb": "Sheds, stalled cars, an unlocked lean-to. Scavenge and build know which board still holds and which tin has nails. Sometimes ammo. Sometimes a sip of fuel.",
	"dispatch.task.forage": "Forage",
	"dispatch.task.forage.blurb": "Creek, fruit trees, a field nobody cut. Farming, cooking, outdoors — they do not eat the wrong mushroom. Food and water come home.",
	"dispatch.task.auto": "By skill",
	"dispatch.task.auto.blurb": "No order. The farmer walks fields, the doctor hunts medicine, the thief opens doors. Each searches what they know. The bag is mixed. That is the point.",
	"dispatch.focus.herbs": "will look for medicine",
	"dispatch.focus.supplies": "will pull boards",
	"dispatch.focus.forage": "will look for food",
	"dispatch.hint.fit": "{name} · {skill} {n} · {focus}",
	"dispatch.hint.poor": "Not their work. They will carry.",
	"dispatch.log.send": "{names} took food {food}, water {water}, toward {loc}, looking for {task}. Back after sleep.",
	"dispatch.log.hungry": "{names} left hungry. Hands shake.",
	"dispatch.log.back": "{names} came home.",
	"dispatch.log.wait": "{names} are not home. One more night.",
	"dispatch.log.delay": "{names} lost the path at {loc}. Not tonight. Tomorrow.",
	"dispatch.log.empty": "{names} came back empty from {loc}. Picked over, or they would not go further.",
	"dispatch.log.success": "{names} came back from {loc} with {loot}.",
	"dispatch.log.lucky": "{names} got lucky at {loc}: {loot}. Someone said it should not have been that easy.",
	"dispatch.log.cache": "{names} found a stash at {loc}: {loot}.",
	"dispatch.log.note": "{names} found a readable map at {loc}. It marks {found}. Also {loot}.",
	"dispatch.log.warning": "{names} saw fresh tracks at {loc} toward {found}. They did not stay. Brought {loot}.",
	"dispatch.log.person": "{names} brought someone from {loc}: {who}. Also {loot}. There was a bed.",
	"dispatch.log.personFull": "{names} met someone at {loc}. No bed. They left a name. Brought {loot}.",
	"dispatch.log.scratch": "{names} got cut at {loc}. Brought {loot}. Check the wound.",
	"dispatch.log.bitten": "{name} was bitten while out. The cut is going dark.",
	"dispatch.log.ambush": "{names} walked into wanderers at {loc}. Lost the fight. Salvaged {loot}.",
	"dispatch.log.ambushWin": "{names} got boxed in at {loc} and cut through. Brought {loot}.",
	"dispatch.log.ambushFlee": "{names} ran at the first sound at {loc}. Bag gone. People not.",
	"dispatch.log.torn": "The bag tore at {loc}. Only {loot} made it.",
	"dispatch.log.greenhouse": "{names} found a greenhouse still alive. Picked {loot}.",
	"dispatch.log.cellar": "{names} cracked a cellar at {loc}. Under it: {loot}.",
	"dispatch.log.deer": "{names} took a deer in the trees. Brought {loot}.",
	"dispatch.log.clinic": "{names} went through a shut clinic near {loc}. Found {loot}.",
	"dispatch.log.truck": "{names} siphoned a dead truck at {loc} and took {loot}.",
	"dispatch.log.hurt": "{name} came back hurt (−{n}).",
	"dispatch.log.dead": "{name} did not come back. The bag is on the road.",
	"dispatch.log.gear": "{name} also lifted {item}.",
	"bible.play.dispatch": "Send out",
	"bible.play.dispatch.body": "Need two people. Leave one home. Costs 1 action and 1 food + 1 water each. No fuel. They walk the edge of the house and return when you sleep. They search what they know: medical/farming for herbs, scavenge/build for scrap, farming/outdoors for food. “By skill” lets each follow their own hand. They can come back empty, cut, a day late, or with a greenhouse, a cellar, a stranger, a map. This is not a raid. Raids clear the map. This feeds the house with spare hands.",
	"bible.rule.dispatch": "Send out",
	"bible.rule.dispatch.body": "From 2 living. Send at most 2, leave 1. 1 action. Hungry runs are allowed and riskier. Resolves on sleep. Away people skip house jobs and guard. If the wall is low, the one you left takes the raid."
};
var dispatchJa = {
	"dispatch.title": "派遣",
	"dispatch.kicker": "拠点の外",
	"dispatch.body": "人が足りて初めて出せる。誰かは家に残す。遠くへは行かない。燃料も使わない。薬草、板、小川。得意なものを先に探す。眠ると帰ってくる。袋か、傷か、想定外か。",
	"dispatch.close": "やめる",
	"dispatch.send": "出す",
	"dispatch.needPeople": "一人では家を守るだけ。誰かを入れてから出せ。",
	"dispatch.needStay": "一人は残す。夜は待たない。",
	"dispatch.needAp": "今日の行動がない。先に眠れ。",
	"dispatch.busy": "もう誰かが出ている。帰れ。",
	"dispatch.none": "歩ける人を選べ。",
	"dispatch.max": "一度に二人まで。それ以上は出撃だ。",
	"dispatch.pack": "食料 {food} · 水 {water} · 行動 1",
	"dispatch.packShort": "食糧が足りない。空腹で出る。危ない。",
	"dispatch.away": "外出中",
	"dispatch.out": "{names} は外にいる（{task}）。眠ると戻る。",
	"dispatch.backTonight": "今夜戻る",
	"dispatch.stillOut": "まだ戻らない",
	"dispatch.open": "派遣",
	"dispatch.openHint": "薬草や資材を取りに出す。得意な道を行く。",
	"dispatch.solo": "一人だ。今夜を越えてから人を出せ。",
	"dispatch.pickTask": "何を取りに",
	"dispatch.pickWho": "誰を出す（最大二人、一人は残す）",
	"dispatch.confirm": "{n}人を出す",
	"dispatch.woods": "拠点の林",
	"dispatch.nothing": "何もない",
	"dispatch.noMap": "読めない紙",
	"dispatch.death": "戻らなかった",
	"dispatch.task.herbs": "薬草",
	"dispatch.task.herbs.blurb": "溝、枯れた畑、獣医の棚。医療と農耕が高い人は包帯と薬を先に取る。他の人は運ぶ。",
	"dispatch.task.supplies": "資材",
	"dispatch.task.supplies.blurb": "小屋、止まった車、鍵のない物置。捜索と工作が高い人は使える板と釘を知っている。弾や燃料が混ざることもある。",
	"dispatch.task.forage": "調達",
	"dispatch.task.forage.blurb": "小川、果樹、刈られていない畑。農耕・料理・野外の人は毒を食べない。食料と水が帰る。",
	"dispatch.task.auto": "得意に任せる",
	"dispatch.task.auto.blurb": "指示しない。農夫は畑、医者は薬、泥棒は扉。各自が知っているものを取る。袋は混ざる。それでいい。",
	"dispatch.focus.herbs": "薬を優先する",
	"dispatch.focus.supplies": "資材を優先する",
	"dispatch.focus.forage": "食料を優先する",
	"dispatch.hint.fit": "{name} · {skill} {n} · {focus}",
	"dispatch.hint.poor": "本業ではない。運ぶだけ。",
	"dispatch.log.send": "{names} は食料 {food}、水 {water} を持って{loc}へ。{task}を探す。眠ったら戻る。",
	"dispatch.log.hungry": "{names} は空腹のまま出た。手が震える。",
	"dispatch.log.back": "{names} が戻った。",
	"dispatch.log.wait": "{names} はまだ帰らない。もう一晩。",
	"dispatch.log.delay": "{names} は{loc}で道を外した。今夜は帰らない。明日。",
	"dispatch.log.empty": "{names} は{loc}から空手で戻った。先を取れなかった。",
	"dispatch.log.success": "{names} は{loc}から {loot} を持ち帰った。",
	"dispatch.log.lucky": "{names} は{loc}で運が良かった：{loot}。こんなに楽なはずがない。",
	"dispatch.log.cache": "{names} は{loc}で隠し物資を見つけた：{loot}。",
	"dispatch.log.note": "{names} は{loc}で読める地図を拾った。{found} が書いてある。ほかに {loot}。",
	"dispatch.log.warning": "{names} は{loc}で新しい足跡を見た。{found} の方だ。長居しなかった。{loot}。",
	"dispatch.log.person": "{names} は{loc}から人を連れてきた：{who}。ほかに {loot}。ベッドは空いていた。",
	"dispatch.log.personFull": "{names} は{loc}で生きている人に会った。ベッドがない。名前だけ残した。{loot}。",
	"dispatch.log.scratch": "{names} は{loc}で切られた。{loot} を持って帰った。傷を見ろ。",
	"dispatch.log.bitten": "{name} は外出中に噛まれた。傷が暗い。",
	"dispatch.log.ambush": "{names} は{loc}で徘徊にぶつかった。負けた。{loot} だけ拾った。",
	"dispatch.log.ambushWin": "{names} は{loc}で囲まれたが切り抜けた。{loot}。",
	"dispatch.log.ambushFlee": "{names} は{loc}で音を聞いて逃げた。袋は捨てた。人は残った。",
	"dispatch.log.torn": "{loc}で袋が破れた。残ったのは {loot}。",
	"dispatch.log.greenhouse": "{names} はまだ生きている温室に当たった。{loot} を摘んだ。",
	"dispatch.log.cellar": "{names} は{loc}の地下室を開けた。中は {loot}。",
	"dispatch.log.deer": "{names} は林で鹿を仕留めた。{loot}。",
	"dispatch.log.clinic": "{names} は{loc}近くの閉まった診療所を漁った。{loot}。",
	"dispatch.log.truck": "{names} は{loc}の止まったトラックから油を吸い、{loot} も取った。",
	"dispatch.log.hurt": "{name} は傷を負って戻った（−{n}）。",
	"dispatch.log.dead": "{name} は戻らなかった。袋は道にある。",
	"dispatch.log.gear": "{name} はついでに {item} を持ち出した。",
	"bible.play.dispatch": "派遣",
	"bible.play.dispatch.body": "二人以上。一人は残す。行動 1、一人につき食料 1・水 1。燃料は使わない。拠点の外を歩き、眠ると戻る。得意なものを探す。医療／農耕は薬、捜索／工作は資材、農耕／野外は食。「得意に任せる」は各自の手。空手、負傷、一日遅れ、温室、地下室、他人、地図がありうる。出撃ではない。出撃は地図を掃く。派遣は余った手で家を養う。",
	"bible.rule.dispatch": "派遣",
	"bible.rule.dispatch.body": "生存者 2 から。最大 2、最低 1 残留。行動 1。空腹でも出せるが危ない。睡眠で決算。外出中は家の仕事も見張りもしない。壁が低いと、残した一人が夜襲を食う。"
};
var dispatchKo = {
	"dispatch.title": "파견",
	"dispatch.kicker": "거점 바깥",
	"dispatch.body": "사람이 둘은 있어야 보낸다. 하나는 집에 남겨. 멀리 안 가고 연료도 안 쓴다. 약초, 판자, 개울. 익숙한 것을 먼저 찾는다. 자면 돌아온다. 가방이거나, 상처거나, 예상 밖이거나.",
	"dispatch.close": "취소",
	"dispatch.send": "보낸다",
	"dispatch.needPeople": "혼자면 집만 지킨다. 누구를 들이고 나서 보내.",
	"dispatch.needStay": "하나는 남겨. 밤은 기다리지 않는다.",
	"dispatch.needAp": "오늘 행동이 없다. 먼저 자라.",
	"dispatch.busy": "이미 나가 있다. 돌아올 때까지.",
	"dispatch.none": "걸을 수 있는 사람을 골라.",
	"dispatch.max": "한 번에 둘까지. 그 이상은 출격이다.",
	"dispatch.pack": "식량 {food} · 물 {water} · 행동 1",
	"dispatch.packShort": "식량이 모자라다. 빈속으로 간다. 위험하다.",
	"dispatch.away": "외출 중",
	"dispatch.out": "{names} 이 바깥에 있다 ({task}). 자면 돌아온다.",
	"dispatch.backTonight": "오늘 밤 복귀",
	"dispatch.stillOut": "아직 안 옴",
	"dispatch.open": "파견",
	"dispatch.openHint": "약초와 자재를 보내 걷는다. 능숙한 쪽으로.",
	"dispatch.solo": "너뿐이다. 오늘 밤을 넘기고 사람을 보내.",
	"dispatch.pickTask": "무엇을 찾나",
	"dispatch.pickWho": "누구를 보내나 (최대 둘, 하나는 잔류)",
	"dispatch.confirm": "{n}명 보낸다",
	"dispatch.woods": "거점 옆 숲",
	"dispatch.nothing": "빈손",
	"dispatch.noMap": "읽히지 않는 종이",
	"dispatch.death": "돌아오지 않았다",
	"dispatch.task.herbs": "약초",
	"dispatch.task.herbs.blurb": "도랑, 죽은 밭, 수의사 선반. 의료와 농사가 높은 사람은 붕대와 약을 먼저 집는다. 나머지는 든다.",
	"dispatch.task.supplies": "자재",
	"dispatch.task.supplies.blurb": "헛간, 선 차, 잠기지 않은 창고. 수색과 제작이 높은 사람은 쓸 판자와 못을 안다. 탄약이나 기름이 섞이기도 한다.",
	"dispatch.task.forage": "채집",
	"dispatch.task.forage.blurb": "개울, 과수, 베지 않은 밭. 농사·요리·야외인 사람은 독버섯을 안 먹는다. 식량과 물이 돌아온다.",
	"dispatch.task.auto": "특기로",
	"dispatch.task.auto.blurb": "지시하지 않는다. 농부는 밭, 의사는 약, 도둑은 문. 각자 아는 것을 찾는다. 가방은 섞인다. 그게 맞다.",
	"dispatch.focus.herbs": "약을 우선한다",
	"dispatch.focus.supplies": "자재를 우선한다",
	"dispatch.focus.forage": "식량을 우선한다",
	"dispatch.hint.fit": "{name} · {skill} {n} · {focus}",
	"dispatch.hint.poor": "본업이 아니다. 들기만 한다.",
	"dispatch.log.send": "{names} 이 식량 {food}, 물 {water} 를 들고 {loc} 으로 갔다. {task}. 자면 돌아온다.",
	"dispatch.log.hungry": "{names} 이 빈속으로 나갔다. 손이 떤다.",
	"dispatch.log.back": "{names} 이 돌아왔다.",
	"dispatch.log.wait": "{names} 이 아직 안 왔다. 하룻밤 더.",
	"dispatch.log.delay": "{names} 이 {loc} 에서 길을 잃었다. 오늘 밤은 안 온다. 내일.",
	"dispatch.log.empty": "{names} 이 {loc} 에서 빈손으로 돌아왔다. 더 못 갔다.",
	"dispatch.log.success": "{names} 이 {loc} 에서 {loot} 를 들고 왔다.",
	"dispatch.log.lucky": "{names} 이 {loc} 에서 운이 좋았다: {loot}. 이렇게 쉬울 리가 없다.",
	"dispatch.log.cache": "{names} 이 {loc} 에서 숨긴 물건을 찾았다: {loot}.",
	"dispatch.log.note": "{names} 이 {loc} 에서 읽히는 지도를 주웠다. {found} 가 적혀 있다. 그리고 {loot}.",
	"dispatch.log.warning": "{names} 이 {loc} 에서 새 발자국을 봤다. {found} 쪽. 오래 안 있었다. {loot}.",
	"dispatch.log.person": "{names} 이 {loc} 에서 사람을 데려왔다: {who}. 그리고 {loot}. 침대가 비었다.",
	"dispatch.log.personFull": "{names} 이 {loc} 에서 산 사람을 만났다. 침대가 없다. 이름만 남겼다. {loot}.",
	"dispatch.log.scratch": "{names} 이 {loc} 에서 긁혔다. {loot} 를 들고 왔다. 상처를 봐라.",
	"dispatch.log.bitten": "{name} 이 밖에서 물렸다. 상처가 검다.",
	"dispatch.log.ambush": "{names} 이 {loc} 에서 배회자와 부딪쳤다. 졌다. {loot} 만 건졌다.",
	"dispatch.log.ambushWin": "{names} 이 {loc} 에서 막혔지만 뚫었다. {loot}.",
	"dispatch.log.ambushFlee": "{names} 이 {loc} 에서 소리를 듣고 뛰었다. 가방은 버렸다. 사람은 남았다.",
	"dispatch.log.torn": "{loc} 에서 가방이 찢겼다. 남은 건 {loot}.",
	"dispatch.log.greenhouse": "{names} 이 아직 살아있는 온실을 만났다. {loot} 를 땄다.",
	"dispatch.log.cellar": "{names} 이 {loc} 의 지하실을 열었다. 안은 {loot}.",
	"dispatch.log.deer": "{names} 이 숲에서 사슴을 잡았다. {loot}.",
	"dispatch.log.clinic": "{names} 이 {loc} 근처 닫힌 진료소를 뒤졌다. {loot}.",
	"dispatch.log.truck": "{names} 이 {loc} 의 선 트럭에서 기름을 빨고 {loot} 도 챙겼다.",
	"dispatch.log.hurt": "{name} 이 다쳐서 돌아왔다 (−{n}).",
	"dispatch.log.dead": "{name} 이 돌아오지 않았다. 가방은 길에 있다.",
	"dispatch.log.gear": "{name} 이 {item} 도 집어 왔다.",
	"bible.play.dispatch": "파견",
	"bible.play.dispatch.body": "두 명부터. 하나는 남긴다. 행동 1, 사람당 식량 1·물 1. 연료 없음. 집 가장자리를 걷고 자면 돌아온다. 익숙한 것을 찾는다. 의료/농사 약, 수색/제작 자재, 농사/야외 식량. 「특기로」는 각자 손. 빈손, 부상, 하루 지연, 온실, 지하실, 사람, 지도가 있다. 출격이 아니다. 출격은 지도를 쓸고, 파견은 남은 손으로 집을 먹인다.",
	"bible.rule.dispatch": "파견",
	"bible.rule.dispatch.body": "생존자 2부터. 최대 2, 최소 1 잔류. 행동 1. 굶어도 보낼 수 있으나 위험. 잠에서 결산. 나간 사람은 집안일과 경계를 안 한다. 벽이 낮으면 남겨 둔 한 사람이 야습을 맞는다."
};
var LOCALES = [
	{
		id: "zh",
		short: "中"
	},
	{
		id: "ja",
		short: "日"
	},
	{
		id: "en",
		short: "EN"
	},
	{
		id: "ko",
		short: "한"
	}
];
var HTML_LANG = {
	zh: "zh-Hant",
	ja: "ja",
	en: "en",
	ko: "ko"
};
var KEY$2 = "ash-lang";
var locale = "zh";
var subs = /* @__PURE__ */ new Set();
function emit() {
	subs.forEach((fn) => fn());
}
function getLocale() {
	return locale;
}
function bootLocale() {
	if (typeof window === "undefined") return;
	try {
		const saved = localStorage.getItem(KEY$2);
		if (saved === "zh" || saved === "ja" || saved === "en" || saved === "ko") locale = saved;
		else {
			const n = (navigator.language || "zh").toLowerCase();
			if (n.startsWith("ja")) locale = "ja";
			else if (n.startsWith("ko")) locale = "ko";
			else if (n.startsWith("en")) locale = "en";
			else if (n.startsWith("zh")) locale = "zh";
		}
	} catch {}
	document.documentElement.lang = HTML_LANG[locale];
}
function setLocale(id) {
	locale = id;
	try {
		localStorage.setItem(KEY$2, id);
	} catch {}
	if (typeof document !== "undefined") document.documentElement.lang = HTML_LANG[id];
	emit();
}
function subscribe(fn) {
	subs.add(fn);
	return () => {
		subs.delete(fn);
	};
}
function fill(s, vars) {
	if (!vars) return s;
	let out = s;
	for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
	return out;
}
function t(key, vars) {
	return fill((DICT[locale] ?? DICT.zh)[key] ?? DICT.zh[key] ?? key, vars);
}
function useT() {
	(0, import_react.useSyncExternalStore)(subscribe, getLocale, () => "zh");
	return t;
}
var zh = {
	"ui.mute": "靜音",
	"ui.unmute": "開啟聲音",
	"ui.new": "新的倖存",
	"ui.continue": "繼續",
	"ui.tip": "提示",
	"ui.title": "再活一晚",
	"ui.ash": "One More Night",
	"ui.ver": "v0.1 免費原型",
	"ui.coverHint": "封面：右鍵另存，傳到 itch Cover image",
	"ui.kitHint": "截圖：右鍵各圖另存，傳到 itch Screenshots",
	"ui.kitOpen": "itch 封面與截圖",
	"ui.kitClose": "關閉",
	"ui.zip": "下載 v0.1 ZIP（itch 上傳用）",
	"ui.doc": "下載 Suno 音效清單（Word）",
	"ui.shot.1": "截圖 1 · 主畫面",
	"ui.shot.2": "截圖 2 · 據點",
	"ui.shot.3": "截圖 3 · 人員與裝備",
	"tip.0": "情緒沉到地板，人就出不了門。先過夜，再談出征。",
	"tip.1": "缺點是買活路的。失眠換技能點，比空手去莫卓划算。",
	"tip.2": "職業只是起手。活過十天，履歷會被技能改寫。",
	"tip.3": "別一個人出征。兩個人回來，好感才開始長。",
	"tip.4": "殺太多僵屍，手會抖。回來喝熱水，別接著守夜。",
	"tip.5": "食物不夠時先煮飯。空肚子的人修不好門。",
	"tip.6": "地圖是真的美國。遠的城，先算油。",
	"tip.7": "救回來的人不一定是朋友。敵對的，別讓他守夜。",
	"tip.8": "商場東西多，聲音也大。想活，走側門。",
	"tip.9": "清光一區才能搬。床不夠，佔領只是換地方餓死。",
	"tip.10": "情侶出征比較準。其中一個死了，另一個會垮。",
	"tip.11": "永久死亡。最後一個倒下去，這局結束。",
	"tip.12": "槍有子彈才是槍。沒彈藥，斧頭比較誠實。",
	"tip.13": "圍牆不是裝飾。值夜的人少，東西會從門縫進來。",
	"tip.14": "衣服是護甲。頭盔擋牙，背包多一罐。出征會掉裝備，稀有度看地點。",
	"tip.15": "軍營與警局才出鋼板。商場多的是外套。壞了的東西，工坊能修。",
	"ui.back": "返回",
	"ui.random": "隨機",
	"ui.next": "下一步",
	"ui.enter": "進入庇護所",
	"ui.extract": "撤離",
	"ui.attack": "攻擊",
	"ui.talk": "對話",
	"ui.search": "搜索",
	"ui.mission": "任務",
	"ui.tap": "點一下開始 · 左移右打",
	"ui.overnight": "過夜",
	"ui.goMission": "出任務",
	"ui.z": "僵",
	"ui.bag": "袋",
	"ui.wall": "圍牆",
	"ui.day": "第 {n} 天",
	"ui.people": "{n}/{cap} 人",
	"ui.infected": "感染",
	"tab.shelter": "家園",
	"tab.roster": "人員",
	"tab.build": "建造",
	"tab.map": "出征",
	"create.occ": "職業",
	"create.face": "外貌",
	"create.traits": "性格",
	"create.skills": "技能",
	"create.shelter": "落腳",
	"create.occHint": "職業只給先天技能與一筆點數。其餘靠性格與技能選單——像肯塔基那場瘟疫裡一樣。",
	"create.faceHint": "外貌跟職業無關。先選一張臉，下一頁再選你以前做什麼。",
	"create.points": "點數 {n}",
	"create.innate": "先天",
	"create.none": "無",
	"create.name": "姓名",
	"create.poolHint": "剩餘點數（缺點加點，優點扣點）",
	"create.pos": "優點 · 耗點",
	"create.neg": "缺點 · 加點",
	"create.needPoints": "點數不夠。再拿一兩個缺點，或拿掉優點。",
	"create.skillHint": "把剩餘點數加在技能上。出任務、煮飯、修牆都會繼續漲——上限 10。",
	"create.alloc": "可分配",
	"create.innateN": "先天 {n}",
	"create.plusAlloc": " + 分配 {n}",
	"create.nextXp": " · 下一級 {n} xp",
	"create.shelterHint": "第一夜要有一扇門能鎖。選錯地方，只是死得比較早。",
	"create.cap": "容量 {n}",
	"create.noTrait": "無性格",
	"create.overwrite": "開始新局會覆蓋目前的存檔。",
	"hub.noGo": "沒有人能出門。情緒已經沉到地板下。先過夜。",
	"hub.bitten": "{n} 人帶著咬傷。藥還剩 {med}。",
	"hub.foodLow": "存糧只夠 {n} 天。該出門了。",
	"hub.alone": "就你一個。外面還有人——不一定是朋友。",
	"hub.alive": "{n} 個人還活著。圍牆 {wall}。",
	"hub.moodLow": "情緒過低",
	"hub.moodNoMission": "，無法出任務。",
	"hub.moodNoSquad": "，不能編入出征。",
	"hub.plan": "庇護所平面",
	"hub.jobs": "今日班表",
	"hub.log": "日誌",
	"hub.lv": "{n}級",
	"hub.unbuilt": "未建",
	"roster.hint": "留守的人經營這棟房子。點部位穿脫裝備。出征會掉稀有度裝備。工坊能修。",
	"roster.gone": "已不在",
	"roster.wound": "傷口在發熱。需要醫務室與藥。",
	"roster.noWork": "情緒過低，無法工作。先休息。",
	"build.hint": "升級房間。木料與藥、油不夠就得出門搜。",
	"build.max": "已滿級",
	"build.need": "需要",
	"map.hint": "真實美國地圖。縮放拖到肯塔基與中西部。點地點出任務。清光僵屍就能搬家。",
	"map.block": "全員情緒過低，無法出征。先過夜休息、煮飯，等情緒回來。",
	"map.home": "目前的家",
	"map.cleared": "已清場",
	"map.zombies": "僵屍 {n}",
	"squad.title": "編隊 · {n}/3",
	"squad.hint": "最多三人。一起出征有機會增進感情——好友與情侶在現場會更強。情緒過低的人走不了。",
	"squad.walk": "步行可到",
	"squad.fuel": "燃油 {n}",
	"squad.noGo": "情緒過低，無法出征",
	"squad.enter": "進入現場",
	"enc.survivor": "倖存者",
	"enc.mood": "態度：{m}",
	"enc.grateful": "求生",
	"enc.wary": "戒備",
	"enc.hurt": "受傷",
	"enc.hostile": "敵對",
	"enc.full": "庇護所已滿。要帶人走，先升級寢室或請離某人。",
	"enc.invite": "帶回去 · 一起經營",
	"enc.trade": "交易",
	"enc.turn": "讓開 · 不帶",
	"enc.fight": "先下手 · 當敵人",
	"occ.can": "可佔領",
	"occ.body": "{en}，{state}。僵屍暫時清光。搬離{old}，這裡能住 {n} 人。",
	"occ.metro": " 佔領一座大都會，這片廢土就有首都了。",
	"occ.move": "搬到這裡",
	"occ.stay": "先回舊家",
	"end.city": "一座城",
	"end.wipe": "全滅",
	"end.nobody": "沒有人了",
	"end.stats": "存活 {day} 天 · 佔領 {n} 處 · 失去 {dead} 人",
	"end.again": "再活一次",
	"end.title": "標題",
	"travel.unknown": "尚未探明",
	"travel.home": "這裡就是家",
	"travel.fuel": "需要燃油 {n}",
	"travel.nobody": "沒有人能出門",
	"travel.mood": "全員情緒過低，無法出任務",
	"size.outpost": "據點",
	"size.town": "小鎮",
	"size.city": "城市",
	"size.metro": "大都會",
	"res.food": "食物",
	"res.water": "水",
	"res.materials": "建材",
	"res.medicine": "藥品",
	"res.ammo": "彈藥",
	"res.fuel": "燃油",
	"skill.combat": "戰鬥",
	"skill.stealth": "潛行",
	"skill.scavenge": "搜刮",
	"skill.medical": "醫療",
	"skill.build": "建造",
	"skill.farm": "農耕",
	"skill.cook": "烹飪",
	"mood.broken": "崩潰",
	"mood.despair": "絕望",
	"mood.low": "低落",
	"mood.anxious": "焦慮",
	"mood.steady": "平穩",
	"mood.stable": "安定",
	"mood.high": "高昂",
	"rel.lover": "情侶",
	"rel.friend": "好友",
	"rel.known": "熟悉",
	"rel.stranger": "陌生",
	"job.rest": "休息",
	"job.cook": "炊事",
	"job.farm": "耕作",
	"job.guard": "警戒",
	"job.repair": "修繕",
	"job.tend": "看護",
	"job.radio": "監聽",
	"job.craft": "打造",
	"wep.fists": "徒手",
	"wep.knife": "刀",
	"wep.axe": "斧",
	"wep.bat": "球棒",
	"wep.pistol": "手槍",
	"wep.rifle": "步槍",
	"fac.beds": "寢室",
	"fac.kitchen": "廚房",
	"fac.water": "集水器",
	"fac.workshop": "工坊",
	"fac.infirmary": "醫務室",
	"fac.garden": "菜園",
	"fac.radio": "無線電",
	"fac.watch": "哨塔",
	"fac.beds.blurb": "多一張床，就能多留一個人。",
	"fac.kitchen.blurb": "熱食讓食物更耐吃，也讓人比較不像要散。",
	"fac.water.blurb": "屋頂接雨。沒有它，你得到河裡冒險。",
	"fac.workshop.blurb": "鋸子、釘子、能修的都在這。",
	"fac.infirmary.blurb": "一張乾淨的桌子，勝過在地板上縫。",
	"fac.garden.blurb": "種子比子彈值錢，只是慢。",
	"fac.radio.blurb": "廢頻裡有人在呼救，也有人在設局。",
	"fac.watch.blurb": "先看到，才有機會不擋。",
	"state.ky": "肯塔基",
	"state.oh": "俄亥俄",
	"state.in": "印第安納",
	"state.tn": "田納西",
	"state.mo": "密蘇里",
	"state.il": "伊利諾",
	"occ.firefighter": "消防員",
	"occ.firefighter.en": "Firefighter",
	"occ.firefighter.blurb": "火場出來的人，扛得住末日。",
	"occ.firefighter.desc": "職業只給你斧頭手感與一點體能。其餘技能，自己點。",
	"occ.doctor": "醫生",
	"occ.doctor.en": "Doctor",
	"occ.doctor.blurb": "還有人懂怎麼把血止住。",
	"occ.doctor.desc": "先天醫療。戰鬥要另外學——醫院沒了，手還在。",
	"occ.officer": "警員",
	"occ.officer.en": "Officer",
	"occ.officer.blurb": "槍聲以後，法律只剩彈匣。",
	"occ.officer.desc": "射擊與壓制是職業病。潛行有一點，種菜沒有。",
	"occ.chef": "廚師",
	"occ.chef.en": "Chef",
	"occ.chef.blurb": "能把過期罐頭變成熱食的人，能留住人。",
	"occ.chef.desc": "廚藝是先天。搜刮時認得什麼還能吃。",
	"occ.mechanic": "技工",
	"occ.mechanic.en": "Mechanic",
	"occ.mechanic.blurb": "東西壞了，總有人能焊回去。",
	"occ.mechanic.desc": "建造與拆件是職業記憶。圍牆聽他的。",
	"occ.farmer": "農夫",
	"occ.farmer.en": "Farmer",
	"occ.farmer.blurb": "土地還在，種子就還有用。",
	"occ.farmer.desc": "農耕與一點廚藝。點數較多——鄉下活下來的人比較雜。",
	"occ.veteran": "退伍軍人",
	"occ.veteran.en": "Veteran",
	"occ.veteran.blurb": "戰爭沒結束，只是換了敵人。",
	"occ.veteran.desc": "戰鬥與潛行天生就高。能自由分配的點很少。",
	"occ.burglar": "竊賊",
	"occ.burglar.en": "Burglar",
	"occ.burglar.blurb": "以前進別人家是罪，現在是班表。",
	"occ.burglar.desc": "潛行與搜刮是手藝。開門的聲音，只有你聽得見。",
	"trait.strong": "強壯",
	"trait.strong.blurb": "近戰多一次餘裕。",
	"trait.quiet": "輕手",
	"trait.quiet.blurb": "走路像貓。",
	"trait.leader": "領導",
	"trait.leader.blurb": "別人比較願意聽。",
	"trait.firstaid": "急救",
	"trait.firstaid.blurb": "會包紮，也會判斷誰先死。",
	"trait.handy": "巧手",
	"trait.handy.blurb": "釘子與木板聽他的。",
	"trait.brave": "無畏",
	"trait.brave.blurb": "往前衝，不太會蹲。",
	"trait.lucky": "好運",
	"trait.lucky.blurb": "抽屜裡總多一樣東西。",
	"trait.fastlearner": "聰穎",
	"trait.fastlearner.blurb": "用過就記住。成長較快。",
	"trait.coward": "懼屍",
	"trait.coward.blurb": "看到那東西，手會抖。",
	"trait.weak": "體弱",
	"trait.weak.blurb": "一場感冒就能躺平。",
	"trait.insomnia": "失眠",
	"trait.insomnia.blurb": "夜裡總在聽門外。",
	"trait.selfish": "自私",
	"trait.selfish.blurb": "口袋裡的東西，不一定拿出來分。",
	"trait.clumsy": "笨拙",
	"trait.clumsy.blurb": "東西會響。釘子會彎。",
	"trait.slowlearner": "愚鈍",
	"trait.slowlearner.blurb": "同樣的傷要犯第二次。成長較慢。",
	"trait.smoker": "煙癮",
	"trait.smoker.blurb": "沒煙的時候，脾氣與肚子一起壞。",
	"trait.pacifist": "厭戰",
	"trait.pacifist.blurb": "殺太多會惡心。戰鬥不順手。",
	"trait.depressed": "抑鬱",
	"trait.depressed.blurb": "起床已經用掉一天的力氣。",
	"trait.agoraphobic": "廣場恐懼",
	"trait.agoraphobic.blurb": "出門本身就是刑罰。",
	"sh.farmhouse": "莫卓農舍",
	"sh.farmhouse.en": "Muldraugh Farmhouse",
	"sh.farmhouse.desc": "木板釘窗的兩層農舍，後院能種菜。僵屍少，鄰居更少。",
	"sh.hardware": "西點五金",
	"sh.hardware.en": "West Point Hardware",
	"sh.hardware.desc": "沿主街的五金行。工坊現成，木料夠圍牆，入夜後櫥窗會響。",
	"sh.highrise": "路易斯維爾頂樓",
	"sh.highrise.en": "Louisville Walk-up",
	"sh.highrise.desc": "六樓公寓，水塔還能接。容量大，週遭街區已被啃空一半。",
	"loc.muldraugh_farm": "莫卓農舍",
	"loc.westpoint_shop": "西點五金",
	"loc.louisville_apt": "路易斯維爾頂樓",
	"loc.rosewood_pd": "玫瑰鎮警局",
	"loc.muldraugh_wh": "莫卓倉庫",
	"loc.riverside_mart": "河畔雜貨",
	"loc.westpoint_town": "西點市區",
	"loc.march_ridge": "三月嶺",
	"loc.louisville_er": "路易斯維爾醫院",
	"loc.louisville_mall": "路易斯維爾商場",
	"loc.fort_knox": "諾克斯堡",
	"loc.cincinnati": "辛辛那提",
	"loc.indianapolis": "印第安納波利斯",
	"loc.nashville": "納什維爾",
	"loc.memphis": "孟菲斯",
	"loc.stlouis": "聖路易斯",
	"loc.chicago": "芝加哥",
	"room.便利店": "便利店",
	"room.倉庫": "倉庫",
	"room.停屍間": "停屍間",
	"room.停車場": "停車場",
	"room.儲藏": "儲藏",
	"room.公寓廳": "公寓廳",
	"room.卸貨": "卸貨",
	"room.地下室": "地下室",
	"room.大廳": "大廳",
	"room.客廳": "客廳",
	"room.屋頂口": "屋頂口",
	"room.工具間": "工具間",
	"room.巷弄": "巷弄",
	"room.店面": "店面",
	"room.廁所": "廁所",
	"room.廚房": "廚房",
	"room.後巷": "後巷",
	"room.後院": "後院",
	"room.手術室": "手術室",
	"room.樓梯": "樓梯",
	"room.浴室": "浴室",
	"room.病房": "病房",
	"room.臥室": "臥室",
	"room.藥局": "藥局",
	"room.藥房": "藥房",
	"room.街道": "街道",
	"room.走廊": "走廊",
	"room.車庫": "車庫",
	"room.辦公室": "辦公室",
	"room.電台": "電台"
};
var en = {
	"ui.mute": "Mute",
	"ui.unmute": "Unmute",
	"ui.new": "New survivor",
	"ui.continue": "Continue",
	"ui.tip": "Note",
	"ui.title": "One More Night",
	"ui.ash": "再活一晚",
	"ui.ver": "v0.1 free prototype",
	"ui.coverHint": "Cover: right-click, save, upload to itch Cover image",
	"ui.kitHint": "Shots: right-click each, upload to itch Screenshots",
	"ui.kitOpen": "itch cover and shots",
	"ui.kitClose": "Close",
	"ui.zip": "Download v0.1 ZIP for itch",
	"ui.doc": "Download Suno cue list (Word)",
	"ui.shot.1": "Shot 1 · Title",
	"ui.shot.2": "Shot 2 · Shelter",
	"ui.shot.3": "Shot 3 · People and kit",
	"tip.0": "Mood on the floor means no one leaves. Sleep first.",
	"tip.1": "Flaws buy a living. Insomnia for skill points beats going out empty.",
	"tip.2": "A job is only a start. Ten days in, the skills rewrite the resume.",
	"tip.3": "Don't go alone. Affection grows on the walk back.",
	"tip.4": "Too many kills and the hands shake. Come home. Don't take the night watch.",
	"tip.5": "Cook before you mend walls. Hungry people don't fix doors.",
	"tip.6": "The map is real America. Count the fuel before a far city.",
	"tip.7": "A rescue is not a friend. Don't put a rival on watch.",
	"tip.8": "Malls are loud. If you want to live, use the side door.",
	"tip.9": "Clear a zone before you move. Too few beds is just dying somewhere bigger.",
	"tip.10": "Lovers fight better. If one dies, the other breaks.",
	"tip.11": "Permadeath. When the last one falls, the run is over.",
	"tip.12": "A gun without ammo is a stick. The axe doesn't lie.",
	"tip.13": "Walls are not decoration. Few on watch, and things come through the door.",
	"tip.14": "Clothes are armor. A helmet buys a bite. A pack buys a can. Missions drop kit by rarity.",
	"tip.15": "Plates live in barracks and precincts. Malls sell jackets. The workshop mends what breaks.",
	"ui.back": "Back",
	"ui.random": "Random",
	"ui.next": "Next",
	"ui.enter": "Enter shelter",
	"ui.extract": "Extract",
	"ui.attack": "Attack",
	"ui.talk": "Talk",
	"ui.search": "Search",
	"ui.mission": "Mission",
	"ui.tap": "Tap to start · move left, attack right",
	"ui.overnight": "Sleep",
	"ui.goMission": "Go out",
	"ui.z": "Z",
	"ui.bag": "Bag",
	"ui.wall": "Walls",
	"ui.day": "Day {n}",
	"ui.people": "{n}/{cap}",
	"ui.infected": "Infected",
	"tab.shelter": "Home",
	"tab.roster": "People",
	"tab.build": "Build",
	"tab.map": "Map",
	"create.occ": "Job",
	"create.face": "Face",
	"create.traits": "Traits",
	"create.skills": "Skills",
	"create.shelter": "Shelter",
	"create.occHint": "A job only gives innate skills and a point pool. Traits and the skill menu do the rest.",
	"create.faceHint": "A face is not a job. Pick a look first, then what you used to do.",
	"create.points": "{n} pts",
	"create.innate": "Innate",
	"create.none": "None",
	"create.name": "Name",
	"create.poolHint": "Points left (negatives add, positives cost)",
	"create.pos": "Positive · cost",
	"create.neg": "Negative · gain",
	"create.needPoints": "Not enough points. Take a flaw or drop a perk.",
	"create.skillHint": "Spend leftover points. Combat, cooking, and repairs keep raising skills — cap 10.",
	"create.alloc": "To spend",
	"create.innateN": "innate {n}",
	"create.plusAlloc": " + {n}",
	"create.nextXp": " · next {n} xp",
	"create.shelterHint": "Night one needs a door that locks. A bad pick just dies sooner.",
	"create.cap": "cap {n}",
	"create.noTrait": "no traits",
	"create.overwrite": "A new run overwrites the current save.",
	"hub.noGo": "No one can leave. Mood is on the floor. Sleep first.",
	"hub.bitten": "{n} bitten. Medicine {med} left.",
	"hub.foodLow": "Food for {n} days. Time to go out.",
	"hub.alone": "Just you. There are others out there — not all friends.",
	"hub.alive": "{n} still alive. Walls {wall}.",
	"hub.moodLow": "mood too low",
	"hub.moodNoMission": ", cannot mission.",
	"hub.moodNoSquad": ", cannot join a run.",
	"hub.plan": "Floor plan",
	"hub.jobs": "Today's jobs",
	"hub.log": "Log",
	"hub.lv": "Lv {n}",
	"hub.unbuilt": "—",
	"roster.hint": "People at home run the house. Tap slots to wear kit. Missions drop rarity gear. The workshop mends it.",
	"roster.gone": "Gone",
	"roster.wound": "The bite is hot. Need an infirmary and meds.",
	"roster.noWork": "Mood too low to work. Rest.",
	"build.hint": "Upgrade rooms. Out of lumber, meds, or fuel — go scavenge.",
	"build.max": "Maxed",
	"build.need": "Need",
	"map.hint": "Real US map. Pinch to Kentucky. Tap a pin to run. Clear a site and you can move in.",
	"map.block": "Everyone's mood is too low. Sleep, cook, wait.",
	"map.home": "home",
	"map.cleared": "cleared",
	"map.zombies": "{n} zed",
	"squad.title": "Squad · {n}/3",
	"squad.hint": "Up to three. Running together builds bonds — friends and lovers fight better. Low mood stays home.",
	"squad.walk": "on foot",
	"squad.fuel": "fuel {n}",
	"squad.noGo": "Mood too low to go",
	"squad.enter": "Enter",
	"enc.survivor": "Survivor",
	"enc.mood": "Mood: {m}",
	"enc.grateful": "pleading",
	"enc.wary": "wary",
	"enc.hurt": "hurt",
	"enc.hostile": "hostile",
	"enc.full": "Shelter is full. Upgrade beds or send someone away.",
	"enc.invite": "Take them in",
	"enc.trade": "Trade",
	"enc.turn": "Walk away",
	"enc.fight": "Strike first",
	"occ.can": "Clear to occupy",
	"occ.body": "{en}, {state}. Zeds gone for now. Leave {old}. This place holds {n}.",
	"occ.metro": " Take a metro and this waste has a capital.",
	"occ.move": "Move here",
	"occ.stay": "Keep the old house",
	"end.city": "A city",
	"end.wipe": "Wiped",
	"end.nobody": "No one left",
	"end.stats": "{day} days · {n} held · {dead} lost",
	"end.again": "Live again",
	"end.title": "Title",
	"travel.unknown": "Not discovered",
	"travel.home": "This is home",
	"travel.fuel": "Need fuel {n}",
	"travel.nobody": "No one can leave",
	"travel.mood": "Mood too low to mission",
	"size.outpost": "outpost",
	"size.town": "town",
	"size.city": "city",
	"size.metro": "metro",
	"res.food": "Food",
	"res.water": "Water",
	"res.materials": "Lumber",
	"res.medicine": "Meds",
	"res.ammo": "Ammo",
	"res.fuel": "Fuel",
	"skill.combat": "Combat",
	"skill.stealth": "Stealth",
	"skill.scavenge": "Scavenge",
	"skill.medical": "Medical",
	"skill.build": "Build",
	"skill.farm": "Farm",
	"skill.cook": "Cook",
	"mood.broken": "Broken",
	"mood.despair": "Despair",
	"mood.low": "Low",
	"mood.anxious": "Anxious",
	"mood.steady": "Steady",
	"mood.stable": "Stable",
	"mood.high": "High",
	"rel.lover": "lovers",
	"rel.friend": "friends",
	"rel.known": "known",
	"rel.stranger": "strangers",
	"job.rest": "Rest",
	"job.cook": "Cook",
	"job.farm": "Farm",
	"job.guard": "Watch",
	"job.repair": "Repair",
	"job.tend": "Tend",
	"job.radio": "Radio",
	"job.craft": "Craft",
	"wep.fists": "Fists",
	"wep.knife": "Knife",
	"wep.axe": "Axe",
	"wep.bat": "Bat",
	"wep.pistol": "Pistol",
	"wep.rifle": "Rifle",
	"fac.beds": "Beds",
	"fac.kitchen": "Kitchen",
	"fac.water": "Cistern",
	"fac.workshop": "Shop",
	"fac.infirmary": "Infirmary",
	"fac.garden": "Garden",
	"fac.radio": "Radio",
	"fac.watch": "Tower",
	"fac.beds.blurb": "One more bed, one more life.",
	"fac.kitchen.blurb": "Hot food stretches stores and keeps people.",
	"fac.water.blurb": "Rain off the roof. Without it you walk to the river.",
	"fac.workshop.blurb": "Saws, nails, anything that can be fixed.",
	"fac.infirmary.blurb": "A clean table beats sewing on the floor.",
	"fac.garden.blurb": "Seeds beat bullets. They are just slow.",
	"fac.radio.blurb": "Someone is calling. Someone is lying.",
	"fac.watch.blurb": "See them first.",
	"state.ky": "Kentucky",
	"state.oh": "Ohio",
	"state.in": "Indiana",
	"state.tn": "Tennessee",
	"state.mo": "Missouri",
	"state.il": "Illinois",
	"occ.firefighter": "Firefighter",
	"occ.firefighter.en": "Firefighter",
	"occ.firefighter.blurb": "Walked out of fires. Can walk out of this.",
	"occ.firefighter.desc": "An axe and some stamina. Everything else you spend.",
	"occ.doctor": "Doctor",
	"occ.doctor.en": "Doctor",
	"occ.doctor.blurb": "Someone still knows how to stop the bleeding.",
	"occ.doctor.desc": "Innate medicine. Combat is extra — the hospital is gone, the hands are not.",
	"occ.officer": "Officer",
	"occ.officer.en": "Officer",
	"occ.officer.blurb": "After the shots, law is a magazine.",
	"occ.officer.desc": "Shooting and control. A little stealth. No farming.",
	"occ.chef": "Chef",
	"occ.chef.en": "Chef",
	"occ.chef.blurb": "Whoever can cook a can can keep a house.",
	"occ.chef.desc": "Cooking is innate. You know what is still food.",
	"occ.mechanic": "Mechanic",
	"occ.mechanic.en": "Mechanic",
	"occ.mechanic.blurb": "When it breaks, someone welds it back.",
	"occ.mechanic.desc": "Build and strip. The walls listen to them.",
	"occ.farmer": "Farmer",
	"occ.farmer.en": "Farmer",
	"occ.farmer.blurb": "The land is still there. So are the seeds.",
	"occ.farmer.desc": "Farming and a little cooking. More points — country people come mixed.",
	"occ.veteran": "Veteran",
	"occ.veteran.en": "Veteran",
	"occ.veteran.blurb": "The war did not end. It changed faces.",
	"occ.veteran.desc": "Combat and stealth come high. Few free points.",
	"occ.burglar": "Burglar",
	"occ.burglar.en": "Burglar",
	"occ.burglar.blurb": "Breaking in used to be a crime. Now it is a shift.",
	"occ.burglar.desc": "Stealth and loot. Only you hear the door.",
	"trait.strong": "Strong",
	"trait.strong.blurb": "One more hit in a melee.",
	"trait.quiet": "Light-footed",
	"trait.quiet.blurb": "Walks like a cat.",
	"trait.leader": "Leader",
	"trait.leader.blurb": "People listen.",
	"trait.firstaid": "First aid",
	"trait.firstaid.blurb": "Can wrap a wound. Knows who dies first.",
	"trait.handy": "Handy",
	"trait.handy.blurb": "Nails and boards listen.",
	"trait.brave": "Brave",
	"trait.brave.blurb": "Goes forward. Does not crouch much.",
	"trait.lucky": "Lucky",
	"trait.lucky.blurb": "Always one more thing in the drawer.",
	"trait.fastlearner": "Fast learner",
	"trait.fastlearner.blurb": "Does it once, keeps it. Grows faster.",
	"trait.coward": "Coward",
	"trait.coward.blurb": "Hands shake when they see it.",
	"trait.weak": "Weak",
	"trait.weak.blurb": "A cold can put you down.",
	"trait.insomnia": "Insomnia",
	"trait.insomnia.blurb": "Always listening at the door.",
	"trait.selfish": "Selfish",
	"trait.selfish.blurb": "What is in the pocket may stay there.",
	"trait.clumsy": "Clumsy",
	"trait.clumsy.blurb": "Things rattle. Nails bend.",
	"trait.slowlearner": "Slow",
	"trait.slowlearner.blurb": "Same wound twice. Grows slower.",
	"trait.smoker": "Smoker",
	"trait.smoker.blurb": "No cigarettes, worse temper, worse gut.",
	"trait.pacifist": "Pacifist",
	"trait.pacifist.blurb": "Too much killing turns the stomach.",
	"trait.depressed": "Depressed",
	"trait.depressed.blurb": "Getting up already spent the day.",
	"trait.agoraphobic": "Agoraphobic",
	"trait.agoraphobic.blurb": "Leaving the house is the sentence.",
	"sh.farmhouse": "Muldraugh farmhouse",
	"sh.farmhouse.en": "Muldraugh Farmhouse",
	"sh.farmhouse.desc": "Two stories, boards on the windows, a garden out back. Few zeds. Fewer neighbors.",
	"sh.hardware": "West Point hardware",
	"sh.hardware.en": "West Point Hardware",
	"sh.hardware.desc": "On the main street. A shop already there. Lumber for walls. Windows rattle after dark.",
	"sh.highrise": "Louisville walk-up",
	"sh.highrise.en": "Louisville Walk-up",
	"sh.highrise.desc": "Sixth floor. The tank still holds. Big capacity. Half the block is already eaten.",
	"loc.muldraugh_farm": "Muldraugh farm",
	"loc.westpoint_shop": "West Point hardware",
	"loc.louisville_apt": "Louisville walk-up",
	"loc.rosewood_pd": "Rosewood PD",
	"loc.muldraugh_wh": "Muldraugh depot",
	"loc.riverside_mart": "Riverside mart",
	"loc.westpoint_town": "West Point",
	"loc.march_ridge": "March Ridge",
	"loc.louisville_er": "Louisville General",
	"loc.louisville_mall": "Louisville Mall",
	"loc.fort_knox": "Fort Knox",
	"loc.cincinnati": "Cincinnati",
	"loc.indianapolis": "Indianapolis",
	"loc.nashville": "Nashville",
	"loc.memphis": "Memphis",
	"loc.stlouis": "St. Louis",
	"loc.chicago": "Chicago",
	"room.便利店": "Mart",
	"room.倉庫": "Warehouse",
	"room.停屍間": "Morgue",
	"room.停車場": "Lot",
	"room.儲藏": "Storage",
	"room.公寓廳": "Lobby",
	"room.卸貨": "Loading",
	"room.地下室": "Basement",
	"room.大廳": "Hall",
	"room.客廳": "Living",
	"room.屋頂口": "Roof",
	"room.工具間": "Tools",
	"room.巷弄": "Alley",
	"room.店面": "Shop",
	"room.廁所": "Toilet",
	"room.廚房": "Kitchen",
	"room.後巷": "Back alley",
	"room.後院": "Yard",
	"room.手術室": "OR",
	"room.樓梯": "Stairs",
	"room.浴室": "Bath",
	"room.病房": "Ward",
	"room.臥室": "Bedroom",
	"room.藥局": "Pharmacy",
	"room.藥房": "Dispensary",
	"room.街道": "Street",
	"room.走廊": "Hallway",
	"room.車庫": "Garage",
	"room.辦公室": "Office",
	"room.電台": "Radio"
};
var ja = {
	"ui.mute": "ミュート",
	"ui.unmute": "音声オン",
	"ui.new": "新しい生存",
	"ui.continue": "つづきから",
	"ui.tip": "助言",
	"ui.title": "もう一晩",
	"ui.ash": "One More Night",
	"ui.ver": "v0.1 無料プロトタイプ",
	"ui.coverHint": "カバー：右クリックして保存し、itch の Cover へ",
	"ui.kitHint": "スクショ：各絵を右クリックして itch Screenshots へ",
	"ui.kitOpen": "itch のカバーとスクショ",
	"ui.kitClose": "閉じる",
	"ui.zip": "itch 用 v0.1 ZIP をダウンロード",
	"ui.doc": "Suno 音效リスト（Word）",
	"ui.shot.1": "スクショ 1 · 標題",
	"ui.shot.2": "スクショ 2 · 拠点",
	"ui.shot.3": "スクショ 3 · 人員と装備",
	"tip.0": "情緒が底なら、誰も出られない。まず眠れ。",
	"tip.1": "欠点は生きるための買いもの。不眠で技能点を取る方が、素手で出るより安い。",
	"tip.2": "職業は始まりだけ。十日生きれば、技能が履歴書を書き換える。",
	"tip.3": "一人で出るな。好感は、帰りの道で増える。",
	"tip.4": "殺しすぎると手が震える。戻って湯を飲め。夜番はするな。",
	"tip.5": "壁を直す前に飯を炊け。空腹では扉は直らない。",
	"tip.6": "地図は本物のアメリカだ。遠い街の前に、燃料を数えろ。",
	"tip.7": "助けた相手が友人とは限らない。敵に夜番をさせるな。",
	"tip.8": "モールは物が多い。音も大きい。生きるなら、脇の扉。",
	"tip.9": "掃してから移れ。ベッドが足りなければ、広い場所で餓死するだけだ。",
	"tip.10": "恋人は出撃が鋭い。片方が死ねば、もう片方は折れる。",
	"tip.11": "死は永久だ。最後の一人が倒れたら、その局は終わり。",
	"tip.12": "弾のない銃は棒だ。斧は嘘をつかない。",
	"tip.13": "壁は飾りではない。夜番が少なければ、隙間から入ってくる。",
	"tip.14": "服は装甲だ。ヘルメットは牙を買う。パックは缶を買う。出撃で装備が落ち、稀少度は場所次第。",
	"tip.15": "鋼板は兵営と署にある。モールは上着ばかり。壊れたものは工房で直す。",
	"ui.back": "戻る",
	"ui.random": "ランダム",
	"ui.next": "次へ",
	"ui.enter": "避難所に入る",
	"ui.extract": "撤退",
	"ui.attack": "攻撃",
	"ui.talk": "話す",
	"ui.search": "捜索",
	"ui.mission": "任務",
	"ui.tap": "タップで開始 · 左移動 右攻撃",
	"ui.overnight": "夜を越す",
	"ui.goMission": "出撃",
	"ui.z": "屍",
	"ui.bag": "袋",
	"ui.wall": "防壁",
	"ui.day": "{n}日目",
	"ui.people": "{n}/{cap}人",
	"ui.infected": "感染",
	"tab.shelter": "拠点",
	"tab.roster": "人員",
	"tab.build": "建設",
	"tab.map": "出撃",
	"create.occ": "職業",
	"create.face": "容貌",
	"create.traits": "性格",
	"create.skills": "技能",
	"create.shelter": "拠点",
	"create.occHint": "職業は先天スキルとポイントだけ。あとは性格と技能メニュー。",
	"create.faceHint": "顔と職業は別。先に顔を選び、次の頁で以前の仕事を選ぶ。",
	"create.points": "点数 {n}",
	"create.innate": "先天",
	"create.none": "なし",
	"create.name": "名前",
	"create.poolHint": "残り点数（欠点で増え、利点で減る）",
	"create.pos": "利点 · 消費",
	"create.neg": "欠点 · 加算",
	"create.needPoints": "点数が足りない。欠点を足すか、利点を外す。",
	"create.skillHint": "残りを技能に振る。任務・料理・修繕で伸びる。上限10。",
	"create.alloc": "振り分け",
	"create.innateN": "先天 {n}",
	"create.plusAlloc": " + {n}",
	"create.nextXp": " · 次 {n} xp",
	"create.shelterHint": "最初の夜は、鍵のかかる扉が要る。",
	"create.cap": "定員 {n}",
	"create.noTrait": "性格なし",
	"create.overwrite": "新しいゲームは現在のセーブを上書きします。",
	"hub.noGo": "誰も出られない。情緒が底。まず眠れ。",
	"hub.bitten": "{n}人が噛まれた。薬は{med}。",
	"hub.foodLow": "食料は{n}日分。出る時だ。",
	"hub.alone": "一人だ。外にはまだ人がいる——友とは限らない。",
	"hub.alive": "{n}人が生きている。防壁 {wall}。",
	"hub.moodLow": "情緒低下",
	"hub.moodNoMission": "、出撃不可。",
	"hub.moodNoSquad": "、編成不可。",
	"hub.plan": "平面図",
	"hub.jobs": "今日の仕事",
	"hub.log": "日誌",
	"hub.lv": "{n}級",
	"hub.unbuilt": "未建設",
	"roster.hint": "残った者が家を回す。部位を押して装備。出撃で稀少度つきの装備が落ちる。工房で直す。",
	"roster.gone": "故人",
	"roster.wound": "傷が熱い。医務室と薬が要る。",
	"roster.noWork": "情緒が低く働けない。休め。",
	"build.hint": "部屋を強化。木材・薬・燃料が尽きたら漁りに出る。",
	"build.max": "最大",
	"build.need": "必要",
	"map.hint": "実在のアメリカ地図。ケンタッキーへピンチ。地点をタップして出撃。全滅させれば移住できる。",
	"map.block": "全員の情緒が低い。眠れ、炊け、待て。",
	"map.home": "現在の家",
	"map.cleared": "掃討済",
	"map.zombies": "屍 {n}",
	"squad.title": "編成 · {n}/3",
	"squad.hint": "最大三人。同行で絆が深まる。友人と恋人は強い。情緒が低い者は出られない。",
	"squad.walk": "徒歩",
	"squad.fuel": "燃料 {n}",
	"squad.noGo": "情緒が低く出撃不可",
	"squad.enter": "現場へ",
	"enc.survivor": "生存者",
	"enc.mood": "態度：{m}",
	"enc.grateful": "助けを求める",
	"enc.wary": "警戒",
	"enc.hurt": "負傷",
	"enc.hostile": "敵対",
	"enc.full": "満員。寝室を上げるか、誰かを出せ。",
	"enc.invite": "連れて帰る",
	"enc.trade": "取引",
	"enc.turn": "通り過ぎる",
	"enc.fight": "先に手を出す",
	"occ.can": "占領可能",
	"occ.body": "{en}、{state}。屍は一時的に消えた。{old}を離れ、ここは{n}人まで。",
	"occ.metro": " 大都市を取れば、この廃土に首都ができる。",
	"occ.move": "ここへ移る",
	"occ.stay": "旧宅へ戻る",
	"end.city": "一つの街",
	"end.wipe": "全滅",
	"end.nobody": "誰もいない",
	"end.stats": "{day}日生存 · {n}箇所占領 · {dead}人喪失",
	"end.again": "もう一度生きる",
	"end.title": "タイトル",
	"travel.unknown": "未発見",
	"travel.home": "ここが家",
	"travel.fuel": "燃料が{n}必要",
	"travel.nobody": "出られる者がいない",
	"travel.mood": "全員の情緒が低く出撃不可",
	"size.outpost": "拠点",
	"size.town": "町",
	"size.city": "都市",
	"size.metro": "大都市",
	"res.food": "食料",
	"res.water": "水",
	"res.materials": "建材",
	"res.medicine": "薬品",
	"res.ammo": "弾薬",
	"res.fuel": "燃料",
	"skill.combat": "戦闘",
	"skill.stealth": "隠密",
	"skill.scavenge": "漁り",
	"skill.medical": "医療",
	"skill.build": "建設",
	"skill.farm": "農耕",
	"skill.cook": "料理",
	"mood.broken": "崩壊",
	"mood.despair": "絶望",
	"mood.low": "落ち込み",
	"mood.anxious": "不安",
	"mood.steady": "安定",
	"mood.stable": "落ち着き",
	"mood.high": "高揚",
	"rel.lover": "恋人",
	"rel.friend": "友人",
	"rel.known": "知人",
	"rel.stranger": "他人",
	"job.rest": "休息",
	"job.cook": "炊事",
	"job.farm": "耕作",
	"job.guard": "警戒",
	"job.repair": "修繕",
	"job.tend": "看護",
	"job.radio": "傍受",
	"job.craft": "工作",
	"wep.fists": "素手",
	"wep.knife": "ナイフ",
	"wep.axe": "斧",
	"wep.bat": "バット",
	"wep.pistol": "拳銃",
	"wep.rifle": "ライフル",
	"fac.beds": "寝室",
	"fac.kitchen": "台所",
	"fac.water": "貯水",
	"fac.workshop": "工房",
	"fac.infirmary": "医務室",
	"fac.garden": "菜園",
	"fac.radio": "無線",
	"fac.watch": "見張り台",
	"fac.beds.blurb": "ベッドが一つ増えれば、一人増やせる。",
	"fac.kitchen.blurb": "温かい食事は備蓄を延ばし、人を残す。",
	"fac.water.blurb": "屋根の雨。無ければ川まで歩く。",
	"fac.workshop.blurb": "鋸も釘も、直せるものはここ。",
	"fac.infirmary.blurb": "清潔な机は床で縫うよりまし。",
	"fac.garden.blurb": "種は弾丸より高い。ただ遅い。",
	"fac.radio.blurb": "誰かが助けを呼ぶ。誰かが罠を置く。",
	"fac.watch.blurb": "先に見ろ。",
	"state.ky": "ケンタッキー",
	"state.oh": "オハイオ",
	"state.in": "インディアナ",
	"state.tn": "テネシー",
	"state.mo": "ミズーリ",
	"state.il": "イリノイ",
	"occ.firefighter": "消防士",
	"occ.firefighter.en": "Firefighter",
	"occ.firefighter.blurb": "火から出てきた人間は、終末にも耐える。",
	"occ.firefighter.desc": "斧の感触と体力。あとは自分で振る。",
	"occ.doctor": "医師",
	"occ.doctor.en": "Doctor",
	"occ.doctor.blurb": "血を止める人間がまだいる。",
	"occ.doctor.desc": "医療は先天。戦闘は別——病院は消えたが、手は残っている。",
	"occ.officer": "警官",
	"occ.officer.en": "Officer",
	"occ.officer.blurb": "銃声のあと、法は弾倉だけ。",
	"occ.officer.desc": "射撃と制圧。隠密は少し。農業はゼロ。",
	"occ.chef": "料理人",
	"occ.chef.en": "Chef",
	"occ.chef.blurb": "缶を温かい食事にできる者が、人を残す。",
	"occ.chef.desc": "料理は先天。まだ食えるものがわかる。",
	"occ.mechanic": "整備士",
	"occ.mechanic.en": "Mechanic",
	"occ.mechanic.blurb": "壊れれば、溶接して戻す。",
	"occ.mechanic.desc": "建設と分解。防壁は彼の言うことを聞く。",
	"occ.farmer": "農夫",
	"occ.farmer.en": "Farmer",
	"occ.farmer.blurb": "土地は残っている。種も。",
	"occ.farmer.desc": "農耕と少しの料理。点数は多め——田舎で生き残った者は雑だ。",
	"occ.veteran": "退役軍人",
	"occ.veteran.en": "Veteran",
	"occ.veteran.blurb": "戦争は終わっていない。敵が変わっただけ。",
	"occ.veteran.desc": "戦闘と隠密が高い。自由点は少ない。",
	"occ.burglar": "空き巣",
	"occ.burglar.en": "Burglar",
	"occ.burglar.blurb": "他人の家に入るのは罪だった。今はシフトだ。",
	"occ.burglar.desc": "隠密と漁り。扉の音は自分だけが聞く。",
	"trait.strong": "頑丈",
	"trait.strong.blurb": "近接に余裕が一つ。",
	"trait.quiet": "静歩",
	"trait.quiet.blurb": "猫のように歩く。",
	"trait.leader": "統率",
	"trait.leader.blurb": "人が聞く。",
	"trait.firstaid": "応急",
	"trait.firstaid.blurb": "包帯を巻ける。誰が先に死ぬかもわかる。",
	"trait.handy": "器用",
	"trait.handy.blurb": "釘と板が従う。",
	"trait.brave": "不屈",
	"trait.brave.blurb": "前に出る。あまり屈まない。",
	"trait.lucky": "幸運",
	"trait.lucky.blurb": "引き出しにいつももう一つ。",
	"trait.fastlearner": "聡い",
	"trait.fastlearner.blurb": "一度で覚える。成長が速い。",
	"trait.coward": "屍嫌い",
	"trait.coward.blurb": "見ると手が震える。",
	"trait.weak": "虚弱",
	"trait.weak.blurb": "風邪一つで倒れる。",
	"trait.insomnia": "不眠",
	"trait.insomnia.blurb": "夜も扉の向こうを聞いている。",
	"trait.selfish": "利己",
	"trait.selfish.blurb": "ポケットのものは、出さないこともある。",
	"trait.clumsy": "不器用",
	"trait.clumsy.blurb": "物が鳴る。釘が曲がる。",
	"trait.slowlearner": "鈍い",
	"trait.slowlearner.blurb": "同じ傷を二度。成長が遅い。",
	"trait.smoker": "煙草",
	"trait.smoker.blurb": "無いと、気性と腹が同時に壊れる。",
	"trait.pacifist": "厭戦",
	"trait.pacifist.blurb": "殺しすぎると吐き気がする。",
	"trait.depressed": "抑鬱",
	"trait.depressed.blurb": "起きるだけで一日が終わる。",
	"trait.agoraphobic": "広場恐怖",
	"trait.agoraphobic.blurb": "出ること自体が刑。",
	"sh.farmhouse": "マルドロー農舎",
	"sh.farmhouse.en": "Muldraugh Farmhouse",
	"sh.farmhouse.desc": "窓を板で塞いだ二階建ての農舎。裏庭で耕せる。屍は少なく、隣人はもっと少ない。",
	"sh.hardware": "ウエストポイント金物",
	"sh.hardware.en": "West Point Hardware",
	"sh.hardware.desc": "本通りの金物屋。工房は既にある。夜になるとショーウィンドウが鳴る。",
	"sh.highrise": "ルイビル屋上階",
	"sh.highrise.en": "Louisville Walk-up",
	"sh.highrise.desc": "六階。水槽はまだ持つ。定員は多い。街区の半分は既に食われた。",
	"loc.muldraugh_farm": "マルドロー農舎",
	"loc.westpoint_shop": "ウエストポイント金物",
	"loc.louisville_apt": "ルイビル屋上階",
	"loc.rosewood_pd": "ローズウッド署",
	"loc.muldraugh_wh": "マルドロー倉庫",
	"loc.riverside_mart": "リバーサイド商店",
	"loc.westpoint_town": "ウエストポイント市街",
	"loc.march_ridge": "マーチリッジ",
	"loc.louisville_er": "ルイビル病院",
	"loc.louisville_mall": "ルイビルモール",
	"loc.fort_knox": "フォートノックス",
	"loc.cincinnati": "シンシナティ",
	"loc.indianapolis": "インディアナポリス",
	"loc.nashville": "ナッシュビル",
	"loc.memphis": "メンフィス",
	"loc.stlouis": "セントルイス",
	"loc.chicago": "シカゴ",
	"room.便利店": "コンビニ",
	"room.倉庫": "倉庫",
	"room.停屍間": "霊安室",
	"room.停車場": "駐車場",
	"room.儲藏": "保管",
	"room.公寓廳": "ロビー",
	"room.卸貨": "荷下ろし",
	"room.地下室": "地下室",
	"room.大廳": "ホール",
	"room.客廳": "居間",
	"room.屋頂口": "屋上口",
	"room.工具間": "工具室",
	"room.巷弄": "路地",
	"room.店面": "店先",
	"room.廁所": "トイレ",
	"room.廚房": "台所",
	"room.後巷": "裏路地",
	"room.後院": "裏庭",
	"room.手術室": "手術室",
	"room.樓梯": "階段",
	"room.浴室": "浴室",
	"room.病房": "病室",
	"room.臥室": "寝室",
	"room.藥局": "薬局",
	"room.藥房": "調剤",
	"room.街道": "通り",
	"room.走廊": "廊下",
	"room.車庫": "車庫",
	"room.辦公室": "事務所",
	"room.電台": "無線室"
};
var ko = {
	"ui.mute": "음소거",
	"ui.unmute": "소리 켜기",
	"ui.new": "새로운 생존",
	"ui.continue": "이어하기",
	"ui.tip": "조언",
	"ui.title": "하룻밤 더",
	"ui.ash": "One More Night",
	"ui.ver": "v0.1 무료 프로토타입",
	"ui.coverHint": "커버: 오른쪽 클릭 저장 후 itch Cover 에 올리기",
	"ui.kitHint": "스크린샷: 각 그림을 저장해 itch Screenshots 에",
	"ui.kitOpen": "itch 커버와 스크린샷",
	"ui.kitClose": "닫기",
	"ui.zip": "itch 용 v0.1 ZIP 다운로드",
	"ui.doc": "Suno 효과음 목록 (Word)",
	"ui.shot.1": "샷 1 · 타이틀",
	"ui.shot.2": "샷 2 · 거점",
	"ui.shot.3": "샷 3 · 인원과 장비",
	"tip.0": "정서가 바닥이면 아무도 못 나간다. 먼저 자라.",
	"tip.1": "단점은 목숨을 사는 값이다. 불면증으로 기술 점을 사는 편이, 빈손으로 나가는 것보다 싸다.",
	"tip.2": "직업은 시작일 뿐이다. 열흘 살면 기술이 이력을 다시 쓴다.",
	"tip.3": "혼자 나가지 마라. 호감은 돌아오는 길에 는다.",
	"tip.4": "너무 많이 죽이면 손이 떤다. 돌아와서 따뜻한 물을 마셔라. 야간 당번은 맡지 마라.",
	"tip.5": "벽을 고치기 전에 밥을 해라. 빈속으로 문은 안 고쳐진다.",
	"tip.6": "지도는 진짜 미국이다. 먼 도시 전에 연료부터 세라.",
	"tip.7": "구해 온 사람이 친구는 아니다. 적대적인 자에겐 야간을 맡기지 마라.",
	"tip.8": "쇼핑몰은 물건이 많다. 소리도 크다. 살려면 옆문.",
	"tip.9": "쓸고 나서 옮겨라. 침대가 부족하면 더 넓은 곳에서 굶어 죽을 뿐이다.",
	"tip.10": "연인은 출격이 정확하다. 한쪽이 죽으면 다른 쪽은 무너진다.",
	"tip.11": "죽음은 영구적이다. 마지막 한 명이 쓰러지면 그 판은 끝이다.",
	"tip.12": "탄 없는 총은 막대기다. 도끼는 거짓말하지 않는다.",
	"tip.13": "벽은 장식이 아니다. 야간이 적으면 문틈으로 들어온다.",
	"tip.14": "옷은 갑옷이다. 헬멧은 이빨을 산다. 배낭은 통조림을 산다. 출격에서 장비가 떨어지고 희귀도는 장소 따라.",
	"tip.15": "철판은 병영과 서에 있다. 몰에는 재킷뿐이다. 부서진 것은 공방에서 고친다.",
	"ui.back": "뒤로",
	"ui.random": "무작위",
	"ui.next": "다음",
	"ui.enter": "대피소 입장",
	"ui.extract": "철수",
	"ui.attack": "공격",
	"ui.talk": "대화",
	"ui.search": "수색",
	"ui.mission": "임무",
	"ui.tap": "탭해서 시작 · 왼손 이동 오른손 공격",
	"ui.overnight": "밤 넘기기",
	"ui.goMission": "출격",
	"ui.z": "좀",
	"ui.bag": "가방",
	"ui.wall": "방벽",
	"ui.day": "{n}일차",
	"ui.people": "{n}/{cap}명",
	"ui.infected": "감염",
	"tab.shelter": "거점",
	"tab.roster": "인원",
	"tab.build": "건설",
	"tab.map": "출격",
	"create.occ": "직업",
	"create.face": "외모",
	"create.traits": "성격",
	"create.skills": "기술",
	"create.shelter": "거점",
	"create.occHint": "직업은 선천 기술과 점수뿐이다. 나머지는 성격과 기술 메뉴.",
	"create.faceHint": "얼굴과 직업은 별개다. 먼저 얼굴을 고르고, 다음에서 직업을 고른다.",
	"create.points": "점수 {n}",
	"create.innate": "선천",
	"create.none": "없음",
	"create.name": "이름",
	"create.poolHint": "남은 점수 (단점 증가, 장점 소모)",
	"create.pos": "장점 · 소모",
	"create.neg": "단점 · 획득",
	"create.needPoints": "점수가 부족하다. 단점을 더하거나 장점을 빼라.",
	"create.skillHint": "남은 점수를 기술에 투자. 임무·요리·수리가 계속 키운다. 상한 10.",
	"create.alloc": "배분",
	"create.innateN": "선천 {n}",
	"create.plusAlloc": " + {n}",
	"create.nextXp": " · 다음 {n} xp",
	"create.shelterHint": "첫날 밤은 잠기는 문이 필요하다.",
	"create.cap": "수용 {n}",
	"create.noTrait": "성격 없음",
	"create.overwrite": "새 게임은 현재 저장을 덮어씁니다.",
	"hub.noGo": "나갈 사람이 없다. 정서가 바닥이다. 먼저 자라.",
	"hub.bitten": "{n}명이 물렸다. 약 {med} 남음.",
	"hub.foodLow": "식량 {n}일분. 나갈 때다.",
	"hub.alone": "너 하나다. 밖에도 사람이 있다 — 친구는 아니다.",
	"hub.alive": "{n}명이 살아 있다. 방벽 {wall}.",
	"hub.moodLow": "정서 저하",
	"hub.moodNoMission": ", 출격 불가.",
	"hub.moodNoSquad": ", 편성 불가.",
	"hub.plan": "평면도",
	"hub.jobs": "오늘 업무",
	"hub.log": "일지",
	"hub.lv": "{n}레벨",
	"hub.unbuilt": "미건설",
	"roster.hint": "남은 사람이 집을 돌린다. 부위를 눌러 장비를 입는다. 출격에서 희귀 장비가 떨어진다. 공방에서 고친다.",
	"roster.gone": "고인",
	"roster.wound": "상처가 뜨겁다. 의무실과 약이 필요하다.",
	"roster.noWork": "정서가 낮아 일할 수 없다. 쉬어라.",
	"build.hint": "방을 업그레이드. 목재·약·연료가 떨어지면 나가 찾아라.",
	"build.max": "최대",
	"build.need": "필요",
	"map.hint": "실제 미국 지도. 켄터키로 핀치. 지점을 눌러 출격. 좀비를 쓸면 이사할 수 있다.",
	"map.block": "전원 정서가 낮다. 자고, 요리하고, 기다려라.",
	"map.home": "현재 집",
	"map.cleared": "소탕됨",
	"map.zombies": "좀비 {n}",
	"squad.title": "편성 · {n}/3",
	"squad.hint": "최대 셋. 같이 나가면 유대가 쌓인다. 친구와 연인은 더 강하다. 정서가 낮은 사람은 못 나간다.",
	"squad.walk": "도보",
	"squad.fuel": "연료 {n}",
	"squad.noGo": "정서가 낮아 출격 불가",
	"squad.enter": "현장 진입",
	"enc.survivor": "생존자",
	"enc.mood": "태도: {m}",
	"enc.grateful": "구원 요청",
	"enc.wary": "경계",
	"enc.hurt": "부상",
	"enc.hostile": "적대",
	"enc.full": "만원. 침실을 올리거나 누군가를 내보내라.",
	"enc.invite": "데려간다",
	"enc.trade": "거래",
	"enc.turn": "지나친다",
	"enc.fight": "먼저 친다",
	"occ.can": "점령 가능",
	"occ.body": "{en}, {state}. 좀비는 잠시 사라졌다. {old}를 떠나 여기 {n}명까지.",
	"occ.metro": " 대도시를 점령하면 이 폐허에 수도가 생긴다.",
	"occ.move": "여기로 옮긴다",
	"occ.stay": "옛집으로",
	"end.city": "하나의 도시",
	"end.wipe": "전멸",
	"end.nobody": "아무도 없다",
	"end.stats": "{day}일 생존 · {n}곳 점령 · {dead}명 상실",
	"end.again": "다시 산다",
	"end.title": "타이틀",
	"travel.unknown": "미발견",
	"travel.home": "여기가 집",
	"travel.fuel": "연료 {n} 필요",
	"travel.nobody": "나갈 사람이 없다",
	"travel.mood": "전원 정서가 낮아 출격 불가",
	"size.outpost": "거점",
	"size.town": "마을",
	"size.city": "도시",
	"size.metro": "대도시",
	"res.food": "식량",
	"res.water": "물",
	"res.materials": "자재",
	"res.medicine": "약품",
	"res.ammo": "탄약",
	"res.fuel": "연료",
	"skill.combat": "전투",
	"skill.stealth": "은밀",
	"skill.scavenge": "수색",
	"skill.medical": "의료",
	"skill.build": "건설",
	"skill.farm": "농사",
	"skill.cook": "요리",
	"mood.broken": "붕괴",
	"mood.despair": "절망",
	"mood.low": "저하",
	"mood.anxious": "불안",
	"mood.steady": "안정",
	"mood.stable": "평온",
	"mood.high": "고양",
	"rel.lover": "연인",
	"rel.friend": "친구",
	"rel.known": "아는 사이",
	"rel.stranger": "남",
	"job.rest": "휴식",
	"job.cook": "취사",
	"job.farm": "경작",
	"job.guard": "경계",
	"job.repair": "보수",
	"job.tend": "간호",
	"job.radio": "청취",
	"job.craft": "제작",
	"wep.fists": "맨손",
	"wep.knife": "칼",
	"wep.axe": "도끼",
	"wep.bat": "방망이",
	"wep.pistol": "권총",
	"wep.rifle": "소총",
	"fac.beds": "침실",
	"fac.kitchen": "주방",
	"fac.water": "집수",
	"fac.workshop": "공방",
	"fac.infirmary": "의무실",
	"fac.garden": "텃밭",
	"fac.radio": "무전",
	"fac.watch": "감시탑",
	"fac.beds.blurb": "침대가 하나 늘면 사람도 하나 늘 수 있다.",
	"fac.kitchen.blurb": "따뜻한 식사는 비축을 늘리고 사람을 남긴다.",
	"fac.water.blurb": "지붕의 비. 없으면 강까지 걷는다.",
	"fac.workshop.blurb": "톱과 못, 고칠 수 있는 것은 여기.",
	"fac.infirmary.blurb": "깨끗한 탁자가 바닥에서 꿰매는 것보다 낫다.",
	"fac.garden.blurb": "씨앗이 총알보다 비싸다. 다만 느리다.",
	"fac.radio.blurb": "누군가 구조를 부른다. 누군가 함정을 깐다.",
	"fac.watch.blurb": "먼저 봐라.",
	"state.ky": "켄터키",
	"state.oh": "오하이오",
	"state.in": "인디애나",
	"state.tn": "테네시",
	"state.mo": "미주리",
	"state.il": "일리노이",
	"occ.firefighter": "소방관",
	"occ.firefighter.en": "Firefighter",
	"occ.firefighter.blurb": "불에서 나온 사람은 종말도 버틴다.",
	"occ.firefighter.desc": "도끼 감각과 체력. 나머지는 직접 찍는다.",
	"occ.doctor": "의사",
	"occ.doctor.en": "Doctor",
	"occ.doctor.blurb": "아직 피를 멈출 줄 아는 사람이 있다.",
	"occ.doctor.desc": "의료는 선천. 전투는 따로 — 병원은 없어도 손은 있다.",
	"occ.officer": "경찰",
	"occ.officer.en": "Officer",
	"occ.officer.blurb": "총성 이후, 법은 탄창뿐이다.",
	"occ.officer.desc": "사격과 제압. 은밀은 조금. 농사는 없다.",
	"occ.chef": "요리사",
	"occ.chef.en": "Chef",
	"occ.chef.blurb": "캔을 따뜻한 밥으로 만들 수 있는 사람이 남을 붙잡는다.",
	"occ.chef.desc": "요리는 선천. 아직 먹을 수 있는 것을 안다.",
	"occ.mechanic": "정비공",
	"occ.mechanic.en": "Mechanic",
	"occ.mechanic.blurb": "고장 나면 용접해서 되돌린다.",
	"occ.mechanic.desc": "건설과 분해. 방벽은 그의 말을 듣는다.",
	"occ.farmer": "농부",
	"occ.farmer.en": "Farmer",
	"occ.farmer.blurb": "땅은 남았다. 씨앗도.",
	"occ.farmer.desc": "농사와 약간의 요리. 점수가 많다 — 시골에서 살아남은 사람은 잡다하다.",
	"occ.veteran": "퇴역군인",
	"occ.veteran.en": "Veteran",
	"occ.veteran.blurb": "전쟁은 안 끝났다. 적만 바뀌었다.",
	"occ.veteran.desc": "전투와 은밀이 높다. 자유 점수는 적다.",
	"occ.burglar": "도둑",
	"occ.burglar.en": "Burglar",
	"occ.burglar.blurb": "남의 집에 드는 일은 죄였다. 지금은 근무다.",
	"occ.burglar.desc": "은밀과 수색. 문 소리는 너만 듣는다.",
	"trait.strong": "강인",
	"trait.strong.blurb": "근접에 여유가 하나.",
	"trait.quiet": "가벼운 발",
	"trait.quiet.blurb": "고양이처럼 걷는다.",
	"trait.leader": "리더",
	"trait.leader.blurb": "사람들이 듣는다.",
	"trait.firstaid": "응급",
	"trait.firstaid.blurb": "붕대를 감을 줄 안다. 누가 먼저 죽는지도.",
	"trait.handy": "손재주",
	"trait.handy.blurb": "못과 널빤지가 따른다.",
	"trait.brave": "대담",
	"trait.brave.blurb": "앞으로 간다. 잘 웅크리지 않는다.",
	"trait.lucky": "행운",
	"trait.lucky.blurb": "서랍에 늘 하나가 더 있다.",
	"trait.fastlearner": "습득",
	"trait.fastlearner.blurb": "한 번에 기억한다. 성장이 빠르다.",
	"trait.coward": "좀비 공포",
	"trait.coward.blurb": "보면 손이 떤다.",
	"trait.weak": "허약",
	"trait.weak.blurb": "감기 하나로 쓰러진다.",
	"trait.insomnia": "불면증",
	"trait.insomnia.blurb": "밤에도 문 밖을 듣는다.",
	"trait.selfish": "이기",
	"trait.selfish.blurb": "주머니의 것은 안 꺼낼 수도 있다.",
	"trait.clumsy": "서투름",
	"trait.clumsy.blurb": "물건이 울린다. 못이 휜다.",
	"trait.slowlearner": "둔함",
	"trait.slowlearner.blurb": "같은 상처를 두 번. 성장이 느리다.",
	"trait.smoker": "흡연",
	"trait.smoker.blurb": "담배 없으면 성질과 속이 같이 망가진다.",
	"trait.pacifist": "반전",
	"trait.pacifist.blurb": "너무 죽이면 속이 메스껍다.",
	"trait.depressed": "우울",
	"trait.depressed.blurb": "일어나는 것만으로 하루가 간다.",
	"trait.agoraphobic": "광장공포",
	"trait.agoraphobic.blurb": "나가는 일 자체가 형벌이다.",
	"sh.farmhouse": "멀드로 농가",
	"sh.farmhouse.en": "Muldraugh Farmhouse",
	"sh.farmhouse.desc": "창문에 널빤지를 댄 이층 농가. 뒷마당에서 농사. 좀비는 적고 이웃은 더 적다.",
	"sh.hardware": "웨스트포인트 철물",
	"sh.hardware.en": "West Point Hardware",
	"sh.hardware.desc": "메인스트리트 철물점. 공방은 이미 있다. 밤이면 쇼윈도가 운다.",
	"sh.highrise": "루이빌 옥상층",
	"sh.highrise.en": "Louisville Walk-up",
	"sh.highrise.desc": "6층. 물탱크는 아직 버틴다. 수용이 크다. 블록 절반은 이미 먹혔다.",
	"loc.muldraugh_farm": "멀드로 농가",
	"loc.westpoint_shop": "웨스트포인트 철물",
	"loc.louisville_apt": "루이빌 옥상층",
	"loc.rosewood_pd": "로즈우드 경찰서",
	"loc.muldraugh_wh": "멀드로 창고",
	"loc.riverside_mart": "리버사이드 상점",
	"loc.westpoint_town": "웨스트포인트 시내",
	"loc.march_ridge": "마치 리지",
	"loc.louisville_er": "루이빌 병원",
	"loc.louisville_mall": "루이빌 몰",
	"loc.fort_knox": "포트녹스",
	"loc.cincinnati": "신시내티",
	"loc.indianapolis": "인디애나폴리스",
	"loc.nashville": "내슈빌",
	"loc.memphis": "멤피스",
	"loc.stlouis": "세인트루이스",
	"loc.chicago": "시카고",
	"room.便利店": "편의점",
	"room.倉庫": "창고",
	"room.停屍間": "안치실",
	"room.停車場": "주차장",
	"room.儲藏": "보관",
	"room.公寓廳": "로비",
	"room.卸貨": "하역",
	"room.地下室": "지하",
	"room.大廳": "홀",
	"room.客廳": "거실",
	"room.屋頂口": "옥상",
	"room.工具間": "공구실",
	"room.巷弄": "골목",
	"room.店面": "가게",
	"room.廁所": "화장실",
	"room.廚房": "주방",
	"room.後巷": "뒷골목",
	"room.後院": "마당",
	"room.手術室": "수술실",
	"room.樓梯": "계단",
	"room.浴室": "욕실",
	"room.病房": "병실",
	"room.臥室": "침실",
	"room.藥局": "약국",
	"room.藥房": "약방",
	"room.街道": "거리",
	"room.走廊": "복도",
	"room.車庫": "차고",
	"room.辦公室": "사무실",
	"room.電台": "무전실"
};
var extraZh = {
	"ui.noise": "噪音",
	"ui.region": "肯塔基 — 中西部",
	"crash.title": "這晚出事了",
	"crash.body": "畫面斷過一次。進度還在這台裝置上。",
	"crash.resume": "回到據點",
	"ui.anon": "無名",
	"stance.leader": "隊長",
	"stance.friend": "同伴",
	"stance.neutral": "中立",
	"stance.rival": "不穩",
	"stance.hostile": "敵對",
	"map.live": "實境地圖 · 可縮放拖曳",
	"map.homeShort": "家",
	"map.open": "未清",
	"roster.job": "工作",
	"roster.kick": "請離",
	"roster.moodNeed": "（情緒不足）",
	"build.cost": "{res} {n}",
	"sh.farmhouse.blurb": "肯塔基鄉下。安靜，但離補給遠。",
	"sh.hardware.blurb": "工具齊，街上不安靜。",
	"sh.highrise.blurb": "城裡視野好，下樓就要付錢。",
	"fac.beds.effect": "容量 +1",
	"fac.kitchen.effect": "食物消耗降低",
	"fac.water.effect": "每日產水",
	"fac.workshop.effect": "建造與圍牆",
	"fac.infirmary.effect": "治療與清感染",
	"fac.garden.effect": "每日產糧",
	"fac.radio.effect": "發現地點／倖存者",
	"fac.watch.effect": "降低夜襲",
	"toast.lead": "{name}接過隊伍",
	"toast.loot": "搜到 {bits}",
	"toast.empty": "幾乎是空的",
	"death.torn": "在任務中被撕開",
	"death.survivor": "被其他倖存者襲擊",
	"death.firefight": "與敵對倖存者交火",
	"death.raid": "夜襲",
	"death.infect": "感染發作",
	"death.starve": "脫水與飢餓",
	"death.wound": "傷勢惡化",
	"death.kick": "被請離隊伍，從此失蹤",
	"end.loseBody": "第 {day} 天，最後一個倖存者也沒回來。美國還在，只是沒有人記得你們。",
	"end.winBody": "第 {day} 天，你們把{loc}從廢土裡挖出來。美國還是廢墟，但這座城現在有燈。",
	"enc.body.grateful": "{name}從暗處走出來，雙手空著。「我跟了你們一路。別開槍。我能幫忙——煮飯、守夜、什麼都好。」",
	"enc.body.wary": "{name}用一根鐵管指著門口。「東西是我先看到的。你們要過，拿換的來。」眼神很活，不像被咬過。",
	"enc.body.hostile": "暗處有上膛聲。{name}（{occ}）已經把你們當入侵者。「放下袋子。走。或留下。」",
	"enc.body.hurt": "{name}靠在牆邊，小腿滲血，還醒著。「別留下我。求你們。我以前是{occ}。」",
	"log.settle": "{name}（{occ}）在{place}落腳。外頭的美國已經不是原來那張地圖。",
	"log.noMoodGo": "沒有人的情緒撐得出門。先休息。",
	"log.depart": "{names}出發前往{loc}（{state}）。",
	"log.died": "{name}死了。{cause}",
	"log.grief": "同伴的死壓在剩下的人身上。",
	"log.bitten": "{name}被咬到了。傷口不乾淨。",
	"log.wipe": "外出小隊全軍覆沒。{loc}把人吞了。",
	"log.fight": "{name}在{zone}戰鬥，消滅 {n} 隻。",
	"log.bond": "{a}與{b}成了{rel}。一起活過的夜，比誓言硬。",
	"log.return": "小隊從{loc}回來。{bag}",
	"log.emptyBag": "兩手空空。",
	"log.brought": "帶回 {bag}。",
	"log.fail": "任務失敗。{loc}把人與袋子一起吞了。",
	"log.tooManyKills": "殺得太多。手上的味道洗不掉。",
	"log.clear": "{loc}暫時清場。可以搬過來，把這裡變成更大的家。",
	"log.full": "{name}想加入，但庇護所已滿。",
	"log.betray": "{name}假裝答應，然後動手。",
	"log.join": "{name}（{occ}）加入了你們。",
	"log.leave": "你們讓{name}離開。",
	"log.firefight": "與{name}交火。對方倒在{zone}。",
	"log.move": "撤離{old}，佔領{loc}（{state}）。新家能住 {n} 人。",
	"log.noWork": "{name}情緒過低，無法上工。先讓他休息。",
	"log.kick": "你們讓{name}離開。門在後面關上。",
	"log.upgrade": "{fac}升到 {n} 級。",
	"log.lieDown": "{name}情緒過低，今晚只能躺著。",
	"log.nightDeath": "{name}在夜裡死去。{cause}。",
	"log.skillUp": "{name}的手藝又熟了一點。",
	"log.clearedInfect": "{who}清掉了{name}的感染。",
	"log.radioLoc": "無線電收到雜訊……{loc}（{state}）的位置被標了下來。",
	"log.radioPerson": "一個聲音從廢頻裡走來：{name}找到了你們的門。",
	"log.raid": "夜襲。東西從圍牆縫裡擠進來。",
	"log.hungry": "存糧不夠。有人空著肚子睡。情緒往下掉。",
	"log.thirsty": "水不夠。喉嚨在夜裡發乾。",
	"log.harvest": "菜園與廚房產出食物 {n}。",
	"gear.stash": "倉庫",
	"gear.stashEmpty": "倉庫是空的。出征搜刮才會掉裝備。",
	"gear.equip": "穿上",
	"gear.unequip": "卸下",
	"gear.none": "無",
	"gear.bare": "這格是空的。",
	"gear.emptySlot": "倉庫沒有這部位的東西。",
	"gear.bag": "裝備 {n}",
	"gear.slot.weapon": "武器",
	"gear.slot.head": "頭",
	"gear.slot.body": "身",
	"gear.slot.hands": "手",
	"gear.slot.legs": "腿",
	"gear.slot.feet": "腳",
	"gear.slot.back": "背",
	"gear.rarity.common": "普通",
	"gear.rarity.uncommon": "精良",
	"gear.rarity.rare": "稀有",
	"gear.rarity.epic": "史詩",
	"gear.rarity.legendary": "傳說",
	"log.gear": "帶回裝備 {n}：{bits}",
	"log.repair": "{name}在工坊修了裝備。",
	"roster.gear": "裝備",
	"loc.muldraugh_farm.blurb": "起始農舍。後院、穀倉、泥路。",
	"loc.muldraugh_farm.desc": "你們的第一個家。穀倉裡還有種子，路上偶爾有遊蕩的。",
	"loc.westpoint_shop.blurb": "主街五金行。",
	"loc.westpoint_shop.desc": "工具與木料的老家。玻璃碎了以後，聲音會傳很遠。",
	"loc.louisville_apt.blurb": "城區公寓。",
	"loc.louisville_apt.desc": "六樓還算安全。樓梯間是另一回事。",
	"loc.rosewood_pd.blurb": "槍櫃、牢房、一份沒人簽的報告。",
	"loc.rosewood_pd.desc": "小鎮警局。彈藥可能還鎖著。走廊盡頭有拖步聲。",
	"loc.muldraugh_wh.blurb": "貨盤、叉車、沒開完的罐頭箱。",
	"loc.muldraugh_wh.desc": "物流倉。食物與建材成堆，也養了一整棟的東西。",
	"loc.riverside_mart.blurb": "小鎮超市。入門課。",
	"loc.riverside_mart.desc": "貨架倒了，冷凍櫃還在滴。第一個敢去的地方，往往也最教訓人。",
	"loc.westpoint_town.blurb": "槍店、加油站、一條死主街。",
	"loc.westpoint_town.desc": "肯塔基小鎮中心。有油有彈，也有從路易斯維爾漂下來的屍潮。",
	"loc.march_ridge.blurb": "封閉社區。有人曾試圖守住。",
	"loc.march_ridge.desc": "鐵門半開。裡面不是空的——有人留了字條，也留了咬痕。",
	"loc.louisville_er.blurb": "藥還在。東西也在。",
	"loc.louisville_er.desc": "急診門開著。推床卡在坡道。藥局是這座城最值錢的房間。",
	"loc.louisville_mall.blurb": "消費時代的墳。",
	"loc.louisville_mall.desc": "電扶梯停在半途。推車與植物爭地。食物、衣物、還有太多迴音。",
	"loc.fort_knox.blurb": "金子沒了。槍還在。",
	"loc.fort_knox.desc": "軍營鐵絲網後頭。彈藥庫是傳說，衛兵早就不是衛兵。",
	"loc.cincinnati.blurb": "過河就是另一個州。",
	"loc.cincinnati.desc": "橋還在。河面上漂著的不只是木頭。城裡有人用無線電唱歌。",
	"loc.indianapolis.blurb": "賽車城停了。",
	"loc.indianapolis.desc": "環城公路堵死。市區有一座還亮著紅燈的車庫——有人在守。",
	"loc.nashville.blurb": "音樂停了以後，只剩回音。",
	"loc.nashville.desc": "霓虹死了。有人在唱片行裡設過營，留下一把吉他和三具身體。",
	"loc.memphis.blurb": "密西西比河的南門。",
	"loc.memphis.desc": "港口貨櫃像墳。河風把味道送得很遠。有人說對岸有船。",
	"loc.stlouis.blurb": "拱門還在。城不在。",
	"loc.stlouis.desc": "拱門影子下，有一支十幾人的營地——不一定歡迎客人。",
	"loc.chicago.blurb": "風城。佔領這裡，才算有一座城。",
	"loc.chicago.desc": "湖風、高樓、沒電的地鐵。清完這裡的東西，美國中西部就有一個真正的家。",
	"ui.comma": "、",
	"ch.searchQuiet": "潛行搜索",
	"ch.searchQuietHint": "慢、安靜、東西較少",
	"ch.searchLoud": "徹底翻找",
	"ch.searchLoudHint": "快、吵、東西多",
	"ch.fight": "清理僵屍",
	"ch.fightHint": "降低此地數量，才能佔領",
	"ch.next": "進入下一區",
	"ch.extract": "帶著東西回去",
	"ch.melee": "近戰",
	"ch.meleeHint": "安靜，容易受傷",
	"ch.gun": "開槍",
	"ch.gunHint": "耗彈、很吵、有效 · 彈藥 {n}",
	"ch.flank": "包抄",
	"ch.flankHint": "需要潛行",
	"ch.back": "先不打",
	"ch.clearRest": "把剩下的清掉",
	"ch.goHome": "回家",
	"ch.contact": "接觸 · {n} 隻",
	"ch.clearedTitle": "清場",
	"ch.endTitle": "盡頭",
	"ch.meet": "迎上去",
	"ch.fleeNow": "立刻撤離",
	"ch.otherRoom": "先換房間",
	"flav.0": "{zone}裡很暗。空氣黏，像有人在裡面住過、又突然離開。",
	"flav.1": "你們踏進{zone}。地板上有拖痕，往裡面去。",
	"flav.2": "{zone}安靜得不對勁。遠處有一下金屬碰撞，然後沒有了。",
	"flav.3": "推開{zone}的門。灰塵、甜味、以及還沒走遠的腳步。",
	"flav.zeds": "估計還有 {n} 隻在這棟裡遊蕩。",
	"flav.quiet": "暫時聽不到拖步。也許真的清完了。",
	"txt.fightCleared": "這一帶暫時清乾淨了。可以搜，也可以走。",
	"txt.fightBody": "{zone}裡有東西在轉頭。選怎麼打——打完，這地方才有可能變成下一個家。",
	"txt.hold": "先不打。還可以搜，或撤。",
	"txt.endBody": "這棟能搜的都走完了。可以清場、佔領，或帶著袋子回家。",
	"txt.win": "{name}解決了 {n} 隻。還剩 {left}。",
	"txt.ok": "打贏了，但不乾淨。清掉 {n} 隻，還剩 {left}。{name}喘得很重。",
	"txt.bad": "{name}幾乎被壓住。清掉 {n} 隻，還剩 {left}。必須決定要不要撤。",
	"txt.canOccupy": "聽不到拖步了。如果願意，這裡可以成為下一座庇護所。",
	"txt.loudFind": "{name}把抽屜整個拉開。聲音很大。找到：{found}。",
	"txt.quietFind": "{name}貼著牆翻。找到：{found}。",
	"txt.sneak": "幾乎沒弄出聲。",
	"txt.empty": "幾乎是空的",
	"txt.heard": "外頭傳來一串回應的呻吟。它們聽到了。",
	"txt.fullHouse": "{name}看了看你們的人數。「你們住的地方已經滿了。我自己想辦法。」人影沒入走廊。",
	"txt.betray": "{name}撲上來。衝突很短。人跑了，東西還在。",
	"txt.joinWalk": "{name}點頭，把背包甩到肩上。「走。我不想一個人死在這兒。」",
	"txt.turnedAway": "{name}咒了一句，退回暗處。也許還會再遇見。",
	"txt.tradeOk": "你們丟出食物。{name}扔回來一小包藥，然後消失。",
	"txt.tradeEmpty": "{name}看你們口袋空空，啐了一口走了。",
	"txt.shot": "槍聲在{zone}裡彈了兩下。{name}不再動。你們不是唯一的獵人。",
	"create.rolled": "抽到的人",
	"create.reroll": "再抽",
	"create.tweak": "自己調",
	"create.free": "免費特質",
	"create.freeShort": "職業",
	"create.occTrait": "職業特質",
	"create.leftOver": "剩餘技能點 {n}",
	"create.points": "起手 {n}",
	"create.occHint": "職業只給先天技能、一筆點數、有時一個免費特質。負點職業必須拿缺點補。",
	"occ.officer.en": "Police Officer",
	"occ.firefighter.desc": "斧、體能、奔跑、力氣各 +1。起手 0 點。沒有免費特質。",
	"occ.doctor.desc": "急救 +6、短刃 +1。起手 0 點。戰鬥要另外學。",
	"occ.officer.desc": "射擊 +4、靈活與換彈各 +1。起手 −4。槍是職業病。",
	"occ.chef.desc": "廚藝 +4。起手 −2。免費精通烹飪——過期的東西到他手上還能成熱食。",
	"occ.mechanic.desc": "機械 +4、焊接 +1。起手 −4。免費車輛知識。圍牆與引擎聽他的。",
	"occ.farmer.desc": "農耕 +4、力氣 +1。起手 0 點。沒有免費特質。",
	"occ.veteran.desc": "最貴職業。射擊與換彈各 +2。起手 −8。免費脫敏：幾乎不恐慌。缺點必須補滿。",
	"occ.burglar.desc": "輕步、靈活、潛行各 +2。起手 −6。免費竊賊：撬窗較安靜。",
	"trait.athletic": "運動健將",
	"trait.athletic.blurb": "跑得久、打得穩。十點，值得。",
	"trait.stout": "結實",
	"trait.stout.blurb": "力氣夠用，不必練到極限。",
	"trait.hunter": "獵人",
	"trait.hunter.blurb": "瞄、潛、拆獵物，都算過。",
	"trait.thickskinned": "皮厚",
	"trait.thickskinned.blurb": "抓傷咬傷比較難進。",
	"trait.keenhearing": "聽覺敏銳",
	"trait.keenhearing.blurb": "還沒看見，就先聽見。",
	"trait.brawler": "鬥士",
	"trait.brawler.blurb": "斧與棍是手的延伸。",
	"trait.gymnast": "體操",
	"trait.gymnast.blurb": "腳步與閃身是同一件事。",
	"trait.organized": "有條理",
	"trait.organized.blurb": "袋子裡永遠多一格。",
	"trait.inconspicuous": "不起眼",
	"trait.inconspicuous.blurb": "它們比較不容易看見你。",
	"trait.adrenaline": "腎上腺素",
	"trait.adrenaline.blurb": "血少的時候反而更快。",
	"trait.wakeful": "少眠",
	"trait.wakeful.blurb": "睡得少，醒得快。",
	"trait.catseyes": "貓眼",
	"trait.catseyes.blurb": "夜裡也看得清抽屜。",
	"trait.dextrous": "靈巧",
	"trait.dextrous.blurb": "東西進出袋子很快。",
	"trait.lighteater": "少食",
	"trait.lighteater.blurb": "吃得少，也能撐。",
	"trait.lowthirst": "少渴",
	"trait.lowthirst.blurb": "水可以省著喝。",
	"trait.outdoorsman": "戶外",
	"trait.outdoorsman.blurb": "風與雨不太能打敗他。",
	"trait.gardener": "園丁",
	"trait.gardener.blurb": "認得種子什麼時候該下。",
	"trait.irongut": "鐵胃",
	"trait.irongut.blurb": "過期的東西，比較不容易出事。",
	"trait.unfit": "體能差",
	"trait.unfit.blurb": "跑兩步就垮。十點很甜，命很薄。",
	"trait.thinskinned": "皮薄",
	"trait.thinskinned.blurb": "抓一下就破。大筆點數，大筆風險。",
	"trait.slowhealer": "癒合慢",
	"trait.slowhealer.blurb": "傷口不肯結痂。",
	"trait.underweight": "過輕",
	"trait.underweight.blurb": "風一吹就晃。",
	"trait.overweight": "過重",
	"trait.overweight.blurb": "跑起來費力。",
	"trait.highthirst": "易渴",
	"trait.highthirst.blurb": "水要多帶。只值兩點。",
	"trait.hemophobic": "見血恐懼",
	"trait.hemophobic.blurb": "自己的血也會讓手停。",
	"trait.asthmatic": "氣喘",
	"trait.asthmatic.blurb": "一口氣還沒喘完，下一拳就來了。",
	"trait.conspicuous": "顯眼",
	"trait.conspicuous.blurb": "它們先看見你。",
	"trait.heartyappetite": "大胃",
	"trait.heartyappetite.blurb": "吃得比別人多。",
	"trait.proneillness": "易病",
	"trait.proneillness.blurb": "感染走得比較快。",
	"trait.unlucky": "倒霉",
	"trait.unlucky.blurb": "抽屜總是空的。",
	"trait.weakstomach": "腸胃弱",
	"trait.weakstomach.blurb": "不熟的東西別碰。",
	"trait.allthumbs": "笨手",
	"trait.allthumbs.blurb": "袋子裡的東西永遠卡住。",
	"trait.shortsighted": "近視",
	"trait.shortsighted.blurb": "遠的東西糊成一團。",
	"trait.sleepyhead": "貪睡",
	"trait.sleepyhead.blurb": "怎麼睡都不夠。",
	"trait.desensitized": "脫敏",
	"trait.desensitized.blurb": "幾乎不恐慌。退伍軍人的職業病。",
	"trait.keencook": "精通烹飪",
	"trait.keencook.blurb": "過期的東西，到他手上還能成熱食。",
	"trait.burglarhands": "竊賊",
	"trait.burglarhands.blurb": "撬窗較安靜，搜刮較俐落。",
	"trait.vehicleknow": "車輛知識",
	"trait.vehicleknow.blurb": "引擎與鐵皮聽得懂。",
	"shop.title": "灰市",
	"shop.kicker": "不賣活命",
	"shop.tab.law": "原則",
	"shop.tab.look": "外觀",
	"shop.tab.found": "開國",
	"shop.hubLink": "灰市 · 過夜換紙",
	"shop.law.body": "v0.1 不收費，整局任玩。錢不能換命。趣味來自缺糧、永久死亡、情緒崩潰。灰市只賣紙張與相框，用過夜掙來的煙捲換。不賣糧食、不賣第二條命。",
	"shop.law.ok": "能換：日記紙、相框、開國印記。以後若有新地圖或職業包，也走這裡——那是新內容，不是新力量。",
	"shop.ban.revive": "不賣復活。死人就死了。",
	"shop.ban.food": "不賣食物、水、藥、彈藥。要搜。",
	"shop.ban.points": "不賣技能點、職業、特質。開局自己選。",
	"shop.ban.energy": "不賣出征次數。情緒夠才能出門。",
	"shop.ban.gacha": "不抽卡倖存者。人是在廢土裡遇到的。",
	"shop.ban.bond": "不賣好感。一起活過的夜，不能買。",
	"shop.look.body": "紙張改日記的底色。相框套在所有人臉上。不改傷害、搜刮、心情。",
	"shop.item.paper.field": "田野紙",
	"shop.item.paper.field.blurb": "預設。發黃的廢土筆記。",
	"shop.item.paper.carbon": "複寫紙",
	"shop.item.paper.carbon.blurb": "打字機色。字比較硬。",
	"shop.item.paper.ledger": "帳本",
	"shop.item.paper.ledger.blurb": "冷色。像在清點死人。",
	"shop.item.paper.ash": "灰燼",
	"shop.item.paper.ash.blurb": "焦邊暖色。火堆邊寫的。",
	"shop.item.frame.tape": "膠紙框",
	"shop.item.frame.tape.blurb": "牆上撕下來的照片。",
	"shop.item.frame.rust": "鏽邊",
	"shop.item.frame.rust.blurb": "鐵皮割出來的框。",
	"shop.item.frame.brass": "銅框",
	"shop.item.frame.brass.blurb": "舊相館剩下的。",
	"shop.item.pack.founder": "開國包",
	"shop.item.pack.founder.blurb": "四十根煙捲換全部紙與框，加上主畫面一行字。不給糧食、不給第二條命。",
	"shop.wear": "戴上",
	"shop.wearing": "正在用",
	"shop.support": "支援 {usd}",
	"shop.found.body": "v0.1 不收錢。開國包是煙捲換來的全套外觀——活過的夜夠了就能換。遊戲不會變簡單。",
	"shop.found.stats": "這台裝置",
	"shop.found.nights": "活過 {n} 個夜。每夜兩根煙捲。",
	"shop.found.mark": "再活一晚・開國",
	"shop.note.have": "已經有了。",
	"shop.note.short": "煙捲不夠。過夜會掉兩根。",
	"shop.note.bought": "用煙捲換了。外觀已換上。",
	"shop.note.demo": "預覽裡收不到錢。這次當試用解鎖，只寫在這台裝置。",
	"shop.demo": "v0.1 免費原型。不收費、無試用鎖。存檔在這台裝置。清資料就沒了。"
};
var extraEn = {
	"ui.noise": "Noise",
	"ui.region": "Kentucky — The Midwest",
	"crash.title": "The night broke",
	"crash.body": "The screen died. The save is still on this device.",
	"crash.resume": "Back to the shelter",
	"ui.anon": "Nameless",
	"stance.leader": "Lead",
	"stance.friend": "Ally",
	"stance.neutral": "Neutral",
	"stance.rival": "Uneasy",
	"stance.hostile": "Hostile",
	"map.live": "Live map · pinch and drag",
	"map.homeShort": "Home",
	"map.open": "Open",
	"roster.job": "Job",
	"roster.kick": "Send away",
	"roster.moodNeed": " (mood too low)",
	"build.cost": "{res} {n}",
	"sh.farmhouse.blurb": "Kentucky country. Quiet, far from supply.",
	"sh.hardware.blurb": "Tools ready. The street is not.",
	"sh.highrise.blurb": "A view of the city. The stairs cost blood.",
	"fac.beds.effect": "Capacity +1",
	"fac.kitchen.effect": "Less food used",
	"fac.water.effect": "Water each day",
	"fac.workshop.effect": "Build and walls",
	"fac.infirmary.effect": "Heal and clear infection",
	"fac.garden.effect": "Food each day",
	"fac.radio.effect": "Find sites / people",
	"fac.watch.effect": "Fewer night raids",
	"toast.lead": "{name} takes the lead",
	"toast.loot": "Found {bits}",
	"toast.empty": "Almost empty",
	"death.torn": "Torn apart on a run",
	"death.survivor": "Attacked by another survivor",
	"death.firefight": "Shot in a survivor fight",
	"death.raid": "Night raid",
	"death.infect": "The infection took them",
	"death.starve": "Thirst and hunger",
	"death.wound": "Wounds went bad",
	"death.kick": "Sent away. Never seen again",
	"end.loseBody": "Day {day}. The last one did not come back. America is still there. Nobody remembers you.",
	"end.winBody": "Day {day}. You dug {loc} out of the waste. The country is still ruin. This city has lights.",
	"enc.body.grateful": "{name} steps out of the dark, empty-handed. \"I followed you. Don't shoot. I can cook, watch, anything.\"",
	"enc.body.wary": "{name} points a pipe at the door. \"I saw it first. You want past, you trade.\" Eyes alive. Not bitten.",
	"enc.body.hostile": "A slide racks in the dark. {name} ({occ}) already counts you as raiders. \"Drop the bag. Walk. Or stay.\"",
	"enc.body.hurt": "{name} leans on the wall, shin bleeding, still awake. \"Don't leave me. Please. I used to be a {occ}.\"",
	"log.settle": "{name} ({occ}) holes up at {place}. The map of America is not the map anymore.",
	"log.noMoodGo": "No one's mood can walk out the door. Rest first.",
	"log.depart": "{names} leave for {loc} ({state}).",
	"log.died": "{name} is dead. {cause}",
	"log.grief": "The death sits on everyone left.",
	"log.bitten": "{name} was bitten. The wound is dirty.",
	"log.wipe": "The squad is gone. {loc} ate them.",
	"log.fight": "{name} fought in {zone}, killed {n}.",
	"log.bond": "{a} and {b} are {rel} now. Nights lived beat vows.",
	"log.return": "The squad is back from {loc}. {bag}",
	"log.emptyBag": "Empty-handed.",
	"log.brought": "Brought {bag}.",
	"log.fail": "The run failed. {loc} took people and bags.",
	"log.tooManyKills": "Too many kills. The smell will not wash off.",
	"log.clear": "{loc} is clear for now. You can move in.",
	"log.full": "{name} wanted in. The house is full.",
	"log.betray": "{name} pretended to agree, then swung.",
	"log.join": "{name} ({occ}) joined you.",
	"log.leave": "You let {name} go.",
	"log.firefight": "Firefight with {name}. They went down in {zone}.",
	"log.move": "Left {old}. Occupied {loc} ({state}). Holds {n}.",
	"log.noWork": "{name}'s mood is too low to work. Rest first.",
	"log.kick": "You sent {name} away. The door shut.",
	"log.upgrade": "{fac} is now level {n}.",
	"log.lieDown": "{name}'s mood is too low. They lie down tonight.",
	"log.nightDeath": "{name} died in the night. {cause}.",
	"log.skillUp": "{name}'s hands got a little better.",
	"log.clearedInfect": "{who} cleared {name}'s infection.",
	"log.radioLoc": "Static, then a fix — {loc} ({state}) is on the map.",
	"log.radioPerson": "A voice walked out of the static: {name} found your door.",
	"log.raid": "Night raid. Things came through the walls.",
	"log.hungry": "Not enough food. Someone slept hungry. Mood dropped.",
	"log.thirsty": "Not enough water. Throats dried in the night.",
	"log.harvest": "Garden and kitchen made food {n}.",
	"gear.stash": "Stash",
	"gear.stashEmpty": "Stash is empty. Kit drops on missions.",
	"gear.equip": "Wear",
	"gear.unequip": "Remove",
	"gear.none": "None",
	"gear.bare": "Empty slot.",
	"gear.emptySlot": "Nothing in stash for this slot.",
	"gear.bag": "Kit {n}",
	"gear.slot.weapon": "Weapon",
	"gear.slot.head": "Head",
	"gear.slot.body": "Body",
	"gear.slot.hands": "Hands",
	"gear.slot.legs": "Legs",
	"gear.slot.feet": "Feet",
	"gear.slot.back": "Back",
	"gear.rarity.common": "Common",
	"gear.rarity.uncommon": "Uncommon",
	"gear.rarity.rare": "Rare",
	"gear.rarity.epic": "Epic",
	"gear.rarity.legendary": "Legendary",
	"log.gear": "Brought {n} pieces: {bits}",
	"log.repair": "{name} mended kit in the workshop.",
	"roster.gear": "Kit",
	"loc.muldraugh_farm.blurb": "Starting farm. Yard, barn, mud road.",
	"loc.muldraugh_farm.desc": "First house. Seeds in the barn. A few walkers on the road.",
	"loc.westpoint_shop.blurb": "Hardware on main street.",
	"loc.westpoint_shop.desc": "Tools and lumber. Broken glass carries far.",
	"loc.louisville_apt.blurb": "City walk-up.",
	"loc.louisville_apt.desc": "Sixth floor is almost safe. The stairwell is not.",
	"loc.rosewood_pd.blurb": "Gun locker, cells, an unsigned report.",
	"loc.rosewood_pd.desc": "Small-town PD. Ammo may still be locked. Something drags at the end of the hall.",
	"loc.muldraugh_wh.blurb": "Pallets, forklifts, unopened cans.",
	"loc.muldraugh_wh.desc": "A depot. Food and lumber in stacks. A whole building of them too.",
	"loc.riverside_mart.blurb": "Town mart. First lesson.",
	"loc.riverside_mart.desc": "Shelves down. Freezers still drip. The first place you dare is the one that teaches.",
	"loc.westpoint_town.blurb": "Gun shop, gas, a dead main street.",
	"loc.westpoint_town.desc": "Kentucky town center. Fuel and rounds — and a tide that drifted down from Louisville.",
	"loc.march_ridge.blurb": "Gated. Someone tried to hold it.",
	"loc.march_ridge.desc": "The gate is half open. Not empty — notes, and bite marks.",
	"loc.louisville_er.blurb": "The meds are still there. So is everything else.",
	"loc.louisville_er.desc": "ER doors open. A gurney jammed on the ramp. The pharmacy is the dearest room in the city.",
	"loc.louisville_mall.blurb": "A grave for shopping.",
	"loc.louisville_mall.desc": "Escalators frozen mid-step. Carts and plants fighting for floor. Food, clothes, too much echo.",
	"loc.fort_knox.blurb": "The gold is gone. The guns are not.",
	"loc.fort_knox.desc": "Behind the wire. The armory is a story. The guards are not guards.",
	"loc.cincinnati.blurb": "Across the river is another state.",
	"loc.cincinnati.desc": "The bridge holds. More than wood floats. Someone is singing on the radio.",
	"loc.indianapolis.blurb": "The race stopped.",
	"loc.indianapolis.desc": "The beltway is a jam. Downtown a garage still shows red — someone is holding it.",
	"loc.nashville.blurb": "After the music, echo.",
	"loc.nashville.desc": "Neon dead. Someone camped in a record shop. Left a guitar and three bodies.",
	"loc.memphis.blurb": "South gate of the Mississippi.",
	"loc.memphis.desc": "Containers like graves. River wind carries the smell. They say there is a boat on the other side.",
	"loc.stlouis.blurb": "The Arch stands. The city does not.",
	"loc.stlouis.desc": "Under the Arch, a camp of a dozen — not always glad to see guests.",
	"loc.chicago.blurb": "The Windy City. Hold this and you have a city.",
	"loc.chicago.desc": "Lake wind, towers, a dead subway. Clear this and the Midwest has a real home.",
	"ui.comma": ", ",
	"ch.searchQuiet": "Search quietly",
	"ch.searchQuietHint": "Slow. Quiet. Less loot.",
	"ch.searchLoud": "Tear it open",
	"ch.searchLoudHint": "Fast. Loud. More loot.",
	"ch.fight": "Clear the dead",
	"ch.fightHint": "Cut the numbers. Then you can occupy.",
	"ch.next": "Next room",
	"ch.extract": "Take the bag and go",
	"ch.melee": "Melee",
	"ch.meleeHint": "Quiet. You will get hurt.",
	"ch.gun": "Open fire",
	"ch.gunHint": "Ammo, noise, it works · ammo {n}",
	"ch.flank": "Flank",
	"ch.flankHint": "Needs stealth",
	"ch.back": "Not yet",
	"ch.clearRest": "Finish the rest",
	"ch.goHome": "Go home",
	"ch.contact": "Contact · {n}",
	"ch.clearedTitle": "Cleared",
	"ch.endTitle": "The end of it",
	"ch.meet": "Meet them",
	"ch.fleeNow": "Extract now",
	"ch.otherRoom": "Another room",
	"flav.0": "{zone} is dark. The air is thick, like someone lived here and left in a hurry.",
	"flav.1": "You step into {zone}. Drag marks on the floor, going in.",
	"flav.2": "{zone} is too quiet. Metal knocks once, far off, then nothing.",
	"flav.3": "The door to {zone}. Dust, a sweet smell, footsteps that have not gone far.",
	"flav.zeds": "Maybe {n} still walking this building.",
	"flav.quiet": "No shuffle. Maybe it really is empty.",
	"txt.fightCleared": "This stretch is clean for now. Search, or leave.",
	"txt.fightBody": "Something in {zone} is turning its head. How you hit it decides if this place can be a home.",
	"txt.hold": "Not yet. You can still search, or leave.",
	"txt.endBody": "You have walked every room worth walking. Clear it, occupy it, or take the bag home.",
	"txt.win": "{name} puts down {n}. {left} left.",
	"txt.ok": "You win it, messy. {n} down, {left} left. {name} is breathing hard.",
	"txt.bad": "{name} almost goes under. {n} down, {left} left. Decide whether to run.",
	"txt.canOccupy": "No shuffle. If you want it, this can be the next shelter.",
	"txt.loudFind": "{name} rips the drawers. Loud. Found: {found}.",
	"txt.quietFind": "{name} works the wall. Found: {found}.",
	"txt.sneak": "Almost no sound.",
	"txt.empty": "almost nothing",
	"txt.heard": "A groan answers outside. They heard you.",
	"txt.fullHouse": "{name} looks at your numbers. \"You're full. I'll manage.\" Gone into the hall.",
	"txt.betray": "{name} lunges. It is short. They run. The bag stays.",
	"txt.joinWalk": "{name} nods, slings a pack. \"Walk. I don't want to die alone in here.\"",
	"txt.turnedAway": "{name} swears and steps back into the dark. You may meet again.",
	"txt.tradeOk": "You toss food. {name} throws back a small pack of medicine and is gone.",
	"txt.tradeEmpty": "{name} sees empty pockets, spits, and leaves.",
	"txt.shot": "The shot rings twice in {zone}. {name} does not move. You are not the only hunters.",
	"create.rolled": "The roll",
	"create.reroll": "Reroll",
	"create.tweak": "Tweak it",
	"create.free": "Free trait",
	"create.freeShort": "job",
	"create.occTrait": "Occupation trait",
	"create.leftOver": "Skill points left {n}",
	"create.points": "start {n}",
	"create.occHint": "A job gives innate skills, a point pool, sometimes a free trait. Negative pools need flaws.",
	"occ.officer.en": "Police Officer",
	"occ.firefighter.desc": "Axe, fitness, sprinting, strength +1. Start 0. No free trait.",
	"occ.doctor.desc": "First Aid +6, short blade +1. Start 0. Combat is extra.",
	"occ.officer.desc": "Aiming +4, nimble and reload +1. Start −4. Guns are the job.",
	"occ.chef.desc": "Cooking +4. Start −2. Free Keen Cook — spoiled food can still become a meal.",
	"occ.mechanic.desc": "Mechanics +4, welding +1. Start −4. Free Vehicle Knowledge.",
	"occ.farmer.desc": "Agriculture +4, strength +1. Start 0. No free trait.",
	"occ.veteran.desc": "Most expensive job. Aiming and reload +2. Start −8. Free Desensitized. Flaws must cover it.",
	"occ.burglar.desc": "Lightfooted, nimble, sneaking +2. Start −6. Free Burglar: quieter windows.",
	"trait.athletic": "Athletic",
	"trait.athletic.blurb": "Runs longer. Hits cleaner. Ten points. Worth it.",
	"trait.stout": "Stout",
	"trait.stout.blurb": "Strong enough. Not the extreme.",
	"trait.hunter": "Hunter",
	"trait.hunter.blurb": "Aim, sneak, dress a kill.",
	"trait.thickskinned": "Thick-skinned",
	"trait.thickskinned.blurb": "Scratches and bites have a harder time.",
	"trait.keenhearing": "Keen hearing",
	"trait.keenhearing.blurb": "Hears them before seeing them.",
	"trait.brawler": "Brawler",
	"trait.brawler.blurb": "Axe and stick are extra hands.",
	"trait.gymnast": "Gymnast",
	"trait.gymnast.blurb": "Footwork and dodge are the same thing.",
	"trait.organized": "Organized",
	"trait.organized.blurb": "The bag always has one more slot.",
	"trait.inconspicuous": "Inconspicuous",
	"trait.inconspicuous.blurb": "They are slower to notice you.",
	"trait.adrenaline": "Adrenaline junkie",
	"trait.adrenaline.blurb": "Faster when the blood is low.",
	"trait.wakeful": "Wakeful",
	"trait.wakeful.blurb": "Sleeps less. Wakes faster.",
	"trait.catseyes": "Cat's eyes",
	"trait.catseyes.blurb": "Drawers still read at night.",
	"trait.dextrous": "Dextrous",
	"trait.dextrous.blurb": "Things move in and out of the bag fast.",
	"trait.lighteater": "Light eater",
	"trait.lighteater.blurb": "Eats less. Still stands.",
	"trait.lowthirst": "Low thirst",
	"trait.lowthirst.blurb": "Water can wait.",
	"trait.outdoorsman": "Outdoorsy",
	"trait.outdoorsman.blurb": "Wind and rain do not quite beat them.",
	"trait.gardener": "Gardener",
	"trait.gardener.blurb": "Knows when the seed goes in.",
	"trait.irongut": "Iron gut",
	"trait.irongut.blurb": "Spoiled food is less of a problem.",
	"trait.unfit": "Unfit",
	"trait.unfit.blurb": "Two steps and they fold. Ten points. Thin life.",
	"trait.thinskinned": "Thin-skinned",
	"trait.thinskinned.blurb": "One scratch opens. Big refund, big risk.",
	"trait.slowhealer": "Slow healer",
	"trait.slowhealer.blurb": "Wounds refuse to close.",
	"trait.underweight": "Underweight",
	"trait.underweight.blurb": "The wind moves them.",
	"trait.overweight": "Overweight",
	"trait.overweight.blurb": "Running costs extra.",
	"trait.highthirst": "High thirst",
	"trait.highthirst.blurb": "Carry more water. Only two points now.",
	"trait.hemophobic": "Fear of blood",
	"trait.hemophobic.blurb": "Their own blood stops the hands.",
	"trait.asthmatic": "Short of breath",
	"trait.asthmatic.blurb": "The next swing lands before the breath is back.",
	"trait.conspicuous": "Conspicuous",
	"trait.conspicuous.blurb": "They see you first.",
	"trait.heartyappetite": "Hearty appetite",
	"trait.heartyappetite.blurb": "Eats more than the rest.",
	"trait.proneillness": "Prone to illness",
	"trait.proneillness.blurb": "Infection moves faster.",
	"trait.unlucky": "Unlucky",
	"trait.unlucky.blurb": "The drawer is always empty.",
	"trait.weakstomach": "Weak stomach",
	"trait.weakstomach.blurb": "Leave the uncooked alone.",
	"trait.allthumbs": "All thumbs",
	"trait.allthumbs.blurb": "The bag always jams.",
	"trait.shortsighted": "Short sighted",
	"trait.shortsighted.blurb": "Far things smear.",
	"trait.sleepyhead": "Sleepyhead",
	"trait.sleepyhead.blurb": "Never enough sleep.",
	"trait.desensitized": "Desensitized",
	"trait.desensitized.blurb": "Almost no panic. A veteran's occupational disease.",
	"trait.keencook": "Keen cook",
	"trait.keencook.blurb": "Spoiled food can still become a hot meal.",
	"trait.burglarhands": "Burglar",
	"trait.burglarhands.blurb": "Quieter windows. Cleaner loot.",
	"trait.vehicleknow": "Vehicle knowledge",
	"trait.vehicleknow.blurb": "Engines and sheet metal listen.",
	"shop.title": "Ash Market",
	"shop.kicker": "We don't sell lives",
	"shop.tab.law": "Law",
	"shop.tab.look": "Looks",
	"shop.tab.found": "Founding",
	"shop.hubLink": "Ash Market · paper for nights",
	"shop.law.body": "v0.1 is free. Play the whole run. Money cannot buy a pulse. The game is hunger, permadeath, and mood. The market sells paper and frames, paid in cigarettes earned by surviving a night. No food. No second life.",
	"shop.law.ok": "Allowed: paper, frames, the founding mark. Later map or job packs go here too — new pages, not new power.",
	"shop.ban.revive": "No revives. Dead stays dead.",
	"shop.ban.food": "No food, water, medicine, ammo. You scavenge.",
	"shop.ban.points": "No skill points, jobs, or traits. You roll them.",
	"shop.ban.energy": "No mission tickets. Mood decides who leaves.",
	"shop.ban.gacha": "No gacha survivors. You find people in the waste.",
	"shop.ban.bond": "No bought affection. Nights together are not for sale.",
	"shop.look.body": "Paper recolors the journal. Frames sit on every face. Damage, loot, and mood do not change.",
	"shop.item.paper.field": "Field paper",
	"shop.item.paper.field.blurb": "Default. Yellowed waste notes.",
	"shop.item.paper.carbon": "Carbon",
	"shop.item.paper.carbon.blurb": "Typewriter tone. Harder letters.",
	"shop.item.paper.ledger": "Ledger",
	"shop.item.paper.ledger.blurb": "Cold ink. Counting the dead.",
	"shop.item.paper.ash": "Ash",
	"shop.item.paper.ash.blurb": "Warm scorched edge. Written by a fire.",
	"shop.item.frame.tape": "Tape frame",
	"shop.item.frame.tape.blurb": "Torn off a wall.",
	"shop.item.frame.rust": "Rust edge",
	"shop.item.frame.rust.blurb": "Cut from sheet metal.",
	"shop.item.frame.brass": "Brass",
	"shop.item.frame.brass.blurb": "Left in an old studio.",
	"shop.item.pack.founder": "Founding pack",
	"shop.item.pack.founder.blurb": "Forty cigarettes for every paper and frame, plus a line on the title. No food. No second life.",
	"shop.wear": "Wear",
	"shop.wearing": "Wearing",
	"shop.support": "Support {usd}",
	"shop.found.body": "v0.1 takes no money. The founding pack is all looks, paid in cigarettes from nights lived. The game does not get easier.",
	"shop.found.stats": "This device",
	"shop.found.nights": "{n} nights lived. Two cigarettes each.",
	"shop.found.mark": "One More Night founder",
	"shop.note.have": "Already owned.",
	"shop.note.short": "Not enough cigarettes. A night drops two.",
	"shop.note.bought": "Paid in cigarettes. Look applied.",
	"shop.note.demo": "This preview cannot take money. Unlock is local, for trying paper and frames.",
	"shop.demo": "v0.1 free prototype. No paywall, no trial lock. The save lives on this device. Clear the data and it is gone."
};
var extraJa = {
	"ui.noise": "騒音",
	"ui.region": "ケンタッキー — 中西部",
	"crash.title": "この夜が壊れた",
	"crash.body": "画面が一度落ちた。記録はこの端末に残っている。",
	"crash.resume": "避難所へ戻る",
	"ui.anon": "無名",
	"stance.leader": "隊長",
	"stance.friend": "仲間",
	"stance.neutral": "中立",
	"stance.rival": "不安定",
	"stance.hostile": "敵対",
	"map.live": "実在地図 · ピンチとドラッグ",
	"map.homeShort": "家",
	"map.open": "未掃討",
	"roster.job": "仕事",
	"roster.kick": "出す",
	"roster.moodNeed": "（情緒不足）",
	"build.cost": "{res} {n}",
	"sh.farmhouse.blurb": "ケンタッキーの田舎。静かだが補給は遠い。",
	"sh.hardware.blurb": "道具はある。通りは静かではない。",
	"sh.highrise.blurb": "街が見える。階段は血で払う。",
	"fac.beds.effect": "定員 +1",
	"fac.kitchen.effect": "食料消費減",
	"fac.water.effect": "毎日の水",
	"fac.workshop.effect": "建設と防壁",
	"fac.infirmary.effect": "治療と感染除去",
	"fac.garden.effect": "毎日の食料",
	"fac.radio.effect": "地点／生存者の発見",
	"fac.watch.effect": "夜襲を減らす",
	"toast.lead": "{name}が先頭を取る",
	"toast.loot": "入手 {bits}",
	"toast.empty": "ほとんど空",
	"death.torn": "任務で引き裂かれた",
	"death.survivor": "他の生存者に襲われた",
	"death.firefight": "生存者との銃撃",
	"death.raid": "夜襲",
	"death.infect": "感染が進行した",
	"death.starve": "渇きと飢え",
	"death.wound": "傷が悪化した",
	"death.kick": "追い出され、行方不明",
	"end.loseBody": "{day}日目。最後の一人も戻らなかった。アメリカは残っている。お前たちを覚える者はいない。",
	"end.winBody": "{day}日目。{loc}を廃土から掘り起こした。国は廃墟のまま。この街には灯がある。",
	"enc.body.grateful": "{name}が暗がりから出てきた。両手は空。「ついてきた。撃つな。料理でも見張りでも、何でもする。」",
	"enc.body.wary": "{name}が鉄管を入口に向ける。「先に見つけたのは俺だ。通るなら交換だ。」目は生きている。噛まれてはいない。",
	"enc.body.hostile": "暗がりでスライドが走る。{name}（{occ}）はもう侵入者だと思っている。「袋を置け。歩け。残るか。」",
	"enc.body.hurt": "{name}が壁に寄り、脛から血。まだ起きている。「置いていくな。頼む。昔は{occ}だった。」",
	"log.settle": "{name}（{occ}）は{place}に落ちついた。アメリカの地図は、もうあの地図ではない。",
	"log.noMoodGo": "誰も出る情緒がない。まず休め。",
	"log.depart": "{names}は{loc}（{state}）へ向かった。",
	"log.died": "{name}は死んだ。{cause}",
	"log.grief": "死が残った者の上に乗っている。",
	"log.bitten": "{name}は噛まれた。傷は汚い。",
	"log.wipe": "小隊は全滅。{loc}が吞んだ。",
	"log.fight": "{name}は{zone}で戦い、{n}体を倒した。",
	"log.bond": "{a}と{b}は{rel}になった。一緒に生きた夜は誓いより硬い。",
	"log.return": "小隊は{loc}から戻った。{bag}",
	"log.emptyBag": "空手。",
	"log.brought": "{bag}を持ち帰った。",
	"log.fail": "任務失敗。{loc}が人も袋も吞んだ。",
	"log.tooManyKills": "殺しすぎた。匂いは落ちない。",
	"log.clear": "{loc}は一時的に掃討された。引っ越せる。",
	"log.full": "{name}は入りたかった。満員だ。",
	"log.betray": "{name}は頷いてから手を出した。",
	"log.join": "{name}（{occ}）が加わった。",
	"log.leave": "{name}を去らせた。",
	"log.firefight": "{name}と撃ち合った。{zone}で倒れた。",
	"log.move": "{old}を離れ、{loc}（{state}）を占領。定員 {n}。",
	"log.noWork": "{name}の情緒が低く働けない。休め。",
	"log.kick": "{name}を出した。扉が閉まった。",
	"log.upgrade": "{fac}は{n}級になった。",
	"log.lieDown": "{name}の情緒が低い。今夜は横になるだけ。",
	"log.nightDeath": "{name}は夜に死んだ。{cause}。",
	"log.skillUp": "{name}の手が少し上手くなった。",
	"log.clearedInfect": "{who}が{name}の感染を消した。",
	"log.radioLoc": "ノイズのあと、位置が落ちた——{loc}（{state}）。",
	"log.radioPerson": "廃周波数から声が歩いてきた。{name}が扉を見つけた。",
	"log.raid": "夜襲。壁の隙間から入ってきた。",
	"log.hungry": "食料が足りない。空腹のまま寝た。情緒が落ちた。",
	"log.thirsty": "水が足りない。夜の喉が乾く。",
	"log.harvest": "菜園と台所が食料 {n} を出した。",
	"gear.stash": "倉庫",
	"gear.stashEmpty": "倉庫は空だ。装備は出撃で落ちる。",
	"gear.equip": "装備",
	"gear.unequip": "外す",
	"gear.none": "なし",
	"gear.bare": "空き。",
	"gear.emptySlot": "この部位の物は倉庫にない。",
	"gear.bag": "装備 {n}",
	"gear.slot.weapon": "武器",
	"gear.slot.head": "頭",
	"gear.slot.body": "体",
	"gear.slot.hands": "手",
	"gear.slot.legs": "脚",
	"gear.slot.feet": "足",
	"gear.slot.back": "背",
	"gear.rarity.common": "コモン",
	"gear.rarity.uncommon": "アンコモン",
	"gear.rarity.rare": "レア",
	"gear.rarity.epic": "エピック",
	"gear.rarity.legendary": "レジェンダリー",
	"log.gear": "装備 {n}：{bits}",
	"log.repair": "{name}が工房で装備を直した。",
	"roster.gear": "装備",
	"loc.muldraugh_farm.blurb": "最初の農舎。裏庭、納屋、泥道。",
	"loc.muldraugh_farm.desc": "最初の家。納屋に種。道にはたまに徘徊者がいる。",
	"loc.westpoint_shop.blurb": "本通りの金物屋。",
	"loc.westpoint_shop.desc": "道具と木材の古巣。ガラスが割れると音は遠くまで行く。",
	"loc.louisville_apt.blurb": "市街のアパート。",
	"loc.louisville_apt.desc": "六階はまだ安全に近い。階段は別の話。",
	"loc.rosewood_pd.blurb": "銃庫、独房、署名のない報告書。",
	"loc.rosewood_pd.desc": "小さな署。弾薬はまだ鍵がかかっているかも。廊下の先に引きずる音。",
	"loc.muldraugh_wh.blurb": "パレット、フォークリフト、未開封の缶。",
	"loc.muldraugh_wh.desc": "物流倉庫。食料と建材の山。中の代物も山だ。",
	"loc.riverside_mart.blurb": "町の店。最初の授業。",
	"loc.riverside_mart.desc": "棚は倒れた。冷凍庫はまだ滴る。最初に行く場所が、いちばん教える。",
	"loc.westpoint_town.blurb": "銃店、ガソリンスタンド、死んだ本通り。",
	"loc.westpoint_town.desc": "ケンタッキーの町の中心。油と弾。ルイビルから流れてきた屍の潮もある。",
	"loc.march_ridge.blurb": "ゲート付き。誰かが守ろうとした。",
	"loc.march_ridge.desc": "鉄門は半開き。空ではない——メモと噛み跡。",
	"loc.louisville_er.blurb": "薬は残っている。他のものも。",
	"loc.louisville_er.desc": "救急の扉は開いている。ストレッチャーが坂に引っかかっている。薬局がこの街でいちばん高い部屋だ。",
	"loc.louisville_mall.blurb": "消費の墓。",
	"loc.louisville_mall.desc": "エスカレーターは途中で止まっている。カートと植物が床を争う。食料、衣服、多すぎる残響。",
	"loc.fort_knox.blurb": "金は消えた。銃は残った。",
	"loc.fort_knox.desc": "鉄条網の向こう。兵器庫は伝説。衛兵はもう衛兵ではない。",
	"loc.cincinnati.blurb": "川を渡れば別の州。",
	"loc.cincinnati.desc": "橋は残っている。浮かんでいるのは木だけではない。街で誰かが無線で歌っている。",
	"loc.indianapolis.blurb": "レースは止まった。",
	"loc.indianapolis.desc": "環状道路は詰まっている。ダウンタウンの車庫にまだ赤い灯——誰かが守っている。",
	"loc.nashville.blurb": "音楽のあと、残響だけ。",
	"loc.nashville.desc": "ネオンは死んだ。レコード店に誰かが営んだ。ギターと三つの遺体。",
	"loc.memphis.blurb": "ミシシッピの南門。",
	"loc.memphis.desc": "港のコンテナは墓のよう。川風が匂いを運ぶ。向こう岸に船があるという。",
	"loc.stlouis.blurb": "アーチは残った。街は残っていない。",
	"loc.stlouis.desc": "アーチの影に十数人のキャンプ——客を歓迎するとは限らない。",
	"loc.chicago.blurb": "風の街。ここを取れば、本当の都市だ。",
	"loc.chicago.desc": "湖風、高層、電気のない地下鉄。ここを掃えば、中西部に本当の家ができる。",
	"ui.comma": "、",
	"ch.searchQuiet": "潜行して搜す",
	"ch.searchQuietHint": "遅い。静か。少ない。",
	"ch.searchLoud": "徹底的に漁る",
	"ch.searchLoudHint": "速い。うるさい。多い。",
	"ch.fight": "屍を片づける",
	"ch.fightHint": "数を減らしてから占領できる",
	"ch.next": "次の区画へ",
	"ch.extract": "袋を持って戻る",
	"ch.melee": "近接",
	"ch.meleeHint": "静か。怪我しやすい。",
	"ch.gun": "撃つ",
	"ch.gunHint": "弾、騒音、効く · 弾薬 {n}",
	"ch.flank": "回り込み",
	"ch.flankHint": "隠密が要る",
	"ch.back": "まだ打たない",
	"ch.clearRest": "残りを掃く",
	"ch.goHome": "帰る",
	"ch.contact": "接触 · {n}体",
	"ch.clearedTitle": "掃討",
	"ch.endTitle": "行き止まり",
	"ch.meet": "迎え撃つ",
	"ch.fleeNow": "今すぐ撤退",
	"ch.otherRoom": "先に部屋を変える",
	"flav.0": "{zone}は暗い。空気が粘る。誰かが住んで、急に出た跡。",
	"flav.1": "{zone}に踏み込む。床に引きずった跡が、奥へ続く。",
	"flav.2": "{zone}が静かすぎる。遠くで金属が一度当たって、止む。",
	"flav.3": "{zone}の扉。埃、甘い匂い、まだ遠くへ行っていない足音。",
	"flav.zeds": "この建物にまだ {n} 体いる見込み。",
	"flav.quiet": "引きずる音がない。本当に空かもしれない。",
	"txt.fightCleared": "この一帯はしばらくきれいだ。搜しても、離れてもいい。",
	"txt.fightBody": "{zone}の中で何かが首を向けている。打ち方次第で、次の家になる。",
	"txt.hold": "まだ打たない。搜すか、退くか。",
	"txt.endBody": "漁れる部屋は歩き切った。掃くか、占領するか、袋を持って帰る。",
	"txt.win": "{name}が {n} 体を仕留めた。残り {left}。",
	"txt.ok": "勝ったが、きれいではない。{n} 体、残り {left}。{name}の息が荒い。",
	"txt.bad": "{name}が押し潰されかけた。{n} 体、残り {left}。退くか決めろ。",
	"txt.canOccupy": "引きずる音がない。望むなら、次の避難所にできる。",
	"txt.loudFind": "{name}が引き出しを全部開けた。音が大きい。見つけた：{found}。",
	"txt.quietFind": "{name}が壁沿いを漁った。見つけた：{found}。",
	"txt.sneak": "ほとんど音を立てていない。",
	"txt.empty": "ほとんど空",
	"txt.heard": "外から呻きが返ってきた。聞こえた。",
	"txt.fullHouse": "{name}が人数を見て言った。「満員だ。自分でやる。」廊下に消えた。",
	"txt.betray": "{name}が襲いかかる。短い。相手は走り、袋は残る。",
	"txt.joinWalk": "{name}がうなずき、袋を肩にかける。「歩く。ここで一人で死にたくない。」",
	"txt.turnedAway": "{name}が毒づいて暗がりへ戻る。また会うかもしれない。",
	"txt.tradeOk": "食料を投げた。{name}が薬の小包を投げ返し、消えた。",
	"txt.tradeEmpty": "{name}はポケットが空なのを見て、唾を吐いて去った。",
	"txt.shot": "{zone}で銃声が二度跳ねた。{name}は動かない。狩人はお前たちだけではない。",
	"create.rolled": "抽選結果",
	"create.reroll": "もう一度",
	"create.tweak": "自分で調整",
	"create.free": "無料特性",
	"create.freeShort": "職業",
	"create.occTrait": "職業特性",
	"create.leftOver": "残り技能点 {n}",
	"create.points": "初期 {n}",
	"create.occHint": "職業は先天技能と点数、時に無料特性。マイナスは欠点で埋める。",
	"occ.officer.en": "Police Officer",
	"occ.firefighter.desc": "斧・体力・走・力 各+1。初期 0。無料特性なし。",
	"occ.doctor.desc": "応急 +6、短刃 +1。初期 0。戦闘は別。",
	"occ.officer.desc": "射撃 +4、身軽と装填 +1。初期 −4。銃が職業病。",
	"occ.chef.desc": "料理 +4。初期 −2。無料の料理上手——賞味切れでも熱い食事になる。",
	"occ.mechanic.desc": "機械 +4、溶接 +1。初期 −4。無料の車両知識。",
	"occ.farmer.desc": "農業 +4、力 +1。初期 0。無料特性なし。",
	"occ.veteran.desc": "最も高い職業。射撃と装填 +2。初期 −8。無料の脱感作。欠点で埋める。",
	"occ.burglar.desc": "軽歩・身軽・隠密 各+2。初期 −6。無料の空き巣：窓が静か。",
	"trait.athletic": "運動選手",
	"trait.athletic.blurb": "長く走る。打撃が安定。十点。元は取れる。",
	"trait.stout": "頑丈",
	"trait.stout.blurb": "力は足りる。極限までは要らない。",
	"trait.hunter": "狩人",
	"trait.hunter.blurb": "狙い、潜り、獲物を捌く。",
	"trait.thickskinned": "厚皮",
	"trait.thickskinned.blurb": "引っかきと噛みが入りにくい。",
	"trait.keenhearing": "聴覚鋭敏",
	"trait.keenhearing.blurb": "見る前に聞こえる。",
	"trait.brawler": "喧嘩屋",
	"trait.brawler.blurb": "斧と棍は手の延長。",
	"trait.gymnast": "体操",
	"trait.gymnast.blurb": "歩幅と躱しは同じこと。",
	"trait.organized": "整頓",
	"trait.organized.blurb": "袋にいつももう一枠。",
	"trait.inconspicuous": "目立たない",
	"trait.inconspicuous.blurb": "奴らは気づきにくい。",
	"trait.adrenaline": "アドレナリン",
	"trait.adrenaline.blurb": "血が減ると却って速い。",
	"trait.wakeful": "少眠",
	"trait.wakeful.blurb": "眠りが少なく、目覚めが速い。",
	"trait.catseyes": "猫目",
	"trait.catseyes.blurb": "夜でも引き出しが読める。",
	"trait.dextrous": "手先が速い",
	"trait.dextrous.blurb": "袋の出し入れが速い。",
	"trait.lighteater": "少食",
	"trait.lighteater.blurb": "少なく食べても立つ。",
	"trait.lowthirst": "渇きにくい",
	"trait.lowthirst.blurb": "水は節約できる。",
	"trait.outdoorsman": "野外",
	"trait.outdoorsman.blurb": "風と雨では倒れない。",
	"trait.gardener": "園芸",
	"trait.gardener.blurb": "種をいつ下ろすか知っている。",
	"trait.irongut": "鉄の胃",
	"trait.irongut.blurb": "賞味切れでも事になりにくい。",
	"trait.unfit": "体力不足",
	"trait.unfit.blurb": "二歩で潰れる。十点は甘い。命は薄い。",
	"trait.thinskinned": "薄皮",
	"trait.thinskinned.blurb": "一掻きで破れる。大きな点数、大きな危険。",
	"trait.slowhealer": "治癒が遅い",
	"trait.slowhealer.blurb": "傷が閉じない。",
	"trait.underweight": "低体重",
	"trait.underweight.blurb": "風で揺れる。",
	"trait.overweight": "過体重",
	"trait.overweight.blurb": "走るのが重い。",
	"trait.highthirst": "渇きやすい",
	"trait.highthirst.blurb": "水を多めに。今は二点だけ。",
	"trait.hemophobic": "血液恐怖",
	"trait.hemophobic.blurb": "自分の血でも手が止まる。",
	"trait.asthmatic": "息切れ",
	"trait.asthmatic.blurb": "息が戻る前に次の一撃。",
	"trait.conspicuous": "目立つ",
	"trait.conspicuous.blurb": "奴らが先に見る。",
	"trait.heartyappetite": "大食",
	"trait.heartyappetite.blurb": "他人より多く食べる。",
	"trait.proneillness": "病気がち",
	"trait.proneillness.blurb": "感染が速い。",
	"trait.unlucky": "不運",
	"trait.unlucky.blurb": "引き出しはいつも空。",
	"trait.weakstomach": "弱い胃",
	"trait.weakstomach.blurb": "生のものは触るな。",
	"trait.allthumbs": "不器用な手",
	"trait.allthumbs.blurb": "袋のものがいつも引っかかる。",
	"trait.shortsighted": "近視",
	"trait.shortsighted.blurb": "遠いものが滲む。",
	"trait.sleepyhead": "眠たがり",
	"trait.sleepyhead.blurb": "いくら寝ても足りない。",
	"trait.desensitized": "脱感作",
	"trait.desensitized.blurb": "ほとんどパニックしない。退役軍人の職業病。",
	"trait.keencook": "料理上手",
	"trait.keencook.blurb": "賞味切れでも熱い食事になる。",
	"trait.burglarhands": "空き巣",
	"trait.burglarhands.blurb": "窓が静か。漁りが巧い。",
	"trait.vehicleknow": "車両知識",
	"trait.vehicleknow.blurb": "エンジンと鉄板が従う。",
	"shop.title": "灰市",
	"shop.kicker": "命は売らない",
	"shop.tab.law": "原則",
	"shop.tab.look": "外見",
	"shop.tab.found": "建国",
	"shop.hubLink": "灰市 · 夜で紙を換える",
	"shop.law.body": "v0.1 は無料。最後まで遊べる。金で脈は買えない。味は飢餓、永久死、情緒だ。灰市が売るのは紙と額縁だけ。煙草は生き延びた夜に落ちる。食料も命も売らない。",
	"shop.law.ok": "売っていいもの：紙、額縁、建国の印。あとから地図や職業パックもここに置く——新しい頁であり、新しい力ではない。",
	"shop.ban.revive": "蘇生は売らない。死者は死者。",
	"shop.ban.food": "食料、水、薬、弾薬は売らない。漁れ。",
	"shop.ban.points": "技能点、職業、特性は売らない。自分で選べ。",
	"shop.ban.energy": "出撃回数は売らない。情緒が門番だ。",
	"shop.ban.gacha": "生存者ガチャはしない。人は廃土で出会う。",
	"shop.ban.bond": "好意は売らない。共に生きた夜は買えない。",
	"shop.look.body": "紙は日記の色を変える。額縁は顔に乗る。ダメージ、漁り、心情は変わらない。",
	"shop.item.paper.field": "野紙",
	"shop.item.paper.field.blurb": "既定。黄ばんだ廃土のノート。",
	"shop.item.paper.carbon": "カーボン",
	"shop.item.paper.carbon.blurb": "タイプライター色。字が硬い。",
	"shop.item.paper.ledger": "台帳",
	"shop.item.paper.ledger.blurb": "冷たいインク。死者を数える紙。",
	"shop.item.paper.ash": "灰",
	"shop.item.paper.ash.blurb": "焦げた暖色。焚火のそばで書いた。",
	"shop.item.frame.tape": "テープ枠",
	"shop.item.frame.tape.blurb": "壁から剥がした写真。",
	"shop.item.frame.rust": "錆縁",
	"shop.item.frame.rust.blurb": "鉄板から切った枠。",
	"shop.item.frame.brass": "真鍮",
	"shop.item.frame.brass.blurb": "古い写真館の残り。",
	"shop.item.pack.founder": "建国パック",
	"shop.item.pack.founder.blurb": "煙草四十本で紙と枠の全部と、標題の一行。食料は入っていない。命も入っていない。",
	"shop.wear": "つける",
	"shop.wearing": "使用中",
	"shop.support": "支援 {usd}",
	"shop.found.body": "v0.1 は金を取らない。建国パックは、生きた夜の煙草で全外見を換える。ゲームは易しくならない。",
	"shop.found.stats": "この端末",
	"shop.found.nights": "{n} 夜を生きた。一夜に煙草二本。",
	"shop.found.mark": "もう一晩・建国",
	"shop.note.have": "すでに持っている。",
	"shop.note.short": "煙草が足りない。夜を越せば二本落ちる。",
	"shop.note.bought": "煙草で払った。外見をつけた。",
	"shop.note.demo": "このプレビューは金を受け取れない。外見の試用解除で、この端末だけに残る。",
	"shop.demo": "v0.1 無料プロトタイプ。料金も試用制限もない。記録はこの端末。消したら終わり。"
};
var extraKo = {
	"ui.noise": "소음",
	"ui.region": "켄터키 — 중서부",
	"crash.title": "이 밤이 깨졌다",
	"crash.body": "화면이 한 번 죽었다. 진행은 이 기기에 남아 있다.",
	"crash.resume": "거점으로 돌아가기",
	"ui.anon": "무명",
	"stance.leader": "대장",
	"stance.friend": "동료",
	"stance.neutral": "중립",
	"stance.rival": "불안",
	"stance.hostile": "적대",
	"map.live": "실제 지도 · 핀치와 드래그",
	"map.homeShort": "집",
	"map.open": "미소탕",
	"roster.job": "일",
	"roster.kick": "내보낸다",
	"roster.moodNeed": " (정서 부족)",
	"build.cost": "{res} {n}",
	"sh.farmhouse.blurb": "켄터키 시골. 조용하지만 보급은 멀다.",
	"sh.hardware.blurb": "공구는 있다. 거리는 아니다.",
	"sh.highrise.blurb": "도시가 보인다. 계단은 피로 산다.",
	"fac.beds.effect": "수용 +1",
	"fac.kitchen.effect": "식량 소모 감소",
	"fac.water.effect": "매일 물",
	"fac.workshop.effect": "건설과 방벽",
	"fac.infirmary.effect": "치료와 감염 제거",
	"fac.garden.effect": "매일 식량",
	"fac.radio.effect": "지점/생존자 발견",
	"fac.watch.effect": "야습 감소",
	"toast.lead": "{name}이(가) 선두를 맡는다",
	"toast.loot": "획득 {bits}",
	"toast.empty": "거의 비어 있음",
	"death.torn": "임무에서 찢김",
	"death.survivor": "다른 생존자에게 습격당함",
	"death.firefight": "생존자와 총격",
	"death.raid": "야습",
	"death.infect": "감염이 진행됨",
	"death.starve": "갈증과 굶주림",
	"death.wound": "상처가 악화됨",
	"death.kick": "쫓겨난 뒤 실종",
	"end.loseBody": "{day}일차. 마지막 한 명도 돌아오지 않았다. 미국은 남아 있다. 너희를 기억하는 사람은 없다.",
	"end.winBody": "{day}일차. {loc}를 폐허에서 파냈다. 나라는 아직 폐허다. 이 도시에는 불이 있다.",
	"enc.body.grateful": "{name}이(가) 어둠에서 나온다. 손은 비었다. \"따라왔다. 쏘지 마. 요리든 망이든 뭐든 할게.\"",
	"enc.body.wary": "{name}이(가) 철관으로 문을 가리킨다. \"내가 먼저 봤다. 지나가려면 바꿔.\" 눈은 살아 있다. 물리지 않았다.",
	"enc.body.hostile": "어둠에서 장전 소리. {name}({occ})은(는) 이미 침입자로 본다. \"가방을 놔. 걸어. 아니면 남아.\"",
	"enc.body.hurt": "{name}이(가) 벽에 기대고, 정강이에서 피가 난다. 아직 깨어 있다. \"두고 가지 마. 부탁이야. 예전엔 {occ}였어.\"",
	"log.settle": "{name}({occ})이(가) {place}에 자리를 잡았다. 미국의 지도는 더 이상 그 지도가 아니다.",
	"log.noMoodGo": "나갈 정서가 있는 사람이 없다. 먼저 쉬어라.",
	"log.depart": "{names}이(가) {loc}({state})로 떠난다.",
	"log.died": "{name}이(가) 죽었다. {cause}",
	"log.grief": "죽음이 남은 사람 위에 앉는다.",
	"log.bitten": "{name}이(가) 물렸다. 상처가 더럽다.",
	"log.wipe": "분대가 전멸했다. {loc}가 삼켰다.",
	"log.fight": "{name}이(가) {zone}에서 싸워 {n}마리를 잡았다.",
	"log.bond": "{a}와 {b}는 이제 {rel}이다. 같이 산 밤이 맹세보다 단단하다.",
	"log.return": "분대가 {loc}에서 돌아왔다. {bag}",
	"log.emptyBag": "빈손.",
	"log.brought": "{bag}을(를) 가져왔다.",
	"log.fail": "임무 실패. {loc}가 사람과 가방을 같이 삼켰다.",
	"log.tooManyKills": "너무 많이 죽였다. 냄새가 안 지워진다.",
	"log.clear": "{loc}는 잠시 소탕됐다. 이사할 수 있다.",
	"log.full": "{name}이(가) 들어오려 했다. 만원이다.",
	"log.betray": "{name}이(가) 승낙한 척하다 손을 썼다.",
	"log.join": "{name}({occ})이(가) 합류했다.",
	"log.leave": "{name}을(를) 떠나보냈다.",
	"log.firefight": "{name}과(와) 총격. {zone}에서 쓰러졌다.",
	"log.move": "{old}를 떠나 {loc}({state})를 점령. 수용 {n}.",
	"log.noWork": "{name}의 정서가 낮아 일할 수 없다. 쉬어라.",
	"log.kick": "{name}을(를) 내보냈다. 문이 닫혔다.",
	"log.upgrade": "{fac}이(가) {n}레벨이 됐다.",
	"log.lieDown": "{name}의 정서가 낮다. 오늘 밤은 눕기만 한다.",
	"log.nightDeath": "{name}이(가) 밤에 죽었다. {cause}.",
	"log.skillUp": "{name}의 손이 조금 늘었다.",
	"log.clearedInfect": "{who}이(가) {name}의 감염을 지웠다.",
	"log.radioLoc": "잡음 뒤에 좌표가 떨어졌다 — {loc}({state}).",
	"log.radioPerson": "폐주파수에서 목소리가 걸어왔다. {name}이(가) 문을 찾았다.",
	"log.raid": "야습. 벽 틈으로 들어왔다.",
	"log.hungry": "식량이 부족하다. 누군가 배고프게 잤다. 정서가 떨어졌다.",
	"log.thirsty": "물이 부족하다. 밤에 목이 탄다.",
	"log.harvest": "텃밭과 주방이 식량 {n}을 냈다.",
	"gear.stash": "창고",
	"gear.stashEmpty": "창고가 비었다. 장비는 출격에서 떨어진다.",
	"gear.equip": "착용",
	"gear.unequip": "해제",
	"gear.none": "없음",
	"gear.bare": "비어 있다.",
	"gear.emptySlot": "이 부위의 물건이 창고에 없다.",
	"gear.bag": "장비 {n}",
	"gear.slot.weapon": "무기",
	"gear.slot.head": "머리",
	"gear.slot.body": "몸",
	"gear.slot.hands": "손",
	"gear.slot.legs": "다리",
	"gear.slot.feet": "발",
	"gear.slot.back": "등",
	"gear.rarity.common": "일반",
	"gear.rarity.uncommon": "고급",
	"gear.rarity.rare": "희귀",
	"gear.rarity.epic": "영웅",
	"gear.rarity.legendary": "전설",
	"log.gear": "장비 {n}：{bits}",
	"log.repair": "{name}이 공방에서 장비를 고쳤다.",
	"roster.gear": "장비",
	"loc.muldraugh_farm.blurb": "시작 농가. 마당, 헛간, 진흙길.",
	"loc.muldraugh_farm.desc": "첫 집. 헛간에 씨앗. 길에 가끔 배회자가 있다.",
	"loc.westpoint_shop.blurb": "메인스트리트 철물점.",
	"loc.westpoint_shop.desc": "공구와 목재의 옛집. 유리가 깨지면 소리가 멀리 간다.",
	"loc.louisville_apt.blurb": "시내 아파트.",
	"loc.louisville_apt.desc": "6층은 거의 안전하다. 계단은 다른 이야기다.",
	"loc.rosewood_pd.blurb": "총기함, 감방, 서명 없는 보고서.",
	"loc.rosewood_pd.desc": "작은 경찰서. 탄약은 아직 잠겨 있을지도. 복도 끝에 끄는 소리.",
	"loc.muldraugh_wh.blurb": "팔레트, 지게차, 안 연 캔.",
	"loc.muldraugh_wh.desc": "물류 창고. 식량과 자재 더미. 안의 것들도 더미다.",
	"loc.riverside_mart.blurb": "마을 상점. 첫 수업.",
	"loc.riverside_mart.desc": "선반이 쓰러졌다. 냉동고는 아직 떨어진다. 처음 가는 곳이 제일 가르친다.",
	"loc.westpoint_town.blurb": "총포상, 주유소, 죽은 메인스트리트.",
	"loc.westpoint_town.desc": "켄터키 마을 중심. 기름과 탄. 루이빌에서 흘러온 시체 물결도.",
	"loc.march_ridge.blurb": "게이트 단지. 누군가 지키려 했다.",
	"loc.march_ridge.desc": "철문이 반쯤 열렸다. 비지 않았다 — 쪽지와 이빨 자국.",
	"loc.louisville_er.blurb": "약은 남아 있다. 다른 것도.",
	"loc.louisville_er.desc": "응급실 문이 열려 있다. 들것이 경사에 끼었다. 약국이 이 도시에서 제일 비싼 방이다.",
	"loc.louisville_mall.blurb": "소비의 무덤.",
	"loc.louisville_mall.desc": "에스컬레이터가 중간에 멈췄다. 카트와 식물이 바닥을 다툰다. 식량, 옷, 너무 많은 메아리.",
	"loc.fort_knox.blurb": "금은 없다. 총은 있다.",
	"loc.fort_knox.desc": "철조망 뒤. 무기고는 전설. 보초는 더 이상 보초가 아니다.",
	"loc.cincinnati.blurb": "강을 건너면 다른 주다.",
	"loc.cincinnati.desc": "다리는 남았다. 떠 있는 건 나무만이 아니다. 시내에서 누군가 무전으로 노래한다.",
	"loc.indianapolis.blurb": "레이스가 멈췄다.",
	"loc.indianapolis.desc": "순환도로가 막혔다. 시내 차고에 아직 빨간 불 — 누군가 지키고 있다.",
	"loc.nashville.blurb": "음악이 끝난 뒤, 메아리만.",
	"loc.nashville.desc": "네온은 죽었다. 레코드점에 누군가 진을 쳤다. 기타와 시체 셋.",
	"loc.memphis.blurb": "미시시피의 남문.",
	"loc.memphis.desc": "항구 컨테이너가 무덤 같다. 강바람이 냄새를 실어 나른다. 건너편에 배가 있다고 한다.",
	"loc.stlouis.blurb": "아치는 남았다. 도시는 아니다.",
	"loc.stlouis.desc": "아치 그늘에 열댓 명의 캠프 — 손님을 반긴다는 법은 없다.",
	"loc.chicago.blurb": "바람의 도시. 여기를 점령해야 진짜 도시다.",
	"loc.chicago.desc": "호숫바람, 고층, 전기 없는 지하철. 여기를 쓸면 중서부에 진짜 집이 생긴다.",
	"ui.comma": ", ",
	"ch.searchQuiet": "은밀히 수색",
	"ch.searchQuietHint": "느리고 조용하다. 물건은 적다.",
	"ch.searchLoud": "철저히 뒤진다",
	"ch.searchLoudHint": "빠르고 시끄럽다. 물건은 많다.",
	"ch.fight": "좀비를 치운다",
	"ch.fightHint": "숫자를 줄여야 점령할 수 있다",
	"ch.next": "다음 구역",
	"ch.extract": "가방을 들고 돌아간다",
	"ch.melee": "근접",
	"ch.meleeHint": "조용하다. 다치기 쉽다.",
	"ch.gun": "사격",
	"ch.gunHint": "탄, 소음, 효과 · 탄약 {n}",
	"ch.flank": "우회",
	"ch.flankHint": "은밀이 필요하다",
	"ch.back": "아직 안 싸운다",
	"ch.clearRest": "나머지를 쓸어라",
	"ch.goHome": "집으로",
	"ch.contact": "접촉 · {n}마리",
	"ch.clearedTitle": "소탕",
	"ch.endTitle": "끝",
	"ch.meet": "맞선다",
	"ch.fleeNow": "즉시 철수",
	"ch.otherRoom": "먼저 방을 바꾼다",
	"flav.0": "{zone}은(는) 어둡다. 공기가 끈적하다. 살다가 급히 떠난 자리.",
	"flav.1": "{zone}에 발을 들인다. 바닥에 끌린 자국이 안으로 간다.",
	"flav.2": "{zone}이(가) 너무 조용하다. 멀리서 금속이 한 번 부딪히고 그친다.",
	"flav.3": "{zone}의 문. 먼지, 단내, 아직 멀리 가지 않은 발소리.",
	"flav.zeds": "이 건물에 아직 {n}마리가 있을 것이다.",
	"flav.quiet": "끄는 소리가 없다. 정말 비었을지도.",
	"txt.fightCleared": "이 일대는 잠시 깨끗하다. 뒤져도, 떠나도 된다.",
	"txt.fightBody": "{zone} 안에서 무언가가 고개를 돌린다. 어떻게 치느냐가, 여기가 집이 될지를 가른다.",
	"txt.hold": "아직 안 친다. 수색하거나 물러날 수 있다.",
	"txt.endBody": "뒤질 방은 다 걸었다. 쓸거나, 점령하거나, 가방을 들고 가라.",
	"txt.win": "{name}이(가) {n}마리를 처리했다. 남은 수 {left}.",
	"txt.ok": "이겼지만 깨끗하지 않다. {n}마리, 남은 수 {left}. {name}의 숨이 거칠다.",
	"txt.bad": "{name}이(가) 거의 깔렸다. {n}마리, 남은 수 {left}. 철수할지 정해라.",
	"txt.canOccupy": "끄는 소리가 없다. 원하면 다음 대피소가 된다.",
	"txt.loudFind": "{name}이(가) 서랍을 다 열었다. 소리가 크다. 발견: {found}.",
	"txt.quietFind": "{name}이(가) 벽을 따라 뒤졌다. 발견: {found}.",
	"txt.sneak": "거의 소리를 내지 않았다.",
	"txt.empty": "거의 비어 있음",
	"txt.heard": "밖에서 신음이 답한다. 들었다.",
	"txt.fullHouse": "{name}이(가) 인원을 본다. \"만원이다. 알아서 할게.\" 복도로 사라졌다.",
	"txt.betray": "{name}이(가) 덤빈다. 짧다. 사람은 달아나고 가방은 남는다.",
	"txt.joinWalk": "{name}이(가) 끄덕이고 가방을 멘다. \"걷자. 여기서 혼자 죽고 싶지 않아.\"",
	"txt.turnedAway": "{name}이(가) 욕하고 어둠으로 물러난다. 다시 만날지도.",
	"txt.tradeOk": "식량을 던졌다. {name}이(가) 약 봉지를 던지고 사라진다.",
	"txt.tradeEmpty": "{name}이(가) 빈 주머니를 보고 침을 뱉고 간다.",
	"txt.shot": "{zone}에서 총성이 두 번 튄다. {name}은(는) 움직이지 않는다. 사냥꾼은 너희만이 아니다.",
	"create.rolled": "뽑힌 사람",
	"create.reroll": "다시 뽑기",
	"create.tweak": "직접 조정",
	"create.free": "무료 특성",
	"create.freeShort": "직업",
	"create.occTrait": "직업 특성",
	"create.leftOver": "남은 기술 점수 {n}",
	"create.points": "시작 {n}",
	"create.occHint": "직업은 선천 기술과 점수, 가끔 무료 특성. 마이너스는 단점으로 메운다.",
	"occ.officer.en": "Police Officer",
	"occ.firefighter.desc": "도끼·체력·질주·힘 각 +1. 시작 0. 무료 특성 없음.",
	"occ.doctor.desc": "응급 +6, 단검 +1. 시작 0. 전투는 따로.",
	"occ.officer.desc": "조준 +4, 날렵함과 재장전 +1. 시작 −4. 총이 직업병.",
	"occ.chef.desc": "요리 +4. 시작 −2. 무료 요리 달인 — 상한 것도 뜨거운 밥이 된다.",
	"occ.mechanic.desc": "기계 +4, 용접 +1. 시작 −4. 무료 차량 지식.",
	"occ.farmer.desc": "농사 +4, 힘 +1. 시작 0. 무료 특성 없음.",
	"occ.veteran.desc": "가장 비싼 직업. 조준과 재장전 +2. 시작 −8. 무료 둔감. 단점으로 메워야 한다.",
	"occ.burglar.desc": "가벼운 발·날렵·은밀 각 +2. 시작 −6. 무료 도둑: 창문이 더 조용하다.",
	"trait.athletic": "운동선수",
	"trait.athletic.blurb": "오래 달린다. 타격이 안정. 십 점. 값하다.",
	"trait.stout": "건장",
	"trait.stout.blurb": "힘은 충분. 극한까지는 필요 없다.",
	"trait.hunter": "사냥꾼",
	"trait.hunter.blurb": "조준, 은밀, 사냥감 손질.",
	"trait.thickskinned": "두꺼운 가죽",
	"trait.thickskinned.blurb": "할퀴고 물기가 잘 안 들어간다.",
	"trait.keenhearing": "예민한 청각",
	"trait.keenhearing.blurb": "보기 전에 들린다.",
	"trait.brawler": "싸움꾼",
	"trait.brawler.blurb": "도끼와 몽둥이는 손의 연장.",
	"trait.gymnast": "체조",
	"trait.gymnast.blurb": "발걸음과 회피가 같은 일.",
	"trait.organized": "정리",
	"trait.organized.blurb": "가방에 칸이 하나 더 있다.",
	"trait.inconspicuous": "눈에 안 띔",
	"trait.inconspicuous.blurb": "그것들이 잘 못 본다.",
	"trait.adrenaline": "아드레날린",
	"trait.adrenaline.blurb": "피가 적을수록 더 빠르다.",
	"trait.wakeful": "적게 잠",
	"trait.wakeful.blurb": "잠이 적고 깨어남이 빠르다.",
	"trait.catseyes": "고양이 눈",
	"trait.catseyes.blurb": "밤에도 서랍이 읽힌다.",
	"trait.dextrous": "손놀림",
	"trait.dextrous.blurb": "가방 드나듦이 빠르다.",
	"trait.lighteater": "소식",
	"trait.lighteater.blurb": "적게 먹어도 버틴다.",
	"trait.lowthirst": "갈증 적음",
	"trait.lowthirst.blurb": "물은 아껴도 된다.",
	"trait.outdoorsman": "야외",
	"trait.outdoorsman.blurb": "바람과 비에 잘 안 진다.",
	"trait.gardener": "정원사",
	"trait.gardener.blurb": "씨앗을 언제 넣을지 안다.",
	"trait.irongut": "강철 위",
	"trait.irongut.blurb": "상한 것도 일이 잘 안 된다.",
	"trait.unfit": "체력 부족",
	"trait.unfit.blurb": "두 걸음이면 무너진다. 십 점은 달콤하고 목숨은 얇다.",
	"trait.thinskinned": "얇은 가죽",
	"trait.thinskinned.blurb": "한 번에 찢어진다. 큰 점수, 큰 위험.",
	"trait.slowhealer": "회복 느림",
	"trait.slowhealer.blurb": "상처가 안 아문다.",
	"trait.underweight": "저체중",
	"trait.underweight.blurb": "바람에 흔들린다.",
	"trait.overweight": "과체중",
	"trait.overweight.blurb": "달리기가 무겁다.",
	"trait.highthirst": "갈증",
	"trait.highthirst.blurb": "물을 더 들고. 이제 두 점뿐이다.",
	"trait.hemophobic": "혈액 공포",
	"trait.hemophobic.blurb": "자기 피에도 손이 멈춘다.",
	"trait.asthmatic": "숨참",
	"trait.asthmatic.blurb": "숨이 돌아오기 전에 다음 한 대.",
	"trait.conspicuous": "눈에 띔",
	"trait.conspicuous.blurb": "그것들이 먼저 본다.",
	"trait.heartyappetite": "대식",
	"trait.heartyappetite.blurb": "남보다 많이 먹는다.",
	"trait.proneillness": "잘 아픔",
	"trait.proneillness.blurb": "감염이 빠르다.",
	"trait.unlucky": "불운",
	"trait.unlucky.blurb": "서랍은 늘 비어 있다.",
	"trait.weakstomach": "약한 위",
	"trait.weakstomach.blurb": "안 익은 건 건드리지 마라.",
	"trait.allthumbs": "서툰 손",
	"trait.allthumbs.blurb": "가방 것이 늘 걸린다.",
	"trait.shortsighted": "근시",
	"trait.shortsighted.blurb": "먼 것이 번진다.",
	"trait.sleepyhead": "잠꾸러기",
	"trait.sleepyhead.blurb": "자도 자도 부족하다.",
	"trait.desensitized": "둔감",
	"trait.desensitized.blurb": "거의 공황이 없다. 퇴역군인의 직업병.",
	"trait.keencook": "요리 달인",
	"trait.keencook.blurb": "상한 것도 뜨거운 밥이 된다.",
	"trait.burglarhands": "도둑",
	"trait.burglarhands.blurb": "창문이 더 조용하다. 뒤지기가 깔끔하다.",
	"trait.vehicleknow": "차량 지식",
	"trait.vehicleknow.blurb": "엔진과 철판이 따른다.",
	"shop.title": "회시",
	"shop.kicker": "목숨은 안 판다",
	"shop.tab.law": "원칙",
	"shop.tab.look": "외관",
	"shop.tab.found": "건국",
	"shop.hubLink": "회시 · 밤으로 종이를 바꾼다",
	"shop.law.body": "v0.1은 무료다. 끝까지 플레이할 수 있다. 돈으로 맥박은 못 산다. 맛은 굶주림, 영구 사망, 정서다. 회시는 종이와 액자만 판다. 담배는 살아낸 밤에 떨어진다. 식량도 목숨도 안 판다.",
	"shop.law.ok": "팔 수 있는 것: 종이, 액자, 건국 인장. 나중에 지도나 직업 팩도 여기로 — 새 페이지지, 새 힘이 아니다.",
	"shop.ban.revive": "부활은 안 판다. 죽은 사람은 죽은 사람이다.",
	"shop.ban.food": "식량, 물, 약, 탄약은 안 판다. 뒤져라.",
	"shop.ban.points": "기능 점수, 직업, 특성은 안 판다. 직접 골라라.",
	"shop.ban.energy": "출정 횟수는 안 판다. 정서가 문을 지킨다.",
	"shop.ban.gacha": "생존자 가챠는 없다. 사람은 폐허에서 만난다.",
	"shop.ban.bond": "호감은 안 판다. 같이 산 밤은 못 산다.",
	"shop.look.body": "종이는 일기 색을 바꾼다. 액자는 얼굴에 얹힌다. 피해, 수색, 기분은 그대로다.",
	"shop.item.paper.field": "들판 종이",
	"shop.item.paper.field.blurb": "기본. 누렇게 뜬 폐허 노트.",
	"shop.item.paper.carbon": "카본",
	"shop.item.paper.carbon.blurb": "타자기 색. 글자가 딱딱하다.",
	"shop.item.paper.ledger": "장부",
	"shop.item.paper.ledger.blurb": "차가운 잉크. 죽은 자를 세는 종이.",
	"shop.item.paper.ash": "재",
	"shop.item.paper.ash.blurb": "탄 가장자리. 모닥불 옆에서 썼다.",
	"shop.item.frame.tape": "테이프 액자",
	"shop.item.frame.tape.blurb": "벽에서 뜯은 사진.",
	"shop.item.frame.rust": "녹슨 테",
	"shop.item.frame.rust.blurb": "철판을 잘라 만든 테.",
	"shop.item.frame.brass": "놋쇠",
	"shop.item.frame.brass.blurb": "옛 사진관의 남은 것.",
	"shop.item.pack.founder": "건국 팩",
	"shop.item.pack.founder.blurb": "담배 마흔 개로 모든 종이와 액자, 표지의 한 줄. 식량은 없다. 목숨도 없다.",
	"shop.wear": "착용",
	"shop.wearing": "사용 중",
	"shop.support": "지원 {usd}",
	"shop.found.body": "v0.1은 돈을 받지 않는다. 건국 팩은 살아낸 밤의 담배로 전 외관을 바꾼다. 게임이 쉬워지지 않는다.",
	"shop.found.stats": "이 기기",
	"shop.found.nights": "{n} 밤을 살았다. 하룻밤에 담배 두 개.",
	"shop.found.mark": "하룻밤 더 건국",
	"shop.note.have": "이미 있다.",
	"shop.note.short": "담배가 부족하다. 밤을 넘기면 두 개가 떨어진다.",
	"shop.note.bought": "담배로 샀다. 외관을 착용했다.",
	"shop.note.demo": "이 미리보기는 돈을 받을 수 없다. 외관 시험 해금이며 이 기기에만 남는다.",
	"shop.demo": "v0.1 무료 프로토타입. 요금도 체험 제한도 없다. 저장은 이 기기. 지우면 끝이다."
};
var v03Zh = {
	"ap.label": "行動",
	"ap.of": "{n} / {max}",
	"ap.none": "今天的行動用完了。任務中只能撤離，據點只能過夜。",
	"ap.noneShort": "行動用盡 · 先過夜",
	"ap.need": "需要 {n} 格行動",
	"ap.cost": "行動 {n}",
	"ap.extract": "不耗行動",
	"ap.sleepHint": "過夜會補滿行動格。",
	"threat.quiet": "安靜",
	"threat.elevated": "提高",
	"threat.danger": "危險",
	"threat.horde": "屍潮風險",
	"threat.severe": "嚴重",
	"threat.label": "威脅",
	"log.lootDry": "這裡能搜的都搜過了。貨架是空的。",
	"log.wander": "{loc}又有拖步聲。清過的地方也不永遠安靜。",
	"log.repairWall": "補強圍牆到 {n}。",
	"log.fleeBag": "跑太急，袋子漏了一截。",
	"log.fleeHurt": "{name}在撤退時被抓傷。",
	"log.raidHard": "第二波從牆縫擠進來。",
	"log.rot": "存糧發霉了，丟了 {n}。",
	"log.discard": "丟掉{name}。",
	"log.discardSalvage": "拆掉{name}，收回建材 {n}。",
	"death.flee": "撤退時被拖走。",
	"build.repairWall": "修牆",
	"build.repairWallHint": "建材 2 · 行動 1。牆高，夜襲少。",
	"build.repairWallGo": "修 · 建材 2",
	"build.apNeed": "行動不足",
	"build.apCost": "行動 {n}",
	"hub.apGone": "今天能做的都做完了。過夜，明天再出門。",
	"hub.aim": "撐過今晚只是開始。清據點、搬去更大的房子。終點是佔領芝加哥。",
	"hub.aimLate": "終盤：殺光{loc}的僵屍並佔領它。地圖上還有僵屍的地方不是已清場。",
	"map.noAp": "行動用盡",
	"ch.searchQuietHint": "極安靜。戰利品大約只有徹底翻找的四成。",
	"ch.searchLoudHint": "吵。東西多，也更容易引來僵屍。",
	"roster.hint": "護甲減傷，防咬減感染，背包加搜刮量，噪音會引怪，疲勞過夜更累。倉庫可以丟掉用不到的裝備。",
	"gear.hint": "護甲減傷害。防咬減感染。背包加搜刮。噪音會引僵屍。疲勞過夜更累。工坊修得慢，壞了就丟掉。",
	"gear.discard": "丟掉",
	"gear.discardHint": "丟掉。完好度 40 以上會拆成 1 建材。",
	"gear.stat.atk": "近戰 {n}",
	"gear.stat.gun": "槍",
	"gear.stat.arm": "護甲 {n}",
	"gear.stat.bite": "防咬 {n}",
	"gear.stat.cmb": "戰鬥 {n}",
	"gear.stat.sth": "潛行 {n}",
	"gear.stat.scv": "搜刮 {n}",
	"gear.stat.med": "醫療 {n}",
	"gear.stat.bld": "建造 {n}",
	"gear.stat.frm": "農耕 {n}",
	"gear.stat.ck": "烹飪 {n}",
	"gear.stat.bag": "負重 {n}",
	"gear.stat.fat": "疲勞 {n}",
	"gear.stat.noise": "噪音 {n}",
	"ui.ver": "v0.3 · 一天六格行動",
	"fb.openBtn": "回報問題（v0.2）",
	"fb.kicker": "v0.2",
	"fb.close": "關閉",
	"fb.title": "先收問題，再一併改",
	"fb.body": "玩到卡住、看不懂、或覺得爛的，寫下來。會連同存檔狀況複製，貼到 itch 留言或傳給我。",
	"fb.q": "你的問題",
	"fb.ph": "例如：醫務室按不了、圍牆不知道做什麼…",
	"fb.copy": "複製回報",
	"fb.copied": "已複製，去貼上",
	"fb.where": "貼到 itch 專案留言，或 WhatsApp 給作者。不要只說「有 bug」，寫你在哪一天、按了什麼。",
	"fb.inbox": "已收到",
	"fb.preview": "預覽已修，v0.3 一併算",
	"fb.open": "待處理",
	"bible.openBtn": "遊戲資料庫",
	"bible.kicker": "資料",
	"bible.close": "關閉",
	"bible.title": "遊戲資料庫",
	"bible.body": "地點、職業、裝備、公式。JSON / CSV 可下載。給作者核對用。",
	"bible.json": "下載 JSON",
	"bible.csv": "下載 CSV",
	"bible.search": "搜尋",
	"bible.empty": "沒有符合的列。",
	"bible.edit": "改數字請改資料檔，不要在這裡改。",
	"build.lack": "還差 {res} {n}",
	"hub.wallNote": "圍牆 {n}。牆低，過夜容易被襲。派人修繕或警戒，或花建材現補。",
	"hub.wallShort": "牆低會夜襲"
};
var v03En = {
	"ap.label": "ACTIONS",
	"ap.of": "{n} / {max}",
	"ap.none": "No actions left. On a run you can only extract. At home you can only sleep.",
	"ap.noneShort": "No actions · sleep",
	"ap.need": "Needs {n} AP",
	"ap.cost": "{n} AP",
	"ap.extract": "Free",
	"ap.sleepHint": "Sleep refills actions.",
	"threat.quiet": "Quiet",
	"threat.elevated": "Elevated",
	"threat.danger": "Danger",
	"threat.horde": "Horde risk",
	"threat.severe": "Severe",
	"threat.label": "Threat",
	"log.lootDry": "The shelves are empty. Nothing left to take.",
	"log.wander": "Footsteps at {loc}. Cleared is not safe forever.",
	"log.repairWall": "Walls patched to {n}.",
	"log.fleeBag": "You ran. The bag tore. Some of it is gone.",
	"log.fleeHurt": "{name} got clawed on the way out.",
	"log.raidHard": "A second wave pushed through the wall.",
	"log.rot": "Food spoiled. Lost {n}.",
	"log.discard": "Threw away {name}.",
	"log.discardSalvage": "Broke down {name}. Salvaged materials {n}.",
	"death.flee": "Dragged down on the way out.",
	"build.repairWall": "Repair wall",
	"build.repairWallHint": "2 materials · 1 action. Higher walls, fewer night raids.",
	"build.repairWallGo": "Patch · 2 mats",
	"build.apNeed": "No actions",
	"build.apCost": "{n} AP",
	"hub.apGone": "That's all you can do today. Sleep, then go out tomorrow.",
	"hub.aim": "Lasting the night is the start. Clear sites. Move to a bigger house. The end is Chicago.",
	"hub.aimLate": "Endgame: kill every zombie in {loc} and occupy it. If the map still has zombies, it is not cleared.",
	"map.noAp": "No actions left",
	"ch.searchQuietHint": "Very quiet. About 40% of a loud search.",
	"ch.searchLoudHint": "Loud. More loot. More zombies hear you.",
	"roster.hint": "Armor cuts hits. Bite resist cuts infection. Pack size is loot. Noise draws them. Fatigue hurts the next night. Throw unused kit from the stash.",
	"gear.hint": "Armor cuts damage. Bite resist cuts infection. Pack size is loot. Noise draws zombies. Fatigue hits harder overnight. The workshop mends slowly. Throw junk away.",
	"gear.discard": "Trash",
	"gear.discardHint": "Throw away. Condition 40+ salvages 1 material.",
	"gear.stat.atk": "Melee {n}",
	"gear.stat.gun": "Gun",
	"gear.stat.arm": "Armor {n}",
	"gear.stat.bite": "Bite {n}",
	"gear.stat.cmb": "Combat {n}",
	"gear.stat.sth": "Stealth {n}",
	"gear.stat.scv": "Scavenge {n}",
	"gear.stat.med": "Medical {n}",
	"gear.stat.bld": "Build {n}",
	"gear.stat.frm": "Farm {n}",
	"gear.stat.ck": "Cook {n}",
	"gear.stat.bag": "Carry {n}",
	"gear.stat.fat": "Fatigue {n}",
	"gear.stat.noise": "Noise {n}",
	"ui.ver": "v0.3 · six actions a day",
	"fb.openBtn": "Report a problem (v0.2)",
	"fb.kicker": "v0.2",
	"fb.close": "Close",
	"fb.title": "Collect first. Patch later.",
	"fb.body": "Stuck, unclear, or bad: write it down. This copies a save snapshot for itch comments or a message to me.",
	"fb.q": "Your question",
	"fb.ph": "e.g. infirmary won't build, walls do nothing…",
	"fb.copy": "Copy report",
	"fb.copied": "Copied. Paste it.",
	"fb.where": "Paste on the itch page, or WhatsApp the author. Don't just say \"bug\". Say the day and the button.",
	"fb.inbox": "Received",
	"fb.preview": "Fixed in preview. Counts for v0.3.",
	"fb.open": "Open",
	"bible.openBtn": "Game data",
	"bible.kicker": "Data",
	"bible.close": "Close",
	"bible.title": "Game bible",
	"bible.body": "Places, jobs, kit, formulas. JSON / CSV download. For the author to check.",
	"bible.json": "JSON",
	"bible.csv": "CSV",
	"bible.search": "Search",
	"bible.empty": "No matching rows.",
	"bible.edit": "Change numbers in the data files, not here.",
	"build.lack": "Need {res} {n}",
	"hub.wallNote": "Wall {n}. Low walls get raided at night. Assign repair or guard, or spend materials now.",
	"hub.wallShort": "Low walls get raided"
};
var v03Ja = {
	"ap.label": "行動",
	"ap.of": "{n} / {max}",
	"ap.none": "今日の行動は尽きた。任務では撤退だけ、避難所では眠るだけ。",
	"ap.noneShort": "行動切れ · まず眠れ",
	"ap.need": "行動 {n} 必要",
	"ap.cost": "行動 {n}",
	"ap.extract": "消費なし",
	"ap.sleepHint": "眠れば行動が戻る。",
	"threat.quiet": "静か",
	"threat.elevated": "警戒",
	"threat.danger": "危険",
	"threat.horde": "大群のリスク",
	"threat.severe": "深刻",
	"threat.label": "脅威",
	"log.lootDry": "漁れるものはもうない。棚は空だ。",
	"log.wander": "{loc}にまた足音。掃討済みでも永遠に安全ではない。",
	"log.repairWall": "防壁を {n} まで直した。",
	"log.fleeBag": "逃げ急いだ。袋が破れて中身が落ちた。",
	"log.fleeHurt": "撤退中、{name}が引っ掻かれた。",
	"log.raidHard": "第二波が壁の隙間から入ってきた。",
	"log.rot": "食料が腐った。{n}失った。",
	"log.discard": "{name}を捨てた。",
	"log.discardSalvage": "{name}を分解し、資材 {n} を回収した。",
	"death.flee": "撤退中に引きずられた。",
	"build.repairWall": "壁を直す",
	"build.repairWallHint": "資材 2 · 行動 1。壁が高いほど夜襲は減る。",
	"build.repairWallGo": "修繕 · 資材 2",
	"build.apNeed": "行動不足",
	"build.apCost": "行動 {n}",
	"hub.apGone": "今日できることは終わった。眠って、明日出よ。",
	"hub.aim": "今夜を越すのは始まりだ。拠点を掃討し、もっと大きな家へ移れ。終点はシカゴ。",
	"hub.aimLate": "終盤：{loc}のゾンビを全滅させ、占拠せよ。地図にゾンビが残っていれば掃討済みではない。",
	"map.noAp": "行動切れ",
	"ch.searchQuietHint": "極めて静か。徹底捜索の約四割しか取れない。",
	"ch.searchLoudHint": "うるさい。物は多い。ゾンビにも聞こえる。",
	"roster.hint": "装甲は被弾を減らす。咬み耐性は感染を減らす。バッグは持ち帰り量。騒音は敵を呼ぶ。疲労は翌朝に響く。倉庫から不要な装備を捨てられる。",
	"gear.hint": "装甲はダメージ減。咬み耐性は感染減。バッグは持ち帰り。騒音はゾンビを呼ぶ。疲労は夜通し響く。工房の修理は遅い。ゴミは捨てろ。",
	"gear.discard": "捨てる",
	"gear.discardHint": "捨てる。耐久 40 以上なら資材 1 に分解。",
	"gear.stat.atk": "近接 {n}",
	"gear.stat.gun": "銃",
	"gear.stat.arm": "装甲 {n}",
	"gear.stat.bite": "耐咬 {n}",
	"gear.stat.cmb": "戦闘 {n}",
	"gear.stat.sth": "隠密 {n}",
	"gear.stat.scv": "漁り {n}",
	"gear.stat.med": "医療 {n}",
	"gear.stat.bld": "工作 {n}",
	"gear.stat.frm": "農耕 {n}",
	"gear.stat.ck": "料理 {n}",
	"gear.stat.bag": "荷重 {n}",
	"gear.stat.fat": "疲労 {n}",
	"gear.stat.noise": "騒音 {n}",
	"ui.ver": "v0.3 · 一日六行動",
	"fb.openBtn": "問題を報告（v0.2）",
	"fb.kicker": "v0.2",
	"fb.close": "閉じる",
	"fb.title": "まず集めて、あとで直す",
	"fb.body": "詰まった、分からない、ひどい。書いておけ。セーブ状況もコピーして、itch か作者に貼れ。",
	"fb.q": "あなたの問題",
	"fb.ph": "例：医務室が建てられない、壁の意味が分からない…",
	"fb.copy": "報告をコピー",
	"fb.copied": "コピーした。貼れ。",
	"fb.where": "itch のコメントか WhatsApp で作者へ。「バグ」だけはダメ。何日目、何を押したかを書け。",
	"fb.inbox": "受信",
	"fb.preview": "プレビューで修正済み。v0.3 に含む。",
	"fb.open": "未処理",
	"bible.openBtn": "ゲーム資料",
	"bible.kicker": "資料",
	"bible.close": "閉じる",
	"bible.title": "ゲーム資料庫",
	"bible.body": "場所、職業、装備、式。JSON / CSV を落とせる。作者の確認用。",
	"bible.json": "JSON",
	"bible.csv": "CSV",
	"bible.search": "検索",
	"bible.empty": "該当なし。",
	"bible.edit": "数字は資料ファイルで変えろ。ここでは変えるな。",
	"build.lack": "{res} が {n} 不足",
	"hub.wallNote": "防壁 {n}。低いと夜襲。修繕か警戒を割り当てるか、今すぐ資材で直せ。",
	"hub.wallShort": "壁が低いと夜襲"
};
var v03Ko = {
	"ap.label": "행동",
	"ap.of": "{n} / {max}",
	"ap.none": "오늘의 행동이 다 떨어졌다. 임무에서는 철수만, 거점에서는 잠만.",
	"ap.noneShort": "행동 소진 · 먼저 자라",
	"ap.need": "행동 {n} 필요",
	"ap.cost": "행동 {n}",
	"ap.extract": "소모 없음",
	"ap.sleepHint": "자면 행동이 찬다.",
	"threat.quiet": "조용",
	"threat.elevated": "경계",
	"threat.danger": "위험",
	"threat.horde": "무리 위험",
	"threat.severe": "심각",
	"threat.label": "위협",
	"log.lootDry": "뒤질 게 없다. 선반은 비었다.",
	"log.wander": "{loc}에 다시 발소리가 난다. 청소했다고 영원한 안전은 아니다.",
	"log.repairWall": "방벽을 {n}까지 고쳤다.",
	"log.fleeBag": "급히 뛰었다. 가방이 찢어져 일부가 빠졌다.",
	"log.fleeHurt": "철수 중에 {name}이(가) 긁혔다.",
	"log.raidHard": "두 번째 파도가 벽 틈으로 들어왔다.",
	"log.rot": "식량이 썩었다. {n} 버렸다.",
	"log.discard": "{name}을(를) 버렸다.",
	"log.discardSalvage": "{name}을(를) 분해해 자재 {n}을(를) 건졌다.",
	"death.flee": "철수 중에 끌려갔다.",
	"build.repairWall": "벽 수리",
	"build.repairWallHint": "자재 2 · 행동 1. 벽이 높을수록 야습이 적다.",
	"build.repairWallGo": "수리 · 자재 2",
	"build.apNeed": "행동 부족",
	"build.apCost": "행동 {n}",
	"hub.apGone": "오늘 할 수 있는 일은 끝났다. 자고, 내일 나가라.",
	"hub.aim": "오늘 밤을 넘기는 건 시작일 뿐이다. 거점을 청소하고 더 큰 집으로 옮겨라. 끝은 시카고다.",
	"hub.aimLate": "종반: {loc}의 좀비를 전멸시키고 점령하라. 지도에 좀비가 남아 있으면 소탕된 게 아니다.",
	"map.noAp": "행동 소진",
	"ch.searchQuietHint": "아주 조용하다. 철저 수색의 약 40%만 나온다.",
	"ch.searchLoudHint": "시끄럽다. 물건은 많다. 좀비도 듣는다.",
	"roster.hint": "장갑은 피해를 줄인다. 물림 저항은 감염을 줄인다. 배낭은 수거량. 소음은 적을 부른다. 피로는 다음날 남는다. 창고에서 안 쓰는 장비를 버릴 수 있다.",
	"gear.hint": "장갑은 피해 감소. 물림 저항은 감염 감소. 배낭은 수거량. 소음은 좀비를 부른다. 피로는 밤에 더 아프다. 공방 수리는 느리다. 쓰레기는 버려라.",
	"gear.discard": "버리기",
	"gear.discardHint": "버린다. 내구 40 이상이면 자재 1로 분해.",
	"gear.stat.atk": "근접 {n}",
	"gear.stat.gun": "총",
	"gear.stat.arm": "장갑 {n}",
	"gear.stat.bite": "물림 {n}",
	"gear.stat.cmb": "전투 {n}",
	"gear.stat.sth": "은신 {n}",
	"gear.stat.scv": "수색 {n}",
	"gear.stat.med": "의료 {n}",
	"gear.stat.bld": "건설 {n}",
	"gear.stat.frm": "농사 {n}",
	"gear.stat.ck": "요리 {n}",
	"gear.stat.bag": "휴대 {n}",
	"gear.stat.fat": "피로 {n}",
	"gear.stat.noise": "소음 {n}",
	"ui.ver": "v0.3 · 하루 행동 6칸",
	"fb.openBtn": "문제 제보 (v0.2)",
	"fb.kicker": "v0.2",
	"fb.close": "닫기",
	"fb.title": "먼저 모으고, 나중에 고친다",
	"fb.body": "막히거나, 모르겠거나, 별로면 적어라. 세이브 상태도 복사되어 itch 댓글이나 나한테 붙일 수 있다.",
	"fb.q": "질문",
	"fb.ph": "예: 의무실이 안 올라간다, 벽이 뭔지 모르겠다…",
	"fb.copy": "제보 복사",
	"fb.copied": "복사됨. 붙여라.",
	"fb.where": "itch 댓글이나 WhatsApp으로 저자에게. \"버그\"만 쓰지 마라. 며칠인지, 뭘 눌렀는지 써라.",
	"fb.inbox": "수신",
	"fb.preview": "미리보기에서 고침. v0.3에 포함.",
	"fb.open": "미처리",
	"bible.openBtn": "게임 자료",
	"bible.kicker": "자료",
	"bible.close": "닫기",
	"bible.title": "게임 자료집",
	"bible.body": "장소, 직업, 장비, 공식. JSON / CSV 다운로드. 제작자 검수용.",
	"bible.json": "JSON",
	"bible.csv": "CSV",
	"bible.search": "검색",
	"bible.empty": "맞는 행이 없다.",
	"bible.edit": "숫자는 데이터 파일에서 바꿔라. 여기선 안 된다.",
	"build.lack": "{res} {n} 부족",
	"hub.wallNote": "방벽 {n}. 낮으면 야습. 수리나 경계를 맡기거나, 지금 자재로 고쳐라.",
	"hub.wallShort": "벽이 낮으면 야습"
};
var mapZh = {
	"map.hint": "真實美國地圖。肯塔基有監獄、溶洞、廢鐵場；北上鋼城加里才到芝加哥。清光才能搬。",
	"loc.echo_creek": "回聲溪",
	"loc.echo_creek.blurb": "泥路盡頭的農鎮。雞還在叫。",
	"loc.echo_creek.desc": "穀倉門半開。鎮上的人走得很整齊——像被誰領過。食物近，援手遠。",
	"loc.doe_valley": "鹿谷",
	"loc.doe_valley.blurb": "湖邊木屋。安靜得不像真的。",
	"loc.doe_valley.desc": "棧橋還在。湖面漂著空船。適合躲，不適合久留——冬天湖會結，東西會從冰上來。",
	"loc.irvington_scrap": "歐文頓廢鐵場",
	"loc.irvington_scrap.blurb": "車殼堆成牆。扳手比槍多。",
	"loc.irvington_scrap.desc": "壓縮機還卡著一輛皮卡。鐵、油、會響的東西。適合技工，不適合偷偷摸摸。",
	"loc.rosewood_prison": "玫瑰鎮監獄",
	"loc.rosewood_prison.blurb": "鐵門、走廊、沒人開的槍櫃。",
	"loc.rosewood_prison.desc": "探訪室玻璃碎了。牢房門一扇扇開著。裡面的東西還穿著制服。彈藥多，退路少。",
	"loc.brandenburg": "勃蘭登堡",
	"loc.brandenburg.blurb": "河鎮。油從碼頭上來。",
	"loc.brandenburg.desc": "渡輪停在半河。主街的加油站被撬過兩次，第三次還有剩。過河往西，肯塔基就變薄了。",
	"loc.louisville_school": "路易斯維爾高中",
	"loc.louisville_school.blurb": "鈴不會再響。體育館還鎖著人。",
	"loc.louisville_school.desc": "走廊貼滿黃色通知單。教室桌椅推成牆。有人在這裡守過——字條寫：別下地下室。",
	"loc.valley_station": "谷站",
	"loc.valley_station.blurb": "城北郊區商場。推車還排著隊。",
	"loc.valley_station.desc": "停車場的車門全開。超市冷凍櫃化成河。東西多，迴音也多——一聲推車，整層都聽見。",
	"loc.lexington": "列克星敦",
	"loc.lexington.blurb": "大學城。醫院與馬場之間。",
	"loc.lexington.desc": "校園還插著旗。大學醫院的藥局被搬空一半，另一半鎖在停電的冷櫃裡。有人用廣播唸課表。",
	"loc.mammoth_cave": "猛瑪洞穴",
	"loc.mammoth_cave.blurb": "地底下沒有風。也沒有訊號。",
	"loc.mammoth_cave.desc": "遊客中心的燈碎了。溶洞口涼、黑、有回聲。佔領這裡牆極高——無線電在地下沒用，出門要摸黑。",
	"loc.columbus": "哥倫布",
	"loc.columbus.blurb": "州府還在地圖上。人已經不在。",
	"loc.columbus.desc": "寬街被公車堵住。醫院側門堆著推床。往東是更空的俄亥俄，往西才是回家的路。",
	"loc.springfield_il": "斯普林菲爾德",
	"loc.springfield_il.blurb": "林肯的城。北上就是風城。",
	"loc.springfield_il.desc": "州議會的旗還掛著。電台有人唸過避難名單，唸到一半斷了。這裡是芝加哥前的最後一座像樣的城。",
	"loc.gary": "加里",
	"loc.gary.blurb": "鋼城。芝加哥的南門。煙囪還在冒——不是煙。",
	"loc.gary.desc": "高爐裡有東西在走。廠房鐵皮被風吹得像鐘。建材與燃油成堆，屍潮從湖岸壓過來。清完這裡，芝加哥就在眼前。",
	"room.穀倉": "穀倉",
	"room.牢房": "牢房",
	"room.槍械庫": "槍械庫",
	"room.操場": "操場",
	"room.食堂": "食堂",
	"room.廢鐵堆": "廢鐵堆",
	"room.湖屋": "湖屋",
	"room.碼頭棧橋": "碼頭棧橋",
	"room.碼頭": "碼頭",
	"room.加油站": "加油站",
	"room.教室": "教室",
	"room.體育館": "體育館",
	"room.校園藥房": "校園藥房",
	"room.中庭": "中庭",
	"room.超市": "超市",
	"room.員工通道": "員工通道",
	"room.大學醫院": "大學醫院",
	"room.校園": "校園",
	"room.市區藥房": "市區藥房",
	"room.公寓樓": "公寓樓",
	"room.溶洞口": "溶洞口",
	"room.洞穴": "洞穴",
	"room.探路營": "探路營",
	"room.地下河": "地下河",
	"room.市區": "市區",
	"room.醫院側門": "醫院側門",
	"room.州議會": "州議會",
	"room.高爐": "高爐",
	"room.廠房": "廠房",
	"room.急診": "急診",
	"room.屋頂": "屋頂",
	"room.槍店": "槍店",
	"room.主街": "主街",
	"room.民宅": "民宅",
	"room.軍械庫": "軍械庫",
	"room.崗哨": "崗哨",
	"room.營房": "營房",
	"room.指揮處": "指揮處"
};
var mapEn = {
	"map.hint": "Real US map. Kentucky now has a prison, a cave, a scrapyard. Gary is the south door to Chicago. Clear it before you move in.",
	"loc.echo_creek": "Echo Creek",
	"loc.echo_creek.blurb": "A farm town at the end of the mud road. Chickens still call.",
	"loc.echo_creek.desc": "Barn door half open. The town walked out in a line — like someone led them. Food is close. Help is not.",
	"loc.doe_valley": "Doe Valley",
	"loc.doe_valley.blurb": "Lake cabins. Quiet in a way that isn't right.",
	"loc.doe_valley.desc": "The dock is still there. Empty boats on the water. Good to hide. Bad to stay. In winter they come across the ice.",
	"loc.irvington_scrap": "Irvington Scrap",
	"loc.irvington_scrap.blurb": "Car shells for walls. More wrenches than guns.",
	"loc.irvington_scrap.desc": "A pickup is still in the crusher. Iron, oil, things that clang. Built for a mechanic. Not for sneaking.",
	"loc.rosewood_prison": "Rosewood Prison",
	"loc.rosewood_prison.blurb": "Iron doors, halls, an armory nobody opened.",
	"loc.rosewood_prison.desc": "Visiting glass is gone. Cell doors hang open. What's inside still wears uniforms. Ammo is thick. Exits are not.",
	"loc.brandenburg": "Brandenburg",
	"loc.brandenburg.blurb": "River town. Fuel comes off the dock.",
	"loc.brandenburg.desc": "The ferry sits in mid-river. The main-street pumps have been cracked twice. A third pass still has some. West of here Kentucky thins out.",
	"loc.louisville_school": "Louisville High",
	"loc.louisville_school.blurb": "The bell will not ring. The gym still holds people.",
	"loc.louisville_school.desc": "Yellow slips on every locker. Desks stacked into walls. Someone held this — a note says don't go downstairs.",
	"loc.valley_station": "Valley Station",
	"loc.valley_station.blurb": "North-end suburban mall. Carts still in line.",
	"loc.valley_station.desc": "Every car door is open. The freezers melted into a river. Loot is loud. One cart-squeak and the floor hears you.",
	"loc.lexington": "Lexington",
	"loc.lexington.blurb": "College town. Between the hospital and the horse farms.",
	"loc.lexington.desc": "Flags still on the quad. Half the hospital pharmacy is gone. The rest is locked in a dead freezer. Someone reads a class list on the radio.",
	"loc.mammoth_cave": "Mammoth Cave",
	"loc.mammoth_cave.blurb": "No wind underground. No signal either.",
	"loc.mammoth_cave.desc": "The visitor center lights are smashed. The mouth is cold and loud with echo. Occupy it and the walls are stone — radio dies down there. You leave in the dark.",
	"loc.columbus": "Columbus",
	"loc.columbus.blurb": "The capital is still on the map. The people aren't.",
	"loc.columbus.desc": "Buses jammed Broad Street. Gurneys at the ER side door. East is emptier Ohio. West is the way home.",
	"loc.springfield_il": "Springfield",
	"loc.springfield_il.blurb": "Lincoln's city. North of here is the wind.",
	"loc.springfield_il.desc": "The capitol flag still hangs. A radio read an evacuation list and died mid-name. Last decent city before Chicago.",
	"loc.gary": "Gary",
	"loc.gary.blurb": "Steel city. Chicago's south door. Stacks still smoke — not smoke.",
	"loc.gary.desc": "Something walks the furnaces. Mill sheet-metal rings like a bell. Materials and fuel in heaps. The lakeshore pushes a horde. Clear this and Chicago is in sight.",
	"room.穀倉": "Barn",
	"room.牢房": "Cellblock",
	"room.槍械庫": "Armory",
	"room.操場": "Yard",
	"room.食堂": "Mess",
	"room.廢鐵堆": "Scrap heap",
	"room.湖屋": "Lake cabin",
	"room.碼頭棧橋": "Dock",
	"room.碼頭": "Wharf",
	"room.加油站": "Gas station",
	"room.教室": "Classroom",
	"room.體育館": "Gym",
	"room.校園藥房": "Nurse office",
	"room.中庭": "Atrium",
	"room.超市": "Grocery",
	"room.員工通道": "Staff hall",
	"room.大學醫院": "UK Hospital",
	"room.校園": "Campus",
	"room.市區藥房": "Pharmacy",
	"room.公寓樓": "Walk-up",
	"room.溶洞口": "Cave mouth",
	"room.洞穴": "Cavern",
	"room.探路營": "Ranger camp",
	"room.地下河": "Underground river",
	"room.市區": "Downtown",
	"room.醫院側門": "ER side door",
	"room.州議會": "Capitol",
	"room.高爐": "Blast furnace",
	"room.廠房": "Mill floor",
	"room.急診": "ER",
	"room.屋頂": "Roof",
	"room.槍店": "Gun shop",
	"room.主街": "Main street",
	"room.民宅": "House",
	"room.軍械庫": "Armory hall",
	"room.崗哨": "Gate house",
	"room.營房": "Barracks",
	"room.指揮處": "Command"
};
var mapJa = {
	"map.hint": "本物のアメリカ地図。ケンタッキーに刑務所、洞窟、スクラップ場。シカゴの南門はゲイリー。掃討してから住め。",
	"loc.echo_creek": "エコー・クリーク",
	"loc.echo_creek.blurb": "泥道の先の農町。鶏はまだ鳴く。",
	"loc.echo_creek.desc": "納屋の扉が半開き。町の人は列をなして出ていった——誰かに引かれたように。食料は近い。助けは遠い。",
	"loc.doe_valley": "ドウ・バレー",
	"loc.doe_valley.blurb": "湖の小屋。静かすぎる。",
	"loc.doe_valley.desc": "桟橋は残っている。湖に空の船。隠れるにはいい。長居はできない。冬は氷の上から来る。",
	"loc.irvington_scrap": "アービントン廃鉄",
	"loc.irvington_scrap.blurb": "車殻が壁。銃よりレンチ。",
	"loc.irvington_scrap.desc": "クラッシャーにピックアップが挟まったまま。鉄と油と音。整備士向き。忍びには向かない。",
	"loc.rosewood_prison": "ローズウッド刑務所",
	"loc.rosewood_prison.blurb": "鉄扉、廊下、誰も開けなかった武器庫。",
	"loc.rosewood_prison.desc": "面会ガラスは砕けた。独房の扉が開いている。中のものは制服のまま。弾は多い。退路は少ない。",
	"loc.brandenburg": "ブランデンバーグ",
	"loc.brandenburg.blurb": "川の町。燃料は波止場から。",
	"loc.brandenburg.desc": "フェリーは川の途中で止まっている。本通りのスタンドは二度こじ開けられた。三度目もまだ残る。西へ行くとケンタッキーは薄くなる。",
	"loc.louisville_school": "ルイビル高校",
	"loc.louisville_school.blurb": "鐘は鳴らない。体育館にはまだ人がいる。",
	"loc.louisville_school.desc": "ロッカーに黄色い紙。机が壁になっている。誰かが守った——メモは地下へ行くなと書く。",
	"loc.valley_station": "バレー・ステーション",
	"loc.valley_station.blurb": "北郊のモール。カートが列のまま。",
	"loc.valley_station.desc": "車のドアは全部開いている。冷凍庫が川になった。物は多い。カート一声でフロアが聞く。",
	"loc.lexington": "レキシントン",
	"loc.lexington.blurb": "大学街。病院と馬場のあいだ。",
	"loc.lexington.desc": "キャンパスに旗が残る。大学病院の薬局は半分空。残りは停電の冷凍庫。ラジオで名簿を読む声がする。",
	"loc.mammoth_cave": "マンモス・ケイブ",
	"loc.mammoth_cave.blurb": "地下に風はない。電波もない。",
	"loc.mammoth_cave.desc": "ビジターセンターの灯は砕けた。洞口は冷たく、反響する。占拠すれば壁は岩——地下で無線は死ぬ。出るときは闇。",
	"loc.columbus": "コロンバス",
	"loc.columbus.blurb": "州都は地図に残る。人は残らない。",
	"loc.columbus.desc": "バスがブロード街を塞いだ。救急の横門に担架。東はさらに空のオハイオ。西が帰り道。",
	"loc.springfield_il": "スプリングフィールド",
	"loc.springfield_il.blurb": "リンカーンの街。北は風の都市。",
	"loc.springfield_il.desc": "州議事堂の旗はまだある。無線が避難名簿を読み、名前の途中で切れた。シカゴ前の最後のまっとうな街。",
	"loc.gary": "ゲイリー",
	"loc.gary.blurb": "鋼の街。シカゴの南門。煙突はまだ吐く——煙ではない。",
	"loc.gary.desc": "高炉の中を何かが歩く。工場の鉄板が鐘のように鳴る。資材と燃料の山。湖岸から大群が押す。ここを掃えばシカゴが見える。",
	"room.穀倉": "納屋",
	"room.牢房": "独房棟",
	"room.槍械庫": "武器庫",
	"room.操場": "運動場",
	"room.食堂": "食堂",
	"room.廢鐵堆": "スクラップ",
	"room.湖屋": "湖の小屋",
	"room.碼頭棧橋": "桟橋",
	"room.碼頭": "波止場",
	"room.加油站": "スタンド",
	"room.教室": "教室",
	"room.體育館": "体育館",
	"room.校園藥房": "保健室",
	"room.中庭": "アトリウム",
	"room.超市": "食料品",
	"room.員工通道": "職員通路",
	"room.大學醫院": "大学病院",
	"room.校園": "キャンパス",
	"room.市區藥房": "薬局",
	"room.公寓樓": "共同住宅",
	"room.溶洞口": "洞口",
	"room.洞穴": "洞窟",
	"room.探路營": "レンジャー宿営",
	"room.地下河": "地下川",
	"room.市區": "市街",
	"room.醫院側門": "救急横門",
	"room.州議會": "州議事堂",
	"room.高爐": "高炉",
	"room.廠房": "工場床",
	"room.急診": "救急",
	"room.屋頂": "屋上",
	"room.槍店": "銃砲店",
	"room.主街": "本通り",
	"room.民宅": "民家",
	"room.軍械庫": "兵器庫",
	"room.崗哨": "門衛",
	"room.營房": "兵舎",
	"room.指揮處": "指揮所"
};
var mapKo = {
	"map.hint": "실제 미국 지도. 켄터키에 감옥, 동굴, 고철장. 시카고 남문은 게리다. 쓸고 나서 살아라.",
	"loc.echo_creek": "에코 크릭",
	"loc.echo_creek.blurb": "진흙길 끝 농촌. 닭은 아직 운다.",
	"loc.echo_creek.desc": "헛간 문이 반쯤 열렸다. 마을 사람들이 줄을 서서 나갔다—누군가 이끈 것처럼. 식량은 가깝다. 도움은 멀다.",
	"loc.doe_valley": "도 밸리",
	"loc.doe_valley.blurb": "호숫가 오두막. 너무 조용하다.",
	"loc.doe_valley.desc": "선착장은 남았다. 호수에 빈 배. 숨기엔 좋다. 오래 있기엔 아니다. 겨울엔 얼음 위로 온다.",
	"loc.irvington_scrap": "어빙턴 고철장",
	"loc.irvington_scrap.blurb": "차 껍질이 벽. 총보다 렌치.",
	"loc.irvington_scrap.desc": "압축기에 픽업이 끼었다. 철과 기름과 소리. 정비사에게 맞다. 잠행에는 아니다.",
	"loc.rosewood_prison": "로즈우드 교도소",
	"loc.rosewood_prison.blurb": "철문, 복도, 아무도 안 연 무기고.",
	"loc.rosewood_prison.desc": "면회실 유리가 깨졌다. 감방 문이 열려 있다. 안의 것은 제복을 입었다. 탄약은 많다. 퇴로는 적다.",
	"loc.brandenburg": "브랜든버그",
	"loc.brandenburg.blurb": "강마을. 기름은 부두에서 온다.",
	"loc.brandenburg.desc": "배가 강 한가운데 섰다. 메인스트리트 주유소는 두 번 뜯겼다. 세 번째에도 남는다. 서쪽으로 가면 켄터키가 얇아진다.",
	"loc.louisville_school": "루이빌 고등학교",
	"loc.louisville_school.blurb": "종은 안 울린다. 체육관에 아직 사람이 있다.",
	"loc.louisville_school.desc": "사물함에 노란 쪽지. 책상이 벽이다. 누군가 지켰다—쪽지는 지하로 가지 말라고 한다.",
	"loc.valley_station": "밸리 스테이션",
	"loc.valley_station.blurb": "북쪽 교외 몰. 카트가 줄 선 채.",
	"loc.valley_station.desc": "차 문이 다 열렸다. 냉동고가 강이 됐다. 물건은 많다. 카트 소리 하나에 층이 듣는다.",
	"loc.lexington": "렉싱턴",
	"loc.lexington.blurb": "대학 도시. 병원과 목장 사이.",
	"loc.lexington.desc": "캠퍼스에 기가 남았다. 대학병원 약국은 반이 비었다. 나머지는 전기 끊긴 냉동고. 라디오가 출석부를 읽는다.",
	"loc.mammoth_cave": "매머드 케이브",
	"loc.mammoth_cave.blurb": "지하엔 바람이 없다. 신호도 없다.",
	"loc.mammoth_cave.desc": "방문자 센터 불이 깨졌다. 동굴 입구는 차고 메아리가 크다. 점령하면 벽은 바위—지하에선 무전이 죽는다. 나갈 때는 어둠이다.",
	"loc.columbus": "콜럼버스",
	"loc.columbus.blurb": "주도(州都)는 지도에 있다. 사람은 없다.",
	"loc.columbus.desc": "버스가 브로드를 막았다. 응급실 옆문에 들것. 동쪽은 더 빈 오하이오. 서쪽이 집 가는 길.",
	"loc.springfield_il": "스프링필드",
	"loc.springfield_il.blurb": "링컨의 도시. 북쪽은 바람의 도시.",
	"loc.springfield_il.desc": "주 의사당 기가 아직 걸려 있다. 무전이 대피 명단을 읽다 이름 중간에서 끊겼다. 시카고 앞 마지막 제대로 된 도시.",
	"loc.gary": "게리",
	"loc.gary.blurb": "강철 도시. 시카고의 남문. 굴뚝이 아직 뿜는다—연기가 아니다.",
	"loc.gary.desc": "고로 안에 무언가 걷는다. 공장 철판이 종처럼 운다. 자재와 연료 더미. 호숫가에서 무리가 민다. 여기를 쓸면 시카고가 보인다.",
	"room.穀倉": "헛간",
	"room.牢房": "감방동",
	"room.槍械庫": "무기고",
	"room.操場": "운동장",
	"room.食堂": "식당",
	"room.廢鐵堆": "고철 더미",
	"room.湖屋": "호숫가 오두막",
	"room.碼頭棧橋": "선착장",
	"room.碼頭": "부두",
	"room.加油站": "주유소",
	"room.教室": "교실",
	"room.體育館": "체육관",
	"room.校園藥房": "보건실",
	"room.中庭": "아트리움",
	"room.超市": "식료품",
	"room.員工通道": "직원 통로",
	"room.大學醫院": "대학병원",
	"room.校園": "캠퍼스",
	"room.市區藥房": "약국",
	"room.公寓樓": "공동주택",
	"room.溶洞口": "동굴 입구",
	"room.洞穴": "동굴",
	"room.探路營": "레인저 캠프",
	"room.地下河": "지하강",
	"room.市區": "시내",
	"room.醫院側門": "응급실 옆문",
	"room.州議會": "주 의사당",
	"room.高爐": "고로",
	"room.廠房": "공장 바닥",
	"room.急診": "응급실",
	"room.屋頂": "옥상",
	"room.槍店": "총포상",
	"room.主街": "메인스트리트",
	"room.民宅": "민가",
	"room.軍械庫": "병기고",
	"room.崗哨": "위병소",
	"room.營房": "막사",
	"room.指揮處": "지휘소"
};
var helpZh = {
	"ui.continue": "繼續遊玩",
	"ui.savePeek": "第 {n} 天 · {loc}",
	"ui.noSave": "沒有存檔",
	"bible.openBtn": "玩法說明",
	"bible.kicker": "說明",
	"bible.title": "怎麼玩",
	"bible.body": "點開就能看規則、地點、職業、裝備。不是下載檔。存檔在這台裝置，主畫面按繼續遊玩讀取。",
	"bible.search": "搜尋",
	"bible.empty": "沒有符合的項目。",
	"bible.close": "關閉",
	"bible.loot": "搜刮",
	"bible.cap": "佔領容量 {n}",
	"bible.max": "最高 {n} 級",
	"bible.noNeed": "不用設施",
	"bible.tab.play": "玩法",
	"bible.tab.locations": "地點",
	"bible.tab.occupations": "職業",
	"bible.tab.traits": "特質",
	"bible.tab.gear": "裝備",
	"bible.tab.facilities": "設施",
	"bible.tab.jobs": "工作",
	"bible.tab.rules": "細節",
	"bible.play.goal": "你要做什麼",
	"bible.play.goal.body": "撐過今晚，出門搜刮，把房子建成能住人的家。收人、清據點、搬家。終點是殺光芝加哥的僵屍並佔領它。全軍覆沒就結束。",
	"bible.play.save": "存檔",
	"bible.play.save.body": "每次行動、過夜、回主畫面，都會自動寫進這台裝置。重整網頁不會丟。主畫面按「繼續遊玩」讀取。開新局會覆蓋舊檔。",
	"bible.play.ap": "一天六格行動",
	"bible.play.ap.body": "出門、搜索、戰鬥、換房各耗 1 格。建造耗 2，修牆耗 1。撤離不耗行動。用完就只能撤離或過夜。過夜會補滿。",
	"bible.play.mission": "出征",
	"bible.play.mission.body": "地圖選地點，編最多三人。遠的城要燃油。情緒過低的人走不了。現場搜刮、戰鬥、救人，再撤離回家。",
	"bible.play.search": "搜索",
	"bible.play.search.body": "潛行搜索極安靜，戰利品大約只有徹底翻找的四成。地方有限，搜空了就是空的。吵的搜索更容易引來僵屍。",
	"bible.play.fight": "戰鬥",
	"bible.play.fight.body": "近戰、開槍、側翼。開槍要子彈，側翼要潛行。打完僵屍會減少，不會越打越多。剩一兩隻時打得不太差就能清掉。",
	"bible.play.night": "過夜",
	"bible.play.night.body": "吃飯喝水、派人煮飯耕作修牆警戒。牆低會夜襲。廚房水塔只能抵一部分消耗。存糧太多會發霉。",
	"bible.play.occupy": "佔領搬家",
	"bible.play.occupy.body": "把一個地點的僵屍清光，撤離時可以搬進去。容量、圍牆、現成設施會換成那裡的。洞穴牆高但沒電台；監獄哨塔強。",
	"bible.play.gear": "裝備",
	"bible.play.gear.body": "護甲減傷，防咬減感染，背包加搜刮，噪音會引怪，疲勞過夜更累。倉庫可以丟掉用不到的。完好度 40 以上會拆成建材。",
	"bible.play.win": "怎麼贏",
	"bible.play.win.body": "佔領芝加哥（大都會）才算贏。北上加里是鋼城南門。撐過今晚只是開始。",
	"bible.rule.ap": "行動格",
	"bible.rule.ap.body": "每天 6 格。旅行／搜索／戰鬥／換房／遇人 1，建造 2，修牆 1，撤離 0。",
	"bible.rule.search": "搜刮量",
	"bible.rule.search.body": "徹底翻找約 1.05 倍，潛行約 0.42 倍，再乘搜刮技能與背包。地點庫存扣完就沒有。",
	"bible.rule.fight": "文字戰鬥",
	"bible.rule.fight.body": "火力＝戰鬥技能×8＋武器×2。再開槍或側翼加權。勝負看火力對上現場僵屍與噪音。戰鬥不會刷回僵屍。",
	"bible.rule.extract": "撤離",
	"bible.rule.extract.body": "現場還有僵屍就跑，有機會掉約三成袋子，一半機率被抓傷。清光才能考慮佔領。",
	"bible.rule.night": "消耗",
	"bible.rule.night.body": "每人約吃 1、喝 1。廚房／水塔各減 0.4。菜園過夜約 0.45 倍產出。食物超過 10 會發霉。",
	"bible.rule.raid": "夜襲",
	"bible.rule.raid.body": "牆越低、天數越後，越容易被襲。警戒與哨塔降低機率。修牆：建材 2、行動 1。",
	"bible.rule.build": "建造",
	"bible.rule.build.body": "花費＝基價×（現有等級＋1）。醫務室額外要藥，無線電額外要燃油。不夠會寫還差什麼。",
	"bible.rule.occupy": "勝利",
	"bible.rule.occupy.body": "佔領大都會（芝加哥）獲勝。死光所有倖存者則失敗。存檔只在這台裝置。"
};
var helpEn = {
	"ui.continue": "Continue",
	"ui.savePeek": "Day {n} · {loc}",
	"ui.noSave": "No save",
	"bible.openBtn": "How to play",
	"bible.kicker": "Manual",
	"bible.title": "How to play",
	"bible.body": "Open this to read rules, places, jobs, kit. Nothing downloads. The save lives on this device. Continue on the title screen loads it.",
	"bible.search": "Search",
	"bible.empty": "Nothing matches.",
	"bible.close": "Close",
	"bible.loot": "Loot",
	"bible.cap": "Occupy cap {n}",
	"bible.max": "Max {n}",
	"bible.noNeed": "No building needed",
	"bible.tab.play": "Play",
	"bible.tab.locations": "Places",
	"bible.tab.occupations": "Jobs",
	"bible.tab.traits": "Traits",
	"bible.tab.gear": "Kit",
	"bible.tab.facilities": "Build",
	"bible.tab.jobs": "Work",
	"bible.tab.rules": "Detail",
	"bible.play.goal": "What you do",
	"bible.play.goal.body": "Last the night. Scavenge, build a house people can live in, take people in, clear sites, move. The end is Chicago — kill every zombie there and occupy it. If everyone dies, the run is over.",
	"bible.play.save": "Save",
	"bible.play.save.body": "Every action, sleep, and return to title writes this device. Refresh does not wipe it. Title → Continue loads it. A new run overwrites the old file.",
	"bible.play.ap": "Six actions a day",
	"bible.play.ap.body": "Travel, search, fight, next room cost 1. Build costs 2. Repair wall costs 1. Extract is free. When you are out, extract or sleep. Sleep refills the bar.",
	"bible.play.mission": "Runs",
	"bible.play.mission.body": "Pick a place on the map. Take up to three. Far cities need fuel. Low mood cannot go. Search, fight, pull people out, then extract home.",
	"bible.play.search": "Search",
	"bible.play.search.body": "Quiet search is almost silent and yields about 40% of a loud tear-through. Sites run out. Loud search draws zombies.",
	"bible.play.fight": "Fight",
	"bible.play.fight.body": "Melee, gun, flank. Guns need ammo. Flank needs stealth. Zombies go down and do not spawn back from the fight. The last one or two can be finished if the round is not a disaster.",
	"bible.play.night": "Overnight",
	"bible.play.night.body": "Eat, drink, cook, farm, mend, watch. Low walls get raided. Kitchen and water only cut part of the bill. Too much food rots.",
	"bible.play.occupy": "Move in",
	"bible.play.occupy.body": "Clear a site, then you can occupy it on extract. Capacity, walls, and buildings swap to that place. The cave has high walls and no radio. The prison has towers.",
	"bible.play.gear": "Kit",
	"bible.play.gear.body": "Armor cuts hits. Bite resist cuts infection. Packs carry more. Noise draws them. Fatigue stays into the night. Throw junk from the stash. Condition 40+ salvages a material.",
	"bible.play.win": "How you win",
	"bible.play.win.body": "Occupy Chicago (a metro) to win. Gary is the steel south door. Lasting one night is only the start.",
	"bible.rule.ap": "Actions",
	"bible.rule.ap.body": "Six a day. Travel / search / fight / next / encounter 1. Build 2. Wall 1. Extract 0.",
	"bible.rule.search": "Loot",
	"bible.rule.search.body": "Loud about 1.05×, quiet about 0.42×, then scavenge skill and pack. When the site stock hits zero, nothing more.",
	"bible.rule.fight": "Text combat",
	"bible.rule.fight.body": "Power = combat×8 + weapon×2, then gun or flank. Score against local zombies and noise. Fights do not spawn more zombies.",
	"bible.rule.extract": "Extract",
	"bible.rule.extract.body": "If zombies remain, you may lose about a third of the bag and take a claw. Occupy only when the site is quiet.",
	"bible.rule.night": "Hunger",
	"bible.rule.night.body": "About 1 food and 1 water each. Kitchen / water cut 0.4. Garden yields about 0.45×. Food over 10 rots.",
	"bible.rule.raid": "Night raid",
	"bible.rule.raid.body": "Lower walls and later days raise the chance. Guards and the tower cut it. Repair: 2 materials, 1 action.",
	"bible.rule.build": "Building",
	"bible.rule.build.body": "Cost = base × (level + 1). Infirmary also wants medicine. Radio also wants fuel. The button lists what you lack.",
	"bible.rule.occupy": "Victory",
	"bible.rule.occupy.body": "Occupy a metro (Chicago) to win. If every survivor dies, you lose. The save is only on this device."
};
var helpJa = {
	"ui.continue": "つづきから",
	"ui.savePeek": "{n}日目 · {loc}",
	"ui.noSave": "記録なし",
	"bible.openBtn": "遊び方",
	"bible.kicker": "説明",
	"bible.title": "遊び方",
	"bible.body": "規則、場所、職業、装備をここで読む。ダウンロードではない。記録はこの端末。タイトルの「つづきから」で読む。",
	"bible.search": "検索",
	"bible.empty": "一致なし。",
	"bible.close": "閉じる",
	"bible.loot": "漁り",
	"bible.cap": "占拠定員 {n}",
	"bible.max": "最大 {n}",
	"bible.noNeed": "施設不要",
	"bible.tab.play": "遊び方",
	"bible.tab.locations": "場所",
	"bible.tab.occupations": "職業",
	"bible.tab.traits": "特性",
	"bible.tab.gear": "装備",
	"bible.tab.facilities": "施設",
	"bible.tab.jobs": "仕事",
	"bible.tab.rules": "詳細",
	"bible.play.goal": "何をするか",
	"bible.play.goal.body": "今夜を越せ。漁り、家を作れ、人を入れ、拠点を掃討して移れ。終点はシカゴを全滅させて占拠すること。全滅すれば終わり。",
	"bible.play.save": "記録",
	"bible.play.save.body": "行動、睡眠、タイトルへ戻るたびにこの端末へ書く。再読み込みでは消えない。タイトルの「つづきから」で読む。新しい生存は上書きする。",
	"bible.play.ap": "一日六行動",
	"bible.play.ap.body": "移動・搜索・戦闘・次の部屋は 1。建設は 2。壁は 1。撤退は無料。尽きたら撤退か眠れ。眠れば戻る。",
	"bible.play.mission": "出撃",
	"bible.play.mission.body": "地図で場所を選ぶ。最大三人。遠い街は燃料。気分が低い者は行けない。漁り、戦い、人を連れ、家へ戻れ。",
	"bible.play.search": "搜索",
	"bible.play.search.body": "潜行は静かで、徹底搜索の約四割。場所は空になる。うるさい搜索はゾンビを呼ぶ。",
	"bible.play.fight": "戦闘",
	"bible.play.fight.body": "近接、銃、側面。銃は弾。側面は隠密。ゾンビは減り、戦闘では増えない。残り一、二体は大失敗でなければ止められる。",
	"bible.play.night": "夜",
	"bible.play.night.body": "食い、飲み、炊き、耕し、直し、見張る。壁が低いと夜襲。台所と水は一部しか減らさない。食料過多は腐る。",
	"bible.play.occupy": "占拠",
	"bible.play.occupy.body": "ゾンビを掃って撤退時に移れる。定員・壁・施設がそこのものになる。洞窟は壁が高く無線がない。刑務所は塔が強い。",
	"bible.play.gear": "装備",
	"bible.play.gear.body": "装甲は被弾減。耐咬は感染減。バッグは持ち帰り。騒音は敵を呼ぶ。疲労は夜に残る。倉庫から捨てられる。耐久 40 以上は資材になる。",
	"bible.play.win": "勝ち方",
	"bible.play.win.body": "シカゴ（大都市）を占拠すれば勝ち。ゲイリーが南の鋼の門。今夜を越すのは始まりにすぎない。",
	"bible.rule.ap": "行動",
	"bible.rule.ap.body": "一日 6。移動／搜索／戦闘／次／遭遇 1。建設 2。壁 1。撤退 0。",
	"bible.rule.search": "漁り量",
	"bible.rule.search.body": "徹底約 1.05 倍、潜行約 0.42 倍。技能とバッグが乗る。在庫が尽きれば何もない。",
	"bible.rule.fight": "文字戦闘",
	"bible.rule.fight.body": "火力＝戦闘×8＋武器×2。銃か側面。現地のゾンビと騒音と比べる。戦闘ではゾンビは増えない。",
	"bible.rule.extract": "撤退",
	"bible.rule.extract.body": "ゾンビが残っていれば袋の約三分の一を落とすことがあり、爪を食らうこともある。静かな場所だけ占拠できる。",
	"bible.rule.night": "消費",
	"bible.rule.night.body": "一人あたり食 1・水 1 程度。台所／水は 0.4 減。菜園は約 0.45 倍。食料 10 超は腐る。",
	"bible.rule.raid": "夜襲",
	"bible.rule.raid.body": "壁が低く日が経つほど起きやすい。見張りと塔で下がる。壁直し：資材 2、行動 1。",
	"bible.rule.build": "建設",
	"bible.rule.build.body": "費用＝基本×（現在＋1）。医務は薬、無線は燃料も。足りないものはボタンに出る。",
	"bible.rule.occupy": "勝利",
	"bible.rule.occupy.body": "大都市（シカゴ）を占拠すれば勝ち。全員死ねば負け。記録はこの端末だけ。"
};
var helpKo = {
	"ui.continue": "이어하기",
	"ui.savePeek": "{n}일차 · {loc}",
	"ui.noSave": "저장 없음",
	"bible.openBtn": "하는 법",
	"bible.kicker": "설명",
	"bible.title": "하는 법",
	"bible.body": "규칙, 장소, 직업, 장비를 여기서 본다. 다운로드가 아니다. 저장은 이 기기. 타이틀의 이어하기로 읽는다.",
	"bible.search": "검색",
	"bible.empty": "맞는 항목이 없다.",
	"bible.close": "닫기",
	"bible.loot": "수색",
	"bible.cap": "점령 정원 {n}",
	"bible.max": "최대 {n}",
	"bible.noNeed": "시설 불필요",
	"bible.tab.play": "하는 법",
	"bible.tab.locations": "장소",
	"bible.tab.occupations": "직업",
	"bible.tab.traits": "특성",
	"bible.tab.gear": "장비",
	"bible.tab.facilities": "시설",
	"bible.tab.jobs": "일",
	"bible.tab.rules": "세부",
	"bible.play.goal": "무엇을 하나",
	"bible.play.goal.body": "오늘 밤을 넘겨라. 수색하고, 집을 만들고, 사람을 들이고, 거점을 쓸고 옮겨라. 끝은 시카고의 좀비를 없애고 점령하는 것이다. 전원이 죽으면 끝이다.",
	"bible.play.save": "저장",
	"bible.play.save.body": "행동, 잠, 타이틀로 돌아갈 때마다 이 기기에 쓴다. 새로고침해도 안 지워진다. 타이틀의 「이어하기」로 읽는다. 새 생존은 덮어쓴다.",
	"bible.play.ap": "하루 행동 6칸",
	"bible.play.ap.body": "이동·수색·전투·다음 방은 1. 건설은 2. 벽은 1. 철수는 공짜. 다 쓰면 철수하거나 자라. 자면 찬다.",
	"bible.play.mission": "출격",
	"bible.play.mission.body": "지도에서 장소를 고른다. 최대 셋. 먼 도시는 연료. 기분이 낮으면 못 간다. 수색, 싸움, 사람 구출, 집으로 철수.",
	"bible.play.search": "수색",
	"bible.play.search.body": "은밀 수색은 아주 조용하고, 철저 수색의 약 40%. 장소는 바닥난다. 시끄러운 수색은 좀비를 부른다.",
	"bible.play.fight": "전투",
	"bible.play.fight.body": "근접, 총, 측면. 총은 탄약. 측면은 은신. 좀비는 줄고, 싸움으로 다시 안 생긴다. 남은 한두 마리는 크게 지지 않으면 끝낼 수 있다.",
	"bible.play.night": "밤",
	"bible.play.night.body": "먹고, 마시고, 요리하고, 농사하고, 고치고, 지킨다. 벽이 낮으면 야습. 부엌과 물은 일부만 줄인다. 식량이 많으면 썩는다.",
	"bible.play.occupy": "점령",
	"bible.play.occupy.body": "좀비를 쓸고 철수할 때 옮길 수 있다. 정원, 벽, 시설이 그곳으로 바뀐다. 동굴은 벽이 높고 무전이 없다. 감옥은 탑이 세다.",
	"bible.play.gear": "장비",
	"bible.play.gear.body": "장갑은 피해 감소. 물림 저항은 감염 감소. 가방은 수거량. 소음은 적을 부른다. 피로는 밤에 남는다. 창고에서 버릴 수 있다. 내구 40 이상은 자재가 된다.",
	"bible.play.win": "이기는 법",
	"bible.play.win.body": "시카고(대도시)를 점령하면 이긴다. 게리가 남쪽 강철 문이다. 하룻밤을 넘는 것은 시작일 뿐이다.",
	"bible.rule.ap": "행동",
	"bible.rule.ap.body": "하루 6. 이동/수색/전투/다음/조우 1. 건설 2. 벽 1. 철수 0.",
	"bible.rule.search": "수거량",
	"bible.rule.search.body": "철저 약 1.05배, 은밀 약 0.42배. 수색 기술과 가방. 재고가 끝나면 없다.",
	"bible.rule.fight": "텍스트 전투",
	"bible.rule.fight.body": "화력=전투×8+무기×2. 총이나 측면. 현장 좀비와 소음과 비교. 전투로 좀비가 늘지 않는다.",
	"bible.rule.extract": "철수",
	"bible.rule.extract.body": "좀비가 남으면 가방 약 1/3을 잃을 수 있고 할퀼 수 있다. 조용한 곳만 점령한다.",
	"bible.rule.night": "소모",
	"bible.rule.night.body": "사람당 식 1·물 1 정도. 부엌/물은 0.4 감소. 텃밭은 약 0.45배. 식량 10 초과는 썩는다.",
	"bible.rule.raid": "야습",
	"bible.rule.raid.body": "벽이 낮고 날이 갈수록 잘 난다. 경계와 탑이 줄인다. 벽 수리: 자재 2, 행동 1.",
	"bible.rule.build": "건설",
	"bible.rule.build.body": "비용=기본×(현재+1). 의무실은 약, 무전기는 연료도. 부족한 것은 버튼에 나온다.",
	"bible.rule.occupy": "승리",
	"bible.rule.occupy.body": "대도시(시카고)를 점령하면 이긴다. 전원이 죽으면 진다. 저장은 이 기기뿐이다."
};
var DICT = {
	zh: {
		...zh,
		...extraZh,
		...v03Zh,
		...mapZh,
		...helpZh,
		...whyZh,
		...skillZh,
		...dispatchZh
	},
	ja: {
		...ja,
		...extraJa,
		...v03Ja,
		...mapJa,
		...helpJa,
		...whyJa,
		...skillJa,
		...dispatchJa
	},
	en: {
		...en,
		...extraEn,
		...v03En,
		...mapEn,
		...helpEn,
		...whyEn,
		...skillEn,
		...dispatchEn
	},
	ko: {
		...ko,
		...extraKo,
		...v03Ko,
		...mapKo,
		...helpKo,
		...whyKo,
		...skillKo,
		...dispatchKo
	}
};
function tRoom(name) {
	return t(`room.${name}`);
}
function tLoc(id) {
	return t(`loc.${id}`);
}
function tResBits(got) {
	return Object.entries(got).filter(([, v]) => (v ?? 0) > 0).map(([k, v]) => `${t(`res.${k}`)} ${v}`).join(" · ");
}
var SAVE_KEY = "ash-state-v5";
var OCCUPATIONS = [
	{
		id: "firefighter",
		name: "消防員",
		nameEn: "Firefighter",
		blurb: "斧、體能、奔跑、力氣。起手 0 點。",
		desc: "PZ：Axe / Fitness / Sprinting / Strength 各 +1。沒有免費特質。要強，得自己拿缺點換。",
		skills: {
			combat: 1,
			stealth: 0,
			scavenge: 0,
			medical: 0,
			build: 0,
			farm: 0,
			cook: 0
		},
		pool: 0,
		hp: 110,
		weapon: "axe",
		start: {
			materials: 6,
			medicine: 2,
			food: 4,
			water: 4,
			fuel: 2
		},
		portrait: "fire",
		tone: "#8a4a3a",
		granted: []
	},
	{
		id: "doctor",
		name: "醫生",
		nameEn: "Doctor",
		blurb: "急救拉滿。起手 0 點。",
		desc: "PZ：First Aid +6、短刃 +1。戰鬥要另外學。醫院沒了，手還在。",
		skills: {
			combat: 1,
			stealth: 0,
			scavenge: 0,
			medical: 6,
			build: 0,
			farm: 0,
			cook: 0
		},
		pool: 0,
		hp: 90,
		weapon: "knife",
		start: {
			medicine: 10,
			food: 4,
			water: 5,
			materials: 2
		},
		portrait: "doc",
		tone: "#4a5a6a",
		granted: []
	},
	{
		id: "officer",
		name: "警員",
		nameEn: "Police Officer",
		blurb: "射擊與換彈。起手 −4。",
		desc: "PZ：Aiming +4、Nimble +1、Reloading +1。槍是職業病，種菜沒有。",
		skills: {
			combat: 4,
			stealth: 1,
			scavenge: 0,
			medical: 0,
			build: 0,
			farm: 0,
			cook: 0
		},
		pool: -4,
		hp: 100,
		weapon: "pistol",
		start: {
			ammo: 14,
			food: 3,
			water: 3,
			materials: 3,
			fuel: 2
		},
		portrait: "cop",
		tone: "#3a4450",
		granted: []
	},
	{
		id: "chef",
		name: "廚師",
		nameEn: "Chef",
		blurb: "廚藝 + 烹飪特質。起手 −2。",
		desc: "PZ：Cooking +4、短刃 +1。免費 Keen Cook——能把過期的東西變成熱食。",
		skills: {
			combat: 1,
			stealth: 0,
			scavenge: 0,
			medical: 0,
			build: 1,
			farm: 0,
			cook: 4
		},
		pool: -2,
		hp: 95,
		weapon: "knife",
		start: {
			food: 12,
			water: 6,
			materials: 2
		},
		portrait: "chef",
		tone: "#6a5a4a",
		granted: ["keencook"]
	},
	{
		id: "mechanic",
		name: "技工",
		nameEn: "Mechanic",
		blurb: "機械與焊接。起手 −4。",
		desc: "PZ：Mechanics +4、Welding +1。免費 Vehicle Knowledge。圍牆與引擎聽他的。",
		skills: {
			combat: 0,
			stealth: 0,
			scavenge: 1,
			medical: 0,
			build: 4,
			farm: 0,
			cook: 0
		},
		pool: -4,
		hp: 100,
		weapon: "bat",
		start: {
			materials: 12,
			fuel: 6,
			food: 3,
			water: 3
		},
		portrait: "mech",
		tone: "#4a5a42",
		granted: ["vehicleknow"]
	},
	{
		id: "farmer",
		name: "農夫",
		nameEn: "Farmer",
		blurb: "農耕。起手 0 點。",
		desc: "PZ：Agriculture +4、力氣 +1。沒有免費特質。土地還在，種子就還有用。",
		skills: {
			combat: 0,
			stealth: 0,
			scavenge: 0,
			medical: 0,
			build: 0,
			farm: 4,
			cook: 0
		},
		pool: 0,
		hp: 105,
		weapon: "bat",
		start: {
			food: 8,
			water: 8,
			materials: 4
		},
		portrait: "farm",
		tone: "#5a4a38",
		granted: []
	},
	{
		id: "veteran",
		name: "退伍軍人",
		nameEn: "Veteran",
		blurb: "射擊 + 脫敏。起手 −8。",
		desc: "PZ 最貴職業。Aiming +2、Reloading +2。免費 Desensitized：幾乎不恐慌。缺點必須補滿。",
		skills: {
			combat: 2,
			stealth: 0,
			scavenge: 0,
			medical: 0,
			build: 0,
			farm: 0,
			cook: 0
		},
		pool: -8,
		hp: 105,
		weapon: "pistol",
		start: {
			ammo: 12,
			food: 3,
			water: 3,
			medicine: 2,
			fuel: 2
		},
		portrait: "vet",
		tone: "#3d4a3a",
		granted: ["desensitized"]
	},
	{
		id: "burglar",
		name: "竊賊",
		nameEn: "Burglar",
		blurb: "潛行三項。起手 −6。",
		desc: "PZ：Lightfooted / Nimble / Sneaking 各 +2。免費 Burglar：撬窗較安靜，搜刮較俐落。",
		skills: {
			combat: 0,
			stealth: 3,
			scavenge: 1,
			medical: 0,
			build: 0,
			farm: 0,
			cook: 0
		},
		pool: -6,
		hp: 90,
		weapon: "knife",
		start: {
			food: 3,
			water: 3,
			materials: 4,
			ammo: 4
		},
		portrait: "thief",
		tone: "#3a3a3c",
		granted: ["burglarhands"]
	}
];
var FACES = [
	{
		id: "fire",
		src: "/art/p-fire.jpg",
		tone: "#8a4a3a"
	},
	{
		id: "doc",
		src: "/art/p-doc.jpg",
		tone: "#4a5a6a"
	},
	{
		id: "cop",
		src: "/art/p-cop.jpg",
		tone: "#3a4450"
	},
	{
		id: "chef",
		src: "/art/p-chef.jpg",
		tone: "#6a5a4a"
	},
	{
		id: "mech",
		src: "/art/p-mech.jpg",
		tone: "#4a5a42"
	},
	{
		id: "farm",
		src: "/art/p-farm.jpg",
		tone: "#5a4a38"
	},
	{
		id: "vet",
		src: "/art/p-vet.jpg",
		tone: "#3d4a3a"
	},
	{
		id: "thief",
		src: "/art/p-thief.jpg",
		tone: "#3a3a3c"
	},
	{
		id: "river",
		src: "/art/p-river.jpg",
		tone: "#4a4038"
	},
	{
		id: "hayes",
		src: "/art/p-hayes.jpg",
		tone: "#3a3834"
	},
	{
		id: "nora",
		src: "/art/p-nora.jpg",
		tone: "#4a4440"
	},
	{
		id: "kim",
		src: "/art/p-kim.jpg",
		tone: "#3e3c40"
	},
	{
		id: "diaz",
		src: "/art/p-diaz.jpg",
		tone: "#4a3c38"
	},
	{
		id: "cole",
		src: "/art/p-cole.jpg",
		tone: "#383838"
	},
	{
		id: "amari",
		src: "/art/p-amari.jpg",
		tone: "#403830"
	},
	{
		id: "wren",
		src: "/art/p-wren.jpg",
		tone: "#3c403c"
	}
];
function faceById(id) {
	return FACES.find((f) => f.id === id) ?? FACES[0];
}
var TRAITS = [
	{
		id: "athletic",
		name: "運動健將",
		kind: "pos",
		points: -10,
		blurb: "跑得久、打得穩。",
		combat: 1,
		hp: 12,
		excludes: [
			"unfit",
			"smoker",
			"overweight",
			"underweight"
		]
	},
	{
		id: "strong",
		name: "強壯",
		kind: "pos",
		points: -10,
		blurb: "近戰多一次餘裕。",
		combat: 2,
		hp: 18,
		excludes: ["weak", "stout"]
	},
	{
		id: "handy",
		name: "巧手",
		kind: "pos",
		points: -8,
		blurb: "釘子與木板聽他的。",
		build: 2,
		excludes: ["allthumbs"]
	},
	{
		id: "thickskinned",
		name: "皮厚",
		kind: "pos",
		points: -8,
		blurb: "抓傷咬傷比較難進。",
		hp: 6,
		excludes: ["thinskinned"]
	},
	{
		id: "hunter",
		name: "獵人",
		kind: "pos",
		points: -8,
		blurb: "瞄、潛、拆獵物，都算過。",
		combat: 1,
		stealth: 1,
		scavenge: 1
	},
	{
		id: "brawler",
		name: "鬥士",
		kind: "pos",
		points: -6,
		blurb: "斧與棍是手的延伸。",
		combat: 2
	},
	{
		id: "fastlearner",
		name: "聰穎",
		kind: "pos",
		points: -6,
		blurb: "用過就記住。成長較快。",
		excludes: ["slowlearner"]
	},
	{
		id: "stout",
		name: "結實",
		kind: "pos",
		points: -6,
		blurb: "力氣夠用，不必練到極限。",
		combat: 1,
		hp: 10,
		excludes: ["strong", "weak"]
	},
	{
		id: "keenhearing",
		name: "聽覺敏銳",
		kind: "pos",
		points: -6,
		blurb: "還沒看見，就先聽見。",
		stealth: 1
	},
	{
		id: "gymnast",
		name: "體操",
		kind: "pos",
		points: -5,
		blurb: "腳步與閃身是同一件事。",
		stealth: 2
	},
	{
		id: "brave",
		name: "無畏",
		kind: "pos",
		points: -4,
		blurb: "往前衝，不太會蹲。",
		combat: 1,
		morale: 10,
		excludes: [
			"coward",
			"agoraphobic",
			"desensitized"
		]
	},
	{
		id: "organized",
		name: "有條理",
		kind: "pos",
		points: -4,
		blurb: "袋子裡永遠多一格。",
		scavenge: 1
	},
	{
		id: "quiet",
		name: "輕手",
		kind: "pos",
		points: -4,
		blurb: "走路像貓。",
		stealth: 2,
		excludes: ["clumsy"]
	},
	{
		id: "inconspicuous",
		name: "不起眼",
		kind: "pos",
		points: -4,
		blurb: "它們比較不容易看見你。",
		stealth: 1,
		excludes: ["conspicuous"]
	},
	{
		id: "adrenaline",
		name: "腎上腺素",
		kind: "pos",
		points: -4,
		blurb: "血少的時候反而更快。",
		excludes: [
			"coward",
			"agoraphobic",
			"desensitized"
		]
	},
	{
		id: "lucky",
		name: "好運",
		kind: "pos",
		points: -4,
		blurb: "抽屜裡總多一樣東西。",
		scavenge: 1,
		excludes: ["unlucky"]
	},
	{
		id: "leader",
		name: "領導",
		kind: "pos",
		points: -4,
		blurb: "別人比較願意聽。",
		morale: 12,
		excludes: ["selfish"]
	},
	{
		id: "wakeful",
		name: "少眠",
		kind: "pos",
		points: -3,
		blurb: "睡得少，醒得快。",
		excludes: ["sleepyhead", "insomnia"]
	},
	{
		id: "catseyes",
		name: "貓眼",
		kind: "pos",
		points: -3,
		blurb: "夜裡也看得清抽屜。",
		stealth: 1
	},
	{
		id: "firstaid",
		name: "急救",
		kind: "pos",
		points: -2,
		blurb: "會包紮，也會判斷誰先死。",
		medical: 1
	},
	{
		id: "dextrous",
		name: "靈巧",
		kind: "pos",
		points: -2,
		blurb: "東西進出袋子很快。",
		scavenge: 1,
		excludes: ["allthumbs"]
	},
	{
		id: "lighteater",
		name: "少食",
		kind: "pos",
		points: -2,
		blurb: "吃得少，也能撐。",
		excludes: ["heartyappetite"]
	},
	{
		id: "lowthirst",
		name: "少渴",
		kind: "pos",
		points: -2,
		blurb: "水可以省著喝。",
		excludes: ["highthirst"]
	},
	{
		id: "outdoorsman",
		name: "戶外",
		kind: "pos",
		points: -2,
		blurb: "風與雨不太能打敗他。",
		morale: 6
	},
	{
		id: "gardener",
		name: "園丁",
		kind: "pos",
		points: -2,
		blurb: "認得種子什麼時候該下。",
		farm: 1
	},
	{
		id: "irongut",
		name: "鐵胃",
		kind: "pos",
		points: -2,
		blurb: "過期的東西，比較不容易出事。",
		cook: 1,
		excludes: ["weakstomach"]
	},
	{
		id: "highthirst",
		name: "易渴",
		kind: "neg",
		points: 2,
		blurb: "水要多帶。只值兩點。",
		excludes: ["lowthirst"]
	},
	{
		id: "weakstomach",
		name: "腸胃弱",
		kind: "neg",
		points: 2,
		blurb: "不熟的東西別碰。",
		excludes: ["irongut"]
	},
	{
		id: "shortsighted",
		name: "近視",
		kind: "neg",
		points: 2,
		blurb: "遠的東西糊成一團。"
	},
	{
		id: "clumsy",
		name: "笨拙",
		kind: "neg",
		points: 2,
		blurb: "東西會響。",
		stealth: -1,
		excludes: ["quiet"]
	},
	{
		id: "allthumbs",
		name: "笨手",
		kind: "neg",
		points: 2,
		blurb: "袋子裡的東西永遠卡住。",
		build: -1,
		excludes: ["dextrous", "handy"]
	},
	{
		id: "coward",
		name: "懼屍",
		kind: "neg",
		points: 2,
		blurb: "看到那東西，手會抖。",
		combat: -1,
		excludes: [
			"brave",
			"adrenaline",
			"desensitized"
		]
	},
	{
		id: "smoker",
		name: "煙癮",
		kind: "neg",
		points: 3,
		blurb: "沒煙的時候，脾氣與肚子一起壞。",
		excludes: ["athletic"]
	},
	{
		id: "slowhealer",
		name: "癒合慢",
		kind: "neg",
		points: 3,
		blurb: "傷口不肯結痂。"
	},
	{
		id: "heartyappetite",
		name: "大胃",
		kind: "neg",
		points: 4,
		blurb: "吃得比別人多。",
		excludes: ["lighteater"]
	},
	{
		id: "conspicuous",
		name: "顯眼",
		kind: "neg",
		points: 4,
		blurb: "它們先看見你。",
		stealth: -1,
		excludes: ["inconspicuous"]
	},
	{
		id: "proneillness",
		name: "易病",
		kind: "neg",
		points: 4,
		blurb: "感染走得比較快。"
	},
	{
		id: "sleepyhead",
		name: "貪睡",
		kind: "neg",
		points: 4,
		blurb: "怎麼睡都不夠。",
		excludes: ["wakeful"]
	},
	{
		id: "unlucky",
		name: "倒霉",
		kind: "neg",
		points: 4,
		blurb: "抽屜總是空的。",
		scavenge: -1,
		excludes: ["lucky"]
	},
	{
		id: "agoraphobic",
		name: "廣場恐懼",
		kind: "neg",
		points: 4,
		blurb: "出門本身就是刑罰。",
		morale: -4,
		excludes: [
			"brave",
			"adrenaline",
			"desensitized"
		]
	},
	{
		id: "depressed",
		name: "抑鬱",
		kind: "neg",
		points: 4,
		blurb: "起床已經用掉一天的力氣。",
		morale: -16
	},
	{
		id: "selfish",
		name: "自私",
		kind: "neg",
		points: 4,
		blurb: "口袋裡的東西，不一定拿出來分。",
		morale: -6,
		excludes: ["leader"]
	},
	{
		id: "underweight",
		name: "過輕",
		kind: "neg",
		points: 4,
		blurb: "風一吹就晃。",
		hp: -10,
		excludes: ["athletic", "overweight"]
	},
	{
		id: "overweight",
		name: "過重",
		kind: "neg",
		points: 4,
		blurb: "跑起來費力。",
		hp: -6,
		combat: -1,
		excludes: ["athletic", "underweight"]
	},
	{
		id: "hemophobic",
		name: "見血恐懼",
		kind: "neg",
		points: 5,
		blurb: "自己的血也會讓手停。",
		medical: -1,
		morale: -6,
		excludes: ["desensitized"]
	},
	{
		id: "asthmatic",
		name: "氣喘",
		kind: "neg",
		points: 5,
		blurb: "一口氣還沒喘完，下一拳就來了。"
	},
	{
		id: "pacifist",
		name: "厭戰",
		kind: "neg",
		points: 5,
		blurb: "殺太多會惡心。戰鬥不順手。",
		combat: -1
	},
	{
		id: "insomnia",
		name: "失眠",
		kind: "neg",
		points: 6,
		blurb: "夜裡總在聽門外。",
		excludes: ["wakeful"]
	},
	{
		id: "slowlearner",
		name: "愚鈍",
		kind: "neg",
		points: 6,
		blurb: "同樣的傷要犯第二次。成長較慢。",
		excludes: ["fastlearner"]
	},
	{
		id: "weak",
		name: "體弱",
		kind: "neg",
		points: 6,
		blurb: "一場感冒就能躺平。",
		combat: -1,
		hp: -16,
		excludes: ["strong", "stout"]
	},
	{
		id: "thinskinned",
		name: "皮薄",
		kind: "neg",
		points: 8,
		blurb: "抓一下就破。大筆點數，大筆風險。",
		hp: -8,
		excludes: ["thickskinned"]
	},
	{
		id: "unfit",
		name: "體能差",
		kind: "neg",
		points: 10,
		blurb: "跑兩步就垮。十點很甜，命很薄。",
		combat: -1,
		hp: -12,
		excludes: ["athletic"]
	},
	{
		id: "desensitized",
		name: "脫敏",
		kind: "occ",
		points: 0,
		blurb: "幾乎不恐慌。退伍軍人的職業病。",
		morale: 8,
		excludes: [
			"brave",
			"coward",
			"agoraphobic",
			"hemophobic",
			"adrenaline"
		]
	},
	{
		id: "keencook",
		name: "精通烹飪",
		kind: "occ",
		points: 0,
		blurb: "過期的東西，到他手上還能成熱食。",
		cook: 1
	},
	{
		id: "burglarhands",
		name: "竊賊",
		kind: "occ",
		points: 0,
		blurb: "撬窗較安靜，搜刮較俐落。",
		stealth: 1,
		scavenge: 1
	},
	{
		id: "vehicleknow",
		name: "車輛知識",
		kind: "occ",
		points: 0,
		blurb: "引擎與鐵皮聽得懂。",
		build: 1
	}
];
var START_SHELTERS = [
	{
		id: "farmhouse",
		locationId: "muldraugh_farm",
		name: "莫卓農舍",
		nameEn: "Muldraugh Farmhouse",
		blurb: "肯塔基鄉下。安靜，但離補給遠。",
		desc: "木板釘窗的兩層農舍，後院能種菜。僵屍少，鄰居更少。",
		capacity: 4,
		barricade: 55,
		image: "/art/shelter-farm.jpg",
		facilities: {
			beds: 1,
			kitchen: 1,
			garden: 1,
			water: 1
		},
		extras: {
			food: 6,
			water: 8,
			materials: 4
		}
	},
	{
		id: "hardware",
		locationId: "westpoint_shop",
		name: "西點五金",
		nameEn: "West Point Hardware",
		blurb: "工具齊，街上不安靜。",
		desc: "沿主街的五金行。工坊現成，木料夠圍牆，入夜後櫥窗會響。",
		capacity: 3,
		barricade: 40,
		image: "/art/shelter-hardware.jpg",
		facilities: {
			beds: 1,
			workshop: 1,
			kitchen: 1
		},
		extras: {
			materials: 14,
			fuel: 3,
			food: 3
		}
	},
	{
		id: "highrise",
		locationId: "louisville_apt",
		name: "路易斯維爾頂樓",
		nameEn: "Louisville Walk-up",
		blurb: "城裡視野好，下樓就要付錢。",
		desc: "六樓公寓，水塔還能接。容量大，週遭街區已被啃空一半。",
		capacity: 5,
		barricade: 35,
		image: "/art/shelter-highrise.jpg",
		facilities: {
			beds: 1,
			kitchen: 1,
			radio: 1,
			water: 1
		},
		extras: {
			food: 4,
			water: 5,
			ammo: 4,
			fuel: 2
		}
	}
];
var FACILITIES = [
	{
		id: "beds",
		name: "寢室",
		blurb: "多一張床，就能多留一個人。",
		max: 4,
		cost: { materials: 8 },
		effect: "容量 +1"
	},
	{
		id: "kitchen",
		name: "廚房",
		blurb: "熱食讓食物更耐吃，也讓人比較不像要散。",
		max: 3,
		cost: { materials: 6 },
		effect: "食物消耗降低"
	},
	{
		id: "water",
		name: "集水器",
		blurb: "屋頂接雨。沒有它，你得到河裡冒險。",
		max: 3,
		cost: { materials: 5 },
		effect: "每日產水"
	},
	{
		id: "workshop",
		name: "工坊",
		blurb: "鋸子、釘子、能修的都在這。",
		max: 3,
		cost: { materials: 8 },
		effect: "建造與圍牆"
	},
	{
		id: "infirmary",
		name: "醫務室",
		blurb: "一張乾淨的桌子，勝過在地板上縫。",
		max: 3,
		cost: {
			materials: 7,
			extra: { medicine: 1 }
		},
		effect: "治療與清感染"
	},
	{
		id: "garden",
		name: "菜園",
		blurb: "種子比子彈值錢，只是慢。",
		max: 3,
		cost: { materials: 6 },
		effect: "每日產糧"
	},
	{
		id: "radio",
		name: "無線電",
		blurb: "廢頻裡有人在呼救，也有人在設局。",
		max: 2,
		cost: {
			materials: 6,
			extra: { fuel: 1 }
		},
		effect: "發現地點／倖存者"
	},
	{
		id: "watch",
		name: "哨塔",
		blurb: "先看到，才有機會不擋。",
		max: 2,
		cost: { materials: 10 },
		effect: "降低夜襲"
	}
];
var JOBS = [
	{
		id: "rest",
		name: "休息",
		blurb: "回血、降疲勞、回情緒。"
	},
	{
		id: "cook",
		name: "炊事",
		need: "kitchen",
		blurb: "把存糧做成熱食。"
	},
	{
		id: "farm",
		name: "耕作",
		need: "garden",
		blurb: "菜園產出。"
	},
	{
		id: "guard",
		name: "警戒",
		blurb: "守夜，擋襲擊。"
	},
	{
		id: "repair",
		name: "修繕",
		blurb: "補圍牆。"
	},
	{
		id: "tend",
		name: "看護",
		need: "infirmary",
		blurb: "治療傷患。"
	},
	{
		id: "radio",
		name: "監聽",
		need: "radio",
		blurb: "搜頻道。"
	},
	{
		id: "craft",
		name: "打造",
		need: "workshop",
		blurb: "耗材換圍牆與武器。"
	}
];
var RESOURCES = [
	{
		id: "food",
		name: "食物"
	},
	{
		id: "water",
		name: "水"
	},
	{
		id: "materials",
		name: "建材"
	},
	{
		id: "medicine",
		name: "藥品"
	},
	{
		id: "ammo",
		name: "彈藥"
	},
	{
		id: "fuel",
		name: "燃油"
	}
];
var LOCATIONS = [
	{
		id: "muldraugh_farm",
		name: "莫卓農舍",
		nameEn: "Muldraugh Farm",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "起始農舍。後院、穀倉、泥路。",
		desc: "你們的第一個家。穀倉裡還有種子，路上偶爾有遊蕩的。",
		zombies: 4,
		fuel: 0,
		image: "/art/shelter-farm.jpg",
		zones: [
			"廚房",
			"穀倉",
			"後院"
		],
		loot: {
			food: [1, 3],
			materials: [1, 3]
		},
		survivorChance: .15,
		occupyCapacity: 4,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			garden: 1,
			water: 1
		},
		occupyBarricade: 50,
		neighbors: [
			"muldraugh_wh",
			"rosewood_pd",
			"riverside_mart",
			"echo_creek",
			"mammoth_cave"
		],
		lat: 37.937,
		lng: -85.9914,
		startKnown: true,
		isStart: true
	},
	{
		id: "westpoint_shop",
		name: "西點五金",
		nameEn: "West Point Hardware",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "主街五金行。",
		desc: "工具與木料的老家。玻璃碎了以後，聲音會傳很遠。",
		zombies: 8,
		fuel: 0,
		image: "/art/shelter-hardware.jpg",
		zones: [
			"店面",
			"倉庫",
			"後巷"
		],
		loot: {
			materials: [3, 8],
			fuel: [0, 2]
		},
		survivorChance: .2,
		occupyCapacity: 3,
		occupyFacilities: {
			beds: 1,
			workshop: 1,
			kitchen: 1
		},
		occupyBarricade: 40,
		neighbors: ["westpoint_town", "louisville_apt"],
		lat: 37.8392,
		lng: -85.9472,
		startKnown: true,
		isStart: true
	},
	{
		id: "louisville_apt",
		name: "路易斯維爾頂樓",
		nameEn: "Louisville Walk-up",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "城區公寓。",
		desc: "六樓還算安全。樓梯間是另一回事。",
		zombies: 12,
		fuel: 0,
		image: "/art/shelter-highrise.jpg",
		zones: [
			"客廳",
			"走廊",
			"頂樓水塔"
		],
		loot: {
			water: [2, 5],
			food: [1, 3],
			ammo: [0, 3]
		},
		survivorChance: .25,
		occupyCapacity: 5,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			radio: 1,
			water: 1
		},
		occupyBarricade: 35,
		neighbors: [
			"louisville_er",
			"louisville_mall",
			"westpoint_town",
			"valley_station",
			"louisville_school",
			"westpoint_shop"
		],
		lat: 38.255,
		lng: -85.762,
		startKnown: true,
		isStart: true
	},
	{
		id: "rosewood_pd",
		name: "玫瑰鎮警局",
		nameEn: "Rosewood PD",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "槍櫃、牢房、一份沒人簽的報告。",
		desc: "小鎮警局。彈藥可能還鎖著。走廊盡頭有拖步聲。",
		zombies: 9,
		fuel: 1,
		image: "/art/loc-pd.jpg",
		zones: [
			"大廳",
			"槍械庫",
			"牢房"
		],
		loot: {
			ammo: [4, 10],
			materials: [1, 3],
			medicine: [0, 2]
		},
		survivorChance: .35,
		occupyCapacity: 4,
		occupyFacilities: {
			beds: 1,
			workshop: 1,
			watch: 1
		},
		occupyBarricade: 60,
		neighbors: [
			"muldraugh_farm",
			"muldraugh_wh",
			"march_ridge",
			"rosewood_prison",
			"brandenburg",
			"irvington_scrap"
		],
		lat: 37.652,
		lng: -86.248,
		startKnown: true
	},
	{
		id: "muldraugh_wh",
		name: "莫卓倉庫",
		nameEn: "Muldraugh Depot",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "貨盤、叉車、沒開完的罐頭箱。",
		desc: "物流倉。食物與建材成堆，也養了一整棟的東西。",
		zombies: 16,
		fuel: 1,
		image: "/art/loc-warehouse.jpg",
		zones: [
			"卸貨台",
			"貨架區",
			"辦公室",
			"冷藏間"
		],
		loot: {
			food: [4, 10],
			materials: [4, 8],
			fuel: [1, 3]
		},
		survivorChance: .25,
		occupyCapacity: 6,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			workshop: 1
		},
		occupyBarricade: 45,
		neighbors: [
			"muldraugh_farm",
			"westpoint_town",
			"rosewood_pd",
			"brandenburg"
		],
		lat: 37.948,
		lng: -85.972,
		startKnown: true
	},
	{
		id: "riverside_mart",
		name: "河畔雜貨",
		nameEn: "Riverside Mart",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "小鎮超市。入門課。",
		desc: "貨架倒了，冷凍櫃還在滴。第一個敢去的地方，往往也最教訓人。",
		zombies: 6,
		fuel: 1,
		image: "/art/loc-mall.jpg",
		zones: [
			"收銀區",
			"貨架",
			"後倉"
		],
		loot: {
			food: [3, 7],
			water: [2, 5],
			medicine: [0, 2]
		},
		survivorChance: .55,
		occupyCapacity: 3,
		occupyFacilities: {
			beds: 1,
			kitchen: 1
		},
		occupyBarricade: 30,
		neighbors: [
			"muldraugh_farm",
			"westpoint_town",
			"echo_creek",
			"doe_valley"
		],
		lat: 38.376,
		lng: -86.162,
		startKnown: true
	},
	{
		id: "westpoint_town",
		name: "西點市區",
		nameEn: "West Point",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "槍店、加油站、一條死主街。",
		desc: "肯塔基小鎮中心。有油有彈，也有從路易斯維爾漂下來的屍潮。",
		zombies: 18,
		fuel: 1,
		image: "/art/title.jpg",
		zones: [
			"主街",
			"槍店",
			"加油站",
			"民宅"
		],
		loot: {
			ammo: [3, 8],
			fuel: [2, 5],
			food: [2, 5],
			materials: [2, 5]
		},
		survivorChance: .3,
		occupyCapacity: 6,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			workshop: 1,
			watch: 1
		},
		occupyBarricade: 40,
		neighbors: [
			"westpoint_shop",
			"louisville_er",
			"muldraugh_wh",
			"riverside_mart",
			"lexington",
			"doe_valley",
			"louisville_apt"
		],
		lat: 37.845,
		lng: -85.95
	},
	{
		id: "march_ridge",
		name: "三月嶺",
		nameEn: "March Ridge",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "封閉社區。有人曾試圖守住。",
		desc: "鐵門半開。裡面不是空的——有人留了字條，也留了咬痕。",
		zombies: 14,
		fuel: 2,
		image: "/art/shelter-farm.jpg",
		zones: [
			"大門",
			"俱樂部",
			"連棟住宅",
			"地下室"
		],
		loot: {
			food: [3, 6],
			materials: [3, 7],
			ammo: [1, 4],
			medicine: [1, 3]
		},
		survivorChance: .4,
		occupyCapacity: 7,
		occupyFacilities: {
			beds: 2,
			kitchen: 1,
			garden: 1,
			watch: 1
		},
		occupyBarricade: 55,
		neighbors: [
			"rosewood_pd",
			"louisville_mall",
			"rosewood_prison"
		],
		lat: 37.718,
		lng: -85.698
	},
	{
		id: "louisville_er",
		name: "路易斯維爾醫院",
		nameEn: "Louisville General",
		state: "肯塔基",
		region: "ky",
		size: "city",
		blurb: "藥還在。東西也在。",
		desc: "急診門開著。推床卡在坡道。藥局是這座城最值錢的房間。",
		zombies: 28,
		fuel: 2,
		image: "/art/loc-hospital.jpg",
		zones: [
			"急診",
			"藥局",
			"病房",
			"停屍間",
			"屋頂"
		],
		loot: {
			medicine: [6, 14],
			food: [2, 5],
			materials: [2, 4]
		},
		survivorChance: .45,
		occupyCapacity: 8,
		occupyFacilities: {
			beds: 2,
			infirmary: 2,
			kitchen: 1,
			water: 1
		},
		occupyBarricade: 40,
		neighbors: [
			"louisville_apt",
			"louisville_mall",
			"westpoint_town",
			"cincinnati",
			"louisville_school",
			"lexington"
		],
		lat: 38.248,
		lng: -85.763
	},
	{
		id: "louisville_mall",
		name: "路易斯維爾商場",
		nameEn: "Louisville Mall",
		state: "肯塔基",
		region: "ky",
		size: "city",
		blurb: "消費時代的墳。",
		desc: "電扶梯停在半途。推車與植物爭地。食物、衣物、還有太多迴音。",
		zombies: 32,
		fuel: 2,
		image: "/art/loc-mall.jpg",
		zones: [
			"中庭",
			"超市",
			"運動用品",
			"停車場",
			"員工通道"
		],
		loot: {
			food: [6, 12],
			materials: [3, 6],
			ammo: [1, 4],
			fuel: [1, 3]
		},
		survivorChance: .35,
		occupyCapacity: 10,
		occupyFacilities: {
			beds: 2,
			kitchen: 2,
			workshop: 1,
			radio: 1
		},
		occupyBarricade: 35,
		neighbors: [
			"louisville_er",
			"louisville_apt",
			"fort_knox",
			"nashville",
			"valley_station",
			"march_ridge"
		],
		lat: 38.21,
		lng: -85.68
	},
	{
		id: "fort_knox",
		name: "諾克斯堡",
		nameEn: "Fort Knox",
		state: "肯塔基",
		region: "ky",
		size: "city",
		blurb: "金子沒了。槍還在。",
		desc: "軍營鐵絲網後頭。彈藥庫是傳說，衛兵早就不是衛兵。",
		zombies: 36,
		fuel: 3,
		image: "/art/loc-warehouse.jpg",
		zones: [
			"崗哨",
			"營房",
			"軍械庫",
			"車庫",
			"指揮處"
		],
		loot: {
			ammo: [10, 20],
			fuel: [3, 6],
			medicine: [2, 5],
			food: [2, 5]
		},
		survivorChance: .2,
		occupyCapacity: 10,
		occupyFacilities: {
			beds: 2,
			workshop: 2,
			watch: 2,
			infirmary: 1
		},
		occupyBarricade: 70,
		neighbors: [
			"louisville_mall",
			"nashville",
			"lexington"
		],
		lat: 37.916,
		lng: -85.956
	},
	{
		id: "cincinnati",
		name: "辛辛那提",
		nameEn: "Cincinnati",
		state: "俄亥俄",
		region: "oh",
		size: "city",
		blurb: "過河就是另一個州。",
		desc: "橋還在。河面上漂著的不只是木頭。城裡有人用無線電唱歌。",
		zombies: 40,
		fuel: 3,
		image: "/art/loc-city.jpg",
		zones: [
			"大橋",
			"河岸倉庫",
			"市區藥房",
			"公寓樓",
			"電台"
		],
		loot: {
			food: [4, 9],
			medicine: [3, 7],
			materials: [4, 8],
			ammo: [2, 6]
		},
		survivorChance: .4,
		occupyCapacity: 12,
		occupyFacilities: {
			beds: 2,
			kitchen: 1,
			radio: 2,
			water: 1,
			infirmary: 1
		},
		occupyBarricade: 45,
		neighbors: [
			"louisville_er",
			"indianapolis",
			"chicago",
			"columbus",
			"lexington"
		],
		lat: 39.1031,
		lng: -84.512
	},
	{
		id: "indianapolis",
		name: "印第安納波利斯",
		nameEn: "Indianapolis",
		state: "印第安納",
		region: "in",
		size: "city",
		blurb: "賽車城停了。",
		desc: "環城公路堵死。市區有一座還亮著紅燈的車庫——有人在守。",
		zombies: 38,
		fuel: 4,
		image: "/art/loc-city.jpg",
		zones: [
			"賽車場外",
			"市區",
			"醫院側門",
			"加油站群"
		],
		loot: {
			fuel: [4, 10],
			food: [3, 8],
			materials: [3, 7],
			ammo: [2, 6]
		},
		survivorChance: .35,
		occupyCapacity: 12,
		occupyFacilities: {
			beds: 2,
			workshop: 2,
			kitchen: 1,
			watch: 1
		},
		occupyBarricade: 50,
		neighbors: [
			"cincinnati",
			"chicago",
			"stlouis",
			"gary",
			"columbus"
		],
		lat: 39.7684,
		lng: -86.1581
	},
	{
		id: "nashville",
		name: "納什維爾",
		nameEn: "Nashville",
		state: "田納西",
		region: "tn",
		size: "city",
		blurb: "音樂停了以後，只剩回音。",
		desc: "霓虹死了。有人在唱片行裡設過營，留下一把吉他和三具身體。",
		zombies: 34,
		fuel: 3,
		image: "/art/title.jpg",
		zones: [
			"百老匯",
			"唱片行",
			"超市",
			"河岸",
			"診所"
		],
		loot: {
			food: [4, 8],
			medicine: [2, 6],
			ammo: [2, 5],
			fuel: [2, 4]
		},
		survivorChance: .4,
		occupyCapacity: 11,
		occupyFacilities: {
			beds: 2,
			kitchen: 2,
			radio: 1,
			garden: 1
		},
		occupyBarricade: 40,
		neighbors: [
			"louisville_mall",
			"fort_knox",
			"memphis",
			"stlouis",
			"mammoth_cave"
		],
		lat: 36.1627,
		lng: -86.7816
	},
	{
		id: "memphis",
		name: "孟菲斯",
		nameEn: "Memphis",
		state: "田納西",
		region: "tn",
		size: "city",
		blurb: "密西西比河的南門。",
		desc: "港口貨櫃像墳。河風把味道送得很遠。有人說對岸有船。",
		zombies: 36,
		fuel: 4,
		image: "/art/loc-warehouse.jpg",
		zones: [
			"河港",
			"市區",
			"診所",
			"貨櫃場"
		],
		loot: {
			food: [5, 10],
			fuel: [3, 7],
			materials: [4, 8],
			medicine: [1, 4]
		},
		survivorChance: .3,
		occupyCapacity: 11,
		occupyFacilities: {
			beds: 2,
			kitchen: 1,
			workshop: 1,
			water: 2
		},
		occupyBarricade: 42,
		neighbors: ["nashville", "stlouis"],
		lat: 35.1495,
		lng: -90.049
	},
	{
		id: "stlouis",
		name: "聖路易斯",
		nameEn: "St. Louis",
		state: "密蘇里",
		region: "mo",
		size: "city",
		blurb: "拱門還在。城不在。",
		desc: "拱門影子下，有一支十幾人的營地——不一定歡迎客人。",
		zombies: 42,
		fuel: 4,
		image: "/art/loc-city.jpg",
		zones: [
			"拱門廣場",
			"河岸",
			"市區商場",
			"舊球場",
			"橋頭"
		],
		loot: {
			food: [5, 9],
			materials: [5, 10],
			ammo: [3, 7],
			medicine: [2, 5]
		},
		survivorChance: .5,
		occupyCapacity: 14,
		occupyFacilities: {
			beds: 3,
			kitchen: 2,
			workshop: 1,
			watch: 1,
			radio: 1
		},
		occupyBarricade: 48,
		neighbors: [
			"indianapolis",
			"nashville",
			"memphis",
			"chicago",
			"springfield_il"
		],
		lat: 38.627,
		lng: -90.1994
	},
	{
		id: "chicago",
		name: "芝加哥",
		nameEn: "Chicago",
		state: "伊利諾",
		region: "il",
		size: "metro",
		blurb: "風城。佔領這裡，才算有一座城。",
		desc: "湖風、高樓、沒電的地鐵。清完這裡的東西，美國中西部就有一個真正的家。",
		zombies: 55,
		fuel: 5,
		image: "/art/loc-city.jpg",
		zones: [
			"密歇根大道",
			"地鐵站",
			"湖岸醫院",
			"倉庫區",
			"高樓避難層",
			"電台塔"
		],
		loot: {
			food: [8, 14],
			medicine: [4, 10],
			ammo: [6, 12],
			materials: [6, 12],
			fuel: [3, 6]
		},
		survivorChance: .45,
		occupyCapacity: 18,
		occupyFacilities: {
			beds: 3,
			kitchen: 2,
			workshop: 2,
			infirmary: 2,
			radio: 2,
			watch: 2
		},
		occupyBarricade: 55,
		neighbors: [
			"cincinnati",
			"indianapolis",
			"stlouis",
			"gary",
			"springfield_il"
		],
		lat: 41.8781,
		lng: -87.6298
	},
	{
		id: "echo_creek",
		name: "回聲溪",
		nameEn: "Echo Creek",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "泥路盡頭的農鎮。雞還在叫。",
		desc: "穀倉門半開。鎮上的人走得很整齊——像被誰領過。食物近，援手遠。",
		zombies: 10,
		fuel: 1,
		image: "/art/shelter-farm.jpg",
		zones: [
			"店面",
			"廚房",
			"後院",
			"穀倉"
		],
		loot: {
			food: [3, 7],
			materials: [2, 5],
			water: [1, 3]
		},
		survivorChance: .3,
		occupyCapacity: 4,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			garden: 1,
			water: 1
		},
		occupyBarricade: 42,
		neighbors: [
			"muldraugh_farm",
			"riverside_mart",
			"doe_valley",
			"irvington_scrap"
		],
		lat: 37.812,
		lng: -86.074
	},
	{
		id: "doe_valley",
		name: "鹿谷",
		nameEn: "Doe Valley",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "湖邊木屋。安靜得不像真的。",
		desc: "棧橋還在。湖面漂著空船。適合躲，不適合久留——冬天湖會結，東西會從冰上來。",
		zombies: 7,
		fuel: 1,
		image: "/art/shelter-farm.jpg",
		zones: [
			"湖屋",
			"碼頭棧橋",
			"後院",
			"儲藏"
		],
		loot: {
			food: [3, 6],
			water: [3, 7],
			materials: [1, 3]
		},
		survivorChance: .35,
		occupyCapacity: 4,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			garden: 2,
			water: 2
		},
		occupyBarricade: 38,
		neighbors: [
			"riverside_mart",
			"echo_creek",
			"westpoint_town"
		],
		lat: 38.281,
		lng: -86.041
	},
	{
		id: "irvington_scrap",
		name: "歐文頓廢鐵場",
		nameEn: "Irvington Scrap",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "車殼堆成牆。扳手比槍多。",
		desc: "壓縮機還卡著一輛皮卡。鐵、油、會響的東西。適合技工，不適合偷偷摸摸。",
		zombies: 12,
		fuel: 1,
		image: "/art/loc-warehouse.jpg",
		zones: [
			"廢鐵堆",
			"車庫",
			"工具間",
			"辦公室"
		],
		loot: {
			materials: [6, 12],
			fuel: [2, 5],
			ammo: [0, 2]
		},
		survivorChance: .22,
		occupyCapacity: 4,
		occupyFacilities: {
			beds: 1,
			workshop: 2,
			watch: 1
		},
		occupyBarricade: 52,
		neighbors: [
			"rosewood_pd",
			"echo_creek",
			"brandenburg"
		],
		lat: 37.59,
		lng: -86.284
	},
	{
		id: "rosewood_prison",
		name: "玫瑰鎮監獄",
		nameEn: "Rosewood Prison",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "鐵門、走廊、沒人開的槍櫃。",
		desc: "探訪室玻璃碎了。牢房門一扇扇開著。裡面的東西還穿著制服。彈藥多，退路少。",
		zombies: 30,
		fuel: 1,
		image: "/art/loc-pd.jpg",
		zones: [
			"大廳",
			"牢房",
			"槍械庫",
			"操場",
			"食堂"
		],
		loot: {
			ammo: [8, 16],
			materials: [4, 8],
			food: [2, 5],
			medicine: [1, 3]
		},
		survivorChance: .28,
		occupyCapacity: 10,
		occupyFacilities: {
			beds: 2,
			workshop: 1,
			watch: 2,
			infirmary: 1
		},
		occupyBarricade: 78,
		neighbors: [
			"rosewood_pd",
			"march_ridge",
			"brandenburg"
		],
		lat: 37.638,
		lng: -86.221
	},
	{
		id: "brandenburg",
		name: "勃蘭登堡",
		nameEn: "Brandenburg",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "河鎮。油從碼頭上來。",
		desc: "渡輪停在半河。主街的加油站被撬過兩次，第三次還有剩。過河往西，肯塔基就變薄了。",
		zombies: 16,
		fuel: 2,
		image: "/art/loc-warehouse.jpg",
		zones: [
			"碼頭",
			"店面",
			"加油站",
			"倉庫"
		],
		loot: {
			fuel: [3, 7],
			materials: [3, 6],
			food: [2, 4],
			ammo: [1, 3]
		},
		survivorChance: .32,
		occupyCapacity: 6,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			workshop: 1,
			water: 1
		},
		occupyBarricade: 44,
		neighbors: [
			"rosewood_pd",
			"muldraugh_wh",
			"rosewood_prison",
			"irvington_scrap",
			"mammoth_cave"
		],
		lat: 37.999,
		lng: -86.169
	},
	{
		id: "louisville_school",
		name: "路易斯維爾高中",
		nameEn: "Louisville High",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "鈴不會再響。體育館還鎖著人。",
		desc: "走廊貼滿黃色通知單。教室桌椅推成牆。有人在這裡守過——字條寫：別下地下室。",
		zombies: 22,
		fuel: 1,
		image: "/art/shelter-highrise.jpg",
		zones: [
			"教室",
			"體育館",
			"走廊",
			"校園藥房",
			"地下室"
		],
		loot: {
			materials: [3, 7],
			food: [2, 5],
			medicine: [1, 4],
			ammo: [0, 2]
		},
		survivorChance: .5,
		occupyCapacity: 9,
		occupyFacilities: {
			beds: 2,
			kitchen: 1,
			infirmary: 1,
			watch: 1
		},
		occupyBarricade: 40,
		neighbors: [
			"louisville_apt",
			"louisville_er",
			"valley_station"
		],
		lat: 38.221,
		lng: -85.758
	},
	{
		id: "valley_station",
		name: "谷站",
		nameEn: "Valley Station",
		state: "肯塔基",
		region: "ky",
		size: "town",
		blurb: "城北郊區商場。推車還排著隊。",
		desc: "停車場的車門全開。超市冷凍櫃化成河。東西多，迴音也多——一聲推車，整層都聽見。",
		zombies: 24,
		fuel: 2,
		image: "/art/loc-mall.jpg",
		zones: [
			"中庭",
			"超市",
			"停車場",
			"員工通道"
		],
		loot: {
			food: [5, 11],
			materials: [2, 5],
			ammo: [1, 3],
			water: [2, 4]
		},
		survivorChance: .38,
		occupyCapacity: 8,
		occupyFacilities: {
			beds: 2,
			kitchen: 2,
			radio: 1
		},
		occupyBarricade: 36,
		neighbors: [
			"louisville_mall",
			"louisville_apt",
			"louisville_school"
		],
		lat: 38.318,
		lng: -85.621
	},
	{
		id: "lexington",
		name: "列克星敦",
		nameEn: "Lexington",
		state: "肯塔基",
		region: "ky",
		size: "city",
		blurb: "大學城。醫院與馬場之間。",
		desc: "校園還插著旗。大學醫院的藥局被搬空一半，另一半鎖在停電的冷櫃裡。有人用廣播唸課表。",
		zombies: 32,
		fuel: 2,
		image: "/art/loc-hospital.jpg",
		zones: [
			"大學醫院",
			"校園",
			"市區藥房",
			"公寓樓"
		],
		loot: {
			medicine: [6, 12],
			food: [3, 6],
			ammo: [1, 4],
			materials: [2, 5]
		},
		survivorChance: .42,
		occupyCapacity: 10,
		occupyFacilities: {
			beds: 2,
			infirmary: 2,
			kitchen: 1,
			radio: 1
		},
		occupyBarricade: 42,
		neighbors: [
			"westpoint_town",
			"louisville_er",
			"cincinnati",
			"fort_knox"
		],
		lat: 38.0406,
		lng: -84.5037
	},
	{
		id: "mammoth_cave",
		name: "猛瑪洞穴",
		nameEn: "Mammoth Cave",
		state: "肯塔基",
		region: "ky",
		size: "outpost",
		blurb: "地底下沒有風。也沒有訊號。",
		desc: "遊客中心的燈碎了。溶洞口涼、黑、有回聲。佔領這裡牆極高——無線電在地下沒用，出門要摸黑。",
		zombies: 9,
		fuel: 2,
		image: "/art/title.jpg",
		zones: [
			"溶洞口",
			"洞穴",
			"探路營",
			"地下河"
		],
		loot: {
			food: [1, 3],
			water: [2, 5],
			materials: [1, 3],
			medicine: [0, 2]
		},
		survivorChance: .16,
		occupyCapacity: 5,
		occupyFacilities: {
			beds: 1,
			kitchen: 1,
			water: 2,
			watch: 1
		},
		occupyBarricade: 82,
		neighbors: [
			"muldraugh_farm",
			"brandenburg",
			"nashville"
		],
		lat: 37.187,
		lng: -86.1
	},
	{
		id: "columbus",
		name: "哥倫布",
		nameEn: "Columbus",
		state: "俄亥俄",
		region: "oh",
		size: "city",
		blurb: "州府還在地圖上。人已經不在。",
		desc: "寬街被公車堵住。醫院側門堆著推床。往東是更空的俄亥俄，往西才是回家的路。",
		zombies: 40,
		fuel: 3,
		image: "/art/loc-city.jpg",
		zones: [
			"市區",
			"醫院側門",
			"倉庫",
			"校園"
		],
		loot: {
			food: [4, 9],
			medicine: [3, 8],
			materials: [4, 8],
			ammo: [2, 5]
		},
		survivorChance: .36,
		occupyCapacity: 12,
		occupyFacilities: {
			beds: 2,
			kitchen: 1,
			infirmary: 1,
			radio: 1,
			watch: 1
		},
		occupyBarricade: 46,
		neighbors: ["cincinnati", "indianapolis"],
		lat: 39.9612,
		lng: -82.9988
	},
	{
		id: "springfield_il",
		name: "斯普林菲爾德",
		nameEn: "Springfield",
		state: "伊利諾",
		region: "il",
		size: "city",
		blurb: "林肯的城。北上就是風城。",
		desc: "州議會的旗還掛著。電台有人唸過避難名單，唸到一半斷了。這裡是芝加哥前的最後一座像樣的城。",
		zombies: 38,
		fuel: 4,
		image: "/art/loc-city.jpg",
		zones: [
			"州議會",
			"市區",
			"醫院側門",
			"電台"
		],
		loot: {
			medicine: [3, 7],
			ammo: [3, 7],
			food: [4, 8],
			materials: [3, 6],
			fuel: [1, 3]
		},
		survivorChance: .35,
		occupyCapacity: 12,
		occupyFacilities: {
			beds: 2,
			kitchen: 1,
			radio: 2,
			infirmary: 1,
			watch: 1
		},
		occupyBarricade: 48,
		neighbors: ["stlouis", "chicago"],
		lat: 39.7817,
		lng: -89.6501
	},
	{
		id: "gary",
		name: "加里",
		nameEn: "Gary",
		state: "印第安納",
		region: "in",
		size: "city",
		blurb: "鋼城。芝加哥的南門。煙囪還在冒——不是煙。",
		desc: "高爐裡有東西在走。廠房鐵皮被風吹得像鐘。建材與燃油成堆，屍潮從湖岸壓過來。清完這裡，芝加哥就在眼前。",
		zombies: 46,
		fuel: 4,
		image: "/art/loc-warehouse.jpg",
		zones: [
			"高爐",
			"廠房",
			"碼頭",
			"市區"
		],
		loot: {
			materials: [8, 14],
			fuel: [3, 7],
			ammo: [2, 5],
			food: [2, 5]
		},
		survivorChance: .2,
		occupyCapacity: 10,
		occupyFacilities: {
			beds: 2,
			workshop: 2,
			watch: 2,
			kitchen: 1
		},
		occupyBarricade: 58,
		neighbors: ["indianapolis", "chicago"],
		lat: 41.5933,
		lng: -87.3464
	}
];
var FIRST_NAMES = [
	"Dale",
	"Lena",
	"Travis",
	"June",
	"Earl",
	"Carla",
	"Marcus",
	"Ruth",
	"Ben",
	"Denise",
	"Cody",
	"Amber",
	"Ray",
	"Patty",
	"Hank",
	"Keisha",
	"Luis",
	"Maria",
	"Omar",
	"Helen",
	"Nate",
	"Ivy",
	"Cole",
	"Fran"
];
var LAST_NAMES = [
	"Brooks",
	"Hale",
	"Nguyen",
	"Ortiz",
	"Walsh",
	"Reed",
	"Bishop",
	"Clarke",
	"Dunn",
	"Farley",
	"Grant",
	"Ingram"
];
function locById(id) {
	return LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0];
}
function occById(id) {
	return OCCUPATIONS.find((o) => o.id === id) ?? OCCUPATIONS[0];
}
function traitById(id) {
	return TRAITS.find((t) => t.id === id);
}
function pickerTraits() {
	return TRAITS.filter((t) => t.kind !== "occ");
}
function traitAllowed(have, next) {
	if (have.includes(next)) return false;
	if ((traitById(next).excludes ?? []).some((x) => have.includes(x))) return false;
	for (const id of have) if ((traitById(id).excludes ?? []).includes(next)) return false;
	return true;
}
function withOccupationTraits(occupation, current) {
	const occIds = new Set(TRAITS.filter((x) => x.kind === "occ").map((x) => x.id));
	const granted = occById(occupation).granted;
	const kept = current.filter((id) => !occIds.has(id));
	const next = [];
	for (const id of [...granted, ...kept]) if (traitAllowed(next, id)) next.push(id);
	return next;
}
function poolOf(occupation, traits) {
	return occById(occupation).pool + traits.reduce((sum, id) => sum + traitById(id).points, 0);
}
function sizeLabel(s) {
	return t(`size.${s}`);
}
var EMPTY_BAG = () => ({
	food: 0,
	water: 0,
	materials: 0,
	medicine: 0,
	ammo: 0,
	fuel: 0
});
function stepRng(r) {
	let a = r + 1831565813 | 0;
	let t = Math.imul(a ^ a >>> 15, 1 | a);
	t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
	return {
		r: a,
		n: ((t ^ t >>> 14) >>> 0) / 4294967296
	};
}
function range(r, min, max) {
	const s = stepRng(r);
	return {
		r: s.r,
		n: min + Math.floor(s.n * (max - min + 1))
	};
}
function pick(r, arr) {
	const s = range(r, 0, arr.length - 1);
	return {
		r: s.r,
		item: arr[s.n]
	};
}
function chance(r, p) {
	const s = stepRng(r);
	return {
		r: s.r,
		ok: s.n < p
	};
}
function jitter(r, base, spread) {
	const s = range(r, -spread, spread);
	return {
		r: s.r,
		n: Math.max(0, base + s.n)
	};
}
function uid(r) {
	const a = stepRng(r);
	const b = stepRng(a.r);
	return {
		r: b.r,
		id: (a.n * 1e9 + b.n * 1e6).toString(36).slice(0, 8)
	};
}
var EQUIP_SLOTS = [
	"weapon",
	"head",
	"body",
	"hands",
	"legs",
	"feet",
	"back"
];
var RARITY_CLASS = {
	common: "text-muted",
	uncommon: "text-stamina",
	rare: "text-thirst",
	epic: "text-accent",
	legendary: "text-hunger"
};
function i(id, slot, rarity, tags, names, stats = {}) {
	return {
		id,
		slot,
		rarity,
		tags,
		names,
		...stats
	};
}
var GEAR = [
	i("knife", "weapon", "common", ["home", "shop"], {
		zh: "菜刀",
		en: "Kitchen Knife",
		ja: "包丁",
		ko: "식칼"
	}, { melee: 6 }),
	i("huntingknife", "weapon", "uncommon", ["farm", "home"], {
		zh: "獵刀",
		en: "Hunting Knife",
		ja: "ハンティングナイフ",
		ko: "사냥칼"
	}, {
		melee: 8,
		stealth: 1
	}),
	i("cleaver", "weapon", "uncommon", ["home", "shop"], {
		zh: "砍骨刀",
		en: "Meat Cleaver",
		ja: "肉切り包丁",
		ko: "식칼도끼"
	}, {
		melee: 9,
		cook: 1
	}),
	i("machete", "weapon", "rare", ["farm", "tool"], {
		zh: "開山刀",
		en: "Machete",
		ja: "マチェット",
		ko: "정글도"
	}, { melee: 13 }),
	i("crowbar", "weapon", "uncommon", ["tool", "work"], {
		zh: "撬棍",
		en: "Crowbar",
		ja: "バール",
		ko: "쇠지렛대"
	}, {
		melee: 10,
		build: 1
	}),
	i("bat", "weapon", "common", ["home", "shop"], {
		zh: "球棒",
		en: "Baseball Bat",
		ja: "バット",
		ko: "야구방망이"
	}, { melee: 8 }),
	i("nailbat", "weapon", "uncommon", ["home", "tool"], {
		zh: "釘棒",
		en: "Nailed Bat",
		ja: "釘バット",
		ko: "못박은 방망이"
	}, { melee: 11 }),
	i("nightstick", "weapon", "uncommon", ["police"], {
		zh: "警棍",
		en: "Nightstick",
		ja: "警棒",
		ko: "경찰봉"
	}, {
		melee: 8,
		combat: 1
	}),
	i("hammer", "weapon", "common", ["tool", "work"], {
		zh: "鐵鎚",
		en: "Hammer",
		ja: "ハンマー",
		ko: "망치"
	}, {
		melee: 7,
		build: 1
	}),
	i("wrench", "weapon", "common", ["tool", "work"], {
		zh: "扳手",
		en: "Pipe Wrench",
		ja: "パイプレンチ",
		ko: "파이프렌치"
	}, {
		melee: 7,
		build: 1
	}),
	i("golf", "weapon", "common", ["home", "shop"], {
		zh: "高爾夫桿",
		en: "Golf Club",
		ja: "ゴルフクラブ",
		ko: "골프채"
	}, { melee: 6 }),
	i("pan", "weapon", "common", ["home"], {
		zh: "平底鍋",
		en: "Frying Pan",
		ja: "フライパン",
		ko: "프라이팬"
	}, {
		melee: 5,
		cook: 1
	}),
	i("woodaxe", "weapon", "uncommon", ["farm", "tool"], {
		zh: "柴斧",
		en: "Wood Axe",
		ja: "薪割り斧",
		ko: "장작도끼"
	}, { melee: 11 }),
	i("axe", "weapon", "rare", ["work", "tool"], {
		zh: "消防斧",
		en: "Fire Axe",
		ja: "消防斧",
		ko: "소방도끼"
	}, { melee: 14 }),
	i("sledge", "weapon", "rare", ["tool", "work"], {
		zh: "大鎚",
		en: "Sledgehammer",
		ja: "大鎚",
		ko: "대형망치"
	}, {
		melee: 16,
		fatigue: 8,
		noise: 2
	}),
	i("spear", "weapon", "rare", ["farm", "tool"], {
		zh: "長矛",
		en: "Spear",
		ja: "槍",
		ko: "창"
	}, {
		melee: 12,
		stealth: 1
	}),
	i("katana", "weapon", "legendary", ["city", "home"], {
		zh: "武士刀",
		en: "Katana",
		ja: "カタナ",
		ko: "카타나"
	}, {
		melee: 18,
		stealth: 1,
		combat: 1
	}),
	i("pistol", "weapon", "uncommon", [
		"police",
		"gun",
		"home"
	], {
		zh: "半自動手槍",
		en: "Pistol",
		ja: "拳銃",
		ko: "권총"
	}, {
		melee: 2,
		gun: true,
		combat: 1
	}),
	i("revolver", "weapon", "rare", ["gun", "home"], {
		zh: "左輪",
		en: "Revolver",
		ja: "リボルバー",
		ko: "리볼버"
	}, {
		melee: 3,
		gun: true,
		combat: 1
	}),
	i("shotgun", "weapon", "rare", [
		"gun",
		"farm",
		"police"
	], {
		zh: "霰彈槍",
		en: "Shotgun",
		ja: "ショットガン",
		ko: "산탄총"
	}, {
		melee: 4,
		gun: true,
		combat: 2,
		noise: 3
	}),
	i("rifle", "weapon", "rare", ["gun", "farm"], {
		zh: "獵槍",
		en: "Hunting Rifle",
		ja: "猟銃",
		ko: "사냥소총"
	}, {
		melee: 3,
		gun: true,
		combat: 2
	}),
	i("assault", "weapon", "epic", ["gun", "mil"], {
		zh: "突擊步槍",
		en: "Assault Rifle",
		ja: "アサルト",
		ko: "돌격소총"
	}, {
		melee: 4,
		gun: true,
		combat: 3,
		noise: 2
	}),
	i("smg", "weapon", "epic", [
		"gun",
		"police",
		"mil"
	], {
		zh: "衝鋒槍",
		en: "SMG",
		ja: "SMG",
		ko: "기관단총"
	}, {
		melee: 3,
		gun: true,
		combat: 2,
		noise: 2
	}),
	i("cap", "head", "common", ["cloth", "shop"], {
		zh: "棒球帽",
		en: "Baseball Cap",
		ja: "キャップ",
		ko: "야구모자"
	}, { morale: 2 }),
	i("beanie", "head", "common", ["cloth", "home"], {
		zh: "毛帽",
		en: "Beanie",
		ja: "ニット帽",
		ko: "비니"
	}, { stealth: 1 }),
	i("cowboyhat", "head", "uncommon", ["farm", "cloth"], {
		zh: "牛仔帽",
		en: "Cowboy Hat",
		ja: "カウボーイハット",
		ko: "카우보이모자"
	}, {
		farm: 1,
		morale: 2
	}),
	i("glasses", "head", "uncommon", ["home", "med"], {
		zh: "眼鏡",
		en: "Glasses",
		ja: "眼鏡",
		ko: "안경"
	}, {
		scavenge: 1,
		medical: 1
	}),
	i("hardhat", "head", "common", ["work", "tool"], {
		zh: "工程盔",
		en: "Hard Hat",
		ja: "ヘルメット",
		ko: "안전모"
	}, { armor: 8 }),
	i("weldmask", "head", "uncommon", ["work", "tool"], {
		zh: "焊罩",
		en: "Welding Mask",
		ja: "溶接面",
		ko: "용접면"
	}, {
		armor: 10,
		build: 1,
		stealth: -1
	}),
	i("bikehelm", "head", "uncommon", ["shop", "home"], {
		zh: "安全帽",
		en: "Motorcycle Helmet",
		ja: "バイクヘルメット",
		ko: "오토바이헬멧"
	}, {
		armor: 12,
		bite: 8
	}),
	i("gasmask", "head", "rare", [
		"med",
		"mil",
		"police"
	], {
		zh: "防毒面具",
		en: "Gas Mask",
		ja: "ガスマスク",
		ko: "방독면"
	}, {
		armor: 8,
		bite: 22,
		medical: 1,
		stealth: -1
	}),
	i("firehelm", "head", "rare", ["work"], {
		zh: "消防盔",
		en: "Firefighter Helmet",
		ja: "消防ヘルメット",
		ko: "소방헬멧"
	}, {
		armor: 16,
		bite: 10
	}),
	i("riothelm", "head", "rare", ["police"], {
		zh: "鎮暴盔",
		en: "Riot Helmet",
		ja: "暴動ヘルメット",
		ko: "진압헬멧"
	}, {
		armor: 18,
		bite: 12,
		stealth: -1
	}),
	i("armyhelm", "head", "epic", ["mil"], {
		zh: "軍盔",
		en: "Combat Helmet",
		ja: "戦闘ヘルメット",
		ko: "전투헬멧"
	}, {
		armor: 22,
		bite: 14,
		combat: 1
	}),
	i("nvg", "head", "legendary", ["mil"], {
		zh: "夜視鏡",
		en: "Night Vision",
		ja: "ナイトビジョン",
		ko: "야간투시경"
	}, {
		stealth: 2,
		combat: 1,
		scavenge: 1
	}),
	i("tshirt", "body", "common", [
		"cloth",
		"home",
		"shop"
	], {
		zh: "T恤",
		en: "T-Shirt",
		ja: "Tシャツ",
		ko: "티셔츠"
	}),
	i("hoodie", "body", "common", ["cloth", "home"], {
		zh: "帽T",
		en: "Hoodie",
		ja: "パーカー",
		ko: "후드티"
	}, { stealth: 1 }),
	i("apron", "body", "common", ["home"], {
		zh: "圍裙",
		en: "Apron",
		ja: "エプロン",
		ko: "앞치마"
	}, { cook: 1 }),
	i("denim", "body", "uncommon", ["cloth", "shop"], {
		zh: "牛仔外套",
		en: "Denim Jacket",
		ja: "デニムジャケット",
		ko: "청재킷"
	}, { armor: 6 }),
	i("leather", "body", "uncommon", ["cloth", "shop"], {
		zh: "皮衣",
		en: "Leather Jacket",
		ja: "レザージャケット",
		ko: "가죽재킷"
	}, {
		armor: 10,
		bite: 6,
		stealth: -1
	}),
	i("raincoat", "body", "uncommon", ["cloth", "shop"], {
		zh: "雨衣",
		en: "Raincoat",
		ja: "レインコート",
		ko: "우비"
	}, { stealth: 1 }),
	i("labcoat", "body", "uncommon", ["med"], {
		zh: "實驗衣",
		en: "Lab Coat",
		ja: "白衣",
		ko: "실험복"
	}, { medical: 2 }),
	i("huntervest", "body", "uncommon", ["farm"], {
		zh: "狩獵背心",
		en: "Hunter Vest",
		ja: "狩猟ベスト",
		ko: "사냥조끼"
	}, {
		scavenge: 1,
		stealth: 1
	}),
	i("policevest", "body", "rare", ["police"], {
		zh: "警用防彈",
		en: "Police Vest",
		ja: "警察ベスト",
		ko: "경찰방탄"
	}, {
		armor: 18,
		bite: 10
	}),
	i("turnout", "body", "rare", ["work"], {
		zh: "消防戰鬥服",
		en: "Turnout Coat",
		ja: "消防服",
		ko: "소방복"
	}, {
		armor: 16,
		bite: 8,
		fatigue: 4
	}),
	i("military", "body", "epic", ["mil"], {
		zh: "軍用夾克",
		en: "Military Jacket",
		ja: "軍ジャケット",
		ko: "군용재킷"
	}, {
		armor: 14,
		combat: 1,
		stealth: 1
	}),
	i("plate", "body", "epic", ["mil"], {
		zh: "插板背心",
		en: "Plate Carrier",
		ja: "プレートキャリア",
		ko: "플레이트캐리어"
	}, {
		armor: 26,
		bite: 16,
		fatigue: 8,
		stealth: -2,
		noise: 1
	}),
	i("riotarmor", "body", "legendary", ["police"], {
		zh: "鎮暴甲",
		en: "Riot Armor",
		ja: "暴動装甲",
		ko: "진압갑"
	}, {
		armor: 32,
		bite: 20,
		fatigue: 10,
		stealth: -2,
		noise: 2
	}),
	i("ghillie", "body", "legendary", ["farm", "mil"], {
		zh: "吉利服",
		en: "Ghillie Suit",
		ja: "ギリースーツ",
		ko: "길리슈트"
	}, {
		stealth: 3,
		scavenge: 1
	}),
	i("latex", "hands", "common", ["med"], {
		zh: "乳膠手套",
		en: "Latex Gloves",
		ja: "ゴム手袋",
		ko: "라텍스장갑"
	}, { medical: 1 }),
	i("workgloves", "hands", "common", ["work", "tool"], {
		zh: "工作手套",
		en: "Work Gloves",
		ja: "作業手袋",
		ko: "작업장갑"
	}, { build: 1 }),
	i("leathergloves", "hands", "uncommon", ["cloth", "shop"], {
		zh: "皮手套",
		en: "Leather Gloves",
		ja: "皮手袋",
		ko: "가죽장갑"
	}, {
		combat: 1,
		armor: 4
	}),
	i("mechanicgl", "hands", "uncommon", ["work", "tool"], {
		zh: "機修手套",
		en: "Mechanic Gloves",
		ja: "整備手袋",
		ko: "정비장갑"
	}, { build: 2 }),
	i("tacticalgl", "hands", "rare", ["mil", "police"], {
		zh: "戰術手套",
		en: "Tactical Gloves",
		ja: "タクティカルグローブ",
		ko: "전술장갑"
	}, {
		combat: 1,
		stealth: 1
	}),
	i("weldglove", "hands", "rare", ["work", "tool"], {
		zh: "焊工手套",
		en: "Welding Gloves",
		ja: "溶接手袋",
		ko: "용접장갑"
	}, {
		build: 2,
		armor: 6
	}),
	i("shorts", "legs", "common", ["cloth", "home"], {
		zh: "短褲",
		en: "Shorts",
		ja: "短パン",
		ko: "반바지"
	}, {
		stealth: 1,
		fatigue: -2
	}),
	i("jeans", "legs", "common", [
		"cloth",
		"home",
		"shop"
	], {
		zh: "牛仔褲",
		en: "Jeans",
		ja: "ジーンズ",
		ko: "청바지"
	}, { armor: 4 }),
	i("cargo", "legs", "uncommon", [
		"cloth",
		"shop",
		"work"
	], {
		zh: "工裝褲",
		en: "Cargo Pants",
		ja: "カーゴパンツ",
		ko: "카고바지"
	}, {
		scavenge: 1,
		carry: 1
	}),
	i("overalls", "legs", "uncommon", ["farm", "work"], {
		zh: "吊帶工作服",
		en: "Overalls",
		ja: "オーバーオール",
		ko: "작업멜빵"
	}, {
		farm: 1,
		build: 1
	}),
	i("leatherpants", "legs", "rare", ["cloth"], {
		zh: "皮褲",
		en: "Leather Pants",
		ja: "レザーパンツ",
		ko: "가죽바지"
	}, {
		armor: 10,
		bite: 6
	}),
	i("firepants", "legs", "rare", ["work"], {
		zh: "消防褲",
		en: "Firefighter Pants",
		ja: "消防ズボン",
		ko: "소방바지"
	}, {
		armor: 12,
		bite: 6
	}),
	i("milpants", "legs", "epic", ["mil"], {
		zh: "軍褲",
		en: "Combat Pants",
		ja: "戦闘ズボン",
		ko: "전투바지"
	}, {
		armor: 12,
		stealth: 1,
		combat: 1
	}),
	i("slippers", "feet", "common", ["home"], {
		zh: "拖鞋",
		en: "Slippers",
		ja: "スリッパ",
		ko: "슬리퍼"
	}, {
		stealth: 1,
		fatigue: -2
	}),
	i("sneakers", "feet", "common", [
		"cloth",
		"shop",
		"home"
	], {
		zh: "球鞋",
		en: "Sneakers",
		ja: "スニーカー",
		ko: "운동화"
	}, { stealth: 1 }),
	i("cowboyboots", "feet", "uncommon", ["farm"], {
		zh: "牛仔靴",
		en: "Cowboy Boots",
		ja: "カウボーイブーツ",
		ko: "카우보이부츠"
	}, {
		farm: 1,
		armor: 4
	}),
	i("workboots", "feet", "uncommon", ["work", "tool"], {
		zh: "工作靴",
		en: "Work Boots",
		ja: "作業靴",
		ko: "작업화"
	}, {
		armor: 6,
		stealth: -1
	}),
	i("hiking", "feet", "uncommon", ["farm", "shop"], {
		zh: "登山鞋",
		en: "Hiking Boots",
		ja: "登山靴",
		ko: "등산화"
	}, {
		fatigue: -6,
		stealth: 1
	}),
	i("steeltoe", "feet", "rare", ["work", "tool"], {
		zh: "鋼頭靴",
		en: "Steel-Toe Boots",
		ja: "安全靴",
		ko: "안전화"
	}, {
		armor: 10,
		build: 1,
		stealth: -1
	}),
	i("combatboots", "feet", "rare", ["mil", "police"], {
		zh: "戰鬥靴",
		en: "Combat Boots",
		ja: "コンバットブーツ",
		ko: "전투화"
	}, {
		armor: 8,
		combat: 1
	}),
	i("fanny", "back", "common", ["shop", "home"], {
		zh: "腰包",
		en: "Fanny Pack",
		ja: "ウエストポーチ",
		ko: "허리가방"
	}, {
		carry: 1,
		stealth: 1
	}),
	i("tote", "back", "common", ["shop", "home"], {
		zh: "手提袋",
		en: "Tote Bag",
		ja: "トート",
		ko: "토트백"
	}, { carry: 1 }),
	i("school", "back", "uncommon", ["home", "shop"], {
		zh: "書包",
		en: "School Backpack",
		ja: "通学リュック",
		ko: "책가방"
	}, { carry: 2 }),
	i("duffel", "back", "uncommon", ["shop", "home"], {
		zh: "行李袋",
		en: "Duffel Bag",
		ja: "ダッフル",
		ko: "더플백"
	}, { carry: 2 }),
	i("hikingpack", "back", "rare", ["farm", "shop"], {
		zh: "登山包",
		en: "Hiking Pack",
		ja: "登山リュック",
		ko: "등산배낭"
	}, {
		carry: 3,
		fatigue: 2
	}),
	i("rucksack", "back", "rare", ["mil"], {
		zh: "軍用背包",
		en: "Rucksack",
		ja: "軍用リュック",
		ko: "군용배낭"
	}, { carry: 4 }),
	i("alice", "back", "epic", ["mil"], {
		zh: "ALICE 背包",
		en: "ALICE Pack",
		ja: "ALICEパック",
		ko: "ALICE 배낭"
	}, {
		carry: 5,
		scavenge: 1
	}),
	i("survivorpack", "back", "legendary", ["mil", "city"], {
		zh: "倖存者背包",
		en: "Survivor Pack",
		ja: "サバイバーパック",
		ko: "생존배낭"
	}, {
		carry: 6,
		scavenge: 1,
		stealth: 1
	})
];
var BY_ID = new Map(GEAR.map((g) => [g.id, g]));
var VISUAL = {
	knife: { img: "knife" },
	huntingknife: { img: "knife" },
	cleaver: {
		img: "knife",
		filter: "sepia(0.35)"
	},
	machete: {
		img: "axe",
		filter: "saturate(0.5) brightness(1.1)"
	},
	crowbar: {
		img: "axe",
		filter: "grayscale(0.7) brightness(0.85)"
	},
	bat: { img: "bat" },
	nailbat: {
		img: "bat",
		filter: "contrast(1.15)"
	},
	nightstick: {
		img: "bat",
		filter: "grayscale(1) brightness(0.7)"
	},
	hammer: {
		img: "axe",
		filter: "sepia(0.4) saturate(0.6)"
	},
	wrench: {
		img: "axe",
		filter: "hue-rotate(200deg) saturate(0.4)"
	},
	golf: {
		img: "bat",
		filter: "brightness(1.2)"
	},
	pan: {
		img: "knife",
		filter: "grayscale(0.3)"
	},
	woodaxe: {
		img: "axe",
		filter: "sepia(0.5)"
	},
	axe: { img: "axe" },
	sledge: {
		img: "axe",
		filter: "grayscale(0.5) contrast(1.2)"
	},
	spear: {
		img: "rifle",
		filter: "sepia(0.4)"
	},
	katana: {
		img: "rifle",
		filter: "grayscale(0.2) brightness(1.2)"
	},
	pistol: { img: "pistol" },
	revolver: {
		img: "pistol",
		filter: "sepia(0.45)"
	},
	shotgun: {
		img: "rifle",
		filter: "contrast(1.1)"
	},
	rifle: { img: "rifle" },
	assault: {
		img: "rifle",
		filter: "grayscale(0.4) brightness(0.9)"
	},
	smg: {
		img: "pistol",
		filter: "grayscale(0.3) brightness(0.85)"
	},
	cap: { img: "hat" },
	beanie: {
		img: "hat",
		filter: "hue-rotate(210deg) saturate(0.55)"
	},
	cowboyhat: {
		img: "hat",
		filter: "sepia(0.7) hue-rotate(5deg)"
	},
	glasses: { img: "glasses" },
	hardhat: {
		img: "helm",
		filter: "sepia(0.8) hue-rotate(5deg) saturate(1.4)"
	},
	weldmask: {
		img: "gasmask",
		filter: "brightness(0.7)"
	},
	bikehelm: {
		img: "helm",
		filter: "grayscale(0.8) brightness(0.75)"
	},
	gasmask: { img: "gasmask" },
	firehelm: {
		img: "helm",
		filter: "sepia(0.6) hue-rotate(-10deg) saturate(1.3)"
	},
	riothelm: {
		img: "helm",
		filter: "grayscale(0.5) contrast(1.15)"
	},
	armyhelm: { img: "helm" },
	nvg: {
		img: "gasmask",
		filter: "hue-rotate(90deg) saturate(0.7) brightness(0.85)"
	},
	tshirt: { img: "" },
	hoodie: { img: "hoodie" },
	apron: {
		img: "labcoat",
		filter: "sepia(0.2) brightness(1.05)"
	},
	denim: {
		img: "hoodie",
		filter: "hue-rotate(200deg) saturate(0.7)"
	},
	leather: { img: "leather" },
	raincoat: {
		img: "hoodie",
		filter: "hue-rotate(160deg) saturate(0.5)"
	},
	labcoat: { img: "labcoat" },
	huntervest: {
		img: "vest",
		filter: "hue-rotate(70deg) saturate(0.8)"
	},
	policevest: { img: "vest" },
	turnout: { img: "turnout" },
	military: {
		img: "hoodie",
		filter: "hue-rotate(70deg) saturate(0.45) brightness(0.85)"
	},
	plate: { img: "plate" },
	riotarmor: {
		img: "plate",
		filter: "grayscale(0.35) contrast(1.15)"
	},
	ghillie: {
		img: "hoodie",
		filter: "hue-rotate(80deg) saturate(1.2)"
	},
	latex: {
		img: "gloves",
		filter: "brightness(1.3) saturate(0.2)"
	},
	workgloves: { img: "gloves" },
	leathergloves: {
		img: "gloves",
		filter: "sepia(0.5)"
	},
	mechanicgl: {
		img: "gloves",
		filter: "grayscale(0.4)"
	},
	tacticalgl: {
		img: "gloves",
		filter: "grayscale(0.7) brightness(0.8)"
	},
	weldglove: {
		img: "gloves",
		filter: "sepia(0.3) brightness(0.75)"
	},
	shorts: { img: "" },
	jeans: { img: "jeans" },
	cargo: {
		img: "jeans",
		filter: "sepia(0.35) hue-rotate(20deg)"
	},
	overalls: {
		img: "jeans",
		filter: "hue-rotate(50deg) saturate(0.7)"
	},
	leatherpants: {
		img: "jeans",
		filter: "sepia(0.8) brightness(0.7)"
	},
	firepants: {
		img: "jeans",
		filter: "sepia(0.7) hue-rotate(-15deg)"
	},
	milpants: {
		img: "jeans",
		filter: "hue-rotate(70deg) saturate(0.5) brightness(0.8)"
	},
	slippers: {
		img: "boots",
		filter: "brightness(1.25) saturate(0.4)"
	},
	sneakers: {
		img: "boots",
		filter: "grayscale(0.3) brightness(1.15)"
	},
	cowboyboots: {
		img: "boots",
		filter: "sepia(0.7)"
	},
	workboots: { img: "boots" },
	hiking: {
		img: "boots",
		filter: "hue-rotate(30deg) saturate(0.7)"
	},
	steeltoe: {
		img: "boots",
		filter: "grayscale(0.4) contrast(1.1)"
	},
	combatboots: {
		img: "boots",
		filter: "grayscale(0.6) brightness(0.8)"
	},
	fanny: {
		img: "pack",
		filter: "brightness(1.2) saturate(0.6)"
	},
	tote: {
		img: "pack",
		filter: "sepia(0.3)"
	},
	school: { img: "pack" },
	duffel: {
		img: "pack",
		filter: "grayscale(0.3)"
	},
	hikingpack: {
		img: "pack",
		filter: "hue-rotate(40deg)"
	},
	rucksack: {
		img: "pack",
		filter: "hue-rotate(70deg) saturate(0.6)"
	},
	alice: {
		img: "pack",
		filter: "hue-rotate(80deg) brightness(0.85)"
	},
	survivorpack: {
		img: "pack",
		filter: "sepia(0.25) contrast(1.1)"
	}
};
function visualOf(id) {
	return VISUAL[id] ?? { img: "" };
}
function gearIcon(id) {
	const v = visualOf(id);
	return v.img ? asset(`/art/gear/${v.img}.png`) : null;
}
function gearById(id) {
	return BY_ID.get(id);
}
function itemName(item) {
	const id = typeof item === "string" ? item : item.defId;
	const def = gearById(id);
	if (!def) return id;
	const loc = getLocale();
	return def.names[loc] ?? def.names.zh;
}
function labelItem(item) {
	return `${itemName(item)} ${item.cond}%`;
}
function condMul(cond) {
	return cond <= 0 ? 0 : .35 + cond / 100 * .65;
}
function wornPieces(s) {
	const out = [];
	for (const slot of EQUIP_SLOTS) {
		const it = s.worn?.[slot];
		if (it) out.push(it);
	}
	return out;
}
function liveWeapon(s) {
	const it = s.worn?.weapon;
	if (!it || it.cond <= 0) return {
		id: "fists",
		melee: 0,
		gun: false
	};
	const n = gearById(it.defId);
	if (!n || n.slot !== "weapon") return {
		id: "fists",
		melee: 0,
		gun: false
	};
	return {
		id: n.id || "fists",
		melee: Math.round((n.melee ?? 0) * condMul(it.cond)),
		gun: !!n.gun
	};
}
function gearSkills(s) {
	const out = {
		combat: 0,
		stealth: 0,
		scavenge: 0,
		medical: 0,
		build: 0,
		farm: 0,
		cook: 0
	};
	for (const it of wornPieces(s)) {
		const g = gearById(it.defId);
		if (!g || it.cond <= 0) continue;
		const m = condMul(it.cond);
		out.combat += (g.combat ?? 0) * m;
		out.stealth += (g.stealth ?? 0) * m;
		out.scavenge += (g.scavenge ?? 0) * m;
		out.medical += (g.medical ?? 0) * m;
		out.build += (g.build ?? 0) * m;
		out.farm += (g.farm ?? 0) * m;
		out.cook += (g.cook ?? 0) * m;
	}
	return out;
}
function armorOf(s) {
	let armor = 0;
	let bite = 0;
	let noise = 0;
	let fatigue = 0;
	let carry = 0;
	for (const it of wornPieces(s)) {
		const g = gearById(it.defId);
		if (!g || it.cond <= 0) continue;
		const m = condMul(it.cond);
		armor += (g.armor ?? 0) * m;
		bite += (g.bite ?? 0) * m;
		noise += g.noise ?? 0;
		fatigue += g.fatigue ?? 0;
		carry += (g.carry ?? 0) * m;
	}
	return {
		armor,
		bite,
		noise,
		fatigue,
		carry
	};
}
function dmgFromArmor(s) {
	return 1 - Math.min(.52, armorOf(s).armor / 78);
}
function infectFromArmor(s) {
	return 1 - Math.min(.48, armorOf(s).bite / 70);
}
function carryOf(people) {
	return people.reduce((n, s) => n + armorOf(s).carry, 0);
}
function luckMult(s) {
	let m = 1;
	if (s.traits.includes("lucky")) m *= 1.22;
	if (s.traits.includes("unlucky")) m *= .78;
	if (s.traits.includes("organized")) m *= 1.1;
	if (s.traits.includes("dextrous")) m *= 1.06;
	return m;
}
function gearStatBits(def) {
	const bits = [];
	if (def.melee) bits.push(t("gear.stat.atk", { n: def.melee }));
	if (def.gun) bits.push(t("gear.stat.gun"));
	if (def.armor) bits.push(t("gear.stat.arm", { n: def.armor }));
	if (def.bite) bits.push(t("gear.stat.bite", { n: def.bite }));
	if (def.combat) bits.push(t("gear.stat.cmb", { n: signed(def.combat) }));
	if (def.stealth) bits.push(t("gear.stat.sth", { n: signed(def.stealth) }));
	if (def.scavenge) bits.push(t("gear.stat.scv", { n: signed(def.scavenge) }));
	if (def.medical) bits.push(t("gear.stat.med", { n: signed(def.medical) }));
	if (def.build) bits.push(t("gear.stat.bld", { n: signed(def.build) }));
	if (def.farm) bits.push(t("gear.stat.frm", { n: signed(def.farm) }));
	if (def.cook) bits.push(t("gear.stat.ck", { n: signed(def.cook) }));
	if (def.carry) bits.push(t("gear.stat.bag", { n: def.carry }));
	if (def.fatigue) bits.push(t("gear.stat.fat", { n: signed(def.fatigue) }));
	if (def.noise) bits.push(t("gear.stat.noise", { n: signed(def.noise) }));
	return bits;
}
function signed(n) {
	return n > 0 ? `+${n}` : String(n);
}
var LOC_TAGS = {
	muldraugh_farm: [
		"farm",
		"home",
		"tool",
		"cloth"
	],
	westpoint_shop: [
		"tool",
		"work",
		"shop",
		"cloth"
	],
	louisville_apt: [
		"home",
		"cloth",
		"bag",
		"shop"
	],
	rosewood_pd: [
		"police",
		"gun",
		"armor"
	],
	muldraugh_wh: [
		"tool",
		"work",
		"bag"
	],
	riverside_mart: [
		"shop",
		"cloth",
		"bag",
		"home"
	],
	westpoint_town: [
		"shop",
		"gun",
		"cloth",
		"home"
	],
	march_ridge: [
		"home",
		"cloth",
		"gun"
	],
	louisville_er: [
		"med",
		"cloth",
		"home"
	],
	louisville_mall: [
		"cloth",
		"bag",
		"shop"
	],
	fort_knox: [
		"mil",
		"gun",
		"armor"
	],
	cincinnati: [
		"city",
		"cloth",
		"gun"
	],
	indianapolis: [
		"city",
		"gun",
		"armor"
	],
	nashville: [
		"city",
		"cloth",
		"bag"
	],
	memphis: [
		"city",
		"gun",
		"tool"
	],
	stlouis: [
		"city",
		"armor",
		"bag"
	],
	chicago: [
		"city",
		"mil",
		"gun",
		"armor"
	],
	echo_creek: [
		"farm",
		"home",
		"tool",
		"cloth"
	],
	doe_valley: [
		"farm",
		"home",
		"cloth"
	],
	irvington_scrap: [
		"tool",
		"work",
		"bag"
	],
	rosewood_prison: [
		"police",
		"gun",
		"armor",
		"mil"
	],
	brandenburg: [
		"tool",
		"work",
		"shop"
	],
	louisville_school: [
		"home",
		"cloth",
		"med"
	],
	valley_station: [
		"shop",
		"cloth",
		"bag"
	],
	lexington: [
		"med",
		"city",
		"cloth"
	],
	mammoth_cave: [
		"farm",
		"home",
		"tool"
	],
	columbus: [
		"city",
		"med",
		"cloth"
	],
	springfield_il: [
		"city",
		"med",
		"gun"
	],
	gary: [
		"work",
		"tool",
		"mil",
		"armor"
	]
};
function locLuck(id) {
	if (id === "fort_knox" || id === "chicago" || id === "rosewood_prison") return 1.85;
	if (id === "gary" || id === "lexington") return 1.55;
	if (id === "rosewood_pd" || id === "louisville_er") return 1.4;
	if (id.includes("louisville") || id === "indianapolis" || id === "springfield_il") return 1.25;
	if (id === "irvington_scrap" || id === "columbus") return 1.15;
	if (id === "riverside_mart" || id === "muldraugh_farm" || id === "echo_creek" || id === "doe_valley") return .72;
	if (id === "mammoth_cave") return .62;
	return 1;
}
function rollRarity(r, luck, locMul, day) {
	const late = 1 + Math.min(.45, Math.max(0, day - 8) * .03);
	let common = 54;
	const uncommon = 27;
	const rare = 12 * luck * locMul * late;
	const epic = 5 * luck * locMul * late;
	const legendary = 1.2 * luck * locMul * late;
	if (luck < 1) common += 8;
	const total = common + uncommon + rare + epic + legendary;
	const roll = range(r, 0, Math.floor(total * 10));
	let d = roll.n / 10;
	if ((d -= common) <= 0) return {
		r: roll.r,
		rarity: "common"
	};
	if ((d -= uncommon) <= 0) return {
		r: roll.r,
		rarity: "uncommon"
	};
	if ((d -= rare) <= 0) return {
		r: roll.r,
		rarity: "rare"
	};
	if ((d -= epic) <= 0) return {
		r: roll.r,
		rarity: "epic"
	};
	return {
		r: roll.r,
		rarity: "legendary"
	};
}
function rollCond(r, rarity) {
	const [a, b] = {
		common: [38, 82],
		uncommon: [48, 90],
		rare: [55, 94],
		epic: [68, 100],
		legendary: [80, 100]
	}[rarity];
	return range(r, a, b);
}
function makeItem(r, defId, cond) {
	const u = uid(r);
	return {
		r: u.r,
		item: {
			uid: u.id,
			defId,
			cond
		}
	};
}
function mintGear(r, defId, cond) {
	const def = gearById(defId);
	const n = cond ?? (def ? rollCond(r, def.rarity).n : 70);
	return makeItem(r, defId, Math.max(1, Math.min(100, n)));
}
function rollSearchGear(r, locId, n) {
	const tags = LOC_TAGS[locId] ?? ["home", "cloth"];
	const locMul = locLuck(locId);
	let p = .38 + n.carry * .055 + (n.loud ? .1 : 0) + Math.min(.12, n.day * .004) + (n.gearP ?? 0);
	p *= n.luck;
	const items = [];
	const tries = (n.carry >= 5 ? 3 : n.carry >= 2 ? 2 : 1) + (n.extraGear ?? 0);
	for (let i = 0; i < tries; i++) {
		const hit = chance(r, i === 0 ? p : p * .45);
		r = hit.r;
		if (!hit.ok) continue;
		const rar = rollRarity(r, n.luck, locMul, n.day);
		r = rar.r;
		let pool = GEAR.filter((g) => g.rarity === rar.rarity && g.tags.some((tag) => tags.includes(tag)));
		if (!pool.length) pool = GEAR.filter((g) => g.rarity === rar.rarity);
		if (!pool.length) pool = GEAR.filter((g) => g.rarity === "common");
		const chosen = pick(r, pool);
		r = chosen.r;
		const cond = rollCond(r, chosen.item.rarity);
		r = cond.r;
		const made = makeItem(r, chosen.item.id, cond.n);
		r = made.r;
		items.push(made.item);
	}
	return {
		r,
		items
	};
}
var KIT = {
	firefighter: [
		"tshirt",
		"jeans",
		"workboots",
		"axe",
		"firehelm",
		"turnout"
	],
	doctor: [
		"tshirt",
		"jeans",
		"sneakers",
		"huntingknife",
		"latex",
		"labcoat"
	],
	officer: [
		"tshirt",
		"jeans",
		"combatboots",
		"pistol",
		"policevest"
	],
	chef: [
		"tshirt",
		"jeans",
		"sneakers",
		"cleaver",
		"apron"
	],
	mechanic: [
		"tshirt",
		"jeans",
		"steeltoe",
		"wrench",
		"mechanicgl"
	],
	farmer: [
		"tshirt",
		"overalls",
		"workboots",
		"woodaxe",
		"cowboyhat"
	],
	veteran: [
		"tshirt",
		"milpants",
		"combatboots",
		"pistol",
		"military"
	],
	burglar: [
		"hoodie",
		"jeans",
		"sneakers",
		"huntingknife",
		"school"
	]
};
var KIT_EXTRA = {
	chef: ["pan"],
	mechanic: ["workgloves"],
	veteran: ["armyhelm"]
};
function dressSurvivor(r, occ, s) {
	const ids = KIT[occ] ?? KIT.farmer;
	const worn = { ...s.worn ?? {} };
	let weapon = s.weapon;
	for (const id of ids) {
		const def = gearById(id);
		if (!def) continue;
		const cond = range(r, 68, 92);
		r = cond.r;
		const made = makeItem(r, id, cond.n);
		r = made.r;
		worn[def.slot] = made.item;
		if (def.slot === "weapon") weapon = def.id;
	}
	const extra = [];
	for (const id of KIT_EXTRA[occ] ?? []) {
		const cond = range(r, 60, 88);
		r = cond.r;
		const made = makeItem(r, id, cond.n);
		r = made.r;
		extra.push(made.item);
	}
	return {
		r,
		s: {
			...s,
			worn,
			weapon
		},
		extra
	};
}
function degradeWorn(s, slot, amt) {
	const it = s.worn?.[slot];
	if (!it) return s;
	const cond = Math.max(0, it.cond - amt);
	const worn = {
		...s.worn,
		[slot]: {
			...it,
			cond
		}
	};
	const weapon = slot === "weapon" && cond <= 0 ? "fists" : s.weapon;
	return {
		...s,
		worn,
		weapon
	};
}
function salvageWorn(s) {
	return wornPieces(s);
}
function repairWorst(items, amount) {
	if (!items.length) return items;
	let idx = 0;
	for (let i = 1; i < items.length; i++) if (items[i].cond < items[idx].cond) idx = i;
	if (items[idx].cond >= 100) return items;
	const next = items.slice();
	next[idx] = {
		...next[idx],
		cond: Math.min(100, next[idx].cond + amount)
	};
	return next;
}
var SKILL_KEYS = [
	"combat",
	"stealth",
	"scavenge",
	"medical",
	"build",
	"farm",
	"cook"
];
function emptySkills() {
	return {
		combat: 0,
		stealth: 0,
		scavenge: 0,
		medical: 0,
		build: 0,
		farm: 0,
		cook: 0
	};
}
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function clampSkill(n) {
	return clamp(Math.round(n), 0, 10);
}
/** Project Zomboid: XP speed is locked by the level you started with. */
function startXpMul(baseLevel) {
	const n = clamp(baseLevel, 0, 10);
	if (n <= 0) return .25;
	if (n === 1) return 1;
	if (n === 2) return 1.33;
	return 1.66;
}
function learnerRate(traits) {
	let r = 1;
	if (traits.includes("fastlearner")) r += .35;
	if (traits.includes("slowlearner")) r -= .35;
	return Math.max(.4, r);
}
function skillLearnMul(s, skill) {
	return startXpMul(s.skillBase?.[skill] ?? 0) * learnerRate(s.traits);
}
/** Same curve as before — 36, 51, 73… so old progress still reads. */
function xpToNext(level) {
	return Math.round(36 * Math.pow(1.42, clamp(level, 0, 9)));
}
function skillFx(skill, level) {
	const lv = clampSkill(level);
	return {
		atk: skill === "combat" ? lv * 8 : 0,
		woundPct: skill === "combat" ? Math.round(lv * 3.5) : 0,
		extraKill: skill === "combat" ? (lv >= 5 ? 1 : 0) + (lv >= 8 ? 1 : 0) + (lv >= 10 ? 1 : 0) : 0,
		noisePct: skill === "stealth" ? Math.round(lv * 7) : 0,
		flankNeed: skill === "stealth" ? lv >= 5 ? 5 : 6 : 6,
		extraFlank: skill === "stealth" ? (lv >= 6 ? 1 : 0) + (lv >= 9 ? 1 : 0) : 0,
		quietLoot: skill === "stealth" ? (lv >= 4 ? 1.12 : 1) + (lv >= 7 ? .1 : 0) : 1,
		loot: skill === "scavenge" ? .7 + lv / 14 : 1,
		gearP: skill === "scavenge" ? lv * .025 : 0,
		extraGear: skill === "scavenge" && lv >= 7 ? 1 : 0,
		heal: skill === "medical" ? 10 + lv : 0,
		cure: skill === "medical" ? .4 + lv / 15 : 0,
		tendHp: skill === "medical" ? (lv >= 4 ? 2 : 0) + (lv >= 8 ? 4 : 0) : 0,
		wall: skill === "build" ? 8 + lv : 0,
		wallExtra: skill === "build" ? (lv >= 7 ? 3 : 0) + (lv >= 10 ? 4 : 0) : 0,
		mend: skill === "build" ? 6 + lv : 0,
		doubleMend: skill === "build" && lv >= 8,
		farmMul: skill === "farm" ? .45 + lv / 14 : 0,
		extraCrop: skill === "farm" ? (lv >= 4 ? 1 : 0) + (lv >= 8 ? 1 : 0) + (lv >= 10 ? 1 : 0) : 0,
		cookFood: skill === "cook" ? (lv >= 4 ? 1 : 0) + (lv >= 8 ? 1 : 0) + (lv >= 10 ? 1 : 0) : 0,
		cookMorale: skill === "cook" ? (lv >= 2 ? 2 : 0) + (lv >= 6 ? 4 : 0) + (lv >= 10 ? 6 : 0) : 0
	};
}
function skillBoostBits(skill, level) {
	const lv = clampSkill(level);
	const fx = skillFx(skill, lv);
	const bits = [];
	if (skill === "combat") {
		bits.push(t("skill.bit.atk", { n: fx.atk }));
		if (fx.woundPct) bits.push(t("skill.bit.wound", { n: fx.woundPct }));
		if (fx.extraKill) bits.push(t("skill.bit.kill", { n: fx.extraKill }));
		if (lv === 0) bits.push(t("skill.bit.combat0"));
	} else if (skill === "stealth") {
		bits.push(t("skill.bit.noise", { n: fx.noisePct }));
		bits.push(t("skill.bit.flank", { n: fx.flankNeed }));
		if (fx.extraFlank) bits.push(t("skill.bit.flankKill", { n: fx.extraFlank }));
		if (fx.quietLoot > 1) bits.push(t("skill.bit.quietLoot"));
	} else if (skill === "scavenge") {
		bits.push(t("skill.bit.loot", { n: Math.round(fx.loot * 100) }));
		if (fx.gearP) bits.push(t("skill.bit.gear", { n: Math.round(fx.gearP * 100) }));
		if (fx.extraGear) bits.push(t("skill.bit.extraGear"));
	} else if (skill === "medical") {
		bits.push(t("skill.bit.heal", { n: fx.heal }));
		bits.push(t("skill.bit.cure", { n: Math.round(fx.cure * 100) }));
		if (fx.tendHp) bits.push(t("skill.bit.tendHp", { n: fx.tendHp }));
	} else if (skill === "build") {
		bits.push(t("skill.bit.wall", { n: fx.wall + fx.wallExtra }));
		bits.push(t("skill.bit.mend", { n: fx.mend }));
		if (fx.doubleMend) bits.push(t("skill.bit.doubleMend"));
	} else if (skill === "farm") {
		bits.push(t("skill.bit.farm", { n: Math.round(fx.farmMul * 100) }));
		if (fx.extraCrop) bits.push(t("skill.bit.crop", { n: fx.extraCrop }));
	} else if (skill === "cook") {
		bits.push(t("skill.bit.cookFood", { n: 1 + fx.cookFood }));
		bits.push(t("skill.bit.cookMorale", { n: 8 + fx.cookMorale }));
	}
	return bits;
}
function skillBoostLine(skill, level) {
	return skillBoostBits(skill, level).join(t("ui.dot"));
}
function applySkillXp(s, skill, amount) {
	const from = s.skills[skill] ?? 0;
	const need0 = xpToNext(from);
	if (!s.alive || amount <= 0 || from >= 10) return {
		survivor: s,
		gained: 0,
		from,
		to: from,
		leftover: s.skillXp?.[skill] ?? 0,
		need: need0
	};
	const gained = amount * skillLearnMul(s, skill);
	let xp = (s.skillXp?.[skill] ?? 0) + gained;
	let level = from;
	const skillXp = {
		...emptySkills(),
		...s.skillXp
	};
	while (level < 10) {
		const need = xpToNext(level);
		if (xp < need) break;
		xp -= need;
		level += 1;
	}
	skillXp[skill] = level >= 10 ? 0 : xp;
	return {
		survivor: {
			...s,
			skills: {
				...s.skills,
				[skill]: level
			},
			skillXp,
			lastSkillUp: level > from ? {
				skill,
				level,
				day: s.lastSkillUp?.day ?? 0
			} : s.lastSkillUp
		},
		gained,
		from,
		to: level,
		leftover: skillXp[skill],
		need: xpToNext(Math.min(level, 9))
	};
}
function addSkillXp(s, skill, amount) {
	return applySkillXp(s, skill, amount).survivor;
}
function skillUps(prev, next) {
	const out = [];
	for (const k of SKILL_KEYS) if ((next.skills[k] ?? 0) > (prev.skills[k] ?? 0)) out.push({
		skill: k,
		from: prev.skills[k] ?? 0,
		to: next.skills[k] ?? 0
	});
	return out;
}
function xpGainLine(skill, result) {
	if (result.to > result.from) {
		const parts = [];
		for (let lv = result.from + 1; lv <= result.to; lv++) parts.push(t("skill.leveled", {
			skill: t(`skill.${skill}`),
			n: lv,
			rank: t(`skill.rank.${lv}`),
			boost: t(`skill.${skill}.lv.${lv}`)
		}));
		return parts.join(" ");
	}
	if (result.gained <= 0) return "";
	const left = Math.max(0, Math.ceil(result.need - result.leftover));
	return t("skill.xpGain", {
		skill: t(`skill.${skill}`),
		n: Math.max(1, Math.round(result.gained)),
		left
	});
}
function allocTotal(alloc) {
	let n = 0;
	for (const k of SKILL_KEYS) n += alloc[k] ?? 0;
	return n;
}
function composeSkills(innate, traits, alloc = {}) {
	const s = emptySkills();
	for (const k of SKILL_KEYS) {
		let v = innate[k] + (alloc[k] ?? 0);
		for (const tr of traits) v += tr[k] ?? 0;
		s[k] = clamp(v, 0, 10);
	}
	return s;
}
function grantSquadXpNoted(state, ids, skill, amount) {
	let next = state;
	for (const id of ids) {
		const prev = next.survivors.find((s) => s.id === id);
		if (!prev) continue;
		next = {
			...next,
			survivors: next.survivors.map((s) => s.id === id ? addSkillXp(s, skill, amount) : s)
		};
		const now = next.survivors.find((s) => s.id === id);
		if (now) next = noteSkillUps(next, prev, now);
	}
	return next;
}
function noteSkillUps(state, prev, now) {
	const ups = skillUps(prev, now);
	if (!ups.length) return state;
	let next = state;
	const notices = [...next.notices ?? []];
	for (const u of ups) {
		for (let lv = u.from + 1; lv <= u.to; lv++) {
			next = pushSkillLog(next, now.name, u.skill, lv);
			notices.push({
				kind: "skill",
				name: now.name,
				skill: u.skill,
				level: lv
			});
		}
		next = {
			...next,
			survivors: next.survivors.map((s) => s.id === now.id ? {
				...s,
				lastSkillUp: {
					skill: u.skill,
					level: u.to,
					day: next.day
				}
			} : s)
		};
	}
	return {
		...next,
		notices
	};
}
function pushSkillLog(state, name, skill, level) {
	const text = t("log.skillLevel", {
		name,
		skill: t(`skill.${skill}`),
		n: level,
		rank: t(`skill.rank.${level}`),
		boost: `${t(`skill.${skill}.lv.${level}`)} ${skillBoostLine(skill, level)}`
	});
	return {
		...state,
		log: [...state.log, {
			day: state.day,
			text
		}]
	};
}
function moodLabel(n) {
	if (n < 16) return {
		name: t("mood.broken"),
		canMission: false,
		canWork: false
	};
	if (n < 22) return {
		name: t("mood.despair"),
		canMission: false,
		canWork: false
	};
	if (n < 30) return {
		name: t("mood.low"),
		canMission: false,
		canWork: true
	};
	if (n < 46) return {
		name: t("mood.anxious"),
		canMission: true,
		canWork: true
	};
	if (n < 66) return {
		name: t("mood.steady"),
		canMission: true,
		canWork: true
	};
	if (n < 82) return {
		name: t("mood.stable"),
		canMission: true,
		canWork: true
	};
	return {
		name: t("mood.high"),
		canMission: true,
		canWork: true
	};
}
function canMission(s) {
	return s.alive && s.morale >= 30 && s.hp > 12 && s.fatigue < 92;
}
function canWork(s) {
	return s.alive && s.morale >= 22;
}
function pairKey(a, b) {
	return a < b ? `${a}|${b}` : `${b}|${a}`;
}
function bondOf(state, a, b) {
	if (a === b) return 0;
	return state.bonds?.[pairKey(a, b)] ?? 0;
}
function relationOf(n) {
	if (n >= 75) return {
		id: "lover",
		name: t("rel.lover")
	};
	if (n >= 50) return {
		id: "friend",
		name: t("rel.friend")
	};
	if (n >= 25) return {
		id: "known",
		name: t("rel.known")
	};
	return {
		id: "stranger",
		name: t("rel.stranger")
	};
}
function setBond(state, a, b, value) {
	if (a === b) return state;
	const key = pairKey(a, b);
	return {
		...state,
		bonds: {
			...state.bonds,
			[key]: clamp(value, 0, 100)
		}
	};
}
function addBond(state, a, b, delta) {
	return setBond(state, a, b, bondOf(state, a, b) + delta);
}
function squadRelationBonus(state, s, squadIds) {
	const extra = emptySkills();
	const others = squadIds.filter((id) => id !== s.id);
	let friend = false;
	let lover = false;
	for (const id of others) {
		const rel = relationOf(bondOf(state, s.id, id)).id;
		if (rel === "lover") lover = true;
		if (rel === "friend" || rel === "lover") friend = true;
	}
	if (lover) {
		extra.combat += 2;
		extra.stealth += 1;
		extra.scavenge += 1;
	} else if (friend) extra.combat += 1;
	return extra;
}
function effectiveSkills(state, s, squadIds) {
	const bonus = squadRelationBonus(state, s, squadIds ?? state.mission?.squadIds ?? []);
	const gear = gearSkills(s);
	const out = emptySkills();
	for (const k of SKILL_KEYS) out[k] = clamp(s.skills[k] + bonus[k] + Math.round(gear[k]), 0, 10);
	return out;
}
function startingMorale(traits) {
	let m = 62;
	for (const tr of traits) m += tr.morale ?? 0;
	return clamp(m, 8, 100);
}
var AP_COST = {
	travel: 1,
	search: 1,
	fight: 1,
	next: 1,
	extract: 0,
	encounter: 1,
	build: 2,
	repairWall: 1,
	dispatch: 1
};
function apOf(state) {
	return state.dayAP ?? 6;
}
function threatBand(noise) {
	if (noise >= 50) return "severe";
	if (noise >= 35) return "horde";
	if (noise >= 20) return "danger";
	if (noise >= 10) return "elevated";
	return "quiet";
}
/** Day 1 = 1, ~day 25 = 2, cap ~3.2. Night raids and hunger waste scale on this. */
function nightPressure(day) {
	return 1 + Math.min(2.2, Math.max(0, day - 1) / 24);
}
function siteQuiet(ls) {
	return !ls || ls.zombies <= 0;
}
function seedLoot(r, locId) {
	const loc = locById(locId);
	const bag = EMPTY_BAG();
	let rng = r;
	const z = Math.max(1, loc.zones.length);
	for (const [k, pair] of Object.entries(loc.loot)) {
		const n = range(rng, pair[0] * z, pair[1] * z);
		rng = n.r;
		bag[k] = n.n;
	}
	return {
		r: rng,
		bag
	};
}
function padLocation(ls, locId, r) {
	if (ls.lootRemaining && ls.threat != null && ls.noiseToday != null && ls.alertLevel != null) return {
		r,
		ls
	};
	const seeded = ls.lootRemaining ? {
		r,
		bag: ls.lootRemaining
	} : seedLoot(r, locId);
	return {
		r: seeded.r,
		ls: {
			...ls,
			lootRemaining: ls.lootRemaining ?? seeded.bag,
			threat: ls.threat ?? 0,
			noiseToday: ls.noiseToday ?? 0,
			alertLevel: ls.alertLevel ?? 0
		}
	};
}
function padV03(state) {
	let r = state.rng;
	const locations = { ...state.locations };
	for (const loc of LOCATIONS) {
		const cur = locations[loc.id];
		if (!cur) {
			const seeded = seedLoot(r, loc.id);
			r = seeded.r;
			const z = range(r, Math.max(1, loc.zombies - 2), loc.zombies + 2);
			r = z.r;
			locations[loc.id] = {
				zombies: z.n,
				discovered: !!loc.startKnown,
				cleared: false,
				occupied: false,
				visited: false,
				survivorOpen: loc.survivorChance > 0,
				lootRemaining: seeded.bag,
				threat: 0,
				noiseToday: 0,
				alertLevel: 0
			};
			continue;
		}
		const padded = padLocation(cur, loc.id, r);
		r = padded.r;
		locations[loc.id] = padded.ls;
	}
	return {
		...state,
		rng: r,
		version: Math.max(state.version ?? 0, 5),
		dayAP: state.dayAP ?? 6,
		maxAP: state.maxAP ?? 6,
		locations,
		dispatches: Array.isArray(state.dispatches) ? state.dispatches : []
	};
}
function lootLeft(bag) {
	if (!bag) return 0;
	return bag.food + bag.water + bag.materials + bag.medicine + bag.ammo + bag.fuel;
}
function padSurvivor(s) {
	const occ = occById(s.occupation);
	const traits = (s.traits ?? []).map(traitById);
	const skillBase = s.skillBase ?? composeSkills(occ.skills, traits);
	return {
		...s,
		skillXp: s.skillXp ?? emptySkills(),
		skillBase,
		lastSkillUp: s.lastSkillUp ?? null,
		kills: s.kills ?? 0,
		traits: s.traits ?? [],
		worn: s.worn ?? {}
	};
}
function loadSave() {
	try {
		const raw = localStorage.getItem("ash-state-v5") ?? localStorage.getItem("ash-state-v4") ?? localStorage.getItem("ash-state-v3") ?? localStorage.getItem("ash-state-v2");
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (!data || !Array.isArray(data.survivors)) return null;
		data.survivors = data.survivors.map(padSurvivor);
		data.bonds = data.bonds ?? {};
		data.stash = Array.isArray(data.stash) ? data.stash : [];
		data.notices = Array.isArray(data.notices) ? data.notices : [];
		data.log = Array.isArray(data.log) ? data.log.slice(-80) : [];
		data.dispatches = Array.isArray(data.dispatches) ? data.dispatches : [];
		if (data.mission) data.mission.finds = data.mission.finds ?? [];
		const padded = padV03(data);
		padded.version = 5;
		if (!padded.screen || padded.screen === "title" || padded.screen === "create") padded.screen = padded.ended ? "end" : "shelter";
		if (padded.ended) padded.screen = "end";
		return padded;
	} catch {
		return null;
	}
}
function writeSave(state) {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(state));
		localStorage.setItem(SAVE_KEY + ":bak", JSON.stringify(state));
	} catch {}
}
function clearSave() {
	try {
		localStorage.removeItem(SAVE_KEY);
		localStorage.removeItem(SAVE_KEY + ":bak");
		localStorage.removeItem("ash-state-v4");
		localStorage.removeItem("ash-state-v3");
		localStorage.removeItem("ash-state-v2");
	} catch {}
}
var FOCUS_SKILL$1 = {
	herbs: "medical",
	supplies: "scavenge",
	forage: "farm"
};
function bag() {
	return EMPTY_BAG();
}
function addBag(a, b) {
	return {
		food: a.food + (b.food ?? 0),
		water: a.water + (b.water ?? 0),
		materials: a.materials + (b.materials ?? 0),
		medicine: a.medicine + (b.medicine ?? 0),
		ammo: a.ammo + (b.ammo ?? 0),
		fuel: a.fuel + (b.fuel ?? 0)
	};
}
function living$1(state) {
	return state.survivors.filter((s) => s.alive);
}
function mapSur$1(state, id, fn) {
	return {
		...state,
		survivors: state.survivors.map((s) => s.id === id ? fn(s) : s)
	};
}
function pushLog$1(state, text) {
	const log = [{
		day: state.day,
		text
	}, ...state.log].slice(0, 40);
	return {
		...state,
		log
	};
}
function has$1(s, id) {
	return s.traits.includes(id);
}
function awayIds(state) {
	const ids = /* @__PURE__ */ new Set();
	for (const p of state.dispatches ?? []) for (const id of p.memberIds) ids.add(id);
	return ids;
}
function isAway(state, id) {
	return awayIds(state).has(id);
}
function focusOf(s, task) {
	const herbs = s.skills.medical * 1.2 + s.skills.farm * .7 + (has$1(s, "firstaid") ? 2 : 0) + (has$1(s, "gardener") ? 1.5 : 0);
	const supplies = s.skills.scavenge * 1.2 + s.skills.build * .6 + (has$1(s, "organized") ? 2 : 0) + (has$1(s, "burglarhands") ? 1.5 : 0);
	const forage = s.skills.farm * 1.1 + s.skills.cook * .5 + (has$1(s, "outdoorsman") ? 2 : 0) + (has$1(s, "hunter") ? 2 : 0) + (has$1(s, "gardener") ? 1 : 0);
	if (task === "herbs" || task === "supplies" || task === "forage") return task;
	if (herbs >= supplies && herbs >= forage) return "herbs";
	if (forage >= supplies) return "forage";
	return "supplies";
}
function focusScore(s, focus) {
	if (focus === "herbs") return s.skills.medical * 1.2 + s.skills.farm * .7 + (has$1(s, "firstaid") ? 2 : 0) + (has$1(s, "gardener") ? 1.5 : 0);
	if (focus === "supplies") return s.skills.scavenge * 1.2 + s.skills.build * .6 + (has$1(s, "organized") ? 2 : 0) + (has$1(s, "burglarhands") ? 1.5 : 0);
	return s.skills.farm * 1.1 + s.skills.cook * .5 + (has$1(s, "outdoorsman") ? 2 : 0) + (has$1(s, "hunter") ? 2 : 0) + (has$1(s, "gardener") ? 1 : 0);
}
function canDispatchPerson(state, s) {
	if (!s.alive || isAway(state, s.id)) return false;
	if (state.mission?.squadIds.includes(s.id)) return false;
	if (!canWork(s)) return false;
	if (s.hp <= 14 || s.fatigue >= 90) return false;
	return true;
}
function canStartDispatch(state, ids) {
	if ((state.dispatches ?? []).length > 0) return {
		ok: false,
		reason: t("dispatch.busy")
	};
	if (apOf(state) < AP_COST.dispatch) return {
		ok: false,
		reason: t("dispatch.needAp")
	};
	const people = living$1(state);
	if (people.length < 2) return {
		ok: false,
		reason: t("dispatch.needPeople")
	};
	const uniq = [...new Set(ids)];
	if (!uniq.length) return {
		ok: false,
		reason: t("dispatch.none")
	};
	if (uniq.length > 2) return {
		ok: false,
		reason: t("dispatch.max")
	};
	if (uniq.length >= people.length) return {
		ok: false,
		reason: t("dispatch.needStay")
	};
	for (const id of uniq) {
		const s = state.survivors.find((x) => x.id === id);
		if (!s || !canDispatchPerson(state, s)) return {
			ok: false,
			reason: t("dispatch.none")
		};
	}
	return {
		ok: true,
		reason: ""
	};
}
function pickDest(state) {
	const home = locById(state.shelter.locationId);
	const near = home.neighbors.filter((id) => {
		const ls = state.locations[id];
		return ls && (ls.discovered || ls.visited || ls.occupied);
	});
	if (!near.length) return home.id;
	return [...near].sort((a, b) => (state.locations[a].zombies ?? 0) - (state.locations[b].zombies ?? 0))[0];
}
function startDispatch(state, ids, task) {
	const check = canStartDispatch(state, ids);
	if (!check.ok) return pushLog$1(state, check.reason);
	const uniq = [...new Set(ids)];
	const members = uniq.map((id) => state.survivors.find((s) => s.id === id));
	const n = members.length;
	const takeF = Math.min(state.resources.food, n);
	const takeW = Math.min(state.resources.water, n);
	const hungry = takeF < n || takeW < n;
	const made = uid(state.rng);
	const destId = pickDest(state);
	const destName = destId === state.shelter.locationId ? t("dispatch.woods") : tLoc(destId);
	const names = members.map((s) => s.name).join(t("ui.comma"));
	const party = {
		id: made.id,
		memberIds: uniq,
		task,
		sentDay: state.day,
		returnDay: state.day,
		destId,
		hungry
	};
	let next = {
		...state,
		rng: made.r,
		dayAP: apOf(state) - AP_COST.dispatch,
		resources: {
			...state.resources,
			food: state.resources.food - takeF,
			water: state.resources.water - takeW
		},
		dispatches: [...state.dispatches ?? [], party],
		squadPick: state.squadPick.filter((id) => !uniq.includes(id))
	};
	next = pushLog$1(next, t("dispatch.log.send", {
		names,
		loc: destName,
		task: t(`dispatch.task.${task}`),
		food: takeF,
		water: takeW
	}));
	if (hungry) next = pushLog$1(next, t("dispatch.log.hungry", { names }));
	for (const s of members) if (has$1(s, "agoraphobic")) next = mapSur$1(next, s.id, (x) => ({
		...x,
		morale: clamp(x.morale - 5, 0, 100)
	}));
	return next;
}
function pickWeighted(r, items) {
	const live = items.filter((x) => x.w > 0);
	const total = live.reduce((n, x) => n + x.w, 0);
	const roll = range(r, 1, Math.max(1, Math.round(total * 100)));
	let acc = 0;
	const target = roll.n / 100;
	for (const it of live) {
		acc += it.w;
		if (target <= acc) return {
			r: roll.r,
			id: it.id
		};
	}
	return {
		r: roll.r,
		id: live[live.length - 1]?.id ?? "success"
	};
}
function eventTable(party, folks, destZ) {
	const stealth = Math.max(0, ...folks.map((s) => s.skills.stealth));
	const combat = Math.max(0, ...folks.map((s) => s.skills.combat));
	const lucky = folks.some((s) => has$1(s, "lucky"));
	const unlucky = folks.some((s) => has$1(s, "unlucky"));
	const quiet = folks.some((s) => has$1(s, "quiet") || has$1(s, "inconspicuous"));
	const loud = folks.some((s) => has$1(s, "conspicuous"));
	const outdoor = folks.some((s) => has$1(s, "outdoorsman") || has$1(s, "hunter") || has$1(s, "gardener"));
	const threat = Math.min(.4, destZ * .035);
	const hungry = party.hungry ? 1 : 0;
	const delayed = party.delayed ? 1 : 0;
	return [
		{
			id: "success",
			w: 34 + stealth + (quiet ? 4 : 0) + (outdoor ? 3 : 0)
		},
		{
			id: "lucky",
			w: 8 + (lucky ? 8 : 0) - (unlucky ? 4 : 0)
		},
		{
			id: "cache",
			w: 6 + (lucky ? 3 : 0)
		},
		{
			id: "note",
			w: 6
		},
		{
			id: "person",
			w: 5
		},
		{
			id: "empty",
			w: 5 + hungry * 4 + (unlucky ? 3 : 0) - (outdoor ? 3 : 0)
		},
		{
			id: "scratch",
			w: 7 + hungry * 3 + threat * 20 + (unlucky ? 3 : 0) - stealth * .6
		},
		{
			id: "ambush",
			w: 8 + threat * 28 + (loud ? 6 : 0) - stealth * .8 - (quiet ? 4 : 0) - combat * .3
		},
		{
			id: "delay",
			w: delayed ? 0 : 4 + hungry * 2
		},
		{
			id: "torn",
			w: 5 + hungry * 2
		},
		{
			id: "greenhouse",
			w: party.task === "herbs" || party.task === "forage" || party.task === "auto" ? 4 : 1
		},
		{
			id: "cellar",
			w: 4
		},
		{
			id: "deer",
			w: outdoor ? 5 : 2
		},
		{
			id: "clinic",
			w: party.task === "herbs" || folks.some((s) => s.skills.medical >= 4) ? 5 : 2
		},
		{
			id: "truck",
			w: party.task === "supplies" ? 5 : 2
		},
		{
			id: "warning",
			w: 4
		}
	];
}
function lootFor(focus, score, r0, mul = 1) {
	const n0 = range(r0, 0, 1);
	const n = Math.max(1, Math.round((1 + Math.floor(score / 3) + n0.n) * mul));
	const bag = EMPTY_BAG();
	if (focus === "herbs") {
		bag.medicine = n;
		if (score >= 5) bag.food = Math.max(0, Math.floor(n / 2));
	} else if (focus === "supplies") {
		bag.materials = n;
		if (score >= 6) bag.ammo = 1;
		if (score >= 8) bag.fuel = 1;
	} else {
		bag.food = n;
		bag.water = Math.max(1, n - 1);
	}
	return {
		r: n0.r,
		bag
	};
}
function tinyLoot(focus) {
	if (focus === "herbs") return { medicine: 1 };
	if (focus === "supplies") return { materials: 1 };
	return { food: 1 };
}
function gearFor(focus, r) {
	const tags = focus === "herbs" ? ["home", "farm"] : focus === "supplies" ? ["tool", "work"] : ["farm", "home"];
	const pool = GEAR.filter((g) => (g.rarity === "common" || g.rarity === "uncommon") && g.tags.some((tag) => tags.includes(tag)));
	const p = pick(r, pool.length ? pool : GEAR.filter((g) => g.rarity === "common"));
	const made = mintGear(p.r, p.item.id, 62);
	return {
		r: made.r,
		item: made.item
	};
}
function hiddenLocs(state) {
	return LOCATIONS.filter((l) => !state.locations[l.id]?.discovered && l.id !== state.shelter.locationId);
}
function discoverOne(state) {
	const hidden = hiddenLocs(state);
	if (!hidden.length) return {
		state,
		name: ""
	};
	const p = pick(state.rng, hidden);
	return {
		name: tLoc(p.item.id),
		state: {
			...state,
			rng: p.r,
			locations: {
				...state.locations,
				[p.item.id]: {
					...state.locations[p.item.id],
					discovered: true
				}
			}
		}
	};
}
function makeFound(r0) {
	const occ = pick(r0, OCCUPATIONS);
	const nm = pick(occ.r, FIRST_NAMES);
	const ln = pick(nm.r, LAST_NAMES);
	const pos = pick(ln.r, TRAITS.filter((x) => x.kind === "pos"));
	const neg = pick(pos.r, TRAITS.filter((x) => x.kind === "neg"));
	const face = pick(neg.r, FACES);
	const traits = withOccupationTraits(occ.item.id, [pos.item.id, neg.item.id]);
	const skills = composeSkills(occById(occ.item.id).skills, traits.map(traitById));
	const hp = clamp(occById(occ.item.id).hp, 50, 140);
	const u = uid(face.r);
	const raw = {
		id: u.id,
		name: `${nm.item} ${ln.item}`,
		occupation: occ.item.id,
		traits,
		portrait: face.item.id,
		skills,
		skillXp: emptySkills(),
		skillBase: { ...skills },
		lastSkillUp: null,
		hp,
		maxHp: hp,
		hunger: 70,
		thirst: 70,
		morale: startingMorale(traits.map(traitById)),
		fatigue: 35,
		infected: false,
		weapon: occById(occ.item.id).weapon,
		worn: {},
		stance: "neutral",
		job: "rest",
		alive: true,
		death: "",
		daysIn: 0,
		kills: 0
	};
	const dressed = dressSurvivor(u.r, occ.item.id, raw);
	return {
		r: dressed.r,
		s: dressed.s,
		extra: dressed.extra
	};
}
function salvageDead(state, s) {
	const items = salvageWorn(s);
	if (!items.length) return {
		...state,
		survivors: state.survivors.map((x) => x.id === s.id ? {
			...x,
			worn: {},
			weapon: "fists"
		} : x)
	};
	return {
		...state,
		stash: [...state.stash ?? [], ...items],
		survivors: state.survivors.map((x) => x.id === s.id ? {
			...x,
			worn: {},
			weapon: "fists"
		} : x)
	};
}
function injure(state, id, dmg, infectP, cause) {
	const s = state.survivors.find((x) => x.id === id);
	if (!s || !s.alive) return state;
	const inf = chance(state.rng, infectP);
	const hp = s.hp - Math.max(1, dmg);
	const dead = hp <= 0;
	let next = mapSur$1({
		...state,
		rng: inf.r
	}, id, (x) => ({
		...x,
		hp: Math.max(0, hp),
		infected: x.infected || !dead && inf.ok,
		alive: !dead,
		death: dead ? cause : x.death,
		morale: clamp(x.morale - (dead ? 0 : inf.ok ? 10 : 6), 0, 100)
	}));
	if (dead) {
		next = salvageDead(next, s);
		next = pushLog$1(next, t("dispatch.log.dead", { name: s.name }));
		next = {
			...next,
			survivors: next.survivors.map((x) => x.alive && x.id !== s.id ? {
				...x,
				morale: clamp(x.morale - 14, 0, 100)
			} : x)
		};
	} else if (inf.ok) next = pushLog$1(next, t("dispatch.log.bitten", { name: s.name }));
	else next = pushLog$1(next, t("dispatch.log.hurt", {
		name: s.name,
		n: dmg
	}));
	return next;
}
function grantFocusXp(state, folks, amount) {
	let next = state;
	for (const s of folks) {
		if (!s.alive) continue;
		const cur = next.survivors.find((x) => x.id === s.id);
		if (!cur || !cur.alive) continue;
		const skill = FOCUS_SKILL$1[focusOf(cur, "auto")];
		const prev = cur;
		const xp = applySkillXp(cur, skill, amount);
		next = {
			...next,
			survivors: next.survivors.map((x) => x.id === cur.id ? xp.survivor : x)
		};
		next = noteSkillUps(next, prev, xp.survivor);
	}
	return next;
}
function wearTrip(state, folks, extraFat, extraMorale) {
	let next = state;
	for (const s of folks) next = mapSur$1(next, s.id, (x) => {
		if (!x.alive) return x;
		return {
			...x,
			fatigue: clamp(x.fatigue + 14 + extraFat, 0, 100),
			morale: clamp(x.morale + extraMorale, 0, 100),
			hunger: clamp(x.hunger - 8, 0, 100),
			thirst: clamp(x.thirst - 8, 0, 100),
			daysIn: x.daysIn + 1
		};
	});
	return next;
}
function resolveOne(state, party) {
	const folks = party.memberIds.map((id) => state.survivors.find((s) => s.id === id)).filter((s) => !!s && s.alive);
	if (!folks.length) return {
		...state,
		dispatches: (state.dispatches ?? []).filter((p) => p.id !== party.id)
	};
	if (party.returnDay >= state.day) return pushLog$1(state, t("dispatch.log.wait", { names: folks.map((s) => s.name).join(t("ui.comma")) }));
	const destZ = state.locations[party.destId]?.zombies ?? 0;
	const destName = party.destId === state.shelter.locationId ? t("dispatch.woods") : tLoc(party.destId);
	const names = folks.map((s) => s.name).join(t("ui.comma"));
	const rolled = pickWeighted(state.rng, eventTable(party, folks, destZ));
	let next = {
		...state,
		rng: rolled.r
	};
	const ev = rolled.id;
	if (ev === "delay") {
		next = {
			...next,
			dispatches: (next.dispatches ?? []).map((p) => p.id === party.id ? {
				...p,
				returnDay: next.day,
				delayed: true
			} : p)
		};
		next = wearTrip(next, folks, 8, -4);
		return pushLog$1(next, t("dispatch.log.delay", {
			names,
			loc: destName
		}));
	}
	let loot = bag();
	for (const s of folks) {
		const focus = focusOf(s, party.task);
		const rolledLoot = lootFor(focus, focusScore(s, focus) + (has$1(s, "lucky") ? 1.5 : 0) - (has$1(s, "unlucky") ? 1 : 0), next.rng, ev === "lucky" ? 1.5 : ev === "empty" ? 0 : 1);
		next = {
			...next,
			rng: rolledLoot.r
		};
		loot = addBag(loot, rolledLoot.bag);
		if (party.task !== "auto") {
			const own = focusOf(s, "auto");
			if (own !== focus) {
				const side = chance(next.rng, .42);
				next = {
					...next,
					rng: side.r
				};
				if (side.ok) loot = addBag(loot, tinyLoot(own));
			}
		}
	}
	const dropParty = () => ({
		...next,
		dispatches: (next.dispatches ?? []).filter((p) => p.id !== party.id)
	});
	const takeLoot = (mul = 1) => {
		const got = {
			food: Math.round(loot.food * mul),
			water: Math.round(loot.water * mul),
			materials: Math.round(loot.materials * mul),
			medicine: Math.round(loot.medicine * mul),
			ammo: Math.round(loot.ammo * mul),
			fuel: Math.round(loot.fuel * mul)
		};
		next = {
			...next,
			resources: addBag(next.resources, got)
		};
		return got;
	};
	const maybeGear = (focus, p = .35) => {
		const hit = chance(next.rng, p);
		next = {
			...next,
			rng: hit.r
		};
		if (!hit.ok) return;
		const g = gearFor(focus, next.rng);
		next = {
			...next,
			rng: g.r
		};
		if (g.item) {
			next = {
				...next,
				stash: [...next.stash ?? [], g.item]
			};
			next = pushLog$1(next, t("dispatch.log.gear", {
				name: folks[0].name,
				item: labelItem(g.item)
			}));
		}
	};
	if (ev === "empty") {
		next = dropParty();
		next = wearTrip(next, folks, 6, -4);
		next = grantFocusXp(next, folks, 3);
		return pushLog$1(next, t("dispatch.log.empty", {
			names,
			loc: destName
		}));
	}
	if (ev === "scratch") {
		const victim = pick(next.rng, folks);
		next = {
			...next,
			rng: victim.r
		};
		const dmg = range(next.rng, 8, 16);
		next = {
			...next,
			rng: dmg.r
		};
		const got = takeLoot(.7);
		next = dropParty();
		next = injure(next, victim.item.id, dmg.n, .12, t("dispatch.death"));
		next = wearTrip(next, folks, 10, -6);
		next = grantFocusXp(next, folks, 6);
		const bits = tResBits(got);
		return pushLog$1(next, t("dispatch.log.scratch", {
			names,
			loc: destName,
			loot: bits || t("dispatch.nothing")
		}));
	}
	if (ev === "ambush") {
		const combat = Math.max(...folks.map((s) => s.skills.combat));
		const wep = Math.max(...folks.map((s) => liveWeapon(s).melee));
		const fight = combat * 8 + wep * 2;
		const roll = range(next.rng, 0, 24);
		next = {
			...next,
			rng: roll.r
		};
		const coward = folks.find((s) => has$1(s, "coward"));
		if (coward) {
			const dmg = range(next.rng, 4, 10);
			next = {
				...next,
				rng: dmg.r
			};
			next = injure(next, coward.id, dmg.n, .05, t("dispatch.death"));
			next = dropParty();
			next = wearTrip(next, folks, 12, -8);
			next = grantFocusXp(next, folks, 4);
			next = {
				...next,
				survivors: next.survivors.map((s) => folks.some((f) => f.id === s.id) ? addSkillXp(s, "stealth", 6) : s)
			};
			return pushLog$1(next, t("dispatch.log.ambushFlee", {
				names,
				loc: destName
			}));
		}
		const win = fight + roll.n >= 36;
		const victim = pick(next.rng, folks);
		next = {
			...next,
			rng: victim.r
		};
		if (win) {
			const dmg = range(next.rng, 5, 12);
			next = {
				...next,
				rng: dmg.r
			};
			const got = takeLoot(1);
			next = dropParty();
			next = injure(next, victim.item.id, dmg.n, .08, t("dispatch.death"));
			next = wearTrip(next, folks, 12, -2);
			next = grantFocusXp(next, folks, 8);
			next = {
				...next,
				survivors: next.survivors.map((s) => folks.some((f) => f.id === s.id) ? addSkillXp(s, "combat", 8) : s)
			};
			return pushLog$1(next, t("dispatch.log.ambushWin", {
				names,
				loc: destName,
				loot: tResBits(got) || t("dispatch.nothing")
			}));
		}
		const dmg = range(next.rng, 14, 26);
		next = {
			...next,
			rng: dmg.r
		};
		const got = takeLoot(.35);
		next = dropParty();
		next = injure(next, victim.item.id, dmg.n, .18, t("dispatch.death"));
		next = wearTrip(next, folks, 16, -10);
		next = grantFocusXp(next, folks, 5);
		return pushLog$1(next, t("dispatch.log.ambush", {
			names,
			loc: destName,
			loot: tResBits(got) || t("dispatch.nothing")
		}));
	}
	if (ev === "torn") {
		const got = takeLoot(.45);
		next = dropParty();
		next = wearTrip(next, folks, 8, -3);
		next = grantFocusXp(next, folks, 6);
		return pushLog$1(next, t("dispatch.log.torn", {
			names,
			loc: destName,
			loot: tResBits(got) || t("dispatch.nothing")
		}));
	}
	if (ev === "note" || ev === "warning") {
		const found = discoverOne(next);
		next = found.state;
		const got = takeLoot(ev === "warning" ? .5 : .8);
		next = dropParty();
		next = wearTrip(next, folks, 6, ev === "warning" ? -2 : 4);
		next = grantFocusXp(next, folks, 7);
		return pushLog$1(next, t(ev === "note" ? "dispatch.log.note" : "dispatch.log.warning", {
			names,
			loc: destName,
			found: found.name || t("dispatch.noMap"),
			loot: tResBits(got) || t("dispatch.nothing")
		}));
	}
	if (ev === "person") {
		const got = takeLoot(.8);
		const room = living$1(next).length < next.shelter.capacity;
		next = dropParty();
		next = wearTrip(next, folks, 8, room ? 6 : 2);
		next = grantFocusXp(next, folks, 8);
		if (!room) return pushLog$1(next, t("dispatch.log.personFull", {
			names,
			loc: destName,
			loot: tResBits(got) || t("dispatch.nothing")
		}));
		const found = makeFound(next.rng);
		next = {
			...next,
			rng: found.r,
			stash: [...next.stash ?? [], ...found.extra],
			survivors: [...next.survivors, found.s]
		};
		const a = folks[0];
		if (a) next = {
			...next,
			bonds: {
				...next.bonds ?? {},
				[pairKey(a.id, found.s.id)]: 12
			}
		};
		return pushLog$1(next, t("dispatch.log.person", {
			names,
			loc: destName,
			who: found.s.name,
			loot: tResBits(got) || t("dispatch.nothing")
		}));
	}
	if (ev === "greenhouse") {
		loot = addBag(loot, {
			food: 2,
			medicine: 1
		});
		const got = takeLoot(1);
		next = dropParty();
		next = wearTrip(next, folks, 4, 6);
		next = grantFocusXp(next, folks, 10);
		return pushLog$1(next, t("dispatch.log.greenhouse", {
			names,
			loot: tResBits(got)
		}));
	}
	if (ev === "cellar") {
		loot = addBag(loot, {
			materials: 2,
			food: 1,
			ammo: 1
		});
		const got = takeLoot(1);
		maybeGear("supplies", .45);
		next = dropParty();
		next = wearTrip(next, folks, 6, 5);
		next = grantFocusXp(next, folks, 10);
		return pushLog$1(next, t("dispatch.log.cellar", {
			names,
			loc: destName,
			loot: tResBits(got)
		}));
	}
	if (ev === "deer") {
		loot = addBag(loot, { food: 3 });
		const got = takeLoot(1);
		next = dropParty();
		next = wearTrip(next, folks, 8, 5);
		next = grantFocusXp(next, folks, 9);
		next = {
			...next,
			survivors: next.survivors.map((s) => folks.some((f) => f.id === s.id) ? addSkillXp(s, "farm", 4) : s)
		};
		return pushLog$1(next, t("dispatch.log.deer", {
			names,
			loot: tResBits(got)
		}));
	}
	if (ev === "clinic") {
		loot = addBag(loot, { medicine: 2 });
		const got = takeLoot(1);
		maybeGear("herbs", .5);
		next = dropParty();
		next = wearTrip(next, folks, 5, 4);
		next = grantFocusXp(next, folks, 10);
		return pushLog$1(next, t("dispatch.log.clinic", {
			names,
			loc: destName,
			loot: tResBits(got)
		}));
	}
	if (ev === "truck") {
		loot = addBag(loot, {
			fuel: 2,
			materials: 1
		});
		const got = takeLoot(1);
		next = dropParty();
		next = wearTrip(next, folks, 7, 3);
		next = grantFocusXp(next, folks, 9);
		return pushLog$1(next, t("dispatch.log.truck", {
			names,
			loc: destName,
			loot: tResBits(got)
		}));
	}
	if (ev === "cache") {
		loot = addBag(loot, {
			materials: 2,
			ammo: 1
		});
		const got = takeLoot(1);
		maybeGear(focusOf(folks[0], party.task), .4);
		next = dropParty();
		next = wearTrip(next, folks, 5, 7);
		next = grantFocusXp(next, folks, 11);
		return pushLog$1(next, t("dispatch.log.cache", {
			names,
			loc: destName,
			loot: tResBits(got)
		}));
	}
	if (ev === "lucky") {
		const got = takeLoot(1);
		maybeGear(focusOf(folks[0], party.task), .55);
		next = dropParty();
		next = wearTrip(next, folks, 4, 8);
		next = grantFocusXp(next, folks, 12);
		if (folks.length >= 2) {
			const key = pairKey(folks[0].id, folks[1].id);
			next = {
				...next,
				bonds: {
					...next.bonds ?? {},
					[key]: (next.bonds?.[key] ?? 0) + 6
				}
			};
		}
		return pushLog$1(next, t("dispatch.log.lucky", {
			names,
			loc: destName,
			loot: tResBits(got)
		}));
	}
	const got = takeLoot(1);
	maybeGear(focusOf(folks[0], party.task), .22);
	next = dropParty();
	next = wearTrip(next, folks, 6, 4);
	next = grantFocusXp(next, folks, 10);
	if (folks.length >= 2) {
		const key = pairKey(folks[0].id, folks[1].id);
		next = {
			...next,
			bonds: {
				...next.bonds ?? {},
				[key]: (next.bonds?.[key] ?? 0) + 4
			}
		};
	}
	return pushLog$1(next, t("dispatch.log.success", {
		names,
		loc: destName,
		loot: tResBits(got) || t("dispatch.nothing")
	}));
}
function resolveDispatches(state) {
	const list = state.dispatches ?? [];
	if (!list.length) return state;
	let next = state;
	for (const party of list) {
		if (!(next.dispatches ?? []).some((p) => p.id === party.id)) continue;
		next = resolveOne(next, party);
	}
	return next;
}
function maxHpFor(occHp, traits) {
	let hp = occHp;
	for (const id of traits) hp += traitById(id).hp ?? 0;
	return clamp(hp, 50, 140);
}
function has(s, id) {
	return s.traits.includes(id);
}
function pushLog(state, text) {
	const log = [{
		day: state.day,
		text
	}, ...state.log].slice(0, 40);
	return {
		...state,
		log
	};
}
function living(state) {
	return state.survivors.filter((s) => s.alive);
}
function byId(state, id) {
	return state.survivors.find((s) => s.id === id);
}
function trySpend(state, n) {
	const have = apOf(state);
	if (have < n) return null;
	return {
		...state,
		dayAP: have - n
	};
}
function bumpNoise(state, locId, add, alert = 0) {
	const ls = state.locations[locId];
	const noiseToday = (ls.noiseToday ?? 0) + add;
	return {
		...state,
		locations: {
			...state.locations,
			[locId]: {
				...ls,
				noiseToday,
				threat: Math.max(ls.threat ?? 0, noiseToday),
				alertLevel: (ls.alertLevel ?? 0) + alert
			}
		}
	};
}
function mapSur(state, id, fn) {
	return {
		...state,
		survivors: state.survivors.map((s) => s.id === id ? fn(s) : s)
	};
}
function salvageToStash(state, s) {
	const items = salvageWorn(s);
	if (!items.length) return state;
	return {
		...state,
		stash: [...state.stash ?? [], ...items],
		survivors: state.survivors.map((x) => x.id === s.id ? {
			...x,
			worn: {},
			weapon: "fists"
		} : x)
	};
}
function addRes(a, b) {
	return {
		food: a.food + (b.food ?? 0),
		water: a.water + (b.water ?? 0),
		materials: a.materials + (b.materials ?? 0),
		medicine: a.medicine + (b.medicine ?? 0),
		ammo: a.ammo + (b.ammo ?? 0),
		fuel: a.fuel + (b.fuel ?? 0)
	};
}
function makeSurvivor(stateR, opts) {
	const occ = occById(opts.occupation);
	const traits = withOccupationTraits(opts.occupation, opts.traits);
	const skills = composeSkills(occ.skills, traits.map(traitById), opts.alloc ?? {});
	const maxHp = maxHpFor(occ.hp, traits);
	const u = uid(stateR);
	const morale = startingMorale(traits.map(traitById));
	return {
		r: u.r,
		s: {
			id: u.id,
			name: opts.name,
			occupation: opts.occupation,
			traits,
			portrait: opts.portrait ?? FACES[0].id,
			skills,
			skillXp: emptySkills(),
			skillBase: { ...skills },
			lastSkillUp: null,
			hp: maxHp,
			maxHp,
			hunger: 80,
			thirst: 80,
			morale,
			fatigue: 20,
			infected: false,
			weapon: opts.weapon ?? occ.weapon,
			worn: {},
			stance: opts.stance,
			job: "rest",
			alive: true,
			death: "",
			daysIn: 0,
			kills: 0
		}
	};
}
function randomName(r) {
	const a = pick(r, FIRST_NAMES);
	const b = pick(a.r, LAST_NAMES);
	return {
		r: b.r,
		name: `${a.item} ${b.item}`
	};
}
function pickFace(r, used = []) {
	const free = FACES.filter((f) => !used.includes(f.id));
	return pick(r, free.length ? free : FACES);
}
function randomCreate(r0 = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0) {
	let r = r0 || 1;
	const occ = pick(r, OCCUPATIONS);
	r = occ.r;
	const pos = pick(r, TRAITS.filter((x) => x.kind === "pos"));
	r = pos.r;
	const neg = pick(r, TRAITS.filter((x) => x.kind === "neg"));
	r = neg.r;
	const sh = pick(r, START_SHELTERS);
	r = sh.r;
	const nm = randomName(r);
	r = nm.r;
	const face = pickFace(r);
	r = face.r;
	return {
		r,
		input: {
			name: nm.name,
			occupation: occ.item.id,
			portrait: face.item.id,
			traits: [pos.item.id, neg.item.id],
			alloc: {},
			shelterId: sh.item.id
		}
	};
}
function createNewGame(input) {
	const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0 || 1;
	let r = seed;
	const start = START_SHELTERS.find((s) => s.id === input.shelterId);
	const player0 = makeSurvivor(r, {
		name: input.name.trim() || t("ui.anon"),
		occupation: input.occupation,
		traits: input.traits,
		stance: "leader",
		portrait: input.portrait || FACES[0].id,
		alloc: input.alloc
	});
	const dressed = dressSurvivor(player0.r, input.occupation, player0.s);
	r = dressed.r;
	const bonus = pick(r, [
		"bat",
		"cap",
		"hoodie",
		"knife",
		"school"
	]);
	const extra = mintGear(bonus.r, bonus.item, 78);
	r = extra.r;
	const occ = occById(input.occupation);
	let resources = addRes({
		food: 4,
		water: 4,
		materials: 2,
		medicine: 1,
		ammo: 0,
		fuel: 1
	}, occ.start);
	resources = addRes(resources, start.extras);
	const locations = {};
	for (const loc of LOCATIONS) {
		const z = jitter(r, loc.zombies, Math.max(1, Math.round(loc.zombies * .2)));
		r = z.r;
		const stock = seedLoot(r, loc.id);
		r = stock.r;
		const known = !!loc.startKnown || loc.id === start.locationId;
		locations[loc.id] = {
			zombies: loc.id === start.locationId ? Math.max(0, z.n - 3) : z.n,
			discovered: known,
			cleared: false,
			occupied: loc.id === start.locationId,
			visited: loc.id === start.locationId,
			survivorOpen: loc.survivorChance > 0,
			lootRemaining: stock.bag,
			threat: 0,
			noiseToday: 0,
			alertLevel: 0
		};
	}
	const facilities = {
		beds: 0,
		kitchen: 0,
		water: 0,
		workshop: 0,
		infirmary: 0,
		garden: 0,
		radio: 0,
		watch: 0,
		...start.facilities
	};
	let state = {
		version: 5,
		screen: "shelter",
		seed,
		rng: r,
		day: 1,
		dayAP: 6,
		maxAP: 6,
		survivors: [dressed.s],
		shelter: {
			locationId: start.locationId,
			capacity: start.capacity,
			facilities,
			barricade: start.barricade
		},
		resources,
		locations,
		log: [],
		mission: null,
		encounter: null,
		squadPick: [dressed.s.id],
		mapTarget: null,
		ended: null,
		muted: false,
		occupiedCount: 1,
		bonds: {},
		stash: [...dressed.extra, extra.item],
		notices: [],
		dispatches: []
	};
	state = pushLog(state, t("log.settle", {
		name: dressed.s.name,
		occ: t(`occ.${occ.id}`),
		place: t(`sh.${start.id}`)
	}));
	return state;
}
function isDiscovered(state, id) {
	const loc = locById(id);
	if (state.locations[id].discovered) return true;
	if (id === state.shelter.locationId) return true;
	const home = locById(state.shelter.locationId);
	if (home.neighbors.includes(id)) return true;
	if (state.shelter.facilities.radio >= 1 && loc.region === home.region) return true;
	if (state.shelter.facilities.radio >= 2) return true;
	return false;
}
function canTravel(state, id) {
	if (!isDiscovered(state, id)) return {
		ok: false,
		reason: t("travel.unknown")
	};
	if (id === state.shelter.locationId) return {
		ok: false,
		reason: t("travel.home")
	};
	const loc = locById(id);
	if (state.resources.fuel < loc.fuel) return {
		ok: false,
		reason: t("travel.fuel", { n: loc.fuel })
	};
	if (living(state).length === 0) return {
		ok: false,
		reason: t("travel.nobody")
	};
	if (!living(state).filter((s) => !isAway(state, s.id)).some(canMission)) return {
		ok: false,
		reason: t("travel.mood")
	};
	if (apOf(state) < 1) return {
		ok: false,
		reason: t("ap.none")
	};
	return {
		ok: true,
		reason: ""
	};
}
function squadOf(state, ids) {
	return ids.map((id) => byId(state, id)).filter((s) => s && s.alive);
}
function best(state, squad, key) {
	return [...squad].sort((a, b) => {
		const sa = effectiveSkills(state, a, squad.map((x) => x.id));
		return effectiveSkills(state, b, squad.map((x) => x.id))[key] - sa[key];
	})[0];
}
function zoneChoices(state) {
	const mission = state.mission;
	const dry = apOf(state) < 1;
	const hint = dry ? t("ap.need", { n: 1 }) : void 0;
	const c = [];
	if (!mission.searched) {
		c.push({
			id: "search_quiet",
			label: t("ch.searchQuiet"),
			hint: dry ? hint : t("ch.searchQuietHint"),
			disabled: dry
		});
		c.push({
			id: "search_loud",
			label: t("ch.searchLoud"),
			hint: dry ? hint : t("ch.searchLoudHint"),
			disabled: dry
		});
	}
	c.push({
		id: "fight",
		label: t("ch.fight"),
		hint: dry ? hint : t("ch.fightHint"),
		danger: true,
		disabled: dry
	});
	if (mission.searched) c.push({
		id: "next",
		label: t("ch.next"),
		hint: dry ? hint : t("ap.cost", { n: 1 }),
		disabled: dry
	});
	c.push({
		id: "extract",
		label: t("ch.extract"),
		hint: t("ap.extract")
	});
	return c;
}
function choicesFor(state, mission) {
	return zoneChoices({
		...state,
		mission
	});
}
function beginZone(state, index) {
	const m = state.mission;
	const loc = locById(m.locationId);
	const zoneName = loc.zones[Math.min(index, loc.zones.length - 1)];
	const ls = state.locations[m.locationId];
	const zone = tRoom(zoneName);
	const flavors = [
		t("flav.0", { zone }),
		t("flav.1", { zone }),
		t("flav.2", { zone }),
		t("flav.3", { zone })
	];
	const f = pick(state.rng, flavors);
	const promptBody = ls.zombies > 0 ? `${f.item} ${t("flav.zeds", { n: ls.zombies })}` : `${f.item} ${t("flav.quiet")}`;
	const next = {
		...m,
		zoneIndex: index,
		zoneName,
		searched: false,
		phase: "zone",
		fightStyle: null,
		promptTitle: `${tLoc(loc.id)} · ${zone}`,
		promptBody,
		image: loc.image,
		choices: []
	};
	next.choices = choicesFor({
		...state,
		rng: f.r,
		mission: next
	}, next);
	return {
		...state,
		rng: f.r,
		mission: next,
		screen: "mission"
	};
}
function startMission(state, locationId, squadIds) {
	const loc = locById(locationId);
	const able = squadIds.filter((id) => {
		const s = state.survivors.find((x) => x.id === id);
		return s && canMission(s) && !isAway(state, id);
	});
	const fallback = squadIds.filter((id) => !isAway(state, id));
	const squad = squadOf(state, able.length ? able : fallback);
	if (squad.length === 0) return pushLog(state, t("log.noMoodGo"));
	if (squad.some((s) => has(s, "agoraphobic"))) state = {
		...state,
		survivors: state.survivors.map((s) => able.includes(s.id) && has(s, "agoraphobic") ? {
			...s,
			morale: clamp(s.morale - 6, 0, 100)
		} : s)
	};
	const spent = trySpend(state, AP_COST.travel);
	if (!spent) return pushLog(state, t("ap.none"));
	const fuel = loc.fuel;
	const bag = EMPTY_BAG();
	const names = squad.map((s) => s.name).join(t("ui.comma"));
	let next = {
		...spent,
		resources: {
			...spent.resources,
			fuel: spent.resources.fuel - fuel
		},
		mapTarget: null,
		squadPick: squad.map((s) => s.id),
		mission: {
			locationId,
			squadIds: squad.map((s) => s.id),
			zoneIndex: 0,
			zoneCount: loc.zones.length,
			zoneName: loc.zones[0],
			searched: false,
			bag,
			finds: [],
			noise: 0,
			promptTitle: tLoc(loc.id),
			promptBody: t(`loc.${loc.id}.desc`),
			image: loc.image,
			choices: [],
			phase: "zone",
			fightStyle: null,
			kills: 0
		},
		locations: {
			...spent.locations,
			[locationId]: {
				...spent.locations[locationId],
				visited: true,
				discovered: true
			}
		}
	};
	next = pushLog(next, t("log.depart", {
		names,
		loc: tLoc(loc.id),
		state: t(`state.${loc.region}`)
	}));
	return beginZone(next, 0);
}
function lootMult(scout, loud) {
	let lucky = 1;
	if (has(scout, "lucky")) lucky *= 1.16;
	if (has(scout, "unlucky")) lucky *= .84;
	if (has(scout, "organized")) lucky *= 1.12;
	if (!loud && has(scout, "burglarhands")) lucky *= 1.18;
	if (!loud && has(scout, "catseyes")) lucky *= 1.08;
	if (!loud && has(scout, "dextrous")) lucky *= 1.06;
	if (!loud && has(scout, "shortsighted")) lucky *= .9;
	return (loud ? 1.05 : .42) * lucky * (1 + carryOf([scout]) * .05);
}
function stepNoise(r) {
	return (r >>> 0) % 1e3 / 1e3;
}
function autoWield(state, id, item) {
	const s = byId(state, id);
	if (!s) return state;
	const def = gearById(item.defId);
	if (!def || def.slot !== "weapon") return state;
	const old = s.worn?.weapon;
	const finds = (state.mission?.finds ?? []).filter((x) => x.uid !== item.uid);
	const stash = old ? [...state.stash ?? [], old] : state.stash ?? [];
	return {
		...state,
		stash,
		mission: state.mission ? {
			...state.mission,
			finds
		} : state.mission,
		survivors: state.survivors.map((x) => x.id === id ? {
			...x,
			worn: {
				...x.worn,
				weapon: item
			},
			weapon: def.id
		} : x)
	};
}
function rollLoot(state, loud) {
	const m = state.mission;
	const loc = locById(m.locationId);
	const ls = state.locations[m.locationId];
	const remaining = { ...ls.lootRemaining ?? EMPTY_BAG() };
	const stock = lootLeft(remaining);
	const squad = squadOf(state, m.squadIds);
	const scout = best(state, squad, "scavenge");
	const sk = effectiveSkills(state, scout, m.squadIds);
	let r = state.rng;
	const got = {};
	if (stock <= 0) return {
		state: {
			...state,
			rng: r + 23 | 0,
			locations: {
				...state.locations,
				[m.locationId]: {
					...ls,
					lootRemaining: remaining
				}
			}
		},
		got
	};
	const scv = skillFx("scavenge", sk.scavenge);
	const sth = skillFx("stealth", sk.stealth);
	let mult = lootMult(scout, loud) * scv.loot;
	if (!loud) mult *= sth.quietLoot;
	for (const [k, pair] of Object.entries(loc.loot)) {
		const n = range(r, pair[0], pair[1]);
		r = n.r;
		const want = Math.max(0, Math.round(n.n * mult * (.35 + stepNoise(r) * .45)));
		r = r + 17 | 0;
		const amt = Math.min(want, remaining[k]);
		remaining[k] -= amt;
		if (amt > 0) got[k] = amt;
	}
	const luck = Math.max(...squad.map(luckMult));
	const rolled = rollSearchGear(r, loc.id, {
		luck,
		carry: carryOf(squad),
		loud,
		day: state.day,
		gearP: scv.gearP,
		extraGear: scv.extraGear
	});
	r = rolled.r;
	let nextState = {
		...state,
		rng: r,
		mission: {
			...m,
			finds: [...m.finds ?? [], ...rolled.items]
		},
		locations: {
			...state.locations,
			[m.locationId]: {
				...ls,
				lootRemaining: remaining
			}
		}
	};
	if (rolled.items.length) {
		const wep = rolled.items.find((it) => gearById(it.defId)?.slot === "weapon");
		const scoutW = liveWeapon(scout);
		if (wep && scoutW.melee <= 2) nextState = autoWield(nextState, scout.id, wep);
	}
	return {
		state: nextState,
		got
	};
}
function maybeEncounter(state) {
	const m = state.mission;
	const loc = locById(m.locationId);
	const ls = state.locations[m.locationId];
	if (!ls.survivorOpen) return state;
	let r = state.rng;
	const roll = chance(r, loc.survivorChance * (m.zoneIndex === 0 ? 1.15 : .7));
	r = roll.r;
	if (!roll.ok) return {
		...state,
		rng: r
	};
	const occ = pick(r, OCCUPATIONS);
	r = occ.r;
	const nm = randomName(r);
	r = nm.r;
	const face = pickFace(r);
	r = face.r;
	const moodPick = pick(r, [
		"grateful",
		"wary",
		"hostile",
		"hurt"
	]);
	r = moodPick.r;
	const pos = pick(r, TRAITS.filter((x) => x.kind === "pos"));
	r = pos.r;
	const neg = pick(r, TRAITS.filter((x) => x.kind === "neg"));
	r = neg.r;
	const enc = {
		name: nm.name,
		occupation: occ.item.id,
		portrait: face.item.id,
		body: t(`enc.body.${moodPick.item}`, {
			name: nm.name,
			occ: t(`occ.${occ.item.id}`)
		}),
		mood: moodPick.item,
		skills: occ.item.skills,
		weapon: occ.item.weapon,
		traits: [pos.item.id, neg.item.id]
	};
	return {
		...state,
		rng: r,
		encounter: enc,
		screen: "encounter",
		locations: {
			...state.locations,
			[m.locationId]: {
				...ls,
				survivorOpen: false
			}
		}
	};
}
function attract(state, extra, spawn = true) {
	const m = state.mission;
	const ls = state.locations[m.locationId];
	const loc = locById(m.locationId);
	const add = spawn ? Math.min(3, extra) : 0;
	return {
		...state,
		locations: {
			...state.locations,
			[m.locationId]: {
				...ls,
				zombies: Math.min(loc.zombies + 15, ls.zombies + add)
			}
		},
		mission: {
			...m,
			noise: m.noise + extra
		}
	};
}
function killZombies(state, n) {
	const m = state.mission;
	const ls = state.locations[m.locationId];
	const left = Math.max(0, ls.zombies - n);
	return {
		...state,
		locations: {
			...state.locations,
			[m.locationId]: {
				...ls,
				zombies: left,
				cleared: left === 0
			}
		}
	};
}
function shiftMorale(state, ids, delta) {
	return {
		...state,
		survivors: state.survivors.map((s) => {
			if (!s.alive) return s;
			if (ids !== "all" && !ids.includes(s.id)) return s;
			return {
				...s,
				morale: clamp(s.morale + delta, 0, 100)
			};
		})
	};
}
function infectMod(s) {
	let m = 1;
	if (has(s, "thickskinned")) m *= .55;
	if (has(s, "thinskinned")) m *= 1.45;
	if (has(s, "lucky")) m *= .75;
	if (has(s, "unlucky")) m *= 1.3;
	if (has(s, "proneillness")) m *= 1.3;
	return m * infectFromArmor(s);
}
function dmgMod(s) {
	let m = 1;
	if (has(s, "thickskinned")) m *= .72;
	if (has(s, "thinskinned")) m *= 1.35;
	if (has(s, "weak")) m *= 1.15;
	if (has(s, "athletic") || has(s, "stout") || has(s, "strong")) m *= .92;
	const wound = skillFx("combat", s.skills.combat).woundPct;
	if (wound) m *= 1 - wound / 100;
	return m * dmgFromArmor(s);
}
function combatMod(s) {
	let m = 1;
	if (has(s, "coward")) m *= .82;
	if (has(s, "brave") || has(s, "desensitized")) m *= 1.08;
	if (has(s, "adrenaline") && s.hp / s.maxHp < .45) m *= 1.18;
	if (has(s, "pacifist")) m *= .9;
	if (has(s, "asthmatic")) m *= .92;
	return m;
}
function hurt(state, id, dmg, infectP, cause) {
	const s = byId(state, id);
	if (!s || !s.alive) return state;
	let r = state.rng;
	const taken = Math.max(1, Math.round(dmg * dmgMod(s)));
	const inf = chance(r, infectP * infectMod(s));
	r = inf.r;
	const hp = s.hp - taken;
	const dead = hp <= 0;
	let moraleHit = dead ? 0 : has(s, "desensitized") ? 2 : 6;
	if (!dead && has(s, "hemophobic")) moraleHit += 8;
	let next = mapSur({
		...state,
		rng: r
	}, id, (x) => ({
		...x,
		hp: Math.max(0, hp),
		infected: x.infected || !dead && inf.ok,
		alive: !dead,
		death: dead ? cause : x.death,
		morale: clamp(x.morale - moraleHit, 0, 100)
	}));
	if (dead) {
		next = salvageToStash(next, s);
		next = pushLog(next, t("log.died", {
			name: s.name,
			cause
		}));
		for (const o of living(next)) {
			const rel = relationOf(bondOf(next, o.id, s.id)).id;
			let drop = 18;
			if (rel === "friend") drop = 26;
			if (rel === "lover") drop = 34;
			next = mapSur(next, o.id, (x) => ({
				...x,
				morale: clamp(x.morale - drop, 0, 100)
			}));
		}
		next = pushLog(next, t("log.grief"));
		next = checkWipe(next);
	} else if (inf.ok) next = pushLog(next, t("log.bitten", { name: s.name }));
	return next;
}
function checkWipe(state) {
	if (living(state).length > 0) return state;
	return {
		...state,
		screen: "end",
		ended: {
			kind: "lose",
			reason: t("end.loseBody", { day: state.day })
		},
		mission: null,
		encounter: null
	};
}
function fightPrompt(state) {
	const m = state.mission;
	const ls = state.locations[m.locationId];
	const squad = squadOf(state, m.squadIds);
	if (ls.zombies <= 0) return {
		...state,
		mission: {
			...m,
			phase: "zone",
			promptTitle: tRoom(m.zoneName),
			promptBody: t("txt.fightCleared"),
			choices: choicesFor(state, {
				...m,
				searched: m.searched
			})
		}
	};
	const choices = [
		{
			id: "melee",
			label: t("ch.melee"),
			hint: t("ch.meleeHint"),
			danger: true
		},
		{
			id: "gun",
			label: t("ch.gun"),
			hint: t("ch.gunHint", { n: state.resources.ammo }),
			danger: true,
			disabled: state.resources.ammo <= 0 || !squad.some((s) => liveWeapon(s).gun)
		},
		{
			id: "flank",
			label: t("ch.flank"),
			hint: t("ch.flankHint"),
			disabled: (() => {
				const sneak = effectiveSkills(state, best(state, squad, "stealth"), m.squadIds);
				return sneak.stealth < skillFx("stealth", sneak.stealth).flankNeed;
			})()
		},
		{
			id: "back",
			label: t("ch.back")
		}
	];
	return {
		...state,
		mission: {
			...m,
			phase: "fight",
			promptTitle: t("ch.contact", { n: ls.zombies }),
			promptBody: t("txt.fightBody", { zone: tRoom(m.zoneName) }),
			choices
		}
	};
}
function resolveFight(state, style) {
	const m = state.mission;
	const squad = squadOf(state, m.squadIds);
	if (squad.length === 0) return checkWipe(state);
	const ls = state.locations[m.locationId];
	let r = state.rng;
	const fighter = style === "flank" ? best(state, squad, "stealth") : style === "gun" ? squad.find((s) => liveWeapon(s).gun) ?? best(state, squad, "combat") : best(state, squad, "combat");
	const sk = effectiveSkills(state, fighter, m.squadIds);
	const w = liveWeapon(fighter);
	let power = (sk.combat * 8 + w.melee * 2) * combatMod(fighter);
	let ammoUse = 0;
	let noise = 1 + Math.round(armorOf(fighter).noise);
	if (style === "gun") {
		ammoUse = Math.min(state.resources.ammo, 2 + Math.floor(ls.zombies / 8));
		power += 18 + ammoUse * 6;
		noise = 8;
	} else if (style === "flank") {
		power += sk.stealth * 4;
		noise = 2;
	} else noise = 3;
	if (has(fighter, "quiet") || has(fighter, "inconspicuous") || has(fighter, "gymnast")) noise = Math.max(1, noise - 1);
	if (has(fighter, "clumsy") || has(fighter, "conspicuous")) noise += 2;
	if (has(fighter, "keenhearing")) power += 4;
	const cfx = skillFx("combat", sk.combat);
	const sfx = skillFx("stealth", sk.stealth);
	noise = Math.max(0, Math.round(noise * (1 - sfx.noisePct / 100)));
	const zPow = ls.zombies * 7 + m.noise;
	const rollA = range(r, 80, 120);
	r = rollA.r;
	const rollB = range(r, 80, 120);
	r = rollB.r;
	const score = power * (rollA.n / 100) - zPow * (rollB.n / 100);
	let kills = 1 + Math.floor(w.melee / 7) + cfx.extraKill;
	if (style === "gun") kills = 2 + ammoUse + Math.floor(sk.combat / 4) + (cfx.extraKill > 1 ? 1 : 0);
	if (style === "flank") kills = 1 + sfx.extraFlank;
	if (score > 25) kills += 2;
	else if (score > 5) kills += 1;
	else if (score < -20) kills = Math.max(1, kills - 1);
	kills = Math.min(ls.zombies, kills);
	if (ls.zombies - kills > 0 && ls.zombies - kills <= 2 && score >= -12) kills = ls.zombies;
	let next = {
		...state,
		rng: r,
		resources: {
			...state.resources,
			ammo: state.resources.ammo - ammoUse
		}
	};
	next = killZombies(next, kills);
	next = attract(next, noise, false);
	next = bumpNoise(next, m.locationId, noise, style === "gun" ? 1 : 0);
	const prevFighter = fighter;
	const xp = applySkillXp(degradeWorn({
		...fighter,
		kills: fighter.kills + kills
	}, "weapon", 5 + Math.min(8, kills)), "combat", 8 * kills);
	next = {
		...next,
		survivors: next.survivors.map((s) => s.id === fighter.id ? xp.survivor : s),
		mission: next.mission ? {
			...next.mission,
			kills: (next.mission.kills ?? 0) + kills
		} : next.mission
	};
	next = noteSkillUps(next, prevFighter, xp.survivor);
	const left = next.locations[m.locationId].zombies;
	let dmg = 0;
	let infectP = 0;
	if (score < -10) {
		dmg = range(next.rng, 18, 40).n;
		next = {
			...next,
			rng: range(next.rng, 18, 40).r
		};
		infectP = style === "melee" ? .35 : .22;
	} else if (score < 20) {
		dmg = range(next.rng, 6, 16).n;
		next = {
			...next,
			rng: range(next.rng, 6, 16).r
		};
		infectP = style === "melee" ? .18 : .08;
	}
	if (dmg > 0) next = hurt(next, fighter.id, dmg, infectP, t("death.torn"));
	if (next.ended) return next;
	if (dmg > 0) next = mapSur(next, fighter.id, (x) => x.alive ? degradeWorn(degradeWorn(x, "body", 2), "head", 1) : x);
	if (squadOf(next, m.squadIds).length === 0) {
		next = pushLog(next, t("log.wipe", { loc: tLoc(locById(m.locationId).id) }));
		return finishMission(next, false);
	}
	const body = score > 20 ? t("txt.win", {
		name: fighter.name,
		n: kills,
		left
	}) : score > 0 ? t("txt.ok", {
		name: fighter.name,
		n: kills,
		left
	}) : t("txt.bad", {
		name: fighter.name,
		n: kills,
		left
	});
	const cleared = left === 0;
	next = {
		...next,
		mission: {
			...next.mission,
			phase: "zone",
			promptTitle: cleared ? t("ch.clearedTitle") : tRoom(m.zoneName),
			promptBody: (cleared ? `${body} ${t("txt.canOccupy")}` : body) + (xpGainLine("combat", {
				...xp,
				survivor: xp.survivor
			}) ? ` ${xpGainLine("combat", xp)}` : ""),
			choices: choicesFor(next, next.mission)
		}
	};
	next = pushLog(next, t("log.fight", {
		name: fighter.name,
		zone: tRoom(m.zoneName),
		n: kills
	}));
	return next;
}
function doSearch(state, loud) {
	const m = state.mission;
	const squad = squadOf(state, m.squadIds);
	const scout = best(state, squad, loud ? "scavenge" : "stealth");
	const sk = effectiveSkills(state, scout, m.squadIds);
	let next = { ...state };
	const loot = rollLoot(next, loud);
	next = loot.state;
	const bag = addRes(m.bag, loot.got);
	let noiseAdd = loud ? 5 : 1;
	if (has(scout, "quiet") || has(scout, "gymnast") || has(scout, "burglarhands")) noiseAdd = Math.max(0, noiseAdd - 1);
	if (has(scout, "clumsy") || has(scout, "conspicuous")) noiseAdd += 2;
	if (!loud && has(scout, "burglarhands")) noiseAdd = 0;
	noiseAdd = Math.max(0, Math.round(noiseAdd * (1 - skillFx("stealth", sk.stealth).noisePct / 100)));
	const cur = next.mission;
	next = attract({
		...next,
		mission: {
			...cur,
			bag,
			searched: true,
			noise: cur.noise + noiseAdd
		}
	}, loud ? 1 : 0);
	next = bumpNoise(next, m.locationId, noiseAdd, loud ? 1 : 0);
	const prevScout = scout;
	next = grantSquadXpNoted(next, m.squadIds, loud ? "scavenge" : "stealth", loud ? 10 : 8);
	if (loud) next = grantSquadXpNoted(next, m.squadIds, "scavenge", 4);
	const train = loud ? "scavenge" : "stealth";
	const searchNote = xpGainLine(train, applySkillXp(prevScout, train, loud ? 10 : 8));
	const bits = Object.entries(loot.got).filter(([, v]) => v > 0).map(([k, v]) => `${t(`res.${k}`)} ${v}`);
	const gearBits = (next.mission?.finds ?? []).filter((it) => !(m.finds ?? []).some((old) => old.uid === it.uid)).map((it) => labelItem(it));
	const found = [...bits, ...gearBits].length ? [...bits, ...gearBits].join(t("ui.comma")) : t("txt.empty");
	const dryStock = lootLeft(next.locations[m.locationId].lootRemaining) <= 0 && bits.length === 0 && gearBits.length === 0;
	const sneak = !loud && sk.stealth >= 7;
	let body = loud ? t("txt.loudFind", {
		name: scout.name,
		found
	}) : `${t("txt.quietFind", {
		name: scout.name,
		found
	})}${sneak ? t("txt.sneak") : ""}`;
	if (searchNote) body = `${body} ${searchNote}`;
	next = {
		...next,
		mission: {
			...next.mission,
			promptTitle: tRoom(m.zoneName),
			promptBody: dryStock ? `${body} ${t("log.lootDry")}` : body,
			choices: choicesFor(next, next.mission)
		}
	};
	if (dryStock) next = pushLog(next, t("log.lootDry"));
	if (apOf(next) >= AP_COST.encounter) next = maybeEncounter(next);
	if (next.screen === "encounter") return next;
	let hordeP = loud ? .34 : .14 + next.mission.noise / 70;
	hordeP += (next.locations[m.locationId].noiseToday ?? 0) / 120;
	hordeP += (next.locations[m.locationId].alertLevel ?? 0) * .04;
	if (squad.some((s) => has(s, "inconspicuous"))) hordeP *= .65;
	if (squad.some((s) => has(s, "conspicuous"))) hordeP *= 1.4;
	const horde = chance(next.rng, hordeP);
	next = {
		...next,
		rng: horde.r
	};
	if (horde.ok && next.locations[m.locationId].zombies > 0) {
		next = attract(next, 1);
		const dry = apOf(next) < 1;
		const need = dry ? t("ap.need", { n: 1 }) : void 0;
		next = {
			...next,
			mission: {
				...next.mission,
				promptBody: `${body} ${t("txt.heard")}`,
				choices: [
					{
						id: "fight",
						label: t("ch.meet"),
						danger: true,
						disabled: dry,
						hint: need
					},
					{
						id: "extract",
						label: t("ch.fleeNow"),
						danger: true,
						hint: t("ap.extract")
					},
					{
						id: "next",
						label: t("ch.otherRoom"),
						disabled: dry,
						hint: need
					}
				]
			}
		};
	}
	return next;
}
function missionChoice(state, choiceId) {
	const m = state.mission;
	if (!m) return state;
	if (m.phase === "fight") {
		if (choiceId === "back") return {
			...state,
			mission: {
				...m,
				phase: "zone",
				promptTitle: `${tLoc(locById(m.locationId).id)} · ${tRoom(m.zoneName)}`,
				promptBody: t("txt.hold"),
				choices: choicesFor(state, m)
			}
		};
		if (choiceId === "melee" || choiceId === "gun" || choiceId === "flank") return resolveFight(state, choiceId);
	}
	if (choiceId === "search_quiet" || choiceId === "search_loud") {
		const spent = trySpend(state, AP_COST.search);
		if (!spent) return state;
		return doSearch(spent, choiceId === "search_loud");
	}
	if (choiceId === "fight") {
		const spent = trySpend(state, AP_COST.fight);
		if (!spent) return state;
		return fightPrompt(spent);
	}
	if (choiceId === "next") {
		const nxt = m.zoneIndex + 1;
		if (nxt >= m.zoneCount) return {
			...state,
			mission: {
				...m,
				promptTitle: t("ch.endTitle"),
				promptBody: t("txt.endBody"),
				choices: [{
					id: "fight",
					label: t("ch.clearRest"),
					danger: true
				}, {
					id: "extract",
					label: t("ch.goHome")
				}]
			}
		};
		const spent = trySpend(state, AP_COST.next);
		if (!spent) return state;
		return beginZone(spent, nxt);
	}
	if (choiceId === "extract") return finishMission(state, true);
	return state;
}
function growBonds(state, ids, success) {
	let next = state;
	const alive = ids.filter((id) => next.survivors.find((s) => s.id === id && s.alive));
	if (alive.length < 2) return next;
	for (let i = 0; i < alive.length; i++) for (let j = i + 1; j < alive.length; j++) {
		const a = byId(next, alive[i]);
		const b = byId(next, alive[j]);
		const selfish = has(a, "selfish") || has(b, "selfish");
		const base = success ? 8 : 4;
		const roll = range(next.rng, 3, base + (selfish ? 0 : 5) + (has(a, "leader") || has(b, "leader") ? 3 : 0));
		next = {
			...next,
			rng: roll.r
		};
		const before = relationOf(bondOf(next, a.id, b.id));
		next = addBond(next, a.id, b.id, roll.n);
		const after = relationOf(bondOf(next, a.id, b.id));
		if (after.id !== before.id && (after.id === "friend" || after.id === "lover")) next = pushLog(next, t("log.bond", {
			a: a.name,
			b: b.name,
			rel: after.name
		}));
	}
	return next;
}
function finishMission(state, success) {
	const m = state.mission;
	if (!m) return state;
	const loc = locById(m.locationId);
	const ls = state.locations[m.locationId];
	let next = {
		...state,
		resources: success ? addRes(state.resources, m.bag) : state.resources,
		stash: success ? [...state.stash ?? [], ...m.finds ?? []] : state.stash ?? [],
		mission: null,
		encounter: null
	};
	const bagBits = tResBits(m.bag);
	if (success) {
		next = pushLog(next, t("log.return", {
			loc: tLoc(loc.id),
			bag: bagBits ? t("log.brought", { bag: bagBits }) : t("log.emptyBag")
		}));
		next = shiftMorale(next, m.squadIds, 8);
		if ((m.finds ?? []).length) next = pushLog(next, t("log.gear", {
			n: m.finds.length,
			bits: m.finds.map(labelItem).join(t("ui.comma"))
		}));
		if (ls.zombies > 0) {
			const fleeP = clamp(.22 + ls.zombies / 50 + m.noise / 60, .22, .65);
			const flee = chance(next.rng, fleeP);
			next = {
				...next,
				rng: flee.r
			};
			if (flee.ok) {
				const lost = {};
				Object.keys(m.bag).forEach((k) => {
					if (m.bag[k] > 0) lost[k] = -Math.min(next.resources[k], Math.max(1, Math.round(m.bag[k] * .35)));
				});
				if (Object.values(lost).some((n) => n)) {
					next = {
						...next,
						resources: addRes(next.resources, lost)
					};
					next = pushLog(next, t("log.fleeBag"));
				}
				const hurtRoll = chance(next.rng, .5);
				next = {
					...next,
					rng: hurtRoll.r
				};
				const victim = m.squadIds.map((id) => byId(next, id)).find((s) => s && s.alive);
				if (hurtRoll.ok && victim) {
					const dmg = range(next.rng, 8, 16);
					next = {
						...next,
						rng: dmg.r
					};
					next = hurt(next, victim.id, dmg.n, .08, t("death.flee"));
					if (!next.ended) next = pushLog(next, t("log.fleeHurt", { name: victim.name }));
				}
			}
		}
		next = {
			...next,
			survivors: next.survivors.map((s) => {
				if (!m.squadIds.includes(s.id) || !s.alive) return s;
				const fat = Math.max(0, armorOf(s).fatigue);
				return {
					...s,
					fatigue: clamp(s.fatigue + fat, 0, 100)
				};
			})
		};
	} else {
		next = pushLog(next, t("log.fail", { loc: tLoc(loc.id) }));
		next = shiftMorale(next, m.squadIds, -18);
		next = shiftMorale(next, "all", -6);
	}
	const overkill = Math.max(0, (m.kills ?? 0) - 12);
	if (overkill > 0) {
		const drop = Math.min(18, overkill);
		next = {
			...next,
			survivors: next.survivors.map((s) => {
				if (!m.squadIds.includes(s.id) || !s.alive) return s;
				const extra = has(s, "pacifist") ? drop + 8 : has(s, "desensitized") ? Math.floor(drop / 3) : drop;
				return {
					...s,
					morale: clamp(s.morale - extra, 0, 100)
				};
			})
		};
		next = pushLog(next, t("log.tooManyKills"));
	}
	next = growBonds(next, m.squadIds, success);
	if (siteQuiet(ls) && success && loc.id !== state.shelter.locationId) {
		next = {
			...next,
			screen: "occupy",
			mapTarget: loc.id
		};
		next = pushLog(next, t("log.clear", { loc: tLoc(loc.id) }));
		return next;
	}
	next = {
		...next,
		screen: "shelter",
		mapTarget: null
	};
	return next;
}
function resolveEncounter(state, action) {
	const enc = state.encounter;
	const m = state.mission;
	if (!enc || !m) return {
		...state,
		screen: "mission",
		encounter: null
	};
	if (action !== "turn") {
		const spent = trySpend(state, AP_COST.encounter);
		if (!spent) return state;
		state = spent;
	}
	let next = {
		...state,
		encounter: null,
		screen: "mission"
	};
	const livingN = living(state).length;
	if (action === "invite") {
		if (livingN >= state.shelter.capacity) {
			next = {
				...next,
				mission: {
					...m,
					promptBody: t("txt.fullHouse", { name: enc.name }),
					choices: choicesFor(next, m)
				}
			};
			next = pushLog(next, t("log.full", { name: enc.name }));
			return next;
		}
		if (enc.mood === "hostile") {
			const c = chance(next.rng, .45);
			next = {
				...next,
				rng: c.r
			};
			if (!c.ok) {
				const target = squadOf(next, m.squadIds)[0];
				next = hurt(next, target.id, 16, .05, t("death.survivor"));
				if (next.ended) return next;
				next = pushLog(next, t("log.betray", { name: enc.name }));
				next = {
					...next,
					mission: {
						...next.mission,
						promptBody: t("txt.betray", { name: enc.name }),
						choices: choicesFor(next, next.mission)
					}
				};
				return next;
			}
		}
		const made0 = makeSurvivor(next.rng, {
			name: enc.name,
			occupation: enc.occupation,
			traits: enc.traits,
			stance: enc.mood === "grateful" || enc.mood === "hurt" ? "friend" : enc.mood === "hostile" ? "rival" : "neutral",
			portrait: enc.portrait,
			weapon: enc.weapon
		});
		const dressed = dressSurvivor(made0.r, enc.occupation, made0.s);
		next = {
			...next,
			rng: dressed.r,
			stash: [...next.stash ?? [], ...dressed.extra],
			survivors: [...next.survivors, dressed.s],
			mission: {
				...m,
				promptBody: t("txt.joinWalk", { name: enc.name }),
				choices: choicesFor(next, m)
			}
		};
		const seed = enc.mood === "grateful" || enc.mood === "hurt" ? 18 : enc.mood === "hostile" ? 4 : 10;
		for (const id of m.squadIds) next = addBond(next, dressed.s.id, id, seed);
		next = pushLog(next, t("log.join", {
			name: enc.name,
			occ: t(`occ.${enc.occupation}`)
		}));
		return next;
	}
	if (action === "turn") {
		next = pushLog(next, t("log.leave", { name: enc.name }));
		next = {
			...next,
			mission: {
				...m,
				promptBody: t("txt.turnedAway", { name: enc.name }),
				choices: choicesFor(next, m)
			}
		};
		return next;
	}
	if (action === "trade") {
		const giveFood = Math.min(2, m.bag.food);
		const bag = {
			...m.bag,
			food: m.bag.food - giveFood,
			medicine: m.bag.medicine + (enc.mood === "hurt" ? 0 : 2)
		};
		next = {
			...next,
			mission: {
				...m,
				bag,
				promptBody: giveFood > 0 ? t("txt.tradeOk", { name: enc.name }) : t("txt.tradeEmpty", { name: enc.name }),
				choices: choicesFor(next, {
					...m,
					bag
				})
			}
		};
		return next;
	}
	const target = squadOf(next, m.squadIds)[0];
	const atk = range(next.rng, 10, 28);
	next = {
		...next,
		rng: atk.r
	};
	next = hurt(next, target.id, atk.n, .04, t("death.firefight"));
	if (next.ended) return next;
	const drop = range(next.rng, 1, 4);
	next = {
		...next,
		rng: drop.r
	};
	const bag = addRes(m.bag, {
		ammo: drop.n,
		food: 1
	});
	next = pushLog(next, t("log.firefight", {
		name: enc.name,
		zone: tRoom(m.zoneName)
	}));
	next = {
		...next,
		mission: {
			...m,
			bag,
			promptBody: t("txt.shot", {
				zone: tRoom(m.zoneName),
				name: enc.name
			}),
			choices: choicesFor(next, {
				...m,
				bag
			})
		}
	};
	next = attract(next, 2);
	return next;
}
function occupyHere(state) {
	const id = state.mapTarget;
	if (!id) return {
		...state,
		screen: "shelter"
	};
	const loc = locById(id);
	const old = locById(state.shelter.locationId);
	const fac = { ...state.shelter.facilities };
	for (const [k, v] of Object.entries(loc.occupyFacilities)) fac[k] = Math.max(fac[k], v);
	let next = {
		...state,
		screen: "shelter",
		mapTarget: null,
		occupiedCount: state.occupiedCount + 1,
		shelter: {
			locationId: id,
			capacity: loc.occupyCapacity,
			facilities: fac,
			barricade: Math.max(state.shelter.barricade, loc.occupyBarricade)
		},
		locations: {
			...state.locations,
			[old.id]: {
				...state.locations[old.id],
				occupied: false
			},
			[id]: {
				...state.locations[id],
				occupied: true,
				cleared: true,
				zombies: 0,
				discovered: true
			}
		}
	};
	next = pushLog(next, t("log.move", {
		old: tLoc(old.id),
		loc: tLoc(loc.id),
		state: t(`state.${loc.region}`),
		n: loc.occupyCapacity
	}));
	for (const n of loc.neighbors) next = {
		...next,
		locations: {
			...next.locations,
			[n]: {
				...next.locations[n],
				discovered: true
			}
		}
	};
	if (loc.size === "metro") next = {
		...next,
		screen: "end",
		ended: {
			kind: "win",
			reason: t("end.winBody", {
				day: next.day,
				loc: tLoc(loc.id)
			})
		}
	};
	return next;
}
function declineOccupy(state) {
	return {
		...state,
		screen: "shelter",
		mapTarget: null
	};
}
function assignJob(state, id, job) {
	if (isAway(state, id)) return state;
	return mapSur(state, id, (s) => ({
		...s,
		job
	}));
}
function kickSurvivor(state, id) {
	const s = byId(state, id);
	if (!s || s.stance === "leader") return state;
	let next = salvageToStash(state, s);
	next = mapSur(next, id, (x) => ({
		...x,
		alive: false,
		death: t("death.kick")
	}));
	next = shiftMorale(next, "all", -8);
	next = pushLog(next, t("log.kick", { name: s.name }));
	return checkWipe(next);
}
function upgradeFacility(state, id) {
	const def = FACILITIES.find((f) => f.id === id);
	const lv = state.shelter.facilities[id];
	if (lv >= def.max) return state;
	if (apOf(state) < AP_COST.build) return state;
	const costM = def.cost.materials * (lv + 1);
	const extra = def.cost.extra ?? {};
	if (state.resources.materials < costM) return state;
	for (const [k, v] of Object.entries(extra)) if (state.resources[k] < v * (lv + 1)) return state;
	let res = {
		...state.resources,
		materials: state.resources.materials - costM
	};
	for (const [k, v] of Object.entries(extra)) {
		const key = k;
		res[key] = res[key] - v * (lv + 1);
	}
	let next = {
		...state,
		dayAP: apOf(state) - AP_COST.build,
		resources: res,
		shelter: {
			...state.shelter,
			facilities: {
				...state.shelter.facilities,
				[id]: lv + 1
			},
			capacity: id === "beds" ? state.shelter.capacity + 1 : state.shelter.capacity
		}
	};
	next = pushLog(next, t("log.upgrade", {
		fac: t(`fac.${id}`),
		n: lv + 1
	}));
	return next;
}
function repairWall(state) {
	if (apOf(state) < AP_COST.repairWall) return state;
	if (state.resources.materials < 2) return state;
	const handy = living(state).some((s) => has(s, "handy") || has(s, "vehicleknow"));
	const builder = [...living(state)].sort((a, b) => b.skills.build - a.skills.build)[0];
	const bfx = skillFx("build", builder?.skills.build ?? 0);
	const gain = bfx.wall + bfx.wallExtra + (handy ? 3 : 0);
	const barricade = clamp(state.shelter.barricade + gain, 0, 100);
	let next = {
		...state,
		dayAP: apOf(state) - AP_COST.repairWall,
		resources: {
			...state.resources,
			materials: state.resources.materials - 2
		},
		shelter: {
			...state.shelter,
			barricade
		}
	};
	const worker = [...living(next)].sort((a, b) => b.skills.build - a.skills.build)[0];
	if (worker) {
		const prev = worker;
		const xp = applySkillXp(worker, "build", 8);
		next = mapSur(next, worker.id, () => xp.survivor);
		next = noteSkillUps(next, prev, xp.survivor);
	}
	next = pushLog(next, t("log.repairWall", { n: barricade }));
	return next;
}
function restNight(state, fromHome) {
	if (state.ended) return state;
	let next = {
		...state,
		day: state.day + 1,
		dayAP: state.maxAP ?? 6
	};
	const away = awayIds(next);
	const home = living(next).filter((s) => !away.has(s.id) && (!next.mission || !next.mission.squadIds.includes(s.id) || fromHome));
	const kitchen = next.shelter.facilities.kitchen;
	const waterLv = next.shelter.facilities.water;
	const garden = next.shelter.facilities.garden;
	const inf = next.shelter.facilities.infirmary;
	const watch = next.shelter.facilities.watch;
	const people = living(next).filter((s) => !away.has(s.id));
	const eaters = people.reduce((n, s) => n + (has(s, "heartyappetite") ? 1.4 : has(s, "lighteater") ? .7 : 1), 0);
	const drinkers = people.reduce((n, s) => n + (has(s, "highthirst") ? 1.5 : has(s, "lowthirst") ? .7 : 1), 0);
	const waste = next.day >= 16 ? 1 : 0;
	const eat = Math.max(1, Math.round(eaters - kitchen * .4 + waste));
	const drink = Math.max(1, Math.round(drinkers - waterLv * .4 + waste));
	const foodHave = next.resources.food;
	const waterHave = next.resources.water;
	const foodUsed = Math.min(foodHave, eat);
	const waterUsed = Math.min(waterHave, drink);
	next.resources = {
		...next.resources,
		food: foodHave - foodUsed,
		water: waterHave - waterUsed
	};
	const hungry = foodUsed < eat;
	const thirsty = waterUsed < drink;
	let foodGain = 0;
	let waterGain = waterLv > 0 ? Math.max(1, Math.round(waterLv * .6)) : 0;
	let medUsed = 0;
	let barricade = next.shelter.barricade;
	let radioFind = false;
	let radioPerson = false;
	for (const s of home) {
		if (!s.alive) continue;
		const working = canWork(s) && s.job !== "rest";
		const job = working ? s.job : "rest";
		if (!working && s.job !== "rest") next = pushLog(next, t("log.lieDown", { name: s.name }));
		let hp = s.hp;
		let hunger = s.hunger;
		let thirst = s.thirst;
		let fatigue = s.fatigue;
		let morale = s.morale;
		let infected = s.infected;
		let alive = true;
		let death = s.death;
		let nextS = s;
		let hungerDelta = hungry ? -28 : 18;
		if (has(s, "lighteater")) hungerDelta = hungry ? -18 : 26;
		if (has(s, "heartyappetite")) hungerDelta = hungry ? -40 : 10;
		if (has(s, "smoker")) hungerDelta -= 4;
		if (job === "cook") hungerDelta += 8;
		hunger = clamp(hunger + hungerDelta, 0, 100);
		let thirstDelta = thirsty ? -34 : 22;
		if (has(s, "lowthirst")) thirstDelta = thirsty ? -20 : 32;
		if (has(s, "highthirst")) thirstDelta = thirsty ? -50 : 12;
		thirst = clamp(thirst + thirstDelta, 0, 100);
		if (job === "rest") {
			let restHp = 12;
			if (has(s, "slowhealer")) restHp = 6;
			if (has(s, "athletic") || has(s, "stout")) restHp += 3;
			if (has(s, "unfit")) restHp -= 4;
			hp = clamp(hp + restHp, 0, s.maxHp);
			let restFat = 35;
			if (has(s, "wakeful")) restFat = 48;
			if (has(s, "sleepyhead")) restFat = 20;
			if (has(s, "insomnia")) restFat = 18;
			if (has(s, "unfit") || has(s, "asthmatic")) restFat -= 8;
			fatigue = clamp(fatigue - restFat, 0, 100);
			morale = clamp(morale + 6, 0, 100);
		} else fatigue = clamp(fatigue + 12 + (has(s, "asthmatic") ? 6 : 0), 0, 100);
		if (job === "farm" && garden > 0) {
			const ffx = skillFx("farm", s.skills.farm);
			foodGain += Math.round(garden * ffx.farmMul) + ffx.extraCrop + (has(s, "gardener") ? 1 : 0);
			nextS = addSkillXp(nextS, "farm", 12);
		}
		if (job === "cook" && kitchen > 0) {
			const kfx = skillFx("cook", s.skills.cook);
			foodGain += 1 + kfx.cookFood + (has(s, "keencook") ? 1 : 0);
			morale = clamp(morale + 8 + kfx.cookMorale, 0, 100);
			nextS = addSkillXp(nextS, "cook", 12);
		}
		if (job === "repair") {
			const rfx = skillFx("build", s.skills.build);
			barricade = clamp(barricade + rfx.wall + rfx.wallExtra + (has(s, "handy") || has(s, "vehicleknow") ? 3 : 0), 0, 100);
			nextS = addSkillXp(nextS, "build", 10);
		}
		if (job === "craft" && next.shelter.facilities.workshop > 0 && next.resources.materials > 0) {
			next.resources = {
				...next.resources,
				materials: next.resources.materials - 1
			};
			barricade = clamp(barricade + 6 + (has(s, "vehicleknow") ? 2 : 0), 0, 100);
			nextS = addSkillXp(nextS, "build", 8);
			const cfx = skillFx("build", nextS.skills.build);
			const amt = cfx.mend + (has(s, "handy") ? 3 : 0);
			const shopLv = next.shelter.facilities.workshop;
			let stash = repairWorst(next.stash ?? [], amt);
			if (shopLv >= 2 || cfx.doubleMend) stash = repairWorst(stash, amt);
			next.stash = stash;
			const folks = living(next);
			for (const p of folks) {
				const pieces = salvageWorn(p);
				if (!pieces.length) continue;
				const fixed = repairWorst(pieces, Math.round(amt * .6));
				const worn = {};
				for (const it of fixed) {
					const def = gearById(it.defId);
					if (def) worn[def.slot] = it;
				}
				next = mapSur(next, p.id, (x) => ({
					...x,
					worn: {
						...x.worn,
						...worn
					}
				}));
			}
			next = pushLog(next, t("log.repair", { name: s.name }));
		}
		if (job === "tend" && inf > 0) {
			const mfx = skillFx("medical", s.skills.medical);
			hp = clamp(hp + 4 + mfx.tendHp, 0, s.maxHp);
			nextS = addSkillXp(nextS, "medical", 12);
			if (has(s, "hemophobic")) morale -= 8;
			if (s.infected && next.resources.medicine > 0) {
				const c = chance(next.rng, skillFx("medical", s.skills.medical).cure * .7 + inf * .1);
				next = {
					...next,
					rng: c.r
				};
				if (c.ok) infected = false;
				medUsed += 1;
			}
		}
		if (job === "radio" && next.shelter.facilities.radio > 0) {
			const a = chance(next.rng, .35);
			next = {
				...next,
				rng: a.r
			};
			if (a.ok) radioFind = true;
			const b = chance(next.rng, .12);
			next = {
				...next,
				rng: b.r
			};
			if (b.ok) radioPerson = true;
		}
		if (hungry) morale -= 14;
		if (thirsty) morale -= 10;
		if (has(s, "smoker")) morale -= 3;
		if (has(s, "depressed")) morale -= 6;
		if (has(s, "outdoorsman")) morale += 2;
		if (hunger <= 0) {
			hp -= has(s, "irongut") ? 10 : has(s, "weakstomach") ? 24 : 18;
			morale -= 10;
		}
		if (thirst <= 0) {
			hp -= 24;
			morale -= 8;
		}
		if (infected) {
			hp -= Math.round(10 * (has(s, "proneillness") ? 1.4 : 1));
			const worse = chance(next.rng, .18 + (has(s, "proneillness") ? .1 : 0));
			next = {
				...next,
				rng: worse.r
			};
			if (worse.ok && next.resources.medicine <= 0) hp -= 20;
			if (inf > 0 && next.resources.medicine > 0 && job !== "tend") {
				medUsed += 1;
				const c = chance(next.rng, .25 + inf * .1);
				next = {
					...next,
					rng: c.r
				};
				if (c.ok) infected = false;
			}
		}
		if (hp <= 0) {
			alive = false;
			death = infected ? t("death.infect") : hunger <= 0 || thirst <= 0 ? t("death.starve") : t("death.wound");
		}
		morale = clamp(morale, 0, 100);
		next = mapSur(next, s.id, (x) => ({
			...x,
			skills: nextS.skills,
			skillXp: nextS.skillXp,
			hp: Math.max(0, hp),
			hunger,
			thirst,
			fatigue,
			morale,
			infected,
			alive,
			death,
			daysIn: x.daysIn + 1,
			job: working ? x.job : "rest"
		}));
		if (!alive) {
			next = salvageToStash(next, s);
			next = pushLog(next, t("log.nightDeath", {
				name: s.name,
				cause: death
			}));
			for (const o of living(next)) {
				const rel = relationOf(bondOf(next, o.id, s.id)).id;
				const drop = rel === "lover" ? 28 : rel === "friend" ? 20 : 12;
				next = mapSur(next, o.id, (x) => ({
					...x,
					morale: clamp(x.morale - drop, 0, 100)
				}));
			}
		} else next = noteSkillUps(next, s, {
			...s,
			skills: nextS.skills,
			skillXp: nextS.skillXp
		});
	}
	const leader = living(next).find((s) => has(s, "leader"));
	if (leader) next = {
		...next,
		survivors: next.survivors.map((s) => s.alive && s.id !== leader.id ? {
			...s,
			morale: clamp(s.morale + 2, 0, 100)
		} : s)
	};
	const tender = home.find((s) => s.job === "tend" && s.alive && canWork(s));
	if (tender && inf > 0) for (const o of living(next)) {
		if (o.hp < o.maxHp) next = mapSur(next, o.id, (x) => ({
			...x,
			hp: clamp(x.hp + skillFx("medical", tender.skills.medical).heal, 0, x.maxHp)
		}));
		if (o.infected && next.resources.medicine > medUsed && !has(tender, "hemophobic")) {
			const c = chance(next.rng, skillFx("medical", tender.skills.medical).cure);
			next = {
				...next,
				rng: c.r
			};
			if (c.ok) {
				next = mapSur(next, o.id, (x) => ({
					...x,
					infected: false
				}));
				medUsed += 1;
				next = pushLog(next, t("log.clearedInfect", {
					who: tender.name,
					name: o.name
				}));
			}
		}
	}
	next.resources = {
		...next.resources,
		food: next.resources.food + foodGain,
		water: next.resources.water + waterGain,
		medicine: Math.max(0, next.resources.medicine - medUsed)
	};
	if (next.resources.food > 10) {
		const rot = Math.max(1, Math.ceil((next.resources.food - 10) * .07));
		next.resources = {
			...next.resources,
			food: next.resources.food - rot
		};
		next = pushLog(next, t("log.rot", { n: rot }));
	}
	next.shelter = {
		...next.shelter,
		barricade
	};
	if (radioFind) {
		const hidden = LOCATIONS.filter((l) => !next.locations[l.id].discovered);
		if (hidden.length) {
			const p = pick(next.rng, hidden);
			next = {
				...next,
				rng: p.r
			};
			next.locations = {
				...next.locations,
				[p.item.id]: {
					...next.locations[p.item.id],
					discovered: true
				}
			};
			next = pushLog(next, t("log.radioLoc", {
				loc: tLoc(p.item.id),
				state: t(`state.${p.item.region}`)
			}));
		}
	}
	if (radioPerson && living(next).length < next.shelter.capacity) {
		const occ = pick(next.rng, OCCUPATIONS);
		const nm = randomName(occ.r);
		const face = pickFace(nm.r);
		const pos = pick(face.r, TRAITS.filter((x) => x.kind === "pos"));
		const neg = pick(pos.r, TRAITS.filter((x) => x.kind === "neg"));
		const made = makeSurvivor(neg.r, {
			name: nm.name,
			occupation: occ.item.id,
			traits: [pos.item.id, neg.item.id],
			stance: "neutral",
			portrait: face.item.id
		});
		const dressed = dressSurvivor(made.r, occ.item.id, made.s);
		next = {
			...next,
			rng: dressed.r,
			stash: [...next.stash ?? [], ...dressed.extra],
			survivors: [...next.survivors, dressed.s]
		};
		next = pushLog(next, t("log.radioPerson", { name: dressed.s.name }));
	}
	next = resolveDispatches(next);
	if (next.ended) return next;
	const stillHome = living(next).filter((s) => !awayIds(next).has(s.id));
	const guards = stillHome.filter((s) => s.job === "guard").length;
	const pressure = nightPressure(next.day);
	const floorP = .04 * Math.min(1, next.day / 8);
	const raidP = clamp((100 - barricade) / 170 * pressure - guards * .055 - watch * .04, floorP, .75);
	const raid = chance(next.rng, raidP);
	next = {
		...next,
		rng: raid.r
	};
	if (raid.ok && living(next).length > 0) {
		const pool = stillHome.filter((s) => s.alive);
		const victim = pick(next.rng, pool.length ? pool : living(next));
		next = {
			...next,
			rng: victim.r
		};
		const dmg = range(next.rng, 14, 32);
		next = {
			...next,
			rng: dmg.r
		};
		next = hurt(next, victim.item.id, dmg.n, .22, t("death.raid"));
		const steal = 2 + Math.floor(next.day / 12);
		next.resources = {
			...next.resources,
			food: Math.max(0, next.resources.food - steal)
		};
		next.shelter = {
			...next.shelter,
			barricade: clamp(next.shelter.barricade - 10, 0, 100)
		};
		if (!next.ended) next = pushLog(next, t("log.raid"));
		if (!next.ended && next.shelter.barricade < 35) {
			const extra = chance(next.rng, .4);
			next = {
				...next,
				rng: extra.r
			};
			if (extra.ok) {
				const other = (pool.length ? pool : living(next)).filter((s) => s.id !== victim.item.id);
				if (other.length) {
					const v2 = pick(next.rng, other);
					next = {
						...next,
						rng: v2.r
					};
					const d2 = range(next.rng, 8, 20);
					next = {
						...next,
						rng: d2.r
					};
					next = hurt(next, v2.item.id, d2.n, .15, t("death.raid"));
					if (!next.ended) next = pushLog(next, t("log.raidHard"));
				}
			}
		}
	}
	if (hungry) next = pushLog(next, t("log.hungry"));
	if (thirsty) next = pushLog(next, t("log.thirsty"));
	if (foodGain > 0) next = pushLog(next, t("log.harvest", { n: foodGain }));
	const locations = { ...next.locations };
	let rr = next.rng;
	const wanderIds = [];
	for (const id of Object.keys(locations)) {
		const cur = locations[id];
		let loc = {
			...cur,
			noiseToday: 0,
			threat: Math.max(0, (cur.threat ?? 0) - 5)
		};
		if (loc.zombies === 0) {
			const p = chance(rr, .05 + next.day / 400);
			rr = p.r;
			if (p.ok) {
				loc = {
					...loc,
					zombies: 1,
					cleared: false
				};
				if (loc.discovered || loc.visited) wanderIds.push(id);
			}
		}
		locations[id] = loc;
	}
	next = {
		...next,
		rng: rr,
		locations
	};
	for (const id of wanderIds) next = pushLog(next, t("log.wander", { loc: tLoc(id) }));
	next = checkWipe(next);
	if (next.ended) return next;
	if (next.screen !== "occupy" && next.screen !== "end") next = {
		...next,
		screen: "shelter"
	};
	return next;
}
function daysOfFood(state) {
	const n = Math.max(1, Math.round(living(state).length - state.shelter.facilities.kitchen * .4));
	if (n <= 0) return 99;
	return Math.floor(state.resources.food / n);
}
function extractMission(state) {
	return finishMission(state, true);
}
function failMission(state) {
	return finishMission(state, false);
}
function forceEncounter(state) {
	if (!state.mission) return state;
	const loc = state.mission.locationId;
	return maybeEncounter({
		...state,
		locations: {
			...state.locations,
			[loc]: {
				...state.locations[loc],
				survivorOpen: true
			}
		}
	});
}
function grantMissionLoot(state, got, gear) {
	if (!state.mission) return state;
	const lootIds = state.mission.squadIds;
	let r = state.rng;
	let items = gear;
	if (items === void 0) {
		const squad = squadOf(state, state.mission.squadIds);
		const scout = squad[0];
		const rolled = rollSearchGear(r, state.mission.locationId, {
			luck: scout ? luckMult(scout) : 1,
			carry: carryOf(squad),
			loud: false,
			day: state.day
		});
		r = rolled.r;
		items = rolled.items;
	}
	let next = {
		...state,
		rng: r,
		mission: {
			...state.mission,
			bag: addRes(state.mission.bag, got),
			finds: [...state.mission.finds ?? [], ...items]
		}
	};
	if (items.length) {
		const wep = items.find((it) => gearById(it.defId)?.slot === "weapon");
		const scout = squadOf(next, next.mission.squadIds)[0];
		if (wep && scout && liveWeapon(scout).melee <= 2) next = autoWield(next, scout.id, wep);
	}
	next = grantSquadXpNoted(next, lootIds, "scavenge", 6);
	return next;
}
function missionKill(state, n, killerId) {
	if (!state.mission) return state;
	let next = killZombies(state, n);
	if (killerId) {
		const prev = next.survivors.find((s) => s.id === killerId);
		if (prev && prev.alive) {
			const xp = applySkillXp({
				...prev,
				kills: prev.kills + n
			}, "combat", 8 * n);
			next = {
				...next,
				survivors: next.survivors.map((s) => s.id === killerId ? xp.survivor : s)
			};
			next = noteSkillUps(next, prev, xp.survivor);
		}
	}
	return next;
}
function missionStrike(state, id, dmg, infect) {
	return hurt(state, id, dmg, infect ? 1 : 0, t("death.torn"));
}
function equipItem(state, survivorId, uid) {
	const s = state.survivors.find((x) => x.id === survivorId && x.alive);
	if (!s) return state;
	const stash = state.stash ?? [];
	const idx = stash.findIndex((x) => x.uid === uid);
	if (idx < 0) return state;
	const item = stash[idx];
	const def = gearById(item.defId);
	if (!def) return state;
	const prev = s.worn?.[def.slot];
	const nextStash = stash.filter((x) => x.uid !== uid);
	if (prev) nextStash.push(prev);
	const weapon = def.slot === "weapon" ? def.id : s.weapon;
	return {
		...state,
		stash: nextStash,
		survivors: state.survivors.map((x) => x.id === survivorId ? {
			...x,
			worn: {
				...x.worn,
				[def.slot]: item
			},
			weapon
		} : x)
	};
}
function unequipSlot(state, survivorId, slot) {
	const s = state.survivors.find((x) => x.id === survivorId && x.alive);
	const item = s?.worn?.[slot];
	if (!s || !item) return state;
	const worn = { ...s.worn };
	delete worn[slot];
	const weapon = slot === "weapon" ? "fists" : s.weapon;
	return {
		...state,
		stash: [...state.stash ?? [], item],
		survivors: state.survivors.map((x) => x.id === survivorId ? {
			...x,
			worn,
			weapon
		} : x)
	};
}
function discardItem(state, uid) {
	const stash = state.stash ?? [];
	const item = stash.find((x) => x.uid === uid);
	if (!item) return state;
	const mats = item.cond >= 40 ? 1 : 0;
	let next = {
		...state,
		stash: stash.filter((x) => x.uid !== uid),
		resources: mats ? addRes(state.resources, { materials: mats }) : state.resources
	};
	next = pushLog(next, mats ? t("log.discardSalvage", {
		name: labelItem(item),
		n: mats
	}) : t("log.discard", { name: labelItem(item) }));
	return next;
}
var KEY$1 = "ash-market-v1";
var MAX_SMOKES = 99;
var CATALOG = [
	{
		id: "paper.carbon",
		kind: "paper",
		paper: "carbon",
		smokes: 12
	},
	{
		id: "paper.ledger",
		kind: "paper",
		paper: "ledger",
		smokes: 12
	},
	{
		id: "paper.ash",
		kind: "paper",
		paper: "ash",
		smokes: 16
	},
	{
		id: "frame.tape",
		kind: "frame",
		frame: "tape",
		smokes: 8
	},
	{
		id: "frame.rust",
		kind: "frame",
		frame: "rust",
		smokes: 10
	},
	{
		id: "frame.brass",
		kind: "frame",
		frame: "brass",
		smokes: 14
	},
	{
		id: "pack.founder",
		kind: "pack",
		smokes: 40
	}
];
var BANS = [
	"shop.ban.revive",
	"shop.ban.food",
	"shop.ban.points",
	"shop.ban.energy",
	"shop.ban.gacha",
	"shop.ban.bond"
];
var FREE_PAPER = "field";
var FREE_FRAME = "none";
function emptyWallet() {
	return {
		smokes: 0,
		owned: [],
		paper: FREE_PAPER,
		frame: FREE_FRAME,
		founder: false,
		nights: 0
	};
}
function loadWallet() {
	if (typeof window === "undefined") return emptyWallet();
	try {
		const raw = localStorage.getItem(KEY$1);
		if (!raw) return emptyWallet();
		const data = JSON.parse(raw);
		return {
			...emptyWallet(),
			smokes: Math.max(0, Math.min(MAX_SMOKES, Number(data.smokes) || 0)),
			owned: Array.isArray(data.owned) ? data.owned.filter(Boolean) : [],
			paper: data.paper === "carbon" || data.paper === "ledger" || data.paper === "ash" ? data.paper : FREE_PAPER,
			frame: data.frame === "tape" || data.frame === "rust" || data.frame === "brass" ? data.frame : FREE_FRAME,
			founder: !!data.founder,
			nights: Math.max(0, Number(data.nights) || 0)
		};
	} catch {
		return emptyWallet();
	}
}
function writeWallet(w) {
	try {
		localStorage.setItem(KEY$1, JSON.stringify(w));
	} catch {}
}
function owns(w, id) {
	if (id === "pack.founder") return w.founder;
	return w.owned.includes(id) || w.founder;
}
function withUnlock(w, id) {
	let next = {
		...w,
		owned: w.owned.includes(id) ? w.owned : [...w.owned, id]
	};
	if (id === "pack.founder") next = {
		...next,
		founder: true,
		owned: Array.from(/* @__PURE__ */ new Set([...next.owned, ...CATALOG.map((c) => c.id)])),
		paper: next.paper === FREE_PAPER ? "ash" : next.paper,
		frame: next.frame === FREE_FRAME ? "brass" : next.frame
	};
	const item = CATALOG.find((c) => c.id === id);
	if (item?.paper) next.paper = item.paper;
	if (item?.frame) next.frame = item.frame;
	return next;
}
function persist$1(partial, get) {
	const cur = get();
	const next = {
		smokes: partial.smokes ?? cur.smokes,
		owned: partial.owned ?? cur.owned,
		paper: partial.paper ?? cur.paper,
		frame: partial.frame ?? cur.frame,
		founder: partial.founder ?? cur.founder,
		nights: partial.nights ?? cur.nights
	};
	writeWallet(next);
	return next;
}
var useShop = create((set, get) => ({
	...emptyWallet(),
	tab: "law",
	note: null,
	boot: () => set({
		...loadWallet(),
		note: null
	}),
	setTab: (tab) => set({
		tab,
		note: null
	}),
	grantNight: () => {
		const w = get();
		set(persist$1({
			smokes: Math.min(MAX_SMOKES, w.smokes + 2),
			nights: w.nights + 1
		}, get));
	},
	buy: (id) => {
		const w = get();
		if (owns(w, id)) {
			set({ note: "shop.note.have" });
			return true;
		}
		const item = CATALOG.find((c) => c.id === id);
		if (!item) return false;
		if (w.smokes < item.smokes) {
			set({ note: "shop.note.short" });
			return false;
		}
		const unlocked = withUnlock({
			...w,
			smokes: w.smokes - item.smokes
		}, id);
		writeWallet(unlocked);
		set({
			...unlocked,
			note: "shop.note.bought"
		});
		return true;
	},
	wearPaper: (id) => {
		const w = get();
		if (id !== FREE_PAPER && !w.founder && !w.owned.includes(`paper.${id}`)) return;
		set(persist$1({ paper: id }, get));
	},
	wearFrame: (id) => {
		const w = get();
		if (id !== FREE_FRAME && !w.founder && !w.owned.includes(`frame.${id}`)) return;
		set(persist$1({ frame: id }, get));
	},
	owns: (id) => owns(get(), id),
	paperOwned: (id) => id === FREE_PAPER || get().founder || get().owned.includes(`paper.${id}`),
	frameOwned: (id) => id === FREE_FRAME || get().founder || get().owned.includes(`frame.${id}`)
}));
function persist(s) {
	const log = s.log ?? [];
	const next = log.length > 80 ? {
		...s,
		log: log.slice(-80)
	} : s;
	writeSave(next);
	return next;
}
function peekOf(saved) {
	if (!saved?.shelter) return null;
	return {
		day: saved.day,
		loc: saved.shelter.locationId
	};
}
var useGame = create((set, get) => ({
	run: null,
	hasSave: false,
	savePeek: null,
	help: false,
	dispatchOpen: false,
	menu: "title",
	muted: false,
	boot: () => {
		useShop.getState().boot();
		const saved = loadSave();
		const { run, menu } = get();
		if (run) {
			set({
				hasSave: !!saved,
				savePeek: peekOf(run)
			});
			return;
		}
		if (menu === "create" || menu === "shop") {
			set({
				hasSave: !!saved,
				savePeek: peekOf(saved)
			});
			return;
		}
		set({
			hasSave: !!saved,
			savePeek: peekOf(saved),
			muted: !!saved?.muted
		});
	},
	openCreate: () => {
		unlockAudio();
		click();
		set({ menu: "create" });
	},
	openTitle: () => set({ menu: "title" }),
	parkTitle: () => {
		const run = get().run;
		if (run) writeSave(run);
		set({
			run: null,
			menu: "title",
			dispatchOpen: false,
			hasSave: !!run || get().hasSave,
			savePeek: peekOf(run) ?? get().savePeek
		});
	},
	openShop: () => {
		unlockAudio();
		click();
		set({ menu: "shop" });
	},
	closeShop: () => {
		click();
		set({ menu: "title" });
	},
	openHelp: () => {
		click();
		set({ help: true });
	},
	closeHelp: () => set({ help: false }),
	openDispatch: () => {
		click();
		set({ dispatchOpen: true });
	},
	closeDispatch: () => set({ dispatchOpen: false }),
	sendDispatch: (ids, task) => {
		const run = get().run;
		if (!run) return;
		if (!canStartDispatch(run, ids).ok) {
			warn();
			return;
		}
		ok();
		set({
			run: persist(startDispatch(run, ids, task)),
			dispatchOpen: false
		});
	},
	newGame: (input) => {
		unlockAudio();
		ok();
		const run = persist(createNewGame(input));
		set({
			run,
			hasSave: true,
			savePeek: peekOf(run),
			menu: "title",
			muted: run.muted,
			help: false
		});
	},
	continueGame: () => {
		unlockAudio();
		click();
		const run = loadSave();
		if (run) set({
			run,
			hasSave: true,
			savePeek: peekOf(run),
			muted: !!run.muted,
			help: false
		});
		else set({
			hasSave: false,
			savePeek: null
		});
	},
	abandon: () => {
		clearSave();
		set({
			run: null,
			hasSave: false,
			savePeek: null,
			menu: "title",
			help: false
		});
	},
	setScreen: (screen) => {
		const run = get().run;
		if (!run) return;
		click();
		set({ run: persist({
			...run,
			screen
		}) });
	},
	setSquad: (ids) => {
		const run = get().run;
		if (!run) return;
		set({ run: {
			...run,
			squadPick: ids
		} });
	},
	setMapTarget: (id) => {
		const run = get().run;
		if (!run) return;
		click();
		const kept = run.squadPick.filter((x) => {
			const s = run.survivors.find((p) => p.id === x && p.alive);
			return s && canMission(s) && !isAway(run, x);
		});
		const fallback = run.survivors.find((s) => canMission(s) && !isAway(run, s.id)) ?? run.survivors.find((s) => s.alive && !isAway(run, s.id));
		set({ run: persist({
			...run,
			mapTarget: id,
			screen: "squad",
			squadPick: kept.length ? kept : fallback ? [fallback.id] : []
		}) });
	},
	goMission: () => {
		const run = get().run;
		if (!run || !run.mapTarget) return;
		const ids = run.squadPick.filter((id) => {
			const s = run.survivors.find((p) => p.id === id);
			return s && canMission(s) && !isAway(run, id);
		});
		if (!ids.length) return;
		ok();
		set({ run: persist(startMission(run, run.mapTarget, ids)) });
	},
	choose: (id) => {
		const run = get().run;
		if (!run) return;
		const next = missionChoice(run, id);
		if (next.ended) warn();
		else click();
		set({ run: persist(next) });
	},
	encounter: (a) => {
		const run = get().run;
		if (!run) return;
		if (a === "fight") warn();
		else ok();
		set({ run: persist(resolveEncounter(run, a)) });
	},
	occupy: () => {
		const run = get().run;
		if (!run) return;
		ok();
		set({ run: persist(occupyHere(run)) });
	},
	skipOccupy: () => {
		const run = get().run;
		if (!run) return;
		click();
		set({ run: persist(declineOccupy(run)) });
	},
	job: (id, job) => {
		const run = get().run;
		if (!run) return;
		click();
		set({ run: persist(assignJob(run, id, job)) });
	},
	kick: (id) => {
		const run = get().run;
		if (!run) return;
		warn();
		set({ run: persist(kickSurvivor(run, id)) });
	},
	upgrade: (id) => {
		const run = get().run;
		if (!run) return;
		ok();
		set({ run: persist(upgradeFacility(run, id)) });
	},
	repairWall: () => {
		const run = get().run;
		if (!run) return;
		ok();
		set({ run: persist(repairWall(run)) });
	},
	sleep: () => {
		const run = get().run;
		if (!run) return;
		const next = restNight(run, true);
		if (!next.ended) useShop.getState().grantNight();
		if (next.ended) warn();
		else click();
		set({ run: persist(next) });
	},
	toggleMute: () => {
		const run = get().run;
		const next = !get().muted;
		setMuted(next);
		if (next) setBgm("off");
		else unlockAudio();
		set({
			muted: next,
			run: run ? persist({
				...run,
				muted: next
			}) : run
		});
	},
	simKill: (killerId) => {
		const run = get().run;
		if (!run) return;
		set({ run: persist(missionKill(run, 1, killerId)) });
	},
	clearNotices: () => {
		const run = get().run;
		if (!run) return;
		set({ run: persist({
			...run,
			notices: []
		}) });
	},
	simHurt: (id, dmg, infect) => {
		const run = get().run;
		if (!run) return;
		const next = missionStrike(run, id, dmg, infect);
		if (next.ended) warn();
		set({ run: persist(next) });
	},
	simLoot: (got, gear, rng) => {
		const run = get().run;
		if (!run) return;
		let next = grantMissionLoot(run, got, gear);
		if (rng != null) next = {
			...next,
			rng
		};
		set({ run: persist(next) });
	},
	simEncounter: () => {
		const run = get().run;
		if (!run) return;
		set({ run: persist(forceEncounter(run)) });
	},
	simExtract: () => {
		const run = get().run;
		if (!run) return;
		ok();
		set({ run: persist(extractMission(run)) });
	},
	simFail: () => {
		const run = get().run;
		if (!run) return;
		warn();
		set({ run: persist(failMission(run)) });
	},
	equip: (survivorId, uid) => {
		const run = get().run;
		if (!run) return;
		click();
		set({ run: persist(equipItem(run, survivorId, uid)) });
	},
	unequip: (survivorId, slot) => {
		const run = get().run;
		if (!run) return;
		click();
		set({ run: persist(unequipSlot(run, survivorId, slot)) });
	},
	discard: (uid) => {
		const run = get().run;
		if (!run) return;
		click();
		set({ run: persist(discardItem(run, uid)) });
	}
}));
if (typeof window !== "undefined") window.addEventListener("visibilitychange", () => {
	if (document.visibilityState === "hidden") {
		const run = useGame.getState().run;
		if (run) writeSave(run);
	}
});
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[color,background-color,transform] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-fg",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-danger text-fg hover:opacity-90"
		},
		size: {
			default: "h-11 rounded-md px-5 text-sm",
			lg: "h-12 rounded-lg px-6 text-base",
			sm: "h-9 rounded-sm px-3 text-xs",
			icon: "size-11 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-fg placeholder:text-faint", "outline-none transition-[box-shadow,border-color] duration-[var(--motion-quick)] ease-[var(--ease-out)]", "focus-visible:ring-2 focus-visible:ring-accent/50", className),
	...props
}));
Input.displayName = "Input";
function Portrait({ survivor, portrait, name, tone, className }) {
	const face = faceById(survivor?.portrait ?? portrait ?? "");
	const frame = useShop((s) => s.frame);
	const label = (survivor?.name ?? name ?? "?").slice(0, 1);
	const img = face.src;
	const bg = tone ?? face.tone ?? (survivor ? occById(survivor.occupation).tone : "#3a3a3c");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-sm bg-surface-2 outline outline-1 -outline-offset-1 outline-fg/10", frame === "tape" && "portrait-tape", frame === "rust" && "portrait-rust", frame === "brass" && "portrait-brass", className),
		style: img ? void 0 : { background: bg },
		children: [img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: asset(img),
			alt: "",
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-full w-full items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-2xl tracking-wide text-fg/80",
				children: label
			})
		}), survivor && !survivor.alive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/70" }) : null]
	});
}
function Meter({ value, max = 100, tone = "hp", label }) {
	const pct = Math.max(0, Math.min(100, value / max * 100));
	const color = {
		hp: "bg-hp",
		hunger: "bg-hunger",
		thirst: "bg-thirst",
		stamina: "bg-stamina",
		accent: "bg-accent"
	}[tone];
	const bar = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", color),
			style: { width: `${pct}%` }
		})
	});
	if (!label) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 w-full overflow-hidden rounded-full bg-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", color),
			style: { width: `${pct}%` }
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-12 shrink-0 text-[10px] tracking-wide text-muted",
			children: label
		}), bar]
	});
}
function ResourceBar({ state }) {
	const tt = useT();
	const days = daysOfFood(state);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-6 gap-1",
		children: [RESOURCES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			title: tt(`res.${r.id}.blurb`),
			className: "rounded-sm bg-surface-2 px-1 py-1.5 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] tracking-wide text-muted",
				children: tt(`res.${r.id}`)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display tabular-nums text-sm text-fg",
				children: state.resources[r.id]
			})]
		}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "sr-only",
			children: tt("hub.foodLow", { n: days })
		})]
	});
}
function Shell({ children }) {
	const paper = useShop((s) => s.paper);
	const founder = useShop((s) => s.founder);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-paper": paper,
		"data-founder": founder ? "1" : "0",
		className: "relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg",
		children
	});
}
function LangSwitch({ className }) {
	useT();
	const cur = getLocale();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex gap-0.5", className),
		children: LOCALES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setLocale(l.id),
			className: cn("h-8 min-w-8 rounded-md px-1.5 text-[11px] tracking-wide", cur === l.id ? "bg-fg text-bg" : "bg-bg/40 text-fg/80"),
			children: l.short
		}, l.id))
	});
}
function TabBar({ screen, onTab }) {
	const tt = useT();
	const tabs = [
		{
			id: "shelter",
			label: tt("tab.shelter"),
			icon: House
		},
		{
			id: "roster",
			label: tt("tab.roster"),
			icon: Users
		},
		{
			id: "build",
			label: tt("tab.build"),
			icon: Hammer
		},
		{
			id: "map",
			label: tt("tab.map"),
			icon: Map$1
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]",
		children: tabs.map((tab) => {
			const on = screen === tab.id;
			const Icon = tab.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onTab(tab.id),
				className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide transition-colors duration-[var(--motion-quick)]", on ? "text-fg" : "text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4",
					strokeWidth: on ? 2.2 : 1.8
				}), tab.label]
			}, tab.id);
		})
	});
}
function TopStatus({ state }) {
	const tt = useT();
	const openHelp = useGame((s) => s.openHelp);
	const loc = locById(state.shelter.locationId);
	const n = living(state).length;
	const ap = apOf(state);
	const max = state.maxAP ?? 6;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-end justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] tracking-[0.18em] text-muted uppercase",
				children: tt("ui.day", { n: state.day })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg leading-tight tracking-wide",
				children: tt(`loc.${loc.id}`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted",
				children: [
					tt(`state.${loc.region}`),
					" · ",
					tt("ui.people", {
						n,
						cap: state.shelter.capacity
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: ap < 1 ? "mt-1 text-[11px] tabular-nums text-hunger" : "mt-1 text-[11px] tabular-nums text-muted",
				children: [
					tt("ap.label"),
					" ",
					ap,
					" / ",
					max
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-right",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center justify-end gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: openHelp,
						className: "flex size-11 items-center justify-center rounded-md text-muted",
						"aria-label": tt("bible.openBtn"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, { className: "justify-end" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted",
					children: tt("ui.wall")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display tabular-nums text-lg",
					children: state.shelter.barricade
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-[9rem] text-[10px] leading-snug text-faint",
					children: tt("hub.wallShort")
				})
			]
		})]
	});
}
function LogList({ state }) {
	if (state.log.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-2",
		children: state.log.slice(0, 8).map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "text-xs leading-relaxed text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mr-2 tabular-nums text-faint",
				children: [e.day, "d"]
			}), e.text]
		}, `${e.day}-${i}`))
	});
}
var OCC_ICON = {
	firefighter: Flame,
	doctor: Stethoscope,
	officer: Shield,
	chef: CookingPot,
	mechanic: Wrench,
	farmer: Sprout,
	veteran: Medal,
	burglar: KeyRound
};
function fmtPool(n) {
	return n > 0 ? `+${n}` : `${n}`;
}
function CreateScreen() {
	const tt = useT();
	const newGame = useGame((s) => s.newGame);
	const openTitle = useGame((s) => s.openTitle);
	const hasSave = useGame((s) => s.hasSave);
	const [mode, setMode] = (0, import_react.useState)("wizard");
	const [step, setStep] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("Dale Hale");
	const [portrait, setPortrait] = (0, import_react.useState)("river");
	const [occupation, setOccupation] = (0, import_react.useState)("firefighter");
	const [traits, setTraits] = (0, import_react.useState)([]);
	const [alloc, setAlloc] = (0, import_react.useState)(emptySkills());
	const [shelterId, setShelterId] = (0, import_react.useState)("farmhouse");
	const occ = occById(occupation);
	const face = faceById(portrait);
	const shelter = START_SHELTERS.find((s) => s.id === shelterId);
	const pickable = pickerTraits();
	const pos = pickable.filter((x) => x.kind === "pos").sort((a, b) => a.points - b.points);
	const neg = pickable.filter((x) => x.kind === "neg").sort((a, b) => b.points - a.points);
	const mods = traits.map(traitById);
	const pool = poolOf(occupation, traits);
	const left = pool - allocTotal(alloc);
	const preview = composeSkills(occ.skills, mods, alloc);
	const granted = occ.granted;
	const picked = traits.filter((id) => !granted.includes(id));
	const applyInput = (input) => {
		setName(input.name);
		setOccupation(input.occupation);
		setPortrait(input.portrait);
		setTraits(withOccupationTraits(input.occupation, input.traits));
		setAlloc({
			...emptySkills(),
			...input.alloc
		});
		setShelterId(input.shelterId);
	};
	const toggleTrait = (id) => {
		const def = traitById(id);
		if (def.kind === "occ") return;
		const on = traits.includes(id);
		let next = on ? traits.filter((x) => x !== id) : [...traits, id];
		if (!on) {
			const blocked = def.excludes ?? [];
			next = next.filter((x) => !blocked.includes(x));
			for (const other of TRAITS) if ((other.excludes ?? []).includes(id)) next = next.filter((x) => x !== other.id);
		}
		setTraits(withOccupationTraits(occupation, next));
		setAlloc(emptySkills());
	};
	const bump = (k, d) => {
		const next = {
			...alloc,
			[k]: Math.max(0, (alloc[k] ?? 0) + d)
		};
		if (allocTotal(next) > pool) return;
		if (preview[k] + d > 10 && d > 0) return;
		setAlloc(next);
	};
	const roll = () => {
		const { input } = randomCreate();
		applyInput(input);
		setMode("result");
	};
	const start = () => {
		newGame({
			name,
			occupation,
			portrait,
			traits,
			alloc,
			shelterId
		});
	};
	const titles = [
		tt("create.face"),
		tt("create.occ"),
		tt("create.traits"),
		tt("create.skills"),
		tt("create.shelter")
	];
	const canNext = (0, import_react.useMemo)(() => {
		if (step === 0) return !!portrait && !!name.trim();
		if (step === 1) return !!occupation;
		if (step === 2) return pool >= 0;
		if (step === 3) return left >= 0;
		return !!shelterId;
	}, [
		step,
		portrait,
		name,
		occupation,
		pool,
		left,
		shelterId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm text-muted",
						onClick: () => {
							if (mode === "result") {
								openTitle();
								return;
							}
							if (step === 0) openTitle();
							else setStep(step - 1);
						},
						children: tt("ui.back")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.2em] text-muted uppercase",
						children: mode === "result" ? tt("create.rolled") : `${titles[step]} · ${step + 1}/5`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm text-fg",
						onClick: roll,
						children: mode === "result" ? tt("create.reroll") : tt("ui.random")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, { className: "mt-1 justify-end" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
			children: [
				mode === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, {
					name,
					portrait,
					occupation,
					traits,
					granted,
					picked,
					preview,
					shelterId,
					pool,
					left
				}) : null,
				mode === "wizard" && step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: tt("create.faceHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								portrait,
								name,
								tone: face.tone,
								className: "h-36 w-28 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1 text-[11px] tracking-wide text-muted",
									children: tt("create.name")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									maxLength: 24
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-2",
							children: FACES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setPortrait(f.id),
								className: cn("overflow-hidden rounded-md border", portrait === f.id ? "border-accent ring-1 ring-accent" : "border-border"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: asset(f.src),
									alt: "",
									className: "aspect-[3/4] h-auto w-full object-cover"
								})
							}, f.id))
						})
					]
				}) : null,
				mode === "wizard" && step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							portrait,
							name,
							tone: face.tone,
							className: "h-16 w-12 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display tracking-wide",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: tt("create.occHint")
							})]
						})]
					}), OCCUPATIONS.map((o) => {
						const Icon = OCC_ICON[o.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setOccupation(o.id);
								setTraits(withOccupationTraits(o.id, traits));
								setAlloc(emptySkills());
							},
							className: cn("flex w-full items-stretch gap-3 rounded-lg border p-2 text-left transition-colors duration-[var(--motion-quick)]", occupation === o.id ? "border-accent bg-surface-2" : "border-border bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex w-12 shrink-0 items-center justify-center rounded-md",
								style: { background: o.tone },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5 text-fg",
									strokeWidth: 1.8
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 py-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display tracking-wide",
												children: tt(`occ.${o.id}`)
											}),
											tt(`occ.${o.id}.en`) !== tt(`occ.${o.id}`) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-faint",
												children: tt(`occ.${o.id}.en`)
											}) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("ml-auto text-[11px] tabular-nums", o.pool < 0 ? "text-hp" : "text-muted"),
												children: tt("create.points", { n: fmtPool(o.pool) })
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: tt(`occ.${o.id}.blurb`)
									}),
									occupation === o.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] leading-relaxed text-faint",
										children: tt(`occ.${o.id}.desc`)
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-faint",
										children: [
											tt("create.innate"),
											" ",
											SKILL_KEYS.filter((k) => o.skills[k] > 0).map((k) => `${tt(`skill.${k}`)} ${o.skills[k]}`).join(" · ") || tt("create.none")
										]
									}),
									o.granted.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-[11px] text-stamina",
										children: [
											tt("create.free"),
											" ",
											o.granted.map((id) => tt(`trait.${id}`)).join(" · ")
										]
									}) : null
								]
							})]
						}, o.id);
					})]
				}) : null,
				mode === "wizard" && step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								portrait,
								name,
								tone: face.tone,
								className: "size-16 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display tracking-wide",
									children: name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted",
									children: [
										tt(`occ.${occupation}`),
										" · ",
										tt(`occ.${occupation}.en`)
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between rounded-md border border-border bg-surface px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: tt("create.poolHint")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("font-display tabular-nums text-lg", pool < 0 ? "text-hp" : "text-fg"),
								children: pool
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: tt(`occ.${occupation}.desc`)
						}),
						granted.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("create.occTrait")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: granted.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitBtn, {
								t: traitById(id),
								on: true,
								locked: true
							}, id))
						})] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("create.pos")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: pos.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitBtn, {
								t: tr,
								on: traits.includes(tr.id),
								onClick: () => toggleTrait(tr.id)
							}, tr.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("create.neg")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: neg.map((tr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TraitBtn, {
								t: tr,
								on: traits.includes(tr.id),
								onClick: () => toggleTrait(tr.id)
							}, tr.id))
						})] }),
						pool < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-hp",
							children: tt("create.needPoints")
						}) : null
					]
				}) : null,
				mode === "wizard" && step === 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: tt("create.skillHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between rounded-md border border-border bg-surface px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: tt("create.alloc")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display tabular-nums text-lg",
								children: left
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: SKILL_KEYS.map((k) => {
								const innate = occ.skills[k];
								const extra = alloc[k] ?? 0;
								const total = preview[k];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded-md border border-border bg-surface p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-sm",
												children: [
													tt(`skill.${k}`),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[11px] text-muted",
														children: tt("skill.lv", {
															n: total,
															rank: tt(`skill.rank.${total}`)
														})
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] leading-relaxed text-muted",
												children: tt(`skill.${k}.lv.${total}`)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] leading-relaxed text-faint",
												children: skillBoostLine(k, total)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-faint",
												children: [
													tt("create.innateN", { n: innate }),
													extra ? tt("create.plusAlloc", { n: extra }) : "",
													tt("create.nextXp", { n: xpToNext(total) }),
													" · ",
													tt("skill.learn", {
														n: total,
														mul: startXpMul(total).toFixed(2)
													})
												]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "size-11 rounded-md border border-border bg-surface-2 text-lg",
													onClick: () => bump(k, -1),
													disabled: extra <= 0,
													children: "−"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "w-6 text-center font-display tabular-nums text-lg",
													children: total
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "size-11 rounded-md border border-border bg-surface-2 text-lg",
													onClick: () => bump(k, 1),
													disabled: left <= 0 || total >= 10,
													children: "+"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-0.5",
										children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1.5 flex-1 rounded-full", i < total ? "bg-accent" : "bg-border") }, i))
									})]
								}, k);
							})
						})
					]
				}) : null,
				mode === "wizard" && step === 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: tt("create.shelterHint")
						}),
						START_SHELTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShelterId(s.id),
							className: cn("w-full overflow-hidden rounded-lg border text-left", shelterId === s.id ? "border-accent" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-28",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: asset(s.image),
										alt: "",
										className: "h-full w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-2 left-3 right-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display tracking-wide",
											children: tt(`sh.${s.id}`)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted",
											children: [tt(`sh.${s.id}.en`) !== tt(`sh.${s.id}`) ? `${tt(`sh.${s.id}.en`)} · ` : "", tt("create.cap", { n: s.capacity })]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 py-2 text-xs leading-relaxed text-muted",
								children: tt(`sh.${s.id}.desc`)
							})]
						}, s.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-md border border-border bg-surface p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								portrait,
								name,
								tone: face.tone,
								className: "h-14 w-11 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-faint",
								children: [
									name,
									" · ",
									tt(`occ.${occ.id}`),
									" · ",
									traits.map((id) => tt(`trait.${id}`)).join(" / ") || tt("create.noTrait"),
									" · ",
									tt(`sh.${shelter.id}`)
								]
							})]
						}),
						hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-hunger",
							children: tt("create.overwrite")
						}) : null
					]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
			children: mode === "result" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					className: "w-full",
					size: "lg",
					onClick: () => {
						setMode("wizard");
						setStep(0);
					},
					children: tt("create.tweak")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					onClick: start,
					children: tt("ui.enter")
				})]
			}) : step < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				disabled: !canNext,
				onClick: () => setStep(step + 1),
				children: tt("ui.next")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				onClick: start,
				children: tt("ui.enter")
			})
		})
	] });
}
function ResultCard({ name, portrait, occupation, traits, granted, picked, preview, shelterId, pool, left }) {
	const tt = useT();
	const occ = occById(occupation);
	const face = faceById(portrait);
	const shelter = START_SHELTERS.find((s) => s.id === shelterId);
	const pos = picked.filter((id) => traitById(id).kind === "pos");
	const neg = picked.filter((id) => traitById(id).kind === "neg");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ash-prose space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
					portrait,
					name,
					tone: face.tone,
					className: "h-44 w-32 shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl tracking-wide",
							children: name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-sm text-muted",
							children: [tt(`occ.${occupation}`), tt(`occ.${occupation}.en`) !== tt(`occ.${occupation}`) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-faint",
								children: [" · ", tt(`occ.${occupation}.en`)]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs leading-relaxed text-muted",
							children: tt(`occ.${occupation}.desc`)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2 text-[11px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-sm border border-border px-2 py-1 tabular-nums", occ.pool < 0 ? "text-hp" : "text-muted"),
									children: tt("create.points", { n: fmtPool(occ.pool) })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-sm border border-border px-2 py-1 text-muted",
									children: tt("create.leftOver", { n: left })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-sm border border-border px-2 py-1 text-muted",
									children: tt(`sh.${shelter.id}`)
								})
							]
						})
					]
				})]
			}),
			granted.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("create.occTrait")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: granted.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-sm border border-stamina/40 bg-surface px-2 py-1 text-xs text-stamina",
					children: tt(`trait.${id}`)
				}, id))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("create.pos")
			}), pos.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: pos.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tt(`trait.${id}`) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] tabular-nums text-muted",
						children: traitById(id).points
					})]
				}, id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: tt("create.noTrait")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("create.neg")
			}), neg.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: neg.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-baseline justify-between gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tt(`trait.${id}`) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] tabular-nums text-stamina",
						children: ["+", traitById(id).points]
					})]
				}, id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-faint",
				children: tt("create.noTrait")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("create.skills")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1.5",
				children: SKILL_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-12 shrink-0 text-[11px] text-muted",
							children: tt(`skill.${k}`)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-1 gap-0.5",
							children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1.5 flex-1 rounded-full", i < preview[k] ? "bg-accent" : "bg-border") }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-16 text-right font-display text-xs tabular-nums",
							children: [
								preview[k],
								" ",
								tt(`skill.rank.${preview[k]}`)
							]
						})
					]
				}, k))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-md border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-24",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: asset(shelter.image),
							alt: "",
							className: "h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-2 left-3 text-sm",
							children: tt(`sh.${shelter.id}`)
						})
					]
				})
			}),
			pool < 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-hp",
				children: tt("create.needPoints")
			}) : null
		]
	});
}
function TraitBtn({ t: trait, on, onClick, locked }) {
	const tt = useT();
	const sign = trait.points > 0 ? `+${trait.points}` : trait.points === 0 ? tt("create.freeShort") : `${trait.points}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: locked ? void 0 : onClick,
		disabled: locked,
		className: cn("rounded-md border px-3 py-3 text-left", locked ? "border-stamina/40 bg-surface-2" : on ? "border-accent bg-surface-2" : "border-border bg-surface"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm",
				children: tt(`trait.${trait.id}`)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("text-[11px] tabular-nums", trait.points > 0 ? "text-stamina" : "text-muted"),
				children: sign
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] text-muted",
			children: tt(`trait.${trait.id}.blurb`)
		})]
	});
}
function ItemLine({ item, onClick, action }) {
	const def = gearById(item.defId);
	if (!def) return null;
	const icon = gearIcon(item.defId);
	const bits = gearStatBits(def);
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: icon,
			alt: "",
			className: "size-10 shrink-0 object-contain",
			style: { filter: visualOf(item.defId).filter }
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 shrink-0 rounded-sm bg-surface-2" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("truncate text-sm", RARITY_CLASS[def.rarity]),
				children: itemName(item)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs leading-snug text-faint",
				children: [
					item.cond,
					"%",
					bits.length ? ` · ${bits.join(" · ")}` : ""
				]
			})]
		}),
		action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "shrink-0 text-xs text-muted",
			children: action
		}) : null
	] });
	const cls = "flex w-full items-center gap-2 rounded-md border border-border bg-surface-2 px-2 py-2 text-left";
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn(cls, "min-h-11"),
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cls,
		children: inner
	});
}
function GearDoll({ state, s }) {
	const tt = useT();
	const equip = useGame((x) => x.equip);
	const unequip = useGame((x) => x.unequip);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
					survivor: s,
					className: "h-28 w-24"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1",
				children: EQUIP_SLOTS.map((slot) => {
					const worn = s.worn?.[slot];
					const pool = (state.stash ?? []).filter((it) => gearById(it.defId)?.slot === slot);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: `eq-${s.id}-${slot}`,
							className: "text-xs text-muted",
							children: tt(`gear.slot.${slot}`)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: `eq-${s.id}-${slot}`,
							value: worn?.uid ?? "",
							onChange: (e) => {
								const uid = e.target.value;
								if (!uid) unequip(s.id, slot);
								else equip(s.id, uid);
							},
							className: "h-11 min-w-0 rounded-md border border-border bg-surface-2 px-2 text-sm text-fg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: tt("gear.none")
								}),
								worn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: worn.uid,
									children: [
										itemName(worn),
										" · ",
										worn.cond,
										"%",
										gearById(worn.defId) ? ` · ${gearStatBits(gearById(worn.defId)).slice(0, 2).join(" ")}` : ""
									]
								}) : null,
								pool.map((it) => {
									const d = gearById(it.defId);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: it.uid,
										children: [
											itemName(it),
											" · ",
											it.cond,
											"%",
											d ? ` · ${gearStatBits(d).slice(0, 2).join(" ")}` : ""
										]
									}, it.uid);
								})
							]
						})]
					}, slot);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] leading-relaxed text-faint",
				children: tt("gear.legend")
			})
		]
	});
}
function StashPanel({ state }) {
	const tt = useT();
	const discard = useGame((x) => x.discard);
	const stash = state.stash ?? [];
	if (!stash.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: tt("gear.stashEmpty")
	});
	const grouped = EQUIP_SLOTS.map((slot) => ({
		slot,
		items: stash.filter((it) => gearById(it.defId)?.slot === slot)
	})).filter((g) => g.items.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs leading-relaxed text-faint",
			children: tt("gear.hint")
		}), grouped.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 text-xs tracking-wide text-muted uppercase",
			children: [
				tt(`gear.slot.${g.slot}`),
				" · ",
				g.items.length
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1",
			children: g.items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-stretch gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemLine, { item: it })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => discard(it.uid),
					title: tt("gear.discardHint"),
					className: "min-h-11 shrink-0 rounded-md border border-border px-2 text-xs text-muted",
					children: tt("gear.discard")
				})]
			}, it.uid))
		})] }, g.slot))]
	});
}
function FindsHint({ finds }) {
	const tt = useT();
	if (!finds.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-xs text-hunger",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tt("gear.bag", { n: finds.length }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "flex gap-1",
			children: finds.slice(0, 4).map((it) => {
				const icon = gearIcon(it.defId);
				return icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: icon,
					alt: "",
					className: "size-6 object-contain"
				}, it.uid) : null;
			})
		})]
	});
}
function pips(level) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-0.5",
		children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1.5 flex-1 rounded-full", i < level ? "bg-accent" : "bg-border") }, i))
	});
}
function SkillRow({ skill, level, xp, base, traits, open, onToggle, recent }) {
	const tt = useT();
	const maxed = level >= 10;
	const need = xpToNext(level);
	const have = xp ?? 0;
	const pct = maxed ? 100 : Math.min(100, have / need * 100);
	const rank = tt(`skill.rank.${level}`);
	const flavor = tt(`skill.${skill}.lv.${level}`);
	const bits = skillBoostLine(skill, level);
	const nextLv = Math.min(10, level + 1);
	const mul = startXpMul(base ?? 0) * (traits?.includes("fastlearner") ? 1.35 : traits?.includes("slowlearner") ? .65 : 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md border px-2.5 py-2", recent ? "border-stamina/60 bg-surface-2" : "border-border bg-surface"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onToggle,
				className: "flex w-full items-baseline gap-2 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0 flex-1 text-sm",
					children: [
						tt(`skill.${skill}`),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted",
							children: tt("skill.lv", {
								n: level,
								rank
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-[11px] tabular-nums text-faint",
					children: maxed ? tt("skill.maxed") : tt("skill.xp", {
						have: Math.floor(have),
						need
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 h-1 overflow-hidden rounded-full bg-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-accent transition-[width] duration-200 ease-out",
					style: { width: `${pct}%` }
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-1.5",
				children: [
					pips(level),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-fg",
						children: flavor
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-muted",
						children: bits
					}),
					maxed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] leading-relaxed text-faint",
						children: tt("skill.next", {
							n: nextLv,
							rank: tt(`skill.rank.${nextLv}`),
							boost: `${tt(`skill.${skill}.lv.${nextLv}`)} ${skillBoostLine(skill, nextLv)}`
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-faint",
						children: [tt(`skill.how.${skill}`), base != null ? ` · ${tt("skill.learn", {
							n: base,
							mul: mul.toFixed(2)
						})}` : null]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 line-clamp-2 text-[11px] leading-relaxed text-faint",
				children: bits
			})
		]
	});
}
function SkillList({ levels, xp, base, traits, last, defaultOpen }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen ? "combat" : null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1.5",
		children: SKILL_KEYS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillRow, {
			skill: k,
			level: levels[k],
			xp: xp?.[k],
			base: base?.[k],
			traits,
			open: open === k,
			onToggle: () => setOpen((cur) => cur === k ? null : k),
			recent: last?.skill === k
		}) }, k))
	});
}
function SkillNotices({ notices, onDismiss }) {
	const tt = useT();
	if (!notices.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 rounded-md border border-stamina/50 bg-surface px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[11px] tracking-[0.16em] text-stamina uppercase",
				children: tt("notices.title")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 text-[11px] text-muted",
				onClick: onDismiss,
				children: tt("notices.dismiss")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-1 space-y-1.5",
			children: notices.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "text-sm leading-relaxed",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-fg",
					children: tt("notices.skill", {
						name: n.name,
						skill: t(`skill.${n.skill}`),
						n: n.level,
						rank: t(`skill.rank.${n.level}`)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-0.5 block text-[11px] text-muted",
					children: [
						t(`skill.${n.skill}.lv.${n.level}`),
						" ",
						skillBoostLine(n.skill, n.level)
					]
				})]
			}, `${n.name}-${n.skill}-${n.level}-${i}`))
		})]
	});
}
function Hub({ state, children }) {
	const setScreen = useGame((s) => s.setScreen);
	const tt = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopStatus, { state }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceBar, { state }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] leading-relaxed text-faint",
				children: tt("hub.resHint")
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {
			screen: state.screen,
			onTab: setScreen
		})
	] });
}
function ShelterScreen({ state }) {
	const tt = useT();
	const sleep = useGame((s) => s.sleep);
	const setScreen = useGame((s) => s.setScreen);
	const clearNotices = useGame((s) => s.clearNotices);
	const parkTitle = useGame((s) => s.parkTitle);
	const openHelp = useGame((s) => s.openHelp);
	const openDispatch = useGame((s) => s.openDispatch);
	const loc = locById(state.shelter.locationId);
	const people = living(state);
	const days = daysOfFood(state);
	const infected = people.filter((s) => s.infected).length;
	const crushed = people.filter((s) => !canMission(s));
	const ap = apOf(state);
	const briefing = ap < 1 ? tt("hub.apGone") : crushed.length === people.length ? tt("hub.noGo") : infected ? tt("hub.bitten", {
		n: infected,
		med: state.resources.medicine
	}) : days <= 2 ? tt("hub.foodLow", { n: days }) : people.length === 1 ? tt("hub.alone") : tt("hub.alive", {
		n: people.length,
		wall: state.shelter.barricade
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hub, {
		state,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4 overflow-hidden rounded-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: asset(loc.image),
						alt: "",
						className: "h-40 w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 left-3 right-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] tracking-[0.16em] text-muted uppercase",
							children: loc.nameEn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed",
							children: briefing
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-xs leading-relaxed text-muted",
				children: state.day >= 20 ? tt("hub.aimLate", { loc: tLoc("chicago") }) : tt("hub.aim")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillNotices, {
				notices: state.notices ?? [],
				onDismiss: clearNotices
			}),
			crushed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-3 rounded-md border border-hp/40 bg-surface px-3 py-2 text-xs text-hp",
				children: [
					crushed.map((s) => s.name).join("、"),
					" ",
					tt("hub.moodLow"),
					crushed.length === people.length ? tt("hub.moodNoMission") : tt("hub.moodNoSquad")
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						onClick: () => setScreen("map"),
						disabled: ap < 1 || crushed.length === people.length,
						children: ap < 1 ? tt("ap.noneShort") : tt("ui.goMission")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "secondary",
						className: "w-full",
						onClick: sleep,
						children: tt("ui.overnight")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "secondary",
						className: "col-span-2 w-full",
						onClick: openDispatch,
						children: tt("dispatch.open")
					})
				]
			}),
			(state.dispatches ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-4 space-y-2",
				children: state.dispatches.map((p) => {
					const names = p.memberIds.map((id) => state.survivors.find((s) => s.id === id)?.name).filter(Boolean).join(tt("ui.comma"));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-border bg-surface px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm",
							children: tt("dispatch.out", {
								names,
								task: tt(`dispatch.task.${p.task}`)
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted",
							children: p.delayed || p.returnDay > state.day ? tt("dispatch.stillOut") : tt("dispatch.backTonight")
						})]
					}, p.id);
				})
			}) : people.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-[11px] leading-relaxed text-faint",
				children: tt("dispatch.solo")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-4 text-[11px] leading-relaxed text-faint",
				children: tt("dispatch.openHint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: openHelp,
					className: "text-left text-[11px] tracking-[0.16em] text-muted uppercase",
					children: tt("bible.openBtn")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: parkTitle,
					className: "text-left text-[11px] tracking-[0.16em] text-muted uppercase",
					children: tt("ui.title")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("hub.plan")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShelterPlan, { state }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 mt-4 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("hub.jobs")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-5 space-y-2",
				children: people.map((s) => {
					const mood = moodLabel(s.morale);
					const out = isAway(state, s.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 rounded-md bg-surface px-2 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								survivor: s,
								className: cn("size-10", (!canWork(s) || out) && "grayscale")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-sm",
									children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-[11px] text-faint",
										children: tt(`occ.${s.occupation}`)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted",
									children: [
										out ? tt("dispatch.away") : tt(`job.${s.job}`),
										" · ",
										mood.name,
										" ",
										s.morale
									]
								})]
							}),
							s.infected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-hp",
								children: tt("ui.infected")
							}) : null
						]
					}, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("hub.log")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogList, { state })
		]
	});
}
var PLAN = [
	{
		id: "beds",
		name: "寢室",
		jobs: ["rest"]
	},
	{
		id: "kitchen",
		name: "廚房",
		jobs: ["cook"]
	},
	{
		id: "garden",
		name: "菜園",
		jobs: ["farm"]
	},
	{
		id: "workshop",
		name: "工坊",
		jobs: ["repair", "craft"]
	},
	{
		id: "infirmary",
		name: "醫務",
		jobs: ["tend"]
	},
	{
		id: "radio",
		name: "電台",
		jobs: ["radio"]
	},
	{
		id: "watch",
		name: "哨塔",
		jobs: ["guard"]
	},
	{
		id: "water",
		name: "水塔",
		jobs: []
	}
];
function ShelterPlan({ state }) {
	const setScreen = useGame((s) => s.setScreen);
	const people = living(state);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 grid grid-cols-4 gap-1.5",
		children: PLAN.map((room) => {
			const lv = state.shelter.facilities[room.id];
			const here = people.filter((p) => !isAway(state, p.id) && (room.jobs.includes(p.job) || room.id === "beds" && p.job === "rest"));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setScreen(lv ? "roster" : "build"),
				className: cn("relative aspect-square overflow-hidden rounded-md border p-1 text-left", lv ? "border-border bg-surface-2" : "border-border/60 bg-surface opacity-70"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] tracking-wide text-muted",
						children: t(`fac.${room.id}`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[9px] text-faint",
						children: lv ? t("hub.lv", { n: lv }) : t("hub.unbuilt")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-1 left-1 flex -space-x-1",
						children: here.slice(0, 3).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							survivor: p,
							className: "size-6"
						}, p.id))
					})
				]
			}, room.id);
		})
	});
}
function RosterScreen({ state }) {
	const tt = useT();
	const job = useGame((s) => s.job);
	const kick = useGame((s) => s.kick);
	const openDispatch = useGame((s) => s.openDispatch);
	const people = state.survivors.filter((s) => s.alive);
	const dead = state.survivors.filter((s) => !s.alive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hub, {
		state,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: tt("roster.hint")
			}),
			people.length >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "mb-3 w-full",
				onClick: openDispatch,
				children: tt("dispatch.open")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-[11px] text-faint",
				children: tt("dispatch.solo")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: people.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurvivorCard, {
					state,
					s,
					onJob: (j) => job(s.id, j),
					onKick: () => kick(s.id)
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mb-2 mt-5 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: [
					tt("gear.stash"),
					" · ",
					state.stash?.length ?? 0
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StashPanel, { state }),
			dead.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
					children: tt("roster.gone")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: dead.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-xs text-faint",
						children: [
							s.name,
							" · ",
							s.death
						]
					}, s.id))
				})]
			}) : null
		]
	});
}
function SurvivorCard({ state, s, onJob, onKick }) {
	const tt = useT();
	const mood = moodLabel(s.morale);
	const others = living(state).filter((o) => o.id !== s.id);
	const out = isAway(state, s.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display tracking-wide",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-muted",
					children: [
						mood.name,
						" ",
						s.morale
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted",
				children: [
					tt(`occ.${s.occupation}`),
					" · ",
					s.traits.map((tr) => tt(`trait.${tr}`)).join(" / ")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						value: s.hp,
						max: s.maxHp,
						tone: "hp",
						label: tt("meter.hp")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						value: s.hunger,
						tone: "hunger",
						label: tt("meter.hunger")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						value: s.thirst,
						tone: "thirst",
						label: tt("meter.thirst")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						value: s.morale,
						tone: s.morale < 30 ? "hp" : s.morale < 50 ? "hunger" : "stamina",
						label: tt("meter.morale")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GearDoll, {
				state,
				s
			}),
			s.infected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-hp",
				children: tt("roster.wound")
			}) : null,
			!canWork(s) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-hp",
				children: tt("roster.noWork")
			}) : null,
			out ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-hunger",
				children: tt("dispatch.away")
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillList, {
					levels: s.skills,
					xp: s.skillXp,
					base: s.skillBase,
					traits: s.traits,
					last: s.lastSkillUp
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] leading-relaxed text-faint",
				children: tt("roster.skills")
			}),
			others.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1",
				children: others.map((o) => {
					const rel = relationOf(bondOf(state, s.id, o.id));
					const n = bondOf(state, s.id, o.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between text-[11px] text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [o.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-faint",
							children: rel.name
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: n
						})]
					}, o.id);
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: `job-${s.id}`,
						children: tt("roster.job")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: `job-${s.id}`,
						value: s.job,
						onChange: (e) => onJob(e.target.value),
						disabled: out,
						className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-3 text-sm text-fg disabled:opacity-50",
						children: JOBS.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: j.id,
							disabled: j.id !== "rest" && !canWork(s),
							children: [tt(`job.${j.id}`), j.id !== "rest" && !canWork(s) ? tt("roster.moodNeed") : ""]
						}, j.id))
					}),
					s.stance !== "leader" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onKick,
						children: tt("roster.kick")
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[11px] leading-relaxed text-muted",
				children: tt(`job.${s.job}.blurb`)
			})
		]
	});
}
function BuildScreen({ state }) {
	const tt = useT();
	const upgrade = useGame((s) => s.upgrade);
	const repair = useGame((s) => s.repairWall);
	const ap = apOf(state);
	const canRepair = ap >= AP_COST.repairWall && state.resources.materials >= 2;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hub, {
		state,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: tt("build.hint")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 rounded-md border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-muted",
				children: tt("hub.wallNote", { n: state.shelter.barricade })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 rounded-lg border border-border bg-surface p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display tracking-wide",
						children: tt("build.repairWall")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: tt("build.repairWallHint")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: canRepair ? "default" : "secondary",
						disabled: !canRepair,
						onClick: repair,
						children: ap < AP_COST.repairWall ? tt("build.apNeed") : state.resources.materials < 2 ? tt("build.lack", {
							res: tt("res.materials"),
							n: 2 - state.resources.materials
						}) : tt("build.repairWallGo")
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: FACILITIES.map((f) => {
					const lv = state.shelter.facilities[f.id];
					const maxed = lv >= f.max;
					const mul = lv + 1;
					const items = [{
						id: "materials",
						n: f.cost.materials * mul
					}];
					for (const [k, v] of Object.entries(f.cost.extra ?? {})) items.push({
						id: k,
						n: v * mul
					});
					const lack = items.find((it) => state.resources[it.id] < it.n);
					const apShort = ap < AP_COST.build;
					const can = !maxed && !lack && !apShort;
					const costText = items.map((it) => tt("build.cost", {
						res: tt(`res.${it.id}`),
						n: it.n
					})).join(" · ");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-display tracking-wide",
									children: [tt(`fac.${f.id}`), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-2 text-xs text-muted",
										children: [
											lv,
											"/",
											f.max
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: tt(`fac.${f.id}.blurb`)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-faint",
									children: tt(`fac.${f.id}.effect`)
								}),
								!maxed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] text-muted",
									children: [
										tt("build.need"),
										" ",
										costText,
										" · ",
										tt("build.apCost", { n: AP_COST.build })
									]
								}) : null
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: can ? "default" : "secondary",
								disabled: !can,
								onClick: () => upgrade(f.id),
								children: maxed ? tt("build.max") : apShort ? tt("build.apNeed") : lack ? tt("build.lack", {
									res: tt(`res.${lack.id}`),
									n: lack.n - state.resources[lack.id]
								}) : costText
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-1",
							children: Array.from({ length: f.max }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1 flex-1 rounded-full", i < lv ? "bg-accent" : "bg-border") }, i))
						})]
					}, f.id);
				})
			})
		]
	});
}
var HOME = "#c4bdb3";
var CLEAR = "#6a8a5a";
var DANGER = "#9a3b32";
function UsMap({ state, visible, selected, onSelect }) {
	useT();
	const locale = getLocale();
	const elRef = (0, import_react.useRef)(null);
	const mapRef = (0, import_react.useRef)(null);
	const layerRef = (0, import_react.useRef)(null);
	const fitted = (0, import_react.useRef)(false);
	const onSelectRef = (0, import_react.useRef)(onSelect);
	onSelectRef.current = onSelect;
	const visibleRef = (0, import_react.useRef)(visible);
	visibleRef.current = visible;
	const stateRef = (0, import_react.useRef)(state);
	stateRef.current = state;
	const selectedRef = (0, import_react.useRef)(selected);
	selectedRef.current = selected;
	(0, import_react.useEffect)(() => {
		let dead = false;
		if (!elRef.current) return void 0;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (dead || !elRef.current) return;
			const host = elRef.current;
			if ("_leaflet_id" in host) try {
				host._leaflet_id = void 0;
			} catch {}
			const map = L.map(host, {
				center: [38.15, -86.2],
				zoom: 7,
				minZoom: 4,
				maxZoom: 12,
				zoomControl: false,
				attributionControl: true,
				scrollWheelZoom: true
			});
			map.setMaxBounds(L.latLngBounds(L.latLng(24.2, -125.2), L.latLng(49.6, -66.4)));
			L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
				attribution: "&copy; OSM &copy; CARTO",
				subdomains: "abcd",
				maxZoom: 12
			}).addTo(map);
			L.control.zoom({ position: "topright" }).addTo(map);
			const layer = L.layerGroup().addTo(map);
			mapRef.current = map;
			layerRef.current = layer;
			draw(L);
			map.whenReady(() => {
				map.invalidateSize();
				draw(L);
			});
		})();
		return () => {
			dead = true;
			mapRef.current?.remove();
			mapRef.current = null;
			layerRef.current = null;
		};
	}, []);
	function draw(L) {
		const map = mapRef.current;
		const layer = layerRef.current;
		const st = stateRef.current;
		const vis = visibleRef.current;
		const sel = selectedRef.current;
		if (!map || !layer) return;
		layer.clearLayers();
		const pts = [];
		for (const loc of vis) {
			const ls = st.locations[loc.id];
			const home = loc.id === st.shelter.locationId;
			const color = home ? HOME : ls.zombies > 0 ? DANGER : CLEAR;
			const marker = L.circleMarker([loc.lat, loc.lng], {
				radius: sel === loc.id ? 9 : home ? 8 : 6,
				color: sel === loc.id ? HOME : color,
				weight: sel === loc.id ? 2 : 1,
				fillColor: color,
				fillOpacity: .92
			});
			const status = home ? t("map.home") : ls.zombies > 0 ? t("map.zombies", { n: ls.zombies }) : t("map.cleared");
			marker.bindTooltip(`${tLoc(loc.id)}<br>${t(`state.${loc.region}`)} · ${status}`, {
				direction: "top",
				opacity: .92,
				className: "ash-map-tip"
			});
			if (!home) marker.on("click", () => onSelectRef.current(loc.id));
			marker.addTo(layer);
			pts.push([loc.lat, loc.lng]);
		}
		if (pts.length >= 2 && !fitted.current) {
			map.fitBounds(L.latLngBounds(pts).pad(.4), {
				maxZoom: 8,
				animate: false
			});
			fitted.current = true;
		}
	}
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const L = await import("../_libs/leaflet.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
			if (cancelled) return;
			draw(L);
			if (selected) {
				const loc = visible.find((l) => l.id === selected);
				if (loc && mapRef.current) mapRef.current.flyTo([loc.lat, loc.lng], Math.max(mapRef.current.getZoom(), 8), { duration: .4 });
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		visible,
		selected,
		state.shelter.locationId,
		state.locations,
		locale
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-[min(52dvh,420px)] overflow-hidden rounded-lg border border-border bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: elRef,
				className: "absolute inset-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute left-2 top-2 z-[400] rounded-sm bg-bg/75 px-2 py-1 text-[10px] tracking-wide text-muted",
				children: t("map.live")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute bottom-8 left-2 z-[400] flex gap-2 text-[10px] text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: "inline-block size-2 rounded-full",
							style: { background: HOME }
						}), t("map.homeShort")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: "inline-block size-2 rounded-full",
							style: { background: DANGER }
						}), t("map.open")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {
							className: "inline-block size-2 rounded-full",
							style: { background: CLEAR }
						}), t("map.cleared")]
					})
				]
			})
		]
	});
}
function MapScreen({ state }) {
	const tt = useT();
	const setScreen = useGame((s) => s.setScreen);
	const setMapTarget = useGame((s) => s.setMapTarget);
	const selected = state.mapTarget;
	const locs = LOCATIONS.filter((l) => isDiscovered(state, l.id));
	const blocked = !living(state).filter((s) => !isAway(state, s.id)).some(canMission);
	const dry = apOf(state) < 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopStatus, { state }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceBar, { state })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-hidden px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs leading-relaxed text-muted",
					children: tt("map.hint")
				}),
				blocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 rounded-md border border-hp/40 bg-surface px-3 py-2 text-xs text-hp",
					children: tt("map.block")
				}) : null,
				dry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 rounded-md border border-hunger/40 bg-surface px-3 py-2 text-xs text-hunger",
					children: tt("hub.apGone")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsMap, {
					state,
					visible: locs,
					selected,
					onSelect: (id) => {
						if (canTravel(state, id).ok) setMapTarget(id);
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 max-h-40 space-y-2 overflow-y-auto pb-2",
					children: locs.map((loc) => {
						const ls = state.locations[loc.id];
						const home = loc.id === state.shelter.locationId;
						const travel = canTravel(state, loc.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: home || !travel.ok,
							onClick: () => setMapTarget(loc.id),
							className: cn("flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm disabled:opacity-50", selected === loc.id ? "border-accent bg-surface-2" : "border-border bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [tLoc(loc.id), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-[11px] text-muted",
								children: [
									sizeLabel(loc.size),
									" · ",
									tt(`state.${loc.region}`)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] tabular-nums text-muted",
								children: home ? tt("map.home") : !travel.ok ? travel.reason : ls.zombies > 0 ? tt("map.zombies", { n: ls.zombies }) : tt("map.cleared")
							})]
						}, `list-${loc.id}`);
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBar, {
			screen: state.screen,
			onTab: setScreen
		})
	] });
}
function SquadScreen({ state }) {
	const tt = useT();
	const setScreen = useGame((s) => s.setScreen);
	const setSquad = useGame((s) => s.setSquad);
	const goMission = useGame((s) => s.goMission);
	const target = state.mapTarget ? locById(state.mapTarget) : null;
	const people = living(state);
	const pick = state.squadPick;
	if (!target) return null;
	const ls = state.locations[target.id];
	const toggle = (id) => {
		const s = people.find((p) => p.id === id);
		if (!s) return;
		if (!canMission(s) && !pick.includes(id)) return;
		if (isAway(state, id) && !pick.includes(id)) return;
		if (pick.includes(id)) {
			const next = pick.filter((x) => x !== id);
			if (next.length) setSquad(next);
			return;
		}
		if (pick.length >= 3) return;
		setSquad([...pick, id]);
	};
	const ablePick = pick.filter((id) => {
		const s = people.find((p) => p.id === id);
		return s && canMission(s);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 text-sm text-muted",
					onClick: () => setScreen("map"),
					children: tt("ui.back")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] tracking-[0.16em] text-muted uppercase",
					children: tt("squad.title", { n: pick.length })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-10" })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4 overflow-hidden rounded-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: asset(target.image),
							alt: "",
							className: "h-36 w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 left-3 right-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-xl tracking-wide",
								children: tLoc(target.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									tt(`state.${target.region}`),
									" · ",
									sizeLabel(target.size),
									" · ",
									tt("map.zombies", { n: ls.zombies }),
									" ·",
									" ",
									target.fuel ? tt("squad.fuel", { n: target.fuel }) : tt("squad.walk")
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm leading-relaxed text-muted",
					children: tt(`loc.${target.id}.desc`)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs text-faint",
					children: tt("squad.hint")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: people.map((s) => {
						const on = pick.includes(s.id);
						const mood = moodLabel(s.morale);
						const locked = !canMission(s) || isAway(state, s.id);
						const relBits = pick.filter((id) => id !== s.id).map((id) => {
							const o = people.find((p) => p.id === id);
							if (!o) return null;
							const rel = relationOf(bondOf(state, s.id, o.id));
							return `${o.name}·${rel.name}`;
						}).filter(Boolean);
						const bonus = squadRelationBonus(state, s, pick);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggle(s.id),
							disabled: locked && !on,
							className: cn("flex w-full items-center gap-3 rounded-md border p-2 text-left disabled:opacity-45", on ? "border-accent bg-surface-2" : "border-border bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								survivor: s,
								className: cn("size-12", locked && "grayscale")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm",
										children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ml-2 text-[11px] text-faint",
											children: tt(`occ.${s.occupation}`)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted",
										children: [
											tt("skill.combat"),
											" ",
											s.skills.combat,
											" ",
											tt(`skill.rank.${s.skills.combat}`),
											bonus.combat ? `+${bonus.combat}` : "",
											" · ",
											tt("skill.stealth"),
											" ",
											s.skills.stealth,
											" ",
											tt(`skill.rank.${s.skills.stealth}`),
											" · ",
											tt(`wep.${s.weapon}`),
											" ·",
											" ",
											mood.name,
											" ",
											s.morale
										]
									}),
									relBits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-faint",
										children: relBits.join("  ")
									}) : null,
									locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-hp",
										children: isAway(state, s.id) ? tt("dispatch.away") : tt("squad.noGo")
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
											value: s.morale,
											tone: s.morale < 30 ? "hp" : s.morale < 50 ? "hunger" : "stamina"
										})
									})
								]
							})]
						}) }, s.id);
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				disabled: ablePick.length === 0 || apOf(state) < 1,
				onClick: goMission,
				children: apOf(state) < 1 ? tt("ap.noneShort") : tt("squad.enter")
			})
		})
	] });
}
function MissionScreen({ state }) {
	const tt = useT();
	const choose = useGame((s) => s.choose);
	const m = state.mission;
	if (!m) return null;
	const loc = locById(m.locationId);
	const ls = state.locations[m.locationId];
	const squad = m.squadIds.map((id) => state.survivors.find((s) => s.id === id)).filter(Boolean);
	const bagN = Object.values(m.bag).reduce((a, b) => a + b, 0);
	const ap = apOf(state);
	const max = state.maxAP ?? 6;
	const band = threatBand(ls.noiseToday ?? m.noise);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] tracking-[0.18em] text-muted uppercase",
					children: [
						tt(`state.${loc.region}`),
						" · ",
						m.zoneIndex + 1,
						"/",
						m.zoneCount
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-lg tracking-wide",
					children: m.promptTitle
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right text-[11px] tabular-nums text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: ap < 1 ? "text-hunger" : void 0,
							children: [
								tt("ap.label"),
								" ",
								ap,
								"/",
								max
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							tt("ui.noise"),
							" ",
							ls.noiseToday ?? m.noise
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							tt("threat.label"),
							" ",
							tt(`threat.${band}`)
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							tt("ui.z"),
							" ",
							ls.zombies,
							" · ",
							tt("ui.bag"),
							" ",
							bagN
						] })
					]
				})]
			}), m.finds?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindsHint, { finds: m.finds })
			}) : null]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-4 h-40 overflow-hidden rounded-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset(m.image),
				alt: "",
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ash-prose font-serif text-[1.05rem] leading-[1.65] text-fg",
				children: m.promptBody
			}, m.promptBody)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 px-4",
			children: m.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: c.danger ? "danger" : "secondary",
				className: cn("h-auto min-h-12 w-full justify-between gap-3 py-3 whitespace-normal"),
				disabled: c.disabled,
				onClick: () => choose(c.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-left",
					children: c.label
				}), c.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-right text-[11px] font-normal opacity-70",
					children: c.hint
				}) : null]
			}, c.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
			children: squad.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex min-w-0 flex-1 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
					survivor: s,
					className: "size-9 shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[11px]",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
						value: s.hp,
						max: s.maxHp,
						tone: "hp"
					})]
				})]
			}, s.id))
		})
	] });
}
function EncounterScreen({ state, overlay }) {
	const tt = useT();
	const encounter = useGame((s) => s.encounter);
	const enc = state.encounter;
	if (!enc) return null;
	const full = living(state).length >= state.shelter.capacity;
	const dry = apOf(state) < AP_COST.encounter;
	const moodKey = enc.mood === "grateful" ? "enc.grateful" : enc.mood === "wary" ? "enc.wary" : enc.mood === "hurt" ? "enc.hurt" : "enc.hostile";
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset(state.mission?.image ?? "/art/title.jpg"),
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.2em] text-muted uppercase",
						children: tt("enc.survivor")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-end gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							portrait: enc.portrait,
							name: enc.name,
							className: "size-28 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl tracking-wide",
								children: enc.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted",
								children: tt(`occ.${enc.occupation}`)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-faint",
								children: tt("enc.mood", { m: tt(moodKey) })
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-pretty text-sm leading-relaxed",
						children: tt(`enc.body.${enc.mood}`, {
							name: enc.name,
							occ: tt(`occ.${enc.occupation}`)
						})
					}),
					full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-hunger",
						children: tt("enc.full")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "w-full",
								onClick: () => encounter("invite"),
								disabled: full || dry,
								children: dry ? tt("ap.need", { n: AP_COST.encounter }) : tt("enc.invite")
							}),
							enc.mood === "wary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "w-full",
								onClick: () => encounter("trade"),
								disabled: dry,
								children: dry ? tt("ap.need", { n: AP_COST.encounter }) : tt("enc.trade")
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "w-full",
								onClick: () => encounter("turn"),
								children: tt("enc.turn")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "danger",
								className: "w-full",
								onClick: () => encounter("fight"),
								disabled: dry,
								children: dry ? tt("ap.need", { n: AP_COST.encounter }) : tt("enc.fight")
							})
						]
					})
				]
			})
		]
	});
	if (overlay) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full flex-col",
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: body });
}
function OccupyScreen({ state }) {
	const tt = useT();
	const occupy = useGame((s) => s.occupy);
	const skipOccupy = useGame((s) => s.skipOccupy);
	const id = state.mapTarget;
	if (!id) return null;
	const loc = locById(id);
	const old = locById(state.shelter.locationId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset(loc.image),
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col justify-end gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.22em] text-muted uppercase",
						children: tt("occ.can")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl leading-none tracking-wide",
						children: tLoc(loc.id)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-pretty text-sm leading-relaxed text-muted",
						children: [tt("occ.body", {
							en: loc.nameEn,
							state: tt(`state.${loc.region}`),
							old: tLoc(old.id),
							n: loc.occupyCapacity
						}), loc.size === "metro" ? tt("occ.metro") : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						onClick: occupy,
						children: tt("occ.move")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "secondary",
						className: "w-full",
						onClick: skipOccupy,
						children: tt("occ.stay")
					})
				]
			})
		]
	}) });
}
function EndScreen({ state }) {
	const tt = useT();
	const abandon = useGame((s) => s.abandon);
	const openCreate = useGame((s) => s.openCreate);
	const openTitle = useGame((s) => s.openTitle);
	const end = state.ended;
	if (!end) return null;
	const dead = state.survivors.filter((s) => !s.alive);
	const win = end.kind === "win";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1 bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset(win ? "/art/loc-city.jpg" : "/art/title.jpg"),
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.24em] text-hp uppercase",
						children: win ? tt("end.city") : tt("end.wipe")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-serif text-4xl leading-none",
						children: win ? tt("ui.title") : tt("end.nobody")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-pretty text-sm leading-relaxed",
						children: end.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted",
						children: tt("end.stats", {
							day: state.day,
							n: state.occupiedCount,
							dead: dead.length
						})
					}),
					dead.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1",
						children: dead.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-xs text-faint",
							children: [
								s.name,
								" · ",
								s.death
							]
						}, s.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							className: "w-full",
							onClick: () => {
								abandon();
								openCreate();
							},
							children: tt("end.again")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							className: "w-full",
							onClick: () => {
								abandon();
								openTitle();
							},
							children: tt("end.title")
						})]
					})
				]
			})
		]
	}) });
}
var TABS = [
	{
		id: "law",
		icon: ShieldCheck
	},
	{
		id: "look",
		icon: ScrollText
	},
	{
		id: "found",
		icon: Sparkles
	}
];
function PaperSwatch({ id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-14 w-full flex-col justify-center gap-1.5 rounded-sm border border-border px-3", id === "field" && "bg-surface-2", id === "carbon" && "bg-bg", id === "ledger" && "bg-thirst/15", id === "ash" && "bg-hunger/20"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-3/4 rounded-full bg-fg/25" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1/2 rounded-full bg-fg/15" })]
	});
}
function ItemCard({ item }) {
	const tt = useT();
	const smokes = useShop((s) => s.smokes);
	const owned = useShop((s) => s.owns(item.id));
	const paper = useShop((s) => s.paper);
	const frame = useShop((s) => s.frame);
	const founder = useShop((s) => s.founder);
	const buy = useShop((s) => s.buy);
	const wearPaper = useShop((s) => s.wearPaper);
	const wearFrame = useShop((s) => s.wearFrame);
	const equipped = item.paper && paper === item.paper || item.frame && frame === item.frame || item.kind === "pack" && founder;
	const short = smokes < item.smokes;
	const wear = () => {
		if (item.paper) wearPaper(item.paper);
		if (item.frame) wearFrame(item.frame);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-md border border-border bg-surface p-3",
		children: [
			item.paper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperSwatch, { id: item.paper }) : null,
			item.frame ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-16 items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("size-12 rounded-sm bg-surface-2", item.frame === "tape" && "portrait-tape", item.frame === "rust" && "portrait-rust", item.frame === "brass" && "portrait-brass") })
			}) : null,
			item.kind === "pack" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-16 items-center justify-center rounded-sm bg-surface-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display tracking-[0.2em] text-sm",
					children: "FOUNDING"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-sm",
				children: tt(`shop.item.${item.id}`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs leading-relaxed text-muted",
				children: tt(`shop.item.${item.id}.blurb`)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap items-center gap-2",
				children: owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: equipped ? "default" : "secondary",
					onClick: wear,
					disabled: item.kind === "pack",
					children: equipped ? tt("shop.wearing") : tt("shop.wear")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => buy(item.id),
					disabled: short,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cigarette, { className: "size-3.5" }), item.smokes]
				})
			})
		]
	});
}
function ShopScreen() {
	const tt = useT();
	const tab = useShop((s) => s.tab);
	const setTab = useShop((s) => s.setTab);
	const smokes = useShop((s) => s.smokes);
	const nights = useShop((s) => s.nights);
	const founder = useShop((s) => s.founder);
	const note = useShop((s) => s.note);
	const paper = useShop((s) => s.paper);
	const wearPaper = useShop((s) => s.wearPaper);
	const closeShop = useGame((s) => s.closeShop);
	const looks = CATALOG.filter((c) => c.kind !== "pack");
	const pack = CATALOG.find((c) => c.id === "pack.founder");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-end justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] tracking-[0.18em] text-muted uppercase",
				children: tt("shop.kicker")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl tracking-wide",
				children: tt("shop.title")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, { className: "mb-1 justify-end" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-1 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cigarette, { className: "size-3.5 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display tabular-nums",
						children: smokes
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "mx-4 mb-3 grid grid-cols-3 gap-1 rounded-md bg-surface p-1",
			children: TABS.map((row) => {
				const Icon = row.icon;
				const on = tab === row.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab(row.id),
					className: cn("flex min-h-11 items-center justify-center gap-1 rounded-sm text-[11px] tracking-wide", on ? "bg-accent text-accent-fg" : "text-muted"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-3.5" }), tt(`shop.tab.${row.id}`)]
				}, row.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
			children: [
				tab === "law" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ash-prose font-serif text-[15px] leading-relaxed text-fg/90",
							children: tt("shop.law.body")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: BANS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2 rounded-md bg-surface px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mt-0.5 size-4 shrink-0 text-hp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tt(key) })]
							}, key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted",
							children: tt("shop.law.ok")
						})
					]
				}) : null,
				tab === "look" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: tt("shop.look.body")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => wearPaper("field"),
							className: cn("w-full rounded-md border p-3 text-left", paper === "field" ? "border-accent bg-surface" : "border-border bg-surface-2"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperSwatch, { id: "field" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-sm",
									children: tt("shop.item.paper.field")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted",
									children: tt("shop.item.paper.field.blurb")
								})
							]
						}),
						looks.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, { item }, item.id))
					]
				}) : null,
				tab === "found" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "ash-prose font-serif text-[15px] leading-relaxed",
							children: tt("shop.found.body")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, { item: pack }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md bg-surface px-3 py-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] tracking-[0.16em] text-muted uppercase",
									children: tt("shop.found.stats")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1",
									children: tt("shop.found.nights", { n: nights })
								}),
								founder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-hunger",
									children: tt("shop.found.mark")
								}) : null
							]
						})
					]
				}) : null,
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-hunger",
					children: tt(note)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-[11px] leading-relaxed text-faint",
					children: tt("shop.demo")
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				className: "w-full",
				onClick: closeShop,
				children: tt("ui.back")
			})
		})
	] });
}
/** v0.2 先收，再一併改。不要逐條熱修打散版本。 */
var V02_NOTES = [
	{
		id: "infirmary-hidden-meds",
		from: "WhatsApp 玩家 · 第6天 莫卓農舍",
		q: "建材夠為什麼升不了醫務室？",
		status: "fixed-preview"
	},
	{
		id: "wall-what-for",
		from: "WhatsApp 玩家 · 第6天 莫卓農舍",
		q: "圍牆有什麼用、怎麼補？會有僵屍襲擊嗎？",
		status: "fixed-preview"
	},
	{
		id: "late-no-goal",
		from: "WhatsApp 玩家 · 第30–40天",
		q: "30–40天不知道要做什麼。標題是再撐一晚，但夜襲、水糧、搜索都沒壓力。",
		status: "fixed-preview"
	},
	{
		id: "fight-spawn-leftover",
		from: "WhatsApp 玩家 · 第30–40天",
		q: "肉搏/開槍越打越多，夾擊卡在剩餘2。地圖顯示已清理，回去又是2隻。",
		status: "fixed-preview"
	},
	{
		id: "gear-stats-discard",
		from: "WhatsApp 玩家 · 第30–40天",
		q: "裝備能力值不知道影響什麼。工坊幾乎不壞。用不到的裝備不能丟掉。",
		status: "fixed-preview"
	}
];
var KEY = "omn-v02-inbox";
function snapshot(run) {
	if (!run) return "沒有進行中的存檔。";
	const loc = locById(run.shelter.locationId);
	const people = living(run);
	const fac = Object.entries(run.shelter.facilities).filter(([, n]) => n > 0).map(([k, n]) => `${k}:${n}`).join(" ");
	const r = run.resources;
	return [
		`再活一晚 回報`,
		`日 ${run.day} · ${loc.name} · 圍牆 ${run.shelter.barricade}`,
		`人 ${people.length}/${run.shelter.capacity}（${people.map((s) => s.name).join("、") || "—"}）`,
		`食物${r.food} 水${r.water} 建材${r.materials} 藥${r.medicine} 彈${r.ammo} 油${r.fuel}`,
		fac ? `設施 ${fac}` : "設施 無",
		`畫面 ${run.screen}`
	].join("\n");
}
function loadInbox() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
	} catch {
		return [];
	}
}
function pushInbox(text) {
	const next = [text, ...loadInbox()].slice(0, 20);
	localStorage.setItem(KEY, JSON.stringify(next));
	return next;
}
function FeedbackSheet({ onClose }) {
	const tt = useT();
	const run = useGame((s) => s.run);
	const snap = (0, import_react.useMemo)(() => snapshot(run ?? loadSave()), [run]);
	const [q, setQ] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const pack = () => {
		const body = [
			q.trim() || "（沒寫問題）",
			"",
			snap
		].join("\n");
		pushInbox(body);
		return body;
	};
	const copy = async () => {
		const body = pack();
		try {
			await navigator.clipboard.writeText(body);
		} catch {
			const ta = document.createElement("textarea");
			ta.value = body;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			ta.remove();
		}
		setCopied(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.16em] text-muted uppercase",
				children: tt("fb.kicker")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 px-3 text-sm",
				onClick: onClose,
				children: tt("fb.close")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl tracking-wide",
					children: tt("fb.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm leading-relaxed text-muted",
					children: tt("fb.body")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mt-4 block text-xs text-muted",
					htmlFor: "fb-q",
					children: tt("fb.q")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: "fb-q",
					value: q,
					onChange: (e) => setQ(e.target.value),
					rows: 5,
					className: "mt-1 min-h-28 w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm leading-relaxed",
					placeholder: tt("fb.ph")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "mt-3 overflow-x-auto rounded-md border border-border bg-surface p-3 text-[11px] leading-relaxed text-muted",
					children: snap
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-3 w-full",
					onClick: copy,
					children: copied ? tt("fb.copied") : tt("fb.copy")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[11px] leading-relaxed text-faint",
					children: tt("fb.where")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-[11px] tracking-[0.16em] text-muted uppercase",
					children: tt("fb.inbox")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: V02_NOTES.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-border bg-surface px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] tracking-[0.12em] text-faint uppercase",
								children: n.from
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed",
								children: n.q
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted",
								children: n.status === "fixed-preview" ? tt("fb.preview") : tt("fb.open")
							})
						]
					}, n.id))
				})
			]
		})]
	});
}
function rollTip(except) {
	let n = Math.floor(Math.random() * 16);
	if (except != null && n === except) n = (n + 1) % 16;
	return n;
}
var SHOTS = [
	{
		src: "/shots/01-title.jpg?v=en",
		key: "ui.shot.1"
	},
	{
		src: "/shots/02-shelter.jpg?v=en",
		key: "ui.shot.2"
	},
	{
		src: "/shots/03-roster.jpg?v=en2",
		key: "ui.shot.3"
	}
];
function TitleScreen({ muted }) {
	const tt = useT();
	const loc = getLocale();
	const continueGame = useGame((s) => s.continueGame);
	const openCreate = useGame((s) => s.openCreate);
	const openHelp = useGame((s) => s.openHelp);
	const hasSave = useGame((s) => s.hasSave);
	const savePeek = useGame((s) => s.savePeek);
	const toggleMute = useGame((s) => s.toggleMute);
	const storeMute = useGame((s) => s.muted);
	const quiet = muted || storeMute;
	const [tip, setTip] = (0, import_react.useState)(0);
	const [kit, setKit] = (0, import_react.useState)(false);
	const [fb, setFb] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTip(rollTip());
	}, []);
	const onMute = () => {
		unlockAudio();
		toggleMute();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: asset("/art/title.jpg"),
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LangSwitch, { className: "absolute left-4 top-[max(1rem,env(safe-area-inset-top))] z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onMute,
				className: "absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex size-11 items-center justify-center rounded-md bg-bg/40 text-fg",
				"aria-label": quiet ? tt("ui.unmute") : tt("ui.mute"),
				children: quiet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 flex flex-col gap-5 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] tracking-[0.28em] text-muted uppercase",
							children: tt("ui.ver")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: loc === "en" ? "font-display text-[2.6rem] leading-[0.95] tracking-[0.08em]" : "font-serif text-5xl leading-none",
							children: tt("ui.title")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: loc === "en" ? "font-serif text-xl text-fg/90" : "font-display text-sm tracking-[0.2em] text-fg/75 uppercase",
							children: tt("ui.ash")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTip((n) => rollTip(n)),
							className: "max-w-[22rem] text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] tracking-[0.22em] text-muted uppercase",
								children: tt("ui.tip")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-pretty text-sm leading-relaxed text-fg/85",
								children: tt(`tip.${tip}`)
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [
						hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [savePeek ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-[11px] tracking-wide text-muted",
								children: tt("ui.savePeek", {
									n: savePeek.day,
									loc: tLoc(savePeek.loc)
								})
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "w-full",
								onClick: continueGame,
								children: tt("ui.continue")
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: hasSave ? "secondary" : "default",
							className: "w-full",
							onClick: openCreate,
							children: tt("ui.new")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							className: "w-full",
							onClick: openHelp,
							children: tt("bible.openBtn")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFb(true),
							className: "h-11 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("fb.openBtn")
						}),
						null
					]
				})]
			}),
			fb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackSheet, { onClose: () => setFb(false) }) : null,
			kit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-30 flex flex-col bg-bg/95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-[0.16em] text-muted uppercase",
						children: tt("ui.kitHint")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 px-3 text-sm",
						onClick: () => setKit(false),
						children: tt("ui.kitClose")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("ui.coverHint")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: asset("/itch-cover.jpg"),
							width: 630,
							height: 500,
							alt: "",
							className: "mb-5 w-full rounded-md border border-border"
						}),
						SHOTS.map((shot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1.5 text-[11px] tracking-[0.16em] text-muted uppercase",
								children: tt(shot.key)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: asset(shot.src.split("?")[0]),
								alt: "",
								className: "w-full rounded-md border border-border"
							})]
						}, shot.src))
					]
				})]
			}) : null
		]
	}) });
}
var BIBLE_TABS = [
	"play",
	"skills",
	"locations",
	"occupations",
	"traits",
	"gear",
	"facilities",
	"jobs",
	"rules"
];
var PLAY = [
	"goal",
	"save",
	"ap",
	"mission",
	"dispatch",
	"search",
	"fight",
	"skills",
	"night",
	"house",
	"occupy",
	"gear",
	"win"
];
var RULES = [
	"ap",
	"search",
	"fight",
	"extract",
	"night",
	"raid",
	"build",
	"occupy",
	"dispatch"
];
function Card({ title, body, meta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-md border border-border bg-surface px-3 py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-sm tracking-wide",
				children: title
			}),
			meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] leading-relaxed text-faint",
				children: meta
			}) : null,
			body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted",
				children: body
			}) : null
		]
	});
}
function matches(q, ...parts) {
	if (!q) return true;
	return parts.some((p) => String(p ?? "").toLowerCase().includes(q));
}
function phrase(key, fallback) {
	const s = t(key);
	return s === key ? fallback : s;
}
function DataBible({ onClose }) {
	const tt = useT();
	const loc = getLocale();
	const [tab, setTab] = (0, import_react.useState)("play");
	const [q, setQ] = (0, import_react.useState)("");
	const needle = q.trim().toLowerCase();
	const play = (0, import_react.useMemo)(() => PLAY.map((id) => ({
		id,
		title: tt(`bible.play.${id}`),
		body: tt(`bible.play.${id}.body`)
	})), [tt, loc]);
	let cards = [];
	if (tab === "play") cards = play.map((p) => ({
		key: p.id,
		title: p.title,
		body: p.body
	}));
	else if (tab === "locations") cards = LOCATIONS.filter((l) => matches(needle, tLoc(l.id), l.nameEn, tt(`loc.${l.id}.blurb`), tt(`state.${l.region}`))).map((l) => {
		const loot = Object.entries(l.loot).map(([k, pair]) => `${tt(`res.${k}`)} ${pair[0]}–${pair[1]}`).join(" · ");
		return {
			key: l.id,
			title: tLoc(l.id),
			meta: `${tt(`state.${l.region}`)} · ${sizeLabel(l.size)} · ${tt("map.zombies", { n: l.zombies })} · ${l.fuel ? tt("squad.fuel", { n: l.fuel }) : tt("squad.walk")}`,
			body: `${tt(`loc.${l.id}.blurb`)} ${loot ? `${tt("bible.loot")} ${loot}.` : ""} ${tt("bible.cap", { n: l.occupyCapacity })}`
		};
	});
	else if (tab === "skills") cards = SKILL_KEYS.flatMap((k) => {
		const title = tt(`skill.${k}`);
		const body = tt(`skill.${k}.blurb`) + " " + tt(`skill.how.${k}`);
		const rows = Array.from({ length: 11 }, (_, lv) => ({
			key: `${k}-${lv}`,
			title: `${title} ${lv} ${tt(`skill.rank.${lv}`)}`,
			meta: skillBoostLine(k, lv),
			body: tt(`skill.${k}.lv.${lv}`)
		})).filter((c) => matches(needle, c.title, c.meta, c.body, body));
		return needle ? rows : [{
			key: k,
			title,
			meta: tt(`skill.how.${k}`),
			body
		}, ...rows];
	});
	else if (tab === "occupations") cards = OCCUPATIONS.filter((o) => matches(needle, tt(`occ.${o.id}`), o.nameEn, tt(`occ.${o.id}.blurb`), tt(`occ.${o.id}.desc`))).map((o) => ({
		key: o.id,
		title: tt(`occ.${o.id}`),
		meta: `${tt("create.points", { n: o.pool })} · HP ${o.hp} · ${phrase(`occ.${o.id}.blurb`, o.blurb)}`,
		body: phrase(`occ.${o.id}.desc`, o.desc)
	}));
	else if (tab === "traits") cards = TRAITS.filter((tr) => matches(needle, tt(`trait.${tr.id}`), tr.blurb)).map((tr) => ({
		key: tr.id,
		title: `${tt(`trait.${tr.id}`)} · ${tr.points > 0 ? `+${tr.points}` : String(tr.points)}`,
		meta: tr.kind === "neg" ? tt("create.neg") : tt("create.pos"),
		body: phrase(`trait.${tr.id}.blurb`, tr.blurb)
	}));
	else if (tab === "gear") {
		const items = GEAR.filter((g) => matches(needle, g.names.zh, g.names.en, g.names.ja, g.names.ko, g.slot, gearStatBits(g).join(" "))).map((g) => ({
			key: g.id,
			title: g.names[loc] ?? g.names.zh,
			meta: `${tt(`gear.slot.${g.slot}`)} · ${tt(`gear.rarity.${g.rarity}`)}`,
			body: gearStatBits(g).join(" · ") || tt("gear.bare")
		}));
		cards = needle ? items : [{
			key: "legend",
			title: tt("bible.tab.gear"),
			body: tt("gear.legend")
		}, ...items];
	} else if (tab === "facilities") cards = FACILITIES.filter((f) => matches(needle, tt(`fac.${f.id}`), f.blurb, f.effect, tt(`fac.${f.id}.blurb`), tt(`fac.${f.id}.effect`))).map((f) => {
		const extra = f.cost.extra ? Object.entries(f.cost.extra).map(([k, n]) => `${tt(`res.${k}`)} ${n}`).join(" · ") : "";
		return {
			key: f.id,
			title: tt(`fac.${f.id}`),
			meta: `${tt("build.need")} ${tt("res.materials")} ${f.cost.materials}${extra ? ` · ${extra}` : ""} · ${tt("bible.max", { n: f.max })}`,
			body: `${phrase(`fac.${f.id}.blurb`, f.blurb)} ${phrase(`fac.${f.id}.effect`, f.effect)}`
		};
	});
	else if (tab === "jobs") cards = JOBS.filter((j) => matches(needle, tt(`job.${j.id}`), j.blurb, tt(`job.${j.id}.blurb`))).map((j) => ({
		key: j.id,
		title: tt(`job.${j.id}`),
		meta: j.need ? tt(`fac.${j.need}`) : tt("bible.noNeed"),
		body: phrase(`job.${j.id}.blurb`, j.blurb)
	}));
	else cards = RULES.filter((id) => matches(needle, tt(`bible.rule.${id}`), tt(`bible.rule.${id}.body`))).map((id) => ({
		key: id,
		title: tt(`bible.rule.${id}`),
		body: tt(`bible.rule.${id}.body`)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-dvh max-w-md flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("bible.kicker")
						}), onClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-3 text-sm",
							onClick: onClose,
							children: tt("bible.close")
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl tracking-wide",
						children: tt("bible.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: tt("bible.body")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto px-4 pb-2",
				children: BIBLE_TABS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("h-11 shrink-0 rounded-md px-3 text-xs", tab === id ? "bg-accent text-accent-fg" : "bg-surface text-muted"),
					children: tt(`bible.tab.${id}`)
				}, id))
			}),
			tab !== "play" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "px-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: tt("bible.search")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: tt("bible.search"),
					className: "h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
				children: [cards.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: tt("bible.empty")
				}) : null, cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: c.title,
					meta: c.meta,
					body: c.body
				}, c.key))]
			})
		]
	});
}
var TASKS = [
	{
		id: "herbs",
		icon: Leaf
	},
	{
		id: "supplies",
		icon: Package
	},
	{
		id: "forage",
		icon: Apple
	},
	{
		id: "auto",
		icon: Compass
	}
];
var FOCUS_SKILL = {
	herbs: "medical",
	supplies: "scavenge",
	forage: "farm"
};
function hintFor(s, task) {
	const focus = focusOf(s, task);
	const skill = FOCUS_SKILL[focus];
	return t("dispatch.hint.fit", {
		name: s.name,
		skill: t(`skill.${skill}`),
		n: s.skills[skill],
		focus: t(`dispatch.focus.${focus}`)
	});
}
function DispatchPanel({ state }) {
	const tt = useT();
	const close = useGame((s) => s.closeDispatch);
	const send = useGame((s) => s.sendDispatch);
	const people = living(state);
	const [task, setTask] = (0, import_react.useState)("auto");
	const [pick, setPick] = (0, import_react.useState)([]);
	const toggle = (id) => {
		setPick((cur) => {
			if (cur.includes(id)) return cur.filter((x) => x !== id);
			if (cur.length >= 2) return cur;
			if (cur.length + 1 >= people.length) return cur;
			return [...cur, id];
		});
	};
	const check = canStartDispatch(state, pick);
	const n = pick.length;
	const takeF = Math.min(state.resources.food, n);
	const takeW = Math.min(state.resources.water, n);
	const hungry = n > 0 && (takeF < n || takeW < n);
	const ap = apOf(state);
	const solo = people.length < 2;
	const busy = (state.dispatches ?? []).length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-dvh max-w-md flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-[0.16em] text-muted uppercase",
							children: tt("dispatch.kicker")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 px-3 text-sm",
							onClick: close,
							children: tt("dispatch.close")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl tracking-wide",
						children: tt("dispatch.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: tt("dispatch.body")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
				children: solo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
					children: tt("dispatch.solo")
				}) : busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-muted",
					children: tt("dispatch.busy")
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
						children: tt("dispatch.pickTask")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 grid grid-cols-2 gap-2",
						children: TASKS.map((item) => {
							const Icon = item.icon;
							const on = task === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTask(item.id),
								className: cn("rounded-lg border p-3 text-left transition-colors duration-[var(--motion-quick)]", on ? "border-accent bg-surface-2" : "border-border bg-surface"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4 text-muted",
										strokeWidth: 1.8
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-sm tracking-wide",
										children: tt(`dispatch.task.${item.id}`)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] leading-relaxed text-muted",
									children: tt(`dispatch.task.${item.id}.blurb`)
								})]
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
						children: tt("dispatch.pickWho")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: people.map((s) => {
							const on = pick.includes(s.id);
							const locked = !canDispatchPerson(state, s);
							const score = Math.round(focusScore(s, focusOf(s, task)));
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggle(s.id),
								disabled: locked && !on,
								className: cn("flex w-full items-center gap-3 rounded-md border p-2 text-left disabled:opacity-45", on ? "border-accent bg-surface-2" : "border-border bg-surface"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
									survivor: s,
									className: cn("size-12", locked && "grayscale")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm",
											children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 text-[11px] text-faint",
												children: tt(`occ.${s.occupation}`)
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] leading-snug text-muted",
											children: hintFor(s, task)
										}),
										locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-hp",
											children: tt("squad.noGo")
										}) : score < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-faint",
											children: tt("dispatch.hint.poor")
										}) : null
									]
								})]
							}) }, s.id);
						})
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3",
				children: [n > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-2 text-[11px] leading-relaxed text-muted",
					children: [
						tt("dispatch.pack", {
							food: takeF,
							water: takeW
						}),
						hungry ? ` · ${tt("dispatch.packShort")}` : "",
						ap < AP_COST.dispatch ? ` · ${tt("dispatch.needAp")}` : ""
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-[11px] text-faint",
					children: tt("dispatch.none")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					disabled: !check.ok,
					onClick: () => send(pick, task),
					children: tt("dispatch.confirm", { n: Math.max(1, n) })
				})]
			})
		]
	});
}
var GameCatch = class extends import_react.Component {
	state = { crashed: false };
	static getDerivedStateFromError() {
		return { crashed: true };
	}
	render() {
		if (this.state.crashed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col justify-end gap-4 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-3xl leading-none",
					children: t("crash.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: t("crash.body")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					onClick: () => {
						this.setState({ crashed: false });
						const saved = loadSave();
						if (saved) useGame.setState({
							run: saved,
							hasSave: true,
							muted: !!saved.muted
						});
					},
					children: t("crash.resume")
				})
			]
		}) });
		return this.props.children;
	}
};
function AshApp() {
	const boot = useGame((s) => s.boot);
	const run = useGame((s) => s.run);
	const menu = useGame((s) => s.menu);
	const muted = useGame((s) => s.muted);
	const help = useGame((s) => s.help);
	const closeHelp = useGame((s) => s.closeHelp);
	const dispatchOpen = useGame((s) => s.dispatchOpen);
	const raw = run?.ended ? "end" : run?.screen;
	const screen = raw === "title" || raw === "create" ? "shelter" : raw ?? (menu === "create" ? "create" : menu === "shop" ? "shop" : "title");
	(0, import_react.useEffect)(() => {
		bootLocale();
		boot();
		const on = () => unlockAudio();
		window.addEventListener("pointerdown", on, { once: true });
		window.addEventListener("keydown", on, { once: true });
		return () => {
			window.removeEventListener("pointerdown", on);
			window.removeEventListener("keydown", on);
		};
	}, [boot]);
	(0, import_react.useEffect)(() => {
		if (muted || run?.muted) {
			setBgm("off");
			return;
		}
		if (!run || screen === "title" || screen === "create" || menu === "shop") setBgm("title");
		else if (screen === "end") setBgm("end");
		else if (screen === "occupy") setBgm("occupy");
		else if (screen === "mission" || screen === "encounter") setBgm("mission");
		else setBgm("hub");
	}, [
		screen,
		run,
		muted,
		menu
	]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		window.__ash = {
			screen,
			day: run?.day ?? 0,
			store: useGame
		};
	}, [screen, run?.day]);
	if (menu === "shop") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopScreen, {});
	const bible = help ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataBible, { onClose: closeHelp })
	}) : null;
	const dispatchSheet = run && dispatchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DispatchPanel, { state: run })
	}) : null;
	if (!run) {
		if (menu === "create") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateScreen, {}), bible] });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { muted }), bible] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GameCatch, { children: [
		screen === "end" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndScreen, { state: run }) : screen === "encounter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncounterScreen, { state: run }) : screen === "mission" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionScreen, { state: run }) : screen === "occupy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OccupyScreen, { state: run }) : screen === "squad" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquadScreen, { state: run }) : screen === "map" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapScreen, { state: run }) : screen === "roster" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RosterScreen, { state: run }) : screen === "build" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildScreen, { state: run }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShelterScreen, { state: run }),
		bible,
		dispatchSheet
	] });
}
function Home() {
	const { rd } = Route.useSearch();
	if (rd === "bible") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataBible, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AshApp, {});
}
//#endregion
export { Home as component };
