import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { ScreeningPort } from "../../domain/ports/screening.port";
import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";

@Injectable()
export class DeleteTheaterUsecase {
	public constructor(
		private readonly repository: TheaterRepositoryPort,
		private readonly screeningPort: ScreeningPort,
	) {}

	public async execute(id: string) {
		const existing = await this.repository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Theater not found",
			});
		}

		const hasScreenings =
			await this.screeningPort.hasUpcomingForTheater(id);

		if (hasScreenings) {
			throw new RpcException({
				code: RpcStatus.FAILED_PRECONDITION,
				details: "Cannot delete theater with upcoming screenings",
			});
		}

		await this.repository.delete(id);
	}
}
