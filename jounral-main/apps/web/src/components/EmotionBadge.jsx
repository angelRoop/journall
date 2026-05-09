import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Target, AlertCircle, Minus } from 'lucide-react';

const EmotionBadge = ({ emotion }) => {
  const getEmotionConfig = (emotion) => {
    const configs = {
      'Confident': { icon: Smile, color: 'bg-green-100 text-green-700 hover:bg-green-100' },
      'Anxious': { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' },
      'Disciplined': { icon: Target, color: 'bg-blue-100 text-blue-700 hover:bg-blue-100' },
      'Frustrated': { icon: Frown, color: 'bg-red-100 text-red-700 hover:bg-red-100' },
      'Neutral': { icon: Minus, color: 'bg-gray-100 text-gray-700 hover:bg-gray-100' },
    };
    return configs[emotion] || { icon: Minus, color: 'bg-gray-100 text-gray-700 hover:bg-gray-100' };
  };

  const config = getEmotionConfig(emotion);
  const Icon = config.icon;

  return (
    <Badge variant="secondary" className={`${config.color} text-xs font-medium gap-1`}>
      <Icon className="w-3 h-3" />
      {emotion}
    </Badge>
  );
};

export default EmotionBadge;