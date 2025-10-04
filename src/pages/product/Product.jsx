import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import ProductCart from "../group/ui/ProductCart";

export default function Product(){
    const {request} = useContext(AppContext);
    const {slug} = useParams();
    const [info, setInfo] = useState({
        slug: "",
        product: null,
        associations: []
    });

    useEffect(() => {
        request("/api/product/" + slug)
        .then(setInfo);
    }, [slug]);

    return !info.product
    ? <>
        <i>Not found</i>
    </>
    :
    <>
        <h1>Product: {info.product.name}</h1>
        <div className="row">
            <div className="col col-5">
                <img src={info.product.imageUrl} alt={info.product.name} className="w-100" />
            </div>
            <div className="col col-6">
                <h2>{info.product.name}</h2>
                <p>{info.product.description}</p>
                <h3>₴ {info.product.price.toFixed(2)}</h3>
                <button className="btn btn-success">To Cart</button>
            </div>
            <div className="col col-1"></div>
        </div>
        <h3 className="mt-4">Вам ОБОВ'ЯЗКОВО потрібно придбати</h3>
        <div className="row row-cols-6 g-2 mt-2">
        {info.associations.map(product =>
            <ProductCart product={product} key={product.id} isAssociation={true}/>
        )}
    </div>
    </>;
}