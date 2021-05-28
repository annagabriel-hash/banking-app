/*********************************** 
  || Table of Contents          ||
  ||  A. Variables              ||      
  ||  B. Functions              ||    
  ||  C. Class                  ||   
  ||  D. Event Listeners        ||    
***********************************/

/* ************************************
 ** 	     	 VARIABLES
 *************************************** */

let activeUser = 'default'; // To check what type of user is using the web
let userObj; // To store userinformation upon log in
const bankAccounts = [];
const users = [];
const userTypes = {
	default: 'Account Holders',
	bankmgr: 'Bank Managers',
	sysad: 'System Administrator',
};
let currentTab = 0; // To set what tabs to view in the Sign up page
const FORM = {
	init() {
		FORM.addListeners();
		FORM.addListeners2();
	},
	addListeners() {
		let form = document.forms['loginForm'];
		let username = form.elements['username'];
		let password = form.elements['password'];
		let signUpLink = document.querySelector('#signup-link');
		// While typing
		username.addEventListener('input', FORM.formatStr);

		// When there is an error during validation
		username.addEventListener('invalid', FORM.fail);
		password.addEventListener('invalid', FORM.fail);

		// When the form gets submitted
		form.addEventListener('submit', (ev) => {
			// 1. Validate form details
			let isValid = FORM.validateForm(ev);
			// Form elements are valid
			if (isValid) {
				// 2. Reset form
				form.reset();
				// 3. Load initial data
			}
		});
		// For new users
		signUpLink.addEventListener('click', () => {
			// 1. Show sign up page
			let getSignUpPage = document.querySelector('.sec-newusr');
			getSignUpPage.classList.remove('d-none');
			// 2. View first tab
			FORM.showTab(currentTab);
		});
	},
	addListeners2() {
		let form = document.forms['newUserForm'];
		let inputElems = form.querySelectorAll('input');
		let acctNo = form.elements['acctno'];
		let firstname = form.elements['firstname'];
		let lastname = form.elements['lastname'];
		let newUsername = form.elements['username'];
		let chkpassword = form.elements['chkpassword'];
		// While typing
		// Checks if inputted value is a character
		firstname.addEventListener('keypress', FORM.testStr);
		lastname.addEventListener('keypress', FORM.testStr);
		// Converts inputted character to uppercase
		firstname.addEventListener('input', FORM.formatStr);
		lastname.addEventListener('input', FORM.formatStr);

		// After changing the whole value
		inputElems.forEach((inputElem) => inputElem.addEventListener('change', FORM.validateInputs(inputElem)));
		acctNo.addEventListener('change', FORM.testAcctNum);
		newUsername.addEventListener('change', FORM.testNewUsr);
		chkpassword.addEventListener('change', FORM.testNewPassword);

		// When there is an error during validation
		inputElems.forEach((inputElem) => inputElem.addEventListener('invalid', FORM.fail));
		// || Section 2: New User
		getPrevBtn.addEventListener('click', (e) => {
			getNewUsrTabs[currentTab].classList.add('d-none');
			currentTab--;
			FORM.showTab(currentTab);
		});
		getNextBtn.addEventListener('click', (e) => {
			// Validate data
			let currentInputs = getNewUsrTabs[currentTab].querySelectorAll('input');
			console.log(currentInputs);
			let isFieldValid;
			currentInputs.forEach((element) => {
				FORM.validateInputs(element);
				isFieldValid = element.checkValidity();
				if (!isFieldValid) {
					return;
				}
			});
			if (isFieldValid) {
				getNewUsrTabs[currentTab].classList.add('d-none');
				currentTab++;
				FORM.showTab(currentTab);
			}
		});
		// When the form gets submitted
		form.addEventListener('submit', (ev) => {
			// 1. Validate form details
			let isValid = FORM.validateForm(ev);
			// Form elements are valid
			if (isValid) {
				// 1. Create new user
				FORM.createNewUser(ev);
				// 2. Reset form
				form.reset();
				// 3. Load initial data
				loadDashboard();
			}
		});
	},
	formatStr(ev) {
		let field = ev.target;
		field.value = field.value.toUpperCase().trim();
	},
	fail(ev) {
		let field = ev.target;
		// The invalid event fired
		setErrorMsg(field, field.validationMessage);
	},
	testStr(ev) {
		let field = ev.target;
		let char = parseInt(ev.key);
		// 1. Reset custom errors
		field.setCustomValidity('');
		// Character inputted is not number
		if (Number.isNaN(char)) {
			field.setCustomValidity('Please enter a letter.');
			// Validate input and show message
			field.checkValidity();
		}
	},
	testAcctNum(ev) {
		let field = ev.target;
		let accountHolder = searchAcctHolder(field.value);
		field.setCustomValidity('');
		// Account Number is not existing
		!accountHolder && field.setCustomValidity('Account Number not valid');
	},
	testNewUser(ev) {
		let field = ev.target;
		let username = searchUser(getUsername.value);
		field.setCustomValidity('');
		// New Username is existing
		username && field.setCustomValidity('Username already exist. Please input other username.');
	},
	testNewPassword(ev) {
		let field = ev.target;
		let password = document.forms['newUserForm'].elements['password'];
		field.setCustomValidity('');
		password.setCustomValidity('');
		// 2c. Re-entered password does not match
		if (field.value !== password.value) {
			field.setCustomValidity('Password does not match');
			password.setCustomValidity('Password does not match');
		}
	},
	testLogin(ev) {
		let username = this.elements['username'];
		let password = this.elements['password'];
		// 1. Reset custom errors
		username.setCustomValidity('');
		password.setCustomValidity('');
		// 2. Check validity checks the element's value against the constraints (HTML rules)
		let isUsrValid = username.checkValidity();
		let isPwdValid = password.checkValidity();
		if (isUsrValid && isPwdValid) {
			try {
				// Find existing user in the user list
				let loginUsr = searchUser(username.value);
				// User is not existing
				if (!loginUsr) throw 'Incorrect username or password';
				// Password is incorrect
				if (loginUsr.password !== password.value) throw 'Incorrect username or password';
				// User and password is correct
				// Store user information
				userObj = searchUser(username.value);
			} catch (err) {
				username.setCustomValidity(err);
				password.setCustomValidity(err);
			}
		}
	},
	testSignUp(ev) {
		let inputElems = this.querySelector('input');
		let getAccountNum = this.elements['acctno'];
		let getUsername = this.elements['username'];
		let getPassword = this.elements['password'];
		let getChkpassword = this.elements['chkpassword'];

		let accountHolder = searchAcctHolder(getAccountNum.value);
		let username = searchUser(getUsername.value);
		let isFieldValid;

		// 1. Check validity checks the element's value against the constraints (HTML rules)
		inputElems.forEach((element) => {
			isFieldValue = element.checkValidity();
			if (!isFieldValid) {
				return;
			}
		});
		// 2. Set custom errors
		if (isFieldValid) {
			// Errors:
			// 2a. Account Number is not existing
			!accountHolder && field.setCustomValidity('Account Number not valid');
			// 2b. New Username is existing
			username && field.setCustomValidity('Username already exist. Please input other username.');
			// 2c. Re-entered password does not match
			if (getChkpassword.value !== chkpassword) {
				getChkpassword.setCustomValidity('Password does not match');
				getPassword.setCustomValidity('Password does not match');
			}
		}
	},
	// This is to run the success message, for alert messages it is already included in the invalid event listener
	validateInputs(inputElem) {
		// Check if input value has passed constraints
		let isValid = inputElem.checkValidity();
		isValid && setSuccessMsg(inputElem);
	},
	validateForm(ev) {
		let form = ev.target;
		let inputElems = form.querySelectorAll('input');
		ev.preventDefault();
		// 1. Check if username and password are valid
		// Binds the function such that when running func testLogin, this refers to the form
		form.id === 'loginForm' && FORM.testLogin.bind(form)();
		form.id === 'newUserForm' && FORM.testSignUp.bind(form)();
		// 2. Validate input elements and show message
		inputElems.forEach((inputElem) => FORM.validateInputs(inputElem));
		return form.checkValidity();
	},
	loadLoginDetails() {
		// 1. Search and store user information
		activeUser = userObj.userType;
		bankAccount = searchAcctHolder(userObj.bankNum);
		// 2. Display account balance, account number and account name
		if (activeUser === 'bankmgr') {
			// User is a bank manager
			dispAcctBalance(userObj.username);
			document.querySelector('#acct-no').parentElement.innerHTML = `Branch: <em id="acct-no">MAIN BRANCH</em>`;
			document.querySelector('#acct-name').parentElement.innerHTML = `Bank Manager: <em id="acct-name">${userObj.completeName}</em>`;
		} else if (activeUser === 'admin') {
		} else {
			// User is an account holder
			document.querySelectorAll('.acct-bal')[0].textContent = formatNum(bankAccount.balance);
			document.querySelector('#acct-no').textContent = bankAccount.acctNo;
			document.querySelector('#acct-name').textContent = bankAccount.completeName;
		}
		// 3. Hide login page
		document.querySelector('.sec-log').classList.add('d-none');
		// 4. Show main page
		document.querySelector('main').classList.remove('d-none');
		// 5. Hide view of bank manager;
		if (activeUser === 'default') {
			const getBnkMgrView = document.querySelectorAll('.view-bankmgr');
			getBnkMgrView.forEach((element) => {
				element.classList.add('d-none');
			});
		} else {
			const getUserView = document.querySelectorAll('.view-default');
			getUserView.forEach((element) => {
				element.classList.add('d-none');
			});
		}
	},
	showTab(n) {
		getNewUsrTabs[n].classList.remove('d-none');
		// Starting page
		if (n === 0) {
			getPrevBtn.classList.add('d-none');
			getNextBtn.classList.remove('d-none');
		} else if (n === getNewUsrTabs.length - 1) {
			// End page
			getNextBtn.classList.add('d-none');
			getSignUpBtn.classList.remove('d-none');
		} else {
			// Middle page
			getPrevBtn.classList.remove('d-none');
			getNextBtn.classList.remove('d-none');
			getSignUpBtn.classList.add('d-none');
		}
	},
	createNewUser(ev) {
		let form = ev.target;
		let inputElems = form.querySelectorAll('input');
		// 1. Store form values to object
		let { acctno, firstname, lastname, email, username, password } = storeFormData(form);
		// 2. Create new user
		createUser(username, firstname, lastname, email, password, 'default', acctno);
	},
	loadDashboard() {
		const getSignUpPage = document.querySelector('.sec-newusr');
		getSignUpPage.classList.add('d-none');
	},
};
window.addEventListener('DOMContentLoaded', FORM.init);
/* ====================
			DOM elements
==================== */
// || Multiple Sections
const getActionTabs = document.querySelectorAll('.tab');
const getSubmitBtns = document.querySelectorAll('button[type="submit"]');
const getNavItems = document.querySelectorAll('.nav-items');
const getInputAcctNos = document.querySelectorAll('.validateAcctNo');
const getNewUsrTabs = document.querySelectorAll('.tab-newusr');
// || Section 2: Sign Up Page
const getPrevBtn = document.querySelector('#prevBtn');
const getNextBtn = document.querySelector('#nextBtn');
const getSignUpBtn = document.querySelector('#btn-signup');
// || Section 3: Dashboard
const getNavItemsAcct = document.querySelector('.view-default .nav-items');
const getAcctNo = document.querySelector('#acct-no');
const getAcctName = document.querySelector('#acct-name');
// || Section 8: Manage Bank Statements
const getBankStmForm = document.querySelector('#bankStmntForm');
// || Section 9: Manage Account Holders
const getNewAcctHolder = document.querySelector('#newAcctNoForm');
// || Section 10: Manage User Admin
const getUserItems = document.querySelectorAll('.user-item');
// || Notifications
const getNotif = document.querySelector('.alert');
const getAlertClose = document.querySelector('.alert-close');

