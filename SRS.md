# Software Requirements Specification (SRS)
## Appliance Management System

**Version:** 1.0
**Date:** December 2024
**Course:** CSCI4830 - University of Nebraska Omaha

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Appliance Management System, a web-based application designed to help users track household appliances, manage warranties, and schedule maintenance alerts.

### 1.2 Scope
The Appliance Management System provides a centralized platform for:
- Tracking household appliances with detailed metadata
- Managing warranty information and expiration dates
- Setting up customizable maintenance reminders
- Receiving email notifications for upcoming maintenance tasks

### 1.3 Definitions and Acronyms
- **API**: Application Programming Interface
- **JWT**: JSON Web Token
- **JPA**: Java Persistence API
- **SPA**: Single Page Application
- **CRUD**: Create, Read, Update, Delete

---

## 2. Overall Description

### 2.1 Product Perspective
The Appliance Management System is a standalone full-stack web application consisting of:
- RESTful backend API built with Spring Boot
- Responsive frontend built with Next.js and React
- SQLite database for data persistence

### 2.2 Product Functions
- **User Management**: Registration, login, profile management
- **Appliance Tracking**: Add, view, edit, and delete appliance records
- **Warranty Management**: Track purchase dates and warranty periods
- **Alert System**: Configure maintenance alerts with various recurrence patterns
- **Notification System**: Email notifications for upcoming maintenance

### 2.3 User Characteristics
- **Primary Users**: Homeowners and renters managing household appliances
- **Technical Expertise**: Basic computer and web browser skills required
- **Usage Environment**: Desktop and mobile web browsers

### 2.4 Constraints
- Requires internet connection
- Email notifications require SMTP configuration
- Browser must support modern JavaScript (ES6+)

---

## 3. Functional Requirements

### 3.1 FR1. User Account Management (Issue #1) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall enable user registration, login, and account management capabilities.

**FR-1.1**: The system shall allow users to register with email and password
**FR-1.2**: The system shall authenticate users using JWT tokens
**FR-1.3**: The system shall maintain user sessions securely
**FR-1.4**: The system shall allow users to update their profile information
**FR-1.5**: The system shall allow users to change their password

### 3.2 FR3. Responsive Web Interface (Issue #3) ✓

**Status**: Implemented (Closed - Sprint 2)

The system shall create adaptable layouts functioning across different device sizes.

**FR-3.1**: The user interface shall be responsive and adapt to different screen sizes
**FR-3.2**: The application shall function on mobile, tablet, and desktop devices
**FR-3.3**: Layout components shall reflow appropriately for different viewports

### 3.3 FR4. Appliance Management (CRUD) (Issue #4) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall implement create, read, update, delete operations for appliance records.

**FR-4.1**: Users shall be able to create new appliance records
**FR-4.2**: Users shall be able to view all their appliances
**FR-4.3**: Users shall be able to update appliance information
**FR-4.4**: Users shall be able to delete appliance records
**FR-4.5**: Users shall only access their own appliance data

### 3.4 FR5. Intuitive Form Layout (Issue #5) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall design user-friendly forms enhancing data entry experience.

**FR-5.1**: Forms shall be logically organized with clear labels
**FR-5.2**: Required fields shall be clearly indicated
**FR-5.3**: Form validation shall provide immediate feedback

### 3.5 FR6. Appliance Information Input Fields (Issue #6) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall provide structured fields for capturing appliance details.

Each appliance record shall contain:
- Name (required)
- Description (optional)
- Category (optional)
- Brand (optional)
- Model (optional)
- Serial number (optional)
- Purchase date (optional)
- Warranty period in months (optional)
- Condition notes (optional)

### 3.6 FR8. Centralized and Secure Storage using SQLite (Issue #8) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall establish protected database infrastructure for information management.

**FR-8.1**: All data shall be stored in a centralized SQLite database
**FR-8.2**: Database schema shall be managed through JPA/Hibernate
**FR-8.3**: Data integrity constraints shall be enforced at the database level

### 3.7 FR15. Recurring Alerts (Issue #15) ✓

**Status**: Implemented (Closed - Sprint 2)

The system shall enable scheduling automated notifications at specified intervals.

**FR-15.1**: Users shall be able to set maintenance alert dates for appliances
**FR-15.2**: The system shall support the following alert recurrence patterns:
- One-time (NONE)
- Monthly
- Yearly
- Custom interval (specified in days)

**FR-15.3**: Users shall be able to manage alert status:
- ACTIVE: Alert is active
- SNOOZED: Alert temporarily disabled until specified date
- CANCELLED: Alert permanently disabled

