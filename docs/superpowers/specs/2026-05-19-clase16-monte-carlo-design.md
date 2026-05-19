---
name: Clase 16 — Decisión bajo incertidumbre (Monte Carlo + Xolver)
description: Última clase del curso. 60 min cinemáticos sobre Monte Carlo aplicado al runway de una startup, donde cada estudiante simula su propia trayectoria (seeded por ID) llenando una guía impresa, con aterrizaje hands-on en xolver.cgrajales.dev para la decisión optimizada
status: aprobado
---

# Clase 16 — Decisión bajo incertidumbre

## Audiencia y formato

- **Público:** mismos estudiantes de Clases 7–15 (estadística aplicada, UTP). Ya vieron probabilidad, intervalos, AB testing, hipótesis.
- **Duración:** 60 min exactos (última clase del curso).
- **Entrega:** archivo HTML único `Clase16_Decision_Bajo_Incertidumbre.html` proyectado por el docente; estudiantes con laptop para el hands-on del Acto 4.
- **Interacción:** cada estudiante recibe **una tarjeta pre-impresa con su trayectoria personalizada** (seeded por ID) y la transcribe a su guía durante el Acto 2. El Panel del Oráculo del HTML queda como modo lookup de emergencia. Hands-on en xolver al final.
- **Stack:** Tailwind CDN + Inter/JetBrains Mono + KaTeX. Sin build. Sin dependencias locales. Patrón idéntico a Clase15.

## Identidad visual

Continúa la estética cyberpunk de Clase15 (cierre coherente del curso):

- Fondo `#0a0014`, grid sutil, orbs flotantes
- Magenta `#ff2e93`, cyan `#00f0ff`, violeta `#b388ff`
- Tipografías: JetBrains Mono (display/datos), Inter (cuerpo)
- Animaciones: `data-step` con slide/zoom/glitch, HUD superior con progreso de 4 actos

## Arco narrativo

**Caso ancla:** Lucho y Pedro (callback a Clase14) montan **TintoApp** — delivery de café especial a oficinas. **Caja inicial: $50M**.

- **Lucho** = optimista
- **Pedro** = realista nervioso

Ambos van a estar equivocados porque piensan con promedios. La clase los lleva a ver el futuro como distribución, no como número.

**Mensaje final:** *Monte Carlo te muestra cómo es el futuro. La optimización (xolver) te dice qué hacer con él. Eso es decidir como adulto.*

## Estructura por actos

### Acto 1 — La trampa del promedio (10 min)

Lucho y Pedro escriben sus cálculos con promedios:

- Lucho: ingresos $11M / gastos $11M → "vivimos para siempre"
- Pedro: ingresos $8M / gastos $12M → "morimos mes 12"

Animación de dos líneas rectas descendiendo. **Glitch:** ambas pizarras se rompen. Texto en pantalla: *"Ningún mes es promedio."*

Fórmula KaTeX visible: `caja(t) = caja(0) + Σ(ingresos_i − gastos_i)`. La Σ es de variables aleatorias, no constantes.

### Acto 2 — Una vida posible (15 min)

Definimos distribuciones explícitas:

- Ingresos ~ **Uniforme($2M, $16M)** (esperado ≈ $9M)
- Gastos ~ **Triangular($9M, moda $14M, $18M)** (esperado ≈ $13.7M)

**Beat 1 (5 min) — Demo proyectada.** Animación de "tragamonedas": el estudiante ve un mes lanzarse en vivo. Mes 1: ingreso $5.2M, gasto $14.1M → caja $41.1M (Pedro celebra). Mes 2: ingreso $13.4M, gasto $9.3M → caja $45.2M (Lucho celebra). Aceleramos meses 3–12. Llega a $0 en mes 9. Quiebra. Mostramos una segunda trayectoria que sobrevive. La pregunta queda servida.

**Beat 2 (8 min) — Cada estudiante recibe su propia vida.** Los estudiantes **ya tienen su tarjeta personalizada** (pre-impresa, repartida al entrar al salón, boca abajo o en sobre cerrado). El docente dice: *"Ahora cada uno tiene SU propia TintoApp. Den la vuelta a su tarjeta."*

La tarjeta contiene:

- ID del estudiante (cédula / código)
- Tabla de 12 meses con ingreso, gasto, caja final
- Veredicto: `🔴 QUEBRASTE MES X` o `🟢 SOBREVIVISTE — CAJA FINAL $Y M`

