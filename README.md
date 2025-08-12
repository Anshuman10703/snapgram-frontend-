# 📸 Snapgram – A Serverless Social Media Application

![Snapgram Screenshot](./screenshot.png)  
*A modern, scalable, and cost-efficient social media platform built entirely with AWS serverless services.*

---

## 🌟 Overview

Snapgram is a full-stack, serverless social media application where users can **register, log in, share photo-based posts, and manage their content**.  
It demonstrates how to build a **dynamic, cloud-native web app** using only **AWS Free Tier** services – delivering high scalability with minimal operational overhead.

---

## ✨ Features

- **🔐 Secure Authentication** – User registration and login with **Amazon Cognito**.
- **📝 Post Management** – Create, read, update, and delete posts stored in **Amazon DynamoDB**.
- **📤 Image Uploads** – Direct, secure uploads to **Amazon S3** using pre-signed URLs.
- **📰 Dynamic Feed** – Responsive feed displaying all user posts in real time.
- **🔍 Post Details Page** – View full post details and metadata.
- **📱 Responsive UI** – Built with **React**, **Tailwind CSS**, and **Shadcn UI** for a clean, modern look.

---

## 🚀 Live Demo

**Hosted on AWS Amplify**  
🔗 **URL:** [Your Amplify Hosting Link]  
Example: `https://main.d3tvalg0vekvct.amplifyapp.com`

---

## 🏛 Architecture

Snapgram is fully serverless – leveraging **AWS managed services** for high scalability, reliability, and low maintenance.

**High-Level Flow:**
1. **Frontend:** React + Tailwind CSS + Shadcn UI, deployed on **AWS Amplify Hosting**.
2. **Authentication:** Amazon Cognito for user sign-up/sign-in and session management.
3. **Database:** Amazon DynamoDB for storing post metadata.
4. **Storage:** Amazon S3 for image hosting with pre-signed URL uploads.
5. **API Layer:** Amazon API Gateway + AWS Lambda for business logic.
6. **Hosting & CI/CD:** AWS Amplify for automated builds and deployments.

---

### 📌 High-Level Architecture Diagram
![Architecture Diagram](./architecture-diagram.png)

---

## 🛠 Tech Stack

| Layer            | Technology |
|------------------|------------|
| Frontend         | React, Tailwind CSS, Shadcn UI |
| Backend/API      | AWS Lambda (Node.js) |
| Authentication   | Amazon Cognito |
| Database         | Amazon DynamoDB |
| Storage          | Amazon S3 |
| API Gateway      | Amazon API Gateway |
| Hosting          | AWS Amplify |

---

## 📂 Project Setup

### Prerequisites
- Node.js v18+
- AWS Account with Free Tier enabled
- AWS CLI configured locally

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/snapgram.git
cd snapgram

# Install dependencies
npm install