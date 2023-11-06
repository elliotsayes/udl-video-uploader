import { genArweaveAPI } from "arseeding-js";
import { addressFromPublicKey } from "./arweave";

export const arseedingUploadFile = async (
  tag: string,
  file: File,
  tags: Record<string, string>
) => {
  const instance = await genArweaveAPI(window.arweaveWallet);
  const address = await addressFromPublicKey(instance.signer.publicKey);
  console.log({ instance, address });

  const arseedingUrl = import.meta.env.VITE_CONFIG_ARSEEDING_URL;

  const fileArrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(fileArrayBuffer);

  // const chainType = 'arweave';
  // const symbol = 'AR';
  // const id = await addressFromPublicKey(instance.signer.publicKey)
  // const tag = `${chainType}-${symbol}-${id}`;
  // const tag =
  //   "arweave,ethereum-ar-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,0x4fadc7a98f2dc96510e42dd1a74141eeae0c1543";

  const options = {
    tags: Object.entries(tags).map(([name, value]) => ({
      name,
      value,
    })),
  };

  console.log({ arseedingUrl, tag, options });
  const sendAndPayResult = await instance.sendAndPay(
    arseedingUrl,
    fileBuffer,
    tag,
    options
  );

  console.log({ sendAndPayResult });
  return sendAndPayResult;
};
