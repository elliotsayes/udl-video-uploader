import { zCommercialUse, zDerivations, zLicenseFeeCurrency, zLicenseType, zUdlInputSchema } from "@/types/udl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { ResetIcon } from "@radix-ui/react-icons"

export const UdlForm = () => {
  const form = useForm<z.infer<typeof zUdlInputSchema>>({
    resolver: zodResolver(zUdlInputSchema),
    defaultValues: {
      Derivations: "Unspecified",
      "Commercial Use": "Unspecified",
      "License Type": "Unspecified",
      "License Fee Value": "",
      "License Fee Currency": "$U",
      "Revenue Share Percentage": "",
      Expires: "",
      "Payment Address": "",
      // "Payment Mode": 'Unspecified',
    },
  })

  const [isRevenueShare, setIsRevenueShare] = useState(false)
  const [isLicense, setIsLicense] = useState(false)

  form.watch((value) => {
    value["Derivations"] === 'Allowed-With-RevenueShare' ? setIsRevenueShare(true) : setIsRevenueShare(false)
    value["License Type"] !== "Unspecified" ? setIsLicense(true) : setIsLicense(false)
  })

  function onSubmit(values: z.infer<typeof zUdlInputSchema>) {
    console.log(values)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSelect = (field: any, title: string, description: string, options: string[], firstOption?: string) => {
    return (
      <FormItem className="pt-8">
        <FormLabel>{title}</FormLabel>
        <Select onValueChange={field.onChange} value={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectContent />
              { 
                firstOption && <SelectItem key={firstOption} value={firstOption}>{firstOption}</SelectItem>
              }
              {
                options.map((option) => {
                  return <SelectItem key={option} value={option}>{option}</SelectItem>
                })
              }
          </SelectContent>
        </Select>
        <FormDescription>
          {description}
        </FormDescription>
        <FormMessage />
      </FormItem>
    )
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:gap-8">
            <FormField
              control={form.control}
              name={"Derivations"}
              render={({ field }) => renderSelect(field, 'Derivations', 'Rights to make derivative works', zDerivations.options, 'Unspecified')}
            />
            <div className={`flex ${isRevenueShare ? 'h-32 pt-8 opacity-100' : 'h-0 opacity-0 overflow-hidden'} transition-all duration-200`}>
              <FormField
                control={form.control}
                name={"Revenue Share Percentage"}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Revenue Share Percentage</FormLabel>
                    <FormControl>
                      <div className="flex flex-row items-center">
                        <Input placeholder="10" {...field} />
                        <span className="pl-2">%</span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Revenue from derivations
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name={"Commercial Use"}
            render={({ field }) => renderSelect(field, 'Commercial Use', 'Terms required for commercial use', zCommercialUse.options, 'Unspecified')}
          />
          <FormField
            control={form.control}
            name={"License Type"}
            render={({ field }) => renderSelect(field, 'License Type', 'Required payment terms for licensing the content', zLicenseType.options, 'Unspecified')}
          />
          <div className={`flex flex-col md:flex-row md:gap-8 ${isLicense ? 'h-72 md:h-36 opacity-100' : 'h-0 opacity-0 overflow-hidden'} transition-all duration-200`}>
            <FormField
              control={form.control}
              name={"License Fee Currency"}
              render={({ field }) => renderSelect(field, 'License Fee Currency', 'Type of currency required', zLicenseFeeCurrency.options, '$U')}
            />
            <FormField
              control={form.control}
              name={"License Fee Value"}
              render={({ field }) => (
                <FormItem className="pt-8">
                  <FormLabel>License Fee Value</FormLabel>
                  <FormControl>
                    <Input placeholder="0.1" {...field} />
                  </FormControl>
                  <FormDescription>
                    Value of currency required
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={`${isRevenueShare || isLicense ? 'h-36 pt-8 opacity-100' : 'h-0 opacity-0 overflow-hidden'} transition-all duration-200`}>
            <FormField
              control={form.control}
              name={"Payment Address"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Address</FormLabel>
                  <FormControl>
                    <Input placeholder={"vLRHFq..."} {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional, uses your wallet address if not specified.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name={"Payment Mode"}
              render={({ field }) => renderSelect(field, 'Payment Mode', '<description>', zPaymentMode.options, 'Unspecified')}
            /> */}
          </div>
          <FormField
            control={form.control}
            name={"Expires"}
            render={({ field }) => (
              <FormItem className="pt-8">
                <FormLabel>Expiry (years)</FormLabel>
                <FormControl>
                  <Input placeholder="5" {...field} />
                </FormControl>
                <FormDescription>
                  Number of years until the license expires (optional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-8 flex flex-row justify-between items-center gap-4">
            <Button
              size={"icon"}
              className="invisible"
            />
            <Button
              type="submit"
              variant={"default"}
              size={"lg"}
            >
              Submit
            </Button>
            <Button
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty}
              variant={"destructive"}
              size={"icon"}
              aria-description="Reset form"
            >
              <ResetIcon />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
