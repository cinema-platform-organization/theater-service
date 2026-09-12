import { RpcStatus } from "@cinema-platform/common";
import type { BookingServiceClient } from "@cinema-platform/contracts/gen/ts/booking";
import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { RpcException } from "@nestjs/microservices";
import { PinoLogger } from "nestjs-pino";
import { lastValueFrom } from "rxjs";

import { BookingPort } from "../../domain/ports/booking.port";

@Injectable()
export class BookingGrpcAdapter implements BookingPort, OnModuleInit {
	private service!: BookingServiceClient;

	public constructor(
		private readonly logger: PinoLogger,
		@Inject("BOOKING_PACKAGE")
		private readonly client: ClientGrpc,
	) {
		this.logger.setContext(BookingGrpcAdapter.name);
	}

	public onModuleInit() {
		this.service =
			this.client.getService<BookingServiceClient>("BookingService");
	}

	public async listReservedSeats(
		hallId: string,
		screeningId: string,
	): Promise<string[]> {
		try {
			const res = await lastValueFrom(
				this.service.listReservedSeats({ hallId, screeningId }),
			);

			return res?.reservedSeatIds ?? [];
		} catch (error) {
			if (error instanceof RpcException) {
				throw error;
			}

			this.logger.error(
				`Failed to list reserved seats for hall ${hallId} and screening ${screeningId}:`,
				error,
			);
			throw new RpcException({
				code: RpcStatus.INTERNAL,
				details: "Failed to list reserved seats",
			});
		}
	}
}
