import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SendAndPayResult } from "@/lib/arseeding";
import { VideoPreview } from "./VideoPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  mainVideoResult: SendAndPayResult;
  trailerVideoResult?: SendAndPayResult;
}

export const SubmitSuccessDialog = (props: Props) => {
  const { mainVideoResult, trailerVideoResult } = props;

  const renderResult = (title: string, result: SendAndPayResult) => {
    const url = `${import.meta.env.VITE_CONFIG_ARSEEDING_URL}/${result.order.itemId}`;
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {/* <CardDescription>{subtitle}</CardDescription> */}
        </CardHeader>
        <CardContent className="relative flex flex-col items-center">
        <VideoPreview 
            controls={true}
            url={url}
          />
          <p>
            Open on{' '}
            <a
              href={url}
              target="_blank"
              className="underline"
            >
              Arseeding Gateway
            </a>
            .
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <DialogContent hasCloseButton={false}>
      <DialogHeader>
        <DialogTitle className="text-xl">Successfully Uploaded!</DialogTitle>
        {/* <DialogDescription>
          Yay :)
        </DialogDescription> */}
      </DialogHeader>
      <div className="flex flex-col gap-4">
        {renderResult('Main Video', mainVideoResult)}
        {trailerVideoResult && renderResult('Trailer Video', trailerVideoResult)}
      </div>
    </DialogContent>
  )
}
