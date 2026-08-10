import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Mail,
  Printer,
  Sparkles,
  ExternalLink,
  FileText,
  ShieldCheck,
  Image as ImageIcon,
  Download,
  Loader2
} from 'lucide-react';
import { FRPConfig } from '../types';
import { calculateMaterials, getResinHexColor } from '../utils/frpCalculations';
import {
  serializeConfigToUrl,
  generateProductSummaryText,
  generateProductSpecCardCanvas
} from '../utils/shareUtils';
import {
  ReceiptData,
  generateThermalReceiptCanvas
} from '../utils/thermalPrinterUtils';
import { Product3DRenderer } from './Product3DRenderer';

interface ShareProductModalProps {
  config: FRPConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedSpec, setCopiedSpec] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [copiedThermalImage, setCopiedThermalImage] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'link' | 'image' | 'summary' | 'email' | 'thermal'>('image');

  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [cardBlob, setCardBlob] = useState<Blob | null>(null);
  const [thermalDataUrl, setThermalDataUrl] = useState<string | null>(null);
  const [thermalBlob, setThermalBlob] = useState<Blob | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const materials = calculateMaterials(config);
  const shareUrl = serializeConfigToUrl(config);
  const specText = generateProductSummaryText(config);

  // Generate Image Card whenever modal opens or tab changes
  useEffect(() => {
    if (!isOpen) return;

    const generateCard = async () => {
      setIsGeneratingImage(true);
      // Wait briefly for WebGL canvas to render
      await new Promise((r) => setTimeout(r, 150));

      const webglCanvas = document.querySelector('canvas') as HTMLCanvasElement | null;
      const cardCanvas = await generateProductSpecCardCanvas(config, webglCanvas);

      const dataUrl = cardCanvas.toDataURL('image/png');
      setCardDataUrl(dataUrl);

      cardCanvas.toBlob((blob) => {
        if (blob) setCardBlob(blob);
      }, 'image/png');

      setIsGeneratingImage(false);
    };

    const generateThermalCard = async () => {
      const receiptData: ReceiptData = {
        batchId: `BATCH-IN-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`,
        dateStr: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
        timeStr: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
        lineNo: 'Pultrusion Line #02',
        operatorName: 'Rakesh Kumar (Batch Tech)',
        profileName: config.profile.toUpperCase().replace(/_/g, ' '),
        dimensionsStr: `${config.widthMm}W × ${config.lengthMm}L × ${config.thicknessMm}T mm`,
        colorStr: config.color.toUpperCase().replace(/_/g, ' '),
        transmittancePercent: materials.lightTransmittancePercent,
        resinTypeStr: (config.resinType || 'orthophthalic').toUpperCase(),
        batchScaleLabel: 'SINGLE SHEET',
        scaleFactor: 1.0,
        scaledResinKg: materials.totalResinWeightKg,
        scaledMekpMl: materials.catalystVolumeMl,
        scaledMekpGrams: materials.catalystVolumeMl * 1.1,
        catalystPercent: config.catalystPercent,
        scaledCobaltMl: materials.cobaltVolumeMl,
        scaledCobaltGrams: materials.cobaltVolumeMl * 0.96,
        cobaltPercent: config.cobaltPercent ?? 0.2,
        scaledPigmentGrams: materials.pigmentWeightGrams,
        pigmentPercent: materials.pigmentPercent,
        scaledFillerKg: materials.fillerWeightGrams / 1000,
        scaledFillerGrams: materials.fillerWeightGrams,
        fillerType: config.fillerType ?? 'None',
        scaledStyreneGrams: materials.totalResinWeightKg * 1000 * 0.05,
        scaledUvGrams: materials.totalResinWeightKg * 1000 * 0.005,
        totalLiquidBatchKg: materials.totalResinWeightKg + (materials.fillerWeightGrams / 1000) + ((materials.catalystVolumeMl * 1.1 + materials.cobaltVolumeMl * 0.96 + materials.pigmentWeightGrams + (materials.totalResinWeightKg * 1000 * 0.05) + (materials.totalResinWeightKg * 1000 * 0.005)) / 1000),
        scaledGlassKg: materials.totalGlassWeightKg,
        fiberType: config.fiberType,
        scaledTotalCompositeKg: materials.totalSheetWeightKg,
        ambientTempC: materials.ambientTempC,
        estimatedGelTimeMin: materials.estimatedGelTimeMin,
        peakExothermTempC: materials.peakExothermTempC,
        estimatedCostInr: materials.estimatedCostInr,
        pricePerSqFtInr: materials.pricePerSqFtInr,
        gstAmountInr: materials.gstAmountInr,
        totalCostWithGstInr: materials.totalCostWithGstInr,
        paperWidthMm: '80mm',
      };
      const thermalCanvas = await generateThermalReceiptCanvas(receiptData);
      setThermalDataUrl(thermalCanvas.toDataURL('image/png'));
      thermalCanvas.toBlob((blob) => {
        if (blob) setThermalBlob(blob);
      }, 'image/png');
    };

    if (activeTab === 'image') generateCard();
    if (activeTab === 'thermal') generateThermalCard();
  }, [isOpen, config, activeTab]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(specText);
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2500);
  };

  const handleDownloadImage = () => {
    if (!cardDataUrl) return;
    const a = document.createElement('a');
    a.href = cardDataUrl;
    a.download = `frp-sheet-spec-${config.profile}-${config.widthMm}x${config.lengthMm}mm.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyImageToClipboard = async () => {
    if (!cardBlob) return;
    try {
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': cardBlob,
          }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.warn('Failed to copy image to clipboard:', err);
      handleDownloadImage();
    }
  };

  const handleShareImageFile = async () => {
    if (!cardBlob) return;
    const file = new File([cardBlob], `frp-sheet-spec-${config.profile}.png`, {
      type: 'image/png',
    });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `FRP Sheet Specification - ${config.profile.replace(/_/g, ' ')}`,
          text: `3D FRP Sheet Specification Card (${config.widthMm}mm x ${config.lengthMm}mm)`,
          files: [file],
        });
      } catch (err) {
        console.warn('File share cancelled or failed:', err);
      }
    } else if (navigator.share) {
      handleNativeShare();
    } else {
      handleDownloadImage();
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FRP Sheet Spec: ${config.profile.replace(/_/g, ' ')}`,
          text: `Check out this 3D FRP Sheet Specification: ${config.widthMm}mm x ${config.lengthMm}mm x ${config.thicknessMm}mm`,
          url: shareUrl,
        });
      } catch (err) {
        console.warn('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleMailto = () => {
    const subject = encodeURIComponent(`FRP Composite Sheet Specification - ${config.profile.replace(/_/g, ' ')}`);
    const body = encodeURIComponent(
      `Hello,\n\nPlease find the custom FRP sheet specification configuration below:\n\n${specText}\n\nView interactive 3D product model online:\n${shareUrl}\n\nBest regards.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareThermalImage = async () => {
    if (!thermalBlob) return;
    const file = new File([thermalBlob], `thermal-batch-slip-${config.profile}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Thermal Print Batch Slip - ${config.profile.replace(/_/g, ' ')}`,
          text: `Thermal Receipt Batch Slip Image (${config.widthMm}mm x ${config.lengthMm}mm)`,
          files: [file],
        });
      } catch (err) {
        console.warn('Thermal share cancelled:', err);
      }
    } else {
      handleDownloadThermalImage();
    }
  };

  const handleDownloadThermalImage = () => {
    if (!thermalDataUrl) return;
    const a = document.createElement('a');
    a.href = thermalDataUrl;
    a.download = `thermal-print-ticket-${config.profile}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyThermalImage = async () => {
    if (!thermalBlob) return;
    try {
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': thermalBlob }),
        ]);
        setCopiedThermalImage(true);
        setTimeout(() => setCopiedThermalImage(false), 2500);
      } else {
        handleDownloadThermalImage();
      }
    } catch (err) {
      handleDownloadThermalImage();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        ref={modalContainerRef}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Share 3D Product & Image Spec</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-md">
                  PNG & 3D Link
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Download spec card image, share 3D web link, or copy technical report
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-800 gap-1.5 sm:gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('image')}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'image'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Share Image Card</span>
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'link'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>3D Web Link</span>
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'summary'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Spec Summary Text</span>
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'email'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email & Print</span>
            </button>
            <button
              onClick={() => setActiveTab('thermal')}
              className={`pb-2 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'thermal'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Thermal Print Image</span>
            </button>
          </div>

          {/* Tab: Share Image Card */}
          {activeTab === 'image' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-950 p-2 sm:p-3 rounded-2xl border border-slate-800 relative group overflow-hidden">
                {isGeneratingImage ? (
                  <div className="h-48 sm:h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    <span className="text-xs font-mono">Generating high-res product spec image...</span>
                  </div>
                ) : cardDataUrl ? (
                  <div className="relative">
                    <img
                      src={cardDataUrl}
                      alt="FRP Sheet Specification Card"
                      className="w-full h-auto rounded-xl border border-slate-800 shadow-xl object-contain max-h-[340px]"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>1200 x 675 HD PNG Spec Card</span>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons for Image */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleDownloadImage}
                  disabled={!cardDataUrl}
                  className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 border border-amber-300 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>

                <button
                  onClick={handleCopyImageToClipboard}
                  disabled={!cardBlob}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border disabled:opacity-50 ${
                    copiedImage
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedImage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  <span>{copiedImage ? 'Image Copied!' : 'Copy to Clipboard'}</span>
                </button>

                <button
                  onClick={handleShareImageFile}
                  disabled={!cardBlob}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-blue-400 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via Device</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  This HD image card contains the 3D sheet render, dimensions, resin color, solar transmittance ratio, fiber reinforcement layers, and unit cost estimations ready to send via WhatsApp, email, or social media.
                </p>
              </div>
            </div>
          )}

          {/* Tab 1: Direct 3D Web Link */}
          {activeTab === 'link' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-slate-300 flex items-center justify-between">
                  <span>Direct Interactive 3D Model Link:</span>
                  <span className="text-[10px] text-amber-400 font-sans">Contains full dimension & material payload</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-cyan-300 select-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-lg ${
                      copiedLink
                        ? 'bg-emerald-600 text-white border border-emerald-400'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-300'
                    }`}
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {'share' in navigator && (
                <div className="pt-2">
                  <button
                    onClick={handleNativeShare}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Open Device Share Sheet (WhatsApp, Messages, AirDrop)</span>
                  </button>
                </div>
              )}

              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Anyone opening this link will view the exact same 3D sheet rendering, profile dimensions, solar light pass ratio, and structural load calculations instantly in their browser.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Spec Summary Text */}
          {activeTab === 'summary' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300">Technical Data Summary (RFQ / PO Format):</span>
                <button
                  onClick={handleCopySpec}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    copiedSpec
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                  }`}
                >
                  {copiedSpec ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSpec ? 'Copied Text!' : 'Copy Specification'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={10}
                value={specText}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 focus:outline-none select-all"
              />
            </div>
          )}

          {/* Tab 3: Email & Print */}
          {activeTab === 'email' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleMailto}
                  className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex flex-col items-start gap-2 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Send via Email
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Opens your default mail client with formatted specifications pre-filled.
                    </p>
                  </div>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex flex-col items-start gap-2 text-left transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Print Datasheet / PDF
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Print or save a formatted PDF technical certificate via browser print.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Thermal Print Image */}
          {activeTab === 'thermal' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-950 p-2 sm:p-3 rounded-2xl border border-slate-800 flex justify-center items-center relative group overflow-hidden">
                {thermalDataUrl ? (
                  <div className="relative max-h-[340px] overflow-y-auto">
                    <img
                      src={thermalDataUrl}
                      alt="Thermal Receipt Batch Slip"
                      className="w-auto h-auto max-h-[320px] rounded border border-slate-800 shadow-xl object-contain mx-auto"
                    />
                    <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>203 DPI Thermal POS Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                    <span className="text-xs font-mono">Generating thermal receipt ticket image...</span>
                  </div>
                )}
              </div>

              {/* Thermal Image Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleShareThermalImage}
                  disabled={!thermalBlob}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border border-blue-400 shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Thermal Image</span>
                </button>

                <button
                  onClick={handleCopyThermalImage}
                  disabled={!thermalBlob}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border disabled:opacity-50 cursor-pointer ${
                    copiedThermalImage
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedThermalImage ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  <span>{copiedThermalImage ? 'Thermal Image Copied!' : 'Copy to Clipboard'}</span>
                </button>

                <button
                  onClick={handleDownloadThermalImage}
                  disabled={!thermalDataUrl}
                  className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 border border-amber-300 disabled:opacity-50 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Ticket PNG</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-start gap-2 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Share high-density 203 DPI thermal print tickets containing exact batch chemical recipes, catalyst dosing, resin matrix mass, and pot life gel windows directly via device sharing or messaging apps.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">FRP Sheet Simulator 3D</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
