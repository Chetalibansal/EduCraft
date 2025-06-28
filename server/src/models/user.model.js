import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["instructor", "student"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course"
      },
    ],
    photoUrl : {
        type: String,
        default: ""
    }
  },
  {timestamps: true}
);

userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10);
  next();
})

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema);
