import express from 'express';
import mainRouter from './routes/main.routes.js';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import jwt from 'jsonwebtoken'
import authRouter from './routes/auth.routes.js';
import {PORT, SECRET_JWT_KEY} from './config.js'
import viewRouter from './routes/view.routes.js';



const app = express();

/* Configuramos el fichero public */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
/* Configuramos el middleware para parsear el body */
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

/* Nueva ruta /home */
app.get('/home', (req, res) => {
    const { user } = req.session;
    res.render('home', { user }); // Asegúrate de tener una vista 'home.ejs', o cambia esto por res.send('Bienvenido a Home') si no tienes la vista
});

/* Configuramos las rutas */
app.use('/api', mainRouter);
app.use('/', viewRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});