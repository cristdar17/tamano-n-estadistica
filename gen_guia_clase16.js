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
  p([t("¿Estás en el 34% que sobrevive o en el 66% que quiebra?", { size: SZS })], { spacing: { after: 60 } }),
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
  p([t("Sabes que tienes ~66% de quebrar. ¿Qué decides hacer? Tienes 4 palancas:")], { spacing: { after: 100 } }),
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
