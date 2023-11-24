const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    instructor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: [150, "Summary must not be more than 200 characters"],
    },
    summary: {
        type: String,
        required: true,
        maxLength: [300, "Summary must not be more than 200 characters"],
    },
    description: {
        type: String,
        required: true,
        minLength: [2000, "Description must not be more than 500 characters"],
        maxLength: [5000, "Description must not be more than 5000 characters"],
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'beginner',
    },
    requirements: {
        type: mongoose.SchemaType.Mixed,
        required: true,
    },
    resourses: {
        type: Number,
        default: 1
    },
    examinationTest: {
        type: Number,
        default: 1
    },
    ratings: {
        type: Number,
        default: 3.5
    },
    ratingsCount: {
        type: Number,
        default: 0,
    },
    studentsCount: {
        type: Number,
        default: 0,
    },
    TotalSeats: {
        type: Number,
        default: 50,
    },
    AvailSeats: {
        type: Number,
        default: 0,
    },
    durationInWeeks: {
        type: Number,
        required: true,
    },category
    difficulty
    ratings
    durationInWeeks
    startDate
    hoursPerDay
    type
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    lectures: {
        type: Number,
        required: true
    },
    hoursPerDay: {},
    lecturesPerWeeks: {},
    isFree: {
        type: Boolean,
        default: true,
    },
    type: {
        type: String,
        enum: ['free', 'paid'],
        default: 'free',
    },
    language: {
        type: String,
        required: true,
    },
    certificationOnCompletion: {
        type: Boolean,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});


courseSchema.pre('save', function(next) {
    const courseSlug = slugify(this.title, {lower: true, replacement: '-'});
    this.slug = `${courseSlug}-${this._id}`;

    next();
})

courseSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'instructor',
        select: '_id fullName'
    });

    next();
});


const Course = mongoose.model('Course', courseSchema);
module.exports = Course;