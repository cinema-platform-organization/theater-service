import { RpcStatus } from "@cinema-platform/common";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

import { TheaterRepositoryPort } from "../../domain/ports/theater.repository.port";

@Injectable()
export class UpdateTheaterUsecase {
	public constructor(private readonly repository: TheaterRepositoryPort) {}

	public async execute(
		id: string,
		data: { name?: string; address?: string },
	) {
		const existing = await this.repository.findById(id);

		if (!existing) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: "Theater not found",
			});
		}

		const patch: { name?: string; address?: string } = {};
		if (data.name !== undefined) patch.name = data.name;
		if (data.address !== undefined) patch.address = data.address;

		return this.repository.update(id, patch);
	}
}
