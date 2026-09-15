import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { BookingPort } from "../../domain/ports/booking.port";
import { SeatRepositoryPort } from "../../domain/ports/seat.repository.port";

@Injectable()
export class GetSeatUsecase {
	public constructor(
		private readonly repository: SeatRepositoryPort,
		private readonly booking: BookingPort,
	) {}

	public async execute(id: string, screeningId?: string) {
		const seat = await this.repository.findById(id);

		if (!seat) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Seat not found",
			});
		}

		if (!screeningId) {
			return { ...seat, status: "unknown" };
		}

		const reserved = await this.booking.listReservedSeats(
			seat.hallId,
			screeningId,
		);

		return {
			...seat,
			status: reserved.includes(seat.id) ? "reserved" : "available",
		};
	}
}
