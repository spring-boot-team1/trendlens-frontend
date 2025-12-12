export type OutfitPiece = {
  item: string;
  size?: string;
  fit?: string;
  comment?: string;
};

export type OutfitAccessory = {
  item: string;
  comment?: string;
};

export type FashionOutfit = {
  name: string;
  styleKeywords: string[];
  top?: OutfitPiece;
  bottom?: OutfitPiece;
  outer?: OutfitPiece;
  shoes?: OutfitPiece;
  accessories?: OutfitAccessory[];
};

export type FashionRecommendResult = {
  summary: string;
  outfits: FashionOutfit[];
};
