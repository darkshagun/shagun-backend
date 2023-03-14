import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./mongoose-config.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // no need to import if `ConfigModule` is global true
      useClass: MongooseConfigService,
    }),
  ],

  exports: [MongooseModule],
})
export class DatabaseModule {}