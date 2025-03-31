const bcrypt = require('bcryptjs');

async function main() {
  const password = 'admin123'; // Change this to your desired password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hashedPassword);
}

main(); 