/* ************************************
 ** 	     	 FUNCTIONS
 *************************************** */
//Formats number to Php format (e.g., 200 => Php 200.00)
function formatNum(num) {
	let formatNum = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'PHP',
		currencySign: 'accounting',
	}).format(num);
	return formatNum;
}

// Generates random integer from one value to another
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}
// Stores HTMLform data in an object using the form name as object keys and values as the object values and RETURNS the object
// For example, <input name="firstname" value="anna"> will return object.firstname = 'anna';
function storeFormData(formElem) {
	let formData = {};
	// 1. Find input elements
	// Use call function since forEach is not available for HTML Collection
	let getInputs = [].filter.call(formElem.elements, (el) => el.nodeName === 'INPUT');
	// 2. Store data in the object. If there is no name, it will not store the data;
	// Utilizes the input name and value attributes to get the name and value
	getInputs.forEach(({ name, value }) => name && (formData[name] = value));
	return formData;
}
// Sets error message in the input element
function setErrorMsg(getInput, message) {
	const getFormGrp = getInput.parentElement;
	const getErrMsg = getFormGrp.querySelector('small');
	// Add error message in HTML
	getErrMsg.textContent = message;
	// Add error class
	getFormGrp.classList.add('error');
}
/*
 ** Indicates successful message in the input element
 ** Parameters : inputElement */
