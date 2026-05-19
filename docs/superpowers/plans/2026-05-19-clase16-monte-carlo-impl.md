# Clase 16 — Decisión bajo incertidumbre · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la clase 16 (Monte Carlo + Xolver) — HTML cinematic de 4 actos con Panel del Oráculo (modo Batch + Lookup) y guía impresa de 4 páginas con trayectorias personalizadas seeded por ID.

**Architecture:** Archivo HTML único autocontenido (sin build, sin dependencias locales) que sigue el patrón visual de Clase15 (cyberpunk). Motor de simulación en JS puro inline; Canvas 2D para las animaciones signature; KaTeX para fórmulas. Script Node separado genera el .docx imprimible.

**Tech Stack:** Tailwind CDN, KaTeX CDN, JetBrains Mono + Inter (Google Fonts), Canvas 2D nativo, Vanilla JS. Para el generador: Node + `docx` npm (ya en `node_modules`).

**Spec de referencia:** `docs/superpowers/specs/2026-05-19-clase16-monte-carlo-design.md`

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `Clase16_Decision_Bajo_Incertidumbre.html` | Único entregable proyectable. Contiene los 4 actos, el motor de simulación, el Panel del Oráculo (con modos Batch + Lookup), y todas las animaciones. |
| `gen_guia_clase16.js` | Script Node que genera la guía .docx de 4 páginas. Patrón igual a `gen_guia8.js`. |
| `Guia_Clase16_Decision_Bajo_Incertidumbre.docx` | Output del script. Se commitea al repo. |

**Snippet xolver:** queda en el spec; se pega al repo de xolver cuando el Pi sea accesible. No es un archivo en este repo.

**Convención de commits:** `Clase16: <descripción>` (estilo idéntico a commits previos del repo).

---

### Task 1: Scaffold HTML — head + body skeleton + base styles

**Files:**
- Create: `Clase16_Decision_Bajo_Incertidumbre.html`

**Objetivo:** archivo abre en Chrome, muestra el HUD superior con 4 segmentos (no 6+ como Clase15), 4 secciones `<section>` vacías navegables con flecha derecha. Reusa exactamente los estilos cyberpunk de Clase15.

- [ ] **Step 1: Crear el archivo con el shell completo**

Copiar líneas 1–160 de `Clase15_Hipotesis_Nula_Alternativa.html` (`<head>`, vars CSS, fondo, HUD, animaciones step-reveal, typography, cards). Sustituir el `<title>` por `Clase 16 — Decisión bajo incertidumbre`.

Reemplazar el `<body>` por:

```html
<body class="scanlines">
  <div class="bg-grid"></div>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  <div class="bg-orb bg-orb-3"></div>

  <header class="hud-top">
    <div class="hud-logo">CLASE 16 · DECISIÓN</div>
    <div class="hud-progress" id="hudProgress">
      <div class="hud-seg active" data-scene="acto1"></div>
      <div class="hud-seg" data-scene="acto2"></div>
      <div class="hud-seg" data-scene="acto3"></div>
      <div class="hud-seg" data-scene="acto4"></div>
    </div>
    <div class="hud-counter" id="hudCounter">01 / 04</div>
    <button class="hud-help-btn" id="helpBtn">?</button>
  </header>

  <main>
    <section class="scene" id="acto1">
      <div class="scene-inner">
        <span class="chapter-tag">Acto 01 · La trampa del promedio</span>
        <h1 class="cyber gradient-text" data-step data-anim="zoom">Acto 1 (placeholder)</h1>
      </div>
    </section>
    <section class="scene" id="acto2">
      <div class="scene-inner">
        <span class="chapter-tag">Acto 02 · Una vida posible</span>
        <h1 class="cyber gradient-text-2" data-step data-anim="zoom">Acto 2 (placeholder)</h1>
      </div>
    </section>
    <section class="scene" id="acto3">
      <div class="scene-inner">
        <span class="chapter-tag">Acto 03 · Diez mil vidas</span>
        <h1 class="cyber gradient-text-3" data-step data-anim="zoom">Acto 3 (placeholder)</h1>
      </div>
    </section>
    <section class="scene" id="acto4">
      <div class="scene-inner">
        <span class="chapter-tag">Acto 04 · La decisión</span>
        <h1 class="cyber gradient-text" data-step data-anim="zoom">Acto 4 (placeholder)</h1>
      </div>
    </section>
  </main>

  <footer class="hud-bottom">
    <span><span class="hud-step-counter" id="stepCounter">Paso 1</span></span>
    <span><kbd>→</kbd> avanzar · <kbd>←</kbd> atrás · <kbd>T</kbd> oráculo</span>
  </footer>

  <script>
  // === Step reveal controller (igual a Clase15) ===
  const scenes = ['acto1','acto2','acto3','acto4'];
  let currentScene = 0;
  let currentStep = 0;
  function getSteps() { return document.querySelectorAll(`#${scenes[currentScene]} [data-step]`); }
  function revealStep(i) {
    const steps = getSteps();
    if (i < 0 || i >= steps.length) return false;
    steps[i].classList.add('is-revealed');
    return true;
  }
  function nextStep() {
    const steps = getSteps();
    if (currentStep < steps.length) {
      revealStep(currentStep);
      currentStep++;
    } else if (currentScene < scenes.length - 1) {
      currentScene++;
      currentStep = 0;
      document.getElementById(scenes[currentScene]).scrollIntoView({behavior:'smooth'});
      updateHud();
    }
    updateStepCounter();
  }
  function prevStep() {
    if (currentStep > 0) {
      currentStep--;
      const steps = getSteps();
      steps[currentStep].classList.remove('is-revealed');
    } else if (currentScene > 0) {
      currentScene--;
      document.getElementById(scenes[currentScene]).scrollIntoView({behavior:'smooth'});
      const steps = getSteps();
      currentStep = steps.length;
      updateHud();
    }
    updateStepCounter();
  }
  function updateHud() {
    document.querySelectorAll('.hud-seg').forEach((seg, i) => {
      seg.classList.toggle('active', i === currentScene);
      seg.classList.toggle('done', i < currentScene);
    });
    document.getElementById('hudCounter').textContent =
      `${String(currentScene+1).padStart(2,'0')} / 04`;
  }
  function updateStepCounter() {
    document.getElementById('stepCounter').textContent = `Paso ${currentStep+1}`;
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextStep(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
  });
  // Reveal first step on load for each scene
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scene').forEach(sc => {
      const first = sc.querySelector('[data-step]');
      if (first) first.classList.add('is-revealed');
    });
  });
  </script>
</body>
</html>
```

- [ ] **Step 2: Verificación manual — abrir en Chrome**

Abrir `Clase16_Decision_Bajo_Incertidumbre.html` en Chrome.

Expected:
- Fondo violáceo con grid sutil y 3 orbs flotantes
- HUD superior con 4 segmentos (primero magenta brillante, otros opacos)
- Cuatro secciones a pantalla completa con sus chapter-tags
- Flecha derecha avanza scene; flecha izquierda retrocede

- [ ] **Step 3: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: scaffold HTML con HUD de 4 actos + step controller"
```

---

### Task 2: Motor de simulación — distribuciones y trayectoria

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (agregar bloque `<script>` antes del controller existente)

**Objetivo:** funciones `uniforme`, `triangular`, `simularUnaVida` definidas y verificables por consola con `?test=1`.

- [ ] **Step 1: Agregar el motor + tests inline**

En el `<script>` insertar antes del comentario `=== Step reveal controller ===`:

```js
// === Motor de simulación ===
const PARAMS = {
  cajaInicial: 50,
  ingMin: 5,  ingMax: 15,
  gasMin: 9,  gasModa: 11,  gasMax: 14,
};

function uniforme(a, b) { return a + Math.random() * (b - a); }

function triangular(min, mode, max) {
  const u = Math.random();
  const c = (mode - min) / (max - min);
  return u < c
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function simularUnaVida(params, rng = Math.random) {
  const _u = (a,b) => a + rng() * (b - a);
  const _t = (mn,md,mx) => {
    const u = rng();
    const c = (md - mn) / (mx - mn);
    return u < c
      ? mn + Math.sqrt(u * (mx - mn) * (md - mn))
      : mx - Math.sqrt((1 - u) * (mx - mn) * (mx - md));
  };
  let caja = params.cajaInicial;
  const trayectoria = [caja];
  const meses = [];
  let mesQuiebra = null;
  for (let m = 1; m <= 12; m++) {
    const ing = _u(params.ingMin, params.ingMax);
    const gas = _t(params.gasMin, params.gasModa, params.gasMax);
    caja += ing - gas;
    meses.push({ mes: m, ingreso: ing, gasto: gas, caja });
    trayectoria.push(caja);
    if (caja <= 0 && !mesQuiebra) { mesQuiebra = m; break; }
  }
  return { trayectoria, meses, mesQuiebra };
}

// === Tests (run with ?test=1) ===
function runTests() {
  console.group('Tests motor de simulación');
  // 1. uniforme dentro de rango
  for (let i = 0; i < 1000; i++) {
    const v = uniforme(5, 15);
    console.assert(v >= 5 && v <= 15, `uniforme fuera de rango: ${v}`);
  }
  console.log('✓ uniforme: 1000 valores en [5,15]');

  // 2. triangular respeta min/max
  for (let i = 0; i < 1000; i++) {
    const v = triangular(9, 11, 14);
    console.assert(v >= 9 && v <= 14, `triangular fuera de rango: ${v}`);
  }
  console.log('✓ triangular: 1000 valores en [9,14]');

  // 3. triangular tiene moda cerca de 11
  const sum = Array.from({length: 100000}, () => triangular(9, 11, 14)).reduce((a,b)=>a+b,0);
  const mean = sum / 100000;
  // E[triangular] = (a+b+c)/3 = (9+11+14)/3 = 11.33
  console.assert(Math.abs(mean - 11.33) < 0.1, `media triangular: ${mean}`);
  console.log(`✓ media triangular ≈ 11.33: got ${mean.toFixed(3)}`);

  // 4. simularUnaVida produce 12 meses o menos (si quiebra)
  for (let i = 0; i < 100; i++) {
    const r = simularUnaVida(PARAMS);
    console.assert(r.meses.length <= 12, `más de 12 meses: ${r.meses.length}`);
    console.assert(r.trayectoria.length === r.meses.length + 1, 'trayectoria mal alineada');
  }
  console.log('✓ simularUnaVida: 100 corridas con longitud correcta');

  console.groupEnd();
}
if (new URLSearchParams(location.search).get('test') === '1') runTests();
```

