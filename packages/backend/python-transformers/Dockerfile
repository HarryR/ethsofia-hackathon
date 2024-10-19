FROM python:3.7.3-alpine3.10

#COPY requirements.txt /app/requirements.txt

#RUN pip install -r requirements.txt

COPY ./src /app

ENTRYPOINT ["python3", "/app/app.py"]
