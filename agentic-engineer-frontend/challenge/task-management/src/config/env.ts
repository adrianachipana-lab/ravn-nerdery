/*
  ENVIRONMENT VARIABLES
  ======================
  ¿Por que un archivo de config?
  En vez de usar import.meta.env.VITE_API_URL directamente en 20 archivos,
  lo centralizamos aqui. Si la variable cambia de nombre o necesitas un
  fallback, lo cambias en UN solo lugar.

  ¿Que es import.meta.env?
  Vite expone las variables de entorno que empiezan con VITE_ a traves
  de import.meta.env. Las que NO empiezan con VITE_ se ignoran por seguridad
  (asi no expones secrets del servidor al browser).
*/

export const config = {
  apiUrl: import.meta.env.VITE_API_URL as string || 'https://syn-api-prod.herokuapp.com/graphql',
  apiToken: import.meta.env.VITE_API_TOKEN as string || '',
} as const;