- [ ] **Step 2: Verificar tests**

Abrir `Clase16_Decision_Bajo_Incertidumbre.html?test=1` en Chrome. Abrir consola (F12).

Expected: ver el group "Tests motor de simulación" con 4 líneas `✓`. Sin asserts rojos.

- [ ] **Step 3: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: motor de simulacion (uniforme, triangular, simularUnaVida) + tests inline"
```

---

### Task 3: Monte Carlo aggregator + estadísticas

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (agregar al bloque de simulación)

**Objetivo:** función `monteCarlo` produce 10K corridas; función `resumen` calcula stats clave; tests verifican que con PARAMS base P(quiebra<12) está entre 55–70%.

- [ ] **Step 1: Agregar agregador + resumen + tests**

Insertar después de `simularUnaVida` (antes de `runTests`):

```js
function monteCarlo(params, N = 10000) {
  const out = [];
  for (let i = 0; i < N; i++) out.push(simularUnaVida(params));
  return out;
}

function resumen(corridas) {
  const total = corridas.length;
  const quiebras = corridas.filter(c => c.mesQuiebra !== null);
  const pQuiebra = quiebras.length / total;
  const mesesQuiebra = quiebras.map(c => c.mesQuiebra).sort((a,b) => a - b);
  const mediaMes = mesesQuiebra.length
    ? mesesQuiebra.reduce((a,b) => a+b, 0) / mesesQuiebra.length
    : null;
  const p05 = mesesQuiebra.length
    ? mesesQuiebra[Math.floor(mesesQuiebra.length * 0.05)]
    : null;
  // Histograma de mes de quiebra: array de 12 conteos
  const histo = new Array(13).fill(0); // index = mes 1..12, 0 = sobrevivieron
  for (const c of corridas) {
    if (c.mesQuiebra === null) histo[0]++;
    else histo[c.mesQuiebra]++;
  }
  return { total, pQuiebra, mediaMes, p05, histo };
}
```

Agregar al final de `runTests` (antes del `console.groupEnd()`):

```js
  // 5. monteCarlo N=10000 con PARAMS base: P(quiebra<12) entre 55-70%
  const r = monteCarlo(PARAMS, 10000);
  const s = resumen(r);
  console.assert(s.pQuiebra >= 0.55 && s.pQuiebra <= 0.70,
    `P(quiebra) fuera de [0.55, 0.70]: ${s.pQuiebra}`);
  console.log(`✓ P(quiebra antes mes 12) = ${(s.pQuiebra*100).toFixed(1)}%`);
  console.log(`  Mes esperado de quiebra: ${s.mediaMes?.toFixed(1)}`);
  console.log(`  Peor 5%: mes ${s.p05}`);
```

- [ ] **Step 2: Verificar**

Recargar `?test=1`. Consola debe mostrar:
- `✓ P(quiebra antes mes 12) = XX.X%` con XX entre 55 y 70.
- Mes esperado entre 9 y 12.
- Peor 5% entre 3 y 6.

Si el rango falla, ajustar `PARAMS` antes de continuar.

- [ ] **Step 3: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: agregador Monte Carlo + estadisticas (P quiebra, media, p05, histograma)"
```

---

### Task 4: PRNG seeded por ID (mulberry32 + FNV-1a)

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (agregar al bloque de simulación)

**Objetivo:** `simularPorID(id)` produce trayectoria reproducible (mismo ID = misma salida). Tests verifican determinismo y dispersión entre IDs distintos.

- [ ] **Step 1: Agregar PRNG seeded + función por ID**

Insertar después de `resumen`:

```js
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function mulberry32(seed) {
  return function() {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function simularPorID(id, params = PARAMS) {
  const rng = mulberry32(hashStr(String(id).trim().toLowerCase()));
  return simularUnaVida(params, rng);
}
```

Agregar al final de `runTests`:

```js
  // 6. Mismo ID → misma trayectoria
  const a = simularPorID('12345');
  const b = simularPorID('12345');
  console.assert(JSON.stringify(a) === JSON.stringify(b), 'ID determinismo falla');
  console.log('✓ Mismo ID produce misma trayectoria');

  // 7. IDs distintos → dispersión
  const ids = ['ana','bea','cris','dani','elia','fede','gabi','hugo','iris','jose',
               'kati','luis','meli','nina','omar','pati','queso','raul','sofi','tomas',
               'uri','vale','wendy','xavi','yola','zaira','1001','1002','1003','1004'];
  const resultados = ids.map(id => simularPorID(id));
  const quebraron = resultados.filter(r => r.mesQuiebra !== null).length;
  const sobrevivieron = resultados.length - quebraron;
  console.assert(quebraron > 0 && sobrevivieron > 0,
    `Dispersión insuficiente: ${quebraron} quebraron, ${sobrevivieron} sobrevivieron`);
  console.log(`✓ Dispersión: ${quebraron}/30 quebraron, ${sobrevivieron}/30 sobrevivieron`);
  const mesesQ = resultados.filter(r => r.mesQuiebra).map(r => r.mesQuiebra);
  console.log(`  Meses de quiebra: ${mesesQ.sort((a,b)=>a-b).join(', ')}`);
```

- [ ] **Step 2: Verificar**

Recargar `?test=1`. Expected:
- `✓ Mismo ID produce misma trayectoria`
- `✓ Dispersión: X/30 quebraron, Y/30 sobrevivieron` — ambos X e Y > 0, ideal X entre 15 y 22 (consistente con ~62% global)

- [ ] **Step 3: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: PRNG seeded por ID (FNV-1a + mulberry32) reproducible"
```

---

### Task 5: Acto 1 — La trampa del promedio

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (reemplazar contenido del `<section id="acto1">`)

**Objetivo:** dos pizarras lado a lado (Lucho/Pedro) con sus cálculos, animación de líneas rectas descendentes, glitch al final, fórmula KaTeX.

- [ ] **Step 1: Cargar KaTeX dinámicamente en `<head>`**

Si no está ya, añadir antes del `</head>` (mismo bloque que Clase15):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script>
```

- [ ] **Step 2: Reemplazar el contenido del Acto 1**

Sustituir el `<section id="acto1">…</section>` por:

```html
<section class="scene" id="acto1">
  <div class="scene-inner">
    <span class="chapter-tag">Acto 01 · La trampa del promedio</span>

    <h1 class="cyber gradient-text mb-8" data-step data-anim="zoom">
      Lucho y Pedro fundan <span class="glow-magenta">TintoApp</span>
    </h1>

    <p class="text-lg text-zinc-300 mb-12 max-w-3xl" data-step data-anim="slide-left">
      Delivery de café especial a oficinas. Caja inicial: <strong class="glow-cyan">$50M</strong>.
      Cada uno hace sus cálculos.
    </p>

    <div class="grid md:grid-cols-2 gap-6 mb-12">
      <div class="cyber-card cyan" data-step data-anim="slide-left">
        <h3 class="cyber glow-cyan mb-3">🟢 LUCHO · el optimista</h3>
        <ul class="font-mono text-sm space-y-1 text-zinc-200">
          <li>Ingresos esperados: <strong>$11M / mes</strong></li>
          <li>Gastos esperados: <strong>$11M / mes</strong></li>
          <li>Balance: <strong>$0</strong> · "Vivimos para siempre."</li>
        </ul>
      </div>
      <div class="cyber-card magenta" data-step data-anim="slide-right">
        <h3 class="cyber glow-magenta mb-3">🔴 PEDRO · el realista</h3>
        <ul class="font-mono text-sm space-y-1 text-zinc-200">
          <li>Ingresos esperados: <strong>$8M / mes</strong></li>
          <li>Gastos esperados: <strong>$12M / mes</strong></li>
          <li>Balance: <strong>−$4M</strong> · "Morimos mes 12.5."</li>
        </ul>
      </div>
    </div>

    <div class="cyber-card violet mb-8" data-step data-anim="zoom">
      <h3 class="cyber mb-3" style="color:var(--violet)">📉 Líneas rectas (cálculo con promedios)</h3>
      <canvas id="acto1Canvas" width="900" height="280" class="w-full"></canvas>
    </div>

    <h2 class="cyber glow-lime text-center my-12" data-step data-anim="glitch">
      Ningún mes es promedio.
    </h2>

    <div class="cyber-card mb-6" data-step data-anim="slide-left">
      <p class="text-sm text-zinc-400 mb-2">El futuro real:</p>
      <div class="text-xl" id="acto1Formula">
        $$\\text{caja}(t) = \\text{caja}(0) + \\sum_{i=1}^{t} (\\text{ingreso}_i - \\text{gasto}_i)$$
      </div>
      <p class="text-sm text-zinc-400 mt-2">
        Esa Σ es de <span class="glow-cyan">variables aleatorias</span>, no de constantes.
      </p>
    </div>

    <p class="text-center text-zinc-400" data-step data-anim="slide-right">
      <em>¿Y si lanzamos UN mes real?</em> → Acto 2
    </p>
  </div>
</section>
```

