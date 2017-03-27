package server.generator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import server.controller.RequestHandlerController;
import server.generator.java.JavaGenerator;
import server.template.Template;
import server.template.java.JavaTemplate;

@Configuration
public class GeneratorAssembler {
	@Bean("javagenerator")
	public Generator javagenerator(){
		return new JavaGenerator();
	}
	
	/*DA TOGLIERE!!!*/
	@Bean("javatemplate")
	public Template javatemplate(){
		return new JavaTemplate();
	}
	
	@Bean("rhc")
	public RequestHandlerController requesthandlercontroller(){
		return new RequestHandlerController();
	}
}
