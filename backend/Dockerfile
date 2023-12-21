FROM nvidia/cuda:12.3.0-base-ubuntu22.04

RUN apt-get update
RUN apt-get install -y libglib2.0-0 ffmpeg libsm6 libxext6 python3.11-full
RUN apt-get -y install python3-pip

RUN pip install --upgrade pip

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install torch torchvision torchaudio
RUN ["pip", "install", "-r", "requirements.txt"]
COPY . /app/

