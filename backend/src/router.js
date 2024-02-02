const express = require("express");

const router = express.Router();

/**/
// Define Your API Routes Here
/**/

// Import Controllers module for handling item-related operations
const usersControllers = require("./controllers/usersControllers");
const crewControllers = require("./controllers/crewControllers");

// Route to get
router.get("/users", usersControllers.browse);
router.get("/crew", crewControllers.browse);

/* */

module.exports = router;
