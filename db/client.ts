import { model, models, Schema } from "mongoose";

const ClientsSchema = new Schema<Client>({
   userid: { type: String, unique: true },
   googleDriveFolderLink: { type: String },
   platforms: { type: [{
      username: { type: String },
      platform: { type: String },
      link: { type: String },
   }] },
   posts: { type: [{
      link: { type: String },
      taskId: { type: String },
      editorUserId: { type: String },
      platform: { type: String },
      date: { type: Number },
   }] },
   notes: { type: String },
})

const ClientsDb = models.Clients || model("Clients", ClientsSchema)
export default ClientsDb;