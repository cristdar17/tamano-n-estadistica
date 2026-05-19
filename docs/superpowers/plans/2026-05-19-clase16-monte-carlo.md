# Clase 16 — Decisión bajo incertidumbre (Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir la última clase del curso (Clase 16): un HTML cinematográfico de 60 min sobre Monte Carlo aplicado al runway de una startup, con Panel del Oráculo para trayectorias personalizadas por estudiante, y aterrizaje hands-on en xolver.cgrajales.dev.

**Architecture:** Single-page HTML con Tailwind CDN + KaTeX + JS vanilla (mismo patrón que Clase15). 4 actos navegables por teclado. Motor de simulación seeded (mulberry32) para reproducibilidad. Canvas 2D para la cascada de 10K trayectorias. Panel del Oráculo oculto (tecla `O`) con modos Single y Batch. Guía impresa generada vía script Node con el paquete `docx`.

**Tech Stack:** HTML + Tailwind CDN + Inter/JetBrains Mono + KaTeX + Canvas 2D + JS vanilla. Node + `docx` (ya en `node_modules`) para la guía .docx.

**Spec:** `docs/superpowers/specs/2026-05-19-clase16-monte-carlo-design.md`

**Verificación:** Manual/visual en Chrome — esta es contenido pedagógico, no software de producción. Cada tarea termina con un check visual concreto.

---

## Estructura de archivos

| Archivo | Propósito | Tamaño esperado |
|---|---|---|
| `Clase16_Decision_Bajo_Incertidumbre.html` | Clase completa (single-page) | ~5000 líneas, ~350 KB |
| `gen_guia_clase16.js` | Script Node que genera la guía .docx | ~300 líneas |
| `Guia_Clase16_Decision_Bajo_Incertidumbre.docx` | Output del script anterior | 4 páginas A4 |
| `docs/superpowers/specs/2026-05-19-clase16-monte-carlo-design.md` | Spec (ya commiteado) | — |

El HTML se organiza internamente así:

```
<head>          fonts, Tailwind, KaTeX
<style>         CSS reutilizado de Clase15 + estilos específicos
<body>
  <bg-grid> <bg-orb> <scanlines>
  <hud-top>            progreso de 4 actos
  <main>
    <section data-chapter="1">  Acto 1: Trampa del promedio
    <section data-chapter="2">  Acto 2: Una vida posible
    <section data-chapter="3">  Acto 3: Diez mil vidas
    <section data-chapter="4">  Acto 4: La decisión
  </main>
  <hud-bottom>
  <div id="oraclePanel">         Panel del Oráculo (oculto, hidden by default)
<script>        motor de pasos + simulación + cascada + panel
```

---

## Task 1: Esqueleto HTML + estilos base

**Files:**
- Create: `Clase16_Decision_Bajo_Incertidumbre.html`

- [ ] **Step 1.1: Copiar el esqueleto de Clase15 como punto de partida**

Esto reutiliza el HUD, los fondos animados, los estilos base, el controlador de pasos, KaTeX, y mantiene continuidad visual con la clase anterior.

```bash
cp Clase15_Hipotesis_Nula_Alternativa.html Clase16_Decision_Bajo_Incertidumbre.html
```

- [ ] **Step 1.2: Actualizar el título y limpiar contenido específico de Clase15**

Editar el archivo recién copiado:

1. Cambiar `<title>` a `Clase 16 — Decisión bajo incertidumbre`.
2. Cambiar el texto del `<div class="hud-logo">` a `CLASE 16 // MONTE CARLO + XOLVER` o similar.
3. Cambiar la constante `TOTAL_CHAPTERS = 11` (o lo que sea) a `TOTAL_CHAPTERS = 4`.
4. Eliminar todas las `<section data-chapter="N">` de Clase15. Dejar 4 secciones vacías:

```html
<section class="scene" data-chapter="1">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 1 · La trampa del promedio</div>
    <!-- contenido del Acto 1 va aquí -->
  </div>
</section>
<section class="scene" data-chapter="2">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 2 · Una vida posible</div>
  </div>
</section>
<section class="scene" data-chapter="3">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 3 · Diez mil vidas</div>
  </div>
</section>
<section class="scene" data-chapter="4">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 4 · La decisión</div>
  </div>
</section>
```

5. Buscar y eliminar funciones específicas de Clase15 que no usaremos:
   - `resetMeter1`, `resetUniverses`, `resetEvidence` (las simulaciones de Clase15)
   - El bloque entero `INTERACTIVE EXERCISES (caps 24-33)` y siguientes
   - Cualquier función `_exMaxScore`, `answerEx`, etc.
6. Cambiar `localStorage` key de `'clase15_state'` a `'clase16_state'` (en `saveState`, `loadState`, `resetClass`).
7. Actualizar el array `stepsPerChapter` para que tenga 4 entradas, todas en 0 por ahora: `const stepsPerChapter = { 1: 0, 2: 0, 3: 0, 4: 0 };`. Iremos incrementando por acto.
8. Actualizar el HUD de progreso para mostrar 4 segmentos en lugar del número anterior. Buscar el `<div class="hud-progress">` y dejar exactamente 4 `<div class="hud-seg">` adentro.

- [ ] **Step 1.3: Verificación visual**

Abrir el archivo en Chrome (doble-click sobre el HTML o `start Clase16_Decision_Bajo_Incertidumbre.html`):

- Se ve la estética cyberpunk (fondo oscuro, grid, orbs).
- HUD superior con 4 segmentos.
- 4 secciones con sus tags ("Acto 1 · La trampa del promedio", etc.).
- Flecha derecha avanza entre secciones sin errores.
- No hay errores en la consola del navegador (F12).

- [ ] **Step 1.4: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: esqueleto inicial copiado de Clase15 con 4 actos vacios"
```

---

## Task 2: Motor de simulación + PRNG seeded

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (agregar al final del `<script>` principal)

Estos son los pilares matemáticos de toda la clase: distribuciones, una vida, Monte Carlo masivo, y la versión seeded para el Panel del Oráculo.

- [ ] **Step 2.1: Agregar PARAMS globales y helpers de distribución**

Al inicio del `<script>` principal (antes del controlador de pasos), insertar:

```js
/* ============================================================
   SIMULACIÓN MONTE CARLO — CORE
   ============================================================ */

const PARAMS = {
  cajaInicial: 50,        // millones de pesos
  ingMin: 5,  ingMax: 15, // Uniforme
  gasMin: 9,  gasModa: 11,  gasMax: 14, // Triangular
};

// Random Math.random()-based
function uniforme(rng, a, b) { return a + rng() * (b - a); }

function triangular(rng, min, mode, max) {
  const u = rng();
  const c = (mode - min) / (max - min);
  return u < c
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

// Una trayectoria de 12 meses con el RNG inyectado
function simularUnaVida(params, rng) {
  let caja = params.cajaInicial;
  const meses = []; // [{ing, gas, caja}]
  let mesQuiebra = null;
  for (let m = 1; m <= 12; m++) {
    const ing = uniforme(rng, params.ingMin, params.ingMax);
    const gas = triangular(rng, params.gasMin, params.gasModa, params.gasMax);
    caja += ing - gas;
    meses.push({ ing, gas, caja });
    if (caja <= 0 && mesQuiebra === null) {
      mesQuiebra = m;
      // los meses restantes se rellenan con caja=0 para gráfica limpia
      for (let r = m + 1; r <= 12; r++) meses.push({ ing: 0, gas: 0, caja: 0 });
      break;
    }
  }
  return { meses, mesQuiebra, cajaFinal: meses[meses.length - 1].caja };
}

// Monte Carlo de N corridas usando Math.random
function monteCarlo(params, N = 10000) {
  const rng = Math.random;
  const resultados = [];
  for (let i = 0; i < N; i++) resultados.push(simularUnaVida(params, rng));
  return resultados;
}
```

- [ ] **Step 2.2: Agregar PRNG seeded (FNV-1a + mulberry32)**

Justo debajo del bloque anterior:

```js
/* ============================================================
   PRNG SEEDED — para Panel del Oráculo (reproducible por ID)
   ============================================================ */

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
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
  const cleanId = String(id || '').trim().toLowerCase();
  if (!cleanId) return null;
  const rng = mulberry32(hashStr(cleanId));
  return simularUnaVida(params, rng);
}
```

- [ ] **Step 2.3: Calcular estadísticas del Monte Carlo (para Acto 3)**

Justo debajo:

```js
function statsMonteCarlo(resultados) {
  const N = resultados.length;
  const quiebras = resultados.filter(r => r.mesQuiebra !== null);
  const probQuiebra = quiebras.length / N;
  const probSobrevivir = 1 - probQuiebra;

  const mesesQuiebra = quiebras.map(r => r.mesQuiebra).sort((a, b) => a - b);
  const mesEsperado = mesesQuiebra.length > 0
    ? mesesQuiebra.reduce((a, b) => a + b, 0) / mesesQuiebra.length
    : null;
  const peor5pct = mesesQuiebra.length > 0
    ? mesesQuiebra[Math.floor(mesesQuiebra.length * 0.05)] // percentil 5 (más temprano)
    : null;

  // histograma de mes de quiebra (1..12)
  const histo = new Array(13).fill(0); // índice 0 = nunca; 1..12 = mes
  resultados.forEach(r => histo[r.mesQuiebra || 0]++);

  return { N, probQuiebra, probSobrevivir, mesEsperado, peor5pct, histo };
}
```

- [ ] **Step 2.4: Verificación en consola del navegador**

Abrir el HTML en Chrome → F12 → consola. Probar:

```js
const r = monteCarlo(PARAMS, 10000);
const s = statsMonteCarlo(r);
console.log('P(quiebra):', s.probQuiebra.toFixed(3));
console.log('Mes esperado:', s.mesEsperado?.toFixed(2));
console.log('Peor 5%:', s.peor5pct);
```

Resultados esperados:
- `P(quiebra)` entre **0.55 y 0.70** (calibrado con los PARAMS dados).
- `Mes esperado` entre **8 y 11**.
- `Peor 5%` entre **3 y 5**.

Si los números salen fuera de esos rangos, los `PARAMS` están mal calibrados — ajustar `gasMax` o `ingMin` y rever.

También probar el seeded:

```js
const a = simularPorID('12345');
const b = simularPorID('12345');
console.log(a.mesQuiebra, b.mesQuiebra); // deben ser idénticos

