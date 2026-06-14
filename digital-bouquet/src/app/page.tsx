import { Suspense } from 'react';
import HomeClient from '@/components/HomeClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="app-loading">Opening your letter...</div>}>
      <HomeClient />
    </Suspense>
  );
}
