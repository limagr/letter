export interface Letter {
  id: string;
  sender: string;
  recipient: string;
  originAddress: string;
  destinationAddress: string;
  message: string;
  sentAt: number;
  deliveryTime: number; // in seconds
  status: 'transit' | 'delivered';
  customization?: {
    paper: string;
    font: string;
    stickers: {
      id: string;
      emoji: string;
      position: {
        x: number;
        y: number;
      }
    }[];
  }
}

export interface DistanceResponse {
  distance: {
    text: string;
    value: number; // meters
  };
  duration: {
    text: string;
    value: number; // seconds
  };
  status: string;
} 