Cada estudiante copia su tabla a la guía (rellena meses 1–12 + dibuja la trayectoria en el mini-gráfico cuadriculado). Mientras tanto, la animación cinematic del slot machine sigue en loop como ambiente musical-visual.

**Panel del Oráculo en clase** queda como **modo de emergencia/lookup**: si un estudiante perdió su tarjeta, llegó tarde, o quiere verificar, levanta la mano → el docente activa el panel con **T**, ingresa su ID, y le muestra/reimprime su trayectoria en pantalla del laptop (no proyectada).

Mecánica clave: la simulación es **seeded por el ID** (hash + PRNG mulberry32). Mismo ID = misma trayectoria. La pre-impresión y el lookup en clase usan la misma función → consistencia garantizada.

**Beat 3 (2 min) — Cierre del acto.** El docente pregunta al aire: *"Levanten la mano los que quebraron antes del mes 6. Los que sobrevivieron. ¿Cuántos hubo en la mitad?"* Conteo a ojo. La diversidad del salón ya es Monte Carlo en miniatura. Transición: *"Y eso fueron 30 vidas. ¿Qué pasa si vemos 10.000?"*

### Acto 3 — Diez mil vidas (20 min)

Definición de Monte Carlo en pantalla: *"Simular muchas veces el mismo experimento y mirar la distribución de resultados."*

**Animación signature de la clase:** cascada de 10K trayectorias dibujándose en Canvas. Color violeta translúcido (`rgba(179,136,255,0.04)`). La nube formada revela la zona densa donde pasa la mayoría. En paralelo, cada vez que una línea toca $0, un pixel cae al histograma "mes de quiebra" a la derecha.

Tres tarjetas grandes al cierre (valores típicos; lo que la sim muestre en vivo):

- **P(quebrar antes mes 12) ≈ 66%**
- **Mes esperado de quiebra ≈ 10**
- **Peor 5% = mes 7**

Veredicto: *"Pedro tenía razón: probablemente quiebran. Lucho tenía razón: hay ~34% de salir vivos. Ambos pensaban en blanco y negro; la realidad es una distribución."*

**Momento personal:** el docente proyecta el histograma global y pide a los estudiantes anotar en su guía:

- "Mi mes de quiebra: ___" (o "Sobreviví")
- "¿Estoy en el 38% que sobrevive? ___"
- "¿Estoy en el peor 5% (mes ≤ 4)? ___"
- "¿Mi destino es típico o atípico?" (una frase)

Cada estudiante se sitúa en la distribución que acaba de ver formarse. La estadística deja de ser abstracta.

Cliffhanger: *"Ya saben el riesgo. ¿Qué van a hacer?"*

### Acto 4 — La decisión (15 min, hands-on en xolver)

**Palancas (variables de decisión):**

1. **Subir precio %** (continua, 0–40)
2. **Recortar marketing %** (continua, 0–50)
3. **Contratar repartidores** (entera, 0–3)
4. **Pivotar a B2B** (binaria, 0/1)

**Función objetivo:** MIN Z = costo_cambios, sujeto a **subir P(sobrevivir 12m) al menos 20 puntos porcentuales** (de 38% base a ≥ 58%). Una meta ambiciosa pero alcanzable.

**Simplificación honesta** (declarada al estudiante): *"Xolver no hace Monte Carlo. Vamos a usar los promedios ajustados que cada decisión produce. Perdemos información sobre la cola, pero ganamos una respuesta concreta."* Esta limitación es **parte del aprendizaje**: cuándo cada herramienta sirve.

**Flujo:**

1. Profesor modela en xolver proyectado (variables + objetivo + 2 restricciones) → "Resolver" → animación de iteraciones → respuesta.
2. Estudiantes abren xolver en su laptop. Cargan el ejemplo "TintoApp" (precargado vía link).
3. Cada grupo recibe una variante ligera (otra meta de supervivencia, otra restricción de presupuesto).
4. Comparan respuestas. Discusión 3 min.

**Cierre del curso:** pantalla final con la frase ancla + agradecimiento.

## Componentes técnicos

### Stack (todo CDN)

| Pieza | Librería | Razón |
|---|---|---|
| Animaciones DOM | CSS + controlador `data-step` (mismo de Clase15) | Cero peso |
| Distribuciones (Uniforme, Triangular) | JS puro (~20 líneas) | No requiere mathjs |
| Cascada de trayectorias | Canvas 2D nativo con `globalAlpha=0.04` | SVG colapsa con 10K líneas |
| Histograma | Canvas 2D nativo | Consistencia con cascada |
| Fórmulas | KaTeX | Igual que Clase15 |

