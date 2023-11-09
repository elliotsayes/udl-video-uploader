export const config = {
  arseedingUrl: import.meta.env.VITE_CONFIG_ARSEEDING_URL,
  arseedingDefaultSymbol: import.meta.env.VITE_CONFIG_ARSEEDING_DEFAULT_SYMBOL,
  bundlrNode: import.meta.env.VITE_CONFIG_BUNDLR_NODE,
  uploader: import.meta.env.VITE_CONFIG_UPLOADER as "arseeding" | "bundlr",
  rendererTxId: import.meta.env.VITE_CONFIG_RENDERER_TX_ID,
};
