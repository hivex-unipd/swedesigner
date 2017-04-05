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
import server.project.ParsedElse;
import server.project.ParsedException;
import server.project.ParsedFor;
import server.project.ParsedIf;
import server.project.ParsedInitialization;
import server.project.ParsedInstruction;
import server.project.ParsedInterface;
import server.project.ParsedMethod;
import server.project.ParsedProgram;
import server.project.ParsedReturn;
import server.project.ParsedType;
import server.project.ParsedWhile;

/**
 * The {@code Parser} class parses JSON strings and builds
 * corresponding {@code ParsedProgram} objects, thus
 * translating JSON into Java.
 */
public class Parser {
	List<String> errors = new ArrayList<String>();

	/**
	 * Given a string containing a JSON object
	 * which complies with the system requirements,
	 * returns a {@code ParsedProgram} built from
	 * the information present in the JSON object.
	 * @param  jsonstring    a JSON object
	 * @return               a {@code ParsedProgram}
	 * @throws JSONException a JSON parsing exception
	 */
	public ParsedProgram createParsedProgram(String jsonstring) throws JSONException {

		ParsedProgram pp = new ParsedProgram();
		JSONObject program = new JSONObject(jsonstring);
		//JSONObject di primo livello
		JSONObject unity = (program.has("classes")? program.getJSONObject("classes"):new JSONObject());
		//Array delle classi
		JSONArray clas = (unity.has("classesArray")?unity.getJSONArray("classesArray"):new JSONArray());
		//Array delle relazioni
		JSONArray rels = (unity.has("relationshipsArray")?unity.getJSONArray("relationshipsArray"):new JSONArray());
		//Array dei metodi (fuori da cells)
		JSONArray meths = (program.has("methods")?program.getJSONArray("methods"):new JSONArray());

		HashMap<String, List<ParsedInstruction>> meth = methBodies(meths);
		HashMap<String, ParsedType> alltypes = typeBuilder(clas, meth);


		//inserisco le giuste relazioni all'interno dei tipi della hash map 
		relBuilder(rels, alltypes);

		Iterator<Entry<String, ParsedType>> it = alltypes.entrySet().iterator();
		while (it.hasNext()) {
			Map.Entry<String, ParsedType> entry = (Map.Entry<String, ParsedType>)it.next();
			pp.addType(entry.getValue());
		}

		for (int err = 0; err < errors.size(); err++)
			System.out.println("***"+errors.get(err)+"\n");
		return pp;
	}//*****fine Parser

	/**
	 * Given a JSON array of activity diagrams, returns a map
	 * from each method to its class or interface; the map
	 * represents each method as a List of {@code ParsedInstruction}s
	 * and each class or interface as a string containing its id.
	 * @param  meths         a JSON array of activity diagrams
	 * @return               a structure mapping each method to its class
	 * @throws JSONException a JSON parsing exception
	 */
	private HashMap<String, List<ParsedInstruction>> methBodies(JSONArray meths) throws JSONException { //***prima funzione***
		HashMap<String, List<ParsedInstruction>> meth = new HashMap<String, List<ParsedInstruction>>();
		for (int i = 0; i < meths.length(); i++) { //ciclo diagrammi delle attività (metodo)
			JSONObject jmeth = meths.getJSONObject(i);
			String id = null;
			if (jmeth.has("id"))
				id = jmeth.getString("id");
			else
				errors.add("JSON format error: Cannot find id in body of method");

			JSONArray jblocks = (jmeth.has("cells") ? jmeth.getJSONArray("cells") : new JSONArray());
			List<ParsedInstruction> value = new ArrayList<ParsedInstruction>();
			for (int j = 0; j < jblocks.length(); j++) { //ciclo blocchi esterni del particolare diagramma (metodo)
				JSONObject external = jblocks.getJSONObject(j);
				if (!external.has("parent")) {
					//inizio ricorsione
					ParsedInstruction k = recursiveBuilder(external, jblocks, j+1);
					if (k!=null)
						value.add(k);
				}
			}
			meth.put(id, value);
		}
		return meth;
	}

