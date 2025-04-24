// components/ui/tabs.tsx
import React, { useState } from 'react';

export function Tabs({
  defaultValue,
  onValueChange,
  children,
}: {
  defaultValue: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <div data-tabs-root data-value={value}>
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, {
          activeValue: value,
          onTabChange: handleChange,
        })
      )}
    </div>
  );
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`flex gap-2 ${className}`}>{children}</div>;
}

export function TabsTrigger({
  value,
  children,
  activeValue,
  onTabChange,
}: {
  value: string;
  children: React.ReactNode;
  activeValue?: string;
  onTabChange?: (value: string) => void;
}) {
  const isActive = value === activeValue;
  return (
    <button
      className={`px-4 py-2 rounded-md border ${
        isActive ? 'bg-blue-600 text-white' : 'bg-white text-black border-gray-300'
      }`}
      onClick={() => onTabChange?.(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  activeValue,
}: {
  value: string;
  children: React.ReactNode;
  activeValue?: string;
}) {
  return value === activeValue ? <div>{children}</div> : null;
}
