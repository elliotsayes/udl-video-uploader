// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.uploadPage.configuring.everpay.loading:invocation[0]": {
      type: "done.invoke.uploadPage.configuring.everpay.loading:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.uploadPage.configuring.everpay.loading:invocation[0]": {
      type: "error.platform.uploadPage.configuring.everpay.loading:invocation[0]";
      data: unknown;
    };
    "xstate.after(100)#uploadPage.configuring.everpay.idle": {
      type: "xstate.after(100)#uploadPage.configuring.everpay.idle";
    };
    "xstate.after(1000)#uploadPage.configuring.everpay.failed": {
      type: "xstate.after(1000)#uploadPage.configuring.everpay.failed";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadEverpayTokens: "done.invoke.uploadPage.configuring.everpay.loading:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "loadEverpayTokens";
  };
  eventsCausingActions: {
    assignEverypayTokens: "done.invoke.uploadPage.configuring.everpay.loading:invocation[0]";
    assignMainVideo: "main video set";
    assignTrailerVideo: "trailer video set";
    assignUdlConfig: "udl config set";
    clearMainVideo: "main video cleared";
    clearTrailerVideo: "trailer video cleared";
    udlConfigCleared: "udl config cleared";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canSubmitConfig: "confirm symbol";
  };
  eventsCausingServices: {
    loadEverpayTokens:
      | "xstate.after(100)#uploadPage.configuring.everpay.idle"
      | "xstate.after(1000)#uploadPage.configuring.everpay.failed";
  };
  matchesStates:
    | "configuring"
    | "configuring.everpay"
    | "configuring.everpay.failed"
    | "configuring.everpay.idle"
    | "configuring.everpay.loaded"
    | "configuring.everpay.loading"
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
          | "everpay"
          | "mainVideo"
          | "trailerVideo"
          | "udlConfig"
          | {
              everpay?: "failed" | "idle" | "loaded" | "loading";
              mainVideo?: "hasVideo" | "noVideo";
              trailerVideo?: "hasVideo" | "noVideo";
              udlConfig?: "hasConfig" | "noConfig";
            };
      };
  tags: never;
}
