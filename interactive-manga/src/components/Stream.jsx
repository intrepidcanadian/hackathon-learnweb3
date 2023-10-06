import React, { useState, useEffect } from "react";
import StreamrClient from "streamr-client";
import "./style.css";
import axios from "axios";

function Stream() {
  const [dataPoint, setDataPoint] = useState("");
  const [displayedImage, setDisplayedImage] = useState("");

 
  const sendImageToBackend = (imageUrl) => {
    axios
      .post("http://localhost:3001/sendImage", { imageUrl: imageUrl.image })
      .then((response) => {
        console.log("Image sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending the image URL:", error);
      });
  };

  useEffect ((()=> {
    const streamr = new StreamrClient({
      auth: {
        privateKey: process.env.REACT_PRIVATE_KEY
      }
    });
  const subscription = streamr.subscribe(
    "0xe32b3c476b95ea192d444cfb2e2b80559332f8a2/aistories",
    (msg) => {
      const json = msg;
      setDataPoint(json);
      sendImageToBackend(json);
      console.log(json.image);
      console.log(streamr);
  
    }
  );

}),[]);



  return (
    <div>
      <div className="component__stream">
        <div className="component__image">
          <img src={dataPoint.image} alt="Manga" />
        </div>
      </div>
    </div>
  );
}

export default Stream;
