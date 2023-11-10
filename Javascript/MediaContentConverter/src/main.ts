import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import readline from 'readline';
import { convert } from './convert';

//  make sure you have FFMPEG on your device
//  make sure you added FFMPEG_EXE as Env variable to your system and it links to the ffmpeg.exe file
const ffmpegPath = process.env["FFMPEG_EXE"]!;
ffmpeg.setFfmpegPath(ffmpegPath);

const readlineInterface = readline.createInterface
(
    {
        input: process.stdin,
        output: process.stdout
    }
);

function question(text: string): Promise<string>
{
    let promise = new Promise<string>
    (
        (resolve: (payload: string) => void) => 
            readlineInterface.question(text, (answer) => { resolve(answer) })
    );

    return promise;
}

function handleFiles
(
    sourceFileExtension: string, 
    inputDirectory: string, 
    destinationFileExtension: string, 
    outputDirectory: string
)
{
    if ( ! fs.existsSync(outputDirectory))
    fs.mkdirSync(outputDirectory);

    fs.readdir
    (
        inputDirectory, 
        (error, files) => 
        {
            if (error) 
            {
                console.error('Error reading directory:', error);
                return;
            }

            const sourceFiles = files.filter(file => path.extname(file).toLowerCase() === `.${sourceFileExtension}`);

            sourceFiles.forEach
            (
                (webmFile: string) => 
                {
                    const sourceFilePath = path.join(inputDirectory, webmFile);
                    const destinationFileName = path.basename(webmFile, path.extname(webmFile)) + `.${destinationFileExtension}`;
                    const destinationFilePath = path.join(outputDirectory, destinationFileName);

                    convert(sourceFilePath, destinationFilePath);
                }
            );
        }
    );
}

async function body()
{
    try
    {
        const sourceFileExtension = await question("Enter source file extension: ");
        const inputDirectory = await question("Enter input directory: ");
        const destinationFileExtension = await question("Enter destination file extension: ");
        const outputDirectory = await question("Enter output directory: ");
    
        handleFiles(sourceFileExtension, inputDirectory, destinationFileExtension, outputDirectory);
    }
    
    catch (error)
    {
        console.error(error);
    }
    
    finally
    {
        readlineInterface.close();
    }
}

body();