- [ ] **Step 3: Agregar el dibujo del canvas + render KaTeX**

Agregar al final del bloque `<script>` (después del controller):

```js
// === Acto 1 canvas ===
function drawActo1Canvas() {
  const c = document.getElementById('acto1Canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);
  // ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 20); ctx.lineTo(40, H-30);
  ctx.lineTo(W-20, H-30);
  ctx.stroke();
  // marcas
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px JetBrains Mono';
  for (let m = 0; m <= 12; m += 3) {
    const x = 40 + (W-60) * (m/12);
    ctx.fillText('M' + m, x-8, H-12);
  }
  for (let y = 0; y <= 60; y += 20) {
    const py = H-30 - (H-50) * (y/60);
    ctx.fillText('$' + y + 'M', 4, py+3);
  }
  // línea Lucho (flat at 50)
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(40, H-30 - (H-50) * (50/60));
  ctx.lineTo(W-20, H-30 - (H-50) * (50/60));
  ctx.stroke();
  // línea Pedro (50 → 0 at mes 12.5)
  ctx.strokeStyle = '#ff2e93';
  ctx.shadowColor = '#ff2e93';
  ctx.beginPath();
  ctx.moveTo(40, H-30 - (H-50) * (50/60));
  ctx.lineTo(40 + (W-60) * (12/12.5), H-30 - (H-50) * (0/60));
  ctx.stroke();
  ctx.shadowBlur = 0;
}
window.addEventListener('DOMContentLoaded', () => {
  drawActo1Canvas();
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [{left:'$$', right:'$$', display:true}, {left:'$', right:'$', display:false}]
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.renderMathInElement) renderMathInElement(document.body, {
        delimiters: [{left:'$$', right:'$$', display:true}]
      });
    });
  }
});
```

- [ ] **Step 4: Verificar visual**

Abrir el HTML. Navegar al Acto 1 con flecha derecha.

Expected:
- Dos tarjetas (Lucho cyan, Pedro magenta) revelan en orden con sus números
- Canvas dibuja dos líneas: una cyan plana en $50M, una magenta diagonal de $50M a $0
- Fórmula KaTeX renderiza correctamente
- El título "Ningún mes es promedio." aparece con efecto glitch al revelar

- [ ] **Step 5: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Acto 1 - La trampa del promedio (Lucho vs Pedro + canvas + KaTeX)"
```

---

### Task 6: Acto 2 — Una vida posible (slot machine + trayectoria)

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html`

**Objetivo:** botones "Lanzar mes" y "Otra vida" funcionan; muestran ingreso/gasto/caja del mes; canvas dibuja la trayectoria mes a mes; al quebrar muestra el veredicto.

- [ ] **Step 1: Reemplazar contenido del Acto 2**

Sustituir el `<section id="acto2">…</section>` por:

```html
<section class="scene" id="acto2">
  <div class="scene-inner">
    <span class="chapter-tag">Acto 02 · Una vida posible</span>

    <h1 class="cyber gradient-text-2 mb-8" data-step data-anim="zoom">
      Una sola vida posible
    </h1>

    <div class="cyber-card violet mb-6" data-step data-anim="slide-left">
      <h3 class="cyber mb-3" style="color:var(--violet)">📐 Distribuciones (no promedios)</h3>
      <div class="font-mono text-sm space-y-1">
        <div>Ingresos ~ <span class="glow-cyan">Uniforme($5M, $15M)</span></div>
        <div>Gastos ~ <span class="glow-magenta">Triangular($9M, moda $11M, $14M)</span></div>
      </div>
    </div>

    <div class="grid md:grid-cols-[1fr_2fr] gap-6 mb-8" data-step data-anim="zoom">
      <div class="cyber-card">
        <h3 class="cyber mb-3 text-sm">🎰 EL MES</h3>
        <div class="font-mono space-y-2">
          <div>Mes: <span id="acto2Mes" class="glow-cyan text-2xl">0</span></div>
          <div>Ingreso: <span id="acto2Ing" class="text-cyan-300">—</span></div>
          <div>Gasto: <span id="acto2Gas" class="text-pink-300">—</span></div>
          <div class="pt-2 border-t border-zinc-700">
            Caja: <span id="acto2Caja" class="text-2xl glow-lime">$50.0M</span>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button id="acto2Lanzar" class="cyber-btn">Lanzar mes →</button>
          <button id="acto2Reset" class="cyber-btn-sec">Otra vida</button>
        </div>
        <div id="acto2Veredicto" class="mt-4 text-center font-bold hidden"></div>
      </div>
      <div class="cyber-card cyan">
        <canvas id="acto2Canvas" width="700" height="320" class="w-full"></canvas>
      </div>
    </div>

    <p class="text-center text-zinc-400" data-step data-anim="slide-left">
      <em>Esa fue UNA vida. ¿Y si lanzamos otra?</em>
    </p>
    <p class="text-center text-zinc-400 mt-2" data-step data-anim="slide-right">
      <em>¿Y si las viéramos TODAS?</em> → Acto 3
    </p>
  </div>
</section>
```

- [ ] **Step 2: Agregar estilos para los botones**

En el bloque `<style>` (al final, antes de cerrar):

```css
.cyber-btn { background: linear-gradient(135deg, var(--magenta), var(--violet)); color: #fff; font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 13px; padding: 10px 18px; border-radius: 8px; border: 0; cursor: pointer; box-shadow: 0 0 18px rgba(255,46,147,.4); transition: transform .15s; }
.cyber-btn:hover { transform: translateY(-2px); }
.cyber-btn-sec { background: transparent; color: var(--cyan); font-family: 'JetBrains Mono', monospace; font-size: 13px; padding: 10px 18px; border-radius: 8px; border: 1px solid var(--cyan); cursor: pointer; }
.cyber-btn-sec:hover { background: rgba(0,240,255,.08); }
```

- [ ] **Step 3: Lógica del slot machine y trayectoria**

Agregar al final del `<script>`:

```js
// === Acto 2 slot machine ===
let acto2Estado = null;
function acto2Reset() {
  acto2Estado = { caja: PARAMS.cajaInicial, mes: 0, historia: [{mes:0, caja: PARAMS.cajaInicial}], quebrado: false };
  document.getElementById('acto2Mes').textContent = '0';
  document.getElementById('acto2Ing').textContent = '—';
  document.getElementById('acto2Gas').textContent = '—';
  document.getElementById('acto2Caja').textContent = '$50.0M';
  document.getElementById('acto2Veredicto').classList.add('hidden');
  document.getElementById('acto2Lanzar').disabled = false;
  drawActo2Canvas();
}
function acto2LanzarMes() {
  if (!acto2Estado || acto2Estado.quebrado) return;
  acto2Estado.mes++;
  const ing = uniforme(PARAMS.ingMin, PARAMS.ingMax);
  const gas = triangular(PARAMS.gasMin, PARAMS.gasModa, PARAMS.gasMax);
  acto2Estado.caja += ing - gas;
  acto2Estado.historia.push({mes: acto2Estado.mes, caja: acto2Estado.caja});
  document.getElementById('acto2Mes').textContent = acto2Estado.mes;
  document.getElementById('acto2Ing').textContent = '$' + ing.toFixed(1) + 'M';
  document.getElementById('acto2Gas').textContent = '$' + gas.toFixed(1) + 'M';
  document.getElementById('acto2Caja').textContent = '$' + acto2Estado.caja.toFixed(1) + 'M';
  if (acto2Estado.caja <= 0) {
    acto2Estado.quebrado = true;
    const v = document.getElementById('acto2Veredicto');
    v.classList.remove('hidden');
    v.style.color = 'var(--magenta)';
    v.textContent = `🔴 QUEBRASTE MES ${acto2Estado.mes}`;
    document.getElementById('acto2Lanzar').disabled = true;
  } else if (acto2Estado.mes >= 12) {
    const v = document.getElementById('acto2Veredicto');
    v.classList.remove('hidden');
    v.style.color = 'var(--green)';
    v.textContent = `🟢 SOBREVIVISTE — $${acto2Estado.caja.toFixed(1)}M`;
    document.getElementById('acto2Lanzar').disabled = true;
  }
  drawActo2Canvas();
}
function drawActo2Canvas() {
  const c = document.getElementById('acto2Canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);
  // ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 20); ctx.lineTo(40, H-30); ctx.lineTo(W-20, H-30);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px JetBrains Mono';
  for (let m = 0; m <= 12; m += 3) {
    const x = 40 + (W-60) * (m/12);
    ctx.fillText('M' + m, x-8, H-12);
  }
  for (let y = 0; y <= 60; y += 20) {
    const py = H-30 - (H-50) * (y/60);
    ctx.fillText('$' + y + 'M', 4, py+3);
  }
  // línea $0
  ctx.strokeStyle = 'rgba(255,82,82,0.4)';
  ctx.beginPath();
  ctx.moveTo(40, H-30 - (H-50) * 0/60);
  ctx.lineTo(W-20, H-30 - (H-50) * 0/60);
  ctx.stroke();
  // trayectoria
  if (acto2Estado && acto2Estado.historia.length > 0) {
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    acto2Estado.historia.forEach((p, i) => {
      const x = 40 + (W-60) * (p.mes/12);
      const y = H-30 - (H-50) * (Math.max(0, p.caja)/60);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
    // puntos
    acto2Estado.historia.forEach(p => {
      const x = 40 + (W-60) * (p.mes/12);
      const y = H-30 - (H-50) * (Math.max(0, p.caja)/60);
      ctx.fillStyle = p.caja <= 0 ? '#ff5252' : '#00f0ff';
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
    });
  }
}
window.addEventListener('DOMContentLoaded', () => {
  acto2Reset();
  document.getElementById('acto2Lanzar').addEventListener('click', acto2LanzarMes);
  document.getElementById('acto2Reset').addEventListener('click', acto2Reset);
});
```

