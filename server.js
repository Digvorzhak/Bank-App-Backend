const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/*
TO DO:
upon creation of an account, update the user and add the account ID to the account array of the user
TO DO:
implement transfer
 */
