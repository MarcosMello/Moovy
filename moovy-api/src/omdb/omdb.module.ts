import { Module } from '@nestjs/common';
import { OmdbController } from './omdb.controller';
import { HttpModule } from '@nestjs/axios';
import { OmdbService } from './omdb.service';

@Module({
  imports: [HttpModule],
  controllers: [OmdbController],
  providers: [OmdbService],
})
export class OmdbModule {}
