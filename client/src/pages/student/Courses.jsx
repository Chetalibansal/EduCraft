import React from "react";
import CourseSkeleton from "./CourseSkeleton";
import Course from "./Course";

const courses = [1, 2, 3, 4, 5, 6];

const Courses = () => {
  const isLoading = false;
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses.map((course, index) => <Course key={index} />)}
        </div>
      </div>
    </div>
  );
};

export default Courses;
