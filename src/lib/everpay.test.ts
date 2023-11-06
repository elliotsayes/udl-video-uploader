import { test } from "bun:test";
import {
  getSymbolFirstTag,
  getTokenSymbols,
  loadEverpayTokens,
} from "./everpay";

test("tokens", async () => {
  const tokens = await loadEverpayTokens();
  const symbols = getTokenSymbols(tokens);
  console.log({ symbols });
  const tags = symbols.map((symbol) => ({
    symbol,
    tags: getSymbolFirstTag(tokens, symbol),
  }));
  console.log({ tags });
});
