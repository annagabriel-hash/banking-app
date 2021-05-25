let testbankAccounts = [
	{
		acctNo: '123456789870',
		firstName: 'ANNA YSABEL',
		lastName: 'GABRIEL',
		completeName: 'GABRIEL, ANNA YSABEL',
		balance: 5150.5,
		transactions: [
			{
				amt: 'PHP 5150.50',
				date: '5/20/2021',
				transactionType: 'Initial Balance',
			},
			{
				amt: '(PHP 50.00)',
				date: '5/24/2021',
				transactionType: 'Withdrawal',
			},
			{
				amt: '(PHP 50.00)',
				date: '5/25/2021',
				transactionType: 'Sent to: 123456789871',
			},
		],
	},
	{
		acctNo: '123456789871',
		firstName: 'JOHN',
		lastName: 'SMITH',
		completeName: 'SMITH, JOHN',
		balance: 500,
		transactions: [
			{
				amt: 'PHP 500.00',
				date: '5/23/2021',
				transactionType: 'Initial Balance',
			},
		],
	},
	{
		acctNo: '123456789872',
		firstName: 'JUAN',
		lastName: 'DELA CRUZ',
		completeName: 'DELA CRUZ',
		balance: 1000,
		transactions: [
			{
				amt: 'PHP 1,000.00',
				date: '5/25/2021',
				transactionType: 'Initial Balance',
			},
		],
	},
];
let testUsers = [
	{
		username: 'AGABRIEL',
		firstName: 'ANNA YSABEL',
		lastName: 'GABRIEL',
		completeName: 'GABRIEL, ANNA YSABEL',
		email: 'yssgabriel@gmail.com',
		password: '1234',
		userType: 'default',
		bankNum: '123456789870',
	},
	{
		username: 'MACHA',
		firstName: 'JOHN',
		lastName: 'SMITH',
		completeName: 'SMITH, JOHN',
		email: 'johnsmith@gmail.com',
		password: '1234',
		userType: 'default',
		bankNum: '123456789870',
	},
	{
		username: 'BANKMGR',
		firstName: 'ANNABELLE',
		lastName: 'LEE',
		completeName: 'LEE, ANNABELLE',
		email: 'annalee@gmail.com',
		password: '1234',
		userType: 'bankmgr',
	},
	{
		username: 'ADMIN',
		firstName: 'STEVE',
		lastName: 'JOBS',
		completeName: 'JOBS, STEVE',
		email: 'admin@gmail.com',
		password: '1234',
		userType: 'sysadmin',
	},
];
let parseBankAcct = JSON.stringify(testbankAccounts);
let parseUsers = JSON.stringify(testUsers);
localStorage.clear();
localStorage.setItem('bankAccounts', parseBankAcct);
localStorage.setItem('users', parseUsers);
