// Runs after `rollup -c`. The package is `"type": "module"`, so TypeScript
// reads every `.d.ts` in dist as an ES module, and under `node16` /
// `nodenext` resolution an ES module's relative imports must name their
// file. The declarations tsc emits do not (`from "./types"`), so this:
//
// 1. adds `.js` to each relative specifier in dist/**/*.d.ts, for `import`;
// 2. writes a `.d.cts` twin of each with `.cjs` specifiers, for `require`,
//    so the CommonJS entry is typed as CommonJS rather than as ESM.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;

// `from "./x"`, `from '../x/y'` and `import("./x")`, without an extension.
const RELATIVE = /((?:from\s+|import\s*\(\s*)["'])(\.{1,2}\/[^"']+?)(["'])/g;

function withExtension(source, ext) {
  return source.replace(RELATIVE, (match, head, specifier, quote) =>
    /\.(?:c|m)?js$/.test(specifier) ? match : `${head}${specifier}${ext}${quote}`,
  );
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return entry.name.endsWith(".d.ts") ? [path] : [];
  });
}

const files = walk(DIST);
if (!files.some((file) => file.endsWith("/index.d.ts"))) {
  throw new Error(`dual-types: no index.d.ts under ${DIST}; run rollup first`);
}
for (const file of files) {
  const source = readFileSync(file, "utf8");
  writeFileSync(file, withExtension(source, ".js"));
  writeFileSync(file.replace(/\.d\.ts$/, ".d.cts"), withExtension(source, ".cjs"));
}
console.log(`dual-types: ${files.length} declaration files, each with a .d.cts twin`);
