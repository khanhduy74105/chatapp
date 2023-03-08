import authRoute from './authRoutes'
const Route = (app)=>{
    app.use('/user', authRoute)
}

export default Route