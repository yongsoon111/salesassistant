'use client';

import { useStages } from '@/hooks';
import { Card, CardContent, Badge } from '@/components/ui';

export function StageList() {
  const { stages, isLoading } = useStages();

  if (isLoading) {
    return <div className="p-4 text-center text-muted-foreground">단계 로딩 중...</div>;
  }

  if (stages.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        등록된 세일즈 단계가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stages.map((stage) => (
        <Card key={stage.id} className="hover:bg-accent/30 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                {stage.order}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-lg">{stage.name}</h4>
                  {!stage.isActive && (
                    <Badge variant="outline" className="text-muted-foreground">
                      비활성
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <p className="text-xs text-primary font-medium mb-1">🎯 목표 인식</p>
                    <p className="text-sm">{stage.targetPerception}</p>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-1">🤖 AI 지시</p>
                    <p className="text-sm">{stage.aiInstruction}</p>
                  </div>

                  {stage.keyQuestions && (
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-xs text-blue-400 font-medium mb-1">❓ 핵심 질문</p>
                      <p className="text-sm">{stage.keyQuestions}</p>
                    </div>
                  )}

                  {stage.transitionSignals && (
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <p className="text-xs text-green-400 font-medium mb-1">✅ 전환 신호</p>
                      <p className="text-sm">{stage.transitionSignals}</p>
                    </div>
                  )}

                  {stage.warnings && (
                    <div className="p-3 bg-yellow-500/10 rounded-lg">
                      <p className="text-xs text-yellow-400 font-medium mb-1">⚠️ 주의사항</p>
                      <p className="text-sm">{stage.warnings}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
