import type { Meta, StoryObj } from "@storybook/react";

import { SubmitSuccessDialog } from "./SubmitSuccessDialog";
import { Dialog } from "./ui/dialog";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "App/SubmitSuccessDialog",
  component: SubmitSuccessDialog,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  args: {},
  render: (args) => (
    <Dialog
      open={true}
    >
      <SubmitSuccessDialog {...args} />
    </Dialog>
  ),
} satisfies Meta<typeof SubmitSuccessDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleVideoResult = {
  "everHash": "0x6213fe7c826a499162cf6785eb9455296e3a167b6bc959ff17d973a1ec2a2541",
  "order": {
    "itemId": "gvOd2uF-yImgp74P7IzOke_555m-Xubjpr_97SX9B20",
    "size": 2071835,
    "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
    "currency": "AR",
    "decimals": 12,
    "fee": "1678189238",
    "paymentExpiredTime": 1701839600,
    "expectedBlock": 1296717,
    "tag": "arweave,ethereum-ar-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,0x4fadc7a98f2dc96510e42dd1a74141eeae0c1543"
  }
}

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const MainVideoOnly: Story = {
  args: {
    mainVideoResult: exampleVideoResult,
  },
};

export const MainVideoAndTrailer: Story = {
  args: {
    mainVideoResult: exampleVideoResult,
    trailerVideoResult: exampleVideoResult,
  },
};