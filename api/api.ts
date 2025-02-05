// network.ts
import { CandleData, TickerData } from "@/type";

const BASE_URL = "https://api.upbit.com/v1/";

export async function fetchMinuteCandles(
  market: string,
  count: number = 200
): Promise<CandleData[]> {
  const endpoint = `${BASE_URL}candles/minutes/1?market=${market}&count=${count}`;
  const response = await fetch(endpoint);
  const json = await response.json();
  return json;
}

export async function fetchMarketList(): Promise<CandleData[]> {
  const endpoint = `${BASE_URL}market/all?is_details=true`;
  const response = await fetch(endpoint);
  const json = await response.json();
  return json;
}

export async function fetchMarketPrice(marketListStr: string): Promise<TickerData[]> {
  const endpoint = `${BASE_URL}ticker?markets=${marketListStr}`;
  const response = await fetch(endpoint);
  const json = await response.json();
  return json;
}