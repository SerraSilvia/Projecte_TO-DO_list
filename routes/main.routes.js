import { Router } from "express";
import  authRouter  from "./auth.routes.js";
import listsRouter from "./lists.routes.js";
import fs from "fs";

const mainRouter = Router();
const dbPath = "./db/db.json";

/*Repartició de rutes: una és per autenticar, l'altre per accedir a les llistes*/
mainRouter.use('/auth', authRouter);
mainRouter.use('/lists', listsRouter);

// Ruta per crear una nova llista
mainRouter.post("/lists", (req, res) => {
  const { nom, descripcio } = req.body;
  if (!nom || !descripcio) {
    return res.status(400).send("Falten camps obligatoris");
  }
  // Llegir la base de dades
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  const newId = db.lists.length > 0 ? Math.max(...db.lists.map(l => l.id_list)) + 1 : 1;
  const novaLlista = {
    id_list: newId,
    nom,
    descripcio,
    tasks: []
  };
  db.lists.push(novaLlista);
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json(novaLlista);
});

export default mainRouter;