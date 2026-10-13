import { toRpcException } from "@cinema-platform/common";
import type { BookingServiceClient } from "@cinema-platform/contracts/gen/ts/booking";
import { Inject, Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

import { BookingPort } from "../../domain/ports/booking.port";

@Injectable()
export class BookingGrpcAdapter implements BookingPort, OnModuleInit {
	private readonly logger = new Logger(BookingGrpcAdapter.name);

	private service!: BookingServiceClient;

	public constructor(
		@Inject("BOOKING_PACKAGE")
		private readonly client: ClientGrpc,
	) {}

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
			this.logger.error(
				{ err: error as Error, hallId, screeningId },
				"Failed to list reserved seats",
			);
			throw toRpcException(error, "Failed to list reserved seats");
		}
	}
}
