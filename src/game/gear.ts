import { asset } from "./asset";
import { getLocale, t, type Locale } from "./i18n";
import { chance, pick, range, uid } from "./rng";
import type {
  EquipSlot,
  GameState,
  GearItem,
  OccupationId,
  Rarity,
  Skills,
  Survivor,
  WeaponId,
  Worn,
} from "./types";

export const EQUIP_SLOTS: EquipSlot[] = ["weapon", "head", "body", "hands", "legs", "feet", "back"];

export const RARITY_RANK: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

export const RARITY_CLASS: Record<Rarity, string> = {
  common: "text-muted",
  uncommon: "text-stamina",
  rare: "text-thirst",
  epic: "text-accent",
  legendary: "text-hunger",
};

type Names = Record<Locale, string>;

export interface GearDef {
  id: string;
  slot: EquipSlot;
  rarity: Rarity;
  tags: string[];
  names: Names;
  melee?: number;
  gun?: boolean;
  armor?: number;
  bite?: number;
  combat?: number;
  stealth?: number;
  scavenge?: number;
  medical?: number;
  build?: number;
  farm?: number;
  cook?: number;
  carry?: number;
  fatigue?: number;
  noise?: number;
  morale?: number;
}

function i(
  id: string,
  slot: EquipSlot,
  rarity: Rarity,
  tags: string[],
  names: Names,
  stats: Partial<Omit<GearDef, "id" | "slot" | "rarity" | "tags" | "names">> = {},
): GearDef {
  return { id, slot, rarity, tags, names, ...stats };
}

