import { z } from "zod";

export const zDerivations = z.enum([
  "Allowed-With-Credit",
  "Allowed-With-Indication",
  "Allowed-With-License-Passthrough",
  "Allowed-With-RevenueShare",
]);

export const zRevenueSharePercentage = z
  .number()
  .gt(0, {
    message: "Revenue share must be greater than 0",
  })
  .max(100, {
    message: "Revenue share may not be greater than 100",
  });

export const zCommercialUse = z.enum(["Allowed", "Allowed-With-Credit"]);

export const zLicenseType = z.enum(["Monthly", "One Time"]);

export const zLicenseFeeValue = z.number().gt(0, {
  message: "License fee must be greater than 0",
});

export const zLicenseFeeCurrency = z.enum(["AR"]);

export const zExpires = z
  .number()
  .int({
    message: "Expires must be a whole number of years",
  })
  .gt(0, {
    message: "Expires must be greater than 0",
  });

export const zPaymentAddress = z.string().min(1, {
  message: "Payment address cannot be empty",
});

export const zPaymentMode = z.enum([
  "Random-Distribution",
  "Global-Distribution",
]);

export const zUnspecified = z.enum(["Unspecified"]);

export const zUdlInputSchema = z
  .object({
    Derivations: z.union([zUnspecified, zDerivations]),
    "Revenue Share Percentage": z.union([
      z.coerce.number().pipe(zRevenueSharePercentage),
      z.string().length(0),
    ]),
    "Commercial Use": z.union([zUnspecified, zCommercialUse]),
    "License Type": z.union([zUnspecified, zLicenseType]),
    "License Fee Value": z.union([
      z.coerce.number().pipe(zLicenseFeeValue),
      z.string().length(0),
    ]),
    "License Fee Currency": z.union([z.enum(["$U"]), zLicenseFeeCurrency]),
    Expires: z.union([z.coerce.number().pipe(zExpires), z.string().length(0)]),
    "Payment Address": z.union([z.string().length(0), zPaymentAddress]),
    // "Payment Mode": z.union([zUnspecified, zPaymentMode]),
  })
  .refine(
    (data) =>
      !(
        data["Derivations"] === "Allowed-With-RevenueShare" &&
        typeof data["Revenue Share Percentage"] != "number"
      ),
    {
      message:
        "RevenueShare Percentage is required when derivation is Allowed-With-RevenueShare",
    }
  )
  .refine(
    (data) =>
      !(
        data["License Type"] !== "Unspecified" &&
        typeof data["License Fee Value"] != "number"
      ),
    {
      message: "Must have License Fee Value when License Type is set",
    }
  );
