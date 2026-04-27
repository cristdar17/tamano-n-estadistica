---
name: Clase 15 — Hipótesis Nula y Alternativa (diseño)
description: Clase guiada interactiva de 60 + 30 min sobre H₀/H₁ con 4 simulaciones y 5 ejemplos cotidianos, modo presentador por teclado, estética cyberpunk
status: aprobado
---

# Clase 15 — Hipótesis Nula y Alternativa

## Audiencia y formato
- Público: cualquier persona, sin conocimiento previo de estadística
- Duración: 60 min de teoría + 30 min de ejemplos
- Entrega: archivo HTML único `Clase15_Hipotesis_Nula_Alternativa.html` servido desde GitHub Pages
- Stack: Tailwind CSS vía CDN, Vanilla JS, sin build
- Modo presentador: docente proyecta y avanza por teclado

## Identidad visual — Cyberpunk reinventado
Ruptura intencional con paleta navy/electric/gold de Clases 10–14.
- Fondo: `#0a0014` (negro violáceo) con grid sutil
- Acentos primarios: magenta `#ff2e93`, cyan `#00f0ff`
- Secundarios: violeta `#b388ff`, lima `#ccff00` (acento puntual)
- Tipografía display: JetBrains Mono (títulos, números, código)
- Tipografía cuerpo: Inter
- Efectos: glitch en títulos al revelar, glow neón en bordes activos, scanlines opcionales

## Metáfora ancla — Mezcla
- **Detective** narrativa principal (todo el recorrido)
- **Tribunal** al llegar a "veredicto" (rechazar/no rechazar H₀)
- **Médico** al explicar errores tipo I/II (falso positivo/negativo)

## Estructura — 11 capítulos

### Hora 1 — Conceptos (60 min)
1. **Problema: cuando dudamos** (5 min) — entrada cinematográfica detective
2. **H₀ vs H₁** (10 min) — cards rivales que se separan
3. **Evidencia: ¿qué tan rara?** (15 min) — **Sim 1: Moneda**
4. **P-value como área** (10 min) — **Sim 2: Confeti curva normal**
5. **Errores tipo I y II** (10 min) — **Sim 3: Matriz 2×2**
6. **Veredicto** (10 min) — **Sim 4: Barra de evidencia**

### Hora ½ — 5 ejemplos cotidianos (30 min, ~6 min c/u)
7. 🪙 ¿La moneda de mi amigo está cargada? (7/10 caras)
8. ☕ ¿El café de la esquina sí tiene más cafeína?
9. ☔ ¿De verdad llueve más los lunes en Pereira?
10. 💪 ¿El gimnasio nuevo funciona o es placebo?
11. 📸 ¿El filtro de Instagram engaña en test ciego?

Cada ejemplo: planteo H₀/H₁ → datos → mini-simulación → veredicto.

## Las 4 simulaciones

### Sim 1 — Moneda (capítulo 3)
Moneda 3D que gira con CSS transform. Botones: tirar 1, 10, 100, 1.000 veces. Counter de caras/sellos. Gráfico de barras que se anima. Mensaje contextual: "7/10 podría ser azar… pero 70/100 sería rarísimo".

### Sim 2 — Confeti distribución muestral (capítulo 4)
Canvas con ~10.000 partículas que caen y se apilan formando la curva normal bajo H₀. Línea vertical marca valor observado. Área a la derecha = p-value (resaltada en magenta).

### Sim 3 — Matriz errores I/II (capítulo 5)
Cuadrante 2×2 (Realidad H₀ verdadera/falsa × Decisión Rechazar/No rechazar). Hover ilumina escenario con metáfora intercambiable (médico/tribunal). Verde = correcto, magenta = error tipo I, naranja = error tipo II.

### Sim 4 — Barra de evidencia (capítulo 6)
Barra horizontal que crece con cada nuevo dato. Umbral fijo en 95% (línea cyan). Cuando cruza: explosión neón + texto glitch "VEREDICTO: RECHAZAR H₀".

Descartado: slider de α (demasiado abstracto para principiantes — se reemplaza con umbral fijo).

## Sistema de progresión por teclado

| Tecla | Acción |
|---|---|
| `→` / `Espacio` | Siguiente step |
| `←` | Step anterior |
| `↓` / `↑` | Saltar capítulo |
| `R` | Reset animación actual |
| `F` | Pantalla completa |
| `H` / `?` | Mostrar atajos |
| `T` | Toggle timer |
| `1-9`, `0` | Saltar a capítulo |

State manager global con `currentChapter` y `currentStep`. Cada elemento revelable tiene `data-step="N"` y se le agrega `.is-revealed` al activarse, disparando animaciones CSS.

LocalStorage persiste posición. Botón "reiniciar clase" en footer.

## HUD siempre visible
1. Barra superior segmentada en 11 bloques (capítulo actual brilla)
2. Contador `step 4/7` esquina inferior derecha (mono)
3. Indicador `→ continuar` parpadeante cuando hay próximo step
4. Timer toggleable (T) arriba-izquierda

## Mobile fallback
Botones flotantes ◀ / ▶ grandes para tablet/móvil del docente.

## Decisiones cerradas
- Cyberpunk magenta/cyan/violeta (no la línea navy de clases anteriores)
- Modo presentador en mismo navegador (no remoto multi-device)
- 4 simulaciones (descartado slider α)
- Mezcla de metáforas (detective + tribunal + médico)
- Ejemplos cotidianos (no de negocios)
- Tailwind vía CDN, sin build
