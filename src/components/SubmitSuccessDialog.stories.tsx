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
  "id": "Ff6hyvaICMBnYyADpZLkvDj69LzraxR2XWl5BdOlvHI",
};
const trailerVideoResult = {
  "id": "SoN2tDbptfy4B7sY6Gw-WvU_yC3UuWHfyfPb6Qlhhkg",
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