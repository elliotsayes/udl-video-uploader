import { udlConfigToTags } from "@/lib/udl";
import { zUdlInputSchema } from "@/types/udl";
import { assign, createMachine } from "xstate";
import { z } from "zod";
import { Token } from "everpay";
import { SendAndPayResult } from "@/lib/arseeding";

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
      type: "assign everypay tokens";
    }
  | {
      type: "confirm symbol";
      data: {
        symbol: string;
      };
    }
  | {
      type: "update submitting";
      data: {
        message: string;
      };
    }
  | {
      type: "upload success";
      data: {
        mainVideoResult: SendAndPayResult;
        trailerVideoResult?: SendAndPayResult;
      };
    }
  | {
      type: "upload failed";
      data: {
        uploadError: unknown;
      };
    };

type Context = {
  mainVideo?: File;
  trailerVideo?: File;
  udlConfig?: z.infer<typeof zUdlInputSchema>;
  udlTags?: Record<string, string>;
  everpayTokens?: Token[];
  uploadSymbol?: string;
  submitLog: string;
  mainVideoResult?: SendAndPayResult;
  trailerVideoResult?: SendAndPayResult;
  uploadError?: unknown;
};

type Services = {
  loadEverpayTokens: {
    data: {
      everpayTokens: Token[];
    };
  };
  // submitToEverpay: {
  //   data: {
  //     mainVideoResult: SendAndPayResult;
  //     trailerVideoResult?: SendAndPayResult;
  //   };
  // };
};

