# Creating a simple grants app

Let's create a simple grants app using Next.js and AlloKit.

```sh
# Create a new Next.js app
npx create-next-app@latest allo-app


# Navigate to folder and add AlloKit to package.json
bun add @allo-team/kit
```

### Configuring Providers

AlloKit has two providers:

- **ApiProvider** - Queries the Indexer and interacts with the Allo Protocol contracts
- **Web3Provider** - Wagmi and RainbowKit to connect wallets

Create a new file `src/providers.tsx`.

```tsx
"use client";

import { ApiProvider, Web3Provider } from "@allo-team/kit";

export function AlloKitProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApiProvider>
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}
```

Update `src/layout.tsx` to import the css, add the providers and define a simple layout.

```tsx
...
import "@allo-team/kit/styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlloKitProviders>
          <main className="max-w-screen-lg mx-auto py-16">{children}</main>
        </AlloKitProviders>
      </body>
    </html>
  );
```

### Discover Rounds Page

Create a new file: `src/[chainId]/rounds/page.tsx`.

DiscoverRounds is a pre-made component that does most of the heavy lifting in fetching and displaying rounds.

It fetches the rounds based on a provided query (with sane defaults) and renders it as a grid by default but easy to render custom components.

The `query` prop is mapped to the queries in the Indexer GraphQL api.
https://grants-stack-indexer-v2.gitcoin.co/graphiql

```tsx
import Link from "next/link";
import { DiscoverRounds } from "@allo-team/kit";

export default function DiscoverRoundsPage({ params: { chainId = 1 } }) {
  return (
    <DiscoverRounds
      query={{
        where: {
          // Show rounds matching the chainId in the route
          chainId: { in: [Number(chainId)] },
          // With the DirectGrantsLite strategy (we can add more to this array or leave empty for all)
          strategyName: { in: ["allov2.DirectGrantsLiteStrategy"] },
          // In the RoundCard component we show how many applications in the Round
          // With this query we choose to count only the approved ones
          applications: { where: { status: { in: ["APPROVED"] } } },
        },
        // Sort by top donated rounds
        orderBy: { total_amount_donated_in_usd: "desc" },
        // We can implement pagination here later by storing these in a state or url with nuqs
        // Changing these will automatically fetch (and cached when navigating back and forth thanks to ReactQuery)
        offset: 0,
        first: 12,
      }}
      // Wrap the RoundCard in a Link (both roundId and chainId are required to query the round)
      renderItem={(round, Round) => (
        <Link href={`/${round.chainId}/rounds/${round.id}`} key={round.key}>
          <Round {...round} />
        </Link>
      )}
      columns={[1, 2, 3]}
    />
  );
}
```

### Round Details Page

Create the file `src/rounds/[chainId]/[roundId]/page.tsx`.

```tsx
import {
  Button,
  BackButton,
  DiscoverApplications,
  RoundDetailsWithHook as RoundDetails,
} from "@allo-team/kit";
import Link from "next/link";

export default function RoundPage({ params: { chainId = 0, roundId = "" } }) {
  return (
    <section className="space-y-8">
      <RoundDetails
        id={roundId}
        chainId={chainId}
        // Provide a button to navigate back to home page
        backAction={
          <Link href={`/`}>
            <BackButton />
          </Link>
        }
        primaryAction={
          <Link href={`/${chainId}/rounds/${roundId}/apply`}>
            <Button>Apply to Round</Button>
          </Link>
        }
      />

      <h3 className="text-lg font-semibold">Approved Projects</h3>
      <DiscoverApplications
        columns={[1, 3]}
        query={{
          first: 12,
          where: {
            // Get the approved Applications for the round
            roundId: { equalTo: roundId },
            status: { equalTo: "APPROVED" },
          },
        }}
        renderItem={(application, Application) => (
          <Link
            href={`/${chainId}/applications/${roundId}/${application.id}`}
            key={application.id}
          >
            <Application {...application} />
          </Link>
        )}
      />
    </section>
  );
}
```

This will display the round details and a list of approved applications. Each application links to an application details page.

### Connecting a Wallet

Update `src/app/layout.tsx`

```tsx
...
import { ConnectButton } from "@allo-team/kit";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlloKitProviders>
          <main className="max-w-screen-lg mx-auto py-16">
          <ConnectButton />
          {children}
          </main>
        </AlloKitProviders>
      </body>
    </html>
  );
```

### Create Round Page

