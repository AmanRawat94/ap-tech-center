const express = require("express");
const verifyToken = require("../utils/verifyUser");
const { create, getPosts } = require("../controllers/post-controller");
const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getposts", getPosts);

module.exports = router;