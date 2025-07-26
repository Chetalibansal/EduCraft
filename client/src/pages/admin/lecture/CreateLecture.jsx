import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

const CreateLecture = () => {
  return (
    <div>
      <div>
        <h1 className="font-bold text-xl">
        Create New Lecture
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
  )
}

export default CreateLecture