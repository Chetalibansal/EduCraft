import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BadgeInfo, Car, PlayCircle } from "lucide-react";
import React from "react";

const CourseDetail = () => {
    const purchasedCourse = false;
  return (
    <div className="mt-16 space-y-5 ">
      <div className="bg-[#2D2F31] text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">Course Title</h1>
          <p className="text-base md:text-lg">Course Sub Title</p>
          <p>
            Created By :{" "}
            <span className="text-[#C0C4FC] underline italic">Ross</span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated: 19-08-25</p>
          </div>
          <p>Students enrolled: 10</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10 ">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis,
            labore deleniti. Tenetur laudantium itaque adipisci dolores suscipit
            voluptas harum totam, assumenda rerum repellendus illum eaque fugit
            porro. Quos, eius earum!
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>4 lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>Lecture Title</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
        <Card>
            <CardContent className=" flex flex-col">
                <div className="w-full aspect-video">
                    React-player Video will be there
                </div>
                <h1>Lecture Title</h1>
                <Separator className="my-2"/>
                <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
            </CardContent>
            <CardFooter className="flex justify-center">
                {
                    purchasedCourse ? (
                        <Button className="w-full" >Continue Course</Button>
                    ) : (
                        <BuyCourseButton/>
                    )
                }
            </CardFooter>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
