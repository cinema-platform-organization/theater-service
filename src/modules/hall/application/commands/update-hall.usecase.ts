import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { HallRepositoryPort } from "../../domain/ports/hall.repository.port";

@Injectable()
export class UpdateHallUsecase {
	public constructor(private readonly repository: HallRepositoryPort) {}

	public async execute(id: string, data: { name?: string }) {
		const existing = await this.repository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Hall not found",
			});
		}

		const patch: { name?: string } = {};
		if (data.name !== undefined) patch.name = data.name;

		return this.repository.update(id, patch);
	}
}
