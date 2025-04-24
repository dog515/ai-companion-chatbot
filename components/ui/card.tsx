// components/ui/card.tsx
import React from 'react';

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="border rounded-lg shadow-sm bg-white">{children}</div>;
}

export function CardContent({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}


