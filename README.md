# Product Catalog Management System

## 📋 Overview
A full-stack single-page application for managing product catalog with React frontend and .NET backend.

## 🚀 Features
- ✅ Add new products with validation
- ✅ View all products in real-time
- ✅ Prevent duplicate products
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Success/error notifications
- ✅ Single-page application (no reloads)

## 🏗️ Architecture
- **Frontend**: React 19 + Bootstrap 5
- **Backend**: .NET 9 Web API
- **Database**: SQL Server with Entity Framework Core
- **API**: RESTful endpoints with Swagger documentation

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- .NET 9 SDK
- SQL Server (LocalDB recommended)

### Backend Setup
```bash
cd backend/ProductCatalog.API
dotnet restore
dotnet run