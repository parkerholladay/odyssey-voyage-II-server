const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 4011;
const JWT_SECRET = process.env.JWT_SECRET || 'its-a-secret-to-everybody'

const { User } = require('./sequelize/models');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// login
app.get('/login/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  if (!user) {
    return res.status(404).send('Could not log in');
  }
  return res.json(user);
});

app.get('/token/:userId', (req, res) => {
  const payload = {
    user_id: req.params.userId,
    herp: 'derp',
    foo: 'bar',
  };
  const options = {
    expiresIn: '7d',
    keyid: 'its-dangerous-to-go-alone-take-this'
  };
  const token = jwt.sign(payload, JWT_SECRET, options);

  return res.json({ token });
})

app.get('/user/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);
  if (!user) {
    return res.status(404).send('Could not find user with ID');
  }
  return res.json(user);
});

// edit user info
app.patch('/user/:userId', async (req, res) => {
  const user = await User.findByPk(req.params.userId);

  if (!user) {
    return res.status(404).send('Could not find user with ID');
  }

  // properties to update

  user.profileDescription = req.body.profileDescription ? req.body.profileDescription : user.profileDescription;

  user.name = req.body.name ? req.body.name : user.name;

  user.profilePicture = req.body.profilePicture ? req.body.profilePicture : user.profilePicture;

  await user.save();

  return res.json(user);
});

app.listen(port, () => {
  console.log(`UserAccountsAPI running at http://localhost:${port}`);
});
