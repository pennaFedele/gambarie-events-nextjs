'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MaintenancePage } from '@/components/MaintenancePage';

function MaintenanceContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message') || 'Stiamo lavorando per Voi. App in aggiornamento';
  const adminButtonText = searchParams.get('adminButtonText') || 'Sei admin? Accedi';

  return (
    <MaintenancePage 
      message={message}
      adminButtonText={adminButtonText}
    />
  );
}

export default function Maintenance() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaintenanceContent />
    </Suspense>
  );
}