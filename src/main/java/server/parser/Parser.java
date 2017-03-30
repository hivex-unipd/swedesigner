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
	List<String> errors = new ArrayList<String>();
	
	public ParsedProgram createParsedProgram(String jsonstring) throws Exception{
		
		ParsedProgram pp = new ParsedProgram();
		JSONObject program = new JSONObject(jsonstring);
		JSONObject objectclasses = (program.has("classes")? program.getJSONObject("classes"):new JSONObject());
		JSONArray arr = (objectclasses.has("cells")?objectclasses.getJSONArray("cells"):new JSONArray());
		JSONArray meths = (program.has("methods")?program.getJSONArray("methods"):new JSONArray());
		
		HashMap<String, List<ParsedInstruction>> meth = new HashMap<String, List<ParsedInstruction>>();
		
		for(int i = 0; i<meths.length(); i++){ //ciclo diagrammi delle attività (metodo)
			JSONObject jmeth = meths.getJSONObject(i);
			String id = null;
			if(jmeth.has("id"))
				id = jmeth.getString("id");
			else
				errors.add("JSON format error: Cannot find id in method");
			
			JSONArray jblocks = (jmeth.has("cells")?jmeth.getJSONArray("cells"):new JSONArray());
			List<ParsedInstruction> value = new ArrayList<ParsedInstruction>();
			for(int j = 0; j < jblocks.length(); j++){ //ciclo blocchi esterni del particolare diagramma (metodo)
				JSONObject external = jblocks.getJSONObject(j);
				if(!external.has("parent")){
					//inizio ricorsione
					ParsedInstruction k = recursiveBuilder(external, jblocks, j+1);
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
			String s = "";
			if(jclass.has("type"))
				s = jclass.getString("type");
			else
				errors.add("JSON format error: cannot find type of type");
			

			if(s.equals("uml.class") || s.equals("uml.interface")){
				
				//classes.put(arr.getJSONObject(i));
				JSONObject classvalues = (jclass.has("values")?jclass.getJSONObject("values"):new JSONObject());
				
				//creo array per attributi JSON
				JSONArray jattributes = (classvalues.has("attributes")?classvalues.getJSONArray("attributes"):new JSONArray());
				
				//creo array per metodi JSON
				JSONArray jmethods = (classvalues.has("methods")?classvalues.getJSONArray("methods"):new JSONArray());
				
				//creo array per attributi Parsed
				List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>();
				for(int r = 0; r<jattributes.length();r++){
					JSONObject currentattr = jattributes.getJSONObject(r);
					//***occorre controllare che ci siano tutti i campi prima di creare l'attributo
					boolean isstatic = (currentattr.has("static")?currentattr.getBoolean("static"):false);
					String visibility = (currentattr.has("varvisib")?currentattr.getString("varvisib"):null);
					String varvaldef = (currentattr.has("varvaldef")?currentattr.getString("varvaldef"):null);
					String vartype = "";
					if(currentattr.has("vartype"))
						vartype = currentattr.getString("vartype");
					else
						errors.add("Cannot find type of attribute");
					
					String varname = "";
					if(currentattr.has("varname"))
						vartype = currentattr.getString("varname");
					else
						errors.add("Cannot find name of attribute");
						
					attributes.add(new ParsedAttribute(isstatic, visibility, vartype, varname, varvaldef));
				}
				
				//creo array di metodi Parsed
				ParsedMethod[] methods = new ParsedMethod[jmethods.length()];
				for(int r = 0; r<jmethods.length();r++){
					JSONObject currentmeth = jmethods.getJSONObject(r);
					JSONArray params = (currentmeth.has("parameters")?currentmeth.getJSONArray("parameters"):new JSONArray());
					ParsedAttribute[] args = (params.length()>0?new ParsedAttribute[params.length()]:new ParsedAttribute[0]);
		
					for(int p=0; p<args.length; p++){
						String arginfo = params.getString(p);
						if(arginfo.contains(":")){
							String[] infos = arginfo.split(":");
							args[p] = new ParsedAttribute(false, null, infos[1], infos[0], null);
						}
						else
							errors.add("JSON format error: parameter "+(p+1)+" of method");
					}
					String visibility = (currentmeth.has("visibility")?currentmeth.getString("visibility"):null);
					boolean isstatic = (currentmeth.has("static")?currentmeth.getBoolean("static"):false);
					boolean isabstract = (currentmeth.has("abstract")?currentmeth.getBoolean("abstract"):false);
					
					String returntype = "";
					if(currentmeth.has("return-type"))
						returntype = currentmeth.getString("return-type");
					else
						errors.add("Retun type not found in method");
					
					String name = "";
					if(currentmeth.has("name"))
						name = currentmeth.getString("name");
					else
						errors.add("Name not found in method");
					
					methods[r] = new ParsedMethod(visibility , isstatic, isabstract, returntype, name, args, meth.get(currentmeth.getString("id")));
				}
			//************************ARRIVATI QUI A CONTROLLARE GLI ERRORI******************************************//	
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
		

	private ParsedInstruction recursiveBuilder(JSONObject instruction, JSONArray jblocks, int i) throws Exception{
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
					pi[y] = recursiveBuilder(otherinstruction, jblocks, found_at+1);
				}
			}
		}
		currentinst.setBody(pi); //chiamata polimorfa
		return currentinst;
	}
	public void saveToDisk(String IdReq){};
}
