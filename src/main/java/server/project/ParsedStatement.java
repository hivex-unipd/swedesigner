package server.project;

import org.stringtemplate.v4.ST;

import server.template.Template;

public class ParsedStatement extends ParsedInstruction{
    private String type;
    private String name;
    private String operation;
    private String value;
    private boolean isFinal = false;
    
    public ParsedStatement(String type,String name, String operation, String value){ 
    	this.type = type;
    	this.name = name;
    	this.operation = operation;
    	this.value = value;
    	   	
    	if(name.equals(name.toUpperCase()))
    			isFinal = true;
    }
    
    public String getType(){return type;}
    public String getName(){return name;}
    public String getOperation(){return operation;}
    public String getValue(){return value;}
    public boolean getIsFinal(){return isFinal;}
    
	public String renderTemplate(Template t) {
		ST template = t.getStatementTemplate();
		template.add("att", this);
		return template.render();
	}

}
