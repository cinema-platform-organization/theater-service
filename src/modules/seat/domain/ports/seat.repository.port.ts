import { SeatEntity } from "../entities/seat.entity";

export abstract class SeatRepositoryPort {
	public abstract findById(id: string): Promise<SeatEntity | null>;
	public abstract findByHall(hallId: string): Promise<SeatEntity[]>;
	public abstract update(
		id: string,
		data: { price?: number; type?: string },
	): Promise<SeatEntity>;
	public abstract delete(id: string): Promise<void>;
}