- [ ] **Step 4: Verificar visual**

Navegar al Acto 2. Click "Lanzar mes" 12 veces (o hasta quebrar).

Expected:
- Mes contador sube 0→1→2→…
- Ingreso/gasto se actualiza con valores en rangos correctos
- Caja sube y baja realista
- Canvas dibuja la trayectoria mes a mes
- Si quiebra: veredicto magenta "🔴 QUEBRASTE MES X" y botón se deshabilita
- Si sobrevive 12: veredicto verde
- "Otra vida" resetea todo

- [ ] **Step 5: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Acto 2 - Una vida posible (slot machine + canvas trayectoria)"
```

---

### Task 7: Acto 3 — Diez mil vidas (cascada + histograma)

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html`

**Objetivo:** botón "Soltar 10.000 vidas" anima cascada de trayectorias en Canvas y construye histograma en paralelo. Al final aparecen tres tarjetas con P(quiebra), media, peor 5%.

- [ ] **Step 1: Reemplazar contenido del Acto 3**

```html
<section class="scene" id="acto3">
  <div class="scene-inner">
    <span class="chapter-tag">Acto 03 · Diez mil vidas</span>

    <h1 class="cyber gradient-text-3 mb-6" data-step data-anim="zoom">
      Diez mil vidas posibles
    </h1>

    <div class="cyber-card violet mb-6" data-step data-anim="slide-left">
      <p class="text-sm text-zinc-300">
        <strong class="glow-lime">Monte Carlo:</strong> simular muchas veces el mismo experimento y mirar la
        <span class="glow-cyan">distribución</span> de resultados.
      </p>
    </div>

    <div class="grid md:grid-cols-[2fr_1fr] gap-4 mb-6" data-step data-anim="zoom">
      <div class="cyber-card cyan p-2">
        <canvas id="acto3Cascada" width="800" height="380" class="w-full"></canvas>
      </div>
      <div class="cyber-card magenta p-2">
        <canvas id="acto3Histo" width="400" height="380" class="w-full"></canvas>
      </div>
    </div>

    <div class="text-center mb-8" data-step data-anim="zoom">
      <button id="acto3Soltar" class="cyber-btn text-base px-8 py-3">Soltar las 10.000 vidas</button>
    </div>

    <div id="acto3Stats" class="grid md:grid-cols-3 gap-4 mb-8 opacity-0 transition-opacity duration-700">
      <div class="cyber-card magenta text-center">
        <div class="text-xs text-zinc-400 mb-1 font-mono">P(QUEBRAR ANTES MES 12)</div>
        <div id="statP" class="text-4xl cyber glow-magenta">—</div>
      </div>
      <div class="cyber-card cyan text-center">
        <div class="text-xs text-zinc-400 mb-1 font-mono">MES ESPERADO DE QUIEBRA</div>
        <div id="statMedia" class="text-4xl cyber glow-cyan">—</div>
      </div>
      <div class="cyber-card violet text-center">
        <div class="text-xs text-zinc-400 mb-1 font-mono">PEOR 5%</div>
        <div id="statP05" class="text-4xl cyber" style="color:var(--violet)">—</div>
      </div>
    </div>

    <h2 class="cyber text-center my-8" data-step data-anim="glitch">
      Ya saben el <span class="glow-magenta">riesgo</span>.<br>¿Qué van a <span class="glow-lime">hacer</span>?
    </h2>
  </div>
</section>
```

- [ ] **Step 2: Lógica de la cascada + histograma**

Agregar al `<script>`:

```js
// === Acto 3 cascada ===
let acto3Corridas = null;
let acto3Running = false;
function precomputeActo3() {
  if (!acto3Corridas) acto3Corridas = monteCarlo(PARAMS, 10000);
}
function drawCascadaFrame(ctx, W, H, corridas, fromIdx, toIdx, histoCtx, HW, HH, histo) {
  for (let i = fromIdx; i < toIdx; i++) {
    const c = corridas[i];
    ctx.strokeStyle = c.mesQuiebra ? 'rgba(255,46,147,0.04)' : 'rgba(179,136,255,0.04)';
    ctx.beginPath();
    c.trayectoria.forEach((caja, m) => {
      const x = 40 + (W-60) * (m/12);
      const y = H-30 - (H-50) * (Math.max(0, caja)/60);
      if (m === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // Histograma
    if (c.mesQuiebra) {
      histo[c.mesQuiebra]++;
      drawHistoBar(histoCtx, HW, HH, histo, c.mesQuiebra);
    }
  }
}
function drawHistoBase(ctx, W, H) {
  ctx.clearRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 20); ctx.lineTo(30, H-30); ctx.lineTo(W-10, H-30);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '10px JetBrains Mono';
  for (let m = 1; m <= 12; m += 2) {
    const barW = (W-50) / 12;
    const x = 30 + (m-1) * barW + barW/2 - 4;
    ctx.fillText('M' + m, x, H-12);
  }
  ctx.fillText('mes de quiebra', W/2-40, 14);
}
function drawHistoBar(ctx, W, H, histo, mes) {
  const maxBar = Math.max(1, ...histo.slice(1));
  const barW = (W-50) / 12;
  const x = 30 + (mes-1) * barW + 1;
  const y = H-30 - (H-50) * (histo[mes]/maxBar);
  const h = (H-50) * (histo[mes]/maxBar);
  ctx.fillStyle = 'rgba(255,46,147,0.7)';
  ctx.fillRect(x, y, barW-2, h);
}
function drawCascadaBase(ctx, W, H) {
  ctx.fillStyle = '#0a0014';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 20); ctx.lineTo(40, H-30); ctx.lineTo(W-20, H-30);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '11px JetBrains Mono';
  for (let m = 0; m <= 12; m += 3) {
    const x = 40 + (W-60) * (m/12);
    ctx.fillText('M' + m, x-8, H-12);
  }
  for (let y = 0; y <= 60; y += 20) {
    const py = H-30 - (H-50) * (y/60);
    ctx.fillText('$' + y + 'M', 4, py+3);
  }
}
function runCascada() {
  if (acto3Running) return;
  acto3Running = true;
  precomputeActo3();
  const cascC = document.getElementById('acto3Cascada');
  const histC = document.getElementById('acto3Histo');
  const ctx = cascC.getContext('2d');
  const histoCtx = histC.getContext('2d');
  const W = cascC.width, H = cascC.height;
  const HW = histC.width, HH = histC.height;
  drawCascadaBase(ctx, W, H);
  drawHistoBase(histoCtx, HW, HH);
  const histo = new Array(13).fill(0);
  const BATCH = 100;
  let idx = 0;
  // Performance check del primer frame
  const tStart = performance.now();
  function step() {
    drawCascadaFrame(ctx, W, H, acto3Corridas, idx, Math.min(idx+BATCH, acto3Corridas.length), histoCtx, HW, HH, histo);
    idx += BATCH;
    // Adaptive: si primer batch tarda > 50ms, reducir a 5K total
    if (idx === BATCH && (performance.now() - tStart) > 50 && acto3Corridas.length > 5000) {
      acto3Corridas = acto3Corridas.slice(0, 5000);
      console.warn('Adaptive: 5K corridas en vez de 10K por performance');
    }
    if (idx < acto3Corridas.length) {
      requestAnimationFrame(step);
    } else {
      acto3Running = false;
      mostrarStats();
    }
  }
  requestAnimationFrame(step);
}
function mostrarStats() {
  const s = resumen(acto3Corridas);
  document.getElementById('statP').textContent = (s.pQuiebra * 100).toFixed(0) + '%';
  document.getElementById('statMedia').textContent = s.mediaMes ? s.mediaMes.toFixed(1) : '—';
  document.getElementById('statP05').textContent = s.p05 !== null ? 'mes ' + s.p05 : '—';
  document.getElementById('acto3Stats').style.opacity = '1';
}
window.addEventListener('DOMContentLoaded', () => {
  // Precompute en background ASAP
  setTimeout(precomputeActo3, 500);
  document.getElementById('acto3Soltar').addEventListener('click', runCascada);
});
```

- [ ] **Step 3: Verificar visual**

Navegar al Acto 3. Click "Soltar las 10.000 vidas".

Expected:
- En ~1–3 segundos se dibuja una nube violeta/magenta de líneas que serpentean de $50M hacia abajo
- En paralelo, el histograma a la derecha va creciendo, con la barra más alta cerca del mes 11–12
- Al terminar, las 3 tarjetas con P (~62%), mes esperado (~11), peor 5% (~mes 4) aparecen
- No hay congelamiento del navegador durante la animación

- [ ] **Step 4: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Acto 3 - Diez mil vidas (cascada Canvas + histograma + stats)"
```

---

### Task 8: Acto 4 — La decisión (sliders + mini-MC + link xolver)

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html`

**Objetivo:** 4 controles (subir precio, recortar marketing, contratar, pivotar B2B) actualizan en vivo la P(sobrevivir 12m) con N=1000. Botón final abre xolver con TintoApp precargado.

- [ ] **Step 1: Reemplazar contenido del Acto 4**

