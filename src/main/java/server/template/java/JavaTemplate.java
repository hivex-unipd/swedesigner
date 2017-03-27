package server.template.java;

import org.springframework.stereotype.Component;
import org.stringtemplate.v4.*;

import server.template.Template;


public class JavaTemplate implements Template {

	@Override
	public ST getAttributeTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("attributejavatemplate");
		return st;
	}

	@Override
	public ST getAssignmentTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("assignmentjavatemplate");
		return st;
	}

	@Override
	public ST getInitializationTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("initializationjavatemplate");
		return st;
	}

	@Override
	public ST getForTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("forjavatemplate");
		return st;
	}

	@Override
	public ST getIfTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("ifjavatemplate");
		return st;
	}

	@Override
	public ST getReturnTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("returnjavatemplate");
		return st;
	}

	@Override
	public ST getClassTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("classjavatemplate");
		return st;
	}

	@Override
	public ST getMethodTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("methodjavatemplate");
		return st;
	}

	@Override
	public ST getWhileTemplate() {
		STGroup group = new STGroupDir("src/main/resources");
		ST st = group.getInstanceOf("whilejavatemplate");
		return st;
	}
}
