# BookUI — Book Library Frontend

A React + TypeScript web application that consumes the BooksRestful REST API. It allows users to browse, search, and manage books through a clean UI, with support for switching between **JSON**, **XML**, and **Plain Text** data formats in real time.

---

## Table of Contents

- [What This Project Does](#what-this-project-does)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Setup & Running Locally](#setup--running-locally)
- [How to Use the App](#how-to-use-the-app)
- [Data Format Toggle](#data-format-toggle)
- [How the API Communication Works](#how-the-api-communication-works)
- [Notable Features](#notable-features)

---

## What This Project Does

This is the **client-side** (frontend) component of the Books web application. It runs in your browser and communicates with the Java REST API (`BookRestAPIAssessment`) to:

- Display all books in a table
- Search books by title, genre, or year
- Add new books via a form
- Edit existing books
- Delete books
- Exchange data with the server in JSON, XML, or Plain Text — switchable from the UI

---

## Requirements

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18+ | [Download](https://nodejs.org/) |
| npm | Comes with Node.js | |
| BooksRestful API | Running | Must be deployed on Tomcat at `localhost:8080` |
| MMU VPN / Campus WiFi | — | Required for the database to work |

> The frontend is just a static web app — it has no database of its own. It relies entirely on the REST API for data.

---

## Project Structure

```
BookUIAssignment/
├── src/
│   ├── api/
│   │   └── bookApi.ts           ← All API calls + serialise/deserialise logic
│   ├── components/
│   │   ├── BookForm.tsx          ← Add / Edit form with client-side validation
│   │   ├── BookModal.tsx         ← Modal overlay wrapper
│   │   ├── BookTable.tsx         ← Table displaying all books
│   │   └── FormatSelector.tsx   ← JSON / XML / Plain Text toggle in the header
│   ├── types/
│   │   └── Book.ts               ← TypeScript types for Book and DataFormat
│   ├── App.tsx                   ← Main page — ties everything together
│   ├── main.tsx                  ← App entry point
│   └── index.css                 ← Tailwind CSS import
├── index.html
├── package.json
└── vite.config.ts
```

---

## Setup & Running Locally

> Make sure the **BooksRestful REST API is already running** on `http://localhost:8080` before starting the frontend. See `BookRestAPIAssessment/README.md` for how to set that up.

### Step 1 — Install dependencies

Open a terminal in the `BookUIAssignment` folder and run:

```bash
npm install
```

This downloads all the required packages (React, Axios, Tailwind, etc.) into a `node_modules` folder.

> You only need to do this once, or whenever `package.json` changes.

### Step 2 — Start the development server

```bash
npm run dev
```

You should see output like:
```
VITE v8.x  ready in 300ms
➜  Local:   http://localhost:5173/
```

### Step 3 — Open the app

Visit `http://localhost:5173` in your browser. The book table should load automatically.

---

## How to Use the App

### Browsing Books
All books load automatically when the page opens. They are displayed in a table with columns for ID, Title, Author, Date, and Genres.

### Searching
Type anything into the search bar at the top. Results filter in real time as you type — it searches across **title**, **genre**, and **year**.

### Adding a Book
1. Click the **+ Add Book** button (top right)
2. Fill in all fields in the form that appears
3. Click **Add Book** to save

> All fields are required. The date must be in `DD/MM/YYYY` format. The form will show error messages if anything is missing or wrong.

### Editing a Book
1. Find the book in the table
2. Click the **Edit** link on that row
3. Update the fields in the form
4. Click **Update** to save

### Deleting a Book
1. Click the **Delete** link on any row
2. Confirm the prompt that appears

---

## Data Format Toggle

The header contains a **Data Format** toggle with three options: `JSON`, `XML`, and `Plain Text`.

Switching format changes how data is sent **and** received between the browser and the REST API:

| Format | How data travels |
|--------|-----------------|
| **JSON** | `{"id":1,"title":"..."}` — most common web format |
| **XML** | `<books><book><title>...</title></book></books>` — structured markup |
| **Plain Text** | `1##Title##Author##Date##...` — fields separated by `##` |

The app automatically:
- Sets the correct `Accept` header on GET requests so the server responds in the chosen format
- Sets the correct `Content-Type` header on POST/PUT/DELETE so the server knows how to read the body
- Parses the response in the matching format and displays it identically regardless of format

This demonstrates that the full data exchange pipeline works in all three formats, not just JSON.

---

## How the API Communication Works

All API calls are in `src/api/bookApi.ts`. Here is a plain-English summary of what happens for each operation:

### GET (browse / search)
1. Browser sends a GET request with an `Accept` header (e.g. `Accept: application/json`)
2. Server returns all books (or search results) in the requested format
3. Frontend parses the response (JSON.parse / DOMParser for XML / split for text)
4. Books are displayed in the table

### POST (add)
1. User fills in the form and clicks Add
2. Frontend validates the form fields first (client-side)
3. If valid, it serialises the book into the chosen format and sends it as the request body
4. Server validates again (server-side), inserts into the database, returns `201 Created`

### PUT (update)
1. Same as POST but includes the book's `id` in the body
2. Server finds the matching record by ID and updates it

### DELETE
1. Frontend sends the book's `id` in the request body
2. Server deletes the matching record

---

## Notable Features

### Three Data Formats
The app fully supports JSON, XML, and Plain Text for all operations — not just for reading. Adding, editing, and deleting all work in whichever format is currently selected.

### Client-Side Validation
The `BookForm` component validates all fields before sending anything to the server:
- All fields are required
- Date must match `DD/MM/YYYY` format (checked with a regex)
- Error messages appear inline below each field

This means bad data is caught in the browser before it ever reaches the API.

### Debounced Search
The search box waits 300ms after you stop typing before sending a request. This prevents a new API call on every single keystroke and makes the app feel more responsive.

### Modern Tech Stack
- **React 19 + TypeScript** — component-based UI with full type safety
- **Vite** — fast development server with instant hot reload (changes appear in the browser immediately without refreshing)
- **Tailwind CSS** — utility-first styling
- **Axios** — HTTP client with cleaner error handling than the native `fetch` API
