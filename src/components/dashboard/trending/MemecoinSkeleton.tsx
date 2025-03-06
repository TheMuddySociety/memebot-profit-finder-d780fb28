
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export function MemecoinSkeleton() {
  return (
    <>
      {Array(5).fill(0).map((_, index) => (
        <tr key={index} className="border-b border-border">
          <td className="p-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </td>
          <td className="p-2 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
          <td className="p-2 text-right"><Skeleton className="h-4 w-14 ml-auto" /></td>
          <td className="p-2 text-right hidden md:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
          <td className="p-2 text-right hidden md:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
          <td className="p-2 text-right hidden lg:table-cell"><Skeleton className="h-4 w-20 ml-auto" /></td>
          <td className="p-2 text-center hidden lg:table-cell"><Skeleton className="h-6 w-24 mx-auto" /></td>
        </tr>
      ))}
    </>
  );
}
