# Veiled Order Hub 🔐

A privacy-preserving decentralized trading platform built with **Fully Homomorphic Encryption (FHE)** using Zama's FHEVM protocol. Submit and manage encrypted trading orders where amounts and prices remain completely private on-chain.

[![status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/Bertram985/veiled-order-hub)
[![License](https://img.shields.io/badge/License-BSD--3--Clause--Clear-blue.svg)](LICENSE)

## 🎥 Demo

**[Live Demo](https://veiled-order-hub.vercel.app/)** | [Demo Video](demo.mp4)

Experience privacy-preserving order submission with encrypted amounts and prices that remain confidential on the blockchain while still being verifiable.

## ✨ Features

- 🔒 **Fully Private Orders**: Order amounts and prices encrypted using FHE
- 🛡️ **On-chain Privacy**: Data remains encrypted on the blockchain
- 🔍 **Selective Disclosure**: Only order owners can decrypt their own orders
- ⚡ **Real-time Updates**: Modern React UI with Next.js
- 🌐 **Sepolia Testnet**: Deployed and ready to test
- 🎨 **Beautiful UI**: Built with Tailwind CSS and shadcn/ui

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **pnpm**: Package manager (recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Bertram985/veiled-order-hub.git
   cd veiled-order-hub
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # For smart contract deployment
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   
   # For frontend (create frontend/.env.local)
   echo "NEXT_PUBLIC_RPC_URL=your_rpc_url" > frontend/.env.local
   ```

4. **Compile contracts**

   ```bash
   pnpm compile
   ```

5. **Run tests**

   ```bash
   pnpm test
   ```

### Running the Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
veiled-order-hub/
├── contracts/
│   ├── VeiledOrder.sol      # Main FHE-enabled order contract
│   └── FHECounter.sol       # Example FHE counter
├── frontend/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   └── fhevm/               # FHEVM client utilities
├── deploy/                  # Deployment scripts
├── test/                    # Contract tests
├── hardhat.config.ts        # Hardhat configuration
└── package.json            # Root package configuration
```

## 🔧 Smart Contract

The `VeiledOrder` contract enables:

- **Submit Orders**: Users submit buy/sell orders with encrypted amounts and prices
- **Private Storage**: All sensitive data stored as encrypted `euint32` types
- **Access Control**: Only order owners can decrypt their order details
- **Order History**: Track all orders with timestamps and metadata

### Key Functions

```solidity
// Submit an encrypted order
function submitOrder(
    externalEuint32 amount,
    externalEuint32 price,
    bool isBuy,
    bytes calldata inputProof
) external

// Get your order indices
function getMyOrderIndices() external view returns (uint256[] memory)

// Retrieve order details (encrypted)
function getOrder(uint256 orderIndex) external view returns (...)
```

## 🛠️ Available Scripts

### Root Level

| Script             | Description                    |
| ------------------ | ------------------------------ |
| `pnpm compile`     | Compile smart contracts        |
| `pnpm test`        | Run contract tests             |
| `pnpm coverage`    | Generate test coverage report  |
| `pnpm lint`        | Run linting checks             |
| `pnpm lint:sol`    | Lint Solidity contracts        |
| `pnpm clean`       | Clean build artifacts          |

### Frontend

| Script             | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start development server       |
| `pnpm build`       | Build for production           |
| `pnpm start`       | Start production server        |
| `pnpm test`        | Run frontend tests             |

## 🌐 Deployment

### Deploy to Sepolia Testnet

```bash
# Deploy contracts
npx hardhat deploy --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

### Deploy Frontend

The frontend is deployed on Vercel and automatically updates with each push to main branch.

**Live URL**: [https://veiled-order-hub.vercel.app/](https://veiled-order-hub.vercel.app/)

## 🧪 Testing

```bash
# Run all tests on local FHEVM mock
pnpm test

# Run tests on Sepolia (requires deployed contract)
pnpm test:sepolia

# Frontend tests
cd frontend && pnpm test
```

## 📚 Documentation & Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)
- [Zama Encrypted Types](https://docs.zama.ai/fhevm/fundamentals/types)
- [Next.js Documentation](https://nextjs.org/docs)

## 🔐 Security & Privacy

- All order amounts and prices are encrypted using Zama's FHEVM
- Encryption happens client-side before submission
- Only the contract and order owner have decryption permissions
- No plaintext sensitive data is ever stored on-chain

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Bertram985/veiled-order-hub/issues)
- **FHEVM Docs**: [https://docs.zama.ai](https://docs.zama.ai)
- **Zama Community**: [Discord](https://discord.gg/zama)

---

**Built with privacy in mind using Zama's FHEVM technology** 🔒✨
