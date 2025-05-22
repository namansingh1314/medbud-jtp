from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
from database import User, PredictionHistory, db
from flask_session import Session
from functools import wraps
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask
app = Flask(__name__)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medicine_recommendation.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Session configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = os.path.join(app.root_path, 'flask_session')
app.config['SESSION_COOKIE_NAME'] = 'medicine_session'
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = 3600  # Session timeout in seconds

# Initialize CORS with specific origins
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type"],
    }
})

# Initialize extensions
db.init_app(app)
Session(app)

# Create database tables
with app.app_context():
    db.create_all()

# Define base directory for data files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODELS_DIR = os.path.join(BASE_DIR, 'models')

# Load symptoms and diseases dictionaries
symptoms_dict = {'itching': 0, 'skin_rash': 1, 'nodal_skin_eruptions': 2, 'continuous_sneezing': 3, 'shivering': 4, 'chills': 5, 'joint_pain': 6, 'stomach_pain': 7, 'acidity': 8, 'ulcers_on_tongue': 9, 'muscle_wasting': 10, 'vomiting': 11, 'burning_micturition': 12, 'spotting_ urination': 13, 'fatigue': 14, 'weight_gain': 15, 'anxiety': 16, 'cold_hands_and_feets': 17, 'mood_swings': 18, 'weight_loss': 19, 'restlessness': 20, 'lethargy': 21, 'patches_in_throat': 22, 'irregular_sugar_level': 23, 'cough': 24, 'high_fever': 25, 'sunken_eyes': 26, 'breathlessness': 27, 'sweating': 28, 'dehydration': 29, 'indigestion': 30, 'headache': 31, 'yellowish_skin': 32, 'dark_urine': 33, 'nausea': 34, 'loss_of_appetite': 35, 'pain_behind_the_eyes': 36, 'back_pain': 37, 'constipation': 38, 'abdominal_pain': 39, 'diarrhoea': 40, 'mild_fever': 41, 'yellow_urine': 42, 'yellowing_of_eyes': 43, 'acute_liver_failure': 44, 'fluid_overload': 45, 'swelling_of_stomach': 46, 'swelled_lymph_nodes': 47, 'malaise': 48, 'blurred_and_distorted_vision': 49, 'phlegm': 50, 'throat_irritation': 51, 'redness_of_eyes': 52, 'sinus_pressure': 53, 'runny_nose': 54, 'congestion': 55, 'chest_pain': 56, 'weakness_in_limbs': 57, 'fast_heart_rate': 58, 'pain_during_bowel_movements': 59, 'pain_in_anal_region': 60, 'bloody_stool': 61, 'irritation_in_anus': 62, 'neck_pain': 63, 'dizziness': 64, 'cramps': 65, 'bruising': 66, 'obesity': 67, 'swollen_legs': 68, 'swollen_blood_vessels': 69, 'puffy_face_and_eyes': 70, 'enlarged_thyroid': 71, 'brittle_nails': 72, 'swollen_extremeties': 73, 'excessive_hunger': 74, 'extra_marital_contacts': 75, 'drying_and_tingling_lips': 76, 'slurred_speech': 77, 'knee_pain': 78, 'hip_joint_pain': 79, 'muscle_weakness': 80, 'stiff_neck': 81, 'swelling_joints': 82, 'movement_stiffness': 83, 'spinning_movements': 84, 'loss_of_balance': 85, 'unsteadiness': 86, 'weakness_of_one_body_side': 87, 'loss_of_smell': 88, 'bladder_discomfort': 89, 'foul_smell_of urine': 90, 'continuous_feel_of_urine': 91, 'passage_of_gases': 92, 'internal_itching': 93, 'toxic_look_(typhos)': 94, 'depression': 95, 'irritability': 96, 'muscle_pain': 97, 'altered_sensorium': 98, 'red_spots_over_body': 99, 'belly_pain': 100, 'abnormal_menstruation': 101, 'dischromic _patches': 102, 'watering_from_eyes': 103, 'increased_appetite': 104, 'polyuria': 105, 'family_history': 106, 'mucoid_sputum': 107, 'rusty_sputum': 108, 'lack_of_concentration': 109, 'visual_disturbances': 110, 'receiving_blood_transfusion': 111, 'receiving_unsterile_injections': 112, 'coma': 113, 'stomach_bleeding': 114, 'distention_of_abdomen': 115, 'history_of_alcohol_consumption': 116, 'fluid_overload.1': 117, 'blood_in_sputum': 118, 'prominent_veins_on_calf': 119, 'palpitations': 120, 'painful_walking': 121, 'pus_filled_pimples': 122, 'blackheads': 123, 'scurring': 124, 'skin_peeling': 125, 'silver_like_dusting': 126, 'small_dents_in_nails': 127, 'inflammatory_nails': 128, 'blister': 129, 'red_sore_around_nose': 130, 'yellow_crust_ooze': 131}
diseases_list = {15: 'Fungal infection', 4: 'Allergy', 16: 'GERD', 9: 'Chronic cholestasis', 14: 'Drug Reaction', 33: 'Peptic ulcer diseae', 1: 'AIDS', 12: 'Diabetes ', 17: 'Gastroenteritis', 6: 'Bronchial Asthma', 23: 'Hypertension ', 30: 'Migraine', 7: 'Cervical spondylosis', 32: 'Paralysis (brain hemorrhage)', 28: 'Jaundice', 29: 'Malaria', 8: 'Chicken pox', 11: 'Dengue', 37: 'Typhoid', 40: 'hepatitis A', 19: 'Hepatitis B', 20: 'Hepatitis C', 21: 'Hepatitis D', 22: 'Hepatitis E', 3: 'Alcoholic hepatitis', 36: 'Tuberculosis', 10: 'Common Cold', 34: 'Pneumonia', 13: 'Dimorphic hemmorhoids(piles)', 18: 'Heart attack', 39: 'Varicose veins', 26: 'Hypothyroidism', 24: 'Hyperthyroidism', 25: 'Hypoglycemia', 31: 'Osteoarthristis', 5: 'Arthritis', 0: '(vertigo) Paroymsal  Positional Vertigo', 2: 'Acne', 38: 'Urinary tract infection', 35: 'Psoriasis', 27: 'Impetigo'}

