import jwt from 'jsonwebtoken'

export const verify= async (req,res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token) {
        const decoded = jwt.verify(token, 'key')
        req.user = decoded
        next()
    } else{
        res.json({success: false, mess: "ko co token", au: authHeader,token})
    }
}