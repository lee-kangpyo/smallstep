import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  headerSection: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
  },
  greetingContainer: {
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  subGreeting: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
  },
  streakContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D97706",
  },
  tasksSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  encouragementSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    alignItems: "center",
  },
  encouragementText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#059669",
    textAlign: "center",
  },
});