	/**
	 * Given a JSON array of class diagram elements, and a map
	 * from project method to its class diagram element,
	 * returns a structure mapping each class diagram element to
	 * a correspondent {@code ParsedType} object; each class diagram
	 * element is represented by a string containing its id.
	 * @param  clas          a JSON array of classes
	 * @param  meth          a map from each method to its class/interface
	 * @return               a map from each class/interface to a ParsedType
	 * @throws JSONException a JSON parsing exception
	 */
	private HashMap<String, ParsedType> typeBuilder(JSONArray clas, HashMap<String, List<ParsedInstruction>> meth) throws JSONException { //***seconda funzione***
		HashMap<String, ParsedType> alltypes = new HashMap<String, ParsedType>();
		for (int i = 0; i<clas.length(); i++) {
			JSONObject jclass = clas.getJSONObject(i);

			//classes.put(clas.getJSONObject(i));
			JSONObject classvalues = (jclass.has("values")?jclass.getJSONObject("values"):new JSONObject());

			//creo array per attributi JSON
			JSONArray jattributes = (classvalues.has("attributes")?classvalues.getJSONArray("attributes"):new JSONArray());

			//creo array per metodi JSON
			JSONArray jmethods = (classvalues.has("methods")?classvalues.getJSONArray("methods"):new JSONArray());

			//ricavo il tipo
			String s = "";
			if (jclass.has("type"))
				s = jclass.getString("type");
			else
				errors.add("JSON format error: cannot find type of type: this type is not inserted in the list of type");

			//ricavo l'id
			String id = "";
			if (jclass.has("id"))
				id = jclass.getString("id");
			else
				errors.add("JSON format error: cannot find id of type: this type is not inserted in the list of type");

			//inserisco il tipo solamente se ha id e type definiti
			if ((s.equals("class.HxClass") || s.equals("class.HxInterface")) && !id.equals("")) {
				boolean isInterface = (s.equals("class.HxInterface") ? true : false);
				String name = (classvalues.has("name") ? classvalues.getString("name") : id);
				ParsedType pt;
				if (isInterface)
					pt = new ParsedInterface(name);
				else {
					boolean isAbstract = (classvalues.has("abstract") ? classvalues.getBoolean("abstract") : false);
					pt = new ParsedClass(name, isAbstract);
				}
			 
				//aggiungo al parsedtype gli attributi
				for (int r = 0; r < jattributes.length(); r++) {
					JSONObject currentattr = jattributes.getJSONObject(r);
					ParsedAttribute pa = attrBuilder(currentattr);
					if (pa != null) {
						try { pt.addField(pa);}
						catch(ParsedException e) {errors.add(e.getError());}
					}
				}

				//aggiungo i metodi al parsed type
				for (int r = 0; r < jmethods.length(); r++) {
					JSONObject currentmeth = jmethods.getJSONObject(r);
					ParsedMethod pm = methBuilder(currentmeth, meth);
					if (pm != null) {
						try{pt.addMethod(pm);}
						catch(ParsedException e) {errors.add(e.getError());}
					}
				}

				//inserisco il pt nell'array di classi
				alltypes.put(id, pt);
			}//fine if
		}//fine for//********fine seconda funzione
		return alltypes;
	}

	/**
	 * Given a JSON object containing a class member (an attribute),
	 * builds the corresponding {@code ParsedAttribute} object and
	 * returns it.
	 * @param  currentattr   a JSON object with a class member
	 * @return               the {@code ParsedAttribute} corresponding to {@code currentattr}
	 * @throws JSONException a JSON parsing exception
	 */
	private ParsedAttribute attrBuilder(JSONObject currentattr) throws JSONException { //***terza funzione***
			String varname = "";
			if (currentattr.has("name"))
				varname = currentattr.getString("name");
			else
				errors.add("Cannot find name of attribute");

			if (!varname.equals("")) {
				//occorre controllare che ci siano tutti i campi prima di creare l'attributo
				boolean isstatic = (currentattr.has("static")?currentattr.getBoolean("static"):false);
				String visibility = (currentattr.has("visibility")?currentattr.getString("visibility"):null);
				String varvaldef = (currentattr.has("defaultvalue")?currentattr.getString("defaultvalue"):null);
				String vartype = (currentattr.has("type") ? currentattr.getString("type") : null);

				return new ParsedAttribute(isstatic, visibility, vartype, varname, varvaldef);
			}
			else
				return null;
	}

