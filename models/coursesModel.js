const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema({
    intructor: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    summaryTitle: {},
    description: {
        type: String,
        required: true,
        maxLength: 1000
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: mongoose.Types.Array,
        default: [],
    },
    requirements: {},
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
    ratingsCount: {},
    studentsCount: {},
    TotalSeats: {},
    AvailSeats: {},
    durationInWeeks: {
        type: Number,
        required: true,
    },
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
    language: {},
    certificationOnCompletion: {},


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