import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import "hardhat-gas-reporter";

const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || "";
const PRIVATE_KEY_OWNER = process.env.PRIVATE_KEY_OWNER || "";
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || "";

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        localhost: {
            timeout: 100_000,
        },
        mumbai: {
            url: MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY_OWNER],
            chainId: 80001,
        },
    },
    etherscan: {
        apiKey: {
            polygonMumbai: POLYGONSCAN_API_KEY,
        },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        token: "MATIC",
    },
    solidity: "0.8.19",
};

export default config;