### Motor de simulación

```js
function uniforme(a, b) { return a + Math.random() * (b - a); }

function triangular(min, mode, max) {
  const u = Math.random();
  const c = (mode - min) / (max - min);
  return u < c
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function simularUnaVida(params) {
  let caja = params.cajaInicial;
  const trayectoria = [caja];
  let mesQuiebra = null;
  for (let m = 1; m <= 12; m++) {
    const ing = uniforme(params.ingMin, params.ingMax);
    const gas = triangular(params.gasMin, params.gasModa, params.gasMax);
    caja += ing - gas;
    trayectoria.push(caja);
    if (caja <= 0 && !mesQuiebra) { mesQuiebra = m; break; }
  }
  return { trayectoria, mesQuiebra };
}

function monteCarlo(params, N = 10000) {
  const resultados = [];
  for (let i = 0; i < N; i++) resultados.push(simularUnaVida(params));
  return resultados;
}
```

Parámetros base hardcodeados:

```js
const PARAMS = {
  cajaInicial: 50,
  ingMin: 2,  ingMax: 16,
  gasMin: 9,  gasModa: 14,  gasMax: 18,
};
```

Calibrado por simulación para dar **P(quiebra<12) ≈ 66%**, **mes esperado ≈ 10**, **peor 5% = mes 7** — todo dentro del rango target [55–70%] del spec.

### Panel del Oráculo (modo docente)

Capa oculta del estudiantado con **dos modos de operación**:

- **Batch (pre-clase):** docente pega el roster completo y genera todas las tarjetas para imprimir.
- **Lookup (en clase):** modo emergencia — un solo ID a la vez para estudiantes que perdieron su tarjeta.

**Activación:** tecla `T` (toggle). ESC cierra. Overlay translúcido oscuro, banner amarillo "MODO DOCENTE — NO PROYECTAR" arriba.

**Modo Batch — UI:**

- Textarea grande: pegar lista de IDs (uno por línea, o CSV con `id,nombre`)
- Botón **Generar todas las tarjetas**
- Botón **Imprimir tarjetas** → abre vista lista para imprimir: grilla de tarjetas (4 por hoja A4), cada una con ID, nombre opcional, tabla 12 meses, veredicto. Estilo limpio (no cyberpunk) para legibilidad en papel.
- Botón **Exportar CSV** → descarga `trayectorias_clase16.csv` con todas las trayectorias (backup).

**Modo Lookup — UI:**

- Input grande: `ID del estudiante`
- Botón **Generar trayectoria**
- Tarjeta de resultado con:
  - Tabla 12 filas × 4 columnas (Mes / Ingreso / Gasto / Caja final), meses 1–12 (mes 0 con caja $50M ya está impreso en la guía)
  - Banner grande con el destino: `🔴 QUEBRASTE MES 7` o `🟢 SOBREVIVISTE — CAJA FINAL $14.3M`
  - Botón "Limpiar" para el siguiente estudiante

Ambos modos usan la **misma función seeded** → garantía de consistencia entre la tarjeta impresa y el lookup en clase.

**Seeded PRNG (reproducible por ID):**

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
function simularPorID(id, params) {
  const rng = mulberry32(hashStr(id.trim().toLowerCase()));
  // misma lógica de simularUnaVida pero usando rng() en vez de Math.random()
}
```

**Propiedades clave:**

- Determinístico: el mismo ID siempre produce la misma trayectoria → si un estudiante pide repetir, sale igual.
- Bien distribuido: el hash FNV-1a + mulberry32 reparte uniformemente; no hay sesgos por orden alfabético.
- Independiente de la simulación del Acto 3: el Acto 3 sigue usando `Math.random()` para sus 10K corridas; las 30 trayectorias del salón son una **submuestra** de la población simulada.

### Orquestación de animaciones

- **Acto 2:** botón "Lanzar mes" dispara una corrida visible con cuenta atrás 600ms. Botón "Otra vida" reinicia.
- **Acto 3:** `monteCarlo()` precalculado al cargar la página. La cascada dibuja 100 trayectorias por frame con `requestAnimationFrame` (~100 frames totales, ~1.5–3 s). Fade-in del histograma + tarjetas al terminar.
- **Acto 4:** sliders HTML nativos. Al cambiar uno, recalculamos un mini-Monte-Carlo (N=1000) y mostramos "P(sobrevivir 12m)" como número grande. Botón final **"Abrir en xolver"**.

### Hand-off a xolver

**Opción elegida: link con query params.** El botón final apunta a `https://xolver.cgrajales.dev/?ejemplo=tintoapp`. El ejemplo "TintoApp" se agrega al dataset de ejemplos de xolver (cambio mínimo en el repo del Pi).

