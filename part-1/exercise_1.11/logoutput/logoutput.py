import time
import random
import string
from datetime import datetime
from flask import Flask, jsonify

app = Flask(__name__)

def generate_random_string(length=8):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))

@app.route('/', methods=['GET'])
def get_string_with_timestamp():
    random_string = generate_random_string()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    try:
        with open('/usr/src/app/files/output.txt', 'r') as file:
            content = file.read().strip()
            print(f"Read from file: {content}")
    except FileNotFoundError:
        print("File not found. Waiting for writer...")
        
    return jsonify({'timestamp': timestamp, 'random_string': random_string, 'response': content})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=False)