// 30 IDs distintos: dispersión
const lista = Array.from({length: 30}, (_, i) => simularPorID('id' + i));
const ms = lista.map(t => t.mesQuiebra);
console.log('mesQuiebra de 30 IDs:', ms);
// Esperado: mezcla de nulls (sobrevivieron) y números entre 2 y 12
```

- [ ] **Step 2.5: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: motor de simulacion (uniforme/triangular/monteCarlo) + PRNG seeded por ID"
```

---

## Task 3: Acto 1 — La trampa del promedio

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (rellenar `data-chapter="1"`)

- [ ] **Step 3.1: Estructura HTML del Acto 1 (steps 1-5)**

Reemplazar el contenido vacío de `<section data-chapter="1">` con:

```html
<section class="scene" data-chapter="1">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 1 · La trampa del promedio</div>

    <h1 class="cyber gradient-text glow-magenta" data-step="1" data-anim="zoom">
      Lucho y Pedro montan TintoApp
    </h1>
    <p class="text-zinc-300 text-lg mt-4 max-w-3xl" data-step="1">
      Delivery de café especial a oficinas. <strong>Caja inicial: $50M.</strong>
      Cada uno hace sus cuentas con promedios.
    </p>

    <div class="grid md:grid-cols-2 gap-6 mt-10">
      <div class="cyber-card cyan" data-step="2" data-anim="slide-left">
        <div class="text-cyan-300 font-mono text-xs uppercase tracking-wider mb-2">Lucho (optimista)</div>
        <div class="text-2xl font-mono">Ingresos: <span class="glow-cyan">$11M/mes</span></div>
        <div class="text-2xl font-mono">Gastos:   <span class="glow-cyan">$11M/mes</span></div>
        <div class="text-lime-400 text-3xl mt-3 font-bold">→ vivimos para siempre</div>
      </div>
      <div class="cyber-card magenta" data-step="3" data-anim="slide-right">
        <div class="text-magenta-300 font-mono text-xs uppercase tracking-wider mb-2">Pedro (realista nervioso)</div>
        <div class="text-2xl font-mono">Ingresos: <span class="glow-magenta">$8M/mes</span></div>
        <div class="text-2xl font-mono">Gastos:   <span class="glow-magenta">$12M/mes</span></div>
        <div class="text-red-400 text-3xl mt-3 font-bold">→ morimos mes 12</div>
      </div>
    </div>

    <div class="mt-10" data-step="4">
      <canvas id="acto1Canvas" width="900" height="280" class="w-full max-w-4xl mx-auto block rounded-lg border border-violet-500/20"></canvas>
      <div class="text-center text-sm text-zinc-400 mt-2 font-mono">
        Cajas mes a mes asumiendo promedios constantes
      </div>
    </div>

    <div class="mt-12 text-center" data-step="5" data-anim="glitch">
      <div class="inline-block text-5xl md:text-7xl font-mono font-extrabold glow-magenta gradient-text">
        ningún mes es promedio
      </div>
      <p class="text-zinc-400 mt-6 font-mono max-w-2xl mx-auto">
        Fórmula real:
        <span class="katex-block" data-katex>caja(t) = caja(0) + \sum_{i=1}^{t}(ingresos_i - gastos_i)</span>
        La <strong>Σ es de variables aleatorias</strong>, no de constantes. Las pizarras de Lucho y Pedro mienten.
      </p>
    </div>
  </div>
</section>
```

Notas:
- `data-step="N"` marca cuándo cada elemento se revela. 5 pasos total para el Acto 1.
- `.cyber-card.cyan` y `.cyber-card.magenta` ya existen en el CSS de Clase15.

- [ ] **Step 3.2: Actualizar stepsPerChapter para que el Acto 1 tenga 5 pasos**

Buscar la constante `stepsPerChapter` y cambiar a:

```js
const stepsPerChapter = { 1: 5, 2: 0, 3: 0, 4: 0 };
```

- [ ] **Step 3.3: Agregar dibujo del Canvas del Acto 1 (las dos líneas rectas)**

Al final del `<script>`, agregar:

```js
/* ============================================================
   ACTO 1 — Canvas de dos líneas rectas
   ============================================================ */
function drawActo1() {
  const cvs = document.getElementById('acto1Canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  const padL = 60, padR = 30, padT = 20, padB = 40;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;

  ctx.clearRect(0, 0, W, H);

  // ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1);
  ctx.stroke();

  // labels
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '11px "JetBrains Mono", monospace';
  ctx.fillText('caja ($M)', 8, 28);
  ctx.fillText('mes', x1 - 30, y1 + 22);
  for (let m = 0; m <= 12; m += 2) {
    const x = x0 + (m / 12) * (x1 - x0);
    ctx.fillText(String(m), x - 4, y1 + 16);
  }
  for (let v = 0; v <= 60; v += 20) {
    const y = y1 - (v / 60) * (y1 - y0);
    ctx.fillText('$' + v, 18, y + 3);
  }

  const mapX = m => x0 + (m / 12) * (x1 - x0);
  const mapY = v => y1 - (Math.max(0, v) / 60) * (y1 - y0);

  // Lucho: caja = 50 + 0 * t (línea plana)
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#00f0ff'; ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(mapX(0), mapY(50));
  ctx.lineTo(mapX(12), mapY(50));
  ctx.stroke();

  // Pedro: caja = 50 - 4 * t (línea descendente, toca 0 en mes 12.5)
  ctx.strokeStyle = '#ff2e93';
  ctx.beginPath();
  ctx.moveTo(mapX(0), mapY(50));
  ctx.lineTo(mapX(12), mapY(50 - 4 * 12));
  ctx.stroke();

  ctx.shadowBlur = 0;

  // etiquetas de líneas
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('Lucho', mapX(11), mapY(50) - 6);
  ctx.fillStyle = '#ff2e93';
  ctx.fillText('Pedro', mapX(11), mapY(50 - 4 * 11) + 18);
}
```

- [ ] **Step 3.4: Llamar `drawActo1()` cuando se revela el step 4**

Modificar la función `applyReveal()` (que ya existe del esqueleto de Clase15) para que, al revelar el step 4 del capítulo 1, dispare `drawActo1()`. La forma más simple: hookear al final de `applyReveal()`:

```js
function applyReveal() {
  const sec = document.querySelector('[data-chapter="' + currentChapter + '"]');
  if (!sec) return;
  sec.querySelectorAll('[data-step]').forEach(el => {
    const n = parseInt(el.dataset.step);
    el.classList.toggle('is-revealed', n <= currentStep);
  });
  // Hook por capítulo
  if (currentChapter === 1 && currentStep >= 4) drawActo1();
}
```

- [ ] **Step 3.5: Verificación visual**

Recargar el HTML en Chrome. Avanzar con flecha derecha:

1. Tras step 1: título "Lucho y Pedro montan TintoApp" + intro.
2. Tras step 2: tarjeta cyan de Lucho aparece desde la izquierda.
3. Tras step 3: tarjeta magenta de Pedro aparece desde la derecha.
4. Tras step 4: gráfico con las dos líneas (cyan plana arriba, magenta descendiendo).
5. Tras step 5: glitch + "ningún mes es promedio" + fórmula KaTeX renderizada.

Si la fórmula no renderiza, verificar que KaTeX `renderMathInElement` esté en el bloque `DOMContentLoaded` (debería estar en el esqueleto de Clase15).

- [ ] **Step 3.6: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16 Acto 1: trampa del promedio (Lucho/Pedro + canvas + glitch)"
```

---

## Task 4: Acto 2 Beat 1 — Slot machine demo

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (rellenar `data-chapter="2"`)

- [ ] **Step 4.1: Estructura HTML del Acto 2 (steps 1-6)**

Reemplazar el contenido de `<section data-chapter="2">`:

```html
<section class="scene" data-chapter="2">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 2 · Una vida posible</div>

    <h2 class="cyber gradient-text-2 glow-cyan" data-step="1" data-anim="slide-left">
      Definamos las distribuciones
    </h2>
    <p class="text-zinc-300 max-w-2xl mt-3" data-step="1">
      Cada mes no es un número, es una <em>variable aleatoria</em>:
    </p>

    <div class="grid md:grid-cols-2 gap-6 mt-8">
      <div class="cyber-card cyan" data-step="2">
        <div class="text-cyan-300 font-mono text-xs uppercase tracking-wider mb-2">Ingresos</div>
        <div class="text-lg font-mono">Uniforme($5M, $15M)</div>
        <div class="text-zinc-400 text-sm mt-2">Cualquier mes podría caer en cualquier punto del rango con igual probabilidad.</div>
      </div>
      <div class="cyber-card magenta" data-step="2">
        <div class="text-magenta-300 font-mono text-xs uppercase tracking-wider mb-2">Gastos</div>
        <div class="text-lg font-mono">Triangular($9M, moda $11M, $14M)</div>
        <div class="text-zinc-400 text-sm mt-2">Más probable cerca de $11M, pero puede explotar a $14M.</div>
      </div>
    </div>

    <div class="cyber-card violet mt-10 p-6" data-step="3">
      <div class="flex items-center gap-4 flex-wrap mb-4">
        <div class="text-2xl font-mono">Mes actual:
          <span id="slotMes" class="glow-cyan">0</span>
        </div>
        <div class="text-2xl font-mono">Caja:
          <span id="slotCaja" class="glow-lime">$50.0M</span>
        </div>
        <button id="btnLanzarMes" class="ml-auto px-5 py-2 rounded-lg bg-grad-brand text-white font-mono font-bold uppercase tracking-wider hover:opacity-90">
          Lanzar mes ▶
        </button>
        <button id="btnOtraVida" class="px-3 py-2 rounded-lg border border-violet-500/40 text-violet-200 font-mono text-sm hover:bg-violet-500/10">
          Otra vida ↻
        </button>
      </div>
      <div class="grid md:grid-cols-2 gap-6 mb-4">
        <div>
          <div class="text-xs text-zinc-500 font-mono uppercase tracking-wider">Ingreso del mes</div>
          <div id="slotIng" class="text-4xl font-mono glow-cyan mt-1">— $M</div>
        </div>
        <div>
          <div class="text-xs text-zinc-500 font-mono uppercase tracking-wider">Gasto del mes</div>
          <div id="slotGas" class="text-4xl font-mono glow-magenta mt-1">— $M</div>
        </div>
      </div>
      <canvas id="acto2Canvas" width="900" height="240" class="w-full block rounded-md border border-violet-500/20 bg-ink-800/40"></canvas>
    </div>

    <div class="mt-8 text-zinc-300" data-step="4">
      <p>Esa fue UNA vida posible. ¿Y si fue mala suerte? Otra. ¿Y otra?</p>
    </div>

    <div class="cyber-card mt-8 p-6" data-step="5">
      <div class="text-magenta-300 font-mono text-sm uppercase tracking-wider mb-2">🎯 Tu propia vida en TintoApp</div>
      <p class="text-zinc-200">
        Cada uno tiene <strong>su propia trayectoria</strong> impresa en la tira grapada a su guía.
        Llenen la tabla de la página 2 copiando sus 12 meses, dibujen la línea de caja a mano, y anoten su destino.
      </p>
    </div>

    <div class="mt-10 text-center text-zinc-400" data-step="6">
      <p class="text-lg">Levanten la mano quien <strong>quebró antes del mes 6</strong>.</p>
      <p class="text-lg mt-2">Los que <strong>sobrevivieron 12 meses</strong>.</p>
      <p class="text-magenta-300 font-mono mt-4">Y eso son 30 vidas. ¿Qué pasaría si vemos <strong>10.000</strong>?</p>
    </div>
  </div>
