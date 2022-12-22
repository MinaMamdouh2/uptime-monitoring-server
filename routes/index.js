// Creating router object
const router = {};

// Importing routers
const usersRouter = require('./usersRoutes');

// Adding routers as attributes to router object
router.usersRouter = usersRouter;

// Export router object
module.exports = router;
