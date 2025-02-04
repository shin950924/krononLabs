export type CandleDatum = {
  x: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

export interface CandleItemProps {
  candle: CandleDatum;
  index: number;
  candleYScale: (value: number) => number;
  volumeYScale: (value: number) => number;
  volumeMax: number;
}

export interface YAxisProps {
  yMin: number;
  yMax: number;
  volumeMax: number;
  candleYScale: (value: number) => number;
  volumeYScale: (value: number) => number;
}

interface VolumeChartProps {
  candleData: {
    x: Date;
    open: number;
    close: number;
    volume: number;
  }[];
  scrollX: number;
  barWidth: number;
  barSpacing: number;
}

export interface ICoinData {
  id: string;
  nameKr: string;
  nameEn: string;
  currentPrice: string;
  diffRate: string;
  diffAmount: string;
  volume: string;
}

export interface ITickerData {
  code: string;
  trade_price: number;
  signed_change_rate: number;
  signed_change_price: number;
  acc_trade_price_24h: number;
}