function setSuccessMsg(getInput) {
	const getFormGrp = getInput.parentElement;
	// Add error class
	getFormGrp.classList.add('success');
	getFormGrp.classList.remove('error');
}
/*
 ** Clears input values
 ** Parameters : DOM elements */
function clearInputValues(...elements) {
	elements.forEach((element) => element && (element.value = ''));
}
/*
 ** Creates new table row
 ** Parameters : data(array)
 ** Returns    : tablerow(element)*/
function createTblRow(...data) {
	// 1. Create table row
	const newTr = document.createElement('tr');
	// 2. Create table data for every data and append to table row
	for (let i = 0; i < data.length; i++) {
		const newTd = document.createElement('td');
		newTd.textContent = data[i];
		// Append table data to table row
		newTr.appendChild(newTd);
	}
	// 3. Return new table row
	return newTr;
}
// Creates new user for the account holder
function createUser(username, firstName, lastName, email, password, userType, bankNum) {
	// 1. Create user object and add to list of users
	if (userType === 'default') {
		users.push(new AccountHolder(username, firstName, lastName, email, password, userType, bankNum));
		// 1.1 For account holders, include username in the bankaccount information
		searchAcctHolder(bankNum).username = username;
	} else {
		users.push(new User(username, firstName, lastName, email, password, userType));
	}
	console.log(`${username} created`);
}
// Delete account holder
function deleteAcctHolder() {
	// 1. Get HTML elements
	let getTbl = document.querySelector('#list-acctHolders > tbody');
	let getTblRow = this.parentElement.parentElement;
	// 2. Delete data
	// Get index of data
	let index = Array.prototype.indexOf.call(getTbl, getTblRow);
	// Delete bank accounts
	bankAccounts.splice(index, 1);
	// 3. Delete from HTML
	getTblRow.remove();
}
/** Description  : Display users */
function dispUsers() {
	// UPDATE DASHBOARD
	// UPDATE USER LIST
	// 1. Delete existing data
	const getTable = document.querySelector('#list-users');
	getTable.removeChild(getTable.lastElementChild);
	// 2. Create new table body
	const newTBody = document.createElement('tbody');
	// 3. Retrieve bankAccount data;
	for (let i = 0; i < users.length; i++) {
		let { username, userType } = users[i];
		let userPosition = userTypes[userType];
		// 4. Create table row for each data
		const newTr = createTblRow(username, userPosition);
		// 5. Add action buttons
		const newTd = document.createElement('td');
		const newDeleteBtn = document.createElement('span');
		newDeleteBtn.classList.add('btn-action', 'far', 'fa-trash-alt');
		newTd.appendChild(newDeleteBtn);
		newTr.appendChild(newTd);
		newTBody.appendChild(newTr);
	}
	// 6. Append to html table
	getTable.appendChild(newTBody);
}

