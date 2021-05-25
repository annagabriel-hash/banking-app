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
/* ====================
			DOM elements
==================== */
// || Multiple Sections
const getActionTabs = document.querySelectorAll('.tab');
const getResetBtns = document.querySelectorAll('button[type="reset"]');
const getSubmitBtns = document.querySelectorAll('button[type="submit"]');
const getNavItems = document.querySelectorAll('.nav-items');
const getInputAcctNos = document.querySelectorAll('.validateAcctNo');
const getInputAmts = document.querySelectorAll('.validateAmts');
// || Section 1: Login Page
const getLoginUser = document.querySelector('#login-user');
const getLoginPwd = document.querySelector('#login-pwd');
const getSignUpLink = document.querySelector('#signup-link');
const getNewUsrTabs = document.querySelectorAll('.tab-newusr');
// || Section 2: Sign Up Page
const getPrevBtn = document.querySelector('#prevBtn');
const getNextBtn = document.querySelector('#nextBtn');
const getSignUpBtn = document.querySelector('#btn-signup');
const getInputAcctNo = document.querySelector('#newusr-acctno');
const getInputfirstName = document.querySelector('#newusr-firstname');
const getInputlastName = document.querySelector('#newusr-lastname');
const getInputUser = document.querySelector('#newusr-username');
const getInputEmail = document.querySelector('#newusr-email');
const getInputPwd = document.querySelector('#newusr-password');
const getInputPwd2 = document.querySelector('#newusr-chkpassword');
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
// Formats number to Php format (e.g., 200 => Php 200.00)
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
	let getInputs = [].filter.call(getNewAcctHolder.elements, (el) => el.nodeName === 'INPUT');
	// 2. Store data in the object. If there is no name, it will not store the data;
	// Use call function since forEach is not available for HTML Collection
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
 ** Validates login inputs
 ** Return   : boolean (true = valid login inputs)  */
function isLoggedIn() {
	// 1. Get login input values
	let loginUser = getLoginUser.value;
	let loginPwd = getLoginPwd.value;
	// 2. Check blank values
	// 3. Check if user is existing or password is correct
	let userObj = searchUser(loginUser);
	if (!userObj || userObj.password !== loginPwd) {
		if (loginUser === '' || loginPwd === '') {
			loginUser === '' && setErrorMsg(getLoginUser, 'Username cannot be blank');
			loginPwd === '' && setErrorMsg(getLoginPwd, 'Password cannot be blank');
		} else {
			// Show error
			setErrorMsg(getLoginUser, 'Incorrect username or password');
			setErrorMsg(getLoginPwd, 'Incorrect username or password');
		}
		return false;
	} else {
		console.log(userObj);
		alert('Login Successful');
		setSuccessMsg(getLoginUser);
		setSuccessMsg(getLoginPwd);
		return true;
	}
}
function validateSignUp(inputElements) {
	let isValid = true;
	inputElements.forEach((element) => {
		if (element.value === '') {
			let label = element.parentElement.firstElementChild.textContent;
			setErrorMsg(element, `${label} cannot be blank`);
			isValid = false;
		} else {
			setSuccessMsg(element);
		}
	});
	return isValid;
}
/*
 ** Description  : Shows tabs in the signup page
 ** Return       :   */
function showTab(n) {
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
	try {
		// Account Holder found
		let acctHolder = bankAccounts.find((BankAccount) => BankAccount.acctNo === acctNo);
		return acctHolder;
	} catch (error) {
		// Account Holder not found
		console.log('Account number not found');
	}
}
/*
 ** Description  : Search user
 ** Parameters   : Username (string)
 ** Return       : User object */