	/**
	 * Given a JSON object containing an activity diagram (a method),
	 * and a map from each method to its class or interface,
	 * builds a {@code ParsedMethod} object and returns it.
	 * @param  currentmeth   a JSON object containing a method
	 * @param  meth          a map from each method to its class/interface
	 * @return               a {@code ParsedMethod} object
	 * @throws JSONException a JSON parsing exception
	 */
	private ParsedMethod methBuilder(JSONObject currentmeth, HashMap<String, List<ParsedInstruction>> meth) throws JSONException { //***quarta funzione***
		JSONArray params = (currentmeth.has("parameters")?currentmeth.getJSONArray("parameters"):new JSONArray());
		List<ParsedAttribute> args = new ArrayList<ParsedAttribute>();

		for (int p=0; p<params.length(); p++) {
			String arginfo = params.getString(p);
			if (arginfo.contains(":")) {
				String[] infos = arginfo.split(":");
				args.add(new ParsedAttribute(false, null, infos[1], infos[0], null));
			}
			else
				errors.add("JSON format error: parameter "+(p+1)+" of method");
		}

		String returntype = "";//vincolo del nostro programma
		if (currentmeth.has("returntype"))
			returntype = currentmeth.getString("returntype");
		else
			errors.add("Retun type not found in method");

		String namemeth = "";
		if (currentmeth.has("name"))
			namemeth = currentmeth.getString("name");
		else
			errors.add("Name not found in method");
		if (!returntype.equals("")&&!namemeth.equals("")) {

			String visibility = (currentmeth.has("visibility")?currentmeth.getString("visibility"):null);
			boolean isstatic = (currentmeth.has("static")?currentmeth.getBoolean("static"):false);
			boolean isabstract = (currentmeth.has("abstract")?currentmeth.getBoolean("abstract"):false);
			String id = (currentmeth.has("id")?currentmeth.getString("id"):"");
			return new ParsedMethod(visibility , isstatic, isabstract, returntype, namemeth, args, meth.get(id));
		}
		else
			return null;
	}

	/**
	 * Given a JSON array of relationships between the class
	 * diagram elements, and a map from each class diagram element
	 * to its correspondent {@code ParsedType} object,
	 * inserts the appropriate relationship between all the
	 * {@code ParsedType}s present in the map.
	 * @param  rels          relationships between all the types
	 * @param  alltypes      a map from each diagram type to a {@code ParsedType}
	 * @throws JSONException a JSON parsing exception
	 */
	private void relBuilder(JSONArray rels, HashMap<String, ParsedType> alltypes)throws JSONException { //***quinta funzione***
		int attNoName = 0; //***attributi senza nome creati da relazioni "reference"
		//Inserimento relazioni
		for (int i = 0; i<rels.length();i++) {
			JSONObject rel = rels.getJSONObject(i);

			//source della relazione
			String sourcestring = "";
			if (rel.has("source")) {
				JSONObject source = rel.getJSONObject("source");
				if (source.has("id"))
					sourcestring = source.getString("id");
				else
					errors.add("JSON format error: cannot find id of source of relationship");
			}
			else
				errors.add("JSON format error: cannot find source of relationship");
			ParsedType source = alltypes.get(sourcestring); 							//null se non esiste la chiave corrispondente alla sorgente

			//tipo della relazione
			String type = "";															//"" se non esiste il tipo della relazione
			if (rel.has("type"))
				type = rel.getString("type");
			else
				errors.add("JSON format error: cannot find type of relationship");

			//target della relazione
			String targetstring = "";
			if (rel.has("target")) {
				JSONObject target = rel.getJSONObject("target");
				if (target.has("id"))
					targetstring = target.getString("id");
				else
					errors.add("JSON format error: cannot find id of target of relationship");
			}
			else
				errors.add("JSON format error: cannot find target of relationship");

			ParsedType targettype = alltypes.get(targetstring);
			String target = ""; 														//"" se non esiste il target della relazione
			if (targettype!=null)
				target = targettype.getName();

			if (source!=null && !type.equals("") && !target.equals("")) {					//controllo valori accettabili
				switch(type) {
					case "class.HxGeneralization" : {
						try{source.addSupertype(target, "class");}
						catch(ParsedException e) {errors.add(e.getError());}
						break;
					}
					case "class.HxImplementation" : {
						try{source.addSupertype(target, "interface");}
						catch(ParsedException e) {errors.add(e.getError());}
						break;
					}
					case "class.HxReference" : {
						int molt = 1; //molteplicita di default
						if (rel.has("molteplicity"))
							molt = rel.getInt("molteplicity");

						String typeatt = target+(molt>1 ? "[]" : "");

						String nameatt = "";
						if (rel.has("name"))
							nameatt = rel.getString("name");
						else
							nameatt = target+source+"reference"+(attNoName++);

						String value = (molt>1 ? "new "+target+"["+molt+"]" : null);//non esistono valori di default per i riferimenti singoli!!!

						//***non si può indicare se un attributo è statico o la particolare visibilità
						try{source.addField(new ParsedAttribute(false, null, typeatt, nameatt, value));}
						catch(ParsedException e) {errors.add(e.getError());}
						break;
					}
					default : errors.add("JSON format error: type of relationship is not correct"); 
				}//fine switch
			}//fine if
		}//fine ciclo for //******fine quinta funzione
	}

