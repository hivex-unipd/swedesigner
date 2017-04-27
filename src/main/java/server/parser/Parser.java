package server.parser;

import java.util.List;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.HashMap;

import org.json.*;

import server.project.*;

/**
 * The {@code Parser} class parses JSON strings and builds
 * corresponding {@code ParsedProgram} objects, thus
 * translating JSON into Java.
 */
public class Parser {
	private List<String> errors = new ArrayList<String>();

	public List<String> getErrors() {
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
		if (method.has("returnType"))
			returnType = method.getString("returnType");
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
			String sourceId = "";
			if (JSONRel.has("source")) {
				JSONObject jsonSource = JSONRel.getJSONObject("source");
				if (jsonSource.has("id"))
					sourceId = jsonSource.getString("id");
				else
					errors.add("JSON format error: cannot find id of source of relationship");
			}
			else
				errors.add("JSON format error: cannot find source of relationship");
			ParsedType sourceParsedType = allTypes.get(sourceId); 							

			//extracting the type of the relationship
			String relationshipType = "";															
			if (JSONRel.has("type"))
				relationshipType = JSONRel.getString("type");
			else
				errors.add("JSON format error: cannot find type of relationship");

			//extracting the id of the target class of the relationship
			String targetId = "";
			if (JSONRel.has("target")) {
				JSONObject jsonTarget = JSONRel.getJSONObject("target");
				if (jsonTarget.has("id"))
					targetId = jsonTarget.getString("id");
				else
					errors.add("JSON format error: cannot find id of target of relationship");
			}
			else
				errors.add("JSON format error: cannot find target of relationship");
			
			//extracting the ParsedType that corresponds to the source type of the relationship
			ParsedType targetType = allTypes.get(targetId);
			String targetTypeName = ""; 														
			if (targetType!=null)
				targetTypeName = targetType.getName();
			//inserting the relationship information only if source type, target type and source of relationship have legal values
			if (sourceParsedType!=null && !relationshipType.equals("") && !targetTypeName.equals("")) {	
				//this switch creates a different kind of relationship based the type specified in the json file
				switch(relationshipType) {
					case "class.HxGeneralization" : {
						try{sourceParsedType.addSupertype(targetTypeName, "class");}
						catch(ParsedException e) {errors.add(e.getError());}
						break;
					}
					case "class.HxImplementation" : {
						try{sourceParsedType.addSupertype(targetTypeName, "interface");}
						catch(ParsedException e) {errors.add(e.getError());}
						break;
					}
					case "class.HxAssociation" : {
						int molteplicity = 1; 
						if (JSONRel.has("card"))
							molteplicity = JSONRel.getInt("card");

						String attributeType = targetTypeName+(molteplicity>1 ? "[]" : "");

						String attributeName = "";
						if (JSONRel.has("attribute"))
							attributeName = JSONRel.getString("attrbute");
						else
							attributeName = "reference"+(attNoName++);

						String value = (molteplicity>1 ? "new "+targetTypeName+"["+molteplicity+"]" : null);
						
						try{sourceParsedType.addField(new ParsedAttribute(false, null, attributeType, attributeName, "=", value));}
						catch(ParsedException e) {errors.add(e.getError());}
						break;
					}
					default : errors.add("JSON format error: type of relationship is not correct"); 
				}
			}
		}
	}


	private ParsedInstruction recursiveBuilder(JSONObject instruction, JSONArray jsonBlock, int position) throws JSONException {
		
		ParsedInstruction currentInstruction = null;
		
		//extracting the type of the instruction
		String instructionType = "";
		if (instruction.has("type"))
			instructionType = instruction.getString("type");
		else
			errors.add("JSON format error: cannot find type of instruction");
		
		//extracting all the values of the instruction
		JSONObject instructionValues = null;
		if (instruction.has("values")) {
			instructionValues = instruction.getJSONObject("values");
		}
		else
			errors.add("JSON format error: cannot find values of instruction");
		
		//calling createActivity in order to create the instruction without inserting the blovks of its body
		if (!instructionType.equals("")&&instructionValues!=null) {
			currentInstruction = createActivity(instructionValues, instructionType);
		}
		
		//if the instruction has an empty body or has no body we can directly return it
		if (!instruction.has("embeds")) {
			return currentInstruction;
		}

		//extracting the list of embedded instructions of the method body
		JSONArray embeddedInstructions = instruction.getJSONArray("embeds");
		int embedslength = embeddedInstructions.length();
		List<ParsedInstruction> parsedInstructions = new ArrayList<ParsedInstruction>();
		for (int y = 0; y<embedslength; y++) { 
			String id = embeddedInstructions.getString(y);
			JSONObject otherinstruction = null;
			boolean found = false;
			int found_at = 0;
			//searching for the right instruction matching the id value
			for (int f = position; f<jsonBlock.length()&&!found; f++) {
				JSONObject singleBlock = jsonBlock.getJSONObject(f);
				String idSingleBlock = "";
				if (singleBlock.has("id"))
					idSingleBlock = singleBlock.getString("id");
				else
					errors.add("JSON format error: cannot find id in block");

				if (idSingleBlock.equals(id)) {
					otherinstruction = singleBlock;
					found = true;
					found_at = f;
					ParsedInstruction parsedInstruction = recursiveBuilder(otherinstruction, jsonBlock, found_at+1);
					if (parsedInstruction!=null) {
						parsedInstructions.add(parsedInstruction);

				}
			}
		}
		//setting the body of the currentInstruction
		if (currentInstruction!=null)
			currentInstruction.setBody(parsedInstructions); 
	  }

		//if the necessary information for creating the currentInstruction is missing the method returns a null value
		return currentInstruction;
	}
	
	private ParsedInstruction createActivity(JSONObject values, String type) throws JSONException {
		ParsedInstruction parsedInstruction = null;
		switch(type) {
		//this switch creates a different kind of instruction based the type specified in the json file
		case "activity.HxCustom" : {
			String value = (values.has("value") ? values.getString("value") : "");

			if (!value.equals(""))
				parsedInstruction = new ParsedCustom(value);
			else
				errors.add("JSON format error: missing information for custom instruction");
			break;
		}
		case "activity.HxFor" : {
			String init = (values.has("initialization")?values.getString("initialization"):null);
			String condition = (values.has("termination")?values.getString("termination"):null);
			String step = (values.has("increment")?values.getString("increment"):null);
			parsedInstruction = new ParsedFor(init, condition, step, null);

			break;
		}
		case "activity.HxIf" : {
			String condition = (values.has("condition") ? values.getString("condition") : "");;
			if (!condition.equals(""))
				parsedInstruction = new ParsedIf(condition);
			else
				errors.add("JSON format error: missing information for if instruction");
			break;
		}
		case "activity.HxElse" : {
				parsedInstruction = new ParsedElse();
			break;
		}
		case "activity.HxVariable" : {
			String value = (values.has("value")?values.getString("value"):null);
			String instructionType = (values.has("type") ? values.getString("type") : null);
			String operation = (values.has("operation") ? values.getString("operation") : null);
			String name = (values.has("name") ? values.getString("name") : "");
			if (!name.equals(""))
				parsedInstruction = new ParsedStatement(instructionType, name, operation, value);
			else
				errors.add("JSON format error: missing name of value for statement");
			break;
		}
		case "activity.HxReturn" : {
			String value = (values.has("value")?values.getString("value"):null);
			parsedInstruction = new ParsedReturn(value);
			break;
		}
		case "activity.HxWhile" : {
			String condition = (values.has("condition") ? values.getString("condition") : "");;
			if (!condition.equals(""))
				parsedInstruction = new ParsedWhile (condition, null);
			else
				errors.add("JSON format error: missing information for while instruction");
			break;
		}
		default : errors.add("JSON format error: type of instruction is not correct");	
	}
		return parsedInstruction;
	}
}
