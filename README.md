# Eric's Appliance Logbook 
 
A full-stack web application for tracking household appliances, warranties, and maintenance schedules. Our household appliance management system is colloquially named after our team mascot, Eric the Lizard. This application provides a stop place for reminders on all various household appliances and goods as the user will be alerted in the web app and via email when a warranty is set to expire, maintenance is required, etc. 

## Tech Stack

**Backend:**
- Spring Boot 3.3.4 (Java 17)
- SQLite database with JPA
- JWT authentication
- Spring Mail for notifications

**Frontend:**
- Next.js 16 with React 19
- TypeScript
- Tailwind CSS

## Features

- User authentication and profile management
- Track appliances with detailed information (brand, model, serial number, purchase date)
- Warranty expiration tracking
- Customizable maintenance alerts (one-time, recurring monthly/yearly, or custom intervals)
- Email notifications for upcoming maintenance
- Alert management (snooze, cancel, or keep active)

## Getting Started

Login into our website with the following link:
https://myappliancelogbook.com/ 

Login credentials for the test user: 
User email: dev@test.com
password: dev123

### Local Development
#### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

#### Frontend

```bash
cd frontend/user-app
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## Project Structure

```
project4-logbook/
├── backend/
│   └── src/main/java/com/example/demo/
│       ├── config/          # Security configuration
│       ├── controller/      # REST API endpoints
│       ├── model/           # Database entities
│       ├── repository/      # Data access
│       └── service/         # Business logic
└── frontend/
    └── user-app/
        ├── app/             # Next.js pages
        ├── components/      # React components
        ├── contexts/        # Context providers
        └── __tests__/       # Tests
```

## Testing

**Backend:**
```bash
cd backend
mvn test
```

**Frontend:**
```bash
cd frontend/user-app
npm test
```

## Notes

- Database file (`demo.db`) is automatically created in the backend directory on first run
