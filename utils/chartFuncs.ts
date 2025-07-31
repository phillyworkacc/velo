export function getLast7DaysEditorEarnings (payments: EditorPayments[]): { date: string; amount: number }[] {
   const MS_PER_DAY = 86400000;
   const now = new Date();
   const results: { date: string; amount: number }[] = [];

   for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now.getTime() - i * MS_PER_DAY);
      const dayStart = new Date(targetDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(targetDate);
      dayEnd.setHours(23, 59, 59, 999);

      const total = payments
         .filter(p => p.date >= dayStart.getTime() && p.date <= dayEnd.getTime())
         .reduce((sum, p) => sum + p.price, 0);

      results.push({
         date: targetDate.toLocaleDateString('en-GB', {
         day: '2-digit',
         month: 'long',
         year: 'numeric'
         }),
         amount: parseFloat(total.toFixed(2))
      });
   }

   return results;
}
