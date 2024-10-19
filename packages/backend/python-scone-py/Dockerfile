# Idea via https://sconedocs.github.io/binary_fs/
# First stage: apply the binary-fs
FROM registry.scontain.com/sconecuratedimages/apps:python-3.7.3-alpine3.10 AS binary-fs

COPY ./src /app

# & apply scone binaryfs with SCONE_MODE=auto, as build will not have access to /dev/isgx
RUN mkdir binary-fs-dir &&  rm /usr/local/lib/python3.7/config-3.7m-x86_64-linux-gnu/libpython3.7m.a && \
    SCONE_MODE=auto scone binaryfs / /binary-fs-dir -v \
        --include '/usr/lib/python3.7/*' \
        --include '/app/*' \
        --host-path=/etc/resolv.conf \
        --host-path=/etc/hosts

# Second stage: compile the binary fs
FROM registry.scontain.com/sconecuratedimages/crosscompilers:alpine AS crosscompiler

COPY --from=binary-fs /binary-fs-dir /.

RUN scone gcc ./binary_fs_blob.s ./libbinary_fs_template.a -shared -o /libbinary-fs.so

# Third stage: patch the binaryfs into the enclave executable
FROM registry.scontain.com/sconecuratedimages/apps:python-3.7.3-alpine3.10

COPY --from=crosscompiler /libbinary-fs.so /lib/libbinary-fs.so

ENV SCONE_EXTENSIONS_PATH="/lib/libbinary-fs.so"

ENTRYPOINT ["python3", "/app/app.py"]
