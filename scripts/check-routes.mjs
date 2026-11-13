import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";

const directory = fs.readFileSync(
  new URL("../src/app/screen-directory.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(directory, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { SCREENS } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);
const source = fs.readFileSync(new URL("../src/app/routes.tsx", import.meta.url), "utf8");
const routes = [...source.matchAll(/path:\s*["']([^"']+)["']/g)].map((match) => match[1]);
assert.equal(SCREENS.length, 25);
assert.equal(new Set(SCREENS.map(([id]) => id)).size, 25);
for (const [id, label, url] of SCREENS) {
  const path = url.split("?")[0];
  assert.ok(
    routes.some(
      (route) =>
        route !== "*" && new RegExp("^" + route.replace(/:[^/]+/g, "[^/]+") + "$").test(path),
    ),
    id + " " + label + ": missing route",
  );
}
console.log("Verified", SCREENS.length, "screens and", routes.length, "route definitions.");
