const bcrypt = require("bcryptjs");

bcrypt.hash("KMCadmin", 10).then(console.log);