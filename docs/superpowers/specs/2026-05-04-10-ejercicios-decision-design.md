# 10 Ejercicios de Decisión Estadística — Diseño

## Contexto

Reemplazar los 5 ejercicios actuales (caps 24-28) en `Clase15_Hipotesis_Nula_Alternativa.html` por 10 ejercicios más exigentes. El usuario reportó "quedó demasiado fácil" — los actuales son 3 preguntas opción múltiple sin cálculo numérico ni trampas conceptuales.

## Objetivo

Pasar de 5 ejercicios livianos a 10 que mezclan **carga de cálculo** y **carga de razonamiento profundo**, con datos crudos en pantalla, inputs numéricos para z/t, hints opcionales, y trampas que castigan la lectura superficial.

## Estructura por ejercicio

### Estilo A — Calc-heavy (5 ejercicios, 4 preguntas c/u, score 4/4)

1. Identificar H₀ y H₁ — multiple choice (4 opciones).
2. Identificar tipo de test / colas — multiple choice.
3. **Input numérico**: el estudiante teclea el estadístico z o t calculado a mano. Tolerancia ±0.05. Una sola oportunidad. Se muestran datos crudos en pantalla y un hint colapsable con la fórmula KaTeX (sin penalización por usarlo).
4. Decisión final dado p-valor — multiple choice (rechazar / no rechazar / depende del α).

### Estilo B — Reasoning-deep (5 ejercicios, 3 preguntas c/u, score 3/3)

1. Pregunta de setup capciosa (supuestos, colas según contexto).
2. Trampa de interpretación (significancia estadística vs práctica, multiple comparisons, error tipo I/II).
3. Decisión final con justificación correcta entre opciones que incluyen distractores tentadores.

## Los 10 escenarios

### Estilo A

| # | Cap | Escenario | Datos crudos | Test | Resultado |
|---|---|---|---|---|---|
| 1 | 24 | **Banco fraude** — Banco Andino dice tasa fraude p<0.5%. Auditoría detecta más. | n=2000, x=14 (0.7%), p₀=0.005 | 1-prop z, one-tail derecha | z≈1.26, p≈0.10 → **NO rechazar** (trampa: tasa observada parece alta pero n insuficiente) |
| 2 | 25 | **Hospital urgencias** — Clínica promete μ<30 min. | n=40, x̄=33.5, s=8, μ₀=30 | t-test, one-tail derecha | t≈2.77, p≈0.004 → **rechazar** |
| 3 | 26 | **Manufactura SKF** — Línea histórica 2% defectos, QA detecta más. | n=500, x=18 (3.6%), p₀=0.02 | 1-prop z, two-tail | z≈2.56, p≈0.010 → **rechazar** |
| 4 | 27 | **Email A/B Shopify** — ¿Campaña B mejor que A? | A: 240/3000=8%, B: 312/3000=10.4% | 2-prop z, one-tail derecha | z≈3.30, p≈0.0005 → **rechazar** |
| 5 | 28 | **Rappi delivery time** — Tras optimización ML, ¿bajó el tiempo? | μ₀=28, σ=6 conocida, n=50, x̄=26.4 | z-test σ conocida, one-tail izq | z≈-1.89, p≈0.029 → **rechazar a α=0.05, NO a α=0.01** (trampa de α) |

### Estilo B

| # | Cap | Escenario | Trampa central |
|---|---|---|---|
| 6 | 29 | **Pfizer vacuna eficacia** | One-tail vs two-tail según contexto regulatorio. Si pasa de two-tail a one-tail, p se divide por 2. |
| 7 | 30 | **Google A/B button** — n=2,000,000 por grupo, 12.000% vs 12.034%, p<0.001 | Significancia estadística ≠ significancia práctica |
| 8 | 31 | **Startup tiempo en app** — n=8 con outlier brutal (180 vs valores 2-5) | Supuestos del t-test (normalidad/sin outliers); usar mediana o bootstrap |
| 9 | 32 | **FDA droga oncológica** | Definir error tipo I y II en palabras del dominio; por qué α más estricto en drogas críticas |
| 10 | 33 | **Growth team — 20 tests A/B** — Encuentran 1 significativo (p=0.04) | Multiple comparisons. P(≥1 falso positivo en 20)=1-0.95²⁰≈64%. Bonferroni → α/20=0.0025 |

## UX del input numérico

- Input grande, font-mono, fondo dark con neon glow (cyan/magenta según ejercicio).
- Placeholder: `z = ?` o `t = ?`.
- Botón "Calcular" al lado.
- Tolerancia: `Math.abs(input - expected) <= 0.05`.
- **Una sola oportunidad** — al enviar, se bloquea (no reintento, evita inflar score).
- **Hint colapsable** "💡 Ver fórmula" — despliega KaTeX con la fórmula del estadístico (sin penalizar score).
- **Datos crudos siempre visibles** en `.ex-data-card` arriba del input (n, x, μ₀/p₀, σ/s).
- Feedback:
  - ✅ Verde + valor exacto si dentro de tolerancia.
  - ❌ Rojo + valor correcto si fuera de tolerancia.

## Cambios técnicos en el archivo

1. **CSS nuevo**: clases `.ex-numeric-input`, `.ex-numeric-btn`, `.ex-formula-hint`, `.ex-formula-content`, `.ex-data-card-rich` (datos crudos con tabla pequeña).
2. **JS nuevo**:
   - `answerExNumeric(exId, qNum, expected, tolerance, formula, explanation)` — valida input, marca correcto/incorrecto, suma al score si OK.
   - `toggleFormulaHint(btn)` — muestra/oculta la fórmula KaTeX.
   - Modificar `finalizeExercise(exId)` para soportar score sobre 4 (estilo A) o 3 (estilo B) — leer `data-max-score` del `.exercise-frame`.
3. **HTML**: borrar caps 24-28 actuales, insertar 10 nuevos caps 24-33.
4. **Renumerar**: game arcade `cap29` → `cap34`. Actualizar `id`, `data-chapter`, e `id="cap29"` referencias.
5. **JS state**: `const TOTAL_CHAPTERS = 29;` → `34`. HUD counter `0 / 29` → `0 / 34`.

## Plan de validación

- Build local con `python -m http.server 8765`.
- Playwright: probar interactividad de 3 ejercicios (uno A con input correcto, uno A con input incorrecto, uno B con flujo de 3 preguntas).
- Verificar score se cuenta sobre el máximo correcto (4 o 3).
- Hard-refresh tras deploy.
- Confirmar que el game arcade en cap 34 sigue funcionando.

## Riesgos identificados

- **KaTeX en hints**: las fórmulas con `$...$` adentro de atributos JS pueden colisionar con el delimitador. Usar `\(...\)` o renderizar en bloque separado con `data-katex`.
- **Comillas anidadas en `onclick`**: ya nos pasó en la versión anterior. Usar `&quot;` para comillas literales en explicaciones.
- **Tolerancia ±0.05** puede ser muy estricta si el estudiante usa redondeo intermedio. Verificar con valores propagados desde fórmula completa, no desde redondeos de paso.
