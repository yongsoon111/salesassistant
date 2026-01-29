
import { GoogleGenAI } from "@google/genai";
import { Customer, StrategicGoal } from "../types";

export const generateSmartResponse = async (
  customer: Customer | null,
  scenario: string,
  strategicGoal: StrategicGoal | '',
  userText: string,
  imageData?: { data: string; mimeType: string }
) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const systemInstruction = `당신은 세계 최고의 비즈니스 심리학자이자 '전략적 인식 관리(Perception Management)' 전문가입니다.
단순히 친절한 답변을 만드는 사람이 아니라, 고객의 무의식에 특정 이미지를 심고 원하는 감정을 불러일으키는 커뮤니케이션 설계를 수행합니다.

[분석 및 설계 프로세스]
1. 감정 진단(Emotion Detection): 이미지나 텍스트에서 고객의 현재 심리 상태(불안, 기대, 짜증, 의구심 등)와 대화의 온도를 0~100점으로 측정하십시오.
2. 인식 목표 설정(Strategic Goal): 사용자가 요청한 '${strategicGoal}' 인식을 심기 위해 필요한 말투, 단어 선택, 문장 구조를 결정하십시오.
3. 인식 강화 로직: 고객의 현재 감정을 먼저 수용(Validation)한 뒤, 사용자가 목표로 하는 페르소나를 극대화할 수 있는 방향으로 화제를 전환(Pivot)하십시오.

[결과 보고서 규격]
- [고객 심리 진단]: 현재 고객이 느끼는 감정과 그 원인 분석 (예: "가격에 대한 심리적 저항감 80%")
- [전략적 포지셔닝]: 이번 대화에서 지켜야 할 '나'의 캐릭터 정의
- [강화된 대응 전략 A/B]: 
  * A안: 목표 인식(${strategicGoal})을 가장 강력하게 남길 수 있는 핵심 멘트
  * B안: 조금 더 부드럽거나 다른 각도에서의 대안 멘트
- [인식 관리 팁]: 이 멘트가 고객에게 어떤 심리적 효과를 주는지에 대한 짧은 설명`;

    const contextPrompt = `
[고객 프로필]
성함: ${customer?.name || '익명'} / 등급: ${customer?.status || '일반'}
히스토리: ${customer?.notes || '기록 없음'}

[미션 설정]
현재 상황: ${scenario}
목표 인식(사용자가 남기고 싶은 인상): ${strategicGoal}
사용자 추가 정보: ${userText}
`;

    const parts: any[] = [{ text: contextPrompt }];
    if (imageData) {
      parts.push({
        inlineData: {
          data: imageData.data,
          mimeType: imageData.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      }
    });

    return response.text || "분석 실패: AI가 전략을 도출하지 못했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류 발생: 전략 분석 엔진 연결에 문제가 발생했습니다.";
  }
};
