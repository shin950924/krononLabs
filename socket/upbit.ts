// UpbitSocketManager.ts
export type SocketCallback = (data: any) => void;

export class UpbitSocketManager {
  private ws: WebSocket | null = null;
  private subscribers: SocketCallback[] = [];
  private static instance: UpbitSocketManager;
  private subscriptionType: "ticker" | "candle" | null = null;

  private constructor() {
    this.connect();
  }

  public static getInstance(): UpbitSocketManager {
    if (!UpbitSocketManager.instance) {
      UpbitSocketManager.instance = new UpbitSocketManager();
    }
    return UpbitSocketManager.instance;
  }

  private connect() {
    const SOCKET_URL = "wss://api.upbit.com/websocket/v1";
    this.ws = new WebSocket(SOCKET_URL);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    console.log("WebSocket 연결 열림");
    if (this.subscriptionType) {
      this.sendSubscriptionMessage(this.subscriptionType);
    }
  }

  private sendSubscriptionMessage(type: "ticker" | "candle") {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    if (type === "ticker") {
      const tickerSubscribeMessage = [
        { ticket: "UNIQUE_TICKET" },
        {
          type: "ticker",
          codes: [
            "KRW-XRP",
            "KRW-BTC",
            "KRW-DOGE",
            "KRW-USDT",
            "KRW-ETH",
            "KRW-SOL",
            "KRW-ONDO",
            "KRW-ADA",
            "KRW-QTUM",
            "KRW-SHIB",
            "KRW-LINK",
            "KRW-AQT",
            "KRW-JUP",
          ],
        },
        { format: "DEFAULT" },
      ];
      this.ws.send(JSON.stringify(tickerSubscribeMessage));
      console.log("티커 구독 메시지 전송 완료");
    } else if (type === "candle") {
      const candleSubscribeMessage = [
        { ticket: "UNIQUE_TICKET" },
        {
          type: "candle.1s",
          codes: [
            "KRW-BTC",
          ],
        },
        { format: "DEFAULT" },
      ];
      this.ws.send(JSON.stringify(candleSubscribeMessage));
      console.log("candle.1s 구독 메시지 전송 완료");
    }
  }

  public subscribeType(type: "ticker" | "candle") {
    this.subscriptionType = type;
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendSubscriptionMessage(type);
    }
  }

  private onMessage(event: MessageEvent) {
    let message: string = "";
    if (event.data instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => {
        message = reader.result as string;
        this.handleMessage(message);
      };
      reader.onerror = (err) => {
        console.error("Blob 읽기 에러:", err);
      };
      reader.readAsText(event.data);
    }
    else if (event.data instanceof ArrayBuffer) {
      message = new TextDecoder("utf-8").decode(event.data);
      this.handleMessage(message);
    } else if (typeof event.data === "string") {
      message = event.data;
      this.handleMessage(message);
    } else {
      console.warn("알 수 없는 데이터 형식:", event.data);
    }
  }

  private handleMessage(message: string) {
    try {
      const data = JSON.parse(message);
      this.subscribers.forEach((callback) => callback(data));
    } catch (error) {
      console.error("데이터 파싱 에러:", error);
    }
  }

  private onError(event: Event) {
    console.error("WebSocket 에러:", event);
  }

  private onClose(event: CloseEvent) {
    console.log("WebSocket 연결 종료:", event.code, event.reason);
    this.ws = null;
  }

  public subscribe(callback: SocketCallback) {
    this.subscribers.push(callback);
  }

  public unsubscribe(callback: SocketCallback) {
    this.subscribers = this.subscribers.filter((cb) => cb !== callback);
  }
}