**FR-15.4**: Users shall be able to snooze alerts until a future date
**FR-15.5**: Users shall be able to cancel alerts

### 3.8 FR16. User Dashboard (Issue #16) ✓

**Status**: Implemented (Closed - Sprint 2)

The system shall present personalized overview of user data and system status.

**FR-16.1**: Dashboard shall display summary of user's appliances
**FR-16.2**: Dashboard shall show upcoming maintenance alerts
**FR-16.3**: Dashboard shall provide quick access to common actions

### 3.9 FR17. Alert Notifications (Issue #22) ✓

**Status**: Implemented (Closed)

The system shall deliver timely alerts to users regarding system events.

**FR-17.1**: The system shall send email notifications for upcoming maintenance alerts
**FR-17.2**: The system shall check for upcoming alerts on a scheduled basis
**FR-17.3**: Email notifications shall include appliance details and alert information

### 3.10 FR2. File Upload (Issue #2)

**Status**: Planned (Open)

The system shall enable users to upload files to the system for maintenance documentation.

**FR-2.1**: Users shall be able to attach files to appliance records
**FR-2.2**: Supported file types shall include common document and image formats
**FR-2.3**: Files shall be securely stored and associated with the correct appliance

### 3.11 FR7. Timeline View with Maintenance History (Issue #7)

**Status**: Planned (Open)

The system shall provide a chronological display of past maintenance activities and upcoming tasks.

**FR-7.1**: Users shall be able to view maintenance history in timeline format
**FR-7.2**: The timeline shall display both completed and scheduled maintenance
**FR-7.3**: Users shall be able to filter timeline by appliance or date range

### 3.12 FR9. Data Tables (Issue #9)

**Status**: Planned (Open)

The system shall implement structured data presentation enabling users to view and interact with organized information.

**FR-9.1**: Appliances shall be displayed in sortable, searchable tables
**FR-9.2**: Tables shall support pagination for large datasets
**FR-9.3**: Users shall be able to customize visible columns

### 3.13 FR10. Appliance Filter (Issue #10)

**Status**: Planned (Open)

The system shall allow filtering of appliances to narrow down displayed results based on user criteria.

**FR-10.1**: Users shall be able to filter by category, brand, status, or warranty status
**FR-10.2**: Multiple filters shall be combinable
**FR-10.3**: Filter selections shall persist during the session

### 3.14 FR11. Alert Suggestions (Issue #11)

**Status**: Planned (Open)

The system shall offer intelligent recommendations for maintenance alerts based on appliance data and history.

**FR-11.1**: The system shall analyze appliance type and usage patterns
**FR-11.2**: Suggested maintenance intervals shall be provided to users
**FR-11.3**: Users shall be able to accept or modify suggested alerts

### 3.15 FR12. Color Coding Status (Issue #12)

**Status**: Planned (Open)

The system shall use visual color indicators to represent different maintenance or appliance statuses.

**FR-12.1**: Active alerts shall be color-coded (e.g., red for overdue, yellow for upcoming, green for completed)
**FR-12.2**: Warranty status shall be visually indicated
**FR-12.3**: Color scheme shall be consistent throughout the application

### 3.16 FR13. Links (Issue #13)

**Status**: Planned (Open)

The system shall provide connectivity between related items, resources, or appliances within the system.

**FR-13.1**: Users shall be able to link related appliances
**FR-13.2**: External resource URLs shall be supported (manuals, warranty information)
**FR-13.3**: Navigation between related items shall be intuitive

### 3.17 FR14. Reminder Setup (Issue #14)

**Status**: Planned (Open)

The system shall enable users to configure maintenance reminders for appliances or tasks.

**FR-14.1**: Users shall be able to create custom reminders
**FR-14.2**: Reminder configuration shall include date, time, and recurrence options
**FR-14.3**: Users shall be able to edit or delete existing reminders

---

## 4. Non-Functional Requirements

### 4.1 NR1. Scalability (Issue #17) ✓

**Status**: Addressed (Closed - Sprint 1)

The system shall have capacity to handle growing user and data demands.

**NFR-1.1**: The system architecture shall support horizontal scaling
**NFR-1.2**: The database design shall accommodate growing data volumes
**NFR-1.3**: The system shall support at least 100 concurrent users
**NFR-1.4**: Response times shall remain consistent as data volume increases

### 4.2 NR2. Performance (Issue #18) ✓

**Status**: Addressed (Closed - Sprint 1)

The system shall ensure responsive operation and efficient processing speeds.

