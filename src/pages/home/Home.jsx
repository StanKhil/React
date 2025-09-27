import { useState } from "react";
import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import { useEffect } from "react";
import './ui/Home.css';
import { Link } from "react-router-dom";



export default function Home() {
    const {productGroups, request} = useContext(AppContext);
    const [pageData, setPageData] = useState({productGroups: [], topProducts: []});

    useEffect(() => {
        request("/api/product-group")
        .then(setPageData);
    }, []);

    return <div>
        <div className="page-title">
            <img src={pageData?.pageTitleImage} alt="Title" />
            <h1 className="display-4">{pageData?.pageTitle}</h1>
        </div>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4 mt-4">
            {productGroups.map(grp => 
                <GroupCard key={grp.slug} group={grp}/>
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

function GroupCard({group}){
    return <div key={group.slug} className="col">    
                    <div className="card h-100">
                        <Link to={"/group/" + group.slug} className="nav-link">
                            <img src={group.imageUrl} alt={group.name} className="card-img-top" />
                        </Link>
                        <div className="card-body">
                            <h5 className="card-title">{group.name}</h5>
                            <p className="card-text">{group.description}</p>
                        </div>
                    </div>
                </div>;
}