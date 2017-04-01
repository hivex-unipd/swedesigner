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
		//JSONObject di primo livello
		JSONObject objectclasses = (program.has("classes")? program.getJSONObject("classes"):new JSONObject());
		//Array contenente classesarray e relationshipsarray
		JSONObject unity = (objectclasses.has("cells")?objectclasses.getJSONObject("cells"):new JSONObject());
		//Array delle classi
		JSONArray clas = (unity.has("classesarray")?unity.getJSONArray("classesarray"):new JSONArray());
		//Array delle relazioni
		JSONArray rels = (unity.has("relationshipsarray")?unity.getJSONArray("relationshipsarray"):new JSONArray());
		//Array dei metodi (fuori da cells)
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
		
		HashMap<String, ParsedType> alltypes = new HashMap<String, ParsedType>();
		for(int i = 0; i<clas.length(); i++){
			JSONObject jclass = clas.getJSONObject(i);
		
			//classes.put(clas.getJSONObject(i));
			JSONObject classvalues = (jclass.has("values")?jclass.getJSONObject("values"):new JSONObject());
			
			//creo array per attributi JSON
			JSONArray jattributes = (classvalues.has("attributes")?classvalues.getJSONArray("attributes"):new JSONArray());
			
			//creo array per metodi JSON
			JSONArray jmethods = (classvalues.has("methods")?classvalues.getJSONArray("methods"):new JSONArray());
			
			
			//ricavo il tipo
			String s = "";
			if(jclass.has("type"))
				s = jclass.getString("type");
			else
				errors.add("JSON format error: cannot find type of type: this type is not inserted in the list of type");
			
			//ricavo l'id
			String id = "";
			if(jclass.has("id"))
				id = jclass.getString("id");
			else
				errors.add("JSON format error: cannot find id of type: this type is not inserted in the list of type");
			
			//inserisco il tipo solamente se ha id e type definiti
			if(!id.equals("") && !s.equals("")){
				//creo array per attributi Parsed
				List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>();
				for(int r = 0; r<jattributes.length();r++){
					JSONObject currentattr = jattributes.getJSONObject(r);
					//occorre controllare che ci siano tutti i campi prima di creare l'attributo
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

				//creo la parsedclass e la inserisco nell'array di classi
				alltypes.put(id, new ParsedClass(classvalues.getString("name"), classvalues.getString("visibility"),attributes,methods));
			}
		}//fine for
		
		int attNoName = 0; //***attributi senza nome creati da relazioni "reference"
		//Inserimento relazioni
		for(int i = 0; i<rels.length();i++){
			JSONObject rel = rels.getJSONObject(i);
			
			//source della relazione
			String sourcestring = "";
			if(rel.has("source"))
				sourcestring = rel.getString("source");
			else
				errors.add("JSON format error: cannot find source of relationship");
			ParsedType source = alltypes.get(sourcestring); 							//null se non esiste la chiave corrispondente alla sorgente
			
			//tipo della relazione
			String type = "";															//"" se non esiste il tipo della relazione
			if(rel.has("type"))
				type = rel.getString("type");
			else
				errors.add("JSON format error: cannot find type of relationship");
			
			//target della relazione
			String targetstring = "";
			if(rel.has("target"))
				targetstring = rel.getString("target");
			else
				errors.add("JSON format error: cannot find target of relationship");
			ParsedType targettype = alltypes.get(targetstring);
			String target = ""; 														//"" se non esiste il target della relazione
			if(targettype!=null)
				target = targettype.getName();
			
			if(source!=null && !type.equals("") && !target.equals("")){					//controllo valori accettabili
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
							int molt = 1; //molteplicita di default
							if(rel.has("molteplicity"))
								molt = rel.getInt("molteplicity");
							
							String typeatt = target+(molt>1 ? "[]" : "");
							
							String nameatt = "";
							if(rel.has("name"))
								nameatt = rel.getString("name");
							else
								nameatt = target+source+"reference"+(attNoName++);
															
							String value = (molt>1 ? "new "+target+"["+molt+"]" : null);//non esistono valori di default per i riferimenti singoli!!!
							
							//***non si può indicare se un attributo è statico o la particolare visibilità
							source.addAttribute(new ParsedAttribute(false, null, typeatt, nameatt, value));
							break;
						}
						default : errors.add("JSON format error: type of relationship is not correct"); 
				}//fine switch
			}//fine if
		}//fine ciclo for
		Iterator<Entry<String, ParsedType>> it = alltypes.entrySet().iterator();
		while(it.hasNext()){
			Map.Entry<String, ParsedType> entry = (Map.Entry<String, ParsedType>)it.next();
			pp.addType(entry.getValue());
		}
		
		for(int err = 0; err < errors.size(); err++)
			System.out.println("***"+errors.get(err)+"\n");
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
