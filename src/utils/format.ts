
export const formatNumber = (num: number) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

export const formatPercentage = (num: number) => {
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

export const formatCompactNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(num);
};
