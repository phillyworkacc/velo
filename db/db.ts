import mongoose from "mongoose"

let isConnected = false;

export async function connectToDatabase() {
   mongoose.set('strictQuery', true)

   if (isConnected) {
      console.log(`✅ DB Connection is already established`)
      return
   }

   if (process.env.MONGODB == undefined) return;
   try {
      mongoose.connect(process.env.MONGODB, { dbName: "velo" } as any)
      isConnected = true
      console.log(`✅ Established Database Connection: ${new Date().toUTCString()}`)
   } catch (error) {
      console.log(error)
   }
}