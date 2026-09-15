import { PROTO_PATHS } from "@cinema-platform/contracts";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { DeleteSeatUsecase } from "../application/commands/delete-seat.usecase";
import { UpdateSeatUsecase } from "../application/commands/update-seat.usecase";
import { GetSeatUsecase } from "../application/queries/get-seat.usecase";
import { ListSeatsUsecase } from "../application/queries/list-seats.usecase";
import { BookingPort } from "../domain/ports/booking.port";
import { ScreeningPort } from "../domain/ports/screening.port";
import { SeatRepositoryPort } from "../domain/ports/seat.repository.port";
import { SeatGrpcController } from "../interfaces/grpc/seat.grpc.controller";

import { BookingGrpcAdapter } from "./grpc/booking.grpc.adapter";
import { ScreeningGrpcAdapter } from "./grpc/screening.grpc-adapter";
import { SeatPrismaRepository } from "./prisma/seat.prisma.repository";

@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: "BOOKING_PACKAGE",
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: "booking.v1",
						protoPath: PROTO_PATHS.BOOKING,
						url: configService.getOrThrow<string>(
							"BOOKING_GRPC_URL",
						),
					},
				}),
				inject: [ConfigService],
			},
			{
				name: "SCREENING_PACKAGE",
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: "screening.v1",
						protoPath: PROTO_PATHS.SCREENING,
						url: configService.getOrThrow<string>(
							"SCREENING_GRPC_URL",
						),
					},
				}),
				inject: [ConfigService],
			},
		]),
	],
	controllers: [SeatGrpcController],
	providers: [
		{
			provide: SeatRepositoryPort,
			useClass: SeatPrismaRepository,
		},
		{
			provide: BookingPort,
			useClass: BookingGrpcAdapter,
		},
		{
			provide: ScreeningPort,
			useClass: ScreeningGrpcAdapter,
		},
		ListSeatsUsecase,
		GetSeatUsecase,
		UpdateSeatUsecase,
		DeleteSeatUsecase,
	],
})
export class SeatModule {}
