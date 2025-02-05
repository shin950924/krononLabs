import { fetchMarketList } from "@/api/api";
import CoinList from "@/components/CoinList";
import { CoinData, TickerData } from "@/type";
import SearchBar from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { UpbitSocketManager } from "@/socket/upbit";
import { SafeAreaView, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import SummarySection from "@/components/SummarySection";
import React, { useEffect, useState, useRef } from "react";

const TradingScreen: React.FC = () => {
  const isFocus = useIsFocused();
  const subscriptionSent = useRef(false);
  const [coinList, setCoinList] = useState<CoinData[]>([]);
  const [socketData, setSocketData] = useState<TickerData>();

  const { data: marketData } = useQuery<CoinData[]>({
    queryKey: ["marketList"],
    queryFn: async (): Promise<CoinData[]> => {
      const data = await fetchMarketList();
      const coins: CoinData[] = data.map((item: any) => ({
        id: item.market,
        nameKr: item.korean_name,
        nameEn: item.english_name,
        currentPrice: "",
        diffRate: "",
        diffAmount: "",
        volume: "",
      }));
      return coins;
    },
  });

  useEffect(() => {
    if (marketData) {
      setCoinList(marketData);
    }
  }, [marketData]);

  useEffect(() => {
    const socketManager = new UpbitSocketManager();

    const handleData = (data: any) => {
      if (data && data.code) {
        setSocketData(data as TickerData);
      }
    };

    if (!subscriptionSent.current && coinList.length > 0) {
      const marketList = coinList.map((item) => item.id);
      socketManager.subscribeType("ticker", marketList);
      subscriptionSent.current = true;
    }

    if (isFocus) {
      socketManager.subscribe(handleData);
    } else {
      socketManager.unsubscribe(handleData);
    }

    return () => {
      socketManager.unsubscribe(handleData);
    };
  }, [isFocus, coinList.length]);

  useEffect(() => {
    if (socketData?.code) {
      setCoinList((prevList) => {
        const coinIndex = prevList.findIndex(
          (coin) => coin.id === socketData.code
        );
        const updatedCoin: CoinData = {
          id: socketData.code ?? "",
          nameKr:
            coinIndex !== -1
              ? prevList[coinIndex].nameKr
              : socketData.code ?? "",
          nameEn:
            coinIndex !== -1
              ? prevList[coinIndex].nameEn
              : socketData.code ?? "",
          currentPrice:
            socketData.trade_price != null
              ? socketData.trade_price.toString()
              : "",
          diffRate:
            socketData.signed_change_rate != null
              ? (socketData.signed_change_rate * 100).toFixed(2) + "%"
              : "",
          diffAmount:
            socketData.signed_change_price != null
              ? socketData.signed_change_price.toString()
              : "",
          volume:
            socketData.acc_trade_price_24h != null
              ? socketData.acc_trade_price_24h.toString()
              : "",
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

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar />
      <SummarySection />
      <CoinList coinList={coinList} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C131A",
  },
});

export default TradingScreen;
