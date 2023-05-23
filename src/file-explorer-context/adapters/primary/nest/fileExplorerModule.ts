import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { preventDirectoryTraversalMiddleware } from './directoryTraversalPreventing.middleware';
import { FileExplorerController } from './controllers/fileExplorerController';
import { FileSystemStorageGateway } from '../../secondary/gateways/fileStorage/fileSystemStorageGateway';
import { FileStorageGateway } from '../../../hexagon/gateways/fileStorageGateway';
import { CreateFolder } from '../../../hexagon/useCases/folderCreation/createFolder';
import { RetrieveFolderContent } from '../../../hexagon/useCases/folderContentRetrieval/retrieveFolderContent';
import { CopyFile } from '../../../hexagon/useCases/folderCopying/copyFile';
import { DeleteFile } from '../../../hexagon/useCases/folderDeletion/deleteFile';
import { DownloadFile } from '../../../hexagon/useCases/fileDownloading/downloadFile';

@Module({
  controllers: [FileExplorerController],
  providers: [
    {
      provide: CreateFolder,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new CreateFolder(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
    {
      provide: DownloadFile,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new DownloadFile(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
    {
      provide: DeleteFile,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new DeleteFile(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
    {
      provide: CopyFile,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new CopyFile(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
    {
      provide: RetrieveFolderContent,
      useFactory: (fileStorageGateway: FileStorageGateway) => {
        return new RetrieveFolderContent(fileStorageGateway);
      },
      inject: ['FileStorageGateway'],
    },
    {
      provide: 'FileStorageGateway',
      useClass: FileSystemStorageGateway,
    },
  ],
})
export class FileExplorerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(preventDirectoryTraversalMiddleware).forRoutes('fs');
  }
}
