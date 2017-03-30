package server.project;

import server.stereotype.Stereotype;

public abstract class ParsedType implements ParsedElement{
private Stereotype typeStereotype;
abstract public void addExtended(String s);
abstract public void addImplemented(String s);
abstract public void addAttribute(ParsedAttribute pa);
abstract public String getName();

}
