import type {
  FacilityId,
  JobId,
  OccupationId,
  ResourceId,
  Size,
  Skills,
  TraitId,
  WeaponId,
} from "./types";

export const SAVE_KEY = "ash-state-v1";
export const SAVE_VERSION = 1;

export const OCCUPATIONS: {
  id: OccupationId;
  name: string;
  nameEn: string;
  blurb: string;
  desc: string;
  skills: Skills;
  hp: number;
  weapon: WeaponId;
  start: Partial<Record<ResourceId, number>>;
  portrait: string;
  tone: string;
}[] = [
  {
    id: "firefighter",
    name: "消防員",
    nameEn: "Firefighter",
    blurb: "火場出來的人，扛得住末日。",
    desc: "破門、近戰、把人從廢墟裡拖出來。斧頭在手，很少退。",
    skills: { combat: 7, stealth: 3, scavenge: 5, medical: 4, build: 5, farm: 2, cook: 2 },
    hp: 110,
    weapon: "axe",
    start: { materials: 6, medicine: 2, food: 4, water: 4, fuel: 2 },
    portrait: "fire",
    tone: "#8a4a3a",
  },
  {
    id: "doctor",
    name: "醫生",
    nameEn: "Doctor",
    blurb: "還有人懂怎麼把血止住。",
    desc: "感染、骨折、槍傷——醫院沒了，但手還在。醫藥是硬通貨。",
    skills: { combat: 3, stealth: 4, scavenge: 4, medical: 9, build: 3, farm: 2, cook: 3 },
    hp: 90,
    weapon: "fists",
    start: { medicine: 10, food: 4, water: 5, materials: 2 },
    portrait: "doc",
    tone: "#4a5a6a",
  },
  {
    id: "officer",
    name: "警員",
    nameEn: "Officer",
    blurb: "槍聲以後，法律只剩彈匣。",
    desc: "受過射擊與壓制訓練。彈藥用完之前，還算有秩序。",
    skills: { combat: 8, stealth: 5, scavenge: 4, medical: 3, build: 3, farm: 2, cook: 2 },
    hp: 100,
    weapon: "pistol",
    start: { ammo: 14, food: 3, water: 3, materials: 3, fuel: 2 },
    portrait: "cop",
    tone: "#3a4450",
  },
  {
    id: "chef",
    name: "廚師",
    nameEn: "Chef",
    blurb: "能把過期罐頭變成熱食的人，能留住人。",
    desc: "廚藝讓食物多撐一天，也讓士氣不那麼快垮。",
    skills: { combat: 3, stealth: 4, scavenge: 5, medical: 2, build: 3, farm: 3, cook: 9 },
    hp: 95,
    weapon: "knife",
    start: { food: 12, water: 6, materials: 2 },
    portrait: "chef",
    tone: "#6a5a4a",
  },
  {
    id: "mechanic",
    name: "技工",
    nameEn: "Mechanic",
    blurb: "東西壞了，總有人能焊回去。",
    desc: "圍牆、引擎、無線電——手裡有工具，庇護所才像家。",
    skills: { combat: 4, stealth: 3, scavenge: 6, medical: 2, build: 9, farm: 2, cook: 2 },
    hp: 100,
    weapon: "bat",
    start: { materials: 12, fuel: 5, food: 3, water: 3 },
    portrait: "mech",
    tone: "#4a5a42",
  },
  {
    id: "farmer",
    name: "農夫",
    nameEn: "Farmer",
    blurb: "土地還在，種子就還有用。",
    desc: "懂土壤與季節。菜園升級後，是整座庇護所能活過冬天的理由。",
    skills: { combat: 4, stealth: 4, scavenge: 5, medical: 3, build: 5, farm: 9, cook: 4 },
    hp: 105,
    weapon: "bat",
    start: { food: 8, water: 8, materials: 4 },
    portrait: "farm",
    tone: "#5a4a38",
  },
  {
    id: "veteran",
    name: "退伍軍人",
    nameEn: "Veteran",
    blurb: "戰爭沒結束，只是換了敵人。",
    desc: "戰場直覺還在。近戰與槍法都狠，只是夜裡不太睡。",
    skills: { combat: 9, stealth: 6, scavenge: 4, medical: 4, build: 4, farm: 2, cook: 2 },
    hp: 105,
    weapon: "pistol",
    start: { ammo: 10, food: 3, water: 3, medicine: 2, fuel: 2 },
    portrait: "vet",
    tone: "#3d4a3a",
  },
  {
    id: "burglar",
    name: "竊賊",
    nameEn: "Burglar",
    blurb: "以前進別人家是罪，現在是班表。",
    desc: "開鎖、潛行、聽到腳步就消失。搜刮時很少驚動整條街。",
    skills: { combat: 4, stealth: 9, scavenge: 8, medical: 2, build: 3, farm: 1, cook: 2 },
    hp: 90,
    weapon: "knife",
    start: { food: 3, water: 3, materials: 4, ammo: 4 },
    portrait: "thief",
    tone: "#3a3a3c",
  },
];

