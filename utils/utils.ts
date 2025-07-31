export function formatSubscriberCount(count: number) {
   if (count < 1000) return count.toString();
   if (count < 1_000_000) return (count / 1000).toFixed(count < 10_000 ? 2 : 0) + 'k';
   return (count / 1_000_000).toFixed(1) + 'M';
}

export const numberFormatting = (number: number) => {
   let num = number.toFixed(2);
   let [numbersStr, decimalSide] = num.toString().split('.')
   let finalStr = ''
   let count = 0

   for (let i = (numbersStr.length)-1; i >= 0; i--) {
      let digitStr = numbersStr[i];
      count++;
      finalStr = (count == 3 && finalStr.substring(0,i) !== '') ? `,${digitStr}${finalStr}` : `${digitStr}${finalStr}`
      if (count == 3) count = 0;
   }

   return `${finalStr}`;
}

export const moneyFormatting = (number: number) => {
   let num = number.toFixed(2);
   let [numbersStr, decimalSide] = num.toString().split('.')
   let finalStr = ''
   let count = 0

   for (let i = (numbersStr.length)-1; i >= 0; i--) {
      let digitStr = numbersStr[i];
      count++;
      finalStr = (count == 3 && finalStr.substring(0,i) !== '') ? `,${digitStr}${finalStr}` : `${digitStr}${finalStr}`
      if (count == 3) count = 0;
   }

   return `${finalStr}.${decimalSide || '00'}`;
}