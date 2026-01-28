// src/components/layout/conditional-layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import LayoutWrapper from './layout-wrapper';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Si la ruta comienza con /login, no aplicar LayoutWrapper
  if (pathname.startsWith('/login')) {
    return <>{children}</>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
};

export default ConditionalLayout;