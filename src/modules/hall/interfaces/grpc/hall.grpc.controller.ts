import type {
	CreateHallRequest,
	DeleteHallRequest,
	DeleteHallResponse,
	GetHallRequest,
	ListHallsRequest,
	ListHallsResponse,
	UpdateHallRequest,
	UpdateHallResponse,
} from "@cinema-platform/contracts/gen/ts/hall";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { CreateHallUsecase } from "../../application/commands/create-hall.usecase";
import { DeleteHallUsecase } from "../../application/commands/delete-hall.usecase";
import { UpdateHallUsecase } from "../../application/commands/update-hall.usecase";
import { GetHallUsecase } from "../../application/queries/get-hall.usecase";
import { ListHallsUsecase } from "../../application/queries/list-halls.usecase";

@Controller()
export class HallGrpcController {
	public constructor(
		private readonly listUC: ListHallsUsecase,
		private readonly getUC: GetHallUsecase,
		private readonly createUC: CreateHallUsecase,
		private readonly updateUC: UpdateHallUsecase,
		private readonly deleteUC: DeleteHallUsecase,
	) {}

	@GrpcMethod("HallService", "CreateHall")
	public async create(data: CreateHallRequest) {
		const hall = await this.createUC.execute(data);

		return { hall };
	}

	@GrpcMethod("HallService", "GetHall")
	public async getById(data: GetHallRequest) {
		const hall = await this.getUC.execute(data.id);

		return { hall };
	}

	@GrpcMethod("HallService", "ListHallsByTheater")
	public async list(data: ListHallsRequest): Promise<ListHallsResponse> {
		const halls = await this.listUC.execute(data.theaterId);

		return { halls };
	}

	@GrpcMethod("HallService", "UpdateHall")
	public async update(data: UpdateHallRequest): Promise<UpdateHallResponse> {
		const hall = await this.updateUC.execute(data.id, { name: data.name });

		return { hall };
	}

	@GrpcMethod("HallService", "DeleteHall")
	public async delete(data: DeleteHallRequest): Promise<DeleteHallResponse> {
		await this.deleteUC.execute(data.id);

		return { ok: true };
	}
}
