import { RpcStatus } from "@cinema-platform/common";
import type { ScreeningServiceClient } from "@cinema-platform/contracts/gen/ts/screening";
import { Inject, Injectable, type OnModuleInit } from "@nestjs/common";
import type { ClientGrpc } from "@nestjs/microservices";
import { RpcException } from "@nestjs/microservices";
import { PinoLogger } from "nestjs-pino";
import { lastValueFrom } from "rxjs";

import { ScreeningPort } from "../../domain/ports/screening.port";

@Injectable()
export class ScreeningGrpcAdapter implements ScreeningPort, OnModuleInit {
	private service: ScreeningServiceClient;

	public constructor(
		private readonly logger: PinoLogger,
		@Inject("SCREENING_PACKAGE") private readonly client: ClientGrpc,
	) {
		this.logger.setContext(ScreeningGrpcAdapter.name);
	}

	public onModuleInit() {
		this.service =
			this.client.getService<ScreeningServiceClient>("ScreeningService");
	}

	public async hasUpcomingForHall(hallId: string): Promise<boolean> {
		try {
			const res = await lastValueFrom(
				this.service.hasUpcomingScreeningsForHall({ hallId }),
			);

			return res.hasScreenings;
		} catch (error) {
			if (error instanceof RpcException) {
				throw error;
			}

			this.logger.error(
				`Failed to check screenings for hall ${hallId}:`,
				error,
			);
			throw new RpcException({
				code: RpcStatus.INTERNAL,
				details: "Failed to check screenings for hall",
			});
		}
	}

	public async hasUpcomingForTheater(theaterId: string): Promise<boolean> {
		try {
			const res = await lastValueFrom(
				this.service.hasUpcomingScreeningsForTheater({ theaterId }),
			);

			return res.hasScreenings;
		} catch (error) {
			if (error instanceof RpcException) {
				throw error;
			}

			this.logger.error(
				`Failed to check screenings for theater ${theaterId}:`,
				error,
			);
			throw new RpcException({
				code: RpcStatus.INTERNAL,
				details: "Failed to check screenings for theater",
			});
		}
	}
}
