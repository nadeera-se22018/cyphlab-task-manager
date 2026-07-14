# System Diagrams

This document contains visual diagrams depicting the system data schema, use cases, and deployment architecture.

## Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USER ||--o{ PROJECT : manages
    USER ||--o{ PROJECT_MEMBER : is
    PROJECT ||--o{ PROJECT_MEMBER : has
    PROJECT ||--o{ TASK : contains
    USER ||--o{ TASK : assigned
    
    USER {
        int id
        string name
        string email
        string password
        Role role
        DateTime createdAt
        DateTime updatedAt
    }
    PROJECT {
        int id
        string title
        string description
        int managerId
        DateTime createdAt
        DateTime updatedAt
    }
    PROJECT_MEMBER {
        int id
        int projectId
        int userId
        DateTime createdAt
        DateTime updatedAt
    }
    TASK {
        int id
        string title
        string description
        TaskStatus status
        int projectId
        int assigneeId
        DateTime createdAt
        DateTime updatedAt
    }
```

## Use Case Diagram

```mermaid
graph TD
    subgraph Actors
        Admin[Admin Actor]
        Manager[Manager Actor]
        Member[Member Actor]
    end

    subgraph Actions
        UC1[Register & Login]
        UC2[View Dashboard stats]
        UC3[Manage Users & Roles]
        UC4[Delete Users]
        UC5[Create Projects]
        UC6[Add Project Members]
        UC7[Create Tasks]
        UC8[Delete Tasks]
        UC9[Update Task Status]
        UC10[View Project Tasks]
    end

    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10

    Manager --> UC1
    Manager --> UC2
    Manager --> UC5
    Manager --> UC6
    Manager --> UC7
    Manager --> UC8
    Manager --> UC9
    Manager --> UC10

    Member --> UC1
    Member --> UC2
    Member --> UC9
    Member --> UC10
```

## System Architecture Diagram

```mermaid
graph LR
    subgraph Client Tier
        FE[Next.js Frontend]
    end

    subgraph Application Tier
        BE[Node.js Express API]
    end

    subgraph Database Tier
        DB[(PostgreSQL Database)]
    end

    FE -- HTTP Requests / REST API --> BE
    BE -- Prisma ORM / Connection Pool --> DB
    DB -- Query Results --> BE
    BE -- JSON Responses --> FE
```
