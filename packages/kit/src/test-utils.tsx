import React, { PropsWithChildren, ReactElement } from "react";
import { render, renderHook, RenderOptions } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, vi } from "vitest";
import { graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { ApiProvider, Web3Provider } from ".";
import {
  mockApplications,
  mockProjects,
  mockRound,
  mockRounds,
} from "./api/providers/mock";

vi.mock("posthog-js/react", () => {
  return { PostHogProvider: ({ children }: PropsWithChildren) => children };
});

/* 
TODO: Add more mocks
Copy graphql response from the network tab in the browser and save in providers/mock/data.

Docs: https://mswjs.io/docs/network-behavior/graphql
*/
const server = setupServer(
  graphql.query("Round", ({ query }) => HttpResponse.json(mockRound)),
  graphql.query("Rounds", ({ query }) => HttpResponse.json(mockRounds)),
  graphql.query("Project", ({ query }) =>
    HttpResponse.json({
      data: { application: mockProjects.data?.projects[0] },
    }),
  ),
  graphql.query("Projects", ({ query }) => HttpResponse.json(mockProjects)),
  graphql.query("Application", ({ query }) =>
    HttpResponse.json({
      data: { application: mockApplications.data?.applications[0] },
    }),
  ),
  graphql.query("Applications", ({ query }) =>
    HttpResponse.json(mockApplications),
  ),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

export const mockCreateRound = vi.fn();
export const mockCreateApplication = vi.fn();
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ApiProvider
      api={{
        allo: {
          createRound: mockCreateRound,
          createApplication: mockCreateApplication,
        },
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

const customRenderHook = <Props, Result>(
  hook: (initialProps: Props) => Result,
  options?: Omit<RenderOptions, "wrapper">,
) => renderHook(hook, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { customRender as render };
export { customRenderHook as renderHook };
