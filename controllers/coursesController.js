const User = require('../models/usersModel');
const Course = require('../models/coursesModel');
const CourseTrash = require('../trash/courseTrashModel')


// CREATE COURSES 
exports.createCourse = async (req, res) => {
    try {
        const instructor = await User.findById(req.user._id);
        if(instructor?.role !== 'instructor') {
            return res.json({
                message: 'Become an Instructor to be able to add a course',
            });
        }

        const course = await Course.create({
            instructor: instructor._id,
            title: req.body.title,
            summary: req.body.summary,
            description: req.body.description,
            category: req.body,
            tags: req.body,
            requirements: req.body,
            resourses: req.body,
            examinationTest: req.body,
            TotalSeats: req.body,
            AvailSeats: req.body,
            durationInWeeks: req.body,
            startDate: req.body,
            endDate: req.body,
            lectures: req.body,
            hoursPerDay: req.body,
            lecturesPerWeeks: req.body,
            isFree: req.body,
            type: req.body,
            language: req.body,
            certificationOnCompletion: req.body,
        });

        res.status(201).json({
            status: 'success',
            message: 'Course Successfully Created!',
            data: {
                course,
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message,
        })
    }
}


// GET ALL MY(INSTRUCTOR) COURSES
exports.getAllMyCourses = async (req, res) => {
    try {
        const instructor = await User.findById(req.user._id);
        if(instructor?.role !== 'instructor') {
            return res.json({
                message: 'You are not a creator, you don\'t have access to owning a course ',
            });
        }

        const myCourses = await Course.find({ instructor: instructor._id });

        res.status(200).json({
            status: 'success',
            count: myCourses.length,
            data: {
                courses: myCourses
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}


// UPDATE ONE OF MY(INSTRUCTOR) COURSES
exports.updateMyCourse = async (req, res) => {
    try {

        // FIND THE INSTRUCTOR
        const instructor = await User.findById(req.user._id);
        if(instructor?.role !== 'instructor') {
            return res.json({
                message: 'You are not a creator, you don\'t have access to updating a course ',
            });
        }

        // CHECKING IF THE REQUESTING USER IS THE INSTRUCTOR OF THE COURSE 
        const course = await Course.findById(req.params.courseId);
        if(!course) return res.status(404).json({
            message: 'This course doesn\'t exist!'
        })

        if(course.instructor !== instructor._id) {
            return res.status(400).json({
                message: 'Course doesn\'t belong to this user!'
            });
        }

        // FIND THE COURSE AND MAKE THE UPDATE
        const myCourse = await Course.findOneAndUpdate(req.params.courseId, req.body, {
            runValidators: true,
            new: true, 
        });

        res.status(200).json({
            status: 'success',
            data: {
                myCourse
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


// DELETE ONE OF MY(INSTRUCTOR) COURSE
exports.deleteMyCourse = async (req, res) => {
    try {

        // FIND THE INSTRUCTOR
        const instructor = await User.findById(req.user._id);
        if(instructor?.role !== 'instructor') {
            return res.json({
                message: 'You are not a creator, you don\'t have access to deleting a course ',
            });
        }

        // CHECKING IF THE REQUESTING USER IS THE INSTRUCTOR OF THE COURSE 
        const course = await Course.findById(req.params.courseId);
        if(!course) return res.status(404).json({
            message: 'This course doesn\'t exist!'
        })

        if(req.user._id !== course.instructor) {
            return res.status(400).json({
                message: 'Course doesn\'t belong to this user!'
            });
        }

        // BEFORE DELETING THE COURSE, SAVE A JSON COPY TO TRASH
        const trashCourse = await CourseTrash.create({
            coursePrevId: course._id,
            courseInstructorId: course.instructor,
            content: course
        })

        // FIND THE COURSE AND MAKE THE DELETION
        await Course.findOneAndDelete(req.params.courseId);

        res.status(204).json({
            status: 'success',
            data: null,
            trash: trashCourse
        })

    } catch(err) {
        return res.status(400).json({
            status: 'success',
            message: err.message
        })
    }
}


// GET INSTRUCTOR'S COURSES
exports.getAllInstructorsCourse = async (req, res) => {
    try {
        const instructor = await User.findById(req.params.instructorId);
        if(!instructor) return res.status(404).json({
            message: 'This instructor does no longer exists!'
        });

        const courses = await Course.find({ instructor: instructor._id });
        res.status(200).json({
            status: 'success',
            data: {
                courses,
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            messgae: err.message,
        })
    }
}


// GET ALL COURSES
exports.getAllCourses = async (req, res) => {
    try {
        // GET ALL COURSES
        const courses = await Course.find({});
        res.status(200).json({
            status: 'success',
            data: {
                courses,
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            messgae: err.message,
        })
    }
}


// GET ALL COURSES BASED ON CATEGORY
exports.getAllCoursesBasedOnCategory = async (req, res) => {
    try {
        const { category } = req.params

        // FIND COURSES BASED ON THE CATEGORY FROM THE PARAMS
        // const courses = await Course.find({ category });
        const courses = await Course.find().where('category').equals(category) ;
        res.status(200).json({
            status: 'success',
            data: {
                courses,
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            messgae: err.message,
        })
    }
}


// GET A COURSE BY ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if(!course) return res.status(404).json({
            message: 'Course with this Id not found'
        })

        res.status(200).json({
            status: 'success',
            data: {
                course
            }
        })

    } catch(err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}


// GET TOP RATING COURSES


// GET COURSES BY FILTERING SPECIFIC
exports.filtering = async (req, res) => {
    try {
        const filteredCourses = await Course.find({
            category: req.body?.category,
            difficulty: req.body?.difficulty,
            ratings: req.body?.ratings,
            durationInWeeks: req.body?.durationInWeeks,
            startDate: req.body?.startDate,
            hoursPerDay: req.body?.hoursPerDay,
            type: req.body?.type,
        });

    } catch(err) {

    }
}

/*
category
difficulty
ratings
durationInWeeks
startDate
hoursPerDay
type

*/