```html
<section class="scene" id="acto4">
  <div class="scene-inner">
    <span class="chapter-tag">Acto 04 · La decisión</span>

    <h1 class="cyber gradient-text mb-6" data-step data-anim="zoom">
      ¿Y ahora qué <span class="glow-lime">hacemos</span>?
    </h1>

    <p class="text-zinc-300 mb-6 max-w-3xl" data-step data-anim="slide-left">
      Toca palancas para mejorar la probabilidad de sobrevivir.
      <strong class="glow-cyan">Xolver no hace Monte Carlo</strong> — usa los promedios que cada decisión produce.
      Perdés la cola, pero ganás una <em>respuesta concreta</em>.
    </p>

    <div class="grid md:grid-cols-2 gap-4 mb-6" data-step data-anim="zoom">
      <div class="cyber-card cyan">
        <label class="text-xs font-mono text-zinc-400">SUBIR PRECIO <span id="lblPrecio">0</span>%</label>
        <input type="range" id="ctlPrecio" min="0" max="40" value="0" class="w-full">
      </div>
      <div class="cyber-card magenta">
        <label class="text-xs font-mono text-zinc-400">RECORTAR MARKETING <span id="lblMkt">0</span>%</label>
        <input type="range" id="ctlMkt" min="0" max="50" value="0" class="w-full">
      </div>
      <div class="cyber-card violet">
        <label class="text-xs font-mono text-zinc-400">CONTRATAR REPARTIDORES: <span id="lblRep">0</span></label>
        <input type="range" id="ctlRep" min="0" max="3" step="1" value="0" class="w-full">
      </div>
      <div class="cyber-card">
        <label class="text-xs font-mono text-zinc-400">PIVOTAR A B2B</label>
        <div class="flex gap-2 mt-2">
          <button id="ctlPivotN" class="cyber-btn-sec flex-1 active-pivot">No</button>
          <button id="ctlPivotS" class="cyber-btn-sec flex-1">Sí</button>
        </div>
      </div>
    </div>

    <div class="cyber-card text-center mb-6" data-step data-anim="zoom">
      <div class="text-xs text-zinc-400 mb-1 font-mono">P(SOBREVIVIR 12 MESES) — mini Monte Carlo en vivo</div>
      <div id="acto4P" class="text-6xl cyber glow-lime">38%</div>
    </div>

    <div class="text-center mb-8" data-step data-anim="zoom">
      <a id="acto4XolverLink" href="https://xolver.cgrajales.dev/?ejemplo=tintoapp" target="_blank"
         class="cyber-btn text-base px-8 py-3 inline-block no-underline">
        Abrir en xolver →
      </a>
    </div>

    <div class="cyber-card violet text-center" data-step data-anim="glitch">
      <p class="text-lg italic">
        Monte Carlo te muestra <strong>cómo es el futuro</strong>.<br>
        La optimización te dice <strong>qué hacer con él</strong>.<br>
        <span class="glow-lime">Eso es decidir como adulto.</span>
      </p>
      <p class="text-xs text-zinc-500 mt-4 font-mono">— fin del curso —</p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Lógica del mini-MC + sliders + pivot toggle**

Agregar al `<script>`:

```js
// === Acto 4 mini Monte Carlo ===
const ACTO4 = { precio: 0, mkt: 0, rep: 0, pivot: 0 };

function paramsAjustados(d) {
  // Cada decisión modifica el promedio de ingreso y/o gasto.
  // Coeficientes redondos y didácticos.
  const ingShift = 0.04 * d.precio + 0.10 * d.pivot + 0.3 * d.rep;
  const gasShift = -0.02 * d.mkt + 0.2 * d.rep + 0.5 * d.pivot;
  return {
    cajaInicial: PARAMS.cajaInicial,
    ingMin: PARAMS.ingMin + ingShift,
    ingMax: PARAMS.ingMax + ingShift,
    gasMin: PARAMS.gasMin + gasShift,
    gasModa: PARAMS.gasModa + gasShift,
    gasMax: PARAMS.gasMax + gasShift,
  };
}
function actualizarActo4() {
  const p = paramsAjustados(ACTO4);
  const corridas = monteCarlo(p, 1000);
  const s = resumen(corridas);
  const pSobrevivir = ((1 - s.pQuiebra) * 100).toFixed(0);
  document.getElementById('acto4P').textContent = pSobrevivir + '%';
  // Cambia color según resultado
  const el = document.getElementById('acto4P');
  el.classList.remove('glow-lime', 'glow-magenta', 'glow-cyan');
  if (pSobrevivir >= 60) el.classList.add('glow-lime');
  else if (pSobrevivir >= 45) el.classList.add('glow-cyan');
  else el.classList.add('glow-magenta');
}
function bindActo4() {
  const ctlPrecio = document.getElementById('ctlPrecio');
  const ctlMkt = document.getElementById('ctlMkt');
  const ctlRep = document.getElementById('ctlRep');
  const lblPrecio = document.getElementById('lblPrecio');
  const lblMkt = document.getElementById('lblMkt');
  const lblRep = document.getElementById('lblRep');
  ctlPrecio.addEventListener('input', () => {
    ACTO4.precio = +ctlPrecio.value; lblPrecio.textContent = ACTO4.precio; actualizarActo4();
  });
  ctlMkt.addEventListener('input', () => {
    ACTO4.mkt = +ctlMkt.value; lblMkt.textContent = ACTO4.mkt; actualizarActo4();
  });
  ctlRep.addEventListener('input', () => {
    ACTO4.rep = +ctlRep.value; lblRep.textContent = ACTO4.rep; actualizarActo4();
  });
  document.getElementById('ctlPivotN').addEventListener('click', () => {
    ACTO4.pivot = 0;
    document.getElementById('ctlPivotN').classList.add('active-pivot');
    document.getElementById('ctlPivotS').classList.remove('active-pivot');
    actualizarActo4();
  });
  document.getElementById('ctlPivotS').addEventListener('click', () => {
    ACTO4.pivot = 1;
    document.getElementById('ctlPivotS').classList.add('active-pivot');
    document.getElementById('ctlPivotN').classList.remove('active-pivot');
    actualizarActo4();
  });
  actualizarActo4();
}
window.addEventListener('DOMContentLoaded', bindActo4);
```

Agregar el estilo del botón activo en `<style>`:

```css
.active-pivot { background: var(--cyan); color: var(--ink); border-color: var(--cyan); }
```

- [ ] **Step 3: Verificar visual**

Navegar al Acto 4.

Expected:
- Aparece "38%" verde inicialmente (base, sin cambios)
- Mover slider de precio sube la cifra
- Toggle pivot Sí/No cambia visiblemente
- Cifra es estable (no flickeo violento entre actualizaciones — N=1000 da varianza ~3pp; aceptable)
- Botón "Abrir en xolver →" lleva a `xolver.cgrajales.dev/?ejemplo=tintoapp` (puede dar 404 hasta que el snippet se pegue al repo de xolver; es esperado)

- [ ] **Step 4: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Acto 4 - La decision (4 palancas + mini Monte Carlo + link xolver)"
```

---

### Task 9: Panel del Oráculo — Modo Lookup

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html`

**Objetivo:** tecla **T** abre overlay con input de ID y muestra trayectoria de un estudiante. ESC cierra. Banner amarillo "MODO DOCENTE — NO PROYECTAR" siempre visible.

- [ ] **Step 1: Agregar el HTML del panel**

Antes del cierre `</body>`:

```html
<div id="oraculoPanel" class="oraculo-overlay" style="display:none">
  <div class="oraculo-banner">⚠ MODO DOCENTE — NO PROYECTAR ⚠</div>
  <div class="oraculo-card">
    <div class="oraculo-tabs">
      <button id="oraculoTabLookup" class="oraculo-tab active">Lookup (1 ID)</button>
      <button id="oraculoTabBatch" class="oraculo-tab">Batch (lista)</button>
    </div>

    <div id="oraculoLookup" class="oraculo-pane">
      <label class="font-mono text-sm text-zinc-400">ID del estudiante</label>
      <input id="oraculoInput" type="text" placeholder="cédula, código, o nombre"
             class="oraculo-input" autocomplete="off">
      <button id="oraculoGenerar" class="cyber-btn mt-3">Generar trayectoria</button>
      <button id="oraculoClear" class="cyber-btn-sec mt-3 ml-2">Limpiar</button>
      <div id="oraculoResultado" class="oraculo-resultado"></div>
    </div>

    <div id="oraculoBatch" class="oraculo-pane" style="display:none">
      <label class="font-mono text-sm text-zinc-400">
        Pega aquí los IDs (uno por línea, opcionalmente <code>id,nombre</code>)
      </label>
      <textarea id="oraculoBatchInput" rows="10"
                placeholder="12345&#10;67890,Ana Perez&#10;..."
                class="oraculo-input oraculo-textarea"></textarea>
      <div class="mt-3 flex gap-2 flex-wrap">
        <button id="oraculoBatchGen" class="cyber-btn">Generar todas</button>
        <button id="oraculoBatchPrint" class="cyber-btn-sec">Imprimir tarjetas</button>
        <button id="oraculoBatchCSV" class="cyber-btn-sec">Exportar CSV</button>
      </div>
      <div id="oraculoBatchPreview" class="oraculo-batch-preview"></div>
    </div>

    <button id="oraculoClose" class="oraculo-close">✕</button>
  </div>
