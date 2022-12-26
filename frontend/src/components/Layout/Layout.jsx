import React, { useContext, useEffect } from "react";

import Routers from "../../routes/Routers";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import NFTContext from "../../context/NFTContext";
import Modal from "../ui/ModalChangeNetWork/ModalChangeNetwork";
import ModalPending from "../ui/ModalPending/ModalPending";

const Layout = () => {
  const { networkError } = useContext(NFTContext);

  return (
    <div>
      {networkError && <Modal />}
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
