from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost/db_reactpy'
mongo = PyMongo(app)

CORS(app)

db = mongo.db.users

@app.route('/user', methods=['POST'])
def create_user():
    # Receiving data
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']

    if name and password and email:
        id = db.insert(
            {
                'name': name,
                'email': email,
                'password': password
            }
        )
        response = {
            'id': str(ObjectId(id)),
            'name': name,
            'password': password,
            'email': email
        }
        return response
    else:
        return not_found()

@app.route('/users', methods=['GET'])
def get_users():
    users = []
    for doc in db.find():
        users.append({
            '_id': str(ObjectId(doc['_id'])),
            'name': doc['name'],
            'email': doc['email'],
            'password': doc['password']
        })

    return jsonify(users)

@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    user = db.find_one({'_id': ObjectId(id)})
    user['_id'] = str(ObjectId(user['_id']))

    return jsonify(user)

@app.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    user = db.delete_one({'_id': ObjectId(id)})
    response = jsonify({'message': 'User ' + id + ' was deleted successfully'})

    return response

@app.route('/user/<id>', methods=['PUT'])
def update_user(id):
    name = request.json['name']
    password = request.json['password']
    email = request.json['email']

    if name and email and password:
        db.update_one({'_id': ObjectId(id)}, {'$set': {
            'name': name,
            'password': password,
            'email': email
        }})
        response = jsonify({'message': 'User ' + id + ' was updated successfully'})
        return response
    else:
        return not_found()

@app.errorhandler(404)
def not_found(error=None):
    response = jsonify({
        'message': 'Resource Not Found: ' + request.url,
        'status': 404
    })
    response.status_code = 404

    return response

@app.route('/')
def index():
    return '<h1>WELCOME TO MY API</h1>'

if __name__ == "__main__":
    app.run(debug=True, port=4000)