import { CoinData } from "@/type";
import { router } from "expo-router";
import { memo, useCallback, useMemo } from "react";
import { formatToMillion } from "@/function/function";
import { View, Text, StyleSheet, Pressable } from "react-native";

const CoinRow = memo(({ coin }: { coin: CoinData }) => {
  const isMinus = coin.diffRate.includes("-");
  const diffTextColor = useMemo(
    () => (isMinus ? "#4692F3" : "#FF5B5B"),
    [isMinus]
  );

  const handlePress = useCallback(() => {
    router.push({
      pathname: "/DetailScreen",
      params: {
        data: JSON.stringify(coin),
      },
    });
  }, [coin]);

  return (
    <Pressable style={styles.coinRow} onPress={handlePress}>
      <View style={styles.coinInfo}>
        <Text style={styles.coinName} numberOfLines={1}>
          {coin.nameKr}
        </Text>
        <Text style={styles.coinSymbol} numberOfLines={1}>
          {coin.nameEn}
        </Text>
      </View>
      <View style={styles.coinPriceContainer}>
        <Text style={styles.coinPrice} numberOfLines={1}>
          {Number(coin.currentPrice).toLocaleString()}
        </Text>
      </View>
      <View style={styles.diffContainer}>
        <Text
          style={[styles.diffRate, { color: diffTextColor }]}
          numberOfLines={1}
        >
          {coin.diffRate}
        </Text>
        <Text
          style={[styles.diffRateSmall, { color: diffTextColor }]}
          numberOfLines={1}
        >
          {Number(coin.diffAmount).toLocaleString()}
        </Text>
      </View>
      <View style={styles.volumeContainer}>
        <Text style={styles.volumeText} numberOfLines={1}>
          {formatToMillion(Number(coin.volume))}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C131A",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: "#1D232A",
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 40,
    color: "#fff",
  },
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
  flatListContainer: {
    paddingBottom: 20,
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  coinInfo: {
    width: "25%",
  },
  coinName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  coinSymbol: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  coinPriceContainer: {
    width: "25%",
    alignItems: "flex-end",
  },
  coinPrice: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  diffContainer: {
    alignItems: "flex-end",
    width: "25%",
  },
  diffRate: {
    fontSize: 12,
    marginTop: 2,
  },
  diffRateSmall: {
    fontSize: 10,
    marginTop: 2,
  },
  volumeContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  volumeText: {
    color: "#fff",
    fontSize: 11,
  },
});

export default CoinRow;
