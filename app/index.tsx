import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
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
import { CoinData, TickerData } from "@/type";
import { useQuery } from "@tanstack/react-query";
import { UpbitSocketManager } from "@/socket/upbit";
import { fetchMarketList, fetchMarketPrice } from "@/api/api";

const TradingScreen: React.FC = () => {
  const subscriptionSent = useRef(false);
  const [coinList, setCoinList] = useState<CoinData[]>([]);
  const [coinData, setCoinData] = useState<CoinData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [socketData, setSocketData] = useState<TickerData | null>(null);
  const { data: coinQueryData } = useQuery<CoinData[]>({
    queryKey: ["coinData"],
    queryFn: async (): Promise<CoinData[]> => {
      const marketResponse = await fetchMarketList();
      const filteredData = marketResponse.filter((item: any) =>
        item.market.startsWith("KRW-")
      );

      const marketListStr = filteredData
        .map((item: any) => item.market)
        .join(",");
      let tickerData = await fetchMarketPrice(marketListStr);
      if (!Array.isArray(tickerData)) {
        tickerData = [tickerData];
      }

      const coins: CoinData[] = filteredData.map((item: any) => {
        const ticker = tickerData.find(
          (t: TickerData) => t.market === item.market
        );
        return {
          id: item.market,
          nameKr: item.korean_name,
          nameEn: item.english_name,
          currentPrice:
            ticker && ticker.trade_price !== undefined
              ? ticker.trade_price.toString()
              : "0",
          diffRate:
            ticker && ticker.signed_change_rate !== undefined
              ? (ticker.signed_change_rate * 100).toFixed(2) + "%"
              : "0%",
          diffAmount:
            ticker && ticker.signed_change_price !== undefined
              ? ticker.signed_change_price.toString()
              : "0",
          volume:
            ticker && ticker.acc_trade_price_24h !== undefined
              ? ticker.acc_trade_price_24h.toString()
              : "0",
        };
      });
      coins.sort(
        (a: CoinData, b: CoinData) => Number(b.volume) - Number(a.volume)
      );
      return coins;
    },
  });

  useEffect(() => {
    if (coinQueryData) {
      setCoinList(coinQueryData);
      setCoinData(coinQueryData);
    }
  }, [coinQueryData]);

  useEffect(() => {
    const socketManager = new UpbitSocketManager();
    const handleData = (data: any) => {
      if (data && data.type == "ticker" && (data.market || data.code)) {
        setSocketData(data as TickerData);
      }
    };

    if (!subscriptionSent.current && coinData.length > 0) {
      socketManager.subscribe(handleData);
      const marketList = coinData.map((item) => item.id);
      socketManager.subscribeType("ticker", marketList);
      subscriptionSent.current = true;
    }
    return () => {
      socketManager.unsubscribe(handleData);
      subscriptionSent.current = false;
    };
  }, [coinList]);

  useEffect(() => {
    if (socketData?.market || socketData?.code) {
      const id = socketData.market ?? socketData.code;
      setCoinData((prevList) => {
        const coinIndex = prevList.findIndex((coin) => coin.id === id);
        const updatedCoin: CoinData = {
          id: id,
          nameKr: coinIndex !== -1 ? prevList[coinIndex].nameKr : id,
          nameEn: coinIndex !== -1 ? prevList[coinIndex].nameEn : id,
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
          const currentCoin = prevList[coinIndex];
          if (
            currentCoin.currentPrice === updatedCoin.currentPrice &&
            currentCoin.diffRate === updatedCoin.diffRate &&
            currentCoin.diffAmount === updatedCoin.diffAmount &&
            currentCoin.volume === updatedCoin.volume
          ) {
            return prevList;
          }
          const newList = [...prevList];
          newList[coinIndex] = updatedCoin;
          return newList;
        }
        return [...prevList, updatedCoin];
      });
    }
  }, [socketData]);

  const filteredCoinList = useMemo(() => {
    if (!searchQuery) return coinData;
    const lowerQuery = searchQuery.toLowerCase();
    return coinData.filter(
      (coin) =>
        coin.nameKr.toLowerCase().includes(lowerQuery) ||
        coin.nameEn.toLowerCase().includes(lowerQuery) ||
        coin.id.toLowerCase().includes(lowerQuery)
    );
  }, [coinData, searchQuery]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<CoinData>) => {
    return <CoinRow coin={item} />;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="코인명/심볼 검색"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
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
        data={filteredCoinList}
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
});

export default TradingScreen;