# Load datasets and model
try:
    sym_des = pd.read_csv(os.path.join(DATASET_DIR, 'symtoms_df.csv'))
    precautions = pd.read_csv(os.path.join(DATASET_DIR, 'precautions_df.csv'))
    workout = pd.read_csv(os.path.join(DATASET_DIR, 'workout_df.csv'))
    description = pd.read_csv(os.path.join(DATASET_DIR, 'description.csv'))
    medications = pd.read_csv(os.path.join(DATASET_DIR, 'medications.csv'))
    diets = pd.read_csv(os.path.join(DATASET_DIR, 'diets.csv'))

    with open(os.path.join(MODELS_DIR, 'svc.pkl'), 'rb') as f:
        svc = pickle.load(f)

    print("Model loaded successfully")

except Exception as e:
    print(f"Error during initialization: {e}")
    raise SystemExit(1)

feature_names = list(symptoms_dict.keys())
svc.feature_names_in_ = np.array(feature_names)

# Disease info helper
def helper(disease):
    try:
        desc = description[description['Disease'] == disease]['Description']
        desc = " ".join([str(d) for d in desc]) if not desc.empty else "No description available"

        pre = precautions[precautions['Disease'] == disease][['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']]
        pre = [str(p) for p in pre.values[0]] if not pre.empty else ["No precautions available"]

        med = medications[medications['Disease'] == disease]['Medication']
        med = eval(med.values[0]) if not med.empty and isinstance(med.values[0], str) else ["No medications available"]

        die = diets[diets['Disease'] == disease]['Diet']
        die = eval(die.values[0]) if not die.empty and isinstance(die.values[0], str) else ["No diet available"]

        wrkout = workout[workout['disease'] == disease]['workout']
        wrkout = [str(w) for w in wrkout.values] if not wrkout.empty else ["No workout available"]

        return desc, pre, med, die, wrkout

    except Exception as e:
        print(f"Error retrieving info: {e}")
        return "Error", ["Error"], ["Error"], ["Error"], ["Error"]

# Prediction function
def get_predicted_value(symptoms):
    valid_symptoms = [s for s in symptoms if s in symptoms_dict]

    if not valid_symptoms:
        raise ValueError("No valid symptoms provided.")

    input_vector = pd.DataFrame(np.zeros((1, len(symptoms_dict))), columns=feature_names)
    for symptom in valid_symptoms:
        input_vector[symptom] = 1

    prediction = svc.predict(input_vector)[0]
    return diseases_list[prediction]

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Please log in'}), 401
        current_user = User.query.get(session['user_id'])
        if not current_user:
            session.pop('user_id', None)
            return jsonify({'message': 'User not found'}), 401
        return f(current_user, *args, **kwargs)
    return decorated_function

