from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import math

class SentimentAnalyser:
    def __init__(self):

        self.analyser = SentimentIntensityAnalyzer()

    def analyse(self, tweet):

        try:
            sentiment = self.analyser.polarity_scores(tweet)['compound']
            sentiment = int(math.ceil((sentiment*5) + 5))
            return 
        except:
            return None