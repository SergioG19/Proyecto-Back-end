# Proyecto-Back-end

El eso de esta aplicación en muy facil, como ya está todo instalado no es necesario colocar las dependencias, pero en caso de que necesites las dependencias para crear este proyecto desde cero primero se debe poner el la terminal: cd sitema-contable, para asi seleccionar la carpeta del sistema contable, ahora si se coloca las dependencias en el terminal, aqui van todas las dependencias usadas por orden:
npm install -g npm
mpm install express ejs nodemon --save
npm init -y
npm install mongoose
npm install bcrypt dotenv jsonwebtoken
npm install mongoose-migrate --save-dev
npm install express-generator

Con esas dependencias podran tanto conectar la aplicacion a la base de datos, hacer que se guarden los cambios automaticamente, verificación web token y entre muchas funciones mas que estará especificado en el informe. 

Luego debes conectar la base de datos en el archivo .env, para eso se debe completar todos los campos requeridos, por ejemplo:

DATABASE_URL=mongodb://127.0.0.1:27017/Nombre de la base
PORT= 7000
SECRET_KEY= clavesecreta

En la url de la base de datos se coloca el nombre de la base creada y en el port se coloca la el puerto del servidor, normalmente es 3000 pero para este ejemplo puse 7000, luego en la clave secreta se debe colocar cualquier clave inventada.

Una vez hecho eso, en la terminal se debe colocar el siguiente comando: node app.js, con dicho comando estarias haciendo un llamado al archivo app.js en cual se ubica el servidor local y la conexión a la base de datos.

Luego de ahi se puede hacer solicitudes http como GET,POST,PUT y DELETE mediante postman.
