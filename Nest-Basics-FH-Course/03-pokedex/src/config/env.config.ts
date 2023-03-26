
// en Nest se suele especificar un objeto con las env que quiero
export const EnvConfiguration = () => ({
  // variable que me dice el entorno
  environment : process.env.NODE_ENV === 'dev',
  // gU(a|i)w <- word to upper gu(a|i)w <- word to lower
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7,
})