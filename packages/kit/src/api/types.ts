import type { Address, Hash, WalletClient } from "viem";

type OrderBy = "asc" | "desc";

type RoundOrderKeys =
  | "created_at_block"
  | "funded_amount_in_usd"
  | "funded_amount"
  | "match_amount_in_usd"
  | "match_amount"
  | "matching_distribution"
  | "total_amount_donated_in_usd"
  | "total_donations_count"
  | "unique_donors_count";

type ProjectOrderKeys = "name" | "created_at_block";
type ApplicationOrderKeys =
  | "created_at_block"
  | "status"
  | "status_updated_at_block"
  | "total_donations_count"
  | "total_amount_donated_in_usd"
  | "unique_donors_count";

type DonationOrderKeys = "created_at_block" | "amount" | "amount_in_usd";

interface Query<T extends string> {
  orderBy?: Partial<Record<T, OrderBy>>;
  offset?: number;
  first?: number;
}
export interface RoundsQuery extends Query<RoundOrderKeys> {
  where?: RoundQueryWhere;
}
export interface ProjectsQuery extends Query<ProjectOrderKeys> {
  where?: ProjectQueryWhere;
}
export interface ApplicationsQuery extends Query<ApplicationOrderKeys> {
  where?: ApplicationQueryWhere;
}
export interface DonationsQuery extends Query<DonationOrderKeys> {
  where?: DonationQueryWhere;
}
export interface RolesQuery extends Query<string> {
  some?: RolesQueryWhere;
  every?: RolesQueryWhere;
}
type Compare<T = string | number> = {
  equalTo?: T;
  in?: T[];
  contains?: T[];
  gte?: number;
};
type RolesQueryWhere = {
  address?: Compare<Address>;
  role?: Compare<"ADMIN" | "MANAGER">;
};
type ApplicationQueryWhere = {
  chainId?: Compare<number>;
  status?: Compare<ApplicationStatus>;
  roundId?: Compare<string>;
  projectId?: Compare<string>;
  createdByAddress?: Compare<Address>;
  totalDonationsCount?: Compare<number>;
  totalAmountDonatedInUsd?: Compare<number>;
};
type DonationQueryWhere = {
  chainId?: Compare<number>;
  roundId?: Compare<string>;
  projectId?: Compare<string>;
};
type RoundQueryWhere = {
  id?: Compare;
  strategy?: Compare<Address>;
  strategyName?: Compare<
    | "allov2.DirectGrantsLiteStrategy"
    | "allov2.Yeeter"
    | "allov2.DonationVotingMerkleDistributionDirectTransferStrategy"
    | "allov2.SQFSuperFluidStrategy"
  >;
  chainId?: Compare<number>;
  tags?: Compare<"allo-v1" | "allo-v2" | "grants-stack">; // GrantsStack only (create a type in gs to extend)
  roundId?: Compare;
  createdAt?: Compare;
  createdBy?: Compare;
  applicationsStartTime?: Compare;
  applicationsEndTime?: Compare;
  donationsStartTime?: Compare;
  donationsEndTime?: Compare;
  applications?: ApplicationsQuery;
  roles?: RolesQuery;
  and?: RoundQueryWhere[];
};

type ProjectQueryWhere = {
  chainId?: Compare<number>;
  createdByAddress?: Compare<Address>;
};
// For passing random data to the request in API provider (for example chainId)
export type QueryOpts = Record<string, string | number>;
export type Allocation = { id: string; amount?: number };
export type Ballot = Record<string, Allocation>;

