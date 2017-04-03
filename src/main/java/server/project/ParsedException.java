package server.project;

public class ParsedException extends Exception {
	private String error;
	
	public ParsedException(String error){
		this.error = error;
	}
	
	public String getError(){
		return error;
	}
}
