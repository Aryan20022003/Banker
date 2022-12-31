'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
let currentUser = undefined;

const displayMovement = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const status = mov >= 0 ? `deposit` : `withdrawal`;

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${status}">${
      i + 1
    } ${status}</div>
    <div class="movements__value"> ${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserName = function (acct) {
  acct.forEach(function (acc) {
    acc.userName = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(function (val) {
        return val[0];
      })
      .join('');
  });
};

createUserName(accounts);
const cradential = new Map();
for (const account of accounts) {
  cradential.set(account.userName, account.pin);
}

const cradentialMatching = function (username, pin) {
  if (
    cradential.get(username) != undefined &&
    cradential.get(username) === pin
  ) {
    return 1;
  }
  return 0;
};

const UpdateBalance = function (movements) {
  const total = movements.reduce((prev, mov) => prev + mov, 0);
  const netgain = movements
    .filter(val => val >= 0)
    .reduce((prev, val) => prev + val, 0);
  const netloss = movements
    .filter(val => val < 0)
    .reduce((prev, elem) => prev + elem, 0);
  labelBalance.textContent = `${total}€`;
  labelSumIn.textContent = `${netgain}€`;
  labelSumOut.textContent = `${Math.abs(netloss)}€`;
  labelSumInterest.textContent = `${(0.11 * total).toPrecision(4)}`;
};

const AccountDetailUpdation = function (currentUserObject) {
  UpdateBalance(currentUserObject.movements);
};

const setUi = function (currentUser) {
  const currentUserObject = accounts.find(
    account => account.userName === currentUser
  );
  containerApp.style.opacity = Number(1);
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
  displayMovement(currentUserObject.movements);
  AccountDetailUpdation(currentUserObject);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const userid = String(inputLoginUsername.value);
  const pas = Number(inputLoginPin.value);

  const respRec = cradentialMatching(userid, pas);
  if (respRec) {
    currentUser = userid;
    setUi(currentUser);
  } else {
    alert('Invalid user name or password');
  }
});

const updateUi = function (currentUser) {
  const currentUserObject = accounts.find(
    account => account.userName === currentUser
  );
  displayMovement(currentUserObject.movements);
  AccountDetailUpdation(currentUserObject);
};

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  const currentUserObject = accounts.find(
    account => account.userName === currentUser
  );
  currentUserObject.movements.sort((a, b) => Number(b) - Number(a));
  console.log(currentUserObject.movements);
  displayMovement(currentUserObject.movements);
});

// Request Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const AmountLoanInput = Number(inputLoanAmount.value);

  const balance = accounts
    .find(acc => acc.userName == currentUser)
    .movements.reduce((prev, it) => prev + it, 0);
  inputLoanAmount.value = '';

  if (balance * 0.3 >= AmountLoanInput) {
    accounts
      .find(acc => acc.userName == currentUser)
      .movements.push(AmountLoanInput);
    setTimeout(updateUi(currentUser), 3000);
  } else {
    alert(`Loan approave rejected`);
  }
});

//transfer money

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transeferedUser = inputTransferTo.value;
  const Amount =
    Number(inputTransferAmount.value) >= 0
      ? Number(inputTransferAmount.value)
      : 0;
  const balance = accounts
    .find(acc => acc.userName == currentUser)
    .movements.reduce((prev, it) => prev + it, 0);
  inputTransferTo.value = '';
  inputTransferAmount.value = '';
  if (cradential.get(transeferedUser) != undefined && Amount <= balance) {
    accounts
      .find(account => account.userName == transeferedUser)
      .movements.push(Amount);
    accounts
      .find(account => account.userName == currentUser)
      .movements.push(-1 * Amount);
    updateUi(currentUser);
    return;
  }
  alert('Invalid user Name or Amount requested for transfer');
});

//close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const resp = cradentialMatching(
    inputCloseUsername.value,
    Number(inputClosePin.value)
  );
  console.log(inputCloseUsername.value, inputClosePin.value, resp, currentUser);
  const inputcloseUsername = inputCloseUsername.value;
  inputClosePin.value = '';
  inputCloseUsername.value = '';

  if (resp == 1 && inputcloseUsername == currentUser) {
    cradential.delete(inputCloseUsername.value);
    alert(`UI will be disappeart in 3 sec account has been closed\n THANKU`);
    setTimeout(() => {
      containerApp.style.opacity = 0;
    }, 3000);
    currentUser = undefined;
    return;
  }
  alert('Invalid password');
  return;
});
createUserName(accounts);
// displayMovement(account1.movements);
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const arr = [1, 2, 3, 4, 5];

const temp = arr.slice();

console.log(temp);

temp.push(7, 8, 9, 10);
console.log(temp);
console.log(arr);

// Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

// 1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
// 2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

// const calcAverageHumanAge = function (ages) {
//   const humandog = ages.map(function (dg) {
//     if (dg <= 2) return 2 * dg;
//     else return 16 + dg * 4;
//   });
//   console.log(humandog);
//   const fileterd = humandog.filter(function (val) {
//     return val >= 18;
//   });
//   console.log(fileterd);

//   let temp = fileterd.reduce(function (acc, val) {
//     return acc + val;
//   }, 0);
//   console.log(temp);
//   temp /= fileterd.length;
//   console.log(temp);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
