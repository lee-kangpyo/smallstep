import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingSlide } from "../components/OnboardingSlide";
import { StepCard } from "../components/StepCard";
import { RoadmapCard } from "../components/RoadmapCard";
import { PhaseCard } from "../components/PhaseCard";
import { ScheduleCard } from "../components/ScheduleCard";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card } from "../components/Card";
import { onboardingSlides, mockGoalAnalysis } from "../data/mockData";
import {
  running5KMRoadmap,
  englishConversationRoadmap,
} from "../data/mockData";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Ionicons } from "@expo/vector-icons";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;

const { width } = Dimensions.get("window");

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0); // 0: 목표입력, 1: 로드맵확인, 2: 스케줄조정
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [adjustedSchedule, setAdjustedSchedule] = useState<any[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  // 슬라이드 전환
  const handleNextSlide = () => {
    if (currentStep < onboardingSlides.length - 1) {
      setCurrentStep(currentStep + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentStep + 1) * width,
        animated: true,
      });
    }
  };

  const handlePrevSlide = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({
        x: (currentStep - 1) * width,
        animated: true,
      });
    }
  };

  // 목표 분석 시작
  const handleAnalyzeGoal = async () => {
    if (!goal.trim()) {
      Alert.alert(
        "목표를 입력해주세요",
        "이루고 싶은 큰 목표를 자유롭게 적어주세요."
      );
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    // 페이드 아웃 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // 로딩 애니메이션 시작
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // AI 분석 시뮬레이션 (3초 후 결과 표시)
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);

      // 목표에 따라 적절한 로드맵 생성
      const roadmap =
        goal.toLowerCase().includes("달리기") ||
        goal.toLowerCase().includes("5km")
          ? running5KMRoadmap
          : englishConversationRoadmap;
      setGeneratedRoadmap(roadmap);

      // 페이드 인 애니메이션
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 3000);
  };

  // 스텝 선택/해제
  const handleStepToggle = (stepId: string) => {
    setSelectedSteps((prev) =>
      prev.includes(stepId)
        ? prev.filter((id) => id !== stepId)
        : [...prev, stepId]
    );
  };

  // 로드맵 확인 후 다음 단계로
  const handleRoadmapConfirm = () => {
    setCurrentOnboardingStep(1);
    // 스케줄 초기화
    if (generatedRoadmap?.schedule) {
      setAdjustedSchedule([...generatedRoadmap.schedule]);
    }
  };

  // 스케줄 아이템 삭제
  const handleScheduleItemDelete = (item: any) => {
    setAdjustedSchedule((prev) =>
      prev.filter(
        (scheduleItem) =>
          !(scheduleItem.week === item.week && scheduleItem.day === item.day)
      )
    );
  };

  // 스케줄 아이템 순서 변경
  const handleScheduleItemMove = (item: any, direction: "up" | "down") => {
    setAdjustedSchedule((prev) => {
      const newSchedule = [...prev];
      const currentIndex = newSchedule.findIndex(
        (scheduleItem) =>
          scheduleItem.week === item.week && scheduleItem.day === item.day
      );

      if (currentIndex === -1) return prev;

      if (direction === "up" && currentIndex > 0) {
        [newSchedule[currentIndex], newSchedule[currentIndex - 1]] = [
          newSchedule[currentIndex - 1],
          newSchedule[currentIndex],
        ];
      } else if (
        direction === "down" &&
        currentIndex < newSchedule.length - 1
      ) {
        [newSchedule[currentIndex], newSchedule[currentIndex + 1]] = [
          newSchedule[currentIndex + 1],
          newSchedule[currentIndex],
        ];
      }

      return newSchedule;
    });
  };

  // 스케줄 조정 후 완료
  const handleCompleteOnboarding = () => {
    // 조정된 스케줄을 저장하고 메인 화면으로 이동
    console.log("최종 스케줄:", adjustedSchedule);
    navigation.navigate("Main");
  };

  // 로딩 애니메이션 컴포넌트
  const LoadingAnimation = () => (
    <View style={styles.loadingContainer}>
      <Animated.View
        style={[
          styles.loadingFootprint,
          {
            opacity: loadingAnim,
            transform: [
              {
                scale: loadingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.footprintText}>👣</Text>
      </Animated.View>
      <Text style={styles.loadingText}>
        AI가 당신의 목표를 분석하고 있어요...
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {currentStep < onboardingSlides.length ? (
        // 온보딩 슬라이드
        <View style={styles.slideContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newStep = Math.round(
                event.nativeEvent.contentOffset.x / width
              );
              setCurrentStep(newStep);
            }}
          >
            {onboardingSlides.map((slide) => (
              <OnboardingSlide key={slide.id} slide={slide} />
            ))}
          </ScrollView>

          {/* 페이지 인디케이터 */}
          <View style={styles.pagination}>
            {onboardingSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentStep && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>

          {/* 네비게이션 버튼 */}
          <View style={styles.navigationButtons}>
            {currentStep > 0 && (
              <Button
                title="이전"
                onPress={handlePrevSlide}
                variant="outline"
                style={styles.navButton}
              />
            )}
            {currentStep < onboardingSlides.length - 1 ? (
              <Button
                title="다음"
                onPress={handleNextSlide}
                variant="primary"
                style={styles.navButton}
              />
            ) : (
              <Button
                title="목표 설정하기"
                onPress={() => {
                  console.log("목표 설정하기 버튼 클릭됨");
                  console.log("현재 currentStep:", currentStep);
                  console.log(
                    "onboardingSlides.length:",
                    onboardingSlides.length
                  );
                  setCurrentStep(onboardingSlides.length);
                  setShowResults(false);
                  console.log("상태 업데이트 완료");
                }}
                variant="accent"
              />
            )}
          </View>
        </View>
      ) : (
        // 목표 입력 및 결과 화면
        <ScrollView style={styles.contentContainer}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {!isAnalyzing ? (
              <>
                {!showResults ? (
                  // 목표 입력 화면
                  <View style={styles.goalInputContainer}>
                    <Text style={styles.sectionTitle}>목표 설정</Text>
                    <Text style={styles.sectionDescription}>
                      이루고 싶은 큰 목표를 자유롭게 적어주세요
                    </Text>

                    <Input
                      label="나의 목표"
                      placeholder="예: 토익 900점 달성, 체중 10kg 감량..."
                      value={goal}
                      onChangeText={setGoal}
                      multiline
                      numberOfLines={3}
                      style={styles.goalInput}
                    />

                    <Button
                      title="AI로 목표 쪼개기"
                      onPress={handleAnalyzeGoal}
                      variant="accent"
                      style={styles.analyzeButton}
                    />
                  </View>
                ) : (
                  // 결과 화면 - 로드맵 설정 단계
                  <View style={styles.resultsContainer}>
                    {currentOnboardingStep === 0 ? (
                      // 로드맵 확인 단계
                      <>
                        <Card
                          variant="elevated"
                          padding="large"
                          style={styles.goalCard}
                        >
                          <Text style={styles.goalTitle}>"{goal}"</Text>
                          <Text style={styles.goalMessage}>
                            AI가 당신의 목표를 분석하여 단계별 로드맵을
                            생성했습니다.
                          </Text>
                        </Card>

                        {generatedRoadmap && (
                          <RoadmapCard
                            roadmap={generatedRoadmap}
                            onPhasePress={(phase) =>
                              setSelectedPhase(phase.phase)
                            }
                            selectedPhase={selectedPhase || undefined}
                          />
                        )}

                        <Button
                          title="로드맵 확인 완료"
                          onPress={handleRoadmapConfirm}
                          variant="accent"
                          style={styles.startButton}
                        />
                      </>
                    ) : (
                      // 스케줄 조정 단계
                      <>
                        <Text style={styles.sectionTitle}>스케줄 조정</Text>
                        <Text style={styles.sectionDescription}>
                          생성된 스케줄을 확인하고 필요에 따라 조정해주세요
                        </Text>

                        {adjustedSchedule.length > 0 ? (
                          <ScheduleCard
                            scheduleItems={adjustedSchedule}
                            onScheduleItemDelete={handleScheduleItemDelete}
                            onScheduleItemMove={handleScheduleItemMove}
                            editable={true}
                          />
                        ) : (
                          <View style={styles.emptySchedule}>
                            <Ionicons
                              name="calendar-outline"
                              size={48}
                              color={colors.secondaryText}
                            />
                            <Text style={styles.emptyScheduleText}>
                              스케줄이 없습니다
                            </Text>
                          </View>
                        )}

                        <Button
                          title="이대로 시작하기"
                          onPress={handleCompleteOnboarding}
                          variant="accent"
                          style={styles.startButton}
                        />
                      </>
                    )}
                  </View>
                )}
              </>
            ) : (
              <LoadingAnimation />
            )}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
  },
  slideContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightBlue,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.deepMint,
    width: 24,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 10,
  },
  goalInputContainer: {
    padding: 20,
  },
  sectionTitle: {
    ...typography.h1,
    color: colors.primaryText,
    marginBottom: 8,
    textAlign: "center",
  },
  sectionDescription: {
    ...typography.body,
    color: colors.secondaryText,
    marginBottom: 24,
    textAlign: "center",
  },
  goalInput: {
    marginBottom: 24,
  },
  analyzeButton: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingFootprint: {
    marginBottom: 20,
  },
  footprintText: {
    fontSize: 60,
  },
  loadingText: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
  },
  resultsContainer: {
    padding: 20,
  },
  goalCard: {
    marginBottom: 24,
  },
  goalTitle: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 12,
    textAlign: "center",
  },
  goalMessage: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    lineHeight: 20,
  },
  startButton: {
    marginTop: 24,
    marginBottom: 40,
  },
  emptySchedule: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyScheduleText: {
    ...typography.body,
    color: colors.secondaryText,
    marginTop: 12,
  },
});
