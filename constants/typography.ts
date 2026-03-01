// SmallStep 타이포그래피 시스템
// Pretendard 폰트 기반으로 명확한 위계 설정

import { TextStyle } from "react-native";

// 기본 폰트 패밀리 (Pretendard 기반)
const fontFamily = {
  regular: "Pretendard-Regular",
  medium: "Pretendard-Medium",
  bold: "Pretendard-Bold",
  // 포인트 폰트 (손글씨 느낌) - AI 격려 메시지 등 감성적 영역용
  handwritten: "KCC-Ganpan", // 또는 다른 손글씨 폰트
};

// 폰트 크기 정의
const fontSize = {
  h1: 24,
  h2: 20,
  h3: 18,
  h4: 16,
  h5: 14,
  body: 16,
  caption: 12,
  button: 16,
};

// 폰트 굵기 정의
const fontWeight = {
  regular: "400" as TextStyle["fontWeight"],
  medium: "500" as TextStyle["fontWeight"],
  bold: "700" as TextStyle["fontWeight"],
};

// 타이포그래피 스타일 정의
export const typography = {
  // H1 (화면 제목)
  h1: {
    fontSize: fontSize.h1,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.h1 * 1.4,
  } as TextStyle,

  // H2 (섹션 제목)
  h2: {
    fontSize: fontSize.h2,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.h2 * 1.4,
  } as TextStyle,

  h3: {
    fontSize: fontSize.h3,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.h3 * 1.4,
  } as TextStyle,

  h4: {
    fontSize: fontSize.h4,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.h4 * 1.4,
  } as TextStyle,

  h5: {
    fontSize: fontSize.h5,
    fontWeight: fontWeight.bold,
    fontFamily: fontFamily.bold,
    lineHeight: fontSize.h5 * 1.4,
  } as TextStyle,

  // Body (본문)
  body: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.body * 1.5,
  } as TextStyle,

  // Caption (부가 설명)
  caption: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    fontFamily: fontFamily.regular,
    lineHeight: fontSize.caption * 1.4,
  } as TextStyle,

  // Button Text
  button: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.medium,
    lineHeight: fontSize.button * 1.2,
  } as TextStyle,

  // Point Font (포인트 폰트) - AI 격려 메시지 등 감성적 영역
  point: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    fontFamily: fontFamily.handwritten,
    lineHeight: fontSize.body * 1.4,
  } as TextStyle,
};

// 사용 편의를 위한 별칭
export const textStyles = {
  title: typography.h1,
  subtitle: typography.h2,
  body: typography.body,
  caption: typography.caption,
  button: typography.button,
  point: typography.point,
};

// 폰트 패밀리 export (필요시 사용)
export { fontFamily, fontSize, fontWeight };
