import State from "../models/States.js";
import statesData from "../models/statesData.json" with {type: "json"};

const createNewFunFact = async (req, res) => {
    const {funfacts} = req.body;

    if (!funfacts) {
        return res.status(400).json({message: 'State fun facts value required'});
    }
    if (!Array.isArray(funfacts)) {
        return res.status(400).json({message: 'State fun facts value must be an array'});
    }

    let stateDoc = await State.findOne({stateCode: req.code}).exec();

    if (stateDoc) {
        stateDoc.funfacts = [...stateDoc.funfacts, ...funfacts];
        const result = await stateDoc.save();
        return res.json(result);
    }

    const result = await State.create({stateCode: req.code, funfacts});
    res.json(result);
};

const deleteFunFact = async (req, res) => {
    const {index} = req.body;

    if (!index) {
        return res.status(400).json({message: 'State fun fact index value required'});
    }

    const {stateDoc, adjustedIndex, resp} = await getValidatedFunFactState(req, res, index);
    if (resp) return resp;

    stateDoc.funfacts.splice(adjustedIndex, 1);
    const result = await stateDoc.save();
    res.json(result);
};

const getAdmission = (req, res) => {
    const state = statesData.find(s => s.code === req.code);
    res.json({state: state.state, admitted: state.admission_date});
};

const getAllStates = async (req, res) => {
    const {contig} = req.query;
    let filtered = statesData;

    if (contig === 'true') {
        filtered = statesData.filter(s => s.code !== 'AK' && s.code !== 'HI');
    } else if (contig === 'false') {
        filtered = statesData.filter(s => s.code === 'AK' || s.code === 'HI');
    }

    const result = await Promise.all(filtered.map(mergeFunFacts));
    res.json(result);
};

const getCapital = (req, res) => {
    const state = statesData.find(s => s.code === req.code);
    res.json({state: state.state, capital: state.capital_city});
};

const getNickname = (req, res) => {
    const state = statesData.find(s => s.code === req.code);
    res.json({state: state.state, nickname: state.nickname});
};

const getPopulation = (req, res) => {
    const state = statesData.find(s => s.code === req.code);
    res.json({state: state.state, population: state.population.toLocaleString('en-US')});
};

const getRandomFunFact = async (req, res) => {
    const state = statesData.find(s => s.code === req.code);
    const dbState = await State.findOne({stateCode: req.code}).exec();

    if (!dbState || !dbState.funfacts || dbState.funfacts.length === 0) {
        return res.status(404).json({message: `No Fun Facts found for ${state.state}`});
    }

    const randomFact = dbState.funfacts[Math.floor(Math.random() * dbState.funfacts.length)];
    res.json({funfact: randomFact});
};

const getState = async (req, res) => {
    const state = statesData.find(s => s.code === req.code);
    const merged = await mergeFunFacts(state);
    res.json(merged);
};

const getValidatedFunFactState = async (req, res, index) => {
    const stateName = statesData.find(s => s.code === req.code).state;
    const stateDoc = await State.findOne({stateCode: req.code}).exec();

    if (!stateDoc || !stateDoc.funfacts || stateDoc.funfacts.length === 0) {
        return {stateDoc: null, resp: res.status(404).json({message: `No Fun Facts found for ${stateName}`})};
    }

    const adjustedIndex = index - 1;
    if (adjustedIndex < 0 || adjustedIndex >= stateDoc.funfacts.length) {
        return {
            stateDoc: null,
            resp: res.status(404).json({message: `No Fun Fact found at that index for ${stateName}`})
        };
    }

    return {stateDoc, adjustedIndex, resp: null};
};

const mergeFunFacts = async (state) => {
    const dbState = await State.findOne({stateCode: state.code}).exec();
    if (dbState) {
        return {...state, funfacts: dbState.funfacts};
    }
    return state;
};

const updateFunFact = async (req, res) => {
    const {index, funfact} = req.body;

    if (!index) {
        return res.status(400).json({message: 'State fun fact index value required'});
    }
    if (!funfact) {
        return res.status(400).json({message: 'State fun fact value required'});
    }

    const {stateDoc, adjustedIndex, resp} = await getValidatedFunFactState(req, res, index);
    if (resp) return resp;

    stateDoc.funfacts[adjustedIndex] = funfact;
    const result = await stateDoc.save();
    res.json(result);
};

export default {
    createNewFunFact,
    deleteFunFact,
    getAdmission,
    getAllStates,
    getCapital,
    getNickname,
    getPopulation,
    getRandomFunFact,
    getState,
    updateFunFact
};
