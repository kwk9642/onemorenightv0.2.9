export type Screen =
  | "title"
  | "create"
  | "shelter"
  | "roster"
  | "build"
  | "map"
  | "squad"
  | "mission"
  | "encounter"
  | "occupy"
  | "end";

export type OccupationId =
  | "firefighter"
  | "doctor"
  | "officer"
  | "chef"
  | "mechanic"
  | "farmer"
  | "veteran"
  | "burglar";

export type TraitId =
  | "strong"
  | "athletic"
  | "stout"
  | "handy"
  | "hunter"
  | "thickskinned"
  | "fastlearner"
  | "keenhearing"
  | "brawler"
  | "gymnast"
  | "brave"
  | "lucky"
  | "organized"
  | "quiet"
  | "inconspicuous"
  | "adrenaline"
  | "wakeful"
  | "catseyes"
  | "firstaid"
  | "dextrous"
  | "lighteater"
  | "lowthirst"
  | "outdoorsman"
  | "gardener"
  | "irongut"
  | "leader"
  | "coward"
  | "weak"
  | "unfit"
  | "thinskinned"
  | "insomnia"
  | "slowlearner"
  | "slowhealer"
  | "underweight"
  | "overweight"
  | "highthirst"
  | "hemophobic"
  | "asthmatic"
  | "smoker"
  | "pacifist"
  | "conspicuous"
  | "heartyappetite"
  | "agoraphobic"
  | "depressed"
  | "selfish"
  | "proneillness"
  | "unlucky"
  | "weakstomach"
  | "clumsy"
  | "allthumbs"
  | "shortsighted"
  | "sleepyhead"
  | "desensitized"
  | "keencook"
  | "burglarhands"
  | "vehicleknow";

export type SkillId = "combat" | "stealth" | "scavenge" | "medical" | "build" | "farm" | "cook";

export type JobId = "rest" | "cook" | "farm" | "guard" | "repair" | "tend" | "radio" | "craft" | "press";

export type FacilityId =
  | "beds"
  | "kitchen"
  | "water"
  | "workshop"
  | "infirmary"
  | "garden"
  | "radio"
  | "watch"
  | "still";

export type WeaponId =
  | "fists"
  | "knife"
  | "huntingknife"
  | "cleaver"
  | "machete"
  | "crowbar"
  | "bat"
  | "nailbat"
  | "nightstick"
  | "hammer"
  | "wrench"
  | "golf"
  | "pan"
  | "woodaxe"
  | "axe"
  | "sledge"
  | "spear"
  | "katana"
  | "pistol"
  | "revolver"
  | "shotgun"
  | "rifle"
  | "assault"
  | "smg";

export type EquipSlot = "weapon" | "head" | "body" | "hands" | "legs" | "feet" | "back";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Size = "outpost" | "town" | "city" | "metro";

export type Stance = "leader" | "friend" | "neutral" | "rival" | "hostile";

export type Relation = "stranger" | "known" | "friend" | "lover";

export type ResourceId = "food" | "water" | "materials" | "medicine" | "ammo" | "fuel";

export type LayoutId = "house" | "shop" | "ward" | "city";

export interface Skills {
  combat: number;
  stealth: number;
  scavenge: number;
  medical: number;
  build: number;
  farm: number;
  cook: number;
}

export interface Resources {
  food: number;
  water: number;
  materials: number;
  medicine: number;
  ammo: number;
  fuel: number;
}

export interface GearItem {
  uid: string;
  defId: string;
  cond: number;
}

export type Worn = Partial<Record<EquipSlot, GearItem>>;

export interface Survivor {
  id: string;
  name: string;
  occupation: OccupationId;
  traits: TraitId[];
  portrait: string;
  skills: Skills;
  skillXp: Skills;
  skillBase: Skills;
  lastSkillUp: { skill: SkillId; level: number; day: number } | null;
  hp: number;
  maxHp: number;
  hunger: number;
  thirst: number;
  morale: number;
  fatigue: number;
  infected: boolean;
  ailments?: import("./herbs").Ailment[];
  weapon: WeaponId;
  worn: Worn;
  stance: Stance;
  job: JobId;
  alive: boolean;
  death: string;
  daysIn: number;
  kills: number;
}

export interface ShelterState {
  locationId: string;
  capacity: number;
  facilities: Record<FacilityId, number>;
  barricade: number;
}

export interface LocationState {
  zombies: number;
  discovered: boolean;
  cleared: boolean;
  occupied: boolean;
  visited: boolean;
  survivorOpen: boolean;
  lootRemaining: Resources;
  threat: number;
  noiseToday: number;
  alertLevel: number;
  infection?: number;
  baseZombies?: number;
}

export interface Choice {
  id: string;
  label: string;
  hint?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface MissionState {
  locationId: string;
  squadIds: string[];
  zoneIndex: number;
  zoneCount: number;
  zoneName: string;
  searched: boolean;
  bag: Resources;
  finds: GearItem[];
  noise: number;
  promptTitle: string;
  promptBody: string;
  image: string;
  choices: Choice[];
  phase: "zone" | "fight" | "loot";
  fightStyle: "melee" | "gun" | "flank" | null;
  foe?: import("./zombies").ZombieKind;
  kills: number;
}

export interface EncounterState {
  name: string;
  occupation: OccupationId;
  portrait: string;
  body: string;
  mood: "grateful" | "wary" | "hostile" | "hurt";
  skills: Skills;
  weapon: WeaponId;
  traits: TraitId[];
}

export interface LogEntry {
  day: number;
  text: string;
}

export interface EndState {
  kind: "lose" | "win";
  reason: string;
}

export interface CreateInput {
  name: string;
  occupation: OccupationId;
  portrait: string;
  traits: TraitId[];
  alloc: Partial<Skills>;
  shelterId: string;
  mode?: PlayMode;
  scenario?: "late" | null;
  sandbox?: SandboxOpts;
}

export type PlayMode = "casual" | "normal" | "extinct" | "sandbox";

export interface SandboxOpts {
  companions: number;
  customStash: boolean;
  food: number;
  water: number;
  materials: number;
  medicine: number;
  ammo: number;
  fuel: number;
  lootMul: number;
  zedMul: number;
  raidCap: number;
  maxAP: number;
  infectMul: number;
  permadeath: boolean;
  chicagoWins: boolean;
  ignoreBeds: boolean;
}

export type SkillNotice = {
  kind: "skill";
  name: string;
  skill: SkillId;
  level: number;
};

export type DispatchTask = "herbs" | "supplies" | "forage" | "auto";

export type DispatchFocus = "herbs" | "supplies" | "forage";

export interface DispatchParty {
  id: string;
  memberIds: string[];
  task: DispatchTask;
  sentDay: number;
  returnDay: number;
  destId: string;
  hungry: boolean;
  delayed?: boolean;
}

export interface GameState {
  version: number;
  screen: Screen;
  seed: number;
  rng: number;
  day: number;
  dayAP: number;
  maxAP: number;
  survivors: Survivor[];
  shelter: ShelterState;
  resources: Resources;
  locations: Record<string, LocationState>;
  log: LogEntry[];
  mission: MissionState | null;
  encounter: EncounterState | null;
  squadPick: string[];
  mapTarget: string | null;
  ended: EndState | null;
  muted: boolean;
  occupiedCount: number;
  bonds: Record<string, number>;
  stash: GearItem[];
  notices: SkillNotice[];
  dispatches: DispatchParty[];
  mode: PlayMode;
  scenario?: "late" | null;
  sandbox?: SandboxOpts;
  stillCooldown: number;
  herbs?: import("./herbs").HerbStack[];
}
