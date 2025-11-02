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
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingSlide } from "../components/OnboardingSlide";
import { Button } from "../components/Button";
import { onboardingSlides } from "../data/mockData";
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

  const scrollViewRef = useRef<ScrollView>(null);

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


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
                  navigation.navigate('GoalTemplateSelection');
                }}
                variant="accent"
              />
            )}
          </View>
        </View>
    </SafeAreaView>
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
});