	//la funzione ritorna null nel caso in cui i JSONObject e JSONArray passati come parametri non abbiano le informazioni necessarie
	//per creare l'istruzione stessa!
	private ParsedInstruction recursiveBuilder(JSONObject instruction, JSONArray jblocks, int i) throws JSONException {
		String type = "";
		if (instruction.has("type"))
			type = instruction.getString("type");
		else
			errors.add("JSON format error: cannot find type of instruction");
		ParsedInstruction currentinst = null;
		JSONObject values = null;
		if (instruction.has("values")) {
			values = instruction.getJSONObject("values");
		}
		else
			errors.add("JSON format error: cannot find values of instruction");

		if (!type.equals("")&&values!=null) {//se nel JSON non sono inseriti il tipo e i valori delle istruzioni, non ha senso inserirle!
			switch(type) {//I VINCOLI IMPOSTI ALLE DIVERSE ISTRUZIONI SONO CARATTERIZZANTI PER IL NOSTRO PROGRAMMA
				case "activity.HxAssignment" : {
					String name = (values.has("name") ? values.getString("name") : "");
					String value = (values.has("value") ? values.getString("value") : "");

					if (!name.equals("")&&!value.equals(""))
						currentinst = new ParsedAssignment(name, value);
					else
						errors.add("JSON format error: missing information for assignment instruction");

					break;
				}
				case "activity.HxCustom" : {
					String value = (values.has("value") ? values.getString("value") : "");

					if (!value.equals(""))
						currentinst = new ParsedCustom(value);
					else
						errors.add("JSON format error: missing information for custom instruction");
					break;
				}
				case "activity.HxFor" : {//nessun controllo, il for può avere tutte le informazioni mancanti!
					String init = (values.has("initialization")?values.getString("initialization"):null);
					String condition = (values.has("termination")?values.getString("termination"):null);
					String step = (values.has("increment")?values.getString("increment"):null);
					//da vedere se init e step sono stringhe oppure ParsedInit/ParsedAssign

					break;
				}
				case "activity.HxIf" : {
					String condition = (values.has("condition") ? values.getString("condition") : "");;
					if (!condition.equals(""))
						currentinst = new ParsedIf (condition, null);
					else
						errors.add("JSON format error: missing information for if instruction");
					break;
				}
				case "activity.HxElse" : {
						currentinst = new ParsedElse(null);
					break;
				}
				case "activity.HxInitialization" : {//*******non servirebbe in effetti richiedere la presenza del tipo (indipendenza dal linguaggio)
					String value = (values.has("value")?values.getString("value"):null);
					String typei = (values.has("type") ? values.getString("type") : null);
					String name = (values.has("name") ? values.getString("name") : "");
					if (!name.equals(""))
						currentinst = new ParsedInitialization(typei, name, value);
					else
						errors.add("JSON format error: missing name of value for initialization instruction");
					break;
				}
				case "activity.HxReturn" : {//nessun controllo, il return può essere anche implicito;
					String value = (values.has("value")?values.getString("value"):null);
					currentinst = new ParsedReturn(value);
					break;
				}
				case "activity.HxWhile" : {
					String condition = (values.has("condition") ? values.getString("condition") : "");;
					if (!condition.equals(""))
						currentinst = new ParsedWhile (condition, null);
					else
						errors.add("JSON format error: missing information for while instruction");
					break;
				}
				default : errors.add("JSON fromat error: type of instruction is not correct");
			}
		}
		if (!instruction.has("embeds")) {
			return currentinst;
		}

		//se invece ha figli
		JSONArray embeds = instruction.getJSONArray("embeds");//esiste sicuramente
		int embedslength = embeds.length();
		List<ParsedInstruction> pi = new ArrayList<ParsedInstruction>();
		for (int y = 0; y<embedslength; y++) { //ciclo i figli, se entro in embeds vuol dire che almeno una stringa c'è!
			String id = embeds.getString(y);
			JSONObject otherinstruction = null;
			boolean found = false;
			int found_at = 0;
			for (int f = i; f<jblocks.length()&&!found; f++) {
				JSONObject block = jblocks.getJSONObject(f);
				String idblock = "";
				if (block.has("id"))
					idblock = block.getString("id");
				else
					errors.add("JSON format error: cannot find id in block");

				if (idblock.equals(id)) {
					otherinstruction = block;
					found = true;
					found_at = f;
					ParsedInstruction instr = recursiveBuilder(otherinstruction, jblocks, found_at+1);
					if (instr!=null) {
						pi.add(instr);

				}
			}
		}
		if (currentinst!=null)
			currentinst.setBody(pi); //chiamata polimorfa
	  }//fine if esterno che controlla la presenza di type e values dell'istruzione

		//se non ci sono le informazioni necessarie per creare l'istruzione, essa risulta vuota.
		return currentinst;
	}

	public void saveToDisk(String IdReq) {}
}
