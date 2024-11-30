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
  "/forgot-password": {
    POST: userController.sendPasswordRecovery,
  },
  "/reset-password": {
    POST: userController.resetPassword,
  },
};
