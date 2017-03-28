package server.project;

public class ParsedProgram {
	private ParsedType[] classes = new ParsedType[10];
	private int n_classes = 0;
	
	public void addType(ParsedType type){
		classes[n_classes] = type;
		n_classes++;
	}
	
	public int nClasses(){
		return n_classes;
	}
	
	public ParsedType getType(int i){
		return classes[i];
	}

}
