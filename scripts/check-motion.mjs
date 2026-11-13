// Dependency-free browser smoke check: node scripts/check-motion.mjs /path/to/chrome
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const executable =
  process.argv.slice(2).find((arg) => !arg.startsWith("--")) || process.env.CHROME_PATH;
if (!executable) throw new Error("Pass a Chrome/Chromium executable path.");
const profile = await mkdtemp(join(tmpdir(), "novra-motion-"));
const browser = spawn(
  executable,
  [
    "--headless=new",
    "--remote-debugging-port=0",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--user-data-dir=" + profile,
    "about:blank",
  ],
  { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] },
);
let socket;
const errors = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = "";
    const timeout = setTimeout(() => reject(new Error("Browser launch timeout")), 20000);
    browser.on("error", reject);
    browser.stderr.on("data", (data) => {
      output += data;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
  });
  socket = new WebSocket(endpoint);
  await new Promise((resolve) => socket.addEventListener("open", resolve, { once: true }));
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const task = pending.get(message.id);
      if (!task) return;
      clearTimeout(task.timeout);
      pending.delete(message.id);
      message.error ? task.reject(new Error(message.error.message)) : task.resolve(message.result);
    }
    if (message.method === "Runtime.exceptionThrown")
      errors.push(
        message.params.exceptionDetails.exception?.description ||
          message.params.exceptionDetails.text,
      );
  });
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++sequence;
      const timeout = setTimeout(() => {
        pending.delete(id);
        reject(new Error("CDP timeout: " + method));
      }, 20000);
      pending.set(id, { resolve, reject, timeout });
      socket.send(JSON.stringify({ id, method, params, sessionId }));
    });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const command = (method, params) => send(method, params, sessionId);
  await command("Runtime.enable");
  await command("Page.enable");
  const evaluate = async (expression) => {
    const result = await command("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const navigate = async (path) => {
    await command("Page.navigate", { url: "http://127.0.0.1:5173" + path });
    for (let i = 0; i < 80; i++) {
      if (
        await evaluate('!!document.querySelector(".nv-site") && document.readyState === "complete"')
      )
        break;
      await delay(200);
    }
    await delay(2200);
    assert.ok(await evaluate('!!document.querySelector(".nv-site")'), "Page mounted: " + path);
  };
  await command("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate("/?motion-debug");
  console.log(
    "Initial motion:",
    await evaluate(
      '({words:document.querySelectorAll(".nm-word").length, debug:document.querySelector(".nm-debug")?.textContent, reduced:matchMedia("(prefers-reduced-motion: reduce)").matches})',
    ),
    "Runtime errors:",
    errors,
  );
  assert.ok(
    await evaluate('document.querySelectorAll(".nm-word").length > 20'),
    "Split text initialized",
  );
  assert.equal(
    await evaluate('getComputedStyle(document.querySelector(".nm-curtain")).display'),
    "none",
    "Curtain exits",
  );
  assert.equal(
    await evaluate('document.querySelectorAll(".pin-spacer").length'),
    1,
    "Desktop manifesto pin",
  );
  assert.ok(
    await evaluate("document.documentElement.scrollWidth <= innerWidth"),
    "No desktop horizontal overflow",
  );
  assert.equal(
    await evaluate("document.documentElement.dataset.motion"),
    "full",
    "Full motion starts with actual OS preferences",
  );
  const marqueeX = () =>
    evaluate(
      'new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".nv-ticker-track")).transform).m41',
    );
  await evaluate(
    'document.querySelector(".nv-ticker").scrollIntoView({behavior:"instant",block:"center"})',
  );
  await delay(700);
  const tickerBefore = await marqueeX();
  await delay(900);
  const tickerAfter = await marqueeX();
  assert.ok(
    Math.abs(tickerAfter - tickerBefore) > 60,
    "Marquee visibly moves without scroll input",
  );
  console.log("Marquee displacement over 900 ms:", Math.round(tickerAfter - tickerBefore), "px");
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await delay(700);
  await command("Input.dispatchMouseEvent", { type: "mouseMoved", x: 600, y: 400 });
  await delay(450);
  assert.ok(
    await evaluate('document.querySelector(".nm-cursor").classList.contains("is-visible")'),
    "Pointer follower",
  );
  await mkdir("qa/artifacts", { recursive: true });
  const screenshot = async (file) => {
    const result = await command("Page.captureScreenshot", { format: "png" });
    await writeFile(file, Buffer.from(result.data, "base64"));
  };
  await screenshot("qa/artifacts/motion-desktop.png");
  await evaluate(
    'document.querySelector(".nv-manifesto").scrollIntoView({behavior:"instant",block:"start"}); window.scrollBy({top:400,behavior:"instant"})',
  );
  await delay(1300);
  assert.ok(
    await evaluate(
      '[...document.querySelectorAll(".nm-reading-word")].some(el => +getComputedStyle(el).opacity > .8)',
    ),
    "Scroll reveals manifesto words",
  );
  await screenshot("qa/artifacts/motion-manifesto.png");
  await evaluate(
    'document.querySelector(".nv-filter").scrollIntoView({behavior:"instant",block:"center"})',
  );
  await delay(500);
  await evaluate(
    '[...document.querySelectorAll(".nv-filter")].find(el => el.textContent.includes("Skin")).click()',
  );
  await delay(700);
  assert.ok(
    await evaluate(
      'document.querySelectorAll(".nv-treatment-card").length > 0 && document.querySelectorAll(".nv-treatment-card").length < 6',
    ),
    "Treatment filters still work",
  );
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await delay(700);
  await evaluate('document.querySelector(".nv-hero-cta").click()');
  assert.ok(await evaluate('!!document.querySelector("[role=dialog]")'), "Booking modal opens");
  await evaluate('document.querySelector(".nv-modal-close").click()');
  assert.equal(
    await evaluate('!!document.querySelector("[role=dialog]")'),
    false,
    "Booking modal closes",
  );

  // Resize and the explicit visitor setting must clean up pins and split DOM.
  await command("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await command("Emulation.setTouchEmulationEnabled", { enabled: true });
  await delay(1800);
  assert.equal(
    await evaluate('document.querySelectorAll(".pin-spacer").length'),
    0,
    "No mobile pin",
  );
  assert.ok(
    await evaluate("document.documentElement.scrollWidth <= innerWidth"),
    "No mobile horizontal overflow",
  );
  await screenshot("qa/artifacts/motion-mobile.png");
  await evaluate('document.querySelector(".nv-menu-button").click()');
  assert.ok(await evaluate('!!document.querySelector(".nv-mobile-menu")'), "Mobile menu opens");
  await evaluate('document.querySelector(".nv-menu-button").click()');
  await command("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await delay(500);
  assert.ok(
    await evaluate('document.querySelectorAll(".nm-word").length > 20'),
    "OS preference does not silently disable the showcase",
  );
  await evaluate('document.querySelector(".nm-motion-toggle").click()');
  await delay(500);
  assert.equal(
    await evaluate('document.querySelectorAll(".nm-word, .nm-reading-word, .pin-spacer").length'),
    0,
    "Pause reverts splits and pin",
  );
  const pausedX = await marqueeX();
  await delay(500);
  assert.equal(await marqueeX(), pausedX, "Pause stops marquee");
  assert.ok(
    await evaluate('document.querySelectorAll(".nv-treatment-card").length < 6'),
    "Pause preserves the treatment filter",
  );
  await navigate("/?motion-debug");
  assert.ok(
    await evaluate('document.querySelectorAll(".nm-word").length > 20'),
    "Each fresh visit starts with motion automatically",
  );
  assert.equal(
    await evaluate('getComputedStyle(document.querySelector(".nm-motion-toggle")).position'),
    "static",
    "Pause control stays in the footer",
  );
  await delay(2200);
  assert.ok(
    await evaluate('document.querySelectorAll(".nm-word").length > 20'),
    "Resume starts motion while OS reduced motion is still enabled",
  );
  const resumedX = await marqueeX();
  await delay(900);
  assert.ok(Math.abs((await marqueeX()) - resumedX) > 60, "Resume restarts marquee");

  await command("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await command("Emulation.setTouchEmulationEnabled", { enabled: false });
  await command("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
  });
  await navigate("/gallery?motion-debug");
  assert.ok(
    await evaluate('document.querySelectorAll(".ne-photo-card").length > 0'),
    "Gallery mounted",
  );
  // Exercise client-side route unmount and remount (including split cleanup).
  for (const path of ["/about", "/services", "/"]) {
    await evaluate(`document.querySelector('a[href="${path}"]').click()`);
    await delay(2200);
    assert.equal(await evaluate("location.pathname"), path);
    assert.ok(
      await evaluate('document.querySelector(".nv-site").textContent.length > 100'),
      "Route content remains visible",
    );
  }
  assert.equal(
    await evaluate('document.querySelectorAll(".pin-spacer").length'),
    1,
    "Exactly one pin after route return",
  );
  const returnedX = await marqueeX();
  await delay(900);
  assert.ok(
    Math.abs((await marqueeX()) - returnedX) > 60,
    "Marquee keeps running after client navigation",
  );
  assert.deepEqual(errors, [], "No browser runtime errors");
  if (process.argv.includes("--ui")) {
    const { runUiAudit } = await import("./browser/ui-audit.mjs");
    await runUiAudit({ command, evaluate, navigate, screenshot, delay, errors });
  }
  console.log(
    "PASS: desktop/mobile motion, scroll reading, cursor, filters, booking, menu, reduced motion, and route cleanup.",
  );
  console.log("Screenshots: qa/artifacts/motion-{desktop,manifesto,mobile}.png");
  await send("Browser.close");
} finally {
  socket?.close();
  browser.kill();
}
