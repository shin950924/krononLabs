import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";

const SummarySection: React.FC = () => {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>총 매수</Text>
          <Text style={styles.summaryValue}>
            {Number(5000000).toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>총 평가</Text>
          <Text style={styles.summaryValue}>
            {Number(5000000).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>평가손익</Text>
          <Text style={[styles.summaryValue, { color: "#FF5B5B" }]}>
            {Number(5000000).toLocaleString()}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTitle}>수익률</Text>
          <Text style={[styles.summaryValue, { color: "#FF5B5B" }]}>100%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: "#1D232A",
  },
  summaryBox: {
    flex: 1,
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  summaryTitle: {
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
    marginRight: 4,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default memo(SummarySection);
