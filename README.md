# GraphQL Packages API

A NestJS GraphQL API for managing packages with user authentication, role-based access control, and advanced querying capabilities.

## Features

- GraphQL API with Apollo Server
- MongoDB integration with Mongoose
- JWT Authentication
- Role-based access control (Admin/User)
- Package management (CRUD operations)
- Advanced querying features:
  - Pagination
  - Search functionality
  - Date-based filtering
  - Price range filtering
  - Sorting options
- Rate limiting
- Error handling with custom filters
- Health checks

## Prerequisites

- Node.js (v14 or later)
- MongoDB instance
- yarn

## Installation

1. Clone the repository

```bash
git clone https://github.com/Barnyvic/packages-graphQl
cd packages-graphQl
```

2. Install dependencies

```bash
yarn install
```

3. Configure environment variables
Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h
```

4. Start the development server

```bash
yarn start:dev
```

The GraphQL playground will be available at `http://localhost:3000/graphql`

## API Usage

### Authentication

1. Register a new user:

```graphql
mutation {
  register(createUserInput: {
    username: "john_doe"
    email: "john@example.com"
    password: "password123"
    role: User
  }) {
    id
    username
    email
    role
  }
}
```

2. Login:

```graphql
mutation {
  login(loginUserInput: {
    email: "john@example.com"
    password: "password123"
  }) {
    access_token
    email
  }
}
```

### Package Operations

All package operations require authentication. Admin role is required for create, update, and delete operations.

1. Create Package (Admin only):

```graphql
mutation {
  createPackage(createPackageInput: {
    name: "Premium Package"
    description: "Premium features"
    price: 99.99
    expirationDate: "2024-12-31T23:59:59Z"
  }) {
    id
    name
    price
  }
}
```

2. Query Packages (with pagination):

```graphql
query {
  packages(skip: 0, take: 5) {
    items {
      id
      name
      description
      price
      expirationDate
    }
    total
    skip
    take
  }
}
```

3. Search Packages:

```graphql
query {
  searchPackages(searchTerm: "premium", fields: ["name", "description"]) {
    id
    name
    description
    price
  }
}
```

4. Query Packages by Expiration Date:

```graphql
query {
  packages(expirationDate: "2024-12-31") {
    items {
      id
      name
      expirationDate
    }
    total
    skip
    take
  }
}
```

5. Update Package (Admin only):

```graphql
mutation {
  updatePackage(updatePackageInput: {
    id: "package-id"
    name: "Updated Package Name"
    price: 149.99
  }) {
    id
    name
    price
  }
}
```

6. Delete Package (Admin only):

```graphql
mutation {
  deletePackage(id: "package-id") {
    id
    name
  }
}
```

## Authentication Headers

For protected routes, include the JWT token in the HTTP headers:

```json
{
  "Authorization": "Bearer your-jwt-token"
}
```

## Error Handling

The API includes a custom GraphQL exception filter that provides consistent error responses:

```json
{
  "errors": [
    {
      "message": "Error message",
      "extensions": {
        "code": "ERROR_CODE",
        "status": 400
      }
    }
  ]
}
```

## Available Scripts

```bash
# Development
yarn start:dev

# Production build
yarn build
yarn start:prod
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port number | 3000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | Secret key for JWT tokens | - |
| JWT_EXPIRES_IN | JWT token expiration time | 24h |

## Project Structure

```
src/
├── auth/           # Authentication related files
├── common/         # Shared utilities and filters
├── packages/       # Package module
├── users/          # User module
├── health/         # Health check endpoints
├── app.module.ts   # Main application module
└── main.ts         # Application entry point
```

## License

This project is [MIT licensed](LICENSE).
