package server.parser;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.json.*;

import server.project.ParsedAssignment;
import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedCustom;
import server.project.ParsedFor;
import server.project.ParsedIf;
import server.project.ParsedInitialization;
import server.project.ParsedInstruction;
import server.project.ParsedMethod;
import server.project.ParsedProgram;
import server.project.ParsedReturn;
import server.project.ParsedType;
import server.project.ParsedWhile;

public class Parser {
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
		
		int i=0;
		boolean isclass = true;
		HashMap<String, ParsedType> alltypes = new HashMap<String, ParsedType>();
		while(i<arr.length()&&isclass){
			JSONObject jclass = arr.getJSONObject(i);
			String s = jclass.getString("type");

			if(s.equals("uml.class") || s.equals("uml.interface")){
				
				//classes.put(arr.getJSONObject(i));
				JSONObject classvalues = jclass.getJSONObject("values");
				
				//creo array per attributi JSON
				JSONArray jattributes = new JSONArray();
				if(classvalues.has("attributes"))
					jattributes = classvalues.getJSONArray("attributes");
				
				//creo array per metodi JSON
				JSONArray jmethods = new JSONArray();
				if(classvalues.has("methods"))
					jmethods = classvalues.getJSONArray("methods");

				//creo array per attributi Parsed
				List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>();
				for(int r = 0; r<jattributes.length();r++){
					JSONObject currentattr = jattributes.getJSONObject(r);
					//***occorre controllare che ci siano tutti i campi prima di creare l'attributo
					attributes.add(new ParsedAttribute(currentattr.getBoolean("static"), currentattr.getString("varvisib"), currentattr.getString("vartype"),currentattr.getString("varname"), currentattr.getString("varvaldef")));
				}
				
				//creo array di metodi Parsed
				ParsedMethod[] methods = new ParsedMethod[jmethods.length()];
				for(int r = 0; r<jmethods.length();r++){
					JSONObject currentmeth = jmethods.getJSONObject(r);
					//***
					methods[r] = new ParsedMethod(currentmeth.getString("visibility"), currentmeth.getBoolean("static"),/* currentmeth.getBoolean("abstract"), */currentmeth.getString("return-type"),currentmeth.getString("name"),null /*attributes da cambiare con gli argomenti*/, meth.get(currentmeth.getString("id")));
				}
				
				//creo la parsedclass e la inserisco nell'array di classi
				String id = jclass.getString("id");
				alltypes.put(id, new ParsedClass(classvalues.getString("name"), classvalues.getString("visibility"),attributes,methods));
				i++;
			}//fine if
			else
				isclass = false;
		}//fine while
		//POST: all'uscita i è tale che o i>=arr.length (ci sono solo classi) o i è l'indice di arr dove si trova la prima relazione;
		
		//Inserimento relazioni
		for(; i<arr.length();i++){
			JSONObject rel = arr.getJSONObject(i);
			String type = rel.getString("type");
			ParsedType source = alltypes.get(rel.get("source"));
			String target = alltypes.get(rel.get("target")).getName();
			
			switch(type){
				case "uml.generalization" : {
					source.addExtended(target);
					break;
				}
				case "uml.implementation" : {
					source.addImplemented(target);
					break;
				}
				case "uml.reference" : {
					int molt = rel.getInt("molteplicity");
					String typeatt = target+(molt>1?"[]":"");
					String nameatt = rel.getString("name");
					String value = (molt>1?"new "+target+"["+molt+"]":null);//non esistono valori di default per i riferimenti singoli!!!
					//non si può indicare se un attributo è statico o la particolare visibilità
					source.addAttribute(new ParsedAttribute(false, null, typeatt, nameatt, value));
					break;
				}
				default : throw new Exception(); 
			}	
		}
		Iterator<Entry<String, ParsedType>> it = alltypes.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry<String, ParsedType> entry = (Map.Entry<String, ParsedType>)it.next();
			pp.addType(entry.getValue());
		}
		
		return pp;
	};
		

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
				if(jblocks.getJSONObject(f).getString("id").equals(id)){
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
