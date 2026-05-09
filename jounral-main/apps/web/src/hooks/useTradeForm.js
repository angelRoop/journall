import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

const initialFormState = {
  tradeDate: format(new Date(), 'yyyy-MM-dd'),
  tradingSession: 'Opening',
  marketCondition: 'Trending',
  marketType: 'Equity',
  symbol: '',
  strikePrice: '',
  optionType: 'CE',
  expiryDate: '',
  direction: 'Buy',
  quantity: 1,
  entryPrice: 0,
  exitPrice: 0,
  partialExits: [],
  stopLoss: 0,
  target: 0,
  riskAmount: 0,
  brokerage: 0,
  charges: 0,
  customTags: [],
  entryScore: 5,
  exitScore: 5,
  followedPlan: false,
  earlyEntry: false,
  lateEntry: false,
  revengeTrade: false,
  fomoTrade: false,
  overtrading: false,
  emotionBefore: 'Neutral',
  emotionDuring: 'Neutral',
  emotionAfter: 'Neutral',
  emotionNotes: '',
  disciplineScore: 5,
  confidenceLevel: 5,
  stressLevel: 5,
  whyTradeTaken: '',
  whatWentRight: '',
  whatWentWrong: '',
  lessonsLearned: '',
  repeatableSetup: false,
  pointsCaptured: 'Flat',
  rulesFollowed: false,
};

export const useTradeForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [metrics, setMetrics] = useState({
    averageEntryPrice: 0,
    averageExitPrice: 0,
    grossPnL: 0,
    netPnL: 0,
    roi: 0,
    rMultiple: 0,
    riskRewardRatio: 0,
    tradeQualityScore: 0,
    winLossStatus: 'Flat'
  });

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user corrects the field
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const missingFields = [];

    if (!formData.symbol?.trim()) {
      newErrors.symbol = 'Symbol is required';
      missingFields.push('Symbol');
    }
    if (!formData.entryPrice || parseFloat(formData.entryPrice) <= 0) {
      newErrors.entryPrice = 'Valid Entry Price is required';
      missingFields.push('Entry Price');
    }
    if (!formData.direction) {
      newErrors.direction = 'Direction is required';
      missingFields.push('Direction');
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Valid Quantity is required';
      missingFields.push('Quantity');
    }
    if (!formData.tradingSession) {
      newErrors.tradingSession = 'Trading Session is required';
      missingFields.push('Trading Session');
    }
    if (!formData.marketCondition) {
      newErrors.marketCondition = 'Market Condition is required';
      missingFields.push('Market Condition');
    }
    if (!formData.marketType) {
      newErrors.marketType = 'Market Type is required';
      missingFields.push('Market Type');
    }

    setErrors(newErrors);
    return { 
      isValid: Object.keys(newErrors).length === 0, 
      missingFields 
    };
  }, [formData]);

  const addPartialExit = useCallback((exit) => {
    setFormData(prev => ({
      ...prev,
      partialExits: [...prev.partialExits, exit]
    }));
  }, []);

  const removePartialExit = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      partialExits: prev.partialExits.filter((_, i) => i !== index)
    }));
  }, []);

  const addCustomTag = useCallback((tag) => {
    setFormData(prev => ({
      ...prev,
      customTags: prev.customTags.includes(tag) ? prev.customTags : [...prev.customTags, tag]
    }));
  }, []);

  const removeTag = useCallback((tag) => {
    setFormData(prev => ({
      ...prev,
      customTags: prev.customTags.filter(t => t !== tag)
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
  }, []);

  const loadTemplate = useCallback((templateData) => {
    setFormData({ ...initialFormState, ...templateData });
    setErrors({});
  }, []);

  useEffect(() => {
    // Calculate metrics
    const entry = parseFloat(formData.entryPrice) || 0;
    const exit = parseFloat(formData.exitPrice) || 0;
    const qty = parseFloat(formData.quantity) || 0;
    const sl = parseFloat(formData.stopLoss) || 0;
    const tgt = parseFloat(formData.target) || 0;
    const risk = parseFloat(formData.riskAmount) || 0;
    const brk = parseFloat(formData.brokerage) || 0;
    const chg = parseFloat(formData.charges) || 0;

    let avgExit = exit;
    if (formData.partialExits.length > 0) {
      const totalExitValue = formData.partialExits.reduce((sum, pe) => sum + (parseFloat(pe.price) * parseFloat(pe.quantity)), 0) + (exit * qty);
      const totalExitQty = formData.partialExits.reduce((sum, pe) => sum + parseFloat(pe.quantity), 0) + qty;
      avgExit = totalExitQty > 0 ? totalExitValue / totalExitQty : exit;
    }

    const isBuy = formData.direction === 'Buy';
    const grossPnL = isBuy ? (avgExit - entry) * qty : (entry - avgExit) * qty;
    const netPnL = grossPnL - brk - chg;
    
    const investment = entry * qty;
    const roi = investment > 0 ? (netPnL / investment) * 100 : 0;
    
    const rMultiple = risk > 0 ? netPnL / risk : 0;
    
    const riskPerShare = Math.abs(entry - sl);
    const rewardPerShare = Math.abs(tgt - entry);
    const riskRewardRatio = riskPerShare > 0 ? rewardPerShare / riskPerShare : 0;

    const qualityScore = ((formData.entryScore + formData.exitScore) / 20) * 100 + (formData.followedPlan ? 10 : 0);
    const clampedQuality = Math.min(Math.max(qualityScore, 0), 100);

    let status = 'Flat';
    if (netPnL > 0) status = 'Win';
    else if (netPnL < 0) status = 'Loss';

    setMetrics({
      averageEntryPrice: entry,
      averageExitPrice: avgExit,
      grossPnL,
      netPnL,
      roi,
      rMultiple,
      riskRewardRatio,
      tradeQualityScore: clampedQuality,
      winLossStatus: status
    });
  }, [formData]);

  return {
    formData,
    errors,
    metrics,
    updateField,
    validateForm,
    addPartialExit,
    removePartialExit,
    addCustomTag,
    removeTag,
    resetForm,
    loadTemplate
  };
};