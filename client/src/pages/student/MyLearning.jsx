import React from "react";
import CourseSkeleton from "./CourseSkeleton";
import Course from "./Course";

const MyLearning = () => {
  const isLoading = false;
  return (
    <div className="max-w-4xl mx-auto my-24 px-4 md:px-0">
      <h1 className="font-bold text-2xl">MY LEARNING</h1>
      <div className="my-5">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <CourseSkeleton key={idx} />
            ))}
          </div>
        ) : MyLearning.length === 0 ? (
          <p>You are not enrolled in any course.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2].map((course, index) => (
              <Course key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => {
  return (
    <div className="animate-pulse flex flex-col gap-4 border rounded-xl p-4 shadow-sm bg-white dark:bg-gray-900">
      {/* Course Thumbnail */}
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />

      {/* Course Title */}
      <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />

      {/* Instructor name */}
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />

      {/* Progress bar */}
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full" />
    </div>
  );
};
