from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from textblob.sentiments import NaiveBayesAnalyzer
import nltk
nltk.download('movie_reviews')
nltk.download('punkt')

class SentimentAnalyzer:
    def __init__(self,type = 'vader'):
        self.type = type
        try:
            if type == 'vader':
                self.analyzer = SentimentIntensityAnalyzer()
            elif type == 'NaiveBayes':
                self.analyzer = NaiveBayesAnalyzer()
        except: 
            print("Please input valid analyzer type: 'vader' or 'NaiveBayes'")
            
    def analyze(self,text):
        text = str(text)
        if self.type == 'vader':
            polarity_score = self.analyzer.polarity_scores(text)['compound']
            if polarity_score > 0:
                return 'positive'
            elif polarity_score < 0:
                return 'negative'
            else: 
                return 'neutral'
        else: 
            blob = TextBlob(text,analyzer = self.analyzer)
            sentiment_tuple = blob.sentiment
            p_pos = sentiment_tuple[1];p_neg = sentiment_tuple[2]
            
            if abs(p_pos - p_neg) <= 0.1:
                return 'neutral'
            elif p_pos > p_neg:
                return 'positive'
            else:
                return 'negative'