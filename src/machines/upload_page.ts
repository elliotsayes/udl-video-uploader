import { udlConfigToTags } from "@/lib/udl";
import { zUdlInputSchema } from "@/types/udl";
import { assign, createMachine } from "xstate";
import { z } from "zod";
import { Token } from "everpay";

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
    };

type Context = {
  mainVideo?: File;
  mainVideoUrl?: string;
  trailerVideo?: File;
  trailerVideoUrl?: string;
  udlConfig?: z.infer<typeof zUdlInputSchema>;
  udlTags?: Record<string, string>;
  everpayTokens?: Token[];
};

type Services = {
  loadEverpayTokens: {
    data: {
      everpayTokens: Token[];
    };
  };
};

type Deps = {
  never?: never;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadPageMachine = (deps: Deps) =>
  createMachine(
    {
      /** @xstate-layout N4IgpgJg5mDOIC5QFcAOAbA9gQwgBWxgDoBjTAOwDMBLKZAJ2vKgGJZkAjAW2oBcACMlVoBtAAwBdRKFSZYfahWkgAHogCcADgBMRAMwBGAOwA2MdoCsRnXvUAWADQgAnogC0ui2LvbNBsXpiBibahnYAvuFOaFi4BMRCNHSMzERc2EwAatQQYJgs6Uz8AG45efywYLziUkggsvK8iuTKagiWBkQ+JhZ2YkbaQerG2k6uCMFGRJbDRj4GvtpGFiaR0Rg4+IRgpBRJDExQaRnk2bmYRAAW2LBneQUnJWWYguhg2PSQNcoNCkp1bW0dimyxMBi0QV66j0VjGiD0dhMRH8Fg6dis6i0RjWIBim3iO0StAOqV49Ayb3od3yZIpYHoT3OFSq3zqvya-1AgK8XXBfQMC20QK0jhciAsfiI1kGmk0QWsRiM6hxeLi212wmShyItOolOpVxu1JYuspjPKJDeHy+kh+cj+LQBiGFRExA00elsYnU-VhYoQyz0RDEXgCwwMdk0ZmxUVxGzVCT2xJSR2QEHQAGEk6w0+hBNnmdVbWz7RzHVznbZg2CVis5QFQqLxpi7NMI9CbCYetoVfGtonNSTU+ms5rDbBR0kWLn85rXu9PhBWTJS81WpWxF0wYEYRYBQLtCY4RNgkH1BYfYfemJvZoIrHVf3Cdmh0QwMV6ahsM4iJQ6RAWBUWBeGwXgdmwSgwPoAAKfwbwASmnPsCQ1fYUzfD96C-H8-z1G1ahXRo1ydBBPSmTR1DmLtLDEEwjGCJtEGCBZqzvPpZTlTRe1iJ9UOTbV30-b8iByN5AOA0DwMg+lYIQpCeJQoktVSQSsOE0SwGXepV05VQmLmIhek42igVogw72PCMAn0PQlnoux1G0Aw9BjdYFPVJTX1U7CiB4w4WAgCgdiYYpMAAax2R9FJfdDvOEvzmAQELMBIUDmhqLT2WIisEC8TRpk0awTHRByVmKixLLsdFgzEOUIyFeULAsbj8Q8mKBMwnyEtYel6EwegiAwUDKH6rgiCitrB1izr4s2Q4kvIULUrLDLi0Ih111yoIpVMb1u2MH0o0sqwgz3HRaovVFFXvNzWuIJgFGwdAWEynTyz0hA3DvIg-H6SjzNsIxaOPNxOhvPQTAhrwlURVE7AMSJY3ITBcngOoJpgO0iN0toPD6H7Amu+G9B0fxRn9Nx7Clb0mv6cyejKlqE2fKbDixjaSOq4Ebzoz0owjHQKopqYSa7Ow+dsCxPRWJneM89DClOZ52bLTboS6IHaKMPmwUjPRjyVV0IcsPcTCjQZzFl6LWdSRWDWR6kVeyj6I06bmtZ1gX9f9Q8piFKrzG0SjisCZqH2Qya0O1O3nnHR2S2x962nFixkRWEnIwum9vGPXxOi0D1hgh8yvERK3I-40lyTwqllYTjmcsxfQBTMWwqpKnpjwc1t0WGPc+nsBZgXLgco6rula-OIgHbr9bVZIiMRZbsN296Tv-TN9QavULs6MVIP4ZHlmx6OU16QNa5bln7TE82nwt7CWUzAomE+WPTft93xUBmhZVw-c0eldhyZmzE7HGGhU5yisHuPkTlBhHn9D6JEFELbBDzlGVY-87rHyAeNEc2Zp6YEnLQMBScmLix+iGZYAp7BwOBv6fwO8iAhEGI5esvRD5YOZnxZSwDiFHEvvw0hm0XJbxvE5cW6ImqKhcpZPazCGpsJvBwhGXC5btRUjNcYc9nZtHVmCAuxdETmUsoYJEN5MSMPPFIzBt1uHyw6kJHC-5hEkVrF0HeRUZTeAvJZHoW8KKoict6K8CIj48K8lo3ymxICuJyssfKgRzYGOlEESqPQfqYmGMVCiwIbpxgATg3hGEnEiXTGAOJLt4bMPBLKIxYJNCVUcswq6VVUSt0POEhxmjSndUqYCRE+h+jw0GFLCUfRybjAjCYLeoQ6qWFCHMTpaiUIPSaE9fp7hwS6A9P0OYxNSbmBBjsiGtkDBr2YgiCG4T2DcD4E0ZgmyJgmX0DM7cXZwTPwNkiYqwIzbeGKs5LsiNwhAA */
      id: "uploadPage",
      tsTypes: {} as import("./upload_page.typegen").Typegen0,
      predictableActionArguments: true,
      schema: {
        context: {} as Context,
        events: {} as Events,
        services: {} as Services,
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
        assignEverypayTokens: assign({
          everpayTokens: (_, event) => event.data.everpayTokens,
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
