import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./HandwritingOverlay.module.css";

type Point = { x: number; y: number };

const COLORS = [
  { key: "red", value: "#ff4d4f" },
  { key: "yellow", value: "#faad14" },
  { key: "green", value: "#52c41a" },
] as const;

const DEFAULT_COLOR = COLORS[0].value; // red
const DEFAULT_THICKNESS = 4; // medium

const HandwritingOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const lastPointRef = useRef<Point | null>(null);
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);
  const strokeStartedRef = useRef<boolean>(false);

  const [enabled, setEnabled] = useState<boolean>(false);
  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [thickness, setThickness] = useState<number>(DEFAULT_THICKNESS);
  const [mode, setMode] = useState<"pen" | "eraser">("pen");
  const [capturing, setCapturing] = useState<boolean>(false);

  const dpr = useMemo(() => (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1), []);
  const ERASER_SIZE = 36; // CSS pixels, big square

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // reset stacks on resize
    undoStackRef.current = [];
    redoStackRef.current = [];
    // push initial blank snapshot
    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(snapshot);
    } catch {}
  }, [dpr]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  const drawLine = useCallback((from: Point, to: Point) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (mode !== "eraser") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  }, [color, thickness, mode]);

  const eraseBetween = useCallback((from: Point, to: Point) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const size = ERASER_SIZE;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.hypot(dx, dy);
    const step = Math.max(1, Math.ceil(dist / (size / 2)));
    for (let i = 0; i <= step; i++) {
      const t = i / step;
      const x = from.x + dx * t;
      const y = from.y + dy * t;
      ctx.clearRect(x - size / 2, y - size / 2, size, size);
    }
  }, [ERASER_SIZE]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enabled) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    isDrawingRef.current = true;
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    strokeStartedRef.current = true;
    if (mode === "eraser") {
      const p = lastPointRef.current;
      if (p) {
        eraseBetween(p, p);
      }
    }
  }, [enabled, mode, eraseBetween]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enabled || !isDrawingRef.current) return;
    const current: Point = { x: e.clientX, y: e.clientY };
    const last = lastPointRef.current;
    if (last) {
      if (mode === "eraser") {
        eraseBetween(last, current);
      } else {
        drawLine(last, current);
      }
    }
    lastPointRef.current = current;
  }, [drawLine, eraseBetween, enabled, mode]);

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!enabled) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    try {
      (e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId);
    } catch {}
    // push snapshot after a stroke
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (strokeStartedRef.current && canvas && ctx) {
      try {
        const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        undoStackRef.current.push(snapshot);
        // once a new stroke is added, redo history is cleared
        redoStackRef.current = [];
      } catch {}
    }
    strokeStartedRef.current = false;
  }, [enabled]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // after clearing, record state
    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      undoStackRef.current.push(snapshot);
      redoStackRef.current = [];
    } catch {}
  }, []);

  const restoreSnapshot = useCallback((snapshot: ImageData | undefined) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !snapshot) return;
    ctx.putImageData(snapshot, 0, 0);
  }, []);

  const handleUndo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (undoStackRef.current.length <= 1) return; // keep initial
    try {
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const last = undoStackRef.current.pop();
      if (last) {
        redoStackRef.current.push(current);
        const prev = undoStackRef.current[undoStackRef.current.length - 1];
        restoreSnapshot(prev);
      }
    } catch {}
  }, [restoreSnapshot]);

  const handleRedo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    if (redoStackRef.current.length === 0) return;
    try {
      const current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const next = redoStackRef.current.pop();
      if (next) {
        undoStackRef.current.push(current);
        restoreSnapshot(next);
      }
    } catch {}
  }, [restoreSnapshot]);

  const handleSave = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // export only overlay plus watermark for now
    const exportCanvas = document.createElement('canvas');
    const width = canvas.style.width ? parseInt(canvas.style.width, 10) : window.innerWidth;
    const height = canvas.style.height ? parseInt(canvas.style.height, 10) : window.innerHeight;
    const ratio = dpr;
    exportCanvas.width = Math.floor(width * ratio);
    exportCanvas.height = Math.floor(height * ratio);
    exportCanvas.style.width = `${width}px`;
    exportCanvas.style.height = `${height}px`;
    const ex = exportCanvas.getContext('2d');
    if (!ex) return;
    ex.setTransform(ratio, 0, 0, ratio, 0, 0);
    // white transparent background
    ex.fillStyle = 'rgba(255,255,255,0)';
    ex.fillRect(0, 0, width, height);
    ex.drawImage(canvas, 0, 0, width, height);
    // watermark text
    const padding = 12;
    const text = '上岸学堂AI学习刷题 微信小程序';
    ex.font = '14px system-ui, -apple-system, Segoe UI, Roboto';
    const textWidth = ex.measureText(text).width;
    const boxW = textWidth + 16 + 48; // space for QR
    const boxH = 48;
    const boxX = width - boxW - padding;
    const boxY = height - boxH - padding;
    ex.fillStyle = 'rgba(255,255,255,0.9)';
    ex.fillRect(boxX, boxY, boxW, boxH);
    ex.strokeStyle = 'rgba(0,0,0,0.08)';
    ex.strokeRect(boxX, boxY, boxW, boxH);
    // text
    ex.fillStyle = '#1f1f1f';
    ex.fillText(text, boxX + 8, boxY + 28);
    // QR if available
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/qrcode.png';
      await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej; });
      const qrSize = 32;
      ex.drawImage(img, boxX + boxW - qrSize - 8, boxY + (boxH - qrSize) / 2, qrSize, qrSize);
    } catch {}
    // download
    const url = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    const date = new Date();
    const ts = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}_${String(date.getHours()).padStart(2,'0')}${String(date.getMinutes()).padStart(2,'0')}${String(date.getSeconds()).padStart(2,'0')}`;
    a.download = `annotation_${ts}.png`;
    a.click();
  }, [dpr]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [enabled]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={[styles.overlayCanvas, enabled ? styles.visibleCanvas : styles.hiddenCanvas].join(" ")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {!capturing && (
        <div className={styles.fab}>
          <button
            aria-label={enabled ? "关闭手写" : "开启手写"}
            className={styles.fabButton}
            onClick={() => setEnabled((v) => !v)}
            title={enabled ? "关闭手写" : "开启手写"}
          >
            {/* Pencil icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#1f1f1f" />
              <path d="M20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="#1f1f1f" />
            </svg>
          </button>
        </div>
      )}

      {enabled && !capturing && (
        <div className={styles.toolbar}>
          <button
            className={[styles.modeBtn, mode === "pen" ? styles.modeActive : ""].join(" ")}
            onClick={() => setMode("pen")}
          >画笔</button>
          <button
            className={[styles.modeBtn, mode === "eraser" ? styles.modeActive : ""].join(" ")}
            onClick={() => setMode("eraser")}
          >橡皮擦</button>
          <div className={styles.divider} />
          <div className={styles.row}>
            <span className={styles.label}>颜色</span>
            {COLORS.map((c) => (
              <button
                key={c.key}
                aria-label={`选择${c.key}`}
                className={[styles.colorSwatch, color === c.value ? styles.colorActive : ""].join(" ")}
                onClick={() => { setColor(c.value); setMode("pen"); }}
                data-color={c.key}
                title={c.key}
              />
            ))}
          </div>
          <div className={styles.row}>
            <label htmlFor="pen-thickness" className={styles.label}>粗细</label>
            <input
              id="pen-thickness"
              className={styles.slider}
              type="range"
              min={1}
              max={12}
              step={1}
              value={thickness}
              onChange={(e) => setThickness(Number(e.target.value))}
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.actionBtn} onClick={handleUndo}>撤销</button>
            <button className={styles.actionBtn} onClick={handleRedo}>重做</button>
            <button className={styles.actionBtn} onClick={clearCanvas}>清空</button>
            <button className={styles.actionBtn} onClick={handleSave}>保存</button>
            <button className={styles.actionBtn} onClick={async () => {
              try {
                setCapturing(true);
                await new Promise((r) => requestAnimationFrame(() => r(null)));
                const html2canvas = (await import('html2canvas')).default;
                const target = document.documentElement;
                const canvasShot = await html2canvas(target, {
                  backgroundColor: '#ffffff',
                  useCORS: true,
                  windowWidth: window.innerWidth,
                  windowHeight: window.innerHeight,
                  scrollX: 0,
                  scrollY: 0,
                  x: window.scrollX,
                  y: window.scrollY,
                });
                const shotCtx = canvasShot.getContext('2d');
                if (shotCtx && canvasRef.current) {
                  // draw watermark on screenshot
                  const width = canvasShot.width;
                  const height = canvasShot.height;
                  const padding = Math.round(12 * (window.devicePixelRatio || 1));
                  const text = '上岸学堂AI学习刷题 微信小程序';
                  shotCtx.font = `${Math.round(14 * (window.devicePixelRatio || 1))}px system-ui, -apple-system, Segoe UI, Roboto`;
                  const textWidth = shotCtx.measureText(text).width;
                  const qrSize = Math.round(40 * (window.devicePixelRatio || 1));
                  const boxW = Math.round(textWidth + 16 * (window.devicePixelRatio || 1) + qrSize + 16 * (window.devicePixelRatio || 1));
                  const boxH = Math.round(56 * (window.devicePixelRatio || 1));
                  const boxX = width - boxW - padding;
                  const boxY = height - boxH - padding;
                  shotCtx.fillStyle = 'rgba(255,255,255,0.9)';
                  shotCtx.fillRect(boxX, boxY, boxW, boxH);
                  shotCtx.strokeStyle = 'rgba(0,0,0,0.08)';
                  shotCtx.strokeRect(boxX, boxY, boxW, boxH);
                  shotCtx.fillStyle = '#1f1f1f';
                  shotCtx.fillText(text, boxX + Math.round(8 * (window.devicePixelRatio || 1)), boxY + Math.round(34 * (window.devicePixelRatio || 1)));
                  try {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.src = '/qrcode.png';
                    await new Promise((res, rej) => { img.onload = () => res(null); img.onerror = rej; });
                    shotCtx.drawImage(img, boxX + boxW - qrSize - Math.round(8 * (window.devicePixelRatio || 1)), boxY + Math.round((boxH - qrSize) / 2), qrSize, qrSize);
                  } catch {}
                }
                const url = canvasShot.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = url;
                const date = new Date();
                const ts = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}_${String(date.getHours()).padStart(2,'0')}${String(date.getMinutes()).padStart(2,'0')}${String(date.getSeconds()).padStart(2,'0')}`;
                a.download = `screenshot_${ts}.png`;
                a.click();
              } finally {
                setCapturing(false);
              }
            }}>截屏保存</button>
            <button className={styles.actionBtn} onClick={() => { clearCanvas(); setEnabled(false); }}>取消</button>
          </div>
        </div>
      )}
    </>
  );
};

export default HandwritingOverlay;


