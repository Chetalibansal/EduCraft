import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div>
      <div className="flex flex-col md:flex-row  items-start w-full justify-between gap-6">
        <div className="flex items-center gap-2">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button size="icon" variant="outline" className="rounded-full ">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">Update your Lecture</h1>
        </div>
      </div>

      <div className="w-full md:w-auto mt-5">
        <LectureTab />
      </div>
    </div>
  );
};

export default EditLecture;
