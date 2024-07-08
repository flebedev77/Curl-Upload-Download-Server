# CUDS
## Curl Upload Download Server
---

Prerequisites:
    - (Node.js)[https://nodejs.org]
    - (NPMjs)[https://npmjs.org]
    - (Git (recommended))[https://git-scm.org]
    - (curl)[https://curl.se]

Setup:
    - Download repo `git clone https://github.com/flebedev77/Curl-Upload-Download-Server.git`
    - Start the server `node .` or `node index.js`

> [!NOTE]
This server does not support any directory structure, it stores all of the uploaded files in the `files` directory in the root of the project.

Uploading:
    - Run `curl -d "$(cat filename.sh)" 192.168.1.120:8080` Where `filename.sh` is the filename of the file you want to upload, and `192.168.1.120` is the ip address of the server

Downloading:
    - Run `curl 192.168.1.120:8080/0 > output.txt` Where `192.168.1.120` is the ip address of the server, and the zero after the `/`, `.168.1.120:8080/0` <----- is the id of the file, you can find the id in the `files/` directory. Or you can get the id from uploading.