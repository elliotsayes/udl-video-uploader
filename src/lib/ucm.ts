const ucmContractTxId = "Of9pi--Gj7hCTawhgxOwbuWnFI1h24TTgO5pw8ENJNQ";

export const ucmTags = (address: string, title: string) => {
  return {
    "App-Name": "SmartWeaveContract",
    "App-Version": "0.3.0",
    "Contract-Src": ucmContractTxId,
    "Init-State": JSON.stringify({
      ticker: "ATOMIC",
      name: title,
      balances: { [address]: 100 },
      claimable: [],
    }),
    "Contract-Manifest": JSON.stringify({
      evaluationOptions: {
        sourceType: "redstone-sequencer",
        allowBigInt: true,
        internalWrites: true,
        unsafeClient: "skip",
        useConstructor: true,
      },
    }),
    "Indexed-By": "ucm",
  };
};
