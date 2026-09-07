import { Module } from "@nestjs/common";

import { GetSeatUsecase } from "../application/queries/get-seat.usecase";
import { ListSeatsUsecase } from "../application/queries/list-seats.usecase";
import { SeatRepositoryPort } from "../domain/ports/seat.repository.port";
import { SeatGrpcController } from "../interfaces/grpc/seat.grpc.controller";

import { SeatPrismaRepository } from "./prisma/seat.prisma.repository";

@Module({
	controllers: [SeatGrpcController],
	providers: [
		{
			provide: SeatRepositoryPort,
			useClass: SeatPrismaRepository,
		},
		ListSeatsUsecase,
		GetSeatUsecase,
	],
})
export class SeatModule {}
