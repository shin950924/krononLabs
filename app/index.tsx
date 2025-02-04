import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ListRenderItemInfo,
} from "react-native";
import CoinRow from "@/components/CoinRow";
import { ICoinData, ITickerData } from "@/type";
import { UpbitSocketManager } from "@/socket/upbit";
import React, { useCallback, useEffect, useState } from "react";

const initialCoinData: ICoinData[] = [];

const TradingScreen: React.FC = () => {
  const [coinList, setCoinList] = useState<ICoinData[]>(initialCoinData);
  const [socketData, setSocketData] = useState<ITickerData | null>(null);

  useEffect(() => {
    const socketManager = UpbitSocketManager.getInstance();
    socketManager.subscribeType("ticker");

    const handleData = (data: any) => {
      if (data && data.code) {
        setSocketData(data as ITickerData);
      }
    };
    socketManager.subscribe(handleData);
    return () => {
      socketManager.unsubscribe(handleData);
    };
  }, []);

  useEffect(() => {
    if (socketData?.code) {
      const parts = socketData.code.split("-");
      if (parts.length === 2) {
        const targetTicker = `${parts[1]}/KRW`;
        setCoinList((prevList) => {
          const coinIndex = prevList.findIndex(
            (coin) => coin.nameEn === targetTicker
          );
          const updatedCoin: ICoinData = {
            id: socketData.code ?? "",
            nameKr: socketData.code ?? "",
            nameEn: targetTicker ?? "",
            currentPrice:
              socketData.trade_price !== undefined &&
              socketData.trade_price !== null
                ? socketData.trade_price.toString()
                : "0",
            diffRate:
              socketData.signed_change_rate !== undefined &&
              socketData.signed_change_rate !== null
                ? (socketData.signed_change_rate * 100).toFixed(2) + "%"
                : "0%",
            diffAmount:
              socketData.signed_change_price !== undefined &&
              socketData.signed_change_price !== null
                ? socketData.signed_change_price.toString()
                : "0",
            volume:
              socketData.acc_trade_price_24h !== undefined &&
              socketData.acc_trade_price_24h !== null
                ? socketData.acc_trade_price_24h.toString()
                : "0",
          };
          if (coinIndex !== -1) {
            const newList = [...prevList];
            newList[coinIndex] = updatedCoin;
            return newList;
          }
          return [...prevList, updatedCoin];
        });
      }
    }
  }, [socketData]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ICoinData>) => <CoinRow coin={item} />,
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="코인명/심볼 검색"
          placeholderTextColor="#888"
        />
      </View>

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
            <Text style={[styles.summaryValue, { color: "#FF5B5B" }]}>
              100%
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={coinList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
      />
    </SafeAreaView>
  );
};

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

export default TradingScreen;
