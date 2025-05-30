# Installation Guide
Simply Run docker-compose up --build to run this project ocally make sure docker desktop is running
## Docker Setup
1. Open Docker Desktop and ensure it's running.

2. Open a terminal in the project root directory.

3. Build the Docker containers:

```
docker compose build
```

4. Start the containers:

```
docker compose up
```

The services will be available at:

Frontend: http://localhost:5173

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm 6 or higher

## Backend Setup

1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Start the Flask server:
   ```bash
   python main.py
   ```
   The backend server will start on http://localhost:5000

## Frontend Setup

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend application will start on http://localhost:5173


## Model and Dataset Setup

Ensure all required model and dataset files are present in their respective directories:

- Backend/models/svc.pkl
- Backend/dataset/
  - symtoms_df.csv
  - precautions_df.csv
  - workout_df.csv
  - description.csv
  - medications.csv
  - diets.csv

## Troubleshooting

1. If you encounter model prediction issues:
   - Verify that all dataset files are properly formatted
   - Check if the model file is correctly loaded
   - Ensure symptoms are being properly selected and sent to the backend

2. If you face connection issues:
   - Check if both frontend and backend servers are running
   - Verify the CORS settings in the backend
   - Ensure the API endpoints are correctly configured

3. For database issues:
   - Check if the SQLite database file is created
   - Verify the database connection string
   - Ensure proper permissions for the database file

## Additional Notes

- The system uses a Support Vector Machine (SVM) classifier for disease prediction
- Multiple symptoms can be selected for more accurate predictions
- The prediction model provides probability estimates for better accuracy
- The system includes comprehensive health recommendations including medications, diet, and workout plans