export const TRAITS: {
  id: TraitId;
  name: string;
  kind: "pos" | "neg";
  blurb: string;
  combat?: number;
  stealth?: number;
  medical?: number;
  build?: number;
  hp?: number;
  morale?: number;
}[] = [
  { id: "strong", name: "強壯", kind: "pos", blurb: "近戰多一次餘裕。", combat: 1, hp: 15 },
  { id: "quiet", name: "輕手", kind: "pos", blurb: "走路像貓。", stealth: 2 },
  { id: "leader", name: "領導", kind: "pos", blurb: "別人比較願意聽。", morale: 12 },
  { id: "firstaid", name: "急救", kind: "pos", blurb: "會包紮，也會判斷誰先死。", medical: 2 },
  { id: "handy", name: "巧手", kind: "pos", blurb: "釘子與木板聽他的。", build: 2 },
  { id: "brave", name: "無畏", kind: "pos", blurb: "往前衝，不太會蹲。", combat: 1, stealth: -1 },
  { id: "coward", name: "懼屍", kind: "neg", blurb: "看到那東西，手會抖。", combat: -2 },
  { id: "weak", name: "體弱", kind: "neg", blurb: "一場感冒就能躺平。", hp: -20 },
  { id: "insomnia", name: "失眠", kind: "neg", blurb: "夜裡總在聽門外。", morale: -8 },
  { id: "selfish", name: "自私", kind: "neg", blurb: "口袋裡的東西，不一定拿出來分。", morale: -6 },
];

export const START_SHELTERS: {
  id: string;
  locationId: string;
  name: string;
  nameEn: string;
  blurb: string;
  desc: string;
  capacity: number;
  barricade: number;
  image: string;
  facilities: Partial<Record<FacilityId, number>>;
  extras: Partial<Record<ResourceId, number>>;
}[] = [
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
    facilities: { beds: 1, kitchen: 1, garden: 1, water: 1 },
    extras: { food: 6, water: 8, materials: 4 },
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
    facilities: { beds: 1, workshop: 1, kitchen: 1 },
    extras: { materials: 14, fuel: 3, food: 3 },
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
    facilities: { beds: 1, kitchen: 1, radio: 1, water: 1 },
    extras: { food: 4, water: 5, ammo: 4, fuel: 2 },
  },
];

export const FACILITIES: {
  id: FacilityId;
  name: string;
  blurb: string;
  max: number;
  cost: { materials: number; extra?: Partial<Record<ResourceId, number>> };
  effect: string;
}[] = [
  { id: "beds", name: "寢室", blurb: "多一張床，就能多留一個人。", max: 4, cost: { materials: 8 }, effect: "容量 +1" },
  { id: "kitchen", name: "廚房", blurb: "熱食讓食物更耐吃，也讓人比較不像要散。", max: 3, cost: { materials: 6 }, effect: "食物消耗降低" },
  { id: "water", name: "集水器", blurb: "屋頂接雨。沒有它，你得到河裡冒險。", max: 3, cost: { materials: 5 }, effect: "每日產水" },
  { id: "workshop", name: "工坊", blurb: "鋸子、釘子、能修的都在這。", max: 3, cost: { materials: 8 }, effect: "建造與圍牆" },
  { id: "infirmary", name: "醫務室", blurb: "一張乾淨的桌子，勝過在地板上縫。", max: 3, cost: { materials: 7, extra: { medicine: 2 } }, effect: "治療與清感染" },
  { id: "garden", name: "菜園", blurb: "種子比子彈值錢，只是慢。", max: 3, cost: { materials: 6 }, effect: "每日產糧" },
  { id: "radio", name: "無線電", blurb: "廢頻裡有人在呼救，也有人在設局。", max: 2, cost: { materials: 6, extra: { fuel: 1 } }, effect: "發現地點／倖存者" },
  { id: "watch", name: "哨塔", blurb: "先看到，才有機會不打。", max: 2, cost: { materials: 10 }, effect: "降低夜襲" },
];

