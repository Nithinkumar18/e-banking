# e-banking


## Application Flow
 This is an banking application which serves for all types of requests such as  user login, performing transactions, view balance, update personal information etc.

##   User Model
 User model has attributes such as userId, userName, email, Password, address 
 For the first time user need to regester by providing all the necessary details.
Once user finishes the initial regestration they can open an account by providing all the required info.

##  Account Model
Account model has attributes such as account number, balance, account type, PAN no, beneficary accounts, user id (as refernce) , date
 User can open account by fullfillng the required prequesties.
 User can add beneficiary accounts to perform transactions.

## Transaction Model
 Transaction model has properties like transaction id, transaction amount, transaction type(debit/credit),transferred to, status, date
 User can perform transaction to beneficiary accounts.
 Users can view last transactions based on custom dates







