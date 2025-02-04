import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  margin,
  TOTAL_CHART_HEIGHT,
  CANDLE_CHART_HEIGHT,
  VOLUME_CHART_HEIGHT,
} from "@/const";
import { YAxis } from "./YAxis";
import { CandleDatum } from "@/type";
import VolumeYAxis from "./VolumeYAxis";
import { UpbitSocketManager } from "@/socket/upbit";
import CombinedChartItem from "./CombinedChartItem";
import { FlatList, StyleSheet, View } from "react-native";

const CandleStickChart: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const [candleData, setCandleData] = useState<CandleDatum[]>([]);

  // 고정 파라미터
  const barWidth = 40;
  const barSpacing = 0;
  const horizontalMargin = 13;

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch(
          "https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=200"
        );
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          const initialCandles: CandleDatum[] = json
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
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const socketManager = UpbitSocketManager.getInstance();
    socketManager.subscribeType("candle");

    const handleData = (data: any) => {
      if (data && data.type === "candle.1s") {
        const newCandle: CandleDatum = {
          x: new Date(data.candle_date_time_kst),
          open: Number(data.opening_price),
          high: Number(data.high_price),
          low: Number(data.low_price),
          close: Number(data.trade_price),
          volume: Number(data.candle_acc_trade_price) || 0,
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
              const updatedCandle: CandleDatum = {
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
      }
    };

    socketManager.subscribe(handleData);
    return () => {
      socketManager.unsubscribe(handleData);
    };
  }, []);

  // 가격 Y축 최소, 최대 계산
  const { yMin, yMax } = useMemo(() => {
    const values = candleData.flatMap((d) => [d.open, d.close, d.high, d.low]);
    if (values.length === 0) return { yMin: 0, yMax: 0 };
    return { yMin: Math.min(...values), yMax: Math.max(...values) };
  }, [candleData]);

  // 거래량 최대 계산
  const volumeMax = useMemo(() => {
    if (candleData.length === 0) return 0;
    return Math.max(...candleData.map((d) => (isNaN(d.volume) ? 0 : d.volume)));
  }, [candleData]);

  // 캔들 Y 스케일 함수
  const candleYScale = useCallback(
    (value: number): number => {
      if (yMax === yMin) return margin.top;
      const chartHeight = CANDLE_CHART_HEIGHT - margin.top - margin.bottom;
      const ratio = (value - yMin) / (yMax - yMin);
      return CANDLE_CHART_HEIGHT - margin.bottom - ratio * chartHeight;
    },
    [yMin, yMax]
  );

  // 거래량 Y 스케일 함수
  const volumeYScale = useCallback(
    (value: number): number => {
      const chartHeight = VOLUME_CHART_HEIGHT - margin.top - margin.bottom;
      const ratio = candleData.length === 0 ? 0 : value / volumeMax;
      const baseY = VOLUME_CHART_HEIGHT - margin.bottom;
      return baseY - ratio * chartHeight;
    },
    [volumeMax, candleData.length]
  );

  const scrollToEnd = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: Infinity,
        animated: true,
      });
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: CandleDatum; index: number }) => (
      <CombinedChartItem
        candle={item}
        index={index}
        barWidth={barWidth}
        barSpacing={barSpacing}
        candleYScale={candleYScale}
        volumeYScale={volumeYScale}
        volumeMax={volumeMax}
      />
    ),
    [candleYScale, volumeYScale, volumeMax, barWidth, barSpacing]
  );

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: barWidth + barSpacing,
      offset: (barWidth + barSpacing) * index,
      index,
    }),
    [barWidth, barSpacing]
  );

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <FlatList
          horizontal
          windowSize={5}
          ref={flatListRef}
          data={candleData}
          renderItem={renderItem}
          initialNumToRender={20}
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          initialScrollIndex={candleData.length - 1}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ marginHorizontal: horizontalMargin }}
          onContentSizeChange={() => {
            scrollToEnd();
          }}
        />
        <View style={styles.yAxisContainer}>
          <YAxis
            yMin={yMin}
            yMax={yMax}
            volumeMax={volumeMax}
            candleYScale={candleYScale}
            volumeYScale={volumeYScale}
          />
          <VolumeYAxis
            maxVolume={volumeMax}
            chartHeight={VOLUME_CHART_HEIGHT}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 0 },
  chartContainer: { flexDirection: "row" },
  yAxisContainer: { width: margin.right, height: TOTAL_CHART_HEIGHT },
});

export default CandleStickChart;
