import { InjectQueue } from "@nestjs/bull";
import { Controller, Post, Request, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectRepository } from "@nestjs/typeorm";
import { Queue } from "bull";
import { join } from "path";
import { Repository } from "typeorm";
import { Torrent } from "./entities/torrent.entity";
import { TorrentService } from "./torrent.service";



@Controller('torrents')
export class TorrentController {
    constructor(
        private torrentService: TorrentService,
        @InjectQueue('downloadTorrent') private downloadTorrentQueue: Queue ,
        @InjectRepository(Torrent) private torrentRepository: Repository<Torrent>
    ) {}

    @Post()
    @UseInterceptors(FileInterceptor('file', {dest: join(__dirname, '../uploads/torrents')}))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        const torrentEntity = await this.torrentService.createNewTorrent(file.path, req.user.id);

        await this.downloadTorrentQueue.add({
            torrentId: torrentEntity.id,
            userId: req.user.id
        }, { removeOnComplete: true, removeOnFail: true });
    }
}