/*
 ** Description  : Search bank account
 ** Parameters   : Account number (number)
 ** Return       : Bank account object */
function searchAcctHolder(acctNo) {
	let acctHolder = bankAccounts.find((BankAccount) => BankAccount.acctNo === acctNo);
	return acctHolder;
}
/*
 ** Description  : Search user
 ** Parameters   : Username (string)
 ** Return       : User object */
function searchUser(username) {
	let user = users.find((User) => User.username === username);
	return user;
}
/*
 ** Description : Deposits amount
 ** Parameters  : bankAccount(string), Amt to deposit (number)
 ** Returns     : Updated balance
 */
function deposit(bankNum, amt) {
	// 1. Search bankaccount (object)
	let bankAccount = searchAcctHolder(bankNum);
	// 2. Add amt to balance of user
	bankAccount.balance += amt;
	// 3. Add to transaction history
	bankAccount.transactions.push(new Transaction('Deposit', formatNum(amt)));
	console.log(`Added ${amt}. New Balance is ${bankAccount.balance}`);
	return bankAccount.balance;
}
/*
 ** Description  : Withdraws amount
 ** Parameters   : bankAccount(string), Amt to withdraw (number)
 ** Returns      : Updated balance
 */
function withdraw(bankNum, amt) {
	// 1. Search bankaccount (object)
	let bankAccount = searchAcctHolder(bankNum);
	// 2. Deduct amt to balance of user
	bankAccount.balance -= amt;
	// 3. Add to transaction history
	bankAccount.transactions.push(new Transaction('Withdrawal', formatNum(-amt)));
	console.log(`Deducted ${amt}. New Balance is ${bankAccount.balance}`);
	return bankAccount.balance;
}
/*
 ** Description  : Transfers funds from one bankaccount to another
 ** Parameters   : bankNum (sender), bankNum (receiver), amount to be paid (number)
 ** Returns      : Updated balance of sender
 */
