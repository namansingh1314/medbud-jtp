from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    avatar_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    predictions = db.relationship('PredictionHistory', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'username': self.username,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<User {self.username}>'

class PredictionHistory(db.Model):
    __tablename__ = 'prediction_history'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    symptoms = db.Column(db.JSON)  # Changed from ARRAY to JSON for SQLite compatibility
    predicted_disease = db.Column(db.String)
    description = db.Column(db.Text)
    medications = db.Column(db.JSON)  # Changed from ARRAY to JSON for SQLite compatibility
    diet = db.Column(db.JSON)  # Changed from ARRAY to JSON for SQLite compatibility
    workout = db.Column(db.JSON)  # Changed from ARRAY to JSON for SQLite compatibility
    precautions = db.Column(db.JSON)  # Changed from ARRAY to JSON for SQLite compatibility
    created_at = db.Column(db.DateTime(timezone=True), server_default=db.func.now())

def init_app(app):
    # Get database URI from environment variables
    database_uri = os.getenv('SQLALCHEMY_DATABASE_URI')
    if not database_uri:
        raise ValueError("SQLALCHEMY_DATABASE_URI must be set in environment variables")

    app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() == 'true'
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        print("Database initialized successfully")