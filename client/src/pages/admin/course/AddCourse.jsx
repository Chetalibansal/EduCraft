import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [createCourse, { data, isLoading, isSuccess, error, isError }] =
    useCreateCourseMutation();
  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    await createCourse({ courseTitle, category });
  };

  useEffect(()=>{
    if(isSuccess){
        toast.success(data?.message || "Course created")
        navigate("/admin/course")
    }
  }, [isSuccess, error])

  return (
    <div>
      <div>
        <h1 className="font-bold text-xl">
          Add Course and some basic details of your new course
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, illo?
        </p>
      </div>
      <div className="space-y-4">
        <div className="my-3">
          <Label className="my-2">Title</Label>
          <Input
            type="text"
            name="courseTitle"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Your course name"
          />
        </div>
        <div className="my-3">
          <Label className="my-2">Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="nextJS">Next JS</SelectItem>
                <SelectItem value="dataScience">Data Science</SelectItem>
                <SelectItem value="frontend">Frontend Development</SelectItem>
                <SelectItem value="fullStack">Fullstack Development</SelectItem>
                <SelectItem value="javascript">Javascript</SelectItem>
                <SelectItem value="reactJS">ReactJS</SelectItem>
                <SelectItem value="dsa">
                  Data Structures and Algorithms
                </SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="mern ">MERN Stack</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/course")}>
            Back
          </Button>
          <Button disabled={isLoading} onClick={createCourseHandler}>
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
      </div>
    </div>
  );
};

export default AddCourse;
