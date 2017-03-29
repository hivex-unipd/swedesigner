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
	public static ParsedProgram createParsedProgram(String jsonstring) throws Exception{
		
		ParsedProgram pp = new ParsedProgram();
		
		JSONArray arr = new JSONObject(jsonstring).getJSONObject("classes").getJSONArray("cells");
		JSONArray meths = new JSONObject(jsonstring).getJSONArray("methods");
		
		HashMap<String, List<ParsedInstruction>> meth = new HashMap<String, List<ParsedInstruction>>();
		
		for(int i = 0; i<meths.length(); i++){ //ciclo diagrammi delle attività (metodo)
			JSONObject jmeth = meths.getJSONObject(i);
			String id = jmeth.getString("id");
			JSONArray jblocks = jmeth.getJSONArray("cells");
			List<ParsedInstruction> value = new ArrayList<ParsedInstruction>();
			for(int j = 0; j < jblocks.length(); j++){ //ciclo blocchi esterni del particolare diagramma (metodo)
				JSONObject external = jblocks.getJSONObject(j);
				if(!external.has("parent")){
					//inizio ricorsione
					ParsedInstruction k = Parser.recursiveBuilder(external, jblocks, j+1);
					value.add(k);
				}
			}
			meth.put(id, value);
		}
		
		for(int i = 0; i < meth.size(); i++){
			System.out.println("Stampa metodo "+i);
			List<ParsedInstruction> l = meth.get("1234abc");
			for(int y=0; y<l.size(); y++){
				System.out.println(l.get(0).toString());
			}
		}	
		
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
	private static ParsedInstruction recursiveBuilder(JSONObject instruction, JSONArray jblocks, int i) throws Exception{
		String type = instruction.getString("type");
		ParsedInstruction currentinst = null;
		JSONObject values = instruction.getJSONObject("values");
		switch(type){
			case "uml.assignment" : {
				currentinst = new ParsedAssignment(values.getString("name"), values.getString("value"));
				break;
			}
			case "uml.custom" : {
				currentinst = new ParsedCustom(values.getString("instruction"));
				break;
			}
			case "uml.for" : {
				String init = (values.has("init")?values.getString("init"):null);
				String condition = (values.has("condition")?values.getString("condition"):null);
				String step = (values.has("step")?values.getString("step"):null);
				//da vedere se init e step sono stringhe oppure ParsedInit/ParsedAssign
				currentinst = new ParsedFor(null, condition, null, null);	
				break;
			}
			case "uml.if" : {
				String condition = (values.has("condition")?values.getString("condition"):null);
				currentinst = new ParsedIf(condition, null, null);
				break;
			}
			case "uml.initialization" : {
				String value = (values.has("value")?values.getString("value"):null);
				currentinst = new ParsedInitialization(values.getString("type"), values.getString("name"), value);
				break;
			}
			case "uml.return" : {
				String value = (values.has("value")?values.getString("value"):null);
				currentinst = new ParsedReturn(value);
				break;
			}
			case "uml.while" : {
				String condition = (values.has("condition")?values.getString("condition"):null);
				currentinst = new ParsedWhile(condition, null);
				break;
			}
			default : throw new Exception();
		}
		
		if(!instruction.has("embeds")){
			return currentinst;
		}
		//se ha figli
		JSONArray embeds = instruction.getJSONArray("embeds");
		int embedslength = embeds.length();
		ParsedInstruction[] pi = new ParsedInstruction[embedslength];
		for(int y = 0; y<embedslength; y++){ //ciclo i figli
			String id = embeds.getString(y);
			JSONObject otherinstruction = null;
			boolean found = false;
			int found_at = 0;
			for(int f = i; f<jblocks.length()&&!found; f++){
				if(jblocks.getJSONObject(f).getString("id")==id){
					otherinstruction = jblocks.getJSONObject(f);
					found = true;
					found_at = f;
					pi[y] = Parser.recursiveBuilder(otherinstruction, jblocks, found_at+1);
				}
			}
		}
		currentinst.setBody(pi); //chiamata polimorfa
		return currentinst;
	}
	public void saveToDisk(String IdReq){};
}
