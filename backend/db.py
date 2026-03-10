import mysql.connector
import os

def get_db_connection():
    try:
        db = mysql.connector.connect(
            host=os.environ.get('DB_HOST', 'YOUR_DATABASE_HOST'),
            user=os.environ.get('DB_USER', 'AVNADMIN'),
            password=os.environ.get('DB_PASSWORD', 'YOUR_DATABASE_PASSWORD'),
            database=os.environ.get('DB_NAME', 'defaultdb'),
            port=int(os.environ.get('DB_PORT', 11157)),
            ssl_disabled=False
        )
        return db
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None
