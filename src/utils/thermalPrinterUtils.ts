/**
 * Thermal Printing & ESC/POS Utility Module
 * Handles reliable POS receipt printing via hidden iframe, ESC/POS binary generation,
 * high-resolution 203 DPI canvas snapshot export, and Web Serial / Bluetooth printer support.
 */

export interface ReceiptData {
  batchId: string;
  dateStr: string;
  timeStr: string;
  lineNo: string;
  operatorName: string;
  profileName: string;
  dimensionsStr: string;
  colorStr: string;
  transmittancePercent: number;
  resinTypeStr: string;
  batchScaleLabel: string;
  scaleFactor: number;
  scaledResinKg: number;
  scaledMekpMl: number;
  scaledMekpGrams: number;
  catalystPercent: number;
  scaledCobaltMl: number;
  scaledCobaltGrams: number;
  cobaltPercent: number;
  scaledPigmentGrams: number;
  pigmentPercent: number;
  scaledFillerKg: number;
  scaledFillerGrams: number;
  fillerType: string;
  scaledStyreneGrams: number;
  scaledUvGrams: number;
  totalLiquidBatchKg: number;
  scaledGlassKg: number;
  fiberType: string;
  scaledTotalCompositeKg: number;
  ambientTempC: number;
  estimatedGelTimeMin: number;
  peakExothermTempC: number;
  estimatedCostInr: number;
  pricePerSqFtInr: number;
  gstAmountInr: number;
  totalCostWithGstInr: number;
  paperWidthMm: '80mm' | '58mm';
}

/**
 * Reliable thermal printing via a dedicated isolated hidden iframe.
 * Bypasses web app CSS conflicts and iframe parent modal scrollbar issues.
 */
