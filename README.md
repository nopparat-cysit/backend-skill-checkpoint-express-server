# Questions & Answers API Platform

A robust Backend API for a community-driven Q&A platform 



## Features

* **Search System**: Flexible search functionality by `title` or `category` using partial matching (`ILIKE`).
* **Question Management**: Full CRUD capabilities for managing user questions.
* **Answer Management**: Integrated answer system linked to specific questions (One-to-Many relationship).
* **Data Validation**: Secure middleware to validate user input (e.g., character length limits, required fields).
* **Relational Database**: Optimized schema design with Foreign Key constraints to ensure data integrity.



## Tech Stack

* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database**: PostgreSQL
* **Validation**: Custom Middleware logic
* **Tools**: `nodemon`, `pg` (node-postgres)



## Getting Started

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/nopparat-cysit/backend-skill-checkpoint-express-server.git]
    cd backend-skill-checkpoint-express-server
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Database Setup**
    - Create a new PostgreSQL database.
    - Configure the connection settings in `utils/db.mjs` (User, Password, Database Name).

4.  **Run the Server**
    ```bash
    npm run start
    ```



## API Endpoints

### Questions
| Method | Endpoint | Description | Success Code |
| :--- | :--- | :--- | :--- |
| `POST` | `/questions` | Create a new question | 
| `GET` | `/questions` | Get all questions |
| `GET` | `/questions/:id` | Get a specific question by ID |
| `PUT` | `/questions/:id` | Update a question by ID |
| `DELETE` | `/questions/:id` | Delete a question by ID |
| `GET` | `/questions/search` | Search questions by title or category |

### Answers
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/questions/:id/answers` | Get all answers for a specific question |
| `POST` | `/questions/:id/answers` | Submit an answer to a specific question |
| `DELETE` | `/questions/:id/answers` | Delete all answers associated with a question |


##  Author
* **GitHub**: [@nopparat-cysit](https://github.com/nopparat-cysit)
