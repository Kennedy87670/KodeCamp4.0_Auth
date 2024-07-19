const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API for user authentication and management",
    },
    servers: [
      {
        url: "https://kodecamp4-0-auth.onrender.com/",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