type Deps = {
  never?: never;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadPageMachine = (deps: Deps) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QFcAOAbA9gQwgBWxgDoBjTAOwDMBLKZAJ2vKgGIyrr6BbAAlgE8uAI0zoA2gAYAuolCpMsagBdqFWSAAeiAIwSALAE4iADgBsAdj0BWbXon6JVgDQh+iAEzaiAZnMHtVt56pgbGetrm2sYAvtEuaFi4BMTsNHSMzERc2EwAatQQYJgs2Uw8AG4FRXxgSpIySCDyiipqjVoI7jZEeu6mVnbm7hLa-kMubgjaFkRdY73a7sbu5lamsfEYOPiEYKQUaQxMUFk55PmFmEQAFtiwF0UlZxVVmDwk6GDY9JD16s3KVTkdQddx6cxEVamUbGEYDAzeKzmCaIIKmIi6KxdWxIgyhcwbEAJbbJPapWhHTJKeg5T70B7Fam0sD0F6XGp1aT-BSAtqgUFWCQ9UZ2bSLdxg0J6FEIKzGLzmZYSYywiLGcx+QnEpK7fYcdLHIhM6h0hk3O4MljGuls6ofL4-CB-RoA1rA9oeQxEPFDYzebwGCSB1bI1yIVbeIiOewBsV6MwSAlxIlbHUpA4UjInZAQdAAYQzrBz6HehY5zrkPLdII8Aaj0LWa1hEm87iCMrxelmtgRy28pn67i1qZ26f1lOzuYL+vNsGnaRYxdL+ven2+vy5LqrQJrnW8QuC2n3iJsYsWphlYtMkYMVkDfQG9ilw8So7JhYnRDA5RZqGw-CIShmQgFgNFgJRsCUPZsEoKD6AACl0ewAEpFxHUk9UOLMvx-eg-wAoCTQ3BpKxaHcPQQf0IWMAxLAHLoJAsaZpTDKZoXceswjsFVYRiZNtTfTDM0Nb9f3-IgCk+UDwMg6DYJZRCULQ18MPJA1MlEvDxMksAKyabc+U0HRLCIAZeMYsFGKiFjJlsFsfFbDUe08XwXxJXU1M-TT8KIV9jhYCAKD2JhykwABrPYBNUj9sO88S-OYBAQswEhIKBeo9Ndcj+UQQVjFmdUzGsQw1lMaxLz0awo2VEZemGCIrCsNy03fcdYtwnyEtYFl6EwegiAwSDKD6rgiCijyYpEjr4u2Y4kvIULUrdDLN1I3l3Ry2URkhcxTCDQcIkDMxLyRSMbCVYw7yxDU9GawSmEBbB0BYTKDI2oyEAAWjCExdD8SI-VoxiZU+rwY2vfpEwMYIsXCO6MNgZAhC4ZQVGYZTtj4ZASBIOBYFesjDI6XQfvMbwwm8aYaqumV4w40ZTrJwV+l6JNNhU3VEeR1H-IEnhCM+J1Vv0wn3uJvRKaIPa6Masn4xs2sOIlcm7IlFY7zZlMOeILmUaUNGTh0tCIFkrHuf144CfW3cxSxKNpnJ0JBXjAcZX9IUW0sGjwiDAwytiZNyEwQp4EacaYG5UXd0+yyTH3G7wnJzwJHcEHochIMkTMQILEz+GJra45I+tiiqvBewLH9MxbGWZxWM+iFyYHfpFnlOVFQMfOxyww1SnOV5i+rCiER6cwK7Jpua+8GU-G9fsumKtsgnJrvWp7zI+7NIOGUH7KPtsLxy8Yifq-jafWL6CEJUqlP3Fosr9ya-j0IL9eTk315Zx3rco9LxEMTWOTeMypBT2AVp0eU3oVSxn7FEZ26xn7azXsJKkNIiL0gHj-Eum08Q+CvC2aGlUBj9Fpunaw-hTB+nBEAzW4dkHqRONaFkW9MDfzWkPTathG74IDJVYqJDWKUKME+ZuGohjQ20KvISDCjRoNNJ-W49xMHsL3h0XoRhKbxgTDRREIoZRCOqn7AcYi74BikZ5bCxZ5y0F3kTRAt4TCOFWGKaGnhhgXlYoGdENF6qXQHAEFU5jJqZCsYWIgQdrFQFsWLHQEtHFIlPK4xYwNWK6D9lLCUQYlj2AGHDRB7lu4oMnPmMJijInRN3L4YRKdbBBEakiMmoZbL7QycMAw2THCVUkfklq0ivLTUmCouxCAR7QlCH6aEh5jCXkpuiJ8l0oieDKrdHpgkLFTTEgRYCFSKKNh6H7RUphhiwnIZefoRgaJYmTu0-oQQgmFw0gM3y2xIA7M2qsfK+4zB9FGIqeqFV+gmDxBQ+M0NLD3LfjhTZElcxgDefvcIUsYQTNsNCaZqTDAcUHJYawfQWx9AhUUqFWkAJdXhaCYIPhEzhGGIEOUdhU4YpCLMcmIwuhtksAS1ZGEHoqCeuSxAoN2lx0TDio8yxdCMsmDHOO15PDEOmEeCWCD2YFL2LrHmzABVTAIb9CUip-Qk1bDMjigp5gWCOfoShUiNUW0yDpbVJNqLigNZTZUxqL4DilpMsZAQ6UrNVb0vmiMcZ40dWeb0lCViLH8LocEMo7xdkRImTERjVid25bqPmAsGBwqwRwhFVVoZ4gsGTI6R43Z2wlvYGiDVXFJliEAA */
      id: "uploadPage",
      tsTypes: {} as import("./upload_page.typegen").Typegen0,
      predictableActionArguments: true,
      schema: {
        context: {} as Context,
        events: {} as Events,
        services: {} as Services,
      },
      context: {
        submitLog: "",
      },
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

            everpay: {
              states: {
                failed: {
                  after: {
                    "1000": "loading",
                  },
                },
                loaded: {},
                idle: {
                  after: {
                    "100": "loading",
                  },
                },
                loading: {
                  invoke: {
                    src: "loadEverpayTokens",

                    onDone: {
                      target: "loaded",
                      actions: "assignEverypayTokens",
                    },

                    onError: "failed",
                  },
                },
              },

              initial: "idle",
            },
          },

          on: {
            "confirm symbol": {
              target: "submitting",
              cond: "canSubmitConfig",
              actions: "assignUploadSymbol",
            },
          },
        },

        initial: {
          always: "configuring",
        },

        submitting: {
          invoke: {
            src: "submitToEverpay",
          },

          states: {
            idle: {
              on: {
                "update submitting": {
                  target: "idle",
                  internal: true,
                  actions: "appendSubmitLog",
                },
              },
            },
          },

          initial: "idle",

          on: {
            "upload success": {
              target: "upload success",
              actions: "assignSendAndPayResult",
            },

            "upload failed": {
              target: "upload failure",
              actions: "assignUploadError",
            },
          },
        },

        "upload success": {},
        "upload failure": {},
      },
    },
    {
      actions: {
        assignMainVideo: assign({
          mainVideo: (_, event) => event.data.mainVideo,
        }),
        clearMainVideo: assign({
          mainVideo: undefined,
        }),
        assignTrailerVideo: assign({
          trailerVideo: (_, event) => event.data.trailerVideo,
        }),
        clearTrailerVideo: assign({
          trailerVideo: undefined,
        }),
        assignUdlConfig: assign({
          udlConfig: (_, event) => event.data.udlConfig,
          udlTags: (_, event) => udlConfigToTags(event.data.udlConfig),
        }),
        udlConfigCleared: assign({
          udlConfig: undefined,
          udlTags: undefined,
        }),
        assignEverypayTokens: assign({
          everpayTokens: (_, event) => event.data.everpayTokens,
        }),
        assignUploadSymbol: assign({
          uploadSymbol: (_, event) => event.data.symbol,
        }),
        appendSubmitLog: assign({
          submitLog: (context, event) => {
            return context.submitLog + "\n" + event.data.message;
          },
        }),
        assignSendAndPayResult: assign({
          mainVideoResult: (_, event) => event.data.mainVideoResult,
          trailerVideoResult: (_, event) => event.data.trailerVideoResult,
        }),
        assignUploadError: assign({
          uploadError: (_, event) => event.data.uploadError,
        }),
      },
      guards: {
        canSubmitConfig: (context) => {
          return (
            context.mainVideo !== undefined &&
            context.everpayTokens != undefined
          );
        },
      },
    }
  );
