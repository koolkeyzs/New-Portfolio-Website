import { loginAdmin, logout } from "../controllers/authControler";
import protect from "../middleware/auth"
import { Router } from "express";

const router = Router()

router.post('/login' , loginAdmin)
router.post("/logout", logout);

router.get('/me' , protect , (req, res) =>{
    res.status(200).json({
        success : true,
        message : 'You are authenticated',
        adminId: res.locals.adminId
    })
})



export default router