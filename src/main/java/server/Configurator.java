package server;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

import server.controller.RequestHandlerController;
import server.compiler.Compiler;
import server.compiler.java.JavaCompiler;
import server.generator.Generator;
import server.generator.java.JavaGenerator;
import server.template.Template;
import server.template.java.JavaTemplate;

@Configuration
public class Configurator {
	
	@Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
	
	@Bean("javagenerator")
	public Generator javagenerator() {
		return new JavaGenerator();
	}
	
	@Bean("javatemplate")
	public Template javatemplate() {
		return new JavaTemplate();
	}

	@Bean("javacompiler")
	public Compiler javacompiler() {
		return new JavaCompiler();
	}
}