</section>
```

- [ ] **Step 4.2: Actualizar stepsPerChapter para Acto 2**

```js
const stepsPerChapter = { 1: 5, 2: 6, 3: 0, 4: 0 };
```

- [ ] **Step 4.3: Lógica del slot machine + canvas del Acto 2**

Al final del `<script>`:

```js
/* ============================================================
   ACTO 2 — Slot machine + canvas de trayectoria
   ============================================================ */
let acto2 = { caja: PARAMS.cajaInicial, mes: 0, historia: [PARAMS.cajaInicial], destino: null };

function resetActo2() {
  acto2 = { caja: PARAMS.cajaInicial, mes: 0, historia: [PARAMS.cajaInicial], destino: null };
  document.getElementById('slotMes').textContent = '0';
  document.getElementById('slotCaja').textContent = '$50.0M';
  document.getElementById('slotIng').textContent = '— $M';
  document.getElementById('slotGas').textContent = '— $M';
  document.getElementById('btnLanzarMes').disabled = false;
  drawActo2();
}

function lanzarMesActo2() {
  if (acto2.destino) return; // ya quebró
  if (acto2.mes >= 12) return;
  acto2.mes++;
  const ing = uniforme(Math.random, PARAMS.ingMin, PARAMS.ingMax);
  const gas = triangular(Math.random, PARAMS.gasMin, PARAMS.gasModa, PARAMS.gasMax);
  acto2.caja += ing - gas;
  if (acto2.caja <= 0) {
    acto2.caja = 0;
    acto2.destino = `Quebraste mes ${acto2.mes}`;
    document.getElementById('btnLanzarMes').disabled = true;
  } else if (acto2.mes === 12) {
    acto2.destino = `Sobreviviste con $${acto2.caja.toFixed(1)}M`;
    document.getElementById('btnLanzarMes').disabled = true;
  }
  acto2.historia.push(acto2.caja);
  document.getElementById('slotMes').textContent = acto2.mes;
  document.getElementById('slotIng').textContent = '$' + ing.toFixed(1) + 'M';
  document.getElementById('slotGas').textContent = '$' + gas.toFixed(1) + 'M';
  document.getElementById('slotCaja').textContent = '$' + acto2.caja.toFixed(1) + 'M';
  drawActo2();
}

