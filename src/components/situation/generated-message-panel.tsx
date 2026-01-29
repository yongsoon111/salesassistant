'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';
import type { SituationMessageResult } from '@/hooks/useSituationMessage';

interface GeneratedMessagePanelProps {
  result: SituationMessageResult | null;
  isLoading: boolean;
}

export function GeneratedMessagePanel({ result, isLoading }: GeneratedMessagePanelProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-20 bg-muted rounded w-full"></div>
          <div className="h-20 bg-muted rounded w-full"></div>
        </CardContent>
      </Card>
    );
  }

  // 결과 없음
  if (!result) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-sm">상황을 입력하고 메시지를 생성해보세요</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 상황 분석 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            상황 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed">{result.analysis}</p>
        </CardContent>
      </Card>

      {/* 추천 접근법 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            추천 접근법
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-foreground leading-relaxed">{result.approach}</p>
          </div>
        </CardContent>
      </Card>

      {/* 생성된 메시지들 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            추천 메시지
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.messages.map((message, index) => (
            <div
              key={index}
              className="group p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <Badge variant="outline" className="shrink-0">
                  {message.type}
                </Badge>
                <CopyButton text={message.text} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-foreground mb-2 leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {message.explanation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
