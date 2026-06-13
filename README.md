# Smart Expense Tracker

A polished full-stack expense tracking app built with React, Vite, Express, and MongoDB. It includes JWT authentication, smart expense categorization, analytics, budget alerts, rule-based insights, and next-month expense prediction.

## Features

- JWT signup and login with protected routes
- Dashboard with balance, monthly spend, recent transactions, and animated UI
- Expense CRUD with instant refresh, category detection, search, and filters
- Monthly budget tracking with 80% warning and exceed alerts
- Analytics with line and pie charts
- Rule-based smart insights and simple expense prediction
- CSV export and lightweight profile page

## Project Structure

```text
client/  React + Vite frontend
server/  Express + MongoDB API
```

## Environment Setup

Create these files from the examples:

- `server/.env`
- `client/.env`

## Install

```bash
npm install
```

## Run

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev:client
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001/api`

## Build

```bash
npm run build
```
