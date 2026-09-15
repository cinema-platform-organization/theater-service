import { PROTO_PATHS } from "@cinema-platform/contracts";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { CreateHallUsecase } from "../application/commands/create-hall.usecase";
import { DeleteHallUsecase } from "../application/commands/delete-hall.usecase";
import { UpdateHallUsecase } from "../application/commands/update-hall.usecase";
import { GetHallUsecase } from "../application/queries/get-hall.usecase";
import { ListHallsUsecase } from "../application/queries/list-halls.usecase";
import { HallRepositoryPort } from "../domain/ports/hall.repository.port";
import { ScreeningPort } from "../domain/ports/screening.port";
import { HallGrpcController } from "../interfaces/grpc/hall.grpc.controller";

import { ScreeningGrpcAdapter } from "./grpc/screening.grpc-adapter";
import { HallPrismaRepository } from "./prisma/hall.prisma.repository";

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
	controllers: [HallGrpcController],
	providers: [
		ListHallsUsecase,
		GetHallUsecase,
		CreateHallUsecase,
		UpdateHallUsecase,
		DeleteHallUsecase,
		{ provide: HallRepositoryPort, useClass: HallPrismaRepository },
		{ provide: ScreeningPort, useClass: ScreeningGrpcAdapter },
	],
})
export class HallModule {}
