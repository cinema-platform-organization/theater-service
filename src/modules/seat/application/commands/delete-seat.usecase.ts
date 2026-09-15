import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { ScreeningPort } from "../../domain/ports/screening.port";
import { SeatRepositoryPort } from "../../domain/ports/seat.repository.port";

@Injectable()
export class DeleteSeatUsecase {
	public constructor(
		private readonly repository: SeatRepositoryPort,
		private readonly screening: ScreeningPort,
	) {}

	public async execute(id: string) {
		const existing = await this.repository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Seat not found",
			});
		}

		const hasScreenings = await this.screening.hasUpcomingForHall(
			existing.hallId,
		);

		if (hasScreenings) {
			throw new RpcException({
				code: RpcStatus.FAILED_PRECONDITION,
				details: "Cannot delete seat: hall has upcoming screenings",
			});
		}

		await this.repository.delete(id);
	}
}