</div>
```

- [ ] **Step 2: Agregar estilos del Oráculo**

En `<style>`:

```css
.oraculo-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.85); padding: 60px 20px 20px; overflow-y: auto; }
.oraculo-banner { position: fixed; top: 0; left: 0; right: 0; background: #ffab40; color: #000; font-family: 'JetBrains Mono', monospace; font-weight: 800; text-align: center; padding: 10px; letter-spacing: 2px; z-index: 201; }
.oraculo-card { max-width: 900px; margin: 0 auto; background: var(--ink2); border: 2px solid #ffab40; border-radius: 12px; padding: 24px; position: relative; }
.oraculo-tabs { display: flex; gap: 2px; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.oraculo-tab { background: transparent; color: rgba(255,255,255,0.6); border: 0; padding: 8px 16px; cursor: pointer; font-family: 'JetBrains Mono', monospace; font-size: 12px; border-bottom: 2px solid transparent; }
.oraculo-tab.active { color: #ffab40; border-bottom-color: #ffab40; }
.oraculo-input { width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-top: 6px; }
.oraculo-input:focus { border-color: #ffab40; outline: none; }
.oraculo-textarea { resize: vertical; min-height: 200px; }
.oraculo-resultado { margin-top: 20px; }
.oraculo-resultado table { width: 100%; border-collapse: collapse; font-family: 'JetBrains Mono', monospace; font-size: 13px; }
.oraculo-resultado th, .oraculo-resultado td { padding: 6px 10px; border: 1px solid rgba(255,255,255,0.15); text-align: right; }
.oraculo-resultado th { background: rgba(255,171,64,0.15); color: #ffab40; }
.oraculo-resultado td:first-child, .oraculo-resultado th:first-child { text-align: center; }
.oraculo-veredicto { font-size: 24px; font-weight: 800; text-align: center; padding: 16px; margin-top: 12px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; }
.oraculo-veredicto.quebrar { background: rgba(255,46,147,0.15); color: var(--magenta); border: 2px solid var(--magenta); }
.oraculo-veredicto.sobrevivir { background: rgba(0,230,118,0.15); color: var(--green); border: 2px solid var(--green); }
.oraculo-close { position: absolute; top: 12px; right: 12px; background: transparent; color: rgba(255,255,255,0.5); border: 0; font-size: 20px; cursor: pointer; }
.oraculo-batch-preview { margin-top: 20px; max-height: 400px; overflow-y: auto; font-family: 'JetBrains Mono', monospace; font-size: 11px; }
```

- [ ] **Step 3: Lógica del Modo Lookup**

Agregar al `<script>`:

```js
// === Panel del Oráculo ===
function abrirOraculo() {
  document.getElementById('oraculoPanel').style.display = 'block';
  setTimeout(() => document.getElementById('oraculoInput').focus(), 100);
}
function cerrarOraculo() {
  document.getElementById('oraculoPanel').style.display = 'none';
}
function generarLookup() {
  const id = document.getElementById('oraculoInput').value;
  if (!id.trim()) return;
  const r = simularPorID(id);
  const out = document.getElementById('oraculoResultado');
  let html = `<div class="font-mono text-sm text-zinc-400 mb-2">ID: <strong class="text-white">${id}</strong></div>`;
  html += '<table><thead><tr><th>Mes</th><th>Ingreso ($M)</th><th>Gasto ($M)</th><th>Caja ($M)</th></tr></thead><tbody>';
  r.meses.forEach(m => {
    html += `<tr><td>${m.mes}</td><td>${m.ingreso.toFixed(2)}</td><td>${m.gasto.toFixed(2)}</td><td>${m.caja.toFixed(2)}</td></tr>`;
  });
  html += '</tbody></table>';
  if (r.mesQuiebra) {
    html += `<div class="oraculo-veredicto quebrar">🔴 QUEBRASTE MES ${r.mesQuiebra}</div>`;
  } else {
    const cajaFinal = r.trayectoria[r.trayectoria.length - 1];
    html += `<div class="oraculo-veredicto sobrevivir">🟢 SOBREVIVISTE — CAJA FINAL $${cajaFinal.toFixed(2)}M</div>`;
  }
  out.innerHTML = html;
}
function limpiarOraculo() {
  document.getElementById('oraculoInput').value = '';
  document.getElementById('oraculoResultado').innerHTML = '';
  document.getElementById('oraculoInput').focus();
}
function switchOraculoTab(which) {
  ['Lookup','Batch'].forEach(t => {
    document.getElementById('oraculo' + t).style.display = (t === which) ? 'block' : 'none';
    document.getElementById('oraculoTab' + t).classList.toggle('active', t === which);
  });
}
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      const open = document.getElementById('oraculoPanel').style.display === 'block';
      if (open) cerrarOraculo(); else abrirOraculo();
    }
    if (e.key === 'Escape') cerrarOraculo();
  });
  document.getElementById('oraculoGenerar').addEventListener('click', generarLookup);
  document.getElementById('oraculoInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generarLookup();
  });
  document.getElementById('oraculoClear').addEventListener('click', limpiarOraculo);
  document.getElementById('oraculoClose').addEventListener('click', cerrarOraculo);
  document.getElementById('oraculoTabLookup').addEventListener('click', () => switchOraculoTab('Lookup'));
  document.getElementById('oraculoTabBatch').addEventListener('click', () => switchOraculoTab('Batch'));
});
```

- [ ] **Step 4: Verificar Lookup**

En cualquier acto, presionar **T**.

Expected:
- Aparece overlay oscuro con banner amarillo "⚠ MODO DOCENTE — NO PROYECTAR ⚠"
- Input enfocado automáticamente
- Escribir "12345" + Enter → tabla con 12 meses + veredicto (cualquiera)
- Mismo input siempre da misma trayectoria
- ESC cierra el panel
- T desde afuera lo vuelve a abrir

- [ ] **Step 5: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Panel del Oraculo - modo Lookup (tecla T + banner docente)"
```

---

### Task 10: Panel del Oráculo — Modo Batch + Imprimir + CSV

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html`

**Objetivo:** desde el modo Batch, pegar lista de IDs, generar todas las trayectorias, vista de impresión con 4 tarjetas por A4, exportar CSV.

- [ ] **Step 1: Lógica del Modo Batch**

Agregar al `<script>`:

```js
// === Modo Batch ===
let batchData = null;
function parseBatchInput(raw) {
  return raw.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      const [id, ...rest] = line.split(',');
      return { id: id.trim(), nombre: rest.join(',').trim() || null };
    });
}
function generarBatch() {
  const raw = document.getElementById('oraculoBatchInput').value;
  const entradas = parseBatchInput(raw);
  if (entradas.length === 0) { alert('Pega al menos un ID'); return; }
  batchData = entradas.map(e => ({ ...e, simulacion: simularPorID(e.id) }));
  // Preview
  const pv = document.getElementById('oraculoBatchPreview');
  let html = `<div class="text-xs text-zinc-400 mb-2">${batchData.length} trayectorias generadas</div>`;
  html += '<table style="width:100%"><thead><tr><th>ID</th><th>Nombre</th><th>Destino</th></tr></thead><tbody>';
  batchData.forEach(b => {
    const d = b.simulacion.mesQuiebra
      ? `🔴 Mes ${b.simulacion.mesQuiebra}`
      : `🟢 $${b.simulacion.trayectoria.slice(-1)[0].toFixed(1)}M`;
    html += `<tr><td>${b.id}</td><td>${b.nombre || '—'}</td><td>${d}</td></tr>`;
  });
  html += '</tbody></table>';
  pv.innerHTML = html;
}
function imprimirBatch() {
  if (!batchData) { alert('Primero genera las trayectorias'); return; }
  const w = window.open('', '_blank');
  let html = `<!DOCTYPE html><html><head><title>Tarjetas Clase16</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 10mm; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
      .card { border: 1px solid #333; padding: 6mm; page-break-inside: avoid; height: 130mm; }
      .card h2 { margin: 0 0 2mm; font-size: 14pt; }
      .card .id { font-family: monospace; font-size: 10pt; color: #666; }
      .card table { width: 100%; border-collapse: collapse; font-family: monospace; font-size: 9pt; margin-top: 3mm; }
      .card th, .card td { border: 1px solid #999; padding: 1mm 2mm; text-align: right; }
      .card th { background: #eee; }
      .card td:first-child, .card th:first-child { text-align: center; }
      .veredicto { margin-top: 3mm; padding: 3mm; font-weight: bold; text-align: center; font-size: 11pt; border-radius: 4mm; }
      .veredicto.q { background: #ffe6ed; color: #c0007a; border: 1px solid #c0007a; }
      .veredicto.s { background: #e6fbe9; color: #008c3a; border: 1px solid #008c3a; }
      @media print { .grid { grid-template-columns: 1fr 1fr; } }
    </style></head><body><div class="grid">`;
  batchData.forEach(b => {
    html += `<div class="card">
      <h2>TintoApp · Mi vida</h2>
      <div class="id">ID: ${b.id}${b.nombre ? ' · ' + b.nombre : ''}</div>
      <table><thead><tr><th>Mes</th><th>Ingreso</th><th>Gasto</th><th>Caja</th></tr></thead><tbody>`;
    b.simulacion.meses.forEach(m => {
      html += `<tr><td>${m.mes}</td><td>${m.ingreso.toFixed(1)}</td><td>${m.gasto.toFixed(1)}</td><td>${m.caja.toFixed(1)}</td></tr>`;
    });
    html += '</tbody></table>';
    if (b.simulacion.mesQuiebra) {
      html += `<div class="veredicto q">🔴 QUEBRASTE MES ${b.simulacion.mesQuiebra}</div>`;
    } else {
      const final = b.simulacion.trayectoria.slice(-1)[0];
      html += `<div class="veredicto s">🟢 SOBREVIVISTE · $${final.toFixed(1)}M</div>`;
    }
    html += '</div>';
  });
  html += '</div></body></html>';
  w.document.write(html);
  w.document.close();
  setTimeout(() => w.print(), 500);
}
function exportarCSV() {
  if (!batchData) { alert('Primero genera las trayectorias'); return; }
  const rows = [['id','nombre','mes','ingreso','gasto','caja','quebrado_en_mes']];
  batchData.forEach(b => {
    b.simulacion.meses.forEach(m => {
      rows.push([
        b.id, b.nombre || '',
        m.mes, m.ingreso.toFixed(3), m.gasto.toFixed(3), m.caja.toFixed(3),
        b.simulacion.mesQuiebra || ''
      ]);
    });
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'trayectorias_clase16.csv';
  a.click();
  URL.revokeObjectURL(url);
}
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('oraculoBatchGen').addEventListener('click', generarBatch);
  document.getElementById('oraculoBatchPrint').addEventListener('click', imprimirBatch);
  document.getElementById('oraculoBatchCSV').addEventListener('click', exportarCSV);
});
```

- [ ] **Step 2: Verificar Batch**

Abrir el panel (T) → click pestaña "Batch (lista)". Pegar:

```
12345,Ana Perez
67890,Luis Diaz
abc12,Maria Soto
xyz99
1111,Carlos R
```

Click "Generar todas".

Expected:
- Preview muestra tabla de 5 filas con id, nombre, destino
- "Imprimir tarjetas" abre nueva ventana con grid 2×2 de tarjetas formato A4 + dialog de impresión
- "Exportar CSV" descarga `trayectorias_clase16.csv` con 5 estudiantes × hasta 12 meses

- [ ] **Step 3: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Panel del Oraculo - modo Batch + imprimir tarjetas + exportar CSV"
```

