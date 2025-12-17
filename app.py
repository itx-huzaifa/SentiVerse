from flask import Flask, render_template, request, jsonify
import pickle
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download NLTK data if not already downloaded
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
    nltk.download('wordnet', quiet=True)
    nltk.download('omw-1.4', quiet=True)

app = Flask(__name__)

# Load the trained model and vectorizer
print("Loading model and vectorizer...")
with open('models/sentiment_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('models/tfidf_vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

with open('models/preprocessing_data.pkl', 'rb') as f:
    preprocessing_data = pickle.load(f)

lemmatizer = preprocessing_data['lemmatizer']
stop_words = preprocessing_data['stop_words']

print("Model loaded successfully!")

def preprocess_text(text):
    """
    Comprehensive text preprocessing function
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove user mentions and hashtags
    text = re.sub(r'@\w+|#\w+', '', text)
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords and lemmatize
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word not in stop_words and len(word) > 2]
    
    # Join tokens back to string
    return ' '.join(tokens)

def predict_sentiment(text):
    """
    Predict sentiment of input text
    """
    # Preprocess the input text
    cleaned_text = preprocess_text(text)
    
    # Transform to TF-IDF features
    text_tfidf = vectorizer.transform([cleaned_text])
    
    # Make prediction
    prediction = model.predict(text_tfidf)[0]
    
    # Get prediction probability (if available)
    if hasattr(model, 'predict_proba'):
        probabilities = model.predict_proba(text_tfidf)[0]
        prob_dict = dict(zip(model.classes_, probabilities))
        return prediction, prob_dict
    else:
        return prediction, None

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Handle sentiment prediction requests"""
    try:
        # Get the comment from the request
        data = request.get_json()
        comment = data.get('comment', '').strip()
        
        if not comment:
            return jsonify({
                'error': 'Please enter a valid comment'
            }), 400
        
        # Predict sentiment
        sentiment, probabilities = predict_sentiment(comment)
        
        # Prepare response
        response = {
            'comment': comment,
            'sentiment': sentiment,
            'probabilities': {}
        }
        
        if probabilities:
            for sent, prob in probabilities.items():
                response['probabilities'][sent] = round(float(prob) * 100, 2)
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
