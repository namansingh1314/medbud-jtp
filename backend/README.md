# Medicine Recommendation System Backend

This is the backend service for the Medicine Recommendation System, built with Flask and SQLite.

## Features

- User authentication with session-based login
- Disease prediction using machine learning
- Prediction history tracking
- Profile management
- Secure file uploads for avatars

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Medicine-Recommendation-System.git
cd Medicine-Recommendation-System/Backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the Backend directory with the following content:
```env
FLASK_APP=main.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///instance/medicine_recommendation.db
```

## Database Setup

The application uses SQLite as the database. To initialize the database:

1. With the virtual environment activated, open a Python shell:
```bash
python
```

2. Run the following commands:
```python
from main import app, db
with app.app_context():
    db.create_all()
```

## Running the Server

1. Make sure you're in the Backend directory and your virtual environment is activated

2. Start the development server:
```bash
flask run
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Predictions
- `POST /predict` - Get disease prediction based on symptoms
- `GET /predictions` - Get user's prediction history

### Profile Management
- `PUT /profile/update` - Update user profile
- `POST /profile/avatar` - Upload user avatar

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security

- Session-based authentication
- Password hashing using bcrypt
- CORS protection
- File upload validation

## Development

To run the server in development mode with debug enabled:
```bash
FLASK_ENV=development flask run --debug
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