function sendMoney(bankNumSender, bankNumReceiver, amt) {
	// 1. Searches the bank accounts
	let bankAccSender = searchAcctHolder(bankNumSender);
	let bankAccReceiver = searchAcctHolder(bankNumReceiver);
	// 2. Update balances of bankaccounts
	bankAccSender.balance -= amt;
	bankAccReceiver.balance += amt;
	// 3. Update transaction history
	bankAccSender.transactions.push(new Transaction(`Sent to: ${bankNumReceiver}`, formatNum(-amt)));
	bankAccReceiver.transactions.push(new Transaction(`Received from: ${bankNumSender}`, formatNum(amt)));
	console.log(`Transferred ${formatNum(amt)} from account no:${bankNumSender} to account no:${bankNumReceiver}`);
	return bankAccSender.balance;
}
/*
 ** Description  : Pays bill
 ** Parameters   : bankAccount(string), biller (string), amount to be paid (number)
 ** Returns      : Updated balance
 */
function payBill(bankNum, biller, amt) {
	// 1. Search bankaccount (object)
	let bankAccount = searchAcctHolder(bankNum);
	// 2. Deduct amt of payment
	bankAccount.balance -= amt;
	// 3. Update transaction history
	bankAccount.transactions.push(new Transaction(`Paid biller: ${biller}`, formatNum(-amt)));
	console.log(`Paid Php ${amt} to ${biller}. New Balance is ${bankAccount.balance}`);
	return bankAccount.balance;
}
/*
 ** Description  : Check balance of bankaccount
 ** Parameters   : bankAccount(string)
 ** Returns      : Updated balance
 */
function checkBalance(bankNum) {
	// 1. Search bankaccount (object)
	let bankAccount = searchAcctHolder(bankNum);
	// 2. Return balance
	return formatNum(bankAccount.balance);
}
/** Description  : Display account holders */
function dispAcctHolder() {
	// 1. Display in console
	console.log('List of Account Holders');
	console.table(bankAccounts);
	// 2. Delete existing data
	const getTable = document.querySelector('#list-acctHolders');
	getTable.removeChild(getTable.lastElementChild);
	// 3. Create new table body
	const newTBody = document.createElement('tbody');
	// 4. Retrieve bankAccount data;
	for (let i = 0; i < bankAccounts.length; i++) {
		let { acctNo, completeName, balance } = bankAccounts[i];
		// 5. Create table row for each data
		const newTr = createTblRow(acctNo, completeName, formatNum(balance));
		// 6. Add action buttons
		const newTd = document.createElement('td');
		const newCreateBtn = document.createElement('span');
		newCreateBtn.classList.add('btn-action', 'fa', 'fa-plus-circle');
		const newDeleteBtn = document.createElement('span');
		newDeleteBtn.classList.add('btn-action', 'far', 'fa-trash-alt');
		newDeleteBtn.addEventListener('click', deleteAcctHolder);
		newTd.appendChild(newCreateBtn);
		newTd.appendChild(newDeleteBtn);
		newTr.appendChild(newTd);
		newTBody.appendChild(newTr);
	}
	// Append to html table
	getTable.appendChild(newTBody);
}
/** Description  : Display account holders */
function dispbankStatements() {
	// 1. Get bank account
	const getSearchAcctNo = document.querySelector('#bank-stmnt');
	let bankNum = userObj.bankNum ? userObj.bankNum : getSearchAcctNo.value;
	// 2. Delete existing data
	const getTable = document.querySelector('#tblBnkStatement');
	getTable.removeChild(getTable.lastElementChild);
	// 3. Create new table body
	const newTBody = document.createElement('tbody');
	// 4. Retrieve bankAccount data;
	let transactionHist = searchAcctHolder(bankNum).transactions;
	for (let i = 0; i < transactionHist.length; i++) {
		let { date, amt, transactionType } = transactionHist[i];
		// 5. Create table row for each data
		const newTr = createTblRow(date, transactionType, amt);
		newTBody.appendChild(newTr);
	}
	// Append to html table
	getTable.appendChild(newTBody);
}
function getBalance() {
	let isAccountHolder = userObj.bankNum;
	let balance = 0;
	if (isAccountHolder) {
		// Not an account holder
		let accountHolder = searchAcctHolder(isAccountHolder);
		balance = accountHolder.balance;
	} else {
		// returns balance of all bank holders
		balance = bankAccounts.reduce((acc, obj) => acc + obj.balance, 0);
	}
	return balance;
}
/*
 ** Function  : Display account balance */
