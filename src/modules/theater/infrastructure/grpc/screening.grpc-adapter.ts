import { toRpcException } from "@cinema-platform/common";
import type { ScreeningServiceClient } from "@cinema-platform/contracts/gen/ts/screening";
import { Inject, Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";

import { ScreeningPort } from "../../domain/ports/screening.port";

@Injectable()
export class ScreeningGrpcAdapter implements ScreeningPort, OnModuleInit {
	private readonly logger = new Logger(ScreeningGrpcAdapter.name);

	private service!: ScreeningServiceClient;

	public constructor(
		@Inject("SCREENING_PACKAGE") private readonly client: ClientGrpc,
	) {}

	public onModuleInit() {
		this.service =
			this.client.getService<ScreeningServiceClient>("ScreeningService");
	}

	public async hasUpcomingForHall(hallId: string): Promise<boolean> {
		try {
			const res = await lastValueFrom(
				this.service.hasUpcomingScreeningsForHall({ hallId }),
			);

			return res.hasScreenings ?? false;
		} catch (error) {
			this.logger.error(
				{ err: error as Error, hallId },
				"Failed to check screenings for hall",
			);

			throw toRpcException(error, "Failed to check screenings for hall");
		}
	}

	public async hasUpcomingForTheater(theaterId: string): Promise<boolean> {
		try {
			const res = await lastValueFrom(
				this.service.hasUpcomingScreeningsForTheater({ theaterId }),
			);

			return res.hasScreenings ?? false;
		} catch (error) {
			this.logger.error(
				{ err: error as Error, theaterId },
				"Failed to check screenings for theater",
			);

			throw toRpcException(
				error,
				"Failed to check screenings for theater",
			);
		}
	}
}
