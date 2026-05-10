import { supabase } from '@/lib/supabaseClient.js';

const LOCAL_USER = {
  id: 'local-user',
  name: 'Local Trader',
  email: 'local@tradejournal.com',
};

const tradeFields = [
  'id',
  'tradeDate',
  'tradingSession',
  'marketCondition',
  'marketType',
  'symbol',
  'strikePrice',
  'optionType',
  'expiryDate',
  'direction',
  'directionCorrect',
  'analysisCorrect',
  'quantity',
  'entryPrice',
  'exitPrice',
  'partialExits',
  'stopLoss',
  'target',
  'riskAmount',
  'brokerage',
  'charges',
  'customTags',
  'entryScore',
  'exitScore',
  'followedPlan',
  'earlyEntry',
  'lateEntry',
  'revengeTrade',
  'fomoTrade',
  'overtrading',
  'emotionBefore',
  'emotionDuring',
  'emotionAfter',
  'emotionNotes',
  'disciplineScore',
  'confidenceLevel',
  'stressLevel',
  'whyTradeTaken',
  'whatWentRight',
  'whatWentWrong',
  'lessonsLearned',
  'repeatableSetup',
  'pointsCaptured',
  'rulesFollowed',
  'averageEntryPrice',
  'averageExitPrice',
  'grossPnL',
  'netPnL',
  'roi',
  'rMultiple',
  'riskRewardRatio',
  'tradeQualityScore',
  'winLossStatus',
  'userId',
  'beforeEntryImage',
  'duringTradeImage',
  'exitImage',
  'createdAt',
  'updatedAt',
];

const clientToDbMap = Object.fromEntries(tradeFields.map((key) => [key, key.toLowerCase()]));
const dbToClientMap = Object.fromEntries(tradeFields.map((key) => [key.toLowerCase(), key]));

const mapTradeKeys = (trade, map) =>
  Object.fromEntries(
    Object.entries(trade || {}).map(([key, value]) => [map[key] ?? key, value])
  );

const toDbTrade = (trade) => mapTradeKeys(trade, clientToDbMap);
const toClientTrade = (trade) => mapTradeKeys(trade, dbToClientMap);

const tagFields = ['id', 'name', 'createdAt'];
const templateFields = ['id', 'templateName', 'templateData', 'createdAt', 'updatedAt'];

const tagClientToDbMap = Object.fromEntries(tagFields.map((key) => [key, key.toLowerCase()]));
const tagDbToClientMap = Object.fromEntries(tagFields.map((key) => [key.toLowerCase(), key]));

const templateClientToDbMap = Object.fromEntries(templateFields.map((key) => [key, key.toLowerCase()]));
const templateDbToClientMap = Object.fromEntries(templateFields.map((key) => [key.toLowerCase(), key]));

const toDbRow = (row, map) => mapTradeKeys(row, map);
const toClientRow = (row, map) => mapTradeKeys(row, map);

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const createId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normalizeTimestamp = (value, fallback = new Date().toISOString()) => {
  if (!value) return fallback;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed.toISOString();
};

const numericFields = [
  'strikePrice',
  'quantity',
  'entryPrice',
  'exitPrice',
  'stopLoss',
  'target',
  'riskAmount',
  'brokerage',
  'charges',
  'entryScore',
  'exitScore',
  'disciplineScore',
  'confidenceLevel',
  'stressLevel',
  'averageEntryPrice',
  'averageExitPrice',
  'grossPnL',
  'netPnL',
  'roi',
  'rMultiple',
  'riskRewardRatio',
  'tradeQualityScore',
];

