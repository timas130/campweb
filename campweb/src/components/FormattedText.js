import "./FormattedText.css";

function encode(r) {
  return r.replace(/[\x26\n<>'"]/g, (r) => ("&#" + r.charCodeAt(0) + ";"));
}

const colors = [
  "AliceBlue",
  "AntiqueWhite",
  "Aqua",
  "Aquamarine",
  "Azure",
  "Beige",
  "Bisque",
  "Black",
  "BlanchedAlmond",
  "Blue",
  "BlueViolet",
  "Brown",
  "BurlyWood",
  "CadetBlue",
  "Chartreuse",
  "Chocolate",
  "Coral",
  "CornflowerBlue",
  "Cornsilk",
  "Crimson",
  "Cyan",
  "DarkBlue",
  "DarkCyan",
  "DarkGoldenRod",
  "DarkGray",
  "DarkGrey",
  "DarkGreen",
  "DarkKhaki",
  "DarkMagenta",
  "DarkOliveGreen",
  "DarkOrange",
  "DarkOrchid",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkSlateGrey",
  "DarkTurquoise",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DimGray",
  "DimGrey",
  "DodgerBlue",
  "FireBrick",
  "FloralWhite",
  "ForestGreen",
  "Fuchsia",
  "Gainsboro",
  "GhostWhite",
  "Gold",
  "GoldenRod",
  "Gray",
  "Grey",
  "Green",
  "GreenYellow",
  "HoneyDew",
  "HotPink",
  "IndianRed",
  "Indigo",
  "Ivory",
  "Khaki",
  "Lavender",
  "LavenderBlush",
  "LawnGreen",
  "LemonChiffon",
  "LightBlue",
  "LightCoral",
  "LightCyan",
  "LightGoldenRodYellow",
  "LightGray",
  "LightGrey",
  "LightGreen",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "LightSlateGray",
  "LightSlateGrey",
  "LightSteelBlue",
  "LightYellow",
  "Lime",
  "LimeGreen",
  "Linen",
  "Magenta",
  "Maroon",
  "MediumAquaMarine",
  "MediumBlue",
  "MediumOrchid",
  "MediumPurple",
  "MediumSeaGreen",
  "MediumSlateBlue",
  "MediumSpringGreen",
  "MediumTurquoise",
  "MediumVioletRed",
  "MidnightBlue",
  "MintCream",
  "MistyRose",
  "Moccasin",
  "NavajoWhite",
  "Navy",
  "OldLace",
  "Olive",
  "OliveDrab",
  "Orange",
  "OrangeRed",
  "Orchid",
  "PaleGoldenRod",
  "PaleGreen",
  "PaleTurquoise",
  "PaleVioletRed",
  "PapayaWhip",
  "PeachPuff",
  "Peru",
  "Pink",
  "Plum",
  "PowderBlue",
  "Purple",
  "RebeccaPurple",
  "Red",
  "RosyBrown",
  "RoyalBlue",
  "SaddleBrown",
  "Salmon",
  "SandyBrown",
  "SeaGreen",
  "SeaShell",
  "Sienna",
  "Silver",
  "SkyBlue",
  "SlateBlue",
  "SlateGray",
  "SlateGrey",
  "Snow",
  "SpringGreen",
  "SteelBlue",
  "Tan",
  "Teal",
  "Thistle",
  "Tomato",
  "Turquoise",
  "Violet",
  "Wheat",
  "White",
  "WhiteSmoke",
  "Yellow",
  "YellowGreen",
].map(v => v.toLowerCase());
const linkClass = "MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary";

function isHexChars(color) {
  const chars = "0123456789abcdef";
  for (let i = 0; i < color.length; i++) {
    if (! chars.includes(color.charAt(i))) return false;
  }
  return true;
}

function FormattedText(props) {
  let isBold = false, isItalic = false,
      isUnderlined = false, isStriked = false,
      colorPart = 0, linkPart = 0,
      isCancel = false;
  let colorBuf = "", linkText = "", linkHref = "";
  let result = "", text = encode(props.text).replace(/&#10;/g, "<br />");

  for (let i = 0; i < text.length; i++) {
    let c = text.charAt(i);
    // TODO: don't write html straight
    if (isCancel) {
      result += c;
      isCancel = false;
      continue;
    }
    if (c === "*") {
      if (! isBold) {
        result += "<span class=\"fmt__bold\">";
        isBold = true;
      } else {
        result += "</span>";
        isBold = false;
      }
    } else if (c === "^") {
      if (! isItalic) {
        result += "<span class=\"fmt__italic\">";
        isItalic = true;
      } else {
        result += "</span>";
        isItalic = false;
      }
    } else if (c === "_") {
      if (! isUnderlined) {
        result += "<span class=\"fmt__underlined\">";
        isUnderlined = true;
      } else {
        result += "</span>";
        isUnderlined = false;
      }
    } else if (c === "~") {
      if (! isStriked) {
        result += "<span class=\"fmt__striked\">";
        isStriked = true;
      } else {
        result += "</span>";
        isStriked = false;
      }
    } else if (c === "{" && colorPart === 0) {
      colorPart = 1;
    } else if (c === "}" && colorPart === 2) {
      colorPart = 0;
      result += "</span>";
    } else if (c === "[" && linkPart === 0) {
      linkPart = 1;
    } else if (c === "]" && linkPart === 1) {
      linkPart = 2;
    } else if (c === " " && linkPart === 2) {
      let br = false;
      if (linkHref.endsWith("<br")) {
        linkHref = linkHref.slice(0, linkHref.length - 3);
        br = true;
      }
      result += "<a class=\"" + linkClass + "\" href=\"" + linkHref + "\" target=\"_blank\">" + linkText + "</a>";
      if (br) result += "<br";
      linkPart = 0;
      linkHref = "";
      linkText = "";
    } else if (c === "\\") {
      isCancel = true;
    } else {
      if (colorPart === 1) {
        if (c === " ") {
          colorPart = 2;
          colorBuf = colorBuf.toLowerCase();
          if (! colors.includes(colorBuf)) {
            if (colorBuf.length !== 6 || !isHexChars(colorBuf)) {
              colorBuf = "ffffff";
            }
            colorBuf = "#" + colorBuf;
          }
          result += "<span style=\"color: " + colorBuf + ";\">";
          colorPart = 2;
          colorBuf = "";
        } else {
          colorBuf += c;
        }
      } else if (linkPart === 1) {
        linkText += c;
      } else if (linkPart === 2) {
        linkHref += c;
      } else {
        result += c;
      }
    }
  }

  if (linkPart === 2) {
    result += "<a class=\"" + linkClass + "\" href=\"" + linkHref + "\" target=\"_blank\">" + linkText + "</a>";
    linkPart = 0;
  }
  return (
    <span className="fmt" dangerouslySetInnerHTML={{ __html: result }}></span>
  );
}

export default FormattedText;