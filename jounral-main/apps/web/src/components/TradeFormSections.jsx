import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export const BasicDetailsSection = ({ formData, updateField, errors = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label>Trade Date</Label>
      <Input type="date" value={formData.tradeDate} onChange={(e) => updateField('tradeDate', e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Trading Session <span className="text-destructive">*</span></Label>
      <Select value={formData.tradingSession} onValueChange={(v) => updateField('tradingSession', v)}>
        <SelectTrigger className={errors.tradingSession ? 'border-destructive' : ''}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Opening">Opening</SelectItem>
          <SelectItem value="Mid-day">Mid-day</SelectItem>
          <SelectItem value="Closing">Closing</SelectItem>
          <SelectItem value="After-hours">After-hours</SelectItem>
        </SelectContent>
      </Select>
      {errors.tradingSession && <p className="text-sm text-destructive">{errors.tradingSession}</p>}
    </div>
    <div className="space-y-2">
      <Label>Market Condition <span className="text-destructive">*</span></Label>
      <Select value={formData.marketCondition} onValueChange={(v) => updateField('marketCondition', v)}>
        <SelectTrigger className={errors.marketCondition ? 'border-destructive' : ''}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Trending">Trending</SelectItem>
          <SelectItem value="Range-bound">Range-bound</SelectItem>
          <SelectItem value="Gap Up">Gap Up</SelectItem>
          <SelectItem value="Gap Down">Gap Down</SelectItem>
          <SelectItem value="Volatile">Volatile</SelectItem>
        </SelectContent>
      </Select>
      {errors.marketCondition && <p className="text-sm text-destructive">{errors.marketCondition}</p>}
    </div>
  </div>
);

export const InstrumentDetailsSection = ({ formData, updateField, errors = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label>Market Type <span className="text-destructive">*</span></Label>
      <Select value={formData.marketType} onValueChange={(v) => updateField('marketType', v)}>
        <SelectTrigger className={errors.marketType ? 'border-destructive' : ''}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Equity">Equity</SelectItem>
          <SelectItem value="Options">Options</SelectItem>
          <SelectItem value="Futures">Futures</SelectItem>
          <SelectItem value="Crypto">Crypto</SelectItem>
        </SelectContent>
      </Select>
      {errors.marketType && <p className="text-sm text-destructive">{errors.marketType}</p>}
    </div>
    <div className="space-y-2">
      <Label>Symbol <span className="text-destructive">*</span></Label>
      <Select value={formData.symbol} onValueChange={(v) => updateField('symbol', v)}>
        <SelectTrigger className={errors.symbol ? 'border-destructive' : ''}>
          <SelectValue placeholder="Select symbol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="SENSEX">SENSEX</SelectItem>
          <SelectItem value="N50">N50</SelectItem>
          <SelectItem value="BANKNIFTY">BANKNIFTY</SelectItem>
        </SelectContent>
      </Select>
      {errors.symbol && <p className="text-sm text-destructive">{errors.symbol}</p>}
    </div>
    {formData.marketType === 'Options' && (
      <>
        <div className="space-y-2">
          <Label>Strike Price</Label>
          <Input type="number" value={formData.strikePrice} onChange={(e) => updateField('strikePrice', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Option Type</Label>
          <Select value={formData.optionType} onValueChange={(v) => updateField('optionType', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="CE">Call (CE)</SelectItem>
              <SelectItem value="PE">Put (PE)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </>
    )}
  </div>
);

export const PositionDetailsSection = ({ formData, updateField, errors = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label>Direction <span className="text-destructive">*</span></Label>
      <RadioGroup value={formData.direction} onValueChange={(v) => updateField('direction', v)} className="flex gap-4">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Buy" id="buy" />
          <Label htmlFor="buy">Buy / Long</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Sell" id="sell" />
          <Label htmlFor="sell">Sell / Short</Label>
        </div>
      </RadioGroup>
      {errors.direction && <p className="text-sm text-destructive">{errors.direction}</p>}
    </div>
    <div className="space-y-2">
      <Label>Quantity <span className="text-destructive">*</span></Label>
      <Input 
        type="number" 
        value={formData.quantity} 
        onChange={(e) => updateField('quantity', e.target.value)} 
        className={errors.quantity ? 'border-destructive' : ''}
      />
      {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
    </div>
    <div className="space-y-2">
      <Label>Entry Price <span className="text-destructive">*</span></Label>
      <Input 
        type="number" 
        step="0.01" 
        value={formData.entryPrice} 
        onChange={(e) => updateField('entryPrice', e.target.value)} 
        className={errors.entryPrice ? 'border-destructive' : ''}
      />
      {errors.entryPrice && <p className="text-sm text-destructive">{errors.entryPrice}</p>}
    </div>
    <div className="space-y-2">
      <Label>Exit Price</Label>
      <Input type="number" step="0.01" value={formData.exitPrice} onChange={(e) => updateField('exitPrice', e.target.value)} />
    </div>
  </div>
);

export const RiskManagementSection = ({ formData, updateField }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="space-y-2">
      <Label>Stop Loss</Label>
      <Input type="number" step="0.01" value={formData.stopLoss} onChange={(e) => updateField('stopLoss', e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Target</Label>
      <Input type="number" step="0.01" value={formData.target} onChange={(e) => updateField('target', e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Risk Amount ($)</Label>
      <Input type="number" step="0.01" value={formData.riskAmount} onChange={(e) => updateField('riskAmount', e.target.value)} />
    </div>
  </div>
);

export const StrategyTagsSection = ({ formData, addCustomTag, removeTag }) => {
  const predefined = ['Breakout', 'Pullback', 'Reversal', 'VWAP', 'Scalping', 'Price Action'];
  return (
    <div className="space-y-4">
      <Label>Strategy Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2">
        {formData.customTags.map(tag => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag} <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {predefined.map(tag => (
          <Badge 
            key={tag} 
            variant="outline" 
            className="cursor-pointer hover:bg-secondary"
            onClick={() => addCustomTag(tag)}
          >
            + {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export const ExecutionQualitySection = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Label>Entry Score ({formData.entryScore}/10)</Label>
        <Slider value={[formData.entryScore]} max={10} step={1} onValueChange={([v]) => updateField('entryScore', v)} />
      </div>
      <div className="space-y-4">
        <Label>Exit Score ({formData.exitScore}/10)</Label>
        <Slider value={[formData.exitScore]} max={10} step={1} onValueChange={([v]) => updateField('exitScore', v)} />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="followedPlan" checked={formData.followedPlan} onCheckedChange={(c) => updateField('followedPlan', c)} />
        <Label htmlFor="followedPlan">Followed Plan</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="fomoTrade" checked={formData.fomoTrade} onCheckedChange={(c) => updateField('fomoTrade', c)} />
        <Label htmlFor="fomoTrade">FOMO Trade</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="revengeTrade" checked={formData.revengeTrade} onCheckedChange={(c) => updateField('revengeTrade', c)} />
        <Label htmlFor="revengeTrade">Revenge Trade</Label>
      </div>
    </div>
  </div>
);

export const TradeValidationSection = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Label>Was your direction correct?</Label>
        <RadioGroup value={formData.directionCorrect === null ? '' : formData.directionCorrect ? 'yes' : 'no'} onValueChange={(v) => updateField('directionCorrect', v === 'yes' ? true : v === 'no' ? false : null)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="directionYes" />
            <Label htmlFor="directionYes" className="cursor-pointer font-normal">✓ Correct - Direction was right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="directionNo" />
            <Label htmlFor="directionNo" className="cursor-pointer font-normal">✗ Wrong - Direction was incorrect</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="partial" id="directionPartial" />
            <Label htmlFor="directionPartial" className="cursor-pointer font-normal">~ Partial - Partially correct</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label>Was your analysis correct?</Label>
        <RadioGroup value={formData.analysisCorrect === null ? '' : formData.analysisCorrect ? 'yes' : 'no'} onValueChange={(v) => updateField('analysisCorrect', v === 'yes' ? true : v === 'no' ? false : null)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="analysisYes" />
            <Label htmlFor="analysisYes" className="cursor-pointer font-normal">✓ Correct - Analysis was right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="analysisNo" />
            <Label htmlFor="analysisNo" className="cursor-pointer font-normal">✗ Wrong - Analysis was incorrect</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="partial" id="analysisPartial" />
            <Label htmlFor="analysisPartial" className="cursor-pointer font-normal">~ Partial - Partially correct</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  </div>
);

export const PsychologySection = ({ formData, updateField }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Emotion Before</Label>
        <Select value={formData.emotionBefore} onValueChange={(v) => updateField('emotionBefore', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['Fear', 'Greed', 'Confidence', 'Frustration', 'Neutral', 'Excitement'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Emotion During</Label>
        <Select value={formData.emotionDuring} onValueChange={(v) => updateField('emotionDuring', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['Fear', 'Greed', 'Confidence', 'Frustration', 'Neutral', 'Excitement'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Emotion After</Label>
        <Select value={formData.emotionAfter} onValueChange={(v) => updateField('emotionAfter', v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['Fear', 'Greed', 'Confidence', 'Frustration', 'Neutral', 'Excitement'].map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <Label>Discipline ({formData.disciplineScore}/10)</Label>
        <Slider value={[formData.disciplineScore]} max={10} step={1} onValueChange={([v]) => updateField('disciplineScore', v)} />
      </div>
      <div className="space-y-4">
        <Label>Confidence ({formData.confidenceLevel}/10)</Label>
        <Slider value={[formData.confidenceLevel]} max={10} step={1} onValueChange={([v]) => updateField('confidenceLevel', v)} />
      </div>
      <div className="space-y-4">
        <Label>Stress ({formData.stressLevel}/10)</Label>
        <Slider value={[formData.stressLevel]} max={10} step={1} onValueChange={([v]) => updateField('stressLevel', v)} />
      </div>
    </div>
  </div>
);

export const TradeReviewSection = ({ formData, updateField }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Why was this trade taken?</Label>
      <Textarea value={formData.whyTradeTaken} onChange={(e) => updateField('whyTradeTaken', e.target.value)} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>What went right?</Label>
        <Textarea value={formData.whatWentRight} onChange={(e) => updateField('whatWentRight', e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>What went wrong?</Label>
        <Textarea value={formData.whatWentWrong} onChange={(e) => updateField('whatWentWrong', e.target.value)} />
      </div>
    </div>
  </div>
);