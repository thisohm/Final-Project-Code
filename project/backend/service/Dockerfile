# Read more: https://www.docker.com/blog/containerized-python-development-part-1/

# set base image (host OS)
FROM python:3.8

RUN apt-get update && \
    apt-get -y install --no-install-recommends \
    procps ffmpeg sox vim \
    tzdata locales && \
    rm -rf /var/lib/apt/lists/*

# Set time zone
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

# Set the locale
RUN sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen && \
    dpkg-reconfigure --frontend=noninteractive locales && \
    update-locale LANG=en_US.UTF-8
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US.UTF-8
	
# set the working directory in the container
WORKDIR /app

# copy the dependencies file to the working directory
#COPY requirements.txt .

# install dependencies
#RUN pip install -r requirements.txt

# copy the content of the local service directory to the working directory
#COPY service/ .

# command to run on container start
#CMD [ "python", "./setup.py" ]

