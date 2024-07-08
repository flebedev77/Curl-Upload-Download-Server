const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.method == "POST") {
        console.log("UPLOAD");
        let filename;
        try {
            filename = Number(fs.readdirSync(__dirname + "/files").sort((a, b) => Number(a) - Number(b)).last()) + 1;
            console.log(filename);
        } catch (e) {
            console.log("Error reading directory /files");
            console.log("Creating new /files dir");
            try {
                fs.mkdirSync(__dirname + "/files");
            } catch (e) {
                console.log("Error making directory... Closing connection");
                req.end("Error creating/reading dir 'files'");
                process.exit(1);
            }
        }
        const writeStream = fs.createWriteStream(__dirname + "/files/" + filename);
        req.pipe(writeStream);

        req.on("data", (chunk) => {
            console.log(Buffer.from(chunk, "utf-8").byteLength + " Bytes received from " + req.socket.remoteAddress.replaceAll("::ffff:", "") + " " + ((Buffer.from(chunk, "utf-8").byteLength / Number(req.headers["content-length"])) * 100).toFixed(2) + "%");
        })
        req.on("end", () => {
            console.log(req.headers["content-length"] + " Bytes received from " + req.socket.remoteAddress.replaceAll("::ffff:", "") + " " + 100 + "%");
            console.log("Done. Received " + req.headers["content-length"] + " Bytes");
            res.end("Data Sucessfully received, your file number is " + filename + ", so that would be " + req.headers.origin + "/" + filename);
        })
    } else {
        console.log("DOWNLOAD");
        const filename = req.url.replaceAll("/", "");

        if (!fs.existsSync(__dirname + "/files/" + filename)) {
            console.log("File requested dosen't exist");
            return;
        } else {
            const filesize = fs.statSync(__dirname + "/files/" + filename).size;
            const readStream = fs.createReadStream(__dirname + "/files/" + filename);

            readStream.pipe(res);

            readStream.on("data", (chunk) => {
                console.log(Buffer.from(chunk, "utf-8").byteLength + " Bytes sent to " + req.socket.remoteAddress.replaceAll("::ffff:", "") + " " + ((Buffer.from(chunk, "utf-8").byteLength / Number(filesize)) * 100).toFixed(2) + "%");
            })
            readStream.on("end", () => {
                console.log(filesize + " Bytes sent to " + req.socket.remoteAddress.replaceAll("::ffff:", "") + " " + 100 + "%");
                console.log("Done. Sent " + filesize + " Bytes");
                res.end("");
            })
        }
    }
})

server.listen(8080, console.log("Server listening on port 8080"));

Array.prototype.last = function () {
    return this.slice(-1)[0];
}