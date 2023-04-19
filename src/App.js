import React, { useEffect, useState } from "react";
import { ReactFlashlight } from "react-flashlight";
import { unsecureClientSideTokenGate } from "tokengate";
import { ethers } from "ethers";
// import { GoogleSpreadsheet } from "google-spreadsheet";
import jointUnrolled from "./assets/images/joint_unrolled.png";
import jointRolling from "./assets/images/joint_rolling.gif";
import jointLit from "./assets/images/joint_lit.gif";
import Countdown from "react-countdown";

function App() {
  const [buttonPosition, setButtonPosition] = useState({});
  const [isButtonTextVisible, setIsButtonTextVisible] = useState(false);
  const [isMintButtonVisible, setIsMintButtonVisible] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [isFlashlightEnabled, setIsFlashlightEnabled] = useState(true);
  const [isUnrolledJointVisible, setIsUnrolledJointVisible] = useState(false);
  const [isJointRolling, setIsJointRolling] = useState(false);
  const [isJointLit, setIsJointLit] = useState(false);

  const backgroundColor = "#000000";

  const contractAddress = "0x2a9f9ea2fa577079dccc3069e188c129cea6bb86";

  useEffect(() => {
    setButtonPosition({
      x: Math.abs(Math.random() * window.innerWidth - 100),
      y: Math.abs(Math.random() * window.innerHeight - 100),
    });
  }, []);

  const handleConnectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const userAddress = await signer.getAddress();
      const _isAllowed = await unsecureClientSideTokenGate({
        balanceOfThreshold: 10,
        contractAddress,
        signerOrProvider: signer,
        userAddress,
      });

      await setIsAllowed(_isAllowed);

      setIsFlashlightEnabled(false);

      console.log({ walletAddress: accounts[0], isAllowed });

      if (!isAllowed) {
        setIsMintButtonVisible(true);
      }

      setWalletAddress(accounts[0]);
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

  const handleOpenCollectionUrl = () => {
    window.open("https://app.manifold.xyz/c/thelollypop");
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

  const handleLightJoint = () => {
    setIsJointRolling(false);
    setIsJointLit(true);
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
        {isFlashlightEnabled && (
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
            <Countdown
              date={new Date("April 20, 2023 16:20:00")}
              renderer={(k) => (
                <div className="text-6xl font-bold text-black flex flow-row my-5">
                  <h1 className=" text-[#30B922] mx-4">{k.hours}</h1>:
                  <h1 className=" text-[#ffbe0b] mx-4">{k.minutes}</h1>:
                  <h1 className=" text-[#FF5903] mx-4">{k.seconds}</h1>
                </div>
              )}
            />
            <h2 className="w-full text-black text-3xl font-bold animate-pulse text-center leading-10">
              Go get your Lollypops 🍭
            </h2>
            <button
              onClick={handleOpenCollectionUrl}
              className="rounded-xl bg-gradient-to-br from-[#6025F5] to-[#FF5555] px-10 py-3 text-2xl my-5 font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#6025F5]/50"
            >
              #mintit
            </button>
          </div>
        )}
        {/* {isUnrolledJointVisible && (
          <div className="my-auto mx-auto flex flex-col items-center relative">
            <Countdown
              date={new Date("April 20, 2023 16:20:00")}
              renderer={(k) => (
                <div className="text-6xl font-bold text-white flex flow-row">
                  <h1 className=" text-[#30B922] mx-4">{k.hours}</h1>:
                  <h1 className=" text-[#FCE8AD] mx-4">{k.minutes}</h1>:
                  <h1 className=" text-[#FF5903] mx-4">{k.seconds}</h1>
                </div>
              )}
            />
          </div>
        )} */}

        {/* {isUnrolledJointVisible ? (
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
            </div>
          )
        )} */}
      </div>
    </ReactFlashlight>
  );
}

export default App;
