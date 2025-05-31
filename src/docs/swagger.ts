import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v.0.0.1",
    title: "Acara",
    description: "Acara API documentation",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local server",
    },
    {
      url: "https://backend-acara-ecru.vercel.app/api",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "",
        password: "",
      },
      RegisterRequest: {
        fullname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      ActivationRequest: {
        code: "",
      },
      CreateCategoryRequest: {
        name: "",
        description: "Mongodb ",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        startDate: "yyyy-MM-dd HH:mm:ss",
        endDate: "yyyy-MM-dd HH:mm:ss",
        description: "",
        banner: "",
        isFeatured: false,
        isOnline: false,
        isPublish: false,
        category: "",
        createdBy: "",
        location: {
          region: "region id",
          coordinates: [0, 0],
          address: "",
        },
      },
      CreateTicketsRequest: {
        price: 1500,
        name: "Ticket Reguler",
        event : "events_id",
        description: "Ticket Reguler - Description",
        quantity: 100,
      },
      CreateMediaRequest: {
        fileUrl: "",
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
