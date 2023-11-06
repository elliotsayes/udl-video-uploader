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

const mainVideoResult = {
  "everHash": "0x03f1c87393a869f6bb19175c4badee520485d41b0c2bfe10f593b835531c5b60",
  "order": {
      "itemId": "Ff6hyvaICMBnYyADpZLkvDj69LzraxR2XWl5BdOlvHI",
      "size": 5304352,
      "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
      "currency": "AR",
      "decimals": 12,
      "fee": "4401078966",
      "paymentExpiredTime": 1701861248,
      "expectedBlock": 1296889,
      "tag": "arweave,ethereum-ar-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,0x4fadc7a98f2dc96510e42dd1a74141eeae0c1543"
  }
};
const trailerVideoResult = {
  "everHash": "0x1e70be86389dc6435c5239b1ece8e71fb0b95fc518c0cc419832190f1c311530",
  "order": {
      "itemId": "SoN2tDbptfy4B7sY6Gw-WvU_yC3UuWHfyfPb6Qlhhkg",
      "size": 4610675,
      "bundler": "uDA8ZblC-lyEFfsYXKewpwaX-kkNDDw8az3IW9bDL68",
      "currency": "AR",
      "decimals": 12,
      "fee": "3772719798",
      "paymentExpiredTime": 1701861238,
      "expectedBlock": 1296889,
      "tag": "arweave,ethereum-ar-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA,0x4fadc7a98f2dc96510e42dd1a74141eeae0c1543"
  }
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const MainVideoOnly: Story = {
  args: {
    mainVideoResult,
  },
};

export const MainVideoAndTrailer: Story = {
  args: {
    mainVideoResult,
    trailerVideoResult,
  },
};