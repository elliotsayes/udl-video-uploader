import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoUpload } from "./VideoUpload"
import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { UdlForm } from "./UdlForm"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { UdlTable } from "./UdlTable"
import { useMachine } from "@xstate/react"
import { uploadPageMachine } from "@/machines/upload_page"
import { loadEverpayTokens } from "@/lib/everpay"
import { Dialog } from "@/components/ui/dialog"
import { EverpayDialog } from "./EverpayDialog"
import { SubmittingDialog } from "./SubmittingDialog"
import { SubmitSuccessDialog } from "./SubmitSuccessDialog"
import { uploadVideos } from "@/lib/upload"
import { SubmitFailureDialog } from "./SubmitFailureDialog"

export const UploadPage = () => {
  const [current, send] = useMachine(
    () => uploadPageMachine({}),
    {
      services: {
        loadEverpayTokens: async () => ({
          everpayTokens: await loadEverpayTokens(),
        }),
        submitToEverpay: (context) => (send) => {
          const { mainVideo, trailerVideo, udlTags, everpayTokens, uploadSymbol } = context;
          send({ type: "update submitting", data: { message: "Starting upload process..." }})

          uploadVideos(mainVideo!, udlTags!, everpayTokens!, uploadSymbol!, (message) => send({ type: "update submitting", data: { message }}), trailerVideo).then((data) => {
            console.log({data})
            send({ type: 'upload success', data })
          }).catch((uploadError) => {
            console.error({uploadError})
            send({ type: 'upload failed', data: { uploadError } })
          });
        }
      },
    }
  )

  const [isUdlSheetOpen, setIsUdlSheetOpen] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  return (
    <div className="max-h-screen overflow-y-scroll px-2 sm:px-8">
      <Card className="mx-auto max-w-3xl my-4 sm:my-8">
        <CardHeader>
          <CardTitle>Arseeding UDL Video Uploader</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-stretch">
          <div className="flex flex-col lg:flex-row gap-4 lg:justify-stretch">
            <VideoUpload
              title={"Main Video"}
              subtitle={"Select your main video"}
              file={current.context.mainVideo}
              onFile={(mainVideo) => send({ type: 'main video set', data: { mainVideo } })}
              onClear={() => send({ type: 'main video cleared' })}
              disabled={!current.matches('configuring')}
            />
            <VideoUpload
              title={"Trailer"}
              subtitle={"Select trailer video (optional)"}
              file={current.context.trailerVideo}
              onFile={(trailerVideo) => send({ type: 'trailer video set', data: { trailerVideo } })}
              onClear={() => send({ type: 'trailer video cleared' })}
              disabled={!current.matches('configuring')}
            />
          </div>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>UDL Config</CardTitle>
              <CardDescription>
                Configure{' '}
                <a 
                  href="https://wiki.arweave.dev/#/en/Universal-Data-License-How-to-use-it"
                  target="_blank"
                  className="underline"
                >
                  Universal Data License
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent className="relative flex flex-col items-center">
              {
                current.matches("configuring.udlConfig.hasConfig") && (
                  <UdlTable
                    tags={current.context.udlTags ?? {}}
                  />
                )
              }
              <div className="pt-4 flex flex-row gap-4">
                <Button
                  variant={"secondary"}
                  onClick={() => setIsUdlSheetOpen(true)}
                  disabled={!current.matches('configuring')}
                >
                  {
                    current.matches("configuring.udlConfig.hasConfig") ? "Modify UDL" : "Add UDL"
                  }
                </Button>
                {
                  current.matches("configuring.udlConfig.hasConfig") && (
                    <Button
                      variant={"destructive"}
                      onClick={() => send({ type: 'udl config cleared' })}
                    >
                      Clear UDL
                    </Button>
                  )
                }
              </div>
            </CardContent>
          </Card>
          <Button
            size={"lg"}
            onClick={() => setIsSubmitDialogOpen(true)}
            className={`mx-auto ${current.can({ type: "confirm symbol", data: { symbol: "AR" } }) && current.matches('configuring.udlConfig.hasConfig') ? 'animate-pulse' : ''}`}
            disabled={!current.can({ type: "confirm symbol", data: { symbol: "AR" } })}
          >
            Upload With Everpay
          </Button>
        </CardContent>
      </Card>
      <Sheet
        open={isUdlSheetOpen}
        onOpenChange={setIsUdlSheetOpen}
        modal={true}
      >
        <SheetContent
          side="bottom"
          className="max-w-full"
        >
          <SheetHeader className="max-w-screen-sm mx-auto">
            <SheetTitle className='min-w-full '>
              <div className="text-left">
                UDL Configuration
              </div>
              {/* {selectedItem?.settings.label && <> - <code>{selectedItem?.settings.label}</code></>} */}
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[60vh] w-full pr-4 overflow-y-auto">
            <div className="mx-auto max-w-screen-sm">
              <UdlForm
                initialValues={current.context.udlConfig ?? {}}
                onSubmit={(udlConfig) => {
                  send({ type: 'udl config set', data: { udlConfig } })
                  setIsUdlSheetOpen(false);
                }}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      <Dialog
        open={isSubmitDialogOpen || current.matches('submitting')}
        onOpenChange={setIsSubmitDialogOpen}
        modal={true}
      >
        {
          current.matches('configuring') && current.context.everpayTokens !== undefined && (
            <EverpayDialog 
              symbols={current.context.everpayTokens.map((token) => token.symbol)}
              onSubmit={(symbol) => send({ type: 'confirm symbol', data: { symbol } })}      
            />
          )
        }
        {
          current.matches('submitting') && (
            <SubmittingDialog
              submitLog={current.context.submitLog}
            />
          )
        }
        {
          current.matches('upload success') && (
            <SubmitSuccessDialog 
              mainVideoResult={current.context.mainVideoResult!}
              trailerVideoResult={current.context.trailerVideoResult}              
            />
          )
        }
        {
          current.matches('upload failure') && (
            <SubmitFailureDialog 
              error={current.context.uploadError}         
            />
          )
        }
      </Dialog>
    </div>
  )
}
