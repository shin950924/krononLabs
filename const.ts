import { Dimensions } from "react-native";

export const HEIGHT = Dimensions.get('screen').height
export const CANDLE_CHART_HEIGHT = (HEIGHT - 300) * 0.6
export const VOLUME_CHART_HEIGHT = (HEIGHT - 300) * 0.4
export const TOTAL_CHART_HEIGHT = CANDLE_CHART_HEIGHT + VOLUME_CHART_HEIGHT;

export const candleGap = 10;
export const candleWidth = 40;

export const margin = { top: 20, right: 40, bottom: 40, left: 40 };