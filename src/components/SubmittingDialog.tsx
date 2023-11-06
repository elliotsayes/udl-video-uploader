import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Props {
  status?: string
}

export const SubmittingDialog = (props: Props) => {
  const {status} = props;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Submitting</DialogTitle>
        <DialogDescription>
          Your data is uploading...
        </DialogDescription>
      </DialogHeader>
      Submitting...
      {status}
    </DialogContent>
  )
}
