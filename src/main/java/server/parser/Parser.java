package server.parser;

import server.project.ParsedProgram;

public class Parser {/*abstract???anche i metodi sono abstract*/
	public ParsedProgram createParsedProgram(String jsonstring){
		return new ParsedProgram();};
	public void saveToDisk(String IdReq){};
}
