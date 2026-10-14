# AI Job Recommendation System

A full-stack web application that recommends relevant job opportunities based on a user's skills, experience, education, and location.

The application uses a React frontend, a Spring Boot REST API, and a MySQL database. It includes user registration and login, profile management, skill selection, job management, and personalized job recommendations using a weighted matching algorithm.

## Features

- **User authentication:** Register and log in using email and password.
- **JWT-based security:** Authenticate requests using JSON Web Tokens.
- **User profile management:** Store location, education, experience, phone number, and professional bio.
- **Skill management:** Maintain available skills and associate skills with users.
- **Job management:** Create, view, update, and delete job listings.
- **Job-skill mapping:** Associate required skills with job listings.
- **Personalized recommendations:** Calculate job-match percentages based on skills, experience, education, and location.
- **Skill gap identification:** Display matching skills and missing required skills for recommended jobs.
- **Input validation:** Validate request fields using Jakarta Validation.
- **Centralized error handling:** Return structured JSON error responses.
- **Role-based access control:** Restrict skill creation, updating, and deletion to administrators.

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS
- Fetch API

### Backend
- Java 17
- Spring Boot 4.1.1
- Spring Web MVC
- Spring Data JPA
- Spring Security
- JWT using JJWT 0.12.6
- Jakarta Validation
- Maven

### Database
- MySQL

## Application Architecture

The application follows a layered backend architecture.

1. **React frontend:** Provides the user interface and communicates with the backend using HTTP requests.
2. **REST controllers:** Expose endpoints for users, profiles, skills, jobs, and recommendations.
3. **Service layer:** Implements business logic, authentication, authorization checks, and recommendation scoring.
4. **Repository layer:** Uses Spring Data JPA to access database records.
5. **Entity layer:** Represents users, profiles, skills, jobs, and their relationships.
6. **MySQL database:** Persists application data.

## Recommendation Algorithm

The recommendation service uses a rule-based weighted scoring algorithm to calculate how closely a job matches a user's profile.

| Matching factor | Weight |
|---|---:|
| Skills | 60% |
| Experience | 15% |
| Education | 15% |
| Location | 10% |
| **Total** | **100%** |

The overall score is calculated as:

`Match Percentage = (Skill Score × 0.60) + (Experience Score × 0.15) + (Education Score × 0.15) + (Location Score × 0.10)`

Each non-skill factor contributes either 100 or 0 based on whether it matches. The skill score is calculated from the proportion of required job skills matched by the user's skills. Jobs without required skills receive a skill score of zero.

The recommendation response includes:
- Job title, company, and location
- Number of matched skills and total required skills
- Names of matching skills
- Names of missing skills
- Skill-match percentage
- Experience, education, and location match indicators
- Overall match percentage

Recommendations are sorted by overall match percentage in descending order.

**Note:** This implementation uses rule-based scoring; it does not currently train or run a machine-learning model in the recommendation service.

## Database Design

The main entities and their relationships are:

- **User:** Stores user identity, email, password hash, and role.
- **UserProfile:** Stores profile information and has a one-to-one relationship with a user.
- **Skill:** Stores available skills with unique skill names.
- **UserSkill:** Associates users with their skills.
- **Job:** Stores job details, requirements, and descriptions.
- **JobSkill:** Associates jobs with their required skills.

The `UserSkill` and `JobSkill` tables use unique constraints to prevent duplicate associations between the same user or job and a skill.

Hibernate is configured to update the schema using the JPA entities.

## Prerequisites

Install the following before running the application:

- Java Development Kit (JDK) 17
- Apache Maven
- MySQL Server
- Node.js and npm
- Git

## Getting Started

### 1. Clone the repository

Replace the placeholder below with your actual GitHub repository URL.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Create the MySQL database

Open MySQL and run:

```sql
CREATE DATABASE job_recommendation_db;
```

Configure your database username and password locally.

### 3. Configure the backend

In the backend's `src/main/resources/application.properties`, configure:

