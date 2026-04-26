import statesData from "../models/statesData.json" with {type: "json"};

const verifyStates = (req, res, next) => {
    const stateCodes = statesData.map(state => state.code);
    const stateParam = req.params.state?.toUpperCase();

    if (!stateCodes.includes(stateParam)) {
        return res.status(400).json({message: 'Invalid state abbreviation parameter'});
    }

    req.code = stateParam;
    next();
};

export default verifyStates;
