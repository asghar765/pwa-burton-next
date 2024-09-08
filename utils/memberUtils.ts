import { customAlphabet } from 'nanoid';

const generateMemberNumber = (): string => {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);
  return nanoid();
};

export { generateMemberNumber };
