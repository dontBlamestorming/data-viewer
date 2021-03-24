FROM ubuntu:18.04

RUN apt-get -qq update \
    && apt-get install -qq -y --no-install-recommends \
    #
    build-essential \
    software-properties-common \
    libpq-dev \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libssl-dev \
    python3.8 \
    python3.8-dev \
    python3-distutils \
    # for install pip
    curl \
    #
    && apt-get clean \
    && rm -rf /var/lib/apt/lists \
    && ln -s "$(which python3.8)" /usr/bin/python \
    && curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py \
    && python get-pip.py

RUN pip install uwsgi~=2.0

ARG APP_PATH=/app

WORKDIR $APP_PATH

# to avoid installing pip packages when not changed requirements.txt
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

STOPSIGNAL SIGTERM

ENV DJANGO_SETTINGS_MODULE=settings.prod
ENV PROCESSES=2
ENV THREADS=4
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

CMD python manage.py migrate \
    && python manage.py collectstatic --noinput \
    && /usr/local/bin/uwsgi \
    --socket :8000 \
    --wsgi wsgi \
    --processes $PROCESSES \
    --threads $THREADS \
    --lazy-apps \
    --buffer-size 32768

