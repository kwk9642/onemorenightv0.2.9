import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Map, n as Volume2, o as House, r as Users, s as Hammer, t as VolumeX } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CSEevJVI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var muted = false;
function ac() {
	if (typeof window === "undefined") return null;
	if (!ctx) {
		const C = window.AudioContext || window.webkitAudioContext;
		if (!C) return null;
		ctx = new C();
	}
	if (ctx.state === "suspended") ctx.resume();
	return ctx;
}
function unlockAudio() {
	ac();
}
function setMuted(v) {
	muted = v;
}
function tone(freq, dur = .08, type = "square", gain = .04) {
	if (muted) return;
	const c = ac();
	if (!c) return;
	const o = c.createOscillator();
	const g = c.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, c.currentTime);
	g.gain.setValueAtTime(gain, c.currentTime);
	g.gain.exponentialRampToValueAtTime(1e-4, c.currentTime + dur);
	o.connect(g);
	g.connect(c.destination);
	o.start();
	o.stop(c.currentTime + dur);
}
function click() {
	tone(220, .05, "square", .03);
}
function ok() {
	tone(330, .07, "triangle", .04);
	setTimeout(() => tone(440, .08, "triangle", .03), 60);
}
function warn() {
	tone(140, .12, "sawtooth", .04);
}
var SAVE_KEY = "ash-state-v1";
var OCCUPATIONS = [
	{
		id: "firefighter",
		name: "消防員",
		nameEn: "Firefighter",
		blurb: "火場出來的人，扛得住末日。",
		desc: "破門、近戰、把人從廢墟裡拖出來。斧頭在手，很少退。",
		skills: {
			combat: 7,
			stealth: 3,
			scavenge: 5,
			medical: 4,
			build: 5,
			farm: 2,
			cook: 2
		},
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
		tone: "#8a4a3a"
	},
	{
		id: "doctor",
		name: "醫生",
		nameEn: "Doctor",
		blurb: "還有人懂怎麼把血止住。",
		desc: "感染、骨折、槍傷——醫院沒了，但手還在。醫藥是硬通貨。",
		skills: {
			combat: 3,
			stealth: 4,
			scavenge: 4,
			medical: 9,
			build: 3,
			farm: 2,
			cook: 3
		},
		hp: 90,
		weapon: "fists",
		start: {
			medicine: 10,
			food: 4,
			water: 5,
			materials: 2
		},
		portrait: "doc",
		tone: "#4a5a6a"
	},
	{
		id: "officer",
		name: "警員",
		nameEn: "Officer",
		blurb: "槍聲以後，法律只剩彈匣。",
		desc: "受過射擊與壓制訓練。彈藥用完之前，還算有秩序。",
		skills: {
			combat: 8,
			stealth: 5,
			scavenge: 4,
			medical: 3,
			build: 3,
			farm: 2,
			cook: 2
		},
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
		tone: "#3a4450"
	},
	{
		id: "chef",
		name: "廚師",
		nameEn: "Chef",
		blurb: "能把過期罐頭變成熱食的人，能留住人。",
		desc: "廚藝讓食物多撐一天，也讓士氣不那麼快垮。",
		skills: {
			combat: 3,
			stealth: 4,
			scavenge: 5,
			medical: 2,
			build: 3,
			farm: 3,
			cook: 9
		},
		hp: 95,
		weapon: "knife",
		start: {
			food: 12,
			water: 6,
			materials: 2
		},
		portrait: "chef",
		tone: "#6a5a4a"
	},
	{
		id: "mechanic",
		name: "技工",
		nameEn: "Mechanic",
		blurb: "東西壞了，總有人能焊回去。",
		desc: "圍牆、引擎、無線電——手裡有工具，庇護所才像家。",
		skills: {
			combat: 4,
			stealth: 3,
			scavenge: 6,
			medical: 2,
			build: 9,
			farm: 2,
			cook: 2
		},
		hp: 100,
		weapon: "bat",
		start: {
			materials: 12,
			fuel: 5,
			food: 3,
			water: 3
		},
		portrait: "mech",
		tone: "#4a5a42"
	},
	{
		id: "farmer",
		name: "農夫",
		nameEn: "Farmer",
		blurb: "土地還在，種子就還有用。",
		desc: "懂土壤與季節。菜園升級後，是整座庇護所能活過冬天的理由。",
		skills: {
			combat: 4,
			stealth: 4,
			scavenge: 5,
			medical: 3,
			build: 5,
			farm: 9,
			cook: 4
		},
		hp: 105,
		weapon: "bat",
		start: {
			food: 8,
			water: 8,
			materials: 4
		},
		portrait: "farm",
		tone: "#5a4a38"
	},
	{
		id: "veteran",
		name: "退伍軍人",
		nameEn: "Veteran",
		blurb: "戰爭沒結束，只是換了敵人。",
		desc: "戰場直覺還在。近戰與槍法都狠，只是夜裡不太睡。",
		skills: {
			combat: 9,
			stealth: 6,
			scavenge: 4,
			medical: 4,
			build: 4,
			farm: 2,
			cook: 2
		},
		hp: 105,
		weapon: "pistol",
		start: {
			ammo: 10,
			food: 3,
			water: 3,
			medicine: 2,
			fuel: 2
		},
		portrait: "vet",
		tone: "#3d4a3a"
	},
	{
		id: "burglar",
		name: "竊賊",
		nameEn: "Burglar",
		blurb: "以前進別人家是罪，現在是班表。",
		desc: "開鎖、潛行、聽到腳步就消失。搜刮時很少驚動整條街。",
		skills: {
			combat: 4,
			stealth: 9,
			scavenge: 8,
			medical: 2,
			build: 3,
			farm: 1,
			cook: 2
		},
		hp: 90,
		weapon: "knife",
		start: {
			food: 3,
			water: 3,
			materials: 4,
			ammo: 4
		},
		portrait: "thief",
		tone: "#3a3a3c"
	}
];
var TRAITS = [
	{
		id: "strong",
		name: "強壯",
		kind: "pos",
		blurb: "近戰多一次餘裕。",
		combat: 1,
		hp: 15
	},
	{
		id: "quiet",
		name: "輕手",
		kind: "pos",
		blurb: "走路像貓。",
		stealth: 2
	},
	{
		id: "leader",
		name: "領導",
		kind: "pos",
		blurb: "別人比較願意聽。",
		morale: 12
	},
	{
		id: "firstaid",
		name: "急救",
		kind: "pos",
		blurb: "會包紮，也會判斷誰先死。",
		medical: 2
	},
	{
		id: "handy",
		name: "巧手",
		kind: "pos",
		blurb: "釘子與木板聽他的。",
		build: 2
	},
	{
		id: "brave",
		name: "無畏",
		kind: "pos",
		blurb: "往前衝，不太會蹲。",
		combat: 1,
		stealth: -1
	},
	{
		id: "coward",
		name: "懼屍",
		kind: "neg",
		blurb: "看到那東西，手會抖。",
		combat: -2
	},
	{
		id: "weak",
		name: "體弱",
		kind: "neg",
		blurb: "一場感冒就能躺平。",
		hp: -20
	},
	{
		id: "insomnia",
		name: "失眠",
		kind: "neg",
		blurb: "夜裡總在聽門外。",
		morale: -8
	},
	{
		id: "selfish",
		name: "自私",
		kind: "neg",
		blurb: "口袋裡的東西，不一定拿出來分。",
		morale: -6
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
			extra: { medicine: 2 }
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
		blurb: "先看到，才有機會不打。",
		max: 2,
		cost: { materials: 10 },
		effect: "降低夜襲"
	}
];
var JOBS = [
	{
		id: "rest",
		name: "休息",
		blurb: "回血、降疲勞。"
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
var WEAPONS = {
	fists: {
		name: "徒手",
		melee: 0,
		gun: false
	},
	knife: {
		name: "刀",
		melee: 6,
		gun: false
	},
	axe: {
		name: "斧",
		melee: 12,
		gun: false
	},
	bat: {
		name: "球棒",
		melee: 8,
		gun: false
	},
	pistol: {
		name: "手槍",
		melee: 2,
		gun: true
	},
	rifle: {
		name: "步槍",
		melee: 3,
		gun: true
	}
};
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
			"riverside_mart"
		],
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
			"westpoint_town"
		],
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
			"march_ridge"
		],
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
			"rosewood_pd"
		],
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
		neighbors: ["muldraugh_farm", "westpoint_town"],
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
			"riverside_mart"
		]
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
		neighbors: ["rosewood_pd", "louisville_mall"]
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
			"cincinnati"
		]
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
			"nashville"
		]
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
		neighbors: ["louisville_mall", "nashville"]
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
			"chicago"
		]
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
			"stlouis"
		]
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
			"stlouis"
		]
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
		neighbors: ["nashville", "stlouis"]
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
			"chicago"
		]
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
			"stlouis"
		]
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
	const loc = LOCATIONS.find((l) => l.id === id);
	if (!loc) throw new Error(`missing location ${id}`);
	return loc;
}
function occById(id) {
	return OCCUPATIONS.find((o) => o.id === id);
}
function traitById(id) {
	return TRAITS.find((t) => t.id === id);
}
function sizeLabel(s) {
	return {
		outpost: "據點",
		town: "小鎮",
		city: "城市",
		metro: "大都會"
	}[s];
}
function stanceLabel(s) {
	return {
		leader: "隊長",
		friend: "同伴",
		neutral: "中立",
		rival: "不穩",
		hostile: "敵對"
	}[s] ?? s;
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
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function sumSkills(base, traits) {
	const s = { ...base };
	for (const id of traits) {
		const t = traitById(id);
		s.combat = clamp(s.combat + (t.combat ?? 0), 1, 10);
		s.stealth = clamp(s.stealth + (t.stealth ?? 0), 1, 10);
		s.medical = clamp(s.medical + (t.medical ?? 0), 1, 10);
		s.build = clamp(s.build + (t.build ?? 0), 1, 10);
	}
	return s;
}
function maxHpFor(occHp, traits) {
	let hp = occHp;
	for (const id of traits) hp += traitById(id).hp ?? 0;
	return clamp(hp, 50, 140);
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
function mapSur(state, id, fn) {
	return {
		...state,
		survivors: state.survivors.map((s) => s.id === id ? fn(s) : s)
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
	const skills = sumSkills(occ.skills, opts.traits);
	const maxHp = maxHpFor(occ.hp, opts.traits);
	const u = uid(stateR);
	let morale = 62;
	for (const t of opts.traits) morale += traitById(t).morale ?? 0;
	return {
		r: u.r,
		s: {
			id: u.id,
			name: opts.name,
			occupation: opts.occupation,
			traits: opts.traits,
			portrait: opts.portrait ?? occ.portrait,
			skills,
			hp: maxHp,
			maxHp,
			hunger: 80,
			thirst: 80,
			morale: clamp(morale, 20, 100),
			fatigue: 20,
			infected: false,
			weapon: opts.weapon ?? occ.weapon,
			stance: opts.stance,
			job: "rest",
			alive: true,
			death: "",
			daysIn: 0
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
function randomCreate(r0 = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0) {
	let r = r0 || 1;
	const occ = pick(r, OCCUPATIONS);
	r = occ.r;
	const pos = pick(r, TRAITS.filter((t) => t.kind === "pos"));
	r = pos.r;
	const neg = pick(r, TRAITS.filter((t) => t.kind === "neg"));
	r = neg.r;
	const sh = pick(r, START_SHELTERS);
	r = sh.r;
	const nm = randomName(r);
	return {
		r: nm.r,
		input: {
			name: nm.name,
			occupation: occ.item.id,
			posTrait: pos.item.id,
			negTrait: neg.item.id,
			shelterId: sh.item.id
		}
	};
}
function createNewGame(input) {
	const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0 || 1;
	let r = seed;
	const start = START_SHELTERS.find((s) => s.id === input.shelterId);
	const player = makeSurvivor(r, {
		name: input.name.trim() || "無名",
		occupation: input.occupation,
		traits: [input.posTrait, input.negTrait],
		stance: "leader"
	});
	r = player.r;
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
		const known = !!loc.startKnown || loc.id === start.locationId;
		locations[loc.id] = {
			zombies: loc.id === start.locationId ? Math.max(0, z.n - 3) : z.n,
			discovered: known,
			cleared: false,
			occupied: loc.id === start.locationId,
			visited: loc.id === start.locationId,
			survivorOpen: loc.survivorChance > 0
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
		version: 1,
		screen: "shelter",
		seed,
		rng: r,
		day: 1,
		survivors: [player.s],
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
		squadPick: [player.s.id],
		mapTarget: null,
		ended: null,
		muted: false,
		occupiedCount: 1
	};
	state = pushLog(state, `${player.s.name}（${occ.name}）在${start.name}落腳。外頭的美國已經不是原來那張地圖。`);
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
		reason: "尚未探明"
	};
	if (id === state.shelter.locationId) return {
		ok: false,
		reason: "這裡就是家"
	};
	const loc = locById(id);
	if (state.resources.fuel < loc.fuel) return {
		ok: false,
		reason: `需要燃油 ${loc.fuel}`
	};
	if (living(state).length === 0) return {
		ok: false,
		reason: "沒有人能出門"
	};
	return {
		ok: true,
		reason: ""
	};
}
function squadOf(state, ids) {
	return ids.map((id) => byId(state, id)).filter((s) => s && s.alive);
}
function best(squad, key) {
	return [...squad].sort((a, b) => b.skills[key] - a.skills[key])[0];
}
function zoneChoices(mission, ammo) {
	const c = [];
	if (!mission.searched) {
		c.push({
			id: "search_quiet",
			label: "潛行搜索",
			hint: "慢、安靜、東西較少"
		});
		c.push({
			id: "search_loud",
			label: "徹底翻找",
			hint: "快、吵、東西多"
		});
	}
	c.push({
		id: "fight",
		label: "清理僵屍",
		hint: "降低此地數量，才能佔領",
		danger: true
	});
	if (mission.searched) c.push({
		id: "next",
		label: "進入下一區"
	});
	c.push({
		id: "extract",
		label: "帶著東西回去"
	});
	return c;
}
function beginZone(state, index) {
	const m = state.mission;
	const loc = locById(m.locationId);
	const zoneName = loc.zones[Math.min(index, loc.zones.length - 1)];
	const ls = state.locations[m.locationId];
	const flavors = [
		`${zoneName}裡很暗。空氣黏，像有人在裡面住過、又突然離開。`,
		`你們踏進${zoneName}。地板上有拖痕，往裡面去。`,
		`${zoneName}安靜得不對勁。遠處有一下金屬碰撞，然後沒有了。`,
		`推開${zoneName}的門。灰塵、甜味、以及還沒走遠的腳步。`
	];
	const f = pick(state.rng, flavors);
	const promptBody = ls.zombies > 0 ? `${f.item} 估計還有 ${ls.zombies} 隻在這棟裡遊蕩。` : `${f.item} 暫時聽不到拖步。也許真的清完了。`;
	const next = {
		...m,
		zoneIndex: index,
		zoneName,
		searched: false,
		phase: "zone",
		fightStyle: null,
		promptTitle: `${loc.name} · ${zoneName}`,
		promptBody,
		image: loc.image,
		choices: zoneChoices({
			...m,
			zoneIndex: index,
			searched: false
		}, state.resources.ammo)
	};
	return {
		...state,
		rng: f.r,
		mission: next,
		screen: "mission"
	};
}
function startMission(state, locationId, squadIds) {
	const loc = locById(locationId);
	const squad = squadOf(state, squadIds);
	if (squad.length === 0) return state;
	const fuel = loc.fuel;
	const bag = EMPTY_BAG();
	const names = squad.map((s) => s.name).join("、");
	let next = {
		...state,
		resources: {
			...state.resources,
			fuel: state.resources.fuel - fuel
		},
		mapTarget: null,
		squadPick: squadIds,
		mission: {
			locationId,
			squadIds,
			zoneIndex: 0,
			zoneCount: loc.zones.length,
			zoneName: loc.zones[0],
			searched: false,
			bag,
			noise: 0,
			promptTitle: loc.name,
			promptBody: "",
			image: loc.image,
			choices: [],
			phase: "zone",
			fightStyle: null
		},
		locations: {
			...state.locations,
			[locationId]: {
				...state.locations[locationId],
				visited: true,
				discovered: true
			}
		}
	};
	next = pushLog(next, `${names}出發前往${loc.name}（${loc.state}）。`);
	next = beginZone(next, 0);
	return next;
}
function rollLoot(state, loud) {
	const m = state.mission;
	const loc = locById(m.locationId);
	const scout = best(squadOf(state, m.squadIds), "scavenge");
	let r = state.rng;
	const got = {};
	const mult = (loud ? 1.25 : .75) * (.7 + scout.skills.scavenge / 14);
	for (const [k, pair] of Object.entries(loc.loot)) {
		const n = range(r, pair[0], pair[1]);
		r = n.r;
		const amt = Math.max(0, Math.round(n.n * mult * (.6 + stepNoise(r))));
		r = r + 17 | 0;
		if (amt > 0) got[k] = amt;
	}
	if (loud) {
		const w = chance(r, .22);
		r = w.r;
		if (w.ok) {
			const wp = pick(r, [
				"knife",
				"bat",
				"pistol",
				"axe"
			]);
			r = wp.r;
			nextWeapon(state, scout.id, wp.item);
		}
	}
	return {
		state: {
			...state,
			rng: r
		},
		got
	};
}
function stepNoise(r) {
	return (r >>> 0) % 1e3 / 1e3;
}
function nextWeapon(state, id, w) {
	const cur = byId(state, id);
	if (WEAPONS[w].melee > WEAPONS[cur.weapon].melee || WEAPONS[w].gun && !WEAPONS[cur.weapon].gun) state.survivors = state.survivors.map((s) => s.id === id ? {
		...s,
		weapon: w
	} : s);
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
	const moodPick = pick(r, [
		"grateful",
		"wary",
		"hostile",
		"hurt"
	]);
	r = moodPick.r;
	const pos = pick(r, TRAITS.filter((t) => t.kind === "pos"));
	r = pos.r;
	const neg = pick(r, TRAITS.filter((t) => t.kind === "neg"));
	r = neg.r;
	const bodies = {
		grateful: `${nm.name}從${m.zoneName}的櫃子後面爬出來，雙手空著。「我跟了你們一路。別開槍。我能幫忙。」`,
		wary: `${nm.name}用一根鐵管指著門口。「東西是我先看到的。你們要過，拿換的來。」眼神很活，不像被咬過。`,
		hostile: `暗處有上膛聲。${nm.name}（${occ.item.name}）已經把你們當入侵者。「放下袋子。走。或留下。」`,
		hurt: `${nm.name}靠在牆邊，小腿滲血，還醒著。「別留下我。求你們。我以前是${occ.item.name}。」`
	};
	const enc = {
		name: nm.name,
		occupation: occ.item.id,
		portrait: occ.item.portrait,
		body: bodies[moodPick.item],
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
function attract(state, extra) {
	const m = state.mission;
	const ls = state.locations[m.locationId];
	const loc = locById(m.locationId);
	const add = Math.min(8, extra);
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
function hurt(state, id, dmg, infectP, cause) {
	const s = byId(state, id);
	if (!s || !s.alive) return state;
	let r = state.rng;
	const inf = chance(r, infectP);
	r = inf.r;
	const hp = s.hp - dmg;
	const dead = hp <= 0;
	let next = mapSur({
		...state,
		rng: r
	}, id, (x) => ({
		...x,
		hp: Math.max(0, hp),
		infected: x.infected || !dead && inf.ok,
		alive: !dead,
		death: dead ? cause : x.death,
		morale: clamp(x.morale - (dead ? 0 : 6), 0, 100)
	}));
	if (dead) {
		next = pushLog(next, `${s.name}死了。${cause}`);
		next = checkWipe(next);
	} else if (inf.ok) next = pushLog(next, `${s.name}被咬到了。傷口不乾淨。`);
	return next;
}
function checkWipe(state) {
	if (living(state).length > 0) return state;
	return {
		...state,
		screen: "end",
		ended: {
			kind: "lose",
			reason: `第 ${state.day} 天，最後一個倖存者也沒回來。美國還在，只是沒有人記得你們。`
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
			promptTitle: m.zoneName,
			promptBody: "這一帶暫時清乾淨了。可以搜，也可以走。",
			choices: zoneChoices({
				...m,
				searched: m.searched
			}, state.resources.ammo)
		}
	};
	const choices = [
		{
			id: "melee",
			label: "近戰",
			hint: "安靜，容易受傷",
			danger: true
		},
		{
			id: "gun",
			label: "開槍",
			hint: `耗彈、很吵、有效  · 彈藥 ${state.resources.ammo}`,
			danger: true,
			disabled: state.resources.ammo <= 0 || !squad.some((s) => WEAPONS[s.weapon].gun)
		},
		{
			id: "flank",
			label: "包抄",
			hint: "需要潛行",
			disabled: best(squad, "stealth").skills.stealth < 6
		},
		{
			id: "back",
			label: "先不打"
		}
	];
	return {
		...state,
		mission: {
			...m,
			phase: "fight",
			promptTitle: `接觸 · ${ls.zombies} 隻`,
			promptBody: `${m.zoneName}裡有東西在轉頭。選怎麼打——打完，這地方才有可能變成下一個家。`,
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
	const fighter = style === "flank" ? best(squad, "stealth") : style === "gun" ? squad.find((s) => WEAPONS[s.weapon].gun) ?? best(squad, "combat") : best(squad, "combat");
	const w = WEAPONS[fighter.weapon];
	let power = fighter.skills.combat * 8 + w.melee * 2;
	let ammoUse = 0;
	let noise = 1;
	if (style === "gun") {
		ammoUse = Math.min(state.resources.ammo, 2 + Math.floor(ls.zombies / 8));
		power += 18 + ammoUse * 6;
		noise = 8;
	} else if (style === "flank") {
		power += fighter.skills.stealth * 4;
		noise = 2;
	} else noise = 3;
	const zPow = ls.zombies * 7 + m.noise;
	const rollA = range(r, 80, 120);
	r = rollA.r;
	const rollB = range(r, 80, 120);
	r = rollB.r;
	const score = power * (rollA.n / 100) - zPow * (rollB.n / 100);
	let kills = 1;
	if (style === "gun") kills = 2 + Math.floor(ammoUse / 2);
	if (style === "flank") kills = 1 + (fighter.skills.stealth >= 8 ? 2 : 1);
	if (score > 25) kills += 2;
	else if (score > 0) kills += 1;
	kills = Math.min(ls.zombies, kills);
	let next = {
		...state,
		rng: r,
		resources: {
			...state.resources,
			ammo: state.resources.ammo - ammoUse
		}
	};
	next = killZombies(next, kills);
	next = attract(next, noise);
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
	if (dmg > 0) next = hurt(next, fighter.id, dmg, infectP, "在任務中被撕開");
	if (next.ended) return next;
	if (squadOf(next, m.squadIds).length === 0) {
		next = pushLog(next, `外出小隊全軍覆沒。${locById(m.locationId).name}把人吞了。`);
		return finishMission(next, false);
	}
	const body = score > 20 ? `${fighter.name}解決了 ${kills} 隻。還剩 ${left}。` : score > 0 ? `打贏了，但不乾淨。清掉 ${kills} 隻，還剩 ${left}。${fighter.name}喘得很重。` : `${fighter.name}幾乎被壓住。清掉 ${kills} 隻，還剩 ${left}。必須決定要不要撤。`;
	const cleared = left === 0;
	next = {
		...next,
		mission: {
			...next.mission,
			phase: "zone",
			promptTitle: cleared ? "清場" : m.zoneName,
			promptBody: cleared ? `${body} 聽不到拖步了。如果願意，這裡可以成為下一座庇護所。` : body,
			choices: zoneChoices(next.mission, next.resources.ammo)
		}
	};
	next = pushLog(next, `${fighter.name}在${m.zoneName}戰鬥，消滅 ${kills} 隻。`);
	return next;
}
function doSearch(state, loud) {
	const m = state.mission;
	const scout = best(squadOf(state, m.squadIds), loud ? "scavenge" : "stealth");
	let next = { ...state };
	const loot = rollLoot(next, loud);
	next = loot.state;
	const bag = addRes(m.bag, loot.got);
	const noiseAdd = loud ? 5 : 1;
	next = attract({
		...next,
		mission: {
			...m,
			bag,
			searched: true,
			noise: m.noise + noiseAdd
		}
	}, loud ? 2 : 0);
	const bits = Object.entries(loot.got).filter(([, v]) => v > 0).map(([k, v]) => `${labelRes(k)} ${v}`);
	const found = bits.length ? bits.join("、") : "幾乎是空的";
	const sneak = !loud && scout.skills.stealth >= 7;
	let body = loud ? `${scout.name}把抽屜整個拉開。聲音很大。找到：${found}。` : `${scout.name}貼著牆翻。找到：${found}。${sneak ? "幾乎沒弄出聲。" : ""}`;
	next = {
		...next,
		mission: {
			...next.mission,
			promptTitle: m.zoneName,
			promptBody: body,
			choices: zoneChoices(next.mission, next.resources.ammo)
		}
	};
	next = maybeEncounter(next);
	if (next.screen === "encounter") return next;
	const horde = chance(next.rng, loud ? .28 : .08 + next.mission.noise / 80);
	next = {
		...next,
		rng: horde.r
	};
	if (horde.ok && next.locations[m.locationId].zombies > 0) {
		next = attract(next, 3);
		next = {
			...next,
			mission: {
				...next.mission,
				promptBody: `${body} 外頭傳來一串回應的呻吟。它們聽到了。`,
				choices: [
					{
						id: "fight",
						label: "迎上去",
						danger: true
					},
					{
						id: "extract",
						label: "立刻撤離",
						danger: true
					},
					{
						id: "next",
						label: "先換房間"
					}
				]
			}
		};
	}
	return next;
}
function labelRes(k) {
	return {
		food: "食物",
		water: "水",
		materials: "建材",
		medicine: "藥品",
		ammo: "彈藥",
		fuel: "燃油"
	}[k] ?? k;
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
				promptTitle: `${locById(m.locationId).name} · ${m.zoneName}`,
				promptBody: "先不打。還可以搜，或撤。",
				choices: zoneChoices(m, state.resources.ammo)
			}
		};
		if (choiceId === "melee" || choiceId === "gun" || choiceId === "flank") return resolveFight(state, choiceId);
	}
	if (choiceId === "search_quiet") return doSearch(state, false);
	if (choiceId === "search_loud") return doSearch(state, true);
	if (choiceId === "fight") return fightPrompt(state);
	if (choiceId === "next") {
		const nxt = m.zoneIndex + 1;
		if (nxt >= m.zoneCount) return {
			...state,
			mission: {
				...m,
				promptTitle: "盡頭",
				promptBody: "這棟能搜的都走完了。可以清場、佔領，或帶著袋子回家。",
				choices: [{
					id: "fight",
					label: "把剩下的清掉",
					danger: true
				}, {
					id: "extract",
					label: "回家"
				}]
			}
		};
		return beginZone(state, nxt);
	}
	if (choiceId === "extract") return finishMission(state, true);
	return state;
}
function finishMission(state, success) {
	const m = state.mission;
	if (!m) return state;
	const loc = locById(m.locationId);
	const ls = state.locations[m.locationId];
	let next = {
		...state,
		resources: success ? addRes(state.resources, m.bag) : state.resources,
		mission: null,
		encounter: null
	};
	const bagBits = Object.entries(m.bag).filter(([, v]) => v > 0).map(([k, v]) => `${labelRes(k)} ${v}`).join("、");
	if (success) next = pushLog(next, `小隊從${loc.name}回來。${bagBits ? `帶回 ${bagBits}。` : "兩手空空。"}`);
	if (ls.zombies === 0 && success && loc.id !== state.shelter.locationId) {
		next = {
			...next,
			screen: "occupy",
			mapTarget: loc.id
		};
		next = pushLog(next, `${loc.name}暫時清場。可以搬過來，把這裡變成更大的家。`);
		return restNight(next, false);
	}
	next = {
		...next,
		screen: "shelter",
		mapTarget: null
	};
	return restNight(next, true);
}
function resolveEncounter(state, action) {
	const enc = state.encounter;
	const m = state.mission;
	if (!enc || !m) return {
		...state,
		screen: "mission",
		encounter: null
	};
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
					promptBody: `${enc.name}看了看你們的人數。「你們住的地方已經滿了。我自己想辦法。」人影沒入走廊。`,
					choices: zoneChoices(m, state.resources.ammo)
				}
			};
			next = pushLog(next, `${enc.name}想加入，但庇護所已滿。`);
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
				next = hurt(next, target.id, 16, .05, "被其他倖存者襲擊");
				if (next.ended) return next;
				next = pushLog(next, `${enc.name}假裝答應，然後動手。`);
				next = {
					...next,
					mission: {
						...next.mission,
						promptBody: `${enc.name}撲上來。衝突很短。人跑了，東西還在。`,
						choices: zoneChoices(next.mission, next.resources.ammo)
					}
				};
				return next;
			}
		}
		const made = makeSurvivor(next.rng, {
			name: enc.name,
			occupation: enc.occupation,
			traits: enc.traits,
			stance: enc.mood === "grateful" || enc.mood === "hurt" ? "friend" : enc.mood === "hostile" ? "rival" : "neutral",
			portrait: enc.portrait,
			weapon: enc.weapon
		});
		next = {
			...next,
			rng: made.r,
			survivors: [...next.survivors, made.s],
			mission: {
				...m,
				promptBody: `${enc.name}點頭，把背包甩到肩上。「走。我不想一個人死在這兒。」`,
				choices: zoneChoices(m, next.resources.ammo)
			}
		};
		next = pushLog(next, `${enc.name}（${occById(enc.occupation).name}）加入了你們。`);
		return next;
	}
	if (action === "turn") {
		next = pushLog(next, `你們讓${enc.name}離開。`);
		next = {
			...next,
			mission: {
				...m,
				promptBody: `${enc.name}咒了一句，退回暗處。也許還會再遇見。`,
				choices: zoneChoices(m, next.resources.ammo)
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
		if (enc.mood === "hurt") next.resources = addRes(next.resources, { medicine: 0 });
		next = {
			...next,
			mission: {
				...m,
				bag,
				promptBody: giveFood > 0 ? `你們丟出食物。${enc.name}扔回來一小包藥，然後消失。` : `${enc.name}看你們口袋空空，啐了一口走了。`,
				choices: zoneChoices({
					...m,
					bag
				}, next.resources.ammo)
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
	next = hurt(next, target.id, atk.n, .04, "與敵對倖存者交火");
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
	next = pushLog(next, `與${enc.name}交火。對方倒在${m.zoneName}。`);
	next = {
		...next,
		mission: {
			...m,
			bag,
			promptBody: `槍聲在${m.zoneName}裡彈了兩下。${enc.name}不再動。你們不是唯一的獵人。`,
			choices: zoneChoices({
				...m,
				bag
			}, next.resources.ammo)
		}
	};
	next = attract(next, 6);
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
	next = pushLog(next, `撤離${old.name}，佔領${loc.name}（${loc.state}）。新家能住 ${loc.occupyCapacity} 人。`);
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
			reason: `第 ${next.day} 天，你們把${loc.name}從廢土裡挖出來。美國還是廢墟，但這座城現在有燈。`
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
	return mapSur(state, id, (s) => ({
		...s,
		job
	}));
}
function kickSurvivor(state, id) {
	const s = byId(state, id);
	if (!s || s.stance === "leader") return state;
	let next = mapSur(state, id, (x) => ({
		...x,
		alive: false,
		death: "被請離隊伍，從此失蹤"
	}));
	next = pushLog(next, `你們讓${s.name}離開。門在後面關上。`);
	return checkWipe(next);
}
function upgradeFacility(state, id) {
	const def = FACILITIES.find((f) => f.id === id);
	const lv = state.shelter.facilities[id];
	if (lv >= def.max) return state;
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
	next = pushLog(next, `${def.name}升到 ${lv + 1} 級。`);
	return next;
}
function restNight(state, fromHome) {
	if (state.ended) return state;
	let next = {
		...state,
		day: state.day + 1
	};
	const home = living(next).filter((s) => !next.mission || !next.mission.squadIds.includes(s.id) || fromHome);
	const kitchen = next.shelter.facilities.kitchen;
	const waterLv = next.shelter.facilities.water;
	const garden = next.shelter.facilities.garden;
	const inf = next.shelter.facilities.infirmary;
	const watch = next.shelter.facilities.watch;
	const people = living(next);
	const eat = Math.max(1, people.length - kitchen);
	const drink = Math.max(1, people.length - waterLv);
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
	let waterGain = waterLv;
	let medUsed = 0;
	let barricade = next.shelter.barricade;
	let radioFind = false;
	let radioPerson = false;
	for (const s of home) {
		if (!s.alive) continue;
		let hp = s.hp;
		let hunger = s.hunger;
		let thirst = s.thirst;
		let fatigue = s.fatigue;
		let morale = s.morale;
		let infected = s.infected;
		let alive = true;
		let death = s.death;
		hunger = clamp(hunger + (hungry ? -28 : 18) - (s.job === "cook" ? -8 : 0), 0, 100);
		thirst = clamp(thirst + (thirsty ? -34 : 22), 0, 100);
		if (s.job === "rest") {
			hp = clamp(hp + 12, 0, s.maxHp);
			fatigue = clamp(fatigue - 35, 0, 100);
			morale = clamp(morale + 4, 0, 100);
		} else fatigue = clamp(fatigue + 12, 0, 100);
		if (s.job === "farm" && garden > 0) foodGain += Math.round(garden * (1 + s.skills.farm / 8));
		if (s.job === "cook" && kitchen > 0) {
			foodGain += 1;
			morale = clamp(morale + 6, 0, 100);
		}
		if (s.job === "repair") barricade = clamp(barricade + 8 + s.skills.build, 0, 100);
		if (s.job === "craft" && next.shelter.facilities.workshop > 0 && next.resources.materials > 0) {
			next.resources = {
				...next.resources,
				materials: next.resources.materials - 1
			};
			barricade = clamp(barricade + 6, 0, 100);
		}
		if (s.job === "tend" && inf > 0) {
			hp = clamp(hp + 4, 0, s.maxHp);
			if (s.infected && next.resources.medicine > 0) {
				const c = chance(next.rng, .35 + s.skills.medical / 20 + inf * .1);
				next = {
					...next,
					rng: c.r
				};
				if (c.ok) infected = false;
				medUsed += 1;
			}
		}
		if (s.job === "radio" && next.shelter.facilities.radio > 0) {
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
		if (hunger <= 0) {
			hp -= 18;
			morale -= 10;
		}
		if (thirst <= 0) {
			hp -= 24;
			morale -= 8;
		}
		if (infected) {
			hp -= 10;
			const worse = chance(next.rng, .18);
			next = {
				...next,
				rng: worse.r
			};
			if (worse.ok && next.resources.medicine <= 0) hp -= 20;
			if (inf > 0 && next.resources.medicine > 0 && s.job !== "tend") {
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
			death = infected ? "感染發作" : hunger <= 0 || thirst <= 0 ? "脫水與飢餓" : "傷勢惡化";
		}
		morale = clamp(morale, 0, 100);
		next = mapSur(next, s.id, (x) => ({
			...x,
			hp: Math.max(0, hp),
			hunger,
			thirst,
			fatigue,
			morale,
			infected,
			alive,
			death,
			daysIn: x.daysIn + 1
		}));
		if (!alive) next = pushLog(next, `${s.name}在夜裡死去。${death}。`);
	}
	const tender = home.find((s) => s.job === "tend" && s.alive);
	if (tender && inf > 0) for (const o of living(next)) {
		if (o.hp < o.maxHp) next = mapSur(next, o.id, (x) => ({
			...x,
			hp: clamp(x.hp + 10 + tender.skills.medical, 0, x.maxHp)
		}));
		if (o.infected && next.resources.medicine > medUsed) {
			const c = chance(next.rng, .4 + tender.skills.medical / 15);
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
				next = pushLog(next, `${tender.name}清掉了${o.name}的感染。`);
			}
		}
	}
	next.resources = {
		...next.resources,
		food: next.resources.food + foodGain,
		water: next.resources.water + waterGain,
		medicine: Math.max(0, next.resources.medicine - medUsed)
	};
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
			next = pushLog(next, `無線電收到雜訊……${p.item.name}（${p.item.state}）的位置被標了下來。`);
		}
	}
	if (radioPerson && living(next).length < next.shelter.capacity) {
		const occ = pick(next.rng, OCCUPATIONS);
		const nm = randomName(occ.r);
		const pos = pick(nm.r, TRAITS.filter((t) => t.kind === "pos"));
		const neg = pick(pos.r, TRAITS.filter((t) => t.kind === "neg"));
		const made = makeSurvivor(neg.r, {
			name: nm.name,
			occupation: occ.item.id,
			traits: [pos.item.id, neg.item.id],
			stance: "neutral"
		});
		next = {
			...next,
			rng: made.r,
			survivors: [...next.survivors, made.s]
		};
		next = pushLog(next, `一個聲音從廢頻裡走來：${made.s.name}找到了你們的門。`);
	}
	const guards = home.filter((s) => s.job === "guard" && s.alive).length;
	const raidP = clamp((100 - barricade) / 220 - guards * .08 - watch * .06, 0, .45);
	const raid = chance(next.rng, raidP);
	next = {
		...next,
		rng: raid.r
	};
	if (raid.ok && living(next).length > 0) {
		const victim = pick(next.rng, living(next).filter((s) => home.some((h) => h.id === s.id)) || living(next));
		next = {
			...next,
			rng: victim.r
		};
		const dmg = range(next.rng, 10, 28);
		next = {
			...next,
			rng: dmg.r
		};
		next = hurt(next, victim.item.id, dmg.n, .2, "夜襲");
		next.resources = {
			...next.resources,
			food: Math.max(0, next.resources.food - 2)
		};
		next.shelter = {
			...next.shelter,
			barricade: clamp(next.shelter.barricade - 8, 0, 100)
		};
		if (!next.ended) next = pushLog(next, `夜襲。東西從圍牆縫裡擠進來。`);
	}
	if (hungry) next = pushLog(next, "存糧不夠。有人空著肚子睡。");
	if (thirsty) next = pushLog(next, "水不夠。喉嚨在夜裡發乾。");
	if (foodGain > 0) next = pushLog(next, `菜園與廚房產出食物 ${foodGain}。`);
	next = checkWipe(next);
	if (next.ended) return next;
	if (next.screen !== "occupy" && next.screen !== "end") next = {
		...next,
		screen: "shelter"
	};
	return next;
}
function daysOfFood(state) {
	const n = Math.max(1, living(state).length - state.shelter.facilities.kitchen);
	if (n <= 0) return 99;
	return Math.floor(state.resources.food / n);
}
function loadSave() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (!data || data.version !== 1) return null;
		if (!Array.isArray(data.survivors)) return null;
		return data;
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
	} catch {}
}
function persist(s) {
	writeSave(s);
	return s;
}
var useGame = create((set, get) => ({
	run: null,
	hasSave: false,
	menu: "title",
	boot: () => {
		set({ hasSave: !!loadSave() });
	},
	openCreate: () => {
		unlockAudio();
		click();
		set({ menu: "create" });
	},
	openTitle: () => set({ menu: "title" }),
	newGame: (input) => {
		unlockAudio();
		ok();
		set({
			run: persist(createNewGame(input)),
			hasSave: true,
			menu: "title"
		});
	},
	continueGame: () => {
		unlockAudio();
		click();
		const run = loadSave();
		if (run) set({
			run,
			hasSave: true
		});
	},
	abandon: () => {
		clearSave();
		set({
			run: null,
			hasSave: false,
			menu: "title"
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
		const kept = run.squadPick.filter((x) => run.survivors.find((s) => s.id === x && s.alive));
		set({ run: persist({
			...run,
			mapTarget: id,
			screen: "squad",
			squadPick: kept.length ? kept : [run.survivors.find((s) => s.alive).id]
		}) });
	},
	goMission: () => {
		const run = get().run;
		if (!run || !run.mapTarget) return;
		ok();
		set({ run: persist(startMission(run, run.mapTarget, run.squadPick)) });
	},
	choose: (id) => {
		const run = get().run;
		if (!run) return;
		click();
		const next = missionChoice(run, id);
		if (next.ended) warn();
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
	sleep: () => {
		const run = get().run;
		if (!run) return;
		const next = restNight(run, true);
		if (next.ended) warn();
		else click();
		set({ run: persist(next) });
	},
	toggleMute: () => {
		const run = get().run;
		const next = !(run?.muted ?? false);
		setMuted(next);
		if (run) set({ run: persist({
			...run,
			muted: next
		}) });
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
var PORTRAIT_IMG = { fire: "/art/p-fire.jpg" };
function Portrait({ survivor, portrait, name, tone, className }) {
	const key = survivor?.portrait ?? portrait ?? "";
	const label = (survivor?.name ?? name ?? "?").slice(0, 1);
	const img = PORTRAIT_IMG[key];
	const bg = tone ?? (survivor ? occById(survivor.occupation).tone : "#3a3a3c");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative overflow-hidden rounded-sm bg-surface-2 outline outline-1 -outline-offset-1 outline-fg/10", className),
		style: img ? void 0 : { background: bg },
		children: [img ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: img,
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
function Meter({ value, max = 100, tone = "hp" }) {
	const pct = Math.max(0, Math.min(100, value / max * 100));
	const color = {
		hp: "bg-hp",
		hunger: "bg-hunger",
		thirst: "bg-thirst",
		stamina: "bg-stamina",
		accent: "bg-accent"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 w-full overflow-hidden rounded-full bg-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("h-full rounded-full", color),
			style: { width: `${pct}%` }
		})
	});
}
function ResourceBar({ state }) {
	const days = daysOfFood(state);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-6 gap-1",
		children: [RESOURCES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-sm bg-surface-2 px-1 py-1.5 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] tracking-wide text-muted",
				children: r.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display tabular-nums text-sm text-fg",
				children: state.resources[r.id]
			})]
		}, r.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sr-only",
			children: [
				"存糧約 ",
				days,
				" 天"
			]
		})]
	});
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg text-fg",
		children
	});
}
var TABS = [
	{
		id: "shelter",
		label: "家園",
		icon: House
	},
	{
		id: "roster",
		label: "人員",
		icon: Users
	},
	{
		id: "build",
		label: "建造",
		icon: Hammer
	},
	{
		id: "map",
		label: "出征",
		icon: Map
	}
];
function TabBar({ screen, onTab }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]",
		children: TABS.map((t) => {
			const on = screen === t.id;
			const Icon = t.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onTab(t.id),
				className: cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] tracking-wide transition-colors duration-[var(--motion-quick)]", on ? "text-fg" : "text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "size-4",
					strokeWidth: on ? 2.2 : 1.8
				}), t.label]
			}, t.id);
		})
	});
}
function TopStatus({ state }) {
	const loc = locById(state.shelter.locationId);
	const n = living(state).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-end justify-between gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[11px] tracking-[0.18em] text-muted uppercase",
				children: [
					"第 ",
					state.day,
					" 天"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg leading-tight tracking-wide",
				children: loc.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-xs text-muted",
				children: [
					loc.state,
					" · ",
					n,
					"/",
					state.shelter.capacity,
					" 人"
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-right",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted",
				children: "圍牆"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display tabular-nums text-lg",
				children: state.shelter.barricade
			})]
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
function CreateScreen() {
	const newGame = useGame((s) => s.newGame);
	const openTitle = useGame((s) => s.openTitle);
	const hasSave = useGame((s) => s.hasSave);
	const [step, setStep] = (0, import_react.useState)(0);
	const [name, setName] = (0, import_react.useState)("Dale Hale");
	const [occupation, setOccupation] = (0, import_react.useState)("firefighter");
	const [posTrait, setPosTrait] = (0, import_react.useState)("strong");
	const [negTrait, setNegTrait] = (0, import_react.useState)("insomnia");
	const [shelterId, setShelterId] = (0, import_react.useState)("farmhouse");
	const occ = OCCUPATIONS.find((o) => o.id === occupation);
	const shelter = START_SHELTERS.find((s) => s.id === shelterId);
	const pos = TRAITS.filter((t) => t.kind === "pos");
	const neg = TRAITS.filter((t) => t.kind === "neg");
	const roll = () => {
		const { input } = randomCreate();
		setName(input.name);
		setOccupation(input.occupation);
		setPosTrait(input.posTrait);
		setNegTrait(input.negTrait);
		setShelterId(input.shelterId);
	};
	const start = () => {
		newGame({
			name,
			occupation,
			posTrait,
			negTrait,
			shelterId
		});
	};
	const titles = [
		"人設",
		"性格",
		"落腳"
	];
	const canNext = (0, import_react.useMemo)(() => {
		if (step === 0) return !!occupation;
		if (step === 1) return !!name.trim() && posTrait && negTrait && posTrait !== negTrait;
		return !!shelterId;
	}, [
		step,
		occupation,
		name,
		posTrait,
		negTrait,
		shelterId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 text-sm text-muted",
					onClick: () => step === 0 ? openTitle() : setStep(step - 1),
					children: "返回"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] tracking-[0.2em] text-muted uppercase",
					children: [
						titles[step],
						" · ",
						step + 1,
						"/3"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 text-sm text-fg",
					onClick: roll,
					children: "隨機"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
			children: [
				step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 text-sm text-muted",
						children: "職業決定你怎麼活、也決定你怎麼死。每局不一樣。"
					}), OCCUPATIONS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOccupation(o.id),
						className: cn("flex w-full items-stretch gap-3 rounded-lg border p-2 text-left transition-colors duration-[var(--motion-quick)]", occupation === o.id ? "border-accent bg-surface-2" : "border-border bg-surface"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							portrait: o.portrait,
							name: o.name,
							tone: o.tone,
							className: "size-16 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 py-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display tracking-wide",
									children: o.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-faint",
									children: o.nameEn
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: o.blurb
							})]
						})]
					}, o.id))]
				}) : null,
				step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								portrait: occ.portrait,
								name,
								tone: occ.tone,
								className: "size-20 shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-1 text-[11px] tracking-wide text-muted",
									children: "姓名"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									maxLength: 24
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: occ.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: "長處 · 選一"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: pos.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPosTrait(t.id),
								className: cn("rounded-md border px-3 py-3 text-left", posTrait === t.id ? "border-accent bg-surface-2" : "border-border bg-surface"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted",
									children: t.blurb
								})]
							}, t.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
							children: "缺陷 · 選一"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2",
							children: neg.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setNegTrait(t.id),
								className: cn("rounded-md border px-3 py-3 text-left", negTrait === t.id ? "border-accent bg-surface-2" : "border-border bg-surface"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted",
									children: t.blurb
								})]
							}, t.id))
						})] })
					]
				}) : null,
				step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "第一夜要有一扇門能鎖。選錯地方，只是死得比較早。 "
						}),
						START_SHELTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setShelterId(s.id),
							className: cn("w-full overflow-hidden rounded-lg border text-left", shelterId === s.id ? "border-accent" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-28",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: s.image,
										alt: "",
										className: "h-full w-full object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-2 left-3 right-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-display tracking-wide",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted",
											children: [
												s.nameEn,
												" · 容量 ",
												s.capacity
											]
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 py-2 text-xs leading-relaxed text-muted",
								children: s.desc
							})]
						}, s.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-faint",
							children: [
								name,
								" · ",
								occ.name,
								" · ",
								TRAITS.find((t) => t.id === posTrait)?.name,
								" / ",
								TRAITS.find((t) => t.id === negTrait)?.name,
								" · ",
								shelter.name
							]
						}),
						hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-hunger",
							children: "開始新局會覆蓋目前的存檔。"
						}) : null
					]
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
			children: step < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				disabled: !canNext,
				onClick: () => setStep(step + 1),
				children: "下一步"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				size: "lg",
				onClick: start,
				children: "進入庇護所"
			})
		})
	] });
}
function Hub({ state, children }) {
	const setScreen = useGame((s) => s.setScreen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopStatus, { state }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceBar, { state })
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
	const sleep = useGame((s) => s.sleep);
	const setScreen = useGame((s) => s.setScreen);
	const loc = locById(state.shelter.locationId);
	const people = living(state);
	const days = daysOfFood(state);
	const infected = people.filter((s) => s.infected).length;
	const briefing = infected ? `${infected} 人帶著咬傷。藥還剩 ${state.resources.medicine}。` : days <= 2 ? `存糧只夠 ${days} 天。該出門了。` : people.length === 1 ? "就你一個。外面還有人——不一定是朋友。" : `${people.length} 個人還活著。圍牆 ${state.shelter.barricade}。`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hub, {
		state,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4 overflow-hidden rounded-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: loc.image,
						alt: "",
						className: "h-44 w-full object-cover"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					className: "w-full",
					onClick: () => setScreen("map"),
					children: "出任務"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "secondary",
					className: "w-full",
					onClick: sleep,
					children: "過夜"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: "今日班表"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-5 space-y-2",
				children: people.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-3 rounded-md bg-surface px-2 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							survivor: s,
							className: "size-10"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-sm",
								children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-[11px] text-faint",
									children: occById(s.occupation).name
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted",
								children: JOBS.find((j) => j.id === s.job)?.name
							})]
						}),
						s.infected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-hp",
							children: "感染"
						}) : null
					]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
				children: "日誌"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogList, { state })
		]
	});
}
function RosterScreen({ state }) {
	const job = useGame((s) => s.job);
	const kick = useGame((s) => s.kick);
	const people = state.survivors.filter((s) => s.alive);
	const dead = state.survivors.filter((s) => !s.alive);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hub, {
		state,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "留守的人經營這棟房子。任務期間他們按班表做事。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: people.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SurvivorCard, {
					s,
					onJob: (j) => job(s.id, j),
					onKick: () => kick(s.id)
				}, s.id))
			}),
			dead.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-2 text-[11px] tracking-[0.16em] text-muted uppercase",
					children: "已不在"
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
function SurvivorCard({ s, onJob, onKick }) {
	const occ = occById(s.occupation);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-border bg-surface p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
					survivor: s,
					className: "size-16 shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display tracking-wide",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted",
								children: stanceLabel(s.stance)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted",
							children: [
								occ.name,
								" · ",
								WEAPONS[s.weapon].name,
								" · ",
								s.traits.map((t) => TRAITS.find((x) => x.id === t)?.name).join(" / ")
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									value: s.hp,
									max: s.maxHp,
									tone: "hp"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									value: s.hunger,
									tone: "hunger"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
									value: s.thirst,
									tone: "thirst"
								})
							]
						})
					]
				})]
			}),
			s.infected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-hp",
				children: "傷口在發熱。需要醫務室與藥。"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: `job-${s.id}`,
						children: "工作"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						id: `job-${s.id}`,
						value: s.job,
						onChange: (e) => onJob(e.target.value),
						className: "h-11 min-w-0 flex-1 rounded-md border border-border bg-surface-2 px-3 text-sm text-fg",
						children: JOBS.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: j.id,
							children: j.name
						}, j.id))
					}),
					s.stance !== "leader" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: onKick,
						children: "請離"
					}) : null
				]
			})
		]
	});
}
function BuildScreen({ state }) {
	const upgrade = useGame((s) => s.upgrade);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Hub, {
		state,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "升級這棟房子。建材不夠就出門去拆別人的。"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: FACILITIES.map((f) => {
				const lv = state.shelter.facilities[f.id];
				const maxed = lv >= f.max;
				const cost = f.cost.materials * (lv + 1);
				const extra = f.cost.extra ?? {};
				const extraOk = Object.entries(extra).every(([k, v]) => state.resources[k] >= v * (lv + 1));
				const can = !maxed && state.resources.materials >= cost && extraOk;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display tracking-wide",
								children: [f.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
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
								children: f.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-faint",
								children: f.effect
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: can ? "default" : "secondary",
							disabled: !can,
							onClick: () => upgrade(f.id),
							children: maxed ? "滿級" : `建材 ${cost}`
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-1",
						children: Array.from({ length: f.max }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-1 flex-1 rounded-full", i < lv ? "bg-accent" : "bg-border") }, i))
					})]
				}, f.id);
			})
		})]
	});
}
var STATES = [
	"肯塔基",
	"俄亥俄",
	"印第安納",
	"田納西",
	"密蘇里",
	"伊利諾"
];
function MapScreen({ state }) {
	const setScreen = useGame((s) => s.setScreen);
	const setMapTarget = useGame((s) => s.setMapTarget);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopStatus, { state }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 pb-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResourceBar, { state })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 pb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm leading-relaxed text-muted",
					children: "美國中西部還在地圖上。清光一個地點的僵屍，就能搬進去，換成更大的家。"
				}),
				STATES.map((st) => {
					const list = LOCATIONS.filter((l) => l.state === st && isDiscovered(state, l.id));
					if (list.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mb-2 text-[11px] tracking-[0.2em] text-muted uppercase",
							children: st
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: list.map((loc) => {
								const ls = state.locations[loc.id];
								const home = loc.id === state.shelter.locationId;
								const travel = canTravel(state, loc.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: home || !travel.ok,
									onClick: () => setMapTarget(loc.id),
									className: cn("w-full overflow-hidden rounded-lg border text-left disabled:opacity-50", ls.cleared ? "border-stamina/40" : "border-border"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative h-24",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: loc.image,
												alt: "",
												className: "h-full w-full object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-bg/20" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "absolute bottom-2 left-3 right-3 flex items-end justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-display tracking-wide",
													children: loc.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted",
													children: [
														sizeLabel(loc.size),
														" · ",
														loc.nameEn
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right text-[11px] tabular-nums text-muted",
													children: home ? "目前的家" : ls.cleared ? "已清場" : `僵屍 ${ls.zombies}`
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between px-3 py-2 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loc.blurb }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: home ? "" : loc.fuel > 0 ? `燃油 ${loc.fuel}` : "步行" })]
									})]
								}, loc.id);
							})
						})]
					}, st);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-faint",
					children: "未探明的州與城市，需要無線電，或先佔領鄰近據點。"
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
	const setScreen = useGame((s) => s.setScreen);
	const setSquad = useGame((s) => s.setSquad);
	const goMission = useGame((s) => s.goMission);
	const target = state.mapTarget ? locById(state.mapTarget) : null;
	const people = living(state);
	const pick = state.squadPick;
	if (!target) return null;
	const ls = state.locations[target.id];
	const toggle = (id) => {
		if (pick.includes(id)) {
			const next = pick.filter((x) => x !== id);
			if (next.length) setSquad(next);
			return;
		}
		if (pick.length >= 3) return;
		setSquad([...pick, id]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 text-sm text-muted",
					onClick: () => setScreen("map"),
					children: "返回"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] tracking-[0.16em] text-muted uppercase",
					children: [
						"編隊 · ",
						pick.length,
						"/3"
					]
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
							src: target.image,
							alt: "",
							className: "h-36 w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute bottom-3 left-3 right-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-xl tracking-wide",
								children: target.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									target.state,
									" · ",
									sizeLabel(target.size),
									" · 僵屍 ",
									ls.zombies,
									" · ",
									target.fuel ? `燃油 ${target.fuel}` : "步行可到"
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm leading-relaxed text-muted",
					children: target.desc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs text-faint",
					children: "最多帶三人。留下的人過夜時會按班表做事。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: people.map((s) => {
						const on = pick.includes(s.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggle(s.id),
							className: cn("flex w-full items-center gap-3 rounded-md border p-2 text-left", on ? "border-accent bg-surface-2" : "border-border bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
								survivor: s,
								className: "size-12"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm",
									children: [s.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-[11px] text-faint",
										children: occById(s.occupation).name
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted",
									children: [
										"戰鬥 ",
										s.skills.combat,
										" · 潛行 ",
										s.skills.stealth,
										" · 搜刮 ",
										s.skills.scavenge,
										" · ",
										WEAPONS[s.weapon].name
									]
								})]
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
				disabled: pick.length === 0,
				onClick: goMission,
				children: "出發"
			})
		})
	] });
}
function MissionScreen({ state }) {
	const choose = useGame((s) => s.choose);
	const m = state.mission;
	if (!m) return null;
	const loc = locById(m.locationId);
	const ls = state.locations[m.locationId];
	const squad = m.squadIds.map((id) => state.survivors.find((s) => s.id === id)).filter(Boolean);
	const bagN = Object.values(m.bag).reduce((a, b) => a + b, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] tracking-[0.18em] text-muted uppercase",
					children: [
						loc.state,
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["僵屍 ", ls.zombies] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["噪音 ", m.noise] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["袋 ", bagN] })
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-4 h-36 overflow-hidden rounded-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: m.image,
				alt: "",
				className: "h-full w-full object-cover"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-pretty text-sm leading-relaxed",
				children: m.promptBody
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 px-4",
			children: m.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: c.danger ? "danger" : "secondary",
				className: cn("h-auto min-h-12 w-full justify-between py-3 whitespace-normal"),
				disabled: c.disabled,
				onClick: () => choose(c.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.label }), c.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-normal opacity-70",
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
function EncounterScreen({ state }) {
	const encounter = useGame((s) => s.encounter);
	const enc = state.encounter;
	if (!enc) return null;
	const occ = occById(enc.occupation);
	const full = living(state).length >= state.shelter.capacity;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: state.mission?.image ?? "/art/title.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.2em] text-muted uppercase",
						children: "倖存者"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-end gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portrait, {
							portrait: enc.portrait,
							name: enc.name,
							tone: occ.tone,
							className: "size-28 shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl tracking-wide",
								children: enc.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted",
								children: occ.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-faint",
								children: enc.mood === "grateful" ? "態度：求生" : enc.mood === "wary" ? "態度：戒備" : enc.mood === "hurt" ? "態度：受傷" : "態度：敵對"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-pretty text-sm leading-relaxed",
						children: enc.body
					}),
					full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-hunger",
						children: "庇護所已滿。要帶人走，先升級寢室或請離某人。"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-auto flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "w-full",
								onClick: () => encounter("invite"),
								disabled: full,
								children: "帶回去"
							}),
							enc.mood === "wary" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "w-full",
								onClick: () => encounter("trade"),
								children: "交易"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								className: "w-full",
								onClick: () => encounter("turn"),
								children: "讓開"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "danger",
								className: "w-full",
								onClick: () => encounter("fight"),
								children: "先下手"
							})
						]
					})
				]
			})
		]
	}) });
}
function OccupyScreen({ state }) {
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
				src: loc.image,
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-bg/30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col justify-end gap-4 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.22em] text-muted uppercase",
						children: "可佔領"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl leading-none tracking-wide",
						children: loc.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-pretty text-sm leading-relaxed text-muted",
						children: [
							loc.nameEn,
							"，",
							loc.state,
							"。僵屍暫時清光。搬離",
							old.name,
							"，這裡能住 ",
							loc.occupyCapacity,
							" 人。",
							loc.size === "metro" ? " 佔領一座大都會，灰州就有首都了。" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						onClick: occupy,
						children: "搬到這裡"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "secondary",
						className: "w-full",
						onClick: skipOccupy,
						children: "先回舊家"
					})
				]
			})
		]
	}) });
}
function EndScreen({ state }) {
	const abandon = useGame((s) => s.abandon);
	const openCreate = useGame((s) => s.openCreate);
	const openTitle = useGame((s) => s.openTitle);
	const end = state.ended;
	if (!end) return null;
	const dead = state.survivors.filter((s) => !s.alive);
	const win = end.kind === "win";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: win ? "/art/loc-city.jpg" : "/art/title.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-bg/80" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] tracking-[0.24em] text-muted uppercase",
						children: win ? "一座城" : "全滅"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-4xl tracking-wide",
						children: win ? "ASH STATE" : "沒有人了"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-pretty text-sm leading-relaxed",
						children: end.reason
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted",
						children: [
							"存活 ",
							state.day,
							" 天 · 佔領 ",
							state.occupiedCount,
							" 處 · 失去 ",
							dead.length,
							" 人"
						]
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
							children: "再活一次"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "secondary",
							className: "w-full",
							onClick: () => {
								abandon();
								openTitle();
							},
							children: "標題"
						})]
					})
				]
			})
		]
	}) });
}
function TitleScreen({ muted }) {
	const continueGame = useGame((s) => s.continueGame);
	const openCreate = useGame((s) => s.openCreate);
	const hasSave = useGame((s) => s.hasSave);
	const toggleMute = useGame((s) => s.toggleMute);
	const [localMute, setLocalMute] = (0, import_react.useState)(muted);
	const quiet = muted || localMute;
	const onMute = () => {
		unlockAudio();
		const next = !quiet;
		setLocalMute(next);
		setMuted(next);
		toggleMute();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/art/title.jpg",
				alt: "",
				className: "absolute inset-0 h-full w-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-bg via-bg/55 to-bg/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onMute,
				className: "absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-10 flex size-11 items-center justify-center rounded-md bg-bg/40 text-fg",
				"aria-label": quiet ? "開啟聲音" : "靜音",
				children: quiet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 flex flex-col gap-5 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] tracking-[0.28em] text-muted uppercase",
							children: "Kentucky — The Midwest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-5xl leading-none tracking-[0.12em]",
							children: "ASH STATE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg text-fg/90",
							children: "灰州"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-[22rem] text-pretty text-sm leading-relaxed text-muted",
							children: "選一個人活下去。經營庇護所，派人進入美國廢土搜刮。倖存者可以是同伴，也可以是敵人。死了，就真的死了。"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "w-full",
						onClick: openCreate,
						children: "新的倖存"
					}), hasSave ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "secondary",
						className: "w-full",
						onClick: continueGame,
						children: "繼續"
					}) : null]
				})]
			})
		]
	}) });
}
function AshApp() {
	const boot = useGame((s) => s.boot);
	const run = useGame((s) => s.run);
	const menu = useGame((s) => s.menu);
	const screen = run?.screen ?? (menu === "create" ? "create" : "title");
	(0, import_react.useEffect)(() => {
		boot();
		const on = () => unlockAudio();
		window.addEventListener("pointerdown", on, { once: true });
		return () => window.removeEventListener("pointerdown", on);
	}, [boot]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		window.__ash = {
			screen,
			day: run?.day ?? 0
		};
	}, [screen, run?.day]);
	if (!run) {
		if (menu === "create") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateScreen, {});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { muted: false });
	}
	if (screen === "create") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateScreen, {});
	if (screen === "title") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleScreen, { muted: run.muted });
	if (screen === "end") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EndScreen, { state: run });
	if (screen === "mission") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionScreen, { state: run });
	if (screen === "encounter") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EncounterScreen, { state: run });
	if (screen === "occupy") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OccupyScreen, { state: run });
	if (screen === "squad") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquadScreen, { state: run });
	if (screen === "map") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapScreen, { state: run });
	if (screen === "roster") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RosterScreen, { state: run });
	if (screen === "build") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuildScreen, { state: run });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShelterScreen, { state: run });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AshApp, {});
}
//#endregion
export { Home as component };
