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
      CreateBannerRequest: {
        title: "Banner 3 - Title",
        image:
          "https://res.cloudinary.com/djxvhhj4i/image/upload/v1748579034/n13vhahqcevspnaruss3.jpg",
        isShow: false,
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
          region: 3273,
          coordinates: [0, 0],
          address: "",
        },
      },
      CreateTicketsRequest: {
        price: 1500,
        name: "Ticket Reguler",
        event: "events_id",
        description: "Ticket Reguler - Description",
        quantity: 100,
      },
      CreateMediaRequest: {
        fileUrl: "",
      },
      CreateOrderRequest: {
        events: "",
        ticket: "",
        quantity: 1,
      },
    },
  },
};
const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
