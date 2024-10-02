# Order Service

## Description

The Order Service is responsible for managing orders, including creating new orders, updating order statuses, and retrieving order information. This service is built using NestJS and integrates with MongoDB for data persistence and Google Cloud Pub/Sub for event-driven communication.

## Features

- Create new orders
- Retrieve order details
- Update order status
- List all orders
- Filter orders by seller
- Delete orders
- Publish order events to Google Cloud Pub/Sub

## Technologies used

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB
- Google Cloud Platform account with Pub/Sub enabled
- Google Cloud SDK

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/order-service.git
   cd order-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLOUD_PROJECT_ID=your_gcp_project_id
   GOOGLE_CLOUD_KEY_FILE=path_to_your_gcp_key_file.json
   TOPIC_NAME=your_pubsub_topic_name
   ```

## Running the Application

To run the application in development mode:

```
npm run start:dev
```

The service will be available at `http://localhost:3000/orders`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /orders  | Create a new order |
| GET    | /orders  | List all orders (with optional filters) |
| GET    | /orders/:id | Retrieve a specific order |
| PATCH  | /orders/:id | Update an order's status |
| DELETE | /orders/:id | Cancel/delete an order |

For detailed API documentation, visit `/api-docs` when the service is running. (TODO)

## API Endpoints

- `POST /orders`: Create a new order
- `GET /orders`: List all orders
- `GET /orders/:id`: Get a specific order
- `PATCH /orders/:id`: Update an order
- `DELETE /orders/:id`: Delete an order

## Testing

To run the test suite:

```
npm run test
```

For test coverage:

```
npm run test:cov
```

## Project Structure

```
src/
├── common/
│   ├── constants.ts
│   ├── http-exception.filter.ts
│   └── pubsub/
│       └── pubsub.service.ts
├── order/
│   ├── dto/
│   │   ├── create-order.dto.ts
│   │   └── update-order.dto.ts
│   ├── order.controller.ts
│   ├── order.module.ts
│   ├── order.schema.ts
│   └── order.service.ts
├── app.module.ts
└── main.ts
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.