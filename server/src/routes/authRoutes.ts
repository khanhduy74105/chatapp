import { verify } from "../middlewares/verifyToken"
import AuthController from '../controllers/AuthController'
const router = require('express').Router()
router.post("/signup", AuthController.signup)
router.post("/login", AuthController.login)
router.post("/addfriend", verify, AuthController.addfriend)
router.get("/getfriends", verify, AuthController.getFriends)
router.get("/getpeoples", verify, AuthController.getPeople)
router.get("/getconversation/:user2", verify, AuthController.getConversation)
router.post("/sendmessage", verify, AuthController.insertMessage)
router.get("/getmessages/:conversation_id", verify, AuthController.getMessages)


export default router
