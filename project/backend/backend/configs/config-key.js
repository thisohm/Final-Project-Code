const fs = require("fs");
const path = require("path");

const privateKeyFilePath =
  process.env.JWT_SSO_PRIVATE_KEY_FILE ||
  path.resolve(__dirname, "./key/private.key");

const privateCert = fs.readFileSync(privateKeyFilePath);

const jwtValidatityKey = "ai9-sso-server";

module.exports = Object.assign({}, { privateCert, jwtValidatityKey });
