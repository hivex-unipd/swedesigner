package server.project;

/**
 * A {@code ParsedException} object represents
 * an exception which has occured when parsing
 * a {@code ParsedElement} object.
 */
public class ParsedException extends Exception {
	private String error;
	
	public ParsedException(String error) {
		this.error = error;
	}
	
	public String getError() {
		return error;
	}
}
