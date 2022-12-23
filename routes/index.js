// Creating router object
const router = {};

// Importing routers
const usersRouter = require('./usersRoutes');
const authRouter = require('./authRoutes');

// Adding routers as attributes to router object
router.usersRouter = usersRouter;
router.authRouter = authRouter;

// Export router object
module.exports = router;