const normalizeNumeric = (value) => {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeTrade = (tradeData) => {
  const normalized = {
    ...tradeData,
    id: tradeData.id || createId(),
    createdAt: normalizeTimestamp(tradeData.createdAt),
    updatedAt: new Date().toISOString(),
    tradeDate: normalizeTimestamp(tradeData.tradeDate),
    expiryDate: tradeData.expiryDate ? normalizeTimestamp(tradeData.expiryDate, null) : null,
    customTags: Array.isArray(tradeData.customTags) ? tradeData.customTags : [],
  };

  numericFields.forEach((field) => {
    if (field in normalized) {
      normalized[field] = normalizeNumeric(normalized[field]);
    }
  });

  return normalized;
};

const handleSupabaseError = (error) => {
  if (error) {
    throw new Error(error.message || 'Supabase request failed');
  }
};

export const getMe = async () => ({ user: LOCAL_USER });
export const login = async () => ({ user: LOCAL_USER });
export const signup = async () => ({ user: LOCAL_USER });

export const fetchTrades = async () => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('createdat', { ascending: false });

  handleSupabaseError(error);
  return (data || []).map(toClientTrade);
};

export const getTrade = async (tradeId) => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('id', tradeId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data ? toClientTrade(data) : null;
};

export const createTrade = async (tradeData) => {
  const trade = toDbTrade(normalizeTrade(tradeData));
  const { data, error } = await supabase.from('trades').insert([trade]).select().single();
  handleSupabaseError(error);
  return toClientTrade(data);
};

export const updateTrade = async (tradeId, tradeData) => {
  const { data: existing, error: fetchError } = await supabase
    .from('trades')
    .select('*')
    .eq('id', tradeId)
    .single();

  if (fetchError) {
    throw new Error('Trade not found');
  }

  const updated = {
    ...toClientTrade(existing),
    ...tradeData,
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('trades')
    .update(toDbTrade(updated))
    .eq('id', tradeId)
    .select()
    .single();

  handleSupabaseError(error);
  return toClientTrade(data);
};

export const deleteTrade = async (tradeId) => {
  const { error } = await supabase.from('trades').delete().eq('id', tradeId);
  handleSupabaseError(error);
  return { message: 'Trade deleted' };
};

export const fetchTags = async () => {
  const { data, error } = await supabase.from('tags').select('*').order('name', { ascending: true });
  handleSupabaseError(error);
  return (data || []).map((row) => toClientRow(row, tagDbToClientMap));
};

export const createTag = async (name) => {
  const normalized = name.trim();
  if (!normalized) {
    throw new Error('Tag name is required');
  }

  const { data: existing, error: fetchError } = await supabase
    .from('tags')
    .select('*')
    .eq('name', normalized)
    .single();

  if (existing) {
    return toClientRow(existing, tagDbToClientMap);
  }

  const { data, error } = await supabase
    .from('tags')
    .insert([
      toDbRow({
        id: createId(),
        name: normalized,
        createdAt: new Date().toISOString(),
      }, tagClientToDbMap),
    ])
    .select()
    .single();

  handleSupabaseError(error);
  return toClientRow(data, tagDbToClientMap);
};

export const deleteTag = async (tagId) => {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId);

  handleSupabaseError(error);
  return { message: 'Tag deleted successfully' };
};

export const saveTemplate = async (templateName, templateData) => {
  if (!templateName?.trim() || !templateData) {
    throw new Error('Template name and data are required');
  }

  const { data, error } = await supabase
    .from('templates')
    .insert([
      toDbRow({
        id: createId(),
        templateName: templateName.trim(),
        templateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, templateClientToDbMap),
    ])
    .select()
    .single();

  handleSupabaseError(error);
  return toClientRow(data, templateDbToClientMap);
};

export const uploadTradeImages = async (tradeId, files) => {
  const { data: existing, error: fetchError } = await supabase
    .from('trades')
    .select('*')
    .eq('id', tradeId)
    .single();

  if (fetchError) {
    throw new Error('Trade not found');
  }

  const updates = {};
  for (const [field, file] of Object.entries(files)) {
    if (file) {
      updates[field] = await fileToDataUrl(file);
    }
  }

  const updated = {
    ...toClientTrade(existing),
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('trades')
    .update(toDbTrade(updated))
    .eq('id', tradeId)
    .select()
    .single();

  handleSupabaseError(error);
  return toClientTrade(data);
};
