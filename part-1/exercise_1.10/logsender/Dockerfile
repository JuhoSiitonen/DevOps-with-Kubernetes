FROM python:3.13.0rc3-alpine3.20

WORKDIR /mydir

COPY . . 

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3001

CMD ["python3", "-u", "logsender.py"]