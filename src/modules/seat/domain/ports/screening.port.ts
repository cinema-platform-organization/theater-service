export abstract class ScreeningPort {
	public abstract hasUpcomingForHall(hallId: string): Promise<boolean>;
}
