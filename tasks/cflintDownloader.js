"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var download = require("download");
var url = require("url");
var downloadCflint = function (cflintDownloadUrl, downloadFinishedCallback) {
    try {
        var downloadUrl = url.parse(cflintDownloadUrl);
        var cflintJarFilename_1 = "cflint.jar";
        //const cflintJarFilename = "cflint/cflint.jar";
        //!fs.existsSync('cflint') && fs.mkdirSync('cflint');
        if (fs.existsSync(cflintJarFilename_1)) {
            console.log("cflint.jar already exists");
            downloadFinishedCallback();
        }
        else {
            console.log("Downloading cflint.jar from:");
            console.log(downloadUrl);
            switch (downloadUrl.protocol) {
                case "file:":
                    var downloadPath = url.fileURLToPath ? url.fileURLToPath(downloadUrl.href) : downloadUrl.href.slice(5);
                    console.log("Copying file from '".concat(downloadPath, "'"));
                    fs.copyFile(downloadPath, cflintJarFilename_1, function (err) { return downloadFinishedCallback(err); });
                    break;
                case "http:":
                case "https:":
                    download(downloadUrl.href).then(function (data) { return fs.writeFile(cflintJarFilename_1, data, function (err) { return downloadFinishedCallback(err); }); });
                    break;
                default:
                    console.log("Copying file from '".concat(downloadUrl.href, "'"));
                    fs.copyFile(downloadUrl.href, cflintJarFilename_1, function (err) { return downloadFinishedCallback(err); });
                    break;
            }
        }
    }
    catch (err) {
        downloadFinishedCallback(err);
    }
};
exports.default = downloadCflint;
