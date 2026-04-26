import express from "express";
import statesController from "../controllers/statesController.js";
import verifyStates from "../middleware/verifyStates.js";

const router = express.Router();
router.route('/')
    .get(statesController.getAllStates);

router.route('/:state')
    .get(verifyStates, statesController.getState);

router.route('/:state/funfact')
    .get(verifyStates, statesController.getRandomFunFact)
    .post(verifyStates, statesController.createNewFunFact)
    .patch(verifyStates, statesController.updateFunFact)
    .delete(verifyStates, statesController.deleteFunFact);

router.route('/:state/capital')
    .get(verifyStates, statesController.getCapital);

router.route('/:state/nickname')
    .get(verifyStates, statesController.getNickname);

router.route('/:state/population')
    .get(verifyStates, statesController.getPopulation);

router.route('/:state/admission')
    .get(verifyStates, statesController.getAdmission);

export default router;
