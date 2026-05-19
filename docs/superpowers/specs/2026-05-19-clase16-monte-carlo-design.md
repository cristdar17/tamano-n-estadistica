---
name: Clase 16 — Decisión bajo incertidumbre (Monte Carlo + Xolver)
description: Última clase del curso. 60 min cinemáticos sobre Monte Carlo aplicado al runway de una startup, con aterrizaje hands-on en xolver.cgrajales.dev para la decisión optimizada
status: aprobado
---

# Clase 16 — Decisión bajo incertidumbre

## Audiencia y formato

- **Público:** mismos estudiantes de Clases 7–15 (estadística aplicada, UTP). Ya vieron probabilidad, intervalos, AB testing, hipótesis.
- **Duración:** 60 min exactos (última clase del curso).
- **Entrega:** archivo HTML único `Clase16_Decision_Bajo_Incertidumbre.html` proyectado por el docente; estudiantes con laptop para el hands-on del Acto 4.
- **Interacción:** demo cinematic (Actos 1–3) + xolver hands-on (Acto 4).
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

- Ingresos ~ **Uniforme($5M, $15M)**
- Gastos ~ **Triangular($9M, moda $11M, $14M)**

Animación de "tragamonedas": el estudiante ve un mes lanzarse en vivo. Mes 1: ingreso $5.2M, gasto $14.1M → caja $41.1M (Pedro celebra). Mes 2: ingreso $13.4M, gasto $9.3M → caja $45.2M (Lucho celebra).

Aceleramos meses 3–12. La línea serpentea. Llega a $0 en mes 9. **Quiebra.**

Reset. Segunda trayectoria con semilla nueva — sobrevive el año. Lucho celebra. La pregunta queda: *"¿Quién tiene razón?"*

### Acto 3 — Diez mil vidas (20 min)

Definición de Monte Carlo en pantalla: *"Simular muchas veces el mismo experimento y mirar la distribución de resultados."*

**Animación signature de la clase:** cascada de 10K trayectorias dibujándose en Canvas. Color violeta translúcido (`rgba(179,136,255,0.04)`). La nube formada revela la zona densa donde pasa la mayoría. En paralelo, cada vez que una línea toca $0, un pixel cae al histograma "mes de quiebra" a la derecha.

Tres tarjetas grandes al cierre:

- **P(quebrar antes mes 12) = 62%**
- **Mes esperado de quiebra = 11**
- **Peor 5% = mes 4**

Veredicto: *"Pedro tenía razón: probablemente quiebran. Lucho tenía razón: hay 38% de salir vivos. Ambos pensaban en blanco y negro; la realidad es una distribución."*

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
  ingMin: 5,  ingMax: 15,
  gasMin: 9,  gasModa: 11,  gasMax: 14,
};
```

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

## Entregables

| # | Archivo | Descripción |
|---|---|---|
| 1 | `Clase16_Decision_Bajo_Incertidumbre.html` | Archivo único, ~350 KB estimados |
| 2 | `Guia_Clase16_Decision_Bajo_Incertidumbre.docx` | Guía imprimible: enunciado del Acto 4 + 3 variantes por grupo, para hands-on offline-fallback |
| 3 | Snippet `tintoapp` para repo xolver | Se entrega como código en este spec; se pega manualmente cuando el Pi sea accesible |

## Riesgos y mitigaciones

1. **Bridge "promedios ajustados" en Acto 4 puede sentirse forzado.** Mitigación: el guion lo nombra explícitamente como simplificación pedagógica — *"xolver no hace Monte Carlo, pierdes información de la cola pero ganas una respuesta concreta"*. Convierte la limitación en aprendizaje sobre **cuándo cada herramienta sirve**.

2. **xolver podría estar caído en clase.** Mitigación: screenshots clave del flujo de modelado + respuesta correcta, listos como fallback offline. Guía .docx tiene también el enunciado y las variantes en papel.

3. **10K trayectorias podría no animar suave en laptops antiguos.** Mitigación: motor mide `performance.now()` del primer frame y baja a 5K automáticamente si >50ms.

4. **Cambio en repo xolver depende del Pi.** Mitigación: snippet listo en este spec; aplicable cuando el Pi sea accesible. Si no se llega a aplicar antes de clase, el botón apunta al xolver vacío y el docente modela en vivo (degrada un poco la experiencia pero no rompe).

## Fuera de alcance (YAGNI)

- Notebook Jupyter / Sheets paralelo
- Múltiples casos (solo TintoApp con variantes)
- Test suite automatizado
- Modo "instructor" con notas separadas (las notas viven como comentarios HTML)
- Captura de respuestas de estudiantes
