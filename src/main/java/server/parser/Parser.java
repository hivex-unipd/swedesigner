package server.parser;

import org.json.*;
import server.project.ParsedProgram;

public class Parser {/*abstract???anche i metodi sono abstract*/
	public static ParsedProgram createParsedProgram(String jsonstring) throws JSONException{
		
		JSONObject Programma = new JSONObject(jsonstring);
		
		JSONArray arr = Programma.getJSONArray("classes");
		
		for (int i = 0; i < arr.length(); i++)
		  System.out.println(arr.getJSONObject(i).getString("id"));
		
		return new ParsedProgram();};
	public void saveToDisk(String IdReq){};
}