```properties
spring.application.name=job-recommendation

spring.datasource.url=jdbc:mysql://localhost:3306/job_recommendation_db
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=${JWT_SECRET}
jwt.expiration-ms=3600000
```

Set `DB_USERNAME`, `DB_PASSWORD`, and `JWT_SECRET` as environment variables before starting the backend.

Use a sufficiently long, randomly generated JWT secret compatible with the configured signing algorithm. Never commit real credentials or secrets to GitHub.

### 4. Run the backend

From the directory containing the backend's `pom.xml`, run:

```bash
mvn spring-boot:run
```

The backend is expected to run at:

`http://localhost:8080`

### 5. Run the frontend

Open a terminal in the frontend directory containing `package.json`.

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The configured frontend origin is:

`http://localhost:5173`

Keep the backend and frontend running in separate terminals.

## API Endpoints

The following endpoints are based on the controllers implemented in the backend.

### Authentication and Users

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/users` | Register a user |
| POST | `/api/users/login` | Log in and obtain a JWT |
| GET | `/api/users` | List users |
| GET | `/api/users/{id}` | Retrieve a user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Delete a user |

### User Profiles

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/profiles/{userId}` | Create a profile |
| GET | `/api/profiles/{userId}` | Retrieve a profile |
| PUT | `/api/profiles/{userId}` | Update a profile |
| DELETE | `/api/profiles/{userId}` | Delete a profile |

### Skills

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/skills` | Create a skill |
| GET | `/api/skills` | List skills |
| GET | `/api/skills/{id}` | Retrieve a skill |
| PUT | `/api/skills/{id}` | Update a skill |
| DELETE | `/api/skills/{id}` | Delete a skill |

### User Skills

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/user-skills/{userId}/{skillId}` | Add a skill to a user |
| GET | `/api/user-skills` | List user-skill associations |
| GET | `/api/user-skills/{userId}` | List a user's skills |
| DELETE | `/api/user-skills/{userId}/{skillId}` | Remove a skill from a user |

### Jobs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/jobs` | Create a job |
| GET | `/api/jobs` | List jobs |
| GET | `/api/jobs/{id}` | Retrieve a job |
| PUT | `/api/jobs/{id}` | Update a job |
| DELETE | `/api/jobs/{id}` | Delete a job |

### Job Skills

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/job-skills/{jobId}/{skillId}` | Add a required skill to a job |
| GET | `/api/job-skills` | List job-skill associations |
| DELETE | `/api/job-skills/{id}` | Remove a job-skill association |

### Recommendations

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/recommendations` | Retrieve personalized job recommendations |

Protected endpoints require authentication. For authenticated API requests, send the JWT in the `Authorization` header:

```http
Authorization: Bearer <YOUR_JWT_TOKEN>
```

Registration, login, and skill-listing endpoints are configured as public. Skill creation, updating, and deletion require the `ADMIN` role. Other endpoints require authentication, and profile and individual user-skill operations also perform user-ownership checks.

## Error Handling

The backend provides structured JSON errors through a centralized exception handler.

| HTTP status | Meaning |
|---|---|
| 400 | Invalid request or validation failure |
| 401 | Invalid login credentials or invalid JWT |
| 403 | Access denied |
| 404 | Resource not found |
| 409 | Duplicate or conflicting data |

Example error response:

```json
{
  "status": 404,
  "message": "Resource not found"
}
```

## Security Notes

- Passwords are hashed using BCrypt before storage.
- JWTs are signed and have a configurable expiration time.
- Protected endpoints require authentication.
- Profile and individual user-skill operations check user ownership.
- Database credentials and JWT signing secrets must be kept outside version control.
- The development CORS configuration permits the frontend origin `http://localhost:5173`.
- Review authorization rules before deploying the application publicly.

## Future Improvements

Potential enhancements include:

- Integrating a trained machine-learning recommendation model.
- Adding job search, filtering, and pagination.
- Improving recommendation explanations and skill-gap guidance.
- Adding automated unit and integration tests.
- Adding deployment configuration and production monitoring.

## License

Add a license before distributing the project for reuse. No specific license is declared here.
