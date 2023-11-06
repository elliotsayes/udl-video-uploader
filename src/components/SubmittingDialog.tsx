import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Props {
  status?: string
}

export const SubmittingDialog = (props: Props) => {
  const {status} = props;

  return (
    <DialogContent className="sm:max-w-[425px]" hasCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Uploading with Everpay</DialogTitle>
        <DialogDescription>
          Please wait while your data is uploading...
        </DialogDescription>
      </DialogHeader>
      Submitting...
      {status}
    </DialogContent>
  )
}
