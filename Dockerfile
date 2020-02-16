FROM python:3

ADD . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 3000
CMD [ "python", "server.py" ]