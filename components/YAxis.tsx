import React from "react";
import { YAxisProps } from "@/type";
import { Text } from "react-native-svg";
import Svg, { TSpan } from "react-native-svg";
import { CANDLE_CHART_HEIGHT, margin } from "@/const";

export const YAxis: React.FC<YAxisProps> = React.memo(
  ({ yMin, yMax, volumeMax, candleYScale, volumeYScale }) => (
    <Svg width={margin.right} height={CANDLE_CHART_HEIGHT}>
      <Text
        x={margin.right - 5}
        y={candleYScale(yMax)}
        fontSize="10"
        fill="white"
        textAnchor="middle"
      >
        <TSpan>{yMax.toFixed(1)}</TSpan>
      </Text>
      <Text
        x={margin.right - 5}
        y={candleYScale((yMax + yMin) / 2)}
        fontSize="10"
        fill="white"
        textAnchor="middle"
      >
        {((yMax + yMin) / 2).toFixed(1)}
      </Text>
      <Text
        x={margin.right - 5}
        y={candleYScale(yMin)}
        fontSize="10"
        fill="white"
        textAnchor="middle"
      >
        {yMin.toFixed(1)}
      </Text>
    </Svg>
  )
);
