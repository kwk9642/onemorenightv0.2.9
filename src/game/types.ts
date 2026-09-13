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
  | "quiet"
  | "leader"
  | "firstaid"
  | "handy"
  | "brave"
  | "coward"
  | "weak"
  | "insomnia"
  | "selfish";

export type JobId = "rest" | "cook" | "farm" | "guard" | "repair" | "tend" | "radio" | "craft";

export type FacilityId =
  | "beds"
  | "kitchen"
  | "water"
  | "workshop"
  | "infirmary"
  | "garden"
  | "radio"
  | "watch";

export type WeaponId = "fists" | "knife" | "axe" | "bat" | "pistol" | "rifle";

export type Size = "outpost" | "town" | "city" | "metro";

export type Stance = "leader" | "friend" | "neutral" | "rival" | "hostile";

export type ResourceId = "food" | "water" | "materials" | "medicine" | "ammo" | "fuel";

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

export interface Survivor {
  id: string;
  name: string;
  occupation: OccupationId;
  traits: TraitId[];
  portrait: string;
  skills: Skills;
  hp: number;
  maxHp: number;
  hunger: number;
  thirst: number;
  morale: number;
  fatigue: number;
  infected: boolean;
  weapon: WeaponId;
  stance: Stance;
  job: JobId;
  alive: boolean;
  death: string;
  daysIn: number;
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
  noise: number;
  promptTitle: string;
  promptBody: string;
  image: string;
  choices: Choice[];
  phase: "zone" | "fight" | "loot";
  fightStyle: "melee" | "gun" | "flank" | null;
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
  posTrait: TraitId;
  negTrait: TraitId;
  shelterId: string;
}

export interface GameState {
  version: number;
  screen: Screen;
  seed: number;
  rng: number;
  day: number;
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
}
