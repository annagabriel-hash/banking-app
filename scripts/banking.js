/*********************************** 
  || Table of Contents          ||
  ||  A. Variables              ||      
  ||  B. Functions              ||    
  ||  C. Class                  ||   
  ||  D. DOM                    ||    
***********************************/

/* ****************************************************************
 **
 ** 			                    	VARIABLES
 **
 ******************************************************************* */
const bankAccounts = [];
const Users = [];
let activeUser = 'default'; // To check what type of user is using the web
let userObj; // To store userinformation upon log in
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
// || Section 3: Account Holder Dashboard
const getNavItemsAcct = document.querySelector('.view-default .nav-items');
const getAcctNo = document.querySelector('#acct-no');
const getAcctName = document.querySelector('#acct-name');
// || Section 4: Account Holder Dashboard
const getNavItemsBank = document.querySelector('.view-bankmgr .nav-items');
// || Section 10: Manage Account Holders
const getAccountHolderTbl = document.querySelector('#list-acctHolders');

/* ****************************************************************
 **
 ** 			                    	FUNCTIONS
 **
 ******************************************************************* */

/*
 ** Description  : setErrorMsg
 ** Parameters   :
 ** Return       :   */
function setErrorMsg(getInput, message) {
	const getFormGrp = getInput.parentElement;
	const getErrMsg = getFormGrp.querySelector('small');
	// Add error message in HTML
	getErrMsg.textContent = message;
	// Add error class
	getFormGrp.classList.add('error');
}
/*
 ** Description  : setSuccessMsg
 ** Parameters   :
 ** Return       :   */
function setSuccessMsg(getInput) {
	const getFormGrp = getInput.parentElement;
	// Add error class
	getFormGrp.classList.add('success');
	getFormGrp.classList.remove('error');
}
/*
 ** Description  : Validates login inputs and returns boolean if correct user and pwd
 ** Return       : boolean (true = valid login inputs)  */
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
 ** Description  : Format number
 ** Parameters   : Number
 ** Return       : Formatted number (e.g., 200 => Php 200.00)  */
function formatNum(num) {
	let formatNum = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'PHP',
		currencySign: 'accounting',
	}).format(num);
	return formatNum;
}
/*
 ** Description  : Clears input values
 ** Parameters   : DOM elements */
function clearInputValues(...elements) {
	elements.forEach((element) => element && (element.value = ''));
}
/*
 ** Description  : Create new table row
 ** Parameters   : data(array)
 ** Returns      : tablerow(element)*/
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
/*
 ** Description  : Creates new user for the account holder
 ** Parameters   : username, email, password (all strings)
 */
function createUser(username, firstName, lastName, email, password, userType, bankNum) {
	// 1. Create user object and add to list of users
	if (userType === 'default') {
		Users.push(new AccountHolder(username, firstName, lastName, email, password, userType, bankNum));
		// 1.1 For account holders, include username in the bankaccount information
		searchAcctHolder(bankNum).username = username;
	} else {
		Users.push(new User(username, firstName, lastName, email, password, userType));
	}
	console.log(`${username} created`);
}
/** Description  : Display users */
function dispUsers() {
	// 1. Display in console
	console.log('List of Users');
	console.table(Users);
	// 2. Delete existing data
	const getTable = document.querySelector('#list-users');
	getTable.removeChild(getTable.lastElementChild);
	// 3. Create new table body
	const newTBody = document.createElement('tbody');
	// 4. Retrieve bankAccount data;
	for (let i = 0; i < Users.length; i++) {
		let { username, userType } = Users[i];
		let userPosition = userTypes[userType];
		// 5. Create table row for each data
		const newTr = createTblRow(username, userPosition);
		// 6. Add action buttons
		const newTd = document.createElement('td');
		const newDeleteBtn = document.createElement('span');
		newDeleteBtn.classList.add('far', 'fa-trash-alt');
		newTd.appendChild(newDeleteBtn);
		newTr.appendChild(newTd);
		newTBody.appendChild(newTr);
	}
	// Append to html table
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
		let user = Users.find((User) => User.username === username);
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
		const newEditBtn = document.createElement('span');
		newEditBtn.classList.add('far', 'fa-edit');
		const newDeleteBtn = document.createElement('span');
		newDeleteBtn.classList.add('far', 'fa-trash-alt');
		newTd.appendChild(newEditBtn);
		newTd.appendChild(newDeleteBtn);
		newTr.appendChild(newTd);
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
/* ****************************************************************
 **
 ** 			                    	CLASSES
 **
 ******************************************************************* */

// Creates transaction object to easily create list of transactions
class Transaction {
	constructor(transactionType, amt) {
		this.transactionType = transactionType;
		this.amt = amt;
	}
}
// Class to easily create user
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

class AccountHolder extends User {
	constructor(username, firstName, lastName, email, password, userType, bankNum) {
		super(username, firstName, lastName, email, password, userType);
		this.bankNum = bankNum;
	}
}

class BankAccount {
	constructor(acctNo, firstName, lastName, startBalance) {
		this.acctNo = acctNo;
		this.firstName = firstName;
		this.lastName = lastName;
		this.completeName = `${lastName}, ${firstName}`;
		this.transactions = [];
		this.initialBal(startBalance); // Updates new balance
	}
	/*
	 ** Description  : Adds initial balance
	 ** Parameters   : bankAccount(string), balance(number)
	 */
	initialBal(startBalance) {
		// 2. Add to transaction history
		this.transactions.push(new Transaction('Initial Balance', formatNum(startBalance)));
		// 3. Update new balance
		this.balance = startBalance;
	}
}

/* ****************************************************************
 **
 ** 			                      	DOM
 **
 ******************************************************************* */
// Test Data
// New Account Holder
bankAccounts.push(new BankAccount('123456789870', 'ANNA YSABEL', 'GABRIEL', 200.5));
bankAccounts.push(new BankAccount('123456789871', 'MARTNEY', 'ACHA', 500));
bankAccounts.push(new BankAccount('123456789872', 'JUAN', 'DELA CRUZ', 1000));
// New User
createUser('AGABRIEL', 'ANNA YSABEL', 'GABRIEL', 'yssgabriel@gmail.com', '1234', 'default', '123456789870');
createUser('MACHA', 'MARTNEY', 'ACHA', 'macha@gmail.com', '1234', 'default', '123456789871');
createUser('BANKMGR', 'ANNABELLE', 'LEE', 'macha@gmail.com', '1234', 'bankmgr');
createUser('SYSADMIN', 'SYSTEM', 'ADMIN', 'macha@gmail.com', '1234', 'sysadmin');

// || Section 1: Login Page
// This will run once the user inputs username
getLoginUser.addEventListener('change', () => {
	// 1. Get login user value
	let loginUser = getLoginUser.value;
	// 2. Change to uppercase and remove leading spaces
	getLoginUser.value = loginUser.toUpperCase().trim();
});
// This resets the login input
getResetBtns[0].addEventListener('click', () => {
	getLoginUser.parentElement.classList.remove('error', 'success');
	getLoginPwd.parentElement.classList.remove('error', 'success');
});
// This will run once the user logins
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
			const getBnkMgrTabs = document.querySelectorAll('.view-bankmgr');
			getBnkMgrTabs.forEach((element) => {
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
getNavItems[4].addEventListener('click', dispAcctHolder);
// || Section 6: Cash In
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
// || Section 7: Pay Bills
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
// || Section 8: Transfer Funds
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
// || Section 10: Withdraw Funds
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
