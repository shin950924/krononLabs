import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import OrderBookScreen from "./OrderBookScreen";
import { UpbitSocketManager } from "@/socket/upbit";
import { useIsFocused } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import CandleStickChart from "@/components/CandleStickChart";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CandleData, MarketData, OrderbookData, TickerData } from "@/type";

const DetailScreen: React.FC = () => {
  const isFocus = useIsFocused();
  const params = useLocalSearchParams<any>();
  const data: MarketData = JSON.parse(params.data);

  const [orderBook, setOrderBook] = useState<OrderbookData>();
  const [ticker, setTicker] = useState<TickerData | null>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [selectedTab, setSelectedTab] = useState<"주문" | "차트">("주문");

  const loadInitialData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.upbit.com/v1/candles/minutes/1?market=${data.id}&count=200`
      );
      const json = await response.json();
      if (Array.isArray(json) && json.length > 0) {
        const initialCandles: CandleData[] = json
          .map((candle: any) => ({
            x: new Date(candle.candle_date_time_kst),
            open: Number(candle.opening_price),
            high: Number(candle.high_price),
            low: Number(candle.low_price),
            close: Number(candle.trade_price),
            volume: Number(candle.candle_acc_trade_price) || 0,
          }))
          .reverse();
        setCandleData(initialCandles);
      }
    } catch (error) {
      console.error("초기 candle 데이터 로드 에러:", error);
    }
  }, [data.id]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleCandleData = useCallback((incomingData: any) => {
    if (incomingData?.type === "candle.1s") {
      const newCandle: CandleData = {
        x: new Date(incomingData.candle_date_time_kst),
        open: Number(incomingData.opening_price),
        high: Number(incomingData.high_price),
        low: Number(incomingData.low_price),
        close: Number(incomingData.trade_price),
        volume: Number(incomingData.candle_acc_trade_price) || 0,
      };

      setCandleData((prev) => {
        if (prev.length > 0) {
          const lastCandle = prev[prev.length - 1];
          const lastDate = lastCandle.x;
          const newDate = newCandle.x;
          if (
            lastDate.getFullYear() === newDate.getFullYear() &&
            lastDate.getMonth() === newDate.getMonth() &&
            lastDate.getDate() === newDate.getDate() &&
            lastDate.getHours() === newDate.getHours() &&
            lastDate.getMinutes() === newDate.getMinutes()
          ) {
            const updatedCandle: CandleData = {
              x: lastCandle.x,
              open: lastCandle.open,
              high: Math.max(lastCandle.high, newCandle.high),
              low: Math.min(lastCandle.low, newCandle.low),
              close: newCandle.close,
              volume: (lastCandle.volume || 0) + (newCandle.volume || 0),
            };
            return [...prev.slice(0, prev.length - 1), updatedCandle];
          }
        }
        return [...prev, newCandle];
      });
    } else if (incomingData?.type === "ticker") {
      setTicker(incomingData);
    } else if (incomingData?.type === "orderbook") {
      setOrderBook(incomingData);
    }
  }, []);

  // 웹소켓 구독 관리
  useEffect(() => {
    if (!isFocus) return;

    const socketManagerTicker = new UpbitSocketManager();
    const socketManagerSecondary = new UpbitSocketManager();

    // 티커 구독 (항상 구독)
    socketManagerTicker.subscribeType("ticker", [data.id]);
    socketManagerTicker.subscribe(handleCandleData);

    // 선택 탭에 따라 구독 타입 변경
    if (selectedTab === "차트") {
      socketManagerSecondary.subscribeType("candle.1s", [data.id]);
    } else {
      socketManagerSecondary.subscribeType("orderbook", [data.id]);
    }
    socketManagerSecondary.subscribe(handleCandleData);

    // cleanup: 구독 해제
    return () => {
      socketManagerTicker.unsubscribe(handleCandleData);
      socketManagerSecondary.unsubscribe(handleCandleData);
      // 필요한 경우 소켓 연결 종료 로직 추가
    };
  }, [handleCandleData, isFocus, data.id, selectedTab]);

  // 탭 버튼 렌더링 (메모이제이션)
  const tabButtons = useMemo(
    () =>
      (["주문", "차트"] as const).map((tab) => (
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
      )),
    [selectedTab]
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.dismiss()}>
          <Text style={styles.backText}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{data.nameEn}</Text>
      </View>

      {/* 가격 정보 */}
      <View style={styles.priceContainer}>
        <Text style={styles.price}>
          {Number(ticker?.trade_price ?? data.currentPrice).toLocaleString()}
        </Text>
        <View style={styles.priceChangeContainer}>
          <Text style={styles.changeRate}>
            {(ticker
              ? (ticker.change_rate * 100).toFixed(2)
              : data.change_rate !== undefined
              ? Number(data.change_rate).toFixed(2)
              : "0") + "%"}
          </Text>
          <Text style={styles.changeValue}>
            {ticker
              ? Number(ticker.change_price).toLocaleString()
              : data.diffAmountdiffAmount !== undefined
              ? Number(data.diffAmountdiffAmount).toLocaleString()
              : "0"}
          </Text>
        </View>
      </View>

      {/* 탭 버튼 */}
      <View style={styles.tabContainer}>{tabButtons}</View>

      {/* 차트 또는 주문 화면 */}
      <View style={styles.chartContainer}>
        {selectedTab === "차트" ? (
          <CandleStickChart candleData={candleData} />
        ) : (
          <OrderBookScreen
            orderBookData={orderBook}
            basePrice={data.currentPrice}
          />
        )}
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
  backText: {
    color: "#fff",
    fontSize: 18,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
    fontWeight: "700",
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
  priceChangeContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  changeRate: {
    color: "#4692F3",
    fontSize: 16,
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
  chartContainer: {
    flex: 1,
  },
});

export default DetailScreen;
