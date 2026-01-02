import mysql.connector

def get_db_connection():
    try:
        db = mysql.connector.connect(
            host='localhost',
            user='root',
            password='password',
            database='VotingSystem'
        )
        return db
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None
