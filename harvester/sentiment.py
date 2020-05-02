from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import math

class SentimentAnalyser:
    def __init__(self):

        self.analyser = SentimentIntensityAnalyzer()

    def analyse(self, tweet):

        try:
            return self.analyser.polarity_scores(tweet)['compound']
        except:
            return None