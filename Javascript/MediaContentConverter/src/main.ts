import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import './common/readline';
import { convertAsync } from './convert';

export { };

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

async function handleFiles
(
    sourceFileExtension: string, 
    inputDirectory: string, 
    destinationFileExtension: string, 
    outputDirectory: string
)
{
    if ( ! fs.existsSync(outputDirectory))
        fs.mkdirSync(outputDirectory);

    const files = await fs.promises.readdir(inputDirectory);
    const sourceFiles = files.filter(file => path.extname(file).toLowerCase() === `.${sourceFileExtension}`);

    for (const sourceFile of sourceFiles) 
    {
        const sourceFilePath = path.join(inputDirectory, sourceFile);
        const destinationFileName = path.basename(sourceFile, path.extname(sourceFile)) + `.${destinationFileExtension}`;
        const destinationFilePath = path.join(outputDirectory, destinationFileName);

        await convertAsync
        (
            sourceFilePath, 
            destinationFilePath,
            () => console.log(`File: ${sourceFilePath}`),
            (_progress, percent) => console.log(`Percent: ${percent}%, File: ${sourceFilePath}`),
            () => console.log(`Completed File: ${sourceFilePath}`),
            (error) => console.error(`Error: ${error}, File: ${sourceFilePath}`),
        );
    }
}

async function body()
{
    try
    {
        const sourceFileExtension = await readlineInterface.questionAsync("Enter source file extension: ");
        const inputDirectory = await readlineInterface.questionAsync("Enter input directory: ");
        const destinationFileExtension = await readlineInterface.questionAsync("Enter destination file extension: ");
        const outputDirectory = await readlineInterface.questionAsync("Enter output directory: ");
    
        await handleFiles(sourceFileExtension, inputDirectory, destinationFileExtension, outputDirectory);
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