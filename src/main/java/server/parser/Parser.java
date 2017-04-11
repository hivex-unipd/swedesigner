package server.parser;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.json.*;

import server.project.ParsedAttribute;
import server.project.ParsedClass;
import server.project.ParsedCustom;
import server.project.ParsedElse;
import server.project.ParsedException;
import server.project.ParsedFor;
import server.project.ParsedIf;
import server.project.ParsedInstruction;
import server.project.ParsedInterface;
import server.project.ParsedMethod;
import server.project.ParsedProgram;
import server.project.ParsedReturn;
import server.project.ParsedStatement;
import server.project.ParsedType;
import server.project.ParsedWhile;

/**
 * The {@code Parser} class parses JSON strings and builds
 * corresponding {@code ParsedProgram} objects, thus
 * translating JSON into Java.
 */
public class Parser {
	private List<String> errors = new ArrayList<String>();
	
	public List<String> getErrors(){
		return errors;
	}

	/**
	 * Given a string containing a JSON object
	 * which complies with the system requirements,
	 * returns a {@code ParsedProgram} built from
	 * the information present in the JSON object.
	 * @param  jsonString    a JSON object
	 * @return               a {@code ParsedProgram}
	 * @throws JSONException a JSON parsing exception
	 */
	public ParsedProgram createParsedProgram(String jsonString) throws JSONException {

		ParsedProgram parsedProgram = new ParsedProgram();
		JSONObject program = new JSONObject(jsonString);
		//First level JSONObject containing the JSON description of classes and relationships.
		JSONObject JSONGroup = (program.has("classes")? program.getJSONObject("classes"):new JSONObject());
		//Classes' array
		JSONArray classArray = (JSONGroup.has("classesArray")?JSONGroup.getJSONArray("classesArray"):new JSONArray());
		//Relationships' array
		JSONArray relsArray = (JSONGroup.has("relationshipsArray")?JSONGroup.getJSONArray("relationshipsArray"):new JSONArray());
		//Methods' array
		JSONArray methArray = (program.has("methods")?program.getJSONArray("methods"):new JSONArray());
		
		//HashMap containing as (key , value) the id and the body of the different methods.
		HashMap<String, List<ParsedInstruction>> methBodies = methBodies(methArray);
		//HashMap containing as (key , value) the id and a ParsedType representing one of the classes/interfaces of the program.
		HashMap<String, ParsedType> allTypes = typeBuilder(classArray, methBodies);
		
		relBuilder(relsArray, allTypes);

		Iterator<Entry<String, ParsedType>> iterator = allTypes.entrySet().iterator();
		while (iterator.hasNext()) {
			Map.Entry<String, ParsedType> entry = (Map.Entry<String, ParsedType>)iterator.next();
			parsedProgram.addType(entry.getValue());
		}
		
		return parsedProgram;
	}

	/**
	 * Given a JSON array of activity diagrams, returns a map
	 * from each method to its class or interface; the map
	 * represents each method as a List of {@code ParsedInstruction}s
	 * and each class or interface as a string containing its id.
	 * @param  meths         a JSON array of activity diagrams
	 * @return               a structure mapping each method to its class
	 * @throws JSONException a JSON parsing exception
	 */
	private HashMap<String, List<ParsedInstruction>> methBodies(JSONArray jsonMethods) throws JSONException {
		HashMap<String, List<ParsedInstruction>> methBodies = new HashMap<String, List<ParsedInstruction>>();
		for (int i = 0; i < jsonMethods.length(); i++) { 
			JSONObject JSONMethod = jsonMethods.getJSONObject(i);
			String idMethod = null;
			if (JSONMethod.has("id"))
				idMethod = JSONMethod.getString("id");
			else
				errors.add("JSON format error: Cannot find id in body of method");

			JSONArray JSONBlocks = (JSONMethod.has("cells") ? JSONMethod.getJSONArray("cells") : new JSONArray());
			List<ParsedInstruction> methodBody = new ArrayList<ParsedInstruction>();
			for (int j = 0; j < JSONBlocks.length(); j++) { 
				//topInstruction is an instruction not nested in any other instruction inside the body of the method.
				JSONObject topInstruction = JSONBlocks.getJSONObject(j);
				if (!topInstruction.has("parent")) {
					ParsedInstruction parsedInstruction = recursiveBuilder(topInstruction, JSONBlocks, j+1);
					if (parsedInstruction!=null)
						methodBody.add(parsedInstruction);
				}
			}
			methBodies.put(idMethod, methodBody);
		}
		return methBodies;
	}

