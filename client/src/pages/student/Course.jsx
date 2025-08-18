import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { BadgeCheckIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`course-detail/${course._id}`}>
      <Card className="p-0 overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="course"
            className="rounded-t-lg w-full h-36 object-cover"
          />
        </div>
        <CardContent>
          <h1 className="mb-2 mt-[-8px] hover:underline font-bold text-lg truncate">
            {course.courseTitle}
          </h1>
          <div className="flex items-center">
            <div className="flex items-center gap- mb-4 ">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    course.creator?.photoUrl ||
                    "https://github.com/evilrabbit.png"
                  }
                  alt="@avatar"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-md ml-4">
                {course.creator?.name}
              </h1>
              <Badge
                className={
                  "ml-8 lg:ml-4 bg-blue-600 text-white px-2 py-1 text-xs rounded-full"
                }
              >
                {course.courseLevel}
              </Badge>
            </div>
          </div>
          <div className="text-lg font-bold mb-2 mt-[-8px]">
            <span>₹{course.coursePrice}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
