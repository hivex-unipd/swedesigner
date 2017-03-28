package server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import server.generator.Generator;
import server.project.ParsedProgram;

public class RequestHandlerController {
	@Autowired
	@Qualifier("javagenerator")
	Generator generator;
	
	public void HandleGeneratorRequest(){}
	public void HandleStereotypesRequest(){};
	public void prova(ParsedProgram p){
		generator.generate("Prova", p);
	}
	
}
