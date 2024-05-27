"use strict";

const account1 = {
  owner: "Flo Jhuang",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  movementDate: [
    "2024/04/23",
    "2024/01/25",
    "2024/01/23",
    "2023/11/17",
    "2023/07/14",
    "2023/06/29",
    "2023/01/22",
    "2023/01/08",
  ],
  interestRate: 1.2,
  user: "flo",
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  movementDate: [
    "2023/12/31",
    "2023/11/27",
    "2023/10/29",
    "2023/07/19",
    "2023/05/24",
    "2023/02/23",
    "2023/01/07",
    "2023/01/05",
  ],
  interestRate: 1.5,
  user: "jessica",
  pin: 2222,
};

const account3 = {
  owner: "Steven Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  movementDate: [
    "2024/05/09",
    "2024/04/25",
    "2023/08/14",
    "2023/07/16",
    "2023/05/19",
    "2023/05/04",
    "2023/02/07",
    "2023/01/17",
  ],
  interestRate: 0.7,
  user: "steven",
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  movementDate: [
    "2024/02/28",
    "2024/02/23",
    "2023/10/06",
    "2023/03/16",
    "2023/03/12",
  ],
  interestRate: 1,
  user: "sarah",
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// ELEMENTS
const main = document.querySelector(".main");
const operationMovements = document.querySelector(".operation__movements");

const welcome = document.querySelector(".welcome");

const titleDate = document.querySelector(".title__time");
const titleBalance = document.querySelector(".title__balance");

const loginUser = document.querySelector(".login__input--user");
const loginPin = document.querySelector(".login__input--password");
const loginBtn = document.querySelector(".login__btn");

const transferInputTo = document.querySelector(".form__input--to");
const transferInputAmount = document.querySelector(".form__input--amount");
const transferBtn = document.querySelector(".form__btn--transfer");

const loanInputAmount = document.querySelector(".form__loan--amount");
const loanBtn = document.querySelector(".form__btn--loan");

const closeUser = document.querySelector(".form__input--user");
const closePin = document.querySelector(".form__input--pin");
const closeBtn = document.querySelector(".form__btn--close");

const summaryDetails = document.querySelector(".summary__details");
const summaryBtn = document.querySelector(".summary__btn");

const timer = document.querySelector(".timer");

/* *************VARIABLES************** */
let currentAccount = 0;
const locale = navigator.language;
const nowDate = new Date();
let time = 300;

/* *************HELPER************** */

const formatNumber = function (number) {
  return new Intl.NumberFormat(locale).format(number);
};

const formatDate = function () {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat(locale, options).format(nowDate);
};

const formatDateTime = function () {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Intl.DateTimeFormat(locale, options).format(nowDate);
};
/* *************VIEW************** */

// Display Account Information
const displayAccount = function (opacity = 1) {
  main.style.opacity = opacity;
};

