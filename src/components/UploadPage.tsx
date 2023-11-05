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
import { zUdlInputSchema } from "@/types/udl"
import { z } from "zod"
import { UdlTable } from "./UdlTable"
import { udlConfigToTags } from "@/lib/udl"

export const UploadPage = () => {
  const [isUdlSheetOpen, setIsUdlSheetOpen] = useState(false)
  const [udlValues, setUdlValues] = useState<z.infer<typeof zUdlInputSchema> | undefined>(undefined)
  const [udlTags, setUdlTags] = useState<Record<string, string>>({})
  const hasTags = Object.keys(udlTags).length > 0

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Arseeding UDL Video Uploader</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <div className="flex flex-col lg:flex-row gap-4">
            <VideoUpload
              title={"Main Video"}
              subtitle={"Select your main video"}
              hasFile={false}
              onFile={function (file): void {
                console.error("Function not implemented.", file)
              }}
              onClear={function (): void {
                console.error("Function not implemented.")
              }} 
            />
            <VideoUpload
              title={"Trailer"}
              subtitle={"Select trailer video (optional)"}
              hasFile={false}
              onFile={function (file): void {
                console.error("Function not implemented.", file)
              }}
              onClear={function (): void {
                console.error("Function not implemented.")
              }}
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
                udlValues && (
                  <UdlTable
                    tags={udlTags}
                  />
                )
              }
              <div className="pt-4 flex flex-row gap-4">
                <Button
                  onClick={() => setIsUdlSheetOpen(true)}
                >
                  {
                    hasTags ? "Edit UDL" : "Add UDL"
                  }
                </Button>
                {
                  hasTags && (
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        setUdlValues(undefined)
                        setUdlTags({})
                      }}
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
            onClick={function (): void {
              console.error("Function not implemented.")
            }}
          >
            Upload With Arseeding
          </Button>
        </CardContent>
      </Card>
      <Sheet
        open={isUdlSheetOpen}
        onOpenChange={(isOpen) => {
          setIsUdlSheetOpen(isOpen)
        }}
        modal={false}
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
                initialValues={udlValues}
                onSubmit={function (data) {
                  console.log(data);
                  setUdlValues(data);
                  setUdlTags(udlConfigToTags(data));
                  setIsUdlSheetOpen(false);
                }}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}
