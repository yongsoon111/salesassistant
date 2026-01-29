'use client';

import { Header } from '@/components/layout/header';
import { ScriptList } from '@/components/scripts/script-list';

export default function ScriptsPage() {
  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="스크립트 라이브러리"
        description="상황별 응대 스크립트를 관리하세요"
      />

      <div className="mt-6">
        <div className="max-w-4xl mx-auto">
          <ScriptList />
        </div>
      </div>
    </div>
  );
}