// Display All movements
const displayMovements = function (account, sort = true) {
  operationMovements.innerHTML = "";

  account.movements.forEach((movement, index) => {
    const type = movement > 0 ? "positive" : "negative";
    const date = account.movementDate[index];

    const html = `
    <div class="movements__row">
        <div class="movements__date">${date}</div>
            <div class="movements__amount movements__amount--${type}">
            ${formatNumber(movement)}
        </div>
    </div>
    `;
    console.log(html);
    operationMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display total balance
const displayTotalAmount = function (account) {
  const totalAmount = account.movements.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  titleBalance.textContent = "";
  titleBalance.insertAdjacentText(
    "afterbegin",
    `$${formatNumber(totalAmount)}`
  );
};

const displayLoginTime = function () {
  titleDate.textContent = "";
  titleDate.insertAdjacentText("afterbegin", formatDateTime(nowDate));
};

// Display In、Out and Interest
const displayCalculation = function () {
  const html = `
  <div class="summary__left">
            <p class="summary__label">IN</p>
            <p class="summary__value summary__value--in">$${formatNumber(
              calcIn()
            )}</p>
          </div>

          <div class="summary__left">
            <p class="summary__label">OUT</p>
            <p class="summary__value summary__value--out">$${formatNumber(
              calcOut()
            )}</p>
          </div>

          <div class="summary__left">
            <p class="summary__label">INTEREST</p>
            <p class="summary__value summary__value--interest">$${formatNumber(
              calcInterest()
            )}</p>
          </div>

          <button class="summary__btn">sort</button>
    </div>
  `;

  summaryDetails.innerHTML = html;
};

// Display welcome text
const displayWelcome = function (welcomeText) {
  welcome;
  welcome.textContent = welcomeText;
};

/* *************FUNCTION************** */

//  Login
const checkLogin = function () {
  let useFound = false;

  accounts.forEach((account, index) => {
    if (loginUser.value === account.user && +loginPin.value === account.pin) {
      main.style.opacity = 1;
      useFound = true;
      currentAccount = index;
    }
  });

  if (!useFound) {
    alert("Wrong user or pin. Please try again.");
    return;
  }

  loginUser.value = "";
  loginPin.value = "";
  loginPin.blur();
  displayMovements(accounts[currentAccount]);
  displayTotalAmount(accounts[currentAccount]);
  displayCalculation();
  displayLoginTime();
  displayWelcome(`Welcome! ${accounts[currentAccount].owner}`);
  logOutCounter();
};

// Transfer money
const transfer = function () {
  let checkValidAcc = false;
  let transferUser = 0;

  if (transferInputTo.value === "" || transferInputTo.value === "") return;

  if (Number(transferInputTo.value) < 1)
    alert("Only allow transfer positive amount.");

  accounts.forEach((acc, index) => {
    if (transferInputTo.value === acc.user) {
      checkValidAcc = true;
      transferUser = index;
    }
  });

  if (!checkValidAcc) return;

  // current user deduct amount
  accounts[currentAccount].movements.push(-transferInputAmount.value);
  accounts[currentAccount].movementDate.push(formatDate());

  //transfer user induct amount
  accounts[transferUser].movements.push(+transferInputAmount.value);
  accounts[transferUser].movementDate.push(formatDate());

  transferInputTo.value = "";
  transferInputAmount.value = "";
  transferInputAmount.blur();

  displayMovements(accounts[currentAccount]);
  displayCalculation();
};

// Loan Money
const loan = function () {
  if (loanInputAmount.value === "" || loanInputAmount.value === "") return;
  if (Number(loanInputAmount.value) < 1) alert("Only allow positive amount.");
  accounts[currentAccount].movements.push(Number(loanInputAmount.value));
  accounts[currentAccount].movementDate.push(formatDate());
  displayMovements(accounts[currentAccount]);
  displayCalculation();
};

// Delete Account
const deleteAccount = function () {
  if (
    closeUser.value === accounts[currentAccount].user &&
    Number(closePin.value) === accounts[currentAccount].pin
  ) {
    accounts.splice(currentAccount, 1);
    displayAccount(0);
  } else {
    alert("Wrong user or pin. Please try again.");
  }
};

// Calculate In、Out and Interest
const calcIn = function () {
  const inTotal = accounts[currentAccount].movements
    .filter((mov) => mov > 0)
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

  return inTotal;
};
const calcOut = function () {
  const outTotal = accounts[currentAccount].movements
    .filter((mov) => mov < 0)
    .reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    }, 0);

  return Math.abs(outTotal);
};

const calcInterest = function () {
  const total = accounts[currentAccount].movements.reduce(
    (accumulator, currentValue) => {
      return accumulator + currentValue;
    },
    0
  );

  const interest = (total * accounts[currentAccount].interestRate) / 100;
  return interest;
};

// Log out Counter
const logOutCounter = function () {
  setInterval(function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    time--;

    if (time === 0) {
      clearInterval();
      main.style.opacity = 0;
      displayWelcome(`Log in to get started`);
    }

    timer.textContent = `${min}:${sec}`;
  }, 1000);
};

/* *************EVENT HANDLER************** */

// Login
loginBtn.addEventListener("click", function (e) {
  e.preventDefault();
  checkLogin();
});

// Transfer
transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  transfer();
});

// Loan Request
loanBtn.addEventListener("click", function (e) {
  e.preventDefault();
  loan();
});

// Delete Account
closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  deleteAccount();
});
