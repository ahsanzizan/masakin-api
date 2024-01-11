import * as bcrypt from 'bcrypt';

export async function encryptData(data: string) {
  const { SECRET_ENCRYPTION_SALT_OR_ROUNDS } = process.env;

  const saltOrRounds = Number(SECRET_ENCRYPTION_SALT_OR_ROUNDS);

  return await bcrypt.hash(data, saltOrRounds);
}

export async function compareData(incomingData: string, encryptedData: string) {
  return await bcrypt.compare(incomingData, encryptedData);
}
