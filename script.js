const inputslider = document.querySelector("[data-lengthslider]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const lengthdisplay = document.querySelector("[data-lengthnum]");
const indicator = document.querySelector("[data-indicator]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const symbolscheck = document.querySelector("#symbols");
const numbers = document.querySelector("#numbers");
const generatebtn = document.querySelector(".generatepassword");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~#@$!%*^&_-';
let password = "";
let passwordLength = 12;
let checkcount = 0;
handslider();
setindicator("#ccc");
function handslider() {
  inputslider.value = passwordLength;
  lengthdisplay.innerText = passwordLength;

  const min= inputslider.min;
  const max=inputslider.max;
  inputslider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

function setindicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getrandint(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function getrandnum() {
  return getrandint(0, 9);
}

function generatelowercase() {
  return String.fromCharCode(getrandint(97, 123));
}
function generateuppercase() {
  return String.fromCharCode(getrandint(65, 91));
}

function generaterandsymbol() {
  const randn = getrandint(0, symbols.length);
  return symbols.charAt(randn);
}

function calcstrength() {
  let hasupper = false;
  let haslower = false;
  let hasnum = false;
  let hassymbol = false;
  if (uppercase.checked) hasupper = true;
  if (lowercase.checked) haslower = true;
  if (numbers.checked) hasnum = true;
  if (symbolscheck.checked) hassymbol = true;

  if (haslower && hasnum && hasupper && hassymbol && passwordLength >= 8) {
    setindicator("#0f0");
  } else if (
    (haslower || hasupper) &&
    hasnum && hassymbol &&
    passwordLength < 8
  ) {
    setindicator("#ff0");
  } else if(haslower|| hasupper || hasnum||hassymbol||passwordLength<8){
    setindicator("#f00");
  }
}

async function copycontent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflepassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handlecheckboxchange() {
  checkcount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) checkcount++;
  });
  if (passwordLength < checkcount) {
    passwordLength = checkcount;
    handslider();
  }
}
//  Check here -1

allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handlecheckboxchange);
});

inputslider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handslider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value)
     copycontent();
});

generatebtn.addEventListener("click", () => {
  if (checkcount == 0) return;
  if (passwordLength < checkcount) {
    passwordLength = checkcount;
    handslider();
  }
  password = "";

  let funarr = [];
  if (uppercase.checked) funarr.push(generateuppercase);
  if (lowercase.checked) funarr.push(generatelowercase);
  if (numbers.checked) funarr.push(getrandnum);
  if (symbolscheck.checked) funarr.push(generaterandsymbol);

  for (let i = 0; i < funarr.length; i++) {
    password += funarr[i]();
  }

  for (let i = 0; i < passwordLength - funarr.length; i++) {
    let randindex = getrandint(0, funarr.length);
    password += funarr[randindex]();
  }
  password = shufflepassword(Array.from(password));
  passwordDisplay.value = password;
  calcstrength();
});
