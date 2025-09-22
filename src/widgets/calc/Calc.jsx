import { useEffect, useState } from 'react';
import './ui/Calc.css';
import CalcButton2 from './ui/CalcButton2';

export default function Calc(){
    const buttons = [
        ["%", "CE", "C", "⌫"],          
        ["1/x", "x²", "√x", "÷"],      
        ["_7", "_8", "_9", "×"],
        ["_4", "_5", "_6", "−"],
        ["_1", "_2", "_3", "+"],
        ["_±", "_0", "_.", "="]            
    ];
    

    const [display, setDisplay] = useState("0");
    const [expression, setExpression] = useState("");
    const [displayFontSize, setDisplayFontSize] = useState(36);

    useEffect(() => {
        if(display.length > 8){
            setDisplayFontSize(36 - 2.5 * (display.length - 9));
        } else {
            setDisplayFontSize(36);
        }
    }, [display]);

    const onPmClick = () => {
        let res = display;
        if(res === "0") return;
        if(res.charAt(0) === '-'){
            res = res.substring(1);
        }
        else {
            res = '-' + res;
        }
        setDisplay(res);
    }

    const onDotClick = (dotSymbol) => {
        console.log("dot click");
        if(!display.includes(dotSymbol)){
            setDisplay(display + dotSymbol);
        }
    }

    const onBackspaceClick = () => {
        let res = display;
        if(res.charAt(0) === '-' && res.length <= 2){
            res = "0";
        }
        if(res.length <= 1){
            res = "0";
        } else {
            res = res.substring(0, res.length - 1);
        }
        setDisplay(res);
    }

    const onDigitClick = (digit) => {
        let res = display;

        if(res === "0"){
            res = "";
        }
        if(res.length >= 14) return;
        res += digit;
        setDisplay(res);
    }

    const onClearClick = () => {
        setDisplay("0");
        setExpression("");
    }

    const onMathActionClick = (symbol) => {
        const newExpression = expression + " " + display + " " + symbol;
        setExpression(newExpression);
        setDisplay("0");
    };

    const onEqualClick = () => {
        const fullExpression = expression + " " + display;

        try {

            const jsExpression = fullExpression
                .replaceAll("×", "*")
                .replaceAll("÷", "/")
                .replaceAll("−", "-");

            let answer = eval(jsExpression);

            if (answer === undefined || isNaN(answer)) answer = 0;

            if (answer.toString().length > 14) {
            answer = answer.toExponential(6);
            }

            setDisplay(answer.toString());
            setExpression(""); 
        } catch (e) {
            setDisplay("Error");
            setExpression("");
        }
    };

    const onSqrtClick = () => {
        let res = display;
        res = Math.sqrt(Number(res)).toString();
        setDisplay(res);
    }

    const onSquareClick = () => {
        let res = display;
        res = (Number(res) * Number(res)).toString();
        setDisplay(res);
    }

    const onFractionClick = () => {
        let res = display;
        if (res === "0") return;
        let num = 1 / Number(res);
        res = parseFloat(num.toFixed(6)).toString();
        setDisplay(res);
    };

    const onPercentClick = () => {
        let res = display;
        res = (Number(res) / 100).toString();
        setDisplay(res);
    };

    const buttonObjects = [
        [ 
            {face: "%",  type: "func", action: () => onPercentClick()},
            {face: "CE", type: "func", action: () => setDisplay("0")},
            {face: "C",  type: "func", action: onClearClick},
            {face: "⌫", type: "func", action: onBackspaceClick},
        ],
        [ 
            {face: "1/x",  type: "func", action: () => onFractionClick()},
            {face: "x²", type: "func", action: () => onSquareClick()},
            {face: "√x",  type: "func", action: () => onSqrtClick()},
            {face: "÷", type: "func", action: () => onMathActionClick("÷")},
        ],
        [ 
            {face: "7",  type: "digit", action: onDigitClick},
            {face: "8", type:  "digit", action: onDigitClick},
            {face: "9",  type: "digit", action: onDigitClick},
            {face: "×", type: "func", action: () => onMathActionClick("×")},
        ],
        [ 
            {face: "4",  type: "digit", action: onDigitClick},
            {face: "5", type:  "digit", action: onDigitClick},
            {face: "6",  type: "digit", action: onDigitClick},
            {face: "−", type: "func", action: () => onMathActionClick("−")},
        ],
        [ 
            {face: "1",  type: "digit", action: onDigitClick},
            {face: "2",  type: "digit", action: onDigitClick},
            {face: "3",  type: "digit", action: onDigitClick},
            {face: "+", type: "func", action: () => onMathActionClick("+")},
        ],
        [ 
            {face: "±",  type: "digit", action: onPmClick},
            {face: "0",  type: "digit", action: onDigitClick},
            {face: ".",  type: "digit", action: onDotClick},
            {face: "=", type: "func", action: onEqualClick},
        ],        
    ];

    return <div className="calc">
        <div className='calc-expression'>{expression}</div>
        <div className='calc-display' style={{fontSize: displayFontSize}}>{display}</div>
        {buttonObjects.map((row, index) => <div key={index} className="calc-row">
            {row.map(obj => 
                <CalcButton2 key={obj.face} buttonObject={obj}/>
                )}
        </div>)}
    </div>;
}