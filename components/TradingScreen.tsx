import CoinList from "@/components/CoinList";
import SearchBar from "@/components/SearchBar";
import { CoinData, TickerData } from "@/type";
import { UpbitSocketManager } from "@/socket/upbit";
import { useIsFocused } from "@react-navigation/native";
import SummarySection from "@/components/SummarySection";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, ActivityIndicator } from "react-native";

const TradingScreen: React.FC = () => {
  const isFocus = useIsFocused();
  const subscriptionSent = useRef(false);
  const [coinList, setCoinList] = useState<CoinData[]>([]);
  const [socketData, setSocketData] = useState<TickerData>();

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.upbit.com/v1/market/all?is_details=true"
        );
        const data = await response.json();

        const coins: CoinData[] = data.map((item: any) => ({
          id: item.market,
          nameKr: item.korean_name,
          nameEn: item.english_name,
          currentPrice: "",
          diffRate: "",
          diffAmount: "",
          volume: "",
        }));
        setCoinList(coins);
      } catch (error) {
        console.error("마켓 데이터 로드 에러:", error);
      }
    };

    fetchMarketData();
  }, []);

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

  // 3. 소켓 데이터가 들어올 때마다 coinList 업데이트
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

  if (coinList.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

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
