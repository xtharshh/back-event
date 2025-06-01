import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import dotenv from 'dotenv'
import { User } from './models/user.model.js'

dotenv.config({ path: ".env" })

const app = express()

// Middlewares
app.use(express.json({ limit: "20kb" }))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(express.static("public"))

// ✅ CORS setup for localhost frontend (React dev server)
app.use(cors({
  origin: process.env.CORS_ORIGIN, // your frontend dev server
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))

// ✅ Session middleware for localhost
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 90, // 3 months
      httpOnly: false,
      secure: true, // ✅ false for localhost (no HTTPS)
      // sameSite: "lax", // ✅ lax is good for local dev
    },
  })
)

// ✅ Passport Setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return done(null, false, { message: "User not found" })
      }
      const isMatch = await user.comparePassword(password, user.password)
      if (!isMatch) {
        return done(null, false, { message: "Invalid credentials" })
      }
      return done(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// ✅ Debug: Check session on every request
// app.use((req, res, next) => {
//   console.log("🔍 Session user:", req.user)
//   next()
// })

// app.use((req,res,next)=>{
//   console.log("session user id : ", req.session);
//   next();
  
// })

// Routes
import userRoutes from './routes/user.routes.js'
import eventRouter from './routes/event.routes.js'
import notificationRouter from './routes/notification.routes.js'

app.use("/api/users", userRoutes)
app.use("/api/event", eventRouter)
app.use("/api/notify", notificationRouter)

export default app
