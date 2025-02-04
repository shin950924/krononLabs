import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import CandleStickChart from "@/components/CandleStickChart";
import { router } from "expo-router";

const DetailScreen = () => {
  const [selectedTab, setSelectedTab] = useState("차트");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Text style={{ color: "#fff" }}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>리플 (XRP/KRW)</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>3,677</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.changeRate}>-9.61%</Text>
          <Text style={styles.changeValue}> ▼391</Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {["주문", "차트"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }}>
        <CandleStickChart />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0C131A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  priceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  price: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  changeRate: {
    color: "#4692F3",
    fontSize: 16,
    marginLeft: 12,
  },
  changeValue: {
    color: "#4692F3",
    fontSize: 16,
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  tabButtonActive: {
    borderBottomColor: "#fff",
    borderBottomWidth: 2,
  },
  tabText: {
    color: "#999",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#fff",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DetailScreen;