export interface API {
  indexer: {
    rounds: (query: RoundsQuery) => Promise<Round[]>;
    roundById: (id: string, opts?: QueryOpts) => Promise<Round | undefined>;
    projects: (query: ProjectsQuery) => Promise<Project[]>;
    projectById: (id: string, opts?: QueryOpts) => Promise<Project | undefined>;

    applications: (query: ApplicationsQuery) => Promise<Application[]>;
    applicationById: (
      id: string,
      opts?: QueryOpts,
    ) => Promise<Application | undefined>;
    donations: (query: DonationsQuery) => Promise<Donation[]>;
  };
  allo: {
    createRound: (
      data: RoundInput,
      signer: WalletClient,
    ) => Promise<RoundCreated>;
    createApplication: (
      data: ApplicationInput,
      signer: WalletClient,
    ) => Promise<ApplicationCreated>;
    getProfile: (signer: WalletClient) => Promise<Address | null>;
    createProfile: (
      data: ProfileInput,
      signer: WalletClient,
    ) => Promise<ProfileCreated>;
    allocate: (
      tx: TransactionInput,
      signer: WalletClient,
    ) => Promise<Address | undefined>;
    distribute: () => void;
    sendTransaction: (
      tx: { to: `0x${string}`; data: `0x${string}`; value: string | bigint },
      signer?: WalletClient, // TODO: Use something more generic than WalletClient?
    ) => Promise<Hash>;
  };
  ballot: () => Promise<Ballot>;
  addToBallot: (ballot: Ballot) => Promise<Ballot>;
  saveBallot: (ballot: Ballot) => Promise<Ballot>;
  upload: (data: Record<string, unknown> | File | FormData) => Promise<string>;
}
// Transforms data from API into a common shape

export interface Transformers<TRound, TApplication, TProject, TDonation> {
  round: (round: TRound) => Round;
  application: (application: TApplication) => Application;
  project: (project: TProject) => Project;
  donation: (donation: TDonation) => Donation;
}

type BaseRound = {
  token?: Address;
  strategy: Address;
  managers?: Address[];
};
export type Round = BaseRound & {
  id: string;
  name: string;
  description: string;
  eligibility: {
    description: string;
    requirements?: { requirement: string }[];
  };
  chainId: number;
  applications?: { id: string }[];
  matching: { amount: bigint; token: Address };
  avatarUrl?: string;
  bannerUrl?: string;
  strategyName?: string;
  phases: {
    applicationsStartTime?: string;
    applicationsEndTime?: string;
    donationsStartTime?: string;
    donationsEndTime?: string;
  };
  roles: { address: Address; role: "ADMIN" | "MANAGER" }[];
};

export type RoundInput = BaseRound & {
  profileId: Address;
  metadata: { protocol: bigint; pointer: string };
  initStrategyData?: Address;
  amount?: bigint;
};
export type RoundCreated = { id: string; chainId: number };

type BaseApplication = {};
export type ApplicationStatus =
  | "APPROVED"
  | "PENDING"
  | "REJECTED"
  | "CANCELLED"
  | "IN_REVIEW";

export type Application = BaseApplication & {
  id: string;
  name: string;
  description?: string;
  recipient: Address;
  avatarUrl?: string;
  bannerUrl?: string;
  chainId: number;
  projectId: string;
  contributors?: {
    count?: number;
    amount?: number;
  };
  answers: {
    questionId: number;
    type: string;
    answer: string;
    hidden: boolean;
    question: string;
  }[];
  status: ApplicationStatus;
};

export type ApplicationInput = BaseApplication & {
  roundId: bigint;
  strategyData?: Address;
};

export type ApplicationCreated = { id: string; chainId: number };

type BaseProject = {
  name: string;
  description?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};
export type Project = BaseProject & {
  id: string;
  anchorAddress: string;
  chainId: number;
};

export type ProjectCreated = { id: string; chainId: number };

export type Donation = {
  roundId: string;
  projectId: string;
  chainId: number;
  donorAddress: string;
  recipientAddress: string;
  transactionHash: string;
  amount: string;
  amountInUsd: string;
  tokenAddress: string;
};

export type AllocateInput = {
  roundId: string;
  data: `0x${string}`;
};

export type TransactionInput = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: string | bigint;
};

export type ProfileInput = {
  name: string;
  metadata: { protocol: bigint; pointer: string };
};

export type ProfileCreated = {
  id: string;
  chainId: number;
};