---

### Task 11: Generador de la guía .docx

**Files:**
- Create: `gen_guia_clase16.js`
- Create: `Guia_Clase16_Decision_Bajo_Incertidumbre.docx` (output del script)

**Objetivo:** script Node genera el .docx de 4 páginas según spec. Reutiliza helpers de `gen_guia8.js`.

- [ ] **Step 1: Crear el script generador**

Crear `gen_guia_clase16.js`:

```js
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, ShadingType, BorderStyle, HeadingLevel,
  TableLayoutType, PageBreak
} = require("docx");
const fs = require("fs");

const FONT = "Arial";
const SZ = 22, SZS = 18, SZL = 28, SZXL = 36;

const t = (text, opts = {}) => new TextRun({ text, font: FONT, size: opts.size || SZ, bold: opts.bold, italics: opts.italics, color: opts.color });
const p = (runs, opts = {}) => new Paragraph({ children: Array.isArray(runs) ? runs : [runs], ...opts });
const heading = (text, color = "1F3864") =>
  p([t(text, { bold: true, size: SZXL, color })], { heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } });
const subheading = (text, color = "2E74B5") =>
  p([t(text, { bold: true, size: SZL, color })], { spacing: { before: 200, after: 100 } });

const BORDER = { style: BorderStyle.SINGLE, size: 6, color: "888888" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const cell = (runs, opts = {}) => new TableCell({
  children: [p(Array.isArray(runs) ? runs : [runs], { alignment: opts.align })],
  borders: BORDERS, width: { size: opts.width || 2000, type: WidthType.DXA },
  shading: opts.shading ? { type: ShadingType.CLEAR, fill: opts.shading } : undefined,
  verticalAlign: "center", margins: { top: 80, bottom: 80, left: 100, right: 100 },
});
const headerCell = (text, w) => cell([t(text, { bold: true, color: "FFFFFF", size: SZS })], { width: w, shading: "1F3864", align: AlignmentType.CENTER });
const blankCell = (w) => cell([t("", { size: SZ })], { width: w });

// Página 1 — Portada + Acto 1
const portada = [
  heading("Clase 16 — Decisión bajo incertidumbre"),
  p([t("Fecha: ___________________", { size: SZS })], { spacing: { after: 100 } }),
  p([t("Nombre: ___________________________________________", { size: SZS })], { spacing: { after: 80 } }),
  p([t("ID: ___________________", { size: SZS })], { spacing: { after: 240 } }),

  subheading("📖 Hoy: TintoApp"),
  p([t("Lucho y Pedro fundan ", {}), t("TintoApp", { bold: true }),
    t(" — delivery de café especial a oficinas. Caja inicial: ", {}),
    t("$50 millones", { bold: true }), t(".")],
    { spacing: { after: 120 } }),
  p([t("Hoy vas a vivir TU propia versión de esta startup. ", { italics: true }),
    t("Tu trayectoria te la entrega el docente.", { bold: true, italics: true })],
    { spacing: { after: 240 } }),

  subheading("Acto 1 — La trampa del promedio"),
  p([t("Lucho cree: ingresos $11M / gastos $11M. Pedro cree: ingresos $8M / gastos $12M.")], { spacing: { after: 80 } }),
  new Table({
    columnWidths: [4500, 4500],
    rows: [
      new TableRow({ children: [headerCell("¿Cuánto dura Lucho?", 4500), headerCell("¿Cuánto dura Pedro?", 4500)] }),
      new TableRow({ children: [blankCell(4500), blankCell(4500)] }),
    ],
  }),
  p([t("", {})], { spacing: { after: 80 } }),
  p([t("¿Por qué los dos cálculos están mal?", { bold: true })], { spacing: { after: 60 } }),
  p([t("_________________________________________________________________")], {}),
  p([t("_________________________________________________________________")], {}),
  p([t("_________________________________________________________________")], { spacing: { after: 60 } }),

  p([new PageBreak()]),
];

// Página 2 — Mi vida en TintoApp
const trayectoriaRows = [];
trayectoriaRows.push(new TableRow({ children: [
  headerCell("Mes", 1200), headerCell("Ingreso ($M)", 2400),
  headerCell("Gasto ($M)", 2400), headerCell("Caja final ($M)", 2500),
]}));
trayectoriaRows.push(new TableRow({ children: [
  cell([t("0", { bold: true })], { width: 1200, align: AlignmentType.CENTER }),
  cell([t("—", {})], { width: 2400, align: AlignmentType.CENTER }),
  cell([t("—", {})], { width: 2400, align: AlignmentType.CENTER }),
  cell([t("50.0", { bold: true })], { width: 2500, align: AlignmentType.CENTER }),
]}));
for (let m = 1; m <= 12; m++) {
  trayectoriaRows.push(new TableRow({ children: [
    cell([t(String(m), { bold: true })], { width: 1200, align: AlignmentType.CENTER }),
    blankCell(2400), blankCell(2400), blankCell(2500),
  ]}));
}

const pagina2 = [
  subheading("Acto 2 — Mi vida en TintoApp"),
  p([t("Mi ID: ___________________   ·   Caja inicial: $50M", { size: SZS })], { spacing: { after: 120 } }),
  p([t("Copia los 12 meses de tu tarjeta personalizada:", { italics: true, size: SZS })], { spacing: { after: 80 } }),
  new Table({ columnWidths: [1200, 2400, 2400, 2500], rows: trayectoriaRows }),
  p([t("", {})], { spacing: { after: 100 } }),
  p([t("🎯 MI DESTINO: _____________________________________________", { bold: true, size: SZL })], { spacing: { after: 120 } }),
  p([t("(quebraste mes X o sobreviviste con $Y M)", { italics: true, size: SZS, color: "666666" })], { spacing: { after: 200 } }),
  p([t("Dibuja a mano tu trayectoria de caja (eje X: meses 0–12, eje Y: $0–60M):", { size: SZS })], { spacing: { after: 60 } }),
  // Mini-grid de 8x12 para dibujar
  new Table({
    columnWidths: new Array(13).fill(680),
    rows: new Array(8).fill(0).map(() => new TableRow({
      children: new Array(13).fill(0).map(() => new TableCell({
        children: [p([t("", {})])],
        borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
                   bottom: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
                   left: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" },
                   right: { style: BorderStyle.SINGLE, size: 2, color: "DDDDDD" } },
        width: { size: 680, type: WidthType.DXA },
      }))
    }))
  }),
  p([new PageBreak()]),
];

// Página 3 — Mi lugar en la distribución
const pagina3 = [
  subheading("Acto 3 — Mi lugar en la distribución"),
  p([t("Cuando el docente proyecte el histograma de 10.000 vidas, anota:", { size: SZS, italics: true })], { spacing: { after: 100 } }),
  new Table({
    columnWidths: [5500, 3500],
    rows: [
      new TableRow({ children: [headerCell("Estadístico poblacional", 5500), headerCell("Valor", 3500)] }),
      new TableRow({ children: [cell([t("P(quebrar antes del mes 12)", {})], { width: 5500 }), blankCell(3500)] }),
      new TableRow({ children: [cell([t("Mes esperado de quiebra", {})], { width: 5500 }), blankCell(3500)] }),
      new TableRow({ children: [cell([t("Peor 5%: quiebra antes del mes _____", {})], { width: 5500 }), blankCell(3500)] }),
    ],
  }),
  p([t("", {})], { spacing: { after: 200 } }),

  subheading("Reflexión", "2E74B5"),
  p([t("¿Sobreviviste o quebraste?  ☐ Sobreviví    ☐ Quebré mes ____", { size: SZS })], { spacing: { after: 100 } }),
  p([t("¿Estás en el 38% que sobrevive o en el 62% que quiebra?", { size: SZS })], { spacing: { after: 60 } }),
  p([t("_________________________________________________________________")], {}),
  p([t("", {})], { spacing: { after: 100 } }),
  p([t("¿Tu destino es típico (cerca del esperado) o atípico (cola)?", { size: SZS })], { spacing: { after: 60 } }),
  p([t("_________________________________________________________________")], {}),
  p([t("_________________________________________________________________")], { spacing: { after: 60 } }),

  p([new PageBreak()]),
];

// Página 4 — La decisión + xolver
const pagina4 = [
  subheading("Acto 4 — La decisión (xolver)"),
  p([t("Sabes que tienes 62% de quebrar. ¿Qué decides hacer? Tienes 4 palancas:")], { spacing: { after: 100 } }),
  p([t("1. Subir precio (%) — entre 0 y 40", { size: SZS })], {}),
  p([t("2. Recortar marketing (%) — entre 0 y 50", { size: SZS })], {}),
  p([t("3. Contratar repartidores extra — entre 0 y 3 (entero)", { size: SZS })], {}),
  p([t("4. Pivotar a B2B — sí o no (binaria)", { size: SZS })], { spacing: { after: 160 } }),

  p([t("Objetivo: ", { bold: true }), t("minimizar el costo de los cambios, sujeto a que P(sobrevivir 12m) suba al menos 20 puntos porcentuales.", {})], { spacing: { after: 200 } }),

  subheading("📋 Tu variante (encierra una):"),
  p([t("☐ A — meta de mejora ≥ 20 pp (base)", { size: SZS })], {}),
  p([t("☐ B — restricción extra: no subir precio más de 15%", { size: SZS })], {}),
  p([t("☐ C — meta agresiva: mejora ≥ 30 pp", { size: SZS })], { spacing: { after: 200 } }),

  subheading("✏️ Tu modelo en xolver:"),
  p([t("Variables de decisión (nombre · tipo · mín · máx):", { bold: true, size: SZS })], { spacing: { after: 80 } }),
  ...new Array(4).fill(0).map(() => p([t("· __________________________________________________________")], {})),
  p([t("", {})], { spacing: { after: 100 } }),
  p([t("Función objetivo:", { bold: true, size: SZS })], { spacing: { after: 40 } }),
  p([t("MIN  Z = ______________________________________________________")], { spacing: { after: 100 } }),
  p([t("Restricciones:", { bold: true, size: SZS })], { spacing: { after: 40 } }),
  p([t("· ______________________________________________________________")], {}),
  p([t("· ______________________________________________________________")], {}),
  p([t("· ______________________________________________________________")], { spacing: { after: 200 } }),

  p([t("🎯 Respuesta de xolver: ____________________________________", { bold: true, size: SZL })], { spacing: { after: 200 } }),

  subheading("Discusión final"),
  p([t("¿Tu decisión coincidió con la de otros grupos? ¿Por qué cambió cuando la restricción cambió?", { size: SZS, italics: true })], { spacing: { after: 80 } }),
  p([t("_________________________________________________________________")], {}),
  p([t("_________________________________________________________________")], {}),
  p([t("_________________________________________________________________")], {}),
  p([t("_________________________________________________________________")], {}),
];

const doc = new Document({
  creator: "Clase 16",
  styles: { default: { document: { run: { font: FONT, size: SZ } } } },
  sections: [{
    children: [...portada, ...pagina2, ...pagina3, ...pagina4],
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Guia_Clase16_Decision_Bajo_Incertidumbre.docx", buf);
  console.log("✓ Guia_Clase16_Decision_Bajo_Incertidumbre.docx generada");
});
```

