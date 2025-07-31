import { model, models, Schema } from "mongoose";

const OnboardingsSchema = new Schema<Onboarding>({
   userid: { type: String, unique: true },
   meetingReview: { type: String },
   meetingRating: { type: Number },
   expectations: { type: String },
   platforms: { type: [String] }
})

const OnboardingsDb = models.Onboardings || model("Onboardings", OnboardingsSchema)
export default OnboardingsDb;