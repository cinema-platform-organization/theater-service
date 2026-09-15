import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { SeatRepositoryPort } from "../../domain/ports/seat.repository.port";

@Injectable()
export class UpdateSeatUsecase {
	public constructor(private readonly repository: SeatRepositoryPort) {}

	public async execute(id: string, data: { price?: number; type?: string }) {
		const existing = await this.repository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Seat not found",
			});
		}

		const patch: { price?: number; type?: string } = {};
		if (data.price !== undefined) {
			patch.price = data.price;
		}
		if (data.type !== undefined) {
			patch.type = data.type;
		}

		return this.repository.update(id, patch);
	}
}
