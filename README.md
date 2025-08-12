# Snapgram: A Serverless Social Media Application

## 🌟 Overview

Snapgram is a modern, full-stack social media application built on a serverless architecture using Amazon Web Services (AWS). It's a proof-of-concept project designed to demonstrate the power, scalability, and cost-efficiency of building a dynamic web application entirely within the **AWS Free Tier**.

This application allows users to register, log in, create and share photo-based posts, and manage their content. The project served as an invaluable learning experience in building robust, cloud-native applications from the ground up.

## ✨ Features

-   **User Authentication**: Secure user registration and login powered by **Amazon Cognito**.
-   **Post Management**: Full CRUD (Create, Read, Update, Delete) operations for posts, with data stored in **Amazon DynamoDB**.
-   **Image Uploads**: Efficient and secure image uploads directly to **Amazon S3** using a pre-signed URL methodology.
-   **Dynamic Feed**: A responsive home page displaying a feed of all posts.
-   **Post Details**: A dedicated page for viewing detailed information about a single post.
-   **Responsive UI**: A clean and modern user interface built with **React**, **Tailwind CSS**, and **Shadcn UI**.

## 🚀 Live Demo

Experience the application for yourself:

**Deployed URL:** [Your AWS Amplify Hosting URL]
> *Example: `https://main.d3tvalg0vekvct.amplifyapp.com`*

## 🏛️ Architecture

Snapgram is a serverless masterpiece, where every component is a managed AWS service.

**High-Level Diagram**
```mermaid
graph TD
    subgraph Frontend
        A[User Browser / React App]
    end

    subgraph API Layer
        B(Amazon API Gateway)
    end

    subgraph Compute
        C(AWS Lambda Functions)
    end

    subgraph Data
        D[Amazon DynamoDB]
        E[Amazon S3]
    end

    subgraph Auth
        F(Amazon Cognito)
    end

    A -- HTTP Requests --> B
    B -- Invokes --> C
    C -- Reads/Writes --> D
    C -- S3 PUT URL --> E
    A -- Authenticates --> F
    A -- Direct Image Upload --> E
    C -- Gets File --> E
Key Architectural Decisions:

Serverless First: All backend logic runs on AWS Lambda, eliminating server management and reducing costs.

Decoupled Services: The application is a collection of independent services (Lambda, API Gateway, DynamoDB) communicating via a well-defined API.

Free Tier Adherence: The architecture was intentionally designed to stay within the AWS Free Tier, demonstrating a pay-per-use model's efficiency.

Pre-signed URLs: Image uploads are handled by generating a pre-signed S3 URL from a Lambda, allowing the frontend to upload files directly to S3. This is a crucial optimization for performance and cost.

🛠️ Technology Stack
Frontend
Framework: React.js

Build Tool: Vite

Language: TypeScript

Styling: Tailwind CSS & Shadcn UI

State Management: React Context API

Routing: React Router DOM

HTTP Client: Axios

Backend
Compute: AWS Lambda (Node.js)

API Gateway: Amazon API Gateway (REST API)

Database: Amazon DynamoDB (NoSQL)

Storage: Amazon S3 (Object Storage)

Authentication: Amazon Cognito (User Pools, Identity Pools)

Access Control: AWS IAM

🚀 Deployment
The entire application is deployed on AWS.

Frontend: Hosted on AWS Amplify Hosting, with continuous deployment from a GitHub repository.

Backend: A collection of AWS Lambda functions exposed via Amazon API Gateway.

📖 Lessons Learned
Cloud-Native Debugging: Serverless debugging requires a deep understanding of service integration and logging (CloudWatch is key!).

CORS Configuration: Meticulous attention to detail is required for CORS policies in both API Gateway and Lambda functions to ensure seamless cross-origin communication.

Local vs. Cloud Environments: Discovered the significant benefits of a cloud-based build process (like Amplify's) for overcoming complex local development environment issues.

Free Tier Design: Proactively designing the architecture to fit within Free Tier limits from the start is a rewarding and cost-effective practice.

📜 License
This project is open source and available under the MIT License.