function searchUser(username) {
	try {
		// Account Holder found
		let user = users.find((User) => User.username === username);
		return user;
	} catch (error) {
		// Account Holder not found
		console.log('User not found');
	}
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
/*
 ** Description  : Check balance of all bankaccount
 ** Parameters   : bankAccount(string)
 ** Returns      : Updated balance
 */
function checkBalances() {
	bankAccounts;
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
/*
 ** Function  : Display account balance */
function dispAcctBalance(username) {
	// 1. Display in console
	console.table(bankAccounts);
	// 2. Display account balance in HTML
	let getAcctBal = document.querySelector('.acct-bal');
	let acctBal = 0;
	// 3. Search username balance
	if (userObj.userType === 'default') {
		let accountHolder = searchAcctHolder(userObj.bankNum);
		acctBal = accountHolder.balance;
	} else {
		acctBal = getBalanceofAll();
	}
	getAcctBal.textContent = formatNum(acctBal);
}
function getBalanceofAll() {
	let balance = 0;
	bankAccounts.forEach((bankAccount) => {
		balance += bankAccount.balance;
	});
	return balance;
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
// Input Validations
getInputAcctNos.forEach((inputElem) => {
	inputElem.addEventListener('change', () => {
		// Check if account number is existing
		if (!searchAcctHolder(inputElem.value)) {
			setErrorMsg(inputElem, 'Account Number not existing');
		}
	});
});
// || Section 1: Login Page
// || This will run once the user inputs username ***/
getLoginUser.addEventListener('change', () => {
	// 1. Get login user value
	let loginUser = getLoginUser.value;
	// 2. Change to uppercase and remove leading spaces
	getLoginUser.value = loginUser.toUpperCase().trim();
});
// || This resets the login input
getResetBtns[0].addEventListener('click', () => {
	getLoginUser.parentElement.classList.remove('error', 'success');
	getLoginPwd.parentElement.classList.remove('error', 'success');
});
// || This will run once the user logins
getSubmitBtns[0].addEventListener('click', (e) => {
	// 1. Prevent submitting of form (default behavior)
	e.preventDefault();
	// 2. Validate user and password input
	if (isLoggedIn()) {
		// UPON SUCCESSFUL LOGIN
		// 3. Search for user and stores user information
		userObj = searchUser(getLoginUser.value);
		console.log(userObj);
		// 4. Set usertype
		activeUser = userObj.userType;
		// 5. Display account balance, account number and account name
		if (activeUser === 'bankmgr') {
			dispAcctBalance(userObj.username);
			document.querySelector('#acct-no').parentElement.innerHTML = `Branch: <em id="acct-no">MAIN BRANCH</em>`;
			document.querySelector('#acct-name').parentElement.innerHTML = `Bank Manager: <em id="acct-name">${userObj.completeName}</em>`;
		} else if (activeUser === 'admin') {
		} else {
			// User is an account holder
			// 1. Search for bankaccount information
			let bankAccount = searchAcctHolder(userObj.bankNum);
			console.log(bankAccount);
			document.querySelectorAll('.acct-bal')[0].textContent = formatNum(bankAccount.balance);
			document.querySelector('#acct-no').textContent = bankAccount.acctNo;
			document.querySelector('#acct-name').textContent = bankAccount.completeName;
		}
		// 5. Reset login page
		getLoginUser.value = '';
		getLoginPwd.value = '';
		// 6. Hide login page
		document.querySelector('.sec-log').classList.add('d-none');
		// 7. Show main page
		document.querySelector('main').classList.remove('d-none');
		// 8. Hide view of bank manager;
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
	}
});
getSignUpLink.addEventListener('click', () => {
	// Show sign up page
	const getSignUpPage = document.querySelector('.sec-newusr');
	getSignUpPage.classList.remove('d-none');
	// View first tab
	showTab(currentTab);
});
// || Section 2: New User
getPrevBtn.addEventListener('click', (e) => {
	e.preventDefault();
	getNewUsrTabs[currentTab].classList.add('d-none');
	currentTab--;
	showTab(currentTab);
});
getNextBtn.addEventListener('click', (e) => {
	e.preventDefault();
	// Validate data
	let getInputValues = getNewUsrTabs[currentTab].querySelectorAll('input');
	if (validateSignUp(getInputValues)) {
		getNewUsrTabs[currentTab].classList.add('d-none');
		currentTab++;
		showTab(currentTab);
	}
});
getInputAcctNo.addEventListener('change', () => {
	// Account Number not existing
	if (!searchAcctHolder(getInputAcctNo.value)) {
		setErrorMsg(getInputAcctNo, 'Invalid account number');
	} else {
		setSuccessMsg(getInputAcctNo);
	}
});
getInputfirstName.addEventListener('change', () => {
	// 1. Get value
	let inputFirstName = getInputfirstName.value;
	// 2. Change to uppercase and remove leading spaces
	getInputfirstName.value = inputFirstName.toUpperCase().trim();
});
getInputlastName.addEventListener('change', () => {
	// 1. Get value
	let inputLastName = getInputlastName.value;
	// 2. Change to uppercase and remove leading spaces
	getInputlastName.value = inputLastName.toUpperCase().trim();
});
getInputUser.addEventListener('change', () => {
	// 1. Get value
	let inputUser = getInputUser.value;
	// 2. Change to uppercase and remove leading spaces
	getInputUser.value = inputUser.toUpperCase().trim();
	inputUser = getInputUser.value;
	if (searchUser(inputUser)) {
		setErrorMsg(getInputUser, 'Username already existing');
	} else {
		setSuccessMsg(getInputUser);
	}
});
getSignUpBtn.addEventListener('click', (e) => {
	e.preventDefault();
	let getInputValues = getNewUsrTabs[currentTab].querySelectorAll('input');
	if (validateSignUp(getInputValues)) {
		if (getInputPwd.value !== getInputPwd2.value) {
			setErrorMsg(getInputPwd, 'Password does not match');
			setErrorMsg(getInputPwd2, 'Password does not match');
		} else {
			// Create new user
			createUser(getInputUser.value, getInputfirstName.value, getInputlastName.value, getInputEmail.value, getInputPwd.value, 'default', getInputAcctNo.value);
			// Hide sign up page
			const getSignUpPage = document.querySelector('.sec-newusr');
			getSignUpPage.classList.add('d-none');
			alert('New user created');
			//
		}
	}
});
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
// || Notificiation
function showNotif(message, type) {
	getNotif.innerText = message;
	if (type === 'success') {
		getNotif.className = 'alert alert-success';
	} else {
		getNotif.className = 'alert alert-warning';
	}
	getNotif.classList.remove('d-none');
	setTimeout(() => {
		getNotif.className = 'alert d-none';
	}, 4000);
}
getAlertClose.addEventListener('click', (e) => {
	e.target.parentElement.classList.add('d-none');
});