function dispAcctBalance(username) {
	let getAcctBal = document.querySelector('.acct-bal');
	getAcctBal.textContent = formatNum(getBalance());
}
// Creates alert notifications
function showNotif(message, type) {
	getNotif.innerHTML = message;
	if (type === 'success') {
		getNotif.className = 'alert alert-success';
	} else {
		getNotif.className = 'alert alert-warning';
	}
	getNotif.classList.remove('d-none');
	setTimeout(() => {
		getNotif.className = 'alert d-none';
	}, 1000);
}
/* ************************************
 ** 	     	 CLASSES
 *************************************** */

// Creates transaction object to easily create list of transactions
class Transaction {
	constructor(transactionType, amt) {
		this.generateDate();
		this.transactionType = transactionType;
		this.amt = amt;
	}
	generateDate() {
		this.date = new Intl.DateTimeFormat('en-us').format(new Date());
	}
}
// User Information
class User {
	constructor(username, firstName, lastName, email, password, userType) {
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.completeName = `${lastName}, ${firstName}`;
		this.email = email;
		this.password = password;
		this.userType = userType;
	}
}
// Users with account holders
class AccountHolder extends User {
	constructor(username, firstName, lastName, email, password, userType, bankNum) {
		super(username, firstName, lastName, email, password, userType);
		this.bankNum = bankNum;
	}
}

class BankAccount {
	constructor(acctNo, firstName, lastName, startBalance) {
		this.acctNo = getRandom(123400000000, 999999999999);
		this.firstName = firstName;
		this.lastName = lastName;
		this.completeName = `${lastName}, ${firstName}`;
		this.transactions = [];
		this.initialBal(startBalance); // Updates new balance
	}
	// Sets the initial balance
	initialBal(startBalance = 0) {
		// 2. Add to transaction history
		this.transactions.push(new Transaction('Initial Balance', formatNum(startBalance)));
		// 3. Update new balance
		this.balance = startBalance;
	}
}

/* ************************************
 ** 	     	 EVENT LISTENERS
 *************************************** */
// Test Data
let loadAccounts = JSON.parse(localStorage.getItem('bankAccounts'));
bankAccounts.push(...loadAccounts);
let loadUsers = JSON.parse(localStorage.getItem('users'));
users.push(...loadUsers);

