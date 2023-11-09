//  make sure you have FFMPEG on your device
//  make sure you added FFMPEG_EXE as Env variable to your system and it links to the ffmpeg.exe file
const ffmpegPath = process.env["FFMPEG_EXE"];

const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const path = require('path');

const inputFolder = 'S:/recordsMp4';
const outputFolder = 'S:/recordsAvi';

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('Error reading folder:', err);
        return;
    }

    const webmFiles = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

    webmFiles.forEach(webmFile => {
        const webmFilePath = path.join(inputFolder, webmFile);
        const mp4FileName = path.basename(webmFile, path.extname(webmFile)) + '.avi';
        const mp4FilePath = path.join(outputFolder, mp4FileName);

        let totalTime = 0;

        ffmpeg()
            .input(webmFilePath)
            .output(mp4FilePath)
            .on('start', commandLine => {
                console.log(`Started ${webmFile} to ${mp4FileName}`);
              })
             .on('codecData', data => {
                totalTime = parseInt(data.duration.replace(/:/g, '')) 
             })
             .on('progress', progress => {
                const time = parseInt(progress.timemark.replace(/:/g, ''));
                const percent = (time / totalTime) * 100;
                    
                console.log(percent);
              })
            .on('end', () => {
                console.log(`Successfully converted ${webmFile} to ${mp4FileName}`);
            })
            .on('error', err => {
                console.error(`Error converting ${webmFile}:`, err);
            })
            .run();
    });
});