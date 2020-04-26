FROM python:3

WORKDIR /usr/src/app

ENV http_proxy http://wwwproxy.unimelb.edu.au:8000
ENV https_proxy http://wwwproxy.unimelb.edu.au:8000
ENV HTTP_PROXY http://wwwproxy.unimelb.edu.au:8000
ENV HTTPS_PROXY http://wwwproxy.unimelb.edu.au:8000
ENV ftp_proxy http://wwwproxy.unimelb.edu.au:8000

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 80
CMD [ "python", "tweepy_demo.py" ]