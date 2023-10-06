import React, { useState, useEffect } from "react";
import axios from "axios";
import Stream from "./components/Stream";
import "./App.css";
import "./components/style.css";
import StreamrClient from "streamr-client";
import {
  MarketingMajor,
  BillingStatementDollarFilledMajor,
  AddMajor,
} from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import { Icon, Text } from "@shopify/polaris";

import videoUrl__adapted from "./images/bd23e7a6-1b36-49b1-a3f1-a5db2b94b6ce_restyled.mp4";
import videoUrl__adapted2 from "./images/5e65c3d4-518a-4bb4-8902-c96b55ac751f_restyled.mp4";

import img1 from "./images/1punch1.jpeg";

import Wallet from "./components/Wallet";

import Web3 from "web3";

const ABI_CONTRACT = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_contributor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_share",
        type: "uint256",
      },
    ],
    name: "addContributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "distribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "contributors",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CONTRIBUTORS_PERCENTAGE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "depositors",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "hasDeposited",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "OWNER_PERCENTAGE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "shares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalShares",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const CONTRACT_ADDRESS = "0xb41D2fb61901dF8662336cB0055EB081170d8e19";

function DisplayVideo() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [contributorAddress, setContributorAddress] = useState("");
  const [contributorShare, setContributorShare] = useState("");
  const [hasDeposited, setHasDeposited] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchHasDeposited = async () => {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const contract = new web3.eth.Contract(ABI_CONTRACT, CONTRACT_ADDRESS);
      const account = await web3.eth.getAccounts();
      setAccounts(account);
      if (account.length === 0) return; // No wallet connected.

      const result = await contract.methods.hasDeposited(account[0]).call();
      setHasDeposited(result);
    };

    fetchHasDeposited();
  }, [accounts] );

  const fetchVideoUrl = () => {
    setVideoUrl("");
    axios
      .get("http://localhost:3001/runScript")
      .then((response) => {
        if (response.data && response.data.presignedUrl) {
          setVideoUrl(response.data.presignedUrl);
        }
      })
      .catch((error) => {
        console.error("Error fetching the video URL: ", error);
      });
  };

  const startPublisherService = () => {
    axios
      .post(
        "http://localhost:3002/sendVideo",
        {
          image_urls: videoUrl,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("saved to server for broadcasting");
      })
      .catch((error) => {
        console.error("Error saving to the server:", error);
      });
  };

  function toggleFormVisibility() {
    setModalOpen(!isModalOpen);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (window.ethereum) {
      const ABI = [
        {
          inputs: [
            {
              internalType: "address",
              name: "_contributor",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_share",
              type: "uint256",
            },
          ],
          name: "addContributor",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "distribute",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "contributors",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "CONTRIBUTORS_PERCENTAGE",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "depositors",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "_address",
              type: "address",
            },
          ],
          name: "hasDeposited",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "OWNER_PERCENTAGE",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "shares",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalShares",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ];

      const CONTRACT = "0xb41D2fb61901dF8662336cB0055EB081170d8e19";

      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(ABI, CONTRACT);
      const account = await web3.eth.getAccounts();
      setAccounts(account);
      await contract.methods
        .addContributor(contributorAddress, contributorShare)
        .send({ from: account[0] });

      setModalOpen(false);
    }
  }

  async function buyMangaSubscription(event) {
    event.preventDefault();
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const amount = web3.utils.toWei("0.01", "ether");
      const contract = new web3.eth.Contract(ABI_CONTRACT, CONTRACT_ADDRESS);
      const account = await web3.eth.getAccounts();
      setAccounts(account);
      const userAddress = account[0];
      contract.methods
        .deposit()
        .send({ from: userAddress, value: amount })
        .then((receipt) => {
          setHasDeposited(true);
          console.log("Transaction successful!", receipt);
        })
        .catch((error) => {
          console.error("Transaction failed!", error);
        });
    }
  }

  {
    isModalOpen && (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Address:
            <input
              type="text"
              value={contributorAddress}
              onChange={(e) => setContributorAddress(e.target.value)}
              required
            />
          </label>
          <label>
            Share:
            <input
              type="number"
              value={contributorShare}
              onChange={(e) => setContributorShare(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="container__wallet">
        <Wallet />
      </div>
      <div className="container__header">
        <h1 className="title">MangaX</h1>
        {/* <Text as="headingx4l" variant="headingx4l"></Text> */}
        <div className="navigation__buttons">
          <button className="button__animate" onClick={fetchVideoUrl}>
            <div className="button">
              <Icon source={MarketingMajor} />
              AI Generation - Prompts / AI Learning Models
            </div>
          </button>
          <button className="button__animate" onClick={toggleFormVisibility}>
            <div className="button">
              <Icon source={AddMajor} />
              <p>Add Contributor </p>
            </div>
          </button>

          {isModalOpen && (
            <div className="popover">
              <h2>Add Contributor</h2>
              <form className="popover__form" onSubmit={handleSubmit}>
                <label className="popover__form--label">
                  Address:
                  <input
                    type="text"
                    value={contributorAddress}
                    onChange={(e) => setContributorAddress(e.target.value)}
                    required
                  />
                </label>
                <label className="popover__form--label">
                  Share:
                  <input
                    type="number"
                    value={contributorShare}
                    onChange={(e) => setContributorShare(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">Submit</button>
              </form>
            </div>
          )}

          <button className="button__animate" onClick={buyMangaSubscription}>
            <div className="button">
              <Icon source={BillingStatementDollarFilledMajor} />
              <p>Access Interactive Manga Online for 0.01 ETH</p>
            </div>
          </button>
        </div>
      </div>
      <div className="container__comparison">
        <Stream />
        <div className="component__stream">
          <div className="component__video">
            {videoUrl && (
              <video className="video--depth" controls autoPlay loop muted>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>

      {hasDeposited && (
      <div>
        <div className="container__header">
          <h1 className="title">
            One Punch Man - Community Animated - Chapter 135
          </h1>
        </div>
        <video className="video--depth--adapted" controls autoPlay loop muted>
          <source src={videoUrl__adapted} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="video--depth--adapted">
          <img src={img1} />
        </div>
        <video className="video--depth--adapted" controls autoPlay loop muted>
          <source src={videoUrl__adapted2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div> )}
    </div>
  );
}

export default DisplayVideo;
