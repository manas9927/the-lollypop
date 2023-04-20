import React, { useEffect, useState } from "react";
import { ReactFlashlight } from "react-flashlight";
import { ethers } from "ethers";
import jointUnrolled from "./assets/images/joint_unrolled.png";
import jointRolling from "./assets/images/joint_rolling.gif";
import jointLit from "./assets/images/joint_lit.gif";
import axios from "axios";

function App() {
  const [buttonPosition, setButtonPosition] = useState({});
  const [isButtonTextVisible, setIsButtonTextVisible] = useState(false);
  const [walletAddress, setWalletAddress] = useState();
  const [isMintButtonVisible, setIsMintButtonVisible] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [isFlashlightEnabled, setIsFlashlightEnabled] = useState(true);
  const [isConnectWalletButtonVisible, setIsConnectWalletButtonVisible] =
    useState(true);
  const [isUnrolledJointVisible, setIsUnrolledJointVisible] = useState(false);
  const [isJointRolling, setIsJointRolling] = useState(false);
  const [isJointLit, setIsJointLit] = useState(false);

  const backgroundColor = "#000000";

  useEffect(() => {
    setButtonPosition({
      x: Math.abs(Math.random() * window.innerWidth - 100),
      y: Math.abs(Math.random() * window.innerHeight - 100),
    });
  }, []);

  const checkForToken = async (contract, contractAddress, userAddress) => {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const balance = await contract.balanceOf(userAddress, 1);

    console.log(`\nContract address: ${contractAddress}\n`);
    console.log(`Contract name: ${name}`);
    console.log(`Contract symbol: ${symbol}`);
    console.log(`Tokens: ${balance}`);

    await setIsAllowed(balance > 0 ? true : false);
    await setIsFlashlightEnabled(balance > 0 ? true : false);
    await setIsMintButtonVisible(balance > 0 ? false : true);
    await setIsConnectWalletButtonVisible(false);
  };

  const handleConnectWallet = async () => {
    try {
      const metaMaskprovider = new ethers.providers.Web3Provider(
        window.ethereum
      );
      await metaMaskprovider.send("eth_requestAccounts", []);
      const signer = metaMaskprovider.getSigner();

      const userAddress = await signer.getAddress();

      await setWalletAddress(userAddress);

      const provider = new ethers.providers.JsonRpcProvider(
        "https://eth-mainnet.g.alchemy.com/v2/2q4OzDyNjd6xXrRI7OgpURgA-XMRwEK1"
      );

      const ERC20_ABI = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address, uint) view returns (uint)",
      ];

      const contractAddress = "0x2a9f9ea2fa577079dccc3069e188c129cea6bb86"; // DAI Contract
      const contract = new ethers.Contract(
        contractAddress,
        ERC20_ABI,
        provider
      );

      checkForToken(contract, contractAddress, userAddress);
    } catch {
      console.log("Error connecting");
    }
  };

  const handleInteract = async () => {
    if (typeof window.ethereum !== "undefined") {
      handleConnectWallet();
    }
  };

  const handleShowButtonText = () => {
    setIsButtonTextVisible(true);
  };

  const handleHideButtonText = () => {
    setIsButtonTextVisible(false);
  };

  const handleOpenLollypop = () => {
    window.open("https://app.manifold.xyz/c/thelollypop");
  };

  const handleOpenLollypuff = () => {
    window.open("https://app.manifold.xyz/c/lollypuff");
  };

  useEffect(() => {
    if (isAllowed) {
      setIsUnrolledJointVisible(true);
    }
  }, [isAllowed]);

  const handleUnrollJoint = () => {
    setIsUnrolledJointVisible(false);
    setIsJointRolling(true);
  };

  const handleLightJoint = async () => {
    await setIsUnrolledJointVisible(false);
    await setIsJointRolling(false);
    await setIsJointLit(true);
    addToAllowList();
  };

  const addToAllowList = () => {
    axios
      .post(
        "https://api.retool.com/v1/workflows/4f96456a-3fb3-41a6-8b74-85ce4accd956/startTrigger?workflowApiKey=retool_wk_b7e421520dd54aa0b25f396a39e4e00f",
        `${walletAddress}`,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <ReactFlashlight
      showCursor
      size={100}
      darkness={1}
      enabled={isFlashlightEnabled}
    >
      <div
        className={`h-screen w-screen flex flex-col px-32 py-32 relative ${
          isFlashlightEnabled ? `bg-[${backgroundColor}]` : "bg-white"
        }`}
      >
        {isFlashlightEnabled && isConnectWalletButtonVisible && (
          <button
            className={`hover:border-white hover:border-4 bg-[${backgroundColor}] font-bold px-10 py-4 w-56 rounded-lg hover:text-white transform hover:scale-110 absolute`}
            style={{ top: buttonPosition.y, right: buttonPosition.x }}
            onClick={handleInteract}
            onMouseEnter={handleShowButtonText}
            onMouseLeave={handleHideButtonText}
          >
            {isButtonTextVisible && "Connect Wallet"}
          </button>
        )}
        {isMintButtonVisible && (
          <div className="my-auto mx-auto flex flex-col items-center">
            <h2 className="w-full text-black text-3xl font-bold animate-pulse text-center leading-10">
              Seems like your wallet is missing a Lollypop. <br /> Get one now
              🍭
            </h2>
            <button
              onClick={handleOpenLollypop}
              className="rounded-xl bg-gradient-to-br from-[#6025F5] to-[#FF5555] px-10 py-3 text-2xl my-5 font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50"
            >
              #mintit
            </button>
          </div>
        )}
        {isUnrolledJointVisible ? (
          <div className="my-auto mx-auto flex flex-col items-center relative">
            <img src={jointUnrolled} alt="Roll it up" className="w-96 h-96 " />
            <div
              className="absolute w-20 h-20 cursor-pointer"
              style={{ bottom: 70, right: 20 }}
              onClick={handleUnrollJoint}
            />
          </div>
        ) : isJointRolling ? (
          <div className="my-auto mx-auto flex flex-col items-center relative">
            <img src={jointRolling} alt="Rolling now" className="w-96 h-96 " />
            <div
              className="absolute w-16 h-16 cursor-pointer"
              style={{ top: 60, left: 10 }}
              onClick={handleLightJoint}
            />
          </div>
        ) : (
          isJointLit && (
            <div className="my-auto mx-auto flex flex-col items-center relative">
              <img src={jointLit} alt="Lit!" className="w-96 h-96 " />
              <h2 className="w-full text-white text-3xl font-bold animate-pulse text-center">
                Now that your Lolly is Lit 🔥, here's a Lolly Puff
              </h2>
              <button
                onClick={handleOpenLollypuff}
                className="rounded-xl bg-gradient-to-br from-[#6025F5] to-[#FF5555] px-10 py-3 text-2xl my-5 font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50"
              >
                #mintit
              </button>
              <p className="w-full text-white text-base font-bold text-center">
                Note: Allowlist gets updated every few hours.
              </p>
            </div>
          )
        )}
      </div>
    </ReactFlashlight>
  );
}

export default App;
