package server.project;

import java.util.ArrayList;
import java.util.List;

import server.stereotype.Stereotype;

public abstract class ParsedType implements ParsedElement{
 		private String name;
  		private List<ParsedMethod> methods = new ArrayList<ParsedMethod>();
  		private List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>(); //o protected o comunque ho i metodi di get necessari per accederci
  		private List<String> extended = new ArrayList<String>(); 
  
  
  		public ParsedType(String name){
  			this.name = name;
  		}
  
  		public String getName(){ return name;}
  		public List<ParsedMethod> getMethods(){return methods;};
  		public List<ParsedAttribute> getAttributes(){return attributes;}
  		public List<String> getExtended(){return extended;}
 
  		//da implementare
  		public abstract void addField(ParsedAttribute parsedAttribute) throws ParsedException;
  		public abstract void addMethod(ParsedMethod parsedMethod) throws ParsedException;
  		public abstract void addSupertype(String name, String type) throws ParsedException;
}
