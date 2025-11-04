# Projecte_TO-DO_list
# Pastisseria_LaDolça

## Preparació de l'entorn de desenvolupament

Comandes a seguir:

```bash
npm init -y
npm i
npm i express
npm i ejs
npm i nodemon -D    # permet `npm run dev`
npm i body-parser
npm i db-local
npm i jsonwebtoken
npm i cookie-parser
npm i crypto
npm i bcryptjs
```

Iniciar el servidor:

```bash
npm run dev          # si tenim "dev" a package.json
# o
node server.js       # si volem executar directament l'arxiu server.js
```

Afegir a `package.json`:

```json
"scripts": {
  "dev": "nodemon index.js",
  "start": "node server.js"
},
"main": "index.js",
"type": "module"
```
---

## 1. mainRouter:

- **Funció:** Serveix com a router principal i delega les rutes a `authRouter` i `productsRouter`.
- **Rutes:**  
  - `/auth` → gestionat per `authRouter`
  - `/products` → gestionat per `productsRouter`

---

## 2. authRouter

Gestiona l'autenticació i la gestió d'usuaris.

### Rutes

| Mètode | Ruta        | Descripció                                                                |
|--------|------------|----------------------------------------------------------------------------|
| GET    | `/login`   | Carrega la vista de login.                                                 |
| POST   | `/login`   | Autentica l'usuari, genera un JWT i el guarda en una cookie `access_token`.|
| POST   | `/register`| Registra un nou usuari.                                                    |
| POST   | `/logout`  | Esborra la cookie `access_token` i tanca sessió.                           |

- Es fa servir **JWT** per a l'autenticació.
- Les cookies són `httpOnly` i segures en producció.

---

## 3. productsRouter

Gestiona les operacions CRUD sobre productes (`galetes`, `pastissos`, `torrons`) llegint i escrivint en `db/db.json`.

### Galetes (`/galeta`)

| Mètode | Ruta          | Descripció                  |
|--------|---------------|-----------------------------|
| POST   | `/galeta`     | Crea una nova galeta        |
| PUT    | `/galeta/:id` | Modifica una galeta existent|
| DELETE | `/galeta/:id` | Esborra una galeta          |

### Pastissos (`/pastis`)

| Mètode | Ruta          | Descripció                  |
|--------|---------------|-----------------------------|
| POST   | `/pastis`     | Crea un nou pastís          |
| PUT    | `/pastis/:id` | Modifica un pastís existent |
| DELETE | `/pastis/:id` | Esborra un pastís           |

### Torrons (`/torro`)

| Mètode | Ruta          | Descripció                  |
|--------|---------------|-----------------------------|
| POST   | `/torro`      | Crea un nou torró           |
| PUT    | `/torro/:id`  | Modifica un torró existent  |
| DELETE | `/torro/:id`  | Esborra un torró            |

---

## 4. viewRouter

Gestiona les rutes de **vistes HTML** i mostra dades segons l'usuari autenticat (`req.session.user`).

### Galetes

| Mètode | Ruta            | Descripció                         |
|--------|----------------|-------------------------------------|
| GET    | `/galetes`     | Mostra totes les galetes            |
| GET    | `/galeta/:id`  | Mostra el detall d'una galeta       |
| GET    | `/nova-galeta` | Mostra el formulari per crear galeta|

### Pastissos

| Mètode | Ruta            | Descripció                          |
|--------|-----------------|-------------------------------------|
| GET    | `/pastissos`    | Mostra tots els pastissos           |
| GET    | `/pastis/:id`   | Mostra el detall d'un pastís        |
| GET    | `/nou-pastis`   | Mostra el formulari per crear pastís|

### Torrons

| Mètode | Ruta           | Descripció                         |
|--------|---------------|-------------------------------------|
| GET    | `/torrons`    | Mostra tots els torrons             |
| GET    | `/torro/:id`  | Mostra el detall d'un torró         |
| GET    | `/nou-torro`  | Mostra el formulari per crear torró |

- Les rutes estan protegides: si `user` no està a la sessió, retorna **403 Accés no autoritzat**.
- Les dades es llegeixen de `db/db.json`.

---

## Resum

- `mainRouter` → punt central per a l’API  
- `authRouter` → login, registre, logout amb JWT  
- `productsRouter` → CRUD per galetes, pastissos, torrons  
- `viewRouter` → vistes HTML protegides per sessió

## Tecnologies i eines

- **Express** → framework per crear servidors web.
- **EJS** → motor de plantilles per renderitzar HTML dinàmic.
- **body-parser / express.json()** → per llegir dades que arriben en el body d'una petició (ex: formularis).
- **Nodemon** → reinicia automàticament el servidor quan canvies codi.
- **jsonwebtoken, cookie-parser, db-local** → per gestionar login amb tokens, cookies i base de dades local.

---

## Exemple de funcionament

- `index.js` monta un servidor Express.
- Quan entres a `/`, renderitza la vista `login.ejs`.
- Hi ha rutes per a registrar usuaris (`/register`) o fer login.
- Els formularis del navegador envien dades al servidor amb `fetch`.

© 2025 Silvia Serra