@app.route('/auth/logout', methods=['POST'])
@login_required
def logout(current_user):
    try:
        session.clear()
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        print(f"Logout error: {str(e)}")
        return jsonify({'message': 'An error occurred during logout'}), 500

# Authentication routes
@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Invalid email or password'}), 401

        # Clear any existing session
        session.clear()
        
        # Set new session
        session['user_id'] = user.id
        session.permanent = True

        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'avatar_url': user.avatar_url
            }
        }), 200
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'An error occurred during login'}), 500

@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400

        email = data.get('email')
        password = data.get('password')
        username = data.get('username')

        if not email or not password or not username:
            return jsonify({'message': 'Email, password, and username are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'Email is already registered'}), 400

        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username is already taken'}), 400

        # Create new user
        user = User(
            id=str(uuid.uuid4()),
            email=email,
            username=username,
            password_hash=generate_password_hash(password)
        )
        
        db.session.add(user)
        db.session.commit()

        # Clear any existing session
        session.clear()
        
        # Set new session
        session['user_id'] = user.id
        session.permanent = True

        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'avatar_url': user.avatar_url
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        print(f"Registration error: {str(e)}")
        return jsonify({'message': 'An error occurred during registration'}), 500

# Protected prediction endpoint
@app.route('/predict', methods=['POST'])
@login_required
def predict(current_user):
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', [])

        if not symptoms or not isinstance(symptoms, list):
            return jsonify({'status': 'error', 'message': 'Please provide a valid list of symptoms'}), 400

        user_symptoms = [s.strip().lower() for s in symptoms if isinstance(s, str) and s.strip()]
        predicted_disease = get_predicted_value(user_symptoms)
        description, precautions, medications, diet, workout = helper(predicted_disease)

        # Save prediction to history
        prediction = PredictionHistory(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            symptoms=user_symptoms,
            predicted_disease=predicted_disease,
            description=description,
            medications=medications,
            diet=diet,
            workout=workout,
            precautions=precautions
        )
        db.session.add(prediction)
        db.session.commit()

        return jsonify({
            'status': 'success',
            'disease': predicted_disease,
            'description': description,
            'precautions': precautions,
            'medications': medications,
            'diet': diet,
            'workout': workout
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/profile', methods=['GET'])
@login_required
def get_profile(current_user):
    return jsonify({
        'user': {
            'id': current_user.id,
            'email': current_user.email,
            'username': current_user.username,
            'avatar_url': current_user.avatar_url
        }
    })

@app.route('/prediction-history', methods=['GET'])
@login_required
def get_predictions(current_user):
    predictions = PredictionHistory.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'id': p.id,
            'symptoms': p.symptoms,
            'predicted_disease': p.predicted_disease,
            'description': p.description,
            'medications': p.medications,
            'diet': p.diet,
            'workout': p.workout,
            'precautions': p.precautions,
            'created_at': p.created_at.isoformat()
        } for p in predictions
    ])

# Profile management routes
@app.route('/profile/update', methods=['PUT'])
@login_required
def update_profile(current_user):
    try:
        data = request.get_json()
        username = data.get('username')

        if username:
            current_user.username = username
            db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': current_user.id,
                'email': current_user.email,
                'username': current_user.username,
                'avatar_url': current_user.avatar_url
            }
        })
    except Exception as e:
        return jsonify({'message': str(e)}), 400

@app.route('/profile/avatar', methods=['POST'])
@login_required
def upload_avatar(current_user):
    try:
        if 'avatar' not in request.files:
            return jsonify({'message': 'No avatar file provided'}), 400

        avatar = request.files['avatar']
        if not avatar.filename:
            return jsonify({'message': 'No file selected'}), 400

        # Validate file type
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        if not ('.' in avatar.filename and 
                avatar.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
            return jsonify({'message': 'Invalid file type'}), 400

        # Generate unique filename
        filename = f"{current_user.id}_{uuid.uuid4()}.{avatar.filename.rsplit('.', 1)[1].lower()}"
        
        # Ensure uploads directory exists
        uploads_dir = os.path.join(app.root_path, 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Save file
        avatar_path = os.path.join(uploads_dir, filename)
        avatar.save(avatar_path)
        
        # Update user's avatar_url
        current_user.avatar_url = f"/uploads/{filename}"
        db.session.commit()

        return jsonify({
            'message': 'Avatar uploaded successfully',
            'avatar_url': current_user.avatar_url
        })
    except Exception as e:
        return jsonify({'message': str(e)}), 400

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
