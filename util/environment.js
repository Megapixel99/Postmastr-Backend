require('dotenv').config({
  path: '.env',
});

const env = {
  databaseConnect: process.env.DATABASE_CONNECT,
  sessionSecret: process.env.SESSION_SECRET,
  jwtToken: process.env.JWT_SECRET,
  appPass: process.env.APP_PASS,
  httpOnly: (process.env.HTTP_ONLY.toLowerCase() === 't' || process.env.HTTP_ONLY.toLowerCase() === 'true'),
  compressionUsername: process.env.COMPRESSION_USERNAME,
  ocrApiKey: process.env.OCR_API_KEY,
};

for (const key in env) {
  if (env[key] === null || env[key] === undefined || env[key] === '') {
    throw new Error(`Environment variable: ${key.replace(/(.)([A-Z])/gm, '$1_$2').toUpperCase()} was not defined\nProgram exited with code: 1`);
  }
}

module.exports = env;
