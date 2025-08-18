import React from "react";
import CourseSkeleton from "./CourseSkeleton";
import Course from "./Course";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";


const Courses = () => {
  const {data, isLoading, isError} = useGetPublishedCourseQuery();
  // console.log(data.data);

  if(isError) return <h1>Some error occurred while fetching courses</h1>
  
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : data?.data && data.data.map((course, index) => <Course key={index} course={course} />)}
        </div>
      </div>
    </div>
  );
};

export default Courses;
