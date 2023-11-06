import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SendAndPayResult } from "@/lib/arseeding";

interface Props {
  mainVideoResult: SendAndPayResult;
  trailerVideoResult?: SendAndPayResult;
}

export const SubmitSuccessDialog = (props: Props) => {
  const { mainVideoResult, trailerVideoResult } = props;

  return (
    <DialogContent className="sm:max-w-[425px]" hasCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Successfully Uploadded!</DialogTitle>
        <DialogDescription>
          Please wait while your data is uploading...
        </DialogDescription>
      </DialogHeader>
      <pre>
        {JSON.stringify(mainVideoResult, undefined, 2)}
      </pre>
      <pre>
        {JSON.stringify(trailerVideoResult, undefined, 2)}
      </pre>
    </DialogContent>
  )
}
