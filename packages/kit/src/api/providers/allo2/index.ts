import {
  type PublicClient,
  type WalletClient,
  encodePacked,
  getAddress,
  publicActions,
  keccak256,
  zeroAddress,
  decodeEventLog,
  type Address,
  type Chain,
} from "viem";
import { Allo, NATIVE, Registry } from "@allo-team/allo-v2-sdk/";
import { abi as AlloABI } from "@allo-team/allo-v2-sdk/dist/Allo/allo.config";
import type { API, TransactionInput } from "../../types";

const createAlloOpts = (chain: Chain) => ({
  chain: chain.id,
  rpc: chain.rpcUrls.default.http[0],
});

export const allo: API["allo"] = {
  createRound: async function (data, signer) {
    if (!signer?.account) throw new Error("Signer missing");

    const allo = new Allo(createAlloOpts(signer.chain!));

    const client = signer.extend(publicActions);

    const {
      amount = BigInt(0),
      metadata,
      strategy,
      token,
      managers = [],
      profileId,
      initStrategyData = "0x",
    } = data;
    if (typeof initStrategyData !== "string")
      throw new Error("initStrategyData must be a bytes string.");

    const tx = allo.createPool({
      profileId,
      strategy,
      // Set token address to native token if empty or zero address
      token: !token || token === zeroAddress ? (NATIVE as Address) : token,
      managers,
      amount,
      metadata,
      initStrategyData,
    });

    const hash = await this.sendTransaction?.(tx, signer);

    // Wait for PoolCreated event and return poolId
    return createLogDecoder(AlloABI, client)(hash!, ["PoolCreated"]).then(
      (logs) => {
        const id = String((logs?.[0]?.args as { poolId: bigint })?.poolId);
        return { id, chainId: signer.chain?.id as number };
      },
    );
  },
  createApplication: async function (data, signer) {
    if (!signer?.account) throw new Error("Signer missing");
    const allo = new Allo(createAlloOpts(signer.chain!));

    const client = signer.extend(publicActions);

    const { roundId, strategyData = "0x" } = data;

    const tx = allo.registerRecipient(roundId, strategyData);
    const hash = await this.sendTransaction?.(tx, signer);

    // TODO: UpdatedRegistration is not in AlloABI. Where and how do we parse this?
    return createLogDecoder(AlloABI, client)(hash!, [
      "UpdatedRegistration",
    ]).then((logs) => {
      const id = String(
        (logs?.[0]?.args as { recipientId: Address })?.recipientId,
      );
      return { id, chainId: signer.chain?.id as number };
    });
  },

  getProfile: async function (signer) {
    if (!signer?.account) throw new Error("Signer missing");
    const registry = new Registry(createAlloOpts(signer.chain!));
    const profile = await registry?.getProfileById(
      getProfileId(signer.account?.address!),
    );

    if (profile?.anchor === zeroAddress) return null;

    return profile.id;
  },
  createProfile: async function ({ metadata, name }, signer) {
    if (!signer?.account) throw new Error("Signer missing");

    // Profile must be created to deploy a pool
    const registry = new Registry(createAlloOpts(signer.chain!));
    const address = getAddress(signer.account?.address!);

    const { to, data } = registry.createProfile({
      nonce: PROFILE_NONCE,
      members: [],
      owner: address,
      metadata,
      name,
    });
    const hash = await signer.sendTransaction({
      to,
      data,
      account: address,
      chain: signer.chain,
    });
    return createLogDecoder(AlloABI, signer.extend(publicActions))(hash, [
      "ProfileCreated",
    ]).then((logs) => {
      const id = (logs?.[0]?.args as { profileId: Address })?.profileId;
      return { id, chainId: signer.chain?.id as number };
    });
  },
  allocate: async function (tx, signer) {
    if (!signer?.account) throw new Error("Signer missing");
    return await this.sendTransaction?.(tx, signer);
  },
  distribute: () => {},

  /* 
A custom sendTransaction can be sent to ApiProvider. 
<ApiProvider api={{ allo: { sendTransaction: cometh.wallet.sendTransaction } }} />

The default sendTransaction uses the Viem wallet signer of the connected wallet
*/
  sendTransaction: async function (
    tx: TransactionInput,
    signer?: WalletClient,
  ) {
    if (!signer?.account) throw new Error("Signer missing");
    const address = getAddress(signer.account?.address);

    return signer.sendTransaction({
      ...tx,
      value: BigInt(tx.value),
      account: address,
      chain: signer.chain,
    });
  },
};

function createLogDecoder(
  abi: readonly unknown[],
  client?: {
    waitForTransactionReceipt: PublicClient["waitForTransactionReceipt"];
  },
) {
  return async (hash: Address, events: string[]) =>
    client?.waitForTransactionReceipt({ hash }).then(({ logs }) => {
      return logs
        .map(({ data, topics }) => {
          try {
            const decoded = decodeEventLog({ abi, data, topics });
            return events.includes(decoded.eventName) ? decoded : null;
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean);
    });
}

const PROFILE_NONCE = BigInt(10);
export function dateToUint64(date: Date) {
  return BigInt(Math.round(Number(date) / 1000));
}

export function getProfileId(address: Address): Address {
  return keccak256(
    encodePacked(["uint256", "address"], [PROFILE_NONCE, address]),
  );
}
