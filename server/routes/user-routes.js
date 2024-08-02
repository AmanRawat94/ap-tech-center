const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
  logout,
  getUsers,
  getUser,
} = require("../controllers/user-controller");
const verifyToken = require("../utils/verifyUser");
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updateUser);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/logout", logout);
router.get("/getusers", verifyToken, getUsers);
router.get("/:userId", getUser);

module.exports = router;
