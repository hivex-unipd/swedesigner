package server.check;

import java.util.ArrayList;
import java.util.List;

//stessa struttura di JException
public class LanguageException extends Exception {
	List<String> errors = new ArrayList<String>();
	public LanguageException(List<String> errors){
		this.errors = errors;
	}
	public List<String> getErrors(){
		return errors;
	}
}
	
