FROM iexechub/iexec-gramine-base:0.10.0

### Install python and required dependencies
RUN apt-get update \
    && apt-get install -y python3 \
    && rm -rf /var/lib/apt/lists/*

# get the code of app to /workplace/app
COPY ./main.py /workplace/app

# set the main function for python and node app, no need for binnary app
RUN sed -i "s|MAIN_FUNC=|MAIN_FUNC=/workplace/app/main.py|" /apploader.sh

WORKDIR /workplace/app

# Copy the manifest to use from within the base image
# or create your own
RUN cp /common-manifests/python.entrypoint.manifest /entrypoint.manifest

# Finalize app (finalize manifest and sign app)
RUN /finalize-app.sh
