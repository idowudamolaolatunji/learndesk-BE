const mongoose = require('mongoose');

const courseTrash = new mongoose.Schema({
    coursePrevId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Course',
        required: true
    },
    courseInstructorId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: Object,
        required: true
    }
});


const CourseTrash = mongoose.model('CourseTrash', courseTrash);
module.exports = CourseTrash;

