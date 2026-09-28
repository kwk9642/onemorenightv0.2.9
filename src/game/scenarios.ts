/** Scenario chapters, in menu order. Append the next one at the bottom. */
export const SCENARIOS = ["late"] as const;

export type ScenarioId = (typeof SCENARIOS)[number];
