package test;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import org.stringtemplate.v4.ST;
import java.util.List;
import java.util.ArrayList;

import server.compiler.Compiler;
import server.generator.Generator;
import server.template.Template;
import server.project.*;

// Stub configuration:
@Configuration
public class TestConfigurator {

	// Stub for JavaGenerator:
	@Bean("mockjavagenerator")
	public Generator mockjavagenerator() {
		return new Generator() {
			public void generate(String path, ParsedProgram program) throws IOException {
				return;
			}
		};
	}

	// Stub for JavaGenerator:
	// TODO

	// Stub for ParsedProgram:
	// TODO

	// Stub for Compressor:
	// TODO

	// Stub for JavaTemplate:
	@Bean("mockjavatemplate")
	public Template mockjavatemplate() {
		return new Template() {

			public ST getAttributeTemplate() {
				return new ST("attributejavatemplate(att) ::= \"<if(att.visibility)><att.visibility> <endif><if(att.isStatic)>static <endif><if(att.isFinal)>final <endif><if(att.type)><att.type> <endif><att.name><if(att.value)> <att.operation> <att.value><endif>\"");
			}

			public ST getForTemplate() {
				return new ST("forjavatemplate(for, body)::=<<for (<for.init>; <for.condition>; <for.step>) {\t<body>\n}>>");
			}

			public ST getIfTemplate() {
				return new ST("ifjavatemplate(if1, body)::=<<\nif (<if1.condition>) {\n	<body>\n}\n>>");
			}

			public ST getReturnTemplate() {
				return new ST("returnjavatemplate(return)::=\"return<if(return.value)> <return.value><endif>;\"");
			}

			public ST getClassTemplate() {
				return new ST("classjavatemplate(class, methods)::=<<\npublic <if(class.isAbstract)>abstract <endif>class <class.name><if(class.extended)> extends <class.extended:{e|<e>}; separator=\", \"><endif><if(class.implemented)> implements <class.implemented:{im|<im>}; separator=\", \"><endif>{\n\t<class.attributes:attributejavatemplate():end()>\n\t<methods>\n}\n>>");
			}

			public ST getMethodTemplate() {
				return new ST("methodjavatemplate(method, body)::= <<\n<if(method.isAbstract)>abstract <endif><method.visibility:initVis()><if(method.isStatic)>static <endif><method.returnType> <method.name>(<method.args:attributejavatemplate(); separator=\", \">)<if(method.body)> {\n\t<body>\n}<else>;<endif>\n>>");
			}

			public ST getWhileTemplate() {
				return new ST("whilejavatemplate(while, body)::=<<\nwhile (<while.condition>) {\n\t<body>\n}\n>>");
			}

			public ST getInterfaceTemplate() {
				return new ST("interfacejavatemplate(interface, methods)::=<<\npublic interface <interface.name><if(interface.extended)> extends <interface.extended:{e|<e>}; separator=\", \"><endif> {\n\t<interface.attributes:attributejavatemplate():end()>\n\t<methods>\n}\n>>");
			}

			public ST getElseTemplate() {
				return new ST("elsejavatemplate(body)::=<<\nelse {\n\t<body>\n}\n>>");
			}

			public ST getStatementTemplate() {
				return new ST("statementjavatemplate(att) ::= \"<if(att.isFinal)>final <endif><if(att.type)><att.type> <endif><att.name><if(att.value)><att.operation><att.value><else><if(att.operation)><att.operation><endif><endif>;\"");
			}
		};
	}

	// Stub for JavaCompiler:
	@Bean("mockjavacompiler")
	public Compiler mockjavacompiler() {
		return new Compiler() {
			public List<String> compile(String path) throws IOException {
				return new ArrayList<String>();
			};
		};
	}
}
