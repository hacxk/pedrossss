# 📢 Facebook Marketing API Documentation

Welcome to the **Facebook Marketing API**! This documentation provides details about the endpoints available in our Facebook Marketing service. The API is built using NestJS and TypeScript, providing a robust and scalable architecture.

![Facebook Marketing](https://media.giphy.com/media/3og0IPuJAHrlSOnnVu/giphy.gif)

## 📚 Table of Contents

1. [📄 Overview](#-overview)
2. [🔌 Endpoints](#-endpoints)
    - [📬 Get Campaigns by Message](#-get-campaigns-by-message)
    - [🔐 Facebook Authentication](#-facebook-authentication)
        - [🔑 Login with Facebook](#-login-with-facebook)
        - [🔄 Facebook Redirect](#-facebook-redirect)
    - [🔒 Authentication](#-authentication)
        - [📝 Register User](#-register-user)
        - [🔓 Login User](#-login-user)
        - [🧪 Test Endpoint](#-test-endpoint)
3. [🔒 Protected Routes](#-protected-routes)

## 📄 Overview

The **Facebook Marketing API** allows users to interact with Facebook campaigns and authenticate using Facebook. The endpoints are protected using JWT authentication to ensure secure access.

![Secure](https://media.giphy.com/media/xTiTnJ3BooiDs8dL7W/giphy.gif)

## 🔌 Endpoints

### 📬 Get Campaigns by Message

**Endpoint:** `GET /facebook-marketing/campaigns/by-message`

**Description:** Retrieves Facebook campaigns based on the provided message text.

**Authentication:** JWT

**Parameters:**
- `accessToken` (query string): The access token for Facebook API.
- `message` (query string): The message text to filter campaigns.

**Response:**
- `200 OK`: Returns a list of campaigns matching the message text.

**Example:**
```http
GET /facebook-marketing/campaigns/by-message?accessToken=YOUR_ACCESS_TOKEN&message=Hello
Authorization: Bearer YOUR_JWT_TOKEN
```

![Campaigns](https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif)

### 🔐 Facebook Authentication

#### 🔑 Login with Facebook

**Endpoint:** `GET /auth/facebook`

**Description:** Initiates the Facebook login process. This endpoint redirects the user to Facebook for authentication.

**Authentication:** JWT and Facebook OAuth

**Example:**
```http
GET /auth/facebook
Authorization: Bearer YOUR_JWT_TOKEN
```

![Login](https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif)

#### 🔄 Facebook Redirect

**Endpoint:** `GET /auth/facebook/redirect`

**Description:** Handles the redirect from Facebook after authentication.

**Authentication:** Facebook OAuth

**Response:**
- `200 OK`: Returns a success message indicating successful Facebook login.

**Example:**
```http
GET /auth/facebook/redirect
```

![Redirect](https://media.giphy.com/media/l0HUqsz2jdQYElRm0/giphy.gif)

### 🔒 Authentication

#### 📝 Register User

**Endpoint:** `POST /auth/register`

**Description:** Registers a new user.

**Parameters:**
- `RegisterDto` (body): The registration details.

**Response:**
- `201 Created`: Returns the registered user's details.

**Example:**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

![Register](https://media.giphy.com/media/3o7aD6NnsBm5zyexsI/giphy.gif)

#### 🔓 Login User

**Endpoint:** `POST /auth/login`

**Description:** Logs in an existing user.

**Parameters:**
- `LoginDto` (body): The login details.

**Response:**
- `200 OK`: Returns the JWT token and user details.

**Example:**
```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

![Login](https://media.giphy.com/media/3og0IFrHkIglEOg8Ba/giphy.gif)

#### 🧪 Test Endpoint

**Endpoint:** `GET /auth/test`

**Description:** Retrieves all Facebook information stored in the database.

**Response:**
- `200 OK`: Returns the list of Facebook information.

**Example:**
```http
GET /auth/test
```

![Test](https://media.giphy.com/media/l3q2JCu9MlYkkzJ2g/giphy.gif)

## 🔒 Protected Routes

Certain routes in this API are protected and require JWT authentication. The `JwtAuthGuard` is used to secure these endpoints, ensuring that only authenticated users can access them.

To access a protected route, include the `Authorization` header with your JWT token in the request. For example:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

By following this documentation, you can effectively interact with the **Facebook Marketing API**, manage user authentication, and securely access protected resources. Happy coding! 🎉

![Happy Coding](https://media.giphy.com/media/l3q2IpD13V59TnHKQ/giphy.gif)
