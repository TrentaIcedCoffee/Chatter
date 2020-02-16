import argparse
import io
import json
import os
import math

from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
import numpy
import six


def SentimentAnalyze(text):
    # Instantiates a client
    client = language.LanguageServiceClient()

    # The text to analyze
    text = u'Hello, world!'
    document = types.Document(
        content=text,
        type=enums.Document.Type.PLAIN_TEXT)

    # Detects the sentiment of the text
    sentiment = client.analyze_sentiment(document=document).document_sentiment

    print('Text: {}'.format(text))
    print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))


def ContentClassificationAnalyze(text, verbose=False):
    language_client = language.LanguageServiceClient()

    # req
    document = language.types.Document(
        content=text,
        type=language.enums.Document.Type.PLAIN_TEXT)

    # res
    response = language_client.classify_text(document)
    categories = response.categories

    result = {}

    for category in categories:
        # Turn the categories into a dictionary of the form:
        # {category.name: category.confidence}, so that they can
        # be treated as a sparse vector.
        result[category.name] = category.confidence

    if verbose:
        print(text)
        for category in categories:
            print(u'=' * 20)
            print(u'{:<16}: {}'.format('category', category.name))
            print(u'{:<16}: {}'.format('confidence', category.confidence))

    return result


if __name__ == "__main__":
    # Set Env Var
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"..\UserDataProcessing-33faf48744c5.json"

    # The text to analyze
    text = u"Google Home enables users to speak voice commands to interact with services through the Home's intelligent personal assistant called Google Assistant. A large number of services, both in-house and third-party, are integrated, allowing users to listen to music, look at videos or photos, or receive news updates entirely by voice."

    result = ContentClassificationAnalyze(text)
    print(result)
    a = result.get(list(result.keys())[0])
    b = result.get(list(result.keys())[1])
    print(math.sqrt(a**2 + b ** 2))

    '''
    Each category take Avg.
        Keep data log to explore data model distribution
    Output:
        Vector: specific category
        Map: overall
    '''
