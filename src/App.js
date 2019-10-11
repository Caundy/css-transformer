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

const removeSemicolons = text => text.replace(/;/g, "");

const finalizeTransformation = text => {
  const lines = getTextLines(text);
  let result = "";
  lines.forEach(line => {
    if (isBracket(line)) {
      result += `${line}\n`;
      return;
    }
    const [property, value] = line.trim().split(":");
    result += `  ${property.trim()}: ${ensureFormatting(property, value)},\n`;
  });
  return result;
};

const removeExtraChars = text => transformHyphens(removeSemicolons(text));

const copyNatifiedCss = ref => {
  ref.select();
  ref.setSelectionRange(0, 99999);
  document.execCommand("copy");
};

const CssDecepticon = () => {
  const [inputValue, setInputValue] = useState("");
  const [preRef, setPreRef] = useState(null);

  const reactNatifyCss = copiedCss => {
    try {
      const strippedCss = removeExtraChars(copiedCss);
      const prettyCss = finalizeTransformation(strippedCss);
      setInputValue(prettyCss);
      setTimeout(() => copyNatifiedCss(preRef));
    } catch (err) {
      setInputValue("DAFUQ U DID");
    }
  };

  const handleChange = event => reactNatifyCss(event.target.value);

  return (
    <div className="App">
      <header>CSS DECEPTICON</header>
      <div className="contentContainer">
        <div className="side">
          <h1>Copy web CSS here</h1>
          <div className="textareaContainer">
            <textarea
              autoFocus
              onChange={handleChange}
              type="text"
              style={{ height: "100%", width: "100%" }}
            />
          </div>
        </div>
        <div className="side">
          <h1>Get RN version</h1>
          <div className="textareaContainer">
            <textarea
              readOnly
              ref={ref => setPreRef(ref)}
              type="text"
              style={{ height: "100%", width: "100%" }}
              value={inputValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CssDecepticon;
