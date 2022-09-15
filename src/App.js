import Wrapper from "./components/Wrapper";
import Screen from "./components/Screen";
import ButtonBox from "./components/ButtonBox";
import Button from "./components/Button";
import React, {useState} from "react";

const btnValues = [
  ["AC", "+-", "%", "/"],
  [7, 8, 9, "*"],
  [4, 5, 6, "-"],
  [1, 2, 3, "+"],
  [0, ".", "="],
];

const toLocalString = (num) =>
String(num).replace(/(?<!\..*)(\d)(?=(?:\d{3})+(?:\.|$))/g, "$1");

const removeSpaces = (num) => num.toString().replace(/\s/g,"");

const math = (a, b, sign) => 
sign === "+" ? a + b : sign === "-" ? a - b : sign === "*" ? a*b : a / b;

const App = () => {

  let [calc, setCalc] = useState({
    sign: "",
    num: 0,
    prevNum:"", //tar vare på forrige kalkulasjon
    res: 0,
    AC: "", // 0 tall etter ac trykk, blir sett i resetClickHandler
  });

  const numClickHander = (e) => {
    e.preventDefault ();
    const value = e.target.innerHTML;
    
    if (removeSpaces(calc.num.length < 16)){
      setCalc({
        ...calc,
        num :
          removeSpaces(calc.num) % 1 === 0 && !calc.num.toString().includes(".") 
          ? toLocalString(Number(removeSpaces(calc.num + value)))
          : toLocalString(calc.num + value),
        res: !calc.sign ? 0 : calc.res,
        prevNum :calc.res,    //tar vare paa tidligere resultat  
        AC : "",          
      });
    } 
  };

  const commaClickHander = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;

    setCalc({
      ...calc,
      num: !calc.num.toString().includes(".") ? calc.num + value : calc.num,
    });
  };

  const signClickHander = (e) => {
    
    setCalc({
      ...calc,
      sign: e.target.innerHTML,
      res: !calc.num
      ? calc.res
      : !calc.res
      ? calc.num
      : toLocalString(
        math(
          Number(removeSpaces(calc.res)),
          Number(removeSpaces(calc.num)),
          calc.sign
        )
      ),
      AC : "", 
      num: 0,
    });
  };

  const equalsClickHander = () => {
    if (calc.sign && calc.num) {
      const math = (a, b, sign) =>
      sign === "+"
      ? a + b
      : sign === "-"
      ? a - b
      : sign === "*"
      ? a * b
      : a / b;

      setCalc({
        ...calc,
        res:
        calc.num === "0" && calc.sign === "/"
        ? "Kan ikke dele med 0"
        : toLocalString(
        math(
          Number(removeSpaces(calc.res)), 
          Number(removeSpaces(calc.num)),
          calc.sign)),
        sign: "",
        AC : "", 
        num: 0,
      });
    };
  };

  const invertClickHander = () => {
    setCalc({
      ...calc,
      num: calc.num ? toLocalString(removeSpaces(calc.num) * -1) : 0,
      res: calc.res ? toLocalString(removeSpaces(calc.res) * -1) : 0,
      sign: "",
    });
  };

  const percentClickHander = () => {
    let num = calc.num ? parseFloat(removeSpaces(calc.num)) : 0;
    let res = calc.res ? parseFloat(removeSpaces(calc.res)) : 0;

    setCalc({
    num: (num /= Math.pow(100, 1)),
    res: (res /= Math.pow(100, 1)),
    sign: "",
    AC : "", 
    });
  }

  const resetClickHandler = () => {
    setCalc ({
      ...calc,
      sign: "",
      num: 0,
      prevNum: "",
      res: "",
      AC: 0,
    });
  };
  
  // Screen view ligger i <Screen> ....... />
  return (
    <Wrapper>
      <Screen value = {calc.num ?  calc.prevNum +calc.sign +  calc.num : calc.AC + calc.res + calc.sign }  /> 
      <ButtonBox>
        {
          btnValues.flat().map((btn, i) => {
            return (
              <Button
                key={i}
                className={btn === "=" ? "equals" : ""}
                value={btn}
                onClick={
                btn === "AC" ? resetClickHandler
                : btn === "+-"
                ? invertClickHander
                : btn === "%" 
                ? percentClickHander
                : btn === "="
                ? equalsClickHander
                : btn === "/" || btn === "*" || btn === "-" || btn === "+"
                ? signClickHander
                : btn === "."
                ? commaClickHander
                : numClickHander
                }
              />
            );
          })
        }
      </ButtonBox>
    </Wrapper>
  );
};

export default App;