package server.template.java;

import org.springframework.stereotype.Component;
import org.stringtemplate.v4.*;

import server.template.Template;


public class JavaTemplate implements Template {

	private STGroup group = new STGroupDir("src/main/resources/templates");

	@Override
	public ST getAttributeTemplate() {
		ST st = group.getInstanceOf("attributejavatemplate");
		return st;
	}

	@Override
	public ST getAssignmentTemplate() {
		ST st = group.getInstanceOf("assignmentjavatemplate");
		return st;
	}

	@Override
	public ST getInitializationTemplate() {
		ST st = group.getInstanceOf("initjavatemplate");
		return st;
	}

	@Override
	public ST getForTemplate() {
		ST st = group.getInstanceOf("forjavatemplate");
		return st;
	}

	@Override
	public ST getIfTemplate() {
		ST st = group.getInstanceOf("ifjavatemplate");
		return st;
	}

	@Override
	public ST getReturnTemplate() {
		ST st = group.getInstanceOf("returnjavatemplate");
		return st;
	}

	@Override
	public ST getClassTemplate() {
		ST st = group.getInstanceOf("classjavatemplate");
		return st;
	}

	@Override
	public ST getMethodTemplate() {
		ST st = group.getInstanceOf("methodjavatemplate");
		return st;
	}

	@Override
	public ST getWhileTemplate() {
		ST st = group.getInstanceOf("whilejavatemplate");
		return st;
	}
}
