package server.parser;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.*;

import server.project.ParsedAssignment;
import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedCustom;
import server.project.ParsedFor;
import server.project.ParsedIf;
import server.project.ParsedInitialization;
import server.project.ParsedInstruction;
import server.project.ParsedProgram;
import server.project.ParsedReturn;
import server.project.ParsedWhile;

public class Parser {/*abstract???anche i metodi sono abstract*/
	public static ParsedProgram createParsedProgram(String jsonstring) throws JSONException{
		
		ParsedProgram pp = new ParsedProgram();
		
		JSONArray arr = new JSONObject(jsonstring).getJSONObject("classes").getJSONArray("cells");
		JSONArray meths = new JSONObject(jsonstring).getJSONArray("methods");
		
		HashMap<String, List<ParsedInstruction>> meth = new HashMap<String, List<ParsedInstruction>>();
		
		for(int i = 0; i<meths.length(); i++){
			JSONObject jmeth = meths.getJSONObject(i);
			String id = jmeth.getString("id");
			JSONArray jblocks = jmeth.getJSONArray("cells");
			List<ParsedInstruction> value = new ArrayList<ParsedInstruction>();
			for(int j = 0; j < jblocks.length(); j++){
				JSONObject external = jblocks.getJSONObject(j);
				if(!external.has("parent")){
					//inizio ricorsione
					ParsedInstruction k = Parser.recursiveBuilder(external, jblocks, 0);
					value.add(k);
				}
			}
			
			//
		}
		
		
		List<JSONObject> methods = new ArrayList<JSONObject>();
		List<JSONObject> classes = new ArrayList<JSONObject>();
		int i=0;
		boolean isclass = true;
		while(i<arr.length()&&isclass){
			String s = arr.getJSONObject(i).getString("type");
			if(s=="uml.Class" || s=="uml.interface"){
				//classes.put(arr.getJSONObject(i));
				i++;
			}
			else
				isclass = false;
		}
		//POST: all'uscita i è tale che o i>=arr.length (ci sono solo classi) o i è l'indice di arr dove si trova la prima relazione;
		
		/*while(i<arr.length){
			
		}*/
			
			
			
			
			
			
		JSONObject generalclass = arr.getJSONObject(0).getJSONObject("values");
		JSONArray attributes = generalclass.getJSONArray("attributes");
		
		/*String cells = Programma.getString("cells");
		JSONObject tutte_classi = new JSONObject(cells);
		
		JSONArray arr = tutte_classi.getJSONArray("cells");*/
		ParsedAttribute[] fields = new ParsedAttribute[attributes.length()];
		
		for (i = 0; i < attributes.length(); i++){
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
		
		String classname =generalclass.getString("name");
		
		
		//ParsedClass pclass = new ParsedClass();
		  //System.out.println(values.getJSONObject(i).getString("id"));
		
		return new ParsedProgram();};
		
		
	//String = instruction.getString("");	
	private static ParsedInstruction recursiveBuilder(JSONObject instruction, JSONArray jblocks, int i) throws JSONException{
		String type = instruction.getString("type");
		ParsedInstruction currentinst;
		switch(type){
			case "uml.assignment" : {
				currentinst = new ParsedAssignment(instruction.getString("name"), instruction.getString("value"));
			}
			case "uml.custom" : {
				currentinst = new ParsedCustom(instruction.getString("instruction"));
			}
			case "uml.for" : {
				String init = (instruction.has("init")?instruction.getString("init"):null);
				String condition = (instruction.has("condition")?instruction.getString("condition"):null);
				String step = (instruction.has("step")?instruction.getString("step"):null);
				//da vedere se init e step sono stringhe oppure ParsedInit/ParsedAssign
				currentinst = new ParsedFor(null, condition, null, null);	
			}
			case "uml.if" : {
				String condition = (instruction.has("condition")?instruction.getString("condition"):null);
				currentinst = new ParsedIf(condition, null, null);
			}
			case "uml.initialization" : {
				String value = (instruction.has("value")?instruction.getString("value"):null);
				currentinst = new ParsedInitialization(instruction.getString("type"), instruction.getString("name"), value);
			}
			case "uml.return" : {
				String value = (instruction.has("value")?instruction.getString("value"):null);
				currentinst = new ParsedReturn(value);
			}
			case "uml.while" : {
				String condition = (instruction.has("condition")?instruction.getString("condition"):null);
				currentinst = new ParsedWhile(condition, null);
			}
			break;
			deafult : throw new Exception();
		}
			
			if(!instruction.has("embeds")){
				return currentinst;
			}
			
			JSONArray embeds = instruction.getJSONArray("embeds");
			int embedslength = embeds.length();
			ParsedInstruction[] pi = new ParsedInstruction[embedslength];
			for(int y = 0; y<embedslength; y++){
				String id = embeds.getString(y);
				JSONObject otherinstruction;
				boolean found = false;
				int found_at = 0;
				for(int f=i; f<jblocks.length()&&!found; f++){
					if(jblocks.getJSONObject(f).getString("id")==id){
						otherinstruction = jblocks.getJSONObject(f);
						found = true;
						found_at = f;
					}
					pi[y] = Parser.recursiveBuilder(otherinstruction, jblocks, found_at);
					
				}
				
			}
		
			return currentinst;
	}
	public void saveToDisk(String IdReq){};
}
