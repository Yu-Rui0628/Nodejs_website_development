# Project Title

COMP5347/COMP4347 Assignment2 - eCommerce Web Application

## Getting Started

This website is a second-hand deals platform for users to sell their old phones and/or purchase a new one from others.
Users can create their own accounts by using signup via the email verification. Then login to the website.
There are 3 states in the home page: home state, search state, and item state.
- Home state shows 2 lists of phones: Best sellers : Top 5 ratings and Sold out soon: Top 5 least stocks.
- Search state let users able to search phones with their titles, their brands and a price range.
- Item state allows users check the details of a specific phone, add it into the cart, view the comments, and add new comments.

There is a checkout page for users to view and modify their carts after logged in. Then purchase the item(s) as they needed.
After users logged in, they can view their profile on another single page. Users are able to change their details and password on this page, view and modify their listed phone(s), and view all the comments of their listed phone(s).  

## Prerequisites

Ensure node and npm are installed

- Recommended IDE: Visual Studio
- Node.js: v18.15.0
- expressjs: v4.17.1
- MongoDb: 5.0.2
- Jquery: 3.6.0
- Javascript
- npm: 8.15.0


### Clone the Repository

```
git clone https://github.sydney.edu.au/COMP5347-COMP4347-2023/LAB06_Wed_Group03.git
```


### Install Dependencies

```
npm install
```

### Set up MongoDB

```
MONGODB_URI=mongodb+srv://ruyu4807:ruyu4807@cluster0.8lvkiqm.mongodb.net/?retryWrites=true&w=majority
//Create a new database named 'demo'
//Add a phone collection named 'phonelists'
//Add a user collection named 'userlists'
```

### Start the application

```
node server.js
```


## Contributing

Please read [CONTRIBUTING.md] https://github.sydney.edu.au/COMP5347-COMP4347-2023/LAB06_Wed_Group03/graphs/contributors for details on our contribution
 

## Authors

* **Yuxiang Gao** - https://github.sydney.edu.au/ygao7539
* **Rui Yu** - https://github.sydney.edu.au/ruyu4807
* **Chenxi Li** - https://github.sydney.edu.au/chli3790