	/**
	 * Given a JSON array of class diagram elements, and a map
	 * from project method to its class diagram element,
	 * returns a structure mapping each class diagram element to
	 * a correspondent {@code ParsedType} object; each class diagram
	 * element is represented by a string containing its id.
	 * @param  jsonClasses          a JSON array of classes
	 * @param  methBodies          a map from each method to its class/interface
	 * @return               a map from each class/interface to a ParsedType
	 * @throws JSONException a JSON parsing exception
	 */
	private HashMap<String, ParsedType> typeBuilder(JSONArray jsonClasses, HashMap<String, List<ParsedInstruction>> methBodies) throws JSONException { 
		HashMap<String, ParsedType> allTypes = new HashMap<String, ParsedType>();
		for (int i = 0; i<jsonClasses.length(); i++) {
			JSONObject jsonClass = jsonClasses.getJSONObject(i);

			//check if jsonClass has classvalues
			JSONObject classValues = (jsonClass.has("values")?jsonClass.getJSONObject("values"):new JSONObject());

			//extracting attributes for jsonClass
			JSONArray jsonAttributes = (classValues.has("attributes")?classValues.getJSONArray("attributes"):new JSONArray());

			//extracting methods for jsonClass
			JSONArray jsonMethods = (classValues.has("methods")?classValues.getJSONArray("methods"):new JSONArray());

			//extracting type for jsonClass
			String jClassType = "";
			if (jsonClass.has("type"))
				jClassType = jsonClass.getString("type");
			else
				errors.add("JSON format error: cannot find type of type: this type is not inserted in the list of type");

			//extracting id for jsonClass
			String jClassId = "";
			if (jsonClass.has("id"))
				jClassId = jsonClass.getString("id");
			else
				errors.add("JSON format error: cannot find id of type: this type is not inserted in the list of type");

			//checking if jsonClass has all the information needed in order to be parsed correctly
			if ((jClassType.equals("class.HxClass") || jClassType.equals("class.HxInterface")) && !jClassId.equals("")) {
				boolean isInterface = (jClassType.equals("class.HxInterface") ? true : false);
				String name = (classValues.has("name") ? classValues.getString("name") : jClassId);
				ParsedType parsedType;
				if (isInterface)
					parsedType = new ParsedInterface(name);
				else {
					boolean isAbstract = (classValues.has("abstract") ? classValues.getBoolean("abstract") : false);
					parsedType = new ParsedClass(name, isAbstract);
				}
			 
				//adding to the newly created parsedType all the legal attributes
				for (int r = 0; r < jsonAttributes.length(); r++) {
					JSONObject currentattr = jsonAttributes.getJSONObject(r);
					ParsedAttribute parsedAttribute = attrBuilder(currentattr);
					if (parsedAttribute != null) {
						try { parsedType.addField(parsedAttribute);}
						catch(ParsedException exception) {errors.add(exception.getError());}
					}
				}

				//adding to the newly created parsedType all the legal methods
				for (int r = 0; r < jsonMethods.length(); r++) {
					JSONObject currentmeth = jsonMethods.getJSONObject(r);
					ParsedMethod parsedMethod = methBuilder(currentmeth, methBodies);
					if (parsedMethod != null) {
						try{parsedType.addMethod(parsedMethod);}
						catch(ParsedException exception) {errors.add(exception.getError());}
					}
				}

				//inserting the parsedType in the  alltypes array
				allTypes.put(jClassId, parsedType);
			}
		}
		return allTypes;
	}

	/**
	 * Given a JSON object containing a class member (an attribute),
	 * builds the corresponding {@code ParsedAttribute} object and
	 * returns it.
	 * @param  currentAttr   a JSON object with a class member
	 * @return               the {@code ParsedAttribute} corresponding to {@code currentattr}
	 * @throws JSONException a JSON parsing exception
	 */
	private ParsedAttribute attrBuilder(JSONObject currentAttr) throws JSONException {
			//extracting the name of the attribute
			String attrName = "";
			if (currentAttr.has("name"))
				attrName = currentAttr.getString("name");
			else
				errors.add("Cannot find name of attribute");
			//creating the attribute only if it has a legal name value.
			if (!attrName.equals("")) {
				boolean isstatic = (currentAttr.has("static")?currentAttr.getBoolean("static"):false);
				String visibility = (currentAttr.has("visibility")?currentAttr.getString("visibility"):null);
				String varvaldef = (currentAttr.has("defaultvalue")?currentAttr.getString("defaultvalue"):null);
				String vartype = (currentAttr.has("type") ? currentAttr.getString("type") : null);

				return new ParsedAttribute(isstatic, visibility, vartype, attrName, "=", varvaldef);
			}
			else//if the attribute has no name the method returns a null value
				return null;
	}

