/*********************************** 
  || Table of Contents          ||
  ||  A. Variables              ||      
  ||  B. Class                  ||   
  ||  C. Functions              ||    
  ||  D. DOM                    ||    
***********************************/

/* ****************************************************************
 **
 ** 			                    	VARIABLES
 **
 ******************************************************************* */
const accountHolders = [];
const Users = [];
const activeUser = 'bankmgr'; // To check what type of user is using the web
/* ====================
			DOM elements
==================== */
// || Multiple Sections
const getActionTabs = document.querySelectorAll('.tab');
const getResetBtns = document.querySelector('button[type="reset"]');
const getSubmitBtns = document.querySelectorAll('button[type="submit"]');
// || Section 2: Sign Up Page
const getSignUpBtn = document.querySelector('#btn-signup');
// || Section 3 & 4: Dashboard
const getAcctBal = document.querySelectorAll('button[type="reset"]');
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
/*
 ** Class     : Bank Account (account holders)
 ** Prototypes:
 **   Methods :createUser, initialBal, deposit, withdraw, payBills, transfer, getBalance;
 */
class BankAccount {
	constructor(acctNo, firstName, lastName, startBalance) {
		this.acctNo = acctNo;
		this.firstName = firstName;
		this.lastName = lastName;
		this.transactions = [];
		this.initialBal(startBalance);
	}
	/*
	 ** Function  : Creates new user for the account holder
	 ** Parameters: username, email, password (all strings)
	 */
	createUser(username, email, password) {
		// 1. Include additional object properties
		this.username = username;
		this.email = email;
		this.password = password;
		// 2. Add to list of users
		// Get object properties
		const { firstName, lastName } = this;
		Users.push(new User(username, firstName, lastName, email, password, 'default'));
	}
	/*
	 ** Function  : Adds initial balance
	 ** Parameters: balance(number)
	 */
	initialBal(amt) {
		// 1. Add to transaction history
		this.transactions.push(new Transaction('Initial Balance', amt));
		// 2. Update new balance
		this.balance = amt;
	}
	/*
	 ** Function  : Deposits amount
	 ** Parameters: Amt to deposit (number)
	 ** Returns   : Updated balance
	 */
	deposit(amt) {
		// 1. Add amt to balance of user
		this.balance += amt;
		// 2. Add to transaction history
		this.transactions.push(new Transaction('Deposit', amt));
		console.log(`Added ${amt}. New Balance is ${this.balance}`);
		return this.balance;
	}
	/*
	 ** Function  : Withdraws amount
	 ** Parameters: Amt to withdraw (number)
	 ** Returns   : Updated balance
	 */
	withdraw(amt) {
		// 1. Deduct amt to balance of user
		this.balance -= amt;
		// 2. Add to transaction history
		this.transactions.push(new Transaction('Withdrawal', amt));
		console.log(`Deducted ${amt}. New Balance is ${this.balance}`);
		return this.balance;
	}
	/*
	 ** Function  : Pays bill
	 ** Parameters: Biller (string), amount to be paid (number)
	 ** Returns   : Updated balance
	 */
	payBills(biller, amt) {
		// 1. Deduct amt of payment
		this.balance -= amt;
		// 2. Update transaction history
		this.transactions.push(new Transaction(`Paid biller: ${biller}`, amt));
		console.log(`Paid Php ${amt} to ${biller}. New Balance is ${this.balance}`);
		return this.balance;
	}
	/*
	 ** Function  : Transfers funds
	 ** Parameters: AcctNo to transfer(to), amount to be paid (number)
	 ** Returns   : Updated balance
	 */
	transfer(toUser, amt) {
		// 1. Searches the user to be transferred based on the account number
		let userToTransfer = searchAcctHolder(toUser);
		// 2. Deduct balance from user (transfer from)
		this.balance -= amt;
		// 3. Update transaction history (transfer from)
		this.transactions.push(new Transaction(`Sent to: ${toUser}`, amt));
		// 4. Add balance to user (transfer to)
		userToTransfer.balance += amt;
		// 3. Update transaction history (transfer to)
		userToTransfer.transactions.push(new Transaction(`Received from: ${this.acctNo}`, amt));
		console.log(`Transferred ${amt} from account no:${this.acctNo} to account no:${toUser}`);
	}
	getBalance() {
		return `Php ${this.balance}`;
	}
}
// Class to easily create user
class User {
	constructor(username, firstName, lastName, email, password, userType) {
		this.username = username;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.password = password;
		this.userType = userType;
	}
}

/* ****************************************************************
 **
 ** 			                    	FUNCTIONS
 **
 ******************************************************************* */

/*
 ** Function  : Validate inputted name
 ** Parameters:
 ** Return    :   */
/*
 ** Function  : Validate username
 ** Parameters:
 ** Return    :   */
/*
 ** Function  : Validate account holder
 ** Parameters:
 ** Return    :   */

/*
 ** Function  : Search account
 ** Parameters: Account number (number)
 ** Return    : Bank account object */
function searchAcctHolder(acctNo) {
	try {
		// Account Holder found
		let acctHolder = accountHolders.find((BankAccount) => BankAccount.acctNo === acctNo);
		return acctHolder;
	} catch (error) {
		// Account Holder not found
		console.log('Account number not found');
	}
}

