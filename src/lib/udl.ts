import { z } from "zod";
import { zExpires, zPaymentAddress, zUdlInputSchema } from "@/types/udl";

export const udlConfigToTags = (
  config: z.infer<typeof zUdlInputSchema>
): Record<string, string> => {
  const tags: Record<string, string> = {};

  if (config.Derivations === "Allowed-With-RevenueShare") {
    tags[
      "Derivation"
    ] = `Allowed-With-RevenueShare-${config["Revenue Share Percentage"]}%`;
  } else if (config.Derivations !== "Unspecified") {
    tags["Derivation"] = config.Derivations;
  }

  if (config["Commercial Use"] !== "Unspecified") {
    tags["Commercial-Use"] = config["Commercial Use"];
  }

  if (config["License Type"] !== "Unspecified") {
    tags[
      "License-Fee"
    ] = `${config["License Type"]}-${config["License Fee Value"]}`;
    if (config["License Fee Currency"] !== "$U") {
      tags["Currency"] = config["License Fee Currency"];
    }
  }

  if (
    (config["Derivations"] !== "Unspecified" ||
      config["License Type"] !== "Unspecified") &&
    zPaymentAddress.safeParse(config["Payment Address"]).success
  ) {
    tags["Payment-Address"] = config["Payment Address"];
  }

  if (zExpires.safeParse(config.Expires).success) {
    tags["Expires"] = config.Expires.toString();
  }

  console.log({ config, tags });

  return tags;
};
