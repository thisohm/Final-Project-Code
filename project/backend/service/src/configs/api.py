
import requests
# from requests import NullHandler
from configparser import ConfigParser

config = ConfigParser()
config.read('./src/configs/config.ini')


def request_post(url, payload):
    print(url)
    print(payload)
    try:
        response = requests.post(
                url,
                data=payload,
                headers={'x-access-token': config['tasana']['x-access-token']}
            )
        response.raise_for_status()
        print(response)
        return response 
    except:
        pass


# def get_url_fp(image_url, request_kwargs=None):
#     response = requests.get(some_url, **request_kwargs)
#     response.raise_for_status()
#     return response.raw
