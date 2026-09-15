import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { HallRepositoryPort } from "../../domain/ports/hall.repository.port";
import { ScreeningPort } from "../../domain/ports/screening.port";

@Injectable()
export class DeleteHallUsecase {
	public constructor(
		private readonly repository: HallRepositoryPort,
		private readonly screeningPort: ScreeningPort,
	) {}

	public async execute(id: string) {
		const existing = await this.repository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Hall not found",
			});
		}

		const hasScreenings = await this.screeningPort.hasUpcomingForHall(id);

		if (hasScreenings) {
			throw new RpcException({
				code: RpcStatus.FAILED_PRECONDITION,
				details: "Cannot delete hall with upcoming screenings",
			});
		}

		await this.repository.delete(id);
	}
}
