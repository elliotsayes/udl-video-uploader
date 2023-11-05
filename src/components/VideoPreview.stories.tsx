import type { Meta, StoryObj } from "@storybook/react";

import { VideoPreview } from "./VideoPreview";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/VideoPreview",
  component: VideoPreview,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    controls: {
      control: {
        type: 'boolean',
      },
    },
    darken: {
      control: {
        type: 'boolean',
      },
    },
  },
  // render: (args) => <div className="bg-black">
  //   <VideoPreview {...args} />
  // </div>,
} satisfies Meta<typeof VideoPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const NoVideo: Story = {
  args: {
    url: undefined,
    controls: false,
    darken: false,
  },
};

export const HasVideo: Story = {
  args: {
    url: "https://ec7go7qzpxutxyogvudkkxxiuutnp46e62lzpbjeg2g3tu4rnq5q.arweave.net/IL5nfhl96Tvhxq0GpV7opSbX88T2l5eFJDaNudORbDs",
    controls: false,
    darken: false,
  },
};

export const HasVideoDark: Story = {
  args: {
    url: "https://ec7go7qzpxutxyogvudkkxxiuutnp46e62lzpbjeg2g3tu4rnq5q.arweave.net/IL5nfhl96Tvhxq0GpV7opSbX88T2l5eFJDaNudORbDs",
    controls: false,
    darken: true,
  },
};

export const HasVideoWithControls: Story = {
  args: {
    url: "https://ec7go7qzpxutxyogvudkkxxiuutnp46e62lzpbjeg2g3tu4rnq5q.arweave.net/IL5nfhl96Tvhxq0GpV7opSbX88T2l5eFJDaNudORbDs",
    controls: true,
    darken: false,
  },
};
