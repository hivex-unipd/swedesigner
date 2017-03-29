package server.parser;

import org.json.*;

import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedProgram;

public class Parser {/*abstract???anche i metodi sono abstract*/
	public static ParsedProgram createParsedProgram(String jsonstring) throws JSONException{
		
		JSONArray arr = new JSONObject(jsonstring).getJSONObject("classes").getJSONArray("cells");
		JSONObject generalclass = arr.getJSONObject(0).getJSONObject("values");
		JSONArray attributes = generalclass.getJSONArray("attributes");
		
		/*String cells = Programma.getString("cells");
		JSONObject tutte_classi = new JSONObject(cells);
		
		JSONArray arr = tutte_classi.getJSONArray("cells");*/
		ParsedAttribute[] fields = new ParsedAttribute[attributes.length()];
		
		for (int i = 0; i < attributes.length(); i++){
			JSONObject attr = attributes.getJSONObject(i);
			String visibility = attr.getString("varvisib");
			String name = attr.getString("varname");
			String type = attr.getString("vartype");
			String value = null;
			if(attr.has("varvalue"))
				value = attr.getString("varvalue");
			ParsedAttribute att = new ParsedAttribute(false, visibility, type, name, value);
			fields[i] = att;
		}
		
		String class
		
		ParsedClass pclass = new ParsedClass();
		  //System.out.println(values.getJSONObject(i).getString("id"));
		
		return new ParsedProgram();};
	public void saveToDisk(String IdReq){};
}
