import { Injectable } from "@nestjs/common";

import { SeatRepositoryPort } from "../../domain/ports/seat.repository.port";

@Injectable()
export class ListSeatsUsecase {
	public constructor(private readonly repository: SeatRepositoryPort) {}

	public async execute(hallId: string, screeningId: string) {
		const seats = await this.repository.findByHall(hallId);

		// CHANGE LATER TO USE BOOKING SERVICE
		return seats.map(seat => ({
			...seat,
			status: "available",
		}));
	}
}