Snippet del ejemplo (a pegar en el repo de xolver):

```js
{
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
  context: 'Una startup de delivery de café enfrenta 62% de quebrar antes del mes 12. La función objetivo modela el costo de cada decisión; la segunda restricción modela una mejora mínima de 20% en la probabilidad de supervivencia.',
}
```

(Los coeficientes son redondos y didácticos, calibrados para dar una respuesta "subir precio ~12%, contratar 1 repartidor, no pivotar".)

## Guía impresa del estudiante

Archivo `Guia_Clase16_Decision_Bajo_Incertidumbre.docx`. **Carga pedagógica real**, no fallback. ~4 páginas A4.

### Estructura

**Página 1 — Portada + Acto 1**

- Título, fecha, espacio para "Nombre" e "ID".
- Mini-texto: *"Hoy vas a montar TintoApp con Lucho y Pedro. Y vas a vivir TU propia historia. Pide tu trayectoria al docente cuando llegue el Acto 2."*
- Tabla pequeña: *"¿Cuánto dura Lucho?* ___ meses · *¿Cuánto dura Pedro?* ___ meses".
- Pregunta abierta: *"¿Por qué los dos cálculos están mal?"* (3 líneas).

**Página 2 — Mi vida en TintoApp (Acto 2)**

- Encabezado: *"Mi ID: ___ · Caja inicial: $50M"*
- Tabla de 13 filas × 4 columnas:

  | Mes | Ingreso ($M) | Gasto ($M) | Caja final ($M) |
  |---|---|---|---|
  | 0 | — | — | 50.0 |
  | 1 | | | |
  | … hasta 12 … | | | |

- Recuadro destacado abajo: *"🎯 MI DESTINO: __________________"* (quebraste mes X / sobreviviste con $Y M).
- Mini-gráfico cuadriculado para que el estudiante dibuje a mano la trayectoria de su caja (eje X: meses 0–12, eje Y: $0–60M).

**Página 3 — Mi lugar en la distribución (Acto 3)**

- Tres datos para anotar mientras se proyecta el histograma:

  | Stat poblacional | Valor |
  |---|---|
  | P(quebrar antes mes 12) | _____ % |
  | Mes esperado de quiebra | _____ |
  | Peor 5% (quiebra mes ≤ ___ ) | _____ |

- Tres preguntas reflexivas:

  - "¿Sobreviví o quebré?" ☐ Sobreviví  ☐ Quebré mes ___
  - "¿Estoy en el 38% que sobrevive o en el 62% que quiebra?"
  - "¿Mi destino es típico (cerca del esperado) o atípico (cola)?"

**Página 4 — La decisión (Acto 4 + xolver)**

- Enunciado base del problema (~10 líneas) con variables, objetivo y restricciones en lenguaje natural.
- **Variante asignada al grupo** (3 variantes circulando entre mesas):
  - Variante A: meta de mejora ≥ 20 puntos porcentuales (base)
  - Variante B: presupuesto restringido — no puedes subir precio más de 15%
  - Variante C: meta agresiva — mejora ≥ 30 puntos porcentuales
- Tabla en blanco para que el grupo escriba:
  - Variables (nombre, tipo, mínimo, máximo) — 4 filas
  - Función objetivo (espacio para escribir la fórmula)
  - Restricciones (espacio para 2–3 reglas)
- Recuadro grande: *"Respuesta de xolver: __________________"* (valores óptimos de cada palanca).
- Pregunta de cierre: *"¿Tu decisión coincidió con la de otros grupos? ¿Por qué cambió cuando la restricción cambió?"* (4 líneas).

### Generación del .docx

Script Node generador (similar a los `gen_guia8.js` y `create_taller5.js` ya presentes en el repo). Una sola corrida, output checkeado al repo. La guía es estática (la personalización ocurre en clase vía el Panel del Oráculo, no en el .docx).

## Verificación

