import { hash } from 'bcryptjs';

async function main() {
  const password = 'admin123'; // Change this to your desired password
  const hashedPassword = await hash(password, 10);
  console.log('Hashed password:', hashedPassword);
}

main(); 