**NFR-2.1**: API responses shall complete within 2 seconds under normal load
**NFR-2.2**: Page load times shall not exceed 3 seconds
**NFR-2.3**: Database queries shall be optimized with appropriate indexing
**NFR-2.4**: File uploads shall provide progress indicators
**NFR-2.5**: Data tables shall load efficiently with pagination

### 4.3 NR4. Reliability (Issue #20) ✓

**Status**: Addressed (Closed - Sprint 2)

The system shall maintain consistent, dependable operation.

**NFR-4.1**: The system shall have 95% uptime during development
**NFR-4.2**: Data shall be persisted reliably to the database
**NFR-4.3**: The system shall handle errors gracefully without data loss
**NFR-4.4**: Scheduled alerts shall execute reliably at specified times
**NFR-4.5**: File uploads shall support retry mechanisms

### 4.4 NR3. Security (Issue #19)

**Status**: In Progress (Open)

The system shall address data protection, user authentication, and secure system operations.

**NFR-3.1**: User passwords shall be encrypted using industry-standard algorithms (bcrypt)
**NFR-3.2**: API endpoints shall be protected with JWT authentication
**NFR-3.3**: The system shall prevent SQL injection attacks through parameterized queries
**NFR-3.4**: The system shall implement CORS policies to prevent unauthorized access
**NFR-3.5**: Uploaded files shall be scanned and validated for security
**NFR-3.6**: User sessions shall expire after 24 hours or period of inactivity
**NFR-3.7**: Sensitive data shall not be exposed in error messages or logs
**NFR-3.8**: The system shall protect against XSS and CSRF attacks

### 4.5 NR5. Portability (Issue #21)

**Status**: In Progress (Open)

The system shall ensure the application functions across different platforms, devices, or environments.

**NFR-5.1**: The application shall function on Windows, macOS, and Linux operating systems
**NFR-5.2**: The user interface shall be responsive and mobile-friendly
**NFR-5.3**: The application shall work on modern web browsers (Chrome, Firefox, Safari, Edge - latest versions)
**NFR-5.4**: The database (SQLite) shall be easily portable between environments
**NFR-5.5**: The application shall support different screen sizes and resolutions (minimum 320px width)
**NFR-5.6**: The system shall not have platform-specific dependencies

---

## 5. System Features

### 5.1 Dashboard
**Description**: Central view showing user's appliances and upcoming alerts
**Priority**: High
**Functional Requirements**: FR-2.3, FR-3.1

### 5.2 Appliance Detail View
**Description**: Detailed view and editing interface for individual appliances
**Priority**: High
**Functional Requirements**: FR-2.2, FR-2.4

### 5.3 Alert Scheduling
**Description**: Interface for configuring maintenance alerts
**Priority**: Medium
**Functional Requirements**: FR-3.1, FR-3.2, FR-3.3

### 5.4 User Profile
**Description**: User account management and settings
**Priority**: Medium
**Functional Requirements**: FR-1.4, FR-1.5

---

## 6. External Interface Requirements

### 6.1 User Interfaces
- Web-based responsive interface
- Compatible with Chrome, Firefox, Safari, Edge (latest versions)
- Minimum resolution: 320px width (mobile)

### 6.2 Hardware Interfaces
- No specific hardware requirements beyond standard computer/mobile device

### 6.3 Software Interfaces
- **Database**: SQLite 3.x
- **Email Server**: SMTP-compatible mail server
- **Web Server**: Embedded Tomcat (via Spring Boot)

### 6.4 Communication Interfaces
- **Protocol**: HTTPS recommended for production
- **Data Format**: JSON for API requests/responses
- **Authentication**: Bearer token (JWT) in HTTP headers

---

## 7. Other Requirements

### 7.1 Database Requirements
- SQLite database file created automatically on first run
- Database schema managed by JPA/Hibernate
- Support for standard SQL queries

### 7.2 Legal Requirements
- Compliance with educational use policies
- User data privacy maintained

---

## 8. Appendices

### 8.1 API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

#### Appliance Management
- `GET /api/appliances` - List all user appliances
- `POST /api/appliances` - Create new appliance
- `GET /api/appliances/{id}` - Get appliance details
- `PUT /api/appliances/{id}` - Update appliance
- `DELETE /api/appliances/{id}` - Delete appliance

#### Alert Management
- Alert endpoints integrated with appliance management
- Alert status updates via appliance PUT requests

### 8.2 Technology Stack
- **Backend**: Spring Boot 3.3.4, Java 17
- **Frontend**: Next.js 16, React 19, TypeScript
- **Database**: SQLite with Hibernate
- **Authentication**: JWT (jjwt 0.11.5)
- **Email**: Spring Mail
- **Build Tools**: Maven (backend), npm (frontend)
