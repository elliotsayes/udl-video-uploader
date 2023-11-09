import { udlConfigToTags } from "@/lib/udl";
import { zUdlInputSchema } from "@/types/udl";
import { assign, createMachine } from "xstate";
import { z } from "zod";
import { Token } from "everpay";
import { UploadResult } from "@/lib/upload";

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
        mainVideoResult: UploadResult;
        trailerVideoResult?: UploadResult;
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
  mainVideoResult?: UploadResult;
  trailerVideoResult?: UploadResult;
  uploadError?: unknown;
};

type Services = {
  loadEverpayTokens: {
    data: {
      everpayTokens: Token[];
    };
  };
  // runUploadProcess: {
  //   data: {
  //     mainVideoResult: SendAndPayResult;
  //     trailerVideoResult?: SendAndPayResult;
  //   };
  // };
};

type Deps = {
  isArseeding: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadPageMachine = (deps: Deps) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QFcAOAbA9gQwgBWxgDoBjTAOwDMBLKZAJ2vKgGIyrr6BbAAlgE8uAI0zoA2gAYAuolCpMsagBdqFWSAAeiAIwSALAE4iADgBsAdj0BWbXon6JVgDQh+iAEzaiAZnMHtVt56pgbGetrm2sYAvtEuaFi4BMTsNHSMzERc2EwAatQQYJgs2Uw8AG4FRXxgSpIySCDyiipqjVoI7jZEeu6mVnbm7hLa-kMubgjaFkRdY73a7sbu5lamsfEYOPiEYKQUaQxMUFk55PmFmEQAFtiwF0UlZxVVmDwk6GDY9JD16s3KVTkdQddx6cxEVamUbGEYDAzeKzmCaIIKmIi6KxdWxIgyhcwbEAJbbJPapWhHTJKeg5T70B7Fam0sD0F6XGp1aT-BSAtqgUFWCQ9UZ2bSLdxg0J6FEIKzGLzmZYSYywiLGcx+QnEpK7fYcdLHIhM6h0hk3O4MljGuls6ofL4-CB-RoA1rA9oeQxEPFDYzebwGCSB1bI1yIVbeIiOewBsV6MwSAlxIlbHUpA4UjInZAQdAAYQzrBz6HehY5zrkPLdII8Aaj0LWa1hEm87iCMrxelmtgRy28pn67i1qZ26f1lOzuYL+vNsGnaRYxdL+ven2+vy5LqrQJrnW8QuC2n3iJsYsWphlYtMkYMVkDfQG9ilw8So7JhYnRDA5RZqGw-CIShmQgFgNFgJRsCUPZsEoKD6AACl0ewAEpFxHUk9UOLMvx-eg-wAoCTQ3BpKxaHcPQQf0IWMAxLAHLoJAsaZpTDKZoXceswjsFVYRiZNtTfTDM0Nb9f3-IgCk+UDwMg6DYJZRCULQ18MPJA1MlEvDxMksAKyabc+U0HRTA4vE72CSJGMPS87EjaFr2mRZelCF8SV1NTP00-CiFfY4WAgCg9iYcpMAAaz2ATVI-bCvPE3zmAQYLMBISCgXqPTXXI-lEEFYxZnVMxrEMNZTGsGzrCjZURl6YYIisKxXLTd9xxi3DvPi1gWXoTB6CIDBIMoHquCISL3OikS2ri7ZjkS8gQpSt10s3UjeXdbLZRGSFzFMINBwiQMzEvJFIxsJVjDvLENT0RrBKYQFsHQFgMoMtajIQABaMITF0PxIj9WjGJld6vBja9+kTAxgixcIbow2BkCELhlBUZhlO2PhkBIEg4FgZ6yMMjpdC+8xvDCbxpiqi6ZXjDjRmOknBX6Xok02FTdXhxHkb8gSeEIz4nWW-T8dewm9HJogdro+qSfjFjJjbDiJVJ2wJAlFY7xZlM2eIDmkaUFGTh0tCIFkjHOf1448dW3cxSxKNplJ0JBXjAcZX9IUW0sGjwiDAxStiZNyEwQp4EaUaYG5YXd3esEhT9RNLHCUnPFVoHIchIM5SiGxE2CId+PQsaWuOSPrYoirwXsCx-TMWxlmcVj3ohUmBwsWWHeGBqC+15qsMNUpzleUvqwohEenMKuSZbuvvBlPxvX7MFTBVFYae0WGi77zIB7NIOGWHrK3tsLxK8Yqfa-jWfWL6CEJT0OwJVo0r9y71m3LHLeTh315Z33rco-LoiDEaxSbxmVIKewcsPDym9CqWM-Zs76HWN3d+vdhJUhpERekQ9-5l3WniHwV4WyQ3vgMfo1N07WH8H6Xw-pejXRQU1IS6kTjWhZLvTAf8Voj3WrYZuRCAz3yKuQ1iy8jBPlbhqIYkN16MMEh5bCbDsGXF-jg7hh8OjOUIfGBMNFEQihlGIyqfsBxSPcAiAwG8P7oMnPmQsB8CaIFvCYRwqwxSQ08MMC8rFAzohoiKHawZWyWLkVFYumRizzloEQIOUSoAOJFjoMWLikSng8YsQGrFdB+wlhKIMSx7ADBhqEzeNiRpTkLLOOJCTdy+HEarWwQR6pIhJqGSY2T0QmWGAYApjh76yLfkwhRE0xKTHUY4hAY9oShD9NCQ8xhLzk3ROY-0bZaJ+k1CU6xLCcKjMAsBGpFFGw9D9oqEyVUqGXn6EYGiWIU49P6EEKxaCdmxQAq+SAhz1qrDyvuMwfRRiKlqjZfoJg8T+FKt7SwzzmGeUmgBHSXyj7hAljCWZthoQLKyYYDig5E5Yh2q2ZBgz5HjQ0vCny01mBItBMEHwucMmBDlA-EFRg2yqi6G2SwfQYV3RUA9GliBgY9JMPuK6Sdli6HcEDDiszWwBEPNCII-YYW6y5tS3BPCj7EO+hKRU-oiatkWRxQU-gHZ2CEb0VVCM9YGwkrmMAgqpjKmouKfV5NlRGuvgOCWczpkBCZQwklGEebwyxjjJ1Z4vB+2WJEcxYp9BtJyunREiZMQmNWCE4NuoeZ8wYI6zVGikkVUhniCwJMDpHjdnbMW9h-GZuZgHaIQA */
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
                    "100": {
                      target: "loading",
                      cond: "isArseeding",
                    },
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
            src: "runUploadProcess",
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
            (!deps.isArseeding || context.everpayTokens != undefined)
          );
        },
      },
    }
  );
