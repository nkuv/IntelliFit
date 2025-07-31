# IntelliFit Frontend

Modern, responsive web interface for the IntelliFit fitness application.

## Features

- Responsive design with fitness-themed aesthetics
- JWT token-based authentication
- Login and registration forms
- Protected dashboard
- Real-time form validation
- Modern CSS with gradients and animations

## Files

- `index.html` - Entry point (redirects to login)
- `login.html` - User login page
- `register.html` - User registration page
- `dashboard.html` - Protected user dashboard
- `styles.css` - Common styles and utilities

## Setup

1. Ensure the backend API is running at `http://127.0.0.1:5000`

2. Open `index.html` in a web browser or serve the files using a local server:

```bash
# Using Python's built-in server
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080

# Using Live Server extension in VS Code
# Right-click on index.html and select "Open with Live Server"
```

3. Navigate to `http://localhost:8080` (or the appropriate port)

## Features

### Login Page
- IntelliFit branding with custom tagline
- Form validation
- Token storage
- Auto-redirect if already logged in

### Registration Page  
- Complete registration form
- Password confirmation
- Email validation
- Real-time feedback

### Dashboard
- Protected route (requires authentication)
- User welcome message
- Fitness feature showcase
- Secure logout

## Design Theme

- Gradient backgrounds (#667eea to #764ba2)
- Modern glassmorphism effects
- Responsive grid layouts
- Smooth animations and transitions
- Fitness-focused color scheme and iconography

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- ES6+ JavaScript features