export const JOBS: { id: JobId; name: string; need?: FacilityId; blurb: string }[] = [
  { id: "rest", name: "休息", blurb: "回血、降疲勞。" },
  { id: "cook", name: "炊事", need: "kitchen", blurb: "把存糧做成熱食。" },
  { id: "farm", name: "耕作", need: "garden", blurb: "菜園產出。" },
  { id: "guard", name: "警戒", blurb: "守夜，擋襲擊。" },
  { id: "repair", name: "修繕", blurb: "補圍牆。" },
  { id: "tend", name: "看護", need: "infirmary", blurb: "治療傷患。" },
  { id: "radio", name: "監聽", need: "radio", blurb: "搜頻道。" },
  { id: "craft", name: "打造", need: "workshop", blurb: "耗材換圍牆與武器。" },
];

export const WEAPONS: Record<WeaponId, { name: string; melee: number; gun: boolean }> = {
  fists: { name: "徒手", melee: 0, gun: false },
  knife: { name: "刀", melee: 6, gun: false },
  axe: { name: "斧", melee: 12, gun: false },
  bat: { name: "球棒", melee: 8, gun: false },
  pistol: { name: "手槍", melee: 2, gun: true },
  rifle: { name: "步槍", melee: 3, gun: true },
};

export const RESOURCES: { id: ResourceId; name: string }[] = [
  { id: "food", name: "食物" },
  { id: "water", name: "水" },
  { id: "materials", name: "建材" },
  { id: "medicine", name: "藥品" },
  { id: "ammo", name: "彈藥" },
  { id: "fuel", name: "燃油" },
];

export interface LocationDef {
  id: string;
  name: string;
  nameEn: string;
  state: string;
  region: "ky" | "oh" | "in" | "tn" | "mo" | "il";
  size: Size;
  blurb: string;
  desc: string;
  zombies: number;
  fuel: number;
  image: string;
  zones: string[];
  loot: Partial<Record<ResourceId, [number, number]>>;
  survivorChance: number;
  occupyCapacity: number;
  occupyFacilities: Partial<Record<FacilityId, number>>;
  occupyBarricade: number;
  neighbors: string[];
  startKnown?: boolean;
  isStart?: boolean;
}

