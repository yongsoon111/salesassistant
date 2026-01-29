'use client';

import { Header } from '@/components/layout/header';
import { MaterialList } from '@/components/materials/material-list';

export default function MaterialsPage() {
  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="자료실"
        description="포트폴리오, 가격표, 사례 등 세일즈 자료를 관리하세요"
      />

      <div className="mt-6">
        <div className="max-w-4xl mx-auto">
          <MaterialList />
        </div>
      </div>
    </div>
  );
}
