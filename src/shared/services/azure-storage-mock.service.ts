import { Injectable } from '@nestjs/common';

@Injectable()
export class AzureStorageMockService {
    private _fileNames: string[] = [];

    constructor() {
        this._fileNames = [];
    }

    public async uploadStep(
        property: string,
        recordingSession: string,
        imageData: string,
        fileName: string
    ): Promise<string> {
        this._fileNames.push(fileName);

        return Promise.resolve(fileName);
    }

    public generateFileName(recordingSession: string): string {
        return `${recordingSession}-` + new Date().getTime();
    }

    public init(names: string[] = []): void {
        this._fileNames = names;
    }

    public fileExists(fileName: string): boolean {
        return this._fileNames.includes(fileName);
    }

    public isEmpty(): boolean {
        return this._fileNames.length === 0;
    }

    async deleteFileFromPropertyDirectory(property: string, fileName: string) {
        this._fileNames = this._fileNames.filter((files) => files !== fileName);

        return Promise.resolve(true);
    }
}
