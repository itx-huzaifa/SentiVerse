# SentiVerse

This is a web application that performs sentiment analysis on user comments using a machine learning model.

## Project Structure

```
lab project/
│
├── app.py                      # Flask application
├── project.ipynb               # Model training notebook
├── requirements.txt            # Python dependencies
│
├── dataset/
│   ├── train.csv              # Training data
│   └── test.csv               # Test data
│
├── models/                     # Saved model files
│   ├── sentiment_model.pkl
│   ├── tfidf_vectorizer.pkl
│   └── preprocessing_data.pkl
│
├── templates/
│   └── index.html             # Web interface
│
└── static/
    ├── style.css              # Styling
    └── script.js              # Frontend JavaScript
```

## Setup Instructions

### 1. Train the Model (First Time Only)

1. Open `project.ipynb` in Jupyter/VS Code
2. Run all cells in order to:
   - Load and preprocess data
   - Train multiple ML models
   - Export the best model as pickle files

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Flask Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

## Usage

1. Open your web browser and navigate to `http://localhost:5000`
2. Enter any comment or text in the input field
3. Click "Analyze Sentiment"
4. View the predicted sentiment (Positive, Negative, or Neutral) with confidence scores

## Features

- **Real-time Sentiment Analysis**: Instantly classify text as positive, negative, or neutral
- **Confidence Scores**: View probability scores for each sentiment category
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Easy to Use**: Simple interface with clear visual feedback

## Model Details

The application uses machine learning models trained on sentiment analysis data:
- **Preprocessing**: Text cleaning, tokenization, lemmatization, stopword removal
- **Feature Extraction**: TF-IDF vectorization with bigrams
- **Models Compared**: Logistic Regression, Naive Bayes, SVM, Random Forest
- **Best Model**: Automatically selected based on accuracy

## Technologies Used

- **Backend**: Flask (Python web framework)
- **ML Libraries**: scikit-learn, pandas, numpy, nltk
- **Frontend**: HTML5, CSS3, JavaScript
- **Model Persistence**: Pickle

## Notes

- Make sure to run the notebook and generate pickle files before starting the Flask app
- The first request might be slow as NLTK downloads required data
- Models are loaded once when the app starts for better performance
