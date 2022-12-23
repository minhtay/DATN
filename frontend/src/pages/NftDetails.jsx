import React, { useContext, useState } from "react";

import CommonSection from "../components/ui/Common-section/CommonSection";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { NFT__DATA } from "../assets/data/data";

import LiveAuction from "../components/ui/Live-auction/LiveAuction";

import "../styles/nft-details.css";

import { Link } from "react-router-dom";
import NFTContext from "../context/NFTContext";
import axios from "axios";
import img09 from "../assets/images/img-01.jpg";
import { useEffect } from "react";

const NftDetails = () => {
  const [nft, setNft] = useState()
  const { id } = useParams();

  const { connectingWithSmartContract } = useContext(NFTContext)

  const handleGetNFTDetail = async () => {
    const contract = await connectingWithSmartContract()
    const tokenURI = await contract.tokenURI(id);
    const item = await contract.getMarketItemById(id)
    console.log(item)
    const res = await axios.get(tokenURI);
    console.log(res.data);
    setNft(res.data)
  }

  useEffect(() => {
    handleGetNFTDetail()
  }, [])

  return (
    <>
      <CommonSection title={nft?.title} />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <img
                src={nft?.image}
                alt=""
                className="w-100 single__nft-img"
              />
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="single__nft__content">
                <h2>{nft?.title}</h2>

                <div className=" d-flex align-items-center justify-content-between mt-4 mb-4">
                  <div className=" d-flex align-items-center gap-4 single__nft-seen">
                    <span>
                      <i className="ri-eye-line"></i> 234
                    </span>
                    <span>
                      <i className="ri-heart-line"></i> 123
                    </span>
                  </div>

                  <div className=" d-flex align-items-center gap-2 single__nft-more">
                    <span>
                      <i className="ri-send-plane-line"></i>
                    </span>
                    <span>
                      <i className="ri-more-2-line"></i>
                    </span>
                  </div>
                </div>

                <div className="nft__creator d-flex gap-3 align-items-center">
                  <div className="creator__img">
                    <img src={img09} alt="" className="w-100" />
                  </div>

                  <div className="creator__detail">
                    <p>Created By</p>
                    <h6>{nft?.owner}</h6>
                  </div>
                </div>

                <p className="my-4">{nft?.description}</p>
                <button className="singleNft-btn d-flex align-items-center gap-2 w-100">
                  <i className="ri-shopping-bag-line"></i>
                  <Link to="/wallet">Place a Bid</Link>
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <LiveAuction />
    </>
  );
};

export default NftDetails;