export const GEAR: GearDef[] = [
  i("knife", "weapon", "common", ["home", "shop"], { zh: "菜刀", en: "Kitchen Knife", ja: "包丁", ko: "식칼" }, { melee: 6 }),
  i("huntingknife", "weapon", "uncommon", ["farm", "home"], { zh: "獵刀", en: "Hunting Knife", ja: "ハンティングナイフ", ko: "사냥칼" }, { melee: 8, stealth: 1 }),
  i("cleaver", "weapon", "uncommon", ["home", "shop"], { zh: "砍骨刀", en: "Meat Cleaver", ja: "肉切り包丁", ko: "식칼도끼" }, { melee: 9, cook: 1 }),
  i("machete", "weapon", "rare", ["farm", "tool"], { zh: "開山刀", en: "Machete", ja: "マチェット", ko: "정글도" }, { melee: 13 }),
  i("crowbar", "weapon", "uncommon", ["tool", "work"], { zh: "撬棍", en: "Crowbar", ja: "バール", ko: "쇠지렛대" }, { melee: 10, build: 1 }),
  i("bat", "weapon", "common", ["home", "shop"], { zh: "球棒", en: "Baseball Bat", ja: "バット", ko: "야구방망이" }, { melee: 8 }),
  i("nailbat", "weapon", "uncommon", ["home", "tool"], { zh: "釘棒", en: "Nailed Bat", ja: "釘バット", ko: "못박은 방망이" }, { melee: 11 }),
  i("nightstick", "weapon", "uncommon", ["police"], { zh: "警棍", en: "Nightstick", ja: "警棒", ko: "경찰봉" }, { melee: 8, combat: 1 }),
  i("hammer", "weapon", "common", ["tool", "work"], { zh: "鐵鎚", en: "Hammer", ja: "ハンマー", ko: "망치" }, { melee: 7, build: 1 }),
  i("wrench", "weapon", "common", ["tool", "work"], { zh: "扳手", en: "Pipe Wrench", ja: "パイプレンチ", ko: "파이프렌치" }, { melee: 7, build: 1 }),
  i("golf", "weapon", "common", ["home", "shop"], { zh: "高爾夫桿", en: "Golf Club", ja: "ゴルフクラブ", ko: "골프채" }, { melee: 6 }),
  i("pan", "weapon", "common", ["home"], { zh: "平底鍋", en: "Frying Pan", ja: "フライパン", ko: "프라이팬" }, { melee: 5, cook: 1 }),
  i("woodaxe", "weapon", "uncommon", ["farm", "tool"], { zh: "柴斧", en: "Wood Axe", ja: "薪割り斧", ko: "장작도끼" }, { melee: 11 }),
  i("axe", "weapon", "rare", ["work", "tool"], { zh: "消防斧", en: "Fire Axe", ja: "消防斧", ko: "소방도끼" }, { melee: 14 }),
  i("sledge", "weapon", "rare", ["tool", "work"], { zh: "大鎚", en: "Sledgehammer", ja: "大鎚", ko: "대형망치" }, { melee: 16, fatigue: 8, noise: 2 }),
  i("spear", "weapon", "rare", ["farm", "tool"], { zh: "長矛", en: "Spear", ja: "槍", ko: "창" }, { melee: 12, stealth: 1 }),
  i("katana", "weapon", "legendary", ["city", "home"], { zh: "武士刀", en: "Katana", ja: "カタナ", ko: "카타나" }, { melee: 18, stealth: 1, combat: 1 }),
  i("pistol", "weapon", "uncommon", ["police", "gun", "home"], { zh: "半自動手槍", en: "Pistol", ja: "拳銃", ko: "권총" }, { melee: 2, gun: true, combat: 1 }),
  i("revolver", "weapon", "rare", ["gun", "home"], { zh: "左輪", en: "Revolver", ja: "リボルバー", ko: "리볼버" }, { melee: 3, gun: true, combat: 1 }),
  i("shotgun", "weapon", "rare", ["gun", "farm", "police"], { zh: "霰彈槍", en: "Shotgun", ja: "ショットガン", ko: "산탄총" }, { melee: 4, gun: true, combat: 2, noise: 3 }),
  i("rifle", "weapon", "rare", ["gun", "farm"], { zh: "獵槍", en: "Hunting Rifle", ja: "猟銃", ko: "사냥소총" }, { melee: 3, gun: true, combat: 2 }),
  i("assault", "weapon", "epic", ["gun", "mil"], { zh: "突擊步槍", en: "Assault Rifle", ja: "アサルト", ko: "돌격소총" }, { melee: 4, gun: true, combat: 3, noise: 2 }),
  i("smg", "weapon", "epic", ["gun", "police", "mil"], { zh: "衝鋒槍", en: "SMG", ja: "SMG", ko: "기관단총" }, { melee: 3, gun: true, combat: 2, noise: 2 }),

  i("cap", "head", "common", ["cloth", "shop"], { zh: "棒球帽", en: "Baseball Cap", ja: "キャップ", ko: "야구모자" }, { morale: 2 }),
  i("beanie", "head", "common", ["cloth", "home"], { zh: "毛帽", en: "Beanie", ja: "ニット帽", ko: "비니" }, { stealth: 1 }),
  i("cowboyhat", "head", "uncommon", ["farm", "cloth"], { zh: "牛仔帽", en: "Cowboy Hat", ja: "カウボーイハット", ko: "카우보이모자" }, { farm: 1, morale: 2 }),
  i("glasses", "head", "uncommon", ["home", "med"], { zh: "眼鏡", en: "Glasses", ja: "眼鏡", ko: "안경" }, { scavenge: 1, medical: 1 }),
  i("hardhat", "head", "common", ["work", "tool"], { zh: "工程盔", en: "Hard Hat", ja: "ヘルメット", ko: "안전모" }, { armor: 8 }),
  i("weldmask", "head", "uncommon", ["work", "tool"], { zh: "焊罩", en: "Welding Mask", ja: "溶接面", ko: "용접면" }, { armor: 10, build: 1, stealth: -1 }),
  i("bikehelm", "head", "uncommon", ["shop", "home"], { zh: "安全帽", en: "Motorcycle Helmet", ja: "バイクヘルメット", ko: "오토바이헬멧" }, { armor: 12, bite: 8 }),
  i("gasmask", "head", "rare", ["med", "mil", "police"], { zh: "防毒面具", en: "Gas Mask", ja: "ガスマスク", ko: "방독면" }, { armor: 8, bite: 22, medical: 1, stealth: -1 }),
  i("firehelm", "head", "rare", ["work"], { zh: "消防盔", en: "Firefighter Helmet", ja: "消防ヘルメット", ko: "소방헬멧" }, { armor: 16, bite: 10 }),
  i("riothelm", "head", "rare", ["police"], { zh: "鎮暴盔", en: "Riot Helmet", ja: "暴動ヘルメット", ko: "진압헬멧" }, { armor: 18, bite: 12, stealth: -1 }),
  i("armyhelm", "head", "epic", ["mil"], { zh: "軍盔", en: "Combat Helmet", ja: "戦闘ヘルメット", ko: "전투헬멧" }, { armor: 22, bite: 14, combat: 1 }),
  i("nvg", "head", "legendary", ["mil"], { zh: "夜視鏡", en: "Night Vision", ja: "ナイトビジョン", ko: "야간투시경" }, { stealth: 2, combat: 1, scavenge: 1 }),

  i("tshirt", "body", "common", ["cloth", "home", "shop"], { zh: "T恤", en: "T-Shirt", ja: "Tシャツ", ko: "티셔츠" }),
  i("hoodie", "body", "common", ["cloth", "home"], { zh: "帽T", en: "Hoodie", ja: "パーカー", ko: "후드티" }, { stealth: 1 }),
  i("apron", "body", "common", ["home"], { zh: "圍裙", en: "Apron", ja: "エプロン", ko: "앞치마" }, { cook: 1 }),
  i("denim", "body", "uncommon", ["cloth", "shop"], { zh: "牛仔外套", en: "Denim Jacket", ja: "デニムジャケット", ko: "청재킷" }, { armor: 6 }),
  i("leather", "body", "uncommon", ["cloth", "shop"], { zh: "皮衣", en: "Leather Jacket", ja: "レザージャケット", ko: "가죽재킷" }, { armor: 10, bite: 6, stealth: -1 }),
  i("raincoat", "body", "uncommon", ["cloth", "shop"], { zh: "雨衣", en: "Raincoat", ja: "レインコート", ko: "우비" }, { stealth: 1 }),
  i("labcoat", "body", "uncommon", ["med"], { zh: "實驗衣", en: "Lab Coat", ja: "白衣", ko: "실험복" }, { medical: 2 }),
  i("huntervest", "body", "uncommon", ["farm"], { zh: "狩獵背心", en: "Hunter Vest", ja: "狩猟ベスト", ko: "사냥조끼" }, { scavenge: 1, stealth: 1 }),
  i("policevest", "body", "rare", ["police"], { zh: "警用防彈", en: "Police Vest", ja: "警察ベスト", ko: "경찰방탄" }, { armor: 18, bite: 10 }),
  i("turnout", "body", "rare", ["work"], { zh: "消防戰鬥服", en: "Turnout Coat", ja: "消防服", ko: "소방복" }, { armor: 16, bite: 8, fatigue: 4 }),
  i("military", "body", "epic", ["mil"], { zh: "軍用夾克", en: "Military Jacket", ja: "軍ジャケット", ko: "군용재킷" }, { armor: 14, combat: 1, stealth: 1 }),
  i("plate", "body", "epic", ["mil"], { zh: "插板背心", en: "Plate Carrier", ja: "プレートキャリア", ko: "플레이트캐리어" }, { armor: 26, bite: 16, fatigue: 8, stealth: -2, noise: 1 }),
  i("riotarmor", "body", "legendary", ["police"], { zh: "鎮暴甲", en: "Riot Armor", ja: "暴動装甲", ko: "진압갑" }, { armor: 32, bite: 20, fatigue: 10, stealth: -2, noise: 2 }),
  i("ghillie", "body", "legendary", ["farm", "mil"], { zh: "吉利服", en: "Ghillie Suit", ja: "ギリースーツ", ko: "길리슈트" }, { stealth: 3, scavenge: 1 }),

  i("latex", "hands", "common", ["med"], { zh: "乳膠手套", en: "Latex Gloves", ja: "ゴム手袋", ko: "라텍스장갑" }, { medical: 1 }),
  i("workgloves", "hands", "common", ["work", "tool"], { zh: "工作手套", en: "Work Gloves", ja: "作業手袋", ko: "작업장갑" }, { build: 1 }),
  i("leathergloves", "hands", "uncommon", ["cloth", "shop"], { zh: "皮手套", en: "Leather Gloves", ja: "皮手袋", ko: "가죽장갑" }, { combat: 1, armor: 4 }),
  i("mechanicgl", "hands", "uncommon", ["work", "tool"], { zh: "機修手套", en: "Mechanic Gloves", ja: "整備手袋", ko: "정비장갑" }, { build: 2 }),
  i("tacticalgl", "hands", "rare", ["mil", "police"], { zh: "戰術手套", en: "Tactical Gloves", ja: "タクティカルグローブ", ko: "전술장갑" }, { combat: 1, stealth: 1 }),
  i("weldglove", "hands", "rare", ["work", "tool"], { zh: "焊工手套", en: "Welding Gloves", ja: "溶接手袋", ko: "용접장갑" }, { build: 2, armor: 6 }),

  i("shorts", "legs", "common", ["cloth", "home"], { zh: "短褲", en: "Shorts", ja: "短パン", ko: "반바지" }, { stealth: 1, fatigue: -2 }),
  i("jeans", "legs", "common", ["cloth", "home", "shop"], { zh: "牛仔褲", en: "Jeans", ja: "ジーンズ", ko: "청바지" }, { armor: 4 }),
  i("cargo", "legs", "uncommon", ["cloth", "shop", "work"], { zh: "工裝褲", en: "Cargo Pants", ja: "カーゴパンツ", ko: "카고바지" }, { scavenge: 1, carry: 1 }),
  i("overalls", "legs", "uncommon", ["farm", "work"], { zh: "吊帶工作服", en: "Overalls", ja: "オーバーオール", ko: "작업멜빵" }, { farm: 1, build: 1 }),
  i("leatherpants", "legs", "rare", ["cloth"], { zh: "皮褲", en: "Leather Pants", ja: "レザーパンツ", ko: "가죽바지" }, { armor: 10, bite: 6 }),
  i("firepants", "legs", "rare", ["work"], { zh: "消防褲", en: "Firefighter Pants", ja: "消防ズボン", ko: "소방바지" }, { armor: 12, bite: 6 }),
  i("milpants", "legs", "epic", ["mil"], { zh: "軍褲", en: "Combat Pants", ja: "戦闘ズボン", ko: "전투바지" }, { armor: 12, stealth: 1, combat: 1 }),

  i("slippers", "feet", "common", ["home"], { zh: "拖鞋", en: "Slippers", ja: "スリッパ", ko: "슬리퍼" }, { stealth: 1, fatigue: -2 }),
  i("sneakers", "feet", "common", ["cloth", "shop", "home"], { zh: "球鞋", en: "Sneakers", ja: "スニーカー", ko: "운동화" }, { stealth: 1 }),
  i("cowboyboots", "feet", "uncommon", ["farm"], { zh: "牛仔靴", en: "Cowboy Boots", ja: "カウボーイブーツ", ko: "카우보이부츠" }, { farm: 1, armor: 4 }),
  i("workboots", "feet", "uncommon", ["work", "tool"], { zh: "工作靴", en: "Work Boots", ja: "作業靴", ko: "작업화" }, { armor: 6, stealth: -1 }),
  i("hiking", "feet", "uncommon", ["farm", "shop"], { zh: "登山鞋", en: "Hiking Boots", ja: "登山靴", ko: "등산화" }, { fatigue: -6, stealth: 1 }),
  i("steeltoe", "feet", "rare", ["work", "tool"], { zh: "鋼頭靴", en: "Steel-Toe Boots", ja: "安全靴", ko: "안전화" }, { armor: 10, build: 1, stealth: -1 }),
  i("combatboots", "feet", "rare", ["mil", "police"], { zh: "戰鬥靴", en: "Combat Boots", ja: "コンバットブーツ", ko: "전투화" }, { armor: 8, combat: 1 }),

  i("fanny", "back", "common", ["shop", "home"], { zh: "腰包", en: "Fanny Pack", ja: "ウエストポーチ", ko: "허리가방" }, { carry: 1, stealth: 1 }),
  i("tote", "back", "common", ["shop", "home"], { zh: "手提袋", en: "Tote Bag", ja: "トート", ko: "토트백" }, { carry: 1 }),
  i("school", "back", "uncommon", ["home", "shop"], { zh: "書包", en: "School Backpack", ja: "通学リュック", ko: "책가방" }, { carry: 2 }),
  i("duffel", "back", "uncommon", ["shop", "home"], { zh: "行李袋", en: "Duffel Bag", ja: "ダッフル", ko: "더플백" }, { carry: 2 }),
  i("hikingpack", "back", "rare", ["farm", "shop"], { zh: "登山包", en: "Hiking Pack", ja: "登山リュック", ko: "등산배낭" }, { carry: 3, fatigue: 2 }),
  i("rucksack", "back", "rare", ["mil"], { zh: "軍用背包", en: "Rucksack", ja: "軍用リュック", ko: "군용배낭" }, { carry: 4 }),
  i("alice", "back", "epic", ["mil"], { zh: "ALICE 背包", en: "ALICE Pack", ja: "ALICEパック", ko: "ALICE 배낭" }, { carry: 5, scavenge: 1 }),
  i("survivorpack", "back", "legendary", ["mil", "city"], { zh: "倖存者背包", en: "Survivor Pack", ja: "サバイバーパック", ko: "생존배낭" }, { carry: 6, scavenge: 1, stealth: 1 }),
];

