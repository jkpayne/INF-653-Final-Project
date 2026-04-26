import mongoose from "mongoose";

import {config} from "dotenv";

import State from "./models/States.js";

config();
const seedData = [
    {
        stateCode: 'KS',
        funfacts: [
            'Kansas is the birthplace of the Wizard of Oz, written by L. Frank Baum in 1900.',
            'The geographic center of the contiguous 48 states is located near Lebanon, Kansas.',
            'Dodge City, Kansas, is the windiest city in the United States.'
        ]
    },
    {
        stateCode: 'MO',
        funfacts: [
            'Missouri is known as the "Show-Me State" thanks to a phrase coined by Congressman Willard Vandiver in 1899.',
            'The ice cream cone was invented at the 1904 World\'s Fair in St. Louis, Missouri.',
            'Missouri has more than 6,000 known caves — more than any other state — earning it the nickname "The Cave State."'
        ]
    },
    {
        stateCode: 'OK',
        funfacts: [
            'Oklahoma is the only state whose name comes from a Choctaw phrase meaning "red people."',
            'The first parking meter in the world was installed in Oklahoma City in 1935.',
            'Oklahoma has more man-made lakes than any other state, with more than 200.'
        ]
    },
    {
        stateCode: 'NE',
        funfacts: [
            'Nebraska is the only state in the United States with a unicameral (single-house) legislature.',
            'Kool-Aid was invented in Hastings, Nebraska, in 1927 and is the official state soft drink.',
            'The largest mammoth fossil ever discovered was unearthed in Nebraska in 1922.'
        ]
    },
    {
        stateCode: 'CO',
        funfacts: [
            'Colorado has the highest mean elevation of any U.S. state at roughly 6,800 feet above sea level.',
            'The cheeseburger was reportedly trademarked in Denver, Colorado, in 1935.',
            "Colorado is home to the world's largest flat-top mountain — Grand Mesa."
        ]
    },
    {
        stateCode: "RI",
        funfacts: []
    }
];

const seed = async () => {
    if (!process.env.DATABASE_URI) {
        console.error('DATABASE_URI is not set. Configure your .env file before seeding.');
        process.exit(1);
    }
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('Connected to MongoDB');

        for (const entry of seedData) {
            const result = await State.findOneAndUpdate(
                {stateCode: entry.stateCode},
                {stateCode: entry.stateCode, funfacts: entry.funfacts},
                {upsert: true, new: true}
            );
            console.log(`Seeded ${result.stateCode} with ${result.funfacts.length} fun facts`);
        }

        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seed failed:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

seed();
