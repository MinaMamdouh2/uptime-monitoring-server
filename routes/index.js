// Creating router object
const router = {};

// Importing routers
const usersRouter = require('./usersRoutes');
const authRouter = require('./authRoutes');
const urlChecksRouter = require('./urlChecksRoutes');
const reportsRouter = require('./reportsRoutes');

// Adding routers as attributes to router object
router.usersRouter = usersRouter;
router.authRouter = authRouter;
router.urlChecksRouter = urlChecksRouter;
router.reportsRouter = reportsRouter;

// Export router object
module.exports = router;
