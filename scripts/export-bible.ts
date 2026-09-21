import { writeFileSync } from "node:fs";
import { bible } from "../src/game/catalog";

const data = bible();
writeFileSync("public/One-More-Night-bible.json", JSON.stringify(data, null, 2));
console.log("counts", data.counts);
