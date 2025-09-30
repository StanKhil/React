import { useContext } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function AddToCartModal({ product, cart }) {
    const closeModalRef = useRef();
    const navigate = useNavigate();
    const {user} = useContext(AppContext);

    if (!product || !user) return null;

    const goToCartClick = e => {
        e.preventDefault();
        closeModalRef.current.click();
        navigate("/cart");
    };

    return (
        <div
            className="modal fade"
            id="addToCartModal"
            tabIndex="-1"
            aria-labelledby="addToCartModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="addToCartModalLabel">
                            Додати до кошику {product.name}?
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-footer">
                        <button
                            ref={closeModalRef}
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Продовжити
                        </button>
                        <button
                            onClick={goToCartClick}
                            type="button"
                            className="btn btn-primary"
                        >
                            Перейти до кошика
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
