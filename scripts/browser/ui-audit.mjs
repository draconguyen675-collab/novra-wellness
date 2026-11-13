import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

export async function runUiAudit({ command, evaluate, navigate, screenshot, delay, errors }) {
  const source = await readFile(
    new URL("../../src/app/screen-directory.ts", import.meta.url),
    "utf8",
  );
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext },
  }).outputText;
  const { SCREENS } = await import(
    "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
  );
  const failures = [];
  const results = [];
  const check = (condition, message) => {
    if (!condition) failures.push(message);
  };
  const resize = (width, height) =>
    command("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 600,
    });
  const layout = () =>
    evaluate(`(() => {
    const root = document.documentElement;
    const nested = [...document.querySelectorAll('.np-tabs, .nb-options')].filter(el => {
      const style = getComputedStyle(el);
      return /auto|scroll/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 2;
    }).map(el => el.className);
    const hidden = [...document.querySelectorAll('.nv-reveal,.np-reveal,.nl-reveal,.na-reveal')].filter(el => {
      const rect = el.getBoundingClientRect(), style = getComputedStyle(el);
      return rect.top < innerHeight * .85 && rect.bottom > 100 && rect.width > 10 && rect.height > 10 &&
        (style.visibility === 'hidden' || Number(style.opacity) < .03);
    }).map(el => el.className);
    const badge = document.querySelector('.nm-motion-toggle');
    return { overflow: root.scrollWidth > innerWidth + 1, width: root.scrollWidth, nested, hidden,
      floatingMotion: badge && getComputedStyle(badge).position === 'fixed',
      bodyLocked: getComputedStyle(document.body).overflow === 'hidden',
      heading: document.querySelector('h1')?.textContent };
  })()`);
  // Keep the real failure condition from the user's machine throughout the audit.
  await command("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  for (const width of [1440, 390]) {
    await resize(width, width === 1440 ? 960 : 844);
    for (const [id, label, path] of SCREENS) {
      await navigate(path);
      const state = await layout();
      check(Boolean(state.heading), width + " " + path + ": missing heading");
      check(!state.overflow, width + " " + path + ": horizontal overflow " + state.width);
      check(
        !state.nested.length,
        width + " " + path + ": nested scrolling " + state.nested.join(", "),
      );
      check(!state.floatingMotion, width + " " + path + ": floating motion control");
      check(!state.bodyLocked, width + " " + path + ": document scroll locked");
      for (const fraction of [0.25, 0.5, 0.75, 1]) {
        await evaluate(
          `window.scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*${fraction},behavior:"instant"})`,
        );
        await delay(850);
        const scrolled = await layout();
        check(!scrolled.overflow, width + " " + path + ": overflow at " + fraction);
        check(
          !scrolled.hidden.length,
          width +
            " " +
            path +
            ": hidden sections at " +
            fraction +
            " " +
            scrolled.hidden.join(", "),
        );
      }
      const footer = await evaluate(`(() => {
        const button = document.querySelector('.nv-footer .nv-button--light');
        if (!button) return null;
        return {color:getComputedStyle(button).color, background:getComputedStyle(button).backgroundColor};
      })()`);
      check(
        footer && footer.color !== footer.background && footer.color === "rgb(36, 51, 40)",
        width + " " + path + ": footer CTA contrast",
      );
      results.push({
        width,
        path,
        label,
        documentScroll: !state.bodyLocked,
        horizontalOverflow: state.overflow,
      });
      if (["01", "07", "10", "22"].includes(id))
        await screenshot("qa/artifacts/ui-" + id + "-" + width + "-footer.png");
      console.log("UI", width, id, path, "checked");
    }
  }
  // Additional breakpoint coverage for the pages shown in the user's screenshots.
  for (const width of [360, 768, 1024, 1920]) {
    await resize(width, width < 600 ? 844 : 1000);
    for (const path of ["/", "/packages", "/locations", "/booking"]) {
      await navigate(path);
      const state = await layout();
      check(!state.overflow, width + " " + path + ": breakpoint overflow");
      check(!state.nested.length, width + " " + path + ": nested scrollbar");
      results.push({ width, path, horizontalOverflow: state.overflow });
    }
    console.log("Breakpoints", width, "checked");
  }

  await resize(1440, 960);
  await navigate("/packages");
  await evaluate('document.querySelector(".np-tabs button:last-child").click()');
  await evaluate(
    'document.querySelector(".np-toolbar").scrollIntoView({behavior:"instant",block:"center"})',
  );
  await delay(1400);
  check(!(await layout()).nested.length, "Filtered packages tabs have no inner scrollbar");
  await screenshot("qa/artifacts/packages-filters.png");

  await navigate("/locations");
  await evaluate(
    'document.querySelector(".nl-map").scrollIntoView({behavior:"instant",block:"center"})',
  );
  await delay(1400);
  check(
    await evaluate(
      '!!document.querySelector(".nl-map__preview svg") && document.querySelector(".nl-map__preview").getBoundingClientRect().height >= 280',
    ),
    "Area preview always renders",
  );
  check(
    await evaluate('document.querySelector(".nl-map__preview").href.includes("openstreetmap.org")'),
    "Area preview links to a real map",
  );
  await screenshot("qa/artifacts/locations-map.png");

  // A complete booking through the UI, including confirmation and no contact data storage.
  await navigate("/booking?step=1");
  await evaluate('document.querySelectorAll(".nb-option")[1].click()');
  await evaluate(
    'document.querySelector(".nb-options").scrollIntoView({behavior:"instant",block:"center"})',
  );
  await delay(800);
  await screenshot("qa/artifacts/booking-options.png");
  await evaluate('document.querySelector(".nb-actions > button").click()');
  await delay(900);
  await evaluate('document.querySelectorAll(".nb-days button")[1].click()');
  await evaluate('document.querySelector(".nb-times button:not(:disabled)").click()');
  await evaluate('document.querySelector(".nb-actions > button:last-child").click()');
  await delay(900);
  for (const [name, value] of [
    ["name", "QA Guest"],
    ["email", "qa@example.test"],
  ]) {
    await evaluate(`document.querySelector('input[name="${name}"]').focus()`);
    await command("Input.insertText", { text: value });
  }
  await evaluate(
    'document.querySelector(".nb-checkbox input").click(); document.querySelector("#nb-guest-form").requestSubmit()',
  );
  await delay(1800);
  check(
    await evaluate(
      'location.pathname === "/booking/confirmation" && !!document.querySelector(".nb-confirmation__receipt")',
    ),
    "Booking completes",
  );
  check(
    await evaluate(
      '!JSON.stringify(sessionStorage).includes("qa@example.test") && !JSON.stringify(sessionStorage).includes("QA Guest")',
    ),
    "Booking never stores contact information",
  );
  await screenshot("qa/artifacts/booking-confirmation.png");
  await resize(390, 844);
  await navigate("/packages");
  await evaluate('document.querySelector(".nv-menu-button").click()');
  await command("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
    code: "Escape",
    windowsVirtualKeyCode: 27,
  });
  await delay(300);
  check(
    await evaluate(
      '!document.querySelector(".nv-mobile-menu") && getComputedStyle(document.body).overflow !== "hidden"',
    ),
    "Escape closes menu and restores page scroll",
  );
  check(errors.length === 0, "Browser runtime errors: " + errors.join("\n"));
  await writeFile(
    "qa/artifacts/ui-audit.json",
    JSON.stringify(
      { completedAt: new Date().toISOString(), cases: results.length, results, failures },
      null,
      2,
    ),
  );
  assert.deepEqual(failures, [], "UI audit findings");
  console.log(
    "PASS:",
    results.length,
    "responsive route cases, screenshot regressions and booking flow.",
  );
}
