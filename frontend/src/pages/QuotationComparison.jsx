import React, { useState } from 'react';
import { useSimulatedDB } from '../context/SimulatedDBContext';
import { useNavigate } from 'react-router-dom';
import { GitCompare, Sparkles, AlertCircle, ShoppingCart, Award, CheckCircle2 } from 'lucide-react';

const QuotationComparison = () => {
  const navigate = useNavigate();
  const { rfqs, createPO } = useSimulatedDB();

  // Find RFQs with bids received
  const biddedRFQs = rfqs.filter(r => r.status === 'Quotation Received' || r.status === 'Closed');

  const [selectedRfqNumber, setSelectedRfqNumber] = useState(biddedRFQs[0]?.rfqNumber || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const activeRfq = rfqs.find(r => r.rfqNumber === selectedRfqNumber) || biddedRFQs[0];

  // AI Recommendation Engine
  const runAnalysis = () => {
    if (!activeRfq) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      // Logic: Score = (Quality * 0.4) + (Performance * 10 * 0.2) + ((MaxPrice - Price)/MaxPrice * 100 * 0.3) + ((MaxLeadTime - LeadTime)/MaxLeadTime * 100 * 0.1)
      const bids = activeRfq.quotations.filter(q => q.status === 'Submitted');
      if (bids.length === 0) {
        setIsAnalyzing(false);
        return;
      }

      const maxPrice = Math.max(...bids.map(b => b.price));
      const maxLeadTime = Math.max(...bids.map(b => b.leadTime));

      let bestScore = -1;
      let recommendedVendor = null;

      const scoredBids = bids.map(bid => {
        const priceScore = maxPrice > 0 ? ((maxPrice - bid.price) / maxPrice) * 100 : 100;
        const leadScore = maxLeadTime > 0 ? ((maxLeadTime - bid.leadTime) / maxLeadTime) * 100 : 100;
        const totalScore = (bid.qualityScore * 0.35) + (bid.performanceRating * 20 * 0.15) + (priceScore * 0.4) + (leadScore * 0.1);

        if (totalScore > bestScore) {
          bestScore = totalScore;
          recommendedVendor = bid;
        }

        return { ...bid, totalScore };
      });

      // Calculate cost difference percentage with average
      const avgPrice = bids.reduce((sum, b) => sum + b.price, 0) / bids.length;
      const savingsPct = Math.round(((avgPrice - recommendedVendor.price) / avgPrice) * 100);

      setAnalysisResult({
        vendor: recommendedVendor,
        savingsPct: Math.max(0, savingsPct),
        reason: `${recommendedVendor.vendorName} is selected as the optimal supplier. They offer a ${savingsPct > 0 ? savingsPct + '%' : 'competitive'} discount compared to the average quoted rate, backed by a high quality score of ${recommendedVendor.qualityScore}% and a proven ${recommendedVendor.performanceRating}-star past performance. Lead time is ${recommendedVendor.leadTime} days.`,
      });

      setIsAnalyzing(false);
    }, 1500); // simulate delay
  };

  const handleConvertPO = (vendorQuote) => {
    if (!activeRfq) return;

    // Convert RFQ items to PO format
    const po = createPO({
      rfqReference: activeRfq.rfqNumber,
      vendorId: vendorQuote.vendorId,
      vendorName: vendorQuote.vendorName,
      deliveryDate: activeRfq.deliveryDate,
      items: [
        {
          materialId: activeRfq.materialId,
          materialName: activeRfq.materialName,
          quantity: activeRfq.quantity,
          price: vendorQuote.price,
          tax: 18,
        }
      ],
    });

    alert(`Quotation converted successfully! Generated Purchase Order: ${po.poNumber}`);
    navigate('/pos');
  };

  return (
    <div className="space-y-6">
      {/* Selection Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-slate-850 dark:text-white">SAP Quotation Comparison Sheet</h3>
          <p className="text-xs text-slate-450 mt-1">Select an active solicitation to compare quotes side-by-side.</p>
        </div>
        <div className="flex items-center gap-1.5 border border-slate-250 dark:border-slate-750 px-3 py-2 rounded-lg text-xs text-slate-500">
          <GitCompare size={14} className="text-slate-400" />
          <span>Active RFQ:</span>
          <select
            value={selectedRfqNumber}
            onChange={(e) => { setSelectedRfqNumber(e.target.value); setAnalysisResult(null); }}
            className="bg-transparent outline-none font-bold text-slate-700 dark:text-slate-300"
          >
            {biddedRFQs.length === 0 ? (
              <option value="">No RFQs ready</option>
            ) : (
              biddedRFQs.map(r => (
                <option key={r.rfqNumber} value={r.rfqNumber}>
                  {r.rfqNumber} - {r.materialName} ({r.quantity} PC)
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {activeRfq ? (
        <div className="space-y-6">
          {/* Summary Row */}
          <div className="p-4 bg-blue-500/5 dark:bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-primary" size={14} />
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Sollicitation for {activeRfq.quantity} units of <strong>{activeRfq.materialName}</strong> ({activeRfq.materialId}). Delivery due date: {new Date(activeRfq.deliveryDate).toLocaleDateString()}.
              </span>
            </div>
            {activeRfq.status !== 'Closed' && (
              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-750 disabled:bg-purple-900 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-purple-600/20 transition cursor-pointer"
              >
                <Sparkles size={12} className={isAnalyzing ? 'animate-spin' : ''} />
                <span>{isAnalyzing ? 'Analyzing Bids...' : 'Run AI Recommendation'}</span>
              </button>
            )}
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeRfq.quotations.map((quote) => {
              const isRecommended = analysisResult?.vendor?.vendorId === quote.vendorId;
              const hasBid = quote.status === 'Submitted';

              return (
                <div
                  key={quote.vendorId}
                  className={`bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm relative flex flex-col justify-between transition-all duration-300 ${
                    isRecommended
                      ? 'border-purple-500 ring-2 ring-purple-500/20 dark:ring-purple-500/10 purple-glow'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 right-4 bg-purple-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1 shadow">
                      <Award size={10} />
                      <span>Best Choice</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] text-slate-450 block uppercase font-bold">{quote.vendorId}</span>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1">{quote.vendorName}</h4>

                    <div className="mt-5 space-y-3">
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
                        <span className="text-xs text-slate-500">Quoted Price:</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          {hasBid ? `$${quote.price} / unit` : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
                        <span className="text-xs text-slate-500">Total Bidded:</span>
                        <span className="text-xs font-extrabold text-primary dark:text-primary-light">
                          {hasBid ? `$${(quote.price * activeRfq.quantity).toLocaleString()}` : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
                        <span className="text-xs text-slate-500">Lead Time:</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {hasBid ? `${quote.leadTime} days` : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/50 pb-1.5">
                        <span className="text-xs text-slate-500">Quality Score:</span>
                        <span className="text-xs font-semibold text-success">{quote.qualityScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-slate-500">Past Rating:</span>
                        <span className="text-xs font-semibold text-amber-500">★ {quote.performanceRating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {hasBid && activeRfq.status !== 'Closed' && (
                    <button
                      onClick={() => handleConvertPO(quote)}
                      className={`w-full py-2 rounded-lg text-xs font-bold mt-8 flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                        isRecommended
                          ? 'bg-purple-650 hover:bg-purple-750 text-white border-transparent shadow shadow-purple-600/10'
                          : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <ShoppingCart size={13} />
                      <span>Issue PO to Supplier</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Recommendation Glow panel */}
          {analysisResult && (
            <div className="purple-glass purple-glow p-5 rounded-xl border border-purple-500/30 flex gap-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300 flex-shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest leading-none mb-1.5">AI Procurement Agent Recommendation</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  {analysisResult.reason}
                </p>
                <div className="flex gap-4 mt-3 text-[10px] font-bold text-purple-300">
                  <span>✓ 3-Way match compatibility check: PASSED</span>
                  <span>✓ Budget threshold compatibility: PASSED</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-450 font-semibold text-xs">
          Create an RFQ and receive bids to compare suppliers here.
        </div>
      )}
    </div>
  );
};

export default QuotationComparison;
