package server.project;

import java.util.ArrayList;
import java.util.List;

public class ParsedProgram {
	private List<ParsedType> classes = new ArrayList<ParsedType>();
	
	public void addType(ParsedType type){
		classes.add(type);
	}
	
	public int nClasses(){
		return classes.size();
	}
	
	public ParsedType getType(int i){
		return classes.get(i);
	}

}
