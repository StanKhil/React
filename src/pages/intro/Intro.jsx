import { useState } from "react";
import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import Calc from "../../widgets/calc/Calc";

export default function Intro() {
    const {user} = useContext(AppContext);
    const {count, setCount} = useContext(AppContext)
    

    const onPlusClick = () => {
        setCount(count + 1);
    }
    const onMinusClick = () => {
        setCount(count - 1);
    }

    return <div className="text-center">
        <h1 className="display-4">Intro</h1>
        <div className="row">
            <div className="col">
                 <button className="btn btn-primary" onClick={onPlusClick}>+1</button>
            <h3>Count: {count}</h3>
            <button className="btn btn-primary" onClick={onMinusClick}>-1</button>
            {!!user && <p>Hello, {user.Name}</p>}
            <hr/>
            </div>
            <div className="col">
                <Calc/>
            </div>
        </div>
    </div>;
}
