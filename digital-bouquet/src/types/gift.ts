export type GiftPhoto = {
  url: string;
  caption: string;
};

export type GiftPayload = {
  receiverName: string;
  senderName: string;
  photos: Array<GiftPhoto | string>;
  spotifyUrl: string;
  letter: string;
  pin?: string;
};
