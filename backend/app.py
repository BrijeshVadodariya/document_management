from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Import CORS
from datetime import datetime
from model import db, Document

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)  # Initialize the database with the Flask app
CORS(app)

# Alternatively, to allow specific origins:
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Create database tables
with app.app_context():
    db.create_all()

# Routes
@app.route('/api/documents', methods=['GET'])
def get_documents():
    search_query = request.args.get('search')
    if search_query:
        documents = Document.query.filter(Document.name.contains(search_query)).all()
    else:
        documents = Document.query.all()
    return jsonify({"documents": [doc.to_dict() for doc in documents], "total": len(documents)})

@app.route('/api/documents/<int:id>', methods=['GET'])
def get_document(id):
    document = Document.query.get_or_404(id)
    return jsonify(document.to_dict())

@app.route('/api/documents', methods=['POST'])
def add_document():
    data = request.get_json()
    if not data or 'name' not in data or 'content' not in data:
        return jsonify({"error": "Invalid input data"}), 400

    new_doc = Document(
        name=data['name'],
        content=data['content'],
        size=data['size']
    )
    db.session.add(new_doc)
    db.session.commit()
    return jsonify(new_doc.to_dict()), 201

@app.route('/api/documents/<int:id>', methods=['DELETE'])
def delete_document(id):
    document = Document.query.get_or_404(id)
    db.session.delete(document)
    db.session.commit()
    return jsonify({"message": "Document deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True)
