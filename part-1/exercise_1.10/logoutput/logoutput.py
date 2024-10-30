import time
import random
import string
from datetime import datetime

def generate_random_string(length=8):
    letters = string.ascii_letters + string.digits
    return ''.join(random.choice(letters) for _ in range(length))

random_string = generate_random_string()

def print_string_with_timestamp():
    while True:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"{timestamp} - {random_string}")
        with open('/usr/src/app/files/output.txt', 'w') as file:
            file.write(f"{timestamp} - Hash: {random_string}\n")
        time.sleep(5)

if __name__ == "__main__":
    print_string_with_timestamp()