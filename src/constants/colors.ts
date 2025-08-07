// SmallStep 디자인 시스템 색상 팔레트
// '격려하는 미니멀리즘' 디자인 철학에 따른 색상 정의

export const colors = {
  // Primary (주조색) - 앱의 전반적인 톤앤매너 결정
  warmGray: "#F5F5F5", // 배경
  sandBeige: "#F5F5DC", // 주요 카드 배경

  // Secondary (보조색) - 주요 인터랙션 요소 및 포인트 영역
  deepMint: "#008080", // 주요 버튼, 아이콘
  lightBlue: "#ADD8E6", // 보조 정보, 긍정적 피드백

  // Accent (강조색) - 사용자의 행동을 유도하거나 중요한 성취를 강조
  coralPink: "#FF6F61", // 캘린더 스탬프, 핵심 CTA
  warmOrange: "#FF8C00", // 캐릭터 성장, 특별 보상

  // Semantic Colors (상태별 색상)
  success: "#28A745", // 성공, 완료
  error: "#DC3545", // 오류, 삭제
  warning: "#FFC107", // 주의, 알림

  // Text Colors (텍스트 색상)
  primaryText: "#333333", // 주요 텍스트
  secondaryText: "#767676", // 보조 텍스트

  // 기존 색상 (호환성을 위해 유지)
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
  background: "#F5F5F5",

  lightMint: "#E0F2E9",
};

// 색상 그룹별 export
export const primaryColors = {
  background: colors.warmGray,
  card: colors.sandBeige,
};

export const secondaryColors = {
  primary: colors.deepMint,
  secondary: colors.lightBlue,
};

export const accentColors = {
  primary: colors.coralPink,
  secondary: colors.warmOrange,
};

export const semanticColors = {
  success: colors.success,
  error: colors.error,
  warning: colors.warning,
};

export const textColors = {
  primary: colors.primaryText,
  secondary: colors.secondaryText,
};
