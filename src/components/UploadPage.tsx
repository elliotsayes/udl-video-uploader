import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoUpload } from "./VideoUpload"

export const UploadPage = () => {
  return (
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
        <Button
          size={"lg"}
          onClick={function (): void {
            console.error("Function not implemented.")
          }}
        >
          Upload With Arseeding
        </Button>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  )
}
