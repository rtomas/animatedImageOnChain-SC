# Animated Image Hardhat Project

This project create an smart contract for AnimatedImage on-chain.
Doing some test to view how an animated an image that can be stored onchain and how to display it.
32x32 pixels, 256 colors, 50 frames

The frontend proyect is here:
https://github.com/rtomas/animatedImageOnChain-UI
https://animated-on-chain.vercel.app/

Compile, test and deploy with:

```shell
npx hardhat comple
npx hardhat test
npx hardhat run  --network mumbai scripts/deploy.ts
```

verify contract in etherscan
`npx hardhat verify --network mumbai <contractaddress>` <contract> <params>

Contract address on Mumbai testnet:
https://mumbai.polygonscan.com/address/0x13fb0eafb42243998933e24b27fd7e4af2d9e107
