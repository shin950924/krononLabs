export function formatToMillion(value: number): string {
  const millionValue = value / 1_000_000;
  return millionValue.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + "백만";
}

export const formatDateKST = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    hour12: false,
  });
  return formatter.format(date);
};