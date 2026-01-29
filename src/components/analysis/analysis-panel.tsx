'use client';

import { Card, CardHeader, CardTitle, CardContent, Badge, CopyButton } from '@/components/ui';
import type { AnalysisResult } from '@/types';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
  isLoading: boolean;
}

export function AnalysisPanel({ analysis, isLoading }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          대화를 입력하고 분석하기 버튼을 눌러주세요
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 현재 단계 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            📊 현재 단계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-base px-3 py-1">
              {analysis.currentStageOrder}. {analysis.currentStageName}
            </Badge>
            {analysis.canAdvance && analysis.nextStageName && (
              <span className="text-sm text-green-500">
                → {analysis.nextStageName}으로 전환 가능
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {analysis.stageStrategy}
          </p>
        </CardContent>
      </Card>

      {/* 고객 감정 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            💭 고객 감정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground">{analysis.customerEmotion}</p>
          {analysis.hiddenNeeds && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">숨은 니즈:</p>
              <p className="text-sm">{analysis.hiddenNeeds}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 추천 응답 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            💬 추천 응답
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {analysis.suggestedResponses.map((response, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <Badge variant="outline" className="mb-2">
                    {response.type}
                  </Badge>
                  <p className="text-foreground">{response.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {response.explanation}
                  </p>
                </div>
                <CopyButton text={response.text} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 제안 질문 */}
      {analysis.suggestedQuestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              ❓ 제안 질문
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analysis.suggestedQuestions.map((question, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded bg-muted/30"
              >
                <span className="text-sm">{question}</span>
                <CopyButton text={question} className="h-8" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 경고사항 */}
      {analysis.warnings.length > 0 && (
        <Card className="border-yellow-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-yellow-500">
              ⚠️ 주의사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {analysis.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-500/80">
                  • {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