export const LOCATIONS: LocationDef[] = [
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
    zones: ["廚房", "穀倉", "後院"],
    loot: { food: [1, 3], materials: [1, 3] },
    survivorChance: 0.15,
    occupyCapacity: 4,
    occupyFacilities: { beds: 1, kitchen: 1, garden: 1, water: 1 },
    occupyBarricade: 50,
    neighbors: ["muldraugh_wh", "rosewood_pd", "riverside_mart"],
    startKnown: true,
    isStart: true,
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
    zones: ["店面", "倉庫", "後巷"],
    loot: { materials: [3, 8], fuel: [0, 2] },
    survivorChance: 0.2,
    occupyCapacity: 3,
    occupyFacilities: { beds: 1, workshop: 1, kitchen: 1 },
    occupyBarricade: 40,
    neighbors: ["westpoint_town", "louisville_apt"],
    startKnown: true,
    isStart: true,
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
    zones: ["客廳", "走廊", "頂樓水塔"],
    loot: { water: [2, 5], food: [1, 3], ammo: [0, 3] },
    survivorChance: 0.25,
    occupyCapacity: 5,
    occupyFacilities: { beds: 1, kitchen: 1, radio: 1, water: 1 },
    occupyBarricade: 35,
    neighbors: ["louisville_er", "louisville_mall", "westpoint_town"],
    startKnown: true,
    isStart: true,
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
    zones: ["大廳", "槍械庫", "牢房"],
    loot: { ammo: [4, 10], materials: [1, 3], medicine: [0, 2] },
    survivorChance: 0.35,
    occupyCapacity: 4,
    occupyFacilities: { beds: 1, workshop: 1, watch: 1 },
    occupyBarricade: 60,
    neighbors: ["muldraugh_farm", "muldraugh_wh", "march_ridge"],
    startKnown: true,
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
    zones: ["卸貨台", "貨架區", "辦公室", "冷藏間"],
    loot: { food: [4, 10], materials: [4, 8], fuel: [1, 3] },
    survivorChance: 0.25,
    occupyCapacity: 6,
    occupyFacilities: { beds: 1, kitchen: 1, workshop: 1 },
    occupyBarricade: 45,
    neighbors: ["muldraugh_farm", "westpoint_town", "rosewood_pd"],
    startKnown: true,
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
    zones: ["收銀區", "貨架", "後倉"],
    loot: { food: [3, 7], water: [2, 5], medicine: [0, 2] },
    survivorChance: 0.55,
    occupyCapacity: 3,
    occupyFacilities: { beds: 1, kitchen: 1 },
    occupyBarricade: 30,
    neighbors: ["muldraugh_farm", "westpoint_town"],
    startKnown: true,
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
    zones: ["主街", "槍店", "加油站", "民宅"],
    loot: { ammo: [3, 8], fuel: [2, 5], food: [2, 5], materials: [2, 5] },
    survivorChance: 0.3,
    occupyCapacity: 6,
    occupyFacilities: { beds: 1, kitchen: 1, workshop: 1, watch: 1 },
    occupyBarricade: 40,
    neighbors: ["westpoint_shop", "louisville_er", "muldraugh_wh", "riverside_mart"],
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
    zones: ["大門", "俱樂部", "連棟住宅", "地下室"],
    loot: { food: [3, 6], materials: [3, 7], ammo: [1, 4], medicine: [1, 3] },
    survivorChance: 0.4,
    occupyCapacity: 7,
    occupyFacilities: { beds: 2, kitchen: 1, garden: 1, watch: 1 },
    occupyBarricade: 55,
    neighbors: ["rosewood_pd", "louisville_mall"],
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
    zones: ["急診", "藥局", "病房", "停屍間", "屋頂"],
    loot: { medicine: [6, 14], food: [2, 5], materials: [2, 4] },
    survivorChance: 0.45,
    occupyCapacity: 8,
    occupyFacilities: { beds: 2, infirmary: 2, kitchen: 1, water: 1 },
    occupyBarricade: 40,
    neighbors: ["louisville_apt", "louisville_mall", "westpoint_town", "cincinnati"],
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
    zones: ["中庭", "超市", "運動用品", "停車場", "員工通道"],
    loot: { food: [6, 12], materials: [3, 6], ammo: [1, 4], fuel: [1, 3] },
    survivorChance: 0.35,
    occupyCapacity: 10,
    occupyFacilities: { beds: 2, kitchen: 2, workshop: 1, radio: 1 },
    occupyBarricade: 35,
    neighbors: ["louisville_er", "louisville_apt", "fort_knox", "nashville"],
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
    zones: ["崗哨", "營房", "軍械庫", "車庫", "指揮處"],
    loot: { ammo: [10, 20], fuel: [3, 6], medicine: [2, 5], food: [2, 5] },
    survivorChance: 0.2,
    occupyCapacity: 10,
    occupyFacilities: { beds: 2, workshop: 2, watch: 2, infirmary: 1 },
    occupyBarricade: 70,
    neighbors: ["louisville_mall", "nashville"],
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
    zones: ["大橋", "河岸倉庫", "市區藥房", "公寓樓", "電台"],
    loot: { food: [4, 9], medicine: [3, 7], materials: [4, 8], ammo: [2, 6] },
    survivorChance: 0.4,
    occupyCapacity: 12,
    occupyFacilities: { beds: 2, kitchen: 1, radio: 2, water: 1, infirmary: 1 },
    occupyBarricade: 45,
    neighbors: ["louisville_er", "indianapolis", "chicago"],
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
    zones: ["賽車場外", "市區", "醫院側門", "加油站群"],
    loot: { fuel: [4, 10], food: [3, 8], materials: [3, 7], ammo: [2, 6] },
    survivorChance: 0.35,
    occupyCapacity: 12,
    occupyFacilities: { beds: 2, workshop: 2, kitchen: 1, watch: 1 },
    occupyBarricade: 50,
    neighbors: ["cincinnati", "chicago", "stlouis"],
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
    zones: ["百老匯", "唱片行", "超市", "河岸", "診所"],
    loot: { food: [4, 8], medicine: [2, 6], ammo: [2, 5], fuel: [2, 4] },
    survivorChance: 0.4,
    occupyCapacity: 11,
    occupyFacilities: { beds: 2, kitchen: 2, radio: 1, garden: 1 },
    occupyBarricade: 40,
    neighbors: ["louisville_mall", "fort_knox", "memphis", "stlouis"],
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
    zones: ["河港", "市區", "診所", "貨櫃場"],
    loot: { food: [5, 10], fuel: [3, 7], materials: [4, 8], medicine: [1, 4] },
    survivorChance: 0.3,
    occupyCapacity: 11,
    occupyFacilities: { beds: 2, kitchen: 1, workshop: 1, water: 2 },
    occupyBarricade: 42,
    neighbors: ["nashville", "stlouis"],
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
    zones: ["拱門廣場", "河岸", "市區商場", "舊球場", "橋頭"],
    loot: { food: [5, 9], materials: [5, 10], ammo: [3, 7], medicine: [2, 5] },
    survivorChance: 0.5,
    occupyCapacity: 14,
    occupyFacilities: { beds: 3, kitchen: 2, workshop: 1, watch: 1, radio: 1 },
    occupyBarricade: 48,
    neighbors: ["indianapolis", "nashville", "memphis", "chicago"],
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
    zones: ["密歇根大道", "地鐵站", "湖岸醫院", "倉庫區", "高樓避難層", "電台塔"],
    loot: { food: [8, 14], medicine: [4, 10], ammo: [6, 12], materials: [6, 12], fuel: [3, 6] },
    survivorChance: 0.45,
    occupyCapacity: 18,
    occupyFacilities: { beds: 3, kitchen: 2, workshop: 2, infirmary: 2, radio: 2, watch: 2 },
    occupyBarricade: 55,
    neighbors: ["cincinnati", "indianapolis", "stlouis"],
  },
];

