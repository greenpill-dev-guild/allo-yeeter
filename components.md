### ApiProvider

React Provider component that handles the internals of fetching data from indexers.

It should be flexible enough to easily swap out API calls.

- Gitcoin Indexer?
- EasyRF?

API can be overridden like this:

```tsx
<ApiProvider
  api={{
    rounds: (query) =>
      // Can even support non-GraphQL endpoints
      fetch(`https://indexer/api?limit=${query.limit}&skip=${query.skip}`)
        .then((r) => r.json())
        .then((rounds) => rounds.map(transformRound)), // If indexer returns different shape of data
    roundById: (id) => fetch(`...`).then(transformRound),
    projects: (query) => {},
    projectById: () => {},
    metrics: (query) => {},
    metricById: () => {},
    ballot: () => {},
    saveBallot: (ballot) =>
      fetch(`https://api/ballot`, {
        body: JSON.stringify(transformBallot(ballot)), // If API expects different shape of ballot
      }),

    createRound: () => {},
    updateRound: () => {},
    createProject: () => {},
    updateProject: () => {},
    applyRound: () => {},
  }}
>
  {/* App */}
</ApiProvider>
```

### ConnectWallet

- Connect wallet button
- Sign SIWE auth (persistant JWT session)
- Sign messages
- WagmiProvider

### DiscoverRounds

Hook to fetch data from any component

```tsx
const { data, isPending } = useRounds(query: RoundsQuery);

```

Ready-made component to render a grid of rounds

```tsx
<DiscoverRounds
  /*
    DiscoverRounds is a pre-made component that does most of the heavy lifting
    in fething and displaying rounds.

    It fetches the rounds based on a provided query (with sane defaults) and renders it as a grid by default but easy to customize with own components.
    */
  query={{
    /*
      The query prop enables a powerful way to fetch data from the indexer.

      For example:
      - only rounds with these strategies (deployed contract address)
      - order by when they were created, newest first
      - with first and offset we can paginate the results and decide how many to show
      */
    where: { strategy: { in: ["0x...a", "0x...b"] } },
    orderBy: { createdAt: "desc" },
    offset: 0,
    first: 12,
  }}
  /*
      The renderItem function lets us change what component is rendered.

      For example:
        - Wrap the default RoundItem component in a link

      */
  renderItem={(round, Component) => (
    <Link href={`/rounds/${round.id}`} key={round.id}>
      <Component {...round} />
    </Link>
  )}
  /*
        Columns let us choose how to render the rounds.

        For example:
          - 1 column on phones
          - 2 columns on small to medium
          - 3 columns on medium to large
          - 4 columns on large and above

        We could also set it to [1] to render as list on all screens
      */
  columns={[1, 2, 3, 4]}
/>
```

### RoundDetails

```tsx
const { data, isPending } = useRoundById(id: string);
```

### DiscoverProjects

```tsx
const { data, isPending } = useProjects(query: ProjectsQuery);
```

### ProjectsDetails

```tsx
const { data, isPending } = useProjectsById(id: string);
```

### DiscoverMetrics

```tsx
const { data, isPending } = useMetrics(query: MetricsQuery);
```

### MetricDetails

```tsx
const { data, isPending } = useMetricById(id: string);
```

### BallotEditor

Should be possible to use for both types of ballots (`metric`, `project`)

> What are the UI diffs?

```tsx
const { data, isPending } = useBallot();
const { mutate, isPending } = useSaveBallot();

const { set, inc, dec, add, remove, reset, state } = useBallotEditor(ballot, {
  debounceRate,
  onUpdate,
});
```

### BallotMetricsEditor

```tsx

```

### RoundForm

Create and edit a round.

This would likely be split into several components.

Some of the configurations

- round details (name, description)
- round phases (start, applications, voting, results, distribution, ...)
- network, token, strategy
- admin accounts

### RoundAdminVoters

Allowed voters (if applicable)

### RoundAdminApplications

Received applications.

### RoundDistribution

Distribute tokens to recipients.

### ProjectForm

Create and edit a project

### ProjectApplicationForm

Apply to a round with a project

---

- allocation sidebar (metric)
- ballot editor (metric)
- discover projects
- project details
- allocation sidebar (project)
- ballot editor (project)
- ballot editor (budget)
- submit ballot
- ballot confirmation

### ContributorStats

Should the impact created by a contributor.
