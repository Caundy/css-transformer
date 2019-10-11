import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + 1 + replacement.length)
  );
};

const includesNumbers = text =>
  ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some(number =>
    text.includes(number)
  );

const isBracket = line => ["{", "}"].some(sign => line.includes(sign));

const finishHim = string => {
  let result = "";
  const lines = string.split("\n");
  lines.forEach(line => {
    if (isBracket(line)) {
      result += `${line}\n`;
      return;
    }
    const [property, value] = line.trim().split(":");
    result += `${property.trim()}: ${transformValue(value.trim())},\n`;
  });
  return result;
};

const transformValue = value => {
  if (value.startsWith("#")) {
    return `'${value}'`;
  }
  if (includesNumbers(value)) {
    console.warn(`"${value}"`);

    let number = "";

    value.split("").forEach(sign => {
      if (includesNumbers(sign) || sign === ".") {
        number += sign;
      }
    });

    console.log(number);
    return number;
  } else {
    return `'${value}'`;
  }
};

const transformHyphens = string => {
  let prettyCss = string;
  while (prettyCss.indexOf("-") !== -1) {
    const firstHyphenIndex = prettyCss.indexOf("-");
    const letterToUppercase = isWithinRange(prettyCss, firstHyphenIndex + 1)
      ? prettyCss[firstHyphenIndex + 1].toUpperCase()
      : "";
    prettyCss = prettyCss.replaceAt(firstHyphenIndex, letterToUppercase);
  }
  return prettyCss;
};

const isWithinRange = (string, index) => index < string.length;

function App() {
  const [inputValue, setInputValue] = useState("");

  const transform = uglyCss => {
    let prettyCss = uglyCss.replace(/\;/g, "");
    prettyCss = transformHyphens(prettyCss);
    prettyCss = finishHim(prettyCss);

    setInputValue(prettyCss);
  };

  return (
    <div className="App">
      <header>JOTPE</header>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          border: "1px solid red"
        }}
      >
        <div style={{ flex: 1, minHeight: "100vh" }}>
          <textarea
            onChange={e => transform(e.target.value)}
            type="text"
            style={{ height: "100%", width: "100%" }}
          />
          <button type="button" onClick={() => {}}></button>
        </div>
        <div style={{ flex: 1, minHeight: "100vh" }}>
          <pre>{inputValue}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
