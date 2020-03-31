export interface SixContents {
  columnHeaders: string;
  prices: Stock[];
  producedAt: string;
}

export interface Stock {
  shortName: string;
  isin: string;
  valorSymbol: string;
  closingPrice: number;
  lastDate: string;
}

export type Filetype = "bluechips" | "smcap";
