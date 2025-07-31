import { model, models, Schema } from "mongoose";

const UsersSchema = new Schema<User>({
   userid: { type: String, unique: true },
   name: { type: String },
   description: { type: String },
   password: { type: String },
   email: { type: String, unique: true },
   image: { type: String },
   role: { type: String },
   credentialMethod: { type: String },
   onboarded: { type: Boolean },
   date: { type: Number }
})

const UsersDb = models.Users || model("Users", UsersSchema)
export default UsersDb;