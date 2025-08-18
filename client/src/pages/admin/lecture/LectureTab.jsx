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
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState({
    videoUrl: "",
    publicId: "",
  });
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const params = useParams();
  const { courseId, lectureId } = params;
  const navigate = useNavigate();

  const { data: lectureData, refetch } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.data;
  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setUploadVideoInfo({
        videoUrl: lecture.videoUrl,
        publicId: lecture.publicId,
      });
      setIsFree(
        typeof lecture.isPreviewFree === "boolean"
          ? lecture.isPreviewFree
          : false
      );
    }
    refetch();
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();

  const [
    removeLecture,
    {
      data: removeData,
      isLoading: removeLoading,
      isSuccess: removeSuccess,
      error: removeError,
    },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });
        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.url,
            publicId: res.data.data.public_id,
          });
          setBtnDisable(false);
          toast.success(res.data.message);
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload video");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: {
        videoUrl: uploadVideoInfo.videoUrl || "",
        publicId: uploadVideoInfo.publicId || "",
      },
      isPreviewFree: isFree,
      courseId,
      lectureId,
    });
    navigate(`/admin/course/${courseId}/lecture`);
  };

  useEffect(() => {
    if (isSuccess)
      toast.success(data?.message || "Lecture updated successfully");

    if (error) toast.error(error?.data?.message || "Failed to update lecture");
  }, [isSuccess, error]);

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
    navigate(`/admin/course/${courseId}/lecture`);
  };

  useEffect(() => {
    if (removeSuccess)
      toast.success(removeData?.message || "Lecture removed successfully");
    if (removeError) {
      toast.error(removeError?.data?.message || "Failed to remove lecture");
      console.error("Remove error:", removeError);
    }
  }, [removeSuccess, removeError]);

  return (
    <Card className="min-w-75 ">
      <CardHeader>
        <CardTitle>Edit Lecture</CardTitle>
        <CardDescription>Make changes and click save when done</CardDescription>
        <div className="mt-4">
          <Button
            disabled={removeLoading}
            variant="destructive"
            onClick={removeLectureHandler}
          >
            {removeLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Remove Lecture"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Lecture Title"
            className="mt-2"
          />
        </div>

        <div className="mt-4">
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            className="w-fit mt-2"
            onChange={fileChangeHandler}
          />
        </div>

        {uploadVideoInfo?.videoUrl ? (
          <div className="mb-4 mt-4">
            <p className="text-sm text-gray-600 mb-1">
              Previously uploaded video:
            </p>
            <video
              src={uploadVideoInfo.videoUrl}
              controls
              className="w-full max-w-md rounded-md shadow"
            />
          </div>
        ) : (
          <p className="text-red-500 text-sm">No video uploaded yet</p>
        )}

        <div className="flex items-center space-x-2 my-5">
          <Switch checked={isFree} onCheckedChange={setIsFree} id="free" />
          <Label htmlFor="free"> Free </Label>
        </div>

        {mediaProgress && (
          <div className="my-4">
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className="mt-4">
          <Button disabled={isLoading} onClick={editLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              "Update Lecture"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureTab;
