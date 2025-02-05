import { View } from "react-native";
import React, { memo, useMemo } from "react";
import { CombinedChartItemProps } from "@/type";
import { formatDateKST } from "@/function/function";
import Svg, { Line, Rect, Text } from "react-native-svg";
import { CANDLE_CHART_HEIGHT, VOLUME_CHART_HEIGHT } from "@/const";

const CombinedChartItem: React.FC<CombinedChartItemProps> = memo(
  ({
    candle,
    index,
    barWidth,
    barSpacing,
    candleYScale,
    volumeYScale,
    volumeMax,
  }) => {
    // 컨테이너 너비 계산
    const containerWidth = useMemo(
      () => barWidth + barSpacing,
      [barWidth, barSpacing]
    );

    // inline style도 메모이제이션 처리
    const containerStyle = useMemo(
      () => ({ width: containerWidth }),
      [containerWidth]
    );

    const { open, close, high, low, volume, x } = candle;
    const centerX = useMemo(() => containerWidth / 2, [containerWidth]);

    // 캔들 차트 관련 좌표 계산
    const openY = candleYScale(open);
    const closeY = candleYScale(close);
    const highY = candleYScale(high);
    const lowY = candleYScale(low);

    const bodyTop = useMemo(() => Math.min(openY, closeY), [openY, closeY]);
    const bodyHeight = useMemo(
      () => Math.abs(closeY - openY) || 1,
      [closeY, openY]
    );

    const fillColor = useMemo(() => {
      if (open < close) return "red";
      if (open > close) return "blue";
      return "red";
    }, [open, close]);

    const safeVolume = useMemo(() => (isNaN(volume) ? 0 : volume), [volume]);
    const volumeBarTop = useMemo(
      () => volumeYScale(safeVolume),
      [safeVolume, volumeYScale]
    );

    const volumeBarHeight = useMemo(
      () => VOLUME_CHART_HEIGHT - volumeBarTop,
      [volumeBarTop]
    );

    return (
      <View style={containerStyle}>
        <Svg width={containerWidth} height={CANDLE_CHART_HEIGHT}>
          <Line
            x1={centerX}
            y1={highY}
            x2={centerX}
            y2={lowY}
            stroke={fillColor}
            strokeWidth={2}
          />
          <Rect
            x={centerX - barWidth / 2}
            y={bodyTop}
            width={barWidth}
            height={bodyHeight}
            fill={fillColor}
          />
          {index % 6 === 0 && (
            <Text
              x={centerX}
              y={CANDLE_CHART_HEIGHT - 5}
              fontSize={10}
              fill="white"
              textAnchor="middle"
            >
              {formatDateKST(x)}
            </Text>
          )}
        </Svg>
        <Svg width={containerWidth} height={VOLUME_CHART_HEIGHT}>
          <Rect
            x={centerX - barWidth / 2}
            y={volumeBarTop}
            width={barWidth}
            height={volumeBarHeight}
            fill={fillColor}
            stroke="#000"
            strokeWidth={1}
          />
        </Svg>
      </View>
    );
  }
);

export default CombinedChartItem;