export const FIRST_NAMES = [
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
  "Fran",
];

export const LAST_NAMES = [
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
  "Ingram",
];

export const ZONE_FLAVOR: Record<string, string[]> = {
  default: [
    "灰塵在光柱裡轉。什麼東西在遠處倒地。",
    "空氣有甜味，像冰箱解凍了三個星期。",
    "地板上有拖痕，往裡走。",
    "有人在牆上用口紅寫：不要開門。",
  ],
};

export function locById(id: string): LocationDef {
  const loc = LOCATIONS.find((l) => l.id === id);
  if (!loc) throw new Error(`missing location ${id}`);
  return loc;
}

export function occById(id: OccupationId) {
  return OCCUPATIONS.find((o) => o.id === id)!;
}

export function traitById(id: TraitId) {
  return TRAITS.find((t) => t.id === id)!;
}

export function sizeLabel(s: Size): string {
  return { outpost: "據點", town: "小鎮", city: "城市", metro: "大都會" }[s];
}

export function stanceLabel(s: string): string {
  return { leader: "隊長", friend: "同伴", neutral: "中立", rival: "不穩", hostile: "敵對" }[s] ?? s;
}

export const EMPTY_BAG = (): {
  food: number;
  water: number;
  materials: number;
  medicine: number;
  ammo: number;
  fuel: number;
} => ({ food: 0, water: 0, materials: 0, medicine: 0, ammo: 0, fuel: 0 });
