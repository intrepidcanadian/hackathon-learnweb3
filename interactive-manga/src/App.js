import React, { useState } from "react";
import axios from "axios";
import Stream from "./components/Stream";
import "./App.css";
import "./components/style.css";
import StreamrClient from "streamr-client";
import {MarketingMajor, BillingStatementDollarFilledMajor, AddMajor } from "@shopify/polaris-icons";
import "@shopify/polaris/build/esm/styles.css";
import { Icon, Text } from "@shopify/polaris";

import videoUrl__adapted from "./images/bd23e7a6-1b36-49b1-a3f1-a5db2b94b6ce_restyled.mp4";
import videoUrl__adapted2 from "./images/5e65c3d4-518a-4bb4-8902-c96b55ac751f_restyled.mp4";

import img1 from "./images/1punch1.jpeg";
import img2 from "./images/1punch2.jpeg";

import Wallet from "./components/Wallet";

function DisplayVideo() {
  const [videoUrl, setVideoUrl] = useState("");

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

  return (
    <div>
      <div className="container__wallet">
        <Wallet />
      </div>
      <div className="container__header">
        <Text as="headingx4l" variant="headingx4l">Interactive Manga Online</Text>
        <div className="navigation__buttons">
          <button className="button__animate" onClick={fetchVideoUrl}>
            
          <div className="button">
          <Icon source={MarketingMajor} />
            AI Generation - Prompts / AI Learning Models
            </div>
          </button>
          <button className="button__animate">
            <div className="button">
            <Icon source={AddMajor} />
              <p>Add Contributor</p>
              </div>
          </button>
          <button className="button__animate">
            <div className="button">
              <Icon source={BillingStatementDollarFilledMajor} />
              <p>Buy Manga Subscription</p>
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
      <div className="container__header">
        <h1>One Punch Man - Community Animated - Chapter 135</h1>
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
    </div>
  );
}

export default DisplayVideo;
