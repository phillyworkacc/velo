export function validateEmail(email: string) {
   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
   return regex.test(email);
}

export function validateGoogleDriveFolderLink(link: string) {
   return (link.startsWith('https://drive.google.com/drive/folders/') && link.includes("usp=drive_link"));
}