import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

