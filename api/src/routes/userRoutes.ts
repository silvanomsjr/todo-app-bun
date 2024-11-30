import userController from "../controllers/userController";

export const userRoutes = {
  "/login": {
    POST: userController.authenticateUser,
  },
  "/register": {
    POST: userController.register,
  },
  "/users": {
    GET: userController.getUsers,
  },
};
