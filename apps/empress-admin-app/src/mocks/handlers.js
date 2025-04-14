// apps/empress-admin-app/src/mocks/handlers.js
import { http, HttpResponse } from "msw";
import backendUrl from "../utils/backendUrl";

export const handlers = [
  // Handle products API
  http.get(`${backendUrl}/api/admin/products`, () => {
    return HttpResponse.json({
      status: 200,
      message: "Products retrieved successfully",
      data: [
        {
          _id: "1",
          name: "Silver Elegance Bracelet",
          price: 99.99,
          stock: 10,
          itemsSold: 5,
          revenue: 499.95,
          description: "A beautiful silver bracelet",
          summary: "Elegant silver bracelet",
          materials: ["Silver", "Crystal"],
          isVisible: true,
          ratings: [
            { user: "User1", rating: 5, comment: "Love it!" },
            { user: "User2", rating: 4, comment: "Very nice" },
          ],
          imagesUrl: [
            {
              optimizeUrl: "/images/bracelet1.jpg",
              autoCropUrl: "/images/bracelet1-crop.jpg",
              publicId: "bracelet1",
            },
          ],
        },
        {
          _id: "2",
          name: "Gold Aura Bracelet",
          price: 149.99,
          stock: 5,
          itemsSold: 3,
          revenue: 449.97,
          description: "A luxurious gold bracelet",
          summary: "Luxurious gold bracelet",
          materials: ["Gold", "Gemstone"],
          isVisible: true,
          ratings: [{ user: "User3", rating: 5, comment: "Beautiful!" }],
          imagesUrl: [
            {
              optimizeUrl: "/images/bracelet2.jpg",
              autoCropUrl: "/images/bracelet2-crop.jpg",
              publicId: "bracelet2",
            },
          ],
        },
      ],
    });
  }),

  // Handle single product API
  http.get(`${backendUrl}/api/admin/product/:productId`, ({ params }) => {
    const { productId } = params;

    const products = {
      1: {
        _id: "1",
        name: "Silver Elegance Bracelet",
        price: 99.99,
        stock: 10,
        // ... other fields
      },
      2: {
        _id: "2",
        name: "Gold Aura Bracelet",
        price: 149.99,
        stock: 5,
        // ... other fields
      },
    };

    if (products[productId]) {
      return HttpResponse.json({
        status: 200,
        message: "Product retrieved successfully",
        data: products[productId],
      });
    }

    return new HttpResponse(
      JSON.stringify({
        status: 404,
        message: "Product not found",
        data: null,
      }),
      { status: 404 },
    );
  }),

  // Handle create product API
  http.post(`${backendUrl}/api/admin/product/new`, async ({ request }) => {
    const productData = await request.json();

    return HttpResponse.json(
      {
        status: 201,
        message: "Product added successfully",
        data: {
          _id: "3",
          ...productData,
          itemsSold: 0,
          revenue: 0,
          ratings: [],
          imagesUrl: [],
        },
      },
      { status: 201 },
    );
  }),

  // Handle update product API
  http.put(
    `${backendUrl}/api/admin/product/update/:productId`,
    async ({ request, params }) => {
      const { productId } = params;
      const productData = await request.json();

      return HttpResponse.json({
        status: 200,
        message: "Product updated successfully",
        data: {
          _id: productId,
          ...productData,
        },
      });
    },
  ),

  // Handle delete product API
  http.delete(`${backendUrl}/api/admin/product/delete/:productId`, () => {
    return HttpResponse.json({
      status: 200,
      message: "Product deleted successfully",
      data: null,
    });
  }),

  // Handle authentication API
  http.post(`${backendUrl}/api/auth/login/admin`, async ({ request }) => {
    const { email, password } = await request.json();

    if (email === "admin@example.com" && password === "password123") {
      return HttpResponse.json({
        status: 200,
        message: "Login successful",
        data: {
          token: "Bearer mock-token",
          user: {
            email: "admin@example.com",
          },
        },
      });
    }

    return new HttpResponse(
      JSON.stringify({
        status: 400,
        message: "Invalid email or password",
        data: null,
      }),
      { status: 400 },
    );
  }),

  // Adding more API handlers as needed...
];
