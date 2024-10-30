import time
import random
import string
from datetime import datetime
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def get_string_with_timestamp():
    try:
        with open('/usr/src/app/files/output.txt', 'r') as file:
            content = file.read().strip()
            print(f"Read from file: {content}")
    except FileNotFoundError:
        print("File not found. Waiting for writer...")
        
    return jsonify({'response': content})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3001, debug=False)