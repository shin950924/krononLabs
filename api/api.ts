// network.ts
import { CandleData } from "@/type";

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