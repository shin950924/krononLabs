import {
  AskOrderBookData,
  OrderBookItemProps,
  OrderBookScreenProps,
} from "@/type";
import React, { useState, useCallback, memo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

const OrderBookItem: React.FC<OrderBookItemProps> = memo(
  ({ askPrice, askVolume, basePrice, isTopHalf }) => {
    const numericBasePrice = parseFloat(basePrice);
    const priceDiff = askPrice - numericBasePrice;
    const percentChange =
      numericBasePrice !== 0
        ? ((priceDiff / numericBasePrice) * 100).toFixed(2)
        : "0.00";
    return (
      <View
        style={[
          styles.orderBookRow,
          { backgroundColor: isTopHalf ? "#131b34" : "#201620" },
        ]}
      >
        <View>
          <Text style={styles.orderBookPrice}>{askPrice.toLocaleString()}</Text>
          <Text style={styles.orderBookChange}>{percentChange}%</Text>
        </View>
        <Text style={styles.orderBookVolume}>
          {askVolume.toFixed(2).toLocaleString()}
        </Text>
      </View>
    );
  }
);

const OrderBookScreen: React.FC<OrderBookScreenProps> = ({
  orderBookData,
  basePrice,
}) => {
  const [quantity, setQuantity] = useState<string>("");

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<AskOrderBookData>) => {
      const totalItems = orderBookData?.orderbook_units.length;
      const isTopHalf = index < (totalItems ?? 0) / 2;
      return (
        <OrderBookItem
          askPrice={item.ask_price}
          askVolume={item.ask_size}
          basePrice={basePrice}
          isTopHalf={isTopHalf}
        />
      );
    },
    [basePrice, orderBookData?.orderbook_units]
  );

  const keyExtractor = useCallback(
    (item: AskOrderBookData, index: number) => index.toString(),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={orderBookData?.orderbook_units}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={5}
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.orderSection}>
        <View style={{ padding: 16 }}>
          <View style={styles.inputRow}>
            <Text style={styles.label}>수량</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0 XRP"
              placeholderTextColor="#999"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>가격</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={basePrice}
              // onChangeText={setBasePrice}
            />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.label}>총액</Text>
            <Text style={[styles.valueText, styles.totalText]}>0 KRW</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", paddingHorizontal: 3 }}>
          <TouchableOpacity
            style={[styles.buyButton, { backgroundColor: "red" }]}
          >
            <Text style={styles.buyButtonText}>매수</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buyButton, { backgroundColor: "blue" }]}
          >
            <Text style={styles.buyButtonText}>매도</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderBookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#0E0E0E",
  },
  listContainer: {
    width: "50%",
    backgroundColor: "#0E0E0E",
  },
  orderSection: {
    width: "50%",
    backgroundColor: "#0C131A",
  },
  orderBookRow: {
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  orderBookPrice: {
    color: "#fff",
    flex: 1,
  },
  orderBookChange: {
    flex: 1,
    fontSize: 12,
    color: "#ff3b30",
    textAlign: "center",
  },
  orderBookVolume: {
    color: "#fff",
    flex: 1,
    textAlign: "right",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#ccc",
    width: 100,
  },
  input: {
    flex: 1,
    backgroundColor: "#2C2C2C",
    borderRadius: 4,
    color: "#fff",
    paddingHorizontal: 8,
    height: 36,
  },
  valueText: {
    flex: 1,
    color: "#fff",
  },
  percentageText: {
    textAlign: "right",
  },
  totalText: {
    textAlign: "right",
  },
  buyButton: {
    flex: 1,
    marginHorizontal: 3,
    marginTop: 16,
    backgroundColor: "#E72E2E",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
