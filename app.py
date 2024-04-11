from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
import urllib

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['GET', 'POST'])
def scrape():
    if request.method == 'POST':
        url = request.json['url']
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        text = soup.get_text()

        images = soup.find_all('img')
        images_data = [{'src': img['src']} for img in images]

        videos = soup.find_all('video')
        videos_data = [{'src': video['src']} for video in videos]

        return jsonify({'text': text, 'images': images_data, 'videos': videos_data})
    else:
        return render_template('index.html')  # Return the index.html page for GET requests

if __name__ == '__main__':
    app.run(debug=True)
