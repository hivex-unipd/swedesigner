package server.parser;

import java.util.ArrayList;
import java.util.List;

public class JException extends Exception {
	private List<String> errors = new ArrayList<String>();
	public JException(List<String> errors){
		this.errors = errors;
	}
	public List<String> getErrors(){
		return errors;
	}
}
