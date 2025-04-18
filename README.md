# Celo Subgraph Workshop

> This repository is based on [kmjones1979/celo-subgraph-workshop](https://github.com/kmjones1979/celo-subgraph-workshop)

This workshop guides you through building a full-stack dapp on Celo, featuring:

-   Smart contract development with Hardhat
-   Frontend integration with React (NextJS)
-   Subgraph integration for efficient blockchain data querying

## 📚 Table of Contents

-   [Prerequisites](#prerequisites)
-   [Workshop Steps](#workshop-steps)
    -   [Step 1: Setup](#step-1-setup)
    -   [Step 2: Start Local Blockchain](#step-2-start-local-blockchain)
    -   [Step 3: Deploy Smart Contract](#step-3-deploy-smart-contract)
    -   [Step 4: Start the Frontend](#step-4-start-the-frontend)
    -   [Step 5: Setup The Graph Integration](#step-5-setup-the-graph-integration)
    -   [Step 6: Customize Your Token (Optional)](#step-6-customize-your-token-optional)
-   [Deploying to Celo Networks](#deploying-to-celo-networks)
    -   [Environment Setup](#environment-setup)
    -   [Deploying to Testnet](#deploying-to-testnet)
    -   [Deploying to Mainnet](#deploying-to-mainnet)
-   [Subgraph Deployment](#subgraph-deployment)
-   [Configuring Graph Client](#configuring-graph-client)
-   [Frontend Integration](#frontend-integration)
-   [Troubleshooting](#troubleshooting)
-   [Additional Resources](#additional-resources)

## Prerequisites

Before you begin, make sure you have installed:

-   [Node (>= v20.18.3)](https://nodejs.org/en/download/)
-   [Yarn](https://yarnpkg.com/getting-started/install)
-   [Git](https://git-scm.com/downloads)
-   [Docker](https://docs.docker.com/get-started/get-docker/)

## Workshop Steps

### Step 1: Setup

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/kmjones1979/celo-subgraph-workshop.git
cd celo-subgraph-workshop

# Install dependencies
yarn install
```

### Step 2: Start Local Blockchain

In your first terminal window:

```bash
yarn chain
```

This starts a local Hardhat node. Keep this terminal open to see blockchain logs.

> **Note for Linux users**: You might need to update the chain command in packages/hardhat/package.json:
>
> ```json
> "chain": "hardhat node --network hardhat --no-deploy --hostname 0.0.0.0"
> ```
>
> You may also need to add a firewall exception: `sudo ufw allow 8545/tcp`

### Step 3: Deploy Smart Contract

In a second terminal window:

```bash
yarn deploy
```

This deploys your ERC20 token contract to the local blockchain.

### Step 4: Start the Frontend

In a third terminal window:

```bash
yarn start
```

Visit your application at: `http://localhost:3000`

### Step 5: Setup The Graph Integration

#### 5.1: Clean Up and Start Graph Node

Before setting up The Graph, make sure Docker is running!

```bash
# Clean up any old data
yarn subgraph:clean-node

# Start the graph node (Keep this terminal open)
yarn subgraph:run-node
```

#### 5.2: Create and Ship Your Subgraph

In a new terminal window:

```bash
# Create your local subgraph (only need to do this once)
yarn subgraph:create-local

# Ship your subgraph (you'll need to provide a version, e.g., 0.0.1)
yarn subgraph:local-ship
```

> If you get an error with ts-node, install it with: `npm install -g ts-node`

#### 5.3: Test Your Subgraph

Visit your subgraph endpoint: `http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql`

Try this example query:

```graphql
query MyQuery {
    transfers(first: 10, orderBy: id, orderDirection: asc) {
        blockNumber
        blockTimestamp
        from
        id
        to
        transactionHash
        value
    }
}
```

If you've sent transactions to your contract, you should see transfer data in the response.

### Step 6: Customize Your Token (Optional)

Edit your token contract at `packages/hardhat/contracts/YourToken.sol`:

```solidity
constructor(address _owner) ERC20("YourToken", "YT") Ownable(_owner) {
    _mint(_owner, 21000000000000000000000000);
}
```

In the deploy script (`packages/hardhat/deploy/00_deploy_your_contract.ts`), update the owner address:

```javascript
const owner = "YOUR_ADDRESS_HERE"; // Replace with your address

await deploy("YourToken", {
    from: deployer,
    args: [owner], // Set the contract owner during deployment
    log: true,
    autoMine: true,
});
```

After making changes, redeploy with:

```bash
yarn deploy
```

## Deploying to Celo Networks

### Environment Setup

Create a `.env` file in the root directory:

```
CELOSCAN_API_KEY=your_api_key_here
```

Get your API key from [Celoscan](https://celoscan.io/myapikey):

1. Create an account or sign in
2. Go to your account's API key section
3. Generate a new API key
4. Copy it to your `.env` file

### Deploying to Testnet

1. Generate a deployer account:

```bash
yarn generate
```

2. Fund your deployer account from the [Celo Faucet](https://faucet.celo.org)

3. Check your account balance:

```bash
yarn account
```

4. Deploy to Alfajores:

```bash
yarn deploy --network celoAlfajores
```

5. Verify your contract:

```bash
cd packages/hardhat
npx hardhat verify --network celoAlfajores YOUR_CONTRACT_ADDRESS
```

You can view your verified contract on [Celoscan Alfajores Explorer](https://alfajores.celoscan.io).

### Deploying to Mainnet

1. Make sure you have real CELO tokens for deployment:

```bash
yarn account
```

2. Deploy to Celo mainnet:

```bash
yarn deploy --network celo
```

3. Verify your contract:

```bash
cd packages/hardhat
npx hardhat verify --network celo YOUR_CONTRACT_ADDRESS
```

You can view your verified contract on [Celoscan Explorer](https://celoscan.io).

## Subgraph Deployment

### Configuring for Celo Networks

Update `packages/nextjs/scaffold.config.ts`:

```typescript
targetNetworks: [chains.celoAlfajores], // For testnet
// OR
targetNetworks: [chains.celo], // For mainnet
```

### Deploying to The Graph Network

1. Update `packages/subgraph/subgraph.yaml`:

> Ne sure to update the startBlock of your deployed contract -- you can retrieve this from the celo block explorer by looking up your contract and referencing the transaction information

```yaml
---
network: celo-alfajores # Use 'celo' for mainnet
source:
    abi: YourToken
    address: "YOUR_CONTRACT_ADDRESS"
    startBlock: 0
```

2. Create a new subgraph on [Subgraph Studio](https://thegraph.com/studio)

3. Authenticate and deploy:

```bash
yarn graph auth <DEPLOY_KEY>
yarn graph codegen
yarn graph build
yarn graph deploy <SUBGRAPH_SLUG>
```

4. Update the frontend to use your deployed subgraph in `packages/nextjs/components/ScaffoldEthAppWithProviders.tsx`:

```diff
- const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
+ const subgraphUri = 'YOUR_SUBGRAPH_ENDPOINT';
```

## Configuring Graph Client

After deploying your subgraph, you need to configure the Graph Client in your NextJS app to connect to your subgraph.

### Editing the .graphclientrc.yml File

The `.graphclientrc.yml` file is located in the `packages/nextjs` directory and contains the configuration for connecting to your subgraph:

To connect to your deployed subgraph, modify this file as follows:

1. Update the endpoint to point to your deployed subgraph:

```yaml
# .graphclientrc.yml
sources:
    - name: YourContract
      handler:
          graphql:
              endpoint: https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/your-subgraph-name/version
documents:
    - ./graphql/GetTransfers.gql
```

Replace `https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/your-subgraph-name/version` with the endpoint URL provided by Subgraph Studio after deployment.

### Creating GraphQL Queries

The Graph Client looks for GraphQL query files in the `packages/nextjs/graphql` directory. These files must have the `.gql` extension.

The repo comes with a default query in `GetTransfers.gql`:

```graphql
query GetTransfers {
    transfers(first: 25, orderBy: id, orderDirection: asc) {
        blockNumber
        blockTimestamp
        from
        id
        to
        transactionHash
        value
    }
}
```

To create additional queries:

1. Create a new `.gql` file in the `packages/nextjs/graphql` directory, for example `GetTransfersByAddress.gql`:

```graphql
query GetTransfersByAddress($address: String!) {
    transfers(
        where: { or: [{ from: $address }, { to: $address }] }
        orderBy: blockTimestamp
        orderDirection: desc
    ) {
        id
        from
        to
        value
        blockNumber
        blockTimestamp
    }
}
```

2. Add the new query file to the `documents` section in `.graphclientrc.yml`:

```yaml
documents:
    - ./graphql/GetTransfers.gql
    - ./graphql/GetTransfersByAddress.gql
```

3. After making changes, regenerate the client:

```bash
cd packages/nextjs
yarn graphclient build
```

This will generate TypeScript types for your queries, making them available in your React components.

## Frontend Integration

### Generating Graph Client Artifacts

The artifacts for your subgraph are already created but if you modify your subgraph you will need to rebuild them.

After deploying your new version of the subgraph:

Create a new GraphQL working query file in `packages/nextjs/graphql` this needs to end in the extension `.gql`

```bash
cd packages/nextjs
yarn graphclient build
```

### Example Query Implementation

The table is already created and available for the starting subgraph. However here it is for reference.

```typescript
// In your component file (e.g., packages/nextjs/components/transfers/TransfersTable.tsx)
import { useGraphClient } from "~~/services/graph/hook";
import { formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";

export const TransfersTable = () => {
    const { data: transfers } = useGraphClient().useTransfersQuery();

    return (
        <div className="flex flex-col gap-3">
            <h3 className="text-lg font-medium">Recent Transfers</h3>
            <table className="table bg-base-100 table-zebra">
                <thead>
                    <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Value</th>
                        <th>Block Number</th>
                    </tr>
                </thead>
                <tbody>
                    {transfers?.transfers.map((transfer, i) => (
                        <tr key={i}>
                            <td>
                                <Address address={transfer.from} />
                            </td>
                            <td>
                                <Address address={transfer.to} />
                            </td>
                            <td>
                                <div className="badge badge-primary">
                                    {Number(
                                        formatEther(BigInt(transfer.value))
                                    ).toFixed(2)}{" "}
                                    CELO
                                </div>
                            </td>
                            <td>
                                <div className="badge badge-ghost">
                                    {transfer.blockNumber}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
```

### Auto-Refresh Data

To automatically refresh the data:

```typescript
const { data } = useGraphClient().useTransfersQuery({
    pollInterval: 5000, // Refresh every 5 seconds
});
```

## Troubleshooting

### Common Issues

1. **Docker Issues**

    - Ensure Docker is running
    - Check port availability (8545, 8000, 8020, 8030)
    - Try restarting Docker service

2. **Contract Deployment Issues**

    - Check network configuration
    - Verify contract compilation
    - Ensure sufficient CELO for gas

3. **Subgraph Issues**
    - Check Docker logs
    - Verify contract addresses
    - Ensure proper schema definition

### Getting Help

-   Read [The Graph Documentation](https://thegraph.com/docs/en/)
-   Read [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
-   Join the [Telegram Community](https://t.me/graphhackers)

## Additional Resources

-   [The Graph Documentation](https://thegraph.com/docs/en/)
-   [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
-   [Celo Developer Documentation](https://docs.celo.org)
-   [Adding Celo to MetaMask](https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup)
