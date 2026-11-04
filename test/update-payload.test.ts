// What <ApexGanttChart> sends to the core update() when its props change.
// Runs on Node's own test runner with its built-in TypeScript type stripping
// (Node 22.18 or later): `npm test`.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { THEME_COLOR_KEYS, resolveOptions, updatePayload } from "../src/utils.ts";

const TASKS = [
  { id: "t1", name: "One", startTime: "01-01-2026", endTime: "01-05-2026" },
  { id: "t2", name: "Two", startTime: "01-06-2026", endTime: "01-09-2026" },
];

/** The component's state after a render with these props. */
function render(props: {
  options?: Record<string, unknown>;
  width?: string | number;
  height?: string | number;
  pixelsPerDay?: number;
  theme?: "light" | "dark";
  tasks?: typeof TASKS;
}) {
  return {
    tasks: props.tasks ?? TASKS,
    resolved: resolveOptions(props.options, props.width, props.height, props.pixelsPerDay, props.theme),
  };
}

describe("updatePayload", () => {
  it("keeps a custom barBackgroundColor through a theme prop toggle", () => {
    const options = { enableTaskDrag: true, barBackgroundColor: "#c00000" };
    const light = render({ options, theme: "light" });
    const dark = render({ options, theme: "dark" });

    assert.deepEqual(updatePayload(light, dark), { theme: "dark", barBackgroundColor: "#c00000" });
    assert.deepEqual(updatePayload(dark, light), { theme: "light", barBackgroundColor: "#c00000" });
  });

  it("keeps the custom colours when options.theme changes", () => {
    const rowBackgroundColors = ["#ffffff", "#f4f4f4"];
    const base = { rowHeight: 40, barBackgroundColor: "#c00000", rowBackgroundColors };
    const payload = updatePayload(
      render({ options: { ...base, theme: "light" } }),
      render({ options: { ...base, theme: "dark" } }),
    );
    assert.deepEqual(payload, { theme: "dark", barBackgroundColor: "#c00000", rowBackgroundColors });
  });

  it("sends a colour changed or removed with the theme as it now is", () => {
    const payload = updatePayload(
      render({ options: { barBackgroundColor: "#c00000", arrowColor: "#333333" }, theme: "light" }),
      render({ options: { barBackgroundColor: "#00a000" }, theme: "dark" }),
    );
    assert.deepEqual(Object.keys(payload).sort(), ["arrowColor", "barBackgroundColor", "theme"]);
    assert.equal(payload.barBackgroundColor, "#00a000");
    assert.equal(payload.arrowColor, undefined);
  });

  it("sends only the theme when no theme colour is set", () => {
    const options = { enableTaskDrag: true, rowHeight: 40 };
    assert.deepEqual(
      updatePayload(render({ options, theme: "light" }), render({ options, theme: "dark" })),
      { theme: "dark" },
    );
  });

  it("does not resend theme colours when the theme stays the same", () => {
    const options = { barBackgroundColor: "#c00000" };
    assert.deepEqual(
      updatePayload(render({ options, pixelsPerDay: 25.7 }), render({ options, pixelsPerDay: 80 })),
      { pixelsPerDay: 80 },
    );
  });

  it("sends every theme-owned colour key set in options", () => {
    const options = Object.fromEntries(THEME_COLOR_KEYS.map((key) => [key, `value-${key}`]));
    const payload = updatePayload(render({ options, theme: "light" }), render({ options, theme: "dark" }));
    assert.equal(Object.keys(payload).length, THEME_COLOR_KEYS.length + 1);
    for (const key of THEME_COLOR_KEYS) assert.equal(payload[key], `value-${key}`);
  });

  it("sends series only when tasks change", () => {
    const options = { barBackgroundColor: "#c00000" };
    const next = [...TASKS, { id: "t3", name: "Three", startTime: "01-10-2026", endTime: "01-12-2026" }];
    assert.deepEqual(updatePayload(render({ options }), render({ options, tasks: [...TASKS] })), {});
    assert.deepEqual(updatePayload(render({ options }), render({ options, tasks: next })), { series: next });
  });
});
