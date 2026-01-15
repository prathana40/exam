const mangoose = require( 'mongoose' );
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minLength: [2, 'Name must be at least 2 characters long.'],

    },
    email: {
        type: String,
        required: [true, 'Email is required. '],
        unique: true,
        lowercase: true,
        trim: true,

    },
    age: {
        type: Number,
        required: [true, 'Age is required.'],
        min: [16, 'User must be at least 16 years old.'],


    },
    role: {
        type: String,
        enum: {
            values: ['student','admin'],
            message: 'Role must be either "student" or "admin".',
        },
        default: 'student',
    },
},
{
    timestamps: true,
});
