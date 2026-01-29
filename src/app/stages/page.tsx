'use client';

import { Header } from '@/components/layout/header';
import { StageList } from '@/components/stages/stage-list';

export default function StagesPage() {
  return (
    <div className="h-full p-6 lg:p-8 overflow-auto">
      <Header
        title="세일즈 단계"
        description="세일즈 프로세스의 각 단계별 목표와 전략을 관리하세요"
      />

      <div className="mt-6">
        <div className="max-w-4xl mx-auto">
          <StageList />
        </div>
      </div>
    </div>
  );
}