const BY_ID = new Map(GEAR.map((g) => [g.id, g]));

const VISUAL: Record<string, { img: string; filter?: string }> = {
  knife: { img: "knife" },
  huntingknife: { img: "knife" },
  cleaver: { img: "knife", filter: "sepia(0.35)" },
  machete: { img: "axe", filter: "saturate(0.5) brightness(1.1)" },
  crowbar: { img: "axe", filter: "grayscale(0.7) brightness(0.85)" },
  bat: { img: "bat" },
  nailbat: { img: "bat", filter: "contrast(1.15)" },
  nightstick: { img: "bat", filter: "grayscale(1) brightness(0.7)" },
  hammer: { img: "axe", filter: "sepia(0.4) saturate(0.6)" },
  wrench: { img: "axe", filter: "hue-rotate(200deg) saturate(0.4)" },
  golf: { img: "bat", filter: "brightness(1.2)" },
  pan: { img: "knife", filter: "grayscale(0.3)" },
  woodaxe: { img: "axe", filter: "sepia(0.5)" },
  axe: { img: "axe" },
  sledge: { img: "axe", filter: "grayscale(0.5) contrast(1.2)" },
  spear: { img: "rifle", filter: "sepia(0.4)" },
  katana: { img: "rifle", filter: "grayscale(0.2) brightness(1.2)" },
  pistol: { img: "pistol" },
  revolver: { img: "pistol", filter: "sepia(0.45)" },
  shotgun: { img: "rifle", filter: "contrast(1.1)" },
  rifle: { img: "rifle" },
  assault: { img: "rifle", filter: "grayscale(0.4) brightness(0.9)" },
  smg: { img: "pistol", filter: "grayscale(0.3) brightness(0.85)" },
  cap: { img: "hat" },
  beanie: { img: "hat", filter: "hue-rotate(210deg) saturate(0.55)" },
  cowboyhat: { img: "hat", filter: "sepia(0.7) hue-rotate(5deg)" },
  glasses: { img: "glasses" },
  hardhat: { img: "helm", filter: "sepia(0.8) hue-rotate(5deg) saturate(1.4)" },
  weldmask: { img: "gasmask", filter: "brightness(0.7)" },
  bikehelm: { img: "helm", filter: "grayscale(0.8) brightness(0.75)" },
  gasmask: { img: "gasmask" },
  firehelm: { img: "helm", filter: "sepia(0.6) hue-rotate(-10deg) saturate(1.3)" },
  riothelm: { img: "helm", filter: "grayscale(0.5) contrast(1.15)" },
  armyhelm: { img: "helm" },
  nvg: { img: "gasmask", filter: "hue-rotate(90deg) saturate(0.7) brightness(0.85)" },
  tshirt: { img: "" },
  hoodie: { img: "hoodie" },
  apron: { img: "labcoat", filter: "sepia(0.2) brightness(1.05)" },
  denim: { img: "hoodie", filter: "hue-rotate(200deg) saturate(0.7)" },
  leather: { img: "leather" },
  raincoat: { img: "hoodie", filter: "hue-rotate(160deg) saturate(0.5)" },
  labcoat: { img: "labcoat" },
  huntervest: { img: "vest", filter: "hue-rotate(70deg) saturate(0.8)" },
  policevest: { img: "vest" },
  turnout: { img: "turnout" },
  military: { img: "hoodie", filter: "hue-rotate(70deg) saturate(0.45) brightness(0.85)" },
  plate: { img: "plate" },
  riotarmor: { img: "plate", filter: "grayscale(0.35) contrast(1.15)" },
  ghillie: { img: "hoodie", filter: "hue-rotate(80deg) saturate(1.2)" },
  latex: { img: "gloves", filter: "brightness(1.3) saturate(0.2)" },
  workgloves: { img: "gloves" },
  leathergloves: { img: "gloves", filter: "sepia(0.5)" },
  mechanicgl: { img: "gloves", filter: "grayscale(0.4)" },
  tacticalgl: { img: "gloves", filter: "grayscale(0.7) brightness(0.8)" },
  weldglove: { img: "gloves", filter: "sepia(0.3) brightness(0.75)" },
  shorts: { img: "" },
  jeans: { img: "jeans" },
  cargo: { img: "jeans", filter: "sepia(0.35) hue-rotate(20deg)" },
  overalls: { img: "jeans", filter: "hue-rotate(50deg) saturate(0.7)" },
  leatherpants: { img: "jeans", filter: "sepia(0.8) brightness(0.7)" },
  firepants: { img: "jeans", filter: "sepia(0.7) hue-rotate(-15deg)" },
  milpants: { img: "jeans", filter: "hue-rotate(70deg) saturate(0.5) brightness(0.8)" },
  slippers: { img: "boots", filter: "brightness(1.25) saturate(0.4)" },
  sneakers: { img: "boots", filter: "grayscale(0.3) brightness(1.15)" },
  cowboyboots: { img: "boots", filter: "sepia(0.7)" },
  workboots: { img: "boots" },
  hiking: { img: "boots", filter: "hue-rotate(30deg) saturate(0.7)" },
  steeltoe: { img: "boots", filter: "grayscale(0.4) contrast(1.1)" },
  combatboots: { img: "boots", filter: "grayscale(0.6) brightness(0.8)" },
  fanny: { img: "pack", filter: "brightness(1.2) saturate(0.6)" },
  tote: { img: "pack", filter: "sepia(0.3)" },
  school: { img: "pack" },
  duffel: { img: "pack", filter: "grayscale(0.3)" },
  hikingpack: { img: "pack", filter: "hue-rotate(40deg)" },
  rucksack: { img: "pack", filter: "hue-rotate(70deg) saturate(0.6)" },
  alice: { img: "pack", filter: "hue-rotate(80deg) brightness(0.85)" },
  survivorpack: { img: "pack", filter: "sepia(0.25) contrast(1.1)" },
};