export function printThermalReceiptViaIframe(receiptData: ReceiptData): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Remove any existing print iframe
      const existingIframe = document.getElementById('thermal-print-iframe');
      if (existingIframe) {
        existingIframe.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'thermal-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = '0px';
      iframe.style.visibility = 'hidden';

      document.body.appendChild(iframe);

      const is58 = receiptData.paperWidthMm === '58mm';
      const widthMm = is58 ? '58mm' : '80mm';
      const widthPx = is58 ? '210px' : '300px';

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (!doc) {
        window.print();
        resolve(false);
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>UFRP Batch Receipt ${receiptData.batchId}</title>
            <style>
              @page {
                size: ${widthMm} auto;
                margin: 0mm;
              }
              body {
                font-family: 'Courier New', Courier, monospace;
                font-size: ${is58 ? '9px' : '11px'};
                line-height: 1.25;
                color: #000000;
                background-color: #ffffff;
                margin: 0;
                padding: 4px;
                width: ${widthPx};
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .title { font-size: ${is58 ? '11px' : '13px'}; font-weight: 900; }
              .divider { border-top: 1px dashed #000; margin: 4px 0; }
              .double-divider { border-top: 2px dashed #000; margin: 4px 0; }
              .row { display: flex; justify-content: space-between; }
              .bg-box { background-color: #eeeeee; padding: 2px; font-weight: bold; margin: 2px 0; }
              .barcode {
                font-family: monospace;
                letter-spacing: 2px;
                font-size: 10px;
                margin-top: 2px;
              }
            </style>
          </head>
          <body>
            <div class="center bold title">UFRP BY M.G. INDUSTRIES</div>
            <div class="center" style="font-size:9px;">FRP RESIN MIXTURE BATCH TICKET</div>
            <div class="center" style="font-size:8px;">CONTINUOUS PULTRUSION LINE</div>
            <div class="double-divider"></div>

            <div class="row"><span class="bold">BATCH ID:</span> <span>${receiptData.batchId}</span></div>
            <div class="row"><span class="bold">DATE/TIME:</span> <span>${receiptData.dateStr} ${receiptData.timeStr}</span></div>
            <div class="row"><span class="bold">PLANT LINE:</span> <span>${receiptData.lineNo}</span></div>
            <div class="row"><span class="bold">OPERATOR:</span> <span>${receiptData.operatorName}</span></div>
            <div class="divider"></div>

            <div class="center bg-box">SPEC: ${receiptData.profileName}</div>
            <div class="row"><span>DIMENSIONS:</span> <span>${receiptData.dimensionsStr}</span></div>
            <div class="row"><span>COLOR:</span> <span>${receiptData.colorStr} (${receiptData.transmittancePercent}%)</span></div>
            <div class="row"><span>RESIN MATRIX:</span> <span>${receiptData.resinTypeStr}</span></div>
            <div class="row"><span>BATCH SCALE:</span> <span class="bold">${receiptData.batchScaleLabel}</span></div>
            <div class="divider"></div>

            <div class="row bold" style="border-bottom:1px solid #000; padding-bottom:2px; margin-bottom:2px;">
              <span>COMPONENT</span><span>DOSING QTY</span>
            </div>
            <div class="row bold"><span>1. RESIN MATRIX</span> <span>${receiptData.scaledResinKg.toFixed(2)} KG</span></div>
            <div class="row"><span>2. MEKP (${receiptData.catalystPercent}%)</span> <span>${receiptData.scaledMekpMl.toFixed(1)} mL (${receiptData.scaledMekpGrams.toFixed(1)}g)</span></div>
            <div class="row"><span>3. COBALT (${receiptData.cobaltPercent}%)</span> <span>${receiptData.scaledCobaltMl.toFixed(1)} mL (${receiptData.scaledCobaltGrams.toFixed(1)}g)</span></div>
            <div class="row"><span>4. PIGMENT (${receiptData.pigmentPercent}%)</span> <span>${receiptData.scaledPigmentGrams.toFixed(1)} g</span></div>
            ${receiptData.scaledFillerGrams > 0 ? `<div class="row"><span>5. FILLER (${receiptData.fillerType})</span> <span>${receiptData.scaledFillerKg.toFixed(2)} KG</span></div>` : ''}
            <div class="row"><span>6. STYRENE DILUENT</span> <span>${receiptData.scaledStyreneGrams.toFixed(1)} g</span></div>
            <div class="row"><span>7. UV STABILIZER</span> <span>${receiptData.scaledUvGrams.toFixed(1)} g</span></div>
            <div class="divider"></div>

            <div class="row bold"><span>LIQUID BATCH MASS:</span> <span>${receiptData.totalLiquidBatchKg.toFixed(2)} KG</span></div>
            <div class="row"><span>GLASS FIBER (${receiptData.fiberType}):</span> <span>${receiptData.scaledGlassKg.toFixed(2)} KG</span></div>
            <div class="row bold"><span>TOTAL COMPOSITE:</span> <span>${receiptData.scaledTotalCompositeKg.toFixed(2)} KG</span></div>
            <div class="divider"></div>

            <div class="bold" style="font-size:8px;">POT LIFE & PROCESS CONTROL:</div>
            <div class="row"><span>AMBIENT TEMP:</span> <span>${receiptData.ambientTempC}°C</span></div>
            <div class="row bold"><span>POT LIFE GEL:</span> <span>${receiptData.estimatedGelTimeMin} MINS</span></div>
            <div class="row"><span>PEAK EXOTHERM:</span> <span>${receiptData.peakExothermTempC}°C</span></div>
            <div class="divider"></div>

            <div class="bold" style="font-size:8px;">INDIAN COMMERCIAL COST (HSN 3920):</div>
            <div class="row"><span>EX-FACTORY VALUE:</span> <span>₹${Math.round(receiptData.estimatedCostInr).toLocaleString('en-IN')}</span></div>
            <div class="row"><span>RATE / SQ.FT:</span> <span>₹${receiptData.pricePerSqFtInr} / sq.ft</span></div>
            <div class="row"><span>18% GST TAX:</span> <span>₹${Math.round(receiptData.gstAmountInr).toLocaleString('en-IN')}</span></div>
            <div class="row bold" style="font-size:11px; margin-top:2px;"><span>TOTAL INCL. GST:</span> <span>₹${Math.round(receiptData.totalCostWithGstInr).toLocaleString('en-IN')}</span></div>
            <div class="divider"></div>

            <div class="center" style="margin: 6px 0;">
              <div style="background:#000; color:#fff; padding:3px; font-weight:bold; letter-spacing:3px;">
                |||||| | ||||| ||| |||||
              </div>
              <div class="barcode">*${receiptData.batchId}*</div>
            </div>

            <div class="divider"></div>
            <div class="row" style="margin-top:10px;">
              <span>MIXER: _________</span>
              <span>QC: _________</span>
            </div>
            <div class="center" style="font-size:7px; margin-top:8px;">
              QUALITY ASSURED • M.G. INDUSTRIES<br/>BIS IS 12866:2020 COMPLIANT
            </div>
            <br/>
          </body>
        </html>
      `;

      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch (e) {
          console.warn('Iframe print failed, falling back to window.print():', e);
          window.print();
          resolve(false);
        }
      }, 250);
    } catch (err) {
      console.error('Print iframe creation error:', err);
      window.print();
      resolve(false);
    }
  });
}

/**
 * Generates raw ESC/POS binary command stream for direct hardware thermal printers
 * (Epson, TVS, Xprinter, Citizen, Star, etc.)
 */
export function generateEscPosBinary(receiptData: ReceiptData): Uint8Array {
  const encoder = new TextEncoder();
  const commands: number[] = [];

  // Helper push bytes
  const push = (...bytes: number[]) => commands.push(...bytes);
  const pushText = (str: string) => {
    const encoded = encoder.encode(str);
    encoded.forEach(b => commands.push(b));
  };
  const pushLine = (str: string = '') => {
    pushText(str + '\n');
  };

  // ESC/POS Commands
  const ESC = 0x1B;
  const GS = 0x1D;

  // Initialize printer
  push(ESC, 0x40);

  // Center align
  push(ESC, 0x61, 1);

  // Bold & Double height text for Company Header
  push(ESC, 0x45, 1); // Bold ON
  push(GS, 0x21, 0x11); // Double width + double height
  pushLine('UFRP BY M.G. IND');
  push(GS, 0x21, 0x00); // Normal size
  pushLine('FRP RESIN MIXTURE BATCH TICKET');
  pushLine('CONTINUOUS PULTRUSION LINE');
  push(ESC, 0x45, 0); // Bold OFF

  pushLine('================================');

  // Left align
  push(ESC, 0x61, 0);
  pushLine(`BATCH ID   : ${receiptData.batchId}`);
  pushLine(`DATE / TIME: ${receiptData.dateStr} ${receiptData.timeStr}`);
  pushLine(`PLANT LINE : ${receiptData.lineNo}`);
  pushLine(`OPERATOR   : ${receiptData.operatorName}`);
  pushLine('--------------------------------');

  push(ESC, 0x45, 1);
  pushLine(`SPEC: ${receiptData.profileName}`);
  push(ESC, 0x45, 0);
  pushLine(`DIMENSIONS : ${receiptData.dimensionsStr}`);
  pushLine(`COLOR/TRAN : ${receiptData.colorStr} (${receiptData.transmittancePercent}%)`);
  pushLine(`RESIN TYPE : ${receiptData.resinTypeStr}`);
  pushLine(`BATCH SCALE: ${receiptData.batchScaleLabel}`);
  pushLine('--------------------------------');

  push(ESC, 0x45, 1);
  pushLine('CHEMICAL DOSING RECIPE:');
  push(ESC, 0x45, 0);
  pushLine(`1. RESIN MATRIX : ${receiptData.scaledResinKg.toFixed(2)} KG`);
  pushLine(`2. MEKP (${receiptData.catalystPercent}%): ${receiptData.scaledMekpMl.toFixed(1)} mL (${receiptData.scaledMekpGrams.toFixed(1)}g)`);
  pushLine(`3. COBALT (${receiptData.cobaltPercent}%): ${receiptData.scaledCobaltMl.toFixed(1)} mL (${receiptData.scaledCobaltGrams.toFixed(1)}g)`);
  pushLine(`4. PIGMENT (${receiptData.pigmentPercent}%): ${receiptData.scaledPigmentGrams.toFixed(1)} g`);
  if (receiptData.scaledFillerGrams > 0) {
    pushLine(`5. FILLER (${receiptData.fillerType}): ${receiptData.scaledFillerKg.toFixed(2)} KG`);
  }
  pushLine(`6. STYRENE DILUENT: ${receiptData.scaledStyreneGrams.toFixed(1)} g`);
  pushLine(`7. UV STABILIZER: ${receiptData.scaledUvGrams.toFixed(1)} g`);
  pushLine('--------------------------------');

  push(ESC, 0x45, 1);
  pushLine(`LIQUID BATCH MASS : ${receiptData.totalLiquidBatchKg.toFixed(2)} KG`);
  pushLine(`GLASS FIBER MASS  : ${receiptData.scaledGlassKg.toFixed(2)} KG`);
  pushLine(`TOTAL COMPOSITE   : ${receiptData.scaledTotalCompositeKg.toFixed(2)} KG`);
  push(ESC, 0x45, 0);
  pushLine('--------------------------------');

  pushLine(`AMBIENT TEMP : ${receiptData.ambientTempC} C`);
  push(ESC, 0x45, 1);
  pushLine(`POT LIFE GEL : ${receiptData.estimatedGelTimeMin} MINUTES`);
  push(ESC, 0x45, 0);
  pushLine(`PEAK EXOTHERM: ${receiptData.peakExothermTempC} C`);
  pushLine('--------------------------------');

  pushLine(`EX-FACTORY VALUE : RS ${Math.round(receiptData.estimatedCostInr).toLocaleString('en-IN')}`);
  pushLine(`RATE / SQ.FT     : RS ${receiptData.pricePerSqFtInr} / sq.ft`);
  pushLine(`18% GST (3920)   : RS ${Math.round(receiptData.gstAmountInr).toLocaleString('en-IN')}`);
  push(ESC, 0x45, 1);
  pushLine(`TOTAL INCL. GST  : RS ${Math.round(receiptData.totalCostWithGstInr).toLocaleString('en-IN')}`);
  push(ESC, 0x45, 0);
  pushLine('================================');

  // Barcode (ESC/POS CODE 39)
  push(ESC, 0x61, 1); // Center
  push(GS, 0x68, 50); // Barcode height 50
  push(GS, 0x77, 2);  // Barcode width 2
  push(GS, 0x6B, 0x04); // Code39
  pushText(receiptData.batchId);
  push(0x00); // NUL terminator
  pushLine(`*${receiptData.batchId}*`);

  pushLine('\nMIXER: _________   QC: _________');
  pushLine('QUALITY ASSURED • M.G. INDUSTRIES');
  pushLine('BIS IS 12866:2020 COMPLIANT\n\n\n');

  // Paper cut command (ESC/POS)
  push(GS, 0x56, 66, 0); // GS V 66 0 (Cut paper)

  return new Uint8Array(commands);
}

/**
 * Generates an HD Canvas thermal receipt image (203 DPI thermal paper style)
 * for instant PNG download or visual preview.
 */
export function generateThermalReceiptCanvas(receiptData: ReceiptData): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const width = 576; // Standard 80mm thermal printer width at 203 DPI
    const height = 1120;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(canvas);
      return;
    }

    // White Thermal Paper Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Thermal Printer Deep Black Ink
    ctx.fillStyle = '#000000';

    let y = 35;
    const paddingLeft = 32;
    const rightAlignX = width - 32;

    const drawDashedLine = (currY: number) => {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(paddingLeft, currY);
      ctx.lineTo(rightAlignX, currY);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawRow = (left: string, right: string, currY: number, isBold: boolean = false) => {
      ctx.font = isBold ? 'bold 15px monospace' : '14px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(left, paddingLeft, currY);
      ctx.textAlign = 'right';
      ctx.fillText(right, rightAlignX, currY);
    };

    // Header Branding
    ctx.textAlign = 'center';
    ctx.font = '900 24px monospace';
    ctx.fillText('UFRP BY M.G. INDUSTRIES', width / 2, y);
    y += 24;

    ctx.font = '14px monospace';
    ctx.fillText('FRP RESIN MIXTURE BATCH TICKET', width / 2, y);
    y += 20;

    ctx.font = '12px monospace';
    ctx.fillText('CONTINUOUS PULTRUSION LINE', width / 2, y);
    y += 18;

    drawDashedLine(y);
    y += 20;

    // Batch Meta
    drawRow('BATCH ID:', receiptData.batchId, y, true);
    y += 22;
    drawRow('DATE/TIME:', `${receiptData.dateStr} ${receiptData.timeStr}`, y);
    y += 22;
    drawRow('PLANT LINE:', receiptData.lineNo, y);
    y += 22;
    drawRow('OPERATOR:', receiptData.operatorName, y);
    y += 22;

    drawDashedLine(y);
    y += 20;

    // Spec Title Box
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(paddingLeft, y - 14, width - 64, 26);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`SPEC: ${receiptData.profileName}`, width / 2, y + 3);
    y += 28;

    drawRow('DIMENSIONS:', receiptData.dimensionsStr, y);
    y += 22;
    drawRow('COLOR/TRANSP:', `${receiptData.colorStr} (${receiptData.transmittancePercent}%)`, y);
    y += 22;
    drawRow('RESIN MATRIX:', receiptData.resinTypeStr, y);
    y += 22;
    drawRow('BATCH SCALE:', receiptData.batchScaleLabel, y, true);
    y += 22;

    drawDashedLine(y);
    y += 20;

    // Recipe Header
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('COMPONENT', paddingLeft, y);
    ctx.textAlign = 'right';
    ctx.fillText('DOSING QTY', rightAlignX, y);
    y += 8;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(rightAlignX, y);
    ctx.stroke();
    y += 22;

    drawRow('1. RESIN MATRIX', `${receiptData.scaledResinKg.toFixed(2)} KG`, y, true);
    y += 22;
    drawRow(`2. MEKP (${receiptData.catalystPercent}%)`, `${receiptData.scaledMekpMl.toFixed(1)} mL (${receiptData.scaledMekpGrams.toFixed(1)}g)`, y);
    y += 22;
    drawRow(`3. COBALT (${receiptData.cobaltPercent}%)`, `${receiptData.scaledCobaltMl.toFixed(1)} mL (${receiptData.scaledCobaltGrams.toFixed(1)}g)`, y);
    y += 22;
    drawRow(`4. PIGMENT (${receiptData.pigmentPercent}%)`, `${receiptData.scaledPigmentGrams.toFixed(1)} g`, y);
    y += 22;

    if (receiptData.scaledFillerGrams > 0) {
      drawRow(`5. FILLER (${receiptData.fillerType})`, `${receiptData.scaledFillerKg.toFixed(2)} KG`, y);
      y += 22;
    }

    drawRow('6. STYRENE DILUENT', `${receiptData.scaledStyreneGrams.toFixed(1)} g`, y);
    y += 22;
    drawRow('7. UV STABILIZER', `${receiptData.scaledUvGrams.toFixed(1)} g`, y);
    y += 22;

    drawDashedLine(y);
    y += 20;

    // Mass totals
    drawRow('LIQUID BATCH MASS:', `${receiptData.totalLiquidBatchKg.toFixed(2)} KG`, y, true);
    y += 22;
    drawRow(`GLASS FIBER (${receiptData.fiberType}):`, `${receiptData.scaledGlassKg.toFixed(2)} KG`, y);
    y += 22;
    drawRow('TOTAL COMPOSITE:', `${receiptData.scaledTotalCompositeKg.toFixed(2)} KG`, y, true);
    y += 22;

    drawDashedLine(y);
    y += 20;

    // Process & Pot Life
    drawRow('AMBIENT TEMP:', `${receiptData.ambientTempC}°C`, y);
    y += 22;
    drawRow('POT LIFE GEL TIME:', `${receiptData.estimatedGelTimeMin} MINUTES`, y, true);
    y += 22;
    drawRow('PEAK EXOTHERM:', `${receiptData.peakExothermTempC}°C`, y);
    y += 22;

    drawDashedLine(y);
    y += 20;

    // Indian Commercial Valuation & GST
    drawRow('EX-FACTORY VALUE:', `₹${Math.round(receiptData.estimatedCostInr).toLocaleString('en-IN')}`, y);
    y += 22;
    drawRow('RATE / SQ.FEET:', `₹${receiptData.pricePerSqFtInr} / sq.ft`, y);
    y += 22;
    drawRow('18% GST (HSN 3920):', `₹${Math.round(receiptData.gstAmountInr).toLocaleString('en-IN')}`, y);
    y += 22;
    drawRow('TOTAL INCL. GST:', `₹${Math.round(receiptData.totalCostWithGstInr).toLocaleString('en-IN')}`, y, true);
    y += 22;

    drawDashedLine(y);
    y += 25;

    // Barcode Simulation
    ctx.fillStyle = '#000000';
    const barWidth = 320;
    const barX = (width - barWidth) / 2;
    const barHeights = [40, 40, 40];
    const barsPattern = [4,2,3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,2,3,1,4,2,3,1,2,4,1,3,2,1,4,2,3,1];
    let currBarX = barX;

    barsPattern.forEach((w) => {
      ctx.fillRect(currBarX, y, w * 2, 40);
      currBarX += w * 2 + 3;
    });

    y += 50;
    ctx.textAlign = 'center';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`*${receiptData.batchId}*`, width / 2, y);
    y += 25;

    drawDashedLine(y);
    y += 30;

    // Signatures
    ctx.textAlign = 'left';
    ctx.font = '12px monospace';
    ctx.fillText('MIXER SIGN: ______________', paddingLeft, y);
    ctx.textAlign = 'right';
    ctx.fillText('QC APPROVED: ______________', rightAlignX, y);
    y += 30;

    ctx.textAlign = 'center';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('QUALITY ASSURED • M.G. INDUSTRIES • BIS IS 12866 COMPLIANT', width / 2, y);

    resolve(canvas);
  });
}
