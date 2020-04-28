import config


def get_user_status(api):

    data = api.rate_limit_status()['resources']['statuses']['/statuses/user_timeline']

    remaning = int(data['remaining'])
    
    if remaning > config.USER_THRESHOLD:
        return False, -1

    # Need to pause
    reset = int(data['reset'])

    return True, reset
        


