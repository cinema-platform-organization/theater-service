import { Module } from "@nestjs/common";

import { CreateTheaterUsecase } from "../application/commands/create-theater.usecase";
import { GetTheaterUsecase } from "../application/queries/get-theater.usecase";
import { ListTheatersUsecase } from "../application/queries/list-theaters.usecase";
import { TheaterRepositoryPort } from "../domain/ports/theater.repository.port";
import { TheaterGrpcController } from "../interfaces/grpc/theater.grpc.controller";

import { TheaterPrismaRepository } from "./prisma/theater.prisma.repository";

@Module({
	controllers: [TheaterGrpcController],
	providers: [
		{
			provide: TheaterRepositoryPort,
			useClass: TheaterPrismaRepository,
		},
		ListTheatersUsecase,
		GetTheaterUsecase,
		CreateTheaterUsecase,
	],
})
export class TheaterModule {}