Create the file: `src/admin/rounds/create/page.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";
import { CreateRound } from "@allo-team/kit";

export default function CreateRoundPage({}) {
  const router = useRouter();
  return (
    <CreateRound
      onCreated={({ id, chainId }) => router.push(`/${chainId}/rounds/${id}`)}
    />
  );
}
```

This will render the form for creating a new round. When successfully created a round the user is redirected to view the round details. Later we can create a different page where Round admins can manage the round.

We also need to update our ApiProvider with an upload function. This is called when the round metadata is being uploaded (either ipfs, CDN, or some other kind of data storage). This upload function is used whenever metadata is uploaded from AlloKit.

Update `src/providers.tsx` with this:

```tsx
"use client";

import { ApiProvider, Web3Provider } from "@allo-team/kit";

export function AlloKitProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApiProvider
      api={{
        upload: async (data) => {
          return fetch(`/api/ipfs`, { method: "POST", body: toFormData(data) })
            .then((r) => r.json())
            .then((r) => r.cid);
        },
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </ApiProvider>
  );
}

// Normalize object into FormData
function toFormData(data: File | Record<string, unknown> | FormData) {
  const formData = new FormData();

  if (!(data instanceof File)) {
    const blob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    data = new File([blob], "metadata.json");
  }

  formData.append("file", data);
  return formData;
}
```

And in `src/api/ipfs/route.ts`:

```ts
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const file = form.get("file") as unknown as File;
    form.append("file", file);
    form.append("pinataMetadata", JSON.stringify({ name: file.name }));

    const { IpfsHash: cid } = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
        body: form,
      }
    ).then((r) => r.json());
    const url = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${cid}`;

    return NextResponse.json({ url, cid }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
```

You will also need to copy the `.env.sample` to `.env.local` and configure the Pinata variables. You may also choose a different IPFS provider or any other kind of storage (Vercel Blob, AWS S3, ...).

> **Why is this function not in AlloKit?**  
> AlloKit is currently only client-side components and these upload functions run server-side.
> In the future we might provide these functions as part of the package or even provide an endpoint for uploads as a backend service.

### Apply to Round Page

Create the file `src/rounds/[chainId]/[roundId]/apply/page.tsx`.

```tsx
"use client";

import { useRouter } from "next/navigation";
import { CreateApplication } from "@allo-team/kit";

export default function CreateApplicationPage({
  params: { roundId, chainId },
}: {
  params: { roundId: string; chainId: string };
}) {
  const router = useRouter();
  return (
    <section>
      <CreateApplication
        chainId={chainId}
        roundId={roundId}
        onCreated={({ id, chainId }) =>
          router.push(`/${chainId}/applications/${id}`)
        }
      />
    </section>
  );
}
```

The CreateApplication component will automatically render the required forms for this round. This is based on the strategy the round was created with.

In AlloKit there are StrategyExtensions that allow developers to customize the behaviour of common components such as CreateRound, CreateApplication, ReviewApplications etc. In this case, the application for DirectGrantsLite expects an encoded byte string of `recipientAddress` and `metadata`. If you're curious about seeing how this works, have a look in the AlloKit source code (`src/strategies/direct-grants`).

When the application has been created we navigate the user to the application details page.

### Application Details Page

Create the file: `src/[chainId]/applications/[roundId]/[applicationId]/page.tsx`.

```tsx
import {
  ApplicationsDetails,
  Button,
  useIsRoundAdmin,
  useApproveApplication,
} from "@allo-team/kit";

export default function ApplicationDetailsPage({
  params: { chainId = 0, applicationId = "" },
}) {
  const isRoundAdmin = useIsRoundAdmin();
  const review = useReviewApplication();
  return (
    <ApplicationsDetails
      id={applicationId}
      chainId={chainId}
      actions={
        // Show Approve and Reject buttons
        isRoundAdmin
          ? [
              <Button
                isLoading={review.isPending && review.variables.status === 2}
                onClick={() => review.mutate({ id: applicationId, status: 2 })}
              >
                Approve
              </Button>,
              <Button
                isLoading={review.isPending && review.variables.status === 1}
                onClick={() => review.mutate({ id: applicationId, status: 1 })}
              >
                Reject
              </Button>,
            ]
          : undefined
      }
    />
  );
}
```

This will show the application details and if the user is a round admin it will render Approve and Reject buttons.

Checking for `review.variables.status` in `isLoading` makes sure we only show loading on the button that was clicked.

### Admin Pages

- View Applications (and approve/reject multiple)
- Distribute tokens
