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
    submitToEverpay: "done.invoke.uploadPage.submitting:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "loadEverpayTokens" | "submitToEverpay";
  };
  eventsCausingActions: {
    appendSubmitLog: "update submitting";
    assignEverypayTokens: "done.invoke.uploadPage.configuring.everpay.loading:invocation[0]";
    assignMainVideo: "main video set";
    assignSendAndPayResult: "upload success";
    assignTrailerVideo: "trailer video set";
    assignUdlConfig: "udl config set";
    assignUploadError: "upload failed";
    assignUploadSymbol: "confirm symbol";
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
    submitToEverpay: "confirm symbol";
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
    | "submitting.idle"
    | "upload failure"
    | "upload success"
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
        submitting?: "idle";
      };
  tags: never;
}
