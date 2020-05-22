require('dotenv').config();
const db = require('../db/connection');
const users = db.get('users');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    const user = await users.findOne({ role: 'admin' });
    if (!user) {
      users.insert({
        username: process.env.USERNAME_ADMIN,
        passsword: await bcrypt.hash(process.env.PASSWORD_ADMIN, 12),
        active: true,
        role: 'admin',
      });
      console.log('Admin user created!!');
    } else {
      console.log('Admin user already exist');
    }
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
  }
}
createAdminUser();
