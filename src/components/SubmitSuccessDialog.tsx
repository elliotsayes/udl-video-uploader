import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VideoPreview } from "./VideoPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { config } from "@/config";
import { UploadResult } from "@/lib/upload";

interface Props {
  mainVideoResult: UploadResult;
  trailerVideoResult?: UploadResult;
}

const isArseeding = config.uploader === "arseeding";

export const SubmitSuccessDialog = (props: Props) => {
  const { mainVideoResult, trailerVideoResult } = props;

  const renderResult = (title: string, result: UploadResult) => {
    const url = isArseeding 
      ? `${config.arseedingUrl}/${result.id}`
      : `https://arweave.net/${result.id}`
    
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
              {
                isArseeding ? "Arseeding Gateway" : "Arweave Gateway"
              }
            </a>
            .
            (<span onClick={() => navigator.clipboard.writeText(result.id)}>copy #</span>)
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
