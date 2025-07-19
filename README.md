# Dominik Maier Coaching Website

This is the official website for Dominik Maier Coaching & Interim Management, built with Astro, AlpineJS, and TailwindCSS.

## Features

- Responsive design optimized for all devices
- Dark/light mode with automatic time-based switching
- Contact form with email functionality
- Database integration for lead tracking
- Animated UI components with AOS library

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create an `.env` file based on `.env.example`
4. Start the development server
   ```
   npm run dev
   ```

## Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```
# Email configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_username
EMAIL_PASSWORD=your_password
EMAIL_FROM=noreply@example.com
EMAIL_TO=maier@maier-value.com

# Database configuration (optional)
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=dominik_maier
```

## Contact Form

The contact form submits data to an API endpoint at `/api/contact`, which:
1. Validates the form input
2. Sends an email to the configured email address
3. Optionally saves the contact data to a MySQL database (if configured)

## Database Schema

If using the database functionality, the API will automatically create the required table:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  message TEXT,
  is_lead BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## Building for Production

```
npm run build
```

The built site will be in the `dist/` directory.

## License

All rights reserved. © 2025 Dominik Maier