import { udlConfigToTags } from "@/lib/udl";
import { zUdlInputSchema } from "@/types/udl";
import { assign, createMachine } from "xstate";
import { z } from "zod";

type Events =
  | {
      type: "main video set";
      data: {
        mainVideo: File;
      };
    }
  | {
      type: "main video cleared";
    }
  | {
      type: "trailer video set";
      data: {
        trailerVideo: File;
      };
    }
  | {
      type: "trailer video cleared";
    }
  | {
      type: "udl config set";
      data: {
        udlConfig: z.infer<typeof zUdlInputSchema>;
      };
    }
  | {
      type: "udl config cleared";
    }
  | {
      type: "submit config";
    };

type Context = {
  mainVideo?: File;
  mainVideoUrl?: string;
  trailerVideo?: File;
  trailerVideoUrl?: string;
  udlConfig?: z.infer<typeof zUdlInputSchema>;
  udlTags?: Record<string, string>;
};

type Deps = {
  never?: never;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadPageMachine = (deps: Deps) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QFcAOAbA9gQwgBWxgDoBLAOxIBcTt0BiAbQAYBdRUVTWKkzM9kAA9EAWgAcAFiJiAjEwDsATnkyxAZmVMAbABoQAT1EyiTJmq3mArAsUStlgEwSZAXxd60WXAWIBjPgBmJFDIAE7kUEQAttjkAGokEGCYdDHkAAQAbonJ6bBglMxsSCCc3NR8AsIIDpbGEg72EgoOTDKKMvIOeoYIMlryRLUd8g0yDmIO8pZabh4YOPiEYET+ZEEh4WSRaWQJSZhEABbYsPvJqbFkWTmY6b7oYNihkEUCZTyVJdVOg9Na7TEbUsEkUaks8h6iDUdiIckcdQkEMUijE8jmIE8ix8KzWGzCESIlFCsUeoXOKWJpLAoRuBzyBTeJQ+FX430QtSYRGctja4wcTlREihCEssiI8kmTDEQM6aKUGKx3mWq0CwQJ2yJJJIZIpx1OFLoVJ1NLpuQeTxeECZHC4nzZoB+oKIKK66g0TEUCghIumahM1jMHRkEjEWgUioWyr8as2hOQEHQAGFY3QE+h7rGGYVWO87ayqhyNCYATMZkCzA4YSKUVIHCGwZNzPYHJGvEsY+t1VtIumU13IidYP2NmnE5mB-dHs9XrnmfneA6hEWuXYZGozJY6jId40RTuLC7LF7GiDTEK29iVXjuxE6LBkAAjKJUCcbG2lBdfR2ILRhohqLUG5mO0MwaCKWgAeG8jmA0bSAdKlhuO4IBkJgSTwCUSodmAeblIuhYICIThcuoCijM4aiTHI3QGKIYImA0MpghIdgCgMl7RrisYalAeH2oRSLcvIpgDGoVEAqGtQiiIlgSu0ihgQ4qJutKnE4aQFDULQ-EFuyRHtA40gbvIFHrtRTC0b0xHGRY9YggCAIwuY6k4qqA68dEVwUrpBH6QxEgidoMESSG6gikCEpaIoWhVspylis4rnXjxPZatS5K3L537LggKIAQeQasUidiWCKoJyfFSKqI4ilTMlnb4mlfaxtlS7VIp0hMBC262PWrS6HReUKBKQH2YBdSSA13EeWlux6mhPnzvhOXVCG9RBWJoWhmoIqNIMAqsZZynyFoEgbkhKHYW5N5xpq823PqZxZctAn6edckyGBkhAmIgZMMKQ0TMYqLqB05g1QDsxXVGGkPs+VDUNsbWEadcmiWIjbaHYYI1nJoIhWMqLHmo03uU1hLGrqj2LS9tore1iAhoMaiFRoxUOWVQ1-ooJieloAumV0tiuDD7Y3allPatTBxPUt9NvT+CANLzrOhmG0pgnUtgQZjfMxYLpnKRoZO3Z5LUDkQaEjsEKP6SG-pAj1O59eM2j7vzRCxa0igTKYIJJWLV6NbemoWxsT023xr16UrahKHz9bnUiW6mfHHsxV7Aqen73WsaLbhAA */
      id: "uploadPage",
      tsTypes: {} as import("./upload_page.typegen").Typegen0,
      schema: {
        context: {} as Context,
        events: {} as Events,
      },
      context: {},
      initial: "initial",
      states: {
        configuring: {
          type: "parallel",

          states: {
            mainVideo: {
              states: {
                noVideo: {},
                hasVideo: {
                  on: {
                    "main video cleared": {
                      target: "noVideo",
                      actions: "clearMainVideo",
                    },
                  },
                },
              },

              initial: "noVideo",

              on: {
                "main video set": {
                  target: ".hasVideo",
                  actions: "assignMainVideo",
                },
              },
            },
            trailerVideo: {
              states: {
                noVideo: {},
                hasVideo: {
                  on: {
                    "trailer video cleared": {
                      target: "noVideo",
                      actions: "clearTrailerVideo",
                    },
                  },
                },
              },

              initial: "noVideo",

              on: {
                "trailer video set": {
                  target: ".hasVideo",
                  actions: "assignTrailerVideo",
                },
              },
            },
            udlConfig: {
              states: {
                noConfig: {},
                hasConfig: {
                  on: {
                    "udl config cleared": {
                      target: "noConfig",
                      actions: "udlConfigCleared",
                    },
                  },
                },
              },

              initial: "noConfig",

              on: {
                "udl config set": {
                  target: ".hasConfig",
                  actions: "assignUdlConfig",
                },
              },
            },
          },

          on: {
            "submit config": {
              target: "submitting",
              cond: "canSubmitConfig",
            },
          },
        },

        initial: {
          always: "configuring",
        },

        submitting: {},
      },
    },
    {
      actions: {
        assignMainVideo: assign({
          mainVideo: (_, event) => event.data.mainVideo,
          mainVideoUrl: (_, event) => URL.createObjectURL(event.data.mainVideo),
        }),
        clearMainVideo: assign({
          mainVideo: undefined,
          mainVideoUrl: (context) => {
            context.mainVideoUrl && URL.revokeObjectURL(context.mainVideoUrl);
            return undefined;
          },
        }),
        assignTrailerVideo: assign({
          trailerVideo: (_, event) => event.data.trailerVideo,
          trailerVideoUrl: (_, event) =>
            URL.createObjectURL(event.data.trailerVideo),
        }),
        clearTrailerVideo: assign({
          trailerVideo: undefined,
          trailerVideoUrl: (context) => {
            context.trailerVideoUrl &&
              URL.revokeObjectURL(context.trailerVideoUrl);
            return undefined;
          },
        }),
        assignUdlConfig: assign({
          udlConfig: (_, event) => event.data.udlConfig,
          udlTags: (_, event) => udlConfigToTags(event.data.udlConfig),
        }),
        udlConfigCleared: assign({
          udlConfig: undefined,
          udlTags: undefined,
        }),
      },
      guards: {
        canSubmitConfig: (context) => {
          return context.mainVideo !== undefined;
        },
      },
    }
  );
