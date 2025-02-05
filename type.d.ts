export type CandleData = {
  x: Date;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
};

export interface YAxisProps {
  yMin: number;
  yMax: number;
  volumeMax: number;
  candleYScale: (value: number) => number;
  volumeYScale: (value: number) => number;
}

export interface CoinData {
  id: string;
  nameKr: string;
  nameEn: string;
  currentPrice: string;
  diffRate: string;
  diffAmount: string;
  volume: string;
}

export interface TickerData {
  code?: string;
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number; 
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

export interface CombinedChartItemProps {
  candle: CandleData;
  index: number;
  barWidth: number;
  barSpacing: number;
  candleYScale: (value: number) => number;
  volumeYScale: (value: number) => number;
  volumeMax: number;
}


interface CoinListProps {
  coinList: CoinData[];
}

export interface OrderBookScreenProps {
  orderBookData: OrderbookDataProps
  basePrice: string
}

export interface OrderBookItemProps {
  askPrice: number;
  askVolume: number;
  basePrice: string;
}
export interface MarketData {
  id: string;
  nameEn: string;
  change_rate: number;
    currentPrice: string;
  diffAmountdiffAmount: number;
}
export interface OrderbookUnit {
  ask_price: number;
  ask_size: number;
  bid_price: number;
  bid_size: number;
}

export interface OrderbookData {
  code: string;
  level: number;
  orderbook_units: OrderbookUnit[];
  stream_type: "REALTIME" | string;
  timestamp: number;
  total_ask_size: number;
  total_bid_size: number;
  type: "orderbook" | string;
}

export interface AskOrderBookData {
  ask_price: number;
  ask_size: number;
}

export interface OrderBookScreenProps {
  orderBookData?: OrderbookData;
  basePrice: string;
}

export interface OrderBookItemProps {
  askPrice: number;
  askVolume: number;
  basePrice: string;
  isTopHalf: boolean;
}