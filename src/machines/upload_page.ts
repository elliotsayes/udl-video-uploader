import { createMachine } from "xstate";

type Events = {
  type: "NEVER";
};

type Context = {
  never?: never;
};

type Deps = {
  never?: never;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const uploadPageMachine = (deps: Deps) =>
  createMachine({
    id: "uploadPage",
    tsTypes: {} as import("./upload_page.typegen").Typegen0,
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    context: {},
    initial: "initialState",
    states: {
      initialState: {},
    },
  });