export function visualOf(id: string) {
  return VISUAL[id] ?? { img: "" };
}

export function gearIcon(id: string) {
  const v = visualOf(id);
  return v.img ? asset(`/art/gear/${v.img}.png`) : null;
}

export function gearById(id: string) {
  return BY_ID.get(id);
}

export function itemName(item: GearItem | string) {
  const id = typeof item === "string" ? item : item.defId;
  const def = gearById(id);
  if (!def) return id;
  const loc = getLocale();
  return def.names[loc] ?? def.names.zh;
}

export function labelItem(item: GearItem): string {
  return `${itemName(item)} ${item.cond}%`;
}

function condMul(cond: number) {
  return cond <= 0 ? 0 : 0.35 + (cond / 100) * 0.65;
}

function wornPieces(s: Survivor): GearItem[] {
  const out: GearItem[] = [];
  for (const slot of EQUIP_SLOTS) {
    const it = s.worn?.[slot];
    if (it) out.push(it);
  }
  return out;
}

export function liveWeapon(s: Survivor): { id: string; melee: number; gun: boolean } {
  const it = s.worn?.weapon;
  if (!it || it.cond <= 0) return { id: "fists", melee: 0, gun: false };
  const n = gearById(it.defId);
  if (!n || n.slot !== "weapon") return { id: "fists", melee: 0, gun: false };
  return { id: n.id || "fists", melee: Math.round((n.melee ?? 0) * condMul(it.cond)), gun: !!n.gun };
}

