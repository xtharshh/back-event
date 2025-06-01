import { Router } from "express"
import { getProfile, profile, register, updateProfile } from "../controllers/user.controller.js";
import passport from "passport";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register)

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err); // If an error occurs, pass it to Express error handler
        if (!user) return res.status(400).json({ error: info.message }); // Send error response

        req.logIn(user, (err) => {
            if (err) return next(err); // Handle session error
            return res.json({ message: "Login successful", user });
        });
    })(req, res, next);
});

router.post("/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: "Logout failed" });
      req.session.destroy();
      res.json({ message: "Logout successful" });
    });
});

router.post("/profile", isAuthenticated, profile)
router.get("/getDetails", isAuthenticated, getProfile)
router.patch("/updateProfile", isAuthenticated, updateProfile)


export default router;