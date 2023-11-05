import { useCallback } from "react";
import { useDropzone } from "react-dropzone"
import { VideoPreview } from "./VideoPreview";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  title: string;
  subtitle?: string;
  hasFile: boolean;
  onFile: (file: File) => void;
  onClear: () => void;
  previewUrl?: string;
  disabled?: boolean;
}


export const VideoUpload = (props: Props) => {
  const { title, subtitle, hasFile, onFile, onClear, previewUrl, disabled } = {
    disabled: false,
    ...props,
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('onDrop', acceptedFiles);
    if (acceptedFiles.length === 1) {
      onFile(acceptedFiles[0]);
    } else {
      onClear();
    }
  }, [onFile, onClear]);

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
  } = useDropzone({
    disabled,
    onDrop,
    noClick: true,
    accept: {
      'video/*': ['.avi', '.mp4', '.mpeg', '.ogv', '.ts', '.webm', '.3gp', '.mov', '.mkv']
    },
    maxFiles: 1,
    maxSize: 1024 * 1024 * 1024, // 1GB
  });

  return (
    <Card {...getRootProps()}>
      <input {...getInputProps()} />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {
          subtitle && <CardDescription>{subtitle}</CardDescription>
        }
      </CardHeader>
      <CardContent className="relative flex flex-col items-center">
        <div className="absolute w-72 z-20">
          {
            !disabled && (
              <div className="text-center text-secondary-foreground/80 bg-gradient-radial from-gray-800/40 via-gray-800/10 to-transparent px-4 py-[4.25rem]">
                {
                  isDragActive ?
                    <p>Drop video here!</p> :
                    (
                      hasFile ? (
                        <p>Drop video to replace</p>
                      ) : (
                        <p>Drag & drop video file</p>
                      )
                    )
                }
              </div>
            )
          }
        </div>
        <VideoPreview
          url={previewUrl}
          darken={isDragActive && !disabled}
        />
        <div className="h-12 pt-2">
          {
            !disabled && (
              hasFile ? (
                <Button variant={"destructive"} size={"sm"} onClick={onClear}>
                  Clear
                </Button>
              ) : (
                <Button variant={'secondary'} size={"sm"} onClick={open}>
                  Select File
                </Button>
              )
            )
          }
        </div>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  )
}
