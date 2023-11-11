import ffmpeg from 'fluent-ffmpeg';

export function convert
(
    originalFilePath: string, 
    convertFilePath: string,
    onStart?: () => void,
    onProgress?: (progress: any, percent: number) => void,
    onEnd?: () => void,
    onError?: (error: any) => void 
)
{
    let totalTime = 0;

    ffmpeg()
        .input(originalFilePath)
        .output(convertFilePath)
        .on('start', (_commandLine: any) => {
            onStart?.();
          })
         .on('codecData', (data: { duration: string; }) => {
            totalTime = parseInt(data.duration.replace(/:/g, '')) 
         })
         .on('progress', (progress: { timemark: string; }) => {
            const time = parseInt(progress.timemark.replace(/:/g, ''));
            const percent = (time / totalTime) * 100;
                
            onProgress?.(progress, percent);
          })
        .on('end', () => {
            onEnd?.();
        })
        .on('error', (err: any) => {
            onError?.(err);
        })
        .run();    
}

export function convertAsync
(
    originalFilePath: string, 
    convertFilePath: string,
    onStart?: () => void,
    onProgress?: (progress: any, percent: number) => void,
    onEnd?: () => void,
    onError?: (error: any) => void 
): Promise<void>
{
    const promise = new Promise<void>
    (
        (resolve: (value: void) => void) =>
            convert
            (
                originalFilePath, 
                convertFilePath, 
                onStart, 
                onProgress, 
                () => { 
                    onEnd?.();
                    resolve(); 
                },
                (error) => { 
                    onError?.(error);
                    resolve(); 
                },
            )
    );

    return promise;
}