# Celo Subgraph Workshop

> This repository is based on [kmjones1979/celo-subgraph-workshop](https://github.com/kmjones1979/celo-subgraph-workshop)

This repo is an example full stack dapp that can be easily deployed to Celo. It comes with an example contract (ERC20) configured for deployment with Hardhat, a frontend integration with React (NextJS) and a working Subgraph which can all be deployed locally or directly to Celo's Alfajores Testnet.

## 🎯 Project Overview

This workshop toolkit provides everything you need to build and deploy a full-stack decentralized application (dapp) with:

-   Smart contract development and deployment
-   Frontend integration with Next.js
-   Subgraph integration for efficient blockchain data querying
-   Local development environment
-   Production deployment capabilities

## 📚 Table of Contents

-   [About The Graph](#about-the-graph)
-   [About Scaffold-ETH 2](#-about-scaffold-eth-2)
-   [Project Structure](#-project-structure)
-   [Requirements](#requirements)
-   [Quickstart](#quickstart)
-   [Development Workflow](#-development-workflow)
-   [The Graph Integration](#-setup-the-graph-integration)
-   [Deployment Guide](#-deployment-guide)
-   [Troubleshooting](#-troubleshooting)
-   [Contributing](#contributing-to-scaffold-eth-2)

## About The Graph

The Graph is a protocol that organizes and indexes blockchain data, enabling developers to easily query and access this data for building decentralized applications (dapps) without needing to run their own data servers or indexing infrastructure.

### Key Benefits

-   Efficient data querying
-   Real-time updates
-   Cost-effective data access
-   Decentralized infrastructure

## 🏗 About Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

## 📁 Project Structure

```
mega-eth-subgraph-workshop/
├── packages/
│   ├── hardhat/          # Smart contract development
│   ├── nextjs/           # Frontend application
│   └── subgraph/         # Graph protocol integration
├── .github/              # GitHub workflows and templates
├── .husky/               # Git hooks
└── .yarn/                # Yarn package management
```

## Requirements

Before you begin, you need to install the following tools:

-   [Node (>= v20.18.3)](https://nodejs.org/en/download/)
-   Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
-   [Git](https://git-scm.com/downloads)
-   [Docker](https://docs.docker.com/get-started/get-docker/)

## Customizing the token

Edit your smart contract located in `packages/hardhat/contracts/YourToken.sol`

Optionally modify the constructor with your own token name and symbol.

```solidity
    constructor(address _owner) ERC20("YourToken", "YT") Ownable(_owner) {
        _mint(_owner, 21000000000000000000000000);
    }
```

Optionally, modify the deploy script to take ownership of the contract.

```solidity
  const owner = "0x0000000000000000000000000000000000000000"; // add your address here

  await deploy("YourToken", {
    from: deployer,
    args: [owner], // use the owner variable to set who owns the contract during deployment
    log: true,
    autoMine: true,
  });
```

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone the repository:

```bash
git clone https://github.com/kmjones1979/celo-subgraph-workshop.git
cd celo-subgraph-workshop
```

2. Install dependencies:

```bash
yarn install
```

3. Run a local network in the first terminal:

```bash
yarn chain
```

4. On a second terminal, deploy the test contract:

```bash
yarn deploy
```

5. On a third terminal, start your NextJS app:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`

## 🚀 Setup The Graph Integration

Now that we have spun up our blockchain, started our frontend application and deployed our smart contract, we can start setting up our subgraph and utilize The Graph!

> Before following these steps be sure Docker is running!

#### ✅ Step 1: Clean up any old data and spin up our docker containers ✅

First run the following to clean up any old data. Do this if you need to reset everything.

```bash
yarn subgraph:clean-node
```

> We can now spin up a graph node by running the following command… 🧑‍🚀

```bash
yarn subgraph:run-node
```

This will spin up all the containers for The Graph using docker-compose. You will want to keep this window open at all times so that you can see log output from Docker.

> As stated before, be sure to keep this window open so that you can see any log output from Docker. 🔎

> NOTE FOR LINUX USERS: If you are running Linux you will need some additional changes to the project.

##### Linux Only

**For hardhat**

Update your package.json in packages/hardhat with the following command line option for the hardhat chain.

```bash
"chain": "hardhat node --network hardhat --no-deploy --hostname 0.0.0.0"
```

You might also need to add a firewall exception for port 8432. As an example for Ubuntu... run the following command.

```bash
sudo ufw allow 8545/tcp
```

#### ✅ Step 2: Create and ship our subgraph ✅

Now we can open up a fifth window to finish setting up The Graph. 😅 In this fifth window we will create our local subgraph!

> Note: You will only need to do this once.

```bash
yarn subgraph:create-local
```

> You should see some output stating your subgraph has been created along with a log output on your graph-node inside docker.

Next we will ship our subgraph! You will need to give your subgraph a version after executing this command. (e.g. 0.0.1).

```bash
yarn subgraph:local-ship
```

> This command does the following all in one… 🚀🚀🚀

-   Copies the contracts ABI from the hardhat/deployments folder
-   Generates the networks.json file
-   Generates AssemblyScript types from the subgraph schema and the contract ABIs.
-   Compiles and checks the mapping functions.
-   … and deploy a local subgraph!

> If you get an error ts-node you can install it with the following command

```bash
npm install -g ts-node
```

You should get a build completed output along with the address of your Subgraph endpoint.

```
Deployed to http://localhost:8000/subgraphs/name/scaffold-eth/your-contract/graphql

Subgraph endpoints:
Queries (HTTP):     http://localhost:8000/subgraphs/name/scaffold-eth/your-contract
```

#### ✅ Step 3: Test your Subgraph ✅

Go ahead and head over to your subgraph endpoint and take a look!

> Here is an example query…

```js
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

> If all is well and you've sent a transaction to your smart contract then you will see a similar data output!

```json
{
    "data": {
        "transfers": [
            {
                "blockNumber": "3",
                "blockTimestamp": "1743789408",
                "from": "0x0000000000000000000000000000000000000000",
                "id": "0x0c15fcaf5e6948686c0c98d9066a1539bf0642db25e06460a3eafb7c08dfca6501000000",
                "to": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
                "transactionHash": "0x0c15fcaf5e6948686c0c98d9066a1539bf0642db25e06460a3eafb7c08dfca65",
                "value": "21000000000000000000000000"
            }
        ]
    }
}
```

## Environment Configuration

Before deploying or verifying contracts, you need to set up your environment variables. Create a `.env` file in the root directory:

```bash
# Get your API key from https://celoscan.io/myapikey
CELOSCAN_API_KEY=your_api_key_here
```

To get your Celoscan API key:

1. Visit [Celoscan](https://celoscan.io)
2. Create an account or sign in
3. Go to your account's API key section
4. Generate a new API key
5. Copy the key into your `.env` file

The same API key works for both mainnet (celoscan.io) and testnet (alfajores.celoscan.io).

## Network Configuration

### Hardhat Configuration

The `hardhat.config.ts` file is already configured for both Celo mainnet and Alfajores testnet. Here's the relevant configuration:

```typescript
networks: {
  celo: {
    url: "https://forno.celo.org",
    accounts: [deployerPrivateKey],
    verify: {
      etherscan: {
        apiUrl: "https://api.celoscan.io",
        apiKey: process.env.CELOSCAN_API_KEY || "",
      },
    },
  },
  celoAlfajores: {
    url: "https://alfajores-forno.celo-testnet.org",
    accounts: [deployerPrivateKey],
    verify: {
      etherscan: {
        apiUrl: "https://api-alfajores.celoscan.io",
        apiKey: process.env.CELOSCAN_API_KEY || "",
      },
    },
  },
},
```

This configuration includes:

-   Network RPC endpoints
-   Account configuration using the deployer's private key
-   Contract verification settings for Celoscan
-   API configurations for both mainnet and testnet

### Frontend Configuration

To configure the frontend to use Celo networks, update the `packages/nextjs/scaffold.config.ts` file:

```typescript
targetNetworks: [chains.celoAlfajores], // Use this for Alfajores testnet
// or
targetNetworks: [chains.celo], // Use this for mainnet
```

This configuration:

-   Determines which network(s) your frontend will connect to
-   Sets up the correct RPC endpoints and chain parameters
-   Configures the network switching in the UI

You can also configure multiple networks simultaneously:

```typescript
targetNetworks: [chains.celo, chains.celoAlfajores],
```

## Deploying to Celo Alfajores Testnet

1. Generate a deployer key

```bash
yarn generate
```

2. Fund the deployer

You can get testnet CELO from the [Celo Alfajores Faucet](https://faucet.celo.org).

If you need to add the Celo network to Metamask, you can do so by visiting the [Celo Documentation](https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup).

```bash
yarn account
```

3. Deploy to Celo Alfajores Testnet

```bash
yarn deploy --network celoAlfajores
```

4. Verify your contract

```bash
cd packages/hardhat
npx hardhat verify --network celoAlfajores YOUR_CONTRACT_ADDRESS
```

You can view your verified contract on [Celoscan Alfajores Explorer](https://alfajores.celoscan.io).

## Deploying to Celo Mainnet

1. Make sure you have real CELO tokens for deployment
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

## Shipping to Subgraph Studio 🚀

> NOTE: This step requires [deployment of contract](https://docs.scaffoldeth.io/deploying/deploy-smart-contracts) to live network. Checkout list of [supported networks](https://thegraph.com/docs/networks).

1. Update the `packages/subgraph/subgraph.yaml` file with your contract address, network name, start block number(optional):

    ```diff
    ...
    -     network: localhost
    +     network: celo-alfajores    # Use 'celo' for mainnet, 'celo-alfajores' for testnet
          source:
            abi: YourToken
    +       address: "YOUR_CONTRACT_ADDRESS"
    +       startBlock: 0
    ...
    ```

    > Note: Use `network: celo` for mainnet deployments and `network: celo-alfajores` for testnet deployments

2. Create a new subgraph on [Subgraph Studio](https://thegraph.com/studio) and get "SUBGRAPH SLUG" and "DEPLOY KEY".

3. Authenticate with the graph CLI:

```bash
yarn graph auth <DEPLOY KEY>
```

4. Codegen and build

```bash
yarn graph codegen
```

```bash
yarn graph build
```

5. Deploy the subgraph to TheGraph Studio:

```bash
yarn graph deploy <SUBGRAPH SLUG>
```

    Once deployed, the CLI should output the Subgraph endpoints. Copy the HTTP endpoint and test your queries.

6. Update `packages/nextjs/components/ScaffoldEthAppWithProviders.tsx` to use the above HTTP subgraph endpoint:

```diff
- const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";
+ const subgraphUri = 'YOUR_SUBGRAPH_ENDPOINT';
```

## 🔄 Development Workflow

### Smart Contract Development

-   Edit contracts in `packages/hardhat/contracts`
-   Run tests with `yarn hardhat:test`
-   Deploy with `yarn deploy`

### Frontend Development

-   Edit pages in `packages/nextjs/app`
-   Configure routing in `packages/nextjs/app/page.tsx`
-   Customize UI components in `packages/nextjs/components`

### Subgraph Development

-   Define schema in `packages/subgraph/schema.graphql`
-   Write mappings in `packages/subgraph/src/mappings`
-   Create a subgraph locally with `yarn subgraph:local-ship`

## 🚀 Deployment Guide

### Local Deployment

1. Start local blockchain: `yarn chain`
2. Deploy contracts: `yarn deploy`
3. Start frontend: `yarn start`
4. Deploy subgraph: `yarn subgraph:local-create` (only need to do this once)
5. Deploy subgraph: `yarn subgraph:local-ship`

### Testnet Deployment

1. Create a deployer account: `yarn generate`
2. Fund the deployer account using the [Celo Faucet](https://faucet.celo.org)
3. Deploy contracts to Celo Alfajores: `yarn deploy --network celoAlfajores`
4. Verify your contract: `npx hardhat verify --network celoAlfajores YOUR_CONTRACT_ADDRESS`
5. Update subgraph configuration
6. Deploy subgraph to The Graph Network
7. Deploy frontend to your preferred hosting service

## A list of all available root commands

### graph

```bash
yarn graph
```

Shortcut to run `@graphprotocol/graph-cli` scoped to the subgraph package.

### run-node

```bash
yarn subgraph:run-node
```

Spin up a local graph node (requires Docker).

### stop-node

```bash
yarn subgraph:stop-node
```

Stop the local graph node.

### clean-node

```bash
yarn clean-node
```

Remove the data from the local graph node.

### local-create

```bash
yarn subgraph:create-local
```

Create your local subgraph (only required once).

### abi-copy

```bash
yarn subgraph:abi-copy
```

Copy the contracts ABI from the hardhat/deployments folder. Generates the networks.json file too.

### codegen

```bash
yarn subgraph:codegen
```

Generates AssemblyScript types from the subgraph schema and the contract ABIs.

### build

```bash
yarn subgraph:build
```

Compile and check the mapping functions.

### local-deploy

```bash
yarn subgraph:deploy-local
```

Deploy a local subgraph.

### local-ship

```bash
yarn subgraph:local-ship
```

Run all the required commands to deploy a local subgraph (abi-copy, codegen, build and local-deploy).

### deploy

```bash
yarn subgraph:deploy
```

Deploy a subgraph to The Graph Network.

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

## 🔧 Troubleshooting

### Common Issues

1. **Docker Issues**

    - Ensure Docker is running
    - Check port availability (8545, 8000, 8020, 8030)
    - Try restarting Docker service

2. **Contract Deployment Issues**

    - Check network configuration
    - Verify contract compilation
    - Ensure sufficient test ETH

3. **Subgraph Issues**
    - Check Docker logs
    - Verify contract addresses
    - Ensure proper schema definition

### Getting Help

-   Read the [The Graph Documentation](https://thegraph.com/docs/en/)
-   Read the [Scaffold-ETH 2 Documentation](https://docs.scaffoldeth.io)
-   Join our [Telegram Community](https://t.me/graphhackers)
-   Open an [Issue](https://github.com/your-org/mega-eth-subgraph-workshop/issues)

## Using The Graph in Your NextJS App

### Generating Graph Client Artifacts

After deploying your subgraph, you'll need to generate the client-side artifacts:

```bash
cd packages/nextjs
yarn graphclient build
```

This command generates type-safe queries based on your subgraph schema.

### Example Query Implementation

In your NextJS components, you can use the generated artifacts to query your subgraph. Here's an example implementation:

```typescript
// In your component file (e.g., packages/nextjs/components/transfers/TransfersTable.tsx)
import { useGraphClient } from "~~/services/graph/hook";
import { formatEther } from "viem";

export const TransfersTable = () => {
    const { data: transfers } = useGraphClient().useTransfersQuery();

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium">Recent Transfers</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="table bg-base-100 table-zebra">
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>To</th>
                            <th>Value</th>
                            <th>Block Number</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfers?.transfers.map((transfer, i) => (
                            <tr key={i}>
                                <td>{transfer.from}</td>
                                <td>{transfer.to}</td>
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
                                <td>
                                    {new Date(
                                        Number(transfer.blockTimestamp) * 1000
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
```

### Example Query Definition

The query used in the component above is defined in your GraphQL schema. Here's an example of what it might look like:

```graphql
query Transfers {
    transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        from
        to
        value
        blockNumber
        blockTimestamp
        transactionHash
    }
}
```

### Customizing the Query

You can modify the query parameters to fetch different data:

```typescript
// Fetch more transfers
query Transfers {
  transfers(first: 20, orderBy: blockTimestamp, orderDirection: desc) {
    id
    from
    to
    value
  }
}

// Filter by address
query TransfersByAddress($address: String!) {
  transfers(
    where: { or: [{ from: $address }, { to: $address }] }
    orderBy: blockTimestamp
    orderDirection: desc
  ) {
    id
    from
    to
    value
  }
}
```

### Auto-Refresh Data

To automatically refresh the data, you can use the polling option:

```typescript
const { data } = useGraphClient().useTransfersQuery({
    pollInterval: 5000, // Refresh every 5 seconds
});
```

The Graph Client integration provides:

-   Type-safe queries and responses
-   Automatic TypeScript type generation
-   Real-time data updates through polling
-   Efficient caching and request deduplication

For more complex queries and features, refer to [The Graph's Documentation](https://thegraph.com/docs/en/developing/querying/graphql-api/).

## Graph Client Integration

### Setting up Graph Client

1. First, ensure your subgraph is deployed and you have the endpoint URL.

2. Update your subgraph endpoint in `packages/nextjs/scaffold.config.ts`:

```typescript
export const scaffoldConfig = {
    // ... other config
    subgraphUri: "YOUR_SUBGRAPH_ENDPOINT",
};
```

### Creating GraphQL Queries

Create your queries in `packages/nextjs/graphql/transfers.graphql`:

```graphql
query GetTransfers {
    transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
        id
        from
        to
        value
        blockNumber
        blockTimestamp
    }
}
```

### Generate Graph Client Types

Run the following command to generate type-safe hooks:

```bash
cd packages/nextjs
yarn graphclient build
```

This will generate types and hooks based on your GraphQL queries.

### Implementing the Transfers Table

Here's a complete example of how to implement a transfers table component using the Graph Client:

```typescript
// packages/nextjs/app/subgraph/_components/TransfersTable.tsx
"use client";

import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { GetTransfersDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

interface Transfer {
    id: string;
    from: string;
    to: string;
    value: string;
}

interface TransfersData {
    transfers: Transfer[];
}

const TransfersTable = () => {
    const [transfersData, setTransfersData] = useState<TransfersData | null>(
        null
    );
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!execute || !GetTransfersDocument) {
                return;
            }
            try {
                const { data: result } = await execute(
                    GetTransfersDocument,
                    {}
                );
                setTransfersData(result as TransfersData);
            } catch (err) {
                setError(err as Error);
                console.error("Error fetching transfers:", err);
            }
        };

        fetchData();
        // Set up polling every 10 seconds
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Error loading transfers. Please try again later.</span>
            </div>
        );
    }

    if (!transfersData?.transfers?.length) {
        return (
            <div className="alert alert-info">
                <span>No transfers found.</span>
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="overflow-x-auto shadow-2xl rounded-xl">
                <table className="table bg-base-100 table-zebra">
                    <thead>
                        <tr className="rounded-xl">
                            <th className="bg-primary"></th>
                            <th className="bg-primary">From</th>
                            <th className="bg-primary">To</th>
                            <th className="bg-primary">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transfersData.transfers.map(
                            (transfer: Transfer, index: number) => (
                                <tr key={transfer.id}>
                                    <th>{index + 1}</th>
                                    <td>
                                        <Address address={transfer.from} />
                                    </td>
                                    <td>
                                        <Address address={transfer.to} />
                                    </td>
                                    <td>
                                        <div className="badge badge-primary badge-lg">
                                            {transfer.value
                                                ? Number(
                                                      formatEther(
                                                          BigInt(transfer.value)
                                                      )
                                                  ).toFixed(2)
                                                : "0.00"}
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransfersTable;
```

### Key Features

The implementation includes:

-   Type-safe GraphQL queries using generated types
-   Real-time data updates with 10-second polling
-   Error handling and loading states
-   Formatted token values using `viem`'s `formatEther`
-   Styled using DaisyUI components
-   Address display using Scaffold-ETH's `Address` component

### Using the Table Component

Add the TransfersTable to your page:

```typescript
// packages/nextjs/app/subgraph/page.tsx
import TransfersTable from "./_components/TransfersTable";

export default function SubgraphPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">
                Recent Transfers
            </h1>
            <TransfersTable />
        </div>
    );
}
```

### Customizing the Query

You can modify the GraphQL query to fetch different data or add filters:

```graphql
# Filter by address
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
    }
}

# Fetch more transfers
query GetMoreTransfers {
    transfers(first: 20, orderBy: blockTimestamp, orderDirection: desc) {
        id
        from
        to
        value
    }
}
```

Remember to run `yarn graphclient build` after modifying your GraphQL queries to regenerate the types.
