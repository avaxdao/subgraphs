# Subgraphs

1. **[Profile](https://thegraph.com/hosted-service/subgraph/avaxdao/profile-v2)**: Tracks user profile NFT lockup status and points earned from Learn To Earn tasks.

2. **[Governance NFTs](https://thegraph.com/hosted-service/subgraph/avaxdao/governance-nfts)**: Tracks all information relating to AxDAO governance NFTs.

3. Power Tracker: Stores a record of all AxStarter ERC20 Token transactions to calculate a users Power on the AxStarter launchpad.

## Dependencies

- [Ganache CLI](https://github.com/trufflesuite/ganache)
  - Required to run an Ethereum network locally to deploy test contracts and subgraphs.
- [Truffle Suite](https://github.com/trufflesuite/truffle)
  - Required to deploy test contracts on the local instance of the Ethereum network.
- [Graph Node](https://github.com/graphprotocol/graph-node)
  - Required to run a local graph node to host local subgraphs.
- [Graph CLI](https://github.com/graphprotocol/graph-cli)
  - Required to generate and build local GraphQL dependencies.