// || Navigation Bar
getNavItems.forEach((navItem) => {
	navItem.addEventListener('click', (e) => {
		const btnClicked = e.target.parentElement;
		let index = Array.prototype.indexOf.call(getNavItems, btnClicked);
		// Hide all tabs
		getActionTabs.forEach((tab) => {
			tab.classList.add('d-none');
		});
		getActionTabs[index].classList.remove('d-none');
	});
});
getNavItems[4].addEventListener('click', () => activeUser === 'default' && dispbankStatements());
getNavItems[5].addEventListener('click', dispAcctHolder);
// || Section 4: Cash In
getSubmitBtns[2].addEventListener('click', () => {
	// 1. Get account number and cash in amount
	// If user is an account holder, the bank number retrieved from the user information
	const getInputAcctNo = document.querySelector('#deposit-recpt');
	let acctNo = activeUser === 'default' ? userObj.bankNum : getInputAcctNo.value;

	const getInputAmt = document.querySelector('#deposit-amt');
	let cashInAmt = parseFloat(getInputAmt.value);
	// 2. Deposit amount to bank account
	deposit(acctNo, cashInAmt);
	// 3. Reset input amount
	clearInputValues(getInputAcctNo, getInputAmt);
	// 4. Display new balance
	dispAcctBalance(userObj.username);
	// 5. Show Notificaton
	showNotif('Cash in successful', 'success');
});
// || Section 5: Pay Bills
getSubmitBtns[3].addEventListener('click', () => {
	// 1. Get account number, biller and payment
	const getInputAcctNo = document.querySelector('#paybill-acctNo');
	let acctNo = activeUser === 'default' ? userObj.bankNum : getInputAcctNo.value;

	const getBiller = document.querySelector('#paybill-biller');
	let biller = getBiller.value;

	let getInputAmt = document.querySelector('#paybill-amt');
	let amt = parseFloat(getInputAmt.value);
	// 2. Deduct amount of payment and update balance
	payBill(acctNo, biller, amt);
	// 3. Clear input amount
	clearInputValues(getInputAcctNo, getBiller, getInputAmt);
	// 4. Display new balance
	dispAcctBalance(userObj.username);
});
// || Section 6: Transfer Funds
getSubmitBtns[4].addEventListener('click', () => {
	// 1. Get account no(sender), account no(receiver) and amt
	const getSenderAcctNo = document.querySelector('#transfer-from');
	let senderAcctNo = activeUser === 'default' ? userObj.bankNum : getSenderAcctNo.value;

	const getReceiverAcctNo = document.querySelector('#transfer-to');
	let receiverAcctNo = getReceiverAcctNo.value;

	let getInputAmt = document.querySelector('#transfer-amt');
	let amt = parseFloat(getInputAmt.value);
	// 2. Update balance
	sendMoney(senderAcctNo, receiverAcctNo, amt);
	// 3. Reset input amount
	clearInputValues(getSenderAcctNo, getReceiverAcctNo, getInputAmt);
	// 4. Display new balance
	dispAcctBalance(userObj.username);
});
// || Section 7: Withdraw Funds
getSubmitBtns[5].addEventListener('click', () => {
	// 1. Get account number, amt
	const getInputAcctNo = document.querySelector('#withdrw-recpt');
	let acctNo = activeUser === 'default' ? userObj.bankNum : getInputAcctNo.value;

	const getInputAmt = document.querySelector('#withdrw-amt');
	let cashOutAmt = parseFloat(getInputAmt.value);
	// 2. Deduct amount of payment and update balance
	withdraw(acctNo, cashOutAmt);
	// 4. Reset input amount
	clearInputValues(getInputAcctNo, getInputAmt);
	// 4. Display new balance
	dispAcctBalance(userObj.username);
});
// || Section 8: Bank Statement
getSubmitBtns[6].addEventListener('click', (e) => {
	e.preventDefault();
	dispbankStatements();
	let name;
	if (activeUser === 'bankmgr') {
		let acctNo = getBankStmForm.elements.acctNo.value;
		name = searchAcctHolder(acctNo).completeName;
	}
	document.querySelector('#bnkStmAccNo').innerHTML = `Account Name: <i class="text-primary">${name}</i>`;
	getBankStmForm.reset();
});
// || Section 9: Account Holders
getNewAcctHolder.addEventListener('submit', (e) => {
	e.preventDefault();
	// 1. Get Form Data
	let { firstName, lastName, startBalance } = storeFormData(getNewAcctHolder);
	// 2. Store to bankAccounts array
	bankAccounts.push(new BankAccount('123456789870', firstName, lastName, startBalance));
	// 3. Clear form
	getNewAcctHolder.reset();
	// 4. Display update account holders
	dispAcctHolder();
});

getNotif.addEventListener('click', (e) => {
	getNotif.className = 'alert d-none';
});
