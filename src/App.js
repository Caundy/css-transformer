import React, { useState } from "react";
import "./App.css";

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const TEXT_NUMBER_PROPS = ["fontWeight"];

const includesNumbers = text => NUMBERS.some(number => text.includes(number));

const isNumerical = text => includesNumbers(text) || text === ".";

const isBracket = line => ["{", "}"].some(sign => line.includes(sign));

const isColor = text => text.startsWith("#") || text.includes("rgb");

const isText = text => !includesNumbers(text);

const isWithinRange = (string, index) => index < string.length;

const getTextLines = text => text.split("\n");

const replaceAt = (string, index, replacement) => {
  return (
    string.substr(0, index) +
    replacement +
    string.substr(index + 1 + replacement.length)
  );
};

const ensureFormatting = (property, value) => {
  const transformedValue = `${transformValue(value.trim())}`;
  const formattedValue = TEXT_NUMBER_PROPS.includes(property)
    ? `'${transformedValue}'`
    : transformedValue;
  return formattedValue;
};

const transformValue = value => {
  if (isColor(value) || isText(value)) {
    return `'${value}'`;
  }
  if (includesNumbers(value)) {
    // todo: reduce
    let number = "";
    value.split("").forEach(sign => {
      if (isNumerical(sign)) {
        number += sign;
      }
    });
    return number;
  }
};

const transformHyphens = text => {
  let clearText = text;
  while (clearText.indexOf("-") !== -1) {
    const hyphenIndex = clearText.indexOf("-");
    const letterToUppercase = isWithinRange(clearText, hyphenIndex + 1)
      ? clearText[hyphenIndex + 1].toUpperCase()
      : "";
    clearText = replaceAt(clearText, hyphenIndex, letterToUppercase);
  }
  return clearText;
};

const removeSemicolons = text => text.replace(/\;/g, "");

const finalizeTransformation = text => {
  const lines = getTextLines(text);
  let result = "";
  lines.forEach(line => {
    if (isBracket(line)) {
      result += `${line}\n`;
      return;
    }
    const [property, value] = line.trim().split(":");
    result += `${property.trim()}: ${ensureFormatting(property, value)},\n`;
  });
  return result;
};

const removeExtraChars = text => transformHyphens(removeSemicolons(text));

const App = () => {
  const [inputValue, setInputValue] = useState("");

  const reactNatifyCss = copiedCss => {
    try {
      const prettyCss = finalizeTransformation(removeExtraChars(copiedCss));
      setInputValue(prettyCss);
    } catch (err) {
      setInputValue("DAFUQ U DID");
    }
  };

  const handleChange = event => reactNatifyCss(event.target.value);

  return (
    <div className="App">
      <header>CSS DECEPTICON</header>
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          border: "1px solid red"
        }}
      >
        <div style={{ flex: 1, minHeight: "100vh" }}>
          <textarea
            autoFocus
            onChange={handleChange}
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
};

export default App;
