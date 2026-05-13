import express from 'express'
import movieRouter from '../modules/movie/movie.routes'
import theatersRouter from '../modules/threater/theater.routes'
import showRouter from "../modules/show/show.routes"
import userRouter from "../modules/user/user.route"
import authRouter from "../modules/auth/auth.route"


const router = express.Router()

router.use('/movies', movieRouter)
router.use('/theaters', theatersRouter)
router.use("/shows", showRouter)
router.use("/users", userRouter)
router.use('/auth',authRouter)

export default router