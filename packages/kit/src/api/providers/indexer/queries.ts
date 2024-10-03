import { gql } from "@urql/core";

const ROUND_FRAGMENT = `
id
chainId
tags
roundMetadata
roundMetadataCid
applicationsStartTime
applicationsEndTime
donationsStartTime
donationsEndTime
matchAmountInUsd
matchAmount
matchTokenAddress
strategyId
strategyName
strategyAddress
`;
export const roundsQuery = gql`
  query Rounds(
    $first: Int,
    $offset: Int,
    $orderBy: [RoundsOrderBy!],
    $filter: RoundFilter,
    $applications_filter: ApplicationFilter,
    $applications_orderBy: [ApplicationsOrderBy!],
    $roles_filter: RoundRoleFilter
  ) {
    rounds(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      ${ROUND_FRAGMENT}
      roles(first: 1000, filter: $roles_filter) {
        address
        role
      }
      applications(first: 1000, filter: $applications_filter, orderBy: $applications_orderBy) {
        id
      }
    }
  }
`;
export const roundsByIdQuery = gql`
  query Round(
    $id: String!,
    $chainId: Int!,
    $applications_filter: ApplicationFilter,
    $applications_orderBy: [ApplicationsOrderBy!],
    $roles_filter: RoundRoleFilter
  ) {
    round(id: $id, chainId: $chainId) {
      ${ROUND_FRAGMENT}
      roles(first: 1000, filter: $roles_filter) {
        address
        role
      }
      applications(first: 1000, filter: $applications_filter, orderBy: $applications_orderBy) {
        id
      }
    }
  }
`;

const APPLICATION_FRAGMENT = `
id
chainId
roundId
projectId
status
totalAmountDonatedInUsd
uniqueDonorsCount
totalDonationsCount
anchorAddress
round {
  strategyName
  donationsStartTime
  donationsEndTime
  applicationsStartTime
  applicationsEndTime
  matchTokenAddress
  roundMetadata
}
metadata
project: canonicalProject {
  tags
  id
  metadata
  anchorAddress
}
`;

export const applicationsQuery = gql`
  query Applications(
    $first: Int
    $offset: Int
    $orderBy: [ApplicationsOrderBy!]
    $filter: ApplicationFilter
  ) {
    applications(
      first: $first
      offset: $offset
      orderBy: $orderBy
      filter: $filter
    ) {
      ${APPLICATION_FRAGMENT}
    }
  }
`;

export const applicationsByIdQuery = gql`
  query Application($id: String!, $chainId: Int!, $roundId: String!) {
    application(id: $id, chainId: $chainId, roundId: $roundId) {
      ${APPLICATION_FRAGMENT}
    }
  }
`;

const PROJECT_FRAGMENT = `
id
name
projectType
chainId
createdByAddress
anchorAddress
metadata
`;
export const projectsQuery = gql`
  query Projects($first: Int, $offset: Int, $orderBy: [ProjectsOrderBy!], $filter: ProjectFilter) {
    projects(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      ${PROJECT_FRAGMENT}
    }
  }
`;

const DONATION_FRAGMENT = `
roundId
projectId
chainId
donorAddress
recipientAddress
transactionHash
amount
amountInUsd
roundId
tokenAddress
`;
export const donationsQuery = gql`
  query Donations($first: Int, $offset: Int, $orderBy: [DonationsOrderBy!], $filter: DonationFilter) {
    donations(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      ${DONATION_FRAGMENT}
    }
  }
`;
