import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { colors } from "../constants/colors";
import { typography } from "../constants/typography";

interface ProgressGraphProps {
  data: {
    label: string;
    value: number;
    maxValue: number;
  }[];
  title: string;
  subtitle?: string;
  type?: "daily" | "phase";
}

const { width } = Dimensions.get("window");
const GRAPH_WIDTH = width - 80; // 좌우 마진 제외

export const ProgressGraph: React.FC<ProgressGraphProps> = ({
  data,
  title,
  subtitle,
  type = "daily",
}) => {
  const maxValue = Math.max(...data.map((item) => item.maxValue));

  const renderBar = (
    item: { label: string; value: number; maxValue: number },
    index: number
  ) => {
    const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
    const barWidth = (percentage / 100) * (GRAPH_WIDTH - 60); // 라벨 공간 제외

    return (
      <View key={index} style={styles.barContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.barLabel}>{item.label}</Text>
          <Text style={styles.barValue}>{item.value}</Text>
        </View>

        <View style={styles.barWrapper}>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: barWidth,
                  backgroundColor: colors.deepMint,
                },
              ]}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.graphContainer}>
        {data.map((item, index) => renderBar(item, index))}
      </View>

      {/* 범례 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.deepMint }]}
          />
          <Text style={styles.legendText}>
            {type === "daily" ? "성공한 날" : "완료한 단계"}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: colors.lightBlue }]}
          />
          <Text style={styles.legendText}>
            {type === "daily" ? "휴식한 날" : "대기 중인 단계"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    ...typography.h2,
    color: colors.primaryText,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    color: colors.secondaryText,
  },
  graphContainer: {
    marginBottom: 20,
  },
  barContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  barLabel: {
    ...typography.body,
    color: colors.primaryText,
    fontWeight: "500",
  },
  barValue: {
    ...typography.caption,
    color: colors.deepMint,
    fontWeight: "600",
  },
  barWrapper: {
    height: 24,
    justifyContent: "center",
  },
  barBackground: {
    height: 8,
    backgroundColor: colors.lightBlue,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    ...typography.caption,
    color: colors.secondaryText,
  },
});
