import { model, models, Schema } from "mongoose";

const EditorTasksSchema = new Schema<EditorTasks>({
   taskId: { type: String, unique: true },
   title: { type: String },
   task: { type: String },
   date: { type: Number }
})

const EditorTasksDb = models.EditorTasks || model("EditorTasks", EditorTasksSchema)
export default EditorTasksDb;