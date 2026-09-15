export abstract class ScreeningPort {
	public abstract hasUpcomingForHall(hallId: string): Promise<boolean>;
	public abstract hasUpcomingForTheater(theaterId: string): Promise<boolean>;
}