- [ ] **Step 2: Ejecutar el generador**

Run: `node gen_guia_clase16.js`

Expected output: `✓ Guia_Clase16_Decision_Bajo_Incertidumbre.docx generada`

- [ ] **Step 3: Verificar el .docx**

Abrir `Guia_Clase16_Decision_Bajo_Incertidumbre.docx` en Word.

Expected:
- Página 1: Portada con nombre/ID + Acto 1 con tabla de 2 columnas + pregunta abierta
- Página 2: Tabla 13×4 (mes 0 + 12 filas en blanco) + recuadro de destino + grid 8×13 para dibujar a mano
- Página 3: Tabla de stats poblacionales en blanco + 3 preguntas reflexivas
- Página 4: Enunciado problema + variantes + tabla en blanco para modelar + recuadros para respuesta + discusión final
- Sin overflow, formato limpio Arial 11pt aprox

- [ ] **Step 4: Commit**

```bash
git add gen_guia_clase16.js Guia_Clase16_Decision_Bajo_Incertidumbre.docx
git commit -m "Clase16: generador y guia impresa de 4 paginas (trayectoria + reflexion + modelado xolver)"
```

---

### Task 12: Verificación final integrada

**Files:** ninguno modificado (solo verificación)

**Objetivo:** correr la matriz completa de verificación del spec antes de declarar la clase lista.

- [ ] **Step 1: Tests automatizados**

Abrir `Clase16_Decision_Bajo_Incertidumbre.html?test=1` en Chrome. Abrir consola (F12).

Expected: 7 líneas `✓` consecutivas sin asserts rojos.

- [ ] **Step 2: Navegación completa de los 4 actos**

Recargar sin `?test=1`. Usar flecha derecha para avanzar paso a paso del Acto 1 al Acto 4.

Expected:
- HUD superior actualiza al cambiar de acto (segmento activo)
- Cada `data-step` revela con su animación
- KaTeX renderiza en Acto 1
- Acto 2: "Lanzar mes" funciona, "Otra vida" resetea
- Acto 3: cascada anima en <3s sin congelar, histograma sincroniza con la nube, 3 stats aparecen al final
- Acto 4: sliders + pivot actualizan P(sobrevivir) en vivo
- Mensaje final "Eso es decidir como adulto" cierra

- [ ] **Step 3: Panel del Oráculo end-to-end**

Presionar T en cualquier momento.

Expected:
- Banner amarillo "MODO DOCENTE — NO PROYECTAR" visible
- Lookup: ID "estudiante1" + Enter → tabla + veredicto. Repetir el mismo ID da el mismo resultado.
- Batch: pegar 30 IDs distintos (ej. nombres) → "Generar todas" muestra preview con conteo, ~15–22 quebraron
- "Imprimir tarjetas" abre nueva ventana con grid 2×2 + diálogo de impresión
- "Exportar CSV" descarga archivo
- ESC y T cierran el panel

- [ ] **Step 4: Móvil**

Abrir el HTML en un celular o usar DevTools mobile mode (375×667).

Expected:
- HUD se ajusta sin cortarse
- Cards se apilan verticalmente
- Canvas escala
- Navegación con flechas funciona vía teclado bluetooth (o ignorar — uso principal es desktop proyectado)

- [ ] **Step 5: Link xolver**

Click "Abrir en xolver →" en Acto 4.

Expected: abre `https://xolver.cgrajales.dev/?ejemplo=tintoapp` en nueva pestaña. (Si el snippet aún no se pegó al repo de xolver, mostrará xolver vacío — esperado hasta que apliques el snippet.)

- [ ] **Step 6: Guía .docx integral**

Abrir `Guia_Clase16_Decision_Bajo_Incertidumbre.docx`.

Expected:
- 4 páginas que paginan limpiamente
- Tabla del Acto 2 cabe en página 2 sin overflow
- Grid de dibujo cabe debajo del recuadro de destino
- Tablas y recuadros del Acto 4 caben en página 4

- [ ] **Step 7: Si todo OK, marcar el spec como completado**

Editar el frontmatter de `docs/superpowers/specs/2026-05-19-clase16-monte-carlo-design.md`: `status: aprobado` → `status: implementado`.

- [ ] **Step 8: Commit final**

```bash
git add docs/superpowers/specs/2026-05-19-clase16-monte-carlo-design.md
git commit -m "Clase16: marcar spec como implementado tras verificacion integral"
```

---

## Self-Review (post-plan)

**Spec coverage:**

| Spec section | Plan task(s) |
|---|---|
| Audiencia/formato/stack | Task 1 |
| Identidad visual cyberpunk | Task 1 (estilos copiados de Clase15) |
| Acto 1 — Trampa del promedio | Task 5 |
| Acto 2 — Una vida posible (3 beats) | Task 6 (beat 1: slot machine; beat 2 ocurre en clase con tarjetas pre-impresas → Tasks 9–10) |
| Acto 3 — Diez mil vidas + cascada + histograma + stats | Task 7 |
| Acto 4 — La decisión + xolver link | Task 8 |
| Motor de simulación (uniforme, triangular, simularUnaVida, monteCarlo) | Tasks 2–3 |
| PRNG seeded (FNV-1a + mulberry32 + simularPorID) | Task 4 |
| Panel del Oráculo (Lookup + Batch + Imprimir + CSV) | Tasks 9–10 |
| Guía impresa de 4 páginas | Task 11 |
| Snippet xolver `tintoapp` | Queda en el spec (no es un archivo de este repo) |
| Verificación integral | Task 12 |

**Placeholder scan:** sin "TBD", sin "TODO", sin "implementar luego". Todo paso tiene código completo o comando concreto.

**Type consistency:** funciones referenciadas entre tasks:
- `simularUnaVida(params, rng)` definida en Task 2, usada en Task 4 (`simularPorID`) y Task 3 (`monteCarlo`) ✓
- `PARAMS` definida en Task 2, usada en Tasks 3, 4, 6, 8 ✓
- `monteCarlo`, `resumen` definidas en Task 3, usadas en Tasks 7, 8 ✓
- `simularPorID` definida en Task 4, usada en Tasks 9, 10 ✓
- `acto2Estado`, `acto3Corridas` son locales a su task ✓
- IDs DOM (`acto2Lanzar`, `oraculoInput`, etc.) consistentes entre HTML y JS dentro de cada task ✓

**Riesgos del spec cubiertos:**
- Bridge "promedios ajustados" → narrado explícitamente en Task 8 HTML
- xolver caído → Task 12 step 5 reconoce el caso (esperado)
- 10K trayectorias performance → Task 7 implementa adaptive fallback a 5K
- Cambio repo xolver depende del Pi → snippet vive en el spec, no en este repo
- Tarjeta perdida → Modo Lookup del Oráculo (Task 9)
- Proyectar Panel sin querer → Task 9 implementa banner amarillo

Todo cubierto.
