import { ethers } from 'ethers'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import CommonSection from '../components/ui/Common-section/CommonSection'
import NftCard from '../components/ui/Nft-card/NftCard'
import NFTContext from '../context/NFTContext'

const Profile = () => {

  const { connectingWithSmartContract } = useContext(NFTContext)
  const [data, setData] = useState([])
  const handleGetNFTBuyed = async () => {
    const contract = await connectingWithSmartContract();
    const data = await contract.fetchMyNFT()
    const items = await Promise.all(
      data.map(
        async ({
          tokenId,
          seller,
          owner,
          price: unformattedPrice,
          description,
          deadline,
          target,
          image,
          title,
        }) => {
          // const tokenURI = await contract.tokenURI(tokenId);

          // const res = await axios.get(tokenURI);
          // console.log(res);
          // const { image, title, description } = res.data;
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            "ether"
          );
          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            image,
            title,
            description,
            deadline,
            target,
          };
        }
      )
    );
    setData(items)
  }

  const handleGetNFTCreate = async () => {
    const contract = await connectingWithSmartContract();
    const NFTBuyed = await contract.fetchItemListed()
    console.log(NFTBuyed);
  }

  useEffect(() => {
    handleGetNFTBuyed()
    handleGetNFTCreate()
  }, [])

  return (
    <>
      <CommonSection title={"My NFT"} />
      <section>
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="live__auction__top d-flex align-items-center justify-content-between ">
                <h3>My NFT</h3>
                <span>
                  <Link to="/market">Explore more</Link>
                </span>
              </div>
            </Col>
            {data.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} sale={true}/>
              </Col>
            ))}
            {/* <Col lg="12" className="mb-5">
              <div className="live__auction__top d-flex align-items-center justify-content-between ">
                <h3>NFTs create</h3>
                <span>
                  <Link to="/market">Explore more</Link>
                </span>
              </div>
            </Col> */}
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Profile