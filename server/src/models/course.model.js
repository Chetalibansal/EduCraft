import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    courseTitle:{
        type:String,
        required:true
    },
    subTitle:{
        type:String
    },
    description:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    courseLevel:{
        type:String,
        enum:["beginner", "medium", "advanced"]
    },
    coursePrice:{
        type:Number
    },
    courseThumbnail:{
        type:String
    },
    enrolledStudent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lectures:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Lecture"
        }
    ],
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    isPublished:{
        type:Boolean,
        default: false
    }
},{timestamps:true})

export const Course = mongoose.model("Course", courseSchema)