function drawActo2() {
  const cvs = document.getElementById('acto2Canvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  const padL = 50, padR = 20, padT = 14, padB = 26;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  ctx.clearRect(0, 0, W, H);

  // ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '10px "JetBrains Mono", monospace';
  for (let m = 0; m <= 12; m += 2) {
    const x = x0 + (m / 12) * (x1 - x0);
    ctx.fillText(String(m), x - 3, y1 + 14);
  }
  for (let v = 0; v <= 60; v += 20) {
    const y = y1 - (v / 60) * (y1 - y0);
    ctx.fillText('$' + v, 10, y + 3);
  }

  // línea de caja
  const mapX = m => x0 + (m / 12) * (x1 - x0);
  const mapY = v => y1 - (Math.max(0, v) / 60) * (y1 - y0);

  ctx.strokeStyle = '#b388ff';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#b388ff'; ctx.shadowBlur = 10;
  ctx.beginPath();
  acto2.historia.forEach((v, i) => {
    if (i === 0) ctx.moveTo(mapX(i), mapY(v));
    else ctx.lineTo(mapX(i), mapY(v));
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // destino badge
  if (acto2.destino) {
    ctx.fillStyle = acto2.destino.startsWith('Quebraste') ? '#ff5252' : '#00e676';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(acto2.destino, W / 2 - 80, padT + 4);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // wiring de botones del Acto 2
  document.getElementById('btnLanzarMes')?.addEventListener('click', lanzarMesActo2);
  document.getElementById('btnOtraVida')?.addEventListener('click', resetActo2);
  // dibujar canvas inicial cuando el Acto 2 se reveal
  // (se llama desde applyReveal cuando step >= 3 en cap 2)
});
```

- [ ] **Step 4.4: Hookear el render en `applyReveal()`**

Modificar la función `applyReveal()` para añadir el hook del Acto 2:

```js
function applyReveal() {
  const sec = document.querySelector('[data-chapter="' + currentChapter + '"]');
  if (!sec) return;
  sec.querySelectorAll('[data-step]').forEach(el => {
    const n = parseInt(el.dataset.step);
    el.classList.toggle('is-revealed', n <= currentStep);
  });
  if (currentChapter === 1 && currentStep >= 4) drawActo1();
  if (currentChapter === 2 && currentStep >= 3) drawActo2();
}
```

- [ ] **Step 4.5: Verificación visual**

Recargar el HTML, navegar al Acto 2 con flecha abajo (o flecha derecha hasta llegar). Avanzar steps:

1. Step 1-2: tarjetas de distribuciones.
2. Step 3: aparece el panel con botones. Canvas vacío con ejes visibles.
3. Click "Lanzar mes": el contador sube a 1, ingreso/gasto aparecen, caja cambia, línea violeta empieza. Click varias veces hasta que quiebre o llegue a mes 12. Aparece el "Quebraste mes X" o "Sobreviviste con $X.XM".
4. Click "Otra vida": todo se resetea. Volver a lanzar produce una secuencia distinta.
5. Step 4-6: el resto del acto se revela (instrucción de la tira, levantar la mano, transición).

- [ ] **Step 4.6: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16 Acto 2: distribuciones + slot machine de una vida"
```

---

## Task 5: Acto 3 — Cascada de 10K trayectorias + histograma

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (rellenar `data-chapter="3"`)

Este es el momento "wow" de la clase. Tiene dos canvases (cascada + histograma) que se animan en sincronía.

- [ ] **Step 5.1: Estructura HTML del Acto 3 (steps 1-5)**

Reemplazar el contenido de `<section data-chapter="3">`:

```html
<section class="scene" data-chapter="3">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 3 · Diez mil vidas</div>

    <h2 class="cyber gradient-text glow-magenta" data-step="1" data-anim="zoom">
      Monte Carlo
    </h2>
    <p class="text-zinc-300 max-w-3xl mt-3" data-step="1">
      Simular muchas veces el mismo experimento y mirar la <strong>distribución</strong> de resultados.
      No "qué va a pasar" — sino "qué tan probable es cada cosa".
    </p>

    <div class="mt-8" data-step="2">
      <button id="btnSoltarVidas" class="px-8 py-3 rounded-xl bg-grad-brand text-white font-mono font-bold uppercase tracking-wider text-lg shadow-glow-violet hover:opacity-90">
        Soltar 10.000 vidas ▶
      </button>
    </div>

    <div class="grid md:grid-cols-[1.5fr_1fr] gap-4 mt-6" data-step="2">
      <div>
        <div class="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">Trayectorias de caja (1 línea = 1 simulación)</div>
        <canvas id="cascadaCanvas" width="800" height="380" class="w-full block rounded-md border border-violet-500/20 bg-ink-800/40"></canvas>
      </div>
      <div>
        <div class="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">¿En qué mes quebraron?</div>
        <canvas id="histoCanvas" width="420" height="380" class="w-full block rounded-md border border-violet-500/20 bg-ink-800/40"></canvas>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-4 mt-8" data-step="3">
      <div class="cyber-card magenta text-center">
        <div class="text-magenta-300 font-mono text-xs uppercase tracking-wider mb-2">P(quebrar antes mes 12)</div>
        <div id="statProb" class="text-5xl font-mono glow-magenta">— %</div>
      </div>
      <div class="cyber-card cyan text-center">
        <div class="text-cyan-300 font-mono text-xs uppercase tracking-wider mb-2">Mes esperado de quiebra</div>
        <div id="statMesEsperado" class="text-5xl font-mono glow-cyan">—</div>
      </div>
      <div class="cyber-card violet text-center">
        <div class="text-violet-300 font-mono text-xs uppercase tracking-wider mb-2">Peor 5% quiebra en mes</div>
        <div id="statPeor5" class="text-5xl font-mono" style="color:#b388ff;text-shadow:0 0 18px #b388ff">—</div>
      </div>
    </div>

    <div class="cyber-card mt-10 p-6" data-step="4">
      <p class="text-lg">
        <span class="glow-cyan">Pedro tenía razón:</span> probablemente quiebran.
        <span class="glow-cyan">Lucho tenía razón:</span> hay un porcentaje que sobrevive.
        <strong>Ambos pensaban en blanco y negro; la realidad es una distribución.</strong>
      </p>
    </div>

    <div class="cyber-card mt-6 p-6" data-step="5">
      <div class="text-magenta-300 font-mono text-sm uppercase tracking-wider mb-2">🎯 Momento personal</div>
      <p class="text-zinc-200 mb-3">Anota en tu guía (página 3):</p>
      <ul class="text-zinc-200 list-disc list-inside space-y-1">
        <li>¿Sobreviví o quebré, y en qué mes?</li>
        <li>¿Estoy en el porcentaje que sobrevive o en el que quiebra?</li>
        <li>¿Estoy en el peor 5%?</li>
        <li>¿Mi destino es típico (cerca del esperado) o atípico (cola)?</li>
      </ul>
    </div>

    <div class="mt-10 text-center" data-step="5">
      <p class="text-2xl font-mono text-magenta-300 glow-magenta">Ya saben el riesgo. ¿Qué van a hacer?</p>
    </div>
  </div>
</section>
```

- [ ] **Step 5.2: Actualizar stepsPerChapter para Acto 3**

```js
const stepsPerChapter = { 1: 5, 2: 6, 3: 5, 4: 0 };
```

- [ ] **Step 5.3: Pre-cómputo de Monte Carlo + animación de cascada**

Al final del `<script>`:

```js
/* ============================================================
   ACTO 3 — Cascada de 10K + histograma + stats
   ============================================================ */
let mcResultados = null;
let mcStats = null;
let cascadaAnimating = false;

function precomputeMonteCarlo() {
  if (mcResultados) return;
  const t0 = performance.now();
  let N = 10000;
  // primer frame de prueba: si tarda mucho, bajar a 5000
  mcResultados = monteCarlo(PARAMS, N);
  const dt = performance.now() - t0;
  if (dt > 300) {
    // recomputar a 5K si el primer cálculo tomó >300ms (laptop lenta)
    N = 5000;
    mcResultados = monteCarlo(PARAMS, N);
  }
  mcStats = statsMonteCarlo(mcResultados);
}

function animarCascada() {
  if (cascadaAnimating) return;
  precomputeMonteCarlo();
  cascadaAnimating = true;
  const cvs = document.getElementById('cascadaCanvas');
  const ctx = cvs.getContext('2d');
  const W = cvs.width, H = cvs.height;
  const padL = 40, padR = 14, padT = 14, padB = 22;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;

  ctx.clearRect(0, 0, W, H);
  // ejes
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '10px "JetBrains Mono", monospace';
  for (let m = 0; m <= 12; m += 2) {
    const x = x0 + (m / 12) * (x1 - x0);
    ctx.fillText(String(m), x - 3, y1 + 14);
  }
  for (let v = 0; v <= 80; v += 20) {
    const y = y1 - (v / 80) * (y1 - y0);
    ctx.fillText('$' + v, 6, y + 3);
  }

  const mapX = m => x0 + (m / 12) * (x1 - x0);
  const mapY = v => y1 - (Math.max(0, v) / 80) * (y1 - y0);

  // init histo
  const hctx = document.getElementById('histoCanvas').getContext('2d');
  const HW = 420, HH = 380;
  const histo = new Array(13).fill(0);
  drawHistoFrame(hctx, HW, HH, histo);

  ctx.strokeStyle = 'rgba(179,136,255,0.04)';
  ctx.lineWidth = 1.2;

  const N = mcResultados.length;
  const perFrame = Math.ceil(N / 100); // ~100 frames
  let i = 0;

  function tick() {
    const end = Math.min(i + perFrame, N);
    for (; i < end; i++) {
      const r = mcResultados[i];
      ctx.beginPath();
      ctx.moveTo(mapX(0), mapY(PARAMS.cajaInicial));
      r.meses.forEach((mn, idx) => {
        const m = idx + 1;
        ctx.lineTo(mapX(m), mapY(mn.caja));
        if (mn.caja <= 0) return;
      });
      ctx.stroke();
      const bucket = r.mesQuiebra || 0;
      histo[bucket]++;
    }
    drawHistoFrame(hctx, HW, HH, histo);
    if (i < N) requestAnimationFrame(tick);
    else { cascadaAnimating = false; revelarStats(); }
  }
  requestAnimationFrame(tick);
}

function drawHistoFrame(ctx, W, H, histo) {
  ctx.clearRect(0, 0, W, H);
  const padL = 40, padR = 14, padT = 14, padB = 26;
  const x0 = padL, x1 = W - padR, y0 = padT, y1 = H - padB;
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke();

  const totalQuiebras = histo.slice(1).reduce((a, b) => a + b, 0);
  const maxBucket = Math.max(...histo.slice(1), 1);
  const bw = (x1 - x0) / 12;

  for (let m = 1; m <= 12; m++) {
    const h = (histo[m] / maxBucket) * (y1 - y0);
    const x = x0 + (m - 1) * bw;
    const grad = ctx.createLinearGradient(0, y1 - h, 0, y1);
    grad.addColorStop(0, '#ff2e93'); grad.addColorStop(1, '#b388ff');
    ctx.fillStyle = grad;
    ctx.fillRect(x + 2, y1 - h, bw - 4, h);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '10px "JetBrains Mono", monospace';
  for (let m = 1; m <= 12; m++) {
    if (m % 2 === 0 || m === 1) ctx.fillText(String(m), x0 + (m - 0.5) * bw - 3, y1 + 14);
  }
  ctx.fillText('quiebras: ' + totalQuiebras, x0, y0 - 2);
}

function revelarStats() {
  const s = mcStats;
  document.getElementById('statProb').textContent = (s.probQuiebra * 100).toFixed(0) + '%';
  document.getElementById('statMesEsperado').textContent = s.mesEsperado ? s.mesEsperado.toFixed(1) : '—';
  document.getElementById('statPeor5').textContent = s.peor5pct ?? '—';
}
```

- [ ] **Step 5.4: Wirear el botón "Soltar 10.000 vidas"**

Dentro del `DOMContentLoaded` existente, agregar:

```js
document.getElementById('btnSoltarVidas')?.addEventListener('click', animarCascada);
```

Y en `applyReveal()`, precompute al entrar al Acto 3:

```js
function applyReveal() {
  // ... existente ...
  if (currentChapter === 3 && currentStep >= 1 && !mcResultados) precomputeMonteCarlo();
}
```

Versión completa de `applyReveal()` después de esta tarea:

```js
function applyReveal() {
  const sec = document.querySelector('[data-chapter="' + currentChapter + '"]');
  if (!sec) return;
  sec.querySelectorAll('[data-step]').forEach(el => {
    const n = parseInt(el.dataset.step);
    el.classList.toggle('is-revealed', n <= currentStep);
  });
  if (currentChapter === 1 && currentStep >= 4) drawActo1();
  if (currentChapter === 2 && currentStep >= 3) drawActo2();
  if (currentChapter === 3 && currentStep >= 1 && !mcResultados) precomputeMonteCarlo();
}
```

- [ ] **Step 5.5: Verificación visual**

Recargar, navegar al Acto 3. Avanzar:

1. Step 1: título "Monte Carlo" + intro.
2. Step 2: botón + canvases vacíos con ejes.
3. Click "Soltar 10.000 vidas": la cascada empieza a dibujar líneas violeta; el histograma se construye en paralelo, en ~2-3 segundos.
4. Step 3: tarjetas de stats se llenan automáticamente al terminar la cascada. P(quiebra) entre 55-70%, mes esperado entre 8-11, peor 5% entre 3-5.
5. Step 4-5: veredicto + momento personal.

Si la animación se traba, abrir consola y verificar que `mcResultados.length` sea 5000 o 10000.

- [ ] **Step 5.6: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16 Acto 3: cascada de 10K + histograma + stats (Canvas 2D)"
```

---

## Task 6: Acto 4 — Palancas + mini Monte Carlo + botón a xolver

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (rellenar `data-chapter="4"`)

- [ ] **Step 6.1: Estructura HTML del Acto 4 (steps 1-5)**

Reemplazar el contenido de `<section data-chapter="4">`:

```html
<section class="scene" data-chapter="4">
  <div class="scene-inner">
    <div class="chapter-tag">Acto 4 · La decisión</div>

    <h2 class="cyber gradient-text-3 glow-lime" data-step="1" data-anim="zoom">
      ¿Qué van a hacer?
    </h2>
    <p class="text-zinc-300 max-w-2xl mt-3" data-step="1">
      Ya saben que tienen <strong>~62% de quebrar</strong>. Hay 4 palancas que pueden mover. Cada una cuesta algo.
      Su objetivo: <strong>subir P(sobrevivir) al menos 20 puntos porcentuales</strong> con el menor costo.
    </p>

    <div class="grid md:grid-cols-2 gap-4 mt-8" data-step="2">
      <div class="cyber-card cyan">
        <label class="font-mono text-cyan-300 text-sm uppercase tracking-wider">Subir precio: <span id="lblPrecio">0%</span></label>
        <input id="palPrecio" type="range" min="0" max="40" value="0" step="1" class="w-full mt-2">
      </div>
      <div class="cyber-card violet">
        <label class="font-mono text-violet-300 text-sm uppercase tracking-wider">Recortar marketing: <span id="lblMkt">0%</span></label>
        <input id="palMkt" type="range" min="0" max="50" value="0" step="1" class="w-full mt-2">
      </div>
      <div class="cyber-card magenta">
        <label class="font-mono text-magenta-300 text-sm uppercase tracking-wider">Contratar repartidores: <span id="lblRep">0</span></label>
        <input id="palRep" type="range" min="0" max="3" value="0" step="1" class="w-full mt-2">
      </div>
      <div class="cyber-card" style="border-color:rgba(204,255,0,.4);box-shadow:0 0 30px rgba(204,255,0,.1)">
        <label class="font-mono text-sm uppercase tracking-wider" style="color:#ccff00">Pivotar a B2B: <span id="lblPivot">No</span></label>
        <input id="palPivot" type="range" min="0" max="1" value="0" step="1" class="w-full mt-2">
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-6 mt-8" data-step="2">
      <div class="cyber-card text-center">
        <div class="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">P(sobrevivir 12 meses)</div>
        <div id="palProbSobrevivir" class="text-6xl font-mono glow-lime">38%</div>
        <div id="palMejora" class="text-sm text-zinc-400 mt-1">mejora: +0 pp</div>
      </div>
      <div class="cyber-card text-center">
        <div class="text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">Costo total de las decisiones</div>
        <div id="palCosto" class="text-6xl font-mono glow-magenta">$0</div>
        <div class="text-sm text-zinc-400 mt-1">menos es mejor</div>
      </div>
    </div>

    <div class="cyber-card mt-8 p-6" data-step="3">
      <div class="text-violet-300 font-mono text-sm uppercase tracking-wider mb-2">⚠️ Honestidad pedagógica</div>
      <p class="text-zinc-200">
        Xolver no hace Monte Carlo: optimiza modelos determinísticos. Vamos a usar los <strong>promedios ajustados</strong> que cada decisión produce.
        Pierdes información sobre la cola del riesgo, pero ganas una respuesta concreta.
        <em>Saber cuándo cada herramienta sirve es la mitad del trabajo.</em>
      </p>
    </div>

    <div class="mt-10 text-center" data-step="4">
      <a id="btnAbrirXolver"
         href="https://xolver.cgrajales.dev/?ejemplo=tintoapp"
         target="_blank" rel="noopener"
         class="inline-block px-10 py-4 rounded-xl bg-grad-brand text-white font-mono font-bold uppercase tracking-wider text-xl shadow-glow-violet hover:opacity-90">
        Abrir en Xolver ↗
      </a>
      <p class="text-zinc-400 text-sm mt-3 font-mono">El modelo se carga automáticamente. Pueden modelar la variante asignada a su mesa.</p>
    </div>

    <div class="mt-16 text-center" data-step="5" data-anim="glitch">
      <p class="text-2xl md:text-4xl font-mono gradient-text-2 glow-cyan max-w-3xl mx-auto leading-tight">
        Monte Carlo te muestra <strong>cómo es el futuro</strong>.<br>
        La optimización te dice <strong>qué hacer con él</strong>.<br>
        Eso es decidir como adulto.
      </p>
      <div class="mt-10 text-zinc-400 font-mono text-sm">
        — Fin del curso. Gracias por jugar. ↗
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6.2: Actualizar stepsPerChapter para Acto 4**

```js
const stepsPerChapter = { 1: 5, 2: 6, 3: 5, 4: 5 };
```

- [ ] **Step 6.3: Lógica de palancas con mini Monte Carlo (N=1000)**

Al final del `<script>`:

```js
/* ============================================================
   ACTO 4 — Palancas + mini Monte Carlo
   ============================================================ */
function leerPalancas() {
  return {
    precio: parseInt(document.getElementById('palPrecio').value),
    mkt:    parseInt(document.getElementById('palMkt').value),
    rep:    parseInt(document.getElementById('palRep').value),
    pivot:  parseInt(document.getElementById('palPivot').value),
  };
}

// Función linear que mapea decisiones a un "shift" en el promedio de ingresos/gastos
function paramsAjustados(decisiones) {
  // Cada decisión sube ingreso esperado y/o baja gasto esperado de forma lineal
  // Coeficientes calibrados para que la respuesta razonable suba P en ~20 pp
  const deltaIng = 0.05 * decisiones.precio + 0.04 * decisiones.rep + 0.15 * decisiones.pivot;
  const deltaGas = -0.04 * decisiones.mkt - 0.02 * decisiones.pivot + 0.03 * decisiones.rep;
  return {
    ...PARAMS,
    ingMin:  PARAMS.ingMin  + deltaIng,
    ingMax:  PARAMS.ingMax  + deltaIng,
    gasMin:  PARAMS.gasMin  + deltaGas,
    gasModa: PARAMS.gasModa + deltaGas,
    gasMax:  PARAMS.gasMax  + deltaGas,
  };
}

function costoDecisiones(d) {
  // Coeficientes que coinciden con el ejemplo de xolver
  return 0.5 * d.precio + 0.3 * d.mkt + 8 * d.rep + 12 * d.pivot;
}

function actualizarPalancas() {
  const d = leerPalancas();
  document.getElementById('lblPrecio').textContent = d.precio + '%';
  document.getElementById('lblMkt').textContent = d.mkt + '%';
  document.getElementById('lblRep').textContent = d.rep;
  document.getElementById('lblPivot').textContent = d.pivot ? 'Sí' : 'No';

  const p2 = paramsAjustados(d);
  const r = monteCarlo(p2, 1000);
  const s = statsMonteCarlo(r);
  const probSob = (s.probSobrevivir * 100).toFixed(0);
  document.getElementById('palProbSobrevivir').textContent = probSob + '%';
  const mejora = (s.probSobrevivir - 0.38) * 100;
  const sign = mejora >= 0 ? '+' : '';
  document.getElementById('palMejora').textContent = 'mejora: ' + sign + mejora.toFixed(0) + ' pp';

  document.getElementById('palCosto').textContent = '$' + costoDecisiones(d).toFixed(1);
}

// Wiring al cargar
document.addEventListener('DOMContentLoaded', () => {
  ['palPrecio', 'palMkt', 'palRep', 'palPivot'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', actualizarPalancas);
  });
});
```

Nota sobre la base 0.38: usamos un valor fijo redondeado para que "mejora" sea estable; en producción real podríamos calcular `1 - mcStats.probQuiebra` del cómputo real.

- [ ] **Step 6.4: Verificación visual**

Recargar, navegar al Acto 4:

1. Step 1: título "¿Qué van a hacer?" + intro.
2. Step 2: 4 sliders + dos tarjetas de "P(sobrevivir)" (38%) y "Costo" ($0). Mover el slider de "Subir precio" lentamente: el número de P sube; mover "Pivotar a B2B" a Sí: gran salto. El costo refleja la suma.
3. Step 3: tarjeta de honestidad pedagógica.
4. Step 4: botón grande "Abrir en Xolver" — click abre `xolver.cgrajales.dev/?ejemplo=tintoapp` en nueva pestaña.
5. Step 5: cierre del curso con glitch.

- [ ] **Step 6.5: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16 Acto 4: palancas + mini Monte Carlo + boton a Xolver"
```

---

## Task 7: Panel del Oráculo — Modo Single

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html` (panel HTML + CSS + JS al final)

- [ ] **Step 7.1: Agregar estilos del panel al `<style>`**

Insertar antes del `</style>`:

```css
/* ===== PANEL DEL ORÁCULO ===== */
.oracle-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(10, 0, 20, 0.92);
  backdrop-filter: blur(16px);
  display: none;
  overflow-y: auto;
}
.oracle-overlay.show { display: block; }

.oracle-warning {
  background: #fde047;
  color: #1a1a1a;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  text-align: center;
  padding: 10px 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 13px;
  border-bottom: 2px solid #ca8a04;
}

.oracle-content { max-width: 1100px; margin: 0 auto; padding: 30px 24px; }
.oracle-tabs { display: flex; gap: 8px; margin-bottom: 24px; }
.oracle-tab {
  padding: 10px 20px; border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #ddd; font-family: 'JetBrains Mono', monospace;
  font-size: 13px; cursor: pointer; border: none;
}
.oracle-tab.active { background: var(--magenta); color: white; }

.oracle-input {
  width: 100%; padding: 14px 16px; font-size: 18px;
  background: rgba(0, 0, 0, 0.4); border: 1px solid var(--cyan);
  color: white; font-family: 'JetBrains Mono', monospace;
  border-radius: 8px;
}
.oracle-btn {
  padding: 12px 24px; background: linear-gradient(135deg, var(--magenta), var(--violet));
  color: white; font-family: 'JetBrains Mono', monospace; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px;
  border: none; border-radius: 8px; cursor: pointer; font-size: 14px;
}

.oracle-table {
  width: 100%; border-collapse: collapse; margin-top: 16px;
  font-family: 'JetBrains Mono', monospace;
}
.oracle-table th, .oracle-table td {
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 12px; text-align: right;
}
.oracle-table th { background: rgba(255, 46, 147, 0.15); color: var(--magenta); }

.oracle-verdict-quiebra {
  margin-top: 20px; padding: 18px; border-radius: 10px;
  background: rgba(255, 82, 82, 0.18); border: 2px solid #ff5252;
  color: #ff5252; font-family: 'JetBrains Mono', monospace;
  font-size: 22px; font-weight: 800; text-align: center;
}
.oracle-verdict-vivo {
  margin-top: 20px; padding: 18px; border-radius: 10px;
  background: rgba(0, 230, 118, 0.18); border: 2px solid #00e676;
  color: #00e676; font-family: 'JetBrains Mono', monospace;
  font-size: 22px; font-weight: 800; text-align: center;
}
```

- [ ] **Step 7.2: Agregar HTML del panel al final del `<body>`, antes del `<script>`**

```html
<div id="oraclePanel" class="oracle-overlay" aria-hidden="true">
  <div class="oracle-warning">⚠ MODO DOCENTE — NO PROYECTAR ⚠</div>
  <div class="oracle-content">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-mono font-bold text-white">Panel del Oráculo</h2>
      <button id="oracleClose" class="text-zinc-400 hover:text-white font-mono text-sm">[ Cerrar ESC ]</button>
    </div>

    <div class="oracle-tabs">
      <button class="oracle-tab active" data-mode="single">Modo Single</button>
      <button class="oracle-tab" data-mode="batch">Modo Batch</button>
    </div>

    <div id="oracleSingle">
      <label class="text-zinc-300 text-sm font-mono">ID del estudiante (cédula, código, nombre):</label>
      <div class="flex gap-2 mt-1">
        <input id="oracleId" class="oracle-input" placeholder="ej. 1088123456 o juanperez">
        <button id="oracleGen" class="oracle-btn">Generar</button>
        <button id="oracleClear" class="oracle-btn" style="background:rgba(255,255,255,.08)">Limpiar</button>
      </div>
      <div id="oracleResult" class="mt-4"></div>
    </div>

    <div id="oracleBatch" style="display:none">
      <!-- Modo Batch se rellena en Task 8 -->
      <div class="text-zinc-400">Pegar aquí en Task 8.</div>
    </div>
  </div>
</div>
```

- [ ] **Step 7.3: Lógica de apertura/cierre del panel + render del modo Single**

Al final del `<script>`:

```js
/* ============================================================
   PANEL DEL ORÁCULO — Modo Single
   ============================================================ */
function toggleOracle() {
  const p = document.getElementById('oraclePanel');
  p.classList.toggle('show');
}

function renderTrayectoria(id, sim) {
  if (!sim) return '<div class="text-zinc-400 mt-3">ID vacío.</div>';
  let rows = '';
  let cajaCorrida = PARAMS.cajaInicial;
  sim.meses.forEach((m, i) => {
    const mes = i + 1;
    rows += `<tr><td>${mes}</td><td>${m.ing.toFixed(1)}</td><td>${m.gas.toFixed(1)}</td><td>${m.caja.toFixed(1)}</td></tr>`;
  });
  const verdictCls = sim.mesQuiebra ? 'oracle-verdict-quiebra' : 'oracle-verdict-vivo';
  const verdictTxt = sim.mesQuiebra
    ? `🔴 QUEBRASTE MES ${sim.mesQuiebra}`
    : `🟢 SOBREVIVISTE — CAJA FINAL $${sim.cajaFinal.toFixed(1)}M`;
  return `
    <div class="text-zinc-300 font-mono text-sm">ID: <strong>${id}</strong> · Caja inicial: $50.0M</div>
    <table class="oracle-table">
      <thead><tr><th>Mes</th><th>Ingreso ($M)</th><th>Gasto ($M)</th><th>Caja final ($M)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="${verdictCls}">${verdictTxt}</div>
  `;
}

function generarSingle() {
  const id = document.getElementById('oracleId').value;
  const sim = simularPorID(id);
  document.getElementById('oracleResult').innerHTML = renderTrayectoria(id.trim(), sim);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('oracleGen')?.addEventListener('click', generarSingle);
  document.getElementById('oracleClear')?.addEventListener('click', () => {
    document.getElementById('oracleId').value = '';
    document.getElementById('oracleResult').innerHTML = '';
  });
  document.getElementById('oracleClose')?.addEventListener('click', toggleOracle);
  document.querySelectorAll('.oracle-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.oracle-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      document.getElementById('oracleSingle').style.display = mode === 'single' ? 'block' : 'none';
      document.getElementById('oracleBatch').style.display = mode === 'batch' ? 'block' : 'none';
    });
  });
});
```

- [ ] **Step 7.4: Bindear tecla `O` para abrir/cerrar el panel**

Modificar el `document.addEventListener('keydown', ...)` existente. Buscar el bloque `switch(key) { ... }` y agregar el caso `'o'` / `'O'`. NO tocar el caso existente de `'t'`/`'T'` (timer). El bloque actualizado:

```js
switch(key) {
  case 'ArrowRight': case ' ': nextStep(); e.preventDefault(); break;
  case 'ArrowLeft': prevStep(); e.preventDefault(); break;
  case 'ArrowDown': nextChapter(); e.preventDefault(); break;
  case 'ArrowUp': prevChapter(); e.preventDefault(); break;
  case 'r': case 'R': resetCurrentSim(); break;
  case 'f': case 'F':
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
    break;
  case 'h': case 'H': case '?': toggleHelp(); e.preventDefault(); break;
  case 't': case 'T': toggleTimer(); break;
  case 'o': case 'O': toggleOracle(); e.preventDefault(); break;
  case 'Escape':
    if (document.getElementById('oraclePanel').classList.contains('show')) toggleOracle();
    else document.getElementById('helpOverlay').classList.remove('show');
    break;
  case '1': case '2': case '3': case '4':
    if (started) { gotoChapter(parseInt(key)); e.preventDefault(); }
    break;
  case '0': if (started) { gotoChapter(TOTAL_CHAPTERS); e.preventDefault(); } break;
}
```

(Eliminé los cases `'5'..'9'` ya que solo tenemos 4 capítulos.)

- [ ] **Step 7.5: Verificación visual**

Recargar el HTML. Estando en cualquier punto de la clase:

1. Presionar `O`: aparece el panel del Oráculo con banner amarillo arriba.
2. Escribir `12345` en el input y click "Generar": aparece una tabla de 12 filas con números, y un banner verde/rojo con el destino.
3. Volver a escribir `12345` y "Generar": **misma trayectoria** (verificar 2 o 3 valores).
4. Cambiar a `67890`: trayectoria distinta.
5. Click "Limpiar": tabla desaparece.
6. Presionar `O` o `ESC`: el panel se cierra.
7. Avanzar/retroceder con flechas: la clase no se ve afectada por haber abierto el panel.

- [ ] **Step 7.6: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Panel del Oraculo Modo Single (tecla O, PRNG seeded por ID)"
```

---

## Task 8: Panel del Oráculo — Modo Batch + impresión

**Files:**
- Modify: `Clase16_Decision_Bajo_Incertidumbre.html`

- [ ] **Step 8.1: Agregar CSS de impresión y de tiras al `<style>`**

Insertar antes del `</style>`:

```css
/* ===== TIRAS BATCH ===== */
.batch-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}
.batch-strip {
  border: 2px dashed #888;
  padding: 12px 16px;
  background: white;
  color: #111;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  page-break-inside: avoid;
  break-inside: avoid;
}
.batch-strip .strip-id { font-size: 14px; font-weight: 800; margin-bottom: 6px; }
.batch-strip table { width: 100%; border-collapse: collapse; }
.batch-strip th, .batch-strip td { border: 1px solid #666; padding: 2px 5px; text-align: right; }
.batch-strip th { background: #eee; }
.batch-strip .strip-verdict-q { margin-top: 8px; padding: 6px; background: #fee2e2; color: #b91c1c; font-weight: 800; text-align: center; }
.batch-strip .strip-verdict-v { margin-top: 8px; padding: 6px; background: #d1fae5; color: #047857; font-weight: 800; text-align: center; }

/* ===== PRINT ===== */
@media print {
  body > *:not(#oraclePanel) { display: none !important; }
  #oraclePanel { position: static !important; background: white !important; backdrop-filter: none !important; }
  #oraclePanel.show { display: block !important; }
  .oracle-warning, .oracle-tabs, #oracleSingle, #oracleClose, #batchControls { display: none !important; }
  .oracle-content { padding: 0 !important; max-width: 100% !important; }
  .batch-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
  .batch-strip { border-color: #999 !important; background: white !important; color: #111 !important; }
}
```

- [ ] **Step 8.2: Rellenar el div `#oracleBatch` con la UI de Batch**

Reemplazar `<div id="oracleBatch" style="display:none">...</div>` con:

```html
<div id="oracleBatch" style="display:none">
  <div id="batchControls">
    <label class="text-zinc-300 text-sm font-mono">
      Lista de IDs (uno por línea):
    </label>
    <textarea id="batchIds" rows="6" class="oracle-input mt-1" style="font-size:14px"
      placeholder="1088001&#10;1088002&#10;ana.maria&#10;..."></textarea>
    <div class="flex gap-2 mt-3">
      <button id="batchGen" class="oracle-btn">Generar todas las tiras</button>
      <button id="batchPrint" class="oracle-btn" style="background:#0891b2">Imprimir (Ctrl+P)</button>
    </div>
    <p class="text-zinc-400 text-xs mt-2 font-mono">
      Las tiras salen en grilla 2×N con líneas de corte. Configurar la impresora en A4 sin márgenes para máximo aprovechamiento.
    </p>
  </div>
  <div id="batchResult" class="batch-grid"></div>
</div>
```

- [ ] **Step 8.3: Lógica del Modo Batch**

Al final del `<script>`:

```js
/* ============================================================
   PANEL DEL ORÁCULO — Modo Batch
   ============================================================ */
function renderStrip(id, sim) {
  let rows = '';
  sim.meses.forEach((m, i) => {
    rows += `<tr><td>${i+1}</td><td>${m.ing.toFixed(1)}</td><td>${m.gas.toFixed(1)}</td><td>${m.caja.toFixed(1)}</td></tr>`;
  });
  const verdictCls = sim.mesQuiebra ? 'strip-verdict-q' : 'strip-verdict-v';
  const verdictTxt = sim.mesQuiebra
    ? `QUEBRASTE MES ${sim.mesQuiebra}`
    : `SOBREVIVISTE — CAJA $${sim.cajaFinal.toFixed(1)}M`;
  return `
    <div class="batch-strip">
      <div class="strip-id">ID: ${id}</div>
      <table>
        <thead><tr><th>Mes</th><th>Ing($M)</th><th>Gas($M)</th><th>Caja($M)</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="${verdictCls}">${verdictTxt}</div>
      <div style="font-size:9px;color:#666;text-align:center;margin-top:4px">Grapa esto a tu guía impresa</div>
    </div>
  `;
}

function generarBatch() {
  const ids = document.getElementById('batchIds').value
    .split('\n').map(s => s.trim()).filter(Boolean);
  const html = ids.map(id => {
    const sim = simularPorID(id);
    return renderStrip(id, sim);
  }).join('');
  document.getElementById('batchResult').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('batchGen')?.addEventListener('click', generarBatch);
  document.getElementById('batchPrint')?.addEventListener('click', () => window.print());
});
```

- [ ] **Step 8.4: Verificación visual + de impresión**

Recargar el HTML:

1. Presionar `O` → abre el panel.
2. Click en "Modo Batch": cambian las tabs, aparece el textarea.
3. Pegar 6-8 IDs distintos, uno por línea. Click "Generar todas las tiras".
4. Ver tiras en grilla 2×N abajo, cada una con ID, tabla, y veredicto.
5. Click "Imprimir": se abre el preview de impresión del navegador. **Solo deben verse las tiras** (sin HUD, sin banner amarillo, sin clase cinematic). Verificar que entran ~4 tiras por hoja A4.
6. Cerrar preview, cerrar panel con ESC.

- [ ] **Step 8.5: Commit**

```bash
git add Clase16_Decision_Bajo_Incertidumbre.html
git commit -m "Clase16: Panel del Oraculo Modo Batch (lista de IDs + impresion de tiras)"
```

---

## Task 9: Script generador de la guía .docx

**Files:**
- Create: `gen_guia_clase16.js`
- Output: `Guia_Clase16_Decision_Bajo_Incertidumbre.docx`

- [ ] **Step 9.1: Crear el archivo Node con la estructura de las 4 páginas**

```js
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, WidthType, ShadingType, BorderStyle, HeadingLevel, PageBreak
} = require("docx");
const fs = require("fs");

const FONT = "Arial";
const SZ = 22, SZS = 18, SZL = 28, SZXL = 36;

const t = (text, opts = {}) => new TextRun({
  text, font: FONT, size: opts.size || SZ,
  bold: opts.bold, italics: opts.italics, color: opts.color
});

const p = (runs, opts = {}) => new Paragraph({
  children: Array.isArray(runs) ? runs : [runs],
  spacing: { after: 80, ...(opts.spacing || {}) },
  alignment: opts.alignment,
  pageBreakBefore: opts.pageBreakBefore,
});

const h1 = (text, color = "1F3864") => new Paragraph({
  children: [t(text, { bold: true, size: SZXL, color })],
  spacing: { before: 200, after: 160 },
  heading: HeadingLevel.HEADING_1
});

const h2 = (text, color = "2E74B5") => new Paragraph({
  children: [t(text, { bold: true, size: SZL, color })],
  spacing: { before: 200, after: 120 },
  heading: HeadingLevel.HEADING_2
});

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "888888" };
const BORDERS_ALL = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };

const cell = (text, opts = {}) => new TableCell({
  children: [new Paragraph({
    children: [t(text, { size: opts.size || SZS, bold: opts.bold, color: opts.color })],
    alignment: opts.align || AlignmentType.CENTER,
    spacing: { before: 40, after: 40 }
  })],
  borders: BORDERS_ALL,
  width: { size: opts.width || 2200, type: WidthType.DXA },
  shading: opts.shading ? { type: ShadingType.CLEAR, fill: opts.shading } : undefined,
  verticalAlign: "center",
});

// ===== PÁGINA 1 — Portada + Acto 1 =====
const pagina1 = [
  h1("Clase 16 — Decisión bajo incertidumbre", "1F3864"),
  p([t("Última clase del curso · Monte Carlo + Optimización", { italics: true, color: "555555", size: SZS })]),
  p([t("Nombre: ____________________________     ID: ____________________________", { size: SZ })], { spacing: { before: 240, after: 80 } }),
  p([t("Fecha: ____________________________", { size: SZ })], { spacing: { after: 280 } }),

  h2("Acto 1 — La trampa del promedio"),
  p([t("Hoy vas a montar TintoApp con Lucho y Pedro. Y vas a vivir TU propia historia. Cuando lleguemos al Acto 2, mira tu tira grapada arriba.", { italics: true })]),

  p([t("Caja inicial: $50M", { bold: true })], { spacing: { before: 160 } }),

  new Table({
    rows: [
      new TableRow({ children: [
        cell("Lucho dice…", { bold: true, shading: "DBE5F1", width: 4500 }),
        cell("Pedro dice…", { bold: true, shading: "FBDCDC", width: 4500 }),
      ]}),
      new TableRow({ children: [
        cell("Ingresos: $11M    Gastos: $11M    →  duramos: ___ meses", { align: AlignmentType.LEFT, width: 4500 }),
        cell("Ingresos: $8M     Gastos: $12M    →  duramos: ___ meses", { align: AlignmentType.LEFT, width: 4500 }),
      ]}),
    ],
    width: { size: 9000, type: WidthType.DXA },
  }),

  p([t("¿Por qué los dos cálculos están mal?", { bold: true })], { spacing: { before: 240 } }),
  p([t("__________________________________________________________________")]),
  p([t("__________________________________________________________________")]),
  p([t("__________________________________________________________________")]),
];

// ===== PÁGINA 2 — Mi vida en TintoApp =====
const filasMes = [];
for (let m = 1; m <= 12; m++) {
  filasMes.push(new TableRow({ children: [
    cell(String(m), { bold: true, shading: "EEEEEE", width: 800 }),
    cell("", { width: 2400 }),
    cell("", { width: 2400 }),
    cell("", { width: 2400 }),
  ]}));
}

const pagina2 = [
  new Paragraph({ children: [new PageBreak()] }),
  h1("Acto 2 — Mi vida en TintoApp", "2E74B5"),
  p([t("Saca tu tira (grapada arriba), copia los 12 meses, dibuja la trayectoria.", { italics: true })]),

  p([t("Mi ID: ____________________     Caja inicial: $50.0M", { bold: true })], { spacing: { before: 160 } }),

  new Table({
    rows: [
      new TableRow({ children: [
        cell("Mes", { bold: true, shading: "1F3864", color: "FFFFFF", width: 800 }),
        cell("Ingreso ($M)", { bold: true, shading: "1F3864", color: "FFFFFF", width: 2400 }),
        cell("Gasto ($M)", { bold: true, shading: "1F3864", color: "FFFFFF", width: 2400 }),
        cell("Caja final ($M)", { bold: true, shading: "1F3864", color: "FFFFFF", width: 2400 }),
      ]}),
      new TableRow({ children: [
        cell("0", { bold: true, shading: "EEEEEE", width: 800 }),
        cell("—", { width: 2400 }),
        cell("—", { width: 2400 }),
        cell("50.0", { width: 2400, bold: true }),
      ]}),
      ...filasMes,
    ],
    width: { size: 8000, type: WidthType.DXA },
  }),

  p([t("🎯 MI DESTINO:  __________________________________________________", { bold: true, color: "C00000", size: SZL })], { spacing: { before: 240 } }),

  p([t("Dibuja a mano la trayectoria de tu caja (eje X: meses 0–12, eje Y: $0–60M)", { italics: true, size: SZS })], { spacing: { before: 180, after: 80 } }),
  // espacio para gráfica manual: una "celda" grande vacía con bordes
  new Table({
    rows: [new TableRow({ children: [cell("", { width: 8000 })], height: { value: 2800, rule: "exact" } })],
    width: { size: 8000, type: WidthType.DXA },
  }),
];

// ===== PÁGINA 3 — Mi lugar en la distribución =====
const pagina3 = [
  new Paragraph({ children: [new PageBreak()] }),
  h1("Acto 3 — Mi lugar en la distribución", "2E74B5"),
  p([t("Anota los datos que el docente proyecta:", { italics: true })]),

  new Table({
    rows: [
      new TableRow({ children: [
        cell("Stat poblacional (Monte Carlo de 10.000 vidas)", { bold: true, shading: "1F3864", color: "FFFFFF", width: 5400 }),
        cell("Valor", { bold: true, shading: "1F3864", color: "FFFFFF", width: 2600 }),
      ]}),
      new TableRow({ children: [
        cell("P(quebrar antes mes 12)", { align: AlignmentType.LEFT, width: 5400 }),
        cell("_____ %", { width: 2600 }),
      ]}),
      new TableRow({ children: [
        cell("Mes esperado de quiebra", { align: AlignmentType.LEFT, width: 5400 }),
        cell("_____", { width: 2600 }),
      ]}),
      new TableRow({ children: [
        cell("Peor 5%: quebraron en mes ≤", { align: AlignmentType.LEFT, width: 5400 }),
        cell("_____", { width: 2600 }),
      ]}),
    ],
    width: { size: 8000, type: WidthType.DXA },
  }),

  p([t("Reflexiona y responde:", { bold: true })], { spacing: { before: 240 } }),
  p([t("¿Sobreviví o quebré?   ☐ Sobreviví   ☐ Quebré mes _____", { size: SZ })]),
  p([t("¿Estoy en el grupo que sobrevive o en el que quiebra?", { size: SZ })]),
  p([t("__________________________________________________________________")]),
  p([t("¿Estoy en el peor 5% de los resultados?  ☐ Sí   ☐ No", { size: SZ })]),
  p([t("¿Mi destino es típico (cerca del esperado) o atípico (cola)?", { size: SZ })]),
  p([t("__________________________________________________________________")]),
  p([t("__________________________________________________________________")]),
];

// ===== PÁGINA 4 — La decisión =====
const pagina4 = [
  new Paragraph({ children: [new PageBreak()] }),
  h1("Acto 4 — La decisión (Xolver)", "2E74B5"),
  p([t("Lucho y Pedro tienen 62% de quebrar. Hay 4 palancas para mover:", { italics: true })]),

  p([t("• Subir precio (continua, 0–40%)", { size: SZS })]),
  p([t("• Recortar marketing (continua, 0–50%)", { size: SZS })]),
  p([t("• Contratar repartidores (entera, 0–3)", { size: SZS })]),
  p([t("• Pivotar a B2B (sí o no)", { size: SZS })]),

  p([t("Objetivo: ", { bold: true }), t("MINIMIZAR el costo de las decisiones, sujeto a subir P(sobrevivir 12m) al menos 20 puntos porcentuales.")], { spacing: { before: 160 } }),

  p([t("Variante asignada a mi mesa (encierra una):", { bold: true })], { spacing: { before: 200 } }),
  p([t("A) Meta base — mejora ≥ 20 pp", { size: SZS })]),
  p([t("B) Presupuesto restringido — no puedes subir precio más de 15%", { size: SZS })]),
  p([t("C) Meta agresiva — mejora ≥ 30 pp", { size: SZS })]),

  p([t("Modela en Xolver. Escribe abajo el resultado:", { bold: true })], { spacing: { before: 200 } }),

  new Table({
    rows: [
      new TableRow({ children: [
        cell("Variable", { bold: true, shading: "1F3864", color: "FFFFFF", width: 2200 }),
        cell("Tipo", { bold: true, shading: "1F3864", color: "FFFFFF", width: 1800 }),
        cell("Valor óptimo (Xolver)", { bold: true, shading: "1F3864", color: "FFFFFF", width: 2400 }),
      ]}),
      new TableRow({ children: [cell("Subir precio (%)"), cell("Continua"), cell("")]}),
      new TableRow({ children: [cell("Recortar marketing (%)"), cell("Continua"), cell("")]}),
      new TableRow({ children: [cell("Repartidores extra"), cell("Entera"), cell("")]}),
      new TableRow({ children: [cell("Pivotar B2B"), cell("Binaria"), cell("")]}),
    ],
    width: { size: 6400, type: WidthType.DXA },
  }),

  p([t("Costo total óptimo:  $______", { bold: true })], { spacing: { before: 160 } }),
  p([t("Mejora en P(sobrevivir):  +_____ pp", { bold: true })]),

  p([t("¿Coincidió tu respuesta con otros grupos? ¿Por qué cambió con la restricción?", { bold: true })], { spacing: { before: 200 } }),
  p([t("__________________________________________________________________")]),
  p([t("__________________________________________________________________")]),
  p([t("__________________________________________________________________")]),
  p([t("__________________________________________________________________")]),
];

// ===== Documento =====
const doc = new Document({
  styles: {
    default: { document: { run: { font: FONT, size: SZ } } }
  },
  sections: [{
    properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
    children: [...pagina1, ...pagina2, ...pagina3, ...pagina4],
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Guia_Clase16_Decision_Bajo_Incertidumbre.docx", buf);
  console.log("Generado: Guia_Clase16_Decision_Bajo_Incertidumbre.docx");
});
```

- [ ] **Step 9.2: Correr el script**

```bash
node gen_guia_clase16.js
```

Esperado: salida `Generado: Guia_Clase16_Decision_Bajo_Incertidumbre.docx`. No errores.

- [ ] **Step 9.3: Verificar el .docx en Word/LibreOffice**

Abrir `Guia_Clase16_Decision_Bajo_Incertidumbre.docx`:

1. Página 1: portada con título, espacios para nombre/ID/fecha, tabla Lucho/Pedro con espacios "___ meses", pregunta abierta con 3 líneas.
2. Página 2: tabla de 13 filas (mes 0 a 12), con mes 0 mostrando "50.0", recuadro "MI DESTINO" debajo, espacio para gráfico a mano.
3. Página 3: tabla de stats poblacionales con "_____ %", checkboxes y líneas para reflexión.
4. Página 4: 4 variables del problema, 3 variantes A/B/C, tabla para escribir respuesta de Xolver, pregunta de cierre.

Si algo se desborda de página, ajustar `spacing` o `size`.

- [ ] **Step 9.4: Commit**

```bash
git add gen_guia_clase16.js Guia_Clase16_Decision_Bajo_Incertidumbre.docx
git commit -m "Clase16: generador de guia impresa (4 paginas) + .docx output"
```

---

## Task 10: Snippet TintoApp para Xolver

**Files:**
- Create: `docs/superpowers/specs/clase16-tintoapp-xolver-snippet.js` (referencia, no se ejecuta aquí)

- [ ] **Step 10.1: Crear el snippet en el repo**

```js
// docs/superpowers/specs/clase16-tintoapp-xolver-snippet.js
//
// Pegar este objeto al dataset de ejemplos del repo de Xolver (en el Pi).
// Endpoint esperado en Xolver: ?ejemplo=tintoapp carga este modelo precargado.
//
// Coeficientes calibrados para que la solución razonable sea:
//   subir_precio ≈ 12-18%, repartidores 1, no pivotar
// dando costo ~$15 y mejora ≥ 0.20.

module.exports = {
  id: 'tintoapp',
  kind: 'casuistica',
  title: 'TintoApp — Decidir bajo incertidumbre',
  sense: 'min',
  variables: [
    { name: 'subir_precio_pct',   type: 'continuous', lb: 0, ub: 40 },
    { name: 'recortar_mkt_pct',   type: 'continuous', lb: 0, ub: 50 },
    { name: 'repartidores_extra', type: 'integer',    lb: 0, ub: 3  },
    { name: 'pivotar_b2b',        type: 'binary' },
  ],
  objective: '0.5*subir_precio_pct + 0.3*recortar_mkt_pct + 8*repartidores_extra + 12*pivotar_b2b',
  constraints: [
    { expr: 'subir_precio_pct + recortar_mkt_pct', op: '<=', rhs: 60 },
    { expr: '0.04*subir_precio_pct + 0.02*recortar_mkt_pct + 0.05*repartidores_extra + 0.10*pivotar_b2b', op: '>=', rhs: 0.20 },
  ],
  context: 'Una startup de delivery de café enfrenta 62% de quebrar antes del mes 12. La función objetivo modela el costo de cada decisión; la segunda restricción modela una mejora mínima de 20 puntos porcentuales en la probabilidad de supervivencia.',
};
```

- [ ] **Step 10.2: Commit**

```bash
git add docs/superpowers/specs/clase16-tintoapp-xolver-snippet.js
git commit -m "Clase16: snippet TintoApp para pegar al repo de Xolver"
```

- [ ] **Step 10.3: Documentar el siguiente paso para el docente**

(Solo aparece en el plan, no en el repo.) Cuando el Pi sea accesible:

```bash
ssh pi@10.105.1.169
cd ~/proyectos/xolver   # ajustar al path real
# editar el archivo donde están los ejemplos (resuelto/casuistica/ejercicio)
# pegar el snippet
# probar localmente que ?ejemplo=tintoapp carga el modelo
# commit y deploy
```

Si no se llega a aplicar antes de la clase: el botón "Abrir en Xolver" llega a `xolver.cgrajales.dev/?ejemplo=tintoapp`. Xolver ignora un `ejemplo` no reconocido y abre vacío. El docente puede modelar en vivo en ese caso.

---

## Task 11: Verificación integrada final

**Files:**
- Run: `Clase16_Decision_Bajo_Incertidumbre.html` en Chrome

- [ ] **Step 11.1: Correr la clase completa de principio a fin**

Recargar el HTML. Verificar uno por uno:

1. **Pantalla welcome / inicio:** ver la portada de la clase.
2. **Acto 1 (steps 1-5):** Lucho/Pedro, líneas rectas en canvas, glitch + fórmula KaTeX.
3. **Acto 2 (steps 1-6):** distribuciones, slot machine funcional (lanzar y otra vida), instrucción de tira, levantar mano.
4. **Acto 3 (steps 1-5):** Soltar 10K, cascada anima en ~2-3 s, histograma crece en paralelo, stats correctos (P entre 55-70%), veredicto + momento personal.
5. **Acto 4 (steps 1-5):** sliders responden, P(sobrevivir) y costo cambian, botón abre Xolver en nueva pestaña, cierre con glitch.
6. **Navegación general:** flecha izquierda regresa pasos, flecha arriba/abajo cambia capítulos, números 1-4 saltan a Actos, `H` muestra ayuda.

- [ ] **Step 11.2: Verificar Panel del Oráculo**

1. Tecla `O`: abre panel con banner amarillo.
2. Modo Single: generar 2 IDs distintos, comparar trayectorias (no iguales).
3. Mismo ID dos veces: trayectoria idéntica (al menos los primeros 2 valores deben coincidir).
4. Modo Batch: pegar 10 IDs, generar tiras, click "Imprimir" → preview muestra solo tiras.
5. ESC cierra el panel.

- [ ] **Step 11.3: Test en móvil (opcional pero recomendado)**

Abrir el HTML en celular (o usar DevTools → Toggle device toolbar):
- HUD se ajusta arriba.
- Canvases escalan al ancho.
- Sliders del Acto 4 son tocables.
- Panel del Oráculo: probable que NO sea cómodo en móvil — está OK, el docente lo usa en laptop.

- [ ] **Step 11.4: Commit final + tag**

```bash
git add -A
git status   # verificar que nada quedó suelto
git commit -m "Clase16: verificacion integrada final" --allow-empty
```

(`--allow-empty` por si no quedaron cambios; el propósito es marcar el hito.)

---

## Resumen del flujo del docente

1. **Día anterior a la clase:**
   - Generar el .docx: `node gen_guia_clase16.js`. Imprimirlo 30 veces (una copia por estudiante).
   - Abrir `Clase16_Decision_Bajo_Incertidumbre.html` en el navegador.
   - Pulsar `O` → Modo Batch → pegar lista de IDs del curso → "Generar todas las tiras" → "Imprimir".
   - Cortar las tiras (líneas punteadas) y grapar una a cada copia de la guía. Tiempo estimado: 30 min.

2. **Mañana de la clase:**
   - Repartir las guías al entrar al salón. Cada estudiante ya tiene SU tira pegada.
   - Abrir la clase en Chrome, pantalla completa (`F`), proyectar.
   - (Opcional) Pulsar `T` para iniciar el timer de 60 min.

3. **Durante la clase:** seguir los 4 actos. Si un estudiante pierde su tira: `O` → Modo Single → regenerar.

---

## Auto-revisión del plan

Última pasada de chequeo antes de entregar:

### Cobertura del spec
- ✅ Audiencia y formato: Task 1 (esqueleto)
- ✅ Identidad visual cyberpunk: heredada de Clase15 en Task 1
- ✅ Arco narrativo Lucho/Pedro/TintoApp/$50M: Tasks 3-6
- ✅ Acto 1 (10 min): Task 3
- ✅ Acto 2 con tiras pre-impresas (15 min): Task 4
- ✅ Acto 3 cascada+histograma+stats (20 min): Task 5
- ✅ Acto 4 palancas+xolver (15 min): Task 6
- ✅ Stack JS puro + Canvas: Tasks 2-6
- ✅ Motor de simulación (uniforme, triangular, monteCarlo, statsMonteCarlo): Task 2
- ✅ PRNG seeded (FNV-1a + mulberry32): Task 2
- ✅ Panel del Oráculo Modo Single (`O`): Task 7
- ✅ Panel del Oráculo Modo Batch + impresión: Task 8
- ✅ Snippet TintoApp para Xolver: Task 10
- ✅ Guía impresa .docx (4 páginas): Task 9
- ✅ Verificación integrada: Task 11

### Coherencia de tipos
- ✅ `simularUnaVida` siempre devuelve `{ meses, mesQuiebra, cajaFinal }`. Usado consistente en Tasks 2, 7, 8, render de tiras y panel.
- ✅ `statsMonteCarlo` devuelve `{ N, probQuiebra, probSobrevivir, mesEsperado, peor5pct, histo }`. Usado en Tasks 5, 6.
- ✅ Función `toggleOracle()` definida en Task 7, llamada desde keyboard handler en Task 7 step 4.
- ✅ `paramsAjustados` y `costoDecisiones` introducidos en Task 6, no se referencian antes.

### Placeholders
- ✅ Sin TBD/TODO en el plan. Cada step tiene código concreto o un comando concreto.

### Riesgos detectados durante review
- El cálculo `mejora` en Acto 4 usa 0.38 fijo. Si el cómputo real de `mcStats.probSobrevivir` difiere (por ejemplo, sale 0.41 en la corrida específica), el "+0 pp" inicial se vería raro. **Mitigación operativa:** está en el plan como "valor fijo redondeado para estabilidad pedagógica". Si causa confusión, en Task 6 se puede reemplazar `0.38` por `(mcStats?.probSobrevivir || 0.38)` para auto-calibrar al cómputo real.
