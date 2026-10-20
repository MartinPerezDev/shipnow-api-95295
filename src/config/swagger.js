import swaggerJSDoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shipnow API',
      version: '1.0.0',
      description: 'Documentación api de pedidos',
    },
    servers: [{ url: 'http://localhost:8080' }],
  },
  apis: ['./src/docs/swagger.yaml'],
});

export default swaggerSpec;