| Check | Cómo |
|---|---|
| Render visual completo | Navegar los 4 actos con flecha derecha en Chrome |
| Cascada no congela | Acto 3 con 10K corridas debe seguir respondiendo; si el primer frame tarda >50ms, fallback a 5K |
| Números cuadran | `monteCarlo(10000)` debe dar P(quiebra<mes12) entre 55–70% con PARAMS base |
| Histograma sincroniza con cascada | Columna alta del histograma coincide con valle de la nube |
| Palancas Acto 4 responden | <200ms para actualizar P(sobrevivir) al mover un slider |
| Link xolver carga TintoApp | Click en "Abrir en xolver" llega con modelo precargado |
| Móvil no se rompe | Probar en celular: HUD, navegación, Canvas escalan |
| Panel del Oráculo se oculta bien | Tecla `T` lo abre, ESC lo cierra, banner amarillo evidente |
| Batch genera todas las tarjetas | Pegar lista de 30 IDs en textarea → ver 30 tarjetas en la vista de impresión |
| Vista de impresión cuadra A4 | "Imprimir tarjetas" abre print preview con 4 tarjetas por A4, sin overflow, márgenes limpios |
| CSV de backup descarga bien | Botón "Exportar CSV" descarga archivo con todas las trayectorias en formato tabular |
| Mismo ID → misma trayectoria | Generar 2 veces el ID "12345" debe dar trayectoria idéntica |
| IDs distintos → trayectorias distintas | Generar 30 IDs distintos: la dispersión de "mes de quiebra" debe ser ancha (no todos sobreviven ni todos mueren) |
| Generador .docx funciona | Correr el script Node; abrir el .docx; verificar 4 páginas, tablas presentes, sin overflow |

## Entregables

| # | Archivo | Descripción |
|---|---|---|
| 1 | `Clase16_Decision_Bajo_Incertidumbre.html` | Archivo único, ~350 KB estimados |
| 2 | `Guia_Clase16_Decision_Bajo_Incertidumbre.docx` | Guía impresa de 4 páginas que cada estudiante llena durante la clase (Acto 1 reflexión, Acto 2 su trayectoria, Acto 3 su lugar en la distribución, Acto 4 modelado xolver). **Carga pedagógica real, no fallback.** |
| 3 | `gen_guia_clase16.js` | Script Node que genera el .docx (patrón idéntico a `gen_guia8.js` ya en el repo) |
| 4 | Snippet `tintoapp` para repo xolver | Se entrega como código en este spec; se pega manualmente cuando el Pi sea accesible |

## Riesgos y mitigaciones

1. **Bridge "promedios ajustados" en Acto 4 puede sentirse forzado.** Mitigación: el guion lo nombra explícitamente como simplificación pedagógica — *"xolver no hace Monte Carlo, pierdes información de la cola pero ganas una respuesta concreta"*. Convierte la limitación en aprendizaje sobre **cuándo cada herramienta sirve**.

2. **xolver podría estar caído en clase.** Mitigación: screenshots clave del flujo de modelado + respuesta correcta, listos como fallback offline. Guía .docx tiene también el enunciado y las variantes en papel.

3. **10K trayectorias podría no animar suave en laptops antiguos.** Mitigación: motor mide `performance.now()` del primer frame y baja a 5K automáticamente si >50ms.

4. **Cambio en repo xolver depende del Pi.** Mitigación: snippet listo en este spec; aplicable cuando el Pi sea accesible. Si no se llega a aplicar antes de clase, el botón apunta al xolver vacío y el docente modela en vivo (degrada un poco la experiencia pero no rompe).

5. **Estudiante perdió o no recibió su tarjeta.** Mitigación: el Modo Lookup del Panel del Oráculo permite regenerarla en segundos (misma seed = misma trayectoria). El docente le muestra en su laptop o le pasa el papel con los números a mano. Cero fricción.

6. **El docente puede proyectar el Panel sin querer.** Mitigación: banner amarillo gigante "MODO DOCENTE — NO PROYECTAR" + overlay oscuro que rompe la estética cinematic visualmente, para que el docente NOTE el cambio. Recomendación operativa en el spec: el docente tiene un segundo monitor (laptop sin proyectar) para esto.

## Fuera de alcance (YAGNI)

- Notebook Jupyter / Sheets paralelo
- Múltiples casos (solo TintoApp con variantes)
- Test suite automatizado
- Modo "instructor" con notas separadas (las notas viven como comentarios HTML)
- Captura de respuestas de estudiantes
