const C = require('./constants');
const adminTests = require('./tests/adminTests');
const happyPath = require('./tests/happyPath');
const { segmentTests, segmentVotingVaultTests, segmentErrorTests } = require('./tests/segmentTests');
const { claimTests, claimErrorTests } = require('./tests/claimTests');
const { createTests, createErrorTests } = require('./tests/createTests');
const {
  redeemTests,
  redeemSegmentCombineTests,
  redeemVotingVaultTests,
  redeemErrorTests,
} = require('./tests/redeemTests');
const { revokeTests, revokeErrorTests } = require('./tests/revokeTests');
const { votingVaultTests, votingVaultDelegatorTests, votingVaultErrorTests } = require('./tests/votingVaultTests');
const delegateTests = require('./tests/delegateTests');
const transferTests = require('./tests/transferTests');

const mainParamsMatrix = [
  { amount: C.E18_1000, period: C.DAY, rate: C.E18_10, start: C.ZERO, cliff: C.DAY, balanceCheck: C.WEEK },
  { amount: C.E18_1000, period: C.DAY, rate: C.E18_10, start: C.ZERO, cliff: C.WEEK, balanceCheck: C.WEEK },
  {
    amount: C.E18_1000,
    period: C.ONE,
    rate: C.E6_10000.mul(44000),
    start: C.ZERO,
    cliff: C.WEEK,
    balanceCheck: C.DAY.mul(8),
  },
  {
    amount: C.E18_1000.mul(4),
    period: C.ONE,
    rate: C.E6_10000.mul(90099),
    start: C.ZERO,
    cliff: C.WEEK,
    balanceCheck: C.WEEK,
  },
  {
    amount: C.E18_10000.mul(7),
    period: C.WEEK,
    rate: C.E18_13.mul(10),
    start: C.ZERO,
    cliff: C.MONTH,
    balanceCheck: C.DAY.mul(34),
  },
  {
    amount: C.E18_1000000,
    period: C.ONE,
    rate: C.E18_1000000.div(60).div(60).div(24).div(365).div(2),
    start: C.WEEK,
    cliff: C.WEEK,
    balanceCheck: C.WEEK.mul(2),
  },
  {
    amount: C.E18_1000000,
    period: C.ONE,
    rate: C.E18_1000000.div(60).div(60).div(24).div(365),
    start: -86500,
    cliff: C.WEEK,
    balanceCheck: C.WEEK,
  },
  {
    amount: C.E18_1000000,
    period: C.MONTH,
    rate: C.E18_1000000.div(12).div(2),
    start: C.ZERO,
    cliff: C.MONTH.mul(2),
    balanceCheck: C.MONTH.mul(2),
  },
];

describe('Testing the URI Admin functions', () => {
  adminTests(true, false);
  adminTests(true, true);
  adminTests(false, false);
  adminTests(false, true);
});

describe('Testing the Happy Path', () => {
  mainParamsMatrix.forEach((params) => {
    happyPath(true, true, params);
    happyPath(true, false, params);
    happyPath(false, true, params);
    happyPath(false, false, params);
  });
});

describe('Testing the create methods for minting a new plan', () => {
  mainParamsMatrix.forEach((params) => {
    createTests(true, true, params);
    createTests(true, false, params);
    createTests(false, true, params);
    createTests(false, false, params);
  });
  createErrorTests(true, true);
  createErrorTests(true, false);
  createErrorTests(false, true);
  createErrorTests(false, false);
});

describe('Testing redeeming funtions', () => {
  mainParamsMatrix.forEach((params) => {
    redeemTests(true, true, params);
    redeemTests(true, false, params);
    redeemTests(false, true, params);
    redeemTests(false, false, params);
    redeemSegmentCombineTests(true, params);
    redeemSegmentCombineTests(false, params);
    redeemVotingVaultTests(true, params);
    redeemVotingVaultTests(false, params);
  });
  redeemErrorTests(true, true);
  redeemErrorTests(true, false);
  redeemErrorTests(false, true);
  redeemErrorTests(false, false);
});

describe('Testing the revoke functions', () => {
  mainParamsMatrix.forEach((params) => {
    revokeTests(true, params);
    revokeTests(false, params);
  });
  revokeErrorTests(true);
  revokeErrorTests(false);
});

