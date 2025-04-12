# Yeeter Strategy

A strategy for Allo Protocol that distributes tokens to recipients based on a amount allocation.


### Building & Testing

Build the foundry project with `forge build`. Then you can run tests with `forge
test`.

### Deployment & Verification

Inside the [`utils/`](./utils/) directory are a few preconfigured scripts that
can be used to deploy and verify contracts.

Scripts take inputs from the cli, using silent mode to hide any sensitive
information.

_NOTE: These scripts are required to be _executable_ meaning they must be made
executable by running `chmod +x ./utils/*`._

_NOTE: these scripts will prompt you for the contract name and deployed
addresses (when verifying). Also, they use the `-i` flag on `forge` to ask for
your private key for deployment. This uses silent mode which keeps your private
key from being printed to the console (and visible in logs)._

## I'm new, how do I get started?

We created a guide to get you started with:
[GETTING_STARTED.md](./GETTING_STARTED.md).

## Blueprint

```txt
.
├── lib
│   ├── allo-v2
│   ├── forge-std
│   ├── openzeppelin-contracts
│   └── solmate
├── script
│   └── Deploy.s.sol
├── src
│   └── Strategy.sol
└── test
    └── Strategy.t.sol
```

## About this Starter Template

This template is a fork of [yeeter-strategy](https://github.com/refcell/yeeter-strategy) that
has been modified to suite building allocation strategies for Allo Protocol. It
uses [foundry](https://github.com/foundry-rs/foundry) and comes with
[`allo-v2`](https://github.com/allo-protocol/allo-v2),
[solmate](https://github.com/transmissions11/solmate), and
[openzeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)
pre-installed.

The strategy you write should go in [`src/Strategy.sol`](./src/Strategy.sol).
We've set up basic testing infrastructure for you in [`test/`](./test).

If you're looking for examples of how to build and/or test a strategy, check out
the [strategy
library](https://github.com/allo-protocol/allo-v2/tree/main/contracts/strategies)

## Disclaimer

_These smart contracts are being provided as is. No guarantee, representation or
warranty is being made, express or implied, as to the safety or correctness of
the user interface or the smart contracts. They have not been audited and as
such there can be no assurance they will work as intended, and users may
experience delays, failures, errors, omissions, loss of transmitted information
or loss of funds. The creators are not liable for any of the foregoing. Users
should proceed with caution and use at their own risk._

See [LICENSE](./LICENSE) for more details.
