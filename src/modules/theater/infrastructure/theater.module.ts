import { PROTO_PATHS } from "@cinema-platform/contracts";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CreateTheaterUsecase } from "../application/commands/create-theater.usecase";
import { DeleteTheaterUsecase } from "../application/commands/delete-theater.usecase";
import { UpdateTheaterUsecase } from "../application/commands/update-theater.usecase";
import { GetTheaterUsecase } from "../application/queries/get-theater.usecase";
import { ListTheatersUsecase } from "../application/queries/list-theaters.usecase";
import { ScreeningPort } from "../domain/ports/screening.port";
import { TheaterRepositoryPort } from "../domain/ports/theater.repository.port";
import { TheaterGrpcController } from "../interfaces/grpc/theater.grpc.controller";

import { ScreeningGrpcAdapter } from "./grpc/screening.grpc-adapter";
import { TheaterPrismaRepository } from "./prisma/theater.prisma.repository";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "SCREENING_PACKAGE",
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: "screening.v1",
						protoPath: PROTO_PATHS.SCREENING,
						url: configService.get<string>("SCREENING_GRPC_URL"),
					},
				}),
			},
		]),
	],
	controllers: [TheaterGrpcController],
	providers: [
		{
			provide: TheaterRepositoryPort,
			useClass: TheaterPrismaRepository,
		},
		{
			provide: ScreeningPort,
			useClass: ScreeningGrpcAdapter,
		},
		ListTheatersUsecase,
		GetTheaterUsecase,
		CreateTheaterUsecase,
		UpdateTheaterUsecase,
		DeleteTheaterUsecase,
	],
})
export class TheaterModule {}
