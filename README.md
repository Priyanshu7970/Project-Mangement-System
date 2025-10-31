Admin Dashboard Control Panel

This project provides an administrative control panel for managing users and system metrics. The front-end is built using React and styled with Tailwind CSS, designed to be integrated into a larger Next.js application, with data persistence handled by MongoDB.

🛠 Technology Stack

The application is built on the following technologies:

Frontend Framework: Next.js (utilizing React for the UI components)

Styling: Tailwind CSS

Database: MongoDB (via Mongoose or an ORM/ODM)

🏗 Architecture Overview: Model-View-Controller (MVC)

This application follows the Model-View-Controller (MVC) architectural pattern to separate concerns, making the codebase scalable, maintainable, and highly organized.

Model (MongoDB): Handles data logic and interacts directly with the MongoDB database. This layer is responsible for data retrieval, storage, and manipulation (e.g., fetching lists of users or projects).

View (React/Next.js Pages): This is the user interface, responsible for presenting data to the user. The AdminDashboard component and its modals represent the views.

Controller (Next.js API Routes): Acts as the intermediary between the Model and the View. It receives requests from the client (View), calls the necessary Model logic, and then sends the response back to the View. In a Next.js context, these are typically handled by API Routes (/pages/api/*).

⚙️ Setup and Installation

Follow these steps to get the development environment running locally.

Prerequisites

Node.js (v18+)

npm or yarn

A running instance of MongoDB

1. Clone the repository

git clone [YOUR_REPO_URL]
cd admin-dashboard-project


2. Install Dependencies

Install the required Node.js packages:

npm install
# or
yarn install


3. Configure Environment Variables

Create a file named .env.local in the root directory and add your database connection string and any necessary secrets:

# MongoDB Connection String
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"

# NextAuth/JWT Secret (for production only)
NEXTAUTH_SECRET="your_secure_random_string" 


4. Run the Development Server

Start the Next.js application in development mode:

npm run dev
# or
yarn dev


The application will now be running on http://localhost:3000.

API Documentation 
Method,Endpoint,Description,Access Control

Base Endpoints: api/projects

POST,/api/projects, Creates a new project.,ADMIN / USER (Assigned to the user making the request)
GET,/api/projects,Retrieve a list of projects.,ADMIN: Gets all projects. USER: Gets only their assigned projects.

base Endpoints: api/auth
api/auth/signup
api/auth/login
base Endpoints project by id : 
Method,Endpoint,Description,Access Control
GET,/api/projects/[id],Retrieve a single project by ID.,ADMIN: Any project. USER: Only if the project is assigned to them.
PUT,/api/projects/[id],Update an existing project.,ADMIN: Any project. USER: Only if the project is assigned to them.
DELETE,/api/projects/[id],Delete a project.,ADMIN: Any project. USER: Only if the project is assigned to them.

Dashboard Endpoint:
Method,Endpoint,Description,Access Control
GET,/api/dashboard,"Shows total users, total projects, and project counts per user.",ADMIN only.
