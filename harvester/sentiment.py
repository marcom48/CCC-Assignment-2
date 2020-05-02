from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

class SentimentAnalyser:
    def __init__(self):

        self.analyser = SentimentIntensityAnalyzer()

    def analyse(self, tweet):

        try:
            return self.analyser.polarity_scores(tweet)['compound']
        except:
            return None