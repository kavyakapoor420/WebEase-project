from flask import Flask, request, jsonify
import subprocess
import sys

app = Flask(__name__)

@app.route('/run-agent', methods=['POST'])
def run_agent():
    data = request.get_json()
    if not data or 'voice_input' not in data:
        return jsonify({'error': 'Missing voice_input'}), 400

    voice_input = data['voice_input']

    # Run agent.py with voice_input as argument
    try:
        # Assuming agent.py accepts voice input as a command line argument
        result = subprocess.run([sys.executable, 'agent.py', '--query', voice_input], capture_output=True, text=True, check=True)
        output = result.stdout
    except subprocess.CalledProcessError as e:
        return jsonify({'error': 'Failed to run agent.py', 'details': e.stderr}), 500

    return jsonify({'result': output})

if __name__ == '__main__':
    app.run(port=5000)
