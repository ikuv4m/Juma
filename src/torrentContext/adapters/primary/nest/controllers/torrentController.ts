import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Queue } from 'bull';
import { join } from 'path';
import { TorrentService } from '../../../../torrent.service';
import { multerConfig } from '../multerConfig';

@Controller('torrents')
export class TorrentController {
  constructor(
    private torrentService: TorrentService,
    @InjectQueue('downloadTorrent') private downloadTorrentQueue: Queue,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const torrentEntity = await this.torrentService.createNewTorrent(
      file.path,
      req.user.id,
      file.originalname,
    );

    await this.downloadTorrentQueue.add(
      {
        torrentId: torrentEntity.id,
        userId: req.user.id,
      },
      { removeOnComplete: true, removeOnFail: true },
    );
  }
}