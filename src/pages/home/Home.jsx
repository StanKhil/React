import { useState } from "react";
import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import { useEffect } from "react";
import './ui/Home.css';
import { Link } from "react-router-dom";


export default function Home() {
    const {user} = useContext(AppContext);
    const [pageData, setPageData] = useState({productGroups: [], topProducts: []});

    useEffect(() => {
        fetch("https://localhost:7072/api/product-group")
        .then(r => r.json())
        .then(j => {
            if(j.status.isOk){
                setPageData(j.data);
            }
            else{
                console.error(j);
            }
        })
    }, []);

    return <div>
        <div className="page-title">
            <img src={pageData?.pageTitleImage} alt="Title" />
            <h1 className="display-4">{pageData?.pageTitle}</h1>
        </div>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
            {pageData.productGroups.map(grp => 
                <div key={grp.slug} className="col">    
                    <div className="card h-100">
                        <Link to={"/" + grp.slug} className="nav-link">
                            <img src={grp.imageUrl} alt={grp.name} className="card-img-top" />
                        </Link>
                        <div className="card-body">
                            <h5 className="card-title">{grp.name}</h5>
                            <p className="card-text">{grp.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <br/>
        <h2>Top 3</h2>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
            {pageData.topProducts.map(p => (
                <div className="col" key={p.slug}>
                    <div className="card h-100">
                        <img src={p.imageUrl} className="card-img-top" alt={p.name}/>
                        <div className="card-body">
                            <Link to={"/"} className="nav-link">
                                <h5 className="card-title">
                                    {p.name} - {p.price} грн.
                                </h5>
                                <p className="card-text">
                                    {p.description}
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <br/>
    </div>
}
