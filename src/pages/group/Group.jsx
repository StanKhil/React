import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import "./ui/Group.css";
import ProductCart from "./ui/ProductCart";

export default function Group() {
  const { slug } = useParams();
  const { request, productGroups } = useContext(AppContext);

  const [pageData, setPageData] = useState({
    name: "",
    description: "",
    products: [],
  });

  useEffect(() => {
    request("/api/product-group/" + slug).then(setPageData);
  }, [slug, request]);

  return (
    <>
      <div className="border-bottom mb-3 p-2 d-flex">
        {productGroups.map((group) => (
          <Link key={group.id} className="border nav-link mx-2 d-flex flex-column align-items-center group-link" to={"/group/" + group.slug} title={group.name}>
            <div className="d-flex align-items-center">
              <img src={group.imageUrl} alt={group.name} style={{ width: 32, height: 32 }}/>
              <span className="ms-2">{group.name}</span>
            </div>
            <span className="description">{group.description}</span>
          </Link>
        ))}
      </div>

      <h1>Розділ {pageData.name}</h1>
      <h4>{pageData.description}</h4>

      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
        {pageData.products.map((product) => (
          <ProductCart product={product} key={product.id} />
        ))}
      </div>
    </>
  );
}
