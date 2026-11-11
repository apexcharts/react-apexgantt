// THEME_COLOR_KEYS is a copy of the core's theme defaults table, which the
// core keeps internal (`LightThemeDefaults`). This compares the copy with the
// presets the core does export, built from that table, so a colour added to
// or removed from the core fails here instead of silently resetting (or not
// keeping) a custom colour on a theme toggle. `npm run typecheck` runs the
// matching compile-time check (`ThemeColorKeysInSync` in src/utils.ts).
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DarkTheme, LightTheme } from "apexgantt";
import { THEME_COLOR_KEYS } from "../src/utils.ts";

const OWNED = new Set<string>(THEME_COLOR_KEYS);

describe("THEME_COLOR_KEYS", () => {
  it("names only colours both core presets carry", () => {
    for (const key of THEME_COLOR_KEYS) {
      assert.ok(key in LightTheme, `${key} is not in the core's LightTheme`);
      assert.ok(key in DarkTheme, `${key} is not in the core's DarkTheme`);
    }
  });

  it("covers every colour the core presets own", () => {
    // The presets also hold derived surfaces (tooltipTextColor, toolbarBgColor
    // and so on), each painted from one of the owned colours, so in both
    // presets it equals that colour. A preset key that matches no owned colour
    // in both presets is a new theme colour this list is missing. A new
    // colour that happens to equal an owned one in both presets (as
    // criticalArrowColor and criticalBarColor do today) passes as derived
    // here; the compile-time check catches that case through GanttTheme.
    const light = LightTheme as unknown as Record<string, unknown>;
    const dark = DarkTheme as unknown as Record<string, unknown>;
    const unowned = Object.keys(light).filter(
      (key) =>
        !OWNED.has(key) &&
        !THEME_COLOR_KEYS.some(
          (owned) =>
            JSON.stringify(light[key]) === JSON.stringify(light[owned]) &&
            JSON.stringify(dark[key]) === JSON.stringify(dark[owned]),
        ),
    );
    assert.deepEqual(unowned, [], `core theme colours missing from THEME_COLOR_KEYS: ${unowned.join(", ")}`);
  });
});
