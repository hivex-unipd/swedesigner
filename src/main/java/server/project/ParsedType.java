package server.project;

import java.util.ArrayList;
import java.util.List;

import server.stereotype.Stereotype;

public abstract class ParsedType implements ParsedElement{
 		private String name;
  		protected String visibility;
  		private List<ParsedMethod> methods = new ArrayList<ParsedMethod>();
  		private List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>(); //o protected o comunque ho i metodi di get necessari per accederci
  		private List<String> extended = new ArrayList<String>(); 
  
  
  		public ParsedType(String name){
  			this.name = name;
  		}
  
  		public String getName(){ return name;}
  		public String getVisibility(){ return visibility;}
  		public List<ParsedMethod> getMethods(){return methods;};
  		public List<ParsedAttribute> getAttributes(){return attributes;}
  		public List<String> getExtended(){return extended;}
 
  		//da implementare
  		public abstract void addField(ParsedAttribute pa) throws ParsedException;
  		public abstract void addMethod(ParsedMethod pm) throws ParsedException;
  		public abstract void addSupertype(String name, String type) throws ParsedException;
  		public abstract void setVisibility(String visibility) throws ParsedException;
}



/*come si potrebbe fare per risolvere il problema tra Class e Interface
 * creare una interfaccia/classe astratta
 *  
 public abstract class ParsedType{
 	protected String name;
  		protected String visibility;
  		protected List<Parsedmethod> methods = new ArrayList<ParsedMethod>();
  		protected List<ParsedAttribute> attributes = new ArrayList<ParsedAttribute>(); //o protected o comunque ho i metodi di get necessari per accederci
  		protected List<String> extended = new ArrayList<String>(); 
  
  
  		public ParsedType(String name){
  			this.name = name;
  		}
  
  		public String getName(){ return name;}
  		public String getVisibility(){ return visibility;}
  		public List<Parsedmethod> getMethods(){return methods};
  		public List<ParsedAttribute> getAttributes(){return attributes;}
 
  		//da implementare
  		public abstract void addField(ParsedAttribute pa) throws ParsedException;
  		public abstract void addMethod(Parsedmethod pm) throws ParsedException;
  		public abstract void addSupertype(String name, String type) throws ParsedException;
  		public abstract void setVisibility(String visibility);
  }
  
 * e fare si che venga così implementata
 * 
  public class ParsedInterface extends ParsedType{
  		
  		
  		public ParsedInterface(String name){
  			super(name);
  		}
  		
  		public void addField(ParsedAttribute pa) throws ParsedException{
  			String vis = pa.getVisibility();
  			if(pa.getIsStatic()&&pa.getIsFinal&&(vis==null||vis.equals("public")))
  				attributes.add(pa);
  			else
  				throw new ParsedException();
  		}
  		
  		public void addMethod(ParsedMethod pm) throws ParsedException{
  			String vis = pm.getVisibility();
  			List<ParsedInstruction> body = pm.getBody();
 			if((vis==null||vis.equals("public"))&&body==null)
 				methods.add(pm);
  			else
  				throw new ParsedException();
  				
  		}
  
  		public void addSupertype(String name, String type){
  			if(name!=null&&type!=null){
  				if(type=="interface")
  					extended.add(name);
  				else throw new ParsedException();
  			}else
  				throw new ParsedException();
  		}
  
  		public void setVisibility(String visibility) throws ParsedException{
  			if(visibility!=null){
  				if(visibility.equals("public")||visibility.equals("package"))
  					this.visibility = visibility;
  				else
  					throw new ParsedException();
  			}else throw new ParsedException();
  		}
  }
  
  public class ParsedClass extends ParsedType{
  		private List<String> implemented = new ArrayList<String>();
  		private boolean isAbstract = false;
  		
  		ParsedClass(String name, boolean isAbstract){
  			super(name);
  			this.isAbstract = isAbstract;
  		}
  
  		public boolean getIsAbstract(){ return isAbstract;}
  		
  		public void addField(ParsedAttribute pa) throws ParsedException{
  			attributes.add(pa);
  		}
  		public void addMethod(Parsedmethod pm) throws ParsedException{
  			methods.add(pm);
  		}
  		public abstract void addSupertype(String name, String type) throws ParsedException{
  			if(name!=null&&type!=null){
  				if(type="class")
  					extended.add(name);
  				elseif(type=="interface")
  					implemented.add(name);
  				else throw new ParsedException();
  			}else throw new ParsedException();
  		}
  		public abstract void setVisibility(String visibility){
  			this.visibility = visibility;
  		}
  		
  }
  
  */
