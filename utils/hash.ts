import crypto from 'crypto'

export const hashPassword = (password: string) => {
   return crypto.createHash('sha1').update(password).digest('hex');
}

export function generateRandomCode (length: number = 6): string {
   const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   let result = '';

   for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
   }

   return result;
}