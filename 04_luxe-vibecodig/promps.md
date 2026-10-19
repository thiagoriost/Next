Necesito que crees un archivo llamado "best-practices.md" en la carpeta "antigravity".
Ese archivo contendra las buenas practicas que debes de buscar  en aplicaciones de Next,js que se dediquen a la venta de vienes raices, necesito bullet points, buenas practicas, recomendaciones e ideas.
/////////////////

Vamos a crear la base de datos es supabase, usa el MCP de supabase.
Crea las propiedades en base de datos y tambien necesito que en el homeScreen tengamos una paginacion de las propiedades
la logica de la paginacion se debe ejecutar del lado del servidor usando funciones de NextJS
/////////////////////////////
Vamos a hacer que la aplicacion sea multilingual, necesitamos que la aplicacion se pueda ejecutar en español e ingles.
se necesita que grabes una cookie para guardar el idioma seleccionado, con un tiempo de expiracion de 30 dias.
Cuando el usuario cambie el idioma, se debe guardar la cookie y recargar la pagina.
Se necesita que los textos del homeScreen se muestren en el idioma seleccionado, por ejemplo:
- El titulo de la pagina debe ser "Luxury Properties" en ingles y "Propiedades de lujo" en español.
- El subtitulo de la pagina debe ser "Your dream home is waiting" en ingles y "Tu casa de ensueño te está esperando" en español.
- Los botones deben ser "View All" en ingles y "Ver todas" en español.
- Los textos de los filtros deben ser "Location" en ingles y "Ubicación" en español, "Price" en ingles y "Precio" en español, etc.
- Los textos de los resultados de busqueda deben ser "Showing" en ingles y "Mostrando" en español.
- El texto de "No results found" debe ser "No results found" en ingles y "No se encontraron resultados" en español.

tambien necesito que crees un archivo llamado "i18n.ts" en la carpeta "lib" que contenga las funciones necesarias para manejar el idioma seleccionado y los textos en ingles y español.

En homeScreen tengamos un dropdown para seleccionar el idioma, que al cambiar de idioma se guarde la cookie y recargue la pagina.

tambien necesitamos que los textos de los resultados de busqueda se muestren en el idioma seleccionado, por ejemplo:
- El texto de "Showing" debe ser "Showing" en ingles y "Mostrando" en español.
- Crea los archivos de traducciones para poder agregar otros idiomas en el futuro. Por ahora solo ingles y español.
- Quiero que agregues en el footer los idiomas disponibles para cambiar el idioma, ingles y español.
- Quiero que agregues en el nav bar los idiomas disponibles para cambiar el idioma, ingles y español.

/////////////////////////////////////////////
Para ejecutar la migración sin exponer credenciales, desde PowerShell:
Set-Location E:\software\NEXT\04_luxe-vibecodig
npx supabase login
npx supabase link --project-ref <ID-del-proyecto>
npx supabase db push

//////////////////////////////////////////////////

Crea el diseño de registro para que luzca exactamente igual a @code.html, o guiate con la imagen adjunta
Coloca un boton con el avatar en el NavBar en caso de que el usuario este logueado, si no esta logueado, coloca un boton que diga "Login" para entrar a la pagina de login. Si esta logueado sobre el mismo boton debe mostrar la interfaz y logica para hacer el logout.
Implementa la autenticacion empleando los servicios de facebook, telefono y google sign in desde supabase auth.
Yo proveere las configuraciones de google, facebook y telefono.



/////////////////////////////////////////////////////
