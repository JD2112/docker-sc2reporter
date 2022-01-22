FROM python:3.8-slim-bullseye

# Install needed programs.
RUN apt-get update && \
    apt-get install -y \
        gcc

# Numpy must apparently be installed before scikit-bio.
RUN pip install numpy

# Copy only the requirements file and install them all.
COPY /sc2reporter/requirements.txt /requirements.txt
RUN pip install -r requirements.txt

# Copy the entire application into an "app" folder, and use that as workdir
# going forward.
COPY /sc2reporter /app
WORKDIR /app

# Make Gunicorn the entrypoint program, and then feed it appropriate arguments.
ENTRYPOINT [ "gunicorn" ]
CMD [ "-b", ":8000", "sc2reporter:application" ]