	/**
	 * Given a JSON object containing an activity diagram (a method),
	 * and a map from each method to its class or interface,
	 * builds a {@code ParsedMethod} object and returns it.
	 * @param  method   a JSON object containing a method
	 * @param  methBodies          a map from each method to its class/interface
	 * @return               a {@code ParsedMethod} object
	 * @throws JSONException a JSON parsing exception
	 */
	private ParsedMethod methBuilder(JSONObject method, HashMap<String, List<ParsedInstruction>> methBodies) throws JSONException { 
		//extracting the parameters of the current method
		JSONArray methodParams = (method.has("parameters")?method.getJSONArray("parameters"):new JSONArray());
		List<ParsedAttribute> methodArgs = new ArrayList<ParsedAttribute>();
		
		//creating and adding the parameters to the methodArgs list
		for (int p=0; p<methodParams.length(); p++) {
			JSONObject methodParam = methodParams.getJSONObject(p);
			String name = (methodParam.has("name") ? methodParam.getString("name"):"");
			String type = (methodParam.has("type") ? methodParam.getString("type"):null);
			String defaultvalue = (methodParam.has("defaultvalue") ? methodParam.getString("defaultvalue"):null);
			//adding the parameter only if it has a legal name value
			if (name!="") {
				methodArgs.add(new ParsedAttribute(false, null, type, name, "=", defaultvalue));
			}
			else
				errors.add("JSON format error: missing name of parameter "+(p+1)+" of method");
		}
		
		//extracting the return type of the current method
		String returnType = "";
		if (method.has("returntype"))
			returnType = method.getString("returntype");
		else
			errors.add("Retun type not found in method");
		
		//extracting the name of the current method
		String nameMeth = "";
		if (method.has("name"))
			nameMeth = method.getString("name");
		else
			errors.add("Name not found in method");
		
		//creating and returning the method only if it has a legal return type value and a legal name value
		if (!returnType.equals("")&&!nameMeth.equals("")) {

			String visibility = (method.has("visibility")?method.getString("visibility"):null);
			boolean isstatic = (method.has("static")?method.getBoolean("static"):false);
			boolean isabstract = (method.has("abstract")?method.getBoolean("abstract"):false);
			String id = (method.has("id")?method.getString("id"):"");
			return new ParsedMethod(visibility , isstatic, isabstract, returnType, nameMeth, methodArgs, methBodies.get(id));
		}
		else//if the method does not have a legal return type value or a legal name value the method returns null
			return null;
	}

