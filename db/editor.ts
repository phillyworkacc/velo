import { model, models, Schema } from "mongoose";

const EditorsSchema = new Schema<Editor>({
   userid: { type: String, unique: true },
   googleDriveFolderLink: { type: String },
   tasksCompleted: { type: [{
      taskId: { type: String },
      googleDriveLink: { type: String },
      date: { type: Number }
   }] },
   tasksApproved: { type: [{
      taskId: { type: String },
      date: { type: Number }
   }] },
   payments: { type: [{
      taskId: { type: String },
      price: { type: Number },
      date: { type: Number }
   }] }
})

const EditorsDb = models.Editors || model("Editors", EditorsSchema)
export default EditorsDb;