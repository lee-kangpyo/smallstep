import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";
import { useGoalsStore } from "../../stores";

interface Goal {
  id: number;
  title: string;
  description: string;
  weeklyFrequency: number;
  activities: Activity[];
}

interface Activity {
  id: number;
  day: number;
  title: string;
  description: string;
  completed: boolean;
}

interface WeeklyPlan {
  goal: Goal;
  activities: Activity[];
  week: number;
}

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

interface InitialLoadingScreenProps {
  onComplete?: () => void;
}

export const InitialLoadingScreen: React.FC<InitialLoadingScreenProps> = ({
  onComplete,
}) => {
  const { onboardingSlides } = useGoalsStore();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [hasOnboarded, setHasOnboarded] = React.useState(false);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setHasOnboarded(true);
      if (onComplete) onComplete();
    }
  };

  if (onboardingSlides.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>AI 계획 생성 중...</Text>
      </View>
    );
  }

  const slide = onboardingSlides[currentSlide];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Ionicons
          name={currentSlide === 0 ? "people" : currentSlide === 1 ? "moon" : "medal"}
          size={150}
          color={colors.deepMint}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === onboardingSlides.length - 1
              ? "시작하기"
              : "다음"}
          </Text>
          <Ionicons
            name={
              currentSlide === onboardingSlides.length - 1
                ? "arrow-forward"
                : "arrow-forward"
            }
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>

        <View style={styles.indicatorContainer}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentSlide && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.warmGray,
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    ...typography.h1,
    color: colors.primaryText,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    ...typography.h2,
    color: colors.deepMint,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    ...typography.body,
    color: colors.secondaryText,
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.deepMint,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 24,
  },
  nextButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
    marginRight: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightBlue,
  },
  activeIndicator: {
    width: 24,
    backgroundColor: colors.deepMint,
  },
});
