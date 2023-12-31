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
import { SubmitFailureDialog } from "./SubmitFailureDialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { uploadVideosToArseeding } from "@/lib/arseeding"
import { config } from "@/config"
import { uploadVideosToBundlr } from "@/lib/bundlr"

const isArseeding = config.uploader === "arseeding"

export const UploadPage = () => {
  const [current, send] = useMachine(
    () => uploadPageMachine({
      isArseeding: isArseeding
    }),
    {
      guards: {
        isArseeding: () => isArseeding,
      },
      services: {
        loadEverpayTokens: async () => ({
          everpayTokens: await loadEverpayTokens(),
        }),
        runUploadProcess: (context) => (send) => {
          const { mainVideo, trailerVideo, udlTags, everpayTokens, uploadSymbol } = context;
          const log = (message: string) => send({ type: "update submitting", data: { message }})
          log("Starting upload process...")

          if (isArseeding) {
            uploadVideosToArseeding(mainVideo!, everpayTokens!, uploadSymbol!, udlTags, trailerVideo, log).then((data) => {
              console.log({data})
              send({ type: 'upload success', data })
            }).catch((uploadError) => {
              console.error({uploadError})
              send({ type: 'upload failed', data: { uploadError } })
            });
          } else {
            uploadVideosToBundlr(mainVideo!, "arweave", udlTags, trailerVideo, log).then((data) => {
              console.log({data})
              send({ type: 'upload success', data })
            })
            .catch((uploadError) => {
              console.error({uploadError})
              send({ type: 'upload failed', data: { uploadError } })
            });
          }
        }
      },
    }
  )

  const canSumbit = current.can({ type: "confirm symbol", data: { symbol: "AR" } });

  const [isUdlSheetOpen, setIsUdlSheetOpen] = useState(false)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)

  return (
    <div>
      <Card className="mx-auto max-w-md lg:max-w-3xl text-left">
        <CardHeader>
          <CardTitle>UDL Video Uploader</CardTitle>
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
          <div className="mx-auto pt-6">
            <TooltipProvider>
              <Tooltip
                delayDuration={canSumbit ? 500 : 200}
              >
                <TooltipTrigger
                  disabled={!canSumbit}
                  className={`${canSumbit ? '' : ' cursor-not-allowed'}`}
                >
                  {
                    isArseeding ? (
                      <Button
                        size={"lg"}
                        onClick={() => setIsSubmitDialogOpen(true)}
                        className={`${canSumbit && current.matches('configuring.udlConfig.hasConfig') ? 'animate-pulse' : ''}`}
                        disabled={!canSumbit}
                      >
                        Upload With Everpay
                      </Button>
                    ) : (
                      <Button
                        size={"lg"}
                        onClick={() => send({type: "confirm symbol", data: { symbol: "AR" }})}
                        className={`${canSumbit && current.matches('configuring.udlConfig.hasConfig') ? 'animate-pulse' : ''}`}
                        disabled={!canSumbit}
                      >
                        Upload With Bundlr
                      </Button>
                    )
                  }
                </TooltipTrigger>
                <TooltipContent>
                  {
                    canSumbit ? (
                      "Click to Upload!"
                    ) : (
                      "Requires Main Video"
                    )
                  }
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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
        open={isSubmitDialogOpen || current.matches('submitting') || current.matches('upload success') || current.matches('upload failure')}
        onOpenChange={setIsSubmitDialogOpen}
        modal={true}
      >
        {
          current.matches('configuring') && current.context.everpayTokens !== undefined && (
            <EverpayDialog 
              size={(current.context.trailerVideo?.size ?? 0) + (current.context.mainVideo?.size ?? 0)}
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
              error={current.context.uploadError as Error}         
            />
          )
        }
      </Dialog>
    </div>
  )
}
