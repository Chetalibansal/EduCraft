import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
    setLectureTitle("");
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message || "Lecture created successfully");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error]);

  return (
    <div>
      <div>
        <h1 className="font-bold text-xl">Create New Lecture</h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, illo?
        </p>
      </div>
      <div className="space-y-4">
        <div className="my-3">
          <Label className="my-2">Title</Label>
          <Input
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Your Title name"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
          >
            Back
          </Button>
          <Button disabled={isLoading} onClick={createLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <div className="mt-10">
          {lectureLoading ? (
            <p>Loading lecture...</p>
          ) : lectureError ? (
            <p>Failed to load lectures</p>
          ) : lectureData?.lectures?.length === 0 ? (
            <p>No lectures found for this course</p>
          ) : (
            lectureData?.lectures?.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLecture;
