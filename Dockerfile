FROM openjdk:8-jdk-alpine

MAINTAINER Kevin Lee <kevin.lee@microfocus.com>

COPY fod-uploader-java/v4.0.4/FodUpload.jar /FodUpload.jar
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
