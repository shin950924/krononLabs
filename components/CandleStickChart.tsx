import {
  margin,
  TOTAL_CHART_HEIGHT,
  CANDLE_CHART_HEIGHT,
  VOLUME_CHART_HEIGHT,
} from "@/const";
import { YAxis } from "./YAxis";
import { CandleData } from "@/type";
import VolumeYAxis from "./VolumeYAxis";
import CombinedChartItem from "./CombinedChartItem";
import { FlatList, StyleSheet, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";

interface CandleStickChartProps {
  candleData: CandleData[];
}

const CandleStickChart: React.FC<CandleStickChartProps> = ({ candleData }) => {
  const flatListRef = useRef<FlatList>(null);

  const barWidth = 40;
  const barSpacing = 0;
  const horizontalMargin = 13;

  const contentWidth = useMemo(() => {
    return (
      candleData.length * (barWidth + barSpacing) -
      barSpacing +
      horizontalMargin * 2
    );
  }, [candleData.length, barWidth, barSpacing, horizontalMargin]);

  const { yMin, yMax } = useMemo(() => {
    const values = candleData.flatMap((d) => [d.open, d.close, d.high, d.low]);
    if (values.length === 0) return { yMin: 0, yMax: 0 };
    return { yMin: Math.min(...values), yMax: Math.max(...values) };
  }, [candleData]);

  const volumeMax = useMemo(() => {
    if (candleData.length === 0) return 0;
    return Math.max(...candleData.map((d) => (isNaN(d.volume) ? 0 : d.volume)));
  }, [candleData]);

  const candleYScale = useCallback(
    (value: number): number => {
      if (yMax === yMin) return margin.top;
      const chartHeight = CANDLE_CHART_HEIGHT - margin.top - margin.bottom;
      const ratio = (value - yMin) / (yMax - yMin);
      return CANDLE_CHART_HEIGHT - margin.bottom - ratio * chartHeight;
    },
    [yMin, yMax]
  );

  const volumeYScale = useCallback(
    (value: number): number => {
      const chartHeight = VOLUME_CHART_HEIGHT - margin.top - margin.bottom;
      const ratio = candleData.length === 0 ? 0 : value / volumeMax;
      const baseY = VOLUME_CHART_HEIGHT - margin.bottom;
      return baseY - ratio * chartHeight;
    },
    [volumeMax, candleData.length]
  );

  const scrollToEnd = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: Infinity,
        animated: true,
      });
    }
  }, []);

  const handleContentSizeChange = useCallback(() => {
    scrollToEnd();
  }, [scrollToEnd]);

  const renderItem = useCallback(
    ({ item, index }: { item: CandleData; index: number }) => (
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
          onContentSizeChange={handleContentSizeChange}
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
