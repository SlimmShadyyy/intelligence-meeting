const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hintro Meeting API',
            version: '1.0.0',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: [],
        }],
        servers: [
            { url: 'https://intelligence-meeting.onrender.com', description: 'Production server' },
            { url: 'http://localhost:3000', description: 'Local server' },
        ],
    },
    // This tells swagger to look for JSDoc comments in your routes
    apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };