import React from 'react';
import { Badge } from '@/components/ui/badge';

const TagBadge = ({ tag }) => {
  const getTagColor = (tag) => {
    const colors = {
      'Scalping': 'bg-blue-100 text-blue-700 hover:bg-blue-100',
      'Swing': 'bg-purple-100 text-purple-700 hover:bg-purple-100',
      'Day Trading': 'bg-orange-100 text-orange-700 hover:bg-orange-100',
      'Position': 'bg-green-100 text-green-700 hover:bg-green-100',
      'Breakout': 'bg-red-100 text-red-700 hover:bg-red-100',
      'Reversal': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      'Support/Resistance': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100',
      'Technical': 'bg-teal-100 text-teal-700 hover:bg-teal-100',
      'Fundamental': 'bg-pink-100 text-pink-700 hover:bg-pink-100',
    };
    return colors[tag] || 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  };

  return (
    <Badge variant="secondary" className={`${getTagColor(tag)} text-xs font-medium`}>
      {tag}
    </Badge>
  );
};

export default TagBadge;