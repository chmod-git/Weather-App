package forecast.exception;

public class InternalServerException extends RuntimeException {

	private static final long serialVersionUID = -630290072771072314L;
	
	public InternalServerException(String message) {
		super(message);
	}
	
}
