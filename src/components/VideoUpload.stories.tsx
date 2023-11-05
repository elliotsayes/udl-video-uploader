import type { Meta, StoryObj } from "@storybook/react";

import { VideoUpload } from "./VideoUpload";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/VideoUpload",
  component: VideoUpload,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onFile: {
      action: 'onFile',
    },
    onClear: {
      action: 'onClear',
    },
    hasFile: {
      control: {
        type: 'boolean',
      },
    },
    previewUrl: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    title: "Upload Video",
  }
} satisfies Meta<typeof VideoUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Waiting: Story = {
  args: {
    hasFile: false,
  }
};

export const HasFile: Story = {
  args: {
    hasFile: true,
  }
};

export const HasFileWithPreview: Story = {
  args: {
    hasFile: true,
    previewUrl: "https://ec7go7qzpxutxyogvudkkxxiuutnp46e62lzpbjeg2g3tu4rnq5q.arweave.net/IL5nfhl96Tvhxq0GpV7opSbX88T2l5eFJDaNudORbDs",
  }
};

export const HasFileWithPreviewDisabled: Story = {
  args: {
    hasFile: true,
    previewUrl: "https://ec7go7qzpxutxyogvudkkxxiuutnp46e62lzpbjeg2g3tu4rnq5q.arweave.net/IL5nfhl96Tvhxq0GpV7opSbX88T2l5eFJDaNudORbDs",
    disabled: true,
  }
};