/* ****************************************************************
 **
 ** 			                      	DOM
 **
 ******************************************************************* */
// Test Data
accountHolders.push(new BankAccount('123456789870', 'ANNA YSABEL', 'GABRIEL', 200));
accountHolders.push(new BankAccount('123456789871', 'MARTNEY', 'ACHA', 500));

// || Section 6: Cash In
getSubmitBtns[3].addEventListener('click', () => {
	// 1. Get account number and cash in amount
	let getinputAcctNo;
	let getinputAmt;
	let acctNo = '';
	let cashInAmt = 0;
	if (activeUser === 'bankmgr') {
		getinputAcctNo = document.querySelector('#bnk-deposit-recpt');
		getinputAmt = document.querySelector('#bnk-deposit-amt');
		acctNo = getinputAcctNo.value;
		cashInAmt = parseFloat(getinputAmt.value);
	} else {
		getinputAmt = document.querySelector('#deposit-amt');
		acctNo = getAcctNo.textContent;
		cashInAmt = parseFloat(getinputAmt.value);
	}
	// 2. Search account holder
	let bankAccount = searchAcctHolder(acctNo);
	// 3. Deposit amount to bank account
	bankAccount.deposit(cashInAmt);
	// 4. Reset input amount
	getinputAcctNo && (getinputAcctNo.value = '');
	getinputAmt && (getinputAmt.value = '');
});
// || Section 7: Pay Bills
getSubmitBtns[4].addEventListener('click', () => {
	// 1. Get account number, biller and payment
	let getinputAcctNo;
	let getBiller;
	let getinputAmt;
	let acctNo = '';
	let biller = '';
	let amt = 0;
	if (activeUser === 'bankmgr') {
		getinputAcctNo = document.querySelector('#bnk-paybill-acctNo');
		getBiller = document.querySelector('#bnk-paybill-biller');
		getinputAmt = document.querySelector('#bnk-paybill-amt');
		acctNo = getinputAcctNo.value;
		biller = getBiller.value;
		amt = parseFloat(getinputAmt.value);
	} else {
		getBiller = document.querySelector('#paybill-biller');
		getinputAmt = document.querySelector('#paybill-amt');
		acctNo = getAcctNo.textContent;
		biller = getBiller.value;
		amt = parseFloat(getinputAmt.value);
	}
	// 2. Search account holder
	let bankAccount = searchAcctHolder(acctNo);
	// 3. Deduct amount of payment and update balance
	bankAccount.payBills(biller, amt);
	// 4. Reset input amount
	getinputAcctNo && (getinputAcctNo.value = '');
	getBiller && (getBiller.value = '');
	getinputAmt && (getinputAmt.value = '');
});
// || Section 8: Transfer Funds
getSubmitBtns[5].addEventListener('click', () => {
	// 1. Get account no(sender), account no(receiver) and amt
	let getsenderAcctNo;
	let getreceiverAcctNo;
	let getinputAmt;
	let senderacctNo = '';
	let receiverAcctNo = '';
	let amt = 0;
	if (activeUser === 'bankmgr') {
		getsenderAcctNo = document.querySelector('#bnk-transfer-from');
		senderacctNo = getsenderAcctNo.value;
		getreceiverAcctNo = document.querySelector('#bnk-transfer-to');
		receiverAcctNo = getreceiverAcctNo.value;
		getinputAmt = document.querySelector('#bnk-transfer-amt');
		amt = parseFloat(getinputAmt.value);
	} else {
		senderacctNo = getAcctNo.textContent;
		getreceiverAcctNo = document.querySelector('#transfer-to');
		receiverAcctNo = getreceiverAcctNo.value;
		getinputAmt = document.querySelector('#transfer-amt');
		amt = parseFloat(getinputAmt.value);
	}
	// 2. Search account holder
	let bankAccount = searchAcctHolder(senderacctNo);
	console.log(bankAccount);
	// 3. Update balance
	bankAccount.transfer(receiverAcctNo, amt);
	// 4. Reset input amount
});
// || Section 10: Withdraw Funds
getSubmitBtns[6].addEventListener('click', () => {
	// 1. Get account number, amt
	let getinputAcctNo;
	let getinputAmt;
	let acctNo = '';
	let cashOutAmt = 0;
	if (activeUser === 'bankmgr') {
		getinputAcctNo = document.querySelector('#bnk-withdrw-recpt');
		getinputAmt = document.querySelector('#bnk-withdrw-amt');
		acctNo = getinputAcctNo.value;
		cashOutAmt = parseFloat(getinputAmt.value);
	} else {
		getinputAmt = document.querySelector('#withdrw-amt');
		acctNo = getAcctNo.textContent;
		cashOutAmt = parseFloat(getinputAmt.value);
	}
	// 2. Search account holder
	let bankAccount = searchAcctHolder(acctNo);
	// 3. Deduct amount of payment and update balance
	bankAccount.withdraw(cashOutAmt);
	// 4. Reset input amount
	getinputAcctNo && (getinputAcctNo.value = '');
	getinputAmt && (getinputAmt.value = '');
});