describe('Testing the Segmentation and Combination Methods', () => {
  const paramsMatrix = [
    {
      amount: C.E18_1000,
      period: C.DAY,
      rate: C.E18_10,
      start: C.ZERO,
      cliff: C.DAY,
      segmentAmount: C.E18_100.mul(5),
      secondSegment: C.E18_100,
      test: 1,
    },
    {
      amount: C.E18_1000.mul(8),
      period: C.DAY,
      rate: C.E18_10,
      start: C.ZERO,
      cliff: C.WEEK,
      segmentAmount: C.E18_100,
      secondSegment: C.E18_100.mul(3),
      test: 2,
    },
    {
      amount: C.E18_1000.mul(12),
      period: C.DAY,
      rate: C.E18_12,
      start: C.ZERO,
      cliff: C.WEEK,
      segmentAmount: C.E18_1000,
      secondSegment: C.E18_1000.mul(3),
      test: 3,
    },
    {
      amount: C.E18_10000,
      period: C.DAY,
      rate: C.E18_12,
      start: C.ZERO,
      cliff: C.WEEK,
      segmentAmount: C.E18_1000.mul(7),
      secondSegment: C.E18_100.mul(5),
      test: 4,
    },
    {
      amount: C.E18_10000.mul(7),
      period: C.WEEK,
      rate: C.E18_13.mul(10),
      start: C.ZERO,
      cliff: C.MONTH,
      segmentAmount: C.E18_13.mul(100),
      secondSegment: C.E18_100.mul(2),
      test: 5,
    },
    {
      amount: C.E18_10000.mul(72),
      period: C.WEEK,
      rate: C.E18_13.mul(10),
      start: C.ZERO,
      cliff: C.MONTH,
      segmentAmount: C.E18_1000.mul(43),
      secondSegment: C.E18_100.mul(4),
      test: 6,
    },
    {
      amount: C.E18_10000.mul(80),
      period: C.ONE,
      rate: C.E12_1.mul(10000),
      start: C.ZERO,
      cliff: C.DAY,
      segmentAmount: C.E18_1000,
      secondSegment: C.E18_1000.mul(5),
      test: 7,
    },
    {
      amount: C.E18_10000.mul(45),
      period: C.ONE,
      rate: C.E12_1.mul(10000),
      start: C.ZERO,
      cliff: C.DAY,
      segmentAmount: C.E18_05.mul(9),
      secondSegment: C.E18_1000.mul(5),
      test: 8,
    },
    {
      amount: C.E18_1000000,
      period: C.ONE,
      rate: C.E18_1000000.div(60).div(60).div(24).div(365).div(2),
      start: C.WEEK,
      cliff: C.WEEK,
      segmentAmount: C.E18_1000000.div(2),
      secondSegment: C.E18_1000.mul(5),
      test: 9,
    },
    {
      amount: C.E18_1000000,
      period: C.ONE,
      rate: C.E18_1000000.div(60).div(60).div(24).div(365),
      start: -86500,
      cliff: C.WEEK,
      segmentAmount: C.E18_1000000.sub(C.E18_7500),
      secondSegment: C.E18_7500.div(2),
      test: 10,
    },
    {
      amount: C.E18_1000000,
      period: C.MONTH,
      rate: C.E18_1000000.div(12).div(3),
      start: C.ZERO,
      cliff: C.MONTH.mul(2),
      segmentAmount: C.E18_1000000.sub(C.E18_10000),
      secondSegment: C.E18_10000.div(7),
      test: 11,
    },
  ];
  paramsMatrix.forEach((params) => {
    segmentTests(false, params);
    segmentTests(true, params);
    segmentVotingVaultTests(params);
  });
  segmentErrorTests(true);
  segmentErrorTests(false);
});

describe('Testing the voting vault setup and functions', () => {
  mainParamsMatrix.forEach((params) => {
    votingVaultTests(true, params);
    votingVaultTests(false, params);
    votingVaultDelegatorTests(true, params);
    votingVaultDelegatorTests(false, params);
  });
  votingVaultErrorTests(true);
  votingVaultErrorTests(false);
});

describe('Testing for the NFT delegation functions', () => {
  mainParamsMatrix.forEach((params) => {
    delegateTests(true, params);
    delegateTests(false, params);
  });
});

describe('Testing the transfer and non transfer functions', () => {
  transferTests();
});

describe('Testing the Claim Campaign tests', () => {
  const paramsMatrix = [
    { totalRecipients: 100, nodeA: 5, nodeB: 33, rate: C.E18_05, start: C.ZERO, period: C.DAY, cliff: C.DAY },
    { totalRecipients: 10, nodeA: 5, nodeB: 12, rate: C.E18_05, start: C.ZERO, period: C.DAY, cliff: C.DAY },
  ];
  paramsMatrix.forEach((params) => {
    claimTests(0, false, params);
    claimTests(1, true, params);
    claimTests(1, false, params);
    claimTests(2, true, params);
    claimTests(2, false, params);
  });
  claimErrorTests();
});
