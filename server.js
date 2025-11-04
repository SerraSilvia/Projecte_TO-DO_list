import express from 'express';
import mainRouter from './routes/main.routes.js';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import jwt from 'jsonwebtoken'

import {PORT, SECRET_JWT_KEY} from './config.js'
import viewRouter from './routes/view.routes.js';

const app = express();

/* Configuramos el fichero public */
app.use(express.static('public'));

/* Configuramos el middleware para parsear el body */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser())

/* Configuramos el motor de plantillas */
app.set('view engine', 'ejs');
app.set('views', './views');

/* Iniciamos el middleware */
app.use((req,res,next)=>{
    const token =req.cookies.access_token
    req.session={user: null}
    try{
        const data=jwt.verify(token,SECRET_JWT_KEY)
        req.session.user=data
    }catch(error){
        req.session.user=null
    }
    next() 
})

/* Ruta principal */
app.get('/', (req, res) => {
    const {user} = req.session
    res.render('login', {user});
});

/* Configuramos las rutas */
app.use('/api', mainRouter);
app.use('/', viewRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});