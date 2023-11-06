import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

interface Props {
  symbols: string[]
  onSubmit: (symbol: string) => void
}

export const EverpayDialog = (props: Props) => {
  const { symbols, onSubmit } = props;
  
  const form = useForm<{
    token: string
  }>({
    defaultValues: {
      token: 'AR',
    },
  })

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Upload with Everpay</DialogTitle>
        <DialogDescription>
          Select the token to use in your{' '}
            <a href="https://app.everpay.io/" target="_blank" className="underline">
              Everpay account
            </a>
          .
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => onSubmit(values.token))}>
          <FormField
            control={form.control}
            name={"token"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-[40vh]">
                    <SelectContent />
                      {
                        symbols.map((option) => {
                          return <SelectItem key={option} value={option}>{option}</SelectItem>
                        })
                      }
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select a token to use
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit"
            className="mt-8"
          >
            Upload Now
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
