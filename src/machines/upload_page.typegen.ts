// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    assignMainVideo: "main video set";
    assignTrailerVideo: "trailer video set";
    assignUdlConfig: "udl config set";
    clearMainVideo: "main video cleared";
    clearTrailerVideo: "trailer video cleared";
    udlConfigCleared: "udl config cleared";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canSubmitConfig: "submit config";
  };
  eventsCausingServices: {};
  matchesStates:
    | "configuring"
    | "configuring.mainVideo"
    | "configuring.mainVideo.hasVideo"
    | "configuring.mainVideo.noVideo"
    | "configuring.trailerVideo"
    | "configuring.trailerVideo.hasVideo"
    | "configuring.trailerVideo.noVideo"
    | "configuring.udlConfig"
    | "configuring.udlConfig.hasConfig"
    | "configuring.udlConfig.noConfig"
    | "initial"
    | "submitting"
    | {
        configuring?:
          | "mainVideo"
          | "trailerVideo"
          | "udlConfig"
          | {
              mainVideo?: "hasVideo" | "noVideo";
              trailerVideo?: "hasVideo" | "noVideo";
              udlConfig?: "hasConfig" | "noConfig";
            };
      };
  tags: never;
}
