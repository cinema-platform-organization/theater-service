import type {
	DeleteSeatRequest,
	DeleteSeatResponse,
	GetSeatRequest,
	GetSeatResponse,
	ListSeatsRequest,
	ListSeatsResponse,
	UpdateSeatRequest,
	UpdateSeatResponse,
} from "@cinema-platform/contracts/gen/ts/seat";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

import { DeleteSeatUsecase } from "../../application/commands/delete-seat.usecase";
import { UpdateSeatUsecase } from "../../application/commands/update-seat.usecase";
import { GetSeatUsecase } from "../../application/queries/get-seat.usecase";
import { ListSeatsUsecase } from "../../application/queries/list-seats.usecase";

@Controller()
export class SeatGrpcController {
	public constructor(
		private readonly listUC: ListSeatsUsecase,
		private readonly getUC: GetSeatUsecase,
		private readonly updateUC: UpdateSeatUsecase,
		private readonly deleteUC: DeleteSeatUsecase,
	) {}

	@GrpcMethod("SeatService", "GetSeat")
	public async getById(data: GetSeatRequest): Promise<GetSeatResponse> {
		const seat = await this.getUC.execute(data.id);

		return { seat };
	}

	@GrpcMethod("SeatService", "ListSeatsByHall")
	public async list(data: ListSeatsRequest): Promise<ListSeatsResponse> {
		const seats = await this.listUC.execute(data.hallId, data.screeningId);

		return { seats };
	}

	@GrpcMethod("SeatService", "UpdateSeat")
	public async update(data: UpdateSeatRequest): Promise<UpdateSeatResponse> {
		const seat = await this.updateUC.execute(data.id, {
			price: data.price,
			type: data.type,
		});

		return { seat };
	}

	@GrpcMethod("SeatService", "DeleteSeat")
	public async delete(data: DeleteSeatRequest): Promise<DeleteSeatResponse> {
		await this.deleteUC.execute(data.id);

		return { ok: true };
	}
}
