import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  Copy,
  Download,
  Check,
  RefreshCw,
  Building2,
  ShieldCheck,
  IndianRupee,
  Clock,
  Thermometer,
  Sparkles,
  Sliders,
  FileText,
  Barcode,
  CheckCircle2,
  Image as ImageIcon,
  Cpu,
  Smartphone,
  Info,
  Share2
} from 'lucide-react';
import { FRPConfig } from '../types';
import {
  ReceiptData,
  printThermalReceiptViaIframe,
  generateEscPosBinary,
  generateThermalReceiptCanvas
} from '../utils/thermalPrinterUtils';

interface ThermalPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: any;
}

export const ThermalPrintModal: React.FC<ThermalPrintModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
}) => {
  const [operatorName, setOperatorName] = useState('Rakesh Kumar (Batch Tech)');
  const [lineNo, setLineNo] = useState('Pultrusion Line #02');
  const [batchScaleKg, setBatchScaleKg] = useState<number>(0); // 0 = Single Sheet Batch
  const [paperWidthMm, setPaperWidthMm] = useState<'80mm' | '58mm'>('80mm');
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate Batch Scaling Factor
  const singleSheetResinKg = Math.max(0.1, materials.totalResinWeightKg);
  const scaleFactor = batchScaleKg > 0 ? batchScaleKg / singleSheetResinKg : 1.0;

  // Scaled Batch Components
  const scaledResinKg = singleSheetResinKg * scaleFactor;
  const scaledMekpMl = materials.catalystVolumeMl * scaleFactor;
  const scaledMekpGrams = scaledMekpMl * 1.1; // MEKP density ~1.1 g/ml
  const scaledCobaltMl = materials.cobaltVolumeMl * scaleFactor;
  const scaledCobaltGrams = scaledCobaltMl * 0.96; // Cobalt 6% density ~0.96 g/ml
  const scaledFillerGrams = materials.fillerWeightGrams * scaleFactor;
  const scaledFillerKg = scaledFillerGrams / 1000;
  const scaledPigmentGrams = materials.pigmentWeightGrams * scaleFactor;
  const scaledStyreneGrams = materials.styreneMonomerWeightGrams * scaleFactor;
  const scaledUvGrams = materials.uvStabilizerGrams * scaleFactor;

  const totalLiquidBatchKg = scaledResinKg + (scaledFillerGrams / 1000) + ((scaledMekpGrams + scaledCobaltGrams + scaledPigmentGrams + scaledStyreneGrams + scaledUvGrams) / 1000);
  const scaledGlassKg = materials.totalGlassWeightKg * scaleFactor;
  const scaledTotalCompositeKg = materials.totalSheetWeightKg * scaleFactor;

  // Formatting timestamp
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const batchId = `BATCH-IN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Construct Receipt Data object
  const receiptData: ReceiptData = {
    batchId,
    dateStr,
    timeStr,
    lineNo,
    operatorName,
    profileName: config.profile.toUpperCase().replace(/_/g, ' '),
    dimensionsStr: `${config.widthMm}W × ${config.lengthMm}L × ${config.thicknessMm}T mm`,
    colorStr: config.color.toUpperCase().replace(/_/g, ' '),
    transmittancePercent: materials.lightTransmittancePercent,
    resinTypeStr: (config.resinType || 'orthophthalic').toUpperCase(),
    batchScaleLabel: batchScaleKg === 0 ? 'SINGLE SHEET' : `${batchScaleKg} KG RESIN DRUM`,
    scaleFactor,
    scaledResinKg,
    scaledMekpMl,
    scaledMekpGrams,
    catalystPercent: config.catalystPercent,
    scaledCobaltMl,
    scaledCobaltGrams,
    cobaltPercent: config.cobaltPercent ?? 0.2,
    scaledPigmentGrams,
    pigmentPercent: materials.pigmentPercent,
    scaledFillerKg,
    scaledFillerGrams,
    fillerType: config.fillerType ?? 'None',
    scaledStyreneGrams,
    scaledUvGrams,
    totalLiquidBatchKg,
    scaledGlassKg,
    fiberType: config.fiberType,
    scaledTotalCompositeKg,
    ambientTempC: materials.ambientTempC,
    estimatedGelTimeMin: materials.estimatedGelTimeMin,
    peakExothermTempC: materials.peakExothermTempC,
    estimatedCostInr: materials.estimatedCostInr * scaleFactor,
    pricePerSqFtInr: materials.pricePerSqFtInr,
    gstAmountInr: materials.gstAmountInr * scaleFactor,
    totalCostWithGstInr: materials.totalCostWithGstInr * scaleFactor,
    paperWidthMm,
  };

  // 1. Isolated iFrame Printing
  const handlePrint = async () => {
    setIsPrinting(true);
    setStatusMessage('Opening print dialog...');
    await printThermalReceiptViaIframe(receiptData);
    setIsPrinting(false);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // 2. Download Raw ESC/POS Binary File for POS Hardware Printers
  const handleDownloadEscPos = () => {
    const bytes = generateEscPosBinary(receiptData);
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(blob);
    element.download = `${batchId}_ESCPOS_ThermalPrint.bin`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setStatusMessage('Downloaded ESC/POS binary printer file (.bin)');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // 3. Export Receipt Image (PNG 203 DPI)
  const handleDownloadPngImage = async () => {
    setStatusMessage('Generating HD receipt image...');
    const canvas = await generateThermalReceiptCanvas(receiptData);
    const image = canvas.toDataURL('image/png');
    const element = document.createElement('a');
    element.href = image;
    element.download = `${batchId}_ThermalReceipt_203DPI.png`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setStatusMessage('Downloaded 203 DPI Thermal Receipt Image (PNG)');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // 4. Share Thermal Print Image via Device Web Share / Clipboard / Download
  const handleShareThermalImage = async () => {
    setStatusMessage('Generating thermal receipt image for sharing...');
    try {
      const canvas = await generateThermalReceiptCanvas(receiptData);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setStatusMessage('Failed to generate image');
          return;
        }
        const file = new File([blob], `${batchId}_ThermalReceipt_203DPI.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Thermal Print Batch Slip - ${batchId}`,
              text: `Thermal Batch Slip for ${receiptData.profileName} FRP Sheet (Batch ID: ${batchId})`,
              files: [file],
            });
            setStatusMessage('Shared thermal receipt image successfully!');
          } catch (err) {
            console.warn('Share cancelled or failed:', err);
          }
        } else if (navigator.clipboard && 'write' in navigator.clipboard) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setStatusMessage('Thermal print image copied to clipboard!');
          } catch (e) {
            handleDownloadPngImage();
          }
        } else {
          handleDownloadPngImage();
        }
        setTimeout(() => setStatusMessage(null), 3500);
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing thermal print image:', err);
      setStatusMessage('Error generating thermal receipt image');
    }
  };

  // 4. Format ASCII Text for Clipboard Copy
  const generateAsciiSlip = () => {
    return `================================================
          UFRP BY M.G. INDUSTRIES
      FRP RESIN MIXTURE BATCH SLIP (POS-${paperWidthMm === '58mm' ? '58' : '80'})
================================================
BATCH ID   : ${batchId}
DATE / TIME: ${dateStr} ${timeStr}
PLANT LINE : ${lineNo}
OPERATOR   : ${operatorName}
------------------------------------------------
PRODUCT    : ${receiptData.profileName} FRP SHEET
DIMENSIONS : ${receiptData.dimensionsStr}
COLOR      : ${receiptData.colorStr}
RESIN TYPE : ${receiptData.resinTypeStr}
BATCH MODE : ${receiptData.batchScaleLabel} (Scale: ${scaleFactor.toFixed(2)}x)
------------------------------------------------
EXACT CHEMICAL DOSING RECIPE:
------------------------------------------------
1. RESIN MATRIX    : ${scaledResinKg.toFixed(2)} KG
2. MEKP CATALYST   : ${scaledMekpMl.toFixed(1)} mL (${scaledMekpGrams.toFixed(1)} g) [@ ${config.catalystPercent}% PHR]
3. COBALT PROMOTER : ${scaledCobaltMl.toFixed(1)} mL (${scaledCobaltGrams.toFixed(1)} g) [@ ${(config.cobaltPercent ?? 0.2)}% PHR]
4. PIGMENT PASTE   : ${scaledPigmentGrams.toFixed(1)} g  [@ ${materials.pigmentPercent}% PHR]
5. MINERAL FILLER  : ${scaledFillerKg > 0 ? `${scaledFillerKg.toFixed(2)} KG` : 'N/A'} [${config.fillerType ?? 'None'}]
6. STYRENE DILUENT : ${scaledStyreneGrams.toFixed(1)} g
7. UV STABILIZER   : ${scaledUvGrams.toFixed(1)} g
------------------------------------------------
TOTAL LIQUID RESIN MIXTURE MASS : ${totalLiquidBatchKg.toFixed(2)} KG
GLASS FIBER REINFORCEMENT MASS  : ${scaledGlassKg.toFixed(2)} KG (${config.fiberType})
TOTAL FINISHED COMPOSITE MASS   : ${scaledTotalCompositeKg.toFixed(2)} KG
------------------------------------------------
PROCESS CONTROL & POT LIFE:
------------------------------------------------
AMBIENT TEMP  : ${materials.ambientTempC}°C
POT LIFE GEL  : ${materials.estimatedGelTimeMin} MINUTES
PEAK EXOTHERM : ${materials.peakExothermTempC}°C
------------------------------------------------
BIS & COMMERCIAL COST SUMMARY (IN RUPEES):
------------------------------------------------
STATUTORY STD : BIS IS 12866:2020 / IS 6746
EX-FACTORY    : ₹${Math.round(receiptData.estimatedCostInr).toLocaleString('en-IN')} INR
RATE / SQ.FT  : ₹${materials.pricePerSqFtInr} / sq.ft
18% GST (3920): ₹${Math.round(receiptData.gstAmountInr).toLocaleString('en-IN')} INR
TOTAL W/ GST  : ₹${Math.round(receiptData.totalCostWithGstInr).toLocaleString('en-IN')} INR
------------------------------------------------
MIXER SIGN     : _______________________
QC INSPECTOR   : _______________________
================================================
    QUALITY ASSURED • M.G. INDUSTRIES
================================================`;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateAsciiSlip());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([generateAsciiSlip()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${batchId}_ThermalBatchSlip.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-sans flex items-center gap-2">
                <span>Thermal Print Batch Slip</span>
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  {paperWidthMm} POS Ticket
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Continuous Pultrusion Resin & Catalyst Batch Dosing Ticket
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Controls & Ticket Preview */}
        <div className="p-3 sm:p-5 overflow-y-auto flex flex-col lg:flex-row gap-4 sm:gap-6 bg-slate-900">
          {/* Left Column: Batch Customization Controls */}
          <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2.5">
              <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Thermal Printer & Batch Scale
              </h4>

              {/* Printer Paper Width Selector */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400">Thermal Roll Width:</label>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => setPaperWidthMm('80mm')}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-center transition-all ${
                      paperWidthMm === '80mm'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    80mm Standard POS
                  </button>
                  <button
                    onClick={() => setPaperWidthMm('58mm')}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-center transition-all ${
                      paperWidthMm === '58mm'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    58mm Compact POS
                  </button>
                </div>
              </div>

              {/* Batch Scale Preset */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400">Target Resin Batch Scale:</label>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                  {[
                    { label: 'Single Sheet', kg: 0 },
                    { label: '25 Kg Drum', kg: 25 },
                    { label: '50 Kg Drum', kg: 50 },
                    { label: '100 Kg Tank', kg: 100 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setBatchScaleKg(opt.kg)}
                      className={`py-1.5 px-2 rounded-lg border text-[11px] font-bold text-center transition-all ${
                        batchScaleKg === opt.kg
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operator Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400">Batch Operator Name:</label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={(e) => setOperatorName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="Operator Name"
                />
              </div>

              {/* Plant Line */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono text-slate-400">Plant Line Number:</label>
                <input
                  type="text"
                  value={lineNo}
                  onChange={(e) => setLineNo(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  placeholder="Line #"
                />
              </div>
            </div>

            {/* Quick Dosing Summary Card */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono text-xs">
              <span className="text-[10px] uppercase text-slate-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Key Dosing Metrics
              </span>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">MEKP Catalyst:</span>
                <strong className="text-amber-300">{scaledMekpMl.toFixed(1)} mL</strong>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">Cobalt Promoter:</span>
                <strong className="text-amber-300">{scaledCobaltMl.toFixed(1)} mL</strong>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span className="text-slate-400">Resin Matrix:</span>
                <strong className="text-cyan-300">{scaledResinKg.toFixed(2)} kg</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pot Life Gel:</span>
                <strong className="text-emerald-400">{materials.estimatedGelTimeMin} min</strong>
              </div>
            </div>

            {/* Notification / Status Message */}
            {statusMessage && (
              <div className="bg-emerald-950/80 border border-emerald-500/40 p-2 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Print Action Buttons */}
            <div className="flex flex-col gap-2 mt-auto">
              {/* Primary Iframe Print Button */}
              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4" />
                <span>{isPrinting ? 'Printing...' : `Print Thermal Ticket (${paperWidthMm})`}</span>
              </button>

              {/* Share Thermal Print Image */}
              <button
                onClick={handleShareThermalImage}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-blue-600/20 border border-blue-400"
                title="Share thermal print receipt image via WhatsApp, Mail, Messages, or AirDrop"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Thermal Print Image</span>
              </button>

              {/* ESC/POS Raw Binary Download */}
              <button
                onClick={handleDownloadEscPos}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                title="Download raw ESC/POS command stream file for thermal printers (TVS, Epson, Xprinter)"
              >
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Download ESC/POS File (.bin)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* PNG Image Download */}
                <button
                  onClick={handleDownloadPngImage}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Download 203 DPI receipt image"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Receipt PNG</span>
                </button>

                {/* Text Copy */}
                <button
                  onClick={handleCopyText}
                  className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>
              </div>

              {/* Download TXT */}
              <button
                onClick={handleDownloadTxt}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Download Plain ASCII Ticket (.txt)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Thermal Receipt Visual Preview (80mm / 58mm POS thermal receipt paper styling) */}
          <div className="flex-1 flex flex-col items-center justify-start bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <div className="text-[10px] font-mono uppercase text-slate-400 mb-2 flex items-center justify-between w-full max-w-[340px]">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-amber-400" /> POS Receipt Preview ({paperWidthMm})
              </span>
              <span className="text-emerald-400 font-bold">203 DPI Crisp Ink</span>
            </div>

            {/* The Thermal Paper Container */}
            <div
              className={`bg-white text-slate-950 p-3 sm:p-4 font-mono leading-tight shadow-2xl rounded-sm border-t-8 border-b-8 border-slate-300 relative select-text transition-all ${
                paperWidthMm === '58mm' ? 'w-full max-w-[250px] text-[10px]' : 'w-full max-w-[340px] text-[11px]'
              }`}
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              {/* Paper Tear Top Zigzag Visual Header */}
              <div className="text-center font-bold tracking-wider border-b border-dashed border-slate-800 pb-2 mb-2">
                <div className={`${paperWidthMm === '58mm' ? 'text-xs' : 'text-sm'} font-black uppercase`}>UFRP BY M.G. INDUSTRIES</div>
                <div className="text-[9px] font-normal">FRP RESIN MIXTURE BATCH TICKET</div>
                <div className="text-[8px] font-semibold mt-0.5">CONTINUOUS PULTRUSION LINE</div>
              </div>

              {/* Batch Metadata Header */}
              <div className="border-b border-dashed border-slate-800 pb-2 mb-2 text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="font-bold">BATCH ID:</span>
                  <span>{batchId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">DATE/TIME:</span>
                  <span>{dateStr} {timeStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">PLANT LINE:</span>
                  <span>{lineNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">OPERATOR:</span>
                  <span>{operatorName}</span>
                </div>
              </div>

              {/* Product Profile Specs */}
              <div className="border-b border-dashed border-slate-800 pb-2 mb-2 text-[10px] space-y-0.5">
                <div className="font-bold uppercase text-center bg-slate-100 py-0.5 mb-1 text-[10px]">
                  SPEC: {config.profile.toUpperCase().replace(/_/g, ' ')}
                </div>
                <div className="flex justify-between">
                  <span>DIMENSIONS:</span>
                  <span>{config.widthMm}W × {config.lengthMm}L × {config.thicknessMm}T mm</span>
                </div>
                <div className="flex justify-between">
                  <span>COLOR / TRANSP:</span>
                  <span>{config.color.toUpperCase().replace(/_/g, ' ')} ({materials.lightTransmittancePercent}%)</span>
                </div>
                <div className="flex justify-between">
                  <span>RESIN MATRIX:</span>
                  <span>{(config.resinType || 'orthophthalic').toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>BATCH SCALE:</span>
                  <span className="font-bold">{batchScaleKg === 0 ? 'SINGLE SHEET' : `${batchScaleKg} KG RESIN DRUM`}</span>
                </div>
              </div>

              {/* Chemical Recipe Breakdown Table */}
              <div className="border-b border-dashed border-slate-800 pb-2 mb-2">
                <div className="font-bold uppercase text-[10px] border-b border-slate-800 pb-1 mb-1 flex justify-between">
                  <span>COMPONENT</span>
                  <span>QTY / DOSING</span>
                </div>

                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between font-bold">
                    <span>1. RESIN MATRIX</span>
                    <span>{scaledResinKg.toFixed(2)} KG</span>
                  </div>

                  <div className="flex justify-between">
                    <span>2. MEKP CATALYST ({config.catalystPercent}%)</span>
                    <span>{scaledMekpMl.toFixed(1)} mL ({scaledMekpGrams.toFixed(1)}g)</span>
                  </div>

                  <div className="flex justify-between">
                    <span>3. COBALT PROMOTER ({(config.cobaltPercent ?? 0.2)}%)</span>
                    <span>{scaledCobaltMl.toFixed(1)} mL ({scaledCobaltGrams.toFixed(1)}g)</span>
                  </div>

                  <div className="flex justify-between">
                    <span>4. PIGMENT PASTE ({materials.pigmentPercent}%)</span>
                    <span>{scaledPigmentGrams.toFixed(1)} g</span>
                  </div>

                  {scaledFillerGrams > 0 && (
                    <div className="flex justify-between">
                      <span>5. FILLER ({config.fillerType})</span>
                      <span>{scaledFillerKg.toFixed(2)} KG ({scaledFillerGrams.toFixed(0)}g)</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>6. STYRENE DILUENT</span>
                    <span>{scaledStyreneGrams.toFixed(1)} g</span>
                  </div>

                  <div className="flex justify-between">
                    <span>7. UV STABILIZER</span>
                    <span>{scaledUvGrams.toFixed(1)} g</span>
                  </div>
                </div>
              </div>

              {/* Total Mass Summary */}
              <div className="border-b border-dashed border-slate-800 pb-2 mb-2 text-[10px] space-y-1 bg-slate-50 p-1.5 rounded">
                <div className="flex justify-between font-bold text-xs">
                  <span>LIQUID BATCH MASS:</span>
                  <span>{totalLiquidBatchKg.toFixed(2)} KG</span>
                </div>
                <div className="flex justify-between">
                  <span>GLASS FIBER ({config.fiberType}):</span>
                  <span>{scaledGlassKg.toFixed(2)} KG</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>TOTAL COMPOSITE MASS:</span>
                  <span>{scaledTotalCompositeKg.toFixed(2)} KG</span>
                </div>
              </div>

              {/* Reaction & Process Pot Life */}
              <div className="border-b border-dashed border-slate-800 pb-2 mb-2 text-[10px] space-y-0.5">
                <div className="font-bold text-[9px] uppercase text-slate-600 mb-0.5">PROCESS POT LIFE WINDOW:</div>
                <div className="flex justify-between">
                  <span>AMBIENT TEMP:</span>
                  <span>{materials.ambientTempC}°C</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>POT LIFE GEL TIME:</span>
                  <span>{materials.estimatedGelTimeMin} MINUTES</span>
                </div>
                <div className="flex justify-between">
                  <span>PEAK EXOTHERM TEMP:</span>
                  <span>{materials.peakExothermTempC}°C</span>
                </div>
              </div>

              {/* Indian Market Commercial Valuation & GST */}
              <div className="border-b border-dashed border-slate-800 pb-2 mb-2 text-[10px] space-y-0.5">
                <div className="font-bold text-[9px] uppercase text-slate-600 mb-0.5">INDIAN COMMERCIAL RATE (HSN 3920):</div>
                <div className="flex justify-between">
                  <span>EX-FACTORY VALUE:</span>
                  <span>₹{Math.round(materials.estimatedCostInr * scaleFactor).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>RATE / SQ.FT:</span>
                  <span>₹{materials.pricePerSqFtInr} / sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span>18% GST TAX:</span>
                  <span>₹{Math.round(materials.gstAmountInr * scaleFactor).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-0.5">
                  <span>TOTAL INCL. GST:</span>
                  <span>₹{Math.round(materials.totalCostWithGstInr * scaleFactor).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="py-2 text-center flex flex-col items-center justify-center gap-1 border-b border-dashed border-slate-800 mb-2">
                <div className="flex gap-[2px] items-center justify-center h-8 w-full max-w-[200px] bg-slate-900 p-1">
                  {[3,1,2,4,1,3,2,1,4,2,3,1,2,4,1,2,3,1,4,2,3,1,2,4,1,3,2,1,4,2].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-white h-full"
                      style={{ width: `${w}px` }}
                    />
                  ))}
                </div>
                <div className="text-[9px] tracking-widest font-mono font-bold text-slate-700">
                  *{batchId}*
                </div>
              </div>

              {/* Signatures & Quality Assurance Footer */}
              <div className="text-[9px] space-y-3 pt-1">
                <div className="flex justify-between pt-4 border-t border-slate-300">
                  <span>MIXER SIGN: ___________</span>
                  <span>QC APP: ___________</span>
                </div>
                <div className="text-center text-[8px] text-slate-600 uppercase font-semibold">
                  QUALITY ASSURED • M.G. INDUSTRIES • BIS IS 12866 COMPLIANT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