	/**
	 * Given a JSON array of relationships between the class
	 * diagram elements, and a map from each class diagram element
	 * to its correspondent {@code ParsedType} object,
	 * inserts the appropriate relationship between all the
	 * {@code ParsedType}s present in the map.
	 * @param  JSONRels          relationships between all the types
	 * @param  allTypes      a map from each diagram type to a {@code ParsedType}
	 * @throws JSONException a JSON parsing exception
	 */
	private void relBuilder(JSONArray JSONRels, HashMap<String, ParsedType> allTypes)throws JSONException { //***quinta funzione***
		//counter used to generate a default name for reference relationships without name
		int attNoName = 0; 
		
		
		for (int i = 0; i<JSONRels.length();i++) {
			JSONObject JSONRel = JSONRels.getJSONObject(i);

			//extracting the source class of the relationship
			String sourceName = "";
			if (JSONRel.has("source")) {
				JSONObject source = JSONRel.getJSONObject("source");
				if (source.has("id"))
					sourceName = source.getString("id");
				else
					errors.add("JSON format error: cannot find id of source of relationship");
			}
			else
				errors.add("JSON format error: cannot find source of relationship");
			ParsedType source = allTypes.get(sourceName); 							

			//extracting the type of the relationship
			String relType = "";															
			if (JSONRel.has("type"))
				relType = JSONRel.getString("type");
			else
				errors.add("JSON format error: cannot find type of relationship");

			//extracting the target class of the relationship
			String targetName = "";
			if (JSONRel.has("target")) {
				JSONObject targetType = JSONRel.getJSONObject("target");
				if (targetType.has("id"))
					targetName = targetType.getString("id");
				else
					errors.add("JSON format error: cannot find id of target of relationship");
			}
			else
				errors.add("JSON format error: cannot find target of relationship");
			
			//extracting the ParsedType that corresponds to the source type of the relationship
			ParsedType targetType = allTypes.get(targetName);
			String target = ""; 														//"" se non esiste il target della relazione
			if (targetType!=null)
				target = targetType.getName();

			if (source!=null && !relType.equals("") && !target.equals("")) {					//controllo valori accettabili
				switch(relType) {
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
						if (JSONRel.has("molteplicity"))
							molt = JSONRel.getInt("molteplicity");

						String typeatt = target+(molt>1 ? "[]" : "");

						String nameatt = "";
						if (JSONRel.has("name"))
							nameatt = JSONRel.getString("name");
						else
							nameatt = target+source+"reference"+(attNoName++);

						String value = (molt>1 ? "new "+target+"["+molt+"]" : null);//non esistono valori di default per i riferimenti singoli!!!

						//***non si può indicare se un attributo è statico o la particolare visibilità
						try{source.addField(new ParsedAttribute(false, null, typeatt, nameatt, "=", value));}
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
	private ParsedInstruction recursiveBuilder(JSONObject instruction, JSONArray jsonBlock, int position) throws JSONException {
		String type = "";
		if (instruction.has("type"))
			type = instruction.getString("type");
		else
			errors.add("JSON format error: cannot find type of instruction");
		
		JSONObject values = null;
		if (instruction.has("values")) {
			values = instruction.getJSONObject("values");
		}
		else
			errors.add("JSON format error: cannot find values of instruction");
		
		ParsedInstruction currentinst = null;

		if (!type.equals("")&&values!=null) {//se nel JSON non sono inseriti il tipo e i valori delle istruzioni, non ha senso inserirle!
			currentinst = createActivity(values, type);
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
			for (int f = position; f<jsonBlock.length()&&!found; f++) {
				JSONObject block = jsonBlock.getJSONObject(f);
				String idblock = "";
				if (block.has("id"))
					idblock = block.getString("id");
				else
					errors.add("JSON format error: cannot find id in block");

				if (idblock.equals(id)) {
					otherinstruction = block;
					found = true;
					found_at = f;
					ParsedInstruction instr = recursiveBuilder(otherinstruction, jsonBlock, found_at+1);
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
	
	private ParsedInstruction createActivity(JSONObject values, String type) throws JSONException{
		ParsedInstruction activity = null;
		switch(type) {//I VINCOLI IMPOSTI ALLE DIVERSE ISTRUZIONI SONO CARATTERIZZANTI PER IL NOSTRO PROGRAMMA
		case "activity.HxCustom" : {
			String value = (values.has("value") ? values.getString("value") : "");

			if (!value.equals(""))
				activity = new ParsedCustom(value);
			else
				errors.add("JSON format error: missing information for custom instruction");
			break;
		}
		case "activity.HxFor" : {//nessun controllo, il for può avere tutte le informazioni mancanti!
			String init = (values.has("initialization")?values.getString("initialization"):null);
			String condition = (values.has("termination")?values.getString("termination"):null);
			String step = (values.has("increment")?values.getString("increment"):null);
			//da vedere se init e step sono stringhe oppure ParsedInit/ParsedAssign
			activity = new ParsedFor(init, condition, step, null);

			break;
		}
		case "activity.HxIf" : {
			String condition = (values.has("condition") ? values.getString("condition") : "");;
			if (!condition.equals(""))
				activity = new ParsedIf(condition);
			else
				errors.add("JSON format error: missing information for if instruction");
			break;
		}
		case "activity.HxElse" : {
				activity = new ParsedElse();
			break;
		}
		case "activity.HxVariable" : {//*******non servirebbe in effetti richiedere la presenza del tipo (indipendenza dal linguaggio)
			String value = (values.has("value")?values.getString("value"):null);
			String typei = (values.has("type") ? values.getString("type") : null);
			String operation = (values.has("operation") ? values.getString("operation") : null);
			String name = (values.has("name") ? values.getString("name") : "");
			if (!name.equals(""))
				activity = new ParsedStatement(typei, name, operation, value);
			else
				errors.add("JSON format error: missing name of value for statement");
			break;
		}
		case "activity.HxReturn" : {//nessun controllo, il return può essere anche implicito;
			String value = (values.has("value")?values.getString("value"):null);
			activity = new ParsedReturn(value);
			break;
		}
		case "activity.HxWhile" : {
			String condition = (values.has("condition") ? values.getString("condition") : "");;
			if (!condition.equals(""))
				activity = new ParsedWhile (condition, null);
			else
				errors.add("JSON format error: missing information for while instruction");
			break;
		}
		default : errors.add("JSON format error: type of instruction is not correct");	
	}
		return activity;
	}
	
	
}
