import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: [String]
});

export default mongoose.model('State', stateSchema);
