# GMR Market Project

> **Goal:** deliver a minimal full-stack marketplace where users can register, top-up balance, create products and buy goods.

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [Main Features](#main-features)  
3. [Tech Stack](#tech-stack)  
4. [Repository Layout](#repository-layout)  
5. [Quick Start](#quick-start)  
6. [Core API Endpoints](#core-api-endpoints)  
7. [Road-map (Next Steps)](#road-map-next-steps)

---

## Project Overview

GMR Market is a hobby / study project that implements a simple but working e-commerce flow:

* **Frontend** – Create-React-App, React Router and plain CSS modules.  
* **Backend** – Node 18 with the native `http` module, custom routing / middleware and MySQL 8 for persistence.  
* **Docker Compose** – spins up MySQL + backend in a single command; the CRA dev server runs locally.

---

## Main Features 

| Area            | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| **Auth**        | Register & login
                             |
| **Catalogue**   | Create / edit / delete product; pagination & tag filters                    |
| **Balance**     | View current balance, PATCH top-up                                          |
| **Buying**      | `POST /api/buy/:productId` decreases stock and stores purchase record       |
| **Products**    | `POST /api/main` returns products that match requested tags                 |
| **Profile**     | View & update user information                                              |

---

## Tech Stack

| Layer     | Details                                             |
|-----------|------------------------------------------------|
| Frontend  | **React 19**, CSS modules |
| Backend   | **Node 18**  |
| Database  | **MySQL 8** (Docker service `db`js*) |
| DevOps    | **Docker & Docker Compose** (backend + MySQL)       |


---

## Repository Layout

```text
GMR-market-project/
├── backend/               # Node server
│   ├── command/           # simple Command pattern helper
│   ├── config/            # database pool, tag list
│   ├── controllers/       # auth / balance / product / present / profile
│   ├── middleware/        # global logging middleware
│   ├── routes/            # apiRouter + webRouter
│   ├── Dockerfile
│   └── package.json
├── frontend/              # React client
│   ├── public/
│   └── src/
│       ├── components/    # Balance, ProductCard, Login, …
│       ├── context/       # UserContext for auth state
│       ├── styles/        # .css modules
│       └── validator/
├── docker-compose.yml     # MySQL 8 
└── README.md
```

---

## Quick Start

### Production-like run
```bash
# 1 – Clone the repo
git clone https://github.com/deadsnxw/GMR-market-project.git
cd GMR-market-project

# 2 – Install dependencies
cd backend && npm install                
cd ../frontend && npm install            

# 3 – Build frontend for production
npm run build                            

# 4 – Copy the build into the backend so it can serve static files
rm -rf ../backend/build
cp -r build ../backend/

# 5 – Launch MySQL + backend with Docker
cd ..                                     
docker compose up --build

# Frontend and API will now be available on:
# http://localhost:5000   (backend serves /build as static SPA)
```


---

## Core API Endpoints

| Method | Path & params                       | Purpose                                   |
|--------|-------------------------------------|-------------------------------------------|
| POST   | `/api/register`                     | create new user                           |
| POST   | `/api/login`                        | login → JWT                               |
| GET    | `/api/products`                     | list products                             |
| POST   | `/api/create`                       | add product                               |
| PATCH  | `/api/product/:id`                  | update product                            |
| DELETE | `/api/product/:id`                  | delete product                            |
| PATCH  | `/api/balance/:userId`              | top-up / withdraw                         |
| POST   | `/api/buy/:productId`               | purchase product                          |
| POST   | `/api/main` (`tags` in body)        | products matching given tags              |
| GET    | `/api/user/:userId`                 | get profile                               |
| PATCH  | `/api/user/:userId`                 | update profile                            |


---

## Road-map (Next Steps)

- dockerise frontend & serve via Nginx  
- unit / integration tests for controllers  
- password-reset email flow  
- image upload to an object store instead of URL only  


---
