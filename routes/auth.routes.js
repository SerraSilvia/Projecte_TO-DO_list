import { Router } from "express";
import { UserRepository } from '../user-repository.js';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from "../config.js";


const authRouter = Router();

/* Ruta para cargar la vista de login */
authRouter.get('/login', (req, res) => {
    res.render('login');
});

/* Ruta para manejar el login */
authRouter.post('/login', async (req, res) => {
    try {
        /* Logica de autenticación */
        const { username, password } = req.body;

        /* Verificamos que el usuario existe y que el password es correcto */
        const user = await UserRepository.login({ username, password })

        /* Generamos un access_token */
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_JWT_KEY,
            {
                expiresIn: '1h'
            })

        res
            .cookie('access_token', token, {
                httpOnly: true,

                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60
            })
            .send({ user, token })
    } catch (error) {
        res.status(401).send(error.message)
    }
});

/* Ruta para manejar el registro */
authRouter.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Crear usuario
    const newUser = await UserRepository.create({ username, password });

    // Generar token como en login
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      SECRET_JWT_KEY,
      { expiresIn: '1h' }
    );

    // Guardamos cookie y respondemos
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      .send({ id: newUser._id, token });

  } catch (error) {
    res.status(400).send(error.message);
  }
});


authRouter.post('/logout',(req,res)=>{
    res
    .clearCookie('access_token')
    .json({message:'logout successfull'})
    .send('logout');
});
export default authRouter;