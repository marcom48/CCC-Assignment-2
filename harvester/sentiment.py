'''
COMP90024
Team 11
Marco Marasco - 834882
Austen McClernon - 834063
Sam Mei - 1105817
Cameron Wong - 1117840
'''

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAnalyser:
    def __init__(self):

        self.analyser = SentimentIntensityAnalyzer()

    def analyse(self, tweet):

        try:
            return self.analyser.polarity_scores(tweet)['compound']
        except:
            return None