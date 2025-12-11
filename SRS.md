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

### 3.2 FR3. Responsive Web Interface (Issue #3) ✓

**Status**: Implemented (Closed - Sprint 2)

The system shall create adaptable layouts functioning across different device sizes.

### 3.3 FR4. Appliance Management (CRUD) (Issue #4) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall implement create, read, update, delete operations for appliance records.

### 3.4 FR5. Intuitive Form Layout (Issue #5) ✓

**Status**: Implemented (Closed - Sprint 1)

The system shall design user-friendly forms enhancing data entry experience.

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

### 3.7 FR15. Recurring Alerts (Issue #15) ✓

**Status**: Implemented (Closed - Sprint 2)

The system shall enable scheduling automated notifications at specified intervals.

### 3.8 FR16. User Dashboard (Issue #16) ✓

**Status**: Implemented (Closed - Sprint 2)

The system shall present personalized overview of user data and system status.

### 3.9 FR17. Alert Notifications (Issue #22) ✓

**Status**: Implemented (Closed)

The system shall deliver timely alerts to users regarding system events.

### 3.10 FR2. File Upload (Issue #2)

**Status**: Planned (Open)

The system shall enable users to upload files to the system for maintenance documentation.

### 3.11 FR7. Timeline View with Maintenance History (Issue #7)

**Status**: Planned (Open)

The system shall provide a chronological display of past maintenance activities and upcoming tasks.

### 3.12 FR9. Data Tables (Issue #9)

**Status**: Planned (Open)

The system shall implement structured data presentation enabling users to view and interact with organized information.

### 3.13 FR10. Appliance Filter (Issue #10)

**Status**: Planned (Open)

The system shall allow filtering of appliances to narrow down displayed results based on user criteria.

### 3.14 FR11. Alert Suggestions (Issue #11)

**Status**: Planned (Open)

The system shall offer intelligent recommendations for maintenance alerts based on appliance data and history.

### 3.15 FR12. Color Coding Status (Issue #12)

**Status**: Planned (Open)

The system shall use visual color indicators to represent different maintenance or appliance statuses.


### 3.16 FR13. Links (Issue #13)

**Status**: Planned (Open)

The system shall provide connectivity between related items, resources, or appliances within the system.

### 3.17 FR14. Reminder Setup (Issue #14)

**Status**: Planned (Open)

The system shall enable users to configure maintenance reminders for appliances or tasks.

---

## 4. Non-Functional Requirements

### 4.1 NR1. Scalability (Issue #17) ✓

**Status**: Addressed (Closed - Sprint 1)

The system shall have capacity to handle growing user and data demands.

### 4.2 NR2. Performance (Issue #18) ✓

**Status**: Addressed (Closed - Sprint 1)

The system shall ensure responsive operation and efficient processing speeds.

### 4.3 NR4. Reliability (Issue #20) ✓

**Status**: Addressed (Closed - Sprint 2)

The system shall maintain consistent, dependable operation.

### 4.4 NR3. Security (Issue #19)

**Status**: In Progress (Open)

The system shall address data protection, user authentication, and secure system operations.

### 4.5 NR5. Portability (Issue #21)

**Status**: In Progress (Open)

The system shall ensure the application functions across different platforms, devices, or environments.

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
