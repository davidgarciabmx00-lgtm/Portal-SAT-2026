// src/components/layout/conditional-layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import LayoutWrapper from './layout-wrapper';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Rutas públicas que no requieren layout con sidebar/topbar
  const publicPaths = ['/login', '/appointment'];

  // Si la ruta es pública, no aplicar LayoutWrapper
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return <>{children}</>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
};

export default ConditionalLayout;