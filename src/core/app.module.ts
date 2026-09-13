import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";

import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { HallModule } from "@/modules/hall/infrastructure/hall.module";
import { SeatModule } from "@/modules/seat/infrastructure/seat.module";
import { TheaterModule } from "@/modules/theater/infrastructure/theater.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				".env",
			],
		}),
		LoggerModule.forRoot(),
		PrismaModule,
		TheaterModule,
		HallModule,
		SeatModule,
	],
})
export class AppModule {}
