import React from "react";

import "../Modal/modal.css";

const Modal = () => {

    const handleChangeNetWork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: "0x5" }]
            });
        } catch (error) {
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{ chainId: "0x5" }]
                });
            }

        }
    }


    return (
        <div className="modal__wrapper">
            <div className="single__modal" style={{ height: "22%" }}>
                <span className="close__modal">
                    {/* <i className="ri-close-line" onClick={() => setShowModal(false)}></i> */}
                </span>
                <h6 className="text-center text-light">Website only support on goerli network</h6>
                <button className="place__bid-btn" onClick={handleChangeNetWork}>Change </button>
            </div>
        </div>
    );
};

export default Modal;
