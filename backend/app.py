from flask import Flask, jsonify, request
from flask_cors import CORS
import db

app = Flask(__name__)
CORS(app)

@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    conn = db.get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, position, votes FROM Candidates")
    candidates = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(candidates)

@app.route('/api/candidates', methods=['POST'])
def add_candidate():
    data = request.json
    name = data.get('name')
    position = data.get('position')
    
    if not name or not position:
        return jsonify({'error': 'Name and position are required'}), 400
    
    conn = db.get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    cursor = conn.cursor()
    sql = "INSERT INTO Candidates (name, position) VALUES (%s, %s)"
    cursor.execute(sql, (name, position))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Candidate added successfully'}), 201

@app.route('/api/candidates/<int:id>', methods=['DELETE'])
def delete_candidate(id):
    conn = db.get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Candidates WHERE id = %s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Candidate deleted successfully'})

@app.route('/api/candidates/<int:id>', methods=['PUT'])
def update_candidate(id):
    data = request.json
    name = data.get('name')
    position = data.get('position')
    
    conn = db.get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    cursor = conn.cursor()
    
    # Dynamic update query
    updates = []
    values = []
    if name:
        updates.append("name = %s")
        values.append(name)
    if position:
        updates.append("position = %s")
        values.append(position)
        
    if not updates:
        return jsonify({'message': 'No changes provided'})
        
    values.append(id)
    sql = f"UPDATE Candidates SET {', '.join(updates)} WHERE id = %s"
    
    cursor.execute(sql, tuple(values))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Candidate updated successfully'})

@app.route('/api/vote', methods=['POST'])
def vote():
    data = request.json
    user_name = data.get('user_name')
    admission_number = data.get('admission_number')
    position = data.get('position')
    candidate_id = data.get('candidate_id')

    if not all([user_name, admission_number, position, candidate_id]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    conn = db.get_db_connection()
    if not conn:
         return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    
    cursor.execute("SELECT has_voted FROM Users WHERE admission_number = %s AND has_voted = 1 AND voted_for_position = %s",
                   (admission_number, position))
    user_record = cursor.fetchone()
    
    if user_record:
        conn.close()
        return jsonify({'error': f'You have already voted for the position of {position}'}), 400

    cursor.execute("INSERT INTO Users (name, admission_number, has_voted, voted_for_position) VALUES (%s, %s, 1, %s)",
                   (user_name, admission_number, position))
    
    cursor.execute("UPDATE Candidates SET votes = votes + 1 WHERE id = %s", (candidate_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': f'Vote recorded for {position}'})

@app.route('/api/results', methods=['GET'])
def get_results():
    conn = db.get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    cursor = conn.cursor(dictionary=True)
    
    
    cursor.execute("SELECT DISTINCT position FROM Candidates")
    positions_rows = cursor.fetchall()
    positions = [row['position'] for row in positions_rows]
    
    results = {}
    
    for position in positions:
        cursor.execute(
            "SELECT name, votes FROM Candidates WHERE position = %s ORDER BY votes DESC LIMIT 1", (position,))
        winner = cursor.fetchone()
        
        if winner and winner['votes'] > 0:
            results[position] = winner
        else:
             results[position] = None

    cursor.close()
    conn.close()
    return jsonify(results)

@app.route('/api/reset', methods=['POST'])
def reset_data():
    conn = db.get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
        
    cursor = conn.cursor()
    cursor.execute("DELETE FROM Users")
    cursor.execute("UPDATE Candidates SET votes = 0")
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({'message': 'Voting data reset successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
