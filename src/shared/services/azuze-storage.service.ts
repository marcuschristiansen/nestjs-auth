import { SharedKeyCredential } from '@azure/storage-file';
import { Injectable } from '@nestjs/common';

import {
    Aborter,
    FileURL,
    DirectoryURL,
    ShareURL,
    ServiceURL,
    StorageURL,
} from '@azure/storage-file';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureStorageService {
    private serviceURL: ServiceURL;
    private shareURL: ShareURL;

    constructor(private configService: ConfigService) {
        // Enter your storage account name and shared key
        const account = this.configService.get<string>('azure.storage.account');
        const key = this.configService.get<string>('azure.storage.key');

        // Use SharedKeyCredential with storage account and account key
        const sharedKeyCredential: any = new SharedKeyCredential(account, key);

        // Use sharedKeyCredential to create a pipeline
        const pipeline = StorageURL.newPipeline(sharedKeyCredential);

        this.serviceURL = new ServiceURL(
            // When using AnonymousCredential, following url should include a valid SAS
            `https://${account}.file.core.windows.net`,
            pipeline
        );

        // Create a share
        const shareName = `pdfexport`;
        this.shareURL = ShareURL.fromServiceURL(this.serviceURL, shareName);
        this.shareURL.create(Aborter.none).catch(() => null);
    }

    generateFileName(recordingSession: string): string {
        return `${recordingSession}-` + new Date().getTime();
    }

    async uploadStep(
        property: string,
        recordingSession: string,
        imageData: string,
        fileName: string
    ) {
        // Create a directory if not exists
        const directoryName = property;
        const directoryURL = DirectoryURL.fromShareURL(this.shareURL, directoryName);
        await directoryURL.create(Aborter.none).catch(() => {
            console.log(`Directory: '${directoryName}' already exists`);
        });

        // Create a file
        const content = imageData;
        const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName);
        await fileURL.create(Aborter.none, content.length);

        // Upload file
        await fileURL.uploadRange(Aborter.none, content, 0, content.length);

        // List directories and files
        console.log(`List directories and files under directory ${directoryName}`);
        let marker = undefined;
        do {
            const listFilesAndDirectoriesResponse = await directoryURL.listFilesAndDirectoriesSegment(
                Aborter.none,
                marker
            );

            marker = listFilesAndDirectoriesResponse.nextMarker;
            for (const file of listFilesAndDirectoriesResponse.segment.fileItems) {
                console.log(`\tFile: ${file.name}`);
            }
            for (const directory of listFilesAndDirectoriesResponse.segment.directoryItems) {
                console.log(`\tDirectory: ${directory.name}`);
            }
        } while (marker);

        return fileName;
    }

    /**
     * Deletes a file from the directory for the property
     * @param property
     * @param fileName
     */
    async deleteFileFromPropertyDirectory(property: string, fileName: string) {
        const directoryURL = DirectoryURL.fromShareURL(this.shareURL, property);
        const fileURL = FileURL.fromDirectoryURL(directoryURL, fileName);

        return fileURL.delete(Aborter.none);
    }

    private async streamToString(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on('data', (data) => {
                chunks.push(data.toString());
            });
            readableStream.on('end', () => {
                resolve(chunks.join(''));
            });
            readableStream.on('error', reject);
        });
    }
}
