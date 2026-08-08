import * as React from "react";

/* Decrypt Text — adapted from Motiq (https://motiq.dev/components/decrypt-text).
   MIT licensed. Uses inline styles for Vite/TW4 compatibility. */

/* ---- motion primitives ---- */

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisibilityPause(ref, { threshold = 0.1 } = {}) {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const POOL_DISPLAY = "#%&@$?!*+=/{}[]<>~^";
const HOVER_COOLDOWN = 1500;
const CYCLE_SPREAD = 35;
const FLASH_MS = 420;

function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

let _scopeCounter = 0;

export function DecryptText({
  text,
  glyphs,
  speed = 45,
  stagger = 55,
  startDelay = 350,
  jitter = 120,
  trigger = "inview",
  variant = "display",
  loop = 7000,
  retriggerOnHover = true,
  seed = 1,
  as: Tag = "p",
  reducedMotion,
  onDecrypted,
  className,
  style: userStyle,
  ...rest
}) {
  const rootRef = React.useRef(null);
  const charRefs = React.useRef([]);
  const rafRef = React.useRef(null);
  const timerRef = React.useRef(null);
  const lastStartRef = React.useRef(-Infinity);
  const playedRef = React.useRef(false);
  const runRef = React.useRef(0);
  const onDecryptedRef = React.useRef(onDecrypted);
  onDecryptedRef.current = onDecrypted;

  const scopeRef = React.useRef(`mk-dt-${++_scopeCounter}`);
  const scope = scopeRef.current;

  const systemReduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const reduceNow = reducedMotion ?? systemReduced;
  const reduce = reducedMotion ?? (mounted ? systemReduced : false);

  const visible = useVisibilityPause(rootRef, { threshold: 0.12 });

  const pool = glyphs && glyphs.length > 0 ? glyphs : POOL_DISPLAY;

  const words = React.useMemo(() => {
    const out = [];
    let i = 0;
    for (const word of text.split(" ")) {
      const item = [];
      for (const ch of Array.from(word)) {
        item.push({ i, ch });
        i += 1;
      }
      out.push(item);
    }
    return out;
  }, [text]);

  const stop = React.useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const resolveAll = React.useCallback(() => {
    for (const el of charRefs.current) {
      if (!el) continue;
      el.textContent = el.dataset.mkChar ?? el.textContent;
      el.dataset.state = "plain";
    }
  }, []);

  const play = React.useCallback(() => {
    const rng = makeRng(seed + runRef.current * 7919);
    runRef.current += 1;
    stop();

    const cells = charRefs.current.filter((el) => el !== null);
    if (cells.length === 0) return;

    lastStartRef.current = performance.now();
    playedRef.current = true;

    const lockAt = new Float64Array(cells.length);
    const nextAt = new Float64Array(cells.length);
    const locked = new Uint8Array(cells.length);
    cells.forEach((el, idx) => {
      lockAt[idx] = startDelay + idx * stagger + (rng() * 2 - 1) * jitter;
      nextAt[idx] = 0;
      el.dataset.state = "scramble";
      el.textContent = pool.charAt((rng() * pool.length) | 0);
    });

    let remaining = cells.length;
    const t0 = performance.now();

    const frame = () => {
      const now = performance.now() - t0;
      for (let idx = 0; idx < cells.length; idx += 1) {
        if (locked[idx]) continue;
        const el = cells[idx];
        if (now >= (lockAt[idx] ?? 0)) {
          el.textContent = el.dataset.mkChar ?? "";
          el.dataset.state = "lock";
          locked[idx] = 1;
          remaining -= 1;
        } else if (now >= (nextAt[idx] ?? 0)) {
          el.textContent = pool.charAt((rng() * pool.length) | 0);
          nextAt[idx] = now + speed + rng() * CYCLE_SPREAD;
        }
      }
      if (remaining <= 0) {
        rafRef.current = null;
        onDecryptedRef.current?.();
        if (loop !== false && loop > 0) {
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            play();
          }, loop);
        }
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [jitter, loop, pool, seed, speed, stagger, startDelay, stop]);

  React.useLayoutEffect(() => {
    if (reduceNow) {
      stop();
      resolveAll();
      return;
    }
    if (!visible) {
      stop();
      return;
    }
    if (trigger === "hover") {
      if (!playedRef.current) resolveAll();
      return;
    }
    if (!playedRef.current) {
      play();
      return;
    }
    if (loop !== false && loop > 0 && rafRef.current == null && timerRef.current == null) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        play();
      }, Math.min(loop, 3000));
    }
  }, [loop, play, reduceNow, resolveAll, stop, trigger, visible]);

  React.useEffect(() => stop, [stop]);

  const onPointerEnter = React.useCallback(() => {
    if (reduceNow || !retriggerOnHover) return;
    if (rafRef.current != null) return;
    if (performance.now() - lastStartRef.current < HOVER_COOLDOWN) return;
    play();
  }, [play, reduceNow, retriggerOnHover]);

  /* Colors for scramble vs locked chars */
  const scrambleColor = "var(--color-paper-dim, #9a9890)";
  const lockedColor = "var(--color-paper, #e8e6de)";
  const accentColor = "var(--color-amber, #ff8c3d)";

  const css = `
.${scope} [data-mk-char]{color:${lockedColor};}
.${scope} [data-mk-char][data-state="scramble"]{color:${scrambleColor};}
.${scope} [data-mk-char][data-state="lock"]{color:${lockedColor};animation:${scope}-flash ${FLASH_MS}ms cubic-bezier(.2,0,0,1);}
@keyframes ${scope}-flash{0%{color:${accentColor};text-shadow:0 0 24px ${accentColor};}100%{text-shadow:0 0 0 transparent;}}
@media (prefers-reduced-motion: reduce){.${scope} [data-mk-char][data-state="lock"]{animation:none;}}
`;

  let cursor = -1;
  const glyphLayer = (
    <span aria-hidden="true" style={{ userSelect: "none" }}>
      {words.map((word, w) => (
        <React.Fragment key={w}>
          <span style={{ display: "inline-block", whiteSpace: "pre" }}>
            {word.map((item) => {
              cursor += 1;
              const at = cursor;
              return (
                <span
                  key={item.i}
                  data-mk-char={item.ch}
                  data-state="plain"
                  ref={(el) => {
                    charRefs.current[at] = el;
                  }}
                >
                  {item.ch}
                </span>
              );
            })}
          </span>
          {w < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );

  return (
    <Tag
      ref={rootRef}
      data-motion={reduce ? "static" : "animated"}
      onPointerEnter={onPointerEnter}
      className={className}
      style={{ width: "100%", display: "block", ...userStyle }}
      {...rest}
    >
      <style>{css}</style>
      {/* Screen-reader accessible text */}
      <span style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}>
        {text}
      </span>
      <span className={scope} style={{ display: "block" }}>
        {glyphLayer}
      </span>
    </Tag>
  );
}

export default DecryptText;