export function gearSkills(s: Survivor): Skills {
  const out: Skills = { combat: 0, stealth: 0, scavenge: 0, medical: 0, build: 0, farm: 0, cook: 0 };
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

export function gearActs(s: Survivor): { wall: number; mend: number; noiseCut: number; heal: number; power: number } {
  const g = gearSkills(s);
  return {
    wall: Math.round(g.build),
    mend: Math.round(g.build),
    noiseCut: Math.max(0, Math.round(g.stealth)),
    heal: Math.round(g.medical) * 2,
    power: Math.round(g.combat) * 4,
  };
}

export function armorOf(s: Survivor): { armor: number; bite: number; noise: number; fatigue: number; carry: number } {
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
  return { armor, bite, noise, fatigue, carry };
}

export function dmgFromArmor(s: Survivor): number {
  return 1 - Math.min(0.52, armorOf(s).armor / 78);
}

export function infectFromArmor(s: Survivor): number {
  return 1 - Math.min(0.48, armorOf(s).bite / 70);
}

export function carryOf(people: Survivor[]): number {
  return people.reduce((n, s) => n + armorOf(s).carry, 0);
}

export function luckMult(s: Survivor): number {
  let m = 1;
  if (s.traits.includes("lucky")) m *= 1.22;
  if (s.traits.includes("unlucky")) m *= 0.78;
  if (s.traits.includes("organized")) m *= 1.1;
  if (s.traits.includes("dextrous")) m *= 1.06;
  return m;
}

export function gearStatBits(def: GearDef): string[] {
  const bits: string[] = [];
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

function signed(n: number) {
  return n > 0 ? `+${n}` : String(n);
}

const LOC_TAGS: Record<string, string[]> = {
  muldraugh_farm: ["farm", "home", "tool", "cloth"],
  westpoint_shop: ["tool", "work", "shop", "cloth"],
  louisville_apt: ["home", "cloth", "bag", "shop"],
  rosewood_pd: ["police", "gun", "armor"],
  muldraugh_wh: ["tool", "work", "bag"],
  riverside_mart: ["shop", "cloth", "bag", "home"],
  westpoint_town: ["shop", "gun", "cloth", "home"],
  march_ridge: ["home", "cloth", "gun"],
  louisville_er: ["med", "cloth", "home"],
  louisville_mall: ["cloth", "bag", "shop"],
  fort_knox: ["mil", "gun", "armor"],
  cincinnati: ["city", "cloth", "gun"],
  indianapolis: ["city", "gun", "armor"],
  nashville: ["city", "cloth", "bag"],
  memphis: ["city", "gun", "tool"],
  stlouis: ["city", "armor", "bag"],
  chicago: ["city", "mil", "gun", "armor"],
  echo_creek: ["farm", "home", "tool", "cloth"],
  doe_valley: ["farm", "home", "cloth"],
  irvington_scrap: ["tool", "work", "bag"],
  rosewood_prison: ["police", "gun", "armor", "mil"],
  brandenburg: ["tool", "work", "shop"],
  louisville_school: ["home", "cloth", "med"],
  valley_station: ["shop", "cloth", "bag"],
  lexington: ["med", "city", "cloth"],
  mammoth_cave: ["farm", "home", "tool"],
  columbus: ["city", "med", "cloth"],
  springfield_il: ["city", "med", "gun"],
  gary: ["work", "tool", "mil", "armor"],
};

function locLuck(id: string) {
  if (id === "fort_knox" || id === "chicago" || id === "rosewood_prison") return 1.85;
  if (id === "gary" || id === "lexington") return 1.55;
  if (id === "rosewood_pd" || id === "louisville_er") return 1.4;
  if (id.includes("louisville") || id === "indianapolis" || id === "springfield_il") return 1.25;
  if (id === "irvington_scrap" || id === "columbus") return 1.15;
  if (id === "riverside_mart" || id === "muldraugh_farm" || id === "echo_creek" || id === "doe_valley") return 0.72;
  if (id === "mammoth_cave") return 0.62;
  return 1;
}

function rollRarity(r: number, luck: number, locMul: number, day: number): { r: number; rarity: Rarity } {
  const late = 1 + Math.min(0.45, Math.max(0, day - 8) * 0.03);
  let common = 54;
  const uncommon = 27;
  const rare = 12 * luck * locMul * late;
  const epic = 5 * luck * locMul * late;
  const legendary = 1.2 * luck * locMul * late;
  if (luck < 1) {
    common += 8;
  }
  const total = common + uncommon + rare + epic + legendary;
  const roll = range(r, 0, Math.floor(total * 10));
  let d = roll.n / 10;
  if ((d -= common) <= 0) return { r: roll.r, rarity: "common" };
  if ((d -= uncommon) <= 0) return { r: roll.r, rarity: "uncommon" };
  if ((d -= rare) <= 0) return { r: roll.r, rarity: "rare" };
  if ((d -= epic) <= 0) return { r: roll.r, rarity: "epic" };
  return { r: roll.r, rarity: "legendary" };
}

function rollCond(r: number, rarity: Rarity) {
  const band: Record<Rarity, [number, number]> = {
    common: [38, 82],
    uncommon: [48, 90],
    rare: [55, 94],
    epic: [68, 100],
    legendary: [80, 100],
  };
  const [a, b] = band[rarity];
  return range(r, a, b);
}

function makeItem(r: number, defId: string, cond: number): { r: number; item: GearItem } {
  const u = uid(r);
  return { r: u.r, item: { uid: u.id, defId, cond } };
}

export function mintGear(r: number, defId: string, cond?: number): { r: number; item: GearItem } {
  const def = gearById(defId);
  const n = cond ?? (def ? rollCond(r, def.rarity).n : 70);
  return makeItem(r, defId, Math.max(1, Math.min(100, n)));
}

export function rollSearchGear(
  r: number,
  locId: string,
  n: { luck: number; carry: number; loud: boolean; day: number; gearP?: number; extraGear?: number },
): { r: number; items: GearItem[] } {
  const tags = LOC_TAGS[locId] ?? ["home", "cloth"];
  const locMul = locLuck(locId);
  let p = 0.38 + n.carry * 0.055 + (n.loud ? 0.1 : 0) + Math.min(0.12, n.day * 0.004) + (n.gearP ?? 0);
  p *= n.luck;
  const items: GearItem[] = [];
  const tries = (n.carry >= 5 ? 3 : n.carry >= 2 ? 2 : 1) + (n.extraGear ?? 0);
  for (let i = 0; i < tries; i++) {
    const hit = chance(r, i === 0 ? p : p * 0.45);
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
  return { r, items };
}

const KIT: Record<string, string[]> = {
  firefighter: ["tshirt", "jeans", "workboots", "axe", "firehelm", "turnout"],
  doctor: ["tshirt", "jeans", "sneakers", "huntingknife", "latex", "labcoat"],
  officer: ["tshirt", "jeans", "combatboots", "pistol", "policevest"],
  chef: ["tshirt", "jeans", "sneakers", "cleaver", "apron"],
  mechanic: ["tshirt", "jeans", "steeltoe", "wrench", "mechanicgl"],
  farmer: ["tshirt", "overalls", "workboots", "woodaxe", "cowboyhat"],
  veteran: ["tshirt", "milpants", "combatboots", "pistol", "military"],
  burglar: ["hoodie", "jeans", "sneakers", "huntingknife", "school"],
};

const KIT_EXTRA: Record<string, string[]> = {
  chef: ["pan"],
  mechanic: ["workgloves"],
  veteran: ["armyhelm"],
};

export function dressSurvivor(
  r: number,
  occ: OccupationId,
  s: Survivor,
): { r: number; s: Survivor; extra: GearItem[] } {
  const ids = KIT[occ] ?? KIT.farmer;
  const worn: Worn = { ...(s.worn ?? {}) };
  let weapon: WeaponId = s.weapon;
  for (const id of ids) {
    const def = gearById(id);
    if (!def) continue;
    const cond = range(r, 68, 92);
    r = cond.r;
    const made = makeItem(r, id, cond.n);
    r = made.r;
    worn[def.slot] = made.item;
    if (def.slot === "weapon") weapon = def.id as WeaponId;
  }
  const extra: GearItem[] = [];
  for (const id of KIT_EXTRA[occ] ?? []) {
    const cond = range(r, 60, 88);
    r = cond.r;
    const made = makeItem(r, id, cond.n);
    r = made.r;
    extra.push(made.item);
  }
  return { r, s: { ...s, worn, weapon }, extra };
}

export function degradeWorn(s: Survivor, slot: EquipSlot, amt: number): Survivor {
  const it = s.worn?.[slot];
  if (!it) return s;
  const cond = Math.max(0, it.cond - amt);
  const worn = { ...s.worn, [slot]: { ...it, cond } };
  const weapon = slot === "weapon" && cond <= 0 ? ("fists" as WeaponId) : s.weapon;
  return { ...s, worn, weapon };
}

export function salvageWorn(s: Survivor): GearItem[] {
  return wornPieces(s);
}

export function repairWorst(items: GearItem[], amount: number): GearItem[] {
  if (!items.length) return items;
  let idx = 0;
  for (let i = 1; i < items.length; i++) if (items[i].cond < items[idx].cond) idx = i;
  if (items[idx].cond >= 100) return items;
  const next = items.slice();
  next[idx] = { ...next[idx], cond: Math.min(100, next[idx].cond + amount) };
  return next;
}