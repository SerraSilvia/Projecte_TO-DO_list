import { Router } from "express";
import  authRouter  from "./auth.routes.js";
import listsRouter from "./lists.routes.js";

const mainRouter = Router();

/*Repartició de rutes: una és per autenticar, l'altre per accedir a les llistes*/
mainRouter.use('/auth', authRouter);
mainRouter.use('/lists', listsRouter);

export default mainRouter;