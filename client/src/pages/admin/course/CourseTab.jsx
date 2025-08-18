import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
  useRemoveCourseMutation,
} from "@/features/api/courseApi";
import { Loader, Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseTab = () => {
  const [input, setInput] = React.useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = React.useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
    useGetCourseByIdQuery(courseId, { refetchOnMountOrArgChange: true });

  const [publishCourse, {}] = usePublishCourseMutation();

  useEffect(() => {
    if (courseByIdData?.data) {
      const course = courseByIdData?.data;
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "",
        courseLevel: course.courseLevel || "",
        coursePrice: course.coursePrice || "",
        courseThumbnail: "",
      });
      setPreviewThumbnail(course.courseThumbnail || "");
    }
  }, [courseByIdData]);

  const [editCourse, { data, isLoading, isSuccess, error }] =
    useEditCourseMutation();

  const [removeCourse, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess, error: removeError }] =
    useRemoveCourseMutation();


  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };

  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewThumbnail(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const updateCourseHandler = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    if (input.courseThumbnail) {
      formData.append("courseThumbnail", input.courseThumbnail);
    }
    await editCourse({ formData, courseId });
    navigate("/admin/course");
  };

  const publishStatusHandler = async (action) => {
    const response = await publishCourse({ courseId, query: action });
    if (response.data) {
      refetch()
      toast.success(response.data.message || "Course published or unpublished successfully");
    }
    if (response.error) {
      toast.error(
        response.error.data?.message || "Failed to publish or unpublish course"
      );
    }
  };

  const removeCourseHandler = async() => {
    const course = courseByIdData?.data;
    if (
      window.confirm(
        `Permanently delete “${course.courseTitle}”?\n` +
        "All lectures under this course will be removed."
      )
    ) removeCourse(course._id)
  }

  useEffect(()=> {
    if (removeSuccess) {
      toast.success(removeData?.message || "Course removed successfully");
      navigate("/admin/course");
    }
    if (removeError) {
      toast.error(removeError?.data?.message || "Failed to remove course");
    }
  },[removeSuccess, removeError])

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "Course update");
    }
    if (error) {
      toast.error(error.data?.message || "Course update failed");
    }
  }, [isSuccess, error]);

  if (courseByIdLoading) return <Loader2 className="h-8 w-8 animate-spin" />;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription>
            Make changes to your courses here. Click save when you're done
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button
          disabled={courseByIdData?.data.lectures.length === 0}
            variant="outline"
            onClick={() =>
              publishStatusHandler(
                courseByIdData?.data.isPublished ? "false" : "true"
              )
            }
          >
            {courseByIdData?.data.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button
        variant="destructive"
        size="sm"
        onClick={removeCourseHandler}
        disabled={removeLoading}
      >
        {removeLoading ? "Deleting…" : "Delete"}
      </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt5">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              placeholder="Eg. Fullstack development"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Sub Title</Label>
            <Input
              type="text"
              placeholder="Eg. Become a Fullstack developer from zero to hero"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-5">
            <div>
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="nextJS">Next JS</SelectItem>
                    <SelectItem value="dataScience">Data Science</SelectItem>
                    <SelectItem value="frontend">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="fullStack">
                      Fullstack Development
                    </SelectItem>
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
            <div>
              <Label>Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select course Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="1000"
                className="w-fit"
              />
            </div>
          </div>
          <div>
            <Label>Course Thumbnail</Label>
            <Input
              type="file"
              accept="image/*"
              className="w-fit"
              onChange={selectThumbnail}
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail || "/fallback-thumbnail.png"}
                className="e-64 my-2 width-64 h-64 object-cover rounded-md"
                alt="CourseThumbnail"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseTab;
