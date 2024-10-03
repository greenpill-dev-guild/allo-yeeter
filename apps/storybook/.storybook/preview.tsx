import React from "react";
import type { Preview } from "@storybook/react";
import "@allo-team/kit/styles.css";
// import { graphql, HttpResponse } from "msw";
// import { initialize, mswLoader } from "msw-storybook-addon";

// Initialize MSW
// initialize();

import { ApiProvider } from "@allo-team/kit";
import { Web3Provider } from "@allo-team/kit";
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        method: "",
        order: ["UI"],
        locales: "",
      },
    },
    // We can use MSW to mock data fetching
    // msw: {
    //   handlers: [
    //     graphql.query("Rounds", ({}) => {
    //       return HttpResponse.json({ data: { rounds } });
    //     }),
    //   ],
    // },
  },
  // loaders: [mswLoader],

  decorators: [
    (Story, { parameters: { theme = "light" } }) => {
      return (
        <ApiProvider>
          <Web3Provider>
            <Story />
          </Web3Provider>
        </ApiProvider>
      );
    },
  ],
};

export default preview;
