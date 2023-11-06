import Everpay, { Token } from "everpay";

const everpay = new Everpay();

export const loadEverpayTokens = async () => {
  const info = await everpay.info();
  return info.tokenList;
};

export const getTokenSymbols = (tokens: Token[]) => {
  const symbols = tokens.map((item) => item.symbol).sort();
  return symbols;
};

export const getSymbolFirstTag = (tokens: Token[], symbol: string) => {
  return tokens.find(
    (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
  )?.tag;
};

export const getSymbolTags = (tokens: Token[], symbol: string) => {
  const tags = tokens
    .map((item) => {
      if (item.symbol.toLowerCase() === symbol.toLowerCase()) {
        return item.tag;
      }
      return undefined;
    })
    .filter(Boolean);
  return tags as string[];
};
