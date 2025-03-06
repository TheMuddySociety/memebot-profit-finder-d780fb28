
import React from 'react';

interface MemecoinTableHeaderProps {
  onSort: (field: string) => void;
}

export function MemecoinTableHeader({ onSort }: MemecoinTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-border">
        <th className="p-2 text-left font-medium text-muted-foreground">Token</th>
        <th 
          className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
          onClick={() => onSort('price')}
        >
          Price
        </th>
        <th 
          className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground"
          onClick={() => onSort('change24h')}
        >
          24h %
        </th>
        <th
          className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell"
          onClick={() => onSort('volume24h')}
        >
          Volume
        </th>
        <th
          className="p-2 text-right font-medium text-muted-foreground cursor-pointer hover:text-foreground hidden md:table-cell"
          onClick={() => onSort('liquidity')}
        >
          Liquidity
        </th>
        <th
          className="p-2 text-right font-medium text-muted-foreground hidden lg:table-cell"
        >
          Holders
        </th>
        <th className="p-2 text-center font-medium text-muted-foreground hidden lg:table-cell">Tags</th>
      </tr>
    </thead>
  );
}
