import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./nft-card.css";

import Modal from "../Modal/Modal";
import { Skeleton } from "@mui/material";
import img09 from "../../../assets/images/ava-01.png";

const NftCard = (props) => {
  const { title, tokenId, price, creatorImg, image, owner, seller } = props.item;
  const imageRef = useRef()
  const [showModal, setShowModal] = useState(false);
  const [loaded, setLoaded] = useState(false)


  // useEffect(() => {
  //   if (!imageRef.current) {

  //     setIsLoading(true)
  //   } else {

  //     setIsLoading(false)
  //   }
  //   console.log('is load:', isLoading);
  // }, [imageRef.current])

  console.log(loaded)

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        {!loaded && <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '100%', height: 221 }} />}
        <img src={image} alt="" className="w-100" onLoad={() => setLoaded(true)} style={!loaded ? { display: "none" } : {}} />
      </div>

      <div className="nft__content">
        <h5 className="nft__title">
          <Link to={`/market/${tokenId}`}>{!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ width: '50%' }} /> : title}</Link>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
          <div className="creator__img">
            {!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="circular" width={40} height={40} /> : <img src={img09} alt="" className="w-100" />}

          </div>

          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
            <div>
              <h6>Created By</h6>
              <p>{!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ fontSize: "0.9rem" }} /> : `${seller.substring(0, 4)}...${seller.substring(seller.length - 4)}`}</p>
            </div>

            <div>
              <h6>Current Bid</h6>
              <p>{!loaded ? <Skeleton sx={{ bgcolor: '#ffffffaf' }} variant="rounded" style={{ fontSize: "0.9rem" }} /> : `${price} ETH`} </p>
            </div>
          </div>
        </div>

        <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setShowModal(true)}
          >
            <i className="ri-shopping-bag-line"></i> Place Bid
          </button>

          {showModal && <Modal setShowModal={setShowModal} />}

          <span className="history__link">
            <Link to="#">View History</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
